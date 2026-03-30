"use client";

import { useState, useMemo } from "react";
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
  { value: "wave",   label: "Wave",          icon: "🌊" },
  { value: "orange", label: "Orange Money",  icon: "🟠" },
  { value: "mtn",    label: "MTN Money",     icon: "🟡" },
  { value: "card",   label: "Carte bancaire",icon: "💳" },
];

export default function CommanderPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const router             = useRouter();
  const { data: session }  = useSession();

  const service = getServiceById(serviceId);

  const [fields,   setFields]   = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("fr");
  const [format,   setFormat]   = useState("pdf");
  const [provider, setProvider] = useState("wave");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // ── Step state ──────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);

  // Group fields by step number
  const stepGroups = useMemo(() => {
    if (!service) return {};
    return service.fields.reduce<Record<number, typeof service.fields>>((acc, field) => {
      const s = field.step ?? 1;
      if (!acc[s]) acc[s] = [];
      acc[s].push(field);
      return acc;
    }, {});
  }, [service]);

  const totalSteps = service ? (service.steps?.length ?? Object.keys(stepGroups).length) : 1;
  // Add 1 for the final options step (langue + format + paiement)
  const totalDisplaySteps = totalSteps + 1;

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p style={{ color: "var(--text-muted)" }}>Service introuvable.</p>
      </div>
    );
  }

  const priceData    = service.priceFcfa ? calcFees(service.priceFcfa) : null;
  const currentFields = stepGroups[currentStep] ?? [];
  const isLastStep    = currentStep === totalDisplaySteps;
  const isOptionsStep = currentStep === totalDisplaySteps;

  // Check required fields for current step
  function currentStepValid() {
    if (isOptionsStep) return true;
    return currentFields
      .filter(f => f.required)
      .every(f => (fields[f.key] ?? "").trim() !== "");
  }

  function handleNext() {
    if (currentStep < totalDisplaySteps) setCurrentStep(s => s + 1);
  }

  function handlePrev() {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/auth?callbackUrl=/commander/" + serviceId); return; }

    setLoading(true);
    setError("");

    try {
      if (priceData) {
        const res = await fetch("/api/payment/initiate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ serviceId, provider }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        sessionStorage.setItem(`scrivia_fields_${data.paymentId}`, JSON.stringify({ fields, language, format }));
        window.location.href = data.paymentUrl;
      } else {
        const res = await fetch("/api/generate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ serviceId, fields, language, format }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // Step title
  const stepTitle = isOptionsStep
    ? "Options & paiement"
    : service.steps?.find(s => s.number === currentStep)?.title ?? `Étape ${currentStep}`;

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

        {/* Progress bar */}
        <div className="mb-8">
          {/* Step bubbles — desktop */}
          <div className="hidden sm:flex items-center gap-0 mb-4 overflow-x-auto">
            {Array.from({ length: totalDisplaySteps }, (_, i) => i + 1).map((step) => {
              const sTitle = step === totalDisplaySteps
                ? "Options"
                : (service.steps?.find(s => s.number === step)?.title ?? `Étape ${step}`);
              const done    = step < currentStep;
              const active  = step === currentStep;
              return (
                <div key={step} className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => step < currentStep && setCurrentStep(step)}
                    className="flex flex-col items-center gap-1.5"
                    style={{ cursor: step < currentStep ? "pointer" : "default" }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: done  ? "var(--gold)"
                                  : active ? "var(--gold)"
                                  : "var(--surface-2)",
                        color:      done || active ? "#07070f" : "var(--text-muted)",
                        border:     active ? "2px solid var(--gold-light)" : "none",
                        boxShadow:  active ? "0 0 0 3px rgba(200,169,110,0.2)" : "none",
                      }}>
                      {done ? "✓" : step}
                    </div>
                    <span className="text-xs max-w-[80px] text-center leading-tight"
                      style={{ color: active ? "var(--gold)" : done ? "var(--text-muted)" : "var(--text-dim)" }}>
                      {sTitle}
                    </span>
                  </button>
                  {step < totalDisplaySteps && (
                    <div className="w-8 sm:w-12 h-px mx-1 mt-[-14px]"
                      style={{ background: step < currentStep ? "var(--gold)" : "var(--border)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile progress */}
          <div className="sm:hidden mb-3 flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-muted)" }}>
              Étape {currentStep} / {totalDisplaySteps}
            </span>
            <span className="font-medium" style={{ color: "var(--gold)" }}>{stepTitle}</span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-1 rounded-full" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                background: "var(--gold)",
                width: `${((currentStep - 1) / (totalDisplaySteps - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Formulaire gauche ── */}
            <div className="flex-1">

              {/* ── Champs de l'étape courante ── */}
              {!isOptionsStep && (
                <div className="rounded-2xl p-6 space-y-5 animate-fade-in"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                      {stepTitle}
                    </h2>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "rgba(200,169,110,0.1)", color: "var(--gold)" }}>
                      {currentStep} / {totalSteps}
                    </span>
                  </div>

                  {currentFields.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                      Aucun champ pour cette étape.
                    </p>
                  ) : (
                    currentFields.map(field => (
                      <FieldInput
                        key={field.key}
                        field={field}
                        value={fields[field.key] ?? ""}
                        onChange={v => setFields(p => ({ ...p, [field.key]: v }))}
                      />
                    ))
                  )}
                </div>
              )}

              {/* ── Étape finale : Langue + Format + Paiement ── */}
              {isOptionsStep && (
                <div className="space-y-4 animate-fade-in">
                  {/* Langue */}
                  <div className="rounded-2xl p-5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Langue du document</h3>
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

                  {/* Format */}
                  <div className="rounded-2xl p-5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Format de fichier</h3>
                    <div className="space-y-2">
                      {FORMATS.map(f => (
                        <button key={f.value} type="button"
                          onClick={() => setFormat(f.value)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all"
                          style={{
                            background: format === f.value ? "rgba(200,169,110,0.1)" : "var(--bg)",
                            border:     `1px solid ${format === f.value ? "var(--gold)" : "var(--border)"}`,
                          }}>
                          <span className="text-xs font-semibold"
                            style={{ color: format === f.value ? "var(--gold)" : "var(--text)" }}>
                            {f.label}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-dim)" }}>{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paiement */}
                  {priceData && (
                    <div className="rounded-2xl p-5"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Mode de paiement</h3>
                      <div className="space-y-2">
                        {PROVIDERS.map(p => (
                          <button key={p.value} type="button"
                            onClick={() => setProvider(p.value)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                            style={{
                              background: provider === p.value ? "rgba(200,169,110,0.1)" : "var(--bg)",
                              border:     `1px solid ${provider === p.value ? "var(--gold)" : "var(--border)"}`,
                            }}>
                            <span>{p.icon}</span>
                            <span className="text-sm"
                              style={{ color: provider === p.value ? "var(--gold)" : "var(--text)" }}>
                              {p.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Navigation Précédent / Suivant ── */}
              <div className="mt-6 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button type="button" onClick={handlePrev}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all hover:border-[var(--gold)]"
                    style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Précédent
                  </button>
                ) : <div />}

                {!isLastStep ? (
                  <button type="button" onClick={handleNext}
                    disabled={!currentStepValid()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                    style={{ background: "var(--gold)", color: "#07070f" }}>
                    Suivant
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ) : (
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gold)", color: "#07070f" }}>
                    {loading ? "Traitement…" : priceData ? `Payer ${formatFcfa(priceData.total)}` : "Générer mon document"}
                  </button>
                )}
              </div>

              {error && (
                <p className="mt-4 text-xs px-3 py-2 rounded-lg"
                  style={{ background: "rgba(220,38,38,0.1)", color: "#f87171" }}>
                  {error}
                </p>
              )}

              {!session && isLastStep && (
                <p className="mt-3 text-xs text-center" style={{ color: "var(--text-dim)" }}>
                  Une connexion est requise pour générer votre document.
                </p>
              )}
            </div>

            {/* ── Panel résumé sticky ── */}
            <div className="lg:w-72 shrink-0">
              <div className="sticky top-24 rounded-2xl p-6 space-y-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Résumé
                </h2>

                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{service.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                    {format.toUpperCase()} · {language.toUpperCase()}
                  </p>
                </div>

                {/* Steps recap */}
                <div className="space-y-1 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => {
                    const sTitle = service.steps?.find(s => s.number === step)?.title ?? `Étape ${step}`;
                    const done   = step < currentStep;
                    return (
                      <div key={step} className="flex items-center gap-2 text-xs">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                          style={{
                            background: done ? "var(--gold)" : step === currentStep ? "rgba(200,169,110,0.2)" : "var(--surface-2)",
                            color:      done ? "#07070f" : step === currentStep ? "var(--gold)" : "var(--text-dim)",
                          }}>
                          {done ? "✓" : step}
                        </span>
                        <span style={{ color: done ? "var(--text-muted)" : step === currentStep ? "var(--text)" : "var(--text-dim)" }}>
                          {sTitle}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {priceData ? (
                  <div className="space-y-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <PriceLine label="Prix de base"       value={formatFcfa(priceData.price)} />
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
                  <p className="text-xs pt-2" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                    Ce service est sur devis. Généré directement après soumission.
                  </p>
                )}

                {/* Filled fields preview */}
                {Object.entries(fields).filter(([, v]) => v).length > 0 && (
                  <div className="pt-2 space-y-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                    <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-dim)" }}>Informations saisies</p>
                    {Object.entries(fields).filter(([, v]) => v).slice(0, 5).map(([key, val]) => {
                      const fieldDef = service.fields.find(f => f.key === key);
                      return (
                        <div key={key} className="text-xs">
                          <span style={{ color: "var(--text-dim)" }}>{fieldDef?.label ?? key}: </span>
                          <span style={{ color: "var(--text-muted)" }} className="truncate">
                            {val.length > 40 ? val.slice(0, 40) + "…" : val}
                          </span>
                        </div>
                      );
                    })}
                    {Object.entries(fields).filter(([, v]) => v).length > 5 && (
                      <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                        +{Object.entries(fields).filter(([, v]) => v).length - 5} autre(s)…
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

// ── Field input component ──────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: { key: string; label: string; type: string; required?: boolean; placeholder?: string; options?: string[]; hint?: string };
  value: string;
  onChange: (v: string) => void;
}) {
  const inputStyle = {
    background:  "var(--bg)",
    border:      "1px solid var(--border)",
    color:       "var(--text)",
  };
  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[var(--gold)]";

  return (
    <div className="space-y-1.5">
      <label className="text-sm" style={{ color: "var(--text-muted)" }}>
        {field.label}
        {field.required && <span style={{ color: "var(--gold)" }}> *</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          rows={4}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          required={field.required}
          className={inputClass}
          style={inputStyle}>
          <option value="">Sélectionner…</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={inputClass}
          style={inputStyle}
        />
      )}
      {field.hint && (
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>{field.hint}</p>
      )}
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
