import { AdminTicketCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function TicketsLoading() {
  return (
    <div className="app-layout flex min-h-screen">
      <div className="w-55 min-h-screen bg-white border-r border-gray-100 shrink-0" />
      <div className="flex-1 bg-background flex flex-col">
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-7 w-36" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="p-8 flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => <AdminTicketCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}