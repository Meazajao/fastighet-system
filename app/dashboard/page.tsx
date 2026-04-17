import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  const tickets = await prisma.ticket.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" />
          <span className="font-semibold text-gray-900">Fastighet</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session?.user?.name}</span>
          <Link
            href="/api/auth/signout"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Logga ut
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Hej, {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {session?.user?.apartment || "Ingen lägenhet angiven"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Öppna</p>
            <p className="text-3xl font-semibold text-gray-900">{open}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Pågående</p>
            <p className="text-3xl font-semibold text-violet-600">{inProgress}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Lösta</p>
            <p className="text-3xl font-semibold text-green-600">{resolved}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Mina ärenden</h2>
          <Link
            href="/tickets/new"
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            + Nytt ärende
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm">Inga ärenden ännu</p>
            <Link
              href="/tickets/new"
              className="text-violet-600 text-sm font-medium hover:underline mt-2 inline-block"
            >
              Skapa ditt första ärende
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:border-violet-200 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      {ticket.category}
                    </span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{ticket.title}</p>
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