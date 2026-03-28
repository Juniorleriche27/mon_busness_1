"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getServiceById } from "@/lib/catalog";
import { calcFees, formatFcfa, formatEur } from "@/lib/fees";

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "pt", label: "Português" },
  { value: "ar", label: "العربية" },
  { value: "de", label: "Deutsch" },
];

const FORMATS = [
  { value: "pdf",  label: "PDF",  desc: "Lecture & impression" },
  { value: "docx", label: "DOCX", desc: "Éditable Word" },
  { value: "xlsx", label: "XLSX", desc: "Tableau Excel" },
];

const PROVIDERS = [
  { value: "wave",   label: "Wave",         icon: "🌊" },
  { value: "orange", label: "Orange Money", icon: "🟠" },
  { value: "mtn",    label: "MTN Money",    icon: "🟡" },
  { value: "card",   label: "Carte bancaire",icon: "💳" },
];

export default function CommanderPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const router         = useRouter();
  const { data: session } = useSession();

  const service = getServiceById(serviceId);

  const [fields,   setFields]   = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("fr");
  const [format,   setFormat]   = useState("pdf");
  const [provider, setProvider] = useState("wave");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p style={{ color: "var(--text-muted)" }}>Service introuvable.</p>
      </div>
    );
  }

  const priceData = service.priceFcfa ? calcFees(service.priceFcfa) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/auth?callbackUrl=/commander/" + serviceId); return; }

    setLoading(true);
    setError("");

    try {
      if (priceData) {
        // Initier paiement
        const res = await fetch("/api/payment/initiate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ serviceId, provider }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        // Stocker les fields en session storage pour les récupérer après paiement
        sessionStorage.setItem(`scrivia_fields_${data.paymentId}`, JSON.stringify({ fields, language, format }));
        window.location.href = data.paymentUrl;
      } else {
        // Sur devis : générer directement
        const res = await fetch("/api/generate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ serviceId, fields, language, format }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message ?? "Erreur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Commander</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold" style={{ color: "var(--text)" }}>
            {service.title}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{service.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Formulaire gauche ── */}
            <div className="flex-1 space-y-6">

              {/* Champs service */}
              <div className="rounded-2xl p-6 space-y-5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                  Informations du document
                </h2>
                {service.fields.map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {field.label}
                      {field.required && <span style={{ color: "var(--gold)" }}> *</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={fields[field.key] ?? ""}
                        onChange={e => setFields(p => ({ ...p, [field.key]: e.target.value }))}
                        required={field.required}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-colors focus:border-[var(--gold)]"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={fields[field.key] ?? ""}
                        onChange={e => setFields(p => ({ ...p, [field.key]: e.target.value }))}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[var(--gold)]"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}>
                        <option value="">Sélectionner…</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={fields[field.key] ?? ""}
                        onChange={e => setFields(p => ({ ...p, [field.key]: e.target.value }))}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[var(--gold)]"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Options langue + format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Langue</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map(l => (
                      <button key={l.value} type="button"
                        onClick={() => setLanguage(l.value)}
                        className="py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background:  language === l.value ? "var(--gold)" : "var(--bg)",
                          color:       language === l.value ? "#07070f" : "var(--text-muted)",
                          border:      language === l.value ? "none" : "1px solid var(--border)",
                        }}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Format</h3>
                  <div className="space-y-2">
                    {FORMATS.map(f => (
                      <button key={f.value} type="button"
                        onClick={() => setFormat(f.value)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all"
                        style={{
                          background:  format === f.value ? "rgba(200,169,110,0.1)" : "var(--bg)",
                          border:      `1px solid ${format === f.value ? "var(--gold)" : "var(--border)"}`,
                        }}>
                        <span className="text-xs font-semibold" style={{ color: format === f.value ? "var(--gold)" : "var(--text)" }}>
                          {f.label}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-dim)" }}>{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Panel résumé sticky ── */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-24 rounded-2xl p-6 space-y-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>Résumé</h2>

                <div className="space-y-1 text-sm">
                  <p className="font-medium" style={{ color: "var(--text)" }}>{service.title}</p>
                  <p style={{ color: "var(--text-dim)" }}>Format : {format.toUpperCase()} · Langue : {language.toUpperCase()}</p>
                </div>

                {priceData ? (
                  <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <PriceLine label="Prix de base" value={formatFcfa(priceData.price)} />
                    <PriceLine label="Frais Maketou (8%)" value={`+${formatFcfa(priceData.fees)}`} muted />
                    <div className="flex items-center justify-between pt-2"
                      style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>Total</span>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: "var(--gold)" }}>{formatFcfa(priceData.total)}</p>
                        <p className="text-xs" style={{ color: "var(--text-dim)" }}>{formatEur(priceData.total)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm pt-2" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                    Ce service est sur devis. Le document sera généré directement après soumission.
                  </p>
                )}

                {/* Modes de paiement */}
                {priceData && (
                  <div className="space-y-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                      Mode de paiement
                    </p>
                    {PROVIDERS.map(p => (
                      <button key={p.value} type="button"
                        onClick={() => setProvider(p.value)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                        style={{
                          background: provider === p.value ? "rgba(200,169,110,0.1)" : "var(--bg)",
                          border:     `1px solid ${provider === p.value ? "var(--gold)" : "var(--border)"}`,
                        }}>
                        <span>{p.icon}</span>
                        <span className="text-sm" style={{ color: provider === p.value ? "var(--gold)" : "var(--text)" }}>
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <p className="text-xs px-3 py-2 rounded-lg"
                    style={{ background: "rgba(220,38,38,0.1)", color: "#f87171" }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--gold)", color: "#07070f" }}>
                  {loading ? "Traitement en cours…" : priceData ? `Payer ${formatFcfa(priceData.total)}` : "Générer mon document"}
                </button>

                {!session && (
                  <p className="text-xs text-center" style={{ color: "var(--text-dim)" }}>
                    Une connexion est requise pour générer votre document.
                  </p>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

function PriceLine({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: muted ? "var(--text-dim)" : "var(--text)" }}>{value}</span>
    </div>
  );
}
