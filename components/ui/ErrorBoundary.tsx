"use client";

import { useEffect } from "react";
import { theme } from "@/lib/theme";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export default function ErrorBoundary({ error, reset, title = "Något gick fel" }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        padding: "32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          background: theme.colors.dangerLight,
          border: `1px solid ${theme.colors.dangerBorder}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.danger}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>

      <h2 style={{
        fontSize: theme.fontSize.lg,
        fontWeight: 600,
        color: theme.colors.textPrimary,
        margin: "0 0 8px",
        letterSpacing: "-0.3px",
      }}>
        {title}
      </h2>

      <p style={{
        fontSize: theme.fontSize.sm,
        color: theme.colors.textMuted,
        margin: "0 0 24px",
        maxWidth: "400px",
        lineHeight: 1.6,
      }}>
        Ett oväntat fel uppstod. Försök igen eller kontakta support om problemet kvarstår.
      </p>

      {process.env.NODE_ENV === "development" && (
        <div style={{
          background: theme.colors.dangerLight,
          border: `1px solid ${theme.colors.dangerBorder}`,
          borderRadius: theme.borderRadius.md,
          padding: "12px 16px",
          marginBottom: "24px",
          maxWidth: "500px",
          textAlign: "left",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: theme.colors.danger, margin: "0 0 4px" }}>
            Felmeddelande (visas bara i development)
          </p>
          <p style={{ fontSize: "11px", color: theme.colors.danger, margin: 0, fontFamily: "monospace", wordBreak: "break-all" }}>
            {error.message}
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 20px",
            background: theme.colors.accent,
            border: "none",
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fontSize.base,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Försök igen
        </button>
        <button
          onClick={() => window.location.href = "/dashboard"}
          style={{
            padding: "10px 20px",
            background: "transparent",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fontSize.base,
            fontWeight: 600,
            color: theme.colors.textSecondary,
            cursor: "pointer",
          }}
        >
          Gå till startsidan
        </button>
      </div>
    </div>
  );
}