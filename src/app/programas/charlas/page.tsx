// RUTA: src/app/programas/charlas/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function CharlasPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/programas" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Programas</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3">💬 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Charlas online</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Charlas en vivo por Instagram y otras plataformas con profesionales de la salud, personas con epilepsia y sus familias.</p>
        </div>
      </section>
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-xl font-bold mb-3">Próximas charlas</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Las charlas se anuncian en nuestras redes sociales. Seguinos en Instagram para no perderte ninguna.</p>
            <a href="https://www.instagram.com/espacioepilepsia/" target="_blank" rel="noopener noreferrer"
              className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all inline-block">
              Seguir en Instagram →
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}