"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { theme } from "@/lib/theme";

interface Message {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

interface ChatProps {
  ticketId: string;
  currentUserId: string;
  initialMessages: Message[];
}

let socket: Socket;

export default function Chat({ ticketId, currentUserId, initialMessages }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
    socket.emit("join-ticket", ticketId);

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);

    const res = await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const message = await res.json();

    if (res.ok) {
      socket.emit("send-message", { ticketId, message });
      setText("");
    }

    setSending(false);
  }

  return (
    <div
      style={{
        background: theme.colors.card,
        border: "1px solid #e2e8f0",
        borderRadius: theme.borderRadius.lg,
        display: "flex",
        flexDirection: "column",
        height: "420px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f1f5f9",
          flexShrink: 0,
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
          Meddelanden
        </h3>
      </div>

      {/* Meddelandelista */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: theme.colors.textMuted, fontSize: "13px", marginTop: "32px" }}>
            Inga meddelanden ännu
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.user.id === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  background: isMe ? theme.colors.accent : "#f1f5f9",
                  borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  padding: "10px 14px",
                }}
              >
                {!isMe && (
                  <p style={{ fontSize: "11px", fontWeight: 600, color: theme.colors.accent, margin: "0 0 4px" }}>
                    {msg.user.name}
                    {msg.user.role === "ADMIN" && (
                      <span style={{ color: theme.colors.accent, marginLeft: "4px" }}>· Admin</span>
                    )}
                  </p>
                )}
                <p style={{ fontSize: "13px", color: isMe ? "#fff" : theme.colors.textPrimary, margin: 0, lineHeight: 1.5 }}>
                  {msg.text}
                </p>
                <p style={{ fontSize: "10px", color: isMe ? "rgba(255,255,255,0.6)" : theme.colors.textMuted, margin: "4px 0 0", textAlign: isMe ? "right" : "left" }}>
                  {new Date(msg.createdAt).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f1f5f9",
          flexShrink: 0,
        }}
      >
        <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Skriv ett meddelande..."
            style={{
              flex: 1,
              padding: "10px 14px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              fontSize: "13px",
              outline: "none",
              color: theme.colors.textPrimary,
            }}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            style={{
              width: "38px",
              height: "38px",
              background: sending || !text.trim() ? "#bae6fd" : theme.colors.accent,
              border: "none",
              borderRadius: "50%",
              cursor: sending || !text.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}