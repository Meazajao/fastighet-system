import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import Footer from "@/components/ui/Footer";
import BackButton from "@/components/ui/BackButton";
import { Shield, Zap, Clock, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Om systemet" };

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");

  const isAdmin = dbUser.role === "ADMIN";

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role={isAdmin ? "ADMIN" : "TENANT"} name={dbUser.name} apartment={dbUser.apartment} cityImage={!isAdmin} />
      <MobileTopbar title="Om systemet" backHref={isAdmin ? "/admin" : "/dashboard"} name={dbUser.name} />
      <MobileNav role={isAdmin ? "ADMIN" : "TENANT"} />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 shrink-0">
          <div className="hidden md:block">
            <BackButton href={isAdmin ? "/admin" : "/dashboard"} label="Tillbaka" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #5e35b1, #7c4dff)" }} />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">Information</span>
          </div>
          <h1 className="text-[18px] md:text-[28px] font-extrabold text-text-primary tracking-[-0.5px] md:tracking-[-1px] m-0">
            Om{" "}
            <span style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              systemet
            </span>
          </h1>
        </div>

        <div className="p-4 md:p-8 flex-1">

          {/* Hero */}
          <div className="rounded-2xl md:rounded-3xl p-5 md:p-8 mb-5 md:mb-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}>
            <div className="absolute -top-10 -right-10 w-40 md:w-50 h-40 md:h-50 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
            <div className="relative">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                Stockholm Stad · Fastighetsförvaltning
              </div>
              <h2 className="text-[18px] md:text-[26px] font-extrabold text-white tracking-[-0.8px] m-0 mb-4 md:mb-6">
                Fastighet · Ärendesystem
              </h2>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {[
                  { value: "98%", label: "Lösta ärenden" },
                  { value: "<48h", label: "Svarstid" },
                  { value: "24/7", label: "Tillgängligt" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl md:rounded-2xl p-3 md:p-4" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <div className="text-[18px] md:text-[24px] font-extrabold text-white tracking-[-1px]">{stat.value}</div>
                    <div className="text-[9px] md:text-[11px] uppercase tracking-[0.06em] mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features — 2x2 på mobil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
            {[
              { icon: <Zap size={16} color="#5e35b1" />, title: "Snabb hantering", desc: "Ärenden hanteras snabbt med realtidsuppdateringar." },
              { icon: <Shield size={16} color="#5e35b1" />, title: "Säker & trygg", desc: "All data hanteras i enlighet med GDPR." },
              { icon: <Clock size={16} color="#5e35b1" />, title: "Alltid tillgänglig", desc: "Systemet är tillgängligt dygnet runt." },
              { icon: <CheckCircle size={16} color="#5e35b1" />, title: "Enkel att använda", desc: "Modernt gränssnitt designat för alla." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-100 flex items-start gap-3 md:gap-4" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center shrink-0" style={{ background: "#f3f0ff" }}>
                  {f.icon}
                </div>
                <div>
                  <div className="text-[13px] md:text-[14px] font-bold text-text-primary mb-1">{f.title}</div>
                  <div className="text-[12px] md:text-[13px] text-text-muted leading-normal">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Info — staplad på mobil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-100">
                <span className="text-[13px] md:text-[14px] font-bold text-text-primary">Om systemet</span>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-[12px] md:text-[13px] text-text-muted leading-[1.7] m-0 mb-4">
                  Fastighet är ett modernt ärendehanteringssystem för Stockholm Stads fastighetsförvaltning.
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Version", value: "1.0.0" },
                    { label: "Uppdaterad", value: "April 2026" },
                    { label: "Driftsatt av", value: "Stockholm Stad" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[12px] text-text-muted">{item.label}</span>
                      <span className="text-[12px] font-semibold text-text-primary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-100">
                <span className="text-[13px] md:text-[14px] font-bold text-text-primary">Juridik & integritet</span>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-[12px] md:text-[13px] text-text-muted leading-[1.7] m-0 mb-4">
                  All data hanteras i enlighet med GDPR och Stockholm Stads dataskyddspolicy.
                </p>
                <div className="flex flex-col gap-1">
                  {["Integritetspolicy", "Dataskyddspolicy (GDPR)", "Tillgänglighetsredogörelse", "Cookies"].map((link) => (
                    <div key={link} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0 cursor-pointer">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#5e35b1" }} />
                      <span className="text-[12px] md:text-[13px] font-medium hover:underline" style={{ color: "#5e35b1" }}>{link} →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}