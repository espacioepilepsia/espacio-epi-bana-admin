// RUTA: src/app/admin/historias/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Story = { id: string; name: string; story: string; is_approved: boolean; created_at: string; };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminHistoriasPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("stories").select("*").order("created_at", { ascending: false });
    setStories(data ?? []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleApprove(id: string) {
    await supabase.from("stories").update({ is_approved: true }).eq("id", id);
    setStories(prev => prev.map(s => s.id === id ? { ...s, is_approved: true } : s));
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta historia?")) return;
    await supabase.from("stories").delete().eq("id", id);
    setStories(prev => prev.filter(s => s.id !== id));
    if (expanded === id) setExpanded(null);
  }

  const filtered = filter === "pending" ? stories.filter(s => !s.is_approved) : filter === "approved" ? stories.filter(s => s.is_approved) : stories;
  const pendingCount = stories.filter(s => !s.is_approved).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Historias de la comunidad</h1>
          <p className="text-sm text-gray-500">{pendingCount} pendientes de aprobación · {stories.length} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter("pending")} className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${filter === "pending" ? "bg-[#5c29c2] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Pendientes ({pendingCount})</button>
          <button onClick={() => setFilter("approved")} className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${filter === "approved" ? "bg-[#5c29c2] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Aprobadas</button>
          <button onClick={() => setFilter("all")} className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${filter === "all" ? "bg-[#5c29c2] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Todas</button>
        </div>
      </div>

      {loading ? <div className="flex flex-col gap-3">{Array.from({length:4}).map((_,i)=><div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100"/>)}</div>
      : filtered.length === 0 ? <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">{filter === "pending" ? "No hay historias pendientes 🎉" : "No hay historias en esta categoría."}</div>
      : (
        <div className="flex flex-col gap-3">
          {filtered.map(s => (
            <div key={s.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${s.is_approved ? "border-gray-100" : "border-[#5c29c2]/20 bg-[#f5f0ff]"}`}>
              <div className="flex items-start justify-between gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-sm text-gray-900">{s.name}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${s.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {s.is_approved ? "Aprobada" : "Pendiente"}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(s.created_at)}</span>
                  </div>
                  <p className={`text-sm text-gray-600 leading-relaxed ${expanded === s.id ? "" : "line-clamp-3"}`}>{s.story}</p>
                  {s.story.length > 200 && (
                    <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="text-xs font-bold text-[#5c29c2] mt-1 hover:underline">
                      {expanded === s.id ? "Ver menos" : "Ver completa"}
                    </button>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!s.is_approved && (
                    <button onClick={() => handleApprove(s.id)} className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all">✓ Aprobar</button>
                  )}
                  <button onClick={() => handleDelete(s.id)} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}