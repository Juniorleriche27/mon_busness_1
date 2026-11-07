import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.config import settings

router = APIRouter(tags=["Portfolio & Leads"])


def _get_collection(name: str):
    if not settings.MONGO_URI:
        return None
    try:
        from pymongo import MongoClient
        client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=4000)
        return client[settings.MONGO_DB][name]
    except Exception:
        return None


@router.post("/leads")
def create_lead(payload: dict):
    collection = _get_collection("service_requests")
    ref = f"lead_{int(datetime.now(timezone.utc).timestamp())}"
    if collection is not None:
        try:
            doc = {
                "payload": payload,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "status": "new"
            }
            res = collection.insert_one(doc)
            ref = str(res.inserted_id)
        except Exception as e:
            print(f"[Mongo Warning] {e}")

    return {"status": "ok", "id": ref}


@router.post("/chat")
def chat(payload: dict):
    user_msg = (payload.get("message") or "").strip()
    reply = "Bonjour. Je suis votre assistant Scrivia. Comment puis-je vous aider aujourd'hui ?"
    if settings.COHERE_API_KEY and user_msg:
        try:
            import cohere
            co = cohere.ClientV2(settings.COHERE_API_KEY)
            resp = co.chat(
                model="command-a-03-2025",
                messages=[{"role": "user", "content": user_msg}]
            )
            for item in resp.message.content:
                if getattr(item, "type", None) == "text":
                    reply = item.text
                    break
        except Exception as e:
            print(f"[Cohere Warning] {e}")

    return {"reply": reply}
