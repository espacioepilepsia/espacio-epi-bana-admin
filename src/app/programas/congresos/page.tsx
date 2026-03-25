// RUTA: src/app/programas/congresos/page.tsx
"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import FadeIn from "@/components/FadeIn";

export default function CongresosPage() {
  const [playing, setPlaying] = useState(false);

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
          <div className="inline-flex items-center gap-2 bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-4">🏆 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Congresos</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed text-center">Organizamos eventos de referencia en epilepsia para toda la comunidad latinoamericana.</p>
        </div>
      </section>

      {/* EPIFEST */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl overflow-hidden mb-10">
              <div className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl" style={{ background: "#5c29c2" }}>⚡</div>
                  <div>
                    <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-1">1er Congreso Latinoamericano de Epilepsia</p>
                    <h2 className="text-3xl font-extrabold">Epifest!</h2>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  <strong>epifest!</strong> es el 1° congreso latinoamericano de epilepsia dirigido a la comunidad misma. Un evento único en el cual se encuentran el conocimiento científico y la experiencia de la comunidad de epilepsia para brindar herramientas para mejorar la calidad de vida y reducir los estigmas.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Más de <strong className="text-[#5c29c2]">1.000 personas</strong> se inscribieron para recibir <strong className="text-[#5c29c2]">más de 30 charlas</strong> de reconocidos neurólogos, psicólogos, especialistas en tecnología y otros profesionales vinculados a la epilepsia.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { num: "+1.000", label: "Inscriptos" },
                    { num: "+30", label: "Charlas" },
                    { num: "LATAM", label: "Alcance" },
                    { num: "Online", label: "Formato" },
                  ].map(({ num, label }) => (
                    <div key={label} className="bg-white border border-[#5c29c2]/15 rounded-xl p-4 text-center">
                      <div className="text-2xl font-extrabold text-[#5c29c2]">{num}</div>
                      <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <a href="https://epifest.com.ar/" target="_blank" rel="noopener noreferrer"
                  className="inline-block font-bold px-6 py-3 rounded-xl transition-all text-sm"
                  style={{ background: "#5c29c2", color: "white" }}>
                  Visitá la web de epifest! →
                </a>
              </div>
            </div>
          </FadeIn>

          {/* VIDEO EPIFEST */}
          <FadeIn delay={100}>
            <h3 className="text-xl font-extrabold mb-4">Conocé el evento</h3>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black" style={{ paddingTop: "56.25%" }}>
              {playing ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/videoseries?list=PLNYKlmuv1fjvtmf0fEqRF57AqTervQRv3"
                  title="Espacio Epilepsia"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button onClick={() => setPlaying(true)} className="absolute inset-0 w-full h-full group">
                  <img src="https://img.youtube.com/vi/oq21HaG76kI/hqdefault.jpg" alt="Epifest video" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#5c29c2] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRÓXIMOS CONGRESOS */}
      <section className="py-12 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h3 className="font-extrabold text-2xl text-white mb-3">¿Querés saber sobre el próximo congreso?</h3>
            <p className="text-white/70 text-sm mb-6">Suscribite al newsletter para recibir novedades antes que nadie.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/#newsletter" className="bg-[#29f0b4] text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">Suscribirme →</Link>
              <a href="https://www.instagram.com/espacioepilepsia/" target="_blank" rel="noopener noreferrer" className="bg-white/15 border border-white/25 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/25 transition-all">Seguinos en Instagram</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}