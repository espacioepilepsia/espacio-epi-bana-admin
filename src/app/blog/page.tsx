// RUTA: src/app/blog/page.tsx
"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

type Post = { id: string; title: string; slug: string; excerpt: string | null; cover_image_url: string | null; category: string; published_at: string | null; };

function useInView(ref: React.RefObject<HTMLElement>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<HTMLElement>);
  return <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>{children}</div>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
}

const CATEGORIES = [
  { key: "todos", label: "Todos" },
  { key: "blog", label: "Blog" },
  { key: "novedad", label: "Novedades" },
  { key: "prensa", label: "Prensa" },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    supabase.from("posts").select("id,title,slug,excerpt,cover_image_url,category,published_at").eq("is_published", true).order("published_at", { ascending: false }).then(({ data }) => { setPosts(data ?? []); setLoading(false); });
  }, []);

  const filtered = filter === "todos" ? posts : posts.filter(p => p.category === filter);

  return (
    <main>
      <Navbar />
      <div className="bg-[#5c29c2] pt-[72px]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link href="/comunidad" className="text-white/80 text-sm hover:text-white transition-colors inline-flex items-center gap-1 font-medium">← Volver a Comunidad</Link>
        </div>
      </div>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <p className="text-xs font-bold text-[#5c29c2] uppercase tracking-widest mb-3">Comunidad</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">Artículos, novedades y contenido sobre epilepsia para la comunidad.</p>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100 sticky top-[70px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-400 mr-2">Categoría:</span>
          {CATEGORIES.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${filter === key ? "bg-[#5c29c2] text-white border-[#5c29c2]" : "bg-white text-gray-500 border-gray-200 hover:border-[#5c29c2] hover:text-[#5c29c2]"}`}>
              {label}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400">{filtered.length} artículo{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <section className="py-16 px-6 bg-[#f5f0ff] min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 bg-white rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl text-gray-400">
              <p className="text-lg font-semibold mb-2">No hay artículos publicados todavía</p>
              <p className="text-sm">Pronto vamos a subir contenido. ¡Seguinos en Instagram!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <FadeIn key={post.id} delay={i * 60}>
                  <Link href={`/blog/${post.slug}`} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all group block h-full">
                    <div className="w-full h-48 bg-[#f5f0ff] flex items-center justify-center overflow-hidden">
                      {post.cover_image_url
                        ? <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="text-[#5c29c2]/20 text-5xl font-extrabold">EE</div>
                      }
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-[#5c29c2] uppercase tracking-wide bg-[#f5f0ff] px-2 py-0.5 rounded-full">
                          {post.category === "novedad" ? "Novedad" : post.category === "prensa" ? "Prensa" : "Blog"}
                        </span>
                        {post.published_at && <span className="text-xs text-gray-400">{formatDate(post.published_at)}</span>}
                      </div>
                      <h2 className="font-bold text-base mb-2 leading-snug group-hover:text-[#5c29c2] transition-colors">{post.title}</h2>
                      {post.excerpt && <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.excerpt}</p>}
                      <span className="text-xs font-bold text-[#5c29c2] mt-3 block">Leer más →</span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}