// RUTA: src/app/api/comments/pending/route.ts
// API endpoint para obtener comentarios pendientes
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client (service_role) para bypassear RLS
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!serviceKey || !supabaseUrl) {
    console.error("[Comments API] Missing env vars:", { serviceKey: !!serviceKey, supabaseUrl: !!supabaseUrl });
    return null;
  }
  
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function GET(req: NextRequest) {
  try {
    const adminClient = getAdminClient();
    if (!adminClient) {
      console.error("[Comments API] Failed to initialize admin client");
      return NextResponse.json({ error: "Service key not configured" }, { status: 500 });
    }

    // Obtener parámetro de query (post_id es opcional)
    const searchParams = req.nextUrl.searchParams;
    const postId = searchParams.get("post_id");

    // Construir la query
    let query = adminClient
      .from("post_comments")
      .select("*, posts(title, slug)")
      .order("created_at", { ascending: false });

    if (postId) {
      query = query.eq("post_id", postId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Comments API] Supabase error:", error);
      return NextResponse.json({ error: "Failed to fetch comments", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("[Comments API] Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected error", details: error.message }, { status: 500 });
  }
}