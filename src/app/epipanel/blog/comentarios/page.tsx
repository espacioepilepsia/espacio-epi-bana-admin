// RUTA: src/app/epipanel/blog/comentarios/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string | null;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  posts?: { title: string; slug: string } | null;
};

type TabValue = "pending" | "approved" | "rejected";

export default function CommentsPage() {
  const searchParams = useSearchParams();
  const filterPostId = searchParams.get("post_id");

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabValue>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const url = new URL("/api/comments/pending", window.location.origin);
      if (filterPostId) {
        url.searchParams.append("post_id", filterPostId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.error("Failed to fetch comments, status:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        setComments([]);
        setLoading(false);
        return;
      }

      const { data } = await response.json();
      setComments(data ?? []);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    }
    setLoading(false);
  }

  useEffect(() => { 
    load(); 
  }, [filterPostId]);

  async function updateStatus(id: string, status: Comment["status"]) {
    setActionLoading(id + status);
    await supabase.from("post_comments").update({ status }).eq("id", id);
    await load();
    setActionLoading(null);
  }

  async function deleteComment(id: string) {
    if (!confirm("¿Eliminar este comentario permanentemente?")) return;
    setActionLoading(id + "delete");
    await supabase.from("post_comments").delete().eq("id", id);
    await load();
    setActionLoading(null);
  }

  const filtered = comments.filter(c => c.status === tab);
  const counts = {
    pending: comments.filter(c => c.status === "pending").length,
    approved: comments.filter(c => c.status === "approved").length,
    rejected: comments.filter(c => c.status === "rejected").length,
  };

  const tabs: { value: TabValue; label: string; color: string }[] = [
    { value: "pending", label: "Pendientes", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { value: "approved", label: "Aprobados", color: "text-green-700 bg-green-50 border-green-200" },
    { value: "rejected", label: "Rechazados", color: "text-red-600 bg-red-50 border-red-200" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/epipanel/blog" className="text-[#5c29c2] hover:underline text-sm font-bold">← Blog</Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-2xl font-extrabold text-gray-900">Moderación de Comentarios</h1>
          </div>
          {filterPostId && (
            <p className="text-sm text-[#5c29c2] font-medium">
              Filtrando por nota específica ·{" "}
              <Link href="/epipanel/blog/comentarios" className="underline">Ver todos</Link>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
              tab === t.value ? t.color : "text-gray-500 bg-gray-50 border-gray-100 hover:bg-gray-100"
            }`}
          >
            {t.label}
            {counts[t.value] > 0 && (
              <span className="ml-2 text-xs font-black">{counts[t.value]}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <p className="text-lg font-bold mb-1">No hay comentarios {tabs.find(t => t.value === tab)?.label.toLowerCase()}</p>
          <p className="text-sm">Cuando lleguen nuevos comentarios aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{c.author_name}</span>
                    {c.author_email && (
                      <span className="text-xs text-gray-400 font-mono">{c.author_email}</span>
                    )}
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {c.posts && (
                    <Link
                      href={`/blog/${c.posts.slug}`}
                      target="_blank"
                      className="text-xs text-[#5c29c2] font-bold hover:underline mb-2 inline-block"
                    >
                      📝 {c.posts.title}
                    </Link>
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed mt-2 bg-gray-50 rounded-xl p-3">
                    {c.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {c.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(c.id, "approved")}
                      disabled={actionLoading === c.id + "approved"}
                      className="bg-green-50 text-green-700 border border-green-200 font-bold px-4 py-2 rounded-xl text-xs hover:bg-green-100 transition-all disabled:opacity-50"
                    >
                      {actionLoading === c.id + "approved" ? "..." : "✓ Aprobar"}
                    </button>
                  )}
                  {c.status !== "rejected" && (
                    <button
                      onClick={() => updateStatus(c.id, "rejected")}
                      disabled={actionLoading === c.id + "rejected"}
                      className="bg-red-50 text-red-600 border border-red-200 font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      {actionLoading === c.id + "rejected" ? "..." : "✗ Rechazar"}
                    </button>
                  )}
                  <button
                    onClick={() => deleteComment(c.id)}
                    disabled={actionLoading === c.id + "delete"}
                    className="text-gray-400 hover:text-red-500 border border-transparent hover:border-red-100 hover:bg-red-50 font-bold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-50"
                  >
                    {actionLoading === c.id + "delete" ? "..." : "🗑 Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
