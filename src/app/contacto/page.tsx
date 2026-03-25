"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => { setLoadTime(Date.now()); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    // Antigravity Bot Protection
    const timeElapsed = Date.now() - loadTime;
    if (form.honeypot || timeElapsed < 3000) {
      console.warn("Bot detected or submission too fast");
      setStatus("ok");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.from("contact_messages").insert({ name: form.name, email: form.email, phone: form.phone || null, message: form.message || null });
    setStatus(error ? "err" : "ok");
    if (!error) {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "espacioepilepsia.arg@gmail.com",
          subject: "Formulario Web Contacto",
          text: `Nuevo mensaje de Contacto:\nNombre: ${form.name}\nEmail: ${form.email}\nTel: ${form.phone}\nMensaje: ${form.message}`,
        }),
      }).catch(() => {});
      setForm({ name: "", email: "", phone: "", message: "", honeypot: "" });
    }
  }

  return (
    <main>
<Navbar />
      <div className="bg-[#5c29c2] pt-[72px]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link href="/" className="text-white/80 text-sm hover:text-white transition-colors inline-flex items-center gap-1 font-medium">← Volver al Inicio</Link>
        </div>
      </div>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-3">Escribinos</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Contacto</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed text-center">¿Tenés una consulta, querés colaborar o simplemente decir hola? Estamos acá.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* FORMULARIO */}
          <div>
            <h2 className="text-2xl font-extrabold mb-6">Envianos un mensaje</h2>
            {status === "ok" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-lg mb-2 text-green-800">¡Mensaje enviado!</h3>
                <p className="text-sm text-green-700">Te respondemos a la brevedad. ¡Gracias por escribirnos!</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-[#5c29c2] font-bold hover:underline">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nombre y apellido *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                    placeholder="Tu nombre completo" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                    placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Teléfono <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                    placeholder="+54 9 11 1234-5678" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Consulta <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors resize-none"
                    placeholder="Contanos en qué podemos ayudarte..." />
                </div>
                {/* Bot protection */}
                <div className="hidden" aria-hidden="true">
                  <input type="text" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} tabIndex={-1} autoComplete="off" />
                </div>

                {status === "err" && <p className="text-red-500 text-sm">Ocurrió un error. Intentá de nuevo.</p>}
                <button type="submit" disabled={status === "loading"}
                  className="bg-[#5c29c2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#7c3aed] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === "loading" ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>

          {/* INFO */}
          <div>
            <h2 className="text-2xl font-extrabold mb-6">Información de contacto</h2>
            <div className="flex flex-col gap-4 mb-8">
              <a href="mailto:contacto@espacioepilepsia.org" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#5c29c2]/30 hover:bg-[#f5f0ff] transition-all">
                <div className="w-10 h-10 bg-[#f5f0ff] rounded-xl flex items-center justify-center text-[#5c29c2] flex-shrink-0">📩</div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-[#5c29c2]">contacto@espacioepilepsia.org</p>
                </div>
              </a>
            </div>
            <h3 className="font-bold mb-4 text-gray-700">Seguinos en redes</h3>
            <div className="flex flex-col gap-2">
              {[
                { 
                  label: "Instagram", 
                  href: "https://www.instagram.com/espacioepilepsia/", 
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                },
                { 
                  label: "Facebook", 
                  href: "https://www.facebook.com/espacioepilepsia/", 
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                },
                { 
                  label: "YouTube", 
                  href: "https://www.youtube.com/@EspacioEpilepsia", 
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
                },
                { 
                  label: "LinkedIn", 
                  href: "https://www.linkedin.com/company/espacio-epilepsia", 
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/></svg>
                },
              ].map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#5c29c2]/30 hover:bg-[#f5f0ff] transition-all text-sm font-semibold text-gray-600 hover:text-[#5c29c2]">
                  <span>{icon}</span>{label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}