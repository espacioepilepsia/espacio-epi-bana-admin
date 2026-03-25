// RUTA: src/app/blog/[slug]/page.tsx
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentForm from "@/components/CommentForm";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string;
  published_at: string | null;
  author: string | null;
};

type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("title,excerpt,cover_image_url,published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Artículo no encontrado | Espacio Epilepsia" };

  return {
    title: `${post.title} | Espacio Epilepsia`,
    description: post.excerpt ?? `Artículo de Espacio Epilepsia: ${post.title}`,
    alternates: { canonical: `https://espacioepilepsia.org/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? "",
      url: `https://espacioepilepsia.org/blog/${slug}`,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }]
        : [{ url: "/images/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? "",
      images: [post.cover_image_url ?? "/images/og-image.png"],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single<Post>();

  if (!post) notFound();

  // Fetch approved comments
  const { data: comments } = await supabase
    .from("post_comments")
    .select("id, author_name, body, created_at")
    .eq("post_id", post.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  const approvedComments: Comment[] = comments ?? [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? post.title,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      "@type": "Organization",
      name: post.author ?? "Espacio Epilepsia",
      url: "https://espacioepilepsia.org",
    },
    publisher: {
      "@type": "Organization",
      name: "Espacio Epilepsia",
      url: "https://espacioepilepsia.org",
      logo: { "@type": "ImageObject", url: "https://espacioepilepsia.org/images/logo.png" },
    },
    image: post.cover_image_url ?? "https://espacioepilepsia.org/images/og-image.png",
    url: `https://espacioepilepsia.org/blog/${slug}`,
    about: { "@type": "MedicalCondition", name: "Epilepsia" },
    inLanguage: "es-AR",
    isPartOf: { "@type": "WebSite", name: "Espacio Epilepsia", url: "https://espacioepilepsia.org" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://espacioepilepsia.org" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://espacioepilepsia.org/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: `https://espacioepilepsia.org/blog/${slug}` },
      ],
    },
  };

  const categoryLabel: Record<string, string> = {
    blog: "Blog",
    novedad: "Novedad",
    prensa: "Prensa",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main>
        <Navbar />

        {/* BREADCRUMB RIBBON */}
        <div className="bg-[#5c29c2] pt-[72px]">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/50 truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>

        {/* HERO */}
        <section className="bg-white py-12 px-6 border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center bg-[#f5f0ff] border border-[#5c29c2]/20 text-[#5c29c2] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {categoryLabel[post.category] ?? post.category}
              </span>
              {post.published_at && (
                <span className="text-xs text-gray-400">{formatDate(post.published_at)}</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">{post.excerpt}</p>
            )}
            {post.author && (
              <p className="mt-4 text-sm text-gray-400 font-medium">Por {post.author}</p>
            )}
          </div>
        </section>

        {/* COVER IMAGE */}
        {post.cover_image_url && (
          <div className="bg-[#f5f0ff] px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-2xl object-cover max-h-[480px] shadow-lg"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <article className="py-12 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            {post.content ? (
              <div
                className="prose prose-lg prose-purple max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-gray-400 italic text-center py-16">
                El contenido completo de este artículo estará disponible próximamente.
              </p>
            )}

            {/* BACK + SHARE */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#5c29c2] font-bold hover:underline text-sm"
              >
                ← Volver al Blog
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium">Compartir:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://espacioepilepsia.org/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-100 hover:bg-[#5c29c2] hover:text-white text-gray-600 font-bold px-4 py-2 rounded-full transition-all"
                >
                  X (Twitter)
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://espacioepilepsia.org/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-100 hover:bg-[#5c29c2] hover:text-white text-gray-600 font-bold px-4 py-2 rounded-full transition-all"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* COMMENTS SECTION */}
        <section className="py-12 px-6 bg-[#f9f7ff] border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Comentarios{" "}
              {approvedComments.length > 0 && (
                <span className="text-[#5c29c2]">({approvedComments.length})</span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mb-8">Los comentarios son moderados antes de publicarse.</p>

            {/* List of approved comments */}
            {approvedComments.length > 0 ? (
              <div className="space-y-5 mb-10">
                {approvedComments.map((c) => (
                  <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#5c29c2]/10 text-[#5c29c2] font-extrabold flex items-center justify-center text-sm">
                        {c.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{c.author_name}</p>
                        <p className="text-xs text-gray-400">{formatDate(c.created_at)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center mb-10">
                <p className="text-gray-400 text-sm">Aún no hay comentarios. ¡Sé el primero en comentar!</p>
              </div>
            )}

            {/* Comment form */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-gray-900 text-lg mb-5">Dejá tu comentario</h3>
              <CommentForm postId={post.id} postSlug={slug} postTitle={post.title} />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}