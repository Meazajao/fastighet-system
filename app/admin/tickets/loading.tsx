import { TicketCardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { theme } from "@/lib/theme";

export default function AdminTicketsLoading() {
  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", minHeight: "100vh", background: "#0a1628", flexShrink: 0 }} className="sidebar" />
      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <Skeleton width="180px" height="28px" style={{ marginBottom: "8px" }} />
        <Skeleton width="120px" height="16px" style={{ marginBottom: "28px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[1, 2, 3, 4, 5].map((i) => <TicketCardSkeleton key={i} />)}
        </div>
      </main>
    </div>
  );
}