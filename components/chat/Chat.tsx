"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

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
    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-96">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">Meddelanden</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm pt-8">
            Inga meddelanden ännu
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.user.id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-medium mb-1 text-gray-500">
                    {msg.user.name}
                    {msg.user.role === "ADMIN" && (
                      <span className="ml-1 text-violet-500">· Admin</span>
                    )}
                  </p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-violet-200" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("sv-SE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-5 py-4 border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Skriv ett meddelande..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            Skicka
          </button>
        </form>
      </div>
    </div>
  );
}