"use client";

import { useState } from "react";
import Link from "next/link";
import { theme } from "@/lib/theme";

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    apartment: string | null;
  };
}

export default function TicketSearch({ tickets }: { tickets: Ticket[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.user.name.toLowerCase().includes(search.toLowerCase()) ||
      t.user.apartment?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchCategory = categoryFilter === "ALL" || t.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const statusConfig: Record<string, { color: string; bg: string; label: string; border: string }> = {
    OPEN: { color: theme.colors.accent, bg: theme.colors.accentLight, label: "Öppen", border: theme.colors.accent },
    IN_PROGRESS: { color: "#7c3aed", bg: "#f5f3ff", label: "Pågående", border: "#7c3aed" },
    RESOLVED: { color: theme.colors.success, bg: theme.colors.successLight, label: "Löst", border: theme.colors.success },
    CLOSED: { color: theme.colors.textMuted, bg: "#f1f5f9", label: "Stängd", border: "#cbd5e1" },
  };

  const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
    LOW: { color: theme.colors.textMuted, bg: "#f1f5f9", label: "Låg" },
    MEDIUM: { color: theme.colors.accent, bg: theme.colors.accentLight, label: "Normal" },
    HIGH: { color: theme.colors.warning, bg: theme.colors.warningLight, label: "Hög" },
    URGENT: { color: theme.colors.danger, bg: theme.colors.dangerLight, label: "Akut" },
  };

  const selectStyle = {
    padding: "10px 14px",
    background: theme.colors.card,
    border: "1px solid #e2e8f0",
    borderRadius: theme.borderRadius.md,
    fontSize: "13px",
    color: theme.colors.textPrimary,
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div>
      {/* Sök och filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök på titel, namn eller lägenhet..."
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "10px 14px",
            background: theme.colors.card,
            border: "1px solid #e2e8f0",
            borderRadius: theme.borderRadius.md,
            fontSize: "13px",
            color: theme.colors.textPrimary,
            outline: "none",
          }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="ALL">Alla statusar</option>
          <option value="OPEN">Öppen</option>
          <option value="IN_PROGRESS">Pågående</option>
          <option value="RESOLVED">Löst</option>
          <option value="CLOSED">Stängd</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={selectStyle}>
          <option value="ALL">Alla kategorier</option>
          <option value="VVS">VVS</option>
          <option value="EL">El</option>
          <option value="VENTILATION">Ventilation</option>
          <option value="HISS">Hiss</option>
          <option value="LAUNDRY">Tvättstuga</option>
          <option value="EXTERIOR">Yttre miljö</option>
          <option value="OTHER">Övrigt</option>
        </select>
      </div>

      {/* Räknare */}
      <p style={{ fontSize: "12px", color: theme.colors.textMuted, margin: "0 0 12px" }}>
        {filtered.length} ärenden
      </p>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, padding: "64px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: theme.colors.textMuted, margin: 0 }}>Inga ärenden hittades</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((ticket) => {
            const status = statusConfig[ticket.status] || statusConfig.OPEN;
            const priority = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
            return (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                style={{
                  background: theme.colors.card,
                  border: "1px solid #e2e8f0",
                  borderLeft: `4px solid ${status.border}`,
                  borderRadius: theme.borderRadius.lg,
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  gap: "16px",
                }}
              >
                {/* Vänster — info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Badges rad */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#475569",
                      background: "#f1f5f9",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}>
                      {ticket.category}
                    </span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: priority.color,
                      background: priority.bg,
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}>
                      {priority.label}
                    </span>
                    <span style={{ fontSize: "11px", color: theme.colors.textMuted }}>
                      {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                    </span>
                  </div>

                  {/* Titel */}
                  <p style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: theme.colors.textPrimary,
                    margin: "0 0 6px",
                    letterSpacing: "-0.2px",
                  }}>
                    {ticket.title}
                  </p>

                  {/* Beskrivning */}
                  <p style={{
                    fontSize: "12px",
                    color: theme.colors.textSecondary,
                    margin: "0 0 8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "500px",
                  }}>
                    {ticket.description}
                  </p>

                  {/* Hyresgäst */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      background: theme.colors.accentLight,
                      border: `1px solid ${theme.colors.accentBorder}`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: "9px", fontWeight: 600, color: theme.colors.accent }}>
                        {ticket.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                      {ticket.user.name}
                      {ticket.user.apartment ? ` · ${ticket.user.apartment}` : ""}
                    </span>
                  </div>
                </div>

                {/* Höger — status */}
                <span style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: status.color,
                  background: status.bg,
                  padding: "5px 14px",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {status.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}