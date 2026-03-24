// RUTA: src/app/informacion/preguntas-frecuentes/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Epilepsia | Espacio Epilepsia",
  description:
    "Respondemos las dudas más comunes sobre epilepsia: diagnóstico, tratamiento, medicación, conducir, embarazo, trabajo y vida cotidiana. Información accesible y confiable.",
  keywords: [
    "preguntas frecuentes epilepsia",
    "faq epilepsia",
    "epilepsia y embarazo",
    "epilepsia y conducir",
    "epilepsia y trabajo argentina",
    "qué es la epilepsia",
    "se puede curar la epilepsia",
  ],
  alternates: {
    canonical: "https://espacioepilepsia.org/informacion/preguntas-frecuentes",
  },
  openGraph: {
    title: "Preguntas Frecuentes sobre Epilepsia | Espacio Epilepsia",
    description:
      "Respondemos las dudas más comunes sobre epilepsia: diagnóstico, tratamiento, conducir, embarazo y vida diaria.",
    url: "https://espacioepilepsia.org/informacion/preguntas-frecuentes",
    type: "article",
  },
};

// FAQPage schema — vital para AI Overviews y Position 0 en Google
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es la epilepsia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La epilepsia es una enfermedad neurológica crónica que se caracteriza por crisis recurrentes, causadas por descargas eléctricas anormales en el cerebro. No es una enfermedad mental, ni una condición contagiosa. Afecta a personas de todas las edades y orígenes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es una crisis epiléptica?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Una crisis epiléptica es una alteración breve del comportamiento, la conciencia, el movimiento, las emociones o la percepción, debido a una actividad eléctrica anormal y excesiva en el cerebro. Puede durar desde unos segundos hasta pocos minutos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué causa la epilepsia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las causas pueden variar: genética, daño cerebral, infecciones, lesiones prenatales o problemas metabólicos. En muchos casos, la causa es desconocida (epilepsia idiopática), especialmente cuando el cerebro parece estructuralmente normal.",
      },
    },
    {
      "@type": "Question",
      name: "¿Se puede curar la epilepsia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En muchos casos, la epilepsia puede controlarse con tratamiento, y algunas personas pueden llegar a vivir sin crisis por años o suspender la medicación bajo supervisión médica. Sin embargo, no todos los casos pueden controlarse con medicación antiepiléptica.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se trata la epilepsia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los tratamientos incluyen medicamentos antiepilépticos (el más común), cirugía (en ciertos casos), dietas especiales como la cetogénica, y estimulación del nervio vago. El tratamiento debe ser individualizado y supervisado por un/a neurólogo/a.",
      },
    },
  ],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://espacioepilepsia.org" },
      { "@type": "ListItem", position: 2, name: "Información", item: "https://espacioepilepsia.org/informacion" },
      { "@type": "ListItem", position: 3, name: "Preguntas Frecuentes", item: "https://espacioepilepsia.org/informacion/preguntas-frecuentes" },
    ],
  },
};

export default function PreguntasFrecuentesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
