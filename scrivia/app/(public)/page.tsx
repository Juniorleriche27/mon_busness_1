import Link from "next/link";
import { SERVICES, PLANS } from "@/lib/catalog";
import { formatFcfa, formatEur, calcFees } from "@/lib/fees";

const HERO_SERVICES = SERVICES.filter(s =>
  ["cv", "plan_affaire", "archi", "statuts", "lettre", "bourse"].includes(s.id)
);

const HOW_STEPS = [
  { n: "01", title: "Choisissez votre service", text: "Parcourez nos 24 services couvrant Carrière, Business, Architecture, Juridique, Traduction et plus." },
  { n: "02", title: "Remplissez le formulaire", text: "Un brief structuré en 2 minutes. Vos informations guident l'IA pour un résultat personnalisé." },
  { n: "03", title: "Payez en Mobile Money", text: "Wave, Orange Money, MTN ou carte bancaire. Frais transparents affichés avant paiement." },
  { n: "04", title: "Téléchargez votre document", text: "Votre fichier PDF, DOCX ou XLSX est prêt en quelques minutes, téléchargeable depuis votre dashboard." },
];

const TRUST_ITEMS = [
  { icon: "⚡", title: "Génération instantanée", text: "Documents prêts en moins de 3 minutes grâce à Claude, l'IA d'Anthropic." },
  { icon: "📄", title: "24 types de documents", text: "CV, business plan, statuts OHADA, plans architecturaux, traductions et bien plus." },
  { icon: "💰", title: "Tarifs en FCFA", text: "Prix adaptés au marché africain, paiement Mobile Money sans frais cachés." },
  { icon: "⚖️", title: "Conformité OHADA", text: "Documents juridiques conformes au droit OHADA et aux pratiques locales." },
  { icon: "📥", title: "PDF, DOCX, XLSX", text: "Choisissez votre format de livraison selon vos besoins." },
  { icon: "🔒", title: "Vos données sécurisées", text: "Aucune donnée revendue. Vos documents vous appartiennent." },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{ background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.3)", color: "var(--gold)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--gold)" }} />
          IA générative · 24 services · Afrique & International
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6 max-w-4xl mx-auto"
          style={{ color: "var(--text)" }}>
          Vos documents professionnels,{" "}
          <span style={{ color: "var(--gold)" }}>générés par IA</span>{" "}
          en quelques minutes
        </h1>

        <p className="text-lg max-w-2xl mx-auto mb-10"
          style={{ color: "var(--text-muted)" }}>
          CV, business plan, statuts juridiques, plans architecturaux, traductions…
          Briefez, payez en Mobile Money, téléchargez.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/services"
            className="px-8 py-3.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 w-full sm:w-auto text-center"
            style={{ background: "var(--gold)", color: "#07070f" }}>
            Voir tous les services
          </Link>
          <Link href="/auth"
            className="px-8 py-3.5 rounded-lg font-semibold text-sm border transition-colors hover:border-[var(--gold)] w-full sm:w-auto text-center"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            1 document gratuit →
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { v: "24",    l: "Services disponibles" },
            { v: "3 min", l: "Délai de génération" },
            { v: "FCFA",  l: "Tarifs locaux" },
            { v: "OHADA", l: "Conformité juridique" },
          ].map(({ v, l }) => (
            <div key={l} className="rounded-xl p-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="font-display text-2xl font-semibold mb-1"
                style={{ color: "var(--gold)" }}>{v}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}>Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-2"
            style={{ color: "var(--text)" }}>Comment ça fonctionne</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_STEPS.map(({ n, title, text }) => (
            <div key={n} className="relative rounded-2xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="font-display text-4xl font-bold mb-4 opacity-20"
                style={{ color: "var(--gold)" }}>{n}</div>
              <h3 className="font-semibold text-base mb-2" style={{ color: "var(--text)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES POPULAIRES ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--gold)" }}>Catalogue</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-1"
              style={{ color: "var(--text)" }}>Services populaires</h2>
          </div>
          <Link href="/services"
            className="text-sm transition-colors hover:text-[var(--gold)] shrink-0"
            style={{ color: "var(--text-muted)" }}>
            Voir les 24 services →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HERO_SERVICES.map(service => {
            const { price, fees, total } = service.priceFcfa ? calcFees(service.priceFcfa) : { price: 0, fees: 0, total: 0 };
            return (
              <div key={service.id} className="rounded-2xl p-6 flex flex-col group transition-colors hover:border-[var(--gold)]"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                {service.badge && (
                  <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                    style={{ background: "rgba(200,169,110,0.15)", color: "var(--gold)" }}>
                    {service.badge}
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "var(--text-muted)" }}>
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4"
                  style={{ borderTop: "1px solid var(--border)" }}>
                  <div>
                    {service.priceFcfa ? (
                      <>
                        <p className="text-sm font-semibold" style={{ color: "var(--gold)" }}>
                          {formatFcfa(total)}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                          {formatEur(total)} · frais inclus
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Sur devis</p>
                    )}
                  </div>
                  <Link href={`/commander/${service.id}`}
                    className="text-xs font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: "var(--gold)", color: "#07070f" }}>
                    Commander
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PLANS ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}>Abonnements</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-2"
            style={{ color: "var(--text)" }}>Plans adaptés à vos besoins</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={`rounded-2xl p-6 flex flex-col ${plan.badge ? "ring-2" : ""}`}
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
              <h3 className="font-display text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>
                {plan.name}
              </h3>
              <p className="text-2xl font-bold mb-1" style={{ color: "var(--gold)" }}>
                {formatFcfa(plan.priceFcfa)}
                <span className="text-sm font-normal" style={{ color: "var(--text-dim)" }}>/mois</span>
              </p>
              <p className="text-xs mb-6" style={{ color: "var(--text-dim)" }}>
                {formatEur(plan.priceFcfa)}/mois
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
                style={{ background: plan.badge ? "var(--gold)" : "transparent", color: plan.badge ? "#07070f" : "var(--gold)", border: plan.badge ? "none" : "1px solid var(--gold)" }}>
                Choisir {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-dim)" }}>
          Frais de transaction 8% ajoutés à chaque génération · Voir <Link href="/tarifs" className="underline" style={{ color: "var(--gold)" }}>la page tarifs</Link>
        </p>
      </section>

      {/* ── CONFIANCE ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}>Pourquoi Scrivia</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-2"
            style={{ color: "var(--text)" }}>Conçu pour l'Afrique</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST_ITEMS.map(({ icon, title, text }) => (
            <div key={title} className="rounded-2xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="text-2xl mb-4 block">{icon}</span>
              <h3 className="font-semibold text-base mb-2" style={{ color: "var(--text)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-3xl p-10 sm:p-16 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4"
            style={{ color: "var(--text)" }}>
            Prêt à générer votre premier document ?
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Créez un compte gratuitement et obtenez 1 document offert.
            Aucune carte requise.
          </p>
          <Link href="/auth"
            className="inline-block px-10 py-4 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--gold)", color: "#07070f" }}>
            Commencer gratuitement
          </Link>
        </div>
      </section>

    </div>
  );
}
