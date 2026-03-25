// RUTA: src/app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Admin client (service_role) para bypassear RLS y leer emails de usuarios
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return null;
  return createClient(
    "https://thyzyeredmmtywiixuzd.supabase.co",
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "contacto@espacioepilepsia.org",
      pass: process.env.SMTP_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: '"Espacio Epilepsia" <contacto@espacioepilepsia.org>',
    to,
    subject,
    html,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { post_id, post_title, post_slug, author_name, author_email, comment_body, honeypot, submitted_at } = body;

    // ─── Anti-bot: Honeypot check ────────────────────────────────────────────
    if (honeypot && honeypot.trim() !== "") {
      // silently accept to not reveal detection
      return NextResponse.json({ ok: true });
    }

    // ─── Anti-bot: Timer check (must take at least 3 seconds) ────────────────
    const elapsed = Date.now() - Number(submitted_at ?? 0);
    if (elapsed < 3000) {
      return NextResponse.json({ error: "Envío demasiado rápido. Intentá de nuevo." }, { status: 429 });
    }

    // ─── Basic validation ─────────────────────────────────────────────────────
    if (!post_id || !author_name?.trim() || !comment_body?.trim()) {
      return NextResponse.json({ error: "Faltan datos requeridos." }, { status: 400 });
    }
    if (comment_body.trim().length < 10) {
      return NextResponse.json({ error: "El comentario es muy corto." }, { status: 400 });
    }
    if (comment_body.trim().length > 2000) {
      return NextResponse.json({ error: "El comentario excede el límite de caracteres." }, { status: 400 });
    }

    // ─── Insert comment ───────────────────────────────────────────────────────
    const { error: insertError } = await supabase.from("post_comments").insert({
      post_id,
      author_name: author_name.trim().substring(0, 100),
      author_email: author_email?.trim().substring(0, 200) ?? null,
      body: comment_body.trim(),
      status: "pending",
    });

    if (insertError) {
      console.error("[Comments] Insert error:", insertError);
      return NextResponse.json({ error: "Error al guardar el comentario." }, { status: 500 });
    }

    // ─── Notify users with blog permissions ───────────────────────────────────
    if (process.env.SMTP_PASSWORD) {
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

      // Usar admin client para bypassear RLS y leer emails de usuarios con acceso al blog
      const adminClient = getAdminClient();
      let recipientEmails: string[] = [];

      if (adminClient) {
        const { data: users } = await adminClient
          .from("epipanel_users")
          .select("email")
          .eq("status", "approved")
          .or("is_admin.eq.true,can_blog.eq.true");
        recipientEmails = (users ?? []).map((u: { email: string }) => u.email).filter(Boolean);
      }

      // Fallback: si no hay service key o no hubo usuarios, enviar a la cuenta principal
      if (recipientEmails.length === 0) {
        recipientEmails = ["espacioepilepsia.arg@gmail.com"];
      }

      await Promise.allSettled(
        recipientEmails.map(email => sendEmail(email, subject, html))
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("[Comments] Unexpected error:", error);
    return NextResponse.json({ error: "Error inesperado." }, { status: 500 });
  }
}
