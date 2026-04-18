import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, apartment } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Fyll i alla obligatoriska fält" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "E-postadressen är redan registrerad" },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: "",
      apartment: apartment || null,
      role: "TENANT",
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}