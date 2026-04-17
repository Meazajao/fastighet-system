import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/mail";

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

  if (session.user.role === "ADMIN") {
    console.log("Admin skickade meddelande — försöker skicka mail");
    
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { user: true },
    });

    console.log("Ticket user email:", ticket?.user?.email);

    if (ticket?.user?.email) {
      try {
        await sendNotificationEmail({
          to: ticket.user.email,
          userName: ticket.user.name,
          ticketTitle: ticket.title,
          ticketId: id,
          adminMessage: text,
        });
        console.log("Mail skickat till:", ticket.user.email);
      } catch (err) {
        console.error("Mail kunde inte skickas:", err);
      }
    }
  }

  return NextResponse.json(message);
}