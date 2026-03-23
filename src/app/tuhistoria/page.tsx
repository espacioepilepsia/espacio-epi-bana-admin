// RUTA: src/app/tuhistoria/page.tsx
// REEMPLAZÁ el contenido actual completo con este
"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function TuHistoriaPage() {
  const [form, setForm] = useState({ name: "", story: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.story) return;
    setStatus("loading");
    const { error } = await supabase.from("stories").insert({ name: form.name, story: form.story });
    setStatus(error ? "err" : "ok");
    if (!error) setForm({ name: "", story: "" });
  }

  return (
    <main>
      <Navbar />
      <section className="pt-[70px]" style={{ background: "#5c29c2" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Comunidad</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Tu historia</h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">Contamos historias de personas con epilepsia que estudian, trabajan, son madres, padres, tienen días buenos y malos ¡Como todos! Compartí la tuya.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-6 mb-10">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>¿Por qué compartir tu historia?</strong> Cada testimonio ayuda a que otras personas se sientan menos solas, reduce el estigma y demuestra que con epilepsia se puede tener una vida plena.
            </p>
          </div>

          {status === "ok" ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-3">¡Gracias por compartir tu historia!</h2>
              <p className="text-gray-500 mb-6">La revisamos y pronto va a estar visible en nuestra comunidad.</p>
              <button onClick={() => setStatus("idle")} className="text-[#5c29c2] font-bold hover:underline text-sm">Enviar otra historia</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-2xl font-extrabold">Contanos tu historia</h2>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tu nombre (o seudónimo) *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                  placeholder="¿Cómo querés que te llamemos?" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tu historia *</label>
                <textarea required value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} rows={10}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors resize-none"
                  placeholder="Contanos tu experiencia con la epilepsia..." />
                <p className="text-xs text-gray-400 mt-1">{form.story.length} caracteres</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 leading-relaxed">
                Tu historia será revisada por nuestro equipo antes de ser publicada. Podés usar un seudónimo si preferís mantener tu privacidad.
              </div>
              {status === "err" && <p className="text-red-500 text-sm">Ocurrió un error. Intentá de nuevo.</p>}
              <button type="submit" disabled={status === "loading"}
                className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50">
                {status === "loading" ? "Enviando..." : "Compartir mi historia"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}