// RUTA: src/app/programas/congresos/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function CongresosPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/programas" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Programas</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3">🏆 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Congresos</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Organizamos eventos de referencia en epilepsia para la comunidad latinoamericana.</p>
        </div>
      </section>
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-5">
              <div className="text-5xl flex-shrink-0">⚡</div>
              <div>
                <h2 className="text-2xl font-extrabold mb-3">Epifest</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">El Primer Congreso Latinoamericano de Epilepsia donde más de <strong>1000 personas</strong> se inscribieron para recibir más de <strong>30 charlas</strong> de reconocidos neurólogos, psicólogos, especialistas en tecnología y otros profesionales vinculados a la epilepsia.</p>
                <a href="https://epifest.com.ar" target="_blank" rel="noopener noreferrer"
                  className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all inline-block">
                  Ver sitio de Epifest →
                </a>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <h3 className="font-bold text-lg mb-3">¿Querés saber sobre el próximo congreso?</h3>
            <p className="text-gray-500 text-sm mb-5">Suscribite al newsletter para recibir novedades.</p>
            <Link href="/#newsletter" className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all inline-block">Suscribirme →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}