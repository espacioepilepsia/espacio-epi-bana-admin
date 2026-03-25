// RUTA: src/app/epipanel/blog/page.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminImageUploader from "@/components/AdminImageUploader";
import Link from "next/link";

type Post = { 
  id: string; 
  title: string; 
  slug: string; 
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string; 
  is_published: boolean; 
  published_at: string | null; 
};

const emptyForm = { title: "", slug: "", excerpt: "", content: "", cover_image_url: "", category: "blog", is_published: false, published_at: "" };

function toSlug(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

/* SMART TRANSFORMER: Converts WhatsApp-style / Plain text into SEO-optimized HTML */
function smartFormatToHTML(text: string) {
  if (!text) return "";
  
  // 1. Double break to Paragraphs
  let html = text.trim()
    .replace(/\n\n+/g, "</p><p>") 
    .replace(/\n/g, "<br />");
  
  html = `<p>${html}</p>`;
  
  // 2. Simple List detection (Hyphen or Asterisk at start of line inside paragraphs)
  // This is a simplified regex, but good enough for common use
  html = html.replace(/<br \/>- (.*?)(?=<br \/>|<\/p>)/g, "<ul><li>$1</li></ul>");
  html = html.replace(/<p>- (.*?)(?=<br \/>|<\/p>)/g, "<p><ul><li>$1</li></ul>");
  
  // Cleanup adjacent ULs
  html = html.replace(/<\/ul><ul>/g, "");

  // 3. Simple Bold / Italic (Markdown style if user wrote it)
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // 4. Links detection [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-[#5c29c2] font-bold underline">$1</a>');

  return html;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  async function load() {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function handleTitleChange(title: string) {
    setForm({ ...form, title, slug: editing ? form.slug : toSlug(title) });
  }

  function generateSummary() {
    if (!form.content) return;
    // Clean markdown/html markers for the summary
    const cleanText = form.content
      .replace(/[*#\[\]()]/g, "") // remove common md
      .replace(/\n+/g, " ")
      .trim();
    const summary = cleanText.substring(0, 155) + (cleanText.length > 155 ? "..." : "");
    setForm({ ...form, excerpt: summary });
    setError(null);
  }

  function insertFormat(startTag: string, endTag: string) {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    const newText = before + startTag + selection + endTag + after;
    setForm({ ...form, content: newText });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 10);
  }

  async function handleSave() {
    if (!form.title || !form.slug) {
       setError("El título y la URL son obligatorios.");
       return;
    }
    
    if (!form.excerpt || form.excerpt.trim().length === 0) {
       setError("¡Falta el Resumen Google! Es obligatorio para que la nota posicione bien.");
       return;
    }

    setSaving(true);
    setError(null);
    
    // TRADUCCIÓN INTELIGENTE: Transformamos el texto plano/markdown a HTML antes de guardar
    const htmlContent = smartFormatToHTML(form.content);
    
    const data = { 
      ...form, 
      content: htmlContent, // Guardamos la versión optimizada
      published_at: form.published_at || null 
    };

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
    setForm({ 
      title: p.title, 
      slug: p.slug, 
      excerpt: p.excerpt || "", 
      content: p.content || "", // Note: This will show the HTML if it was saved as HTML. 
      cover_image_url: p.cover_image_url || "", 
      category: p.category, 
      is_published: p.is_published, 
      published_at: p.published_at?.slice(0, 16) ?? "" 
    });
    setEditing(p.id); setShowForm(true); setError(null);
  }

  // SEO COLOR LOGIC
  const titleColor = form.title.length < 30 ? "bg-amber-100 text-amber-700" : form.title.length > 70 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
  const excerptColor = form.excerpt.length < 50 ? "bg-amber-100 text-amber-700" : form.excerpt.length > 160 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Central de Blog</h1>
           <p className="text-sm text-gray-500">Recursos y novedades para la comunidad</p>
        </div>
        <div className="flex gap-3">
          <Link href="/epipanel/blog/comentarios" className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-amber-100 transition-all">💬 Comentarios</Link>
          <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); setError(null); }} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#5c29c2]/20 transition-all">+ Escribir Artículo</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h2 className="font-extrabold text-xl text-[#5c29c2]">{editing ? "✏️ Editando nota" : "✍️ Nueva nota"}</h2>
             <div className="flex gap-2">
                <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${titleColor}`}>Título SEO</span>
                <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${excerptColor}`}>Resumen SEO</span>
             </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-5 lg:col-span-2">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Título del Artículo</label>
                <input value={form.title} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-gray-50 border-0 border-b-2 border-transparent focus:border-[#5c29c2] focus:bg-white rounded-t-xl px-5 py-3.5 text-lg font-bold outline-none transition-all" placeholder="Ej: Avances en tratamientos de epilepsia 2024" />
                <p className="text-[10px] mt-1 text-gray-400 font-medium">Largo recomendado: 50-70 caracteres. Actual: {form.title.length}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Resumen Google (Metadescripción) *</label>
                   <button type="button" onClick={generateSummary} className="text-[10px] bg-[#f5f0ff] text-[#5c29c2] font-black px-3 py-1.5 rounded-lg hover:bg-[#5c29c2] hover:text-white transition-all">✨ Auto-generar resumen</button>
                </div>
                <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full bg-gray-50 border-0 border-b-2 border-transparent focus:border-[#5c29c2] focus:bg-white rounded-t-xl px-5 py-3.5 text-sm outline-none transition-all resize-none" placeholder="Breve texto que aparece en Google..." />
                <p className="text-[10px] mt-1 text-gray-400 font-medium">Largo recomendado: 120-160 caracteres. Actual: {form.excerpt.length}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Contenido de la nota</label>
                 <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button type="button" onClick={() => insertFormat('**', '**')} title="Negrita" className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-white hover:text-[#5c29c2] rounded-md transition-all">B</button>
                    <button type="button" onClick={() => insertFormat('*', '*')} title="Cursiva" className="w-8 h-8 flex items-center justify-center italic text-gray-600 hover:bg-white hover:text-[#5c29c2] rounded-md transition-all">I</button>
                    <button type="button" onClick={() => insertFormat('## ', '')} title="Título Secundario" className="w-8 h-8 flex items-center justify-center font-bold text-xs text-gray-600 hover:bg-white hover:text-[#5c29c2] rounded-md transition-all">H2</button>
                    <button type="button" onClick={() => insertFormat('\n- ', '')} title="Lista" className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-[#5c29c2] rounded-md transition-all">list</button>
                    <button type="button" onClick={() => insertFormat('[', '](url)')} title="Link" className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-[#5c29c2] rounded-md transition-all">link</button>
                 </div>
              </div>
              <textarea 
                ref={contentRef}
                value={form.content} 
                onChange={e => setForm({...form, content: e.target.value})} 
                rows={12} 
                className="w-full bg-gray-50 border-0 border-b-2 border-transparent focus:border-[#5c29c2] focus:bg-white rounded-t-xl px-5 py-3.5 text-base outline-none transition-all font-serif" 
                placeholder="Escribí de forma natural. Usá enter para párrafos. Usá emojis normalmente 💜..." 
              />
              <p className="text-[10px] mt-2 text-[#5c29c2] font-bold">✨ El sistema optimizará el formato y el SEO automáticamente al guardar.</p>
            </div>

            <div className="lg:col-span-2 p-5 bg-[#f5f0ff] rounded-2xl">
              <label className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-3 block">Imagen de Portada</label>
              <AdminImageUploader value={form.cover_image_url} onChange={(url) => setForm({...form, cover_image_url: url})} label="Seleccionar foto de cabecera" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Categoría</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-50 border-0 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#5c29c2]">
                <option value="blog">Blog Educativo</option>
                <option value="novedad">Novedad / Aviso</option>
                <option value="prensa">Prensa / Medios</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Fecha Programada</label>
              <input type="datetime-local" value={form.published_at} onChange={e => setForm({...form, published_at: e.target.value})} className="w-full bg-gray-50 border-0 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#5c29c2]" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl lg:col-span-2">
              <div>
                 <p className="text-sm font-bold text-gray-900">Estado de la nota</p>
                 <p className="text-xs text-gray-500">{form.is_published ? "Visible en la web" : "Guardado como borrador interno"}</p>
              </div>
              <button type="button" onClick={() => setForm({...form, is_published: !form.is_published})}
                className={`w-14 h-8 rounded-full transition-all relative ${form.is_published ? "bg-green-500 shadow-inner" : "bg-gray-300"}`}>
                <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${form.is_published ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-6 rounded-r-xl text-sm font-bold animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-4 mt-10">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#5c29c2] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#5c29c2]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">{saving ? "Optimizando y Guardando..." : editing ? "Guardar cambios finales" : "Publicar nota en el Blog"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); setError(null); }} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? <div className="grid gap-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100"/>)}</div>
      : posts.length === 0 ? <div className="text-center py-24 text-gray-300 bg-white rounded-3xl border-2 border-dashed border-gray-100 font-bold text-xl">¿Qué vamos a publicar hoy? ✍️</div>
      : (
        <div className="grid gap-4">
          {posts.map(p => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all border-l-4 border-l-[#5c29c2]">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                     {p.cover_image_url ? <img src={p.cover_image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">Sin foto</div>}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 group-hover:text-[#5c29c2] transition-colors">{p.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{p.category}</span>
                       <span className="w-1 h-1 bg-gray-200 rounded-full" />
                       <span className={`text-[10px] font-black uppercase tracking-wider ${p.is_published ? "text-green-500" : "text-amber-500"}`}>{p.is_published ? "En línea" : "Borrador"}</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <Link href={`/epipanel/blog/comentarios?post_id=${p.id}`} className="p-3 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all font-bold text-sm">💬 Ver comentarios</Link>
                  <button onClick={() => handleEdit(p)} className="p-3 bg-gray-50 text-gray-400 hover:text-[#5c29c2] hover:bg-[#f5f0ff] rounded-xl transition-all font-bold text-sm">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="p-3 text-red-300 hover:text-red-500 rounded-xl transition-all">
                     <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}