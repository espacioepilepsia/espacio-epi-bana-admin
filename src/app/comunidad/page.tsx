// RUTA: src/app/comunidad/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ComunidadPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Comunidad</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Comunidad Espacio Epilepsia</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Un espacio para compartir, aprender y acompañarse. Porque la epilepsia se lleva mejor en comunidad.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "✍️", title: "Blog", desc: "Artículos, novedades y contenido educativo sobre epilepsia escrito por nuestra comunidad y profesionales.", href: "/blog", cta: "Ver artículos" },
              { icon: "💬", title: "Tu historia", desc: "Contanos tu experiencia con la epilepsia. Cada historia que compartís ayuda a romper estigmas y a que otros se sientan menos solos.", href: "/tuhistoria", cta: "Compartir mi historia" },
              { icon: "🤝", title: "Sumate", desc: "Formá parte del equipo como voluntario/a. Hay lugar en comunicación, salud, eventos, diseño, legal y más.", href: "/sumate", cta: "Quiero sumarme" },
            ].map(({ icon, title, desc, href, cta }) => (
              <div key={title} className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{icon}</div>
                <h2 className="text-xl font-extrabold mb-3">{title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{desc}</p>
                <Link href={href} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all inline-block">{cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6" style={{ background: "#5c29c2" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Seguinos en Instagram</h2>
          <p className="text-white/70 leading-relaxed mb-6 max-w-xl mx-auto">Charlas en vivo, historias reales, información útil y mucho más. La comunidad más activa de epilepsia en Argentina.</p>
          <a href="https://www.instagram.com/espacioepilepsia/" target="_blank" rel="noopener noreferrer"
            className="bg-white text-[#5c29c2] font-bold px-8 py-3 rounded-xl hover:bg-[#a78bfa] hover:text-white transition-all inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            @espacioepilepsia
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}