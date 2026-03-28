import Link from "next/link";

const VALUES = [
  { icon: "⚡", title: "Rapidité", text: "Un document professionnel en moins de 3 minutes. Le temps est précieux en Afrique." },
  { icon: "🎯", title: "Pertinence", text: "Chaque document est contextualisé : droit OHADA, marché africain, pratiques locales." },
  { icon: "🔓", title: "Accessibilité", text: "Tarifs en FCFA, paiement Mobile Money. Scrivia est fait pour vous, où que vous soyez." },
];

const STATS = [
  { v: "24",   l: "Types de documents" },
  { v: "7",    l: "Catégories couvertes" },
  { v: "6",    l: "Langues supportées" },
  { v: "OHADA",l: "Conformité juridique" },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Lancement MVP", text: "24 services couvrant Carrière, Business, Architecture, Juridique, Traduction, AO et Académique.", done: true },
  { phase: "Phase 2", title: "Abonnements & API", text: "Plans Starter/Pro/Business. Accès API pour intégrations tierces.", done: false },
  { phase: "Phase 3", title: "Collaboration", text: "Documents partagés, signatures électroniques, espace équipe.", done: false },
  { phase: "Phase 4", title: "Expansion Afrique", text: "Support des langues locales. Partenariats avec institutions et universités africaines.", done: false },
];

export default function AProposPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}>À propos</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2 mb-6"
            style={{ color: "var(--text)" }}>
            Une IA pour les professionnels africains
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}>
            Scrivia est né d'un constat simple : les documents professionnels de qualité sont
            trop longs et trop chers à produire en Afrique. Nous avons changé ça.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {STATS.map(({ v, l }) => (
            <div key={l} className="rounded-2xl p-6 text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="font-display text-3xl font-bold mb-1" style={{ color: "var(--gold)" }}>{v}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="rounded-3xl p-8 sm:p-12 mb-16"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-4"
            style={{ color: "var(--text)" }}>Notre mission</h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
            Rendre la production de documents professionnels accessible à tous en Afrique.
            Que vous soyez étudiant, entrepreneur, architecte ou juriste, Scrivia vous donne
            accès à des documents de qualité internationale, au prix local.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Propulsé par <strong style={{ color: "var(--gold)" }}>Claude d'Anthropic</strong>,
            l'un des modèles d'IA les plus avancés au monde, chaque document est généré
            avec un niveau d'expertise que seuls les meilleurs professionnels pouvaient offrir.
          </p>
        </div>

        {/* Valeurs */}
        <div className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8 text-center"
            style={{ color: "var(--text)" }}>Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {VALUES.map(({ icon, title, text }) => (
              <div key={title} className="rounded-2xl p-6"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-3xl mb-4 block">{icon}</span>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8 text-center"
            style={{ color: "var(--text)" }}>Roadmap</h2>
          <div className="space-y-4">
            {ROADMAP.map(({ phase, title, text, done }) => (
              <div key={phase} className="flex gap-4 rounded-2xl p-5"
                style={{ background: "var(--surface)", border: `1px solid ${done ? "rgba(200,169,110,0.4)" : "var(--border)"}` }}>
                <div className="shrink-0">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold`}
                    style={{ background: done ? "var(--gold)" : "var(--bg)", color: done ? "#07070f" : "var(--text-dim)" }}>
                    {done ? "✓" : "○"}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: done ? "var(--gold)" : "var(--text-dim)" }}>{phase}</p>
                  <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>{title}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/auth"
            className="inline-block px-10 py-4 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--gold)", color: "#07070f" }}>
            Commencer gratuitement
          </Link>
        </div>

      </div>
    </div>
  );
}
