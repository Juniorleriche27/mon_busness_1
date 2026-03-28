import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tous les services — Scrivia",
  description:
    "24 types de documents professionnels : CV, business plan, statuts OHADA, plans architecturaux, traductions, appels d'offres. Générés par IA en quelques minutes.",
  openGraph: {
    title: "Catalogue Scrivia — 24 services de documents par IA",
    description: "CV, business plan, statuts, plans archi… Briefez, payez en Mobile Money, téléchargez.",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
