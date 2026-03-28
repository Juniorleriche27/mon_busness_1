"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Combien de temps faut-il pour recevoir mon document ?",
    a: "La génération prend entre 1 et 3 minutes selon la complexité du document. Une fois généré, il est immédiatement disponible en téléchargement dans votre dashboard.",
  },
  {
    q: "Comment fonctionne le paiement Mobile Money ?",
    a: "Nous utilisons Maketou pour traiter les paiements. Vous choisissez votre opérateur (Wave, Orange Money, MTN) et confirmez le paiement sur votre téléphone. Des frais de 8% s'appliquent et sont affichés avant confirmation.",
  },
  {
    q: "Puis-je modifier mon document après génération ?",
    a: "Les formats DOCX et XLSX sont entièrement éditables. Vous pouvez les ouvrir dans Word ou Excel et les modifier librement. Le PDF est idéal pour la lecture et l'impression.",
  },
  {
    q: "Les documents juridiques sont-ils vraiment conformes au droit OHADA ?",
    a: "Nos prompts sont conçus pour respecter l'Acte Uniforme OHADA. Cependant, nous recommandons de faire valider tout document juridique important par un professionnel qualifié.",
  },
  {
    q: "Que se passe-t-il si la génération échoue ?",
    a: "En cas d'échec, le paiement n'est pas débité. Vous pouvez relancer la génération gratuitement. Si le problème persiste, contactez-nous via WhatsApp ou email.",
  },
];

export default function ContactPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simuler envoi (à connecter à un service email)
    setSent(true);
  }

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}>Support</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2 mb-4"
            style={{ color: "var(--text)" }}>
            Contactez-nous
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            Une question ? Un problème ? Nous répondons sous 24h en semaine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">

          {/* Méthodes de contact */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: "var(--text)" }}>
              Nous contacter
            </h2>

            {[
              {
                icon: "💬",
                title: "WhatsApp",
                desc: "Réponse rapide, du lundi au samedi",
                action: "Ouvrir WhatsApp",
                href: "https://wa.me/22892092572",
              },
              {
                icon: "✉️",
                title: "Email",
                desc: "senirolamadokou@gmail.com",
                action: "Envoyer un email",
                href: "mailto:senirolamadokou@gmail.com",
              },
              {
                icon: "📍",
                title: "Bureau",
                desc: "Lomé, Togo · Sur rendez-vous",
                action: null,
                href: null,
              },
            ].map(({ icon, title, desc, action, href }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl p-5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-2xl shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>{title}</p>
                  <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </div>
                {action && href && (
                  <a href={href} target="_blank" rel="noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg shrink-0 transition-opacity hover:opacity-80"
                    style={{ background: "var(--gold)", color: "#07070f" }}>
                    {action}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Formulaire */}
          <div>
            <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: "var(--text)" }}>
              Formulaire de contact
            </h2>

            {sent ? (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: "var(--surface)", border: "1px solid rgba(200,169,110,0.3)" }}>
                <p className="text-3xl mb-3">✅</p>
                <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>Message envoyé !</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Nous vous répondrons sous 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "name",    label: "Nom complet",  type: "text" },
                  { key: "email",   label: "Email",        type: "email" },
                  { key: "subject", label: "Objet",        type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</label>
                    <input type={type} required
                      value={(form as any)[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[var(--gold)]"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-sm" style={{ color: "var(--text-muted)" }}>Message</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-colors focus:border-[var(--gold)]"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "var(--gold)", color: "#07070f" }}>
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8 text-center"
            style={{ color: "var(--text)" }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                  style={{ color: "var(--text)" }}>
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <span className="shrink-0 text-lg transition-transform"
                    style={{ transform: open === i ? "rotate(45deg)" : "none", color: "var(--gold)" }}>
                    +
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
