#!/usr/bin/env bash
# ==============================================================================
# Script de mise à jour rapide en production — Scrivia Backend API
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

echo "=== Mise à jour du Backend Scrivia ==="

# 1. Récupération des dernières modifications Git
echo "1. Récupération du code source Git..."
git pull origin main

# 2. Recompilation de l'image de l'API
echo "2. Recompilation du conteneur API..."
docker compose build api

# 3. Redémarrage sans interruption prolongée
echo "3. Redémarrage des services..."
docker compose up -d

# 4. Nettoyage des anciennes images Docker orphelines
echo "4. Nettoyage du cache Docker..."
docker image prune -f

# 5. Vérification de santé
echo "5. Contrôle du healthcheck..."
sleep 3
if curl -s -f http://127.0.0.1:8000/health | grep -q "ok"; then
    echo "=== SUCCÈS : Le backend est à jour et opérationnel ! ==="
else
    echo "[Attention] Le service ne répond pas correctement. Vérifiez avec 'docker compose logs -f'."
fi
