import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import Chat from "@/components/chat/Chat";
import StatusUpdater from "@/components/tickets/StatusUpdater";
import TicketImage from "@/components/tickets/TicketImage";
import BackButton from "@/components/ui/BackButton";
import Footer from "@/components/ui/Footer";
import { statusBadgeStyle, statusLabel, priorityBadgeStyle, priorityLabel, categoryLabel } from "@/lib/styles";

export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (dbUser?.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { user: true, messages: { include: { user: true }, orderBy: { createdAt: "asc" } } },
  });

  if (!ticket) redirect("/admin/tickets");

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role="ADMIN" name={dbUser.name} apartment={null} />
      <MobileTopbar title={ticket.title} backHref="/admin/tickets" name={dbUser.name} />
      <MobileNav role="ADMIN" />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 shrink-0 hidden md:block">
          <BackButton href="/admin/tickets" label="Alla ärenden" />
        </div>

        <div className="p-4 md:p-8 flex-1">
          <div className="max-w-190 mx-auto md:mx-0">

            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] md:text-[12px] font-semibold text-text-muted bg-background px-2 md:px-3 py-1 rounded-lg">
                    {categoryLabel(ticket.category)}
                  </span>
                  <span style={{ ...priorityBadgeStyle(ticket.priority), fontSize: "11px" }}>
                    {priorityLabel(ticket.priority)}
                  </span>
                </div>
                <span style={{ ...statusBadgeStyle(ticket.status), fontSize: "11px" }}>
                  {statusLabel(ticket.status)}
                </span>
              </div>

              <div className="px-4 md:px-6 py-4 md:py-5">
                <h1 className="text-[17px] md:text-[20px] font-bold text-text-primary m-0 mb-1 tracking-[-0.4px] capitalize">
                  {ticket.title}
                </h1>
                <p className="text-[11px] md:text-[12px] text-text-muted m-0 mb-4">
                  {ticket.user.name}{ticket.user.apartment ? ` · Lgh ${ticket.user.apartment}` : ""}
                  {` · ${new Date(ticket.createdAt).toLocaleDateString("sv-SE")}`}
                </p>
                <p className="text-[13px] md:text-[14px] text-text-secondary m-0 mb-4 leading-[1.7]">
                  {ticket.description}
                </p>
                {ticket.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <TicketImage path={ticket.imageUrl} />
                  </div>
                )}
                <StatusUpdater
                  ticketId={ticket.id}
                  currentStatus={ticket.status}
                  ticketTitle={ticket.title}
                  ticketUserId={ticket.userId}
                />
              </div>
            </div>

            <Chat
              ticketId={ticket.id}
              currentUserId={dbUser.id}
              initialMessages={ticket.messages as any}
            />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}