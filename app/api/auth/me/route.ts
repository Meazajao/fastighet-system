import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    apartment: user.apartment,
  });
}