// RUTA: src/app/admin/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/epipanel", label: "Dashboard", icon: "📊", exact: true },
  { href: "/epipanel/eventos", label: "Eventos", icon: "📅" },
  { href: "/epipanel/blog", label: "Blog", icon: "✍️" },
  { href: "/epipanel/organizaciones", label: "Organizaciones", icon: "🤝" },
  { href: "/epipanel/productos", label: "Tienda", icon: "🛍️" },
  { href: "/epipanel/equipo", label: "Equipo", icon: "👥" },
  { href: "/epipanel/mensajes", label: "Mensajes", icon: "📩" },
  { href: "/epipanel/historias", label: "Historias", icon: "💬" },
  { href: "/epipanel/comunidad", label: "Comunidad", icon: "🗣️" },
  { href: "/epipanel/configuracion", label: "Configuración", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== "/epipanel/login") {
        router.push("/epipanel/login");
      } else {
        setUser(session?.user?.email ?? null);
        setChecking(false);
      }
    });
  }, [pathname, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/epipanel/login");
  }

  if (pathname === "/epipanel/login") return <>{children}</>;
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-2 border-[#5c29c2] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-[#5c29c2] p-2 shadow-inner">
              <Image src="/images/icon-heart.png" alt="Espacio Epilepsia" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Espacio Epilepsia</span>
          </div>
          <p className="text-xs text-gray-400 ml-12">Panel de administración</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ href, label, icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href) && pathname !== "/epipanel";
            const active = exact ? pathname === href : isActive;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active ? "bg-[#5c29c2] text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 truncate">{user}</p>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
            <span>🚪</span> Cerrar sesión
          </button>
          <Link href="/" className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-50 transition-all">
            <span>🌐</span> Ver sitio
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-gray-900 text-sm">Panel admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {sidebarOpen
              ? <path d="M2 2l12 12M14 2L2 14" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
              : <><line x1="2" y1="4" x2="14" y2="4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" /><line x1="2" y1="8" x2="14" y2="8" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" /><line x1="2" y1="12" x2="14" y2="12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" /></>
            }
          </svg>
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full bg-white" onClick={e => e.stopPropagation()}>
            <div className="p-4 pt-16 flex flex-col gap-1">
              {navItems.map(({ href, label, icon }) => (
                <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    pathname === href || pathname.startsWith(href + "/") ? "bg-[#5c29c2] text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span>{icon}</span>{label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 mt-2">
                <span>🚪</span> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="flex-1 lg:min-h-screen pt-14 lg:pt-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}