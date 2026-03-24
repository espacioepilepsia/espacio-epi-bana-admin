// RUTA: src/app/sumate/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sumáte al Equipo | Espacio Epilepsia",
  description:
    "¿Querés hacer la diferencia? Sumáte como voluntario o colaborador a Espacio Epilepsia. Buscamos personas comprometidas con la concientización sobre epilepsia en Argentina.",
  keywords: [
    "voluntariado epilepsia argentina",
    "colaborar espacio epilepsia",
    "sumarse fundación epilepsia",
    "voluntario salud argentina",
  ],
  alternates: { canonical: "https://espacioepilepsia.org/sumate" },
  openGraph: {
    title: "Sumáte al Equipo | Espacio Epilepsia",
    description:
      "Formá parte de la comunidad y ayudanos a concientizar sobre epilepsia en Argentina.",
    url: "https://espacioepilepsia.org/sumate",
    type: "website",
  },
};

export default function SumateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
