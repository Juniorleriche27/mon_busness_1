#!/usr/bin/env bash
# ==============================================================================
# Script de monitoring et santé — Scrivia Backend API
# ==============================================================================

echo "=== STATUT DU SYSTÈME SCRIVIA ==="
echo "1. Conteneurs Docker en cours d'exécution :"
docker compose ps

echo ""
echo "2. Utilisation des ressources (CPU / RAM) :"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""
echo "3. Test du point de santé API :"
curl -i http://127.0.0.1:8000/health

echo ""
echo "4. Espace disque des volumes Docker :"
docker system df -v
