import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Chat from "@/components/chat/Chat";

export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      user: true,
      messages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" />
          <span className="font-semibold text-gray-900">Fastighet</span>
          <span className="text-xs bg-violet-100 text-violet-600 font-medium px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Tillbaka
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {/* Ticket-info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-400 uppercase">
                  {ticket.category}
                </span>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {ticket.title}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {ticket.user.name} · {ticket.user.apartment || "Ingen lägenhet"} ·{" "}
                {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
              </p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {ticket.description}
          </p>

          {/* Statusuppdatering */}
          <StatusUpdater ticketId={ticket.id} currentStatus={ticket.status} />
        </div>

        {/* Chatt */}
        <Chat
          ticketId={ticket.id}
          currentUserId={session.user.id}
          initialMessages={ticket.messages as any}
        />
      </div>
    </div>
  );
}

function StatusUpdater({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: string;
}) {
  const statuses = [
    { value: "OPEN", label: "Öppen" },
    { value: "IN_PROGRESS", label: "Pågående" },
    { value: "RESOLVED", label: "Löst" },
    { value: "CLOSED", label: "Stängd" },
  ];

  return (
    <div className="border-t border-gray-100 pt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">Uppdatera status</p>
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <form key={s.value} action={`/api/tickets/${ticketId}`} method="PATCH">
            <button
              formAction={`/api/tickets/${ticketId}`}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
                currentStatus === s.value
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
              }`}
            >
              {s.label}
            </button>
          </form>
        ))}
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