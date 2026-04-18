import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const tickets =
    user.role === "ADMIN"
      ? await prisma.ticket.findMany({
          include: { user: true },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.ticket.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        });

  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { title, description, category, priority, imageUrl } = await req.json();

  if (!title || !description || !category) {
    return NextResponse.json({ error: "Fyll i alla obligatoriska fält" }, { status: 400 });
  }

  if (title.length < 3) {
    return NextResponse.json({ error: "Rubriken måste vara minst 3 tecken" }, { status: 400 });
  }

  if (description.length < 10) {
    return NextResponse.json({ error: "Beskrivningen måste vara minst 10 tecken" }, { status: 400 });
  }

  const validCategories = ["VVS", "EL", "VENTILATION", "HISS", "LAUNDRY", "EXTERIOR", "OTHER"];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Ogiltig kategori" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      category,
      priority: priority || "MEDIUM",
      imageUrl: imageUrl || null,
      userId: user.id,
    },
  });

  try {
    const { io } = await import("socket.io-client");
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
    socket.emit("new-ticket-created", {
      id: ticket.id,
      title: ticket.title,
      category: ticket.category,
      userName: user.name,
    });
    socket.disconnect();
  } catch (err) {
    console.error("Socket notification failed:", err);
  }

  return NextResponse.json(ticket, { status: 201 });
}