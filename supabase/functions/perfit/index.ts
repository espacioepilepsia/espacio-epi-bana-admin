// supabase/functions/perfit/index.ts
// Edge Function para suscripción a Perfit
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LISTS: Record<string, string> = {
  newsletter: "37",
  "primeros-auxilios": "41",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { email, nombre, apellido, list } = body;

    if (!email || !list || !LISTS[list]) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const listId = LISTS[list];
    const contactData: Record<string, string> = { email };
    if (nombre) contactData.firstName = nombre;
    if (apellido) contactData.lastName = apellido;

    const perfitAccount = Deno.env.get("PERFIT_ACCOUNT");
    const perfitApiKey = Deno.env.get("PERFIT_API_KEY");

    if (!perfitAccount || !perfitApiKey) {
      console.error("[perfit] Missing Perfit credentials");
      return new Response(JSON.stringify({ ok: true, perfitSync: false }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(
      `https://api.myperfit.com/v2/${perfitAccount}/lists/${listId}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${perfitApiKey}`,
        },
        body: JSON.stringify(contactData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Perfit] Error:", response.status, errorText);
      return new Response(JSON.stringify({ ok: true, perfitSync: false }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, perfitSync: true }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Perfit] Exception:", err);
    return new Response(JSON.stringify({ ok: true, perfitSync: false }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
