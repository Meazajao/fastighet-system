import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, apartment } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Namn och e-post krävs" }, { status: 400 });
  }

  if (name.trim().length < 2) {
    return NextResponse.json({ error: "Namnet måste vara minst 2 tecken" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Ogiltig e-postadress" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "E-postadressen är redan registrerad" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: "",
      apartment: apartment?.trim() || null,
      role: "TENANT",
    },
  });

  return NextResponse.json(
    { id: user.id, name: user.name, email: user.email },
    { status: 201 }
  );
}