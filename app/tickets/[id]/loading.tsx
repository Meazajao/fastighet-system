import { Skeleton } from "@/components/ui/Skeleton";
import { theme } from "@/lib/theme";

export default function TicketLoading() {
  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", minHeight: "100vh", background: "#0a1628", flexShrink: 0 }} className="sidebar" />
      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ maxWidth: "720px" }}>
          <div style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <Skeleton width="60px" height="20px" />
                  <Skeleton width="50px" height="20px" />
                </div>
                <Skeleton width="250px" height="24px" style={{ marginBottom: "8px" }} />
                <Skeleton width="150px" height="14px" />
              </div>
              <Skeleton width="70px" height="24px" borderRadius="20px" />
            </div>
            <Skeleton width="100%" height="14px" style={{ marginBottom: "6px" }} />
            <Skeleton width="80%" height="14px" style={{ marginBottom: "6px" }} />
            <Skeleton width="90%" height="14px" />
          </div>
          <div style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, height: "420px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Skeleton width="120px" height="16px" />
          </div>
        </div>
      </main>
    </div>
  );
}