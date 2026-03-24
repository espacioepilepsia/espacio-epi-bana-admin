// RUTA: src/app/admin/eventos/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminImageUploader from "@/components/AdminImageUploader";

type Event = { id: string; title: string; event_date: string; location: string | null; is_published: boolean; };
type FormData = { title: string; description: string; event_date: string; location: string; image_url: string; registration_url: string; is_published: boolean; };

const emptyForm: FormData = { title: "", description: "", event_date: "", location: "", image_url: "", registration_url: "", is_published: false };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("events").select("id,title,event_date,location,is_published").order("event_date", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.title || !form.event_date) return;
    setSaving(true);
    if (editing) {
      await supabase.from("events").update({ ...form }).eq("id", editing);
    } else {
      await supabase.from("events").insert({ ...form });
    }
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminár este evento?")) return;
    await supabase.from("events").delete().eq("id", id);
    load();
  }

  function handleEdit(ev: Event) {
    setForm({ title: ev.title, description: "", event_date: ev.event_date.slice(0, 16), location: ev.location ?? "", image_url: "", registration_url: "", is_published: ev.is_published });
    setEditing(ev.id);
    setShowForm(true);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Eventos</h1>
          <p className="text-sm text-gray-500">{events.length} eventos en total</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }}
          className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">
          + Nuevo evento
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-lg mb-5">{editing ? "Editar evento" : "Nuevo evento"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Título *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]"
                placeholder="Título del evento" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] resize-none"
                placeholder="Descripción del evento" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Fecha y hora *</label>
              <input type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Lugar</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]"
                placeholder="CABA / Online / etc." />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">URL imagen</label>
              <AdminImageUploader value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} label="Subir Imagen de Evento (.png)" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">URL inscripción</label>
              <input value={form.registration_url} onChange={e => setForm({...form, registration_url: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]"
                placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Publicado</label>
              <button type="button" onClick={() => setForm({...form, is_published: !form.is_published})}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.is_published ? "bg-[#5c29c2]" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_published ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#5c29c2] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all disabled:opacity-50">
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear evento"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}
              className="bg-gray-100 text-gray-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-gray-100" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No hay eventos todavía.</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Título</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 hidden md:table-cell">Fecha</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 hidden md:table-cell">Lugar</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Acciones</th>
            </tr></thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{ev.title}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">{formatDate(ev.event_date)}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">{ev.location ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ev.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {ev.is_published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(ev)} className="text-xs font-bold text-[#5c29c2] hover:underline">Editar</button>
                      <button onClick={() => handleDelete(ev.id)} className="text-xs font-bold text-red-500 hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}