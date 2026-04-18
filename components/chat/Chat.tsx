"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
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

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const existing = groups.find((g) => g.date === date);
    if (existing) {
      existing.messages.push(msg);
    } else {
      groups.push({ date, messages: [msg] });
    }
  });

  return groups;
}

export default function Chat({ ticketId, currentUserId, initialMessages }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.emit("join-ticket", ticketId);

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
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
    if (!text.trim() || sending) return;

    setSending(true);

    const res = await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (res.ok) {
      const message = await res.json();
      socket.emit("send-message", { ticketId, message });
      setText("");
      inputRef.current?.focus();
    } else {
      toast.error("Kunde inte skicka meddelandet");
    }

    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
    }
  }

  const groups = groupMessagesByDate(messages);

  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        display: "flex",
        flexDirection: "column",
        height: "480px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${theme.colors.border}`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
          Meddelanden
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: connected ? theme.colors.success : theme.colors.textMuted,
          }} />
          <span style={{ fontSize: "11px", color: theme.colors.textMuted }}>
            {connected ? "Ansluten" : "Ansluter..."}
          </span>
        </div>
      </div>

      {/* Meddelandelista */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={theme.colors.textMuted}>
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: 0 }}>
              Inga meddelanden ännu
            </p>
            <p style={{ fontSize: "11px", color: theme.colors.textDisabled, margin: 0 }}>
              Skriv ett meddelande för att starta konversationen
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.date}>
              {/* Datumseparator */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "12px 0",
              }}>
                <div style={{ flex: 1, height: "1px", background: theme.colors.border }} />
                <span style={{ fontSize: "11px", color: theme.colors.textMuted, whiteSpace: "nowrap" }}>
                  {group.date}
                </span>
                <div style={{ flex: 1, height: "1px", background: theme.colors.border }} />
              </div>

              {/* Meddelanden */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {group.messages.map((msg) => {
                  const isMe = msg.user.id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <div style={{ maxWidth: "70%" }}>
                        {!isMe && (
                          <p style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: msg.user.role === "ADMIN" ? theme.colors.accent : theme.colors.textMuted,
                            margin: "0 0 3px 4px",
                          }}>
                            {msg.user.name}
                            {msg.user.role === "ADMIN" && (
                              <span style={{
                                marginLeft: "4px",
                                fontSize: "10px",
                                background: theme.colors.accentLight,
                                color: theme.colors.accent,
                                padding: "1px 5px",
                                borderRadius: "3px",
                                fontWeight: 500,
                              }}>
                                Admin
                              </span>
                            )}
                          </p>
                        )}
                        <div
                          style={{
                            background: isMe ? theme.colors.accent : "#f1f5f9",
                            borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                            padding: "9px 13px",
                          }}
                        >
                          <p style={{
                            fontSize: "13px",
                            color: isMe ? "#fff" : theme.colors.textPrimary,
                            margin: 0,
                            lineHeight: 1.5,
                            wordBreak: "break-word",
                          }}>
                            {msg.text}
                          </p>
                          <p style={{
                            fontSize: "10px",
                            color: isMe ? "rgba(255,255,255,0.65)" : theme.colors.textMuted,
                            margin: "4px 0 0",
                            textAlign: isMe ? "right" : "left",
                          }}>
                            {new Date(msg.createdAt).toLocaleTimeString("sv-SE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.colors.border}`, flexShrink: 0 }}>
        <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv ett meddelande... (Enter för att skicka)"
            maxLength={2000}
            style={{
              flex: 1,
              padding: "10px 14px",
              background: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
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
              background: sending || !text.trim() ? theme.colors.accentBorder : theme.colors.accent,
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
        {text.length > 1800 && (
          <p style={{ fontSize: "11px", color: text.length > 2000 ? theme.colors.danger : theme.colors.textMuted, margin: "4px 0 0 4px" }}>
            {text.length}/2000 tecken
          </p>
        )}
      </div>
    </div>
  );
}