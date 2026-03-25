// RUTA: src/app/api/perfit/route.ts
import { NextRequest, NextResponse } from "next/server";

const PERFIT_ACCOUNT = process.env.PERFIT_ACCOUNT!;
const PERFIT_API_KEY = process.env.PERFIT_API_KEY!;

// Mapeo de listas
const LISTS: Record<string, string> = {
  newsletter: "37",
  "primeros-auxilios": "41",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, nombre, apellido, list } = body;

    if (!email || !list || !LISTS[list]) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const listId = LISTS[list];

    // Construir el payload para Perfit
    const contactData: Record<string, string> = { email };
    if (nombre) contactData.firstName = nombre;
    if (apellido) contactData.lastName = apellido;

    const response = await fetch(
      `https://api.myperfit.com/v2/${PERFIT_ACCOUNT}/lists/${listId}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PERFIT_API_KEY}`,
        },
        body: JSON.stringify(contactData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Perfit] Error:", response.status, errorText);
      // No bloqueamos al usuario si Perfit falla
      return NextResponse.json({ ok: true, perfitSync: false });
    }

    return NextResponse.json({ ok: true, perfitSync: true });
  } catch (err) {
    console.error("[Perfit] Exception:", err);
    return NextResponse.json({ ok: true, perfitSync: false });
  }
}
