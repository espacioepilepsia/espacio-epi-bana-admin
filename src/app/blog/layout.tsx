// RUTA: src/app/blog/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Espacio Epilepsia",
  description:
    "Artículos, novedades y noticias sobre epilepsia en Argentina. Información, historias de la comunidad y novedades del mundo de la neurología.",
  keywords: [
    "blog epilepsia",
    "noticias epilepsia argentina",
    "artículos epilepsia",
    "epilepsia novedades",
    "comunidad epilepsia",
  ],
  alternates: { canonical: "https://espacioepilepsia.org/blog" },
  openGraph: {
    title: "Blog | Espacio Epilepsia",
    description:
      "Artículos, novedades y noticias sobre epilepsia en Argentina.",
    url: "https://espacioepilepsia.org/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
