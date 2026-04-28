"use client";

import { useEffect, useState } from "react";

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
        if (data.url) setUrl(data.url);
        else setError("Kunde inte ladda bilden");
      })
      .catch(() => setError("Nätverksfel"))
      .finally(() => setLoading(false));
  }, [path]);

  if (loading) {
    return (
      <div
        className="w-full h-50 bg-background"
        style={{
          background: "linear-gradient(90deg, #f4f5f7 25%, #dce0e8 50%, #f4f5f7 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-shimmer 1.5s infinite",
        }}
      />
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-3 bg-danger-light border border-danger-border text-[12px] text-danger text-center">
        {error}
      </div>
    );
  }

  return (
    <img
      src={url!}
      alt="Bifogad bild"
      loading="lazy"
      className="w-full max-h-80 object-cover block border border-border"
    />
  );
}