// RUTA: src/app/epipanel/usuarios/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type EpipanelUser = {
  id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  is_admin: boolean;
  can_blog: boolean;
  can_eventos: boolean;
  can_comunidad: boolean;
  can_equipo: boolean;
  can_mensajes: boolean;
  can_organizaciones: boolean;
  can_productos: boolean;
  can_historias: boolean;
  created_at: string;
};

const perms = [
  { key: "can_blog", label: "Blog" },
  { key: "can_eventos", label: "Eventos" },
  { key: "can_comunidad", label: "Comunidad" },
  { key: "can_historias", label: "Historias" },
  { key: "can_mensajes", label: "Mensajes" },
  { key: "can_organizaciones", label: "EpiRed" },
  { key: "can_productos", label: "Tienda" },
  { key: "can_equipo", label: "Equipo" },
];

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<EpipanelUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase.from("epipanel_users").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data as EpipanelUser[]);
    setLoading(false);
  }

  async function handleUpdate(id: string, field: keyof EpipanelUser, value: string | boolean) {
    setUpdating(id);
    const { error } = await supabase.from("epipanel_users").update({ [field]: value }).eq("id", id);
    if (!error) {
      setUsers(users.map(u => u.id === id ? { ...u, [field]: value } : u));
    }
    setUpdating(null);
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Gestión de Voluntarios (Usuarios)</h1>
          <p className="text-gray-500 text-sm mt-1">Aprobá registros pendientes y asigná a qué módulos puede entrar cada uno.</p>
        </div>
        <div className="text-sm px-4 py-2 bg-[#f5f0ff] text-[#5c29c2] font-bold rounded-xl border border-[#5c29c2]/10">
          {users.length} Registrados
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
            {updating === user.id && (
              <div className="absolute top-2 right-4 text-xs font-semibold text-[#5c29c2] animate-pulse">Guardando...</div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Header Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-400">Registrado el {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Status & Admin toggle */}
              <div className="flex items-center gap-4 border-l border-gray-100 pl-4">
                <select
                  value={user.status}
                  onChange={(e) => handleUpdate(user.id, "status", e.target.value)}
                  className={`text-sm font-bold border-0 cursor-pointer rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#5c29c2] outline-none ${
                    user.status === "approved" ? "bg-green-50 text-green-700" :
                    user.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                  }`}
                >
                  <option value="pending">⏳ Pendiente</option>
                  <option value="approved">✅ Aprobado</option>
                  <option value="rejected">🚫 Rechazado</option>
                </select>

                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <input type="checkbox" checked={user.is_admin} onChange={(e) => handleUpdate(user.id, "is_admin", e.target.checked)}
                    className="w-4 h-4 text-[#5c29c2] rounded focus:ring-0 cursor-pointer" />
                  <span className="text-sm font-bold text-gray-700">Admin Total</span>
                </label>
              </div>

            </div>

            {/* Granular Permissions */}
            {!user.is_admin && user.status === "approved" && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Permisos del Editor</p>
                <div className="flex flex-wrap gap-2">
                  {perms.map((p) => {
                    const isActive = user[p.key as keyof EpipanelUser] as boolean;
                    return (
                      <button
                        key={p.key}
                        onClick={() => handleUpdate(user.id, p.key as keyof EpipanelUser, !isActive)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all ${
                          isActive 
                            ? "bg-[#5c29c2] border-[#5c29c2] text-white" 
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {isActive ? "✓" : "+"} {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {user.is_admin && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs text-[#5c29c2] font-semibold bg-[#f5f0ff] p-3 rounded-xl inline-block">
                  👑 Tiene acceso libre a todos los módulos y opciones de configuración.
                </p>
              </div>
            )}

          </div>
        ))}
        {users.length === 0 && !loading && (
          <div className="text-center p-12 bg-white rounded-2xl border border-gray-100">
            <span className="text-4xl mb-4 block">👻</span>
            <p className="text-gray-500 font-medium">No hay usuarios registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
