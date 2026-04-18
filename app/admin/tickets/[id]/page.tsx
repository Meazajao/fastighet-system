import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Chat from "@/components/chat/Chat";
import StatusUpdater from "@/components/tickets/StatusUpdater";
import TicketImage from "@/components/tickets/TicketImage";

export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

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
          {ticket.imageUrl && (
            <div className="mt-4 mb-6">
              <TicketImage path={ticket.imageUrl} />
            </div>
          )}
          <StatusUpdater ticketId={ticket.id} currentStatus={ticket.status} />
        </div>

        <Chat
          ticketId={ticket.id}
          currentUserId={dbUser.id}
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