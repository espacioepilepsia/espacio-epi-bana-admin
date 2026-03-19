import Link from "next/link";

const nav = [
  { label: "Información", href: "/informacion" },
  { label: "Programas", href: "/programas" },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Eventos", href: "/eventos" },
  { label: "Organizaciones", href: "/organizaciones" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-[#111827] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <div className="text-lg font-bold tracking-tight text-white">
            Espacio Epilepsia
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/70">
            Plataforma digital de información y comunidad sobre epilepsia en
            Argentina.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M17.5 6.5H17.51"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Facebook"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 8H16V5H14C11.7909 5 10 6.79086 10 9V11H8V14H10V21H13V14H16L17 11H13V9C13 8.44772 13.4477 8 14 8Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="X"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 6H6L16 18H18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold text-white">Navegación</div>
          <nav className="flex flex-col gap-2">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold text-white">Contacto</div>
          <div className="space-y-2 text-sm text-white/70">
            <p>Argentina</p>
            <p>
              Email:{" "}
              <a
                className="text-white/80 underline-offset-4 hover:underline"
                href="mailto:hola@espacioepilepsia.org"
              >
                hola@espacioepilepsia.org
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Espacio Epilepsia</p>
          <p className="font-semibold text-white">#SinEstigmas</p>
        </div>
      </div>
    </footer>
  );
}

