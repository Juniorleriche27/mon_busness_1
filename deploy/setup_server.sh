#!/usr/bin/env bash
# ==============================================================================
# Script d'installation et déploiement automatisé — Scrivia Backend API
# Testé pour : Ubuntu 22.04 LTS / 24.04 LTS & Debian 11 / 12
# ==============================================================================

set -euo pipefail

# Couleurs pour le terminal
GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GOLD}"
echo "=========================================================="
echo "   SCRIVIA INTELLIGENCE — INSTALLATION SERVEUR BACKEND   "
echo "=========================================================="
echo -e "${NC}"

# 1. Vérification des privilèges root/sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[Erreur] Ce script doit être exécuté avec les privilèges root ou via sudo.${NC}"
    exit 1
fi

echo -e "${GREEN}[1/6] Mise à jour du système d'exploitation...${NC}"
apt-get update -y
apt-get upgrade -y
apt-get install -y --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw \
    jq \
    nginx \
    certbot \
    python3-certbot-nginx

# 2. Installation de Docker & Docker Compose si absents
echo -e "${GREEN}[2/6] Vérification et installation de Docker Engine...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installation officielle de Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm -f get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    echo "Docker est déjà installé."
fi

# 3. Configuration sécurisée du Pare-feu UFW
echo -e "${GREEN}[3/6] Configuration du Pare-feu UFW...${NC}"
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# Ne pas exposer directement le port 8000 ou 5432 au public (Nginx servira de passerelle)
ufw --force enable

# 4. Configuration du fichier d'environnement .env
echo -e "${GREEN}[4/6] Initialisation des variables d'environnement...${NC}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
    echo "Création de .env à partir du modèle..."
    cp .env.example .env
    
    # Génération d'un mot de passe PostgreSQL aléatoire et sécurisé
    PG_PASS=$(openssl rand -hex 16)
    sed -i "s/scrivia_secret_pass/$PG_PASS/g" .env
    sed -i "s/ENVIRONMENT=development/ENVIRONMENT=production/g" .env
    echo "Mot de passe PostgreSQL généré avec succès dans .env."
    echo -e "${GOLD}[IMPORTANT] Pensez à éditer .env pour renseigner votre ANTHROPIC_API_KEY.${NC}"
fi

# 5. Démarrage des conteneurs via Docker Compose
echo -e "${GREEN}[5/6] Démarrage des conteneurs applicatifs (FastAPI + PostgreSQL)...${NC}"
docker compose down || true
docker compose up -d --build

# 6. Vérification du Healthcheck
echo -e "${GREEN}[6/6] Contrôle de l'état de santé du backend...${NC}"
sleep 5

MAX_RETRIES=10
COUNT=0
HEALTHY=false

while [ $COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f http://127.0.0.1:8000/health > /dev/null; then
        HEALTHY=true
        break
    fi
    echo "En attente du démarrage complet de l'API (essai $((COUNT+1))/$MAX_RETRIES)..."
    sleep 3
    COUNT=$((COUNT+1))
done

if [ "$HEALTHY" = true ]; then
    SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
    echo -e "${GREEN}"
    echo "=========================================================="
    echo "   DÉPLOIEMENT RÉUSSI — BACKEND SCRIVIA EN LIGNE !       "
    echo "=========================================================="
    echo -e "${NC}"
    echo "API locale opérationnelle sur : http://127.0.0.1:8000"
    echo "Adresse IP publique détectée : http://${SERVER_IP}:8000"
    echo ""
    echo "PROCHAINES ÉTAPES POUR LA MISE EN PRODUCTION COMPLETE :"
    echo "1. Configurez Nginx en copiant deploy/nginx/scrivia-api.conf :"
    echo "   cp deploy/nginx/scrivia-api.conf /etc/nginx/sites-available/scrivia-api"
    echo "   ln -s /etc/nginx/sites-available/scrivia-api /etc/nginx/sites-enabled/"
    echo "   nginx -t && systemctl reload nginx"
    echo ""
    echo "2. Obtenez un certificat SSL gratuit avec Let's Encrypt :"
    echo "   certbot --nginx -d api.votredomaine.com"
    echo ""
    echo "3. Dans votre tableau de bord Vercel (mon_busness_1_frontend) :"
    echo "   Ajoutez la variable d'environnement :"
    echo "   NEXT_PUBLIC_API_URL=https://api.votredomaine.com (ou http://${SERVER_IP}:8000)"
else
    echo -e "${RED}[Attention] L'API met plus de temps que prévu à démarrer.${NC}"
    echo "Consultez les logs d'exécution via : docker compose logs -f"
fi
