// RUTA: src/components/FloatingWhatsAppButton.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FloatingWhatsAppButton() {
  const [enabled, setEnabled] = useState(false);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("id, value")
        .in("id", ["whatsapp_enabled", "whatsapp_number", "whatsapp_message"]);

      if (!data) return;
      const map = Object.fromEntries(data.map((r) => [r.id, r.value]));
      setEnabled(map.whatsapp_enabled === "true");
      setNumber(map.whatsapp_number ?? "");
      setMessage(map.whatsapp_message ?? "");
      setReady(true);
    }
    loadSettings();
  }, []);

  if (!ready || !enabled || !number) return null;

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-8 left-8 z-[100] flex items-center gap-3 bg-[#25d366] text-white px-5 py-4 rounded-full font-extrabold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
    >
      {/* WhatsApp SVG */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 flex-shrink-0"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.154 1.549 5.902L0 24l6.302-1.524A11.929 11.929 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.034-1.394l-.361-.216-3.741.904.944-3.638-.235-.374A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
      <span className="text-sm tracking-tight hidden sm:block">WhatsApp</span>
    </a>
  );
}
