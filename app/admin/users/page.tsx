import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import { theme } from "@/lib/theme";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tickets: true } },
    },
  });

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="ADMIN" name={dbUser.name} apartment={null} />
      <MobileTopbar title="Användare" name={dbUser.name} />
      <MobileNav role="ADMIN" />

      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            Användare
          </h1>
          <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: 0 }}>
            Alla registrerade hyresgäster
          </p>
        </div>

        <div style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
              Alla användare
            </h2>
            <span style={{ fontSize: "12px", color: theme.colors.textMuted }}>
              {users.length} st
            </span>
          </div>

          <div>
            {users.map((user, index) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  borderBottom: index < users.length - 1 ? "1px solid #f8fafc" : "none",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: theme.colors.accentLight,
                      border: `1px solid ${theme.colors.accentBorder}`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 600, color: theme.colors.accent }}>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: theme.colors.textPrimary, margin: "0 0 2px" }}>
                      {user.name}
                    </p>
                    <p style={{ fontSize: "12px", color: theme.colors.textMuted, margin: 0 }}>
                      {user.email} {user.apartment ? `· ${user.apartment}` : ""}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                    {user._count.tickets} ärenden
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: user.role === "ADMIN" ? theme.colors.accent : theme.colors.textMuted,
                      background: user.role === "ADMIN" ? theme.colors.accentLight : "#f1f5f9",
                      padding: "3px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    {user.role === "ADMIN" ? "Admin" : "Hyresgäst"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}