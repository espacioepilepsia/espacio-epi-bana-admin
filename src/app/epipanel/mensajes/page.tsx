// RUTA: src/app/admin/mensajes/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { EDGE_FUNCTIONS } from "@/lib/edge-functions";

type Message = { id: string; name: string; email: string; phone: string | null; message: string | null; is_read: boolean; created_at: string; };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminMensajesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  async function load() {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, is_read: true } : null);
  }

  const filtered = filter === "unread" ? messages.filter(m => !m.is_read) : messages;
  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Mensajes de contacto</h1>
          <p className="text-sm text-gray-500">{unreadCount} sin leer · {messages.length} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter("unread")} className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${filter === "unread" ? "bg-[#5c29c2] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Sin leer ({unreadCount})</button>
          <button onClick={() => setFilter("all")} className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${filter === "all" ? "bg-[#5c29c2] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Todos ({messages.length})</button>
        </div>
      </div>

      {selected && (
        <div className="bg-white border border-[#5c29c2]/20 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg text-gray-900">{selected.name}</h2>
              <div className="flex gap-4 mt-1 text-sm text-gray-500">
                <a href={`mailto:${selected.email}`} className="text-[#5c29c2] hover:underline">{selected.email}</a>
                {selected.phone && <span>{selected.phone}</span>}
                <span>{formatDate(selected.created_at)}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
            {selected.message || "Sin mensaje"}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setReplyingTo(selected)} className="bg-[#5c29c2] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7c3aed] transition-all">
              Responder
            </button>
            {!selected.is_read && <button onClick={() => markRead(selected.id)} className="bg-gray-100 text-gray-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all">Marcar como leído</button>}
          </div>
        </div>
      )}

      {loading ? <div className="flex flex-col gap-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-gray-100"/>)}</div>
      : filtered.length === 0 ? <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">{filter === "unread" ? "No hay mensajes sin leer 🎉" : "No hay mensajes todavía."}</div>
      : (
        <div className="flex flex-col gap-2">
          {filtered.map(m => (
            <button key={m.id} onClick={() => { setSelected(m); if (!m.is_read) markRead(m.id); }}
              className={`w-full text-left p-4 rounded-xl border transition-all hover:border-[#5c29c2]/30 ${m.is_read ? "bg-white border-gray-100" : "bg-[#f5f0ff] border-[#5c29c2]/20"}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {!m.is_read && <span className="w-2 h-2 rounded-full bg-[#5c29c2] flex-shrink-0" />}
                  <span className="font-semibold text-sm text-gray-900 truncate">{m.name}</span>
                  <span className="text-xs text-gray-400 hidden md:block truncate">{m.email}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400">{formatDate(m.created_at)}</span>
                  {!m.is_read && <span className="text-xs font-bold bg-[#5c29c2] text-white px-2 py-0.5 rounded-full">Nuevo</span>}
                </div>
              </div>
              {m.message && <p className="text-xs text-gray-500 mt-1 truncate ml-5">{m.message}</p>}
            </button>
          ))}
        </div>
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

function ReplyModal({ msg, onClose }: { msg: Message, onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [text, setText] = useState(`Hola ${msg.name},\n\nRespondiendo a tu consulta:\n> ${msg.message?.replace(/\n/g, "\n> ")}\n\n`);

  async function sendReply() {
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch(EDGE_FUNCTIONS.sendEmail, {
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