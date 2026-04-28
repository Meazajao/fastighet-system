import { Suspense } from "react";
import { DashboardSkeleton, AdminDashboardSkeleton } from "@/components/ui/Skeleton";

interface PageWrapperProps {
  children: React.ReactNode;
  skeleton?: "dashboard" | "admin" | "none";
}

export default function PageWrapper({ children, skeleton = "none" }: PageWrapperProps) {
  const fallback =
    skeleton === "dashboard" ? <DashboardSkeleton /> :
    skeleton === "admin" ? <AdminDashboardSkeleton /> :
    null;

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}