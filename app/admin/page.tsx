import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import AdminNotifications from "@/components/AdminNotifications";
import TicketSearch from "@/components/tickets/TicketSearch";
import Footer from "@/components/ui/Footer";
import { AlertCircle, Clock, CheckCircle, Ticket } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Översikt" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
  const urgent = tickets.filter((t) => t.priority === "URGENT").length;

  const stats = [
    { label: "Totalt", value: tickets.length, icon: <Ticket size={13} color="#5e35b1" />, iconBg: "#f3f0ff", color: "#1a1a2e", highlight: false },
    { label: "Öppna", value: open, icon: <AlertCircle size={13} color="#5e35b1" />, iconBg: "#f3f0ff", color: "#1a1a2e", highlight: false },
    { label: "Pågående", value: inProgress, icon: <Clock size={13} color="#fff" />, iconBg: "rgba(255,255,255,0.15)", color: "#fff", highlight: true },
    { label: "Akuta", value: urgent, icon: <AlertCircle size={13} color="#ff3b30" />, iconBg: "#fff5f5", color: "#ff3b30", highlight: false },
  ];

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role="ADMIN" name={dbUser.name} apartment={null} />
      <MobileTopbar title="Översikt" name={dbUser.name} />
      <MobileNav role="ADMIN" />
      <AdminNotifications />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 shrink-0">
          <div className="text-[11px] md:text-[12px] text-text-muted font-medium mb-0.5">Administration</div>
          <h1 className="text-[18px] md:text-[22px] font-bold text-text-primary tracking-[-0.5px] m-0">Översikt</h1>
        </div>

        <div className="p-4 md:p-8 flex-1">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3 md:p-5"
                style={{
                  background: stat.highlight ? "linear-gradient(135deg, #5e35b1, #7c4dff)" : "#fff",
                  border: stat.highlight ? "none" : "1px solid #ebebf0",
                  boxShadow: stat.highlight ? "0 6px 20px rgba(94,53,177,0.35)" : "0 1px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <span className="text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.05em]"
                    style={{ color: stat.highlight ? "rgba(255,255,255,0.7)" : "#86868b" }}>
                    {stat.label}
                  </span>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center"
                    style={{ background: stat.iconBg }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-[24px] md:text-[34px] font-bold tracking-[-1px] md:tracking-[-2px] leading-none"
                  style={{ color: stat.highlight ? "#fff" : stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <TicketSearch tickets={tickets} />
        </div>

        <Footer />
      </main>
    </div>
  );
}