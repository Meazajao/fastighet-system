import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fastighet.se" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@fastighet.se",
      password: hashedPassword,
      role: "ADMIN",
      apartment: null,
    },
  });

  console.log("Admin skapad:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());