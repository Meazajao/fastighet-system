import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import TicketSearch from "@/components/tickets/TicketSearch";
import { theme } from "@/lib/theme";

export default async function AdminTicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="ADMIN" name={dbUser.name} apartment={null} />
      <MobileTopbar title="Alla ärenden" name={dbUser.name} />
      <MobileNav role="ADMIN" />

      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            Alla ärenden
          </h1>
          <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: 0 }}>
            {tickets.length} ärenden totalt
          </p>
        </div>

        <TicketSearch tickets={tickets} />
      </main>
    </div>
  );
}