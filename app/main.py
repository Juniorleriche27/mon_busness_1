from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import health, generate, payments, documents, leads

# Création des tables de la base de données au démarrage
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API FastAPI Scrivia dédiée au traitement lourd (Génération IA Claude, export DOCX/PDF/XLSX, paiements Maketou)."
)

# Configuration CORS pour autoriser le frontend Vercel et le dev local
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(health.router)
app.include_router(generate.router)
app.include_router(payments.router)
app.include_router(documents.router)
app.include_router(leads.router)


@app.get("/")
def root():
    return {
        "message": "Bienvenue sur l'API Backend de Scrivia",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
