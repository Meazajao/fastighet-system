import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import Footer from "@/components/ui/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Användare" };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tickets: true } } },
  });

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role="ADMIN" name={dbUser.name} apartment={null} />
      <MobileTopbar title="Användare" name={dbUser.name} />
      <MobileNav role="ADMIN" />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 shrink-0">
          <div className="text-[11px] md:text-[12px] text-text-muted font-medium mb-0.5">Administration</div>
          <h1 className="text-[18px] md:text-[22px] font-bold text-text-primary tracking-[-0.5px] m-0">Användare</h1>
        </div>

        <div className="p-4 md:p-8 flex-1">
          <div className="text-[12px] text-text-muted font-medium mb-4">
            {users.length} registrerade användare
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
          {users.map((u) => {
  const user = u as typeof u & { _count: { tickets: number } };
  return (
    <div
      key={user.id}
      className="flex items-center justify-between bg-card rounded-2xl border border-border px-4 md:px-5 py-3 md:py-4"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}
        >
          <span className="text-[12px] md:text-[13px] font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-[13px] md:text-[14px] font-semibold text-text-primary m-0 mb-0.5">{user.name}</p>
          <p className="text-[11px] md:text-[12px] text-text-muted m-0 hidden sm:block">
            {user.email}{user.apartment ? ` · Lgh ${user.apartment}` : ""}
          </p>
          <p className="text-[11px] text-text-muted m-0 sm:hidden">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <span className="hidden md:block text-[12px] text-text-muted">
          {user._count.tickets} ärenden
        </span>
        <span
          className="text-[10px] md:text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full"
          style={{
            background: user.role === "ADMIN" ? "#f3f0ff" : "#f5f5f7",
            color: user.role === "ADMIN" ? "#5e35b1" : "#6e6e73",
          }}
        >
          {user.role === "ADMIN" ? "Admin" : "Hyresgäst"}
        </span>
      </div>
    </div>
  );
})}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}