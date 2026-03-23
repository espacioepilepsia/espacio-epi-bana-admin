"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type TeamMember = { id: string; name: string; role: string; bio: string | null; photo_url: string | null; display_order: number; };

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

export default function InstitucionalPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    supabase.from("team_members").select("*").eq("is_active", true).order("display_order", { ascending: true }).then(({ data }) => setTeam(data ?? []));
  }, []);

  const valores = [
    { icon: "🤝", title: "Participación", desc: "Diseñado por y para la comunidad." },
    { icon: "🌍", title: "Inclusión", desc: "Creamos espacios seguros abiertos a todas las personas." },
    { icon: "💪", title: "Compromiso", desc: "Construcción de comunidad basada en la confianza y responsabilidad." },
    { icon: "📚", title: "Empoderamiento", desc: "El conocimiento es empoderador. Valoramos todas las oportunidades de aprender." },
    { icon: "🔗", title: "Colaboración", desc: "Creemos en la colaboración con otras instituciones para el desarrollo mutuo." },
  ];

  return (
    <main>
<Navbar />
         
      {/* HERO */}
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Sobre nosotros</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">Quiénes somos</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">En Espacio Epilepsia trabajamos para transformar la manera en que la epilepsia es comprendida y vivida.</p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">Nuestra historia</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4">Todo comenzó con una pregunta: <strong>¿por qué hay tan poca información accesible, en español, para personas con epilepsia?</strong> Desde Córdoba, Argentina, y a partir de una experiencia de vida, creamos este espacio para compartir saberes, vivencias y apoyo.</p>
            <p className="text-base text-gray-600 leading-relaxed mb-6">Desde entonces, hemos desarrollado numerosas campañas en redes sociales, participado en foros internacionales, llevado la voz de la comunidad al Senado de la Nación Argentino, y nos hemos consolidado como capítulo asociado del <strong>International Bureau for Epilepsy (IBE)</strong>.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[["IBE", "Capítulo asociado Internacional"], ["Senado", "Presencia en la Nación"], ["1000+", "Inscriptos en Epifest"], ["#1", "Plataforma de epilepsia en AR"]].map(([num, label], i) => (
                <FadeIn key={num} delay={i * 80}>
                  <div className="bg-[#f5f0ff] rounded-2xl p-5 text-center border border-[#5c29c2]/10">
                    <div className="text-xl font-extrabold text-[#5c29c2] mb-1">{num}</div>
                    <div className="text-xs text-gray-500 leading-tight">{label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <FadeIn>
            <div className="bg-white rounded-2xl p-8 border border-[#5c29c2]/10 h-full">
              <div className="text-3xl mb-4">🎯</div>
              <h2 className="text-2xl font-extrabold mb-3">Misión</h2>
              <p className="text-gray-600 leading-relaxed">Mejorar la calidad de vida de las personas con epilepsia y enfermedades crónicas, a través de la información, el empoderamiento y la construcción de comunidad.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="bg-white rounded-2xl p-8 border border-[#5c29c2]/10 h-full">
              <div className="text-3xl mb-4">🌟</div>
              <h2 className="text-2xl font-extrabold mb-3">Visión</h2>
              <p className="text-gray-600 leading-relaxed">Un mundo donde cada persona con epilepsia pueda vivir sin prejuicios ni barreras, con plena participación social y acceso a oportunidades reales.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-10">Nuestros valores</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {valores.map(({ icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#5c29c2]/20 hover:bg-[#f5f0ff] transition-all">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      {team.length > 0 && (
        <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10">Nuestro equipo</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <FadeIn key={member.id} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 border border-[#5c29c2]/10 text-center hover:-translate-y-1 transition-all">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-[#5c29c2]/10 flex items-center justify-center">
                      {member.photo_url
                        ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                        : <span className="text-2xl font-extrabold text-[#5c29c2]">{member.name.charAt(0)}</span>
                      }
                    </div>
                    <h3 className="font-bold text-base mb-1">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#5c29c2] mb-3 uppercase tracking-wide">{member.role}</p>
                    {member.bio && <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTICIPAR */}
      <section className="py-16 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-white mb-4">¿Cómo podés participar?</h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-2xl">Podés colaborar como voluntario/a en áreas como comunicación, eventos, salud, legal, diseño o finanzas. También podés sumar tu testimonio, ser parte de campañas o ayudarnos a llegar más lejos.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sumate" className="bg-white text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:bg-[#a78bfa] hover:text-white transition-all">Sumate como voluntario/a</Link>
              <Link href="/contacto" className="bg-transparent text-white font-bold px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all">Escribinos</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-extrabold mb-4">Contacto institucional</h2>
            <div className="flex flex-col gap-2">
              <a href="mailto:contacto@espacioepilepsia.org" className="text-[#5c29c2] font-semibold hover:underline">📩 contacto@espacioepilepsia.org</a>
              <a href="https://espacioepilepsia.org" className="text-[#5c29c2] font-semibold hover:underline">🌐 www.espacioepilepsia.org</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}