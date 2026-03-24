// RUTA: src/app/dona/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doná | Espacio Epilepsia",
  description:
    "Apoyá a Espacio Epilepsia con tu donación. Con tu aporte sostenemos espacios de información, contención y concientización sobre epilepsia en Argentina. Cada contribución hace la diferencia.",
  keywords: [
    "donar epilepsia argentina",
    "apoyar fundación epilepsia",
    "donación espacioepilepsia",
    "ayudar personas con epilepsia",
  ],
  alternates: { canonical: "https://espacioepilepsia.org/dona" },
  openGraph: {
    title: "Doná — Apoyá a Espacio Epilepsia",
    description:
      "Con tu donación sostenemos información, comunidad y concientización sobre epilepsia en Argentina.",
    url: "https://espacioepilepsia.org/dona",
    type: "website",
  },
};

export default function DonaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
