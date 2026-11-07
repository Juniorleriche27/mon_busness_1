import sys
import os

# Ajouter le répertoire racine au path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.pdf_generator import generate_pdf
from app.services.docx_generator import generate_docx
from app.services.xlsx_generator import generate_xlsx
from app.prompts.catalog import SERVICES_META, PROMPT_BANK, get_service_meta

SAMPLE_MARKDOWN = """
# Plan Stratégique & Modèle Financier

> Ce document constitue le dossier de cadrage stratégique conforme aux directives OHADA et aux standards d'investissement internationaux.

## 1. Synthèse Exécutive

Scrivia est une plateforme d'intelligence artificielle générative souveraine dédiée à la production de documents juridiques, financiers, administratifs et académiques de haute précision.

Les atouts concurrentiels majeurs incluent :
- **Précision contextuelle** : Conformité stricte aux réglementations locales (OHADA, SYSCOHADA, codes du travail régionaux).
- **Format haute résolution** : Exports vectoriels PDF certifiés, Word modifiables et classeurs Excel pré-calculés.
- **Accessibilité universelle** : Paiement intégré Mobile Money (Wave, Orange, MTN, Moov) et CB internationale.

## 2. Tableau Prévisionnel de Rentabilité (FCFA)

| Exercice | Chiffre d'Affaires | Coûts Serveurs & IA | Marge Nette | Taux Marge |
| :--- | :--- | :--- | :--- | :--- |
| Année 1 | 25 000 000 | 4 500 000 | 14 200 000 | 56.8% |
| Année 2 | 85 000 000 | 12 000 000 | 52 800 000 | 62.1% |
| Année 3 | 240 000 000 | 28 000 000 | 158 000 000 | 65.8% |

## 3. Dispositions Contractuelles & Engagements

1. Garantie de conformité et révision illimitée sous 48 heures.
2. Sécurité des données : chiffrement de bout en bout et hébergement souverain.
3. Signature électronique opposable conformément aux actes uniformes.
"""

def test_engines():
    print("Testing document generation engines...")
    meta = {
        "doc_id": "SCR-TEST-2026-X1",
        "language": "fr"
    }
    title = "Plan Stratégique & Modèle Financier 2026"

    # Test PDF
    pdf_buf = generate_pdf(SAMPLE_MARKDOWN, title, metadata=meta)
    pdf_bytes = pdf_buf.getvalue()
    assert len(pdf_bytes) > 1000, f"PDF generation failed, size={len(pdf_bytes)}"
    print(f" [OK] PDF generation success: {len(pdf_bytes):,} bytes generated.")

    # Test DOCX
    docx_buf = generate_docx(SAMPLE_MARKDOWN, title, metadata=meta)
    docx_bytes = docx_buf.getvalue()
    assert len(docx_bytes) > 1000, f"DOCX generation failed, size={len(docx_bytes)}"
    print(f" [OK] DOCX generation success: {len(docx_bytes):,} bytes generated.")

    # Test XLSX
    xlsx_buf = generate_xlsx(SAMPLE_MARKDOWN, title, metadata=meta)
    xlsx_bytes = xlsx_buf.getvalue()
    assert len(xlsx_bytes) > 1000, f"XLSX generation failed, size={len(xlsx_bytes)}"
    print(f" [OK] XLSX generation success: {len(xlsx_bytes):,} bytes generated.")

    print(f" Catalog prompt services check: {len(PROMPT_BANK)} expert services loaded in PROMPT_BANK.")
    bp_meta = get_service_meta("plan_affaire")
    print(f" Service meta test ('plan_affaire'): title='{bp_meta['title']}', price_fcfa={bp_meta.get('price_fcfa')}")
    print("ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_engines()
