"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Reveal } from "@/components/Reveal";

type HomeOrganization = {
  id: string;
  name: string;
  logo_url: string | null;
};

export function HomeOrganizationsSkeleton() {
  return (
    <section className="bg-[var(--ee-bg-light)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="h-7 w-60 animate-pulse rounded bg-black/10" />
        <div className="mt-3 h-4 w-[520px] max-w-full animate-pulse rounded bg-black/10" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[78px] animate-pulse rounded-2xl border border-black/5 bg-white p-5"
            >
              <div className="mx-auto h-5 w-3/4 rounded bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeOrganizations() {
  const [organizations, setOrganizations] = useState<HomeOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: qErr } = await supabase
          .from("organizations")
          .select("id,name,logo_url,is_active")
          .eq("is_active", true);

        if (cancelled) return;

        if (qErr) {
          setError(qErr.message);
          setOrganizations([]);
          return;
        }

        setOrganizations(((data ?? []) as HomeOrganization[]) ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Error inesperado.");
        setOrganizations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-[var(--ee-bg-light)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Organizaciones
          </h2>
        </Reveal>
        <Reveal delayMs={80}>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ee-text-secondary)] md:text-base">
            Redes y organizaciones activas que trabajan por una vida con más
            apoyo y menos estigma.
          </p>
        </Reveal>
        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-[var(--ee-text-secondary)]">
              Cargando organizaciones...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              No pudimos cargar organizaciones en este momento.
              <div className="mt-1 text-xs opacity-80">{error}</div>
            </div>
          ) : organizations.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-[var(--ee-text-secondary)]">
              No hay organizaciones activas para mostrar.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {organizations.map((o, idx) => (
                <Reveal key={o.id} delayMs={idx * 40}>
                  <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                    {o.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={o.logo_url}
                        alt={o.name}
                        className="max-h-10 w-auto object-contain opacity-90"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[var(--ee-text-secondary)]">
                        {o.name}
                      </span>
                    )}
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

