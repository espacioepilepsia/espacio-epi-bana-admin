// RUTA: src/app/programas/capacitaciones/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function CapacitacionesPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link href="/programas" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">← Volver a Programas</Link>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 mt-3">🎓 Programas</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Capacitaciones</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Brindamos capacitaciones junto a instituciones de primer nivel para profesionales, familias y organizaciones.</p>
        </div>
      </section>
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {["Fundación Favaloro","Sociedad Argentina de Neurología","Liga Argentina de Epilepsia"].map(inst => (
              <div key={inst} className="bg-[#f5f0ff] border border-[#5c29c2]/10 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">🏛️</div>
                <p className="font-semibold text-sm text-gray-700">{inst}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-3">¿Tu institución quiere capacitarse?</h2>
            <p className="text-gray-500 text-sm mb-6">Escribinos y coordinamos una capacitación a medida para tu equipo o institución.</p>
            <Link href="/contacto" className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all inline-block">Solicitar capacitación →</Link>
          </div>
        </div>
      </section>
     <Footer />
    </main>
  );
}