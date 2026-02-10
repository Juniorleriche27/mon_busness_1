from datetime import datetime, timezone
import os
import smtplib
from email.message import EmailMessage

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import cohere

app = FastAPI(title="Portfolio API", version="0.7.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RATE = 600
PRICES = {
    "portfolio": 29900,
    "vitrine_min": 59900,
    "cv": 9900,
    "lm": 4900,
    "host_month": 2000,
    "host_year": 24000,
}

DEFAULT_NOTIFY_EMAIL = "senirolamadokou@gmail.com"

REQUIRED_FIELDS = {
    "A": [
        "full_name",
        "email",
        "phone",
        "country",
        "city",
        "target_role",
        "experience_level",
        "projects",
        "skills",
        "bio",
        "achievements",
        "tools",
        "education",
        "assets_links",
        "hosting_option",
        "deadline",
        "consent",
    ],
    "B": [
        "company_name",
        "sector",
        "country",
        "city",
        "email",
        "phone",
        "services",
        "target_clients",
        "goals",
        "value_prop",
        "pages",
        "budget",
        "deadline",
        "branding",
        "assets_links",
        "hosting_option",
        "consent",
    ],
    "CV": [
        "full_name",
        "email",
        "phone",
        "target_role",
        "country",
        "experience",
        "education",
        "skills",
        "achievements",
        "assets_links",
        "deadline",
        "consent",
    ],
    "LM": [
        "full_name",
        "email",
        "phone",
        "target_role",
        "company_name",
        "job_link",
        "motivation",
        "experience",
        "achievements",
        "deadline",
        "consent",
    ],
}

FIELD_LABELS = {
    "full_name": "Nom complet",
    "email": "Email",
    "phone": "WhatsApp/Telephone",
    "country": "Pays",
    "city": "Ville",
    "target_role": "Poste vise",
    "experience_level": "Niveau d'experience",
    "projects": "Projets (liens + details)",
    "skills": "Competences",
    "bio": "Mini bio",
    "achievements": "Realisations",
    "tools": "Outils",
    "education": "Formation",
    "assets_links": "Liens documents (CV/Drive)",
    "hosting_option": "Hebergement",
    "deadline": "Delai souhaite",
    "company_name": "Nom entreprise",
    "sector": "Activite / secteur",
    "services": "Services / produits",
    "target_clients": "Clients cibles",
    "goals": "Objectif du site",
    "value_prop": "Proposition de valeur",
    "pages": "Pages souhaitees",
    "budget": "Budget estime",
    "branding": "Logo/charte (lien)",
    "experience": "Experience pertinente",
    "job_link": "Lien offre / description",
    "motivation": "Motivation",
    "consent": "Consentement",
}


def _env(*names: str, default: str | None = None) -> str | None:
    for name in names:
        value = os.environ.get(name)
        if value is not None and str(value).strip():
            return str(value).strip()
    return default


def _usd(value: int) -> str:
    return f"{value / RATE:.2f}"


def _get_collection(name: str):
    mongo_uri = _env("MONGO_URI", "uri")
    mongo_db = _env("MONGO_DB", "db", default="portfolio")

    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set")

    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=8000)
    return client[mongo_db][name]


def _send_email(subject: str, body: str) -> str:
    host = _env("SMTP_HOST", "host")
    port = int(_env("SMTP_PORT", "port", default="587"))
    username = _env("SMTP_USERNAME", "SMTP_USER", "username")
    password = _env("SMTP_PASSWORD", "password")
    from_email = _env("SMTP_FROM", "from_email", default=username or DEFAULT_NOTIFY_EMAIL)
    to_email = _env(
        "SMTP_TO",
        "to_email",
        default=DEFAULT_NOTIFY_EMAIL,
    )

    if not (host and username and password and to_email):
        return "skipped"

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(username, password)
            recipients = [item.strip() for item in str(to_email).split(",") if item.strip()]
            if not recipients:
                recipients = [DEFAULT_NOTIFY_EMAIL]
            msg["To"] = ", ".join(recipients)
            server.send_message(msg)
        return "sent"
    except Exception as exc:
        return f"failed: {exc}"


def _assistant_footer():
    return "\n\nWhatsApp: +22892092572"


