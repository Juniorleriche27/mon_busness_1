import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App config
    PROJECT_NAME: str = "Scrivia Backend API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Server & CORS
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://scrivia.vercel.app",
        "https://mon-busness-1-frontend.vercel.app",
        "https://mon-busness-1-frontend-qzrv.vercel.app",
        "*"
    ]
    
    # Database (PostgreSQL or SQLite fallback)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./scrivia.db"
    )
    
    # AI - Anthropic
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")
    
    # Cloudinary storage
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    # Maketou Payments
    MAKETOU_API_KEY: str = os.getenv("MAKETOU_API_KEY", "")
    MAKETOU_SECRET: str = os.getenv("MAKETOU_SECRET", "")
    MAKETOU_BASE_URL: str = os.getenv("MAKETOU_BASE_URL", "https://api.maketou.com/v1")
    
    # Legacy Portfolio settings (if used)
    MONGO_URI: str = os.getenv("MONGO_URI", "")
    MONGO_DB: str = os.getenv("MONGO_DB", "portfolio")
    COHERE_API_KEY: str = os.getenv("COHERE_API_KEY", "")
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM: str = os.getenv("SMTP_FROM", "")
    SMTP_TO: str = os.getenv("SMTP_TO", "senirolamadokou@gmail.com")

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
