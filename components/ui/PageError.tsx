"use client";

import { useEffect } from "react";
import { theme } from "@/lib/theme";

interface PageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PageError({ error, reset }: PageErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <div
        className="sidebar"
        style={{ width: "220px", minHeight: "100vh", background: "#0a1628", flexShrink: 0 }}
      />
      <main
        className="main-content"
        style={{ flex: 1, background: theme.colors.background, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
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
              margin: "0 auto 16px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.danger}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 8px", letterSpacing: "-0.3px" }}>
            Sidan kunde inte laddas
          </h2>
          <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
            Ett fel uppstod när sidan skulle laddas. Försök igen eller kontakta support om problemet kvarstår.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div style={{ background: theme.colors.dangerLight, border: `1px solid ${theme.colors.dangerBorder}`, borderRadius: theme.borderRadius.md, padding: "12px 16px", marginBottom: "24px", textAlign: "left" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: theme.colors.danger, margin: "0 0 4px" }}>Dev error</p>
              <p style={{ fontSize: "11px", color: theme.colors.danger, margin: 0, fontFamily: "monospace", wordBreak: "break-all" }}>
                {error.message}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{ padding: "10px 20px", background: theme.colors.accent, border: "none", borderRadius: theme.borderRadius.md, fontSize: "14px", fontWeight: 600, color: "#fff", cursor: "pointer" }}
            >
              Försök igen
            </button>
            <button
              onClick={() => window.location.href = "/dashboard"}
              style={{ padding: "10px 20px", background: "transparent", border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, fontSize: "14px", fontWeight: 600, color: theme.colors.textSecondary, cursor: "pointer" }}
            >
              Startsidan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}