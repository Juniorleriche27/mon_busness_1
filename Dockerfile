# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Configuration des variables d'environnement Python
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Dépendances système pour ReportLab, Pillow, PostgreSQL et utilitaire curl pour le healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Création d'un utilisateur non-root dédié pour la sécurité
RUN addgroup --system --gid 1001 scrivia && \
    adduser --system --uid 1001 --gid 1001 --no-create-home scrivia

# Installation des dépendances Python
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copie du code source applicatif
COPY . .

# Création et attribution des droits sur le dossier des uploads locaux
RUN mkdir -p uploads && chown -R scrivia:scrivia /app

# Passage à l'utilisateur non-root
USER scrivia

EXPOSE 8000

# Healthcheck de santé automatique Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Démarrage Uvicorn optimisé pour production avec prise en charge des proxy-headers Nginx
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers", "--forwarded-allow-ips", "*"]
