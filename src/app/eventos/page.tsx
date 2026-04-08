"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Event = { id: string; title: string; description: string | null; event_date: string; location: string | null; image_url: string | null; registration_url: string | null; };

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

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("es-AR", { day: "2-digit" }),
    month: d.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""),
    year: d.getFullYear(),
    full: d.toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    time: d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function EventosPage() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date().toISOString();
    Promise.all([
      supabase.from("events").select("*").eq("is_published", true).gt("event_date", now).order("event_date", { ascending: true }),
      supabase.from("events").select("*").eq("is_published", true).lte("event_date", now).order("event_date", { ascending: false }).limit(6),
    ]).then(([{ data: u }, { data: p }]) => {
      setUpcoming(u ?? []);
      setPast(p ?? []);
      setLoading(false);
    });
  }, []);

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
          <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-3">Agenda</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Eventos</h1>
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">Charlas, congresos, capacitaciones y encuentros de la comunidad de Espacio Epilepsia.</p>
        </div>
      </section>

      {/* PRÓXIMOS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn><h2 className="text-2xl font-extrabold mb-8">Próximos eventos</h2></FadeIn>
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-[#f5f0ff] rounded-2xl">
              <p className="text-lg font-semibold mb-2">No hay eventos próximos publicados</p>
              <p className="text-sm">¡Seguinos en Instagram para enterarte de las novedades!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcoming.map((ev, i) => {
                const date = formatDate(ev.event_date);
                return (
                  <FadeIn key={ev.id} delay={i * 80}>
                    <div className="flex gap-5 items-center p-6 border-[1.5px] border-[#5c29c2]/10 rounded-2xl hover:border-[#5c29c2] hover:bg-[#f5f0ff] transition-all">
                      {ev.image_url && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#5c29c2]/15 bg-white flex-shrink-0">
                          <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-xl p-3 text-center min-w-[72px] flex-shrink-0">
                        <div className="text-2xl font-extrabold text-[#5c29c2] leading-none">{date.day}</div>
                        <div className="text-xs font-bold text-[#5c29c2] uppercase tracking-wide mt-0.5">{date.month}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{date.year}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base mb-1">{ev.title}</h3>
                        {ev.description && <p className="text-sm text-gray-500 mb-2 leading-relaxed line-clamp-2">{ev.description}</p>}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                          {ev.location && <span>📍 {ev.location}</span>}
                          <span>🕐 {date.time} hs</span>
                        </div>
                      </div>
                      {ev.registration_url && (
                        <a href={ev.registration_url} target="_blank" rel="noopener noreferrer"
                          className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all flex-shrink-0 whitespace-nowrap">
                          Inscribirse →
                        </a>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PASADOS */}
      {past.length > 0 && (
        <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
          <div className="max-w-6xl mx-auto">
            <FadeIn><h2 className="text-2xl font-extrabold mb-8 text-gray-400">Eventos anteriores</h2></FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {past.map((ev, i) => {
                const date = formatDate(ev.event_date);
                return (
                  <FadeIn key={ev.id} delay={i * 60}>
                    <div className="bg-white rounded-xl p-5 border border-gray-100 opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex gap-4 items-start">
                        <div className="text-center min-w-[52px] flex-shrink-0">
                          <div className="text-lg font-extrabold text-gray-400 leading-none">{date.day}</div>
                          <div className="text-xs text-gray-400 uppercase">{date.month} {date.year}</div>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm mb-1 text-gray-600">{ev.title}</h3>
                          {ev.location && <p className="text-xs text-gray-400">📍 {ev.location}</p>}
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
