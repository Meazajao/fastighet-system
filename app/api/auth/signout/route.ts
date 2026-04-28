import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Signout error:", err);
  }

  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  );
}