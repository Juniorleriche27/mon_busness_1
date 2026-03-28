import type { Metadata } from "next";
import { getServiceById } from "@/lib/catalog";
import { calcFees, formatFcfa } from "@/lib/fees";

export async function generateMetadata(
  { params }: { params: Promise<{ serviceId: string }> }
): Promise<Metadata> {
  const { serviceId } = await params;
  const service = getServiceById(serviceId);

  if (!service) {
    return { title: "Commander — Scrivia" };
  }

  const priceStr = service.priceFcfa
    ? formatFcfa(calcFees(service.priceFcfa).total) + " (frais inclus)"
    : "Sur devis";

  return {
    title: `Commander — ${service.title} | Scrivia`,
    description: `${service.description} ${priceStr}. PDF, DOCX ou XLSX. Généré par IA en quelques minutes.`,
    openGraph: {
      title: `${service.title} — Scrivia`,
      description: service.description,
      type: "website",
    },
  };
}

export default function CommanderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
