// RUTA: src/app/sitemap.ts
import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://espacioepilepsia.org";

  // Fetch all published blog posts for dynamic slug URLs
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const blogPostUrls: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/informacion`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/informacion/primeros-auxilios`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/informacion/derechos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/informacion/preguntas-frecuentes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/programas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/programas/charlas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/programas/capacitaciones`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/programas/congresos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/programas/colaboraciones`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/institucional`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/comunidad`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/eventos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/organizaciones`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tuhistoria`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/sumate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/tienda`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/dona`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  return [...staticUrls, ...blogPostUrls];
}