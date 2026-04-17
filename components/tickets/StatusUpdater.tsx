"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "OPEN", label: "Öppen" },
  { value: "IN_PROGRESS", label: "Pågående" },
  { value: "RESOLVED", label: "Löst" },
  { value: "CLOSED", label: "Stängd" },
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
    <div className="border-t border-gray-100 pt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">Uppdatera status</p>
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => updateStatus(s.value)}
            disabled={loading || status === s.value}
            className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
              status === s.value
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 disabled:opacity-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}