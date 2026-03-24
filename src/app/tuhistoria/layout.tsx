// RUTA: src/app/tuhistoria/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contanos Tu Historia | Espacio Epilepsia",
  description:
    "Compartí tu historia de vida con epilepsia. Tu testimonio puede ayudar a otras personas a sentirse menos solas y a romper el estigma. Enviá tu experiencia a nuestra comunidad.",
  keywords: [
    "historia de vida epilepsia",
    "testimonio epilepsia argentina",
    "compartir experiencia epilepsia",
    "estigma epilepsia",
    "comunidad epilepsia",
  ],
  alternates: { canonical: "https://espacioepilepsia.org/tuhistoria" },
  openGraph: {
    title: "Contanos Tu Historia | Espacio Epilepsia",
    description:
      "Tu testimonio puede ayudar a otros. Compartí tu historia de vida con epilepsia.",
    url: "https://espacioepilepsia.org/tuhistoria",
    type: "website",
  },
};

export default function TuHistoriaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
