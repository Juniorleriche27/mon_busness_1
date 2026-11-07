import hmac
import hashlib
import httpx
from typing import Dict, Any
from app.config import settings


async def initiate_maketou_payment(
    amount: int,
    fees: int,
    total: int,
    reference: str,
    service_id: str,
    provider: str,
    customer_email: str = None,
    customer_name: str = None,
) -> Dict[str, Any]:
    """
    Initie une session de paiement Maketou Mobile Money / Carte.
    """
    if not settings.MAKETOU_API_KEY:
        # Simulation en mode développement
        return {
            "payment_url": f"http://localhost:3000/dashboard?payment=success&ref={reference}",
            "reference": reference,
            "status": "pending"
        }

    payload = {
        "amount": total,
        "currency": "XOF",
        "reference": reference,
        "payment_method": provider,
        "callback_url": f"http://{settings.HOST}:{settings.PORT}/api/payment/webhook",
        "return_url": "https://scrivia.vercel.app/dashboard?payment=success",
        "metadata": {
            "service_id": service_id,
            "base_amount": amount,
            "fees": fees
        },
        "customer": {
            "email": customer_email,
            "name": customer_name
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.MAKETOU_API_KEY}"
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{settings.MAKETOU_BASE_URL}/payments/initiate",
            json=payload,
            headers=headers,
            timeout=15.0
        )
        res.raise_for_status()
        return res.json()


def verify_webhook_signature(payload_bytes: bytes, signature: str) -> bool:
    """
    Vérifie la signature HMAC-SHA256 du webhook Maketou.
    """
    if not settings.MAKETOU_SECRET:
        return True  # Mode dev sans clé configurée

    expected = hmac.new(
        settings.MAKETOU_SECRET.encode(),
        payload_bytes,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)
