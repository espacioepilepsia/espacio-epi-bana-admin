"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string;
  published_at: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function BlogPostClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()
      .then(({ data }) => { setPost(data); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <main>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#5c29c2] border-t-transparent rounded-full" />
      </div>
      <Footer />
    </main>
  );

  if (!post) return (
    <main>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-3">Artículo no encontrado</h1>
          <p className="text-gray-500 mb-6">El artículo que buscás no existe o fue eliminado.</p>
          <Link href="/blog" className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all">
            Ver todos los artículos
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navbar />
      <section style={{ background: "#5c29c2" }}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/blog" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">
            ← Volver al blog
          </Link>
          <div className="flex items-center gap-3 mb-4 mt-3">
            <span className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full uppercase tracking-wide">
              {post.category === "novedad" ? "Novedad" : post.category === "prensa" ? "Prensa" : "Blog"}
            </span>
            {post.published_at && (
              <span className="text-sm text-white/60">{formatDate(post.published_at)}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-white/70 mt-4 leading-relaxed">{post.excerpt}</p>
          )}
        </div>
      </section>

      {post.cover_image_url && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-72 object-cover rounded-2xl shadow-lg" />
        </div>
      )}

      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          {post.content ? (
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-gray-400 text-center py-12">Este artículo no tiene contenido todavía.</p>
          )}
        </div>
      </section>

      <section className="py-12 px-6" style={{ background: "#f5f0ff" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-bold text-lg mb-3">¿Te resultó útil este artículo?</h3>
          <p className="text-gray-500 text-sm mb-5">Compartilo con alguien que lo necesite.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={`https://wa.me/?text=${encodeURIComponent(post.title + " - https://espacioepilepsia.org/blog/" + post.slug)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all">
              Compartir por WhatsApp
            </a>
            <Link href="/blog" className="bg-white border border-[#5c29c2]/20 text-[#5c29c2] font-bold px-5 py-2.5 rounded-xl text-sm hover:border-[#5c29c2] transition-all">
              Ver más artículos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}