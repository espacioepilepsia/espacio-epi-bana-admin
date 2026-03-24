// RUTA: src/app/robots.ts
// NUEVA CARPETA — creá este archivo en src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin/login", "/admin/reset-password"],
      },
    ],
    sitemap: "https://espacioepilepsia.org/sitemap.xml",
    host: "https://espacioepilepsia.org",
  };
}