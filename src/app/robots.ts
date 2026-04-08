// RUTA: src/app/robots.ts
// NUEVA CARPETA — creá este archivo en src/app/robots.ts
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/epipanel/", "/epipanel/login", "/epipanel/reset-password"],
      },
    ],
    sitemap: "https://espacioepilepsia.org/sitemap.xml",
    host: "https://espacioepilepsia.org",
  };
}
