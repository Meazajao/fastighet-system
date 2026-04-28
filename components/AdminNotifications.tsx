"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminNotifications() {
  const router = useRouter();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");

    socket.emit("join-admin");

    socket.on("new-ticket", (ticket: { id: string; title: string; category: string; userName: string }) => {
      toast(`Nytt ärende inkommet`, {
        description: `${ticket.userName} — ${ticket.title}`,
        action: {
          label: "Visa",
          onClick: () => router.push(`/admin/tickets/${ticket.id}`),
        },
        duration: 8000,
      });
      router.refresh();
    });

    return () => { socket.disconnect(); };
  }, [router]);

  return null;
}