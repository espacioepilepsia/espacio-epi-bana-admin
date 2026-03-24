// RUTA: src/app/epipanel/registro/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Supabase auth auto-triggers the SQL function to create the pending role
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            // Optional: prevent auto-login if email confirmation is required by Supabase settings
            // However, typical local setup logs them in. The layout handles pending state gracefully.
        }
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Este email ya está registrado. Por favor, iniciá sesión.");
      } else {
        setError("Hubo un error al registrarse. Revisá los datos o contactá al admin.");
      }
      setLoading(false);
    } else {
      // Account created effectively, push to panel to see "Pending" screen.
      router.push("/epipanel");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#f5f0ff" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/images/logo-admin.png" alt="Espacio Epilepsia" width={220} height={80} className="mx-auto mb-6 w-auto h-16 object-contain" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Solicitar Acceso</h1>
          <p className="text-sm text-gray-500">Voluntarios y Colaboradores de Espacio Epilepsia</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email corporativo o personal</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Crear Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c29c2] transition-colors"
                placeholder="Mínimo 6 caracteres" />
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
            
            <button type="submit" disabled={loading}
              className="bg-[#5c29c2] text-white font-bold py-3 rounded-xl hover:bg-[#7c3aed] transition-all disabled:opacity-50 mt-2">
              {loading ? "Creando cuenta..." : "Solicitar aprobación al administrador"}
            </button>
            <Link href="/epipanel/login"
              className="text-sm text-gray-400 hover:text-gray-600 text-center mt-2">
              Ya tengo una cuenta aprobada
            </Link>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Tu cuenta deberá ser habilitada manualmente por coordinación general.
        </p>
      </div>
    </main>
  );
}
