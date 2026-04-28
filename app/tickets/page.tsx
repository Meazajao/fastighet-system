import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import EmptyState from "@/components/ui/EmptyState";
import Footer from "@/components/ui/Footer";
import TenantNotifications from "@/components/TenantNotifications";
import Link from "next/link";
import { statusBadgeStyle, statusLabel, priorityBadgeStyle, priorityLabel, categoryLabel } from "@/lib/styles";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mina ärenden" };

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: Date;
  userId: string;
  imageUrl: string | null;
}

export default async function TicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");

  const tickets = await prisma.ticket.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role="TENANT" name={dbUser.name} apartment={dbUser.apartment} />
      <MobileTopbar title="Mina ärenden" name={dbUser.name} />
      <MobileNav role="TENANT" />
      <TenantNotifications userId={dbUser.id} />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] md:text-[12px] text-text-muted font-medium mb-0.5">
              {tickets.length} ärenden totalt
            </div>
            <h1 className="text-[18px] md:text-[22px] font-bold text-text-primary tracking-[-0.5px] m-0">
              Mina ärenden
            </h1>
          </div>
          <Link
            href="/tickets/new"
            className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl no-underline font-semibold text-[12px] md:text-[13px] text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 4px 12px rgba(94,53,177,0.3)" }}
          >
            <Plus size={14} color="#fff" />
            <span className="hidden sm:inline">Nytt ärende</span>
            <span className="sm:hidden">Nytt</span>
          </Link>
        </div>

        <div className="p-4 md:p-8 flex-1">
          {tickets.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="Inga ärenden ännu"
              description="Du har inte skapat några ärenden. Klicka på knappen ovan för att anmäla ett fel."
              action={{ label: "Skapa ditt första ärende", href: "/tickets/new" }}
            />
          ) : (
            <div className="flex flex-col gap-2 md:gap-3">
              {tickets.map((ticket: Ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="flex items-center bg-card rounded-2xl border border-border no-underline hover:border-primary transition-all duration-150 overflow-hidden"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                >
                  <div
                    className="w-1.5 self-stretch shrink-0"
                    style={{
                      background: ticket.priority === "URGENT" ? "#ff3b30"
                        : ticket.priority === "HIGH" ? "#f5a623"
                        : ticket.priority === "MEDIUM" ? "#5e35b1"
                        : "#ebebf0",
                    }}
                  />
                  <div className="flex-1 px-4 md:px-5 py-3 md:py-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-[10px] md:text-[11px] font-semibold text-text-muted bg-background px-2 py-0.5 rounded-lg">
                            {categoryLabel(ticket.category)}
                          </span>
                          <span style={{ ...priorityBadgeStyle(ticket.priority), fontSize: "10px", padding: "2px 8px" }}>
                            {priorityLabel(ticket.priority)}
                          </span>
                          <span className="text-[10px] text-text-disabled ml-auto">
                            {new Date(ticket.createdAt).toLocaleDateString("sv-SE")}
                          </span>
                        </div>
                        <p className="text-[13px] md:text-[15px] font-semibold text-text-primary m-0 mb-0.5 tracking-[-0.2px] capitalize truncate">
                          {ticket.title}
                        </p>
                        <p className="hidden md:block text-[12px] text-text-muted m-0 truncate">
                          {ticket.description}
                        </p>
                      </div>
                      <span style={{ ...statusBadgeStyle(ticket.status), flexShrink: 0, fontSize: "10px", padding: "3px 8px" }}>
                        {statusLabel(ticket.status)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}