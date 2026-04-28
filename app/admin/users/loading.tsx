import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="app-layout flex min-h-screen">
      <div className="w-55 min-h-screen bg-white border-r border-gray-100 shrink-0" />
      <div className="flex-1 bg-background flex flex-col">
        <div className="bg-white border-b border-gray-100 px-8 py-5">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-7 w-36" />
        </div>
        <div className="p-8 flex flex-col gap-3">
          <Skeleton className="h-3 w-40 mb-1" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}