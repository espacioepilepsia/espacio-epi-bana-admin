// RUTA: src/app/dona/page.tsx
"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";

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



const impactRows = [
  { amount: "$20.000", desc: "Ayudanos a desarrollar un video testimonial sobre epilepsia, compartiendo experiencias reales que inspiran a otros" },
  { amount: "$40.000", desc: "Ayudanos a diseñar y distribuir materiales educativos sobre cómo asistir correctamente a personas durante una crisis epiléptica" },
  { amount: "$80.000", desc: "Ayudanos a brindar una charla educativa en vivo sobre epilepsia para cientos de personas, rompiendo mitos y creando conciencia" },
];

export default function DonaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="inline-flex items-center gap-2 bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-4 tracking-wider">💜 Ayudanos a crecer</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Doná y sembrá conciencia 💜</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed text-center">En Fundación Espacio Epilepsia trabajamos cada día para que las personas con epilepsia vivan con más información, más autonomía, menos estigma y más herramientas para enfrentar los desafíos cotidianos.</p>
        </div>
      </section>

      {/* CON TU APORTE */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-gray-900 leading-tight">Con tu aporte, nos ayudás a seguir<br className="hidden md:block" /> generando impacto real</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: "🎤", text: "Ofrecemos charlas, talleres y materiales gratuitos para familias." },
                { icon: "🎉", text: "Organizamos eventos que acercan contenidos valiosos sobre salud." },
                { icon: "🎬", text: "Producimos contenidos con historias reales de nuestra comunidad." },
                { icon: "🤝", text: "Acompañamos a quienes recién reciben su diagnóstico." },
              ].map(({ icon, text }) => (
                <div key={text} className="bg-[#fcfaff] border border-[#5c29c2]/10 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#5c29c2]/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <span className="text-5xl mb-6 group-hover:scale-110 transition-transform">{icon}</span>
                  <p className="text-lg font-bold text-gray-800 leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* FORMAS DE DONAR */}
          <FadeIn delay={100}>
            <h2 className="text-2xl font-extrabold mb-6 text-center">Formas de donar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Card 1: Unica */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col shadow-sm hover:border-[#5c29c2]/30 hover:shadow-md transition-all">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="font-extrabold text-lg mb-2">Donación única</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">Cualquier monto suma. Elegí entre Mercado Pago, Cafecito o transferencia bancaria.</p>
                <button onClick={() => setIsModalOpen(true)}
                  className="block text-center font-bold py-3 rounded-xl transition-all text-sm w-full"
                  style={{ background: "#29f0b4", color: "#5c29c2" }}>
                  Ver opciones de pago →
                </button>
              </div>

              {/* Card 2: Mensual (Recomendado) */}
              <div className="bg-white border border-[#5c29c2]/30 rounded-2xl p-6 flex flex-col shadow-lg ring-2 ring-[#5c29c2]/10 hover:border-[#5c29c2]/60 hover:shadow-xl transition-all relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c29c2] text-[#29f0b4] text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase shadow-sm">
                  ✨ Recomendado
                </div>
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-extrabold text-lg mb-2">Donación mensual</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">Acompañanos todo el año con un aporte recurrente en Cafecito. Con tu apoyo podemos planificar a largo plazo.</p>
                <a href="https://cafecito.app/espacioepilepsia" target="_blank" rel="noopener noreferrer"
                  className="block text-center font-bold py-3 rounded-xl transition-all text-sm"
                  style={{ background: "#29f0b4", color: "#5c29c2" }}>
                  Suscribirse →
                </a>
              </div>

              {/* Card 3: Otras formas */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col shadow-sm hover:border-[#5c29c2]/30 hover:shadow-md transition-all">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-extrabold text-lg mb-2">Otras formas de donar</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">Explorá otras formas de colaborar como empresas, voluntarios o alianzas estratégicas.</p>
                <Link href="/contacto"
                  className="block text-center font-bold py-3 rounded-xl transition-all text-sm"
                  style={{ background: "#29f0b4", color: "#5c29c2" }}>
                  Contactanos →
                </Link>
              </div>

            </div>
          </FadeIn>

          {/* TABLA DE IMPACTO */}
          <FadeIn delay={150}>
            <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-6 mb-8">
              <h3 className="font-extrabold text-lg mb-5">¿Qué logramos con tu aporte?</h3>
              <p className="text-xs text-gray-500 mb-4">Los montos son ejemplos de referencia para mostrar el impacto de diferentes niveles de donación.</p>
              <div className="space-y-3">
                {impactRows.map(({ amount, desc }) => (
                  <div key={amount} className="flex items-start gap-4 py-3 border-b border-[#5c29c2]/10 last:border-0">
                    <span className="font-extrabold text-[#5c29c2] min-w-[90px] text-sm">{amount}</span>
                    <span className="text-sm text-gray-700 leading-relaxed">{desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">A cada donante compartimos informe anual de recaudaciones y en qué acciones específicas impactó su contribución.</p>
            </div>
          </FadeIn>

          {/* POR QUÉ DONAR */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-gray-900 leading-tight">¿Por qué donar a<br className="hidden md:block" /> nuestra fundación?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: "🔍", title: "Transparencia", desc: "Somos una organización sin fines de lucro liderada por pacientes." },
                { icon: "🏛️", title: "Independencia", desc: "No estamos afiliados a clínicas ni laboratorios farmacéuticos." },
                { icon: "💥", title: "Impacto directo", desc: "Cada aporte se invierte en proyectos que visibilizan y acompañan." },
                { icon: "📊", title: "Rendición", desc: "Publicamos anualmente nuestros estados financieros y reportes." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-[#fcfaff] border border-[#5c29c2]/10 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#5c29c2]/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
                  <h3 className="text-xl font-extrabold mb-3 text-[#5c29c2]">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

          {/* COMPARTIR */}
          <FadeIn delay={250}>
            <div className="text-center bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-8">
              <h3 className="font-extrabold text-xl mb-3">Vos también podés hacer la diferencia</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Aunque no puedas donar, podés ayudarnos compartiendo nuestro trabajo con quienes conocés.</p>
              <div className="flex gap-3 justify-center flex-wrap mb-4">
                <a href={`https://wa.me/?text=${encodeURIComponent("Conocé Espacio Epilepsia, una comunidad para personas con epilepsia: https://espacioepilepsia.org")}`} target="_blank" rel="noopener noreferrer"
                  className="bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all">
                  Compartir por WhatsApp
                </a>
                <a href="https://www.instagram.com/espacioepilepsia/" target="_blank" rel="noopener noreferrer"
                  className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">
                  Seguinos en Instagram
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4">
                <span>🛡️</span>
                <span>Transparencia total: rendimos cuenta de cada peso donado.</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-12 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Gracias por estar</h2>
          <p className="text-white/70 mb-6">Cada gesto cuenta. Cada aporte suma. Gracias por creer que otra forma de vivir con epilepsia es posible.</p>
          <p className="text-white/50 text-sm">Si tenés dudas o querés saber más sobre nuestro trabajo, escribinos a{" "}
            <a href="mailto:contacto@espacioepilepsia.org" className="text-[#29f0b4] hover:underline font-semibold">contacto@espacioepilepsia.org</a>
          </p>
        </div>
      </section>

      <Footer />
      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}