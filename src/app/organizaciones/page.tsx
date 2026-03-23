"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Organization = { id: string; name: string; logo_url: string | null; website_url: string | null; description: string | null; };

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
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function OrganizacionesPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("organizations").select("*").eq("is_active", true).order("name", { ascending: true }).then(({ data }) => {
      setOrgs(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <main>
<Navbar />
        
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Red de aliados</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Nuestras organizaciones</h1>
          <p className="text-lg text-white/70 max-w-xl leading-relaxed">Una red de organizaciones comprometidas con la epilepsia en Argentina y Latinoamérica.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : orgs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No hay organizaciones cargadas todavía.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {orgs.map((org, i) => (
                <FadeIn key={org.id} delay={i * 40}>
                  <a
                    href={org.website_url ?? "#"}
                    target={org.website_url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[100px] hover:border-[#5c29c2] hover:-translate-y-1 hover:shadow-lg transition-all group text-center"
                  >
                    {org.logo_url ? (
                      <img src={org.logo_url} alt={org.name} className="max-h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-sm font-bold text-gray-500 group-hover:text-[#5c29c2] transition-colors leading-tight">{org.name}</span>
                    )}
                    {org.description && (
                      <p className="text-xs text-gray-400 leading-tight line-clamp-2">{org.description}</p>
                    )}
                  </a>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SUMARSE */}
      <section className="py-16 px-6 text-center" style={{ background: "#5c29c2" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">¿Tu organización trabaja con epilepsia?</h2>
          <p className="text-white/70 mb-6 text-sm leading-relaxed">Sumate a nuestra red y llegá a más personas que conviven con epilepsia en Argentina.</p>
          <Link href="/contacto" className="bg-white text-[#5c29c2] font-bold px-6 py-3 rounded-xl hover:bg-[#a78bfa] hover:text-white transition-all inline-block">
            Escribinos →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}