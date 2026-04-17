import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Chat from "@/components/chat/Chat";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

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

  if (!ticket) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" />
          <span className="font-semibold text-gray-900">Fastighet</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Tillbaka
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-400 uppercase">
                  {ticket.category}
                </span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {ticket.title}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Skapat {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
              </p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {ticket.description}
          </p>
        </div>

        <Chat
          ticketId={ticket.id}
          currentUserId={session.user.id}
          initialMessages={ticket.messages as any}
        />
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