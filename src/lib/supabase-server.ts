import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente para Server Components / Route Handlers.
 *
 * Nota: durante el build/prerender, Turbopack puede ejecutar workers donde
 * las envs no están disponibles. Por eso evitamos tirar error en "import time".
 * Si falta configuración, las consultas van a fallar con un mensaje claro.
 */
export const supabaseServer =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : createClient("http://localhost", "missing-supabase-env");

