// supabase/functions/send-email/index.ts
// Edge Function: envío de emails via SMTP de Hostinger usando SmtpClient de Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject || !text) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    if (!smtpPassword) {
      return new Response(
        JSON.stringify({ error: "Falta configurar SMTP_PASSWORD" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "smtp.hostinger.com",
      port: 465,
      username: "contacto@espacioepilepsia.org",
      password: smtpPassword,
    });

    await client.send({
      from: "Espacio Epilepsia <contacto@espacioepilepsia.org>",
      to,
      subject,
      content: html || text.replace(/\n/g, "<br>"),
      html: true,
    });

    await client.close();

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[send-email] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al enviar el correo" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
