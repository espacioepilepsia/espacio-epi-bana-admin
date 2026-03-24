// RUTA: src/app/admin/reset-password/page.tsx
// NUEVA CARPETA: src/app/admin/reset-password/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase maneja el token automáticamente desde la URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else setError("El link es inválido o ya expiró. Solicitá uno nuevo.");
    });
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("No se pudo actualizar la contraseña. Intentá de nuevo.");
      setLoading(false);
    } else {
      router.push("/epipanel/login?reset=ok");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#f5f0ff" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "#5c29c2" }}>
            <svg height="36" viewBox="0 0 220 60" fill="none">
              <text x="4" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="14" fontWeight="400" fill="white" letterSpacing="4">ESPACIO</text>
              <text x="4" y="56" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="30" fontWeight="800" fill="white">EPILE</text>
              <polygon points="128,26 121,44 128,44 121,60 140,38 132,38 140,26" fill="white" />
              <text x="140" y="56" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="30" fontWeight="800" fill="white">IA</text>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Nueva contraseña</h1>
          <p className="text-sm text-gray-500">Espacio Epilepsia · Panel de administración</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {!ready && error ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-sm text-red-600 mb-6">{error}</p>
              <a href="/epipanel/login"
                className="bg-[#5c29c2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#7c3aed] transition-all inline-block text-sm">
                Volver al login
              </a>
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <div className="text-3xl mb-2">🔒</div>
                <h2 className="font-bold text-base text-gray-900">Elegí una nueva contraseña</h2>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nueva contraseña</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                  placeholder="Mínimo 6 caracteres" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Confirmar contraseña</label>
                <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                  placeholder="Repetí la contraseña" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading || !ready}
                className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50 mt-2">
                {loading ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}