export type ServiceCategory =
  | "carriere"
  | "business"
  | "architecture"
  | "juridique"
  | "traduction"
  | "ao"
  | "academique";

export type ServiceBadge = "Populaire" | "Premium" | "Pack" | "Exclusif" | "Nouveau";

export interface ServiceField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  options?: string[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  step: number;
}

export interface ServiceStep {
  number: number;
  title: string;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  priceFcfa: number | null;
  badge?: ServiceBadge;
  icon: string;
  steps: ServiceStep[];
  fields: ServiceField[];
}

export const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: "carriere",      label: "Carrière" },
  { id: "business",     label: "Business" },
  { id: "architecture", label: "Architecture" },
  { id: "juridique",    label: "Juridique" },
  { id: "traduction",   label: "Traduction" },
  { id: "ao",           label: "Appels d'offres" },
  { id: "academique",   label: "Académique" },
];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceFcfa: 7425,
    docs: 5,
    features: ["5 documents/mois", "PDF uniquement", "Tous services Carrière", "Support email"],
  },
  {
    id: "pro",
    name: "Pro",
    priceFcfa: 18675,
    docs: 20,
    badge: "Populaire",
    features: ["20 documents/mois", "PDF + DOCX + XLSX", "Tous les 24 services", "Support prioritaire", "Historique 6 mois"],
  },
  {
    id: "business",
    name: "Business",
    priceFcfa: 44925,
    docs: 999,
    features: ["Documents illimités", "Tous formats", "Tous les 24 services", "Support dédié", "API access"],
  },
];

