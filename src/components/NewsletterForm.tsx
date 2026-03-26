"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { EDGE_FUNCTIONS } from "@/lib/edge-functions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Ingresá tu email.");
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: trimmed });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // Sync to Perfit (fire-and-forget)
      fetch(EDGE_FUNCTIONS.perfit, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, list: "newsletter" }),
      }).catch(() => {});

      fetch(EDGE_FUNCTIONS.sendEmail, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "espacioepilepsia.arg@gmail.com",
          subject: "Formulario Web Newsletter",
          text: `Nuevo registro en Newsletter:\nEmail: ${trimmed}`,
        }),
      }).catch(() => {});

      setEmail("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="newsletter-email">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        className="h-11 w-full rounded-full border border-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-[var(--ee-primary)]/40"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--ee-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--ee-hover)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Enviando..." : "Suscribirme"}
      </button>
      <div className="sm:basis-full">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : success ? (
          <p className="text-sm text-emerald-700">¡Gracias por sumarte!</p>
        ) : null}
      </div>
    </form>
  );
}

