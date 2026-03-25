// RUTA: src/app/epipanel/descargas/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Download = { id: string; nombre: string; apellido: string; email: string; recurso: string; created_at: string };
type Subscriber = { id: string; email: string; is_active: boolean; created_at: string };
type Message = { id: string; name: string; email: string; phone: string | null; message: string | null; created_at: string };

type Tab = "descargas" | "newsletter" | "contacto";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function LeadsPage() {
  const [tab, setTab] = useState<Tab>("descargas");
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: perms } = await supabase.from("epipanel_users").select("is_admin").eq("id", session.user.id).single();
        setIsAdmin(perms?.is_admin ?? false);
      }

      const [dl, nl, msg] = await Promise.all([
        supabase.from("resource_downloads").select("*").order("created_at", { ascending: false }),
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);
      setDownloads(dl.data ?? []);
      setSubscribers(nl.data ?? []);
      setMessages(msg.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  function exportCSV(type: Tab) {
    if (!isAdmin) return;
    let csv = "";
    if (type === "descargas") {
      csv = ["Nombre,Apellido,Email,Recurso,Fecha", ...downloads.map(d => `"${d.nombre}","${d.apellido}","${d.email}","${d.recurso}","${formatDate(d.created_at)}"`)].join("\n");
    } else if (type === "newsletter") {
      csv = ["Email,Activo,Fecha", ...subscribers.map(s => `"${s.email}","${s.is_active ? "Sí" : "No"}","${formatDate(s.created_at)}"`)].join("\n");
    } else {
      csv = ["Nombre,Email,Teléfono,Mensaje,Fecha", ...messages.map(m => `"${m.name}","${m.email}","${m.phone || ""}","${(m.message || "").replace(/"/g, '""')}","${formatDate(m.created_at)}"`)].join("\n");
    }
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "descargas", label: "Descargas", count: downloads.length },
    { key: "newsletter", label: "Newsletter", count: subscribers.length },
    { key: "contacto", label: "Contacto", count: messages.length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Leads y Contactos</h1>
          <p className="text-sm text-gray-500">Todos los registros de formularios del sitio</p>
        </div>
        {isAdmin && (
          <button onClick={() => exportCSV(tab)}
            className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[#7c3aed] transition-all flex items-center gap-2">
            📥 Exportar CSV
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${tab === t.key ? "bg-[#5c29c2] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {t.label} <span className="ml-1 opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-gray-100" />)}</div>
      ) : (
        <>
          {/* DESCARGAS */}
          {tab === "descargas" && (
            downloads.length === 0 ? <EmptyState text="Todavía nadie descargó un recurso. 📋" /> : (
              <Table>
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  <Th>Nombre</Th><Th>Email</Th><Th>Recurso</Th><Th>Fecha</Th>
                </tr></thead>
                <tbody>
                  {downloads.map(d => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-[#f5f0ff]/50 transition-colors">
                      <Td><span className="font-semibold text-gray-900">{d.nombre} {d.apellido}</span></Td>
                      <Td><a href={`mailto:${d.email}`} className="text-[#5c29c2] hover:underline">{d.email}</a></Td>
                      <Td><span className="text-xs font-bold bg-[#f5f0ff] text-[#5c29c2] px-2.5 py-1 rounded-full">{d.recurso}</span></Td>
                      <Td>{formatDate(d.created_at)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          )}

          {/* NEWSLETTER */}
          {tab === "newsletter" && (
            subscribers.length === 0 ? <EmptyState text="No hay suscriptores todavía. 📬" /> : (
              <Table>
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  <Th>Email</Th><Th>Estado</Th><Th>Fecha</Th>
                </tr></thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-[#f5f0ff]/50 transition-colors">
                      <Td><a href={`mailto:${s.email}`} className="text-[#5c29c2] hover:underline">{s.email}</a></Td>
                      <Td>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {s.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </Td>
                      <Td>{formatDate(s.created_at)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          )}

          {/* CONTACTO */}
          {tab === "contacto" && (
            messages.length === 0 ? <EmptyState text="No hay mensajes todavía. 💬" /> : (
              <Table>
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  <Th>Nombre</Th><Th>Email</Th><Th>Teléfono</Th><Th>Mensaje</Th><Th>Fecha</Th>
                </tr></thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-[#f5f0ff]/50 transition-colors">
                      <Td><span className="font-semibold text-gray-900">{m.name}</span></Td>
                      <Td><a href={`mailto:${m.email}`} className="text-[#5c29c2] hover:underline">{m.email}</a></Td>
                      <Td><span className="text-gray-500">{m.phone || "—"}</span></Td>
                      <Td><span className="text-gray-600 text-xs line-clamp-2">{m.message || "—"}</span></Td>
                      <Td>{formatDate(m.created_at)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          )}
        </>
      )}
    </div>
  );
}

// --- Sub-components ---
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto"><table className="w-full">{children}</table></div>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-3 text-sm">{children}</td>;
}
function EmptyState({ text }: { text: string }) {
  return <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">{text}</div>;
}
