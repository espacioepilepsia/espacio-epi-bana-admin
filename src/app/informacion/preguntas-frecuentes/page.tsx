// RUTA: src/app/informacion/preguntas-frecuentes/page.tsx
"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  {
    q: "¿Qué es la epilepsia?",
    a: "La epilepsia es una enfermedad neurológica crónica que se caracteriza por crisis recurrentes, causadas por descargas eléctricas anormales en el cerebro. No es una enfermedad mental, ni una condición contagiosa. Afecta a personas de todas las edades y orígenes.",
    tag: "Básico",
  },
  {
    q: "¿Qué es una crisis epiléptica?",
    a: "Una crisis epiléptica es una alteración breve del comportamiento, la conciencia, el movimiento, las emociones o la percepción, debido a una actividad eléctrica anormal y excesiva en el cerebro. Puede durar desde unos segundos hasta pocos minutos.",
    tag: "Básico",
  },
  {
    q: "¿Todas las personas que tienen una crisis tienen epilepsia?",
    a: "No. Una única crisis no equivale a un diagnóstico de epilepsia. Para diagnosticar epilepsia se requieren al menos dos crisis no provocadas (sin una causa inmediata identificable), separadas por al menos 24 horas.",
    tag: "Diagnóstico",
  },
  {
    q: "¿Qué causa la epilepsia?",
    a: "Las causas pueden variar: genética, daño cerebral, infecciones, lesiones prenatales o problemas metabólicos. En muchos casos, la causa es desconocida (epilepsia idiopática), especialmente cuando el cerebro parece estructuralmente normal.",
    tag: "Causas",
  },
  {
    q: "¿Se puede curar la epilepsia?",
    a: "En muchos casos, la epilepsia puede controlarse con tratamiento, y algunas personas pueden llegar a vivir sin crisis por años o suspender la medicación bajo supervisión médica. Sin embargo, no todos los casos pueden controlarse con medicación antiepiléptica.",
    tag: "Tratamiento",
  },
  {
    q: "¿Cómo se trata la epilepsia?",
    items: ["Medicamentos antiepilépticos (el más común)", "Cirugía (en ciertos casos)", "Dietas especiales (como la cetogénica)", "Estimulación del nervio vago"],
    note: "El tratamiento debe ser individualizado y supervisado por un/a neurólogo/a.",
    tag: "Tratamiento",
  },
  {
    q: "¿Qué factores pueden desencadenar una crisis?",
    items: ["Falta de sueño", "Estrés", "Omisión de medicación", "Luces intermitentes (en algunos casos)", "Consumo de alcohol o drogas", "Cambios hormonales"],
    note: "Cada persona tiene desencadenantes distintos. Es clave aprender a identificarlos.",
    tag: "Crisis",
  },
  {
    q: "¿Pueden las personas con epilepsia llevar una vida sin restricciones?",
    a: "Sí. Con un diagnóstico y tratamiento adecuados, muchas personas con epilepsia pueden estudiar, trabajar, tener familia, hacer deporte y llevar una vida plena. La inclusión y el apoyo social son fundamentales.",
    tag: "Vida cotidiana",
  },
  {
    q: "¿Puedo ser madre si tengo epilepsia?",
    a: "Sí, muchas mujeres con epilepsia son madres. Lo más importante es planificar el embarazo, ajustar el tratamiento si es necesario y contar con un equipo médico multidisciplinario. La epilepsia no impide el deseo ni la posibilidad de maternar.",
    tag: "Embarazo",
  },
  {
    q: "¿Qué es SUDEP?",
    a: "La muerte súbita e inesperada en epilepsia (SUDEP) se refiere a la muerte de una persona con epilepsia sin que haya habido señales de advertencia y sin que se haya podido determinar la causa de la muerte.",
    tag: "SUDEP",
  },
  {
    q: "¿Qué tan común es SUDEP?",
    a: "Estudios recientes estiman que la tasa de SUDEP está alrededor de una muerte por cada 1.000 personas con epilepsia por año. En personas con crisis epilépticas frecuentes e inadecuadamente controladas, la tasa puede aproximarse a 1 de cada 100 por año. Es posible que esta cifra se haya subestimado dada la pobre identificación de casos.",
    tag: "SUDEP",
  },
  {
    q: "¿Cuáles son los factores de riesgo de SUDEP?",
    a: "El principal factor de riesgo de SUDEP es tener frecuentes crisis tónico-clónicas generalizadas (Gran mal). Mientras más frecuentes sean estas crisis, mayor es el riesgo. Para reducir el riesgo, es importante discutirlo con tu equipo de salud y trabajar para controlar mejor las crisis.",
    tag: "SUDEP",
  },
  {
    q: "¿Qué derechos me reconoce la ley si tengo epilepsia?",
    items: ["Acceso al tratamiento médico integral, sin discriminación", "Derecho a medicación anticonvulsiva gratuita (con o sin CUD)", "Atención neurológica adecuada", "Inclusión educativa y laboral", "Protección social"],
    note: "Esta ley protege además contra cualquier forma de discriminación en el ámbito laboral, educativo o social.",
    extra: { text: "Ver más sobre Derechos y Epilepsia", href: "/informacion/derechos" },
    tag: "Derechos",
    law: "Ley 25.404",
  },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  "Básico": { bg: "bg-blue-50", text: "text-blue-700" },
  "Diagnóstico": { bg: "bg-purple-50", text: "text-purple-700" },
  "Causas": { bg: "bg-orange-50", text: "text-orange-700" },
  "Tratamiento": { bg: "bg-green-50", text: "text-green-700" },
  "Crisis": { bg: "bg-red-50", text: "text-red-700" },
  "Vida cotidiana": { bg: "bg-teal-50", text: "text-teal-700" },
  "Embarazo": { bg: "bg-pink-50", text: "text-pink-700" },
  "SUDEP": { bg: "bg-gray-100", text: "text-gray-700" },
  "Derechos": { bg: "bg-yellow-50", text: "text-yellow-700" },
};

