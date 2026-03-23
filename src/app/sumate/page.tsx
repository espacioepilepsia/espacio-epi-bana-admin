// RUTA: src/app/sumate/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function SumatePage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("loading");
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name, email: form.email, phone: form.phone || null,
      message: `QUIERO SUMARME: ${form.message}`
    });
    setStatus(error ? "err" : "ok");
    if (!error) setForm({ name: "", email: "", phone: "", message: "" });
  }

  const areas = [
    { icon: "📢", title: "Comunicación", desc: "Redes sociales, contenido, redacción y difusión" },
    { icon: "🎉", title: "Eventos", desc: "Organización de charlas, congresos y actividades" },
    { icon: "🏥", title: "Salud", desc: "Profesionales de neurología, psicología y áreas afines" },
    { icon: "⚖️", title: "Legal", desc: "Asesoramiento jurídico y derechos de pacientes" },
    { icon: "🎨", title: "Diseño", desc: "Diseño gráfico, UI/UX y producción audiovisual" },
    { icon: "💰", title: "Finanzas", desc: "Gestión financiera, fundraising y administración" },
  ];

  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Voluntariado</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Sumate al equipo</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Formá parte del cambio. Somos personas con epilepsia, familiares y profesionales comprometidos con eliminar el estigma.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-8 text-center">Áreas donde podés colaborar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {areas.map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-6 hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-6 text-center">Completá el formulario</h2>
            {status === "ok" ? (
              <div className="text-center py-12 bg-[#f5f0ff] rounded-2xl">
                <div className="text-5xl mb-4">🙌</div>
                <h3 className="font-bold text-xl mb-2">¡Gracias por querer sumarte!</h3>
                <p className="text-gray-500 text-sm">Te contactamos a la brevedad para coordinar cómo podés participar.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nombre y apellido *</label>
                    <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="Tu nombre completo" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="tu@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Teléfono <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                    placeholder="+54 9 11 1234-5678" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">¿En qué área querés colaborar y qué experiencia tenés?</label>
                  <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors resize-none"
                    placeholder="Contanos un poco sobre vos y cómo querés participar..." />
                </div>
                {status === "err" && <p className="text-red-500 text-sm">Ocurrió un error. Intentá de nuevo.</p>}
                <button type="submit" disabled={status === "loading"}
                  className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50">
                  {status === "loading" ? "Enviando..." : "Quiero sumarme 🙌"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
