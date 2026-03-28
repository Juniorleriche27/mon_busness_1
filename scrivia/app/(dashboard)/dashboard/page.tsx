"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";

type Doc = {
  id: string; serviceId: string; serviceName: string;
  language: string; format: string;
  status: "PROCESSING" | "DONE" | "FAILED";
  fileUrl: string | null; createdAt: string;
};

type Tab = "overview" | "documents" | "plan" | "settings";

export default function DashboardPage() {
  return (
    <Providers>
      <Navbar />
      <DashboardContent />
    </Providers>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const [docs,    setDocs]    = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<Tab>("overview");

  const user     = session?.user as any;
  const docsUsed = user?.docsUsed  ?? 0;
  const docsMax  = user?.docsLimit ?? 1;
  const plan     = user?.plan      ?? "FREE";
  const pct      = docsMax > 0 ? Math.min((docsUsed / docsMax) * 100, 100) : 0;

  useEffect(() => {
    fetch("/api/documents")
      .then(r => r.json())
      .then(d => { setDocs(d.documents ?? []); setLoading(false); });
  }, []);

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview",   label: "Vue d'ensemble" },
    { id: "documents",  label: "Mes documents" },
    { id: "plan",       label: "Mon abonnement" },
    { id: "settings",   label: "Paramètres" },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>Dashboard</p>
          <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text)" }}>
            Bonjour{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1"
          style={{ borderBottom: "1px solid var(--border)" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
              style={{
                color:        tab === t.id ? "var(--gold)" : "var(--text-muted)",
                borderBottom: tab === t.id ? "2px solid var(--gold)" : "2px solid transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Vue d'ensemble ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Documents générés"  value={String(docsUsed)} />
              <StatCard label="Documents restants" value={String(Math.max(0, docsMax - docsUsed))} />
              <StatCard label="Plan actif"         value={plan} gold />
              <StatCard label="Économies estimées" value={`${docsUsed * 5000} FCFA`} />
            </div>

            {/* Barre quota */}
            <div className="rounded-2xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Utilisation mensuelle
                </span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {docsUsed} / {docsMax} documents
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: pct > 80 ? "#f87171" : "var(--gold)" }} />
              </div>
              {pct >= 100 && (
                <p className="text-xs mt-2" style={{ color: "#f87171" }}>
                  Quota atteint. <Link href="/tarifs" className="underline">Passez à un plan supérieur</Link>.
                </p>
              )}
            </div>

            {/* Derniers docs */}
            <div>
              <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Documents récents</h2>
              {loading ? (
                <div className="text-sm" style={{ color: "var(--text-dim)" }}>Chargement…</div>
              ) : docs.length === 0 ? (
                <EmptyDocs />
              ) : (
                <DocTable docs={docs.slice(0, 5)} />
              )}
            </div>
          </div>
        )}

        {/* ── Mes documents ── */}
        {tab === "documents" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold" style={{ color: "var(--text)" }}>
                Tous mes documents ({docs.length})
              </h2>
              <Link href="/services"
                className="text-xs px-4 py-2 rounded-lg font-medium"
                style={{ background: "var(--gold)", color: "#07070f" }}>
                + Nouveau document
              </Link>
            </div>
            {loading ? (
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>Chargement…</p>
            ) : docs.length === 0 ? (
              <EmptyDocs />
            ) : (
              <DocTable docs={docs} />
            )}
          </div>
        )}

        {/* ── Mon abonnement ── */}
        {tab === "plan" && (
          <div className="max-w-xl space-y-6">
            <div className="rounded-2xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Plan actuel</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xl font-display font-semibold" style={{ color: "var(--gold)" }}>{plan}</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    {docsMax === 999 ? "Documents illimités" : `${docsMax} documents/mois`}
                  </p>
                </div>
                {plan === "FREE" && (
                  <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(200,169,110,0.1)", color: "var(--gold)" }}>
                    Gratuit
                  </span>
                )}
              </div>
              <Link href="/tarifs"
                className="block text-center py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--gold)", color: "#07070f" }}>
                Voir les plans disponibles
              </Link>
            </div>
          </div>
        )}

        {/* ── Paramètres ── */}
        {tab === "settings" && (
          <div className="max-w-xl">
            <div className="rounded-2xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Mon compte</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Nom</span>
                  <span style={{ color: "var(--text)" }}>{user?.name ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Email</span>
                  <span style={{ color: "var(--text)" }}>{user?.email ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Plan</span>
                  <span style={{ color: "var(--gold)" }}>{plan}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Sous-composants ──────────────────────────────────────

function StatCard({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="rounded-2xl p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <p className="text-2xl font-bold font-display mb-1"
        style={{ color: gold ? "var(--gold)" : "var(--text)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
    </div>
  );
}

function DocTable({ docs }: { docs: Doc[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr style={{ background: "var(--surface)" }}>
              {["Document", "Date", "Format", "Statut", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, i) => (
              <tr key={doc.id}
                style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--surface)", borderTop: "1px solid var(--border)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text)" }}>{doc.serviceName}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <span className="uppercase text-xs px-2 py-1 rounded"
                    style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
                    {doc.format}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {doc.status === "DONE" && doc.fileUrl && (
                    <a href={`/api/documents/${doc.id}/download`}
                      className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                      style={{ background: "var(--gold)", color: "#07070f" }}>
                      Télécharger
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Doc["status"] }) {
  const map = {
    DONE:       { label: "Prêt",       bg: "rgba(34,197,94,0.12)",  color: "#4ade80" },
    PROCESSING: { label: "En cours",   bg: "rgba(234,179,8,0.12)",  color: "#facc15" },
    FAILED:     { label: "Échoué",     bg: "rgba(239,68,68,0.12)",  color: "#f87171" },
  };
  const { label, bg, color } = map[status];
  return (
    <span className="text-xs px-2.5 py-1 rounded-full"
      style={{ background: bg, color }}>
      {label}
    </span>
  );
}

function EmptyDocs() {
  return (
    <div className="rounded-2xl p-10 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <p className="text-3xl mb-3">📄</p>
      <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>Aucun document encore</p>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Commandez votre premier document dès maintenant.
      </p>
      <Link href="/services"
        className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ background: "var(--gold)", color: "#07070f" }}>
        Parcourir les services
      </Link>
    </div>
  );
}
