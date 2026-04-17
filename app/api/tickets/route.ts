import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const tickets =
    session.user.role === "ADMIN"
      ? await prisma.ticket.findMany({
          include: { user: true },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.ticket.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
        });

  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const { title, description, category, priority } = await req.json();

  if (!title || !description || !category) {
    return NextResponse.json({ error: "Fyll i alla fält" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      category,
      priority,
      userId: session.user.id,
    },
  });

  return NextResponse.json(ticket);
}