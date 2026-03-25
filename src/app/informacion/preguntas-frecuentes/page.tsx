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

const tagColors: Record<string, { bg: string; text: string; bar: string }> = {
  "Básico": { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-600" },
  "Diagnóstico": { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-600" },
  "Causas": { bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-600" },
  "Tratamiento": { bg: "bg-green-50", text: "text-green-700", bar: "bg-green-600" },
  "Crisis": { bg: "bg-red-50", text: "text-red-700", bar: "bg-red-600" },
  "Vida cotidiana": { bg: "bg-teal-50", text: "text-teal-700", bar: "bg-teal-600" },
  "Embarazo": { bg: "bg-pink-50", text: "text-pink-700", bar: "bg-pink-600" },
  "SUDEP": { bg: "bg-gray-100", text: "text-gray-700", bar: "bg-gray-600" },
  "Derechos": { bg: "bg-yellow-50", text: "text-yellow-700", bar: "bg-yellow-600" },
};

const allTags = ["Todos", ...Array.from(new Set(faqs.map(f => f.tag)))];

export default function PreguntasFrecuentesPage() {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const filtered = faqs;

  function toggleItem(i: number) {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function openAll() {
    setOpenSet(new Set(filtered.map((_, i) => i)));
  }

  function closeAll() {
    setOpenSet(new Set());
  }

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
          <div className="inline-flex items-center gap-2 bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-4">❓ FAQ</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Hablemos de Epilepsia</h1>
          <div className="text-lg text-gray-600 max-w-3xl leading-relaxed space-y-4 text-center">
            <p>
              En Fundación Espacio Epilepsia creemos que la información es poder. Sabemos que recibir un diagnóstico de epilepsia, convivir con la condición o acompañar a alguien que la tiene puede generar dudas, miedos e incertidumbre. Por eso, preparamos esta sección con respuestas claras, actualizadas y accesibles, basadas en fuentes confiables como la ILAE (Liga Internacional Contra la Epilepsia), la OMS (Organización Mundial de la Salud) y la IBE (Oficina Internacional para la Epilepsia).
            </p>
            <p>
              Aquí vas a encontrar respuestas a las preguntas más comunes: Nuestro objetivo es que esta información te ayude a tomar decisiones más informadas, reducir el estigma y acercarte a una comunidad que te acompaña.
            </p>
            <p>
              Si tenés una pregunta que no aparece acá, escribinos! Estamos para escucharte.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white min-h-[50vh]">
        <div className="max-w-4xl mx-auto">
          {/* Open All / Close All - Estilo FSMB */}
          <div className="flex justify-end gap-3 mb-4">
            <button onClick={openAll} className="text-sm font-bold text-[#5c29c2] hover:underline transition-all">
              Abrir todo
            </button>
            <span className="text-gray-300">/</span>
            <button onClick={closeAll} className="text-sm font-bold text-[#5c29c2] hover:underline transition-all">
              Cerrar todo
            </button>
          </div>

          <FadeIn>
            <div className="flex flex-col gap-[2px]">
              {filtered.map((faq, i) => {
                const isOpen = openSet.has(i);
                return (
                  <div key={i} className="overflow-hidden">
                    {/* Barra sólida violeta - Estilo FSMB */}
                    <button onClick={() => toggleItem(i)}
                      className={`w-full flex items-center justify-between gap-4 px-6 py-4 text-left transition-all ${
                        isOpen ? "bg-[#4a1fa3]" : "bg-[#5c29c2] hover:bg-[#4a1fa3]"
                      } ${i === 0 ? "rounded-t-xl" : ""} ${i === filtered.length - 1 && !isOpen ? "rounded-b-xl" : ""}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="font-bold text-[15px] text-white leading-snug">{faq.q}</span>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                        className={`flex-shrink-0 transition-transform duration-300 text-white ${isOpen ? "rotate-180" : ""}`}>
                        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {/* Contenido expandible */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="bg-[#f5f0ff] px-6 py-5 text-sm text-gray-700 leading-relaxed border-x border-b border-[#5c29c2]/10">
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
                          <div className="mt-3 bg-white rounded-xl px-4 py-3 border border-[#5c29c2]/10">
                            <p className="text-[#5c29c2] font-semibold text-sm">{faq.note}</p>
                          </div>
                        )}
                        {faq.extra && (
                          <Link href={faq.extra.href} className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#5c29c2] hover:underline">
                            {faq.extra.text} →
                          </Link>
                        )}
                        {faq.law && (
                          <a href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/65000-69999/66578/norma.htm" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 ml-3 text-xs font-bold text-[#5c29c2] hover:underline">
                            Ver {faq.law} →
                          </a>
                        )}
                      </div>
                    </div>
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