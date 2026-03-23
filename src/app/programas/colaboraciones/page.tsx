// RUTA: src/app/programas/colaboraciones/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ColaboracionesPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/programas" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Programas</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3">🔗 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Colaboraciones</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Trabajamos con otras organizaciones e instituciones para ampliar el impacto de la información sobre epilepsia en Argentina y Latinoamérica.</p>
        </div>
      </section>
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: "🧠", title: "Healthtech: Emprender en Neurología", desc: "Evento de tecnología en neurología junto al Corlab para promover los desarrollos vinculados a la epilepsia." },
              { icon: "🌍", title: "International Bureau for Epilepsy", desc: "Somos capítulo asociado del IBE, la organización internacional de referencia en epilepsia." },
              { icon: "🏛️", title: "Senado de la Nación Argentina", desc: "Llevamos la voz de la comunidad al Senado para impulsar políticas que mejoren la calidad de vida de las personas con epilepsia." },
              { icon: "🤝", title: "Organizaciones aliadas", desc: "Colaboramos con una red de más de 30 organizaciones de epilepsia en Argentina y Latinoamérica." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <h3 className="font-bold text-lg mb-3">¿Querés colaborar con nosotros?</h3>
            <p className="text-gray-500 text-sm mb-5">Escribinos y exploramos cómo podemos trabajar juntos.</p>
            <Link href="/contacto" className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all inline-block">Escribinos →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}