export const SERVICES: Service[] = [

  // ─── CARRIÈRE ──────────────────────────────────────────────────────────────
  {
    id: "cv",
    category: "carriere",
    title: "CV Professionnel",
    description: "CV ATS-compatible, structuré et optimisé pour décrocher des entretiens.",
    priceFcfa: 3675,
    badge: "Populaire",
    icon: "FileText",
    steps: [
      { number: 1, title: "Informations personnelles" },
      { number: 2, title: "Objectif & Résumé" },
      { number: 3, title: "Expériences professionnelles" },
      { number: 4, title: "Formation & Certifications" },
      { number: 5, title: "Compétences techniques & Soft skills" },
      { number: 6, title: "Langues, Prix & Extras" },
      { number: 7, title: "Personnalisation & Format" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "full_name",       label: "Nom complet",                type: "text",     required: true },
      { step: 1, key: "email",           label: "Email professionnel",         type: "text",     required: true },
      { step: 1, key: "telephone",       label: "Téléphone / WhatsApp",        type: "text",     required: true },
      { step: 1, key: "ville_pays",      label: "Ville, Pays",                 type: "text",     required: true },
      { step: 1, key: "linkedin_url",    label: "URL LinkedIn (si existant)",  type: "text",     placeholder: "linkedin.com/in/..." },
      { step: 1, key: "site_portfolio",  label: "Site / Portfolio",            type: "text",     placeholder: "https://..." },
      { step: 1, key: "nationalite",     label: "Nationalité",                 type: "text" },
      { step: 1, key: "date_naissance",  label: "Date de naissance (optionnel)",type: "text",    placeholder: "JJ/MM/AAAA — selon les pratiques locales" },
      // Step 2
      { step: 2, key: "poste_vise",      label: "Poste visé",                  type: "text",     required: true },
      { step: 2, key: "secteur_vise",    label: "Secteur d'activité visé",     type: "text",     required: true },
      { step: 2, key: "type_contrat",    label: "Type de contrat recherché",   type: "select",   options: ["CDI", "CDD", "Freelance", "Stage", "Alternance", "Consultant"] },
      { step: 2, key: "disponibilite",   label: "Disponibilité",               type: "text",     placeholder: "Immédiat / 1 mois / date précise" },
      { step: 2, key: "pretentions_salariales", label: "Prétentions salariales (optionnel)", type: "text", placeholder: "Ex: 500 000 – 700 000 FCFA / mois", hint: "Utile pour personnaliser le CV selon le poste" },
      { step: 2, key: "accroche",        label: "Accroche professionnelle",    type: "textarea", required: true, placeholder: "3-4 phrases décrivant votre valeur unique, votre positionnement..." },
      // Step 3
      { step: 3, key: "exp1_poste",      label: "Expérience 1 — Poste",        type: "text",     required: true },
      { step: 3, key: "exp1_entreprise", label: "Expérience 1 — Entreprise",   type: "text",     required: true },
      { step: 3, key: "exp1_dates",      label: "Expérience 1 — Dates",        type: "text",     placeholder: "Jan 2022 – Déc 2023" },
      { step: 3, key: "exp1_localisation", label: "Expérience 1 — Lieu",       type: "text",     placeholder: "Lomé, Togo / Paris, France" },
      { step: 3, key: "exp1_missions",   label: "Expérience 1 — Missions & réalisations", type: "textarea", required: true, placeholder: "Vos responsabilités, projets clés, résultats chiffrés...", hint: "Incluez des chiffres : +30% de CA, 50 clients gérés, budget de 5M FCFA..." },
      { step: 3, key: "exp2_poste",      label: "Expérience 2 — Poste",        type: "text" },
      { step: 3, key: "exp2_entreprise", label: "Expérience 2 — Entreprise",   type: "text" },
      { step: 3, key: "exp2_dates",      label: "Expérience 2 — Dates",        type: "text" },
      { step: 3, key: "exp2_missions",   label: "Expérience 2 — Missions & réalisations", type: "textarea", placeholder: "Missions, projets, résultats..." },
      { step: 3, key: "exp3_missions",   label: "Expérience 3 (poste / entreprise / dates / missions)", type: "textarea", placeholder: "Synthèse de la 3e expérience si applicable" },
      { step: 3, key: "exp_freelance",   label: "Missions freelance / consulting (si applicable)", type: "textarea", placeholder: "Projets indépendants, clients, résultats obtenus..." },
      // Step 4
      { step: 4, key: "formation1",      label: "Formation principale (diplôme, école, dates)", type: "textarea", required: true, placeholder: "Ex: Master Finance, HECM Lomé, 2019-2021" },
      { step: 4, key: "formation2",      label: "Autres formations / diplômes", type: "textarea", placeholder: "Baccalauréat, formations courtes..." },
      { step: 4, key: "certifications",  label: "Certifications & formations en ligne", type: "textarea", placeholder: "Coursera, Google, Microsoft, PMP..." },
      { step: 4, key: "these_memoire",   label: "Thèse / Mémoire (si applicable)", type: "textarea", placeholder: "Titre, directeur, note obtenue — pour les profils académiques" },
      // Step 5
      { step: 5, key: "comp_techniques", label: "Compétences techniques",      type: "textarea", required: true, placeholder: "Logiciels, outils, langages, frameworks..." },
      { step: 5, key: "comp_sectorielles",label: "Compétences sectorielles",   type: "textarea", placeholder: "Expertise spécifique au secteur visé : réglementation, normes, processus métier..." },
      { step: 5, key: "comp_soft",       label: "Soft skills",                 type: "textarea", placeholder: "Leadership, communication, gestion de projet, négociation..." },
      { step: 5, key: "comp_manageriales",label: "Compétences managériales",   type: "textarea", placeholder: "Taille d'équipe encadrée, type de management, projets pilotés..." },
      // Step 6
      { step: 6, key: "langues",         label: "Langues parlées",             type: "textarea", required: true, placeholder: "Français (natif), Anglais (C1), Arabe (B2)..." },
      { step: 6, key: "distinctions",    label: "Prix, distinctions, publications", type: "textarea", placeholder: "Récompenses, articles publiés, conférences..." },
      { step: 6, key: "loisirs",         label: "Loisirs & engagements",       type: "text",     placeholder: "Sport, bénévolat, associatif..." },
      { step: 6, key: "references",      label: "Références professionnelles", type: "textarea", placeholder: "Nom, poste, contact de 1-2 personnes pouvant vous recommander", hint: "Optionnel — à inclure seulement si demandé dans l'offre" },
      // Step 7
      { step: 7, key: "style_cv",        label: "Style de CV souhaité",        type: "select",   options: ["Classique / sobre", "Moderne / coloré", "Créatif", "Minimaliste", "ATS optimisé (texte uniquement)"], hint: "Le style ATS est recommandé pour les grandes entreprises qui utilisent des logiciels de tri" },
      { step: 7, key: "langue_cv",       label: "Langue du CV",                type: "select",   options: ["Français", "Anglais", "Bilingue FR/EN"] },
      { step: 7, key: "infos_speciales", label: "Informations complémentaires",type: "textarea", placeholder: "Tout ce qui n'a pas été couvert et qui est pertinent pour votre profil..." },
    ],
  },

  {
    id: "lettre",
    category: "carriere",
    title: "Lettre de motivation",
    description: "Lettre percutante, adaptée au poste et à l'entreprise ciblée.",
    priceFcfa: 2175,
    badge: "Populaire",
    icon: "Mail",
    steps: [
      { number: 1, title: "Candidat & Cible" },
      { number: 2, title: "Votre profil & atouts" },
      { number: 3, title: "Motivation & Connaissance entreprise" },
      { number: 4, title: "Personnalisation & Ton" },
      { number: 5, title: "Finalisation" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "full_name",         label: "Nom complet",              type: "text",     required: true },
      { step: 1, key: "email",             label: "Email",                    type: "text",     required: true },
      { step: 1, key: "telephone",         label: "Téléphone",                type: "text" },
      { step: 1, key: "ville",             label: "Ville de résidence",       type: "text",     placeholder: "Lomé, Abidjan, Dakar..." },
      { step: 1, key: "poste",             label: "Poste visé",               type: "text",     required: true },
      { step: 1, key: "entreprise_cible",  label: "Entreprise cible",         type: "text",     required: true },
      { step: 1, key: "secteur",           label: "Secteur de l'entreprise",  type: "text" },
      { step: 1, key: "source_offre",      label: "Source de l'offre",        type: "text",     placeholder: "LinkedIn, jobboard, recommandation...", hint: "Permet de personnaliser l'introduction de la lettre" },
      { step: 1, key: "interlocuteur",     label: "Nom du recruteur / DRH (si connu)", type: "text", placeholder: "Madame X, Monsieur Y..." },
      // Step 2
      { step: 2, key: "experience_resume", label: "Résumé de votre expérience", type: "textarea", required: true, placeholder: "Votre parcours en 3-4 lignes..." },
      { step: 2, key: "formation_principale", label: "Formation principale",   type: "text",     placeholder: "Master RH, Université de Lomé, 2022" },
      { step: 2, key: "atouts",            label: "Vos 3 atouts principaux pour ce poste", type: "textarea", required: true, hint: "Soyez précis : compétences techniques, expériences concrètes, qualités distinctives" },
      { step: 2, key: "realisation_cle",   label: "Réalisation clé à valoriser", type: "textarea", placeholder: "Un projet, résultat chiffré, succès concret...", hint: "Ex: J'ai augmenté les ventes de 40% en 6 mois grâce à..." },
      { step: 2, key: "competences_cles",  label: "Compétences clés maîtrisées", type: "textarea", placeholder: "Listez 5-8 compétences directement liées au poste..." },
      // Step 3
      { step: 3, key: "connaissance_entreprise", label: "Ce que vous savez de l'entreprise", type: "textarea", required: true, placeholder: "Valeurs, produits, actualité, culture...", hint: "Montrez que vous avez fait vos recherches — c'est ce qui différencie les bonnes lettres" },
      { step: 3, key: "pourquoi_entreprise",label: "Pourquoi CETTE entreprise plutôt qu'une autre", type: "textarea", required: true, placeholder: "Ce qui vous attire spécifiquement : projet, mission, culture, réputation..." },
      { step: 3, key: "motivation",        label: "Votre motivation profonde pour ce poste", type: "textarea", required: true },
      // Step 4
      { step: 4, key: "valeur_ajoutee",    label: "Ce que vous apportez spécifiquement", type: "textarea", placeholder: "Compétence rare, réseau, idée, perspective unique..." },
      { step: 4, key: "projet_court_terme",label: "Ce que vous voulez accomplir en 6 mois dans ce poste", type: "textarea", placeholder: "Montre votre proactivité et votre vision..." },
      { step: 4, key: "ton_souhaite",      label: "Ton souhaité",             type: "select",   options: ["Professionnel classique", "Moderne & dynamique", "Formel & institutionnel", "Créatif"] },
      { step: 4, key: "longueur",          label: "Longueur souhaitée",       type: "select",   options: ["Courte (1/2 page)", "Standard (3/4 page)", "Complète (1 page entière)"] },
      // Step 5
      { step: 5, key: "disponibilite",     label: "Disponibilité",            type: "text",     placeholder: "Immédiat, 1 mois de préavis, à partir du..." },
      { step: 5, key: "infos_speciales",   label: "Informations complémentaires", type: "textarea", placeholder: "Mobilité géographique, situation de handicap déclarée, période d'essai souhaitée..." },
    ],
  },

  {
    id: "linkedin",
    category: "carriere",
    title: "Optimisation LinkedIn",
    description: "Profil LinkedIn optimisé pour attirer recruteurs et clients.",
    priceFcfa: 5925,
    icon: "Linkedin",
    steps: [
      { number: 1, title: "Identité professionnelle" },
      { number: 2, title: "Résumé & Accroche" },
      { number: 3, title: "Expériences & Formation" },
      { number: 4, title: "Compétences & Réseau" },
      { number: 5, title: "Objectifs & Stratégie" },
      { number: 6, title: "Contenu & Personal branding" },
      { number: 7, title: "Personnalisation finale" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "full_name",           label: "Nom complet",                    type: "text",     required: true },
      { step: 1, key: "titre_professionnel", label: "Titre professionnel souhaité",   type: "text",     required: true, placeholder: "Expert Finance | CFO | Consultant UEMOA", hint: "C'est le titre qui s'affiche sous votre nom — optimisez-le pour les mots-clés recruteurs" },
      { step: 1, key: "secteur",             label: "Secteur d'activité",             type: "text",     required: true },
      { step: 1, key: "pays_ville",          label: "Localisation",                   type: "text",     required: true },
      { step: 1, key: "email_pro",           label: "Email professionnel",            type: "text",     placeholder: "Visible sur le profil si souhaité" },
      { step: 1, key: "site_web",            label: "Site web / Portfolio",           type: "text",     placeholder: "https://..." },
      // Step 2
      { step: 2, key: "about_actuel",        label: "Section 'À propos' actuelle",    type: "textarea", placeholder: "Copiez votre section actuelle si vous en avez une..." },
      { step: 2, key: "accroche_souhaitee",  label: "Messages clés à faire passer",   type: "textarea", required: true, placeholder: "Ce que vous voulez que les visiteurs retiennent de votre profil..." },
      { step: 2, key: "tonalite_profil",     label: "Tonalité souhaitée du profil",   type: "select",   options: ["Autorité experte", "Accessible & humain", "Ambitieux & dynamique", "Institutionnel & rigoureux"] },
      // Step 3
      { step: 3, key: "experiences",         label: "Expériences professionnelles",   type: "textarea", required: true, placeholder: "Pour chaque poste : titre, entreprise, dates, missions, réalisations chiffrées..." },
      { step: 3, key: "formation",           label: "Formation & diplômes",           type: "textarea", required: true },
      { step: 3, key: "certifications",      label: "Certifications & formations",    type: "textarea", placeholder: "Certifications LinkedIn Learning, Coursera, Google, PMI..." },
      { step: 3, key: "projets_notables",    label: "Projets notables à mettre en avant", type: "textarea", placeholder: "Projets saillants avec impact mesurable à publier dans la section Projets LinkedIn..." },
      // Step 4
      { step: 4, key: "competences_cles",    label: "Top 10 compétences à mettre en avant", type: "textarea", required: true, hint: "LinkedIn permet de valider jusqu'à 50 compétences — concentrez-vous sur les 10 les plus stratégiques" },
      { step: 4, key: "recommandations",     label: "Avez-vous des recommandations LinkedIn ?", type: "select", options: ["Oui, existantes", "Non, je veux des templates à demander", "J'en ai besoin mais je ne sais pas à qui"] },
      { step: 4, key: "type_reseau",         label: "Avec qui voulez-vous vous connecter ?", type: "textarea", placeholder: "Recruteurs RH, investisseurs, clients B2B, pairs secteur..." },
      { step: 4, key: "connexions_cibles",   label: "Profils ciblés pour connexion", type: "textarea", placeholder: "Titres de poste, entreprises, secteurs des personnes à cibler" },
      // Step 5
      { step: 5, key: "objectif_linkedin",   label: "Objectif principal LinkedIn",    type: "select",   options: ["Trouver un emploi", "Attirer des clients", "Développer ma visibilité", "Lever des fonds", "Devenir influenceur"], required: true },
      { step: 5, key: "horizon_temporel",    label: "Horizon temporel de l'objectif",type: "select",   options: ["Court terme (1-3 mois)", "Moyen terme (3-6 mois)", "Long terme (6-12 mois)"] },
      { step: 5, key: "valeur_differenciante",label: "Ce qui vous distingue des autres", type: "textarea", required: true },
      // Step 6
      { step: 6, key: "type_contenu",        label: "Type de contenu à publier",      type: "textarea", placeholder: "Articles, posts, témoignages clients, études de cas, vidéos..." },
      { step: 6, key: "frequence_publication",label: "Fréquence de publication souhaitée", type: "select", options: ["Quotidienne", "3x/semaine", "Hebdomadaire", "Bi-mensuelle", "Pas de contenu prévu"] },
      { step: 6, key: "themes_contenus",     label: "Thèmes de contenu prioritaires", type: "textarea", placeholder: "Secteur d'expertise, actualités, conseils professionnels, témoignages..." },
      // Step 7
      { step: 7, key: "profil_existant",     label: "Avez-vous déjà un profil LinkedIn ?", type: "select", options: ["Oui, à optimiser", "Non, à créer de zéro"], hint: "Nous vous fournirons le texte clé-en-main à copier-coller" },
      { step: 7, key: "infos_complementaires", label: "Informations complémentaires", type: "textarea", placeholder: "Tout ce qui pourrait enrichir votre profil : publications, conférences, langues..." },
    ],
  },

  {
    id: "pack_carriere",
    category: "carriere",
    title: "Pack Carrière Complet",
    description: "CV + Lettre de motivation + Profil LinkedIn optimisé.",
    priceFcfa: 11175,
    badge: "Pack",
    icon: "Package",
    steps: [
      { number: 1, title: "Profil & Contact" },
      { number: 2, title: "Objectif professionnel" },
      { number: 3, title: "Expériences professionnelles" },
      { number: 4, title: "Formation & Compétences" },
      { number: 5, title: "Poste & Entreprise ciblés (Lettre)" },
      { number: 6, title: "LinkedIn & Personal branding" },
      { number: 7, title: "Personnalisation & Format" },
      { number: 8, title: "Compléments & Finalisation" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "full_name",        label: "Nom complet",                type: "text",     required: true },
      { step: 1, key: "email",            label: "Email",                      type: "text",     required: true },
      { step: 1, key: "telephone",        label: "Téléphone",                  type: "text",     required: true },
      { step: 1, key: "ville_pays",       label: "Ville, Pays",                type: "text",     required: true },
      { step: 1, key: "linkedin_url",     label: "URL LinkedIn",               type: "text" },
      { step: 1, key: "site_portfolio",   label: "Site / Portfolio",           type: "text",     placeholder: "https://..." },
      { step: 1, key: "nationalite",      label: "Nationalité",                type: "text" },
      // Step 2
      { step: 2, key: "poste_vise",       label: "Poste visé",                 type: "text",     required: true },
      { step: 2, key: "secteur",          label: "Secteur visé",               type: "text",     required: true },
      { step: 2, key: "type_contrat",     label: "Type de contrat",            type: "select",   options: ["CDI", "CDD", "Freelance", "Stage", "Consultant"] },
      { step: 2, key: "disponibilite",    label: "Disponibilité",              type: "text",     placeholder: "Immédiat / 1 mois / à partir du..." },
      { step: 2, key: "pretentions",      label: "Prétentions salariales (optionnel)", type: "text", placeholder: "Fourchette en FCFA / mois" },
      { step: 2, key: "accroche",         label: "Votre accroche professionnelle", type: "textarea", required: true, hint: "3-4 phrases percutantes sur votre valeur et positionnement" },
      // Step 3
      { step: 3, key: "exp1",             label: "Expérience 1 (poste, entreprise, dates, missions)", type: "textarea", required: true, hint: "Incluez des résultats chiffrés pour chaque expérience" },
      { step: 3, key: "exp2",             label: "Expérience 2",               type: "textarea" },
      { step: 3, key: "exp3",             label: "Expérience 3",               type: "textarea" },
      { step: 3, key: "missions_freelance",label: "Missions freelance / projets indépendants", type: "textarea", placeholder: "Clients, projets, résultats..." },
      // Step 4
      { step: 4, key: "formation",        label: "Formation principale",       type: "textarea", required: true },
      { step: 4, key: "formations_complementaires", label: "Formations complémentaires", type: "textarea", placeholder: "Diplômes secondaires, formations courtes, MOOC..." },
      { step: 4, key: "certifications",   label: "Certifications",             type: "textarea" },
      { step: 4, key: "competences",      label: "Compétences techniques & soft skills", type: "textarea", required: true },
      { step: 4, key: "langues",          label: "Langues",                    type: "text",     required: true, placeholder: "Français (natif), Anglais (C1)..." },
      // Step 5
      { step: 5, key: "entreprise_cible", label: "Entreprise cible (lettre)", type: "text",     required: true },
      { step: 5, key: "source_offre",     label: "Source de l'offre",          type: "text",     placeholder: "LinkedIn, jobboard, réseau..." },
      { step: 5, key: "connaissance_entreprise", label: "Ce que vous savez de l'entreprise", type: "textarea", placeholder: "Valeurs, produits, actualité, culture..." },
      { step: 5, key: "motivation",       label: "Motivation pour ce poste",   type: "textarea", required: true },
      { step: 5, key: "atouts",           label: "Vos 3 atouts pour ce poste", type: "textarea", required: true },
      { step: 5, key: "realisation_cle",  label: "Réalisation clé à valoriser", type: "textarea", placeholder: "Un projet, résultat chiffré, succès concret..." },
      // Step 6
      { step: 6, key: "titre_linkedin",   label: "Titre LinkedIn souhaité",    type: "text",     required: true, placeholder: "Expert Finance | DG | Consultant UEMOA" },
      { step: 6, key: "objectif_linkedin",label: "Objectif LinkedIn",          type: "select",   options: ["Trouver un emploi", "Attirer des clients", "Développer ma visibilité", "Réseau professionnel"] },
      { step: 6, key: "valeur_unique",    label: "Ce qui vous distingue",      type: "textarea", required: true },
      { step: 6, key: "type_contenu_linkedin", label: "Contenu à publier sur LinkedIn", type: "textarea", placeholder: "Posts, articles, témoignages, études de cas..." },
      // Step 7
      { step: 7, key: "style_cv",         label: "Style de CV souhaité",       type: "select",   options: ["Classique / sobre", "Moderne / coloré", "Minimaliste", "ATS optimisé"] },
      { step: 7, key: "ton_lettre",       label: "Ton de la lettre",           type: "select",   options: ["Professionnel classique", "Moderne & dynamique", "Formel & institutionnel"] },
      // Step 8
      { step: 8, key: "distinctions",     label: "Prix, distinctions, publications", type: "textarea", placeholder: "Récompenses, articles publiés, conférences..." },
      { step: 8, key: "loisirs",          label: "Loisirs & engagements",      type: "text",     placeholder: "Sport, bénévolat, associatif..." },
      { step: 8, key: "infos_complementaires", label: "Informations complémentaires", type: "textarea", placeholder: "Tout ce qui n'a pas été couvert et qui est pertinent..." },
    ],
  },

  // ─── BUSINESS ──────────────────────────────────────────────────────────────
  {
    id: "bmc",
    category: "business",
    title: "Business Model Canvas",
    description: "Canvas structuré pour valider et présenter votre modèle économique.",
    priceFcfa: 7425,
    icon: "LayoutGrid",
    steps: [
      { number: 1, title: "Projet & Contexte" },
      { number: 2, title: "Clients & Proposition de valeur" },
      { number: 3, title: "Canaux & Relations clients" },
      { number: 4, title: "Ressources & Activités clés" },
      { number: 5, title: "Partenaires & Finances" },
      { number: 6, title: "Avantage compétitif & Vision" },
      { number: 7, title: "Validation & Métriques" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_projet",        label: "Nom du projet / entreprise",   type: "text",     required: true },
      { step: 1, key: "secteur",           label: "Secteur d'activité",           type: "text",     required: true },
      { step: 1, key: "pays_marche",       label: "Pays / Marché principal",      type: "text",     required: true },
      { step: 1, key: "description",       label: "Description générale du projet", type: "textarea", required: true },
      { step: 1, key: "stade",             label: "Stade du projet",              type: "select",   options: ["Idée", "Validation", "MVP", "Croissance", "Maturité"] },
      { step: 1, key: "fondateurs",        label: "Fondateur(s) & rôles",        type: "textarea", placeholder: "Qui porte ce projet ? Quelle est l'équipe fondatrice ?" },
      { step: 1, key: "date_lancement",    label: "Date de lancement prévue",    type: "text",     placeholder: "Ex: T1 2026, Janvier 2026..." },
      // Step 2
      { step: 2, key: "segments_clients",  label: "Segments de clientèle",        type: "textarea", required: true, placeholder: "Qui sont vos clients ? B2B, B2C, tranches d'âge, zones géographiques...", hint: "Soyez précis : un segment = un groupe homogène avec les mêmes besoins" },
      { step: 2, key: "proposition_valeur",label: "Proposition de valeur",        type: "textarea", required: true, placeholder: "Quel problème résolvez-vous ? Quelle valeur unique apportez-vous ?" },
      { step: 2, key: "probleme_resolu",   label: "Problème principal résolu",    type: "textarea", required: true },
      { step: 2, key: "gain_client",       label: "Gains apportés au client",     type: "textarea", placeholder: "Ce que le client gagne : économies, confort, statut, temps..." },
      { step: 2, key: "douleurs_client",   label: "Douleurs/frustrations du client", type: "textarea", placeholder: "Ce qui empêche le client de dormir, ses frustrations actuelles..." },
      // Step 3
      { step: 3, key: "canaux",            label: "Canaux de distribution",       type: "textarea", required: true, placeholder: "Boutique physique, e-commerce, agents, partenaires distributeurs..." },
      { step: 3, key: "relation_clients",  label: "Relation avec les clients",    type: "textarea", placeholder: "Service client, self-service, automatisé, communauté, co-création..." },
      { step: 3, key: "acquisition",       label: "Stratégie d'acquisition clients", type: "textarea", placeholder: "Comment trouverez-vous vos clients ? CAC estimé ?" },
      { step: 3, key: "fidelisation",      label: "Stratégie de fidélisation",    type: "textarea", placeholder: "Comment conservez-vous vos clients ? LTV estimée ?" },
      // Step 4
      { step: 4, key: "ressources_cles",   label: "Ressources clés",              type: "textarea", required: true, placeholder: "Humaines, technologiques, financières, physiques, intellectuelles..." },
      { step: 4, key: "activites_cles",    label: "Activités clés",               type: "textarea", required: true, placeholder: "Production, marketing, R&D, logistique, support client..." },
      { step: 4, key: "propriete_intellectuelle", label: "Propriété intellectuelle", type: "textarea", placeholder: "Brevets, marques déposées, algorithmes, données exclusives..." },
      // Step 5
      { step: 5, key: "partenaires",       label: "Partenaires clés",             type: "textarea", placeholder: "Fournisseurs, partenaires stratégiques, sous-traitants, alliances..." },
      { step: 5, key: "sources_revenus",   label: "Sources de revenus",           type: "textarea", required: true, placeholder: "Vente directe, abonnement, commission, licence, freemium..." },
      { step: 5, key: "structure_couts",   label: "Structure de coûts",           type: "textarea", required: true, placeholder: "Charges fixes, variables, coûts principaux, coût d'un client..." },
      { step: 5, key: "marge_estimee",     label: "Marge brute estimée",          type: "text",     placeholder: "Ex: 60% de marge sur les services SaaS", hint: "Donne une indication de la viabilité financière du modèle" },
      // Step 6
      { step: 6, key: "avantage_competitif",label: "Avantage compétitif durable", type: "textarea", required: true, placeholder: "Ce qui est difficile à copier pour vos concurrents..." },
      { step: 6, key: "concurrents_directs", label: "Concurrents directs",        type: "textarea", placeholder: "Qui fait la même chose que vous ? Comment vous différenciez-vous ?" },
      { step: 6, key: "vision_2ans",        label: "Vision à 2 ans",              type: "textarea", placeholder: "Où voulez-vous être dans 2 ans ? Taille, marchés, produits..." },
      // Step 7
      { step: 7, key: "hypotheses_cles",   label: "Hypothèses clés à valider",    type: "textarea", placeholder: "Quelles hypothèses devez-vous tester en priorité pour valider votre modèle ?" },
      { step: 7, key: "metriques_succes",  label: "Métriques de succès",          type: "textarea", placeholder: "KPIs principaux : nombre d'utilisateurs, taux de conversion, CA mensuel récurrent..." },
      { step: 7, key: "infos_complementaires", label: "Informations complémentaires", type: "textarea", placeholder: "Tout autre élément pertinent pour votre modèle d'affaires..." },
    ],
  },

  {
    id: "plan_affaire",
    category: "business",
    title: "Plan d'affaires",
    description: "Business plan complet en 10 chapitres, adapté au contexte africain/UEMOA.",
    priceFcfa: 22425,
    badge: "Premium",
    icon: "TrendingUp",
    steps: [
      { number: 1,  title: "Présentation de l'entreprise" },
      { number: 2,  title: "Étude de marché" },
      { number: 3,  title: "Stratégie commerciale" },
      { number: 4,  title: "Plan opérationnel" },
      { number: 5,  title: "Organisation & RH" },
      { number: 6,  title: "Plan financier" },
      { number: 7,  title: "Analyse des risques" },
      { number: 8,  title: "Contexte & Annexes" },
      { number: 9,  title: "Vision & Positionnement" },
      { number: 10, title: "Analyse concurrentielle approfondie" },
      { number: 11, title: "Innovation & R&D" },
      { number: 12, title: "Partenariats stratégiques" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_entreprise",        label: "Nom de l'entreprise",                  type: "text",     required: true },
      { step: 1, key: "forme_juridique",        label: "Forme juridique",                      type: "select",   options: ["SARL", "SA", "SAS", "EURL", "Auto-entrepreneur", "GIE", "Association"], required: true },
      { step: 1, key: "secteur",                label: "Secteur d'activité",                   type: "text",     required: true },
      { step: 1, key: "date_creation",          label: "Date de création prévue",              type: "text",     placeholder: "Janvier 2026 ou déjà créée" },
      { step: 1, key: "siege",                  label: "Siège social / Localisation",          type: "text",     required: true },
      { step: 1, key: "description",            label: "Description détaillée du projet",      type: "textarea", required: true, placeholder: "Que faites-vous exactement ? Vos produits, services, processus..." },
      { step: 1, key: "vision",                 label: "Vision à 5 ans",                       type: "textarea", placeholder: "Où voulez-vous être dans 5 ans ?" },
      { step: 1, key: "mission",                label: "Mission de l'entreprise",              type: "textarea" },
      // Step 2
      { step: 2, key: "marche_cible",           label: "Marché cible & zone géographique",     type: "textarea", required: true },
      { step: 2, key: "taille_marche",          label: "Taille du marché (estimée)",           type: "text",     placeholder: "Ex: 500 000 ménages urbains au Togo" },
      { step: 2, key: "concurrents",            label: "Principaux concurrents",               type: "textarea", required: true, placeholder: "Nommez-les et décrivez leurs forces/faiblesses" },
      { step: 2, key: "avantage_concurrentiel", label: "Votre avantage concurrentiel",         type: "textarea", required: true },
      { step: 2, key: "swot",                   label: "SWOT (forces, faiblesses, opportunités, menaces)", type: "textarea", placeholder: "Listez les éléments clés de votre SWOT..." },
      { step: 2, key: "tendances_marche",        label: "Tendances et évolutions du marché",   type: "textarea", placeholder: "Digitalisation, réglementation, comportements consommateurs..." },
      { step: 2, key: "segments_prioritaires",   label: "Segments de marché prioritaires",     type: "textarea", placeholder: "B2C urbains, PME formelles, administrations publiques..." },
      // Step 3
      { step: 3, key: "produits_services",       label: "Produits / Services en détail",       type: "textarea", required: true, placeholder: "Décrivez chaque offre, ses caractéristiques, son prix..." },
      { step: 3, key: "politique_prix",          label: "Politique de prix",                   type: "textarea", required: true, placeholder: "Comment fixez-vous vos prix ? Marges prévues ?" },
      { step: 3, key: "canaux_distribution",     label: "Canaux de distribution",              type: "textarea", required: true },
      { step: 3, key: "strategie_comm",          label: "Stratégie de communication",          type: "textarea", placeholder: "Réseaux sociaux, bouche à oreille, publicité, événements..." },
      { step: 3, key: "objectifs_ventes",        label: "Objectifs de ventes An 1",            type: "textarea", required: true, placeholder: "Nombre de clients, CA cible, parts de marché..." },
      { step: 3, key: "politique_fidelisation",  label: "Politique de fidélisation clients",   type: "textarea", placeholder: "Programme de fidélité, SAV, communauté, upsell..." },
      // Step 4
      { step: 4, key: "processus_production",    label: "Processus de production / prestation",type: "textarea", required: true, placeholder: "Comment créez-vous et livrez-vous votre produit/service ?" },
      { step: 4, key: "fournisseurs",            label: "Principaux fournisseurs",             type: "textarea", placeholder: "Matières premières, logistique, sous-traitants..." },
      { step: 4, key: "localisation_operationnelle", label: "Locaux / Infrastructure",         type: "textarea", placeholder: "Bureau, atelier, entrepôt, surface, loyer..." },
      { step: 4, key: "equipements",             label: "Équipements nécessaires",             type: "textarea", placeholder: "Liste + coût estimé de chaque équipement" },
      { step: 4, key: "capacite_production",     label: "Capacité de production / service",    type: "textarea", placeholder: "Unités/mois, nombre de clients servis simultanément..." },
      { step: 4, key: "logistique",              label: "Logistique & chaîne d'approvisionnement", type: "textarea", placeholder: "Stockage, livraison, gestion des stocks..." },
      // Step 5
      { step: 5, key: "equipe_fondateurs",       label: "Équipe fondatrice",                   type: "textarea", required: true, placeholder: "Prénom, rôle, expérience, compétences clés de chaque fondateur..." },
      { step: 5, key: "effectif_prevu",          label: "Effectif prévu (An 1 → An 3)",        type: "textarea", placeholder: "Ex: An 1: 3 personnes, An 2: 6 personnes..." },
      { step: 5, key: "postes_cles",             label: "Postes clés à recruter",              type: "textarea", placeholder: "Intitulé du poste, profil, salaire mensuel prévu..." },
      { step: 5, key: "organigramme",            label: "Structure organisationnelle",          type: "textarea", placeholder: "Hiérarchie, départements, reporting lines..." },
      { step: 5, key: "politique_rh",            label: "Politique RH & motivation",           type: "textarea", placeholder: "Rémunération, formation, avantages, culture d'entreprise..." },
      // Step 6
      { step: 6, key: "investissement",          label: "Investissement initial total (FCFA)", type: "text",     required: true },
      { step: 6, key: "detail_investissement",   label: "Détail des investissements",          type: "textarea", required: true, placeholder: "Équipements X FCFA, travaux Y FCFA, fonds de roulement Z FCFA..." },
      { step: 6, key: "financement",             label: "Sources de financement",              type: "textarea", required: true, placeholder: "Apport personnel, prêt bancaire, investisseur, subvention..." },
      { step: 6, key: "ca_an1",                  label: "CA prévisionnel An 1 (FCFA)",        type: "text",     required: true },
      { step: 6, key: "ca_an2",                  label: "CA prévisionnel An 2 (FCFA)",        type: "text" },
      { step: 6, key: "ca_an3",                  label: "CA prévisionnel An 3 (FCFA)",        type: "text" },
      { step: 6, key: "charges_fixes",           label: "Charges fixes mensuelles",            type: "text",     placeholder: "Loyer, salaires, abonnements..." },
      { step: 6, key: "charges_variables",       label: "Charges variables principales",       type: "textarea", placeholder: "Matières premières, commissions, livraison..." },
      { step: 6, key: "marge_brute",             label: "Marge brute estimée (%)",             type: "text",     placeholder: "Ex: 45%" },
      { step: 6, key: "seuil_rentabilite_mois",  label: "Seuil de rentabilité (mois estimé)",  type: "text",     placeholder: "Ex: Mois 14" },
      // Step 7
      { step: 7, key: "risques_identifies",      label: "Risques identifiés",                  type: "textarea", required: true, placeholder: "Risques de marché, opérationnels, financiers, réglementaires..." },
      { step: 7, key: "plan_mitigation",         label: "Plan de mitigation des risques",       type: "textarea", placeholder: "Comment allez-vous gérer chaque risque ?" },
      { step: 7, key: "plan_b",                  label: "Plan B / scénario alternatif",         type: "textarea", placeholder: "Que faites-vous si le marché principal ne se développe pas ?" },
      // Step 8
      { step: 8, key: "pays",                    label: "Pays / Zone monétaire",                type: "text",     required: true, placeholder: "Togo, Côte d'Ivoire, Sénégal, UEMOA..." },
      { step: 8, key: "contexte_reglementaire",  label: "Contexte réglementaire particulier",   type: "textarea", placeholder: "Licences requises, réglementations sectorielles..." },
      { step: 8, key: "impact_social",           label: "Impact social & environnemental",       type: "textarea", placeholder: "Emplois créés, impact ESG, RSE..." },
      { step: 8, key: "infos_complementaires",   label: "Informations complémentaires",          type: "textarea", placeholder: "Tout ce qui n'a pas été couvert et qui est important..." },
      // Step 9 — Vision & Positionnement
      { step: 9, key: "vision_long_terme",       label: "Vision long terme (10 ans)",           type: "textarea", required: true, placeholder: "Quelle entreprise voulez-vous être dans 10 ans ?" },
      { step: 9, key: "valeurs_entreprise",      label: "Valeurs fondamentales",                type: "textarea", required: true, placeholder: "Les 3-5 valeurs qui guident toutes les décisions..." },
      { step: 9, key: "positionnement_prix",     label: "Positionnement prix vs marché",        type: "select",   options: ["Entrée de gamme", "Milieu de gamme", "Haut de gamme", "Ultra-premium"] },
      { step: 9, key: "proposition_valeur_unique", label: "Proposition de valeur unique (UVP)", type: "textarea", required: true, placeholder: "Ce que vous faites mieux que n'importe qui d'autre..." },
      { step: 9, key: "impact_communaute",       label: "Impact sur la communauté locale",      type: "textarea", placeholder: "Emplois locaux, développement économique, formation..." },
      { step: 9, key: "ambition_regionale",      label: "Ambition régionale / continentale",    type: "textarea", placeholder: "Extension UEMOA, CEDEAO, Afrique..." },
      // Step 10 — Analyse concurrentielle approfondie
      { step: 10, key: "mapping_concurrents",    label: "Mapping concurrentiel détaillé",       type: "textarea", required: true, placeholder: "Concurrent A: forces, faiblesses, parts de marché, prix..." },
      { step: 10, key: "barrières_entree",       label: "Barrières à l'entrée identifiées",     type: "textarea", placeholder: "Capital, réglementation, technologie, réseau, marque..." },
      { step: 10, key: "strategie_differenciation", label: "Stratégie de différenciation",      type: "textarea", required: true, placeholder: "Comment vous distinguerez-vous durablement ?" },
      { step: 10, key: "veille_concurrentielle", label: "Processus de veille concurrentielle",  type: "textarea", placeholder: "Comment allez-vous surveiller vos concurrents ?" },
      { step: 10, key: "reponse_attaque",        label: "Réponse aux attaques concurrentielles",type: "textarea", placeholder: "Stratégie de riposte si un concurrent baisse ses prix..." },
      { step: 10, key: "opportunites_blue_ocean",label: "Opportunités Blue Ocean identifiées",  type: "textarea", placeholder: "Segments non servis, niches inexploitées..." },
      // Step 11 — Innovation & R&D
      { step: 11, key: "vision_innovation",      label: "Vision innovation",                    type: "textarea", required: true, placeholder: "Quelle place occupe l'innovation dans votre stratégie ?" },
      { step: 11, key: "pipeline_produits",      label: "Pipeline produits / services futurs",  type: "textarea", placeholder: "Nouvelles offres prévues An 2, An 3..." },
      { step: 11, key: "budget_rd",              label: "Budget R&D prévu (% du CA)",           type: "text",     placeholder: "Ex: 5% du CA annuel" },
      { step: 11, key: "technologies_cles",      label: "Technologies clés utilisées",          type: "textarea", placeholder: "IA, mobile, SaaS, blockchain, IoT, biotech..." },
      { step: 11, key: "propriete_intellectuelle",label: "Propriété intellectuelle & brevets",  type: "textarea", placeholder: "Brevets déposés, logiciels propriétaires, know-how..." },
      { step: 11, key: "partenariats_recherche", label: "Partenariats recherche & universités", type: "textarea", placeholder: "Collaborations académiques, incubateurs, accélérateurs..." },
      // Step 12 — Partenariats stratégiques
      { step: 12, key: "partenaires_cles",       label: "Partenaires stratégiques cibles",      type: "textarea", required: true, placeholder: "Entreprises, institutions, ONG, gouvernements avec lesquels vous souhaitez travailler..." },
      { step: 12, key: "type_partenariats",      label: "Types de partenariats envisagés",      type: "select",   options: ["Commercial / Distribution", "Technologique", "Financier / Investissement", "Institutionnel", "Mixte"] },
      { step: 12, key: "accords_existants",      label: "Accords / MOU existants",              type: "textarea", placeholder: "Partenariats déjà signés ou en négociation..." },
      { step: 12, key: "ecosysteme_sectoriel",   label: "Intégration dans l'écosystème sectoriel", type: "textarea", placeholder: "Associations professionnelles, clusters, réseaux..." },
      { step: 12, key: "strategie_alliances",    label: "Stratégie d'alliances",                type: "textarea", placeholder: "Comment construire et maintenir des alliances gagnantes ?" },
      { step: 12, key: "risques_dependance",     label: "Risques de dépendance partenariale",   type: "textarea", placeholder: "Si le partenaire principal se retire, quel impact ?" },
    ],
  },

  {
    id: "pitch",
    category: "business",
    title: "Pitch Deck",
    description: "Deck investisseur percutant pour lever des fonds.",
    priceFcfa: 18675,
    badge: "Premium",
    icon: "Presentation",
    steps: [
      { number: 1, title: "Présentation startup" },
      { number: 2, title: "Problème & Solution" },
      { number: 3, title: "Marché & Concurrence" },
      { number: 4, title: "Modèle économique" },
      { number: 5, title: "Équipe & Traction" },
      { number: 6, title: "Besoins en financement" },
      { number: 7, title: "Roadmap & Vision" },
      { number: 8, title: "Risques & Gouvernance" },
      { number: 9, title: "Impact & ESG" },
      { number: 10, title: "Format & Personnalisation" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_startup",       label: "Nom de la startup",            type: "text",     required: true },
      { step: 1, key: "secteur",           label: "Secteur / Vertical",           type: "text",     required: true },
      { step: 1, key: "pays",              label: "Pays / Marché principal",       type: "text",     required: true },
      { step: 1, key: "stade",             label: "Stade de développement",       type: "select",   options: ["Pré-seed", "Seed", "Série A", "Série B", "Croissance"], required: true },
      { step: 1, key: "one_liner",         label: "One-liner (pitch en 1 phrase)", type: "text",     required: true, placeholder: "Nous sommes le [Uber/Airbnb] du [secteur] en [zone]" },
      { step: 1, key: "site_web",          label: "Site web / App",               type: "text",     placeholder: "https://..." },
      { step: 1, key: "type_investisseur_vise", label: "Type d'investisseur visé par ce deck", type: "select", options: ["Business angel local", "VC régional (UEMOA/CEDEAO)", "VC international", "Impact investor", "Banque de développement", "Fonds d'amorçage public"], hint: "Le ton et les attentes du deck changent selon l'audience" },
      // Step 2
      { step: 2, key: "probleme",          label: "Problème résolu",              type: "textarea", required: true, placeholder: "Décrivez le problème avec des données, exemples concrets..." },
      { step: 2, key: "taille_probleme",   label: "Ampleur du problème",          type: "textarea", placeholder: "Combien de personnes sont touchées ? Quel coût économique ?" },
      { step: 2, key: "solution",          label: "Votre solution",               type: "textarea", required: true, placeholder: "Comment résolvez-vous ce problème ? En quoi êtes-vous unique ?" },
      { step: 2, key: "demo",              label: "Démo / Produit existant",      type: "textarea", placeholder: "Décrivez votre MVP, prototype, ou version actuelle..." },
      { step: 2, key: "pourquoi_maintenant",label: "Pourquoi maintenant ?",       type: "textarea", placeholder: "Quel changement de contexte rend votre solution possible et urgente aujourd'hui ?", hint: "Les investisseurs veulent savoir pourquoi le moment est parfait" },
      // Step 3
      { step: 3, key: "tam",               label: "TAM — Marché total adressable", type: "text",    required: true, placeholder: "Ex: 2 milliards USD" },
      { step: 3, key: "sam",               label: "SAM — Marché accessible",      type: "text",     placeholder: "Ex: 300M USD en Afrique de l'Ouest" },
      { step: 3, key: "som",               label: "SOM — Part réalisable (5 ans)",type: "text",     placeholder: "Ex: 30M USD" },
      { step: 3, key: "source_chiffres",   label: "Sources des chiffres de marché", type: "textarea", placeholder: "IFC, Banque Mondiale, rapports sectoriels, études GSMA, PwC Africa..." },
      { step: 3, key: "concurrents",       label: "Concurrents & alternatives",   type: "textarea", required: true, placeholder: "Directs, indirects, substituts. Leur positionnement vs le vôtre." },
      { step: 3, key: "avantage",          label: "Avantage compétitif durable",  type: "textarea", required: true },
      { step: 3, key: "barriers_to_entry",  label: "Barrières à l'entrée créées", type: "textarea", placeholder: "Ce qui empêchera les copieurs : données, réseau, brevets, effets de réseau..." },
      // Step 4
      { step: 4, key: "modele_revenus",    label: "Modèle de revenus",            type: "textarea", required: true, placeholder: "Abonnement, commission, freemium, B2B SaaS, transaction..." },
      { step: 4, key: "prix",              label: "Structure de prix",            type: "textarea", required: true, placeholder: "Prix de vente, marges, LTV client, CAC..." },
      { step: 4, key: "projection_ca",     label: "Projection CA (3 ans)",        type: "textarea", placeholder: "An 1: X FCFA, An 2: Y FCFA, An 3: Z FCFA" },
      { step: 4, key: "unit_economics",    label: "Unit economics",               type: "textarea", placeholder: "CAC, LTV, LTV/CAC ratio, payback period, marge par client..." },
      // Step 5
      { step: 5, key: "equipe",            label: "Équipe fondatrice",            type: "textarea", required: true, placeholder: "Nom, rôle, expérience clé, pourquoi cette personne ?" },
      { step: 5, key: "advisors",          label: "Advisors & Board",             type: "textarea", placeholder: "Mentors, conseillers stratégiques, membres du conseil — leurs valeurs ajoutées" },
      { step: 5, key: "traction",          label: "Traction actuelle",            type: "textarea", required: true, placeholder: "Clients, revenus, utilisateurs, MoM growth, partenariats..." },
      { step: 5, key: "milestones",        label: "Milestones atteints",          type: "textarea", placeholder: "Dates et étapes clés franchies..." },
      { step: 5, key: "preuves_validation",label: "Preuves de validation marché", type: "textarea", placeholder: "LOI, pilotes, testimonials clients, études de cas..." },
      // Step 6
      { step: 6, key: "montant_levee",     label: "Montant à lever",              type: "text",     required: true, placeholder: "Ex: 500 000 USD" },
      { step: 6, key: "use_of_funds",      label: "Utilisation des fonds",        type: "textarea", required: true, placeholder: "40% tech, 30% commercial, 30% opérations..." },
      { step: 6, key: "type_investisseur", label: "Type d'investisseur ciblé",    type: "textarea", placeholder: "Business angel, VC, impact investor, fonds régionaux..." },
      { step: 6, key: "valorisation",      label: "Valorisation pré-money demandée", type: "text",  placeholder: "Ex: 2 000 000 USD — à mentionner ou non selon le contexte" },
      { step: 6, key: "objectif_18m",      label: "Objectif à 18 mois post-levée",type: "textarea", required: true },
      // Step 7
      { step: 7, key: "roadmap_produit",   label: "Roadmap produit (12-24 mois)", type: "textarea", required: true, placeholder: "T1 2026: Feature X, T2: Lancement marché Y, T3: Partenariat Z..." },
      { step: 7, key: "vision_5ans",       label: "Vision à 5 ans",              type: "textarea", placeholder: "Où sera votre startup dans 5 ans ? Taille, marchés, impact..." },
      { step: 7, key: "strategie_sortie",  label: "Stratégie de sortie (exit)",   type: "select",   options: ["IPO", "Acquisition stratégique", "Rachat par les fondateurs", "Fusion", "Pas de sortie prévue"] },
      // Step 8
      { step: 8, key: "risques_principaux",label: "Risques principaux identifiés",type: "textarea", placeholder: "Réglementaires, technologiques, de marché, concurrentiels, opérationnels..." },
      { step: 8, key: "plan_mitigation",   label: "Plan de mitigation",          type: "textarea", placeholder: "Comment vous gérez chaque risque clé..." },
      { step: 8, key: "gouvernance",       label: "Structure de gouvernance",     type: "textarea", placeholder: "Répartition du capital, droits de vote, pacte d'associés prévu..." },
      // Step 9
      { step: 9, key: "impact_social",     label: "Impact social & environnemental", type: "textarea", placeholder: "Emplois créés, ODD adressés, impact sur les communautés..." },
      { step: 9, key: "certifications_esg",label: "Labels / Certifications ESG visés", type: "textarea", placeholder: "B Corp, label impact, certifications sectorielles..." },
      // Step 10
      { step: 10, key: "nb_slides",        label: "Nombre de slides souhaité",    type: "select",   options: ["10 slides (standard)", "12-15 slides (détaillé)", "20+ slides (complet)"] },
      { step: 10, key: "langue_deck",      label: "Langue du deck",               type: "select",   options: ["Français", "Anglais", "Bilingue FR/EN"] },
      { step: 10, key: "infos_complementaires", label: "Informations complémentaires", type: "textarea", placeholder: "Données supplémentaires, contexte local, partenariats en cours..." },
    ],
  },

  {
    id: "marketing",
    category: "business",
    title: "Plan Marketing",
    description: "Stratégie marketing complète avec plan d'action détaillé.",
    priceFcfa: 14925,
    icon: "Megaphone",
    steps: [
      { number: 1, title: "Entreprise & Offre" },
      { number: 2, title: "Analyse de marché" },
      { number: 3, title: "Cibles & Personas" },
      { number: 4, title: "Positionnement & Branding" },
      { number: 5, title: "Mix marketing & Canaux" },
      { number: 6, title: "Plan d'action opérationnel" },
      { number: 7, title: "Budget & KPIs" },
      { number: 8, title: "Digital & Contenu" },
      { number: 9, title: "Suivi & Optimisation" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "entreprise",        label: "Nom de l'entreprise",          type: "text",     required: true },
      { step: 1, key: "secteur",           label: "Secteur d'activité",           type: "text",     required: true },
      { step: 1, key: "stade_entreprise",  label: "Stade de l'entreprise",        type: "select",   options: ["Lancement", "Croissance", "Maturité", "Repositionnement"] },
      { step: 1, key: "produit",           label: "Produit / Service à promouvoir",type: "textarea", required: true, placeholder: "Décrivez votre offre, ses caractéristiques, son prix actuel..." },
      { step: 1, key: "usp",               label: "Proposition de valeur unique (USP)", type: "textarea", required: true },
      { step: 1, key: "zone_geo",          label: "Zone géographique ciblée",     type: "text",     required: true },
      { step: 1, key: "periode_plan",      label: "Période couverte par le plan", type: "select",   options: ["3 mois", "6 mois", "12 mois", "18 mois"] },
      // Step 2
      { step: 2, key: "taille_marche",     label: "Taille du marché (estimée)",   type: "text",     placeholder: "Ex: 50 000 ménages urbains, 2 000 PME formelles..." },
      { step: 2, key: "concurrents",       label: "Concurrents directs & indirects", type: "textarea", required: true },
      { step: 2, key: "positionnement_concurrents",label: "Positionnement des concurrents", type: "textarea", placeholder: "Prix, qualité, cible, canaux, avantages de chaque concurrent..." },
      { step: 2, key: "tendances_marche",  label: "Tendances du marché",          type: "textarea", placeholder: "Tendances actuelles qui influencent votre secteur..." },
      { step: 2, key: "analyse_swot",      label: "Analyse SWOT marketing",       type: "textarea", placeholder: "Forces, faiblesses, opportunités, menaces marketing..." },
      // Step 3
      { step: 3, key: "cible_principale",  label: "Persona principal",            type: "textarea", required: true, placeholder: "Âge, genre, revenu, localisation, comportements, douleurs, désirs..." },
      { step: 3, key: "cible_secondaire",  label: "Persona secondaire",           type: "textarea", placeholder: "Second segment cible si applicable..." },
      { step: 3, key: "parcours_achat",    label: "Parcours d'achat du client",   type: "textarea", placeholder: "Comment votre client découvre, évalue et achète votre offre ?" },
      { step: 3, key: "douleurs_client",   label: "Douleurs & frustrations client",type: "textarea", placeholder: "Quels problèmes votre client veut-il résoudre en vous achetant ?" },
      { step: 3, key: "triggers_achat",    label: "Déclencheurs d'achat",         type: "textarea", placeholder: "Qu'est-ce qui pousse votre client à passer à l'acte ?" },
      // Step 4
      { step: 4, key: "positionnement",    label: "Positionnement souhaité",      type: "textarea", required: true, placeholder: "Comment voulez-vous être perçu vs la concurrence ?" },
      { step: 4, key: "territoire_marque", label: "Territoire de marque",         type: "textarea", placeholder: "Valeurs, personnalité, ton de communication de votre marque..." },
      { step: 4, key: "identite_visuelle", label: "Identité visuelle actuelle",   type: "select",   options: ["Solide (logo, charte graphique)", "Partielle (logo seulement)", "À construire", "À refondre"] },
      // Step 5
      { step: 5, key: "canaux_marketing",  label: "Canaux marketing à utiliser",  type: "textarea", required: true, placeholder: "Réseaux sociaux, SEO, events, partenariats, pub payante, WhatsApp, radio..." },
      { step: 5, key: "messages_cles",     label: "Messages clés à véhiculer",    type: "textarea", required: true },
      { step: 5, key: "politique_prix",    label: "Politique de prix",            type: "textarea", placeholder: "Positionnement prix, promotions, remises, bundling..." },
      { step: 5, key: "distribution",      label: "Stratégie de distribution",    type: "textarea", placeholder: "Direct, revendeurs, e-commerce, partenaires..." },
      // Step 6
      { step: 6, key: "actions_prioritaires",label: "Top 5 actions prioritaires", type: "textarea", required: true, placeholder: "Actions concrètes avec délai et responsable..." },
      { step: 6, key: "calendrier_actions",label: "Calendrier des actions",       type: "textarea", placeholder: "Mois 1: ..., Mois 2-3: ..., Mois 4-6: ..." },
      { step: 6, key: "responsables",      label: "Responsables des actions",     type: "textarea", placeholder: "Qui fait quoi : interne, agence, freelance..." },
      // Step 7
      { step: 7, key: "budget",            label: "Budget marketing mensuel (FCFA)", type: "text",  required: true },
      { step: 7, key: "repartition_budget",label: "Répartition du budget",        type: "textarea", placeholder: "40% digital, 30% events, 30% print..." },
      { step: 7, key: "kpis",              label: "KPIs à suivre",                type: "textarea", required: true, placeholder: "Taux de conversion, CAC, ROAS, taux d'engagement, NPS..." },
      { step: 7, key: "objectifs_chiffres",label: "Objectifs chiffrés à 6 mois",  type: "textarea", required: true, placeholder: "X nouveaux clients, Y FCFA de CA, Z% de notoriété..." },
      // Step 8
      { step: 8, key: "reseaux_sociaux",   label: "Réseaux sociaux à activer",    type: "textarea", placeholder: "Facebook, Instagram, LinkedIn, TikTok, YouTube — lesquels et pourquoi ?" },
      { step: 8, key: "strategie_contenu", label: "Stratégie de contenu",         type: "textarea", placeholder: "Thèmes, formats, fréquence de publication, ligne éditoriale..." },
      { step: 8, key: "seo_sem",           label: "SEO / SEM",                    type: "select",   options: ["SEO uniquement", "Google Ads", "SEO + SEM", "Non prévu pour l'instant"] },
      { step: 8, key: "email_marketing",   label: "Email marketing / WhatsApp",   type: "textarea", placeholder: "Liste clients, newsletters, campagnes automatisées, WhatsApp Business..." },
      // Step 9
      { step: 9, key: "frequence_reporting",label: "Fréquence de reporting",      type: "select",   options: ["Hebdomadaire", "Mensuel", "Trimestriel"] },
      { step: 9, key: "outils_mesure",     label: "Outils de mesure utilisés",    type: "textarea", placeholder: "Google Analytics, Meta Business, CRM, tableaux Excel..." },
      { step: 9, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Contexte local particulier, contraintes réglementaires, partenariats existants..." },
    ],
  },

  {
    id: "finances",
    category: "business",
    title: "Prévisions Financières",
    description: "Tableau financier sur 3 ans avec compte de résultat et seuil de rentabilité.",
    priceFcfa: 18675,
    icon: "Calculator",
    steps: [
      { number: 1,  title: "Entreprise & Activité" },
      { number: 2,  title: "Structure des revenus" },
      { number: 3,  title: "Détail des ventes" },
      { number: 4,  title: "Charges fixes" },
      { number: 5,  title: "Charges variables & Coûts" },
      { number: 6,  title: "Investissements" },
      { number: 7,  title: "Plan de financement" },
      { number: 8,  title: "Trésorerie" },
      { number: 9,  title: "Fiscalité & Conformité" },
      { number: 10, title: "Hypothèses & Indicateurs" },
    ],
    fields: [
      // Step 1 – Entreprise
      { step: 1, key: "entreprise",            label: "Nom de l'entreprise",                  type: "text",     required: true },
      { step: 1, key: "secteur",               label: "Secteur / Activité principale",        type: "text",     required: true },
      { step: 1, key: "pays",                  label: "Pays",                                 type: "text",     required: true },
      { step: 1, key: "stade",                 label: "Stade de l'entreprise",                type: "select",   options: ["Création", "Démarrage (<1 an)", "Croissance (1-3 ans)", "Maturité (>3 ans)"], required: true },
      { step: 1, key: "monnaie",               label: "Monnaie de référence",                 type: "select",   options: ["FCFA (XOF)", "FCFA (XAF)", "EUR", "USD", "GHS", "NGN"] },
      { step: 1, key: "exercice_debut",        label: "Début de l'exercice financier",        type: "text",     placeholder: "Ex: Janvier 2026" },
      { step: 1, key: "forme_juridique",       label: "Forme juridique",                      type: "select",   options: ["SARL", "SA", "SAS", "GIE", "Auto-entrepreneur", "Association"] },
      // Step 2 – Revenus
      { step: 2, key: "produits_lignes",       label: "Lignes de produits / services",        type: "textarea", required: true, placeholder: "Produit A: prix unitaire X FCFA, volume prévu Y/mois\nProduit B:..." },
      { step: 2, key: "ca_an1",                label: "CA prévisionnel An 1",                 type: "text",     required: true },
      { step: 2, key: "ca_an2",                label: "CA prévisionnel An 2",                 type: "text",     required: true },
      { step: 2, key: "ca_an3",                label: "CA prévisionnel An 3",                 type: "text",     required: true },
      { step: 2, key: "croissance",            label: "Hypothèse de croissance annuelle",     type: "text",     placeholder: "Ex: +30% An 2, +20% An 3" },
      { step: 2, key: "saisonnalite",          label: "Saisonnalité des ventes",              type: "textarea", placeholder: "Mois forts / faibles, événements saisonniers..." },
      // Step 3 – Détail ventes
      { step: 3, key: "prix_vente_unitaire",   label: "Prix de vente unitaire(s)",            type: "textarea", required: true, placeholder: "Pour chaque produit/service : Prix HT, remises éventuelles" },
      { step: 3, key: "volume_ventes_m1",      label: "Volume de ventes prévu Mois 1",        type: "text" },
      { step: 3, key: "volume_ventes_m3",      label: "Volume de ventes prévu Mois 3",        type: "text" },
      { step: 3, key: "volume_ventes_m6",      label: "Volume de ventes prévu Mois 6",        type: "text" },
      { step: 3, key: "canaux_vente",          label: "Canaux de vente",                      type: "textarea", placeholder: "Direct, distributeurs, en ligne, agents..." },
      { step: 3, key: "politique_credit",      label: "Conditions de paiement clients",       type: "text",     placeholder: "Comptant, 30 jours, 60 jours..." },
      // Step 4 – Charges fixes
      { step: 4, key: "salaires",              label: "Masse salariale mensuelle brute",      type: "text",     required: true },
      { step: 4, key: "detail_salaires",       label: "Détail des postes salariés",           type: "textarea", placeholder: "Directeur X FCFA/mois, Comptable Y FCFA/mois..." },
      { step: 4, key: "loyer",                 label: "Loyer mensuel",                        type: "text" },
      { step: 4, key: "charges_fixes",         label: "Autres charges fixes mensuelles",      type: "textarea", required: true, placeholder: "Électricité, internet, téléphone, abonnements, assurances..." },
      { step: 4, key: "amortissements",        label: "Dotations aux amortissements prévues", type: "text",     placeholder: "Ex: 500 000 FCFA/mois sur équipements" },
      { step: 4, key: "provisions",            label: "Provisions (créances douteuses, etc)", type: "text",     placeholder: "Montant mensuel ou annuel" },
      // Step 5 – Charges variables
      { step: 5, key: "cout_variable",         label: "Coût variable principal (% CA ou par unité)", type: "textarea", required: true, placeholder: "Matières premières: X% du CA, Emballage: Y FCFA/unité..." },
      { step: 5, key: "cout_achat_marchandises",label: "Coût d'achat des marchandises",       type: "text",     placeholder: "Pour commerce : Prix d'achat moyen ou taux de marge brute" },
      { step: 5, key: "charges_transport",     label: "Charges de transport / livraison",     type: "text" },
      { step: 5, key: "commissions",           label: "Commissions & frais commerciaux",      type: "text",     placeholder: "% sur ventes, primes commerciaux..." },
      { step: 5, key: "autres_charges",        label: "Autres charges variables",             type: "textarea", placeholder: "Charges exceptionnelles, sous-traitance, prestataires..." },
      // Step 6 – Investissements
      { step: 6, key: "investissement_total",  label: "Investissement initial total (FCFA)",  type: "text",     required: true },
      { step: 6, key: "detail_investissement", label: "Détail des investissements",           type: "textarea", required: true, placeholder: "Équipements: X FCFA\nVéhicule: Y FCFA\nAménagement: Z FCFA\nFonds de roulement: W FCFA" },
      { step: 6, key: "duree_vie_equipements", label: "Durée de vie des équipements",         type: "textarea", placeholder: "Équipement A: 5 ans, Véhicule: 7 ans..." },
      { step: 6, key: "investissements_futurs",label: "Investissements prévus An 2-3",        type: "textarea", placeholder: "Nouveaux équipements, extension, second site..." },
      // Step 7 – Financement
      { step: 7, key: "financement_sources",   label: "Sources de financement",               type: "textarea", required: true, placeholder: "Apport propre: X FCFA\nCrédit bancaire: Y FCFA\nSubvention: Z FCFA" },
      { step: 7, key: "credit_conditions",     label: "Conditions du crédit bancaire",        type: "text",     placeholder: "Montant, taux d'intérêt, durée, mensualité" },
      { step: 7, key: "apport_nature",         label: "Apports en nature",                    type: "textarea", placeholder: "Matériel existant, local, véhicule déjà possédé..." },
      { step: 7, key: "subventions",           label: "Subventions & aides publiques",        type: "textarea", placeholder: "FASI, FNPJ, ANPEJ, aides sectorielles..." },
      // Step 8 – Trésorerie
      { step: 8, key: "delai_paiement_fournisseurs", label: "Délai de paiement fournisseurs",type: "text",     placeholder: "Comptant, 30 jours, 60 jours..." },
      { step: 8, key: "delai_encaissement",    label: "Délai d'encaissement clients",         type: "text",     placeholder: "Comptant, 30 jours..." },
      { step: 8, key: "stock_moyen",           label: "Niveau de stock moyen prévu",          type: "text",     placeholder: "Ex: 1 mois de CA, 500 000 FCFA..." },
      { step: 8, key: "bfr_estime",            label: "Besoin en fonds de roulement estimé",  type: "text",     placeholder: "Si déjà calculé, sinon laisser vide" },
      { step: 8, key: "reserve_tresorerie",    label: "Réserve de trésorerie souhaitée",      type: "text",     placeholder: "Ex: 3 mois de charges fixes = sécurité" },
      // Step 9 – Fiscalité
      { step: 9, key: "taux_imposition",       label: "Taux d'imposition applicable (IS/BIC)", type: "text",   placeholder: "Ex: IS 27,5% au Togo, BIC 30% en Côte d'Ivoire..." },
      { step: 9, key: "regime_tva",            label: "Régime TVA",                           type: "select",   options: ["Assujetti TVA (taux normal)", "Exonéré de TVA", "Régime simplifié", "Non concerné"] },
      { step: 9, key: "taux_tva",              label: "Taux de TVA applicable",               type: "text",     placeholder: "18% (UEMOA standard), 20%, autre..." },
      { step: 9, key: "autres_taxes",          label: "Autres taxes & contributions",         type: "textarea", placeholder: "Taxe professionnelle, contribution foncière, droits de douane..." },
      { step: 9, key: "avantages_fiscaux",     label: "Avantages fiscaux / exonérations",     type: "textarea", placeholder: "Code des investissements, zone franche, secteur prioritaire..." },
      // Step 10 – Hypothèses & KPIs
      { step: 10, key: "taux_change",          label: "Hypothèse de taux de change",          type: "text",     placeholder: "Si opérations en devises étrangères" },
      { step: 10, key: "taux_inflation",       label: "Hypothèse d'inflation",                type: "text",     placeholder: "Ex: 3% par an" },
      { step: 10, key: "autres_hypotheses",    label: "Autres hypothèses macroéconomiques",   type: "textarea" },
      { step: 10, key: "seuil_rentabilite",    label: "Objectif de seuil de rentabilité",     type: "text",     placeholder: "À quel mois souhaitez-vous atteindre le point mort ?" },
      { step: 10, key: "kpis_cibles",          label: "KPIs financiers cibles",               type: "textarea", placeholder: "Marge brute cible %, EBITDA An 3, ROI attendu, payback period..." },
      { step: 10, key: "scenarios",            label: "Scénarios à modéliser",                type: "select",   options: ["Base uniquement", "Base + Optimiste", "Base + Pessimiste", "Les 3 scénarios"] },
    ],
  },

  {
    id: "pack_business",
    category: "business",
    title: "Pack Business Complet",
    description: "Business Plan + BMC + Plan Marketing.",
    priceFcfa: 44925,
    badge: "Pack",
    icon: "Briefcase",
    steps: [
      { number: 1,  title: "Identité du projet" },
      { number: 2,  title: "Étude de marché" },
      { number: 3,  title: "Offre & Positionnement" },
      { number: 4,  title: "Stratégie commerciale" },
      { number: 5,  title: "Plan opérationnel" },
      { number: 6,  title: "Organisation & Équipe" },
      { number: 7,  title: "Plan financier" },
      { number: 8,  title: "Marketing & Communication" },
      { number: 9,  title: "Business Model Canvas" },
      { number: 10, title: "Risques & Conformité" },
      { number: 11, title: "ESG & Impact social" },
      { number: 12, title: "Vision & Compléments" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_projet",          label: "Nom du projet / entreprise",       type: "text",     required: true },
      { step: 1, key: "forme_juridique",     label: "Forme juridique",                  type: "select",   options: ["SARL", "SA", "SAS", "GIE", "Auto-entrepreneur"], required: true },
      { step: 1, key: "secteur",             label: "Secteur d'activité",               type: "text",     required: true },
      { step: 1, key: "pays",                label: "Pays / Zone",                      type: "text",     required: true },
      { step: 1, key: "date_creation",       label: "Date de création prévue",          type: "text" },
      { step: 1, key: "description",         label: "Description complète du projet",   type: "textarea", required: true },
      { step: 1, key: "vision_mission",      label: "Vision & Mission",                 type: "textarea" },
      { step: 1, key: "valeurs",             label: "Valeurs de l'entreprise",          type: "textarea", placeholder: "Innovation, durabilité, proximité client..." },
      // Step 2
      { step: 2, key: "marche_cible",        label: "Marché cible",                     type: "textarea", required: true },
      { step: 2, key: "taille_marche",       label: "Taille du marché (TAM/SAM/SOM)",   type: "textarea" },
      { step: 2, key: "tendances",           label: "Tendances & dynamiques du secteur",type: "textarea", placeholder: "Croissance, disruption, réglementation émergente..." },
      { step: 2, key: "concurrents",         label: "Analyse concurrentielle",          type: "textarea", required: true, placeholder: "Concurrents directs, indirects, forces/faiblesses" },
      { step: 2, key: "avantage",            label: "Avantage concurrentiel durable",   type: "textarea", required: true },
      { step: 2, key: "swot",                label: "Analyse SWOT",                     type: "textarea", placeholder: "Forces, Faiblesses, Opportunités, Menaces" },
      // Step 3
      { step: 3, key: "offre",               label: "Offre détaillée (produits/services)", type: "textarea", required: true },
      { step: 3, key: "prix",                label: "Structure de prix",                type: "textarea", required: true },
      { step: 3, key: "usp",                 label: "Proposition unique de valeur (USP)",type: "textarea", required: true },
      { step: 3, key: "roadmap_produit",     label: "Roadmap produit 12-24 mois",       type: "textarea", placeholder: "Évolution de l'offre dans le temps..." },
      // Step 4
      { step: 4, key: "canaux",              label: "Canaux de vente & distribution",   type: "textarea", required: true },
      { step: 4, key: "strategie_acquisition",label: "Stratégie d'acquisition clients", type: "textarea", required: true },
      { step: 4, key: "objectifs_ventes",    label: "Objectifs commerciaux An 1",       type: "textarea", required: true },
      { step: 4, key: "partenaires_commerciaux",label: "Partenaires commerciaux clés",  type: "textarea" },
      // Step 5
      { step: 5, key: "processus",           label: "Processus opérationnel principal", type: "textarea", required: true },
      { step: 5, key: "fournisseurs",        label: "Fournisseurs clés",                type: "textarea" },
      { step: 5, key: "infrastructure",      label: "Infrastructure & Locaux",          type: "textarea" },
      { step: 5, key: "technologie",         label: "Outils & Technologies utilisés",   type: "textarea", placeholder: "ERP, logiciels, plateformes, équipements..." },
      // Step 6
      { step: 6, key: "equipe",              label: "Équipe fondatrice",                type: "textarea", required: true },
      { step: 6, key: "effectif_prevu",      label: "Effectif prévu An 1 / An 2 / An 3",type: "textarea" },
      { step: 6, key: "postes_recruter",     label: "Postes prioritaires à recruter",   type: "textarea" },
      { step: 6, key: "competences_cles",    label: "Compétences clés de l'équipe",     type: "textarea" },
      // Step 7
      { step: 7, key: "investissement",      label: "Investissement initial total",     type: "text",     required: true },
      { step: 7, key: "ca_previsionnel",     label: "CA An 1 / An 2 / An 3",           type: "textarea", required: true },
      { step: 7, key: "charges",             label: "Charges principales",              type: "textarea", required: true },
      { step: 7, key: "financement",         label: "Sources de financement",           type: "textarea", required: true },
      { step: 7, key: "seuil_rentabilite",   label: "Point mort estimé",               type: "text" },
      { step: 7, key: "kpis_financiers",     label: "KPIs financiers cibles",          type: "textarea", placeholder: "Marge brute, EBITDA, ROI, délai de remboursement..." },
      // Step 8
      { step: 8, key: "cible_marketing",     label: "Persona / Cible marketing",        type: "textarea", required: true },
      { step: 8, key: "messages_cles",       label: "Messages marketing clés",          type: "textarea", required: true },
      { step: 8, key: "canaux_marketing",    label: "Canaux marketing",                 type: "textarea", required: true },
      { step: 8, key: "budget_marketing",    label: "Budget marketing mensuel",         type: "text" },
      { step: 8, key: "actions_6mois",       label: "Plan d'action marketing 6 mois",   type: "textarea" },
      // Step 9 – BMC
      { step: 9, key: "proposition_valeur",  label: "Proposition de valeur (BMC)",      type: "textarea", required: true },
      { step: 9, key: "segments",            label: "Segments clients (BMC)",           type: "textarea", required: true },
      { step: 9, key: "sources_revenus",     label: "Sources de revenus",               type: "textarea", required: true },
      { step: 9, key: "structure_couts",     label: "Structure de coûts",               type: "textarea", required: true },
      { step: 9, key: "activites_cles",      label: "Activités clés",                   type: "textarea", required: true },
      { step: 9, key: "ressources_cles",     label: "Ressources clés",                  type: "textarea" },
      { step: 9, key: "partenaires_cles",    label: "Partenaires clés",                 type: "textarea" },
      // Step 10
      { step: 10, key: "risques",            label: "Top 5 risques identifiés",         type: "textarea", required: true },
      { step: 10, key: "plan_mitigation",    label: "Plan de mitigation",               type: "textarea" },
      { step: 10, key: "conformite",         label: "Conformité réglementaire",         type: "textarea", placeholder: "Licences, autorisations, réglementations sectorielles..." },
      // Step 11
      { step: 11, key: "impact_social",      label: "Impact social",                    type: "textarea" },
      { step: 11, key: "impact_env",         label: "Impact environnemental",           type: "textarea" },
      { step: 11, key: "emplois_crees",      label: "Emplois directs & indirects",      type: "text" },
      { step: 11, key: "rse",                label: "Politique RSE prévue",             type: "textarea" },
      // Step 12
      { step: 12, key: "vision_5ans",        label: "Vision à 5 ans",                   type: "textarea" },
      { step: 12, key: "strategie_sortie",   label: "Stratégie de sortie / scalabilité",type: "textarea", placeholder: "Rachat, IPO, expansion internationale, franchise..." },
      { step: 12, key: "infos_complementaires",label: "Informations complémentaires",   type: "textarea" },
    ],
  },

  // ─── ARCHITECTURE ──────────────────────────────────────────────────────────
  {
    id: "archi",
    category: "architecture",
    title: "Programme Architectural",
    description: "Programme pièce par pièce avec surfaces, matériaux et estimation en FCFA.",
    priceFcfa: 26175,
    badge: "Exclusif",
    icon: "Home",
    steps: [
      { number: 1, title: "Maître d'ouvrage & Projet" },
      { number: 2, title: "Terrain & Environnement" },
      { number: 3, title: "Programme des espaces" },
      { number: 4, title: "Matériaux & Finitions" },
      { number: 5, title: "Équipements techniques" },
      { number: 6, title: "Budget & Planning" },
      { number: 7, title: "Contexte réglementaire" },
      { number: 8, title: "Énergie & Développement durable" },
      { number: 9, title: "Gestion du chantier" },
      { number: 10, title: "Compléments & Documents" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_maitre_ouvrage",label: "Nom du maître d'ouvrage",      type: "text",     required: true },
      { step: 1, key: "contact",           label: "Contact (email / tél)",        type: "text" },
      { step: 1, key: "type_construction", label: "Type de construction",         type: "select",   options: ["Villa individuelle", "Immeuble résidentiel", "Bâtiment commercial", "Bureau", "Hôtel", "École", "Clinique", "Entrepôt", "Mixte"], required: true },
      { step: 1, key: "destination_finale",label: "Destination finale",           type: "select",   options: ["Résidence principale", "Location", "Investissement", "Usage commercial", "Usage mixte"] },
      { step: 1, key: "localisation",      label: "Localisation du terrain",      type: "text",     required: true },
      { step: 1, key: "surface_terrain",   label: "Surface du terrain (m²)",      type: "text",     required: true },
      { step: 1, key: "surface_batiment",  label: "Surface bâtie souhaitée (m²)", type: "text",     required: true },
      { step: 1, key: "nb_niveaux",        label: "Nombre de niveaux",            type: "select",   options: ["Rez-de-chaussée", "R+1", "R+2", "R+3", "R+4 et plus"] },
      // Step 2
      { step: 2, key: "topographie",       label: "Topographie & nature du sol",  type: "textarea", placeholder: "Plat, en pente, sol argileux, rocheux, zone inondable..." },
      { step: 2, key: "orientation",       label: "Orientation souhaitée",        type: "select",   options: ["Nord-Sud (optimal)", "Est-Ouest", "À déterminer par l'architecte"] },
      { step: 2, key: "acces_terrain",     label: "Accès & façade sur rue",       type: "textarea", placeholder: "Largeur de façade, accès principal, accès de service..." },
      { step: 2, key: "voisinage",         label: "Contexte & voisinage",         type: "textarea", placeholder: "Résidentiel, commercial, vue à préserver, nuisances sonores..." },
      { step: 2, key: "reseaux_existants", label: "Réseaux disponibles sur la parcelle", type: "textarea", placeholder: "Eau, électricité, assainissement, internet..." },
      // Step 3
      { step: 3, key: "nb_chambres",       label: "Nombre de chambres",           type: "text",     required: true },
      { step: 3, key: "nb_salles_bain",    label: "Nombre de salles de bain",     type: "text" },
      { step: 3, key: "salon_sejour",      label: "Salon / Séjour (superficie estimée)", type: "text" },
      { step: 3, key: "cuisine",           label: "Type de cuisine",              type: "select",   options: ["Ouverte", "Fermée", "Américaine", "Extérieure"] },
      { step: 3, key: "espaces_speciaux",  label: "Espaces spéciaux",             type: "textarea", placeholder: "Bureau à domicile, salle de sport, cinéma, bibliothèque, gardiennage..." },
      { step: 3, key: "exterieur",         label: "Espaces extérieurs",           type: "textarea", placeholder: "Piscine, jardin, parking, terrasse, pergola, clôture..." },
      { step: 3, key: "logement_personnel",label: "Logement personnel de maison / gardien", type: "select", options: ["Oui, à intégrer", "Non", "À discuter"] },
      // Step 4
      { step: 4, key: "style_architectural",label: "Style architectural souhaité",type: "select",   options: ["Contemporain", "Tropical moderne", "Classique", "Méditerranéen", "Minimaliste", "Traditionnel africain"] },
      { step: 4, key: "references_visuelles",label: "Références visuelles / inspiration", type: "textarea", placeholder: "Décrivez ou référencez des projets qui vous inspirent..." },
      { step: 4, key: "materiaux_gros_oeuvre",label: "Matériaux gros œuvre",     type: "textarea", placeholder: "Structure béton armé, parpaings, brique, acier..." },
      { step: 4, key: "finitions_sols",    label: "Finitions sols",               type: "textarea", placeholder: "Carrelage (type/dimension), marbre, parquet, béton poli..." },
      { step: 4, key: "finitions_murs",    label: "Finitions murs & façade",      type: "textarea", placeholder: "Peinture, enduit, crépi, pierre, verre, zinc..." },
      { step: 4, key: "menuiseries",       label: "Menuiseries (portes/fenêtres)", type: "select",  options: ["Aluminium", "PVC", "Bois", "Acier", "Mixte"] },
      { step: 4, key: "standing_finitions",label: "Standing général souhaité",    type: "select",   options: ["Économique", "Standard", "Haut standing", "Luxe"] },
      // Step 5
      { step: 5, key: "electricite",       label: "Installation électrique",      type: "textarea", placeholder: "Nombre de circuits, domotique, groupe électrogène, panneaux solaires..." },
      { step: 5, key: "plomberie",         label: "Plomberie & Sanitaires",       type: "textarea", placeholder: "Château d'eau, fosse septique, réseau d'eau chaude, chauffe-eau..." },
      { step: 5, key: "climatisation",     label: "Climatisation & Ventilation",  type: "select",   options: ["Split système", "Climatisation centralisée", "VMC", "Ventilation naturelle", "Non prévue"] },
      { step: 5, key: "securite",          label: "Systèmes de sécurité",         type: "textarea", placeholder: "Alarme, caméras, interphone, portail automatique..." },
      { step: 5, key: "energie_solaire",   label: "Énergie solaire",              type: "select",   options: ["Panneaux solaires chauffe-eau", "Panneaux photovoltaïques", "Système hybride", "Non prévu"] },
      // Step 6
      { step: 6, key: "budget_total",      label: "Budget total en FCFA",         type: "text",     required: true },
      { step: 6, key: "contraintes_budget",label: "Contraintes budgétaires",      type: "textarea", placeholder: "Postes non négociables, postes où économiser..." },
      { step: 6, key: "delai_construction",label: "Délai de construction souhaité",type: "text",    placeholder: "Ex: 18 mois" },
      { step: 6, key: "phasage",           label: "Phasage des travaux",          type: "select",   options: ["Réalisation complète", "Phase 1 puis phase 2", "Selon budget disponible"] },
      { step: 6, key: "date_debut_souhaitee",label: "Date de début souhaitée",    type: "text",     placeholder: "Ex: Janvier 2026" },
      // Step 7
      { step: 7, key: "pays",              label: "Pays",                         type: "text",     required: true },
      { step: 7, key: "urbanisme",         label: "Règles d'urbanisme connues",   type: "textarea", placeholder: "COS, CES, hauteur maximale, retrait imposé..." },
      { step: 7, key: "permis_statut",     label: "Statut du permis de construire",type: "select",  options: ["À déposer", "En cours", "Obtenu", "Non requis"] },
      { step: 7, key: "besoins_speciaux",  label: "Besoins spéciaux / PMR",       type: "textarea", placeholder: "Accessibilité PMR, normes parasismiques, zone inondable..." },
      // Step 8
      { step: 8, key: "objectif_energie",  label: "Objectif énergétique",         type: "select",   options: ["Standard", "Basse consommation", "Autonomie partielle (solaire)", "Autonomie totale visée"] },
      { step: 8, key: "materiaux_locaux",  label: "Préférence pour matériaux locaux", type: "select", options: ["Oui, favoriser les matériaux locaux", "Non, matériaux importés", "Mix selon performance/prix"] },
      { step: 8, key: "gestion_eaux",      label: "Gestion des eaux pluviales",   type: "textarea", placeholder: "Récupération eaux de pluie, drainage, jardins secs..." },
      // Step 9
      { step: 9, key: "architecte_prevu",  label: "Architecte / BET déjà identifié", type: "select", options: ["Oui, déjà choisi", "Non, aide souhaitée pour le choix", "Sera défini après le programme"] },
      { step: 9, key: "mode_realisation",  label: "Mode de réalisation envisagé", type: "select",   options: ["Entreprise générale", "Corps d'état séparés", "Autogestion avec artisans", "À définir"] },
      { step: 9, key: "suivi_chantier",    label: "Suivi de chantier souhaité",   type: "select",   options: ["Maîtrise d'œuvre complète", "Suivi ponctuel", "Autogestion du suivi"] },
      // Step 10
      { step: 10, key: "plans_existants",  label: "Plans ou études existants",    type: "select",   options: ["Aucun", "Esquisse / avant-projet", "Plans d'exécution complets"] },
      { step: 10, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Exigences particulières, contraintes familiales, souhaits spécifiques..." },
    ],
  },

  {
    id: "devis",
    category: "architecture",
    title: "Devis de Construction",
    description: "Devis détaillé par lot de travaux avec prix unitaires.",
    priceFcfa: 14925,
    icon: "ClipboardList",
    steps: [
      { number: 1, title: "Maître d'ouvrage & Projet" },
      { number: 2, title: "Description des travaux" },
      { number: 3, title: "Lots de travaux" },
      { number: 4, title: "Matériaux & Main d'œuvre" },
      { number: 5, title: "Prestataire & Entreprise" },
      { number: 6, title: "Délais & Conditions financières" },
      { number: 7, title: "Clauses & Garanties" },
      { number: 8, title: "Compléments" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_client",        label: "Nom du client / maître d'ouvrage", type: "text", required: true },
      { step: 1, key: "adresse_client",    label: "Adresse du client",            type: "text",     placeholder: "Pour l'en-tête du devis" },
      { step: 1, key: "contact_client",    label: "Email / Téléphone client",     type: "text" },
      { step: 1, key: "localisation",      label: "Localisation du chantier",     type: "text",     required: true },
      { step: 1, key: "type_travaux",      label: "Type de travaux",              type: "select",   options: ["Construction neuve", "Rénovation", "Extension", "Aménagement intérieur", "Travaux extérieurs", "Aménagement paysager"], required: true },
      { step: 1, key: "surface",           label: "Surface concernée (m²)",       type: "text",     required: true },
      // Step 2
      { step: 2, key: "description_projet",label: "Description complète du projet", type: "textarea", required: true },
      { step: 2, key: "standing",          label: "Standing souhaité",            type: "select",   options: ["Économique", "Standard", "Haut standing", "Luxe"], required: true },
      { step: 2, key: "etat_existant",     label: "État actuel du bâtiment / site",type: "textarea", placeholder: "Décrivez l'état actuel si c'est une rénovation, travaux existants..." },
      { step: 2, key: "contraintes_chantier",label: "Contraintes de chantier",    type: "textarea", placeholder: "Accès difficile, bâtiment occupé, horaires restreints, mitoyenneté..." },
      // Step 3
      { step: 3, key: "lot_gros_oeuvre",   label: "Lot 1 — Gros œuvre",           type: "textarea", placeholder: "Fondations, dalle, murs, charpente, toiture... quantités estimées" },
      { step: 3, key: "lot_second_oeuvre", label: "Lot 2 — Second œuvre",         type: "textarea", placeholder: "Cloisonnement, isolation, plâtrerie, carrelage, peinture..." },
      { step: 3, key: "lot_elec",          label: "Lot 3 — Électricité",          type: "textarea", placeholder: "Tableau, câblage, prises, luminaires, groupe électrogène..." },
      { step: 3, key: "lot_plomberie",     label: "Lot 4 — Plomberie & Sanitaires",type: "textarea", placeholder: "Réseau eau, sanitaires, fosse, château d'eau..." },
      { step: 3, key: "lot_menuiserie",    label: "Lot 5 — Menuiserie",           type: "textarea", placeholder: "Portes, fenêtres, placards, escaliers, garde-corps..." },
      { step: 3, key: "lot_autres",        label: "Lots spéciaux / Autres",       type: "textarea", placeholder: "Climatisation, piscine, aménagement extérieur, sécurité, domotique..." },
      // Step 4
      { step: 4, key: "materiaux_pref",    label: "Préférences matériaux",        type: "textarea", placeholder: "Marques, fournisseurs, qualités, origines souhaitées..." },
      { step: 4, key: "fournitures_client",label: "Fournitures par le client",    type: "textarea", placeholder: "Carrelage, sanitaires, luminaires achetés séparément par le maître d'ouvrage..." },
      { step: 4, key: "main_oeuvre",       label: "Main d'œuvre dans le devis",   type: "select",   options: ["À inclure dans le devis", "Non incluse (fourniture seule)", "Partiellement incluse", "À discuter"] },
      // Step 5
      { step: 5, key: "nom_entreprise",    label: "Nom de l'entreprise / prestataire", type: "text", placeholder: "Entreprise qui établit le devis" },
      { step: 5, key: "contact_prestataire",label: "Contact du prestataire",      type: "text",     placeholder: "Email, téléphone, RCCM..." },
      { step: 5, key: "agrement",          label: "Agrément / Qualification",     type: "text",     placeholder: "Qualibat, agrément ministère, certifications..." },
      // Step 6
      { step: 6, key: "delai",             label: "Délai d'exécution des travaux",type: "text",     required: true },
      { step: 6, key: "budget_cible",      label: "Budget cible (FCFA)",          type: "text",     required: true },
      { step: 6, key: "conditions_paiement",label: "Conditions de paiement",      type: "select",   options: ["Avance 30% + solde", "Paiement par phases", "Paiement à réception", "Avance 50% + solde", "À négocier"] },
      { step: 6, key: "tva_applicable",    label: "TVA applicable",               type: "select",   options: ["TVA 18% incluse", "TVA 18% en sus", "Exonéré de TVA", "Autre taux"] },
      { step: 6, key: "validite_devis",    label: "Durée de validité du devis",   type: "text",     placeholder: "Ex: 30 jours, 60 jours..." },
      // Step 7
      { step: 7, key: "garantie_travaux",  label: "Garantie offerte sur les travaux", type: "text", placeholder: "Ex: garantie 1 an pièces & main d'œuvre" },
      { step: 7, key: "assurance_rc",      label: "Assurance RC professionnelle", type: "select",   options: ["Oui, à mentionner", "Non / Non applicable"] },
      { step: 7, key: "penalites_retard",  label: "Pénalités de retard",          type: "text",     placeholder: "Ex: 0,5% du montant HT par semaine de retard" },
      // Step 8
      { step: 8, key: "plans_disponibles", label: "Plans disponibles",            type: "select",   options: ["Oui, plans complets", "Oui, esquisse seulement", "Non, estimation approximative"] },
      { step: 8, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Tout ce qui n'a pas été couvert : accès au site, stockage, sécurité..." },
    ],
  },

  {
    id: "cdc",
    category: "architecture",
    title: "Cahier des Charges",
    description: "CDC technique complet pour lancer un appel d'offres de construction.",
    priceFcfa: 18675,
    icon: "FileCheck",
    steps: [
      { number: 1, title: "Commanditaire & Contexte" },
      { number: 2, title: "Description du projet" },
      { number: 3, title: "Exigences techniques" },
      { number: 4, title: "Exigences environnementales & Normes" },
      { number: 5, title: "Lots & Prestations" },
      { number: 6, title: "Planning & Budget" },
      { number: 7, title: "Conditions contractuelles" },
      { number: 8, title: "Critères & Sélection" },
      { number: 9, title: "Documents & Procédures" },
      { number: 10, title: "Compléments" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "commanditaire",     label: "Commanditaire / Maître d'ouvrage",type: "text",  required: true },
      { step: 1, key: "contact",           label: "Contact (nom, email, tél)",    type: "text" },
      { step: 1, key: "organisme",         label: "Type d'organisme",             type: "select",   options: ["Entreprise privée", "Administration publique", "ONG / Association", "Promoteur immobilier", "Collectivité locale"] },
      { step: 1, key: "contexte",          label: "Contexte du projet",           type: "textarea", required: true, placeholder: "Pourquoi ce projet ? Enjeux institutionnels, historique du besoin..." },
      { step: 1, key: "objectifs",         label: "Objectifs du CDC",             type: "textarea", required: true, placeholder: "Ce que le CDC doit permettre d'obtenir : offres, comparaisons, choix d'entreprise..." },
      // Step 2
      { step: 2, key: "type_projet",       label: "Type de projet",               type: "text",     required: true },
      { step: 2, key: "localisation",      label: "Localisation",                 type: "text",     required: true },
      { step: 2, key: "pays",              label: "Pays",                         type: "text",     required: true },
      { step: 2, key: "surface_shon",      label: "Surface SHON / SHOB (m²)",     type: "text",     required: true },
      { step: 2, key: "programme",         label: "Programme détaillé",           type: "textarea", required: true, placeholder: "Espaces, fonctions, surfaces par local, flux de personnes..." },
      { step: 2, key: "description_generale",label: "Description générale des travaux", type: "textarea", required: true, placeholder: "Vue d'ensemble de la construction ou rénovation à réaliser..." },
      // Step 3
      { step: 3, key: "normes_applicables",label: "Normes applicables",           type: "textarea", placeholder: "Normes OHADA, ISO 9001, locales, sismiques, incendie, PMR..." },
      { step: 3, key: "exig_techniques",   label: "Exigences techniques",         type: "textarea", required: true, placeholder: "Structure, matériaux, performances thermiques, acoustique, résistance..." },
      { step: 3, key: "performances_visees",label: "Performances visées",         type: "textarea", placeholder: "Consommation énergétique cible, durée de vie, niveaux acoustiques..." },
      { step: 3, key: "essais_controles",  label: "Essais & contrôles qualité obligatoires", type: "textarea", placeholder: "Essais béton, étanchéité, tests électriques, contrôles de conformité..." },
      // Step 4
      { step: 4, key: "exig_environnement",label: "Exigences environnementales",  type: "textarea", placeholder: "HQE, matériaux locaux, énergie solaire, gestion des eaux pluviales..." },
      { step: 4, key: "gestion_dechets",   label: "Gestion des déchets de chantier",type: "textarea",placeholder: "Tri, évacuation, recyclage, zone de dépôt autorisée..." },
      { step: 4, key: "securite_chantier", label: "Sécurité & hygiène chantier",  type: "textarea", placeholder: "EPI obligatoires, plan de prévention, signalisation, clôture chantier..." },
      // Step 5
      { step: 5, key: "lots_travaux",      label: "Décomposition en lots",        type: "textarea", required: true, placeholder: "Lot 1: Gros œuvre, Lot 2: Électricité, Lot 3: Plomberie...", hint: "Précisez si les lots sont séparés (multi-entreprises) ou groupés (entreprise générale)" },
      { step: 5, key: "prestations_exclues",label: "Prestations exclues du CDC",  type: "textarea", placeholder: "Ce qui est fourni par le maître d'ouvrage ou hors marché..." },
      { step: 5, key: "livrables_attendus",label: "Livrables attendus",           type: "textarea", placeholder: "Plans d'exécution, DOE, fiches techniques, rapports de chantier..." },
      // Step 6
      { step: 6, key: "planning_global",   label: "Planning global souhaité",     type: "textarea", required: true, placeholder: "Date de lancement AO, remise offres, démarrage travaux, fin des travaux..." },
      { step: 6, key: "budget_enveloppe",  label: "Enveloppe budgétaire (FCFA)", type: "text",     placeholder: "Montant indicatif si communicable aux soumissionnaires" },
      { step: 6, key: "duree_garantie",    label: "Durée de garantie exigée",     type: "text",     placeholder: "Ex: Garantie décennale, parfait achèvement 1 an..." },
      // Step 7
      { step: 7, key: "modalites_paiement",label: "Modalités de paiement",        type: "textarea", placeholder: "Avance sur démarrage, situations mensuelles, retenue de garantie 5%..." },
      { step: 7, key: "penalites_retard",  label: "Pénalités de retard",          type: "text",     placeholder: "Ex: 1‰ du montant du marché par jour calendaire de retard" },
      { step: 7, key: "assurances_requises",label: "Assurances requises",         type: "textarea", placeholder: "RC décennale, tous risques chantier, RC professionnelle..." },
      // Step 8
      { step: 8, key: "criteres_selection",label: "Critères de sélection des offres",type: "textarea",required: true, placeholder: "60% technique + 40% financier, références exigées (5 ans min), agréments..." },
      { step: 8, key: "ponderation",       label: "Pondération des critères",     type: "textarea", placeholder: "Technique: X%, Prix: Y%, Délai: Z%, Qualité équipe: W%..." },
      { step: 8, key: "references_exigees",label: "Références exigées",           type: "textarea", placeholder: "Ex: 3 chantiers similaires dans les 5 dernières années..." },
      // Step 9
      { step: 9, key: "docs_a_fournir",    label: "Documents à fournir par les soumissionnaires", type: "textarea", required: true, placeholder: "RCCM, attestations fiscales et CNSS, bilans, liste références, CV équipe clé, agrément..." },
      { step: 9, key: "mode_remise_offres",label: "Mode de remise des offres",    type: "select",   options: ["Pli fermé physique", "Email chiffré", "Plateforme en ligne", "À définir"] },
      { step: 9, key: "questions_soumissionnaires",label: "Procédure pour questions", type: "textarea", placeholder: "Comment les soumissionnaires peuvent poser des questions, délai de réponse..." },
      // Step 10
      { step: 10, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Contexte particulier, exigences spécifiques, annexes à prévoir..." },
    ],
  },

  {
    id: "permis",
    category: "architecture",
    title: "Dossier Permis de Construire",
    description: "Dossier complet pour demande de permis de construire.",
    priceFcfa: 22425,
    icon: "Stamp",
    steps: [
      { number: 1, title: "Demandeur" },
      { number: 2, title: "Terrain & Parcelle" },
      { number: 3, title: "Nature des travaux" },
      { number: 4, title: "Surfaces & Dimensions" },
      { number: 5, title: "Conformité réglementaire" },
      { number: 6, title: "Architecte & Intervenants" },
      { number: 7, title: "Pièces administratives" },
      { number: 8, title: "Aspects techniques spéciaux" },
      { number: 9, title: "Planning & Suivi" },
      { number: 10, title: "Compléments" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_demandeur",     label: "Nom complet du demandeur",     type: "text",     required: true },
      { step: 1, key: "qualite",           label: "Qualité du demandeur",         type: "select",   options: ["Propriétaire", "Locataire avec autorisation", "Promoteur", "Maître d'ouvrage délégué"] },
      { step: 1, key: "adresse_demandeur", label: "Adresse du demandeur",         type: "text",     required: true },
      { step: 1, key: "contact",           label: "Téléphone / Email",            type: "text",     required: true },
      { step: 1, key: "nationalite_demandeur",label: "Nationalité du demandeur",  type: "text" },
      { step: 1, key: "forme_juridique_demandeur",label: "Personne physique ou morale",type: "select",options: ["Personne physique", "Société / Entreprise", "Association / ONG", "Administration"] },
      // Step 2
      { step: 2, key: "localisation",      label: "Adresse / Localisation du terrain", type: "text", required: true },
      { step: 2, key: "pays",              label: "Pays",                         type: "text",     required: true },
      { step: 2, key: "commune_quartier",  label: "Commune / Quartier / Arrondissement", type: "text" },
      { step: 2, key: "section_cadastrale",label: "Section cadastrale / N° de lot",type: "text",    placeholder: "Référence cadastrale si connue" },
      { step: 2, key: "surface_terrain",   label: "Surface du terrain (m²)",      type: "text",     required: true },
      { step: 2, key: "zone_urbanisme",    label: "Zone d'urbanisme",             type: "text",     placeholder: "Zone résidentielle R1, commerciale, mixte, industrielle..." },
      { step: 2, key: "acces_viabilites",  label: "Accès & Viabilités",           type: "textarea", placeholder: "Eau, électricité, voirie, assainissement disponibles..." },
      { step: 2, key: "servitudes",        label: "Servitudes connues",           type: "textarea", placeholder: "Passage, vue, écoulement, alignement, zone non aedificandi..." },
      // Step 3
      { step: 3, key: "nature_travaux",    label: "Nature des travaux",           type: "select",   options: ["Construction neuve", "Extension", "Surélévation", "Réhabilitation", "Changement de destination", "Démolition"], required: true },
      { step: 3, key: "destination",       label: "Destination du bâtiment",      type: "select",   options: ["Habitation individuelle", "Immeuble collectif", "Commerce", "Bureau", "Industrie", "Hôtel / ERP", "Enseignement", "Santé", "Mixte"] },
      { step: 3, key: "description_projet",label: "Description du projet",        type: "textarea", required: true, placeholder: "Nature, nombre de logements / bureaux, programme général..." },
      { step: 3, key: "mode_construction", label: "Mode constructif",             type: "textarea", placeholder: "Structure béton armé, parpaings, préfabriqué, bois..." },
      // Step 4
      { step: 4, key: "shon",              label: "SHON — Surface Hors Œuvre Nette (m²)", type: "text", required: true },
      { step: 4, key: "shob",              label: "SHOB — Surface Hors Œuvre Brute (m²)", type: "text" },
      { step: 4, key: "emprise_sol",       label: "Emprise au sol (m²)",          type: "text",     required: true },
      { step: 4, key: "hauteur_totale",    label: "Hauteur totale (m)",           type: "text",     required: true },
      { step: 4, key: "nb_niveaux",        label: "Nombre de niveaux",            type: "text",     required: true },
      { step: 4, key: "surface_par_niveau",label: "Surface par niveau (si différente)", type: "textarea", placeholder: "RDC: 200m², R+1: 180m², R+2: 150m²..." },
      // Step 5
      { step: 5, key: "cos_ces",           label: "COS / CES applicable",         type: "text",     placeholder: "Coefficient d'occupation et d'emprise au sol en vigueur" },
      { step: 5, key: "retraits",          label: "Retraits réglementaires",      type: "textarea", placeholder: "Retrait façade sur rue, latéraux, fond de parcelle en mètres..." },
      { step: 5, key: "hauteur_max",       label: "Hauteur maximale autorisée (m)",type: "text",    placeholder: "Selon le POS / PLU local" },
      { step: 5, key: "coefficient_espaces_verts",label: "Obligation espaces verts (%)",type: "text",placeholder: "% de la parcelle devant rester non construite et végétalisée" },
      // Step 6
      { step: 6, key: "architecte",        label: "Nom de l'architecte / bureau d'études",type: "text" },
      { step: 6, key: "ordre_architectes", label: "N° d'inscription à l'Ordre des architectes", type: "text", placeholder: "Obligatoire dans la plupart des pays OHADA pour les permis" },
      { step: 6, key: "bureau_controle",   label: "Bureau de contrôle technique", type: "text",     placeholder: "Si requis selon le type et la taille du bâtiment" },
      { step: 6, key: "bet_structure",     label: "Bureau d'études structure",    type: "text",     placeholder: "Nom et qualifications du BET structure si séparé de l'architecte" },
      // Step 7
      { step: 7, key: "titre_foncier",     label: "Titre foncier / Acte de propriété", type: "select", options: ["Disponible", "En cours d'obtention", "Non encore établi"] },
      { step: 7, key: "autres_docs",       label: "Autres documents disponibles", type: "textarea", placeholder: "Étude de sol, plan topographique, certificat d'urbanisme, devis estimatif..." },
      // Step 8
      { step: 8, key: "pmr",               label: "Accessibilité PMR requise",    type: "select",   options: ["Oui (bâtiment recevant du public)", "Non (habitation privée)", "À vérifier"] },
      { step: 8, key: "normes_seismes",    label: "Zone sismique / Normes parasismiques", type: "select", options: ["Zone sismique (normes spécifiques)", "Zone non sismique", "À vérifier"] },
      { step: 8, key: "protection_incendie",label: "Protection incendie",         type: "textarea", placeholder: "Sprinklers, extincteurs, sorties de secours, déclencheurs automatiques..." },
      // Step 9
      { step: 9, key: "date_depot",        label: "Date prévue de dépôt du dossier",type: "text",  placeholder: "Ex: Janvier 2026" },
      { step: 9, key: "delai_instruction", label: "Délai d'instruction attendu",  type: "text",     placeholder: "Variable selon le pays : 30 à 90 jours en général" },
      { step: 9, key: "debut_travaux",     label: "Date souhaitée de début des travaux", type: "text", placeholder: "Après obtention du permis..." },
      // Step 10
      { step: 10, key: "observations",     label: "Observations / Particularités du dossier", type: "textarea", placeholder: "Contraintes particulières, antécédents administratifs, accords préalables obtenus..." },
      { step: 10, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Tout autre élément utile pour constituer le dossier..." },
    ],
  },

  {
    id: "pack_archi",
    category: "architecture",
    title: "Pack Architecture Complet",
    description: "Programme + Devis + Cahier des charges en un seul pack.",
    priceFcfa: 52425,
    badge: "Pack",
    icon: "Building",
    steps: [
      { number: 1,  title: "Maître d'ouvrage & Terrain" },
      { number: 2,  title: "Analyse du terrain" },
      { number: 3,  title: "Programme architectural" },
      { number: 4,  title: "Espaces & Fonctions" },
      { number: 5,  title: "Matériaux & Finitions" },
      { number: 6,  title: "Équipements techniques" },
      { number: 7,  title: "Lots de travaux & Devis" },
      { number: 8,  title: "Budget & Délais" },
      { number: 9,  title: "CDC & Sélection entrepreneurs" },
      { number: 10, title: "Gestion de chantier" },
      { number: 11, title: "Réglementation & Urbanisme" },
      { number: 12, title: "Documentation & Réception" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_maitre",         label: "Maître d'ouvrage",              type: "text",     required: true },
      { step: 1, key: "contact",            label: "Email / Téléphone",             type: "text" },
      { step: 1, key: "localisation",       label: "Localisation du projet",        type: "text",     required: true },
      { step: 1, key: "pays",               label: "Pays",                          type: "text",     required: true },
      { step: 1, key: "surface_terrain",    label: "Surface terrain (m²)",          type: "text",     required: true },
      { step: 1, key: "type_construction",  label: "Type de construction",          type: "select",   options: ["Villa individuelle", "Immeuble résidentiel", "Commercial", "Bureau", "Hôtel", "École", "Clinique", "Entrepôt", "Mixte"], required: true },
      { step: 1, key: "destination_finale", label: "Destination finale du bâtiment",type: "select",   options: ["Résidence principale", "Location", "Investissement locatif", "Usage commercial", "Usage mixte"] },
      // Step 2
      { step: 2, key: "forme_parcelle",     label: "Forme & nature de la parcelle", type: "textarea", placeholder: "Rectangulaire, irrégulière, en pente, mitoyenne, en angle..." },
      { step: 2, key: "acces",              label: "Accès à la parcelle",           type: "textarea", placeholder: "Accès voirie, largeur de façade sur rue, portail prévu..." },
      { step: 2, key: "reseaux_existants",  label: "Réseaux existants",             type: "textarea", placeholder: "Eau, électricité, assainissement, téléphone disponibles ?" },
      { step: 2, key: "topographie",        label: "Topographie & sol",             type: "textarea", placeholder: "Plat, en pente, sol argileux, rocheux, zone inondable..." },
      { step: 2, key: "orientation",        label: "Orientation souhaitée",         type: "select",   options: ["Nord-Sud (ensoleillement optimal)", "Est-Ouest", "À déterminer par l'architecte"] },
      { step: 2, key: "voisinage",          label: "Contexte & voisinage",          type: "textarea", placeholder: "Résidentiel calme, commercial, industriel, rural, vue à préserver..." },
      // Step 3
      { step: 3, key: "surface_batiment",   label: "Surface bâtie souhaitée (m²)", type: "text",     required: true },
      { step: 3, key: "nb_niveaux",         label: "Nombre de niveaux",             type: "select",   options: ["Rez-de-chaussée", "R+1", "R+2", "R+3", "R+4 et plus"] },
      { step: 3, key: "toit",               label: "Type de toiture",               type: "select",   options: ["Toit en pente (tuiles)", "Toit terrasse", "Toit mixte", "Toit plat accessible", "Toiture végétalisée"] },
      { step: 3, key: "style",              label: "Style architectural",           type: "select",   options: ["Contemporain", "Tropical moderne", "Classique", "Méditerranéen", "Minimaliste", "Traditionnel africain"] },
      { step: 3, key: "references_visuelles",label: "Références visuelles",         type: "textarea", placeholder: "Décrivez des maisons que vous admirez, ou des styles que vous aimez..." },
      // Step 4
      { step: 4, key: "programme_espaces",  label: "Programme détaillé des espaces",type: "textarea", required: true, placeholder: "Nb chambres, salons, bureau, bibliothèque, salle de sport, gardien..." },
      { step: 4, key: "pieces_privatives",  label: "Espaces privatifs (chambres)",  type: "textarea", placeholder: "Chambre master avec dressing, chambres enfants, suite invités..." },
      { step: 4, key: "espaces_communs",    label: "Espaces de vie communs",        type: "textarea", placeholder: "Salon, salle à manger, cuisine, salle de jeux, bibliothèque..." },
      { step: 4, key: "espaces_service",    label: "Espaces de service",            type: "textarea", placeholder: "Buanderie, débarras, lingerie, garage, local technique, logement gardien..." },
      { step: 4, key: "espaces_ext",        label: "Aménagements extérieurs",       type: "textarea", placeholder: "Piscine, jardin, terrasse, pergola, parking, clôture, portail..." },
      // Step 5
      { step: 5, key: "standing",           label: "Standing souhaité",             type: "select",   options: ["Économique", "Standard", "Haut standing", "Luxe"], required: true },
      { step: 5, key: "materiaux_gros",     label: "Gros œuvre (structure)",        type: "textarea", placeholder: "Béton armé, parpaings, briques, acier, bois..." },
      { step: 5, key: "materiaux",          label: "Finitions intérieures",         type: "textarea", required: true, placeholder: "Sols (carrelage, marbre, parquet), murs, plafonds..." },
      { step: 5, key: "facade",             label: "Traitement façade",             type: "textarea", placeholder: "Crépi peint, bardage, pierre, verre, bois..." },
      { step: 5, key: "menuiseries",        label: "Menuiseries extérieures",       type: "select",   options: ["Aluminium laqué", "PVC", "Bois exotique", "Acier", "Mixte aluminium-bois"] },
      { step: 5, key: "sanitaires",         label: "Niveau équipement sanitaires",  type: "select",   options: ["Standard", "Moyen-haut de gamme", "Haut de gamme", "Luxe"] },
      // Step 6
      { step: 6, key: "electricite",        label: "Installation électrique",       type: "textarea", placeholder: "Nombre de circuits, puissance, groupe électrogène, panneaux solaires, domotique..." },
      { step: 6, key: "plomberie",          label: "Plomberie & sanitaires",        type: "textarea", placeholder: "Château d'eau, fosse septique/STEP, eau chaude solaire, réseau incendie..." },
      { step: 6, key: "climatisation",      label: "Climatisation & ventilation",   type: "select",   options: ["Split multi-split", "Climatisation centralisée", "VMC double flux", "Ventilation naturelle renforcée", "Non prévue"] },
      { step: 6, key: "securite",           label: "Systèmes de sécurité",          type: "textarea", placeholder: "Alarme, caméras IP, interphone vidéo, portail automatique, coffre-fort..." },
      { step: 6, key: "energie_solaire",    label: "Énergie solaire / autonomie",   type: "select",   options: ["Panneaux solaires chauffe-eau", "Panneaux photovoltaïques", "Système hybride complet", "Non prévu"] },
      { step: 6, key: "smart_home",         label: "Domotique / Smart Home",        type: "select",   options: ["Basique (éclairage automatisé)", "Intermédiaire (télécommande à distance)", "Complet (automatisation totale)", "Non prévu"] },
      // Step 7
      { step: 7, key: "lots_details",       label: "Décomposition en lots",         type: "textarea", required: true, placeholder: "Lot 1: Terrassement\nLot 2: Fondations + Gros œuvre\nLot 3: Couverture\nLot 4: Second œuvre..." },
      { step: 7, key: "sous_traitance",     label: "Postes à sous-traiter",         type: "textarea", placeholder: "Électricité, plomberie, menuiserie aluminium, peinture spécialisée..." },
      { step: 7, key: "fournitures_maitre", label: "Fournitures par le maître d'ouvrage", type: "textarea", placeholder: "Carrelage acheté séparément, appareils sanitaires, luminaires..." },
      // Step 8
      { step: 8, key: "budget_total",       label: "Budget total en FCFA",          type: "text",     required: true },
      { step: 8, key: "budget_repartition", label: "Répartition budgétaire",        type: "textarea", placeholder: "Gros œuvre: X%, Second œuvre: Y%, Finitions: Z%, Équipements: W%..." },
      { step: 8, key: "delai",              label: "Délai de réalisation souhaité", type: "text",     required: true, placeholder: "Ex: 18 mois à partir de l'ordre de service" },
      { step: 8, key: "phasage",            label: "Phasage des travaux",           type: "select",   options: ["Réalisation complète en une phase", "Phase 1 (clos-couvert) puis Phase 2", "Selon budget disponible"] },
      { step: 8, key: "date_souhaitee",     label: "Date de livraison souhaitée",   type: "text" },
      // Step 9
      { step: 9, key: "normes",             label: "Normes & exigences techniques", type: "textarea", placeholder: "Résistance sismique, normes incendie, accessibilité PMR, HQE..." },
      { step: 9, key: "criteres_selection", label: "Critères de sélection des entrepreneurs", type: "textarea", required: true, placeholder: "Références exigées, agréments, capacité financière, délai de réponse AO..." },
      { step: 9, key: "docs_soumissionnaires",label: "Documents à fournir par les entreprises", type: "textarea", placeholder: "RCCM, bilans, assurances, liste de références, attestations..." },
      { step: 9, key: "mode_passation",     label: "Mode de passation des marchés", type: "select",   options: ["Appel d'offres ouvert", "Appel d'offres restreint", "Entente directe", "Concours d'architecture"] },
      // Step 10
      { step: 10, key: "maitre_oeuvre",     label: "Maître d'œuvre prévu",          type: "textarea", placeholder: "Architecte, bureau d'études, entreprise générale..." },
      { step: 10, key: "suivi_chantier",    label: "Fréquence de suivi de chantier",type: "select",   options: ["Hebdomadaire", "Bimensuel", "Mensuel", "En régie directe"] },
      { step: 10, key: "reunion_chantier",  label: "Procédure de réunions de chantier", type: "textarea", placeholder: "Qui participe ? PV de réunion ? Décisions formelles ?" },
      { step: 10, key: "controle_qualite",  label: "Contrôles qualité pendant travaux", type: "textarea", placeholder: "Béton (essais de compression), étanchéité, essais électriques..." },
      { step: 10, key: "paiements_entreprises",label: "Modalités de paiement entrepreneurs", type: "select",   options: ["Avance 30% + situations mensuelles", "Par phase", "À réception de chaque lot", "À négocier"] },
      // Step 11
      { step: 11, key: "reglementation",    label: "Contraintes réglementaires connues", type: "textarea" },
      { step: 11, key: "permis_statut",     label: "Statut du permis de construire",type: "select",   options: ["À déposer (non commencé)", "En cours d'instruction", "Obtenu", "Non requis"] },
      { step: 11, key: "cos_ces",           label: "COS / CES applicable",          type: "text",     placeholder: "Coefficient d'occupation et d'emprise au sol" },
      { step: 11, key: "contraintes_env",   label: "Contraintes environnementales", type: "textarea", placeholder: "Arbres à protéger, zone inondable, vue protégée, mitoyenneté sensible..." },
      // Step 12
      { step: 12, key: "plans_existants",   label: "Plans ou études existants",     type: "select",   options: ["Aucun", "Esquisse / avant-projet", "Plans d'exécution complets", "Permis obtenu avec plans"] },
      { step: 12, key: "reception_travaux", label: "Procédure de réception souhaitée", type: "textarea", placeholder: "Réception par lot, réception globale, réserves, garantie de parfait achèvement..." },
      { step: 12, key: "dossier_final",     label: "Documents attendus en fin de projet", type: "textarea", placeholder: "Plans conformes à l'exécution, DOE, DIUO, manuel d'utilisation..." },
      { step: 12, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea" },
    ],
  },

  // ─── JURIDIQUE ─────────────────────────────────────────────────────────────
  {
    id: "statuts",
    category: "juridique",
    title: "Statuts de Société",
    description: "Statuts officiels conformes au droit OHADA.",
    priceFcfa: 14925,
    badge: "Exclusif",
    icon: "Scale",
    steps: [
      { number: 1, title: "Identification de la société" },
      { number: 2, title: "Forme juridique & Capital" },
      { number: 3, title: "Objet social & Activités" },
      { number: 4, title: "Associés & Gérants" },
      { number: 5, title: "Gouvernance & Décisions" },
      { number: 6, title: "Distribution des bénéfices" },
      { number: 7, title: "Cession & Transmission" },
      { number: 8, title: "Dispositions spéciales & Clauses" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_societe",       label: "Dénomination sociale",         type: "text",     required: true },
      { step: 1, key: "sigle",             label: "Sigle (si applicable)",        type: "text" },
      { step: 1, key: "siege",             label: "Siège social (adresse complète)",type: "text",   required: true },
      { step: 1, key: "pays",              label: "Pays",                         type: "text",     required: true, placeholder: "Togo, Côte d'Ivoire, Sénégal, Cameroun..." },
      { step: 1, key: "ville",             label: "Ville",                        type: "text",     required: true },
      { step: 1, key: "date_creation_prevue",label: "Date de création prévue",    type: "text",     placeholder: "Janvier 2026 ou déjà constituée le..." },
      // Step 2
      { step: 2, key: "forme_juridique",   label: "Forme juridique",              type: "select",   options: ["SARL", "SA", "SAS", "SASU", "SNC", "SCS", "GIE", "SP"], required: true },
      { step: 2, key: "capital_social",    label: "Capital social (FCFA)",        type: "text",     required: true, hint: "Pour une SARL en zone OHADA : minimum 1 000 000 FCFA (1M FCFA)" },
      { step: 2, key: "nature_apports",    label: "Nature des apports",           type: "select",   options: ["Numéraire uniquement", "Numéraire + Nature", "Nature uniquement"] },
      { step: 2, key: "parts_actions",     label: "Nombre de parts / actions",    type: "text",     required: true },
      { step: 2, key: "valeur_nominale",   label: "Valeur nominale par part/action",type: "text",  required: true },
      { step: 2, key: "capital_libere",    label: "Capital libéré à la constitution",type: "select",options: ["100% libéré", "50% libéré, solde sous 2 ans", "Autre (à préciser)"], hint: "En droit OHADA, le capital doit être intégralement libéré dans les 2 ans" },
      // Step 3
      { step: 3, key: "objet_social",      label: "Objet social principal",       type: "textarea", required: true, placeholder: "Activités principales exercées par la société...", hint: "Rédigez l'objet de manière assez large pour couvrir vos évolutions futures" },
      { step: 3, key: "activites_secondaires",label: "Activités accessoires / secondaires",type: "textarea", placeholder: "Activités complémentaires, connexes ou accessoires..." },
      { step: 3, key: "activite_reglementee",label: "Activité réglementée / agrémentée", type: "select", options: ["Oui (agrément requis)", "Non", "En cours d'obtention d'agrément"] },
      { step: 3, key: "duree_societe",     label: "Durée de la société (années)", type: "text",     placeholder: "99 ans en général" },
      // Step 4
      { step: 4, key: "associes",          label: "Liste des associés",           type: "textarea", required: true, placeholder: "Pour chaque associé: Nom, nationalité, adresse, nbre de parts, % capital" },
      { step: 4, key: "gerant_principal",  label: "Gérant / PDG principal",       type: "text",     required: true, placeholder: "Nom complet, nationalité, adresse" },
      { step: 4, key: "mandat_gerant",     label: "Durée du mandat de gérance",   type: "text",     placeholder: "Ex: 3 ans renouvelables, illimité..." },
      { step: 4, key: "pouvoirs_gerant",   label: "Pouvoirs du gérant",           type: "textarea", placeholder: "Actes qu'il peut faire seul, actes nécessitant l'accord des associés..." },
      { step: 4, key: "autres_dirigeants", label: "Autres dirigeants (si applicable)",type: "textarea", placeholder: "Co-gérant, DG, administrateurs, directeurs de filiales..." },
      // Step 5
      { step: 5, key: "regime_decisions",  label: "Régime des décisions collectives",type: "textarea",required: true, placeholder: "Quorum, majorité requise pour les AG ordinaires et extraordinaires..." },
      { step: 5, key: "decisions_unanimes",label: "Décisions à l'unanimité",      type: "textarea", placeholder: "Modification des statuts, augmentation de capital, dissolution..." },
      { step: 5, key: "exercice_social",   label: "Date de clôture de l'exercice social",type: "text", placeholder: "Ex: 31 décembre" },
      { step: 5, key: "commissaire_comptes",label: "Commissaire aux comptes",     type: "select",   options: ["Obligatoire (SA, grande SARL)", "Non requis", "Nommé volontairement"] },
      // Step 6
      { step: 6, key: "affectation_resultats",label: "Affectation des résultats", type: "textarea", required: true, placeholder: "Réserve légale (10% jusqu'à 20% du capital), dividendes, report à nouveau..." },
      { step: 6, key: "dividendes_intermediaires",label: "Dividendes intermédiaires",type: "select",options: ["Autorisés", "Non autorisés", "Sur décision du gérant"] },
      { step: 6, key: "comptes_courants",  label: "Comptes courants d'associés",  type: "select",   options: ["Autorisés avec convention", "Non autorisés", "Sur décision AG"] },
      // Step 7
      { step: 7, key: "cession_parts",     label: "Conditions de cession des parts",type: "textarea", required: true, placeholder: "Droit de préemption, agrément obligatoire des associés, délai de réponse..." },
      { step: 7, key: "droit_preemption",  label: "Droit de préemption détaillé", type: "textarea", placeholder: "Procédure, délais, prix, cas de refus..." },
      { step: 7, key: "heredite_parts",    label: "Transmission en cas de décès", type: "textarea", placeholder: "Parts transmissibles aux héritiers ? Agrément requis ? Rachat obligatoire ?" },
      // Step 8
      { step: 8, key: "clause_non_concurrence",label: "Clause de non-concurrence",type: "select",  options: ["Oui, à préciser", "Non"] },
      { step: 8, key: "clause_arbitrage",  label: "Clause d'arbitrage OHADA",     type: "select",   options: ["Oui (CCJA)", "Oui (arbitrage ad hoc)", "Non"] },
      { step: 8, key: "dispositions_speciales",label: "Dispositions particulières souhaitées",type: "textarea", placeholder: "Clause d'exclusion, droit de suite, préférence, tag-along, drag-along, pacte d'associés à intégrer..." },
      { step: 8, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Contexte particulier, besoins spécifiques, points d'attention..." },
    ],
  },

  {
    id: "contrat",
    category: "juridique",
    title: "Contrat Professionnel",
    description: "Contrat sur mesure : prestation, partenariat, confidentialité, etc.",
    priceFcfa: 11175,
    icon: "Handshake",
    steps: [
      { number: 1, title: "Identification des parties" },
      { number: 2, title: "Objet & Durée" },
      { number: 3, title: "Obligations des parties" },
      { number: 4, title: "Livrables & Qualité" },
      { number: 5, title: "Rémunération & Paiement" },
      { number: 6, title: "Clauses de protection" },
      { number: 7, title: "Résiliation & Droit applicable" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "type_contrat",      label: "Type de contrat",              type: "select",   options: ["Contrat de prestation de services", "Contrat de partenariat", "NDA / Confidentialité", "Contrat de travail", "Contrat commercial", "Contrat de bail", "Contrat de cession de droits", "Contrat de distribution", "Contrat de franchise", "Autre"], required: true },
      { step: 1, key: "partie1_nom",       label: "Partie 1 — Nom / Raison sociale", type: "text", required: true },
      { step: 1, key: "partie1_qualite",   label: "Partie 1 — Qualité / Rôle",    type: "text",     required: true, placeholder: "Prestataire, Partenaire, Employeur..." },
      { step: 1, key: "partie1_adresse",   label: "Partie 1 — Adresse",           type: "text" },
      { step: 1, key: "partie1_rccm",      label: "Partie 1 — N° RCCM (si société)",type: "text",   placeholder: "Numéro d'immatriculation commerciale" },
      { step: 1, key: "partie2_nom",       label: "Partie 2 — Nom / Raison sociale", type: "text", required: true },
      { step: 1, key: "partie2_qualite",   label: "Partie 2 — Qualité / Rôle",    type: "text",     required: true },
      { step: 1, key: "partie2_adresse",   label: "Partie 2 — Adresse",           type: "text" },
      { step: 1, key: "partie2_rccm",      label: "Partie 2 — N° RCCM (si société)",type: "text",   placeholder: "Numéro d'immatriculation commerciale" },
      // Step 2
      { step: 2, key: "objet",             label: "Objet du contrat",             type: "textarea", required: true, placeholder: "Décrivez précisément la prestation, le partenariat, l'accord..." },
      { step: 2, key: "perimetre",         label: "Périmètre & exclusions",       type: "textarea", placeholder: "Ce qui est inclus et ce qui est explicitement exclu du contrat..." },
      { step: 2, key: "date_debut",        label: "Date de début",                type: "text",     required: true },
      { step: 2, key: "duree",             label: "Durée / Date de fin",          type: "text",     required: true, placeholder: "12 mois, ou jusqu'au 31/12/2026" },
      { step: 2, key: "renouvellement",    label: "Renouvellement",               type: "select",   options: ["Tacite reconduction", "À négocier avant expiration", "Pas de renouvellement"] },
      // Step 3
      { step: 3, key: "obligations_partie1",label: "Obligations de la Partie 1",  type: "textarea", required: true, hint: "Listez toutes les obligations avec les délais associés" },
      { step: 3, key: "obligations_partie2",label: "Obligations de la Partie 2",  type: "textarea", required: true },
      { step: 3, key: "moyens_fournis",    label: "Moyens fournis par chaque partie", type: "textarea", placeholder: "Accès aux locaux, outils, données, ressources humaines mis à disposition..." },
      // Step 4
      { step: 4, key: "livrables",         label: "Livrables / Résultats attendus",type: "textarea", placeholder: "Décrire les livrables, délais de livraison, critères d'acceptation..." },
      { step: 4, key: "criteres_qualite",  label: "Critères de qualité / Acceptation",type: "textarea", placeholder: "Comment les livrables seront-ils validés ? Qui valide ? Dans quel délai ?" },
      { step: 4, key: "reporting",         label: "Reporting & Suivi",            type: "textarea", placeholder: "Rapports d'avancement, réunions de suivi, tableaux de bord..." },
      // Step 5
      { step: 5, key: "montant",           label: "Montant / Rémunération",       type: "text",     required: true, placeholder: "Montant total, tarif horaire, ou mensuel en FCFA" },
      { step: 5, key: "modalites_paiement",label: "Modalités de paiement",        type: "textarea", required: true, placeholder: "Acompte X%, solde à réception, paiement mensuel..." },
      { step: 5, key: "tva",               label: "TVA applicable",               type: "select",   options: ["TVA 18% en sus", "TVA incluse (TTC)", "Exonéré de TVA", "Non applicable"] },
      { step: 5, key: "penalites",         label: "Pénalités de retard",          type: "text",     placeholder: "Ex: 1% par semaine de retard sur le montant restant dû" },
      // Step 6
      { step: 6, key: "confidentialite",   label: "Clause de confidentialité",    type: "select",   options: ["Inclure (standard)", "Inclure (renforcée — durée 5 ans)", "Non applicable"] },
      { step: 6, key: "non_concurrence",   label: "Clause de non-concurrence",    type: "select",   options: ["Oui (6 mois)", "Oui (12 mois)", "Oui (24 mois)", "Non"] },
      { step: 6, key: "exclusivite",       label: "Clause d'exclusivité",         type: "select",   options: ["Oui (territoriale)", "Oui (sectorielle)", "Non", "Non applicable"] },
      { step: 6, key: "propriete_intellectuelle",label: "Propriété intellectuelle",type: "select",   options: ["Appartient au client", "Appartient au prestataire", "Licence d'utilisation accordée", "Partagée", "Non applicable"] },
      { step: 6, key: "limitation_responsabilite",label: "Limitation de responsabilité",type: "textarea",placeholder: "Plafond d'indemnisation, exclusions de responsabilité..." },
      // Step 7
      { step: 7, key: "resiliation",       label: "Conditions de résiliation",    type: "textarea", required: true, placeholder: "Délai de préavis, motifs légitimes, conséquences financières, retour des livrables..." },
      { step: 7, key: "force_majeure",     label: "Clause de force majeure",      type: "select",   options: ["Inclure (standard)", "Inclure avec liste exhaustive", "Non incluse"] },
      { step: 7, key: "droit_applicable",  label: "Droit applicable & juridiction",type: "text",   required: true, placeholder: "Droit OHADA, droit togolais, tribunal de commerce de Lomé..." },
      { step: 7, key: "reglement_differends",label: "Mode de règlement des différends",type: "select",options: ["Médiation puis tribunal", "Arbitrage CCJA (OHADA)", "Arbitrage CCI Paris", "Tribunal compétent directement"] },
    ],
  },

  {
    id: "financement",
    category: "juridique",
    title: "Dossier de Financement",
    description: "Dossier complet pour demande de prêt ou financement bancaire.",
    priceFcfa: 18675,
    icon: "Banknote",
    steps: [
      { number: 1, title: "Entreprise & Porteur" },
      { number: 2, title: "Projet à financer" },
      { number: 3, title: "Plan financier prévisionnel" },
      { number: 4, title: "Garanties & Apports" },
      { number: 5, title: "Historique financier" },
      { number: 6, title: "Analyse des risques" },
      { number: 7, title: "Impact & Contexte" },
      { number: 8, title: "Institution ciblée & Compléments" },
      { number: 9, title: "Documents & Finalisation" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_entreprise",    label: "Nom de l'entreprise",          type: "text",     required: true },
      { step: 1, key: "forme_juridique",   label: "Forme juridique",              type: "text",     required: true },
      { step: 1, key: "date_creation",     label: "Date de création",             type: "text" },
      { step: 1, key: "secteur",           label: "Secteur d'activité",           type: "text",     required: true },
      { step: 1, key: "dirigeant",         label: "Nom du dirigeant principal",   type: "text",     required: true },
      { step: 1, key: "adresse",           label: "Adresse du siège",             type: "text",     required: true },
      { step: 1, key: "effectif",          label: "Effectif actuel",              type: "text" },
      { step: 1, key: "experience_dirigeant",label: "Expérience du dirigeant",    type: "textarea", placeholder: "Parcours professionnel, années d'expérience dans le secteur, réalisations clés..." },
      // Step 2
      { step: 2, key: "objet_financement", label: "Objet du financement",         type: "textarea", required: true, placeholder: "À quoi servira le financement ? Équipements, stocks, BFR, extension, travaux..." },
      { step: 2, key: "detail_utilisation",label: "Détail de l'utilisation des fonds",type: "textarea",required: true, placeholder: "Équipement A: X FCFA\nVéhicule: Y FCFA\nFonds de roulement: Z FCFA..." },
      { step: 2, key: "montant_demande",   label: "Montant demandé (FCFA)",       type: "text",     required: true },
      { step: 2, key: "duree_credit",      label: "Durée souhaitée du crédit",    type: "text",     required: true, placeholder: "Ex: 36 mois, 5 ans" },
      { step: 2, key: "description_projet",label: "Description détaillée du projet",type: "textarea", required: true },
      { step: 2, key: "justification_montant",label: "Justification du montant demandé",type: "textarea",placeholder: "Pourquoi ce montant précis ? Devis, études de marché, comparables..." },
      // Step 3
      { step: 3, key: "ca_annee_n",        label: "CA année N (actuel / dernier exercice)",type: "text" },
      { step: 3, key: "ca_annee_n1",       label: "CA An N+1 (prévisionnel)",     type: "text",     required: true },
      { step: 3, key: "ca_annee_n2",       label: "CA An N+2 (prévisionnel)",     type: "text" },
      { step: 3, key: "ca_annee_n3",       label: "CA An N+3 (prévisionnel)",     type: "text" },
      { step: 3, key: "resultat_net",      label: "Résultat net actuel (si existant)",type: "text" },
      { step: 3, key: "marge_brute",       label: "Marge brute actuelle / prévue",type: "text",     placeholder: "Ex: 45%" },
      { step: 3, key: "remboursement_mensuel",label: "Capacité de remboursement mensuelle estimée",type: "text", required: true, hint: "La banque vérifiera que le remboursement représente < 40% de votre cash-flow mensuel" },
      { step: 3, key: "seuil_rentabilite", label: "Seuil de rentabilité estimé",  type: "text",     placeholder: "À quel mois ou année le projet devient-il rentable ?" },
      // Step 4
      { step: 4, key: "apport_personnel",  label: "Apport personnel (FCFA)",      type: "text",     required: true, hint: "Un apport personnel de 20-30% minimum rassure généralement les banquiers" },
      { step: 4, key: "type_apport",       label: "Nature de l'apport",           type: "select",   options: ["Numéraire (cash)", "Apport en nature (équipements)", "Mixte numéraire + nature"] },
      { step: 4, key: "garanties",         label: "Garanties proposées",          type: "textarea", required: true, placeholder: "Hypothèque sur terrain/bâtiment, nantissement de fonds, caution solidaire, assurance crédit..." },
      { step: 4, key: "valeur_garanties",  label: "Valeur estimée des garanties", type: "text",     placeholder: "Ex: Terrain estimé à 15 000 000 FCFA" },
      { step: 4, key: "autres_financements",label: "Autres financements en cours",type: "textarea", placeholder: "Crédits existants avec encours restants, leasing, cautionnements..." },
      // Step 5
      { step: 5, key: "bilan_simplifie",   label: "Bilan simplifié (actif/passif)",type: "textarea", placeholder: "Actif total, dettes court/long terme, capitaux propres, trésorerie..." },
      { step: 5, key: "ratios_financiers", label: "Ratios financiers clés",       type: "textarea", placeholder: "Taux d'endettement, ratio de liquidité, couverture du service de la dette..." },
      { step: 5, key: "incidents_bancaires",label: "Incidents bancaires passés",  type: "select",   options: ["Aucun", "Résolus (plus de 2 ans)", "En cours de résolution"] },
      { step: 5, key: "relations_bancaires",label: "Relations bancaires actuelles",type: "textarea", placeholder: "Banques partenaires, comptes ouverts, historique de crédit..." },
      // Step 6
      { step: 6, key: "risques_projet",    label: "Risques identifiés",           type: "textarea", placeholder: "Risques de marché, opérationnels, financiers, réglementaires..." },
      { step: 6, key: "plan_mitigation",   label: "Plan de mitigation des risques",type: "textarea", placeholder: "Comment vous gérez chaque risque identifié..." },
      { step: 6, key: "scenario_defavorable",label: "Scénario défavorable",       type: "textarea", placeholder: "Si les ventes sont 30% inférieures aux prévisions, comment remboursez-vous ?" },
      // Step 7
      { step: 7, key: "impact_prevu",      label: "Impact prévu (emplois, CA)",   type: "textarea", placeholder: "Emplois créés directs/indirects, augmentation CA, nouvelles capacités de production..." },
      { step: 7, key: "impact_social",     label: "Impact social & environnemental",type: "textarea",placeholder: "Contribution à l'économie locale, formation, développement territorial..." },
      { step: 7, key: "pays",              label: "Pays",                         type: "text",     required: true },
      { step: 7, key: "contexte_local",    label: "Contexte économique local",    type: "textarea", placeholder: "Secteur porteur, politiques publiques favorables, soutien institutionnel..." },
      // Step 8
      { step: 8, key: "banque_cible",      label: "Banque / Institution ciblée",  type: "text",     placeholder: "BTCI, Ecobank, BOA, BSIC, BDT, FASI, FNPJ, microfinance..." },
      { step: 8, key: "type_produit_credit",label: "Type de crédit souhaité",     type: "select",   options: ["Crédit d'investissement", "Crédit de campagne / court terme", "Découvert autorisé", "Leasing", "Crédit-bail", "Ligne de crédit", "À définir avec la banque"] },
      { step: 8, key: "taux_acceptable",   label: "Taux d'intérêt maximum acceptable",type: "text", placeholder: "Ex: Max 12% l'an — à adapter selon les conditions du marché" },
      { step: 8, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Contexte particulier, programme gouvernemental d'appui, partenariats institutionnels..." },
      // Step 9
      { step: 9, key: "docs_disponibles",  label: "Documents disponibles",        type: "textarea", required: true, placeholder: "RCCM, statuts, bilans N-1 / N-2, relevés bancaires, devis fournisseurs, titre foncier..." },
      { step: 9, key: "docs_a_produire",   label: "Documents à produire",         type: "textarea", placeholder: "Quels documents vous manquent encore pour constituer le dossier ?" },
    ],
  },

  // ─── TRADUCTION ─────────────────────────────────────────────────────────────
  {
    id: "trad_s",
    category: "traduction",
    title: "Traduction Courte",
    description: "Traduction professionnelle jusqu'à 2 pages.",
    priceFcfa: 3675,
    badge: "Nouveau",
    icon: "Languages",
    steps: [
      { number: 1, title: "Paramètres de traduction" },
      { number: 2, title: "Texte & Instructions" },
      { number: 3, title: "Contexte & Livrables" },
      { number: 4, title: "Qualité & Finalisation" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "langue_source",     label: "Langue source",                type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { step: 1, key: "langue_cible",      label: "Langue cible",                 type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { step: 1, key: "type_doc",          label: "Type de document",             type: "select",   options: ["Correspondance professionnelle", "Contrat", "CV", "Communiqué", "Article", "Notice", "Acte officiel", "Autre"] },
      { step: 1, key: "domaine",           label: "Domaine / Spécialité",         type: "select",   options: ["Juridique", "Business / Finance", "Technique / Ingénierie", "Médical", "Académique", "ONG / Développement", "Général"] },
      { step: 1, key: "ton",               label: "Ton souhaité",                 type: "select",   options: ["Formel", "Professionnel", "Neutre", "Informel"] },
      { step: 1, key: "nb_pages",          label: "Nombre de pages estimé",       type: "text",     placeholder: "Max 2 pages pour ce service", hint: "Pour plus de 2 pages, optez pour le service Traduction Longue" },
      // Step 2
      { step: 2, key: "texte",             label: "Texte à traduire",             type: "textarea", required: true, placeholder: "Collez votre texte ici... (2 pages max)" },
      { step: 2, key: "terminologie",      label: "Terminologie spécifique à conserver", type: "textarea", placeholder: "Termes techniques, noms propres, acronymes, marques à garder tels quels..." },
      { step: 2, key: "termes_a_eviter",   label: "Termes ou formulations à éviter", type: "textarea", placeholder: "Expressions à bannir, équivalents préférés dans la langue cible..." },
      // Step 3
      { step: 3, key: "contexte",          label: "Contexte d'utilisation",       type: "textarea", placeholder: "À qui est destinée cette traduction ? Dans quel cadre sera-t-elle utilisée ?" },
      { step: 3, key: "audience_cible",    label: "Audience cible de la traduction",type: "text",   placeholder: "Partenaires étrangers, investisseurs, administration, grand public..." },
      { step: 3, key: "format_livrable",   label: "Format de livraison souhaité", type: "select",   options: ["PDF", "Word (.docx)", "PDF + Word", "Copier-coller (texte brut)"] },
      // Step 4
      { step: 4, key: "notes_traducteur",  label: "Instructions particulières",   type: "textarea", placeholder: "Toute instruction spécifique : style, registre, adaptation culturelle souhaitée..." },
      { step: 4, key: "relecture",         label: "Relecture native souhaitée",   type: "select",   options: ["Oui, par un natif de la langue cible", "Non nécessaire"], hint: "Recommandé pour les documents officiels ou destinés à des audiences étrangères" },
    ],
  },

  {
    id: "trad_l",
    category: "traduction",
    title: "Traduction Longue",
    description: "Traduction professionnelle jusqu'à 10 pages.",
    priceFcfa: 11175,
    icon: "BookOpen",
    steps: [
      { number: 1, title: "Paramètres de traduction" },
      { number: 2, title: "Document & Structure" },
      { number: 3, title: "Contenu & Texte" },
      { number: 4, title: "Terminologie & Style" },
      { number: 5, title: "Contexte & Livrables" },
      { number: 6, title: "Qualité & Finalisation" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "langue_source",     label: "Langue source",                type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { step: 1, key: "langue_cible",      label: "Langue cible",                 type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { step: 1, key: "type_doc",          label: "Type de document",             type: "select",   options: ["Rapport", "Business plan", "Contrat long", "Dossier juridique", "Manuel technique", "Rapport académique / Thèse", "Proposition de projet ONG", "Étude de faisabilité", "Autre"], required: true },
      { step: 1, key: "domaine",           label: "Domaine de spécialité",        type: "select",   options: ["Juridique", "Business / Finance", "Technique / Ingénierie", "Médical / Santé publique", "Académique / Recherche", "ONG / Développement", "Architecture / BTP", "Général"] },
      { step: 1, key: "niveau_specialisation",label: "Niveau de spécialisation",  type: "select",   options: ["Général (vocabulaire courant)", "Intermédiaire (vocabulaire professionnel)", "Très technique (experts seulement)"] },
      // Step 2
      { step: 2, key: "nb_pages",          label: "Nombre de pages",              type: "text",     required: true, placeholder: "Max 10 pages pour ce service", hint: "Pour plus de 10 pages, veuillez nous contacter pour un devis personnalisé" },
      { step: 2, key: "nb_mots_estime",    label: "Nombre de mots estimé",        type: "text",     placeholder: "Ex: 3 500 mots — 1 page A4 ≈ 350-500 mots" },
      { step: 2, key: "structure_doc",     label: "Structure du document",        type: "textarea", placeholder: "Résumé, sections 1-2-3, annexes, bibliographie..." },
      { step: 2, key: "elements_speciaux", label: "Éléments spéciaux à traiter", type: "textarea", placeholder: "Tableaux, graphiques, légendes, notes de bas de page, références bibliographiques..." },
      // Step 3
      { step: 3, key: "texte",             label: "Texte à traduire (ou description si trop long)", type: "textarea", required: true, placeholder: "Collez le texte complet ou décrivez son contenu section par section..." },
      { step: 3, key: "parties_prioritaires",label: "Parties prioritaires",       type: "textarea", placeholder: "Si délai contraint, quelles sections sont les plus urgentes ?" },
      // Step 4
      { step: 4, key: "terminologie",      label: "Terminologie spécifique",      type: "textarea", placeholder: "Termes techniques, sigles, noms propres à conserver ou à adapter..." },
      { step: 4, key: "glossaire_existant",label: "Glossaire / Références terminologiques", type: "textarea", placeholder: "Documents de référence avec la terminologie approuvée dans la langue cible..." },
      { step: 4, key: "ton",               label: "Ton & Registre",               type: "select",   options: ["Formel / Institutionnel", "Académique / Scientifique", "Professionnel", "Neutre"] },
      { step: 4, key: "adaptation_culturelle",label: "Adaptation culturelle souhaitée",type: "select",options: ["Traduction littérale fidèle", "Adaptation au contexte local de la langue cible", "Localisation complète"] },
      // Step 5
      { step: 5, key: "contexte_utilisation",label: "Contexte d'utilisation",     type: "textarea", required: true, placeholder: "Soumission bailleur UE, dépôt légal, usage interne, publication académique, appel d'offres..." },
      { step: 5, key: "audience_cible",    label: "Audience cible",               type: "text",     placeholder: "Experts, grand public, décideurs, étudiants..." },
      { step: 5, key: "format_livrable",   label: "Format de livraison souhaité", type: "select",   options: ["PDF", "Word (.docx)", "PDF + Word", "Même format que l'original"] },
      { step: 5, key: "mise_en_forme",     label: "Mise en forme souhaitée",      type: "select",   options: ["Identique à l'original", "Mise en forme basique", "Mise en page professionnelle soignée"] },
      // Step 6
      { step: 6, key: "delai_souhaite",    label: "Délai de livraison souhaité",  type: "text",     placeholder: "Ex: 5 jours ouvrables, urgent en 48h..." },
      { step: 6, key: "notes_traducteur",  label: "Instructions particulières",   type: "textarea", placeholder: "Tout ce qui peut aider le traducteur : style de l'auteur, public cible, usage prévu..." },
      { step: 6, key: "relecture",         label: "Relecture native souhaitée",   type: "select",   options: ["Oui, par un natif", "Non nécessaire"], hint: "Fortement recommandé pour publications, soumissions à des bailleurs ou documents officiels" },
    ],
  },

  // ─── APPELS D'OFFRES ────────────────────────────────────────────────────────
  {
    id: "ao",
    category: "ao",
    title: "Réponse Appel d'Offres",
    description: "Offre technique et financière complète pour remporter des marchés.",
    priceFcfa: 29925,
    badge: "Premium",
    icon: "Trophy",
    steps: [
      { number: 1,  title: "Identité de l'entreprise" },
      { number: 2,  title: "Capacités & Références" },
      { number: 3,  title: "Analyse de l'appel d'offres" },
      { number: 4,  title: "Note de compréhension" },
      { number: 5,  title: "Offre technique & Méthodologie" },
      { number: 6,  title: "Planning & Livrables" },
      { number: 7,  title: "Équipe mobilisée" },
      { number: 8,  title: "Offre financière" },
      { number: 9,  title: "Gestion des risques AO" },
      { number: 10, title: "Documents administratifs" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "nom_entreprise",        label: "Nom de l'entreprise",              type: "text",     required: true },
      { step: 1, key: "forme_juridique",       label: "Forme juridique",                  type: "text",     required: true },
      { step: 1, key: "rc_rccm",               label: "N° RCCM / Registre commerce",      type: "text" },
      { step: 1, key: "siege",                 label: "Siège social",                     type: "text",     required: true },
      { step: 1, key: "contact",               label: "Email / Téléphone / Site",         type: "textarea", required: true },
      { step: 1, key: "capital_social",        label: "Capital social",                   type: "text" },
      { step: 1, key: "secteur_activite",      label: "Secteur(s) d'activité principal",  type: "textarea", required: true },
      { step: 1, key: "agrement",              label: "Agréments & Certifications",       type: "textarea", placeholder: "ISO 9001, agréments sectoriels, certifications professionnelles..." },
      // Step 2
      { step: 2, key: "annees_experience",     label: "Années d'expérience",              type: "text",     required: true },
      { step: 2, key: "domaines_expertise",    label: "Domaines d'expertise",             type: "textarea", required: true, placeholder: "Conseil, BTP, IT, santé, agriculture, etc." },
      { step: 2, key: "effectif",              label: "Effectif total",                   type: "text" },
      { step: 2, key: "chiffre_affaires",      label: "CA annuel moyen (3 derniers ans)",  type: "text" },
      { step: 2, key: "marchés_en_cours",      label: "Marchés en cours d'exécution",     type: "textarea", placeholder: "Pour montrer votre capacité actuelle sans surcharge..." },
      { step: 2, key: "distinctions",          label: "Prix, distinctions, publications", type: "textarea" },
      // Step 3
      { step: 3, key: "client_ao",             label: "Donneur d'ordre / Commanditaire",  type: "text",     required: true },
      { step: 3, key: "reference_ao",          label: "Référence / N° de l'AO",           type: "text" },
      { step: 3, key: "objet_ao",              label: "Objet exact de l'appel d'offres",  type: "textarea", required: true },
      { step: 3, key: "montant_estime",        label: "Montant estimé du marché",         type: "text" },
      { step: 3, key: "criteres_evaluation",   label: "Critères d'évaluation connus",     type: "textarea", placeholder: "Technique: X%, Prix: Y%, Délai: Z%, Qualité équipe: W%..." },
      { step: 3, key: "date_remise",           label: "Date de remise des offres",        type: "text" },
      { step: 3, key: "duree_marche",          label: "Durée du marché",                  type: "text",     placeholder: "Ex: 6 mois, 12 mois..." },
      // Step 4
      { step: 4, key: "comprehension",         label: "Note de compréhension de la mission", type: "textarea", required: true, placeholder: "Reformulez les enjeux, besoins implicites et attentes du client..." },
      { step: 4, key: "enjeux_client",         label: "Enjeux stratégiques du client",    type: "textarea", required: true, placeholder: "Pourquoi ce marché est important pour lui ? Contraintes politiques/budgétaires ?" },
      { step: 4, key: "valeur_ajoutee",        label: "Valeur ajoutée de votre offre",    type: "textarea", required: true, placeholder: "Ce que vous apportez de plus que les concurrents..." },
      { step: 4, key: "innovations",           label: "Innovations & différenciants",     type: "textarea", placeholder: "Approche novatrice, outils propriétaires, partenariats exclusifs..." },
      // Step 5
      { step: 5, key: "methodologie",          label: "Méthodologie détaillée",           type: "textarea", required: true, placeholder: "Phase 1: ...\nPhase 2: ...\nApproche, outils, processus qualité..." },
      { step: 5, key: "livrables",             label: "Livrables par phase",              type: "textarea", required: true, placeholder: "Phase 1: Rapport diagnostic\nPhase 2: Plan d'action\nPhase 3: Rapport final..." },
      { step: 5, key: "controle_qualite",      label: "Démarche qualité proposée",        type: "textarea", placeholder: "Revues internes, validation client, indicateurs de performance..." },
      { step: 5, key: "gestion_connaissance",  label: "Transfert de compétences",         type: "textarea", placeholder: "Formations, documentation, capitalisation..." },
      // Step 6
      { step: 6, key: "planning_technique",    label: "Planning d'exécution détaillé",    type: "textarea", required: true, placeholder: "Semaine 1-2: Phase démarrage\nSemaine 3-6: Phase analyse\n..." },
      { step: 6, key: "jalons_cles",           label: "Jalons & points de contrôle",      type: "textarea", required: true, placeholder: "J+15: Rapport d'étape, J+30: Validation client, J+90: Livraison finale..." },
      { step: 6, key: "flexibilite",           label: "Flexibilité & gestion des aléas",  type: "textarea", placeholder: "Comment vous gérez les retards, modifications de périmètre..." },
      // Step 7
      { step: 7, key: "chef_projet",           label: "Chef de projet proposé",           type: "textarea", required: true, placeholder: "Nom, formation, années d'expérience, 3 réalisations clés, rôle précis..." },
      { step: 7, key: "equipe_technique",      label: "Équipe technique",                 type: "textarea", required: true, placeholder: "Expert 1: nom, spécialité, rôle\nExpert 2:...\nTaux d'implication par expert" },
      { step: 7, key: "experts_associes",      label: "Experts associés / Consultants",   type: "textarea", placeholder: "Profils spécialisés mobilisables selon les besoins..." },
      { step: 7, key: "sous_traitants",        label: "Sous-traitants prévus",            type: "textarea", placeholder: "Nom, spécialité, part du marché, justification du recours..." },
      { step: 7, key: "organisation_equipe",   label: "Organisation & coordination équipe",type: "textarea", placeholder: "Comment l'équipe est coordonnée, outils de communication, reporting..." },
      // Step 8
      { step: 8, key: "montant_offre",         label: "Montant global de l'offre (HT)",   type: "text",     required: true },
      { step: 8, key: "decomposition_prix",    label: "Décomposition détaillée du prix",  type: "textarea", required: true, placeholder: "Honoraires experts: X FCFA\nFrais mission: Y FCFA\nFrais généraux (15%): Z\nTotal HT:" },
      { step: 8, key: "tva",                   label: "TVA applicable",                   type: "text",     placeholder: "18% (UEMOA) ou exonéré selon le client" },
      { step: 8, key: "modalites_paiement",    label: "Modalités de paiement souhaitées", type: "select",   options: ["Avance 30% + tranches sur livrables", "Mensualités", "30% démarrage + 70% livraison", "À négocier"] },
      { step: 8, key: "garantie_bonne_execution",label: "Garantie de bonne exécution",    type: "text",     placeholder: "% ou montant caution bancaire si requis" },
      // Step 9
      { step: 9, key: "risques_identifies",    label: "Risques identifiés",               type: "textarea", required: true, placeholder: "Risques techniques, organisationnels, financiers, contextuels..." },
      { step: 9, key: "plan_mitigation",       label: "Mesures d'atténuation",            type: "textarea", required: true },
      { step: 9, key: "concurrents_probables", label: "Concurrents probables",            type: "textarea", placeholder: "Qui soumissionnera aussi ? Leurs forces/faiblesses vs vous ?" },
      { step: 9, key: "strategie_prix",        label: "Stratégie de prix",                type: "textarea", placeholder: "Positionnement prix : compétitif, premium, best value for money ?" },
      // Step 10
      { step: 10, key: "docs_admin",           label: "Documents administratifs disponibles",type: "textarea", required: true, placeholder: "RCCM, patente, attestations fiscales & CNSS, assurance RC, bilans..." },
      { step: 10, key: "validite_offre",       label: "Durée de validité de l'offre",     type: "text",     placeholder: "Ex: 90 jours à compter de la date de remise" },
      { step: 10, key: "signature_autorisee",  label: "Signataire autorisé",              type: "text",     placeholder: "Nom, titre, habilitation à engager la société" },
    ],
  },

  {
    id: "ong",
    category: "ao",
    title: "Proposition de Projet ONG",
    description: "Proposition complète pour bailleur de fonds (UE, USAID, AFD…).",
    priceFcfa: 37425,
    badge: "Premium",
    icon: "Globe",
    steps: [
      { number: 1,  title: "Organisation & Crédibilité" },
      { number: 2,  title: "Contexte & Problématique" },
      { number: 3,  title: "Cadre Logique & Objectifs" },
      { number: 4,  title: "Théorie du Changement" },
      { number: 5,  title: "Activités & Méthodologie" },
      { number: 6,  title: "Bénéficiaires & Partenariats" },
      { number: 7,  title: "Budget & Cofinancement" },
      { number: 8,  title: "Suivi-Évaluation & Redevabilité" },
      { number: 9,  title: "Genre & Inclusion" },
      { number: 10, title: "Communication & Visibilité" },
      { number: 11, title: "Durabilité & Pérennité" },
      { number: 12, title: "Gouvernance & Documents admin." },
    ],
    fields: [
      // Step 1 — Organisation & Crédibilité
      { step: 1, key: "nom_organisation",       label: "Nom de l'organisation",              type: "text",     required: true },
      { step: 1, key: "type_organisation",      label: "Type d'organisation",                type: "select",   options: ["ONG locale", "ONG internationale", "Association loi 1901", "Fondation", "Coopérative", "Réseau / Coalition"] },
      { step: 1, key: "date_creation",          label: "Année de création",                  type: "text",     placeholder: "Ex: 2010" },
      { step: 1, key: "siege_social",           label: "Siège social",                       type: "text",     required: true, placeholder: "Ville, Pays" },
      { step: 1, key: "zones_intervention",     label: "Zones géographiques d'intervention", type: "textarea", required: true, placeholder: "Pays, régions, villes ciblées..." },
      { step: 1, key: "mission_vision",         label: "Mission & Vision de l'organisation", type: "textarea", required: true, placeholder: "Pourquoi l'organisation existe, sa vision à long terme..." },
      { step: 1, key: "secteurs_expertise",     label: "Secteurs d'expertise principaux",    type: "textarea", required: true, placeholder: "Santé, éducation, eau/assainissement, agriculture, droits humains..." },
      { step: 1, key: "projets_references",     label: "3 projets de référence (avec bailleurs)", type: "textarea", required: true, placeholder: "Projet 1 — Bailleur: UE, Budget: 500k€, Durée: 3 ans, Résultats...\nProjet 2..." },
      { step: 1, key: "bailleur",               label: "Bailleur de fonds ciblé",            type: "text",     required: true, placeholder: "UE, USAID, AFD, Banque Mondiale, PNUD, UNICEF, GIZ..." },
      { step: 1, key: "appel_offres_ref",       label: "Référence de l'appel à projets",     type: "text",     placeholder: "Numéro ou titre officiel de l'appel" },
      { step: 1, key: "date_limite_soumission", label: "Date limite de soumission",          type: "text",     placeholder: "Ex: 30/04/2025" },
      // Step 2 — Contexte & Problématique
      { step: 2, key: "nom_projet",             label: "Titre du projet",                    type: "text",     required: true },
      { step: 2, key: "duree_projet",           label: "Durée du projet",                    type: "text",     required: true, placeholder: "Ex: 36 mois (2025-2028)" },
      { step: 2, key: "contexte_macro",         label: "Contexte macroéconomique & politique",type: "textarea", required: true, placeholder: "Situation nationale/régionale, politiques publiques, ODD liés..." },
      { step: 2, key: "problematique",          label: "Problématique principale",           type: "textarea", required: true, placeholder: "Décrivez le problème avec données chiffrées, statistiques officielles, études..." },
      { step: 2, key: "analyse_causes",         label: "Arbre à problèmes (causes profondes)", type: "textarea", required: true, placeholder: "Causes immédiates, sous-jacentes, profondes selon la méthode d'arbre à problèmes..." },
      { step: 2, key: "contexte_geo_demo",      label: "Contexte géographique & démographique", type: "textarea", placeholder: "Population cible, données démographiques, indicateurs de développement humain..." },
      { step: 2, key: "analyse_parties",        label: "Analyse des parties prenantes",      type: "textarea", placeholder: "Acteurs clés, leurs intérêts, leur position, influence sur le projet..." },
      { step: 2, key: "gap_analyse",            label: "Analyse des lacunes (gap analysis)", type: "textarea", placeholder: "Ce qui existe déjà comme interventions, et ce qui manque — justification du projet..." },
      // Step 3 — Cadre Logique & Objectifs
      { step: 3, key: "objectif_general",       label: "Objectif général (Impact)",          type: "textarea", required: true, placeholder: "Impact à long terme visé (ex: réduction de X% de la malnutrition dans la région Y)" },
      { step: 3, key: "objectifs_specifiques",  label: "Objectifs spécifiques / Outcomes",   type: "textarea", required: true, placeholder: "OS1: ...\nOS2: ...\nOS3: ...\n(effets à moyen terme attendus)" },
      { step: 3, key: "resultats_attendus",     label: "Résultats / Outputs par OS",         type: "textarea", required: true, placeholder: "R1.1: ...\nR1.2: ...\nR2.1: ...\n(livrables concrets par objectif spécifique)" },
      { step: 3, key: "indicateurs_impact",     label: "Indicateurs d'impact (SMART)",       type: "textarea", required: true, placeholder: "Indicateurs quantitatifs et qualitatifs, valeurs de référence, cibles par année..." },
      { step: 3, key: "indicateurs_outcome",    label: "Indicateurs d'outcome par OS",       type: "textarea", required: true, placeholder: "1 à 3 indicateurs SMART par objectif spécifique avec baseline et cible..." },
      { step: 3, key: "sources_verification",   label: "Sources de vérification",            type: "textarea", placeholder: "Enquêtes, registres officiels, rapports de monitoring, focus groups..." },
      { step: 3, key: "hypotheses_risques",     label: "Hypothèses & facteurs externes",     type: "textarea", placeholder: "Conditions nécessaires hors contrôle du projet pour atteindre les objectifs..." },
      // Step 4 — Théorie du Changement
      { step: 4, key: "theorie_changement",     label: "Théorie du changement (narrative)", type: "textarea", required: true, placeholder: "SI nous faisons X et Y, ALORS Z changement se produira, PARCE QUE A et B. Décrivez la chaîne causale complète..." },
      { step: 4, key: "changements_intermediaires", label: "Changements intermédiaires",    type: "textarea", required: true, placeholder: "Quels changements de comportement, de pratiques, de politiques attendez-vous à mi-parcours ?" },
      { step: 4, key: "innovations_approche",   label: "Innovation & valeur ajoutée du projet", type: "textarea", placeholder: "Ce qui distingue votre approche des interventions existantes..." },
      { step: 4, key: "conditions_prerequis",   label: "Conditions préalables & prérequis", type: "textarea", placeholder: "Ce qui doit exister ou se passer AVANT que votre intervention soit efficace..." },
      // Step 5 — Activités & Méthodologie
      { step: 5, key: "activites_detail",       label: "Activités détaillées par résultat",  type: "textarea", required: true, placeholder: "R1.1 — Activité 1.1.1: ...\nActivité 1.1.2: ...\nR1.2 — Activité 1.2.1: ..." },
      { step: 5, key: "methodologie",           label: "Méthodologie & Approche d'implémentation", type: "textarea", required: true, placeholder: "Approche participative, droits humains, genre, community-led, basée sur les preuves..." },
      { step: 5, key: "chronogramme",           label: "Chronogramme d'activités",           type: "textarea", required: true, placeholder: "Activité 1.1.1: Mois 1-3\nActivité 1.1.2: Mois 2-6\nActivité 1.2.1: Mois 4-8..." },
      { step: 5, key: "outils_methodologiques", label: "Outils & approches méthodologiques", type: "textarea", placeholder: "Méthodes de collecte de données, outils de formation, cadres analytiques utilisés..." },
      { step: 5, key: "coordination_interne",   label: "Mécanismes de coordination interne", type: "textarea", placeholder: "Réunions d'équipe, rapports internes, système de gestion de l'information..." },
      // Step 6 — Bénéficiaires & Partenariats
      { step: 6, key: "beneficiaires_directs",  label: "Bénéficiaires directs",              type: "textarea", required: true, placeholder: "Nombre précis, profil (âge, genre, catégorie sociale), critères de sélection, zone géographique..." },
      { step: 6, key: "beneficiaires_indirects",label: "Bénéficiaires indirects",            type: "textarea", placeholder: "Familles, communautés, institutions bénéficiant indirectement..." },
      { step: 6, key: "strategie_ciblage",      label: "Stratégie de ciblage & sélection",   type: "textarea", required: true, placeholder: "Comment et par quels critères les bénéficiaires sont-ils identifiés et sélectionnés ?" },
      { step: 6, key: "partenaires_execution",  label: "Partenaires de mise en œuvre",       type: "textarea", required: true, placeholder: "ONG locales, services gouvernementaux, collectivités, universités — rôles et responsabilités..." },
      { step: 6, key: "partenaires_strategiques",label: "Partenaires stratégiques & institutionnels", type: "textarea", placeholder: "Ministères, agences UN, secteur privé, réseaux thématiques — nature de la relation..." },
      { step: 6, key: "mecanismes_coordination",label: "Mécanismes de coordination partenariale", type: "textarea", placeholder: "Comité de pilotage, plateformes de coordination, accords de partenariat (MoU)..." },
      // Step 7 — Budget & Cofinancement
      { step: 7, key: "budget_total",           label: "Budget total demandé (EUR/USD/FCFA)", type: "text",    required: true },
      { step: 7, key: "repartition_par_poste",  label: "Répartition par ligne budgétaire",   type: "textarea", required: true, placeholder: "1. Personnel: X (Y%)\n2. Consultants: ...\n3. Activités/Ateliers: ...\n4. Équipements: ...\n5. Communication: ...\n6. Frais généraux (max 7%): ..." },
      { step: 7, key: "repartition_par_annee",  label: "Répartition du budget par année",    type: "textarea", required: true, placeholder: "Année 1: X EUR (Y%)\nAnnée 2: ...\nAnnée 3: ..." },
      { step: 7, key: "cofinancement",          label: "Cofinancement & contribution propre", type: "textarea", required: true, placeholder: "Source 1: Nom bailleur, montant, statut (confirmé/en cours)\nContribution propre: X EUR (Y%)" },
      { step: 7, key: "ratio_admin",            label: "Taux de frais administratifs",        type: "text",     placeholder: "Ex: 7% (vérifier plafond bailleur)" },
      { step: 7, key: "procedures_financieres", label: "Procédures de gestion financière",    type: "textarea", placeholder: "Systèmes comptables, contrôles internes, audit externe prévu..." },
      // Step 8 — Suivi-Évaluation & Redevabilité
      { step: 8, key: "cadre_suivi",            label: "Cadre de suivi-évaluation",           type: "textarea", required: true, placeholder: "Système de collecte de données, fréquence, responsables, outils (KoBoToolbox, ODK...)..." },
      { step: 8, key: "plan_evaluation",        label: "Plan d'évaluation (mi-parcours/finale)", type: "textarea", required: true, placeholder: "Évaluations prévues, méthodologie, qui l'effectue, budget alloué..." },
      { step: 8, key: "rapportage_bailleur",    label: "Rapportage vers le bailleur",          type: "textarea", required: true, placeholder: "Fréquence, format, contenu des rapports narratifs et financiers..." },
      { step: 8, key: "redevabilite_beneficiaires",label: "Mécanismes de redevabilité envers les bénéficiaires", type: "textarea", placeholder: "Mécanismes de feedback, plaintes et recours, participation à la gouvernance..." },
      { step: 8, key: "gestion_risques",        label: "Registre des risques & mitigation",   type: "textarea", required: true, placeholder: "Risque programmatique / financier / contextuel / sécuritaire — probabilité — impact — mesure..." },
      { step: 8, key: "apprentissage",          label: "Apprentissage & capitalisation",       type: "textarea", placeholder: "Comment les leçons apprises seront-elles documentées et partagées ?" },
      // Step 9 — Genre & Inclusion
      { step: 9, key: "analyse_genre",          label: "Analyse de genre",                    type: "textarea", required: true, placeholder: "Différences homme/femme dans le contexte du projet, inégalités spécifiques à adresser..." },
      { step: 9, key: "integration_genre",      label: "Intégration du genre dans les activités", type: "textarea", required: true, placeholder: "Comment chaque activité prend en compte et réduit les inégalités de genre..." },
      { step: 9, key: "cibles_genre",           label: "Cibles de participation féminine",    type: "text",     placeholder: "Ex: 60% de femmes parmi les bénéficiaires, 50% dans les comités de gestion..." },
      { step: 9, key: "inclusion_vulnerables",  label: "Inclusion des groupes vulnérables",   type: "textarea", placeholder: "Personnes handicapées, réfugiés, minorités, personnes âgées — comment intégrées ?" },
      { step: 9, key: "do_no_harm",             label: "Principe Do No Harm",                 type: "textarea", placeholder: "Comment vous assurez-vous que le projet ne cause pas de préjudice involontaire ?" },
      // Step 10 — Communication & Visibilité
      { step: 10, key: "plan_communication",    label: "Plan de communication du projet",     type: "textarea", required: true, placeholder: "Audiences cibles, messages clés, canaux (radio, réseaux sociaux, affiches, ateliers)..." },
      { step: 10, key: "visibilite_bailleur",   label: "Stratégie de visibilité du bailleur", type: "textarea", required: true, placeholder: "Comment vous respecterez les exigences de visibilité du bailleur (logo, mentions, matériaux...)..." },
      { step: 10, key: "plaidoyer",             label: "Plaidoyer & influence politique",     type: "textarea", placeholder: "Actions de plaidoyer prévues, cibles institutionnelles, changements de politique visés..." },
      { step: 10, key: "gestion_connaissance",  label: "Gestion et partage des connaissances", type: "textarea", placeholder: "Publications, guides pratiques, présentations en conférences, partage avec pairs..." },
      // Step 11 — Durabilité & Pérennité
      { step: 11, key: "durabilite_institutionnelle", label: "Durabilité institutionnelle",  type: "textarea", required: true, placeholder: "Capacités locales renforcées, transfert aux partenaires locaux / gouvernement..." },
      { step: 11, key: "durabilite_financiere", label: "Durabilité financière",              type: "textarea", required: true, placeholder: "Sources de financement post-projet, modèle économique si applicable, cofinancement futur..." },
      { step: 11, key: "durabilite_sociale",    label: "Durabilité sociale & appropriation",  type: "textarea", placeholder: "Appropriation communautaire, changements de normes et comportements durables..." },
      { step: 11, key: "exit_strategy",         label: "Stratégie de sortie",                type: "textarea", required: true, placeholder: "Comment l'organisation se désengage progressivement pour laisser les acteurs locaux en charge..." },
      { step: 11, key: "impact_environnemental",label: "Impact environnemental & gestion",    type: "textarea", placeholder: "Effets sur l'environnement, mesures de mitigation, approche éco-responsable..." },
      // Step 12 — Gouvernance & Documents admin.
      { step: 12, key: "structure_gouvernance", label: "Structure de gouvernance du projet",  type: "textarea", required: true, placeholder: "Comité de pilotage, comité technique, organigramme du projet, rôles décisionnels..." },
      { step: 12, key: "equipe_projet",         label: "Équipe de projet proposée",           type: "textarea", required: true, placeholder: "Chef de projet: nom, expérience\nCoordonnateur terrain: ...\nResponsable S&E: ...\nComptable: ..." },
      { step: 12, key: "capacites_organisationnelles", label: "Capacités organisationnelles", type: "textarea", placeholder: "Systèmes de gestion (RH, financier, logistique), certifications, audits récents..." },
      { step: 12, key: "conformite_legale",     label: "Conformité légale & agrément",        type: "textarea", placeholder: "Enregistrements, agréments bailleurs, certifications ISO/ONG si applicable..." },
      { step: 12, key: "docs_administratifs",   label: "Documents administratifs disponibles",type: "textarea", required: true, placeholder: "Statuts, récépissé d'enregistrement, bilans audités N-1 et N-2, attestations fiscales..." },
      { step: 12, key: "infos_complementaires", label: "Informations complémentaires",        type: "textarea", placeholder: "Tout élément additionnel pertinent pour renforcer la proposition..." },
    ],
  },

  // ─── ACADÉMIQUE ─────────────────────────────────────────────────────────────
  {
    id: "rapport_stage",
    category: "academique",
    title: "Rapport de Stage",
    description: "Rapport de stage professionnel structuré et complet.",
    priceFcfa: 11175,
    icon: "GraduationCap",
    steps: [
      { number: 1, title: "Étudiant & Formation" },
      { number: 2, title: "Entreprise d'accueil" },
      { number: 3, title: "Missions & Activités" },
      { number: 4, title: "Projets & Réalisations" },
      { number: 5, title: "Analyse & Compétences acquises" },
      { number: 6, title: "Bilan & Recommandations" },
      { number: 7, title: "Liens théorie-pratique" },
      { number: 8, title: "Conclusion & Projet professionnel" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "full_name",         label: "Nom & Prénom",                 type: "text",     required: true },
      { step: 1, key: "ecole",             label: "École / Université",           type: "text",     required: true },
      { step: 1, key: "filiere",           label: "Filière / Spécialité",         type: "text",     required: true },
      { step: 1, key: "niveau",            label: "Niveau d'études",              type: "select",   options: ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "BTS", "DUT", "Ingénieur", "Doctorat"] },
      { step: 1, key: "annee_academique",  label: "Année académique",             type: "text",     placeholder: "2024-2025" },
      { step: 1, key: "encadrant_ecole",   label: "Encadrant académique",         type: "text",     placeholder: "Nom du professeur référent" },
      { step: 1, key: "objectifs_pedagogiques",label: "Objectifs pédagogiques du stage",type: "textarea",placeholder: "Compétences à développer selon votre programme de formation..." },
      // Step 2
      { step: 2, key: "entreprise",        label: "Entreprise d'accueil",         type: "text",     required: true },
      { step: 2, key: "secteur_entreprise",label: "Secteur de l'entreprise",      type: "text",     required: true },
      { step: 2, key: "ville_pays",        label: "Ville, Pays",                  type: "text",     required: true },
      { step: 2, key: "taille_entreprise", label: "Taille de l'entreprise",       type: "select",   options: ["TPE (< 10 salariés)", "PME (10-50)", "ETI (50-250)", "Grande entreprise (> 250)", "Administration / ONG"] },
      { step: 2, key: "poste_mission",     label: "Poste / Intitulé de la mission",type: "text",    required: true },
      { step: 2, key: "service_departement",label: "Service / Département d'affectation",type: "text", placeholder: "Ex: Direction financière, RH, Production, Informatique..." },
      { step: 2, key: "encadrant_pro",     label: "Maître de stage (nom, poste)", type: "text",     required: true },
      { step: 2, key: "duree_stage",       label: "Durée du stage",               type: "text",     required: true, placeholder: "Ex: 3 mois, du 01/06 au 31/08/2025" },
      { step: 2, key: "description_entreprise",label: "Présentation de l'entreprise",type: "textarea",required: true, placeholder: "Activité, taille, historique, organisation, position sur le marché, clients types..." },
      // Step 3
      { step: 3, key: "contexte_mission",  label: "Contexte & raison du stage",   type: "textarea", placeholder: "Pourquoi l'entreprise avait-elle besoin de stagiaire ? Quel besoin servez-vous ?" },
      { step: 3, key: "missions_principales",label: "Missions principales confiées",type: "textarea",required: true, placeholder: "Listez et décrivez chaque mission avec son contexte et ses objectifs..." },
      { step: 3, key: "activites_quotidiennes",label: "Activités quotidiennes",   type: "textarea", placeholder: "Tâches récurrentes, réunions, interactions avec les équipes..." },
      { step: 3, key: "outils_utilises",   label: "Outils & Logiciels utilisés",  type: "textarea", placeholder: "Excel, Sage, AutoCAD, Python, ERP SAP, CRM Salesforce, outils métier..." },
      // Step 4
      { step: 4, key: "projets_realises",  label: "Projets spécifiques menés",    type: "textarea", required: true, placeholder: "Pour chaque projet : contexte, objectif, méthode utilisée, résultats obtenus..." },
      { step: 4, key: "realisation_phare", label: "Réalisation principale à valoriser",type: "textarea", required: true, placeholder: "Votre contribution la plus significative avec impact mesurable si possible..." },
      { step: 4, key: "methodologie",      label: "Méthodologie de travail adoptée",type: "textarea", placeholder: "Comment avez-vous organisé votre travail ? Méthodes, frameworks, processus suivis..." },
      // Step 5
      { step: 5, key: "competences_acquises",label: "Compétences acquises",       type: "textarea", required: true, placeholder: "Techniques (maîtrise d'outils, méthodes) et transversales (communication, organisation)..." },
      { step: 5, key: "difficultes_rencontrees",label: "Difficultés & solutions", type: "textarea", placeholder: "Problèmes rencontrés, obstacles surmontés, leçons tirées de chaque difficulté..." },
      { step: 5, key: "apport_au_service", label: "Votre valeur ajoutée à l'entreprise",type: "textarea", placeholder: "Idées proposées, améliorations apportées, gain de temps, nouvelles procédures créées..." },
      { step: 5, key: "retours_encadrant", label: "Retours de votre maître de stage",type: "textarea",placeholder: "Feedback positif reçu, axes d'amélioration suggérés..." },
      // Step 6
      { step: 6, key: "bilan_personnel",   label: "Bilan personnel",              type: "textarea", required: true, placeholder: "Évolution personnelle, confiance en soi, compréhension du monde professionnel..." },
      { step: 6, key: "points_forts_stage",label: "Points forts de ce stage",     type: "textarea", placeholder: "Ce qui a enrichi, les bonnes pratiques observées, la culture d'entreprise..." },
      { step: 6, key: "points_ameliorer",  label: "Points à améliorer dans l'entreprise", type: "textarea", placeholder: "Observations constructives, recommandations professionnelles basées sur vos constats..." },
      // Step 7
      { step: 7, key: "lien_cours",        label: "Lien avec les cours théoriques",type: "textarea", required: true, placeholder: "Quels enseignements ont été confirmés / infirmés / enrichis par la pratique ?" },
      { step: 7, key: "cours_manquants",   label: "Compétences non couvertes par la formation",type: "textarea", placeholder: "Ce que vous n'avez pas appris à l'école et que vous auriez eu besoin de savoir..." },
      // Step 8
      { step: 8, key: "recommandations",   label: "Recommandations à l'entreprise",type: "textarea", placeholder: "Suggestions d'amélioration fondées sur votre observation externe..." },
      { step: 8, key: "projet_professionnel",label: "Projet professionnel post-stage",type: "textarea", required: true, placeholder: "Comment ce stage oriente-t-il votre parcours ? Secteur visé, type de poste, formation complémentaire..." },
      { step: 8, key: "suite_envisagee",   label: "Suite dans cette entreprise",  type: "select",   options: ["Embauche envisagée", "Pas de suite prévue", "CDI / CDD proposé", "Encore en discussion"] },
      { step: 8, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Tout autre élément pertinent pour enrichir le rapport..." },
    ],
  },

  {
    id: "bourse",
    category: "academique",
    title: "Dossier de Bourse",
    description: "Dossier complet pour candidature à une bourse d'études ou d'excellence.",
    priceFcfa: 7425,
    badge: "Nouveau",
    icon: "Award",
    steps: [
      { number: 1, title: "Candidat & Situation" },
      { number: 2, title: "Parcours académique" },
      { number: 3, title: "Expériences & Compétences" },
      { number: 4, title: "Programme & Bourse visés" },
      { number: 5, title: "Projet académique & de recherche" },
      { number: 6, title: "Projet professionnel & Impact" },
      { number: 7, title: "Motivation & Engagement" },
    ],
    fields: [
      // Step 1
      { step: 1, key: "full_name",         label: "Nom complet",                  type: "text",     required: true },
      { step: 1, key: "date_naissance",    label: "Date de naissance",            type: "text",     required: true },
      { step: 1, key: "nationalite",       label: "Nationalité",                  type: "text",     required: true },
      { step: 1, key: "pays_residence",    label: "Pays de résidence actuel",     type: "text",     required: true },
      { step: 1, key: "email",             label: "Email",                        type: "text",     required: true },
      { step: 1, key: "telephone",         label: "Téléphone / WhatsApp",         type: "text" },
      { step: 1, key: "situation_actuelle",label: "Situation actuelle",           type: "select",   options: ["Étudiant", "Jeune diplômé", "Professionnel en activité", "En recherche d'emploi", "Chercheur"] },
      { step: 1, key: "situation_familiale",label: "Situation familiale & financière",type: "textarea", placeholder: "Taille de la famille, revenus des parents, situation socio-économique si pertinent pour la bourse..." },
      // Step 2
      { step: 2, key: "formation_actuelle",label: "Formation / Diplôme actuel",   type: "textarea", required: true, placeholder: "Niveau, filière, université, pays, mention..." },
      { step: 2, key: "resultats_academiques",label: "Résultats académiques détaillés",type: "textarea", required: true, placeholder: "Moyennes par année, classement dans la promotion, mentions obtenues..." },
      { step: 2, key: "matieres_fortes",   label: "Matières fortes & spécialisation",type: "textarea", placeholder: "Matières dans lesquelles vous excellez, en lien avec la bourse demandée..." },
      { step: 2, key: "formations_anterieures",label: "Formations antérieures",   type: "textarea", placeholder: "Diplômes précédents, certifications, formations courtes, MOOC certifiants..." },
      { step: 2, key: "distinctions",      label: "Distinctions & Prix académiques",type: "textarea", placeholder: "Prix d'excellence, félicitations du jury, concours académiques gagnés..." },
      // Step 3
      { step: 3, key: "experiences_pro",   label: "Expériences professionnelles / stages",type: "textarea", placeholder: "Postes, stages, consulting — entreprise, durée, missions clés..." },
      { step: 3, key: "experiences_recherche",label: "Expériences de recherche",  type: "textarea", placeholder: "Travaux de recherche, publications, présentations en conférence, mémoires..." },
      { step: 3, key: "competences_cles",  label: "Compétences clés maîtrisées",  type: "textarea", placeholder: "Compétences techniques, analytiques, relationnelles en lien avec la formation visée..." },
      { step: 3, key: "langues",           label: "Langues maîtrisées",           type: "textarea", required: true, placeholder: "Français C2, Anglais B2 (TOEFL 95), Allemand A2..." },
      { step: 3, key: "certifications_langue",label: "Certifications linguistiques",type: "textarea",placeholder: "TOEFL, IELTS, DALF, GOETHE, DELF... scores obtenus..." },
      // Step 4
      { step: 4, key: "programme_bourse",  label: "Nom de la bourse / Programme", type: "text",     required: true, placeholder: "Ex: Bourse Eiffel Excellence, DAAD, AFD, Fulbright, Mastercard Foundation..." },
      { step: 4, key: "bailleur_bourse",   label: "Organisme accordant la bourse",type: "text",     required: true },
      { step: 4, key: "formation_visee",   label: "Formation visée",              type: "text",     required: true, placeholder: "Master en Finance, Doctorat en Santé publique, MBA..." },
      { step: 4, key: "etablissement_cible",label: "Établissement d'accueil visé",type: "text",     placeholder: "Université de Paris, Sciences Po, Harvard, UCL, Dauphine..." },
      { step: 4, key: "pays_etude",        label: "Pays d'études",                type: "text",     required: true },
      { step: 4, key: "duree",             label: "Durée du programme",           type: "text",     placeholder: "2 ans, 3 ans..." },
      { step: 4, key: "date_debut",        label: "Date de début souhaitée",      type: "text",     placeholder: "Ex: Septembre 2026" },
      // Step 5
      { step: 5, key: "projet_recherche",  label: "Projet de recherche / Thèse",  type: "textarea", placeholder: "Sujet envisagé, problématique, questions de recherche, méthodologie (pour Doctorat/Master recherche)..." },
      { step: 5, key: "lien_parcours_formation",label: "Lien entre votre parcours et la formation visée",type: "textarea",required: true, placeholder: "Comment votre formation actuelle et vos expériences vous ont préparé à ce programme ?" },
      { step: 5, key: "raison_etablissement",label: "Pourquoi cet établissement",  type: "textarea", placeholder: "Ce qui attire spécifiquement dans cet établissement : spécialisation, réputation, réseau, corps enseignant..." },
      // Step 6
      { step: 6, key: "projet_professionnel",label: "Projet professionnel à l'issue",type: "textarea",required: true, placeholder: "Poste visé, organisation, secteur, type de contribution envisagée après les études..." },
      { step: 6, key: "retour_pays",       label: "Plan de retour au pays d'origine",type: "textarea", placeholder: "Comment et quand comptez-vous rentrer ? Quelle contribution au développement de votre pays ?" },
      { step: 6, key: "impact_communaute", label: "Impact sur votre communauté / pays",type: "textarea", placeholder: "Comment vos compétences futures bénéficieront à votre pays ou région..." },
      // Step 7
      { step: 7, key: "motivation",        label: "Motivation principale pour cette bourse",type: "textarea", required: true, placeholder: "Pourquoi cette bourse ? Pourquoi cette formation ? Pourquoi vous êtes le meilleur candidat ?" },
      { step: 7, key: "valeur_ajoutee_candidature",label: "Ce qui distingue votre candidature",type: "textarea",required: true, placeholder: "Expériences uniques, compétences rares, perspective originale, engagement prouvé..." },
      { step: 7, key: "engagement_social", label: "Engagements sociaux & associatifs",type: "textarea", placeholder: "Bénévolat, associations, projets communautaires, leadership étudiant..." },
      { step: 7, key: "experiences_internationales",label: "Expériences internationales",type: "textarea", placeholder: "Séjours à l'étranger, échanges universitaires, conférences internationales..." },
      { step: 7, key: "infos_complementaires",label: "Informations complémentaires",type: "textarea",placeholder: "Toute information supplémentaire pertinente pour votre dossier..." },
    ],
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return SERVICES.filter((s) => s.category === category);
}
