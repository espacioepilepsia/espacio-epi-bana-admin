// RUTA: src/app/epipanel/descargas/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Download = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  recurso: string;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function DescargasPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("resource_downloads").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setDownloads(data ?? []); setLoading(false); });
  }, []);

  function exportCSV() {
    if (downloads.length === 0) return;
    const headers = ["Nombre", "Apellido", "Email", "Recurso", "Fecha"];
    const rows = downloads.map(d => [
      d.nombre,
      d.apellido,
      d.email,
      d.recurso,
      formatDate(d.created_at),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `descargas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Descargas de recursos</h1>
          <p className="text-sm text-gray-500">{downloads.length} registro{downloads.length !== 1 ? "s" : ""} en total</p>
        </div>
        <button onClick={exportCSV} disabled={downloads.length === 0}
          className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[#7c3aed] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          📥 Exportar CSV
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-gray-100" />)}</div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          Todavía nadie descargó un recurso. 📋
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Recurso</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map(d => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-[#f5f0ff]/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-semibold text-sm text-gray-900">{d.nombre} {d.apellido}</span>
                    </td>
                    <td className="px-5 py-3">
                      <a href={`mailto:${d.email}`} className="text-sm text-[#5c29c2] hover:underline">{d.email}</a>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold bg-[#f5f0ff] text-[#5c29c2] px-2.5 py-1 rounded-full">{d.recurso}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(d.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
