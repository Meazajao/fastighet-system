import { Skeleton } from "@/components/ui/Skeleton";

export default function NewTicketLoading() {
  return (
    <div className="app-layout flex min-h-screen">
      <div className="w-55 min-h-screen bg-white border-r border-gray-100 shrink-0" />
      <div className="flex-1 bg-background flex flex-col">
        <div className="bg-white border-b border-gray-100 px-8 py-5">
          <Skeleton className="h-8 w-24 mb-4 rounded-xl" />
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-7 w-36" />
        </div>
        <div className="p-8 max-w-170 flex flex-col gap-5">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="p-6 flex flex-col gap-5">
              <Skeleton className="h-14 rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-14 rounded-2xl" />
                <Skeleton className="h-14 rounded-2xl" />
              </div>
              <Skeleton className="h-36 rounded-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="p-6">
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Skeleton className="h-11 w-24 rounded-2xl" />
            <Skeleton className="h-11 w-32 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}