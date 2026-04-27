export function Skeleton({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "linear-gradient(90deg, #f3f0ff 25%, #e8e0ff 50%, #f3f0ff 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div
      className="bg-white rounded-3xl p-5 border border-gray-100"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-9 w-12 mb-3" />
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}

export function TicketCardSkeleton() {
  return (
    <div
      className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
    >
      <Skeleton className="w-18 rounded-none" style={{ height: "90px" }} />
      <div className="flex-1 px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <div className="flex gap-1 mb-1.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="flex-1 h-0.75 rounded-full" />
          ))}
        </div>
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-2 w-12" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminTicketCardSkeleton() {
  return (
    <div
      className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
    >
      <div className="w-1.5 self-stretch" style={{ background: "#f3f0ff" }} />
      <div className="flex-1 px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-5 w-48 mb-1" />
            <Skeleton className="h-3 w-64 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 bg-background flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
        <div>
          <Skeleton className="h-3 w-32 mb-2" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <TicketCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 bg-background flex flex-col">
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-7 w-36" />
      </div>
      <div className="p-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-11 flex-1 rounded-2xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => <AdminTicketCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}

export function TicketDetailSkeleton() {
  return (
    <div className="flex-1 bg-background flex flex-col">
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <Skeleton className="h-8 w-24 mb-0 rounded-xl" />
      </div>
      <div className="p-8 max-w-190">
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-7 w-20 rounded-lg" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="px-6 py-5">
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-3 w-36 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ height: "480px" }}>
          <div className="px-5 py-3.5 border-b border-gray-100">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="p-5 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex gap-2 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                {i % 2 !== 0 && <Skeleton className="w-7 h-7 rounded-full shrink-0" />}
                <Skeleton className={`h-12 rounded-2xl ${i % 2 === 0 ? "w-48" : "w-56"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex-1 bg-background flex flex-col">
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <Skeleton className="h-8 w-24 mb-4 rounded-xl" />
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-36" />
      </div>
      <div className="p-8 max-w-150 flex flex-col gap-5">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
          <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-36 mb-2" />
            <Skeleton className="h-3 w-48 mb-2" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
          <div className="px-6 py-4 border-b border-gray-100">
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-14 rounded-2xl" />
              <Skeleton className="h-14 rounded-2xl" />
            </div>
            <Skeleton className="h-14 rounded-2xl" />
            <div className="flex justify-end">
              <Skeleton className="h-11 w-36 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GenericPageSkeleton() {
  return (
    <div className="flex-1 bg-background flex flex-col">
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <Skeleton className="h-8 w-24 mb-4 rounded-xl" />
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-48" />
      </div>
      <div className="p-8 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <div className="px-5 py-4 border-b border-gray-100">
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="p-5">
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-5 border-b border-gray-50 last:border-0">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}