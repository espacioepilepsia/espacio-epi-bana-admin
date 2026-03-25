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

const trackingDef = [
  { id: "tracking_ga", label: "Google Analytics (GA4) ID", type: "text", placeholder: "Ej: G-XXXXXXXX", description: "Pegá solo el identificador G-XXXX, no el código completo." },
  { id: "tracking_gtm", label: "Google Tag Manager ID", type: "text", placeholder: "Ej: GTM-XXXXXXX", description: "Pegá solo el identificador GTM-XXXX." },
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
      [...settingsDef, ...whatsappDef, ...trackingDef].map(({ id, label }) =>
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
        <p className="text-sm text-gray-500">Gestioná los links, integraciones y variables generales del sitio.</p>
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

      {/* BLOQUE DE WA */}
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
      
      {/* BLOQUE DE TRACKING */}
      <div className="bg-white border border-[#5c29c2]/20 rounded-2xl p-6 shadow-sm mt-6">
        <h2 className="font-bold text-base mb-5 flex items-center gap-2 text-[#5c29c2]">
          <span>📈</span> Tracking y Analítica
        </h2>
        
        <p className="text-xs text-gray-500 mb-6 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
          <strong>Seguridad:</strong> Para prevenir ataques, debés pegar <strong>únicamente el código identificador</strong> y no las etiquetas completas de &lt;script&gt;.
        </p>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {trackingDef.map(({ id, label, type, placeholder, description }) => (
              <div key={id}>
                <label className="text-xs font-bold text-[#5c29c2] mb-1.5 block">{label}</label>
                <div className="relative">
                  <input
                    type={type}
                    value={settings[id] ?? ""}
                    onChange={e => setSettings({ ...settings, [id]: e.target.value.trim() })}
                    className="w-full border border-[#5c29c2]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] focus:ring-2 focus:ring-[#5c29c2]/20 transition-all font-mono bg-[#fcfaff]"
                    placeholder={placeholder}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">{description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-6">
        <div className="flex flex-col gap-4">
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium flex items-center gap-2">
              <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span> Los cambios se aplicaron correctamente al sitio.
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#5c29c2] text-white font-extrabold py-3.5 rounded-xl hover:bg-[#4a1fa0] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none w-full text-[15px] shadow-sm flex items-center justify-center gap-2"
          >
            {saving ? "Guardando..." : "Guardar toda la configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}