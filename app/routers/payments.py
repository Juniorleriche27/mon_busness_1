import time
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Order, Payment, Document
from app.schemas import PaymentInitiateRequest, PaymentInitiateResponse
from app.prompts.catalog import get_service_meta
from app.services.maketou import initiate_maketou_payment, verify_webhook_signature
from app.routers.generate import process_generation_task

router = APIRouter(prefix="/api/payment", tags=["Payments"])

FEES_PERCENT = 0.08  # Frais de transaction Maketou 8%


@router.post("/initiate", response_model=PaymentInitiateResponse)
async def initiate_payment(
    req: PaymentInitiateRequest,
    db: Session = Depends(get_db)
):
    # 1. Vérifier le service et son tarif
    meta = get_service_meta(req.service_id)
    price = meta["price_fcfa"]
    fees = int(round(price * FEES_PERCENT))
    total = price + fees

    # 2. Récupérer ou créer l'utilisateur
    user = db.query(User).filter(User.email == req.customer_email).first()
    if not user:
        user = User(
            email=req.customer_email,
            name=req.customer_name or "Client",
            docs_limit=1,
            docs_used=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    reference = f"SCR-{int(time.time())}-{user.id[:6]}"

    # 3. Enregistrer l'intention de commande avec TOUS LES CHAMPS en base (Résout la faille critique)
    order = Order(
        user_id=user.id,
        reference=reference,
        service_id=req.service_id,
        provider=req.provider,
        amount=price,
        fees=fees,
        total=total,
        language=req.language,
        format=req.format,
        fields_data=req.fields,  # Les champs du brief sont sauvegardés en BDD !
        status="pending"
    )
    db.add(order)

    # 4. Enregistrer la trace de paiement
    payment = Payment(
        user_id=user.id,
        amount=price,
        fees=fees,
        total=total,
        service_id=req.service_id,
        provider=req.provider,
        reference=reference,
        status="pending"
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    # 5. Initier auprès de Maketou
    result = await initiate_maketou_payment(
        amount=price,
        fees=fees,
        total=total,
        reference=reference,
        service_id=req.service_id,
        provider=req.provider,
        customer_email=req.customer_email,
        customer_name=req.customer_name
    )

    return PaymentInitiateResponse(
        payment_url=result.get("payment_url", ""),
        reference=reference,
        payment_id=payment.id,
        breakdown={"price": price, "fees": fees, "total": total}
    )


@router.post("/webhook")
async def payment_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    body_bytes = await request.body()
    signature = request.headers.get("x-maketou-signature", "")

    # Vérification signature
    if not verify_webhook_signature(body_bytes, signature):
        raise HTTPException(status_code=401, detail="Signature invalide")

    payload = await request.json()
    reference = payload.get("reference")
    status = payload.get("status", "")

    if not reference:
        raise HTTPException(status_code=400, detail="Référence manquante")

    # Mettre à jour le paiement
    payment = db.query(Payment).filter(Payment.reference == reference).first()
    if payment:
        payment.status = status

    # Récupérer la commande liée
    order = db.query(Order).filter(Order.reference == reference).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")

    order.status = status
    db.commit()

    # Si paiement validé -> déclencher immédiatement la génération IA du document !
    if status in ["success", "completed"]:
        meta = get_service_meta(order.service_id)
        doc = Document(
            user_id=order.user_id,
            service_id=order.service_id,
            service_name=meta["title"],
            language=order.language,
            format=order.format,
            status="PROCESSING",
            fields_data=order.fields_data
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # Exécuter la génération sur le serveur
        background_tasks.add_task(
            process_generation_task,
            doc.id,
            order.service_id,
            order.fields_data,
            order.language,
            order.format,
            db
        )

    return {"received": True}


@router.get("/status/{reference}")
def get_payment_status(reference: str, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.reference == reference).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Paiement introuvable")
    return {
        "reference": payment.reference,
        "status": payment.status,
        "amount": payment.amount,
        "total": payment.total
    }
