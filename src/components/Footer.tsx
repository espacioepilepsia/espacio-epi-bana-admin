// RUTA: src/components/Footer.tsx
// REEMPLAZÁ el contenido actual completo con este
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type SocialLinks = {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
};

const defaultSocials: SocialLinks = {
  instagram: "https://www.instagram.com/espacioepilepsia/",
  facebook: "https://www.facebook.com/espacioepilepsia/",
  youtube: "https://www.youtube.com/@EspacioEpilepsia",
  linkedin: "https://www.linkedin.com/company/espacio-epilepsia",
};

const socials = [
  {
    key: "instagram" as keyof SocialLinks,
    label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    key: "facebook" as keyof SocialLinks,
    label: "Facebook",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    key: "youtube" as keyof SocialLinks,
    label: "YouTube",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "linkedin" as keyof SocialLinks,
    label: "LinkedIn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setStatus("err"); return; }
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setStatus(error ? "err" : "ok");
    if (!error) {
      // Sync to Perfit list 37 (fire-and-forget)
      fetch("/api/perfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, list: "newsletter" }),
      }).catch(() => {});
      setEmail("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
        placeholder="tu@email.com"
        autoComplete="off"
        data-lpignore="true"
        className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-full px-5 py-3 text-sm outline-none focus:border-white/50 transition-colors"
      />
      <button
        type="submit"
        className="font-bold px-6 py-3 rounded-full text-sm transition-all whitespace-nowrap"
        style={{ background: "#29f0b4", color: "#5c29c2" }}
      >
        {status === "ok" ? "✓ ¡Suscripto!" : "Enviar"}
      </button>
      {status === "err" && (
        <p className="text-red-300 text-xs mt-1">Email inválido.</p>
      )}
    </form>
  );
}

export default function Footer() {
  const [links, setLinks] = useState<SocialLinks>(defaultSocials);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("id,value")
      .in("id", ["social_instagram", "social_facebook", "social_youtube", "social_linkedin"])
      .then(({ data }) => {
        if (!data) return;
        const updated = { ...defaultSocials };
        data.forEach(({ id, value }: { id: string; value: string }) => {
          if (id === "social_instagram") updated.instagram = value;
          if (id === "social_facebook") updated.facebook = value;
          if (id === "social_youtube") updated.youtube = value;
          if (id === "social_linkedin") updated.linkedin = value;
        });
        setLinks(updated);
      });
  }, []);

  return (
    <footer style={{ background: "#5c29c2" }}>

      {/* NEWSLETTER */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#29f0b4" }}>
              #SINESTIGMAS
            </h2>
            <p className="text-white/70">Suscribite para enterarte de todas las novedades</p>
          </div>
          <div>
            <p className="text-sm font-bold text-white/90 uppercase tracking-widest mb-3">📬 Suscribite al newsletter</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* LINKS */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* MARCA */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.png"
                alt="Espacio Epilepsia"
                width={160}
                height={50}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Plataforma digital de información y comunidad sobre epilepsia en Argentina.
            </p>
            <div className="flex gap-2 flex-wrap">
              {socials.map(({ key, label, icon }) => (
                <a
                  key={key}
                  href={links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 transition-all hover:text-[#5c29c2]"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#29f0b4";
                    e.currentTarget.style.color = "#5c29c2";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* INFORMACIÓN */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wide">Información</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[
                ["¿Qué es la epilepsia?", "/informacion"],
                ["Primeros auxilios", "/informacion/primeros-auxilios"],
                ["Tus derechos", "/informacion/derechos"],
                ["Preguntas frecuentes", "/informacion/preguntas-frecuentes"],
              ].map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* PROGRAMAS */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wide">Programas</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[
                ["Charlas online", "/programas/charlas"],
                ["Capacitaciones", "/programas/capacitaciones"],
                ["Congresos", "/programas/congresos"],
                ["Colaboraciones", "/programas/colaboraciones"],
                ["Institucional", "/institucional"],
              ].map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* COMUNIDAD */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wide">Comunidad</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[
                ["Blog", "/blog"],
                ["Tu historia", "/tuhistoria"],
                ["Sumate", "/sumate"],
                ["Eventos", "/eventos"],
                ["Organizaciones", "/organizaciones"],
                ["Tienda", "/tienda"],
                ["Doná", "/dona"],
                ["Contacto", "/contacto"],
              ].map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-4">
          <span className="text-xs text-white/40">
            © 2025 Espacio Epilepsia® · Todos los derechos reservados
          </span>
          <a
            href="https://cerrolab.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span className="text-xs text-white/40">Desarrollado por</span>
            <span className="font-bold text-sm" style={{ color: "#29f0b4" }}>
              CerroLab
            </span>
          </a>
        </div>
      </div>

    </footer>
  );
}