// RUTA: src/app/admin/login/page.tsx
// REEMPLAZÁ el contenido actual completo con este
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type View = "login" | "forgot" | "sent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    } else {
      router.push("/epipanel");
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/epipanel/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError("No se pudo enviar el email. Verificá la dirección.");
    } else {
      setView("sent");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#f5f0ff" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/images/logo-admin.png" alt="Espacio Epilepsia" width={220} height={80} className="mx-auto mb-6 w-auto h-16 object-contain" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Panel de administración</h1>
          <p className="text-sm text-gray-500">Espacio Epilepsia · Acceso restringido</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">

          {view === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                  placeholder="admin@espacioepilepsia.org" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Contraseña</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                  placeholder="••••••••" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading}
                className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50 mt-2">
                {loading ? "Ingresando..." : "Ingresar al panel"}
              </button>
              <button type="button" onClick={() => { setView("forgot"); setError(""); }}
                className="text-sm text-[#5c29c2] hover:underline text-center">
                Olvidé mi contraseña
              </button>
            </form>
          )}

          {view === "forgot" && (
            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <div className="text-3xl mb-2">🔑</div>
                <h2 className="font-bold text-lg text-gray-900">Recuperar contraseña</h2>
                <p className="text-sm text-gray-500 mt-1">Te enviamos un link para resetear tu contraseña.</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                  placeholder="tu@email.com" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading}
                className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50">
                {loading ? "Enviando..." : "Enviar link de recuperación"}
              </button>
              <button type="button" onClick={() => { setView("login"); setError(""); }}
                className="text-sm text-gray-400 hover:text-gray-600 text-center">
                ← Volver al login
              </button>
            </form>
          )}

          {view === "sent" && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📩</div>
              <h2 className="font-bold text-lg text-gray-900 mb-2">¡Email enviado!</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Revisá tu bandeja de entrada en <strong>{email}</strong>.<br />
                El link expira en 1 hora.
              </p>
              <button onClick={() => { setView("login"); setError(""); }}
                className="text-sm text-[#5c29c2] font-bold hover:underline">
                Volver al login
              </button>
            </div>
          )}

        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          ¿Problemas? Escribinos a contacto@espacioepilepsia.org
        </p>
      </div>
    </main>
  );
}