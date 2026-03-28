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
  type: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  priceFcfa: number | null;
  badge?: ServiceBadge;
  icon: string;
  fields: ServiceField[];
}

export const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: "carriere",     label: "Carrière" },
  { id: "business",    label: "Business" },
  { id: "architecture",label: "Architecture" },
  { id: "juridique",   label: "Juridique" },
  { id: "traduction",  label: "Traduction" },
  { id: "ao",          label: "Appels d'offres" },
  { id: "academique",  label: "Académique" },
];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceFcfa: 9900,
    docs: 5,
    features: ["5 documents/mois", "PDF uniquement", "Tous services Carrière", "Support email"],
  },
  {
    id: "pro",
    name: "Pro",
    priceFcfa: 24900,
    docs: 20,
    badge: "Populaire",
    features: ["20 documents/mois", "PDF + DOCX + XLSX", "Tous les 24 services", "Support prioritaire", "Historique 6 mois"],
  },
  {
    id: "business",
    name: "Business",
    priceFcfa: 59900,
    docs: 999,
    features: ["Documents illimités", "Tous formats", "Tous les 24 services", "Support dédié", "API access"],
  },
];

export const SERVICES: Service[] = [
  // ─── CARRIÈRE ──────────────────────────────────────────
  {
    id: "cv",
    category: "carriere",
    title: "CV Professionnel",
    description: "CV ATS-compatible, structuré et optimisé pour décrocher des entretiens.",
    priceFcfa: 4900,
    badge: "Populaire",
    icon: "FileText",
    fields: [
      { key: "full_name",     label: "Nom complet",       type: "text",     required: true },
      { key: "poste_vise",    label: "Poste visé",        type: "text",     required: true },
      { key: "experiences",   label: "Expériences",       type: "textarea", required: true, placeholder: "Titre, entreprise, dates, missions principales..." },
      { key: "formation",     label: "Formation",         type: "textarea", required: true, placeholder: "Diplôme, école, dates..." },
      { key: "competences",   label: "Compétences",       type: "textarea", required: true, placeholder: "Compétences techniques et soft skills..." },
      { key: "langues",       label: "Langues",           type: "text",     placeholder: "Français (natif), Anglais (B2)..." },
    ],
  },
  {
    id: "lettre",
    category: "carriere",
    title: "Lettre de motivation",
    description: "Lettre percutante, adaptée au poste et à l'entreprise ciblée.",
    priceFcfa: 2900,
    badge: "Populaire",
    icon: "Mail",
    fields: [
      { key: "full_name",       label: "Nom complet",         type: "text",     required: true },
      { key: "entreprise_cible",label: "Entreprise cible",    type: "text",     required: true },
      { key: "poste",           label: "Poste visé",          type: "text",     required: true },
      { key: "atouts",          label: "Vos atouts clés",     type: "textarea", required: true },
      { key: "motivation",      label: "Votre motivation",    type: "textarea", required: true },
    ],
  },
  {
    id: "linkedin",
    category: "carriere",
    title: "Optimisation LinkedIn",
    description: "Profil LinkedIn optimisé pour attirer recruteurs et clients.",
    priceFcfa: 7900,
    icon: "Linkedin",
    fields: [
      { key: "full_name",           label: "Nom complet",             type: "text",     required: true },
      { key: "titre_professionnel", label: "Titre professionnel",     type: "text",     required: true },
      { key: "experiences",         label: "Expériences",             type: "textarea", required: true },
      { key: "objectif",            label: "Objectif sur LinkedIn",   type: "textarea", required: true },
    ],
  },
  {
    id: "pack_carriere",
    category: "carriere",
    title: "Pack Carrière Complet",
    description: "CV + Lettre de motivation + Profil LinkedIn optimisé.",
    priceFcfa: 14900,
    badge: "Pack",
    icon: "Package",
    fields: [
      { key: "full_name",     label: "Nom complet",           type: "text",     required: true },
      { key: "poste_vise",    label: "Poste visé",            type: "text",     required: true },
      { key: "experiences",   label: "Expériences & Formation",type: "textarea",required: true },
      { key: "competences",   label: "Compétences & Langues", type: "textarea", required: true },
    ],
  },

  // ─── BUSINESS ──────────────────────────────────────────
  {
    id: "bmc",
    category: "business",
    title: "Business Model Canvas",
    description: "Canvas structuré pour valider et présenter votre modèle économique.",
    priceFcfa: 9900,
    icon: "LayoutGrid",
    fields: [
      { key: "nom_projet",  label: "Nom du projet",    type: "text",     required: true },
      { key: "secteur",     label: "Secteur",          type: "text",     required: true },
      { key: "description", label: "Description",      type: "textarea", required: true },
      { key: "clients",     label: "Clients cibles",   type: "textarea", required: true },
    ],
  },
  {
    id: "plan_affaire",
    category: "business",
    title: "Plan d'affaires",
    description: "Business plan complet en 10 chapitres, adapté au contexte africain/UEMOA.",
    priceFcfa: 29900,
    badge: "Premium",
    icon: "TrendingUp",
    fields: [
      { key: "nom_entreprise",  label: "Nom de l'entreprise",    type: "text",     required: true },
      { key: "secteur",         label: "Secteur d'activité",     type: "text",     required: true },
      { key: "description",     label: "Description du projet",  type: "textarea", required: true },
      { key: "marche_cible",    label: "Marché cible",           type: "textarea", required: true },
      { key: "investissement",  label: "Investissement prévu",   type: "text",     required: true },
      { key: "pays",            label: "Pays / Zone",            type: "text",     required: true },
    ],
  },
  {
    id: "pitch",
    category: "business",
    title: "Pitch Deck",
    description: "Deck investisseur percutant pour lever des fonds.",
    priceFcfa: 24900,
    badge: "Premium",
    icon: "Presentation",
    fields: [
      { key: "nom_startup",   label: "Nom de la startup",  type: "text",     required: true },
      { key: "secteur",       label: "Secteur",            type: "text",     required: true },
      { key: "probleme",      label: "Problème résolu",    type: "textarea", required: true },
      { key: "solution",      label: "Votre solution",     type: "textarea", required: true },
      { key: "traction",      label: "Traction actuelle",  type: "textarea" },
      { key: "montant_levee", label: "Montant à lever",    type: "text",     required: true },
    ],
  },
  {
    id: "marketing",
    category: "business",
    title: "Plan Marketing",
    description: "Stratégie marketing complète avec plan d'action détaillé.",
    priceFcfa: 19900,
    icon: "Megaphone",
    fields: [
      { key: "entreprise",  label: "Entreprise",       type: "text",     required: true },
      { key: "produit",     label: "Produit / Service",type: "text",     required: true },
      { key: "cible",       label: "Cible client",     type: "textarea", required: true },
      { key: "budget",      label: "Budget marketing", type: "text" },
      { key: "objectifs",   label: "Objectifs",        type: "textarea", required: true },
    ],
  },
  {
    id: "finances",
    category: "business",
    title: "Prévisions Financières",
    description: "Tableau financier sur 3 ans avec compte de résultat et seuil de rentabilité.",
    priceFcfa: 24900,
    icon: "Calculator",
    fields: [
      { key: "entreprise",  label: "Entreprise",             type: "text",     required: true },
      { key: "activite",    label: "Activité principale",    type: "text",     required: true },
      { key: "ca_an1",      label: "CA prévisionnel An 1",   type: "text",     required: true },
      { key: "charges",     label: "Charges estimées",       type: "textarea", required: true },
      { key: "investissement",label: "Investissement initial",type: "text",    required: true },
    ],
  },
  {
    id: "pack_business",
    category: "business",
    title: "Pack Business Complet",
    description: "Business Plan + BMC + Plan Marketing.",
    priceFcfa: 59900,
    badge: "Pack",
    icon: "Briefcase",
    fields: [
      { key: "nom_projet",    label: "Nom du projet",          type: "text",     required: true },
      { key: "secteur",       label: "Secteur",                type: "text",     required: true },
      { key: "description",   label: "Description complète",   type: "textarea", required: true },
      { key: "pays_marche",   label: "Pays / Marché cible",    type: "text",     required: true },
    ],
  },

  // ─── ARCHITECTURE ──────────────────────────────────────
  {
    id: "archi",
    category: "architecture",
    title: "Programme Architectural",
    description: "Programme pièce par pièce avec surfaces, matériaux et estimation en FCFA.",
    priceFcfa: 34900,
    badge: "Exclusif",
    icon: "Home",
    fields: [
      { key: "type_maison",   label: "Type de construction",  type: "text",     required: true },
      { key: "surface",       label: "Surface (m²)",          type: "text",     required: true },
      { key: "pieces",        label: "Nombre de pièces",      type: "text",     required: true },
      { key: "terrain",       label: "Dimensions du terrain", type: "text" },
      { key: "budget",        label: "Budget en FCFA",        type: "text",     required: true },
      { key: "besoins",       label: "Besoins spécifiques",   type: "textarea" },
    ],
  },
  {
    id: "devis",
    category: "architecture",
    title: "Devis de Construction",
    description: "Devis détaillé par lot de travaux avec prix unitaires.",
    priceFcfa: 19900,
    icon: "ClipboardList",
    fields: [
      { key: "type_travaux",  label: "Type de travaux",    type: "text",     required: true },
      { key: "surface",       label: "Surface (m²)",       type: "text",     required: true },
      { key: "localisation",  label: "Localisation",       type: "text",     required: true },
      { key: "standing",      label: "Standing souhaité",  type: "select",   options: ["Économique", "Standard", "Haut standing"], required: true },
      { key: "details",       label: "Détails complémentaires", type: "textarea" },
    ],
  },
  {
    id: "cdc",
    category: "architecture",
    title: "Cahier des Charges",
    description: "CDC technique complet pour lancer un appel d'offres de construction.",
    priceFcfa: 24900,
    icon: "FileCheck",
    fields: [
      { key: "type_projet",   label: "Type de projet",       type: "text",     required: true },
      { key: "surface",       label: "Surface (m²)",         type: "text",     required: true },
      { key: "lots_travaux",  label: "Lots de travaux",      type: "textarea", required: true },
      { key: "specifications",label: "Spécifications",       type: "textarea" },
    ],
  },
  {
    id: "permis",
    category: "architecture",
    title: "Dossier Permis de Construire",
    description: "Dossier complet pour demande de permis de construire.",
    priceFcfa: 29900,
    icon: "Stamp",
    fields: [
      { key: "nom_demandeur", label: "Nom du demandeur",     type: "text",     required: true },
      { key: "localisation",  label: "Localisation du terrain",type: "text",   required: true },
      { key: "nature_travaux",label: "Nature des travaux",   type: "textarea", required: true },
      { key: "surfaces",      label: "Surfaces (SHOB/SHON)", type: "text",     required: true },
      { key: "pays",          label: "Pays",                 type: "text",     required: true },
    ],
  },
  {
    id: "pack_archi",
    category: "architecture",
    title: "Pack Architecture Complet",
    description: "Programme + Devis + CDC en un seul pack.",
    priceFcfa: 69900,
    badge: "Pack",
    icon: "Building",
    fields: [
      { key: "type_construction",label: "Type de construction",type: "text",  required: true },
      { key: "surface",          label: "Surface (m²)",        type: "text",  required: true },
      { key: "lieu",             label: "Lieu",                type: "text",  required: true },
      { key: "budget",           label: "Budget en FCFA",      type: "text",  required: true },
      { key: "besoins",          label: "Besoins",             type: "textarea" },
    ],
  },

  // ─── JURIDIQUE ──────────────────────────────────────────
  {
    id: "statuts",
    category: "juridique",
    title: "Statuts de Société",
    description: "Statuts officiels conformes au droit OHADA.",
    priceFcfa: 19900,
    badge: "Exclusif",
    icon: "Scale",
    fields: [
      { key: "nom_societe",    label: "Nom de la société",    type: "text",     required: true },
      { key: "forme_juridique",label: "Forme juridique",      type: "select",   options: ["SARL", "SA", "SAS", "SNC", "GIE"], required: true },
      { key: "objet_social",   label: "Objet social",         type: "textarea", required: true },
      { key: "capital",        label: "Capital social (FCFA)",type: "text",     required: true },
      { key: "siege",          label: "Siège social",         type: "text",     required: true },
      { key: "pays",           label: "Pays",                 type: "text",     required: true },
    ],
  },
  {
    id: "contrat",
    category: "juridique",
    title: "Contrat Professionnel",
    description: "Contrat sur mesure : prestation, partenariat, confidentialité, etc.",
    priceFcfa: 14900,
    icon: "Handshake",
    fields: [
      { key: "type_contrat",label: "Type de contrat",    type: "text",     required: true },
      { key: "partie_1",    label: "Partie 1 (nom/rôle)",type: "text",     required: true },
      { key: "partie_2",    label: "Partie 2 (nom/rôle)",type: "text",     required: true },
      { key: "objet",       label: "Objet du contrat",   type: "textarea", required: true },
      { key: "montant",     label: "Montant / Valeur",   type: "text" },
    ],
  },
  {
    id: "financement",
    category: "juridique",
    title: "Dossier de Financement",
    description: "Dossier complet pour demande de prêt ou financement bancaire.",
    priceFcfa: 24900,
    icon: "Banknote",
    fields: [
      { key: "nom_projet",    label: "Nom du projet",       type: "text",     required: true },
      { key: "montant",       label: "Montant demandé",     type: "text",     required: true },
      { key: "objet",         label: "Objet du financement",type: "textarea", required: true },
      { key: "activite",      label: "Activité principale", type: "text",     required: true },
      { key: "garanties",     label: "Garanties proposées", type: "textarea" },
      { key: "ca",            label: "Chiffre d'affaires",  type: "text" },
    ],
  },

  // ─── TRADUCTION ─────────────────────────────────────────
  {
    id: "trad_s",
    category: "traduction",
    title: "Traduction Courte",
    description: "Traduction professionnelle jusqu'à 2 pages.",
    priceFcfa: 4900,
    badge: "Nouveau",
    icon: "Languages",
    fields: [
      { key: "texte",         label: "Texte à traduire (2p max)", type: "textarea", required: true },
      { key: "langue_source", label: "Langue source",             type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { key: "langue_cible",  label: "Langue cible",              type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { key: "type_doc",      label: "Type de document",          type: "text" },
    ],
  },
  {
    id: "trad_l",
    category: "traduction",
    title: "Traduction Longue",
    description: "Traduction professionnelle jusqu'à 10 pages.",
    priceFcfa: 14900,
    icon: "BookOpen",
    fields: [
      { key: "texte",         label: "Texte / Description (10p max)",type: "textarea", required: true },
      { key: "langue_source", label: "Langue source",                type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { key: "langue_cible",  label: "Langue cible",                 type: "select",   options: ["Français", "Anglais", "Espagnol", "Portugais", "Arabe", "Allemand"], required: true },
      { key: "type_doc",      label: "Type de document",             type: "text" },
    ],
  },

  // ─── APPELS D'OFFRES ────────────────────────────────────
  {
    id: "ao",
    category: "ao",
    title: "Réponse Appel d'Offres",
    description: "Offre technique et financière complète pour remporter des marchés.",
    priceFcfa: 39900,
    badge: "Premium",
    icon: "Trophy",
    fields: [
      { key: "entreprise",          label: "Votre entreprise",        type: "text",     required: true },
      { key: "objet_ao",            label: "Objet de l'AO",           type: "textarea", required: true },
      { key: "client",              label: "Client / Donneur d'ordre",type: "text",     required: true },
      { key: "budget",              label: "Budget estimé",           type: "text" },
      { key: "competences",         label: "Compétences mobilisées",  type: "textarea", required: true },
      { key: "approche_technique",  label: "Approche technique",      type: "textarea", required: true },
    ],
  },
  {
    id: "ong",
    category: "ao",
    title: "Proposition de Projet ONG",
    description: "Proposition complète pour bailleur de fonds (UE, USAID, AFD…).",
    priceFcfa: 49900,
    badge: "Premium",
    icon: "Globe",
    fields: [
      { key: "organisation",    label: "Organisation",          type: "text",     required: true },
      { key: "bailleur",        label: "Bailleur de fonds",     type: "text",     required: true },
      { key: "projet",          label: "Nom du projet",         type: "text",     required: true },
      { key: "problematique",   label: "Problématique",         type: "textarea", required: true },
      { key: "activites",       label: "Activités prévues",     type: "textarea", required: true },
      { key: "budget",          label: "Budget total",          type: "text",     required: true },
      { key: "beneficiaires",   label: "Bénéficiaires",         type: "textarea", required: true },
    ],
  },

  // ─── ACADÉMIQUE ─────────────────────────────────────────
  {
    id: "rapport_stage",
    category: "academique",
    title: "Rapport de Stage",
    description: "Rapport de stage professionnel structuré et complet.",
    priceFcfa: 14900,
    icon: "GraduationCap",
    fields: [
      { key: "full_name",       label: "Votre nom",              type: "text",     required: true },
      { key: "entreprise",      label: "Entreprise d'accueil",   type: "text",     required: true },
      { key: "poste_mission",   label: "Poste / Mission",        type: "text",     required: true },
      { key: "activites",       label: "Activités réalisées",    type: "textarea", required: true },
      { key: "ecole",           label: "École / Université",     type: "text",     required: true },
    ],
  },
  {
    id: "bourse",
    category: "academique",
    title: "Dossier de Bourse",
    description: "Dossier complet pour candidature à une bourse d'études ou d'excellence.",
    priceFcfa: 9900,
    badge: "Nouveau",
    icon: "Award",
    fields: [
      { key: "full_name",          label: "Nom complet",            type: "text",     required: true },
      { key: "programme_bourse",   label: "Programme de bourse",    type: "text",     required: true },
      { key: "formation_visee",    label: "Formation visée",        type: "text",     required: true },
      { key: "parcours_academique",label: "Parcours académique",    type: "textarea", required: true },
      { key: "motivation",         label: "Lettre de motivation",   type: "textarea", required: true },
    ],
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return SERVICES.filter((s) => s.category === category);
}
