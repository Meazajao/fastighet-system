import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import EmptyState from "@/components/ui/EmptyState";
import Footer from "@/components/ui/Footer";
import TenantNotifications from "@/components/TenantNotifications";
import { statusBadgeStyle, statusLabel, priorityLabel, categoryLabel } from "@/lib/styles";
import { Wrench, Zap, Wind, ArrowUpDown, WashingMachine, Trees, Settings, Plus, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Översikt" };

const categoryConfig: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  VVS: { icon: <Wrench size={20} />, bg: "#f3f0ff", color: "#5e35b1" },
  EL: { icon: <Zap size={20} />, bg: "#fff9e6", color: "#f5a623" },
  VENTILATION: { icon: <Wind size={20} />, bg: "#f0f8ff", color: "#0284c7" },
  HISS: { icon: <ArrowUpDown size={20} />, bg: "#fdf0ff", color: "#9747ff" },
  LAUNDRY: { icon: <WashingMachine size={20} />, bg: "#f0f8ff", color: "#0284c7" },
  EXTERIOR: { icon: <Trees size={20} />, bg: "#f0faf5", color: "#34c759" },
  OTHER: { icon: <Settings size={20} />, bg: "#f5f5f7", color: "#6e6e73" },
};

const progressSteps = ["Inkommen", "Handläggs", "Åtgärd", "Löst"];
const progressIndex: Record<string, number> = {
  OPEN: 0,
  IN_PROGRESS: 1,
  RESOLVED: 3,
  CLOSED: 3,
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");
  if (dbUser.role === "ADMIN") redirect("/admin");

  const tickets = await prisma.ticket.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
  const activeTickets = tickets.filter((t) => t.status !== "CLOSED" && t.status !== "RESOLVED");
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED").slice(0, 2);

  const today = new Date().toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role="TENANT" name={dbUser.name} apartment={dbUser.apartment} cityImage />
      <MobileTopbar title="Översikt" name={dbUser.name} />
      <MobileNav role="TENANT" />
      <TenantNotifications userId={dbUser.id} />

      <main className="main-content flex-1 bg-background flex flex-col">

        {/* Top bar */}
        <div className="bg-card border-b border-border px-6 md:px-8 py-4 md:py-5 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] md:text-[12px] text-text-muted font-medium mb-0.5 md:mb-1 capitalize">{today}</div>
            <h1 className="text-[18px] md:text-[22px] font-bold text-text-primary tracking-[-0.5px] m-0">
              Hej, {dbUser.name.split(" ")[0]} 👋
            </h1>
          </div>
          <Link
            href="/tickets/new"
            className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl no-underline font-semibold text-[12px] md:text-[13px] text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #5e35b1, #7c4dff)",
              boxShadow: "0 4px 12px rgba(94,53,177,0.3)",
            }}
          >
            <Plus size={14} color="#fff" />
            <span className="hidden sm:inline">Nytt ärende</span>
            <span className="sm:hidden">Nytt</span>
          </Link>
        </div>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">

            <div className="bg-card rounded-2xl p-3 md:p-5 border border-border" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <span className="text-[9px] md:text-[11px] font-semibold text-text-muted uppercase tracking-[0.05em]">Öppna</span>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: "#f3f0ff" }}>
                  <AlertCircle size={12} color="#5e35b1" />
                </div>
              </div>
              <div className="text-[24px] md:text-[34px] font-bold text-text-primary tracking-[-1px] md:tracking-[-2px] leading-none mb-2 md:mb-3">{open}</div>
              <div className="h-1 md:h-1.5 bg-background rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${tickets.length ? (open / tickets.length) * 100 : 0}%`, background: "linear-gradient(90deg, #5e35b1, #7c4dff)" }} />
              </div>
            </div>

            <div
              className="rounded-2xl p-3 md:p-5"
              style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 6px 20px rgba(94,53,177,0.35)" }}
            >
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <span className="text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "rgba(255,255,255,0.7)" }}>Pågående</span>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <Clock size={12} color="#fff" />
                </div>
              </div>
              <div className="text-[24px] md:text-[34px] font-bold text-white tracking-[-1px] md:tracking-[-2px] leading-none mb-2 md:mb-3">{inProgress}</div>
              <div className="h-1 md:h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full bg-white" style={{ width: `${tickets.length ? (inProgress / tickets.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="bg-card rounded-2xl p-3 md:p-5 border border-border" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <span className="text-[9px] md:text-[11px] font-semibold text-text-muted uppercase tracking-[0.05em]">Lösta</span>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: "#f0faf5" }}>
                  <CheckCircle size={12} color="#34c759" />
                </div>
              </div>
              <div className="text-[24px] md:text-[34px] font-bold tracking-[-1px] md:tracking-[-2px] leading-none mb-2 md:mb-3" style={{ color: "#34c759" }}>{resolved}</div>
              <div className="h-1 md:h-1.5 bg-background rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${tickets.length ? (resolved / tickets.length) * 100 : 0}%`, background: "#34c759" }} />
              </div>
            </div>
          </div>

          {/* Aktiva ärenden */}
          {activeTickets.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-[15px] md:text-[16px] font-bold text-text-primary tracking-[-0.3px] m-0">
                  Aktiva ärenden
                </h2>
                <span className="text-[11px] md:text-[12px] text-text-muted font-medium">{activeTickets.length} st</span>
              </div>

              <div className="flex flex-col gap-2 md:gap-3">
                {activeTickets.map((ticket) => {
                  const cat = categoryConfig[ticket.category] || categoryConfig.OTHER;
                  const step = progressIndex[ticket.status] ?? 0;

                  return (
                    <Link
                      key={ticket.id}
                      href={`/tickets/${ticket.id}`}
                      className="flex bg-card rounded-2xl border border-border no-underline hover:border-primary transition-all duration-150 overflow-hidden"
                      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                    >
                      {/* Kategori ikon — kompaktare på mobil */}
                      <div
                        className="w-14 md:w-17 flex flex-col items-center justify-center gap-1 md:gap-1.5 py-3 shrink-0"
                        style={{ background: cat.bg }}
                      >
                        <div style={{ color: cat.color }}>{cat.icon}</div>
                        <span className="text-[7px] md:text-[9px] font-semibold uppercase tracking-[0.04em] text-center px-1 leading-tight" style={{ color: cat.color }}>
                          {categoryLabel(ticket.category)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-3 md:px-5 py-3 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="text-[10px] md:text-[11px] text-text-muted mb-0.5 md:mb-1 font-medium">
                              {new Date(ticket.createdAt).toLocaleDateString("sv-SE")} · {priorityLabel(ticket.priority)}
                            </div>
                            <p className="text-[13px] md:text-[15px] font-semibold text-text-primary m-0 truncate capitalize">
                              {ticket.title}
                            </p>
                          </div>
                          <span style={{ ...statusBadgeStyle(ticket.status), flexShrink: 0, fontSize: "10px", padding: "3px 8px" }}>
                            {statusLabel(ticket.status)}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="flex gap-0.5 md:gap-1 mb-1">
                          {progressSteps.map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 h-0.5 md:h-0.75 rounded-full"
                              style={{ background: i <= step ? "linear-gradient(90deg, #5e35b1, #7c4dff)" : "#ebebf0" }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between">
                          {progressSteps.map((s, i) => (
                            <span
                              key={i}
                              className="text-[8px] md:text-[10px]"
                              style={{
                                color: i <= step ? "#5e35b1" : "#aeaeb2",
                                fontWeight: i === step ? 700 : 500,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nyligen lösta */}
          {resolvedTickets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-[15px] md:text-[16px] font-bold text-text-primary tracking-[-0.3px] m-0">
                  Nyligen lösta
                </h2>
                <Link href="/tickets" className="text-[11px] md:text-[12px] font-medium no-underline hover:underline" style={{ color: "#5e35b1" }}>
                  Visa alla →
                </Link>
              </div>

              <div className="flex flex-col gap-2 md:gap-3">
                {resolvedTickets.map((ticket) => {
                  const cat = categoryConfig[ticket.category] || categoryConfig.OTHER;
                  return (
                    <Link
                      key={ticket.id}
                      href={`/tickets/${ticket.id}`}
                      className="flex bg-card rounded-2xl border border-border no-underline hover:border-primary transition-all duration-150 overflow-hidden opacity-70 hover:opacity-90"
                      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                    >
                      <div
                        className="w-14 md:w-17 flex flex-col items-center justify-center gap-1 py-3 shrink-0"
                        style={{ background: "#f0faf5" }}
                      >
                        <CheckCircle size={18} color="#34c759" />
                        <span className="text-[7px] md:text-[9px] font-semibold uppercase" style={{ color: "#34c759" }}>Löst</span>
                      </div>
                      <div className="flex-1 px-3 md:px-5 py-3 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="text-[10px] text-text-muted mb-0.5 font-medium">
                              {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                            </div>
                            <p className="text-[13px] md:text-[15px] font-semibold text-text-primary m-0 truncate capitalize">
                              {ticket.title}
                            </p>
                          </div>
                          <span style={{ ...statusBadgeStyle(ticket.status), flexShrink: 0, fontSize: "10px", padding: "3px 8px" }}>
                            {statusLabel(ticket.status)}
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {progressSteps.map((_, i) => (
                            <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: "#34c759" }} />
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {tickets.length === 0 && (
            <EmptyState
              icon="inbox"
              title="Inga ärenden ännu"
              description="Du har inte skapat några ärenden ännu."
              action={{ label: "Skapa ditt första ärende", href: "/tickets/new" }}
            />
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}