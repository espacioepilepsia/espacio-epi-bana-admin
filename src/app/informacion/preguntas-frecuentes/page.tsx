// RUTA: src/app/informacion/preguntas-frecuentes/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

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

const faqs = [
  { q: "¿La epilepsia es contagiosa?", a: "No. La epilepsia no es contagiosa bajo ninguna circunstancia. Es una enfermedad neurológica que no se transmite de persona a persona." },
  { q: "¿La epilepsia es una enfermedad mental?", a: "No. La epilepsia es una enfermedad neurológica (del sistema nervioso), no una enfermedad mental. Las crisis son causadas por descargas eléctricas anormales en el cerebro." },
  { q: "¿Las personas con epilepsia pueden trabajar?", a: "Sí. La mayoría de las personas con epilepsia pueden trabajar normalmente. La ley argentina prohíbe cualquier discriminación laboral por esta causa." },
  { q: "¿Se puede vivir una vida normal con epilepsia?", a: "Sí. Con el tratamiento adecuado, el 70% de las personas con epilepsia puede llevar una vida sin crisis. Muchas personas con epilepsia son padres, profesionales, deportistas y artistas." },
  { q: "¿Qué hago durante una crisis epiléptica?", a: "Mantené la calma, protegé la cabeza de la persona, girala de costado, mirá el reloj y no la sujetés. Llamá al 107 si la crisis dura más de 5 minutos." },
  { q: "¿Hay que meter algo en la boca durante una crisis?", a: "No. Esto es un mito peligroso. Las personas con epilepsia NO se tragan la lengua. Nunca metas nada en su boca durante una crisis." },
  { q: "¿Cuáles son las causas de la epilepsia?", a: "La causa se desconoce en aproximadamente el 50% de los casos. Las causas conocidas incluyen factores genéticos, lesiones cerebrales, infecciones, tumores y causas metabólicas." },
  { q: "¿La epilepsia tiene cura?", a: "En muchos casos el tratamiento con medicación permite controlar completamente las crisis. En algunos tipos de epilepsia, la cirugía puede ser curativa. El 70% puede vivir sin crisis con tratamiento adecuado." },
  { q: "¿Las obras sociales cubren la medicación?", a: "Sí. Las obras sociales están obligadas a cubrir las prestaciones de salud para personas con epilepsia. Si no tenés obra social, el Ministerio de Salud debe asegurar los medicamentos." },
  { q: "¿Pueden manejar las personas con epilepsia?", a: "Depende del país y de la situación particular. En Argentina, se evalúa caso por caso según el tipo de epilepsia, frecuencia de crisis y tiempo sin crisis." },
];

export default function PreguntasFrecuentesPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/informacion" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Información</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3 tracking-wider">❓ FAQ</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">Preguntas frecuentes</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Respondemos las dudas más comunes sobre epilepsia de forma clara y accesible.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }, i) => (
              <FadeIn key={i} delay={i * 40}>
                <div className={`border rounded-2xl overflow-hidden transition-all ${open === i ? "border-[#5c29c2]" : "border-gray-100 hover:border-[#5c29c2]/30"}`}>
                  <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left">
                    <span className="font-bold text-base">{q}</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-[#5c29c2]" : "text-gray-400"}`}>
                      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open === i && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 text-center" style={{ background: "#5c29c2" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">¿No encontraste tu respuesta?</h2>
          <p className="text-white/70 mb-6 text-sm">Escribinos y te respondemos a la brevedad.</p>
          <Link href="/contacto" className="bg-white text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:bg-[#a78bfa] hover:text-white transition-all inline-block">Contactanos</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}