import os
import base64
import json
import re
import time
from datetime import datetime, timezone

import streamlit as st
import cohere
import gridfs
from bson import ObjectId
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import smtplib
import html
from email.message import EmailMessage


# -------------------------
# Config page (site-like)
# -------------------------
st.set_page_config(
    page_title="Portfolio — Demande de devis",
    page_icon="🧩",
    layout="wide",
)

CSS = """
<style>
/* Global */
.block-container {
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  max-width: 1280px;
  width: 100%;
}
body {
  background: #f5fbfb;
}
.stApp {
  background:
    radial-gradient(1200px 500px at 20% 0%, rgba(93, 230, 220, 0.25), transparent 60%),
    radial-gradient(900px 500px at 80% 10%, rgba(170, 240, 255, 0.35), transparent 60%),
    linear-gradient(180deg, #e9fbfb 0%, #f7fbff 40%, #ffffff 100%);
}
h1, h2, h3 { letter-spacing: -0.02em; }
.small-muted { color: #6b7280; font-size: 0.95rem; }

/* Hero */
.hero {
  padding: 22px 24px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(500px 200px at 10% 0%, rgba(93, 230, 220, 0.20), transparent 60%);
  pointer-events: none;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  align-items: center;
}
.hero-media img {
  width: 100%;
  border-radius: 14px;
  display: block;
}
.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0f766e;
  background: rgba(93, 230, 220, 0.18);
  border: 1px solid rgba(93, 230, 220, 0.35);
  padding: 6px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
}
.hero-title { font-size: 2.1rem; font-weight: 800; margin-bottom: 6px; }
.hero-sub { font-size: 1.05rem; color: #374151; margin-bottom: 14px; }
.badges span{
  display:inline-block; padding:6px 10px; margin:0 8px 8px 0;
  border:1px solid rgba(0,0,0,0.10); border-radius:999px; font-size:0.92rem;
  background:white;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.hero-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid rgba(0,0,0,0.12);
}
.hero-actions a.primary {
  background: #0f172a;
  color: #ffffff;
}
.hero-actions a.ghost {
  background: #ffffff;
  color: #0f172a;
}

/* Sections */
.section {
  padding: 18px 20px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.03);
}
.cta-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}
.cta-buttons a {
  display: block;
  text-align: center;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.12);
  text-decoration: none;
  color: #111827;
  background: #f9fafb;
}

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; }
  .cta-buttons { grid-template-columns: 1fr; }
}

/* Photo placeholder */
.photo-placeholder {
  padding: 16px;
  border: 1px dashed rgba(0,0,0,0.20);
  border-radius: 14px;
  text-align: center;
  color: #6b7280;
  background: rgba(0,0,0,0.02);
}

/* Form */
div[data-testid="stForm"] {
  padding: 18px 20px;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 16px;
  background: rgba(0,0,0,0.01);
  box-shadow: 0 6px 18px rgba(0,0,0,0.03);
}
.form-card {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 16px 16px 6px;
  margin-bottom: 14px;
}
.form-card-title {
  font-weight: 700;
  font-size: 1.02rem;
  margin-bottom: 10px;
  color: #0f172a;
}
.form-title {
  text-align: center;
  font-size: 1.45rem;
  font-weight: 800;
  color: #0f172a;
  margin: 8px 0 16px;
}

/* Sidebar */
.sidebar-card {
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
  color: #ffffff;
  padding: 14px 16px;
  border-radius: 14px;
  margin-bottom: 12px;
  box-shadow: 0 8px 20px rgba(15, 118, 110, 0.25);
}
.sidebar-card h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}
.sidebar-muted {
  color: rgba(255,255,255,0.85);
  font-size: 0.9rem;
  margin-top: 4px;
}
.sidebar-section {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 12px;
}
.sidebar-chat-box {
  max-height: 42vh;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.sidebar-chat-msg {
  margin-bottom: 8px;
  font-size: 0.92rem;
  line-height: 1.35;
}
.sidebar-chat-user {
  font-weight: 700;
  color: #0f172a;
}
.sidebar-chat-bot {
  color: #1f2937;
}
.stSidebar div[data-testid="stForm"] {
  position: sticky;
  bottom: 0;
  background: #f3f7f7;
  padding: 8px;
  border-radius: 12px;
  z-index: 2;
}
.sidebar-input .stButton > button {
  border-radius: 10px;
  height: 42px;
  width: 42px;
  padding: 0;
}
.sidebar-input [data-testid="stTextInput"] input {
  height: 42px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.sidebar-input [data-testid="stHorizontalBlock"] {
  align-items: center;
  gap: 8px;
}
</style>
"""
st.markdown(CSS, unsafe_allow_html=True)


