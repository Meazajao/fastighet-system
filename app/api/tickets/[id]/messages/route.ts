import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { sendNotificationEmail } from "@/lib/mail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const { text } = await req.json();

  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: "Meddelandet kan inte vara tomt" }, { status: 400 });
  }

  if (text.length > 2000) {
    return NextResponse.json({ error: "Meddelandet är för långt (max 2000 tecken)" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ärendet hittades inte" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && ticket.userId !== user.id) {
    return NextResponse.json({ error: "Åtkomst nekad" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      text: text.trim(),
      ticketId: id,
      userId: user.id,
    },
    include: { user: true },
  });

  if (user.role === "ADMIN" && ticket.user?.email) {
    try {
      await sendNotificationEmail({
        to: ticket.user.email,
        userName: ticket.user.name,
        ticketTitle: ticket.title,
        ticketId: id,
        adminMessage: text,
      });
    } catch (err) {
      console.error("Mail kunde inte skickas:", err);
    }
  }

  return NextResponse.json(message, { status: 201 });
}