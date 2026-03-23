// RUTA: src/app/programas/colaboraciones/page.tsx
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

const colaboraciones = [
  {
    icon: "🏥",
    tag: "2021 · 2022",
    title: "Semana de la Epilepsia",
    desc: "En el marco del Día Latinoamericano de la Epilepsia, organizamos junto a la Sociedad Neurológica Argentina (y en 2022 también con la Liga Argentina Contra la Epilepsia y la Young Epilepsy Section de la ILAE) la Semana de la Epilepsia, con charlas en vivo con diversos profesionales de neurología.",
    link: { label: "Ver videos en Instagram", href: "https://www.instagram.com/semana_de_la_epilepsia/" },
  },
  {
    icon: "🏆",
    tag: "2021",
    title: "Congreso LACE",
    desc: "En el marco del Congreso 2021 de la Liga Latinoamericana Contra la Epilepsia (LACE), brindamos una charla sobre innovación y epilepsia centrada en el paciente. Realizamos también una charla con los doctores María del Carmen García y Santiago Flesler sobre la relación Médico-Paciente.",
    link: { label: "Ver LACE", href: "https://www.lace.org.ar/" },
  },
  {
    icon: "🧠",
    tag: "Tecnología",
    title: "Healthtech: Emprender en Neurología",
    desc: "Evento de tecnología en neurología junto al Corlab para promover los desarrollos vinculados a la epilepsia. Un espacio de encuentro entre emprendedores, investigadores y la comunidad.",
    link: null,
  },
  {
    icon: "🌍",
    tag: "Internacional",
    title: "International Bureau for Epilepsy (IBE)",
    desc: "Somos capítulo asociado del IBE, la organización internacional de referencia en epilepsia, lo que nos permite conectar con la comunidad global y participar en iniciativas internacionales.",
    link: { label: "Conocer el IBE", href: "https://www.ibe-epilepsy.org/" },
  },
  {
    icon: "🏛️",
    tag: "Legislativo",
    title: "Senado de la Nación Argentina",
    desc: "Llevamos la voz de la comunidad al Senado de la Nación Argentina para impulsar políticas que mejoren la calidad de vida de las personas con epilepsia en el país.",
    link: null,
  },
];

export default function ColaboracionesPage() {
  return (
    <main>
      <Navbar />
      <section style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/programas" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Programas</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3">🔗 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Colaboraciones</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Trabajamos con otras organizaciones e instituciones para ampliar el impacto de la información sobre epilepsia en Argentina y Latinoamérica.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            {colaboraciones.map(({ icon, tag, title, desc, link }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <div className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-[#5c29c2]/30 hover:shadow-sm transition-all flex gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: "#f5f0ff" }}>{icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-extrabold text-lg">{title}</h3>
                      <span className="text-xs font-bold bg-[#f5f0ff] text-[#5c29c2] px-2.5 py-1 rounded-full">{tag}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
                    {link && (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5c29c2] hover:underline">
                        {link.label} →
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h3 className="font-extrabold text-2xl mb-3">¿Querés colaborar con nosotros?</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Si representás una institución, empresa o tenés una propuesta de colaboración, escribinos. Exploramos juntos cómo podemos trabajar.</p>
            <Link href="/contacto" className="inline-block font-bold px-6 py-3 rounded-xl transition-all text-sm"
              style={{ background: "#5c29c2", color: "white" }}>
              Escribinos →
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}