// RUTA: src/app/admin/blog/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = { id: string; title: string; slug: string; category: string; is_published: boolean; published_at: string | null; };
type FormData = { title: string; slug: string; excerpt: string; content: string; cover_image_url: string; category: string; is_published: boolean; published_at: string; };

const emptyForm: FormData = { title: "", slug: "", excerpt: "", content: "", cover_image_url: "", category: "blog", is_published: false, published_at: "" };

function toSlug(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("posts").select("id,title,slug,category,is_published,published_at").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function handleTitleChange(title: string) {
    setForm({ ...form, title, slug: editing ? form.slug : toSlug(title) });
  }

  async function handleSave() {
    if (!form.title || !form.slug) return;
    setSaving(true);
    const data = { ...form, published_at: form.published_at || null };
    if (editing) { await supabase.from("posts").update(data).eq("id", editing); }
    else { await supabase.from("posts").insert(data); }
    setForm(emptyForm); setEditing(null); setShowForm(false); setSaving(false); load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    load();
  }

  function handleEdit(p: Post) {
    setForm({ title: p.title, slug: p.slug, excerpt: "", content: "", cover_image_url: "", category: p.category, is_published: p.is_published, published_at: p.published_at?.slice(0, 16) ?? "" });
    setEditing(p.id); setShowForm(true);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-extrabold text-gray-900 mb-1">Blog</h1><p className="text-sm text-gray-500">{posts.length} artículos</p></div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">+ Nueva nota</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-lg mb-5">{editing ? "Editar nota" : "Nueva nota"}</h2>
          <div className="flex flex-col gap-4">
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Título *</label>
              <input value={form.title} onChange={e => handleTitleChange(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="Título del artículo" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Slug (URL) *</label>
              <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] font-mono" placeholder="url-del-articulo" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Resumen</label>
              <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] resize-none" placeholder="Resumen breve del artículo" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Contenido</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={10} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] resize-none" placeholder="Contenido del artículo..." /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Imagen portada</label>
                <input value={form.cover_image_url} onChange={e => setForm({...form, cover_image_url: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="https://..." /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Categoría</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]">
                  <option value="blog">Blog</option><option value="novedad">Novedad</option><option value="prensa">Prensa</option>
                </select></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Fecha publicación</label>
                <input type="datetime-local" value={form.published_at} onChange={e => setForm({...form, published_at: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" /></div>
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
            <button onClick={handleSave} disabled={saving} className="bg-[#5c29c2] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all disabled:opacity-50">{saving ? "Guardando..." : editing ? "Guardar cambios" : "Publicar nota"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }} className="bg-gray-100 text-gray-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? <div className="flex flex-col gap-3">{Array.from({length:4}).map((_,i)=><div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-gray-100"/>)}</div>
      : posts.length === 0 ? <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No hay artículos todavía.</div>
      : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Título</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 hidden md:table-cell">Categoría</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Acciones</th>
            </tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{p.title}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell capitalize">{p.category}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{p.is_published ? "Publicado" : "Borrador"}</span></td>
                  <td className="px-5 py-3 text-right"><div className="flex gap-2 justify-end">
                    <button onClick={() => handleEdit(p)} className="text-xs font-bold text-[#5c29c2] hover:underline">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs font-bold text-red-500 hover:underline">Eliminar</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}