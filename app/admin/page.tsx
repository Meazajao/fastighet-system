import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import TicketSearch from "@/components/tickets/TicketSearch";
import AdminNotifications from "@/components/AdminNotifications";
import { theme } from "@/lib/theme";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin — Översikt" };

export default async function AdminPage() {
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

  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const urgent = tickets.filter((t) => t.priority === "URGENT").length;

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="ADMIN" name={dbUser.name} apartment={null} />
      <MobileTopbar title="Översikt" name={dbUser.name} />
      <MobileNav role="ADMIN" />
      <AdminNotifications />

      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            Översikt
          </h1>
          <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: 0 }}>
            Alla inkomna ärenden från hyresgäster
          </p>
        </div>

        <div className="stats-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Totalt", value: tickets.length, color: theme.colors.textPrimary },
            { label: "Öppna", value: open, color: theme.colors.accent },
            { label: "Pågående", value: inProgress, color: "#7c3aed" },
            { label: "Akuta", value: urgent, color: theme.colors.warning },
          ].map((stat) => (
            <div key={stat.label} style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, padding: "20px" }}>
              <p style={{ fontSize: "11px", color: theme.colors.textMuted, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "32px", fontWeight: 600, color: stat.color, margin: 0, letterSpacing: "-1px" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <TicketSearch tickets={tickets} />
      </main>
    </div>
  );
}