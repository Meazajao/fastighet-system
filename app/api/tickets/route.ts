import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return NextResponse.json({ error: "Ej hittad" }, { status: 404 });

  const tickets =
    dbUser.role === "ADMIN"
      ? await prisma.ticket.findMany({
          include: { user: true },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.ticket.findMany({
          where: { userId: dbUser.id },
          orderBy: { createdAt: "desc" },
        });

  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return NextResponse.json({ error: "Ej hittad" }, { status: 404 });

  const { title, description, category, priority, imageUrl } = await req.json();

  if (!title || !description || !category) {
    return NextResponse.json({ error: "Fyll i alla fält" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      category,
      priority,
      imageUrl: imageUrl || null,
      userId: dbUser.id,
    },
  });

  return NextResponse.json(ticket);
}