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

const instituciones = [
  { name: "Fundación Favaloro", desc: "Primer curso abierto a la comunidad con información sobre epilepsia", icon: "🏥" },
  { name: "Sociedad Argentina de Neurología", desc: "Capacitaciones a profesionales de la salud", icon: "🧠" },
  { name: "Liga Argentina de Epilepsia", desc: "Colaboración en formación y difusión", icon: "⚡" },
];

export default function CapacitacionesPage() {
  const [playing, setPlaying] = useState(false);

  return (
    <main>
      <Navbar />
      <section style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/programas" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Programas</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3">🎓 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Capacitaciones</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Brindamos capacitaciones junto a instituciones de primer nivel para profesionales, familias y organizaciones.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-extrabold mb-8">Instituciones con las que trabajamos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {instituciones.map(({ name, desc, icon }, i) => (
                <FadeIn key={name} delay={i * 80}>
                  <div className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-6 text-center hover:border-[#5c29c2]/30 hover:shadow-sm transition-all">
                    <div className="text-4xl mb-3">{icon}</div>
                    <h3 className="font-bold mb-2 text-sm">{name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          {/* VIDEO CAPACITACIÓN */}
          <FadeIn delay={100}>
            <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl overflow-hidden mb-8">
              <div className="p-6 pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-[#5c29c2] text-white px-3 py-1 rounded-full">Fundación Favaloro</span>
                </div>
                <h3 className="font-extrabold text-lg mb-2">Conceptos básicos de epilepsia</h3>
                <p className="text-sm text-gray-600 mb-4">Presentación del Curso &quot;Cuidados Básicos en Crisis Epilépticas&quot; — primer curso abierto a la comunidad sobre epilepsia de Fundación Favaloro. El Dr. Alejandro Thomson introduce los conceptos básicos.</p>
              </div>
              <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
                {playing ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/-RAAvTB5ihU?autoplay=1"
                    title="Conceptos básicos de epilepsia"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button onClick={() => setPlaying(true)} className="absolute inset-0 w-full h-full group">
                    <img src="https://img.youtube.com/vi/-RAAvTB5ihU/hqdefault.jpg" alt="Conceptos básicos de epilepsia" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#5c29c2] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </FadeIn>

          {/* CAMPUS */}
          <FadeIn delay={150}>
            <div className="bg-white border border-gray-100 rounded-2xl p-7 text-center shadow-sm">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-extrabold text-xl mb-3">Campus online de Espacio Epilepsia</h3>
              <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto leading-relaxed">Accedé a capacitaciones completas sobre epilepsia para pacientes, familias y profesionales de la salud. Contenido gratuito y accesible.</p>
              <a href="https://campus.espacioepilepsia.org/" target="_blank" rel="noopener noreferrer"
                className="inline-block font-bold px-6 py-3 rounded-xl text-sm transition-all"
                style={{ background: "#5c29c2", color: "white" }}>
                Ir al campus online →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h3 className="font-extrabold text-2xl text-white mb-3">¿Tu institución quiere capacitarse?</h3>
            <p className="text-white/70 text-sm mb-6">Escribinos y coordinamos una capacitación a medida para tu equipo o institución.</p>
            <Link href="/contacto" className="inline-block bg-[#29f0b4] text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
              Solicitar capacitación →
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}