import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { theme } from "@/lib/theme";

export default function DashboardLoading() {
  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", minHeight: "100vh", background: "#0a1628", flexShrink: 0 }} className="sidebar" />
      <div className="mobile-topbar" style={{ display: "none" }}>
        <MobileTopbar title="Översikt" />
      </div>
      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <DashboardSkeleton />
      </main>
    </div>
  );
}