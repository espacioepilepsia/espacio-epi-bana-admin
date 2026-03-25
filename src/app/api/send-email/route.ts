// RUTA: src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject || !text) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    if (!process.env.SMTP_PASSWORD) {
      return NextResponse.json({ error: "Falta configurar SMTP_PASSWORD en el entorno" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Hostinger SMTP
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: "contacto@espacioepilepsia.org",
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"Espacio Epilepsia" <contacto@espacioepilepsia.org>',
      to,
      replyTo: "contacto@espacioepilepsia.org",
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("[Email Sync] Error:", error);
    return NextResponse.json({ error: error.message || "Error al enviar el correo" }, { status: 500 });
  }
}