const allTags = ["Todos", ...Array.from(new Set(faqs.map(f => f.tag)))];

export default function PreguntasFrecuentesPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState("Todos");

  const filtered = filter === "Todos" ? faqs : faqs.filter(f => f.tag === filter);

  return (
    <main>
      <Navbar />
      <section style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/informacion" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Información</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3">❓ FAQ</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Hablemos de Epilepsia</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Conocer la epilepsia, transformar la mirada. Preparamos respuestas claras, actualizadas y accesibles, basadas en fuentes confiables como la ILAE, la OMS y la IBE.</p>
        </div>
      </section>

      {/* FILTROS */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex gap-2 flex-wrap">
          {allTags.map(tag => (
            <button key={tag} onClick={() => { setFilter(tag); setOpen(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${filter === tag ? "bg-[#5c29c2] text-white border-[#5c29c2]" : "bg-white text-gray-500 border-gray-200 hover:border-[#5c29c2] hover:text-[#5c29c2]"}`}>
              {tag}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} pregunta{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <section className="py-12 px-6 bg-white min-h-[50vh]">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex flex-col gap-3">
              {filtered.map((faq, i) => {
                const isOpen = open === i;
                const tc = tagColors[faq.tag] ?? { bg: "bg-gray-100", text: "text-gray-600" };
                return (
                  <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? "border-[#5c29c2] shadow-sm" : "border-gray-100 hover:border-[#5c29c2]/30"}`}>
                    <button onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${tc.bg} ${tc.text}`}>{faq.tag}</span>
                        <span className="font-bold text-base text-gray-900 leading-snug">{faq.q}</span>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                        className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#5c29c2]" : "text-gray-400"}`}>
                        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 bg-white border-t border-gray-100 pt-4 text-sm text-gray-700 leading-relaxed">
                        {faq.a && <p>{faq.a}</p>}
                        {faq.items && (
                          <ul className="space-y-2 mt-2">
                            {faq.items.map(item => (
                              <li key={item} className="flex gap-2">
                                <span className="text-[#5c29c2] flex-shrink-0">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {faq.note && (
                          <div className="mt-3 bg-[#f5f0ff] rounded-xl px-4 py-3">
                            <p className="text-[#5c29c2] font-semibold">{faq.note}</p>
                          </div>
                        )}
                        {faq.extra && (
                          <Link href={faq.extra.href} className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#5c29c2] hover:underline">
                            {faq.extra.text} →
                          </Link>
                        )}
                        {faq.law && (
                          <a href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/65000-69999/66578/norma.htm" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#5c29c2] hover:underline">
                            Ver {faq.law} →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CAMPUS + CTA */}
      <section className="py-12 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FadeIn>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-extrabold text-white text-lg mb-2">¿Querés más información?</h3>
                <p className="text-white/70 text-sm mb-4">Contamos con un campus online con capacitaciones sobre diversos temas relacionados a la epilepsia.</p>
                <a href="https://campus.espacioepilepsia.org/" target="_blank" rel="noopener noreferrer"
                  className="inline-block font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                  style={{ background: "#29f0b4", color: "#5c29c2" }}>
                  Ir al campus online →
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={80}>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-extrabold text-white text-lg mb-2">¿Tu pregunta no está acá?</h3>
                <p className="text-white/70 text-sm mb-4">Escribinos y te respondemos a la brevedad. Estamos para escucharte.</p>
                <Link href="/contacto"
                  className="inline-block bg-white text-[#5c29c2] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#a78bfa] hover:text-white transition-all">
                  Contactanos →
                </Link>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={120}>
            <p className="text-white/40 text-xs text-center mt-8">Fuente: Información extraída de ILAE (Liga Internacional Contra la Epilepsia), OMS e IBE (Oficina Internacional para la Epilepsia).</p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}