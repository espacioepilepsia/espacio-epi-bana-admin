// supabase/functions/comments/index.ts
// Edge Function: crear comentario + notificar por email a usuarios del panel
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sendNotificationEmail(
  to: string,
  subject: string,
  html: string,
  smtpPassword: string
) {
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
    content: html,
    html: true,
  });
  await client.close();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const {
      post_id, post_title, post_slug,
      author_name, author_email, comment_body,
      honeypot, submitted_at,
    } = body;

    // ─── Anti-bot: Honeypot ────────────────────────────────────────────────────
    if (honeypot && honeypot.trim() !== "") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // ─── Anti-bot: Timer (mínimo 3 segundos) ──────────────────────────────────
    const elapsed = Date.now() - Number(submitted_at ?? 0);
    if (elapsed < 3000) {
      return new Response(
        JSON.stringify({ error: "Envío demasiado rápido. Intentá de nuevo." }),
        { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // ─── Validación básica ────────────────────────────────────────────────────
    if (!post_id || !author_name?.trim() || !comment_body?.trim()) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos." }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
    if (comment_body.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "El comentario es muy corto." }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
    if (comment_body.trim().length > 2000) {
      return new Response(
        JSON.stringify({ error: "El comentario excede el límite de caracteres." }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // ─── Supabase clients ─────────────────────────────────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, anonKey);
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // ─── Insertar comentario ──────────────────────────────────────────────────
    const { error: insertError } = await supabase.from("post_comments").insert({
      post_id,
      author_name: author_name.trim().substring(0, 100),
      author_email: author_email?.trim().substring(0, 200) ?? null,
      body: comment_body.trim(),
      status: "pending",
    });

    if (insertError) {
      console.error("[comments] Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Error al guardar el comentario." }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // ─── Notificar por email ──────────────────────────────────────────────────
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    if (smtpPassword) {
      const panelUrl = `https://espacioepilepsia.org/epipanel/blog/comentarios?post_id=${post_id}`;
      const subject = `💬 Nuevo comentario en: ${post_title ?? "una nota del blog"}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 16px;">
          <div style="background: #5c29c2; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px;">💬 Nuevo comentario pendiente</h1>
          </div>
          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">En la nota:</p>
            <p style="font-weight: bold; color: #111827; margin: 0 0 20px;">${post_title ?? "Sin título"}</p>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Comentario de <strong>${author_name}</strong>:</p>
            <div style="background: #f5f0ff; border-left: 4px solid #5c29c2; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="color: #374151; margin: 0; font-style: italic;">"${comment_body.substring(0, 300)}${comment_body.length > 300 ? "..." : ""}"</p>
            </div>
            <div style="text-align: center;">
              <a href="${panelUrl}" style="display: inline-block; background: #5c29c2; color: white; font-weight: bold; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-size: 15px;">
                Ver y moderar comentario →
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">Necesitás estar logueado en el panel para aprobar o rechazar.</p>
          </div>
        </div>
      `;

      // Obtener emails de admins/usuarios con acceso al blog
      const { data: users } = await adminClient
        .from("epipanel_users")
        .select("email")
        .eq("status", "approved")
        .or("is_admin.eq.true,can_blog.eq.true");

      const recipientEmails: string[] =
        (users ?? []).map((u: { email: string }) => u.email).filter(Boolean);

      const targets = recipientEmails.length > 0
        ? recipientEmails
        : ["espacioepilepsia.arg@gmail.com"];

      await Promise.allSettled(
        targets.map((email) => sendNotificationEmail(email, subject, html, smtpPassword))
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[comments] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Error inesperado." }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
