// RUTA: src/app/admin/configuracion/page.tsx
// NUEVA CARPETA: src/app/admin/configuracion/
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Setting = { id: string; value: string; label: string; };

const settingsDef = [
  { id: "social_instagram", label: "Instagram", placeholder: "https://www.instagram.com/..." },
  { id: "social_facebook", label: "Facebook", placeholder: "https://www.facebook.com/..." },
  { id: "social_youtube", label: "YouTube", placeholder: "https://www.youtube.com/..." },
  { id: "social_linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/..." },
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
      settingsDef.map(({ id, label }) =>
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
            {settingsDef.map(({ id, label, placeholder }) => (
              <div key={id}>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-2">
                  {label === "Instagram" ? "📸" : label === "Facebook" ? "👤" : label === "YouTube" ? "▶️" : "💼"}
                  {label}
                </label>
                <input
                  type="url"
                  value={settings[id] ?? ""}
                  onChange={e => setSettings({ ...settings, [id]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5c29c2] transition-colors font-mono"
                  placeholder={placeholder}
                />
              </div>
            ))}

            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                <span>✓</span> Cambios guardados correctamente
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50 mt-2"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#f5f0ff] border border-[#5c29c2]/15 rounded-2xl p-5 mt-6">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-[#5c29c2]">Nota:</strong> Los cambios en las redes sociales se reflejan en el footer de todas las páginas del sitio. Asegurate de pegar la URL completa incluyendo <code className="bg-white px-1 rounded">https://</code>
        </p>
      </div>
    </div>
  );
}