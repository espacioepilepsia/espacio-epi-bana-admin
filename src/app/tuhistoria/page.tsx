// RUTA: src/app/tuhistoria/page.tsx
// REEMPLAZÁ el contenido actual completo con este
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function TuHistoriaPage() {
  const [form, setForm] = useState({ 
    name: "", 
    age: "", 
    email: "", 
    instagram: "", 
    location: "", 
    relationship: "", 
    story: "",
    terms: false, // Renamed from accepted_terms
    honeypot: "" // Added honeypot
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [loadTime, setLoadTime] = useState(0); // Added loadTime state

  useEffect(() => { 
    setLoadTime(Date.now()); 
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.story || !form.terms || !form.email) { // Changed accepted_terms to terms, kept story validation
      alert("Por favor completá los campos obligatorios y aceptá los términos.");
      return;
    }

    // Antigravity Bot Protection
    const timeElapsed = Date.now() - loadTime;
    if (form.honeypot || timeElapsed < 3000) {
      console.warn("Bot detected or submission too fast");
      setStatus("ok"); // Pretend success for bots
      return;
    }

    setStatus("loading");
    const { error } = await supabase.from("stories").insert({ 
      name: form.name, 
      age: parseInt(form.age) || null, // Added parseInt and null for age
      email: form.email,
      instagram: form.instagram || null, // Added null for instagram
      location: form.location || null, // Added null for location
      relationship: form.relationship,
      story: form.story,
      accepted_terms: form.terms // Changed from form.accepted_terms to form.terms
    });
    setStatus(error ? "err" : "ok");
    if (!error) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "espacioepilepsia.arg@gmail.com",
          subject: "Formulario Web Tu Historia",
          text: `Nueva historia enviada:\nNombre: ${form.name}\nEmail: ${form.email}\nEdad: ${form.age}\nHistoria: ${form.story}`,
        }),
      }).catch(() => {});
      setForm({ 
        name: "", age: "", email: "", instagram: "", location: "", relationship: "", story: "", terms: false, honeypot: "" // Reset honeypot and terms
      });
    }
  }

  return (
    <main>
      <Navbar />
      <div className="bg-[#5c29c2] pt-[72px]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link href="/comunidad" className="text-white/80 text-sm hover:text-white transition-colors inline-flex items-center gap-1 font-medium">← Volver a Comunidad</Link>
        </div>
      </div>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-3">Comunidad</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Tu historia</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">Contamos historias de personas con epilepsia que estudian, trabajan, son madres, padres, tienen días buenos y malos ¡Como todos! Compartí la tuya.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-6 mb-10">
            <p className="text-sm text-gray-600 leading-relaxed text-center">
              <strong>¿Por qué compartir tu historia?</strong> Cada testimonio ayuda a que otras personas se sientan menos solas, reduce el estigma y demuestra que con epilepsia se puede tener una vida plena.
            </p>
          </div>

          {status === "ok" ? (
            <div className="text-center py-12 bg-[#f5f0ff] rounded-3xl border border-[#5c29c2]/10">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">¡Gracias por participar!</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Tu historia ha sido recibida. La revisaremos y pronto estará visible en nuestra comunidad.</p>
              <button onClick={() => setStatus("idle")} className="bg-[#5c29c2] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7c3aed] transition-all">Enviar otra historia</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl font-extrabold mb-8 text-gray-900">Contanos tu experiencia</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nombre (o seudónimo) *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="¿Cómo querés que te llamemos?" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="tu@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Edad</label>
                    <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="Tu edad" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Cuenta de Instagram</label>
                    <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="@usuario (opcional)" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Ciudad o país</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="¿Desde dónde nos escribís?" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Relación con la epilepsia</label>
                    <input value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder="Ej: Persona con epilepsia, familiar..." />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tu historia *</label>
                  <textarea required value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} rows={8}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors resize-none"
                    placeholder="Contanos tu experiencia..." />
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">{form.story.length} caracteres escritos</p>
                </div>

                <div className="bg-[#fcfaff] border border-[#5c29c2]/10 rounded-2xl p-5 mb-8">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                      <input type="checkbox" required checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-[#5c29c2] checked:bg-[#5c29c2]" />
                      <svg className="pointer-events-none absolute h-3.5 w-3.5 stroke-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-xs text-gray-600 leading-relaxed font-medium group-hover:text-gray-900 transition-colors">
                      Al enviar mi historia, acepto que Espacio Epilepsia pueda publicarla de forma anónima o con mi nombre de pila en sus canales oficiales (Sitio web, Redes Sociales, etc.) para fines de difusión y concientización.
                    </span>
                  </label>
                </div>

                {status === "err" && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl mb-6 flex items-center gap-2 font-medium">
                    <span>⚠️</span> Ocurrió un error al enviar. Por favor, intentá de nuevo.
                  </div>
                )}

                  {/* Honeypot field - Bots will fill this, humans won't */}
                  <div className="hidden" aria-hidden="true">
                    <label>No completar este campo si sos humano</label>
                    <input type="text" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} tabIndex={-1} autoComplete="off" />
                  </div>

                  <button type="submit" disabled={status === "loading"}
                  className="w-full bg-[#5c29c2] text-white font-extrabold py-4 rounded-full hover:bg-[#7c3aed] transition-all disabled:opacity-50 shadow-lg shadow-[#5c29c2]/10 hover:shadow-[#5c29c2]/20 hover:-translate-y-0.5">
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       Enviando...
                    </span>
                  ) : "Compartir mi historia ✨"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}