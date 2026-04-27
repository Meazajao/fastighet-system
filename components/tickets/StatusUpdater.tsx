"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { statusLabel } from "@/lib/styles";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const STATUSES = [
  { value: "OPEN", color: "#6e6e73", bg: "#f5f5f7" },
  { value: "IN_PROGRESS", color: "#5e35b1", bg: "#f3f0ff" },
  { value: "RESOLVED", color: "#34c759", bg: "#f0faf5" },
  { value: "CLOSED", color: "#aeaeb2", bg: "#f5f5f7" },
];

interface StatusUpdaterProps {
  ticketId: string;
  currentStatus: string;
  ticketTitle: string;
  ticketUserId: string;
}

export default function StatusUpdater({
  ticketId,
  currentStatus,
  ticketTitle,
  ticketUserId,
}: StatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  function handleClick(newStatus: string) {
    if (newStatus === "CLOSED" || newStatus === "RESOLVED") {
      setPendingStatus(newStatus);
    } else {
      updateStatus(newStatus);
    }
  }

  async function updateStatus(newStatus: string) {
    setLoading(true);
    setPendingStatus(null);

    const res = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      toast.success("Status uppdaterad");
      try {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
        socket.emit("status-changed", {
          ticketId,
          title: ticketTitle,
          status: newStatus,
          userId: ticketUserId,
        });
        socket.disconnect();
      } catch (err) {
        console.error("Socket error:", err);
      }
      router.refresh();
    } else {
      toast.error("Kunde inte uppdatera status");
    }
    setLoading(false);
  }

  const dialogConfig = {
    RESOLVED: {
      title: "Markera som löst",
      description: `Är du säker på att du vill markera "${ticketTitle}" som löst? Hyresgästen kommer att notifieras.`,
      confirmLabel: "Ja, markera som löst",
      variant: "default" as const,
    },
    CLOSED: {
      title: "Stäng ärende",
      description: `Är du säker på att du vill stänga "${ticketTitle}"? Ärendet kommer att arkiveras.`,
      confirmLabel: "Ja, stäng ärendet",
      variant: "danger" as const,
    },
  };

  return (
    <>
      <div className="border-t border-border pt-4 mt-1">
        <p className="text-[11px] font-semibold text-text-muted mb-3 uppercase tracking-[0.05em]">
          Uppdatera status
        </p>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => {
            const isActive = status === s.value;
            return (
              <button
                key={s.value}
                onClick={() => handleClick(s.value)}
                disabled={loading || isActive}
                className="px-4 py-2 text-[12px] font-semibold rounded-xl border-none font-[inherit] transition-all"
                style={{
                  background: isActive ? s.color : s.bg,
                  color: isActive ? "#fff" : s.color,
                  opacity: loading && !isActive ? 0.5 : 1,
                  cursor: isActive || loading ? "not-allowed" : "pointer",
                  boxShadow: isActive ? `0 4px 12px ${s.color}40` : "none",
                }}
              >
                {statusLabel(s.value)}
              </button>
            );
          })}
        </div>
      </div>

      {pendingStatus && dialogConfig[pendingStatus as keyof typeof dialogConfig] && (
        <ConfirmDialog
          isOpen={true}
          title={dialogConfig[pendingStatus as keyof typeof dialogConfig].title}
          description={dialogConfig[pendingStatus as keyof typeof dialogConfig].description}
          confirmLabel={dialogConfig[pendingStatus as keyof typeof dialogConfig].confirmLabel}
          cancelLabel="Avbryt"
          variant={dialogConfig[pendingStatus as keyof typeof dialogConfig].variant}
          onConfirm={() => updateStatus(pendingStatus)}
          onCancel={() => setPendingStatus(null)}
        />
      )}
    </>
  );
}