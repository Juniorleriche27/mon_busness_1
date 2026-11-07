from app.config import settings
from app.prompts.catalog import build_prompt

def call_claude(service_id: str, fields: dict, language: str = "fr") -> str:
    """
    Appelle Claude pour générer le contenu textuel complet du document.
    Utilise un import dynamique résilient et un repli intelligent en dev local.
    """
    if not settings.ANTHROPIC_API_KEY:
        # Repli de développement local si pas de clé API configurée
        meta_title = service_id.replace("_", " ").title()
        return (
            f"# {meta_title}\n\n"
            f"> Document officiel Scrivia généré en environnement de test pour `{service_id}`.\n\n"
            f"## Spécifications & Données Renseignées\n\n"
            + "\n".join([f"- **{k}** : {v}" for k, v in fields.items() if v])
            + "\n\n## Synthèse & Recommandations Stratégiques\n\n"
            "Ce document atteste de la complétude du dossier selon les normes professionnelles en vigueur."
        )

    try:
        import anthropic
    except ImportError:
        raise RuntimeError("Le package 'anthropic' n'est pas installé sur le serveur hôte.")

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    system_prompt, user_prompt = build_prompt(service_id, fields, language)

    response = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=4096,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}]
    )

    content = "".join([block.text for block in response.content if hasattr(block, "text")])
    return content
