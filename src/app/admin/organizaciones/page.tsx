// RUTA: src/app/admin/organizaciones/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Org = { id: string; name: string; logo_url: string | null; website_url: string | null; description: string | null; is_active: boolean; };
type FormData = { name: string; logo_url: string; website_url: string; description: string; is_active: boolean; };
const emptyForm: FormData = { name: "", logo_url: "", website_url: "", description: "", is_active: true };

export default function AdminOrganizacionesPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("organizations").select("*").order("name");
    setOrgs(data ?? []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.name) return;
    setSaving(true);
    const data = { name: form.name, logo_url: form.logo_url || null, website_url: form.website_url || null, description: form.description || null, is_active: form.is_active };
    if (editing) { await supabase.from("organizations").update(data).eq("id", editing); }
    else { await supabase.from("organizations").insert(data); }
    setForm(emptyForm); setEditing(null); setShowForm(false); setSaving(false); load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta organización?")) return;
    await supabase.from("organizations").delete().eq("id", id); load();
  }

  function handleEdit(o: Org) {
    setForm({ name: o.name, logo_url: o.logo_url ?? "", website_url: o.website_url ?? "", description: o.description ?? "", is_active: o.is_active });
    setEditing(o.id); setShowForm(true);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-extrabold text-gray-900 mb-1">Organizaciones</h1><p className="text-sm text-gray-500">{orgs.length} organizaciones</p></div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">+ Nueva organización</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-lg mb-5">{editing ? "Editar organización" : "Nueva organización"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="Nombre de la organización" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">URL del logo</label>
              <input value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="https://..." /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">URL del sitio web</label>
              <input value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="https://..." /></div>
            <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] resize-none" placeholder="Descripción breve" /></div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Activa</label>
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

      {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({length:8}).map((_,i)=><div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100"/>)}</div>
      : orgs.length === 0 ? <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No hay organizaciones todavía.</div>
      : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orgs.map(o => (
            <div key={o.id} className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${o.is_active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {o.logo_url ? <img src={o.logo_url} alt={o.name} className="w-full h-full object-contain" /> : <span className="text-xs font-bold text-gray-400">{o.name.charAt(0)}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{o.name}</p>
                <span className={`text-xs font-bold ${o.is_active ? "text-green-600" : "text-gray-400"}`}>{o.is_active ? "Activa" : "Inactiva"}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(o)} className="text-xs font-bold text-[#5c29c2] hover:underline">Editar</button>
                <button onClick={() => handleDelete(o.id)} className="text-xs font-bold text-red-500 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}