import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function PATCH(req: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { name, apartment } = await req.json();

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "Namnet måste vara minst 2 tecken" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name.trim(),
      apartment: apartment?.trim() || null,
    },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    apartment: updated.apartment,
  });
}