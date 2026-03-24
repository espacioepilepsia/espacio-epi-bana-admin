// RUTA: src/app/informacion/primeros-auxilios/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primeros Auxilios en Crisis Epilépticas | Espacio Epilepsia",
  description:
    "Aprendé qué hacer y qué NO hacer durante una crisis epiléptica convulsiva o de ausencia. Guía práctica avalada por la Liga Argentina contra la Epilepsia.",
  keywords: [
    "primeros auxilios epilepsia",
    "qué hacer durante una crisis epiléptica",
    "cómo ayudar a alguien con epilepsia",
    "crisis convulsiva qué hacer",
    "acciones durante crisis epiléptica argentina",
  ],
  alternates: {
    canonical: "https://espacioepilepsia.org/informacion/primeros-auxilios",
  },
  openGraph: {
    title: "Primeros Auxilios en Crisis Epilépticas | Espacio Epilepsia",
    description:
      "Guía clara de qué hacer y qué no hacer durante una crisis epiléptica.",
    url: "https://espacioepilepsia.org/informacion/primeros-auxilios",
    type: "article",
  },
};

const medicalPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Primeros Auxilios en Crisis Epilépticas",
  url: "https://espacioepilepsia.org/informacion/primeros-auxilios",
  description:
    "Guía práctica sobre cómo actuar durante una crisis epiléptica convulsiva o de ausencia.",
  inLanguage: "es-AR",
  medicalAudience: [
    { "@type": "MedicalAudience", audienceType: "Patient" },
    { "@type": "MedicalAudience", audienceType: "Caregiver" },
  ],
  about: {
    "@type": "MedicalCondition",
    name: "Epilepsia",
    alternateName: ["Crisis epiléptica", "Epilepsy"],
  },
  publisher: {
    "@type": "Organization",
    name: "Espacio Epilepsia",
    url: "https://espacioepilepsia.org",
  },
  reviewedBy: {
    "@type": "Organization",
    name: "Liga Argentina Contra la Epilepsia (LACE)",
    url: "https://www.lace.org.ar/",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://espacioepilepsia.org" },
      { "@type": "ListItem", position: 2, name: "Información", item: "https://espacioepilepsia.org/informacion" },
      { "@type": "ListItem", position: 3, name: "Primeros Auxilios", item: "https://espacioepilepsia.org/informacion/primeros-auxilios" },
    ],
  },
};

export default function PrimerosAuxiliosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalPageSchema) }}
      />
      {children}
    </>
  );
}
