import { theme } from "@/lib/theme";
import { statusLabel, priorityLabel, statusConfig, priorityConfig, categoryLabel } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

interface PriorityBadgeProps {
  priority: string;
}

interface CategoryBadgeProps {
  category: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.CLOSED;
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: config.color,
        background: config.bg,
        padding: "4px 12px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {statusLabel(status)}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 600,
        color: config.color,
        background: config.bg,
        padding: "2px 8px",
        borderRadius: "4px",
      }}
    >
      {priorityLabel(priority)}
    </span>
  );
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 600,
        color: "#475569",
        background: "#f1f5f9",
        padding: "2px 8px",
        borderRadius: "4px",
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
      }}
    >
      {categoryLabel(category)}
    </span>
  );
}