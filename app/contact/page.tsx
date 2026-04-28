import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import Footer from "@/components/ui/Footer";
import BackButton from "@/components/ui/BackButton";
import { Phone, Mail, FileText, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kontakt & Support" };

const faqs = [
  { q: "Hur lång är handläggningstiden?", a: "Vi strävar efter att svara inom 48 timmar. Akuta ärenden prioriteras och hanteras samma dag." },
  { q: "Kan jag bifoga bilder till mitt ärende?", a: "Ja, du kan bifoga bilder (PNG, JPG upp till 10MB) när du skapar ett ärende." },
  { q: "Hur vet jag när mitt ärende är åtgärdat?", a: "Du får ett meddelande i systemet när statusen på ditt ärende uppdateras." },
  { q: "Vad gör jag vid akut vattenläcka eller brand?", a: "Ring alltid 112 vid fara för liv. För akuta vattenläckor ring vår jourtjänst på 08-123 456 79." },
  { q: "Kan jag ändra eller ta bort ett ärende?", a: "Du kan inte ändra ett ärende efter att det skickats, men du kan lämna kompletterande information i chatten." },
];

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");

  const isAdmin = dbUser.role === "ADMIN";

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role={isAdmin ? "ADMIN" : "TENANT"} name={dbUser.name} apartment={dbUser.apartment} cityImage={!isAdmin} />
      <MobileTopbar title="Kontakt & Support" backHref={isAdmin ? "/admin" : "/dashboard"} name={dbUser.name} />
      <MobileNav role={isAdmin ? "ADMIN" : "TENANT"} />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 shrink-0">
          <div className="hidden md:block">
            <BackButton href={isAdmin ? "/admin" : "/dashboard"} label="Tillbaka" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #5e35b1, #7c4dff)" }} />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">Hjälp & Support</span>
          </div>
          <h1 className="text-[18px] md:text-[28px] font-extrabold text-text-primary tracking-[-0.5px] md:tracking-[-1px] m-0">
            Kontakt &{" "}
            <span style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Support
            </span>
          </h1>
        </div>

        <div className="p-4 md:p-8 flex-1">

          {/* Kontaktkort — 1 kolumn på mobil, 3 på desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            {[
              { icon: <FileText size={18} color="#5e35b1" />, label: "Felanmälan", title: "Skapa ett ärende", desc: "Använd systemet för alla felanmälningar. Beskriv felet och bifoga gärna en bild.", extra: null },
              { icon: <Phone size={18} color="#5e35b1" />, label: "Telefon", title: "08-123 456 78", desc: "Ring oss för frågor om ditt ärende. Jourtjänst dygnet runt för akuta ärenden.", extra: "Jour: 08-123 456 79" },
              { icon: <Mail size={18} color="#5e35b1" />, label: "E-post", title: "support@fastighet.se", desc: "Skicka e-post för icke-akuta ärenden. Vi svarar inom 1–2 arbetsdagar.", extra: "Svarstid: 1–2 dagar" },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: "#f3f0ff" }}>
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.06em]">{card.label}</span>
                </div>
                <div className="p-4 md:p-5">
                  <div className="text-[14px] md:text-[15px] font-bold text-text-primary mb-1.5">{card.title}</div>
                  <div className="text-[12px] md:text-[13px] text-text-muted leading-[1.6] mb-3">{card.desc}</div>
                  {card.extra && (
                    <div className="text-[11px] md:text-[12px] font-semibold px-2.5 md:px-3 py-1.5 rounded-xl inline-block" style={{ background: "#f3f0ff", color: "#5e35b1" }}>
                      {card.extra}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: "#f3f0ff" }}>
                  <HelpCircle size={14} color="#5e35b1" />
                </div>
                <span className="text-[14px] md:text-[15px] font-bold text-text-primary">Vanliga frågor</span>
              </div>
              <span className="text-[11px] md:text-[12px] text-text-muted font-medium">{faqs.length} frågor</span>
            </div>
            <div>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="px-4 md:px-6 py-4 md:py-5"
                  style={{ borderBottom: index < faqs.length - 1 ? "1px solid #f5f5f7" : "none" }}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#f3f0ff" }}>
                      <span className="text-[10px] font-bold" style={{ color: "#5e35b1" }}>Q</span>
                    </div>
                    <div>
                      <p className="text-[13px] md:text-[14px] font-bold text-text-primary m-0 mb-1.5">{faq.q}</p>
                      <p className="text-[12px] md:text-[13px] text-text-muted m-0 leading-[1.6]">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}