from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    plan = Column(String, default="FREE")  # FREE, STARTER, PRO, BUSINESS
    docs_used = Column(Integer, default=0)
    docs_limit = Column(Integer, default=1)  # 1 free document offered
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    documents = relationship("Document", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    orders = relationship("Order", back_populates="user")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    service_id = Column(String, nullable=False, index=True)
    service_name = Column(String, nullable=False)
    language = Column(String, default="fr")
    format = Column(String, default="pdf")  # pdf, docx, xlsx
    status = Column(String, default="PROCESSING")  # PROCESSING, DONE, FAILED
    file_url = Column(String, nullable=True)
    fields_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="documents")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    reference = Column(String, unique=True, index=True, nullable=False)
    service_id = Column(String, nullable=False)
    provider = Column(String, nullable=False)  # wave, orange, mtn, card
    amount = Column(Integer, nullable=False)
    fees = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    language = Column(String, default="fr")
    format = Column(String, default="pdf")
    fields_data = Column(JSON, nullable=False)  # Stores the full form fields!
    status = Column(String, default="pending")  # pending, paid, failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    fees = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    service_id = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, success, failed
    provider = Column(String, nullable=False)
    reference = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="payments")
    order = relationship("Order", back_populates="payment")
