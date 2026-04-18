import Link from "next/link";
import { theme } from "@/lib/theme";

interface EmptyStateProps {
  icon?: "ticket" | "users" | "search" | "inbox";
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    ticket: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.colors.textMuted}>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
    users: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.colors.textMuted}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    search: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.colors.textMuted}>
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
    inbox: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.colors.textMuted}>
        <path d="M19 3H4.99C3.89 3 3 3.9 3 5L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/>
      </svg>
    ),
  };
  return <>{icons[name] || icons.ticket}</>;
}

export default function EmptyState({ icon = "ticket", title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: "64px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {/* Ikon */}
      <div
        style={{
          width: "56px",
          height: "56px",
          background: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "4px",
        }}
      >
        <Icon name={icon} />
      </div>

      {/* Text */}
      <div>
        <h3
          style={{
            fontSize: theme.fontSize.md,
            fontWeight: 600,
            color: theme.colors.textPrimary,
            margin: "0 0 6px",
            letterSpacing: "-0.2px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
            margin: 0,
            maxWidth: "320px",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {/* Action */}
      {action && (
        <Link
          href={action.href}
          style={{
            marginTop: "8px",
            padding: "9px 18px",
            background: theme.colors.accent,
            color: "#fff",
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fontSize.sm,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}