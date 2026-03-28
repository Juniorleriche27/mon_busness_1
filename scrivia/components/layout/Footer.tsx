import Link from "next/link";

const LINKS = {
  Services: [
    { href: "/services", label: "Tous les services" },
    { href: "/services#carriere", label: "Carrière" },
    { href: "/services#business", label: "Business" },
    { href: "/services#architecture", label: "Architecture" },
    { href: "/services#juridique", label: "Juridique" },
  ],
  Plateforme: [
    { href: "/tarifs",   label: "Tarifs" },
    { href: "/auth",     label: "Connexion" },
    { href: "/dashboard",label: "Dashboard" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact",  label: "Contact" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
      className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
              <span className="font-display font-semibold text-xl"
                style={{ color: "var(--gold)" }}>Scrivia</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--text-muted)" }}>
              Générez des documents professionnels en quelques minutes grâce à l'IA.
              CV, business plan, statuts, plans architecturaux et bien plus.
            </p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Afrique · OHADA · FCFA + EUR
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--gold)" }}>
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}
                      className="text-sm transition-colors hover:text-[var(--gold)]"
                      style={{ color: "var(--text-muted)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            © 2026 Scrivia. Tous droits réservés.
          </p>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Documents professionnels par IA · Afrique & International
          </p>
        </div>
      </div>
    </footer>
  );
}
