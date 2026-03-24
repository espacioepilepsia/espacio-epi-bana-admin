// RUTA: src/app/admin/configuracion/page.tsx
// NUEVA CARPETA: src/app/admin/configuracion/
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Setting = { id: string; value: string; label: string; };

const settingsDef = [
  { id: "social_instagram", label: "Instagram", placeholder: "https://www.instagram.com/...", type: "url" },
  { id: "social_facebook", label: "Facebook", placeholder: "https://www.facebook.com/...", type: "url" },
  { id: "social_youtube", label: "YouTube", placeholder: "https://www.youtube.com/...", type: "url" },
  { id: "social_linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/...", type: "url" },
];

const whatsappDef = [
  { id: "whatsapp_enabled", label: "Botón Flotante Activo", type: "toggle", description: "Muestra u oculta el botón de WhatsApp en todo el sitio." },
  { id: "whatsapp_number", label: "Número de Teléfono", type: "text", placeholder: "Ej: 5491112345678 (Sin + ni espacios)" },
  { id: "whatsapp_message", label: "Mensaje Automático", type: "text", placeholder: "¡Hola! Quisiera más información..." },
];

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("id,value,label").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: Setting) => { map[s.id] = s.value; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await Promise.all(
      [...settingsDef, ...whatsappDef].map(({ id, label }) =>
        supabase.from("site_settings").upsert({ id, value: settings[id] ?? "", label }, { onConflict: "id" })
      )
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Configuración</h1>
        <p className="text-sm text-gray-500">Gestioná los links de redes sociales del sitio</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-5 flex items-center gap-2">
          <span>🔗</span> Redes sociales
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {settingsDef.map(({ id, label, placeholder, type }) => (
              <div key={id}>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-2">
                  {label === "Instagram" ? "📸" : label === "Facebook" ? "👤" : label === "YouTube" ? "▶️" : "💼"}
                  {label}
                </label>
                <input
                  type={type}
                  value={settings[id] ?? ""}
                  onChange={e => setSettings({ ...settings, [id]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] transition-colors font-mono"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-6">
        <h2 className="font-bold text-base mb-5 flex items-center gap-2">
          <span>💬</span> Configuración de WhatsApp
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {whatsappDef.map(({ id, label, type, placeholder, description }) => (
              <div key={id}>
                {type === "toggle" ? (
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-900 block">{label}</label>
                      <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, [id]: (settings[id] !== "true").toString() })}
                      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${settings[id] === "true" ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[id] === "true" ? "translate-x-6" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
                    <input
                      type={type}
                      value={settings[id] ?? ""}
                      onChange={e => setSettings({ ...settings, [id]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                      placeholder={placeholder}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-6">
        <div className="flex flex-col gap-4">
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
              <span>✓</span> Cambios guardados correctamente
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50 mt-2"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-5 mt-6">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-[#5c29c2]">Nota:</strong> Los cambios en las redes sociales se reflejan en el footer de todas las páginas del sitio. Asegurate de pegar la URL completa incluyendo <code className="bg-white px-1 rounded">https://</code>
        </p>
      </div>
    </div>
  );
}