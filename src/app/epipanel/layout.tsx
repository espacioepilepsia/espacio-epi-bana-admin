// RUTA: src/app/epipanel/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/epipanel", label: "Dashboard", icon: "📊", exact: true, perm: 'always' },
  { href: "/epipanel/eventos", label: "Eventos", icon: "📅", perm: 'can_eventos' },
  { href: "/epipanel/blog", label: "Blog", icon: "✍️", perm: 'can_blog' },
  { href: "/epipanel/organizaciones", label: "Organizaciones", icon: "🤝", perm: 'can_organizaciones' },
  { href: "/epipanel/productos", label: "Tienda", icon: "🛍️", perm: 'can_productos' },
  { href: "/epipanel/equipo", label: "Equipo", icon: "👥", perm: 'can_equipo' },
  { href: "/epipanel/mensajes", label: "Mensajes", icon: "📩", perm: 'can_mensajes' },
  { href: "/epipanel/historias", label: "Historias", icon: "💬", perm: 'can_historias' },
  { href: "/epipanel/comunidad", label: "Comunidad", icon: "🗣️", perm: 'can_comunidad' },
  { href: "/epipanel/descargas", label: "Descargas", icon: "📥", perm: 'can_descargas' },
  { href: "/epipanel/usuarios", label: "Usuarios", icon: "🛡️", perm: 'is_admin' },
  { href: "/epipanel/configuracion", label: "Configuración", icon: "⚙️", perm: 'is_admin' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isPublicRoute = pathname === "/epipanel/login" || pathname === "/epipanel/registro";
      
      if (!session && !isPublicRoute) {
        router.push("/epipanel/login");
        return;
      }
      
      if (session) {
        setUser(session.user.email ?? null);
        supabase.from('epipanel_users').select('*').eq('id', session.user.id).single()
          .then(({ data, error }) => {
             if (data) {
                setPermissions(data);
                if (data.status !== "approved" && !isPublicRoute) {
                   // Permite renderizar para mostrar la pantalla de "Pendiente"
                   setChecking(false);
                } else if (!isPublicRoute && pathname !== "/epipanel") {
                   const matchingItems = navItems.filter((item) => pathname.startsWith(item.href) && item.href !== "/epipanel");
                   const activeItem = matchingItems.sort((a,b) => b.href.length - a.href.length)[0];
                   
                   if (activeItem && activeItem.perm !== "always" && !data.is_admin && !data[activeItem.perm]) {
                      router.push("/epipanel");
                      return; // detiene setChecking para evitar flash del children
                   } else {
                      setChecking(false);
                   }
                } else {
                   setChecking(false);
                }
             } else {
                setChecking(false);
             }
          });
      } else {
        setChecking(false);
      }
    });
  }, [pathname, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/epipanel/login");
  }

  if (pathname === "/epipanel/login" || pathname === "/epipanel/registro") return <>{children}</>;
  
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-2 border-[#5c29c2] border-t-transparent rounded-full" />
    </div>
  );

  // PENDING APPROVAL SCREEN
  if (permissions && permissions.status !== 'approved') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
          <div className="w-16 h-16 bg-[#f5f0ff] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Cuenta en revisión</h1>
          <p className="text-gray-600 mb-8">Tu solicitud de acceso al panel fue registrada y está a la espera de ser aprobada por el administrador general. Recibirás un aviso cuando te habiliten.</p>
          <button onClick={handleLogout} className="bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-all text-sm w-full">Volver al inicio de sesión</button>
        </div>
      </div>
    );
  }

  const visibleNavItems = navItems.filter(item => 
    item.perm === 'always' || permissions?.is_admin || permissions?.[item.perm]
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
          {visibleNavItems.map(({ href, label, icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href) && (href !== "/epipanel");
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? "bg-[#5c29c2] text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-gray-900 truncate">{user}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#5c29c2] font-black">{permissions?.is_admin ? 'Administrador' : 'Editor'}</p>
            </div>
          </div>
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-[#5c29c2] rounded-lg p-1.5"><Image src="/images/icon-heart.png" alt="Logo" width={24} height={24} className="w-full h-full object-contain" /></div>
           <span className="font-bold text-gray-900 text-sm">EpiPanel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full bg-white flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 pt-6 pb-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Sesión iniciada como:</p>
              <p className="text-sm font-bold text-gray-900 truncate">{user}</p>
            </div>
            <div className="flex-1 overflow-auto p-4 flex flex-col gap-1">
              {visibleNavItems.map(({ href, label, icon, exact }) => {
                const isActive = exact ? pathname === href : pathname.startsWith(href) && (href !== "/epipanel");
                return (
                  <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? "bg-[#5c29c2] text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}>
                    <span className="text-lg">{icon}</span>{label}
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold text-white bg-red-500 shadow-md">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="flex-1 lg:min-h-screen pt-14 lg:pt-0 overflow-auto bg-white/50">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}