"use client";
import { useEffect, useRef, useState } from "react";

interface CommentFormProps {
  postId: string;
  postSlug: string;
  postTitle: string;
}

export default function CommentForm({ postId, postSlug, postTitle }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Anti-bot hidden field
  const [submittedAt] = useState(() => Date.now()); // Timer anti-bot
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          post_title: postTitle,
          post_slug: postSlug,
          author_name: name,
          author_email: email,
          comment_body: body,
          honeypot,
          submitted_at: submittedAt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Error al enviar el comentario.");
        setStatus("error");
      } else {
        setStatus("success");
        setName(""); setEmail(""); setBody("");
      }
    } catch {
      setErrorMsg("No se pudo conectar. Verificá tu conexión e intentá de nuevo.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">💜</div>
        <h3 className="font-extrabold text-green-800 text-lg mb-2">¡Gracias por tu comentario!</h3>
        <p className="text-green-700 text-sm">Está pendiente de aprobación y aparecerá en la nota pronto.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm text-green-600 font-bold underline underline-offset-2"
        >
          Escribir otro comentario
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot anti-bot (hidden) */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          name="website"
          placeholder="Tu sitio web"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Nombre *</label>
          <input
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] focus:ring-2 focus:ring-[#5c29c2]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Email <span className="font-normal text-gray-400">(privado, no se publica)</span></label>
          <input
            type="email"
            maxLength={200}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] focus:ring-2 focus:ring-[#5c29c2]/10 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Comentario *</label>
        <textarea
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Escribí tu comentario aquí..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] focus:ring-2 focus:ring-[#5c29c2]/10 transition-all resize-none"
        />
        <p className="text-[11px] text-gray-400 mt-1">{body.length}/2000 caracteres</p>
      </div>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-[#5c29c2] text-white font-extrabold py-3.5 rounded-xl hover:bg-[#4a1fa0] transition-all disabled:opacity-60 shadow-sm text-sm"
      >
        {status === "loading" ? "Enviando..." : "Enviar comentario"}
      </button>

      <p className="text-[11px] text-center text-gray-400">
        Los comentarios son moderados antes de publicarse. Respetamos tu privacidad.
      </p>
    </form>
  );
}
