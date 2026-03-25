// RUTA: src/app/epipanel/descargas/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Download = { id: string; nombre: string; apellido: string; email: string; recurso: string; created_at: string };
type Subscriber = { id: string; email: string; is_active: boolean; created_at: string };
type Message = { id: string; name: string; email: string; phone: string | null; message: string | null; location?: string | null; experience?: string | null; created_at: string };

type Tab = "descargas" | "newsletter" | "voluntarios";

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
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

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
      
      // Filtrar sólo voluntarios
      const allMsgs: Message[] = msg.data ?? [];
      setMessages(allMsgs.filter(m => m.message?.startsWith("QUIERO SUMARME:")));
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
      csv = ["Nombre,Email,Teléfono,Ubicación,Experiencia,Mensaje,Fecha", ...messages.map(m => `"${m.name}","${m.email}","${m.phone || ""}","${m.location || ""}","${m.experience?.replace(/"/g, '""') || ""}","${(m.message || "").replace(/"/g, '""')}","${formatDate(m.created_at)}"`)].join("\n");
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
    { key: "voluntarios", label: "Voluntarios", count: messages.length },
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

          {/* VOLUNTARIOS */}
          {tab === "voluntarios" && (
            messages.length === 0 ? <EmptyState text="Todavía no hay voluntarios registrados. 💬" /> : (
              <Table>
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  <Th>Nombre</Th><Th>Email/Tel</Th><Th>Exp/Ubicación</Th><Th>Mensaje</Th><Th>Fecha</Th><Th>Acción</Th>
                </tr></thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-[#f5f0ff]/50 transition-colors">
                      <Td><span className="font-semibold text-gray-900">{m.name}</span></Td>
                      <Td>
                        <div className="text-[#5c29c2]">{m.email}</div>
                        <div className="text-gray-500 text-xs">{m.phone || "Sin tel."}</div>
                      </Td>
                      <Td>
                        <div className="font-medium text-gray-800 text-xs">{m.location || "—"}</div>
                        <div className="text-gray-500 text-xs line-clamp-1" title={m.experience || ""}>{m.experience || "Sin experiencia esp."}</div>
                      </Td>
                      <Td><span className="text-gray-600 text-xs line-clamp-2" title={m.message || ""}>{m.message?.replace("QUIERO SUMARME: ", "") || "—"}</span></Td>
                      <Td>{formatDate(m.created_at)}</Td>
                      <Td>
                        <button onClick={() => setReplyingTo(m)} className="text-xs font-bold bg-[#f5f0ff] text-[#5c29c2] hover:bg-[#5c29c2] hover:text-white transition-colors px-3 py-1.5 rounded-full">
                          Responder
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          )}
        </>
      )}

      {replyingTo && (
        <ReplyModal 
          msg={replyingTo} 
          onClose={() => setReplyingTo(null)} 
        />
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

function ReplyModal({ msg, onClose }: { msg: Message, onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [text, setText] = useState(`Hola ${msg.name},\n\nRespondiendo a tu consulta:\n> ${msg.message?.replace(/\n/g, "\n> ")}\n\n`);

  async function sendReply() {
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: msg.email,
          subject: "Respuesta a tu consulta - Espacio Epilepsia",
          text,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");
      alert("Mail enviado correctamente!");
      onClose();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-extrabold">Responder a {msg.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold">✕</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Para: <strong className="text-black">{msg.email}</strong></p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full h-48 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#5c29c2] mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm">Cancelar</button>
          <button onClick={sendReply} disabled={sending} className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#5c29c2] hover:bg-[#7c3aed] text-sm disabled:opacity-50">
            {sending ? "Enviando..." : "Enviar Respuesta"}
          </button>
        </div>
      </div>
    </div>
  );
}
