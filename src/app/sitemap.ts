// RUTA: src/app/sitemap.ts
import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://epipanel.espacioepilepsia.org";

  // Fetch all published blog posts for dynamic slug URLs
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const blogPostUrls: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/epipanel/blog`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  ];

  return [...staticUrls, ...blogPostUrls];
}
