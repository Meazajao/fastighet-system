import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { theme } from "@/lib/theme";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) redirect("/login");
  if (dbUser.role === "ADMIN") redirect("/admin");

  const tickets = await prisma.ticket.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="TENANT" name={dbUser.name} apartment={dbUser.apartment} />

      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            Hej, {dbUser.name.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: 0 }}>
            {dbUser.apartment || "Ingen lägenhet angiven"}
          </p>
        </div>

        <div className="stats-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Öppna", value: open, color: theme.colors.textPrimary },
            { label: "Pågående", value: inProgress, color: theme.colors.accent },
            { label: "Lösta", value: resolved, color: theme.colors.success },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: theme.colors.card,
                border: "1px solid #e2e8f0",
                borderRadius: theme.borderRadius.lg,
                padding: "20px",
              }}
            >
              <p style={{ fontSize: "11px", color: theme.colors.textMuted, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "32px", fontWeight: 600, color: stat.color, margin: 0, letterSpacing: "-1px" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
            Mina ärenden
          </h2>
          <Link
            href="/tickets/new"
            style={{
              background: theme.colors.accent,
              color: "#fff",
              padding: "8px 16px",
              borderRadius: theme.borderRadius.md,
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + Nytt ärende
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div
            style={{
              background: theme.colors.card,
              border: "1px solid #e2e8f0",
              borderRadius: theme.borderRadius.lg,
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p style={{ color: theme.colors.textMuted, fontSize: "14px", margin: "0 0 8px" }}>Inga ärenden ännu</p>
            <Link href="/tickets/new" style={{ color: theme.colors.accent, fontSize: "13px", fontWeight: 600 }}>
              Skapa ditt första ärende
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                style={{
                  background: theme.colors.card,
                  border: "1px solid #e2e8f0",
                  borderLeft: `4px solid ${ticket.status === "OPEN" ? theme.colors.accent : ticket.status === "IN_PROGRESS" ? "#7c3aed" : ticket.status === "RESOLVED" ? theme.colors.success : "#cbd5e1"}`,
                  borderRadius: theme.borderRadius.lg,
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textDecoration: "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#475569",
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}>
                      {ticket.category}
                    </span>
                    <span style={{ fontSize: "11px", color: theme.colors.textMuted }}>
                      {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                    </span>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px" }}>
                    {ticket.title}
                  </p>
                  <p className="ticket-description" style={{
                    fontSize: "12px",
                    color: theme.colors.textSecondary,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "500px",
                  }}>
                    {ticket.description}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; label: string }> = {
    OPEN: { color: theme.colors.accent, bg: theme.colors.accentLight, label: "Öppen" },
    IN_PROGRESS: { color: "#7c3aed", bg: "#f5f3ff", label: "Pågående" },
    RESOLVED: { color: theme.colors.success, bg: theme.colors.successLight, label: "Löst" },
    CLOSED: { color: theme.colors.textMuted, bg: "#f1f5f9", label: "Stängd" },
  };
  const s = config[status] || config.CLOSED;
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        padding: "4px 12px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
        marginLeft: "16px",
        flexShrink: 0,
      }}
    >
      {s.label}
    </span>
  );
}