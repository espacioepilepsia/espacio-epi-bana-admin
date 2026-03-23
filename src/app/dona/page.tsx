// RUTA: src/app/dona/page.tsx
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

const donationOptions = [
  { icon: "🔄", title: "Donación mensual", desc: "Acompañanos todo el año con un aporte recurrente. Con tu apoyo podemos planificar mejor nuestras actividades a largo plazo.", cta: "Donar mensualmente", href: "https://linktr.ee/espacioepilepsia" },
  { icon: "❤️", title: "Donación única", desc: "Cualquier monto suma y marca la diferencia. Vos elegís cuándo y cuánto donar.", cta: "Hacer donación", href: "https://linktr.ee/espacioepilepsia" },
  { icon: "✉️", title: "Otras formas", desc: "Donación en especie, servicios profesionales o patrocinio institucional.", cta: "Escribinos", href: "mailto:contacto@espacioepilepsia.org" },
];

const impactRows = [
  { amount: "$20.000", desc: "Ayudanos a desarrollar un video testimonial sobre epilepsia, compartiendo experiencias reales que inspiran a otros" },
  { amount: "$40.000", desc: "Ayudanos a diseñar y distribuir materiales educativos sobre cómo asistir correctamente a personas durante una crisis epiléptica" },
  { amount: "$80.000", desc: "Ayudanos a brindar una charla educativa en vivo sobre epilepsia para cientos de personas, rompiendo mitos y creando conciencia" },
];

export default function DonaPage() {
  return (
    <main>
      <Navbar />

      {/* HERO */}
      <section style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wider">💜 Ayudanos a crecer</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Doná y sembrá conciencia 💜</h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">En Fundación Espacio Epilepsia trabajamos cada día para que las personas con epilepsia vivan con más información, más autonomía, menos estigma y más herramientas para enfrentar los desafíos cotidianos.</p>
        </div>
      </section>

      {/* CON TU APORTE */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-extrabold mb-8 text-center">Con tu aporte, podés ayudarnos a seguir generando impacto real</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {[
                { icon: "🎤", text: "Ofrecemos charlas abiertas, capacitaciones, talleres y materiales gratuitos para personas con epilepsia y sus familias" },
                { icon: "🎉", text: "Organizamos eventos presenciales y virtuales que acercan contenidos valiosos sobre epilepsia y calidad de vida" },
                { icon: "🎬", text: "Producimos contenidos audiovisuales accesibles, con historias reales y voces de nuestra comunidad" },
                { icon: "🤝", text: "Acompañamos a quienes recién reciben el diagnóstico y no saben por dónde empezar" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex gap-4 items-start bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-5">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* FORMAS DE DONAR */}
          <FadeIn delay={100}>
            <h2 className="text-2xl font-extrabold mb-6 text-center">Formas de donar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {donationOptions.map(({ icon, title, desc, cta, href }, i) => (
                <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col shadow-sm hover:border-[#5c29c2]/30 hover:shadow-md transition-all">
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="font-extrabold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">{desc}</p>
                  <a href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                    className="block text-center font-bold py-3 rounded-xl transition-all text-sm"
                    style={{ background: "#29f0b4", color: "#5c29c2" }}>
                    {cta} →
                  </a>
                </div>
              ))}
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
          <FadeIn delay={200}>
            <h2 className="text-2xl font-extrabold mb-6 text-center">¿Por qué donar a nuestra fundación?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                { icon: "🔍", title: "Transparencia", desc: "Somos una organización sin fines de lucro, transparente y liderada por personas con epilepsia y sus familias. Compartimos informes anuales de nuestras actividades." },
                { icon: "🏛️", title: "Independencia", desc: "No estamos afiliados a clínicas, laboratorios ni partidos políticos. Nuestra independencia nos permite trabajar exclusivamente por los intereses de la comunidad." },
                { icon: "💥", title: "Impacto directo", desc: "Cada peso se invierte en proyectos que visibilizan, acompañan y empoderan a la comunidad. Podés ver exactamente cómo tu donación hace la diferencia." },
                { icon: "📊", title: "Rendición de cuentas", desc: "Publicamos anualmente nuestros estados financieros y reportes de impacto. Cada donante recibe información detallada sobre cómo su contribución se transformó en acciones concretas." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="text-2xl mb-2">{icon}</div>
                  <h3 className="font-bold mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

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
    </main>
  );
}