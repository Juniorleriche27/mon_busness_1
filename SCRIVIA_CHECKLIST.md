# SCRIVIA — Checklist d'implémentation

> Consulter ce fichier avant chaque session de travail.
> Marquer chaque tâche avec [x] quand elle est terminée.
> ⚠️ EXIGENCE TRANSVERSALE : Le site doit être 100% responsive (mobile, tablette, desktop) sur toutes les pages sans exception.

---

## PHASE 0 — Setup & Structure ✅
- [x] Initialiser le projet Next.js 14 (App Router) + TypeScript
- [x] Configurer Tailwind CSS
- [x] Installer toutes les dépendances (prisma, next-auth, docx, exceljs, anthropic, maketou, cloudinary, @react-pdf/renderer)
- [x] Créer le fichier `.env.example` avec toutes les variables d'environnement
- [x] Configurer le schema Prisma (User, Document, Payment, enums Plan/Status)
- [x] Configurer les polices : Cormorant Garamond + Outfit (Google Fonts)
- [x] Configurer le design system CSS variables (couleurs, polices)

---

## PHASE 1 — Auth (NextAuth) ✅
- [x] Configurer NextAuth.js (`/app/api/auth/[...nextauth]/route.ts`)
- [x] Provider Google OAuth
- [x] Provider Email + mot de passe (bcrypt)
- [x] Page `/auth` — onglets Connexion / Inscription
- [x] Panel gauche avec arguments Scrivia
- [x] Logique : 1 document gratuit à l'inscription (docsLimit=1)
- [x] Middleware de protection des routes `/dashboard` et `/commander`

---

## PHASE 2 — Base de données & API de base ✅
- [x] Route `GET /api/documents` — liste des documents de l'utilisateur
- [x] Route `GET /api/documents/[id]/download` — téléchargement
- [x] Route `PUT /api/user/plan` — mise à jour du plan
- [x] Utilitaire Prisma client (`/lib/prisma.ts`)
- [x] Utilitaire de calcul des frais (`/lib/fees.ts` — règle 8%)

---

## PHASE 3 — Génération IA (Claude API) ✅
- [x] Configurer le client Anthropic (`/lib/anthropic.ts`)
- [x] Créer les prompts système pour chaque service (`/lib/prompts/`)
  - [x] cv, lettre, linkedin, pack_carriere
  - [x] bmc, plan_affaire, pitch, marketing, finances, pack_business
  - [x] archi, devis, cdc, permis, pack_archi
  - [x] statuts, contrat, financement
  - [x] trad_s, trad_l
  - [x] ao, ong
  - [x] rapport_stage, bourse
- [x] Route `POST /api/generate`
  - [x] Appel Claude API avec prompt + champs utilisateur
  - [x] Génération PDF (@react-pdf/renderer)
  - [x] Génération DOCX (docx package)
  - [x] Génération XLSX (exceljs)
  - [x] Upload sur Cloudinary
  - [x] Sauvegarde Document en base
  - [x] Retourne `{ documentId, fileUrl, status }`

---

## PHASE 4 — Paiement Maketou ✅
- [x] Configurer le client Maketou (`/lib/maketou.ts`)
- [x] Route `POST /api/payment/initiate`
  - [x] Calcul frais 8% + total
  - [x] Initiation paiement (Wave, Orange Money, MTN, Carte)
  - [x] Retourne `{ paymentUrl, reference }`
- [x] Route `POST /api/payment/webhook`
  - [x] Vérification signature Maketou
  - [x] Mise à jour statut Payment en base
  - [x] Déclenchement génération document si paiement confirmé

---

## PHASE 5 — Pages Frontend ✅

### Page `/` — Accueil
- [x] Hero : badge animé + titre + CTA
- [x] Section "Comment ça fonctionne" (4 étapes)
- [x] Grille 6 services populaires
- [x] Aperçu 3 plans d'abonnement
- [x] Section confiance (6 arguments)
- [x] Footer complet

