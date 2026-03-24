// RUTA: src/app/programas/colaboraciones/page.tsx
"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import FadeIn from "@/components/FadeIn";

const colaboraciones = [
  {
    icon: "🏥",
    tag: "2021",
    title: "Semana de la Epilepsia 2021",
    desc: "En el marco del “Día Latinoamericano de la Epilepsia”. organizamos junto a la Sociedad Neurológica Argentina la Semana de la Epilepsia, donde se realizaron charlas en Vivo con diversos profesionales de neurología.",
    link: { label: "Canal de Instagram", href: "https://www.instagram.com/semana_de_la_epilepsia/" },
  },

  {
    icon: "🏥",
    tag: "2022",
    title: "Semana de la Epilepsia 2022",
    desc: "En el marco del “Día Latinoamericano de la Epilepsia”. organizamos junto a la Sociedad Neurológica Argentina, la Liga Argentina Contra la Epilepsia y la Young Epilepsy Section de la ILAE la Semana de la Epilepsia, donde se realizaron charlas en Vivo con diversos profesionales de neurología.",
    link: { label: "Canal de Instagram", href: "https://www.instagram.com/semana_de_la_epilepsia/" },
    videoId: "dQiNixBOK6Y",
  },

  {
    icon: "🏆",
    tag: "2021",
    title: "Congreso LACE",
    desc: "En el marco del Congreso 2021 de la LIGA LATINOAMERICANA CONTRA LA EPILEPSIA, brindamos una charla sobre innovación y epilepsia centrada en el paciente. Asimismo, realizamos una charla con los doctores María del Carmen García y Santiago Flesler sobre la relación Médico – Paciente.",
    link: { label: "Ver LACE", href: "https://www.lace.org.ar/" },
  },
];

export default function ColaboracionesPage() {
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
          <div className="inline-flex items-center gap-2 bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-4">🔗 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Colaboraciones</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed text-center">Trabajamos con otras organizaciones e instituciones para ampliar el impacto de la información sobre epilepsia en Argentina y Latinoamérica.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            {colaboraciones.map(({ icon, tag, title, desc, link, videoId }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <div className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-[#5c29c2]/30 hover:shadow-sm transition-all flex flex-col md:flex-row gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: "#f5f0ff" }}>{icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-extrabold text-lg">{title}</h3>
                      <span className="text-xs font-bold bg-[#f5f0ff] text-[#5c29c2] px-2.5 py-1 rounded-full">{tag}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>

                    {videoId && (
                      <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-black mb-5" style={{ paddingTop: "56.25%" }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                          title={`Video ${title}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

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