def _price_text():
    return (
        f"- Portfolio candidat: {PRICES['portfolio']} CFA (~${_usd(PRICES['portfolio'])})\n"
        f"- Vitrine entreprise: a partir de {PRICES['vitrine_min']} CFA (~${_usd(PRICES['vitrine_min'])})\n"
        f"- CV: {PRICES['cv']} CFA (~${_usd(PRICES['cv'])})\n"
        f"- Lettre de motivation: {PRICES['lm']} CFA (~${_usd(PRICES['lm'])})\n"
        f"- Hebergement (portfolio/vitrine): {PRICES['host_month']} CFA/mois (~${_usd(PRICES['host_month'])})\n"
        f"  ou {PRICES['host_year']} CFA/an (~${_usd(PRICES['host_year'])})"
    )


def _how_it_works():
    return (
        "Comment ca marche :\n"
        "1) Choisissez le service (Portfolio, Vitrine, CV, Lettre).\n"
        "2) Remplissez le formulaire (meme partiel).\n"
        "3) Nous analysons et vous contactons pour completer.\n"
        "4) Livraison apres validation."
    )


def _safe_reply(message: str) -> str:
    msg = message.lower().strip()
    if not msg:
        return (
            "Bonjour. Je peux vous aider sur 4 services: Portfolio candidat, "
            "Vitrine entreprise, CV professionnel et Lettre de motivation."
        ) + _assistant_footer()

    if any(k in msg for k in ["prix", "tarif", "cout", "co?t"]):
        return (
            "Voici nos tarifs officiels:\n"
            + _price_text()
            + "\n\nSouhaitez-vous commander un seul service ou un pack combine ?"
            + _assistant_footer()
        )

    if "comment" in msg or "marche" in msg or "process" in msg:
        return (
            _how_it_works()
            + "\n\nSi vous voulez, je peux vous orienter vers le formulaire exact selon votre besoin."
            + _assistant_footer()
        )

    if any(k in msg for k in ["bonjour", "salut", "bonsoir", "hello"]):
        return (
            "Bonjour. Dites-moi votre besoin principal: Portfolio, Vitrine, CV ou Lettre de motivation."
        ) + _assistant_footer()

    if any(k in msg for k in ["whatsapp", "what's app", "contact", "numero"]):
        return "WhatsApp: +22892092572" + _assistant_footer()

    if "portfolio" in msg:
        return (
            f"Portfolio candidat: {PRICES['portfolio']} CFA (~${_usd(PRICES['portfolio'])}). "
            f"Hebergement en option. Remplissez le formulaire Portfolio (A) avec vos projets et objectifs."
        ) + _assistant_footer()

    if any(k in msg for k in ["vitrine", "entreprise", "site"]):
        return (
            f"Vitrine entreprise: a partir de {PRICES['vitrine_min']} CFA (~${_usd(PRICES['vitrine_min'])}). "
            "Hebergement en option. Remplissez le formulaire Vitrine (B) avec offres, preuves et CTA."
        ) + _assistant_footer()

    if any(k in msg for k in ["cv", "curriculum"]):
        return (
            f"CV professionnel: {PRICES['cv']} CFA (~${_usd(PRICES['cv'])}). "
            "Pas d hebergement. Remplissez le formulaire CV avec experiences et competences."
        ) + _assistant_footer()

    if any(k in msg for k in ["lettre", "motivation"]):
        return (
            f"Lettre de motivation: {PRICES['lm']} CFA (~${_usd(PRICES['lm'])}). "
            "Pas d hebergement. Remplissez le formulaire Lettre avec contexte et objectifs."
        ) + _assistant_footer()

    if any(k in msg for k in ["pack", "plusieurs", "combo"]):
        return (
            "Oui, vous pouvez combiner plusieurs services dans une seule demande. "
            "Choisissez le service principal puis cochez les services complementaires."
        ) + _assistant_footer()

    return (
        "Je peux repondre uniquement sur nos services (portfolio, vitrine, CV, lettre) "
        "et les formules de politesse. Dites par exemple: 'prix', 'comment ca marche', 'je veux un CV'."
    ) + _assistant_footer()


