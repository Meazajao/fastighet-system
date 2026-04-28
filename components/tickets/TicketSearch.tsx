"use client";

import { useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { statusBadgeStyle, statusLabel, priorityBadgeStyle, priorityLabel, categoryLabel } from "@/lib/styles";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: Date;
  user: { name: string; apartment: string | null; };
}

type SortKey = "date_desc" | "date_asc" | "priority" | "status";

const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
const statusOrder: Record<string, number> = { OPEN: 0, IN_PROGRESS: 1, RESOLVED: 2, CLOSED: 3 };

export default function TicketSearch({ tickets }: { tickets: Ticket[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = tickets
    .filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.user.name.toLowerCase().includes(search.toLowerCase()) ||
        t.user.apartment?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchCategory = categoryFilter === "ALL" || t.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    })
    .sort((a, b) => {
      switch (sort) {
        case "date_asc": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date_desc": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "priority": return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
        case "status": return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
        default: return 0;
      }
    });

  const isFiltered = search || statusFilter !== "ALL" || categoryFilter !== "ALL";
  const selectClass = "px-3 py-2 bg-white border border-gray-200 rounded-xl text-[12px] text-text-primary outline-none cursor-pointer font-[inherit]";

  return (
    <div>
      {/* Sök + filter toggle */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={14} color="#aeaeb2" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök ärenden..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-text-primary outline-none font-[inherit]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[12px] font-semibold cursor-pointer font-[inherit]"
          style={{ color: showFilters ? "#5e35b1" : "#6e6e73", borderColor: showFilters ? "#5e35b1" : "#e5e7eb" }}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filter</span>
        </button>
        {isFiltered && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("ALL"); setCategoryFilter("ALL"); }}
            className="flex items-center gap-1 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[12px] text-text-muted cursor-pointer font-[inherit]"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter-panel */}
      {showFilters && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="ALL">Alla statusar</option>
            <option value="OPEN">Öppen</option>
            <option value="IN_PROGRESS">Pågående</option>
            <option value="RESOLVED">Löst</option>
            <option value="CLOSED">Stängd</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectClass}>
            <option value="ALL">Alla kategorier</option>
            <option value="VVS">VVS</option>
            <option value="EL">El</option>
            <option value="VENTILATION">Ventilation</option>
            <option value="HISS">Hiss</option>
            <option value="LAUNDRY">Tvättstuga</option>
            <option value="EXTERIOR">Yttre miljö</option>
            <option value="OTHER">Övrigt</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
            <option value="date_desc">Nyast först</option>
            <option value="date_asc">Äldst först</option>
            <option value="priority">Prioritet</option>
            <option value="status">Status</option>
          </select>
        </div>
      )}

      {/* Räknare */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-text-muted font-medium">
          {filtered.length} {filtered.length === 1 ? "ärende" : "ärenden"}
        </span>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border">
          {isFiltered ? (
            <EmptyState icon="search" title="Inga ärenden matchar" description="Försök med andra sökord eller filter." />
          ) : (
            <EmptyState icon="inbox" title="Inga ärenden inkomna" description="Ärenden visas här när hyresgäster skapar dem." />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 md:gap-3">
          {filtered.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/admin/tickets/${ticket.id}`}
              className="flex items-center bg-card rounded-2xl border border-border no-underline hover:border-primary transition-all duration-150 overflow-hidden"
              style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
            >
              <div
                className="w-1.5 self-stretch shrink-0"
                style={{
                  background: ticket.priority === "URGENT" ? "#ff3b30"
                    : ticket.priority === "HIGH" ? "#f5a623"
                    : ticket.priority === "MEDIUM" ? "#5e35b1"
                    : "#ebebf0",
                }}
              />
              <div className="flex-1 px-3 md:px-5 py-3 md:py-4 min-w-0">
                <div className="flex items-start justify-between gap-2 md:gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold text-text-muted bg-background px-2 py-0.5 rounded-lg">
                        {categoryLabel(ticket.category)}
                      </span>
                      <span style={{ ...priorityBadgeStyle(ticket.priority), fontSize: "10px", padding: "2px 8px" }}>
                        {priorityLabel(ticket.priority)}
                      </span>
                      <span className="text-[10px] text-text-disabled ml-auto">
                        {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                      </span>
                    </div>
                    <p className="text-[13px] md:text-[15px] font-semibold text-text-primary m-0 mb-1 capitalize truncate">
                      {ticket.title}
                    </p>
                    <p className="hidden md:block text-[12px] text-text-muted m-0 mb-2 truncate">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}
                      >
                        <span className="text-[8px] md:text-[9px] font-bold text-white">
                          {ticket.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] md:text-[12px] text-text-muted truncate">
                        {ticket.user.name}{ticket.user.apartment ? ` · Lgh ${ticket.user.apartment}` : ""}
                      </span>
                    </div>
                  </div>
                  <span style={{ ...statusBadgeStyle(ticket.status), flexShrink: 0, fontSize: "10px", padding: "3px 8px" }}>
                    {statusLabel(ticket.status)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}