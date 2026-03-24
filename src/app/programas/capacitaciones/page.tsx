// RUTA: src/app/programas/capacitaciones/page.tsx
"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
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

export default function CapacitacionesPage() {
  return (
    <main>
      <Navbar />
      <div className="bg-[#5c29c2] pt-[72px]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link href="/programas" className="text-white/80 text-sm hover:text-white transition-colors inline-flex items-center gap-1 font-medium">← Volver a Programas</Link>
        </div>
      </div>
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-4">🎓 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Capacitaciones</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed text-center">
            <strong>✨ Aprender es también un acto de cuidado.</strong> En Espacio Epilepsia creemos que la educación es una herramienta poderosa para derribar mitos, empoderar a quienes conviven con la epilepsia y formar profesionales más humanos y preparados.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* CAMPUS */}
          <FadeIn>
            <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-3xl p-8 md:p-12 mb-16 text-center shadow-sm">
              <div className="text-5xl mb-6">💻</div>
              <h2 className="text-3xl font-extrabold mb-4">Campus Espacio Epilepsia</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">Una plataforma de formación online que conecta saberes, experiencias y compromiso social y nos permite transformar realidades.</p>
              <a href="https://campus.espacioepilepsia.org/" target="_blank" rel="noopener noreferrer"
                className="inline-block font-bold px-8 py-4 rounded-xl text-sm md:text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                style={{ background: "#5c29c2", color: "white" }}>
                Ir al campus online →
              </a>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <FadeIn delay={100}>
              <h3 className="font-extrabold text-2xl mb-6 flex items-center gap-3"><span className="text-3xl">🔍</span> ¿Qué vas a encontrar?</h3>
              <ul className="space-y-4">
                {[
                  "Cursos autoasistidos y con tutores",
                  "Módulos interactivos con enfoque práctico",
                  "Casos reales y contenido basado en evidencia",
                  "Certificaciones oficiales y constancias de participación",
                  "Espacios de reflexión, comunidad y participación"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <span className="text-[#29f0b4] text-lg font-bold">✓</span>
                    <span className="text-gray-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            
            <FadeIn delay={150}>
              <h3 className="font-extrabold text-2xl mb-6 flex items-center gap-3"><span className="text-3xl">👥</span> ¿A quién está dirigido?</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: "🌟", text: "Personas con epilepsia y sus familias" },
                  { icon: "🤝", text: "Voluntarios/as y agentes comunitarios" },
                  { icon: "🩺", text: "Profesionales de la salud, educación y comunicación" },
                  { icon: "🏢", text: "Empresas e instituciones interesadas en inclusión" }
                ].map(({ icon, text }, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#f5f0ff] rounded-xl p-4 border border-[#5c29c2]/10 hover:border-[#5c29c2]/30 transition-colors">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-bold text-gray-800 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={200}>
            <div className="border-t border-gray-100 pt-16">
              <h3 className="font-extrabold text-2xl mb-8 text-center flex items-center justify-center gap-3">
                <span className="text-3xl">📚</span> Algunos temas abordados
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "Epilepsia 360°",
                  "Primeros auxilios ante una crisis",
                  "Epilepsia en la infancia, adolescencia y adultez",
                  "Inclusión laboral y educativa",
                  "Salud mental, comunicación y derechos"
                ].map((item, i) => (
                  <span key={i} className="bg-white border border-[#5c29c2]/20 text-gray-700 font-bold px-5 py-2.5 rounded-full shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA ORGANIZACIONES */}
      <section className="py-16 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h3 className="font-extrabold text-3xl text-white mb-4">Capacitaciones a medida para organizaciones</h3>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              ¿Representás una empresa, escuela, ONG o institución de salud? Diseñamos formaciones personalizadas adaptadas a las necesidades de cada equipo.
            </p>
            <a href="mailto:contacto@espacioepilepsia.org" className="inline-flex items-center gap-2 bg-[#29f0b4] text-[#5c29c2] font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-lg hover:-translate-y-1">
              <span className="text-xl">📩</span>
              <span>Escribinos para coordinar</span>
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}