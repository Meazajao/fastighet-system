import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { theme } from "@/lib/theme";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mina ärenden" };

export default async function TicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) redirect("/login");

  const tickets = await prisma.ticket.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    OPEN: { color: theme.colors.accent, bg: theme.colors.accentLight, label: "Öppen" },
    IN_PROGRESS: { color: "#7c3aed", bg: "#f5f3ff", label: "Pågående" },
    RESOLVED: { color: theme.colors.success, bg: theme.colors.successLight, label: "Löst" },
    CLOSED: { color: theme.colors.textMuted, bg: "#f1f5f9", label: "Stängd" },
  };

  const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
    LOW: { color: theme.colors.textMuted, bg: "#f1f5f9", label: "Låg" },
    MEDIUM: { color: theme.colors.accent, bg: theme.colors.accentLight, label: "Normal" },
    HIGH: { color: theme.colors.warning, bg: theme.colors.warningLight, label: "Hög" },
    URGENT: { color: theme.colors.danger, bg: theme.colors.dangerLight, label: "Akut" },
  };

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="TENANT" name={dbUser.name} apartment={dbUser.apartment} />
      <MobileTopbar title="Mina ärenden" name={dbUser.name} />
      <MobileNav role="TENANT" />

      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
              Mina ärenden
            </h1>
            <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: 0 }}>
              {tickets.length} ärenden totalt
            </p>
          </div>
          <Link
            href="/tickets/new"
            style={{ background: theme.colors.accent, color: "#fff", padding: "10px 18px", borderRadius: theme.borderRadius.md, fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
          >
            + Nytt ärende
          </Link>
        </div>

        {tickets.length === 0 ? (
          <EmptyState
            icon="ticket"
            title="Inga ärenden hittades"
            description="Du har inga aktiva ärenden. Skapa ett nytt ärende för att rapportera ett fel eller en skada i din lägenhet."
            action={{ label: "+ Nytt ärende", href: "/tickets/new" }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {tickets.map((ticket) => {
              const status = statusConfig[ticket.status] || statusConfig.OPEN;
              const priority = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
              return (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  style={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    borderLeft: `4px solid ${status.color}`,
                    borderRadius: theme.borderRadius.lg,
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                        {ticket.category}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: priority.color, background: priority.bg, padding: "2px 8px", borderRadius: "4px" }}>
                        {priority.label}
                      </span>
                      <span style={{ fontSize: "11px", color: theme.colors.textMuted }}>
                        {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                      </span>
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px" }}>
                      {ticket.title}
                    </p>
                    <p className="ticket-description" style={{ fontSize: "12px", color: theme.colors.textSecondary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ticket.description}
                    </p>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: status.color, background: status.bg, padding: "5px 14px", borderRadius: "20px", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {status.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}