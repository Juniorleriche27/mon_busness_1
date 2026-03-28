# Scrivia — Arborescence complète du projet

```
scrivia/
├── app/
│   ├── layout.tsx                          ✅ Root layout (polices, metadata)
│   ├── globals.css                         ✅ Design system (couleurs, polices)
│   ├── page.tsx                            ⬜ Page d'accueil /
│   │
│   ├── (public)/
│   │   ├── services/
│   │   │   └── page.tsx                   ⬜ Catalogue 24 services + filtres
│   │   ├── tarifs/
│   │   │   └── page.tsx                   ⬜ Pricing plans + tableau prix acte
│   │   ├── commander/
│   │   │   └── [serviceId]/
│   │   │       └── page.tsx               ⬜ Formulaire commande dynamique
│   │   ├── a-propos/
│   │   │   └── page.tsx                   ⬜ Mission, valeurs, roadmap
│   │   └── contact/
│   │       └── page.tsx                   ⬜ Contact + FAQ accordion
│   │
│   ├── (auth)/
│   │   └── auth/
│   │       └── page.tsx                   ⬜ Connexion / Inscription
│   │
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       └── page.tsx                   ⬜ Tableau de bord (protégé)
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts               ⬜ NextAuth handler
│       ├── generate/
│       │   └── route.ts                   ⬜ POST génération document IA
│       ├── documents/
│       │   ├── route.ts                   ⬜ GET liste documents user
│       │   └── [id]/
│       │       └── download/
│       │           └── route.ts           ⬜ GET téléchargement fichier
│       ├── payment/
│       │   ├── initiate/
│       │   │   └── route.ts               ⬜ POST initiation paiement Maketou
│       │   └── webhook/
│       │       └── route.ts               ⬜ POST webhook Maketou
│       └── user/
│           └── plan/
│               └── route.ts               ⬜ PUT mise à jour plan
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                     ⬜ Navigation principale
│   │   └── Footer.tsx                     ⬜ Footer complet
│   ├── ui/
│   │   ├── Button.tsx                     ⬜ Bouton (variants gold/outline/ghost)
│   │   ├── Card.tsx                       ⬜ Card service
│   │   ├── Badge.tsx                      ⬜ Badge (Populaire/Premium/Pack...)
│   │   ├── Input.tsx                      ⬜ Input stylisé
│   │   ├── Textarea.tsx                   ⬜ Textarea stylisée
│   │   ├── Select.tsx                     ⬜ Select stylisé
│   │   ├── Progress.tsx                   ⬜ Barre de progression
│   │   └── Accordion.tsx                  ⬜ Accordion FAQ
│   └── forms/
│       ├── OrderForm.tsx                  ⬜ Formulaire commande dynamique
│       └── PaymentPanel.tsx               ⬜ Panel sticky résumé + paiement
│
├── lib/
│   ├── prisma.ts                          ✅ Client Prisma singleton
│   ├── anthropic.ts                       ✅ Client Anthropic + model
│   ├── catalog.ts                         ✅ 24 services + categories + plans
│   ├── fees.ts                            ✅ calcFees(), formatFcfa(), formatEur()
│   ├── cn.ts                              ✅ Utilitaire clsx + tailwind-merge
│   ├── auth.ts                            ⬜ Config NextAuth (providers, callbacks)
│   ├── maketou.ts                         ⬜ Client Maketou API
│   ├── cloudinary.ts                      ⬜ Upload fichiers Cloudinary
│   ├── generate-pdf.ts                    ⬜ Génération PDF (@react-pdf/renderer)
│   ├── generate-docx.ts                   ⬜ Génération DOCX (docx package)
│   ├── generate-xlsx.ts                   ⬜ Génération XLSX (exceljs)
│   └── prompts/
│       ├── cv.ts                          ⬜ Prompt système CV
│       ├── lettre.ts                      ⬜ Prompt lettre de motivation
│       ├── linkedin.ts                    ⬜ Prompt LinkedIn
│       ├── pack_carriere.ts               ⬜ Prompt pack carrière
│       ├── bmc.ts                         ⬜ Prompt BMC
│       ├── plan_affaire.ts                ⬜ Prompt plan d'affaires
│       ├── pitch.ts                       ⬜ Prompt pitch deck
│       ├── marketing.ts                   ⬜ Prompt plan marketing
│       ├── finances.ts                    ⬜ Prompt prévisions financières
│       ├── pack_business.ts               ⬜ Prompt pack business
│       ├── archi.ts                       ⬜ Prompt programme architectural
│       ├── devis.ts                       ⬜ Prompt devis construction
│       ├── cdc.ts                         ⬜ Prompt cahier des charges
│       ├── permis.ts                      ⬜ Prompt permis de construire
│       ├── pack_archi.ts                  ⬜ Prompt pack architecture
│       ├── statuts.ts                     ⬜ Prompt statuts société
│       ├── contrat.ts                     ⬜ Prompt contrat
│       ├── financement.ts                 ⬜ Prompt dossier financement
│       ├── trad_s.ts                      ⬜ Prompt traduction courte
│       ├── trad_l.ts                      ⬜ Prompt traduction longue
│       ├── ao.ts                          ⬜ Prompt réponse AO
│       ├── ong.ts                         ⬜ Prompt proposition ONG
│       ├── rapport_stage.ts               ⬜ Prompt rapport de stage
│       └── bourse.ts                      ⬜ Prompt dossier de bourse
│
├── prisma/
│   └── schema.prisma                      ✅ Models User, Document, Payment
│
├── public/
│   └── fonts/                             ⬜ (polices via next/font/google)
│
├── .env.local                             ✅ Variables d'environnement
├── .env                                   ✅ DATABASE_URL (Prisma)
├── next.config.ts                         ✅ Config Next.js
├── tsconfig.json                          ✅ Config TypeScript
├── postcss.config.mjs                     ✅ Config PostCSS
├── package.json                           ✅ Dépendances
└── structure.md                           ✅ Ce fichier
```

## Légende
- ✅ Fait
- ⬜ À faire

## Ordre d'implémentation
1. `lib/auth.ts` → `app/api/auth/[...nextauth]/route.ts` → `app/(auth)/auth/page.tsx`
2. `lib/prompts/cv.ts` → `lib/generate-pdf.ts` → `app/api/generate/route.ts`
3. `app/(public)/commander/[serviceId]/page.tsx` + `components/forms/`
4. `lib/maketou.ts` → `app/api/payment/`
5. `app/(dashboard)/dashboard/page.tsx`
6. Toutes les pages publiques (accueil, services, tarifs, à-propos, contact)
7. Components UI (Navbar, Footer, Button, Card, Badge...)
