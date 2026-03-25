// RUTA: src/app/layout.tsx
// REEMPLAZÁ el contenido actual completo con este
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import FloatingDonateButton from "@/components/FloatingDonateButton";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// =============================================
// SEO — Metadata global
// =============================================
export const metadata: Metadata = {
  // Título base — cada página puede sobreescribirlo
  title: {
    default: "Espacio Epilepsia — Epilepsia en primera persona",
    template: "%s | Espacio Epilepsia",
  },
  description:
    "Plataforma digital de información, comunidad y contención sobre epilepsia en Argentina. Recursos, primeros auxilios, derechos y espacios de apoyo. #SinEstigmas",
  keywords: [
    "epilepsia argentina",
    "qué es la epilepsia",
    "crisis epiléptica",
    "primeros auxilios epilepsia",
    "comunidad epilepsia",
    "sin estigmas",
    "epilepsia tratamiento",
    "ley de epilepsia argentina",
    "espacio epilepsia",
  ],
  authors: [{ name: "Espacio Epilepsia", url: "https://espacioepilepsia.org" }],
  creator: "Espacio Epilepsia",
  publisher: "Espacio Epilepsia",
  category: "health",

  // Canonical URL base
  metadataBase: new URL("https://espacioepilepsia.org"),
  alternates: {
    canonical: "/",
  },

  // Open Graph — para redes sociales
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://espacioepilepsia.org",
    siteName: "Espacio Epilepsia",
    title: "Espacio Epilepsia — Epilepsia en primera persona",
    description:
      "Plataforma digital de información, comunidad y contención sobre epilepsia en Argentina. #SinEstigmas",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Espacio Epilepsia — Epilepsia en primera persona",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Espacio Epilepsia — Epilepsia en primera persona",
    description:
      "Plataforma digital de información y comunidad sobre epilepsia en Argentina. #SinEstigmas",
    images: ["/images/og-image.png"],
    creator: "@espacioepilepsia",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verificación Google Search Console (reemplazá con tu código real)
  verification: {
    google: "ku4wNi9JNJY_Uo-WUm8GMYY9FZA-VK_wMwYwbZabgR8",
  },

  // App info
  applicationName: "Espacio Epilepsia",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// =============================================
// GEO — Schema.org struturado
// =============================================
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Espacio Epilepsia",
  alternateName: "Espacio de Epilepsia",
  url: "https://espacioepilepsia.org",
  logo: "https://espacioepilepsia.org/images/logo.png",
  slogan: "Epilepsia en primera persona #SinEstigmas",
  description:
    "Plataforma digital de información, comunidad y contención sobre epilepsia en Argentina.",
  foundingLocation: {
    "@type": "Place",
    addressCountry: "AR",
    addressRegion: "Córdoba",
  },
  areaServed: {
    "@type": "Country",
    name: "Argentina",
  },
  sameAs: [
    "https://www.instagram.com/espacioepilepsia/",
    "https://www.facebook.com/espacioepilepsia/",
    "https://www.youtube.com/@EspacioEpilepsia",
    "https://www.linkedin.com/company/espacio-epilepsia",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contacto@espacioepilepsia.org",
    contactType: "customer support",
    availableLanguage: "Spanish",
  },
  knowsAbout: [
    "Epilepsia",
    "Neurología",
    "Primeros auxilios en crisis epilépticas",
    "Derechos de personas con epilepsia",
    "Comunidad de epilepsia en Argentina",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Espacio Epilepsia",
  url: "https://espacioepilepsia.org",
  description: "Plataforma digital de información y comunidad sobre epilepsia en Argentina.",
  inLanguage: "es-AR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://espacioepilepsia.org/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

import { supabase } from "@/lib/supabase";
import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener IDs de seguimiento de la DB si existen
  const { data: settings } = await supabase.from("site_settings").select("id,value");
  const getVal = (id: string) => settings?.find(s => s.id === id)?.value?.trim() ?? "";
  
  const gaIdRaw = getVal("tracking_ga");
  const gtmIdRaw = getVal("tracking_gtm");

  // Validación EXTREMA (Sanitización contra inyecciones XSS)
  // Solo permite formatos G-XXXXX y GTM-XXXXX.
  const gaId = /^G-[A-Z0-9]+$/.test(gaIdRaw) ? gaIdRaw : null;
  const gtmId = /^GTM-[A-Z0-9]+$/.test(gtmIdRaw) ? gtmIdRaw : null;

  return (
    <html
      lang="es-AR"
      className={`${plusJakarta.variable} ${inter.variable} antialiased`}
    >
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />

        {/* Theme color */}
        <meta name="theme-color" content="#5c29c2" />

        {/* Geo tags para Argentina */}
        <meta name="geo.region" content="AR" />
        <meta name="geo.country" content="Argentina" />
        <meta name="geo.placename" content="Argentina" />
        <meta name="language" content="Spanish" />
        <meta name="content-language" content="es-AR" />

        {/* Schema.org — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Schema.org — WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col pt-[72px]">
        {/* GTM NoScript */}
        {gtmId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            }}
          />
        )}

        {children}
        <FloatingDonateButton />
        <FloatingWhatsAppButton />

        {/* Google Analytics 4 (GA4) */}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager (GTM) */}
        {gtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}