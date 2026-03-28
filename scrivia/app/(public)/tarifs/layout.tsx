import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs — Scrivia",
  description:
    "Plans Starter 9 900 FCFA, Pro 24 900 FCFA, Business 59 900 FCFA. Frais de transaction 8% affichés avant paiement. Toggle mensuel/annuel avec −15%.",
  openGraph: {
    title: "Tarifs Scrivia — Documents professionnels par IA",
    description: "Abonnements et prix à l'acte pour 24 services. Paiement Mobile Money et carte.",
    type: "website",
  },
};

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
