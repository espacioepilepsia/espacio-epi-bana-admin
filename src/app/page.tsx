import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { HomeEvents, HomeEventsSkeleton } from "@/components/HomeEvents";
import {
  HomeOrganizations,
  HomeOrganizationsSkeleton,
} from "@/components/HomeOrganizations";
import { NewsletterForm } from "@/components/NewsletterForm";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="text-3xl font-bold tracking-tight text-[var(--ee-primary)]">
        {value}
      </div>
      <div className="mt-1 text-sm text-[var(--ee-text-secondary)]">{label}</div>
    </div>
  );
}

function IconCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ee-bg-light)] text-[var(--ee-primary)]">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--ee-text-secondary)]">
        {description}
      </p>
    </div>
  );
}

function EducationCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--ee-primary)]/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ee-text-secondary)]">
            {description}
          </p>
        </div>
        <div className="mt-1 text-[var(--ee-primary)] transition-transform duration-300 group-hover:translate-x-0.5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 17L17 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 7H17V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      {/* 1. Hero */}
      <section className="bg-[var(--ee-dark)] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-[var(--ee-primary)]" />
              #SinEstigmas
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Una comunidad para{" "}
              <span className="text-[#a78bfa]">acompañar</span>, informar y
              transformar.
            </h1>
          </Reveal>
          <Reveal delayMs={140}>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Recursos claros, programas y espacios de encuentro para convivir
              con epilepsia con más información y menos estigma.
            </p>
          </Reveal>
          <Reveal delayMs={200}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/informacion"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--ee-dark)] transition-colors hover:bg-white/90"
              >
                Empezar por lo básico
              </Link>
              <Link
                href="/comunidad"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Sumate a la comunidad
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Stats */}
      <section className="bg-[var(--ee-bg-light)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            <Reveal>
              <Stat value="50M" label="personas viven con epilepsia en el mundo" />
            </Reveal>
            <Reveal delayMs={80}>
              <Stat value="70%" label="podría vivir sin crisis con tratamiento" />
            </Reveal>
            <Reveal delayMs={160}>
              <Stat value="500K" label="personas conviven con epilepsia en Argentina" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Qué hacemos */}
      <section className="bg-[var(--ee-bg-light)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Qué hacemos
            </h2>
          </Reveal>
          <Reveal delayMs={80}>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ee-text-secondary)] md:text-base">
              Un espacio digital para acceder a información confiable, conectar
              con organizaciones y participar de actividades.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal>
              <IconCard
                title="Información clara"
                description="Guías y recursos sobre epilepsia, mitos, primeros auxilios y acompañamiento."
                icon={
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 6H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 12H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 18H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 6H4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 12H4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 18H4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
            </Reveal>
            <Reveal delayMs={80}>
              <IconCard
                title="Programas y apoyo"
                description="Iniciativas para escuelas, familias y entornos de trabajo: aprender, prevenir, acompañar."
                icon={
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.65-7 11-7 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </Reveal>
            <Reveal delayMs={160}>
              <IconCard
                title="Comunidad y encuentros"
                description="Eventos, talleres y espacios para conectar personas, equipos de salud y organizaciones."
                icon={
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 13c-2.761 0-5 1.239-5 4v2h10v-2c0-2.761-2.239-4-5-4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 13c-1.57 0-2.988.4-4 1.104"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M21 19v-2c0-2.761-2.239-4-5-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Educación */}
      <section className="bg-[var(--ee-bg-light)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <Reveal>
            <div className="rounded-3xl bg-[var(--ee-bg-light)]">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Educación
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ee-text-secondary)] md:text-base">
                Material para aprender y compartir en familia, escuela y trabajo.
              </p>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Reveal>
              <EducationCard
                title="Primeros auxilios"
                description="Qué hacer (y qué no) ante una crisis."
                href="/informacion/primeros-auxilios"
              />
            </Reveal>
            <Reveal delayMs={80}>
              <EducationCard
                title="Mitos y verdades"
                description="Respuestas simples para cortar con la desinformación."
                href="/informacion/mitos"
              />
            </Reveal>
            <Reveal delayMs={160}>
              <EducationCard
                title="Guía para escuelas"
                description="Recomendaciones para acompañar a estudiantes."
                href="/programas/escuelas"
              />
            </Reveal>
            <Reveal delayMs={240}>
              <EducationCard
                title="Derechos y acceso"
                description="Orientación para navegar el sistema y pedir ayuda."
                href="/informacion/derechos"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Eventos */}
      <Suspense fallback={<HomeEventsSkeleton />}>
        <HomeEvents />
      </Suspense>

      {/* 6. Organizaciones */}
      <Suspense fallback={<HomeOrganizationsSkeleton />}>
        <HomeOrganizations />
      </Suspense>

      {/* 7. CTA final */}
      <section className="bg-[var(--ee-dark)] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <Reveal>
            <div className="rounded-3xl bg-white/5 p-8 md:p-10">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Construyamos una Argentina sin estigmas
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                Sumate a nuestras actividades, compartí información confiable y
                ayudanos a sostener este espacio.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/eventos"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--ee-dark)] transition-colors hover:bg-white/90"
                >
                  Ver eventos
                </Link>
                <Link
                  href="/donar"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--ee-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--ee-hover)]"
                >
                  Doná
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Newsletter */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <Reveal>
            <div className="rounded-3xl border border-black/5 bg-[var(--ee-bg-light)] p-8 md:p-10">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Newsletter
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ee-text-secondary)] md:text-base">
                Una vez por mes: recursos, novedades y próximos encuentros.
              </p>
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
