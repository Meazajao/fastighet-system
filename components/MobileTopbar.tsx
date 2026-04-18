"use client";

import Link from "next/link";
import { theme } from "@/lib/theme";

interface MobileTopbarProps {
  title: string;
  backHref?: string;
  role?: "TENANT" | "ADMIN";
  name?: string;
}

export default function MobileTopbar({ title, backHref, role, name }: MobileTopbarProps) {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className="mobile-topbar"
      style={{
        display: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: theme.colors.sidebar,
        padding: "12px 16px",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {backHref ? (
          <Link
            href={backHref}
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#7ea8cc">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
        ) : (
          <div style={{ width: "28px", height: "28px", background: theme.colors.accent, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: "14px", height: "14px", background: "#fff", borderRadius: "3px" }} />
          </div>
        )}
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#f0f9ff", margin: 0, letterSpacing: "-0.2px" }}>
          {title}
        </p>
      </div>

      {initials && (
        <div style={{ width: "30px", height: "30px", background: `${theme.colors.accent}25`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "11px", color: theme.colors.accent, fontWeight: 600 }}>{initials}</span>
        </div>
      )}
    </div>
  );
}