### Page `/services` — Catalogue
- [x] Filtres par catégorie (tabs) : Carrière, Business, Architecture, Juridique, Traduction, AO, Académique
- [x] Grille 24 cards de services
- [x] Badges : Populaire / Premium / Pack / Exclusif / Nouveau
- [x] Chaque card : icône, nom, description, prix FCFA + €, bouton commander

### Page `/tarifs` — Pricing
- [x] Section 3 plans (Starter 9900, Pro 24900, Business 59900 FCFA)
- [x] Toggle mensuel / annuel (−15%)
- [x] Tableau complet 24 services prix à l'acte
- [x] Notice frais 8% visible et calculée

### Page `/commander/[serviceId]` — Commande
- [x] Formulaire dynamique selon serviceId
- [x] Champs spécifiques pour chacun des 24 services
- [x] Sélecteur langue (FR, EN, ES, PT, AR, DE)
- [x] Sélecteur format (PDF, DOCX, XLSX)
- [x] Panel résumé sticky : prix de base / frais 8% / total
- [x] Modes de paiement (Wave, Orange Money, MTN, Carte)

### Page `/dashboard` — Tableau de bord (protégé)
- [x] Stats : docs générés, restants, plan actif
- [x] Barre de progression utilisation mensuelle
- [x] Historique documents (nom, date, statut, format, télécharger)
- [x] Onglets : Vue d'ensemble / Mes documents / Mon abonnement / Paramètres

### Page `/a-propos`
- [x] Mission et positionnement
- [x] 3 valeurs clés
- [x] 4 chiffres du marché
- [x] Roadmap 4 phases

### Page `/contact`
- [x] Méthodes de contact : WhatsApp, Email, Bureau
- [x] Formulaire de contact
- [x] FAQ interactive (5 questions accordion)

---

## PHASE 6 — Design & Polish ✅
- [x] Design system CSS variables (fond #07070f, or #c8a96e, polices Cormorant + Outfit)
- [x] Animations CSS : fadeInUp, shimmer, pulse-gold, card-hover, reveal classes
- [x] Responsive mobile sur toutes les pages (Tailwind breakpoints sm/lg)
- [x] SEO metadata par page :
  - [x] `/` — metadata dans `app/layout.tsx`
  - [x] `/services` — `app/(public)/services/layout.tsx`
  - [x] `/tarifs` — `app/(public)/tarifs/layout.tsx`
  - [x] `/contact` — `app/(public)/contact/layout.tsx`
  - [x] `/a-propos` — `app/(public)/a-propos/layout.tsx`
  - [x] `/commander/[serviceId]` — `generateMetadata` dynamique
- [ ] Favicon + og:image (à ajouter manuellement dans `/public/`)

---

## PHASE 7 — Déploiement ✅
- [x] `next.config.ts` — remotePatterns Cloudinary + Google, security headers, canvas alias
- [x] `vercel.json` — buildCommand avec `prisma generate`, région cdg1
- [x] `.env.example` — toutes les variables documentées
- [ ] Configurer les vraies variables d'env sur Vercel Dashboard
- [ ] Configurer Railway (PostgreSQL prod) + DATABASE_URL
- [ ] Migrations Prisma en production : `npx prisma migrate deploy`
- [ ] Configurer webhook Maketou → `https://votre-domaine.vercel.app/api/payment/webhook`
- [ ] Test de bout en bout : commande → paiement → génération → téléchargement

---

## Déploiement — Instructions rapides

### 1. Railway (base de données)
```bash
# Créer un projet Railway + service PostgreSQL
# Copier DATABASE_URL depuis Railway → variables Vercel
```

### 2. Vercel
```bash
# Importer le repo, rootDir = scrivia/
# Ajouter toutes les variables du .env.example
# buildCommand s'exécute automatiquement (prisma generate + next build)
```

### 3. Prisma migrate (prod)
```bash
npx prisma migrate deploy
```

### 4. Maketou webhook
```
URL : https://votre-domaine.vercel.app/api/payment/webhook
Secret : valeur de MAKETOU_SECRET dans les variables Vercel
```

---

_Dernière mise à jour : 2026-03-28 — Phases 0 à 7 complètes_
