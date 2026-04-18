import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tickets: true } },
    },
  });

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

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Användare</h1>
          <p className="text-gray-500 text-sm mt-1">
            Alla registrerade hyresgäster
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Alla användare</h2>
            <span className="text-sm text-gray-400">{users.length} st</span>
          </div>

          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-violet-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    {user.apartment && (
                      <p className="text-xs text-gray-400">{user.apartment}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">
                    {user._count.tickets} ärenden
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-violet-100 text-violet-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user.role === "ADMIN" ? "Admin" : "Hyresgäst"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}