def _missing_questions(mode: str, data: dict):
    required = REQUIRED_FIELDS.get(mode, [])
    missing = []
    for key in required:
        value = data.get(key)
        if value is None:
            missing.append(key)
        elif isinstance(value, str) and not value.strip():
            missing.append(key)
    questions = [f"Merci de preciser: {FIELD_LABELS.get(k, k)}" for k in missing]
    return missing, questions


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/leads")
def create_lead(payload: dict):
    try:
        collection = _get_collection(os.environ.get("MONGO_COLLECTION", "leads"))
        mode = payload.get("mode")
        data = payload.get("data", payload)

        missing, questions = _missing_questions(mode, data)

        doc = {
            "mode": mode,
            "data": data,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "new",
            "missing_fields": missing,
            "missing_questions": questions,
        }
        res = collection.insert_one(doc)
        ref = str(res.inserted_id)

        subject = f"Nouveau lead {mode} - {ref}"
        base_body = f"Reference: {ref}\nMode: {mode}\n\n{data}"
        if questions:
            body = base_body + f"\n\nQuestions utiles: {questions}"
        else:
            body = base_body
        email_status = _send_email(subject, body)
        collection.update_one({"_id": res.inserted_id}, {"$set": {"email_status": email_status}})

        return {"status": "ok", "id": ref, "missing_questions": questions, "email_status": email_status}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"insert_failed: {exc}")


@app.post("/chat")
def chat(payload: dict):
    api_key = _env("COHERE_API_KEY", "api_key")
    model = _env("COHERE_MODEL", "model", default="command-a-03-2025")

    session_id = payload.get("session_id") or "session_unknown"
    user_msg = (payload.get("message") or "").strip()

    if not user_msg:
        reply = _safe_reply("")
    else:
        reply = ""
        if api_key:
            system = (
                "Tu es un assistant commercial. Tu aides uniquement sur nos services: "
                "portfolio candidat, vitrine entreprise, CV, lettre de motivation. "
                "Reponds en francais, court, clair, utile et concret. "
                "Si l utilisateur demande comment ca marche, donne 3-4 etapes. "
                "Si l utilisateur demande les prix, donne les prix CFA + USD et l hebergement. "
                "Si la demande est vague, pose UNE question de qualification. "
                "N invente jamais de service hors Portfolio, Vitrine, CV, Lettre de motivation. "
                "Ajoute toujours a la fin: WhatsApp: +22892092572."
            )
            try:
                co = cohere.ClientV2(api_key)
                resp = co.chat(
                    model=model,
                    messages=[
                        {"role": "system", "content": system},
                        {"role": "user", "content": user_msg},
                    ],
                )
                reply = resp.message.content[0].text or ""
            except Exception:
                reply = ""

        if not reply:
            reply = _safe_reply(user_msg)

        reply_lower = reply.lower()
        msg_lower = user_msg.lower()

        if any(k in msg_lower for k in ["portfolio", "vitrine", "cv", "lettre", "motivation"]) and not any(
            k in reply_lower for k in ["portfolio", "vitrine", "cv", "lettre", "motivation"]
        ):
            reply = _safe_reply(user_msg)

        if ("comment" in user_msg.lower() or "marche" in user_msg.lower()) and "1)" not in reply:
            reply = _how_it_works() + _assistant_footer()

        if any(k in user_msg.lower() for k in ["prix", "tarif", "cout", "co?t"]) and "CFA" not in reply:
            reply = "Voici nos tarifs :\n" + _price_text() + _assistant_footer()

        if "WhatsApp" not in reply:
            reply = reply + _assistant_footer()

    try:
        chat_collection_name = _env("MONGO_CHAT_COLLECTION", "chat_collection", default="chat_logs")
        chats = _get_collection(chat_collection_name)
        chats.update_one(
            {"session_id": session_id},
            {
                "$setOnInsert": {"created_at": datetime.now(timezone.utc).isoformat()},
                "$push": {
                    "messages": {
                        "at": datetime.now(timezone.utc).isoformat(),
                        "user": user_msg,
                        "assistant": reply,
                    }
                },
            },
            upsert=True,
        )
    except Exception:
        pass

    _send_email(
        f"Chat assistant - {session_id}",
        f"User: {user_msg}\n\nAssistant: {reply}",
    )

    return {"reply": reply}
