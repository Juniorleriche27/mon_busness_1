"""
Catalogue des services et prompts système pour l'IA Claude.
Couvre les 24 services Scrivia (Carrière, Business, Architecture, Juridique, Traduction, Appels d'offres, Académique).
"""

from typing import Dict, Any, Optional

SERVICES_META = {
    "cv": {"title": "CV Professionnel & Exécutif", "price_fcfa": 9900},
    "lettre": {"title": "Lettre de Motivation Ciblée", "price_fcfa": 4900},
    "linkedin": {"title": "Optimisation Profil LinkedIn", "price_fcfa": 7900},
    "pack_carriere": {"title": "Pack Carrière Complet", "price_fcfa": 18900},
    "bmc": {"title": "Business Model Canvas (BMC)", "price_fcfa": 14900},
    "plan_affaire": {"title": "Plan d'Affaires Complet (Business Plan)", "price_fcfa": 49900},
    "pitch": {"title": "Pitch Deck Investisseur", "price_fcfa": 29900},
    "marketing": {"title": "Plan Marketing & Stratégie Digitale", "price_fcfa": 24900},
    "finances": {"title": "Prévisions Financières & Compte de Résultat", "price_fcfa": 34900},
    "pack_business": {"title": "Pack Création d'Entreprise", "price_fcfa": 89900},
    "archi": {"title": "Programme Architectural & Notice Descriptive", "price_fcfa": 39900},
    "devis": {"title": "Devis Descriptif et Quantitatif Estimatif (DQE)", "price_fcfa": 29900},
    "cdc": {"title": "Cahier des Clauses Techniques Particulières (CCTP)", "price_fcfa": 34900},
    "permis": {"title": "Dossier de Demande de Permis de Construire", "price_fcfa": 44900},
    "pack_archi": {"title": "Pack Projet de Construction", "price_fcfa": 99900},
    "statuts": {"title": "Statuts de Société Commerciale (OHADA)", "price_fcfa": 39900},
    "contrat": {"title": "Contrat de Prestation ou Commercial", "price_fcfa": 24900},
    "financement": {"title": "Dossier de Demande de Financement Bancaire", "price_fcfa": 49900},
    "trad_s": {"title": "Traduction Rapide & Formatée (1-5 pages)", "price_fcfa": 9900},
    "trad_l": {"title": "Traduction Technique Approfondie (>5 pages)", "price_fcfa": 29900},
    "ao": {"title": "Mémoire Technique pour Appel d'Offres", "price_fcfa": 59900},
    "ong": {"title": "Dossier de Projet de Développement / ONG", "price_fcfa": 49900},
    "rapport_stage": {"title": "Rapport de Stage ou Mémoire Professionnel", "price_fcfa": 24900},
    "bourse": {"title": "Dossier de Candidature à une Bourse", "price_fcfa": 14900},
}

DEFAULT_SYSTEM_PROMPT = """Tu es un expert senior certifié en rédaction de documents d'affaires, juridiques et stratégiques.
Tu rédiges avec une précision maximale, une structure soignée en Markdown (titres #, ##, ###, listes à puces, tableaux | | |),
dans un style exécutif et professionnel adapté aux normes internationales et africaines (notamment droit OHADA si juridique).
N'inclus aucune salutation superflue ni bavardage, fournis directement le document finalisé et prêt à l'emploi.
"""

def get_service_meta(service_id: str) -> Dict[str, Any]:
    return SERVICES_META.get(service_id, {"title": service_id.capitalize(), "price_fcfa": 9900})

def build_prompt(service_id: str, fields: Dict[str, Any], language: str = "fr") -> tuple[str, str]:
    meta = get_service_meta(service_id)
    title = meta["title"]
    
    # Custom system prompt according to domain
    system_prompt = DEFAULT_SYSTEM_PROMPT
    if service_id in ["cv", "lettre", "linkedin", "pack_carriere"]:
        system_prompt += "\nExpertise : Recrutement international, ATS-friendly, valorisation des compétences et métriques quantifiées."
    elif service_id in ["statuts", "contrat"]:
        system_prompt += "\nExpertise : Droit des affaires OHADA (SARL, SAS, SA), clauses de responsabilité, conformité légale stricte."
    elif service_id in ["plan_affaire", "bmc", "finances", "pitch"]:
        system_prompt += "\nExpertise : Analyse de marché, modèle économique, ratios financiers prévisionnels et stratégie de levée de fonds."
    elif service_id in ["archi", "devis", "cdc", "permis"]:
        system_prompt += "\nExpertise : Normes BTP, architecture descriptive, métrés et devis estimatifs conformes."

    # Build structured user context from user input fields
    fields_formatted = "\n".join([f"- **{k}** : {v}" for k, v in fields.items() if v])
    
    user_prompt = f"""Rédige le document complet et exhaustif suivant : **{title}**.
Langue requise : **{language}**.

Voici les informations et spécifications fournies par le client :
{fields_formatted}

Consignes de formatage :
1. Utilise des titres et sous-titres clairs en Markdown (#, ##, ###).
2. Utilise des tableaux Markdown pour tout élément financier, calendrier, devis ou comparatif.
3. Remplis tous les aspects nécessaires pour que le document soit directement exploitable sans placeholders génériques.
"""
    return system_prompt, user_prompt
