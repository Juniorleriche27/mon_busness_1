from datetime import datetime, timezone
import os
import smtplib
from email.message import EmailMessage

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import cohere

app = FastAPI(title="Portfolio API", version="0.8.0")

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

COMMON_REQUIRED = ["full_name", "phone", "country", "city", "deadline", "consent"]

REQUIRED_FIELDS = {
    "portfolio": COMMON_REQUIRED
    + [
        "objectif",
        "metier_vise",
        "liens",
        "projets",
        "about",
        "contacts",
        "style",
    ],
    "vitrine": COMMON_REQUIRED
    + [
        "company_name",
        "sector",
        "offre_principale",
        "objectif",
        "pages_souhaitees",
        "hebergement",
    ],
    "cv": COMMON_REQUIRED
    + [
        "poste_vise",
        "niveau",
        "pays_secteur",
        "cv_actuel",
        "langue",
    ],
    "lettre": COMMON_REQUIRED
    + [
        "type",
        "poste_formation",
        "organisation",
        "cv_actuel",
        "points_cles",
        "langue",
    ],
    "linkedin": COMMON_REQUIRED
    + [
        "profil_linkedin",
        "metier_positionnement",
        "cibles",
        "competences",
        "experiences",
        "langue",
    ],
    "audit": COMMON_REQUIRED
    + [
        "type_audit",
        "fichiers",
        "poste_cible",
        "attentes",
    ],
    "landing-page": COMMON_REQUIRED
    + [
        "nom_activite",
        "offre_principale",
        "public_cible",
        "cta_principal",
    ],
    "google-business": COMMON_REQUIRED
    + [
        "nom_etablissement",
        "adresse_zone",
        "telephone",
        "categorie",
        "horaires",
        "description_courte",
        "acces_fiche",
    ],
    "dashboard": COMMON_REQUIRED
    + [
        "type_organisation",
        "objectif_dashboard",
        "source_donnees",
        "lien_fichier",
        "indicateurs",
        "frequence",
    ],
    "formulaire-base": COMMON_REQUIRED
    + [
        "type_base",
        "champs_indispensables",
        "volume",
        "canal_collecte",
        "anti_doublons",
        "export_excel",
        "multi_users",
    ],
}

FIELD_LABELS = {
    "full_name": "Nom et prenom",
    "email": "Email",
    "phone": "WhatsApp/Telephone",
    "country": "Pays",
    "city": "Ville",
    "deadline": "Delai souhaite",
    "budget_range": "Budget (plage)",
    "message": "Message complementaire",
    "objectif": "Objectif",
    "metier_vise": "Metier vise",
    "liens": "Liens a integrer",
    "projets": "Projets",
    "about": "Section a propos",
    "contacts": "Contacts a afficher",
    "style": "Style souhaite",
    "photo": "Photo",
    "company_name": "Nom entreprise",
    "sector": "Activite / secteur",
    "offre_principale": "Offre principale",
    "pages_souhaitees": "Pages souhaitees",
    "preuves": "Preuves",
    "logo_couleurs": "Logo + couleurs",
    "domaine": "Domaine",
    "hebergement": "Hebergement",
    "poste_vise": "Poste vise",
    "niveau": "Niveau",
    "pays_secteur": "Pays/secteur cible",
    "cv_actuel": "CV actuel",
    "points_corriger": "Points a corriger",
    "langue": "Langue",
    "type": "Type",
    "poste_formation": "Poste/formation cible",
    "organisation": "Organisation/ecole",
    "points_cles": "Points cles",
    "profil_linkedin": "Lien LinkedIn",
    "metier_positionnement": "Metier / positionnement",
    "cibles": "Cibles",
    "competences": "Competences",
    "experiences": "Experiences cles",
    "post_linkedin": "Post LinkedIn",
    "type_audit": "Type audit",
    "fichiers": "Fichiers",
    "poste_cible": "Poste/formation cible",
    "attentes": "Attentes",
    "nom_activite": "Nom activite",
    "public_cible": "Public cible",
    "cta_principal": "CTA principal",
    "nom_etablissement": "Nom de l etablissement",
    "adresse_zone": "Adresse / zone",
    "telephone": "Telephone",
    "categorie": "Categorie principale",
    "horaires": "Horaires",
    "description_courte": "Description courte",
    "lien_site": "Lien site",
    "photos": "Photos disponibles",
    "acces_fiche": "Acces a la fiche",
    "type_organisation": "Type organisation",
    "objectif_dashboard": "Objectif du dashboard",
    "source_donnees": "Source des donnees",
    "fichier": "Fichier",
    "lien_fichier": "Lien fichier",
    "indicateurs": "Indicateurs souhaites",
    "frequence": "Frequence mise a jour",
    "type_base": "Type de base",
    "champs_indispensables": "Champs indispensables",
    "volume": "Volume estime",
    "canal_collecte": "Canal de collecte",
    "anti_doublons": "Anti-doublons",
    "export_excel": "Export Excel",
    "multi_users": "Acces multi-utilisateurs",
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
        f"  ou {PRICES['host_year']} CFA/an (~${_usd(PRICES['host_year'])})\n"
        "- Autres services (LinkedIn, Audit, Landing page, Google Business, Dashboard, Formulaire+Base): sur devis."
    )


def _how_it_works():
    return (
        "Comment ca marche :\n"
        "1) Choisissez le service adapte (Candidature, Web, Data).\n"
        "2) Remplissez le formulaire (meme partiel).\n"
        "3) Nous analysons et vous contactons pour completer.\n"
        "4) Livraison apres validation."
    )


