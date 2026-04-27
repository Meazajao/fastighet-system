import { AdminDashboardSkeleton } from "@/components/ui/Skeleton";

export default function AdminTicketsLoading() {
  return (
    <div className="app-layout flex min-h-screen">
      <div className="w-55 min-h-screen bg-white border-r border-gray-100 shrink-0" />
      <AdminDashboardSkeleton />
    </div>
  );
}