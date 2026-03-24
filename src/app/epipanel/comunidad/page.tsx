// RUTA: src/app/admin/comunidad/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Testimonial = { 
  id: string; 
  name: string; 
  role: string; 
  content: string; 
  avatar_emoji: string; 
  is_published: boolean; 
  display_order: number; 
};

type FormData = { 
  name: string; 
  role: string; 
  content: string; 
  avatar_emoji: string; 
  is_published: boolean; 
  display_order: string; 
};

const emptyForm: FormData = { 
  name: "", 
  role: "", 
  content: "", 
  avatar_emoji: "💜", 
  is_published: true, 
  display_order: "0" 
};

export default function AdminComunidadPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("display_order").order("created_at", { ascending: false });
    setTestimonials(data ?? []); setLoading(false);
  }
  
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.name || !form.role || !form.content) return;
    setSaving(true);
    const data = { 
      name: form.name, 
      role: form.role, 
      content: form.content, 
      avatar_emoji: form.avatar_emoji || "💜", 
      is_published: form.is_published, 
      display_order: parseInt(form.display_order) || 0 
    };

    if (editing) { 
      await supabase.from("testimonials").update(data).eq("id", editing); 
    } else { 
      await supabase.from("testimonials").insert(data); 
    }
    
    setForm(emptyForm); 
    setEditing(null); 
    setShowForm(false); 
    setSaving(false); 
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await supabase.from("testimonials").delete().eq("id", id); 
    load();
  }

  function handleEdit(t: Testimonial) {
    setForm({ 
      name: t.name, 
      role: t.role, 
      content: t.content, 
      avatar_emoji: t.avatar_emoji ?? "💜", 
      is_published: t.is_published, 
      display_order: (t.display_order || 0).toString() 
    });
    setEditing(t.id); 
    setShowForm(true);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Comunidad</h1>
          <p className="text-sm text-gray-500">{testimonials.length} voces (testimonios)</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">
          + Nuevo Testimonio
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-lg mb-5">{editing ? "Editar testimonio" : "Nuevo testimonio"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="Ej: Valentina R." />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Rol / Relación *</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="Ej: Persona con epilepsia" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Testimonio (Contenido) *</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] resize-none" placeholder="Escribí el testimonio acá..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Emoji del Avatar</label>
              <input value={form.avatar_emoji} onChange={e => setForm({...form, avatar_emoji: e.target.value})} maxLength={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="💜" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Orden de aparición</label>
              <input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" />
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Publicado y Visible</label>
              <button type="button" onClick={() => setForm({...form, is_published: !form.is_published})}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.is_published ? "bg-[#5c29c2]" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_published ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving} className="bg-[#5c29c2] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="bg-gray-100 text-gray-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({length:4}).map((_,i)=><div key={i} className="h-28 bg-white rounded-xl animate-pulse border border-gray-100"/>)}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No hay testimonios todavía.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testimonials.map(t => (
            <div key={t.id} className={`bg-white border rounded-xl p-5 flex flex-col gap-3 ${t.is_published ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f5f0ff] flex items-center justify-center text-lg">{t.avatar_emoji || "💜"}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                    <p className="text-xs text-[#5c29c2] font-semibold truncate">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(t)} className="text-xs font-bold text-[#5c29c2] bg-[#f5f0ff] hover:bg-[#eae0ff] px-3 py-1.5 rounded-md transition-colors">Editar</button>
                  <button onClick={() => handleDelete(t.id)} className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors">Borrar</button>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">"{t.content}"</p>
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${t.is_published ? "text-green-600" : "text-gray-400"}`}>
                  {t.is_published ? "🌐 Público" : "🔒 Oculto"}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Orden: {t.display_order}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
