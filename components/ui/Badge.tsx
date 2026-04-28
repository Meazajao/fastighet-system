import { statusLabel, priorityLabel, categoryLabel } from "@/lib/styles";

interface BadgeProps {
  value: string;
}

export function StatusBadge({ value }: BadgeProps) {
  const config: Record<string, { color: string; bg: string }> = {
    OPEN: { color: "#005b99", bg: "#f0f6fc" },
    IN_PROGRESS: { color: "#5b21b6", bg: "#f5f3ff" },
    RESOLVED: { color: "#0f6e56", bg: "#e1f5ee" },
    CLOSED: { color: "#6b7a8d", bg: "#f4f5f7" },
  };
  const s = config[value] || config.CLOSED;

  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}
    >
      {statusLabel(value)}
    </span>
  );
}

export function PriorityBadge({ value }: BadgeProps) {
  const config: Record<string, { color: string; bg: string }> = {
    LOW: { color: "#6b7a8d", bg: "#f4f5f7" },
    MEDIUM: { color: "#005b99", bg: "#f0f6fc" },
    HIGH: { color: "#c8a000", bg: "#fefce8" },
    URGENT: { color: "#a32d2d", bg: "#fff0f0" },
  };
  const s = config[value] || config.MEDIUM;

  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}
    >
      {priorityLabel(value)}
    </span>
  );
}

export function CategoryBadge({ value }: BadgeProps) {
  return (
    <span className="text-[9px] font-medium text-text-muted bg-background px-1.5 py-0.5 uppercase tracking-[0.08em]">
      {categoryLabel(value)}
    </span>
  );
}