# -------------------------
# Mongo (secrets.toml)
# -------------------------
mongo = st.secrets["mongodb"]
uri = mongo["uri"]
db_name = mongo.get("db", "portfolio")
col_name = mongo.get("collection", "leads")

client = MongoClient(uri, server_api=ServerApi("1"))
db = client[db_name]
leads = db[col_name]
fs = gridfs.GridFS(db)

# Mets ton URL portfolio ici
PORTFOLIO_URL = "https://lamadokouyayra.vercel.app/"
WHATSAPP_URL = "https://wa.me/22892092572"


def _build_ai_payload(doc):
    return {
        "identity": {
            "full_name": doc.get("full_name"),
            "phone_whatsapp": doc.get("phone_whatsapp"),
            "email": doc.get("email"),
        },
        "objective": doc.get("objective"),
        "deadline": doc.get("deadline"),
        "portfolio_info": {
            "target_role": doc.get("target_role"),
            "language": doc.get("language"),
            "language_other": doc.get("language_other"),
            "country": doc.get("country"),
            "city": doc.get("city"),
            "audience": doc.get("audience"),
            "style": doc.get("style"),
            "budget_band": doc.get("budget_band"),
        },
        "content": {
            "need": doc.get("need"),
            "strengths": doc.get("strengths"),
            "projects": doc.get("projects"),
            "website": doc.get("website"),
            "competitor_examples": doc.get("competitor_examples"),
            "content_assets": doc.get("content_assets"),
            "clarifications": doc.get("clarifications"),
        },
        "consent": doc.get("consent_contact"),
        "metadata": {
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
            "source": doc.get("source"),
        },
    }


def _local_quality_score(doc):
    score = 0
    link_ok = bool(doc.get("website") or doc.get("competitor_examples"))
    if link_ok:
        score += 25
    projects_raw = doc.get("projects") or ""
    project_count = len([p for p in re.split(r"[,\n;]+", projects_raw) if p.strip()])
    if project_count >= 2:
        score += 25
    if doc.get("objective") and doc.get("deadline"):
        score += 25
    contact_ok = bool(doc.get("phone_whatsapp") and doc.get("email") and doc.get("consent_contact"))
    if contact_ok:
        score += 25
    return score


def _extract_json(text):
    try:
        return json.loads(text), None
    except Exception as exc:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return None, f"json_parse_failed: {exc}"
        try:
            return json.loads(match.group(0)), None
        except Exception as inner_exc:
            return None, f"json_parse_failed: {inner_exc}"


def _extract_score(ai_data, fallback_score):
    if isinstance(ai_data, dict):
        quality = ai_data.get("quality_score")
        if isinstance(quality, dict) and isinstance(quality.get("score"), (int, float)):
            return int(quality.get("score")), "ai"
        if isinstance(quality, (int, float)):
            return int(quality), "ai"
    return fallback_score, "local"


def _normalize_list(value):
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, str):
        return [line.strip() for line in value.splitlines() if line.strip()]
    return []


FX_RATE_CFA_PER_USD = 600
PRICE_PORTFOLIO_CFA = 29900
HOSTING_MONTH_CFA = 2000
HOSTING_YEAR_CFA = 24000
HOSTING_YEAR_DISCOUNT_CFA = 19900


def _format_price(cfa_value):
    usd_value = cfa_value / FX_RATE_CFA_PER_USD
    return f"{cfa_value:,} CFA (~${usd_value:.2f})".replace(",", " ")


