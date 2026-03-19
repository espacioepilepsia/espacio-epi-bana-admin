"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Reveal } from "@/components/Reveal";

type HomeEvent = {
  id: string;
  title: string;
  event_date: string;
  location: string | null;
};

function formatArDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function HomeEventsSkeleton() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="h-7 w-52 animate-pulse rounded bg-black/10" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-black/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[118px] animate-pulse rounded-2xl border border-black/5 bg-white p-6"
            >
              <div className="h-3 w-24 rounded bg-black/10" />
              <div className="mt-3 h-4 w-3/4 rounded bg-black/10" />
              <div className="mt-3 h-3 w-1/2 rounded bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeEvents() {
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nowIso = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: qErr } = await supabase
          .from("events")
          .select("id,title,event_date,location,is_published")
          .eq("is_published", true)
          .gt("event_date", nowIso)
          .order("event_date", { ascending: true })
          .limit(3);

        if (cancelled) return;

        if (qErr) {
          setError(qErr.message);
          setEvents([]);
          return;
        }

        setEvents(((data ?? []) as HomeEvent[]) ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Error inesperado.");
        setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [nowIso]);

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <Reveal>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Próximos eventos
              </h2>
              <p className="mt-2 text-sm text-[var(--ee-text-secondary)] md:text-base">
                Actividades, talleres y encuentros para aprender y conectar.
              </p>
            </div>
            <Link
              href="/eventos"
              className="text-sm font-semibold text-[var(--ee-primary)] transition-colors hover:text-[var(--ee-hover)]"
            >
              Ver todos
            </Link>
          </div>
        </Reveal>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-[var(--ee-text-secondary)]">
              Cargando eventos...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              No pudimos cargar eventos en este momento.
              <div className="mt-1 text-xs opacity-80">{error}</div>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-[var(--ee-bg-light)] p-6 text-sm text-[var(--ee-text-secondary)]">
              No hay eventos publicados próximos por ahora.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {events.map((e, idx) => (
                <Reveal key={e.id} delayMs={idx * 80}>
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ee-primary)]">
                      {formatArDate(e.event_date)}
                    </div>
                    <h3 className="mt-2 text-base font-bold tracking-tight">
                      {e.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--ee-text-secondary)]">
                      {e.location ?? "Ubicación a confirmar"}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

