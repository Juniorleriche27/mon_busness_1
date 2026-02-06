from datetime import datetime, timezone
import os
import smtplib
from email.message import EmailMessage

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import cohere

app = FastAPI(title="Portfolio API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_collection():
    mongo_uri = os.environ.get("MONGO_URI")
    mongo_db = os.environ.get("MONGO_DB", "portfolio")
    mongo_collection = os.environ.get("MONGO_COLLECTION", "leads")

    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set")

    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=8000)
    return client[mongo_db][mongo_collection]


def _send_email(subject: str, body: str) -> str:
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    username = os.environ.get("SMTP_USERNAME")
    password = os.environ.get("SMTP_PASSWORD")
    from_email = os.environ.get("SMTP_FROM", username)
    to_email = os.environ.get("SMTP_TO")

    if not (host and username and password and to_email):
        return "skipped"

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(username, password)
        server.send_message(msg)

    return "sent"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/leads")
def create_lead(payload: dict):
    try:
        collection = _get_collection()
        doc = {
            "mode": payload.get("mode"),
            "data": payload.get("data", payload),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "new",
        }
        res = collection.insert_one(doc)
        ref = str(res.inserted_id)

        subject = f"Nouveau lead {payload.get('mode', '')} - {ref}"
        body = f"Reference: {ref}
Mode: {payload.get('mode')}

{doc['data']}"
        email_status = _send_email(subject, body)
        collection.update_one({"_id": res.inserted_id}, {"$set": {"email_status": email_status}})

        return {"status": "ok", "id": ref}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"insert_failed: {exc}")


@app.post("/chat")
def chat(payload: dict):
    api_key = os.environ.get("COHERE_API_KEY")
    model = os.environ.get("COHERE_MODEL", "command-a-03-2025")
    if not api_key:
        raise HTTPException(status_code=501, detail="cohere_not_configured")

    user_msg = (payload.get("message") or "").strip()
    if not user_msg:
        return {"reply": "Bonjour ! Comment puis-je vous aider ?"}

    system = (
        "Tu es un assistant commercial. Tu reponds uniquement aux questions sur nos services "
        "(portfolio candidat, vitrine entreprise, CV, lettre de motivation) et les formules de politesse. "
        "Si la question est hors sujet, reponds poliment que tu ne peux aider que sur nos services."
    )

    co = cohere.ClientV2(api_key)
    resp = co.chat(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_msg},
        ],
    )

    return {"reply": resp.message.content[0].text}
