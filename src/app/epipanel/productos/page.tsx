// RUTA: src/app/admin/productos/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminImageUploader from "@/components/AdminImageUploader";

type Product = { id: string; name: string; price: number; category: string; is_active: boolean; display_order: number; };
type FormData = { name: string; description: string; price: string; image_url: string; mercadopago_url: string; category: string; is_active: boolean; display_order: string; };
const emptyForm: FormData = { name: "", description: "", price: "", image_url: "", mercadopago_url: "", category: "general", is_active: true, display_order: "0" };

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("products").select("id,name,price,category,is_active,display_order").order("display_order");
    setProducts(data ?? []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.name || !form.price) return;
    setSaving(true);
    const data = { name: form.name, description: form.description || null, price: parseFloat(form.price), image_url: form.image_url || null, mercadopago_url: form.mercadopago_url || null, category: form.category, is_active: form.is_active, display_order: parseInt(form.display_order) || 0 };
    if (editing) { await supabase.from("products").update(data).eq("id", editing); }
    else { await supabase.from("products").insert(data); }
    setForm(emptyForm); setEditing(null); setShowForm(false); setSaving(false); load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("products").delete().eq("id", id); load();
  }

  function handleEdit(p: Product) {
    setForm({ name: p.name, description: "", price: p.price.toString(), image_url: "", mercadopago_url: "", category: p.category, is_active: p.is_active, display_order: p.display_order.toString() });
    setEditing(p.id); setShowForm(true);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-extrabold text-gray-900 mb-1">Tienda</h1><p className="text-sm text-gray-500">{products.length} productos</p></div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">+ Nuevo producto</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-lg mb-5">{editing ? "Editar producto" : "Nuevo producto"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="Nombre del producto" /></div>
            <div className="md:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] resize-none" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Precio (ARS) *</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="25000" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Categoría</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]">
                <option value="remera">Remera</option><option value="taza">Taza</option><option value="general">General</option>
              </select></div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Imagen del Producto</label>
              <AdminImageUploader value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} label="Subir Imagen de Producto (.png)" />
            </div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Link Mercado Pago</label>
              <input value={form.mercadopago_url} onChange={e => setForm({...form, mercadopago_url: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" placeholder="https://mpago.la/..." /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Orden de aparición</label>
              <input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2]" /></div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Activo</label>
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

      {loading ? <div className="flex flex-col gap-3">{Array.from({length:4}).map((_,i)=><div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-gray-100"/>)}</div>
      : products.length === 0 ? <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No hay productos todavía.</div>
      : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Producto</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 hidden md:table-cell">Precio</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 hidden md:table-cell">Categoría</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Acciones</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{p.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 hidden md:table-cell font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell capitalize">{p.category}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{p.is_active ? "Activo" : "Inactivo"}</span></td>
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