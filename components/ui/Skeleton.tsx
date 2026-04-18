import { theme } from "@/lib/theme";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = "16px", borderRadius = "4px", style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

export function TicketCardSkeleton() {
  return (
    <div style={{
      background: theme.colors.card,
      border: "1px solid #e2e8f0",
      borderLeft: "4px solid #e2e8f0",
      borderRadius: theme.borderRadius.lg,
      borderTopLeftRadius: "0",
      borderBottomLeftRadius: "0",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <Skeleton width="60px" height="20px" />
          <Skeleton width="80px" height="20px" />
        </div>
        <Skeleton width="200px" height="18px" />
        <Skeleton width="300px" height="14px" />
      </div>
      <Skeleton width="70px" height="24px" borderRadius="20px" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div style={{
      background: theme.colors.card,
      border: "1px solid #e2e8f0",
      borderRadius: theme.borderRadius.lg,
      padding: "16px 12px",
    }}>
      <Skeleton width="60px" height="12px" style={{ marginBottom: "8px" }} />
      <Skeleton width="40px" height="32px" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <Skeleton width="200px" height="28px" style={{ marginBottom: "8px" }} />
        <Skeleton width="150px" height="16px" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[1, 2, 3, 4].map((i) => <TicketCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <Skeleton width="150px" height="28px" style={{ marginBottom: "8px" }} />
        <Skeleton width="250px" height="16px" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[1, 2, 3, 4, 5].map((i) => <TicketCardSkeleton key={i} />)}
      </div>
    </div>
  );
}