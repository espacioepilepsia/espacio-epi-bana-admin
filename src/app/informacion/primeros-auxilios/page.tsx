"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

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

export default function PrimerosAuxiliosPage() {
  const pasos = [
    { num: "1", color: "#10b981", title: "Mantené la calma", desc: "La mayoría de las crisis epilépticas terminan solas en 1 a 3 minutos. Tu calma ayuda a los que están alrededor." },
    { num: "2", color: "#5c29c2", title: "Mirá el reloj", desc: "Anotá la hora en que comenzó la crisis. Si dura más de 5 minutos, llamá al 107 (SAME) o al servicio de emergencias local." },
    { num: "3", color: "#5c29c2", title: "Protegé la cabeza", desc: "Colocá algo suave bajo la cabeza (una campera doblada, una mochila). Aflojá ropa ajustada alrededor del cuello." },
    { num: "4", color: "#5c29c2", title: "Girá a la persona de costado", desc: "Ubícala en posición lateral de seguridad para evitar que se ahogue con saliva. Hacelo con cuidado." },
    { num: "5", color: "#5c29c2", title: "Despejá el entorno", desc: "Alejá objetos duros o peligrosos que puedan lastimar a la persona durante los movimientos convulsivos." },
    { num: "6", color: "#f59e0b", title: "Quedáte hasta que se recupere", desc: "Permanecé junto a la persona. Después de la crisis puede estar confundida o somnolenta. Hablale con calma y esperá que se recupere." },
  ];

  const noHacer = [
    "No sujetés a la persona para inmovilizarla",
    "No metás nada en su boca — NO se tragan la lengua",
    "No le des agua ni medicación durante la crisis",
    "No la dejés sola hasta que esté completamente consciente",
    "No hagas RCP a menos que no respire después de la crisis",
  ];

  return (
    <main>
<Navbar />
        
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/informacion" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">
            ← Volver a Información
          </Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3 tracking-wider">
            🚨 Emergencias
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">Primeros auxilios en crisis epilépticas</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Saber cómo actuar ante una crisis puede hacer una gran diferencia. Esta información puede salvar vidas.</p>
        </div>
      </section>

      {/* ALERTA */}
      <section className="py-8 px-6 bg-[#fef3c7] border-b border-yellow-200">
        <div className="max-w-4xl mx-auto flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-yellow-900 mb-1">Llamá al 107 si la crisis dura más de 5 minutos</p>
            <p className="text-sm text-yellow-800 leading-relaxed">También si la persona no recupera la conciencia, tiene dificultad para respirar, se lastima o tiene otra crisis inmediatamente.</p>
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-10">Qué hacer paso a paso</h2>
          </FadeIn>
          <div className="flex flex-col gap-4">
            {pasos.map((paso, i) => (
              <FadeIn key={paso.num} delay={i * 80}>
                <div className="flex gap-5 items-start p-6 rounded-2xl border border-gray-100 hover:border-[#5c29c2]/20 hover:bg-[#f5f0ff] transition-all">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0" style={{ background: paso.color }}>
                    {paso.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">{paso.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{paso.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* NO HACER */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">Qué NO hacer</h2>
            <p className="text-gray-500 mb-8">Estas acciones pueden empeorar la situación o lastimar a la persona.</p>
            <div className="flex flex-col gap-3">
              {noHacer.map((item, i) => (
                <FadeIn key={i} delay={i * 60}>
                  <div className="flex items-start gap-4 bg-white border border-red-100 rounded-xl p-5">
                    <span className="text-red-500 font-extrabold text-xl flex-shrink-0">✗</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* COMPARTIR */}
      <section className="py-16 px-6 text-center" style={{ background: "#5c29c2" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">Compartí esta información</h2>
          <p className="text-white/70 mb-6 text-sm leading-relaxed">Cuantas más personas sepan cómo actuar ante una crisis epiléptica, más segura es nuestra comunidad.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="https://wa.me/?text=Aprendé%20cómo%20actuar%20ante%20una%20crisis%20epiléptica%3A%20https%3A%2F%2Fespacioepilepsia.org%2Finformacion%2Fprimeros-auxilios" target="_blank" rel="noopener noreferrer"
              className="bg-white text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:bg-[#a78bfa] hover:text-white transition-all flex items-center gap-2 text-sm">
              Compartir por WhatsApp
            </a>
            <Link href="/informacion" className="bg-transparent text-white font-bold px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all text-sm">
              Ver más información
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}