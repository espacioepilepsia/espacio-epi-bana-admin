// RUTA: src/app/dona/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DonaPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wider">❤️ Ayudanos a crecer</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Doná a Espacio Epilepsia</h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">Tu donación nos permite seguir informando, acompañando y construyendo comunidad para las personas con epilepsia en Argentina.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[["📚","Información","Creamos contenido accesible y confiable sobre epilepsia en español"],["🎤","Eventos","Organizamos charlas, congresos y capacitaciones gratuitas para la comunidad"],["🤝","Comunidad","Mantenemos grupos de contención y espacios de acompañamiento activos"]].map(([icon,title,desc])=>(
              <div key={title} className="bg-[#f5f0ff] rounded-2xl p-6 text-center border border-[#5c29c2]/10">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#f5f0ff] border-2 border-[#5c29c2]/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-extrabold mb-3">Hacé tu donación</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Próximamente vas a poder donar directamente desde acá. Por ahora podés contactarnos para coordinar tu donación.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:contacto@espacioepilepsia.org?subject=Quiero%20donar" className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all">
                Contactar para donar ❤️
              </a>
              <Link href="/tienda" className="bg-white border border-[#5c29c2]/20 text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:border-[#5c29c2] transition-all">
                Ver tienda solidaria
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}