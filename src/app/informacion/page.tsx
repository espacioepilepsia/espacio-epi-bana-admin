// RUTA: src/app/informacion/page.tsx
// REEMPLAZÁ el contenido actual completo con este
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

function useInView(ref: React.RefObject<HTMLElement>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
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

function AnimatedStat({ target, suffix, label, prefix = "+" }: {
  target: number; suffix: string; label: string; prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  function formatNumber(n: number) {
    if (suffix === "M") return Math.floor(n / 1000000) + "M";
    if (suffix === "K") return Math.floor(n / 1000) + "K";
    if (suffix === "%") return n + "%";
    return n.toString();
  }

  return (
    <div ref={ref} className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
      <div className="text-5xl font-extrabold text-[#5c29c2] mb-2 tabular-nums">
        {prefix}<span>{formatNumber(count)}</span>
      </div>
      <div className="text-sm text-gray-500 leading-snug">{label}</div>
    </div>
  );
}

export default function InformacionPage() {
  return (
    <main>
      <Navbar />
      <section style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Aprendé sobre epilepsia</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">Información sobre epilepsia</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Todo lo que tenés que saber si estás comenzando a conocer el mundo de la epilepsia. Información clara, confiable y en español.</p>
        </div>
      </section>

      {/* QUÉ ES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">¿Qué es la epilepsia?</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4">Según la OMS, la epilepsia es una <strong>enfermedad cerebral crónica no transmisible</strong> que afecta a unos 50 millones de personas en todo el mundo. Se caracteriza por convulsiones recurrentes, que son episodios breves de movimiento involuntario que pueden involucrar una parte del cuerpo (parcial) o todo el cuerpo (generalizado) y en ocasiones se acompañan de pérdida de conciencia.</p>
            <p className="text-base text-gray-600 leading-relaxed mb-8">Las convulsiones se deben a descargas eléctricas excesivas en un grupo de células cerebrales. Pueden ir desde episodios muy breves de ausencia hasta convulsiones prolongadas y graves.</p>

            {/* CONTADORES ANIMADOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <AnimatedStat target={50000000} suffix="M" label="personas en el mundo conviven con epilepsia" prefix="+" />
              <AnimatedStat target={70} suffix="%" label="podría vivir sin crisis con tratamiento adecuado" prefix="+" />
              <AnimatedStat target={500000} suffix="K" label="personas con epilepsia en Argentina" prefix="+" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ESTIGMA */}
      <section className="py-16 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">Hablemos de estigma</h2>
            <div className="bg-white border-l-4 border-[#5c29c2] rounded-r-2xl p-6 mb-6">
              <p className="text-base text-gray-600 leading-relaxed">Según la OMS, <strong>el estigma en la epilepsia es más difícil de llevar que los síntomas propios de la enfermedad</strong>. Esto significa que las personas con epilepsia tienen menor acceso a la educación, salud y trabajo.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: "🎓", title: "Educación", desc: "Muchas personas con epilepsia enfrentan barreras para acceder a todos los niveles educativos." },
                { icon: "💼", title: "Trabajo", desc: "El estigma puede impedir el acceso a empleos, aunque la ley argentina lo prohíbe." },
                { icon: "🏥", title: "Salud", desc: "El miedo al estigma lleva a muchos pacientes a ocultar su diagnóstico." },
                { icon: "👥", title: "Vida social", desc: "El aislamiento social es una consecuencia frecuente del estigma." },
              ].map(({ icon, title, desc }, i) => (
                <FadeIn key={title} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-5 border border-[#5c29c2]/10 hover:border-[#5c29c2]/30 transition-colors">
                    <div className="text-2xl mb-3">{icon}</div>
                    <h3 className="font-bold mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CRISIS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">¿Qué es una crisis de epilepsia?</h2>
            <div className="bg-[#f5f0ff] rounded-2xl p-6 mb-8 border border-[#5c29c2]/10">
              <p className="text-sm text-[#5c29c2] font-bold mb-2">Según la Dra. Ma. del Carmen García</p>
              <p className="text-base text-gray-600 leading-relaxed italic">"Una crisis de epilepsia es un cuadro clínico que se produce por una descarga eléctrica anormal de las neuronas, que puede manifestarse de diferentes formas dependiendo del lugar del cerebro donde se originan. La más conocida es la convulsión tonico-clónica generalizada, pero puede haber otros tipos como las crisis de ausencias."</p>
            </div>
            <h3 className="font-bold text-lg mb-4">Tipos de crisis más comunes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Convulsión tónico-clónica", desc: "La más conocida. Involucra rigidez muscular seguida de movimientos convulsivos en todo el cuerpo." },
                { title: "Crisis de ausencia", desc: "Episodios breves de pérdida de conciencia, la persona parece 'desconectarse' por unos segundos." },
                { title: "Crisis focal", desc: "Afecta solo una parte del cuerpo según el área cerebral involucrada." },
                { title: "Espasmos epilépticos", desc: "Contracciones bruscas del tronco y extremidades, más frecuentes en bebés y niños pequeños." },
              ].map(({ title, desc }, i) => (
                <FadeIn key={title} delay={i * 80}>
                  <div className="border border-gray-100 rounded-xl p-5 hover:border-[#5c29c2]/30 transition-colors">
                    <h4 className="font-bold text-sm mb-1 text-[#5c29c2]">{title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* NAVEGACIÓN */}
      <section className="py-16 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn><h2 className="text-2xl font-extrabold text-white mb-8 text-center">Seguí aprendiendo</h2></FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tag: "Emergencias", title: "Primeros auxilios", desc: "Cómo actuar ante una crisis epiléptica.", href: "/informacion/primeros-auxilios" },
              { tag: "Marco legal", title: "Tus derechos", desc: "La ley argentina protege tus derechos.", href: "/informacion/derechos" },
              { tag: "FAQ", title: "Preguntas frecuentes", desc: "Respondemos las dudas más comunes.", href: "/informacion/preguntas-frecuentes" },
            ].map(({ tag, title, desc, href }, i) => (
              <FadeIn key={href} delay={i * 80}>
                <Link href={href} className="bg-white/10 border border-white/20 rounded-2xl p-6 block hover:bg-white/20 transition-all group">
                  <p className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wide mb-2">{tag}</p>
                  <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-4">{desc}</p>
                  <span className="text-white/80 text-sm font-bold">Ver más →</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}