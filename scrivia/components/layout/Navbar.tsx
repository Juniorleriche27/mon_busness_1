"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/tarifs",   label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact",  label: "Contact" },
];

export default function Navbar() {
  const pathname          = usePathname();
  const { data: session } = useSession();
  const [open, setOpen]   = useState(false);

  return (
    <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      className="sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
          <span className="font-display font-semibold text-lg tracking-wide"
            style={{ color: "var(--gold)" }}>
            Scrivia
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className="text-sm transition-colors hover:text-[var(--gold)]"
              style={{ color: pathname === href ? "var(--gold)" : "var(--text-muted)" }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard"
                className="text-sm px-4 py-2 rounded-lg border transition-colors hover:border-[var(--gold)]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "var(--gold)", color: "#07070f" }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth"
                className="text-sm px-4 py-2 rounded-lg border transition-colors hover:border-[var(--gold)]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                Connexion
              </Link>
              <Link href="/auth?tab=register"
                className="text-sm px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
                style={{ background: "var(--gold)", color: "#07070f" }}>
                Commencer
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2 rounded-lg" onClick={() => setOpen(!open)}
          style={{ color: "var(--text-muted)" }} aria-label="Menu">
          {open ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l8 8M6 14L14 6" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block py-2 text-sm transition-colors"
              style={{ color: pathname === href ? "var(--gold)" : "var(--text-muted)" }}>
              {label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}
                  className="text-center py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="py-2 rounded-lg text-sm font-medium"
                  style={{ background: "var(--gold)", color: "#07070f" }}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" onClick={() => setOpen(false)}
                  className="text-center py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  Connexion
                </Link>
                <Link href="/auth?tab=register" onClick={() => setOpen(false)}
                  className="text-center py-2 rounded-lg text-sm font-medium"
                  style={{ background: "var(--gold)", color: "#07070f" }}>
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
