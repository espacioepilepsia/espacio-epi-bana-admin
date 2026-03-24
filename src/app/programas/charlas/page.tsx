// RUTA: src/app/programas/charlas/page.tsx
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

const charlas = [
  {
    id: "dX-GsBVyQxs",
    title: "Preguntas frecuentes sobre epilepsia",
    desc: "Conversamos con el Dr. Thomson, Director de Neurología de la Fundación INECO. Hablamos sobre epilepsia y memoria, emociones, menstruación, embarazo, cirugía, SUDEP, el estigma y la posibilidad de llevar una vida normal.",
    tag: "Neurología",
  },
  {
    id: "4aVXvRuBXnk",
    title: "Epilepsia y embarazo",
    desc: "Entrevistamos a Judiet, mamá, maestra de jardín y danzarina, con epilepsia desde los 5 años. Nos contó del embarazo, los miedos de ser mamá, las dificultades, cómo es ser maestra con epilepsia, el estudio y el amor.",
    tag: "Testimonio",
  },
  {
    id: "-RAAvTB5ihU",
    title: "Conceptos básicos de epilepsia",
    desc: "En el marco del curso 'Cuidados Básicos en Crisis Epilépticas' de Fundación Favaloro, el Dr. Alejandro Thomson, neurólogo, introdujo los conceptos básicos de epilepsia.",
    tag: "Educación",
  },
  {
    id: "YzDI-UN37yw",
    title: "Derecho y epilepsia",
    desc: "Conversamos con la Dra. María Inés Bianco, abogada especialista en derechos de personas con discapacidad. Hablamos sobre la Ley 25.404, el CUD, la cobertura de obras sociales y cómo reclamar.",
    tag: "Derechos",
  },
  {
    id: "cRMuDVl7lSY",
    title: "Bullying y epilepsia",
    desc: "Entrevistamos a Carolina, que tiene epilepsia hace años. Hablamos de epilepsia, síntomas, bullying, miedos, embarazo, sexualidad y muchas otras experiencias personales.",
    tag: "Testimonio",
  },
  {
    id: "uRh08Ma8UNE",
    title: "¿Me puedo tragar la lengua si tengo una crisis?",
    desc: "Extracto de la charla en Fundación Favaloro 'Mitos de la Epilepsia', con los Doctores Analía Calle, Alejandro Thomson y Ricardo Bertaner.",
    tag: "Mitos",
  },
];

const tagColors: Record<string, string> = {
  "Neurología": "bg-purple-100 text-purple-700",
  "Testimonio": "bg-pink-100 text-pink-700",
  "Educación": "bg-blue-100 text-blue-700",
  "Derechos": "bg-green-100 text-green-700",
  "Mitos": "bg-amber-100 text-amber-700",
};

export default function CharlasPage() {
  const [active, setActive] = useState<string | null>(null);

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
          <div className="inline-flex items-center gap-2 bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-4">💬 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Charlas online</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed text-center">Para acercar información sobre epilepsia a la comunidad, entrevistamos a personas con epilepsia, investigadores, personal de salud, abogados y todos quienes nos aportan información sobre el mundo de la epilepsia.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-gray-500 text-sm mb-10">También podés encontrar más entrevistas en nuestro{" "}
              <a href="https://www.youtube.com/@EspacioEpilepsia" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-bold hover:underline">canal de YouTube</a> e{" "}
              <a href="https://www.instagram.com/espacioepilepsia/" target="_blank" rel="noopener noreferrer" className="text-[#5c29c2] font-bold hover:underline">Instagram</a>.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {charlas.map(({ id, title, desc, tag }, i) => (
              <FadeIn key={id} delay={i * 60}>
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#5c29c2]/30 hover:shadow-lg transition-all">
                  {/* VIDEO EMBED */}
                  <div className="relative w-full bg-black rounded-t-2xl overflow-hidden" style={{ paddingTop: "56.25%" }}>
                    {active === id ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setActive(id)}
                        className="absolute inset-0 w-full h-full group"
                        style={{ background: "#000" }}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                          alt={title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-[#5c29c2] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                  {/* INFO */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tagColors[tag]}`}>{tag}</span>
                    </div>
                    <h3 className="font-extrabold text-base mb-2 leading-snug">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                    <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#5c29c2] hover:underline">
                      Ver en YouTube →
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-12 text-center bg-[#f5f0ff] rounded-2xl p-8">
              <h3 className="font-extrabold text-xl mb-3">¿Querés ver más charlas?</h3>
              <p className="text-gray-500 text-sm mb-5">Tenemos más contenido en nuestro canal de YouTube con entrevistas, charlas y eventos.</p>
              <a href="https://www.youtube.com/@EspacioEpilepsia" target="_blank" rel="noopener noreferrer"
                className="inline-block font-bold px-6 py-3 rounded-xl transition-all text-sm"
                style={{ background: "#5c29c2", color: "white" }}>
                Ir al canal de YouTube →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}