def _safe_reply(message: str) -> str:
    msg = message.lower().strip()
    if not msg:
        return (
            "Bonjour. Je peux vous aider sur nos services Candidature, Web et Data "
            "(Portfolio, Vitrine, CV, Lettre, LinkedIn, Audit, Landing page, Google Business, Dashboard, Base)."
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
            "Bonjour. Dites-moi votre besoin principal: Portfolio, Vitrine, CV, Lettre, LinkedIn, Audit, Landing page, Google Business, Dashboard, Base."
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

    if "linkedin" in msg:
        return (
            "Optimisation LinkedIn: profil, resume, experiences et positionnement. "
            "Remplissez le formulaire LinkedIn avec votre lien et vos objectifs."
        ) + _assistant_footer()

    if "audit" in msg:
        return (
            "Audit CV / Lettre: analyse complete + corrections. "
            "Envoyez vos fichiers via le formulaire Audit."
        ) + _assistant_footer()

    if "landing" in msg:
        return (
            "Landing page 1 page: offre, preuves, CTA. "
            "Remplissez le formulaire Landing page avec votre offre principale."
        ) + _assistant_footer()

    if any(k in msg for k in ["google business", "google maps", "fiche google"]):
        return (
            "Google Business Profile: creation/optimisation de votre fiche Google Maps. "
            "Remplissez le formulaire Google Business pour la categorie, horaires et description."
        ) + _assistant_footer()

    if "dashboard" in msg:
        return (
            "Dashboard simple ONG/PME: indicateurs, suivi et reporting. "
            "Remplissez le formulaire Dashboard avec vos sources de donnees."
        ) + _assistant_footer()

    if "formulaire" in msg or "base" in msg:
        return (
            "Formulaire + Base structuree: collecte fiable + base propre. "
            "Remplissez le formulaire Base avec vos champs et besoins d export."
        ) + _assistant_footer()

    if any(k in msg for k in ["pack", "plusieurs", "combo"]):
        return (
            "Oui, vous pouvez combiner plusieurs services dans une seule demande. "
            "Choisissez le service principal puis cochez les services complementaires."
        ) + _assistant_footer()

    return (
        "Je peux repondre sur nos services (Portfolio, Vitrine, CV, Lettre, LinkedIn, Audit, Landing page, "
        "Google Business, Dashboard, Formulaire+Base). Dites par exemple: 'prix', 'comment ca marche', "
        "'je veux un CV' ou 'je veux un dashboard'."
    ) + _assistant_footer()


def _is_empty(value) -> bool:
    if value is None:
        return True
    if isinstance(value, str) and not value.strip():
        return True
    if isinstance(value, list) and len(value) == 0:
        return True
    if isinstance(value, dict) and len(value) == 0:
        return True
    return False


def _missing_questions(service_type: str, data: dict):
    required = REQUIRED_FIELDS.get(service_type, [])
    missing = []
    for key in required:
        value = data.get(key)
        if _is_empty(value):
            missing.append(key)
    questions = [f"Merci de preciser: {FIELD_LABELS.get(k, k)}" for k in missing]
    return missing, questions


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/leads")
def create_lead(payload: dict):
    try:
        collection = _get_collection(os.environ.get("MONGO_COLLECTION", "service_requests"))
        legacy_mode = payload.get("mode")
        data = payload.get("data", payload)

        legacy_map = {"A": "portfolio", "B": "vitrine", "CV": "cv", "LM": "lettre"}
        service_type = payload.get("service_type")
        if not service_type and isinstance(legacy_mode, str):
            service_type = legacy_map.get(legacy_mode.upper())
        if not service_type:
            service_type = legacy_mode or "unknown"

        missing, questions = _missing_questions(service_type, data)

        doc = {
            "service_type": service_type,
            "name": data.get("full_name"),
            "phone": data.get("phone") or data.get("telephone"),
            "email": data.get("email"),
            "country": data.get("country"),
            "city": data.get("city"),
            "deadline": data.get("deadline"),
            "payload": data,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "new",
            "missing_fields": missing,
            "missing_questions": questions,
        }
        res = collection.insert_one(doc)
        ref = str(res.inserted_id)

        subject = f"Nouveau lead {service_type} - {ref}"
        base_body = f"Reference: {ref}\nService: {service_type}\n\n{data}"
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
                "portfolio candidat, vitrine entreprise, CV, lettre de motivation, optimisation LinkedIn, "
                "audit CV/lettre, landing page, Google Business Profile, dashboard simple, formulaire + base. "
                "Reponds en francais, court, clair, utile et concret. "
                "Si l utilisateur demande comment ca marche, donne 3-4 etapes. "
                "Si l utilisateur demande les prix, donne les prix CFA + USD et l hebergement. "
                "Si la demande est vague, pose UNE question de qualification. "
                "N invente jamais de service hors la liste ci-dessus. "
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

        if any(
            k in msg_lower
            for k in [
                "portfolio",
                "vitrine",
                "cv",
                "lettre",
                "motivation",
                "linkedin",
                "audit",
                "landing",
                "google business",
                "google maps",
                "dashboard",
                "formulaire",
                "base",
            ]
        ) and not any(
            k in reply_lower
            for k in [
                "portfolio",
                "vitrine",
                "cv",
                "lettre",
                "motivation",
                "linkedin",
                "audit",
                "landing",
                "google business",
                "dashboard",
                "formulaire",
                "base",
            ]
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
