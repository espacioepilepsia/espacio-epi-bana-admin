import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section
        className="min-h-screen flex items-center justify-center px-6 text-center"
        style={{ background: "#5c29c2" }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Big 404 */}
          <p
            className="text-[120px] md:text-[180px] font-extrabold leading-none select-none"
            style={{ color: "#29f0b4", opacity: 0.2 }}
            aria-hidden="true"
          >
            404
          </p>

          {/* Icon */}
          <div className="text-6xl -mt-8 mb-6">💜</div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Esta página no existe
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            No encontramos lo que estabas buscando, pero no estás solo/a.{" "}
            <span className="text-[#29f0b4] font-semibold">Espacio Epilepsia</span> siempre está acá.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="bg-[#29f0b4] text-[#5c29c2] font-extrabold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Ir al inicio
            </Link>
            <Link
              href="/informacion"
              className="bg-white/10 text-white font-bold px-8 py-4 rounded-full border border-white/30 hover:bg-white/20 transition-all"
            >
              Ver Información
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto">
            {[
              { label: "Blog", href: "/blog" },
              { label: "Doná", href: "/dona" },
              { label: "Súmate", href: "/sumate" },
              { label: "Contacto", href: "/contacto" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold text-white/60 hover:text-[#29f0b4] transition-colors py-2"
              >
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
