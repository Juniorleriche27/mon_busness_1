import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & FAQ — Scrivia",
  description:
    "Contactez Scrivia via WhatsApp, email ou formulaire. FAQ sur les délais, paiements Mobile Money, formats de fichiers et conformité OHADA.",
  openGraph: {
    title: "Contact Scrivia — Support & FAQ",
    description: "Nous répondons sous 24h. WhatsApp : +22892092572",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
