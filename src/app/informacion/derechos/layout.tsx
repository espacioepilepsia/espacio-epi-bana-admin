// RUTA: src/app/informacion/derechos/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Derechos de Personas con Epilepsia en Argentina | Espacio Epilepsia",
  description:
    "Conocé tus derechos: Ley Nacional de Epilepsia N° 25.404, discapacidad, trabajo, educación, salud y conducción en Argentina. Información legal accesible para la comunidad.",
  keywords: [
    "derechos personas con epilepsia argentina",
    "ley de epilepsia argentina",
    "ley 25404",
    "epilepsia y discapacidad",
    "epilepsia y trabajo argentina",
    "licencia de conducir epilepsia argentina",
    "epilepsia y educación",
  ],
  alternates: {
    canonical: "https://espacioepilepsia.org/informacion/derechos",
  },
  openGraph: {
    title: "Derechos de Personas con Epilepsia en Argentina | Espacio Epilepsia",
    description:
      "Ley 25.404, discapacidad, trabajo, educación y más derechos de la comunidad con epilepsia en Argentina.",
    url: "https://espacioepilepsia.org/informacion/derechos",
    type: "article",
  },
};

const legalPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Derechos de Personas con Epilepsia en Argentina",
  url: "https://espacioepilepsia.org/informacion/derechos",
  description:
    "Información sobre los derechos legales de personas con epilepsia en Argentina, incluyendo la Ley Nacional 25.404.",
  inLanguage: "es-AR",
  about: [
    { "@type": "MedicalCondition", name: "Epilepsia" },
    { "@type": "Thing", name: "Ley Nacional de Epilepsia 25.404" },
  ],
  publisher: {
    "@type": "Organization",
    name: "Espacio Epilepsia",
    url: "https://espacioepilepsia.org",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://espacioepilepsia.org" },
      { "@type": "ListItem", position: 2, name: "Información", item: "https://espacioepilepsia.org/informacion" },
      { "@type": "ListItem", position: 3, name: "Derechos", item: "https://espacioepilepsia.org/informacion/derechos" },
    ],
  },
};

export default function DerechosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalPageSchema) }}
      />
      {children}
    </>
  );
}
