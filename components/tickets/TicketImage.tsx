"use client";

import { useEffect, useState } from "react";

export default function TicketImage({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("TicketImage - hämtar signerad URL för:", path);
    
    fetch("/api/storage/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("TicketImage - svar:", data);
        if (data.url) {
          setUrl(data.url);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("TicketImage - fel:", err);
        setError(err.message);
      });
  }, [path]);

  if (error) return (
    <div className="w-full p-4 bg-red-50 text-red-500 text-sm rounded-xl mt-4">
      Kunde inte ladda bilden: {error}
    </div>
  );

  if (!url) return (
    <div className="w-full h-48 bg-gray-100 rounded-xl animate-pulse mt-4" />
  );

  return (
    <img
      src={url}
      alt="Bifogad bild"
      className="w-full max-h-64 object-cover rounded-xl border border-gray-100 mt-4"
    />
  );
}