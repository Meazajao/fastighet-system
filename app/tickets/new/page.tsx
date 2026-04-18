import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import NewTicketForm from "./NewTicketForm";
import { theme } from "@/lib/theme";

export default async function NewTicketPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="TENANT" name={dbUser.name} apartment={dbUser.apartment} />
      <MobileTopbar title="Nytt ärende" backHref="/tickets" name={dbUser.name} />
      <MobileNav role="TENANT" />

      <main className="main-content" style={{ flex: 1, background: theme.colors.background, padding: "32px" }}>
        <div style={{ maxWidth: "720px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
              Nytt ärende
            </h1>
            <p style={{ fontSize: "13px", color: theme.colors.textMuted, margin: 0 }}>
              Beskriv felet så detaljerat som möjligt
            </p>
          </div>
          <NewTicketForm />
        </div>
      </main>
    </div>
  );
}