# ⚙️ SCRIVIA BACKEND API (FastAPI)

API backend haute performance dédiée au traitement lourd du SaaS Scrivia :
- **Génération IA** : Anthropic Claude 3.5 Sonnet (sans timeout de 15s).
- **Moteur multi-format** : Compilation DOCX (`python-docx`), XLSX (`openpyxl`), PDF (`reportlab`).
- **Paiements Mobile Money** : Intégration Maketou (Wave, Orange Money, MTN, Carte bancaire).
- **Architecture asynchrone** : Traitement d'arrière-plan sans blocage des requêtes HTTP.

---

## 🚀 Déploiement Rapide sur votre Serveur

### Option A : Déploiement avec Docker Compose (Recommandé)

```bash
# 1. Cloner le repo
git clone https://github.com/juniorleriche27/mon_busness_1.git backend
cd backend

# 2. Configurer les variables d'environnement
cp .env.example .env
nano .env

# 3. Lancer l'API et la base PostgreSQL
docker compose up -d --build
```
L'API est immédiatement accessible sur `http://votre-ip:8000/docs`.

---

### Option B : Déploiement direct avec Python & Systemd

```bash
# 1. Installer les dépendances système
sudo apt update && sudo apt install -y python3-pip python3-venv

# 2. Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Lancer le serveur
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 📡 Endpoints Clés

| Méthode | Route | Rôle |
| :--- | :--- | :--- |
| `GET` | `/health` | Statut de l'API |
| `GET` | `/docs` | Documentation interactive Swagger |
| `POST` | `/api/generate` | Génération de document IA (consomme le crédit gratuit ou plan) |
| `POST` | `/api/payment/initiate` | Initiation du paiement Mobile Money avec sauvegarde du brief |
| `POST` | `/api/payment/webhook` | Webhook Maketou : valide le paiement et lance la génération |
| `GET` | `/api/documents` | Liste des documents de l'utilisateur |
| `GET` | `/api/documents/{id}/download` | Téléchargement du fichier généré |
