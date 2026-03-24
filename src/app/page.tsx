// RUTA: src/app/page.tsx
// REEMPLAZÁ el contenido actual completo con este
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import TestimonialsSection from "@/components/TestimonialsSection";

type Event = { id: string; title: string; event_date: string; location: string | null; registration_url: string | null; };


function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("es-AR", { day: "2-digit" }),
    month: d.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""),
  };
}

const queHacemos = [
  { icon: "/images/icono-1.png", text: "Brindamos información amigable sobre epilepsia" },
  { icon: "/images/icono-2.png", text: "Brindamos capacitaciones a otras instituciones aliadas" },
  { icon: "/images/icono-3.png", text: "Realizamos entrevistas a profesionales de la salud" },
  { icon: "/images/icono-4.png", text: "Generamos herramientas, guías y descargables vinculados a Epilepsia" },
  { icon: "/images/icono-5.png", text: "Organizamos eventos y congresos referidos a la temática" },
  { icon: "/images/icono-6.png", text: "Acercamos a la comunidad a personas que investigan sobre neurología" },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const now = new Date().toISOString();
    supabase
      .from("events")
      .select("id,title,event_date,location,registration_url")
      .eq("is_published", true)
      .gt("event_date", now)
      .order("event_date", { ascending: true })
      .limit(6)
      .then(({ data }) => setEvents(data ?? []));
  }, []);

  useEffect(() => {
    if (events.length <= 1) return;
    const t = setInterval(() => setCarouselIdx(i => (i + 1) % events.length), 4000);
    return () => clearInterval(t);
  }, [events]);

  return (
    <>
      <style>{`
        @keyframes underlineSlide {
          0% { width: 0; left: 0; }
          50% { width: 100%; left: 0; }
          100% { width: 0; left: 100%; }
        }
        @keyframes underlinePulse {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(1.05); opacity: 0.85; }
        }
        .underline-anim { position: relative; display: inline-block; }
        .underline-anim::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          width: 100%; height: 4px; background: #29f0b4;
          border-radius: 2px; animation: underlinePulse 2s ease-in-out infinite;
        }
        .underline-anim-slide { position: relative; display: inline-block; }
        .underline-anim-slide::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          height: 4px; background: #29f0b4; border-radius: 2px;
          animation: underlineSlide 3s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.08); }
          50% { transform: scale(1); }
          75% { transform: scale(1.04); }
        }
        .heart-beat { animation: heartbeat 2s ease-in-out infinite; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .carousel-slide { animation: fadeInUp 0.5s ease; }
      `}</style>

      <main className="overflow-x-hidden">

        <Navbar />

        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center px-6 text-center pt-16 pb-12" style={{ background: "#5c29c2" }}>
          <div className="max-w-4xl mx-auto">
            <div className="heart-beat inline-block mb-8">
              <Image src="/images/icon-heart.png" alt="" width={150} height={150} className="mx-auto" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">
              Bienvenidos a la comunidad de{" "}
              <span className="underline-anim" style={{ color: "#29f0b4" }}>Espacio Epilepsia</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-10">
              Espacio Epilepsia es una plataforma digital con el objetivo de{" "}
              <span className="underline-anim-slide font-bold text-white">informar</span>, compartir experiencias y{" "}
              <span className="underline-anim-slide font-bold text-white">contener</span> a las personas con epilepsia, sus familiares y amigos.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Link href="/informacion"
                className="bg-white text-[#5c29c2] font-black px-8 py-4 text-lg rounded-full hover:bg-[#29f0b4] hover:text-[#5c29c2] hover:scale-105 active:scale-95 transition-all shadow-lg">
                Conocé más
              </Link>
              <Link href="/sumate"
                className="bg-transparent text-white font-black px-8 py-4 text-lg rounded-full border-2 border-white/40 hover:bg-white/10 hover:border-white transition-all">
                Sumate a la comunidad
              </Link>
            </div>
          </div>
        </section>

        {/* QUÉ HACEMOS */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
                ¿Qué <span className="underline-anim" style={{ color: "#5c29c2" }}>hacemos?</span>
              </h2>
              <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
                Todo lo que hacemos está orientado a mejorar la calidad de vida de las personas con epilepsia.
              </p>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {queHacemos.map(({ icon, text }, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className="flex flex-col items-center text-center gap-4 p-4 group hover:-translate-y-1 transition-transform">
                    <div className="w-32 h-32 flex items-center justify-center">
                      <Image src={icon} alt={text} width={128} height={128}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="font-bold text-base text-gray-800 leading-snug">{text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CONTENCIÓN */}
        <section className="py-20 px-6" style={{ background: "#f3f3f3" }}>
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-5">
                Creamos espacios de{" "}
                <span className="underline-anim" style={{ color: "#5c29c2" }}>contención</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Acercamos a las personas con epilepsia, creando comunidades, grupos de WhatsApp, realizando charlas en vivo en Instagram. Contamos historias de personas con epilepsia que estudian, trabajan, son madres, padres, tienen días buenos y malos ¡Cómo todos! Y muchas actividades más...
              </p>
              <Link href="/sumate"
                className="inline-block bg-[#f97316] text-white font-bold px-8 py-3 rounded-full hover:bg-[#ea580c] transition-all text-lg shadow-md hover:scale-105">
                ¡Sumate a la comunidad!
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <TestimonialsSection />

        {/* VIDEO YOUTUBE */}
        <section className="py-20 px-6" style={{ background: "#5c29c2" }}>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-3">
                <span className="underline-anim-slide" style={{ color: "#29f0b4" }}>Epilepsia</span> en primera persona
              </h2>
              <p className="text-white/70 text-center mb-10 text-lg">
                Un espacio para compartir información y experiencias sobre epilepsia
              </p>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/oq21HaG76kI"
                  title="Espacio Epilepsia"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CARRUSEL DE EVENTOS */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
                <span className="underline-anim" style={{ color: "#5c29c2" }}>Eventos</span>
              </h2>
              <p className="text-gray-500 text-center mb-10">No te pierdas de nuestros próximos eventos</p>
            </FadeIn>

            {events.length === 0 ? (
              <FadeIn>
                <div className="text-center py-12 bg-[#f5f0ff] rounded-2xl">
                  <p className="text-gray-500 mb-4">No hay eventos publicados próximos por ahora.</p>
                  <p className="text-sm text-gray-400">Seguinos en Instagram para enterarte de las novedades.</p>
                </div>
              </FadeIn>
            ) : (
              <FadeIn>
                <div className="relative">
                  <div key={carouselIdx} className="carousel-slide bg-[#5c29c2] rounded-2xl p-8 md:p-12 text-white text-center">
                    <div className="inline-flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-extrabold leading-none">{formatDate(events[carouselIdx].event_date).day}</div>
                        <div className="text-sm font-bold uppercase tracking-wide opacity-80">{formatDate(events[carouselIdx].event_date).month}</div>
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">{events[carouselIdx].title}</h3>
                    {events[carouselIdx].location && (
                      <p className="text-white/70 mb-6 text-base">📍 {events[carouselIdx].location}</p>
                    )}
                    {events[carouselIdx].registration_url && (
                      <a href={events[carouselIdx].registration_url!} target="_blank" rel="noopener noreferrer"
                        className="inline-block bg-[#29f0b4] text-[#5c29c2] font-bold px-8 py-3 rounded-full hover:opacity-90 transition-all">
                        Inscribirse →
                      </a>
                    )}
                  </div>

                  {events.length > 1 && (
                    <div className="flex justify-center gap-2 mt-5">
                      {events.map((_, i) => (
                        <button key={i} onClick={() => setCarouselIdx(i)}
                          className={`h-2.5 rounded-full transition-all ${i === carouselIdx ? "bg-[#5c29c2] w-6" : "bg-gray-300 w-2.5 hover:bg-gray-400"}`} />
                      ))}
                    </div>
                  )}

                  {events.length > 1 && (
                    <>
                      <button onClick={() => setCarouselIdx(i => (i - 1 + events.length) % events.length)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center shadow hover:bg-gray-50 transition-all hidden md:flex">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="#5c29c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button onClick={() => setCarouselIdx(i => (i + 1) % events.length)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center shadow hover:bg-gray-50 transition-all hidden md:flex">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#5c29c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </>
                  )}
                </div>
                <div className="text-center mt-6">
                  <Link href="/eventos" className="text-sm font-bold text-[#5c29c2] hover:underline">
                    Ver todos los eventos →
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </section>

        <Footer />

      </main>
    </>
  );
}