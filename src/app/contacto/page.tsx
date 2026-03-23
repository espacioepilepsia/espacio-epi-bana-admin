"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("loading");
    const { error } = await supabase.from("contact_messages").insert({ name: form.name, email: form.email, phone: form.phone || null, message: form.message || null });
    setStatus(error ? "err" : "ok");
    if (!error) setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <main>
<Navbar />
       
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Escribinos</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Contacto</h1>
          <p className="text-lg text-white/70 max-w-xl leading-relaxed">¿Tenés una consulta, querés colaborar o simplemente decir hola? Estamos acá.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* FORMULARIO */}
          <div>
            <h2 className="text-2xl font-extrabold mb-6">Envianos un mensaje</h2>
            {status === "ok" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-lg mb-2 text-green-800">¡Mensaje enviado!</h3>
                <p className="text-sm text-green-700">Te respondemos a la brevedad. ¡Gracias por escribirnos!</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-[#5c29c2] font-bold hover:underline">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nombre y apellido *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                    placeholder="Tu nombre completo" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                    placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Teléfono <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                    placeholder="+54 9 11 1234-5678" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Consulta <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors resize-none"
                    placeholder="Contanos en qué podemos ayudarte..." />
                </div>
                {status === "err" && <p className="text-red-500 text-sm">Ocurrió un error. Intentá de nuevo.</p>}
                <button type="submit" disabled={status === "loading"}
                  className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === "loading" ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>

          {/* INFO */}
          <div>
            <h2 className="text-2xl font-extrabold mb-6">Información de contacto</h2>
            <div className="flex flex-col gap-4 mb-8">
              <a href="mailto:contacto@espacioepilepsia.org" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#5c29c2]/30 hover:bg-[#f5f0ff] transition-all">
                <div className="w-10 h-10 bg-[#f5f0ff] rounded-xl flex items-center justify-center text-[#5c29c2] flex-shrink-0">📩</div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-[#5c29c2]">contacto@espacioepilepsia.org</p>
                </div>
              </a>
            </div>
            <h3 className="font-bold mb-4 text-gray-700">Seguinos en redes</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Instagram", href: "https://www.instagram.com/espacioepilepsia/", icon: "📸" },
                { label: "Facebook", href: "https://www.facebook.com/espacioepilepsia/", icon: "👤" },
                { label: "YouTube", href: "https://www.youtube.com/@EspacioEpilepsia", icon: "▶️" },
                { label: "LinkedIn", href: "https://www.linkedin.com/company/espacio-epilepsia", icon: "💼" },
              ].map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#5c29c2]/30 hover:bg-[#f5f0ff] transition-all text-sm font-semibold text-gray-600 hover:text-[#5c29c2]">
                  <span>{icon}</span>{label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}