from typing import Optional, Dict, Any, List
from pydantic import BaseModel, EmailStr


class GenerateRequest(BaseModel):
    service_id: str
    fields: Dict[str, Any]
    language: str = "fr"
    format: str = "pdf"
    user_email: Optional[str] = "demo@scrivia.com"
    user_name: Optional[str] = None


class GenerateResponse(BaseModel):
    document_id: str
    status: str
    file_url: Optional[str] = None
    message: Optional[str] = None


class PaymentInitiateRequest(BaseModel):
    service_id: str
    provider: str  # wave, orange, mtn, card
    fields: Dict[str, Any]
    language: str = "fr"
    format: str = "pdf"
    customer_email: Optional[str] = "client@scrivia.com"
    customer_name: Optional[str] = None
    user_id: Optional[str] = None


class PaymentInitiateResponse(BaseModel):
    payment_url: str
    reference: str
    payment_id: str
    breakdown: Dict[str, int]


class DocumentItem(BaseModel):
    id: str
    service_id: str
    service_name: str
    language: str
    format: str
    status: str
    file_url: Optional[str]
    created_at: str


class DocumentListResponse(BaseModel):
    documents: List[DocumentItem]
