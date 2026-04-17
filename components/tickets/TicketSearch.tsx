"use client";

import { useState } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  title: string;
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

  return (
    <div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök på titel, namn eller lägenhet..."
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 bg-white transition"
        >
          <option value="ALL">Alla statusar</option>
          <option value="OPEN">Öppen</option>
          <option value="IN_PROGRESS">Pågående</option>
          <option value="RESOLVED">Löst</option>
          <option value="CLOSED">Stängd</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 bg-white transition"
        >
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

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Ärenden</h2>
          <span className="text-sm text-gray-400">{filtered.length} st</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">Inga ärenden hittades</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      {ticket.category}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ticket.user.name} ·{" "}
                    {ticket.user.apartment || "Ingen lägenhet"} ·{" "}
                    {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-600",
    IN_PROGRESS: "bg-violet-50 text-violet-600",
    RESOLVED: "bg-green-50 text-green-600",
    CLOSED: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = {
    OPEN: "Öppen",
    IN_PROGRESS: "Pågående",
    RESOLVED: "Löst",
    CLOSED: "Stängd",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority !== "URGENT" && priority !== "HIGH") return null;
  const styles: Record<string, string> = {
    URGENT: "bg-red-50 text-red-500",
    HIGH: "bg-orange-50 text-orange-500",
  };
  const labels: Record<string, string> = {
    URGENT: "Akut",
    HIGH: "Hög",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}