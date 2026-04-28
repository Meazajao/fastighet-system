import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import Footer from "@/components/ui/Footer";
import BackButton from "@/components/ui/BackButton";
import ProfileForm from "./ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Min profil" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");

  const isAdmin = dbUser.role === "ADMIN";

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role={isAdmin ? "ADMIN" : "TENANT"} name={dbUser.name} apartment={dbUser.apartment} cityImage={!isAdmin} />
      <MobileTopbar title="Min profil" backHref={isAdmin ? "/admin" : "/dashboard"} name={dbUser.name} />
      <MobileNav role={isAdmin ? "ADMIN" : "TENANT"} />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 shrink-0">
          <div className="hidden md:block">
            <BackButton href={isAdmin ? "/admin" : "/dashboard"} label="Tillbaka" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #5e35b1, #7c4dff)" }} />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">Konto</span>
          </div>
          <h1 className="text-[18px] md:text-[28px] font-extrabold text-text-primary tracking-[-0.5px] md:tracking-[-1px] m-0">
            Min profil
          </h1>
        </div>

        <div className="p-4 md:p-8 flex-1">
          <div className="max-w-150">
            <ProfileForm
              userId={dbUser.id}
              initialName={dbUser.name}
              initialApartment={dbUser.apartment || ""}
              email={dbUser.email}
              role={dbUser.role}
            />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}