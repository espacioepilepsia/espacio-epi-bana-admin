// RUTA: src/app/informacion/derechos/page.tsx
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

function AccordionItem({ title, children, open, onToggle, icon = "⚖️" }: { title: string; children: React.ReactNode; open: boolean; onToggle: () => void; icon?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden transition-all hover:border-[#5c29c2]/20">
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 text-left">
        <span className="text-2xl flex-shrink-0" aria-hidden>{icon}</span>
        <span className="font-semibold text-base text-gray-900 flex-1 border-l-4 border-[#29f0b4] pl-4">{title}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ color: open ? "#5c29c2" : "#9ca3af" }}>
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="pl-[4.5rem] pr-5 pb-5 text-sm text-gray-700 leading-relaxed border-t border-gray-100">{children}</div>}
    </div>
  );
}

const faqs = [
  {
    icon: "⚖️",
    title: "¿Qué derechos me reconoce la ley si tengo epilepsia?",
    content: (
      <div className="pt-4 space-y-3">
        <p>La <a href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/65000-69999/66578/norma.htm" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-semibold hover:underline">Ley 25.404</a> garantiza a las personas con epilepsia:</p>
        <ul className="space-y-1.5 ml-4">
          {["Acceso al tratamiento médico integral, sin discriminación", "Derecho a medicación anticonvulsiva gratuita (con o sin CUD)", "Atención neurológica adecuada", "Inclusión educativa y laboral", "Protección social"].map(item => <li key={item} className="flex gap-2"><span className="text-[#5c29c2] flex-shrink-0">•</span>{item}</li>)}
        </ul>
        <p>Esta ley protege además contra cualquier forma de discriminación en el ámbito laboral, educativo o social.</p>
      </div>
    )
  },
  {
    icon: "🏥",
    title: "¿Qué dice la Ley de Epilepsia sobre cobertura de obras sociales y prepagas?",
    content: (
      <div className="pt-4 space-y-3">
        <p>La <a href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/65000-69999/66578/norma.htm" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-semibold hover:underline">Ley 25.404</a> y su <a href="https://www.argentina.gob.ar/normativa/nacional/decreto-53-2009-149915/texto" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-semibold hover:underline">Decreto 53/2009</a> establece que las obras sociales y prepagas deben cubrir al 100% el tratamiento médico de la epilepsia. Esto incluye:</p>
        <ul className="space-y-1.5 ml-4">
          {["Medicamentos", "Estudios diagnósticos", "Controles médicos", "Tratamientos necesarios"].map(item => <li key={item} className="flex gap-2"><span className="text-[#5c29c2] flex-shrink-0">•</span>{item}</li>)}
        </ul>
        <p>El incumplimiento puede ser reclamado administrativa o judicialmente.</p>
      </div>
    )
  },
  {
    icon: "📄",
    title: "¿Qué es el CUD y por qué deberías considerarlo?",
    content: (
      <div className="pt-4 space-y-3">
        <p>El <strong>Certificado Único de Discapacidad (CUD)</strong> es un documento oficial con validez en todo el territorio argentino, que acredita la existencia de una discapacidad conforme a criterios médicos, funcionales y sociales.</p>
        <p>No implica incapacidad legal ni afecta tu autonomía civil. Tener CUD te brinda acceso a:</p>
        <ul className="space-y-1.5 ml-4">
          {["Transporte público gratuito", "Exenciones impositivas", "Prioridades en ciertos trámites administrativos", "Cobertura médica al 100% del tratamiento relacionado con tu diagnóstico", "Facilita el acceso a tratamientos y medicamentos"].map(item => <li key={item} className="flex gap-2"><span className="text-[#5c29c2] flex-shrink-0">•</span>{item}</li>)}
        </ul>
        <div className="bg-[#f5f0ff] rounded-xl p-4 mt-3">
          <p className="font-bold text-[#5c29c2] text-xs uppercase tracking-wide mb-1">Importante</p>
          <p>El CUD no significa incapacidad para trabajar o estudiar. Su objetivo es garantizar el ejercicio pleno de tus derechos en igualdad de condiciones.</p>
        </div>
      </div>
    )
  },
  {
    icon: "📅",
    title: "¿Cuándo puedo solicitar el CUD?",
    content: (
      <div className="pt-4 space-y-3">
        <p>Podés solicitar el CUD cuando la epilepsia genera una limitación funcional que afecta significativamente tu vida cotidiana:</p>
        <ul className="space-y-1.5 ml-4">
          {["Dificultades para trabajar o estudiar", "Problemas para trasladarte", "Dificultad para recibir atención médica adecuada", "Limitaciones para participar en la vida social de manera autónoma"].map(item => <li key={item} className="flex gap-2"><span className="text-[#5c29c2] flex-shrink-0">•</span>{item}</li>)}
        </ul>
        <p>En el caso de la epilepsia, suelen considerarse como criterios relevantes: crisis frecuentes o impredecibles, epilepsia refractaria al tratamiento, efectos adversos severos de la medicación, y barreras sociales o económicas para acceder al tratamiento.</p>
        <p className="font-semibold text-[#5c29c2]">El trámite es voluntario y gratuito.</p>
      </div>
    )
  },
  {
    icon: "📋",
    title: "¿Cómo se tramita el CUD en casos de epilepsia?",
    content: (
      <div className="pt-4 space-y-3">
        <p>El trámite comienza con la descarga de una planilla médica que debe completar un neurólogo tratante. También se requiere:</p>
        <ul className="space-y-1.5 ml-4">
          {["DNI", "Estudios médicos actualizados", "Historia clínica", "Informes interdisciplinarios si los hubiera"].map(item => <li key={item} className="flex gap-2"><span className="text-[#5c29c2] flex-shrink-0">•</span>{item}</li>)}
        </ul>
        <p>Luego se solicita un turno en la Junta Evaluadora correspondiente a tu jurisdicción. Allí un equipo multidisciplinario valorará si corresponde emitir el CUD.</p>
      </div>
    )
  },
  {
    icon: "💯",
    title: "¿Necesito el CUD para que me cubra al 100%?",
    content: (
      <div className="pt-4 space-y-3">
        <p>No es obligatorio. La <a href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/65000-69999/66578/norma.htm" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-semibold hover:underline">Ley 25.404</a> y la <a href="https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-310-2004-94218/texto" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-semibold hover:underline">Resolución 310/04</a> del Ministerio de Salud establecen que las obras sociales deben garantizar la cobertura integral del tratamiento para epilepsia aun sin CUD.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">El 100% de cobertura que otorga el CUD aplica solo a lo relacionado con el diagnóstico que lo motivó. No se extiende automáticamente a otros tratamientos no vinculados.</p>
        </div>
      </div>
    )
  },
  {
    icon: "⚠️",
    title: "¿Qué problemas comunes enfrentan las personas con epilepsia ante obras sociales?",
    content: (
      <div className="pt-4 space-y-3">
        <ul className="space-y-1.5 ml-4">
          {["Negativa de cobertura sin fundamento válido", "Exigencia de trámites excesivos o redundantes", "Entrega irregular de medicación", "Cambios arbitrarios de medicamentos sin consentimiento médico", "Falta de respuesta a los reclamos", "Demoras injustificadas en la autorización de estudios"].map(item => <li key={item} className="flex gap-2"><span className="text-[#5c29c2] flex-shrink-0">•</span>{item}</li>)}
        </ul>
        <div className="bg-[#f5f0ff] rounded-xl p-4 mt-2">
          <p className="text-[#5c29c2] text-sm font-semibold">Toda negativa debe hacerse por escrito y toda solicitud debe recibir respuesta en 10 días hábiles. Si eso no sucede, podés iniciar un amparo de salud.</p>
        </div>
      </div>
    )
  },
  {
    icon: "📝",
    title: "¿Dónde presentar mi reclamo? Paso a paso",
    content: (
      <div className="pt-4 space-y-4">
        {[
          { n: 1, title: "Reuní la documentación", items: ["Historia clínica actualizada", "Receta médica", "Constancia de afiliación", "Documentación que respalde tu diagnóstico"] },
          { n: 2, title: "Presentá una nota formal", desc: "Redactá una nota dirigida a la obra social explicando tu reclamo. Adjuntá toda la documentación. Solicitá copia con sello de recepción o enviá por correo certificado." },
          { n: 3, title: "Esperá la respuesta", desc: "La obra social tiene 10 días hábiles para responderte por escrito." },
          { n: 4, title: "Si no hay respuesta o es negativa", desc: "Podés denunciar ante la Superintendencia de Servicios de Salud." },
          { n: 5, title: "Si persiste la negativa", desc: "Iniciá un amparo de salud con un abogado o defensor público." },
        ].map(({ n, title, items, desc }) => (
          <div key={n} className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-[#5c29c2] text-white text-sm flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{n}</span>
            <div>
              <p className="font-bold mb-1">{title}</p>
              {items && <ul className="space-y-1 ml-2">{items.map(i => <li key={i} className="flex gap-2 text-sm"><span className="text-[#5c29c2]">•</span>{i}</li>)}</ul>}
              {desc && <p className="text-sm">{desc}</p>}
            </div>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm font-semibold">Siempre guardá copia de todo lo que presentás y registrá las fechas de cada gestión.</p>
        </div>
      </div>
    )
  },
  {
    icon: "👨‍⚖️",
    title: "¿Cuándo necesito la ayuda de un abogado? ¿Hay abogados gratuitos?",
    content: (
      <div className="pt-4 space-y-3">
        <p className="font-semibold">Necesitás un abogado cuando:</p>
        <ul className="space-y-1.5 ml-4">
          {["Te niegan la cobertura de tratamiento esencial", "Te rechazan el CUD injustificadamente y querés reclamar judicialmente", "Sufrís discriminación laboral, educativa o institucional", "La obra social no responde a tus reclamos dentro de los plazos legales", "Necesitás iniciar un amparo de salud"].map(item => <li key={item} className="flex gap-2"><span className="text-[#5c29c2] flex-shrink-0">•</span>{item}</li>)}
        </ul>
        <p className="font-semibold mt-3">Podés acceder a asesoramiento gratuito a través de:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {[
            { label: "Defensoría Pública", href: "https://www.mpd.gov.ar" },
            { label: "Fundación REDESA", href: "https://www.instagram.com/fundacionredesa/" },
            { label: "Comisión Pro Bono", href: "https://probono.org.ar" },
            { label: "Consultorios jurídicos universitarios", href: "#" },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-semibold hover:underline text-sm flex gap-2 items-center">
              <span>→</span>{label}
            </a>
          ))}
        </div>
      </div>
    )
  },
  {
    icon: "🏛️",
    title: "¿Qué necesito para presentar un amparo de salud?",
    content: (
      <div className="pt-4 space-y-2">
        <p className="mb-3">Para presentar un amparo de salud necesitarás:</p>
        {[
          { title: "Historia clínica completa", desc: "Que demuestre tu diagnóstico y la necesidad del tratamiento" },
          { title: "Receta médica actualizada", desc: "Con los medicamentos o estudios que se están reclamando" },
          { title: "Constancia de afiliación", desc: "A la obra social o prepaga" },
          { title: "Nota de rechazo", desc: "O constancia de falta de respuesta por parte de la obra social" },
          { title: "DNI", desc: "Fotocopia del documento de identidad" },
          { title: "CUD (si lo tenés)", desc: "Copia del Certificado Único de Discapacidad" },
        ].map(({ title, desc }) => (
          <div key={title} className="flex gap-3">
            <span className="text-[#5c29c2] flex-shrink-0 mt-0.5">✓</span>
            <div><span className="font-semibold">{title}:</span> {desc}</div>
          </div>
        ))}
      </div>
    )
  },
  {
    icon: "💊",
    title: "¿Qué pasa con la medicación no aprobada por ANMAT?",
    content: (
      <div className="pt-4 space-y-3">
        <p>En algunos casos, las personas con epilepsia requieren medicamentos que no están aprobados por ANMAT, ya sea porque se usan fuera de indicación (off-label), son de uso compasivo, o no se comercializan en el país.</p>
        <p>Si tu médico tratante considera que ese medicamento es el más adecuado, puede fundamentarse a través de informes clínicos detallados, estudios de bioequivalencia y evidencia científica.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">No siempre se obtiene una aprobación inmediata. En muchos casos, la persona debe iniciar una lucha administrativa y judicial. Los amparos frecuentemente resultan favorables, pero no en todos los casos.</p>
        </div>
      </div>
    )
  },
];

export default function DerechosPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const toggleItem = (i: number) => setOpenItems(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  const expandAll = () => setOpenItems(new Set(faqs.map((_, i) => i)));
  const collapseAll = () => setOpenItems(new Set());
  return (
    <main>
      <Navbar />
      <section style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/informacion" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Información</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3 tracking-wider">⚖️ Marco legal</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">Epilepsia y tus Derechos</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Conocé toda la información sobre el CUD, coberturas médicas, beneficios y cómo hacer valer tus derechos ante obras sociales y prepagas.</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "📋", title: "Ley 25.404", desc: "La ley argentina que protege a las personas con epilepsia garantizando tratamiento y no discriminación" },
                { icon: "🏥", title: "Cobertura al 100%", desc: "Obras sociales y prepagas deben cubrir el tratamiento integral de la epilepsia" },
                { icon: "📄", title: "CUD", desc: "El Certificado Único de Discapacidad te da acceso a beneficios adicionales sin quitarte derechos" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-bold mb-2">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ LEGAL */}
      <section className="py-12 px-6 pb-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            {/* Título centrado con underline mint */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">Preguntas Frecuentes</h2>
              <div style={{ width: "48px", height: "4px", background: "#29f0b4", borderRadius: "2px", margin: "0 auto" }} />
            </div>
            {/* Botones Expandir / Colapsar */}
            <div className="flex gap-3 justify-center mb-8">
              <button onClick={expandAll}
                className="flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
                style={{ background: "#5c29c2" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Expandir Todo
              </button>
              <button onClick={collapseAll}
                className="flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
                style={{ background: "#29f0b4", color: "#1a1a1a" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Colapsar Todo
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {faqs.map(({ title, content, icon }, i) => {
                const item = (
                  <AccordionItem key={title} title={title} icon={icon} open={openItems.has(i)} onToggle={() => toggleItem(i)}>
                    {content}
                  </AccordionItem>
                );

                if (title === "¿Cómo se tramita el CUD en casos de epilepsia?") {
                  return [
                    item,
                    <div key="cud-legend" className="bg-[#f5f0ff] rounded-xl p-5 border border-[#5c29c2]/15 text-sm text-gray-700 leading-relaxed shadow-sm">
                      <p className="font-bold text-[#5c29c2] text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span> Importante
                      </p>
                      <p className="mb-3">El CUD no te convierte en una persona "incapaz". No implica una declaración de incapacidad civil ni una restricción de derechos. Las personas con CUD conservan plenamente su autonomía legal: pueden contratar, votar, trabajar, estudiar y tomar decisiones.</p>
                      <p>Solo una sentencia judicial puede declarar la restricción de la capacidad jurídica, y eso ocurre en contextos específicos. Tener CUD solo habilita el acceso a derechos y beneficios establecidos por ley.</p>
                    </div>
                  ];
                }

                return item;
              })}
            </div>

            <div className="mt-12 flex justify-center w-full">
              <Link
                href="/informacion/preguntas-frecuentes"
                className="inline-flex items-center gap-3 font-extrabold px-8 py-4 rounded-[2rem] text-lg hover:-translate-y-1 transition-transform shadow-md"
                style={{ backgroundColor: "#29f0b4", color: "#5c29c2" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Ver preguntas frecuentes de epilepsia
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl font-extrabold text-white mb-3">¿Necesitás más información?</h2>
            <p className="text-white/70 mb-6 text-sm leading-relaxed">Para consultas sobre tus derechos o para contactar a un abogado, escribinos.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="mailto:contacto@espacioepilepsia.org" className="bg-[#29f0b4] text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
                Escribinos →
              </a>
              <Link href="/informacion/preguntas-frecuentes" className="bg-white/15 border border-white/25 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/25 transition-all">
                Ver preguntas frecuentes
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}