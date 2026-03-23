"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

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
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function DerechosPage() {
  return (
    <main>
<Navbar />
        
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/informacion" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Información</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3 tracking-wider">⚖️ Marco legal</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">Epilepsia y tus derechos</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">La ley argentina garantiza que las personas con epilepsia puedan ejercer sus derechos sin ningún tipo de discriminación.</p>
        </div>
      </section>

      {/* LEY */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-extrabold mb-3">Ley de Epilepsia</h2>
              <p className="text-gray-600 leading-relaxed mb-4">Esta ley garantiza que la persona que tiene epilepsia pueda ejercer sus derechos sin ningún tipo de discriminación y <strong>prohíbe cualquier acto que la discrimine</strong>.</p>
              <a href="https://www.argentina.gob.ar/justicia/derechofacil/leysimple/epilepsia" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">
                Ver ley completa →
              </a>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "💼", title: "Trabajo", content: "La epilepsia no puede impedir que una persona se presente o ingrese a un trabajo. Tampoco puede impedir el acceso a cargos públicos. En caso de que el paciente lo solicite, el médico podrá otorgar un certificado de aptitud laboral." },
              { icon: "🎓", title: "Educación", content: "La persona con epilepsia tiene derecho a acceder a la educación en sus distintos niveles sin limitación alguna por su enfermedad. Ninguna institución educativa puede negarle el ingreso." },
              { icon: "🏥", title: "Acceso a la salud", content: "Las obras sociales deben cubrir las prestaciones de salud. Si una persona no tiene obra social, el Ministerio de Salud tiene que asegurar los medicamentos necesarios." },
            ].map(({ icon, title, content }, i) => (
              <FadeIn key={title} delay={i * 100}>
                <div className="border border-gray-100 rounded-2xl p-6 hover:border-[#5c29c2]/30 hover:bg-[#f5f0ff] transition-all h-full">
                  <div className="text-3xl mb-4">{icon}</div>
                  <h3 className="font-bold text-lg mb-3">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* MÁS INFO */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-extrabold mb-6">¿Experimentás discriminación?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">Si sentís que tus derechos están siendo vulnerados, podés contactarnos. Te acompañamos a entender qué opciones tenés y cómo actuar.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contacto" className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all text-sm">Contactanos</Link>
              <Link href="/comunidad" className="bg-white border border-[#5c29c2]/20 text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:border-[#5c29c2] transition-all text-sm">Ver comunidad</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}