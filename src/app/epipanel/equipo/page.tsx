// RUTA: src/app/admin/equipo/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminImageUploader from "@/components/AdminImageUploader";

type Member = { id: string; name: string; role: string; bio: string | null; photo_url: string | null; display_order: number; is_active: boolean; };
type FormData = { name: string; role: string; bio: string; photo_url: string; display_order: string; is_active: boolean; };
const emptyForm: FormData = { name: "", role: "", bio: "", photo_url: "", display_order: "0", is_active: true };

export default function AdminEquipoPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("team_members").select("*").order("display_order");
    setMembers(data ?? []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.name || !form.role) return;
    setSaving(true);
    const data = { name: form.name, role: form.role, bio: form.bio || null, photo_url: form.photo_url || null, display_order: parseInt(form.display_order) || 0, is_active: form.is_active };
    if (editing) { await supabase.from("team_members").update(data).eq("id", editing); }
    else { await supabase.from("team_members").insert(data); }
    setForm(emptyForm); setEditing(null); setShowForm(false); setSaving(false); load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este integrante?")) return;
    await supabase.from("team_members").delete().eq("id", id); load();
  }

  function handleEdit(m: Member) {
    setForm({ name: m.name, role: m.role, bio: m.bio ?? "", photo_url: m.photo_url ?? "", display_order: m.display_order.toString(), is_active: m.is_active });
    setEditing(m.id); setShowForm(true);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-extrabold text-gray-900 mb-1">Equipo</h1><p className="text-sm text-gray-500">{members.length} integrantes</p></div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">+ Nuevo integrante</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-lg mb-5">{editing ? "Editar integrante" : "Nuevo integrante"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Rol *</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="Fundadora / Coordinadora / etc." /></div>
            <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] resize-none" /></div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Foto del Integrante</label>
              <AdminImageUploader value={form.photo_url} onChange={(url) => setForm({...form, photo_url: url})} label="Subir Foto (.png)" />
            </div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Orden</label>
              <input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" /></div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Activo/a</label>
              <button type="button" onClick={() => setForm({...form, is_active: !form.is_active})}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-[#5c29c2]" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving} className="bg-[#5c29c2] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all disabled:opacity-50">{saving ? "Guardando..." : "Guardar"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="bg-gray-100 text-gray-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? <div className="flex flex-col gap-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-gray-100"/>)}</div>
      : members.length === 0 ? <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No hay integrantes todavía.</div>
      : (
        <div className="flex flex-col gap-3">
          {members.map(m => (
            <div key={m.id} className={`bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 ${!m.is_active ? "opacity-60" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-[#f5f0ff] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> : <span className="font-bold text-[#5c29c2]">{m.name.charAt(0)}</span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                <p className="text-xs text-[#5c29c2] font-semibold">{m.role}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(m)} className="text-xs font-bold text-[#5c29c2] hover:underline">Editar</button>
                <button onClick={() => handleDelete(m.id)} className="text-xs font-bold text-red-500 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}