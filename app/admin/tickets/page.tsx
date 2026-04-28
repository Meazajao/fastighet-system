import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import TicketSearch from "@/components/tickets/TicketSearch";
import Footer from "@/components/ui/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Alla ärenden" };

export default async function AdminTicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role="ADMIN" name={dbUser.name} apartment={null} />
      <MobileTopbar title="Alla ärenden" name={dbUser.name} />
      <MobileNav role="ADMIN" />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-8 py-5 shrink-0">
          <div className="text-[12px] text-text-muted font-medium mb-1">Administration</div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-[-0.5px] m-0">
            Alla ärenden
          </h1>
        </div>

        <div className="p-8 flex-1">
          <TicketSearch tickets={tickets} />
        </div>

        <Footer />
      </main>
    </div>
  );
}