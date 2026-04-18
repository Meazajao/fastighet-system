import Link from "next/link";
import { theme } from "@/lib/theme";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: theme.colors.accent,
            letterSpacing: "-4px",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: theme.colors.textPrimary,
            margin: "0 0 8px",
            letterSpacing: "-0.3px",
          }}
        >
          Sidan hittades inte
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: theme.colors.textMuted,
            margin: "0 0 32px",
            lineHeight: 1.6,
          }}
        >
          Sidan du letar efter finns inte eller har flyttats. Kontrollera adressen och försök igen.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href="/dashboard"
            style={{
              padding: "10px 20px",
              background: theme.colors.accent,
              color: "#fff",
              borderRadius: theme.borderRadius.md,
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Gå till startsidan
          </Link>
          <Link
            href="/tickets/new"
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.textSecondary,
              borderRadius: theme.borderRadius.md,
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Skapa ärende
          </Link>
        </div>
      </div>
    </div>
  );
}