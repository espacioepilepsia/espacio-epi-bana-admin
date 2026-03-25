// RUTA: src/app/informacion/primeros-auxilios/page.tsx
"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

function useInView(ref: React.RefObject<HTMLElement>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<HTMLElement>);
  return <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>{children}</div>;
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${open ? "border-[#5c29c2]" : "border-gray-100 hover:border-[#5c29c2]/30"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white">
        <span className="font-bold text-base text-gray-900">{title}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-[#5c29c2]" : "text-gray-400"}`}>
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 bg-white border-t border-gray-100">{children}</div>}
    </div>
  );
}

const downloadableResources = [
  { img: "/images/primeros-auxilios-individual-1.png", title: "Primeros auxilios en crisis epilépticas", desc: "Guía visual para crisis convulsivas" },
  { img: "/images/primeros-auxilios-individual-2.png", title: "Primeros auxilios en crisis de ausencia y crisis focales", desc: "Guía visual para crisis no convulsivas" },
];

function DownloadGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", _hp: "" });
  const startTime = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Anti-bot: honeypot & timer
    if (form._hp) return;
    if (Date.now() - startTime.current < 3000) {
      setError("Por favor, esperá unos segundos antes de enviar.");
      return;
    }

    if (!form.nombre.trim() || !form.apellido.trim() || !form.email.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      setError("Ingresá un email válido.");
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase.from("resource_downloads").insert({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        recurso: "primeros-auxilios",
      });
      if (dbError) throw dbError;

      // Sync to Perfit list 41 (fire-and-forget)
      fetch("/api/perfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          list: "primeros-auxilios",
        }),
      }).catch(() => {});

      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "espacioepilepsia.arg@gmail.com",
          subject: "Formulario Web Descargable",
          text: `Nueva descarga de recurso de Primeros Auxilios:\nNombre: ${form.nombre} ${form.apellido}\nEmail: ${form.email}`,
        }),
      }).catch(() => {});

      setUnlocked(true);
    } catch {
      setError("Hubo un error al procesar tu solicitud. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (unlocked) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloadableResources.map(({ img, title, desc }) => (
          <FadeIn key={title}>
            <div className="bg-white border border-[#5c29c2]/15 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all hover:shadow-lg">
              <div className="bg-white p-4 flex items-center justify-center h-48 overflow-hidden">
                <img src={img} alt={title} className="h-full w-auto object-contain" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-sm mb-1 text-gray-900 uppercase tracking-wide">{title}</h3>
                <p className="text-xs text-gray-500 mb-4">{desc}</p>
                <a href={img} download target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#5c29c2] text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">
                  ↓ Descargar
                </a>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">📋</span>
        <div>
          <h3 className="font-extrabold text-lg text-gray-900">Completá tus datos para descargar</h3>
          <p className="text-sm text-gray-500">Dejanos tu información para habilitar la descarga de las guías de primeros auxilios.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {/* Honeypot */}
        <input type="text" name="_hp" value={form._hp} onChange={e => setForm({ ...form, _hp: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre *</label>
            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5c29c2] focus:ring-2 focus:ring-[#5c29c2]/20 outline-none transition-all text-sm"
              placeholder="Tu nombre" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Apellido *</label>
            <input type="text" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5c29c2] focus:ring-2 focus:ring-[#5c29c2]/20 outline-none transition-all text-sm"
              placeholder="Tu apellido" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5c29c2] focus:ring-2 focus:ring-[#5c29c2]/20 outline-none transition-all text-sm"
            placeholder="tu@email.com" required />
        </div>

        {error && <p className="text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full md:w-auto bg-[#5c29c2] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#7c3aed] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? (
            <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Enviando...</>
          ) : (
            <>📥 Habilitar descarga</>
          )}
        </button>
      </form>
    </div>
  );
}

export default function PrimerosAuxiliosPage() {
  return (
    <main>
      <Navbar />
      <div className="bg-[#5c29c2] pt-[72px]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link href="/informacion" className="text-white/80 text-sm hover:text-white transition-colors inline-flex items-center gap-1 font-medium">← Volver a Información</Link>
        </div>
      </div>
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-4 tracking-wider">🚨 Emergencias</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">Primeros Auxilios en crisis epilépticas</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed text-center">Conocer cómo actuar correctamente ayuda a la persona a respirar con mayor facilidad y atravesar de mejor manera su crisis.</p>
        </div>
      </section>

      {/* CRISIS CONVULSIVAS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold mb-2">Crisis convulsivas</h2>
            <p className="text-gray-500 mb-8">Crisis tónico-clónica generalizada</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FadeIn delay={80}>
              <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h3 className="font-extrabold text-lg text-[#5c29c2]">¿Qué hacer?</h3>
                </div>
                <ol className="space-y-2.5 text-sm text-gray-700 leading-relaxed list-none">
                  {[
                    "Mantené la calma",
                    "Desalojá el área de objetos duros o peligrosos",
                    "De ser posible tomá el tiempo de la convulsión",
                    "Si usa anteojos, quitáselos",
                    "Aflojale la ropa alrededor del cuello y la cabeza",
                    "Colocala de costado para facilitar la respiración",
                    "Poné algo plano y suave bajo su cabeza",
                    "Permanecé con la persona hasta que la crisis haya terminado",
                    "Cuando recupere la conciencia, ayudala a encontrar un lugar para descansar",
                    "Mostrate amigable y ofrecele llamar a alguien para que pueda volver a casa"
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#5c29c2] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeIn>

            <FadeIn delay={160}>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">❌</span>
                  <h3 className="font-extrabold text-lg text-red-700">¿Qué NO hacer?</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  {[
                    "No trates de contener a la persona o sus movimientos",
                    "No trates de forzarle para abrir la boca, ni pongas ningún objeto duro — podría ahogarse o hacerse daño",
                    "No intentes dar respiración artificial, excepto que la persona dejara de respirar al término de la crisis"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={200}>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-amber-800">¿Cuándo llamar al médico?</h3>
              </div>
              <p className="text-sm text-amber-900 mb-3 leading-relaxed">La mayoría de las personas con epilepsia se recuperan de manera espontánea. Llamá al <strong>107</strong> si:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-900">
                {[
                  "La crisis dura más de 5 minutos",
                  "No hay certeza de que ya tenía diagnóstico de epilepsia",
                  "Se presenta una segunda crisis",
                  "Dificultad para respirar después de la convulsión",
                  "La persona está embarazada",
                  "Tiene diabetes o fiebre alta",
                  "Hay signos de daño en cabeza o cuerpo",
                  "Recuperación muy lenta"
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-600 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CRISIS NO CONVULSIVAS */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold mb-2">Crisis no convulsivas</h2>
            <p className="text-gray-500 mb-8">Crisis de ausencia y crisis focales</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn delay={80}>
              <div className="bg-white border border-[#5c29c2]/15 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h3 className="font-extrabold text-lg text-[#5c29c2]">¿Qué hacer?</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">Con las crisis de ausencia no se necesita ayuda física. En personas con crisis focales con comportamiento automático:</p>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  {[
                    "Observá a la persona cuidadosamente y explicá a los demás lo que está sucediendo",
                    "Habláles tranquilamente y en forma cordial",
                    "Alejala de cualquier peligro sin presionarla",
                    "Permanecé con la persona hasta que recupere totalmente la conciencia y ofrecele ayuda para regresar a casa"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#5c29c2] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={160}>
              <div className="bg-white border border-[#5c29c2]/15 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">ℹ️</span>
                  <h3 className="font-extrabold text-lg text-[#5c29c2]">Info importante</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">Una crisis en una persona con epilepsia <strong>no es una emergencia médica</strong>, aunque así lo parezca. Termina espontáneamente después de unos minutos y las personas pueden continuar con sus actividades después de un período de descanso y recuperación.</p>
                <p className="text-sm text-gray-700 leading-relaxed mt-3">Entre las crisis la vida continúa de forma normal, activa y saludable.</p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={200}>
            <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-xs text-gray-500">
                <strong>Fuente:</strong> Texto extraído de la página web de la{" "}
                <a href="https://www.lace.org.ar/" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] hover:underline font-semibold">Liga Argentina Contra la Epilepsia</a>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* PARA MÁS INFO */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">
              Para más info
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Te recomendamos que visites estos links
            </p>
            <ul className="space-y-4 list-none">
              {[
                { label: "Organización Mundial de la Salud", href: "https://www.who.int/es/news-room/fact-sheets/detail/epilepsy" },
                { label: "Liga Internacional Contra la Epilepsia", href: "https://www.ilae.org/" },
                { label: "Liga Argentina Contra la Epilepsia", href: "https://www.lace.org.ar/" },
                { label: "Liga Chilena contra la Epilepsia", href: "https://www.ligaepilepsia.cl/" },
                { label: "Mar de Somnis", href: "https://mardesomnis.org/que-es-la-epilepsia/" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-base hover:underline transition-colors"
                    style={{ color: "#5c29c2" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>


      {/* VIDEO VIMEO */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://player.vimeo.com/video/69911354"
                title="Video sobre epilepsia"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* INFOGRAFÍAS DESCARGABLES - FORMULARIO GATED */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Herramientas para descargar</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">Descargá nuestras guías visuales de primeros auxilios en crisis epilépticas. Compartilas, imprimilas o hacé folletos para tu comunidad.</p>
          </FadeIn>
          <DownloadGate />
        </div>
      </section>

      <Footer />
    </main>
  );
}