def _cohere_generate(payload):
    cohere_cfg = st.secrets.get("cohere", {})
    api_key = cohere_cfg.get("api_key")
    model = cohere_cfg.get("model", "command-a-03-2025")
    if not api_key:
        return None, model, "missing_api_key"

    co = cohere.ClientV2(api_key)
    language_raw = str(payload.get("portfolio_info", {}).get("language", "")).lower()
    language_other = str(payload.get("portfolio_info", {}).get("language_other", "")).strip()
    output_language = "French"
    if "anglais" in language_raw and "fran" not in language_raw:
        output_language = "English"
    elif "bilingue" in language_raw:
        output_language = "French and English"
    elif "autre" in language_raw and language_other:
        output_language = f"{language_other}"

    system_prompt = (
        "Return valid JSON only. No markdown, no commentary, no extra keys."
    )
    user_prompt = (
        "You are a portfolio brief assistant. Produce ONLY valid JSON with this schema:\n"
        "{\n"
        '  "brief_summary": [string],\n'
        '  "clarifying_questions": [string],\n'
        '  "portfolio_plan": [{"section": string, "content": string, "priority": "high|medium|low"}],\n'
        '  "assets_checklist": [string],\n'
        '  "deliverables": [string],\n'
        '  "estimate": {"price_range": string, "eta_days": number, "risk_level": "low|medium|high"},\n'
        '  "quality_score": {"score": number, "reasons": [string]},\n'
        '  "whatsapp_message": string,\n'
        '  "email_message": string,\n'
        '  "internal_tags": [string]\n'
        "}\n\n"
        "Rules for quality_score:\n"
        "- Need at least 1 link (LinkedIn/GitHub/website)\n"
        "- At least 2 projects or experiences\n"
        "- Objective clear + deadline realistic\n"
        "- Contact OK + consent true\n"
        f"Language for all fields: {output_language}.\n"
        "Input JSON:\n"
        f"{json.dumps(payload, ensure_ascii=True)}"
    )

    resp = co.chat(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    text = ""
    try:
        text = resp.message.content[0].text
    except Exception:
        text = str(resp)
    parsed, error = _extract_json(text)
    return parsed, model, error


ADMIN_MODE = bool(st.secrets.get("admin", {}).get("enabled", False))


def _sales_agent_reply(user_message, history):
    cohere_cfg = st.secrets.get("cohere", {})
    api_key = cohere_cfg.get("api_key")
    model = cohere_cfg.get("model", "command-a-03-2025")
    if not api_key:
        return "Service indisponible pour le moment. Contactez-nous sur WhatsApp."

    co = cohere.ClientV2(api_key)
    system_prompt = (
        "You are a strong sales assistant for a portfolio service. "
        "Answer in French, concise, confident, and helpful. "
        "Always show prices exactly in this format: '29 900 CFA (~$49.83)'. "
        "Never omit the $ symbol. "
        "Pricing: Portfolio 29 900 CFA (~$49.83). Hosting 2 000 CFA/mois (~$3.33). "
        "Hosting annuel 24 000 CFA/an (~$40.00). Offre annuelle 19 900 CFA/an (~$33.17). "
        "Ask one short clarifying question and guide to conversion."
    )

    messages = [{"role": "system", "content": system_prompt}]
    for item in history[-6:]:
        messages.append({"role": "user", "content": item["user"]})
        messages.append({"role": "assistant", "content": item["assistant"]})
    messages.append({"role": "user", "content": user_message})

    try:
        resp = co.chat(model=model, messages=messages)
        return resp.message.content[0].text
    except Exception:
        return "Je peux aider sur le service. Posez votre question ou contactez-nous sur WhatsApp."


def _render_chat_html(messages, typing_text=""):
    rows = []
    for item in messages:
        user = html.escape(item.get("user", ""))
        assistant = html.escape(item.get("assistant", ""))
        rows.append(
            f'<div class="sidebar-chat-msg"><span class="sidebar-chat-user">Vous:</span> {user}</div>'
        )
        rows.append(
            f'<div class="sidebar-chat-msg"><span class="sidebar-chat-user">Assistant:</span> '
            f'<span class="sidebar-chat-bot">{assistant}</span></div>'
        )
    if typing_text:
        rows.append(
            f'<div class="sidebar-chat-msg"><span class="sidebar-chat-user">Assistant:</span> '
            f'<span class="sidebar-chat-bot">{html.escape(typing_text)}</span></div>'
        )
    return '<div class="sidebar-chat-box">' + "".join(rows) + "</div>"


def _render_sales_sidebar():
    st.sidebar.markdown(
        """
        <div class="sidebar-card">
          <h3>Assistant commercial</h3>
          <div class="sidebar-muted">Questions sur le service, prix et fonctionnement.</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.sidebar.markdown(
        f"""
        <div class="sidebar-section">
          <strong>Portfolio</strong><br />{_format_price(PRICE_PORTFOLIO_CFA)}
        </div>
        <div class="sidebar-section">
          <strong>Hebergement</strong><br />{_format_price(HOSTING_MONTH_CFA)} / mois
        </div>
        <div class="sidebar-section">
          <strong>Hebergement annuel</strong><br />{_format_price(HOSTING_YEAR_CFA)}
        </div>
        <div class="sidebar-section">
          <strong>Offre annuelle</strong><br />{_format_price(HOSTING_YEAR_DISCOUNT_CFA)}
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.session_state.setdefault("sales_chat", [])
    chat_placeholder = st.sidebar.empty()
    chat_placeholder.markdown(
        _render_chat_html(st.session_state["sales_chat"]),
        unsafe_allow_html=True,
    )

    with st.sidebar.form("sales_form", clear_on_submit=True):
        col_input, col_btn = st.columns([5, 1])
        with col_input:
            user_input = st.text_input(
                "Votre question",
                key="sales_input",
                label_visibility="collapsed",
                placeholder="Ecrivez ici...",
            )
        with col_btn:
            submitted = st.form_submit_button(">")

        if submitted and user_input.strip():
            reply = _sales_agent_reply(user_input.strip(), st.session_state["sales_chat"])
            typing = ""
            for i in range(0, len(reply), 3):
                typing = reply[: i + 3]
                chat_placeholder.markdown(
                    _render_chat_html(st.session_state["sales_chat"], typing_text=typing),
                    unsafe_allow_html=True,
                )
                time.sleep(0.02)

            st.session_state["sales_chat"].append(
                {"user": user_input.strip(), "assistant": reply}
            )
            st.rerun()


_render_sales_sidebar()


def _send_lead_email(doc, lead_id):
    smtp_cfg = st.secrets.get("smtp", {})
    host = smtp_cfg.get("host")
    port = int(smtp_cfg.get("port", 587))
    username = smtp_cfg.get("username")
    password = smtp_cfg.get("password")
    to_email = smtp_cfg.get("to_email")
    sender = smtp_cfg.get("from_email") or username

    if not all([host, port, username, password, to_email, sender]):
        return False, "smtp_config_missing"

    msg = EmailMessage()
    msg["Subject"] = f"Nouveau brief portfolio: {doc.get('full_name', 'Sans nom')}"
    msg["From"] = sender
    msg["To"] = to_email

    body = (
        f"Reference: {lead_id}\n"
        f"Nom: {doc.get('full_name')}\n"
        f"Email: {doc.get('email')}\n"
        f"WhatsApp: {doc.get('phone_whatsapp')}\n"
        f"Objectif: {doc.get('objective')}\n"
        f"Role vise: {doc.get('target_role')}\n"
        f"Delai: {doc.get('deadline')}\n"
        f"Langue: {doc.get('language')}\n"
        f"Pays/Ville: {doc.get('country')} / {doc.get('city')}\n"
        f"Site/LinkedIn: {doc.get('website')}\n"
        f"Projets: {doc.get('projects')}\n"
        f"Besoin:\n{doc.get('need')}\n"
    )
    msg.set_content(body)

    try:
        with smtplib.SMTP(host, port, timeout=10) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(msg)
        return True, None
    except Exception as exc:
        return False, str(exc)


# -------------------------
# Header / Hero
# -------------------------
# Photo: place ton image dans assets/ (photo.jpg par defaut)
asset_dir = "assets"
photo_candidates = [
    "photo.jpg",
    "photo.jpeg",
    "photo.png",
    "junior.jpg",
]
photo_path = ""
for name in photo_candidates:
    candidate = os.path.join(asset_dir, name)
    if os.path.isfile(candidate):
        photo_path = candidate
        break

photo_html = ""
if photo_path:
    with open(photo_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("ascii")
    if photo_path.lower().endswith(".png"):
        mime = "image/png"
    else:
        mime = "image/jpeg"
    photo_html = f'<img src="data:{mime};base64,{encoded}" alt="Photo portrait" />'
else:
    photo_html = '<div class="photo-placeholder">Photo en attente — ajoute une image dans `assets/`</div>'

st.markdown(
    f"""
    <div class="hero">
      <div class="hero-grid">
        <div class="hero-media">{photo_html}</div>
        <div class="hero-content">
          <div class="hero-kicker">Service portfolio</div>
          <div class="hero-title">Je crée votre portfolio professionnel sur-mesure</div>
          <div class="hero-sub">
            Pour décrocher un emploi, attirer des clients et crédibiliser votre profil —
            version prête en quelques jours.
          </div>
          <div class="badges">
            <span>✅ Design moderne</span>
            <span>✅ Message efficace</span>
            <span>✅ Livraison rapide</span>
            <span>✅ Brief structuré</span>
          </div>
          <div class="hero-actions">
            <a class="primary" href="{WHATSAPP_URL}" target="_blank" rel="noopener">Demander un devis</a>
            <a class="ghost" href="{PORTFOLIO_URL}" target="_blank" rel="noopener">Voir mon portfolio</a>
          </div>
        </div>
      </div>
    </div>
    """,
    unsafe_allow_html=True,
)

st.write("")


# -------------------------
# Proof / badges
# -------------------------
st.markdown(
    """
    <div class="section">
      <h3>Preuves & garanties</h3>
      <div class="small-muted">
        Un accompagnement pro, des livrables clairs, et une mise en ligne propre.
      </div>
      <div class="badges">
        <span>✅ Positionnement crédible</span>
        <span>✅ Optimisation mobile</span>
        <span>✅ Contenu optimisé</span>
        <span>✅ Données sécurisées</span>
      </div>
    </div>
    """,
    unsafe_allow_html=True,
)

st.write("")


# -------------------------
# CTA buttons
# -------------------------
st.markdown(
    f"""
    <div class="section">
      <h3>Parlons de votre projet</h3>
      <div class="small-muted">
        Demandez un devis rapide ou contactez-moi directement.
      </div>
      <div class="cta-buttons">
        <a href="{PORTFOLIO_URL}" target="_blank" rel="noopener">Voir mon portfolio</a>
        <a href="{WHATSAPP_URL}" target="_blank" rel="noopener">Me contacter (WhatsApp)</a>
      </div>
    </div>
    """,
    unsafe_allow_html=True,
)
st.write("")


# -------------------------
# Benefits / How it works
# -------------------------
s1, s2 = st.columns(2, gap="large")

with s1:
    st.markdown(
        """
        <div class="section">
          <h3>Ce que tu obtiens</h3>
          <ul>
            <li>Un portfolio premium, clair et professionnel.</li>
            <li>Un message positionné pour recruteurs et clients internationaux.</li>
            <li>Une structure orientée conversion (preuves, projets, contact).</li>
            <li>Une présence en ligne qui inspire confiance en quelques secondes.</li>
          </ul>
          <div class="small-muted">
            Objectif : déclencher un contact qualifié, pas juste une visite.
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with s2:
    st.markdown(
        """
        <div class="section">
          <h3>Comment ça se passe</h3>
          <ol>
            <li>Tu envoies un brief détaillé.</li>
            <li>Je valide la cible, l’objectif et le positionnement.</li>
            <li>Je conçois la structure et les textes.</li>
            <li>Livraison rapide + ajustements.</li>
          </ol>
        </div>
        """,
        unsafe_allow_html=True,
    )

st.write("")


# -------------------------
# Formulaire (brief complet)
# -------------------------
def _get_index(options, value):
    try:
        return options.index(value)
    except ValueError:
        return 0


FORM_KEYS = [
    "full_name",
    "phone",
    "email",
    "country",
    "city",
    "objective",
    "role",
    "language",
    "language_other",
    "deadline",
    "audience",
    "budget",
    "website",
    "strengths",
    "projects",
    "style",
    "need",
    "content_assets",
    "competitors",
    "consent",
]

for key in FORM_KEYS:
    st.session_state.setdefault(key, "")

form_errors = set(st.session_state.get("form_errors", []))

ERROR_FIELD_SELECTORS = {
    "full_name": 'input[aria-label="Nom complet *"]',
    "phone": 'input[aria-label="WhatsApp / Téléphone *"]',
    "email": 'input[aria-label="Email *"]',
    "role": 'input[aria-label="Poste / rôle visé *"]',
    "need": 'textarea[aria-label="Contexte et objectifs (secteur, niveau d’expérience, message à transmettre) *"]',
}


def _render_error_css(keys):
    rules = []
    for key in keys:
        selector = ERROR_FIELD_SELECTORS.get(key)
        if selector:
            rules.append(
                f'{selector} {{ border: 2px solid #ef4444 !important; '
                f'box-shadow: 0 0 0 2px rgba(239,68,68,0.18) !important; }}'
            )
    if rules:
        st.markdown(f"<style>{''.join(rules)}</style>", unsafe_allow_html=True)


_render_error_css(form_errors)

OBJECTIVE_OPTIONS = ["emploi", "freelance", "business", "études", "autre"]
LANGUAGE_OPTIONS = ["Français", "Anglais", "Bilingue", "Autre (préciser)"]
DEADLINE_OPTIONS = ["24h", "48h", "72h", "1 semaine", "2 semaines"]
BUDGET_OPTIONS = ["À discuter", "Petit", "Moyen", "Élevé"]
STYLE_OPTIONS = ["Sobre", "Élégant", "Créatif", "Corporate", "Minimal"]
MAX_UPLOAD_MB = 10


def _format_mb(value):
    return f"{value / (1024 * 1024):.1f} MB"

with st.form("lead_form", clear_on_submit=True):
    st.markdown('<div class="form-title">Vos informations pour commencer</div>', unsafe_allow_html=True)
    st.markdown('<div class="form-card"><div class="form-card-title">Identite et contact</div>', unsafe_allow_html=True)
    a, b = st.columns(2)
    with a:
        full_name = st.text_input("Nom complet *", value=st.session_state["full_name"])
        if "full_name" in form_errors:
            st.error("Champ requis")
        phone = st.text_input("WhatsApp / Téléphone *", value=st.session_state["phone"])
        if "phone" in form_errors:
            st.error("Champ requis")
        email = st.text_input("Email *", value=st.session_state["email"])
        if "email" in form_errors:
            st.error("Champ requis")
    with b:
        country = st.text_input("Pays", value=st.session_state["country"])
        city = st.text_input("Ville", value=st.session_state["city"])
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="form-card"><div class="form-card-title">Objectif du portfolio</div>', unsafe_allow_html=True)
    c, d = st.columns(2)
    with c:
        objective = st.selectbox(
            "Objectif principal *",
            OBJECTIVE_OPTIONS,
            index=_get_index(OBJECTIVE_OPTIONS, st.session_state["objective"] or OBJECTIVE_OPTIONS[0]),
        )
        role = st.text_input("Poste / rôle visé *", value=st.session_state["role"])
        if "role" in form_errors:
            st.error("Champ requis")
        deadline = st.selectbox(
            "Délai souhaité *",
            DEADLINE_OPTIONS,
            index=_get_index(DEADLINE_OPTIONS, st.session_state["deadline"] or DEADLINE_OPTIONS[0]),
        )
    with d:
        language = st.selectbox(
            "Langue principale",
            LANGUAGE_OPTIONS,
            index=_get_index(LANGUAGE_OPTIONS, st.session_state["language"] or LANGUAGE_OPTIONS[0]),
        )
        language_other = st.text_input("Autre langue (si applicable)", value=st.session_state["language_other"])
        budget = st.selectbox(
            "Budget estimé",
            BUDGET_OPTIONS,
            index=_get_index(BUDGET_OPTIONS, st.session_state["budget"] or BUDGET_OPTIONS[0]),
        )
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="form-card"><div class="form-card-title">Cible, style et valeur</div>', unsafe_allow_html=True)
    e, f = st.columns(2)
    with e:
        audience = st.text_input(
            "Cible principale (recruteurs, clients, partenaires)",
            value=st.session_state["audience"],
        )
        website = st.text_input("Site actuel / LinkedIn / GitHub", value=st.session_state["website"])
        strengths = st.text_input("Tes 2–3 forces clés", value=st.session_state["strengths"])
    with f:
        projects = st.text_input(
            "Projets à mettre en avant (liens ou titres)",
            value=st.session_state["projects"],
        )
        style = st.selectbox(
            "Style souhaité",
            STYLE_OPTIONS,
            index=_get_index(STYLE_OPTIONS, st.session_state["style"] or STYLE_OPTIONS[0]),
        )
        competitors = st.text_input(
            "Exemples de sites que tu aimes (liens)",
            value=st.session_state["competitors"],
        )
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="form-card"><div class="form-card-title">Contexte et objectifs</div>', unsafe_allow_html=True)
    need = st.text_area(
        "Contexte et objectifs (secteur, niveau d’expérience, message à transmettre) *",
        height=140,
        value=st.session_state["need"],
    )
    if "need" in form_errors:
        st.error("Champ requis")
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="form-card"><div class="form-card-title">Fichiers et ressources</div>', unsafe_allow_html=True)
    content_assets = st.text_area(
        "Fichiers déjà prêts (CV, photos, logos, textes, références)",
        height=100,
        value=st.session_state["content_assets"],
    )
    st.caption("Indique ce que tu peux fournir tout de suite.")
    uploaded_files = st.file_uploader(
        "Uploader des fichiers (optionnel)",
        type=["pdf", "png", "jpg", "jpeg", "docx"],
        accept_multiple_files=True,
        key="uploaded_files",
    )
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="form-card"><div class="form-card-title">Consentement</div>', unsafe_allow_html=True)
    consent = st.checkbox(
        "J’accepte d’être recontacté pour cette demande *",
        value=bool(st.session_state["consent"]),
    )
    if "consent" in form_errors:
        st.error("Champ requis")
    st.markdown("</div>", unsafe_allow_html=True)
    submit = st.form_submit_button("Envoyer")

    if submit:
        # validation minimale (tu veux un formulaire strict)
        missing_keys = []
        if not full_name.strip():
            missing_keys.append("full_name")
        if not phone.strip():
            missing_keys.append("phone")
        if not email.strip():
            missing_keys.append("email")
        if not need.strip():
            missing_keys.append("need")
        if not role.strip():
            missing_keys.append("role")
        if not consent:
            missing_keys.append("consent")

        file_errors = []
        if uploaded_files:
            for f in uploaded_files:
                if f.size > MAX_UPLOAD_MB * 1024 * 1024:
                    file_errors.append(
                        f"{f.name} depasse {MAX_UPLOAD_MB} MB (taille: {_format_mb(f.size)})"
                    )

        st.session_state.update(
            {
                "full_name": full_name,
                "phone": phone,
                "email": email,
                "country": country,
                "city": city,
                "objective": objective,
                "role": role,
                "language": language,
                "language_other": language_other,
                "deadline": deadline,
                "audience": audience,
                "budget": budget,
                "website": website,
                "strengths": strengths,
                "projects": projects,
                "style": style,
                "need": need,
                "content_assets": content_assets,
                "competitors": competitors,
                "consent": consent,
            }
        )

        if missing_keys or file_errors:
            st.session_state["form_errors"] = missing_keys
            _render_error_css(missing_keys)
            if missing_keys:
                st.error("Merci de completer les champs requis en rouge.")
            if file_errors:
                st.error("Fichiers trop volumineux : " + ", ".join(file_errors))
        else:
            st.session_state["form_errors"] = []
            stored_files = []
            upload_failed = False
            if uploaded_files:
                for f in uploaded_files:
                    try:
                        data = f.getvalue()
                        if not isinstance(data, (bytes, bytearray)):
                            data = f.read()
                        file_id = fs.put(
                            data,
                            filename=str(f.name),
                            content_type=f.type,
                            metadata={
                                "uploaded_at": datetime.now(timezone.utc),
                                "lead_email": email.strip(),
                            },
                        )
                        stored_files.append(
                            {
                                "file_id": str(file_id),
                                "name": f.name,
                                "type": f.type,
                                "size": f.size,
                            }
                        )
                    except Exception:
                        upload_failed = True
                        st.error("Echec de l'upload. Reessayez plus tard.")

            doc = {
                "full_name": full_name.strip(),
                "phone_whatsapp": phone.strip(),
                "email": email.strip(),
                "country": country.strip() if country else None,
                "city": city.strip() if city else None,
                "objective": objective,
                "target_role": role.strip(),
                "deadline": deadline,
                "language": language,
                "language_other": language_other.strip() if language_other else None,
                "budget_band": budget,
                "audience": audience.strip() if audience else None,
                "website": website.strip() if website else None,
                "strengths": strengths.strip() if strengths else None,
                "projects": projects.strip() if projects else None,
                "style": style,
                "need": need.strip(),
                "content_assets": content_assets.strip() if content_assets else None,
                "uploaded_files": stored_files,
                "competitor_examples": competitors.strip() if competitors else None,
                "consent_contact": True,
                "lead_status": "new",
                "source": "streamlit_site",
                "created_at": datetime.now(timezone.utc),
            }

            try:
                res = leads.insert_one(doc)
            except Exception:
                st.error("Le service est temporairement indisponible. Merci de reessayer plus tard.")
                st.stop()

            st.success(f"Demande envoyee. Reference: {res.inserted_id}")
            st.info("Brief recu. Je vous contacte sous 24-48h.")

            email_ok, email_error = _send_lead_email(doc, str(res.inserted_id))
            if not email_ok:
                leads.update_one(
                    {"_id": res.inserted_id},
                    {"$set": {"email_status": "failed", "email_error": email_error}},
                )
            else:
                leads.update_one(
                    {"_id": res.inserted_id},
                    {"$set": {"email_status": "sent"}},
                )

            local_score = _local_quality_score(doc)
            ai_payload = _build_ai_payload(doc)
            ai_result = None
            ai_status = "failed"
            ai_error = None
            ai_model = st.secrets.get("cohere", {}).get("model", "command-a-03-2025")
            ai_latency_ms = None

            start_time = time.time()
            try:
                ai_result, ai_model, ai_error = _cohere_generate(ai_payload)
                ai_latency_ms = int((time.time() - start_time) * 1000)
                if ai_result:
                    ai_status = "success"
            except Exception as exc:
                ai_latency_ms = int((time.time() - start_time) * 1000)
                ai_error = str(exc)

            if ai_result is not None and not isinstance(ai_result, dict):
                ai_error = "invalid_ai_response_type"
                ai_result = None
                ai_status = "failed"

            ai_score, ai_score_source = _extract_score(ai_result, local_score)
            leads.update_one(
                {"_id": res.inserted_id},
                {
                    "$set": {
                        "ai_generated": ai_result,
                        "ai_status": ai_status,
                        "ai_model": ai_model,
                        "ai_latency_ms": ai_latency_ms,
                        "ai_error": ai_error,
                        "ai_quality_score": ai_score,
                        "ai_quality_source": ai_score_source,
                    }
                },
            )

            if ai_status != "success":
                st.warning("Analyse IA indisponible pour le moment.")
            else:
                if ai_score < 60:
                    st.warning("Brief incomplet. Merci de repondre aux questions ci-dessous.")
                    questions = _normalize_list(ai_result.get("clarifying_questions"))
                    for item in questions:
                        st.write(f"- {item}")
                else:
                    st.subheader("Resume du brief")
                    summary = _normalize_list(ai_result.get("brief_summary"))
                    for line in summary:
                        st.write(f"- {line}")

                    st.subheader("Plan du portfolio")
                    plan = ai_result.get("portfolio_plan") or []
                    for item in plan:
                        if not isinstance(item, dict):
                            continue
                        section = item.get("section", "Section")
                        content = item.get("content", "")
                        priority = item.get("priority", "")
                        st.markdown(f"**{section}** ({priority})")
                        if content:
                            st.write(content)

                    st.subheader("Checklist des elements a fournir")
                    checklist = _normalize_list(ai_result.get("assets_checklist"))
                    for item in checklist:
                        st.write(f"- {item}")

                    if ADMIN_MODE:
                        st.subheader("Message WhatsApp")
                        whatsapp_message = ai_result.get("whatsapp_message", "")
                        if st.button("Copier message WhatsApp"):
                            st.toast("Message pret a copier ci-dessous.")
                        st.text_area("Message WhatsApp", value=whatsapp_message, height=160)

                        st.subheader("Livrables")
                        deliverables = _normalize_list(ai_result.get("deliverables"))
                        for item in deliverables:
                            st.write(f"- {item}")

                        estimate = ai_result.get("estimate", {})
                        if isinstance(estimate, dict):
                            price_range = estimate.get("price_range")
                            eta_days = estimate.get("eta_days")
                            risk_level = estimate.get("risk_level")
                            st.markdown("**Estimation**")
                            st.write(f"Prix: {price_range} | Delai: {eta_days} jours | Risque: {risk_level}")

                        tags = _normalize_list(ai_result.get("internal_tags"))
                        if tags:
                            st.markdown("**Tags internes**")
                            st.write(", ".join(tags))

                        if stored_files:
                            st.subheader("Fichiers uploades")
                            for item in stored_files:
                                file_id = item.get("file_id")
                                label = f"{item.get('name')} ({_format_mb(item.get('size', 0))})"
                                try:
                                    grid_file = fs.get(ObjectId(file_id))
                                    st.download_button(
                                        label=f"Telecharger {label}",
                                        data=grid_file.read(),
                                        file_name=item.get("name"),
                                        mime=item.get("type") or "application/octet-stream",
                                    )
                                except Exception:
                                    st.write(f"Fichier indisponible: {label}")

            if stored_files:
                st.info(
                    "Fichiers recus: "
                    + ", ".join(f"{f['name']} ({_format_mb(f.get('size', 0))})" for f in stored_files)
                )

            st.session_state["last_lead_id"] = str(res.inserted_id)
            st.session_state["last_ai_result"] = ai_result
            st.session_state["last_ai_score"] = ai_score
            st.session_state["last_ai_status"] = ai_status

            for key in FORM_KEYS:
                st.session_state[key] = ""
            st.session_state["uploaded_files"] = []


# Footer
st.write("")
st.caption("© Portfolio — Brief & demande de devis")

last_lead_id = st.session_state.get("last_lead_id")
last_ai_result = st.session_state.get("last_ai_result")
last_ai_score = st.session_state.get("last_ai_score")
last_ai_status = st.session_state.get("last_ai_status")

if last_lead_id and last_ai_status == "success" and isinstance(last_ai_score, int) and last_ai_score < 60:
    st.markdown("### Precisions manquantes")
    questions = _normalize_list(last_ai_result.get("clarifying_questions") if last_ai_result else [])

    with st.form("clarify_form", clear_on_submit=True):
        answers = {}
        for idx, question in enumerate(questions):
            answers[str(idx + 1)] = st.text_area(question, height=80)
        extra = st.text_area("Autres precisions utiles", height=80)
        submit_clarify = st.form_submit_button("Envoyer les precisions")

    if submit_clarify:
        clarifications = {
            "questions": questions,
            "answers": answers,
            "extra": extra.strip() if extra else None,
        }
        lead_id = ObjectId(last_lead_id)
        leads.update_one(
            {"_id": lead_id},
            {
                "$set": {
                    "clarifications": clarifications,
                    "clarifications_at": datetime.now(timezone.utc),
                }
            },
        )

        updated_doc = leads.find_one({"_id": lead_id})
        local_score = _local_quality_score(updated_doc)
        ai_payload = _build_ai_payload(updated_doc)
        ai_result = None
        ai_status = "failed"
        ai_error = None
        ai_model = st.secrets.get("cohere", {}).get("model", "command-a-03-2025")
        ai_latency_ms = None

        start_time = time.time()
        try:
            ai_result, ai_model, ai_error = _cohere_generate(ai_payload)
            ai_latency_ms = int((time.time() - start_time) * 1000)
            if ai_result:
                ai_status = "success"
        except Exception as exc:
            ai_latency_ms = int((time.time() - start_time) * 1000)
            ai_error = str(exc)

        if ai_result is not None and not isinstance(ai_result, dict):
            ai_error = "invalid_ai_response_type"
            ai_result = None
            ai_status = "failed"

        ai_score, ai_score_source = _extract_score(ai_result, local_score)
        leads.update_one(
            {"_id": lead_id},
            {
                "$set": {
                    "ai_generated": ai_result,
                    "ai_status": ai_status,
                    "ai_model": ai_model,
                    "ai_latency_ms": ai_latency_ms,
                    "ai_error": ai_error,
                    "ai_quality_score": ai_score,
                    "ai_quality_source": ai_score_source,
                }
            },
        )

        st.session_state["last_ai_result"] = ai_result
        st.session_state["last_ai_score"] = ai_score
        st.session_state["last_ai_status"] = ai_status
        st.rerun()
