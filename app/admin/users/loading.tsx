import { Skeleton } from "@/components/ui/Skeleton";
import { theme } from "@/lib/theme";

export default function UsersLoading() {
  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", minHeight: "100vh", background: "#0a1628", flexShrink: 0 }} className="sidebar" />
      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <Skeleton width="150px" height="28px" style={{ marginBottom: "8px" }} />
        <Skeleton width="200px" height="16px" style={{ marginBottom: "28px" }} />
        <div style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, overflow: "hidden" }}>
          {[1, 2, 3, 4, 5].map((i, index) => (
            <div key={i} style={{ padding: "16px 24px", borderBottom: index < 4 ? "1px solid #f8fafc" : "none", display: "flex", alignItems: "center", gap: "14px" }}>
              <Skeleton width="36px" height="36px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="150px" height="16px" style={{ marginBottom: "6px" }} />
                <Skeleton width="200px" height="12px" />
              </div>
              <Skeleton width="80px" height="24px" borderRadius="20px" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}