"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type Tab = "login" | "register";

// ── Composant interne (utilise useSearchParams) ───────────

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCountry, setRegCountry] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email:    loginEmail,
      password: loginPassword,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: regName, email: regEmail, password: regPassword, country: regCountry }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la création du compte.");
        setLoading(false);
        return;
      }
      await signIn("credentials", { email: regEmail, password: regPassword, redirect: false });
      router.push(callbackUrl);
    } catch {
      setError("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Panel gauche (desktop) ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "var(--surface)" }}>
        <div>
          <span className="text-2xl font-display font-semibold tracking-wide"
            style={{ color: "var(--gold)" }}>
            Scrivia
          </span>
        </div>
        <div className="space-y-8">
          <h1 className="font-display text-4xl leading-tight"
            style={{ color: "var(--text)" }}>
            Vos documents professionnels,<br />
            <span style={{ color: "var(--gold)" }}>générés par IA en minutes.</span>
          </h1>
          <ul className="space-y-4">
            {[
              "24 types de documents couverts",
              "CV, business plan, statuts OHADA, plans archi…",
              "PDF, DOCX, XLSX disponibles",
              "1 document gratuit à l'inscription",
              "Paiement Mobile Money & Carte",
            ].map((arg) => (
              <li key={arg} className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "var(--gold)" }}>✦</span>
                {arg}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          © 2026 Scrivia. Tous droits réservés.
        </p>
      </div>

      {/* ── Panel droit ── */}
      <div className="flex-1 flex items-center justify-center p-6"
        style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-md space-y-6">
          {/* Logo mobile */}
          <div className="lg:hidden text-center">
            <span className="text-2xl font-display font-semibold"
              style={{ color: "var(--gold)" }}>Scrivia</span>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg p-1 gap-1"
            style={{ background: "var(--surface)" }}>
            {(["login", "register"] as Tab[]).map((t) => (
              <button key={t}
                onClick={() => { setTab(t); setError(""); }}
                className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  background: tab === t ? "var(--gold)" : "transparent",
                  color:      tab === t ? "#07070f"    : "var(--text-muted)",
                }}>
                {t === "login" ? "Connexion" : "Créer un compte"}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-center px-4 py-2 rounded-lg"
              style={{ background: "rgba(220,38,38,0.1)", color: "#f87171" }}>
              {error}
            </p>
          )}

          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="Email" type="email" value={loginEmail}
                onChange={setLoginEmail} required />
              <Field label="Mot de passe" type="password" value={loginPassword}
                onChange={setLoginPassword} required />
              <SubmitBtn loading={loading} label="Se connecter" />
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="Nom complet" type="text" value={regName}
                onChange={setRegName} />
              <Field label="Email" type="email" value={regEmail}
                onChange={setRegEmail} required />
              <Field label="Mot de passe" type="password" value={regPassword}
                onChange={setRegPassword} required />
              <Field label="Pays" type="text" value={regCountry}
                onChange={setRegCountry} placeholder="Ex : Togo, Côte d'Ivoire…" />
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                ✦ 1 document gratuit offert à l'inscription.
              </p>
              <SubmitBtn loading={loading} label="Créer mon compte" />
            </form>
          )}

          <div className="flex items-center gap-4">
            <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>ou</span>
            <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border text-sm font-medium transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Export avec Suspense boundary ─────────────────────────

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Chargement…</span>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}

// ── Sous-composants locaux ─────────────────────────────────

function Field({ label, type, value, onChange, required, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[var(--gold)]"
        style={{
          background:  "var(--surface)",
          borderColor: "var(--border)",
          color:       "var(--text)",
        }}
      />
    </div>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{ background: "var(--gold)", color: "#07070f" }}>
      {loading ? "Chargement…" : label}
    </button>
  );
}
