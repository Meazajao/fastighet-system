import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/lib/api-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      user: true,
      messages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ärendet hittades inte" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && ticket.userId !== user.id) {
    return NextResponse.json({ error: "Åtkomst nekad" }, { status: 403 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Ogiltig status" }, { status: 400 });
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(ticket);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  await prisma.ticket.delete({ where: { id } });

  return NextResponse.json({ success: true });
}