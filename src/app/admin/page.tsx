// RUTA: src/app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Stats = { eventos: number; posts: number; mensajes: number; suscriptores: number; organizaciones: number; historias: number; };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ eventos: 0, posts: 0, mensajes: 0, suscriptores: 0, organizaciones: 0, historias: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("organizations").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("stories").select("id", { count: "exact", head: true }).eq("is_approved", false),
    ]).then(([ev, po, me, su, or, hi]) => {
      setStats({
        eventos: ev.count ?? 0,
        posts: po.count ?? 0,
        mensajes: me.count ?? 0,
        suscriptores: su.count ?? 0,
        organizaciones: or.count ?? 0,
        historias: hi.count ?? 0,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Eventos publicados", value: stats.eventos, icon: "📅", href: "/admin/eventos", color: "#5c29c2" },
    { label: "Posts publicados", value: stats.posts, icon: "✍️", href: "/admin/blog", color: "#7c3aed" },
    { label: "Mensajes sin leer", value: stats.mensajes, icon: "📩", href: "/admin/mensajes", color: stats.mensajes > 0 ? "#dc2626" : "#6b7280" },
    { label: "Suscriptores activos", value: stats.suscriptores, icon: "📧", href: "/admin/mensajes", color: "#059669" },
    { label: "Organizaciones activas", value: stats.organizaciones, icon: "🤝", href: "/admin/organizaciones", color: "#d97706" },
    { label: "Historias pendientes", value: stats.historias, icon: "💬", href: "/admin/historias", color: stats.historias > 0 ? "#dc2626" : "#6b7280" },
  ];

  const accesos = [
    { href: "/admin/eventos", icon: "📅", label: "Nuevo evento" },
    { href: "/admin/blog", icon: "✍️", label: "Nueva nota" },
    { href: "/admin/organizaciones", icon: "🤝", label: "Nueva organización" },
    { href: "/admin/productos", icon: "🛍️", label: "Nuevo producto" },
    { href: "/admin/equipo", icon: "👥", label: "Nuevo integrante" },
    { href: "/admin/mensajes", icon: "📩", label: "Ver mensajes" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen general del sitio</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {cards.map(({ label, value, icon, href, color }) => (
            <Link key={label} href={href}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#5c29c2]/30 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-3xl font-extrabold" style={{ color }}>{value}</span>
              </div>
              <p className="text-xs font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">{label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-700 mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {accesos.map(({ href, icon, label }) => (
            <Link key={href} href={href}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-[#5c29c2]/30 hover:bg-[#f5f0ff] transition-all text-sm font-semibold text-gray-700 hover:text-[#5c29c2]">
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}