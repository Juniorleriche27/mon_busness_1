"use client";

import { useState } from "react";
import Link from "next/link";
import { SERVICES, CATEGORIES, type ServiceCategory } from "@/lib/catalog";
import { formatFcfa, formatEur, calcFees } from "@/lib/fees";

export default function ServicesPage() {
  const [active, setActive] = useState<ServiceCategory | "all">("all");

  const filtered = active === "all"
    ? SERVICES
    : SERVICES.filter(s => s.category === active);

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}>Catalogue complet</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2 mb-4"
            style={{ color: "var(--text)" }}>
            24 services disponibles
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Carrière, Business, Architecture, Juridique, Traduction, Appels d'offres, Académique.
            Un document professionnel en quelques minutes.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <TabBtn active={active === "all"} onClick={() => setActive("all")}>
            Tous ({SERVICES.length})
          </TabBtn>
          {CATEGORIES.map(cat => (
            <TabBtn key={cat.id} active={active === cat.id} onClick={() => setActive(cat.id)}>
              {cat.label} ({SERVICES.filter(s => s.category === cat.id).length})
            </TabBtn>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(service => {
            const priceData = service.priceFcfa ? calcFees(service.priceFcfa) : null;
            return (
              <article key={service.id}
                className="rounded-2xl p-5 flex flex-col transition-colors group hover:border-[var(--gold)]"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

                {/* Badge */}
                {service.badge && (
                  <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                    style={{ background: badgeBg(service.badge), color: badgeColor(service.badge) }}>
                    {service.badge}
                  </span>
                )}

                {/* Titre */}
                <h2 className="font-display text-lg font-semibold mb-2 leading-snug"
                  style={{ color: "var(--text)" }}>
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-sm leading-relaxed flex-1 mb-4"
                  style={{ color: "var(--text-muted)" }}>
                  {service.description}
                </p>

                {/* Prix + CTA */}
                <div className="pt-4 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)" }}>
                  <div>
                    {priceData ? (
                      <>
                        <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>
                          {formatFcfa(priceData.total)}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                          {formatEur(priceData.total)} · frais inclus
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                        Sur devis
                      </p>
                    )}
                  </div>
                  <Link href={`/commander/${service.id}`}
                    className="text-xs font-semibold px-3 py-2 rounded-lg transition-opacity hover:opacity-80 shrink-0"
                    style={{ background: "var(--gold)", color: "#07070f" }}>
                    Commander
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Note frais */}
        <p className="text-center text-xs mt-10" style={{ color: "var(--text-dim)" }}>
          * Prix affichés incluent les frais de transaction 8% (Maketou).
          Les prix de base hors frais sont visibles sur <Link href="/tarifs" className="underline"
            style={{ color: "var(--gold)" }}>la page tarifs</Link>.
        </p>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
      style={{
        background:   active ? "var(--gold)" : "var(--surface)",
        color:        active ? "#07070f"     : "var(--text-muted)",
        border:       active ? "none"        : "1px solid var(--border)",
      }}>
      {children}
    </button>
  );
}

function badgeBg(badge: string) {
  switch (badge) {
    case "Populaire": return "rgba(200,169,110,0.15)";
    case "Premium":   return "rgba(139,92,246,0.15)";
    case "Pack":      return "rgba(59,130,246,0.15)";
    case "Exclusif":  return "rgba(239,68,68,0.12)";
    case "Nouveau":   return "rgba(34,197,94,0.12)";
    default:          return "rgba(200,169,110,0.15)";
  }
}

function badgeColor(badge: string) {
  switch (badge) {
    case "Populaire": return "var(--gold)";
    case "Premium":   return "#a78bfa";
    case "Pack":      return "#60a5fa";
    case "Exclusif":  return "#f87171";
    case "Nouveau":   return "#4ade80";
    default:          return "var(--gold)";
  }
}
