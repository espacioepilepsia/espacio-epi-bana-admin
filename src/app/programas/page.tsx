// RUTA: src/app/programas/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
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

export default function ProgramasPage() {
  const programas = [
    { icon: "💬", title: "Charlas online", desc: "Charlas en vivo por Instagram y otras plataformas con profesionales de la salud, personas con epilepsia y familias.", href: "/programas/charlas", cta: "Ver charlas" },
    { icon: "🎓", title: "Capacitaciones", desc: "Brindamos capacitaciones junto a instituciones de primer nivel como Fundación Favaloro, la Sociedad Argentina de Neurología y la Liga Argentina de Epilepsia.", href: "/programas/capacitaciones", cta: "Ver capacitaciones" },
    { icon: "🏆", title: "Congresos", desc: "Generamos eventos como el Primer Congreso Latinoamericano de Epilepsia — Epifest — donde más de 1000 personas se inscribieron para recibir más de 30 charlas.", href: "/programas/congresos", cta: "Ver congresos" },
    { icon: "🔗", title: "Colaboraciones", desc: "Trabajamos con otras organizaciones e instituciones para ampliar el alcance de la información sobre epilepsia en Argentina y Latinoamérica.", href: "/programas/colaboraciones", cta: "Ver colaboraciones" },
  ];

  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Nuestras actividades</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Programas</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Espacio Epilepsia es una plataforma digital con el objetivo de informar, compartir experiencias y contener a las personas con epilepsia, sus familiares y amigos.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programas.map(({ icon, title, desc, href, cta }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <div className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="text-4xl mb-4">{icon}</div>
                  <h2 className="text-xl font-extrabold mb-3">{title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{desc}</p>
                  <Link href={href} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all inline-block self-start">{cta} →</Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl font-extrabold mb-4">Instituciones con las que trabajamos</h2>
            <p className="text-gray-500 text-sm mb-8">Colaboramos con organizaciones líderes en neurología y epilepsia en Argentina.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Fundación Favaloro","Soc. Argentina de Neurología","Liga Argentina de Epilepsia","International Bureau for Epilepsy","Senado de la Nación Argentina"].map(inst => (
                <span key={inst} className="bg-white border border-[#5c29c2]/15 text-gray-700 font-semibold px-4 py-2 rounded-full text-sm">{inst}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}