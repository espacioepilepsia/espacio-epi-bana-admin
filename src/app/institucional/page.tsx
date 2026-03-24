// RUTA: src/app/institucional/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
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

type Member = { id: string; name: string; role: string; bio: string | null; photo_url: string | null; };

export default function InstitucionalPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    supabase.from("team_members").select("id,name,role,bio,photo_url").eq("is_active", true).order("display_order").then(({ data }) => setMembers(data ?? []));
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
          <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-4 mt-4">Sobre nosotros</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">Quiénes Somos</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed text-center">En Espacio Epilepsia trabajamos para transformar la manera en que la epilepsia es comprendida y vivida.</p>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">En <strong>Espacio Epilepsia</strong> trabajamos para transformar la manera en que la epilepsia es comprendida y vivida. Nacimos desde una experiencia personal que se convirtió en una causa colectiva: visibilizar, educar y acompañar desde la empatía y el conocimiento.</p>
              <p className="leading-relaxed mb-6">Somos una comunidad compuesta por personas con epilepsia, familiares, profesionales de la salud, comunicadores, diseñadores, educadores y voluntarios comprometidos. Nuestro propósito es claro: <strong>derribar estigmas y construir espacios de inclusión, autonomía y representación real</strong>.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HISTORIA, MISIÓN, VISIÓN */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn>
              <div className="bg-white rounded-2xl p-7 border border-[#5c29c2]/10 h-full">
                <div className="text-3xl mb-4">📖</div>
                <h2 className="text-xl font-extrabold mb-4">Nuestra Historia</h2>
                <p className="text-gray-600 text-sm leading-relaxed">Todo comenzó con una pregunta: <strong>¿por qué hay tan poca información accesible, en español, para personas con epilepsia?</strong> Desde Córdoba, Argentina, y a partir de una experiencia de vida, creamos este espacio.</p>
                <p className="text-gray-600 text-sm leading-relaxed mt-3">Desde entonces, desarrollamos numerosas campañas en redes sociales, participamos en foros internacionales, llevamos la voz de la comunidad al Senado de la Nación, y nos consolidamos como capítulo asociado del <strong>International Bureau for Epilepsy (IBE)</strong>.</p>
              </div>
            </FadeIn>
            <div className="flex flex-col gap-4">
              <FadeIn delay={80}>
                <div className="bg-white rounded-2xl p-6 border border-[#5c29c2]/10">
                  <div className="text-2xl mb-3">🎯</div>
                  <h3 className="font-extrabold mb-2">Misión</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Mejorar la calidad de vida de las personas con epilepsia y enfermedades crónicas, a través de la información, el empoderamiento y la construcción de comunidad.</p>
                </div>
              </FadeIn>
              <FadeIn delay={160}>
                <div className="bg-white rounded-2xl p-6 border border-[#5c29c2]/10">
                  <div className="text-2xl mb-3">🌟</div>
                  <h3 className="font-extrabold mb-2">Visión</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Un mundo donde cada persona con epilepsia pueda vivir sin prejuicios ni barreras, con plena participación social y acceso a oportunidades reales.</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold mb-8">Valores</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "🤝", title: "Participación", desc: "Diseñado por y para la comunidad." },
              { icon: "🌈", title: "Inclusión", desc: "Creamos espacios seguros que están abiertos a todas las personas y todas las verdades." },
              { icon: "💪", title: "Compromiso", desc: "Creemos en la construcción de una comunidad basada en la confianza y el sentido de responsabilidad." },
              { icon: "🧠", title: "Empoderamiento", desc: "Entendemos que el conocimiento es empoderador. Valoramos todas las oportunidades de aprender y construir aprendizaje." },
              { icon: "🔗", title: "Colaboración", desc: "Creemos en la colaboración con otras instituciones para el desarrollo mutuo." },
              { icon: "🔍", title: "Transparencia", desc: "Manejamos la información con respeto, confidencialidad y responsabilidad." },
            ].map(({ icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 60}>
                <div className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-5 hover:border-[#5c29c2]/30 transition-colors">
                  <div className="text-2xl mb-2">{icon}</div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="py-16 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-white mb-8">Qué hacemos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Educación y formación para pacientes, familias y profesionales",
                "Redes de apoyo emocional y espacios de escucha",
                "Difusión de información médica validada y accesible",
                "Campañas para visibilizar la epilepsia y reducir el estigma",
                "Voluntariado interdisciplinario",
                "Recursos digitales, eventos, charlas y materiales educativos",
              ].map((item, i) => (
                <div key={i} className="bg-white/10 border border-white/15 rounded-xl px-5 py-3 flex gap-3 items-start">
                  <span style={{ color: "#29f0b4" }} className="font-bold flex-shrink-0">✓</span>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* EQUIPO */}
      {members.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl font-extrabold mb-3">Equipo</h2>
              <p className="text-gray-500 mb-8">Somos un grupo de personas con epilepsia, madres y padres de personas con epilepsia, y profesionales de la salud comprometidos con eliminar los estigmas.</p>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {members.map((m, i) => (
                <FadeIn key={m.id} delay={i * 60}>
                  <div className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-6 text-center hover:border-[#5c29c2]/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-[#5c29c2]/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {m.photo_url
                        ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                        : <span className="text-2xl font-extrabold text-[#5c29c2]">{m.name.charAt(0)}</span>
                      }
                    </div>
                    <h3 className="font-bold mb-1">{m.name}</h3>
                    <p className="text-xs font-semibold text-[#5c29c2] mb-2">{m.role}</p>
                    {m.bio && <p className="text-xs text-gray-500 leading-relaxed">{m.bio}</p>}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CÓMO PARTICIPAR + CONTACTO */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn>
              <div>
                <h2 className="text-2xl font-extrabold mb-4">Cómo podés participar</h2>
                <p className="text-gray-600 leading-relaxed mb-5">Formá parte del cambio. Podés colaborar como voluntario/a en áreas como comunicación, eventos, salud, legal, diseño o finanzas. También podés sumar tu testimonio, ser parte de campañas o ayudarnos a llegar más lejos.</p>
                <Link href="/sumate" className="inline-block bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all">
                  Sumate al equipo →
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div>
                <h2 className="text-2xl font-extrabold mb-4">Contacto Institucional</h2>
                <div className="space-y-3">
                  <a href="mailto:contacto@espacioepilepsia.org" className="flex items-center gap-3 bg-white border border-[#5c29c2]/15 rounded-xl px-5 py-4 hover:border-[#5c29c2]/40 transition-colors">
                    <span className="text-xl">📩</span>
                    <span className="text-sm font-semibold text-gray-700">contacto@espacioepilepsia.org</span>
                  </a>
                  <a href="https://espacioepilepsia.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white border border-[#5c29c2]/15 rounded-xl px-5 py-4 hover:border-[#5c29c2]/40 transition-colors">
                    <span className="text-xl">🌐</span>
                    <span className="text-sm font-semibold text-gray-700">www.espacioepilepsia.org</span>
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}