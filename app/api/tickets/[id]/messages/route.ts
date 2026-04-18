import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/mail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return NextResponse.json({ error: "Ej hittad" }, { status: 404 });

  const { id } = await params;
  const { text } = await req.json();

  if (!text) return NextResponse.json({ error: "Tomt meddelande" }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      text,
      ticketId: id,
      userId: dbUser.id,
    },
    include: { user: true },
  });

  if (dbUser.role === "ADMIN") {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { user: true },
    });

    if (ticket?.user?.email) {
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
  }

  return NextResponse.json(message);
}