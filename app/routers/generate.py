from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Document
from app.schemas import GenerateRequest, GenerateResponse
from app.prompts.catalog import get_service_meta
from app.services.claude import call_claude
from app.services.docx_generator import generate_docx
from app.services.xlsx_generator import generate_xlsx
from app.services.pdf_generator import generate_pdf
from app.services.storage import upload_file

router = APIRouter(prefix="/api/generate", tags=["Generation"])


def process_generation_task(
    doc_id: str,
    service_id: str,
    fields: dict,
    language: str,
    file_format: str,
    db_session: Session
):
    """
    Tâche d'arrière-plan exécutée sur le serveur sans bloquer la requête HTTP.
    """
    doc = db_session.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        return

    try:
        # 1. Rédiger le contenu avec Claude
        content = call_claude(service_id, fields, language)
        title = doc.service_name

        # 2. Compiler dans le format demandé
        if file_format == "docx":
            buffer = generate_docx(content, title)
            ext = "docx"
        elif file_format == "xlsx":
            buffer = generate_xlsx(content, title)
            ext = "xlsx"
        else:
            buffer = generate_pdf(content, title)
            ext = "pdf"

        # 3. Stocker le fichier
        filename = f"{doc.user_id}/{service_id}_{doc.id}.{ext}"
        file_url = upload_file(buffer, filename)

        # 4. Mettre à jour le statut du document
        doc.status = "DONE"
        doc.file_url = file_url
        db_session.commit()

    except Exception as e:
        print(f"[Generation Error] {e}")
        doc.status = "FAILED"
        db_session.commit()


@router.post("", response_model=GenerateResponse)
def generate_document_endpoint(
    req: GenerateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Récupérer ou initialiser l'utilisateur
    user = db.query(User).filter(User.email == req.user_email).first()
    if not user:
        user = User(
            email=req.user_email,
            name=req.user_name or req.user_email.split("@")[0],
            docs_limit=1,  # 1 crédit gratuit à l'inscription
            docs_used=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Vérification des quotas
    if user.docs_used >= user.docs_limit:
        raise HTTPException(
            status_code=403,
            detail="Quota atteint. Veuillez passer à un plan supérieur ou régler ce document à l'acte."
        )

    meta = get_service_meta(req.service_id)

    # Créer le document en statut PROCESSING
    doc = Document(
        user_id=user.id,
        service_id=req.service_id,
        service_name=meta["title"],
        language=req.language,
        format=req.format,
        status="PROCESSING",
        fields_data=req.fields
    )
    db.add(doc)
    
    # Incrémenter le quota consommé
    user.docs_used += 1
    db.commit()
    db.refresh(doc)

    # Lancer la génération sur le serveur dédié
    background_tasks.add_task(
        process_generation_task,
        doc.id,
        req.service_id,
        req.fields,
        req.language,
        req.format,
        db
    )

    return GenerateResponse(
        document_id=doc.id,
        status="PROCESSING",
        message="Génération en cours en arrière-plan sur le serveur."
    )
