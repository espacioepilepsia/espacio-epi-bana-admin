// RUTA: src/app/sumate/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function SumatePage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", experience: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => { setLoadTime(Date.now()); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    // Antigravity Bot Protection
    const timeElapsed = Date.now() - loadTime;
    if (form.honeypot || timeElapsed < 3000) {
      console.warn("Bot detected or submission too fast");
      setStatus("ok"); // Pretend success
      return;
    }

    setStatus("loading");
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name, 
      email: form.email, 
      phone: form.phone || null,
      location: form.location,
      experience: form.experience,
      message: `QUIERO SUMARME: ${form.message}`
    });
    setStatus(error ? "err" : "ok");
    if (!error) setForm({ name: "", email: "", phone: "", location: "", experience: "", message: "", honeypot: "" });
  }

  const areas = [
    { icon: "📢", title: "Comunicación", desc: "Redes sociales, contenido, redacción y difusión" },
    { icon: "🎉", title: "Eventos", desc: "Organización de charlas, congresos y actividades" },
    { icon: "🏥", title: "Salud", desc: "Profesionales de neurología, psicología y áreas afines" },
    { icon: "⚖️", title: "Legal", desc: "Asesoramiento jurídico y derechos de pacientes" },
    { icon: "🎨", title: "Diseño", desc: "Diseño gráfico, UI/UX y producción audiovisual" },
    { icon: "💰", title: "Finanzas", desc: "Gestión financiera, fundraising y administración" },
    { icon: "🛠️", title: "Tecnología", desc: "Desarrollo web, sistemas y soporte técnico" },
  ];

  return (
    <main>
      <Navbar />
      <div className="bg-[#5c29c2] pt-[72px]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link href="/" className="text-white/80 text-sm hover:text-white transition-colors inline-flex items-center gap-1 font-medium">← Volver al Inicio</Link>
        </div>
      </div>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-3">Voluntariado</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Sumate al equipo</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">Formá parte del cambio. Somos personas con epilepsia, familiares y profesionales comprometidos con eliminar el estigma.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-8 text-center text-gray-900">Áreas donde podés colaborar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {areas.map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#fcfaff] border border-[#5c29c2]/10 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all group">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold mb-1 group-hover:text-[#5c29c2] transition-colors">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 md:p-10">
              <h2 className="text-2xl font-extrabold mb-8 text-gray-900 text-center">Completá el formulario</h2>
              
              {status === "ok" ? (
                <div className="text-center py-12 bg-[#f5f0ff] rounded-2xl border border-[#5c29c2]/10">
                  <div className="text-5xl mb-4">🙌</div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">¡Gracias por querer sumarte!</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Te contactaremos a la brevedad para coordinar cómo podés participar.</p>
                  <button onClick={() => setStatus("idle")} className="text-[#5c29c2] font-bold hover:underline">Volver a completar</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Ciudad o país *</label>
                      <input required value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                        placeholder="¿Desde dónde nos escribís?" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Teléfono <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                        placeholder="+54 9 11 ..." />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Experiencia o aptitudes</label>
                    <textarea value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})} rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors resize-none"
                      placeholder="Contanos qué sabés hacer o en qué área tenés experiencia..." />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">¿Por qué querés formar parte del espacio?</label>
                    <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors resize-none"
                      placeholder="Contanos tu motivación para sumarte..." />
                  </div>

                  {status === "err" && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-2">
                       <span>⚠️</span> Ocurrió un error. Intentá de nuevo.
                    </div>
                  )}

                  {/* Bot protection */}
                  <div className="hidden" aria-hidden="true">
                    <input type="text" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} tabIndex={-1} autoComplete="off" />
                  </div>

                  <button type="submit" disabled={status === "loading"}
                    className="w-full bg-[#5c29c2] text-white font-extrabold py-4 rounded-2xl hover:bg-[#7c3aed] transition-all disabled:opacity-50 shadow-lg shadow-[#5c29c2]/10">
                    {status === "loading" ? "Enviando..." : "Quiero sumarme 🙌"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

