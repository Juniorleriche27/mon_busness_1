import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Scrivia",
  description:
    "Scrivia est une plateforme de génération de documents professionnels par IA, conçue pour l'Afrique. Mission, valeurs, roadmap et contact.",
  openGraph: {
    title: "À propos de Scrivia — Documents IA pour l'Afrique",
    description:
      "Notre mission : rendre les documents professionnels accessibles à tous en Afrique. Conformité OHADA, tarifs FCFA, Mobile Money.",
    type: "website",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
