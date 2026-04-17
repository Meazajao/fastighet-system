import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, apartment } = await req.json();

  if (!name || !email || !password) {
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

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      apartment: apartment || null,
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}