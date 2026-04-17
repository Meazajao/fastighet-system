import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
  const urgent = tickets.filter((t) => t.priority === "URGENT").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" />
          <span className="font-semibold text-gray-900">Fastighet</span>
          <span className="text-xs bg-violet-100 text-violet-600 font-medium px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <Link
          href="/api/auth/signout"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          Logga ut
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Översikt</h1>
          <p className="text-gray-500 text-sm mt-1">
            Alla inkomna ärenden från hyresgäster
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Totalt</p>
            <p className="text-3xl font-semibold text-gray-900">{tickets.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Öppna</p>
            <p className="text-3xl font-semibold text-blue-600">{open}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Pågående</p>
            <p className="text-3xl font-semibold text-violet-600">{inProgress}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Akuta</p>
            <p className="text-3xl font-semibold text-red-500">{urgent}</p>
          </div>
        </div>

        {/* Ärendelista */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Alla ärenden</h2>
            <span className="text-sm text-gray-400">{tickets.length} st</span>
          </div>

          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">Inga ärenden ännu</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/admin/tickets/${ticket.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-gray-400 uppercase">
                          {ticket.category}
                        </span>
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <p className="font-medium text-gray-900">{ticket.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ticket.user.name} · {ticket.user.apartment || "Ingen lägenhet"} ·{" "}
                        {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={ticket.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
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