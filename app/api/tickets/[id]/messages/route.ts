import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const { id } = await params;
  const { text } = await req.json();

  if (!text) return NextResponse.json({ error: "Tomt meddelande" }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      text,
      ticketId: id,
      userId: session.user.id,
    },
    include: { user: true },
  });

  return NextResponse.json(message);
}