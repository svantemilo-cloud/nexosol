"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Sun, X } from "lucide-react";

const navLinks = [
  { href: "/#products", label: "Lösningar" },
  { href: "/#om-oss", label: "Om oss" },
  { href: "/artiklar", label: "Kunskapsbank" },
  { href: "/#calculator", label: "Kalkylator" },
] as const;

export function StickyCta() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-forest/10 shadow-soft safe-area-top">
        {/* Mobil: logga + primär CTA + meny */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 flex md:hidden items-center h-14 gap-2">
          <Link
            href="/"
            className="font-bold text-forest text-base sm:text-lg flex flex-1 min-w-0 items-center gap-2 py-2 rounded-xl hover:bg-forest/5 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Sun className="w-6 h-6 text-forest shrink-0" aria-hidden />
            <span className="truncate">Nexosol</span>
          </Link>
          <Link
            href="/#calculator"
            className="shrink-0 rounded-xl bg-forest text-white text-sm font-semibold px-3.5 py-2.5 inline-flex items-center justify-center shadow-soft"
            onClick={() => setMenuOpen(false)}
          >
            Offert
          </Link>
          <button
            type="button"
            className="shrink-0 w-11 h-11 inline-flex items-center justify-center rounded-xl border border-forest/15 bg-white text-forest hover:bg-forest/5 transition-colors"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex w-full max-w-7xl mx-auto pl-6 pr-6 items-center h-16 gap-8">
          <Link
            href="/"
            className="font-bold text-forest text-2xl flex items-center gap-2 shrink-0 hover:text-forest-light transition-colors cursor-pointer mr-8"
          >
            <Sun className="w-8 h-8 text-forest" />
            Nexosol
          </Link>
          <nav className="flex-1 flex items-center justify-between min-w-0 gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-forest hover:text-coral transition-colors py-2.5 px-3 -mx-3 rounded-xl hover:bg-forest/5 cursor-pointer text-base"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#calculator"
              className="rounded-2xl bg-forest text-white font-semibold px-5 py-2.5 shadow-soft hover:shadow-soft-lg transition-shadow hover:bg-forest-light cursor-pointer"
            >
              Få gratis offert
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobil fullskärmsmeny */}
      {menuOpen ? (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-[60] md:hidden flex flex-col bg-surface pt-[env(safe-area-inset-top,0px)]"
          role="dialog"
          aria-modal="true"
          aria-label="Navigering"
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-forest/10 shrink-0">
            <span className="text-sm font-semibold uppercase tracking-wide text-forest/60">
              Meny
            </span>
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-forest hover:bg-forest/10"
              aria-label="Stäng meny"
              onClick={() => setMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-forest font-medium text-lg py-4 px-4 rounded-2xl hover:bg-forest/[0.06] active:bg-forest/10 transition-colors border border-transparent hover:border-forest/10"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="shrink-0 p-4 border-t border-forest/10 bg-forest/[0.03] pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            <Link
              href="/#calculator"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest text-white font-semibold text-base py-4 min-h-[52px] shadow-soft active:scale-[0.99] transition-transform"
              onClick={() => setMenuOpen(false)}
            >
              Få gratis offert
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
