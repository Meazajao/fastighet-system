"use client";

import { useEffect, useState } from "react";
import { theme } from "@/lib/theme";

export default function TicketImage({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/storage/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
        } else {
          setError("Kunde inte ladda bilden");
        }
      })
      .catch(() => setError("Nätverksfel"))
      .finally(() => setLoading(false));
  }, [path]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-shimmer 1.5s infinite",
          borderRadius: theme.borderRadius.md,
        }}
      />
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          padding: "16px",
          background: theme.colors.dangerLight,
          border: `1px solid ${theme.colors.dangerBorder}`,
          borderRadius: theme.borderRadius.md,
          fontSize: "13px",
          color: theme.colors.danger,
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <img
      src={url!}
      alt="Bifogad bild"
      loading="lazy"
      style={{
        width: "100%",
        maxHeight: "320px",
        objectFit: "cover",
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border}`,
        display: "block",
      }}
    />
  );
}