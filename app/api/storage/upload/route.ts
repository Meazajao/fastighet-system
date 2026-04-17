import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "Ingen fil" }, { status: 400 });

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Bilden får inte vara större än 10MB" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from("ticket-images")
    .upload(fileName, buffer, {
      contentType: file.type,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ path: fileName });
}