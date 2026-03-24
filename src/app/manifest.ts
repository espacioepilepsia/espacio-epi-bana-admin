// RUTA: src/app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Espacio Epilepsia",
    short_name: "EspacioEpilepsia",
    description:
      "Plataforma digital de información, comunidad y contención sobre epilepsia en Argentina. #SinEstigmas",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5c29c2",
    lang: "es-AR",
    categories: ["health", "medical", "community"],
    icons: [
      {
        src: "/images/logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/images/og-image.png",
        type: "image/png",
        sizes: "1200x630",
      },
    ] as MetadataRoute.Manifest["screenshots"],
  };
}
