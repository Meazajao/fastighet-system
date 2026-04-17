import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import TicketSearch from "@/components/tickets/TicketSearch";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

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
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" />
          <span className="font-semibold text-gray-900">Fastighet</span>
          <span className="text-xs bg-violet-100 text-violet-600 font-medium px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Användare
          </Link>
          <Link
            href="/api/auth/signout"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Logga ut
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Översikt</h1>
          <p className="text-gray-500 text-sm mt-1">
            Alla inkomna ärenden från hyresgäster
          </p>
        </div>

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

        <TicketSearch tickets={tickets} />
      </div>
    </div>
  );
}