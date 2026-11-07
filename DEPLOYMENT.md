# Guide de Déploiement en Production — Backend Scrivia

Ce document détaille la procédure de déploiement du backend **FastAPI** de Scrivia sur votre serveur dédié ou VPS (Ubuntu 22.04 / 24.04 ou Debian 11 / 12), et sa liaison avec le frontend hébergé sur **Vercel**.

---

## 1. Schéma d'Architecture & Flux de Données

```
┌─────────────────────────────────┐                 ┌─────────────────────────────────┐
│     FRONTEND (Vercel)           │                 │     BACKEND (Serveur Dédié)     │
│  Next.js 16 • React 19          │                 │  FastAPI • Python 3.11          │
│                                 │                 │                                 │
│  - Interface Prestige UI        │                 │  - Moteur IA Claude 3.5 Sonnet  │
│  - Tunnel de commande           │── HTTP POST ───>│  - Compilateur PDF (ReportLab)  │
│  - Dashboard & Suivi temps réel │  /api/generate  │  - Compilateur DOCX & XLSX      │
│  - Consultation & Auth NextAuth │<── HTTP 200 ────│  - PostgreSQL 16 (persistant)   │
└─────────────────────────────────┘    (en ~150ms)  └─────────────────────────────────┘
                                                                    │
                                                                 Tâche de
                                                              fond asynchrone
                                                                    │
                                                                    ▼
                                                            Génération & Stockage
                                                            (aucun timeout Vercel)
```

---

## 2. Méthode 1 : Déploiement Automatisé via Docker (Recommandée)

Cette méthode installe et configure automatiquement Docker, PostgreSQL 16, l'API FastAPI, le pare-feu UFW, Nginx et le renouvellement SSL.

### Étape 1 : Connexion SSH à votre serveur
```bash
ssh root@votre-ip-serveur
```

### Étape 2 : Cloner le dépôt Backend sur le serveur
```bash
git clone https://github.com/juniorleriche27/mon_busness_1.git /opt/scrivia-backend
cd /opt/scrivia-backend
```

### Étape 3 : Rendre exécutable et lancer le script d'installation
```bash
chmod +x deploy/*.sh
sudo ./deploy/setup_server.sh
```

Le script va :
1. Mettre à jour les paquets système et installer Docker, Docker Compose, Nginx et Certbot.
2. Configurer le pare-feu UFW (ports 22, 80 et 443 ouverts, port 8000 protégé).
3. Générer un mot de passe sécurisé pour PostgreSQL dans `.env`.
4. Compiler et démarrer les conteneurs `scrivia-api` et `scrivia-postgres`.
5. Valider le point de santé `/health`.

---

## 3. Configuration Nginx & Certificat SSL Gratuit (HTTPS)

Pour obtenir une URL propre et sécurisée (ex: `https://api.votredomaine.com`) :

### 1. Pointer votre domaine DNS
Dans votre gestionnaire de nom de domaine (Cloudflare, Namecheap, OVH, etc.) :
- Créez un enregistrement de type **A** :
  - **Nom** : `api` (ou `@` si domaine racine)
  - **Valeur** : `L'adresse IP publique de votre serveur`

### 2. Activer la configuration Nginx
```bash
# Copier la configuration préparée
sudo cp deploy/nginx/scrivia-api.conf /etc/nginx/sites-available/scrivia-api

# Remplacer 'api.votredomaine.com' par votre vrai domaine dans le fichier
sudo nano /etc/nginx/sites-available/scrivia-api

# Activer le site et recharger Nginx
sudo ln -s /etc/nginx/sites-available/scrivia-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Obtenir le certificat SSL Let's Encrypt
```bash
sudo certbot --nginx -d api.votredomaine.com
```

Votre backend est désormais accessible en HTTPS sur `https://api.votredomaine.com`.

---

## 4. Liaison avec le Frontend Vercel

Dans votre tableau de bord [Vercel](https://vercel.com/) pour le projet **`mon_busness_1_frontend`** :

1. Allez dans **Settings** $\rightarrow$ **Environment Variables**.
2. Ajoutez / modifiez les variables suivantes :

| Variable | Valeur | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api.votredomaine.com` | URL publique de votre backend pour le client |
| `BACKEND_API_URL` | `https://api.votredomaine.com` | URL du backend pour les Server Actions Next.js |

3. Cliquez sur **Redeploy** sur votre dernier commit.

> Dès cet instant, le frontend Next.js sur Vercel délègue l'intégralité des calculs lourds, de la rédaction IA Claude et de la compilation documentaire à votre serveur dédié, garantissant une exécution illimitée dans le temps sans coupure.

---

## 5. Maintenance, Monitoring & Mises à Jour

### Mise à jour en 1 clic
Lorsque vous poussez du nouveau code sur GitHub, mettez à jour votre serveur en une seule commande :
```bash
cd /opt/scrivia-backend
./deploy/deploy.sh
```

### Surveiller l'état de santé du serveur
```bash
./deploy/monitor.sh
```

### Consulter les logs en temps réel
```bash
docker compose logs -f api
```

### Sauvegarder la base de données PostgreSQL
```bash
docker exec -t scrivia-postgres pg_dump -U scrivia_user scrivia > backup_scrivia_$(date +%Y%m%d_%H%M%S).sql
```
