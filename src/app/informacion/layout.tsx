// RUTA: src/app/informacion/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Información | Espacio Epilepsia",
  description:
    "Información confiable y accesible sobre epilepsia: qué es, tipos de crisis, primeros auxilios, derechos y preguntas frecuentes. Recurso clave para pacientes, familias y comunidad.",
  keywords: [
    "información sobre epilepsia",
    "epilepsia qué es",
    "tipos de epilepsia",
    "derechos personas con epilepsia",
    "preguntas frecuentes epilepsia",
  ],
  alternates: { canonical: "https://espacioepilepsia.org/informacion" },
  openGraph: {
    title: "Información sobre Epilepsia | Espacio Epilepsia",
    description:
      "Recursos confiables: primeros auxilios, derechos legales, preguntas frecuentes y más sobre epilepsia en Argentina.",
    url: "https://espacioepilepsia.org/informacion",
    type: "website",
  },
};

export default function InformacionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
