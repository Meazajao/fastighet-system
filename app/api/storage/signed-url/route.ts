import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { requireAuth } from "@/lib/api-auth";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { path } = await req.json();

  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "Ogiltig filsökväg" }, { status: 400 });
  }

  const { data, error: signedError } = await supabaseAdmin.storage
    .from("ticket-images")
    .createSignedUrl(path, 3600);

  if (signedError) {
    return NextResponse.json({ error: signedError.message }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}