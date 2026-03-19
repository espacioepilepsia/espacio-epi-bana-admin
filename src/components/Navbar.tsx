/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Información", href: "/informacion" },
  { label: "Programas", href: "/programas" },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Eventos", href: "/eventos" },
  { label: "Organizaciones", href: "/organizaciones" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const links = useMemo(
    () =>
      navLinks.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-sm font-medium text-[var(--ee-text)]/80 transition-colors hover:text-[var(--ee-primary)]"
          onClick={() => setOpen(false)}
        >
          {l.label}
        </Link>
      )),
    []
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-[var(--ee-primary)]"
        >
          Espacio Epilepsia
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{links}</nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/donar"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--ee-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--ee-hover)]"
          >
            Doná
          </Link>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition-colors hover:bg-black/5 md:hidden"
        >
          <span className="sr-only">Menú</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[var(--ee-text)]"
          >
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        className={[
          "md:hidden overflow-hidden border-t border-black/5 bg-white transition-[max-height,opacity] duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4">
          <div className="flex flex-col gap-3">{links}</div>
          <Link
            href="/donar"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--ee-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--ee-hover)]"
          >
            Doná
          </Link>
        </div>
      </div>
    </header>
  );
}

