// RUTA: src/app/programas/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
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

export default function ProgramasPage() {
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
          <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-4 mt-4">Nuestras actividades</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">Programas</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed text-center">Espacio Epilepsia es una plataforma digital con el objetivo de informar, compartir experiencias y contener a las personas con epilepsia, sus familiares y amigos.</p>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold mb-8">¿Qué hacemos?</h2>
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">Espacio Epilepsia es una plataforma digital con el objetivo de informar, compartir experiencias y contener a las personas con epilepsia, sus familiares y amigos.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "🎓", title: "Capacitaciones", desc: "Brindamos capacitaciones junto a Instituciones de primer nivel como Fundación Favaloro, la Sociedad Argentina de Neurología y la Liga Argentina de Epilepsia.", href: "/programas/capacitaciones" },
              { icon: "🏆", title: "Eventos y congresos", desc: "Generamos eventos online como el Primer Congreso Latinoamericano de Epilepsia, Epifest, donde más de 1000 personas se inscribieron para recibir más de 30 charlas de reconocidos neurólogos, psicólogos y especialistas.", href: "/programas/congresos" },
              { icon: "🛠️", title: "Herramientas", desc: "Generamos herramientas para difundir información sobre epilepsia de forma amigable: guías, infografías, materiales descargables y contenidos educativos.", href: "/informacion" },
              { icon: "🤗", title: "Contención", desc: "Promulgamos espacios de contención: grupos de WhatsApp de padres y personas con epilepsia, charlas en vivo en Instagram, y una plataforma centrada en las personas.", href: "/comunidad" },
            ].map(({ icon, title, desc, href }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <Link href={href} className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-6 block hover:-translate-y-1 hover:shadow-lg hover:border-[#5c29c2]/30 transition-all group h-full">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-extrabold text-lg mb-2 group-hover:text-[#5c29c2] transition-colors">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                  <span className="text-xs font-bold text-[#5c29c2]">Ver más →</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SUBPROGRAMAS */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold mb-8">Nuestros programas</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "💬", title: "Charlas online", desc: "Charlas en vivo por Instagram con profesionales de la salud, personas con epilepsia y sus familias.", href: "/programas/charlas" },
              { icon: "🎓", title: "Capacitaciones", desc: "Junto a Fundación Favaloro, Soc. Argentina de Neurología y Liga Argentina de Epilepsia.", href: "/programas/capacitaciones" },
              { icon: "🏆", title: "Congresos", desc: "Epifest — Primer Congreso Latinoamericano de Epilepsia, con más de 1000 inscriptos y 30 charlas.", href: "/programas/congresos" },
              { icon: "🔗", title: "Colaboraciones", desc: "Con organizaciones e instituciones para ampliar el alcance de la información sobre epilepsia.", href: "/programas/colaboraciones" },
            ].map(({ icon, title, desc, href }, i) => (
              <FadeIn key={title} delay={i * 60}>
                <Link href={href} className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 items-start hover:border-[#5c29c2]/30 hover:shadow-sm transition-all group">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-bold mb-1 group-hover:text-[#5c29c2] transition-colors">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* INSTITUCIONES */}
      <section className="py-16 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl font-extrabold text-white mb-4">Instituciones con las que trabajamos</h2>
            <p className="text-white/70 text-sm mb-8">Colaboramos con organizaciones líderes en neurología y epilepsia en Argentina y Latinoamérica.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Fundación Favaloro", "Soc. Argentina de Neurología", "Liga Argentina de Epilepsia", "International Bureau for Epilepsy", "Senado de la Nación Argentina", "Corlab"].map(inst => (
                <span key={inst} className="bg-white/15 border border-white/20 text-white font-semibold px-4 py-2 rounded-full text-sm">{inst}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}