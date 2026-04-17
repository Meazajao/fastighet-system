import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";

export function useSocket(ticketId: string, onMessage: (msg: unknown) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("join-ticket", ticketId);
    socket.on("new-message", onMessage);

    return () => {
      socket.off("new-message", onMessage);
    };
  }, [ticketId, onMessage]);

  return socketRef.current;
}