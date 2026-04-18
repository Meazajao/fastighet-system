import { AdminDashboardSkeleton } from "@/components/ui/Skeleton";
import { theme } from "@/lib/theme";

export default function AdminLoading() {
  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", minHeight: "100vh", background: "#0a1628", flexShrink: 0 }} className="sidebar" />
      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <AdminDashboardSkeleton />
      </main>
    </div>
  );
}