"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TenantNotificationsProps {
  userId: string;
}

export default function TenantNotifications({ userId }: TenantNotificationsProps) {
  const router = useRouter();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");

    socket.emit("join-user", userId);

    socket.on("status-updated", (data: { ticketId: string; title: string; status: string }) => {
      const statusLabels: Record<string, string> = {
        IN_PROGRESS: "Pågående",
        RESOLVED: "Löst",
        CLOSED: "Stängd",
      };
      toast(`Status uppdaterad`, {
        description: `${data.title} — ${statusLabels[data.status] || data.status}`,
        action: {
          label: "Visa",
          onClick: () => router.push(`/tickets/${data.ticketId}`),
        },
        duration: 6000,
      });
      router.refresh();
    });

    socket.on("new-admin-message", (data: { ticketId: string; title: string }) => {
      toast(`Nytt svar på ditt ärende`, {
        description: data.title,
        action: {
          label: "Visa",
          onClick: () => router.push(`/tickets/${data.ticketId}`),
        },
        duration: 6000,
      });
    });

    return () => { socket.disconnect(); };
  }, [userId, router]);

  return null;
}