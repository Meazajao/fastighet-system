"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/theme";

const STATUSES = [
  { value: "OPEN", label: "Öppen", color: theme.colors.accent },
  { value: "IN_PROGRESS", label: "Pågående", color: "#7c3aed" },
  { value: "RESOLVED", label: "Löst", color: theme.colors.success },
  { value: "CLOSED", label: "Stängd", color: theme.colors.textMuted },
];

export default function StatusUpdater({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    const res = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
      <p style={{ fontSize: "12px", fontWeight: 600, color: theme.colors.textSecondary, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Uppdatera status
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {STATUSES.map((s) => {
          const isActive = status === s.value;
          return (
            <button
              key={s.value}
              onClick={() => updateStatus(s.value)}
              disabled={loading || isActive}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                border: `1.5px solid ${isActive ? s.color : "#e2e8f0"}`,
                background: isActive ? s.color : "#fff",
                color: isActive ? "#fff" : theme.colors.textSecondary,
                cursor: isActive || loading ? "not-allowed" : "pointer",
                opacity: loading && !isActive ? 0.5 : 1,
                transition: "all 0.15s",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}