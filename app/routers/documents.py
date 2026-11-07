import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document, User
from app.schemas import DocumentListResponse, DocumentItem

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.get("", response_model=DocumentListResponse)
def list_documents(user_email: str = "demo@scrivia.com", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        return DocumentListResponse(documents=[])

    docs = db.query(Document).filter(Document.user_id == user.id).order_by(Document.created_at.desc()).all()
    
    items = [
        DocumentItem(
            id=d.id,
            service_id=d.service_id,
            service_name=d.service_name,
            language=d.language or "fr",
            format=d.format or "pdf",
            status=d.status or "PROCESSING",
            file_url=d.file_url,
            created_at=d.created_at.isoformat() if d.created_at else ""
        )
        for d in docs
    ]
    return DocumentListResponse(documents=items)


@router.get("/{id}")
def get_document(id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document introuvable")
    return {
        "id": doc.id,
        "service_id": doc.service_id,
        "service_name": doc.service_name,
        "status": doc.status,
        "file_url": doc.file_url,
        "format": doc.format,
        "language": doc.language,
        "created_at": doc.created_at.isoformat() if doc.created_at else None
    }


@router.get("/{id}/download")
def download_document(id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc or not doc.file_url:
        raise HTTPException(status_code=404, detail="Fichier non prêt ou indisponible")

    if doc.file_url.startswith("http://") or doc.file_url.startswith("https://"):
        return RedirectResponse(url=doc.file_url)

    # Fichier stocké localement
    local_path = doc.file_url.lstrip("/")
    if os.path.exists(local_path):
        return FileResponse(local_path, filename=f"{doc.service_id}_{doc.id}.{doc.format}")

    raise HTTPException(status_code=404, detail="Fichier introuvable sur le disque")
