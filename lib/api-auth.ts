import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export type AuthResult =
  | { user: { id: string; name: string; email: string; role: string; apartment: string | null }; error: null }
  | { user: null; error: NextResponse };

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Ej autentiserad" }, { status: 401 }),
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    return {
      user: null,
      error: NextResponse.json({ error: "Användaren hittades inte" }, { status: 404 }),
    };
  }

  return { user: dbUser, error: null };
}

export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth();

  if (result.error) return result;

  if (result.user.role !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json({ error: "Åtkomst nekad — admin krävs" }, { status: 403 }),
    };
  }

  return result;
}