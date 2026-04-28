"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Send } from "lucide-react";

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
    if (existing) existing.messages.push(msg);
    else groups.push({ date, messages: [msg] });
  });
  return groups;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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
        if (prev.find((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });
    return () => { socket.disconnect(); };
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
      className="bg-card rounded-2xl border border-border flex flex-col overflow-hidden"
      style={{ height: "480px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-text-primary">Meddelanden</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: connected ? "#34c759" : "#aeaeb2" }}
          />
          <span className="text-[11px] text-text-muted font-medium">
            {connected ? "Ansluten" : "Ansluter..."}
          </span>
        </div>
      </div>

      {/* Meddelanden */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-1" style={{ background: "#f8f8fc" }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#f3f0ff" }}>
              <Send size={20} color="#5e35b1" />
            </div>
            <p className="text-[13px] font-semibold text-text-primary m-0">Inga meddelanden ännu</p>
            <p className="text-[12px] text-text-muted m-0">Skriv ett meddelande nedan</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.date}>
              {/* Datumseparator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-text-muted font-medium bg-background px-3 py-1 rounded-full">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex flex-col gap-3">
                {group.messages.map((msg) => {
                  const isMe = msg.user.id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex gap-2 items-end ${isMe ? "justify-end" : "justify-start"}`}>
                      {!isMe && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}
                        >
                          <span className="text-[10px] font-bold text-white">
                            {getInitials(msg.user.name)}
                          </span>
                        </div>
                      )}
                      <div className="max-w-[68%]">
                        {!isMe && (
                          <div className="flex items-center gap-2 mb-1 pl-0.5">
                            <span className="text-[11px] font-semibold text-text-muted">
                              {msg.user.name}
                            </span>
                            {msg.user.role === "ADMIN" && (
                              <span
                                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: "#f3f0ff", color: "#5e35b1" }}
                              >
                                Admin
                              </span>
                            )}
                          </div>
                        )}
                        <div
                          className="px-4 py-2.5 rounded-2xl"
                          style={{
                            background: isMe ? "linear-gradient(135deg, #5e35b1, #7c4dff)" : "#fff",
                            border: isMe ? "none" : "1px solid #ebebf0",
                            borderBottomRightRadius: isMe ? "6px" : "16px",
                            borderBottomLeftRadius: isMe ? "16px" : "6px",
                            boxShadow: isMe ? "0 4px 12px rgba(94,53,177,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                          }}
                        >
                          <p className={`text-[13px] m-0 leading-normal wrap-break-word ${isMe ? "text-white" : "text-text-primary"}`}>
                            {msg.text}
                          </p>
                          <p className={`text-[10px] m-0 mt-1 ${isMe ? "text-white/60 text-right" : "text-text-disabled"}`}>
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
      <div className="px-4 py-3 border-t border-border bg-card shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv ett meddelande..."
            maxLength={2000}
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] text-text-primary outline-none font-[inherit] focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center border-none transition-all shrink-0"
            style={{
              background: sending || !text.trim()
                ? "#f5f5f7"
                : "linear-gradient(135deg, #5e35b1, #7c4dff)",
              cursor: sending || !text.trim() ? "not-allowed" : "pointer",
              boxShadow: sending || !text.trim() ? "none" : "0 4px 12px rgba(94,53,177,0.3)",
            }}
          >
            <Send size={15} color={sending || !text.trim() ? "#aeaeb2" : "#fff"} />
          </button>
        </form>
        {text.length > 1800 && (
          <p className={`text-[10px] mt-1 ${text.length > 2000 ? "text-danger" : "text-text-muted"}`}>
            {text.length}/2000
          </p>
        )}
      </div>
    </div>
  );
}