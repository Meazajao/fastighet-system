import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import Chat from "@/components/chat/Chat";
import TicketImage from "@/components/tickets/TicketImage";
import { theme } from "@/lib/theme";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) redirect("/login");

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

  if (!ticket) redirect("/dashboard");

  const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
    LOW: { color: theme.colors.textMuted, bg: "#f1f5f9", label: "Låg" },
    MEDIUM: { color: theme.colors.accent, bg: theme.colors.accentLight, label: "Normal" },
    HIGH: { color: theme.colors.warning, bg: theme.colors.warningLight, label: "Hög" },
    URGENT: { color: theme.colors.danger, bg: theme.colors.dangerLight, label: "Akut" },
  };

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    OPEN: { color: theme.colors.accent, bg: theme.colors.accentLight, label: "Öppen" },
    IN_PROGRESS: { color: "#7c3aed", bg: "#f5f3ff", label: "Pågående" },
    RESOLVED: { color: theme.colors.success, bg: theme.colors.successLight, label: "Löst" },
    CLOSED: { color: theme.colors.textMuted, bg: "#f1f5f9", label: "Stängd" },
  };

  const priority = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
  const status = statusConfig[ticket.status] || statusConfig.OPEN;

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="TENANT" name={dbUser.name} apartment={dbUser.apartment} />
      <MobileTopbar title={ticket.title} backHref="/tickets" name={dbUser.name} />
      <MobileNav role="TENANT" />

      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ maxWidth: "720px" }}>
          <div style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", gap: "16px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", color: theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {ticket.category}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: priority.color, background: priority.bg, padding: "2px 8px", borderRadius: "20px" }}>
                    {priority.label}
                  </span>
                </div>
                <h1 style={{ fontSize: "20px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                  {ticket.title}
                </h1>
                <p style={{ fontSize: "12px", color: theme.colors.textMuted, margin: 0 }}>
                  Skapat {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                </p>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: status.color, background: status.bg, padding: "4px 12px", borderRadius: "20px", whiteSpace: "nowrap", flexShrink: 0 }}>
                {status.label}
              </span>
            </div>

            <p style={{ fontSize: "14px", color: theme.colors.textSecondary, margin: 0, lineHeight: 1.7 }}>
              {ticket.description}
            </p>

            {ticket.imageUrl && (
              <div style={{ marginTop: "16px" }}>
                <TicketImage path={ticket.imageUrl} />
              </div>
            )}
          </div>

          <Chat
            ticketId={ticket.id}
            currentUserId={dbUser.id}
            initialMessages={ticket.messages as any}
          />
        </div>
      </main>
    </div>
  );
}