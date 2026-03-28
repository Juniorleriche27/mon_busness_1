"use client";

import { useState } from "react";
import Link from "next/link";
import { SERVICES, PLANS, CATEGORIES } from "@/lib/catalog";
import { formatFcfa, formatEur, calcFees } from "@/lib/fees";

export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);

  const displayPrice = (base: number) =>
    annual ? Math.round(base * 12 * 0.85) : base;

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}>Tarification</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2 mb-4"
            style={{ color: "var(--text)" }}>
            Tarifs clairs et transparents
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            Frais de transaction 8% affichés à chaque étape. Aucune surprise.
          </p>
        </div>

        {/* Toggle mensuel/annuel */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="text-sm" style={{ color: annual ? "var(--text-dim)" : "var(--text)" }}>
            Mensuel
          </span>
          <button onClick={() => setAnnual(!annual)}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{ background: annual ? "var(--gold)" : "var(--border)" }}>
            <span className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${annual ? "translate-x-7" : "translate-x-1"}`}
              style={{ background: annual ? "#07070f" : "var(--text-muted)" }} />
          </button>
          <span className="text-sm" style={{ color: annual ? "var(--text)" : "var(--text-dim)" }}>
            Annuel
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(200,169,110,0.15)", color: "var(--gold)" }}>
              −15%
            </span>
          </span>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {PLANS.map(plan => {
            const price = displayPrice(plan.priceFcfa);
            return (
              <div key={plan.id}
                className="rounded-2xl p-6 flex flex-col"
                style={{
                  background: plan.badge ? "var(--surface-2)" : "var(--surface)",
                  border:     "1px solid var(--border)",
                  outline:    plan.badge ? "2px solid var(--gold)" : undefined,
                }}>
                {plan.badge && (
                  <span className="self-center text-xs font-semibold px-3 py-1 rounded-full mb-4"
                    style={{ background: "var(--gold)", color: "#07070f" }}>
                    {plan.badge}
                  </span>
                )}
                <h2 className="font-display text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>
                  {plan.name}
                </h2>
                <p className="text-2xl font-bold" style={{ color: "var(--gold)" }}>
                  {formatFcfa(price)}
                  <span className="text-sm font-normal ml-1" style={{ color: "var(--text-dim)" }}>
                    /{annual ? "an" : "mois"}
                  </span>
                </p>
                <p className="text-xs mb-6" style={{ color: "var(--text-dim)" }}>
                  {formatEur(price)}/{annual ? "an" : "mois"}
                </p>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--text-muted)" }}>
                      <span style={{ color: "var(--gold)" }}>✦</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth"
                  className="text-center py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{
                    background: plan.badge ? "var(--gold)" : "transparent",
                    color:      plan.badge ? "#07070f" : "var(--gold)",
                    border:     plan.badge ? "none" : "1px solid var(--gold)",
                  }}>
                  Choisir {plan.name}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Notice frais */}
        <div className="rounded-2xl p-6 mb-12 max-w-3xl mx-auto"
          style={{ background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.2)" }}>
          <h3 className="font-semibold mb-2" style={{ color: "var(--gold)" }}>
            ⚠️ Frais de transaction — règle des 8%
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Chaque génération de document inclut des frais Maketou de <strong style={{ color: "var(--gold)" }}>8%</strong> du prix de base.
            Ces frais couvrent le traitement Mobile Money (Wave, Orange, MTN) et carte bancaire.
            Le montant exact (base + frais + total) est toujours affiché <strong>avant</strong> toute confirmation de paiement.
          </p>
        </div>

        {/* Tableau prix à l'acte */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8 text-center"
            style={{ color: "var(--text)" }}>
            Prix à l'acte — tous les 24 services
          </h2>

          {CATEGORIES.map(cat => {
            const catServices = SERVICES.filter(s => s.category === cat.id && s.priceFcfa !== null);
            if (catServices.length === 0) return null;
            return (
              <div key={cat.id} className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--gold)" }}>{cat.label}</h3>
                <div className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "var(--surface)" }}>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Service</th>
                        <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Prix de base</th>
                        <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Frais 8%</th>
                        <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--gold)" }}>Total</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {catServices.map((service, i) => {
                        const { price, fees, total } = calcFees(service.priceFcfa!);
                        return (
                          <tr key={service.id}
                            style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--surface)", borderTop: "1px solid var(--border)" }}>
                            <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                              {service.title}
                              {service.badge && (
                                <span className="ml-2 text-xs px-1.5 py-0.5 rounded"
                                  style={{ background: "rgba(200,169,110,0.1)", color: "var(--gold)" }}>
                                  {service.badge}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right" style={{ color: "var(--text-muted)" }}>
                              {formatFcfa(price)}
                            </td>
                            <td className="px-4 py-3 text-right" style={{ color: "var(--text-dim)" }}>
                              +{formatFcfa(fees)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold" style={{ color: "var(--gold)" }}>
                              {formatFcfa(total)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Link href={`/commander/${service.id}`}
                                className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                                style={{ background: "var(--gold)", color: "#07070f" }}>
                                Commander
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Services sur devis */}
          <div className="mt-4 rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: "var(--gold)" }}>Sur devis : </span>
              {SERVICES.filter(s => s.priceFcfa === null).map(s => s.title).join(" · ")}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
