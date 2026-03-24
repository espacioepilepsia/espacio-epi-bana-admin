// RUTA: src/components/Navbar.tsx
// REEMPLAZÁ el contenido actual completo con este
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menu = [
  {
    label: "Información", href: "/informacion", children: [
      { label: "¿Qué es la epilepsia?", href: "/informacion" },
      { label: "Primeros auxilios", href: "/informacion/primeros-auxilios" },
      { label: "Epilepsia y tus derechos", href: "/informacion/derechos" },
      { label: "Preguntas frecuentes", href: "/informacion/preguntas-frecuentes" },
    ]
  },
  {
    label: "Programas", href: "/programas", children: [
      { label: "Charlas online", href: "/programas/charlas" },
      { label: "Capacitaciones", href: "/programas/capacitaciones" },
      { label: "Congresos", href: "/programas/congresos" },
      { label: "Colaboraciones", href: "/programas/colaboraciones" },
    ]
  },
  { label: "Institucional", href: "/institucional" },
  {
    label: "Comunidad", href: "/comunidad", children: [
      { label: "Blog", href: "/blog" },
      { label: "Tu historia", href: "/tuhistoria" },
      { label: "Sumate", href: "/sumate" },
    ]
  },
  { label: "Tienda", href: "/tienda" },
  { label: "Eventos", href: "/eventos" },
];

function DropdownItem({ item }: { item: typeof menu[0] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!item.children) {
    return (
      <li>
        <Link href={item.href}
          className={`text-[15px] font-semibold px-4 py-2 rounded-lg transition-all block whitespace-nowrap ${isActive ? "text-white bg-white/20" : "text-white/85 hover:text-white hover:bg-white/15"
            }`}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={`text-[15px] font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${isActive ? "text-white bg-white/20" : "text-white/85 hover:text-white hover:bg-white/15"
          }`}>
        {item.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`transition-transform duration-200 mt-0.5 ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
          style={{ animation: "fadeDown 0.15s ease" }}>
          {item.children!.map((child) => (
            <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm transition-colors ${usePathname() === child.href
                  ? "text-[#5c29c2] font-bold bg-[#f5f0ff]"
                  : "text-gray-700 hover:text-[#5c29c2] hover:bg-[#f5f0ff]"
                }`}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
        style={{ background: "#5c29c2", boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.25)" : "none" }}>
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center gap-8">

          {/* LOGO — más grande y pegado al menú */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/images/logo.png"
              alt="Espacio Epilepsia"
              width={200}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* DESKTOP MENU — centrado */}
          <ul className="hidden lg:flex items-center gap-1 list-none flex-1">
            {menu.map((item) => (
              <DropdownItem key={item.href} item={item} />
            ))}
          </ul>

          {/* DONÁ — botón destacado al final */}
          <Link href="/dona"
            className="hidden lg:inline-flex items-center gap-2 font-bold text-[16px] px-6 py-2.5 rounded-full transition-all flex-shrink-0"
            style={{ background: "#29f0b4", color: "#5c29c2" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1dd9a0")}
            onMouseLeave={e => (e.currentTarget.style.background = "#29f0b4")}>
            ❤️ Doná
          </Link>

          {/* HAMBURGER mobile */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden ml-auto w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileOpen
                ? <path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                : <><line x1="3" y1="5" x2="17" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="10" x2="17" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="15" x2="17" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" /></>
              }
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#4a1fa0] border-t border-white/10 px-4 py-4 flex flex-col gap-1">
            {menu.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <>
                    <button onClick={() => setMobileExpanded(mobileExpanded === item.href ? null : item.href)}
                      className="w-full flex items-center justify-between text-[15px] font-semibold text-white/80 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all">
                      {item.label}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                        className={`transition-transform ${mobileExpanded === item.href ? "rotate-180" : ""}`}>
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {mobileExpanded === item.href && (
                      <div className="pl-4 flex flex-col gap-0.5 mt-1">
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}
                            className="text-sm text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all block">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={() => setMobileOpen(false)}
                    className="text-[15px] font-semibold text-white/80 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all block">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link href="/dona" onClick={() => setMobileOpen(false)}
              className="mt-2 text-center font-bold text-[15px] px-6 py-3 rounded-full"
              style={{ background: "#29f0b4", color: "#5c29c2" }}>
              ❤️ Doná
            </Link>
          </div>
        )}
      </nav>
    </>
  );
} 