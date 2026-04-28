import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopbar from "@/components/MobileTopbar";
import Footer from "@/components/ui/Footer";
import BackButton from "@/components/ui/BackButton";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Integritetspolicy" };

const sections = [
  { title: "Personuppgiftsansvarig", content: "Stockholm Stad är personuppgiftsansvarig för behandlingen av dina personuppgifter i detta system. Kontaktuppgifter: Stockholm Stad, 105 35 Stockholm. E-post: dataskydd@stockholm.se" },
  { title: "Vilka uppgifter samlar vi in?", content: "Vi samlar in namn, e-postadress, lägenhetsnummer samt information om de ärenden du skapar, inklusive beskrivningar, bilder och meddelanden." },
  { title: "Varför behandlar vi dina uppgifter?", content: "Vi behandlar dina personuppgifter för att kunna hantera felanmälningar och kommunicera med dig om dina ärenden. Den rättsliga grunden är allmänt intresse enligt GDPR artikel 6.1 e." },
  { title: "Hur länge sparar vi uppgifterna?", content: "Dina uppgifter sparas så länge ditt konto är aktivt och i upp till 2 år efter att ett ärende stängts. Du kan när som helst begära att dina uppgifter raderas." },
  { title: "Dina rättigheter", content: "Du har rätt att begära tillgång till, rättelse eller radering av dina personuppgifter. Du har även rätt att begära begränsning av behandlingen och att invända mot behandlingen." },
  { title: "Cookies", content: "Vi använder endast nödvändiga cookies för att systemet ska fungera. Vi använder inga spårningscookies eller cookies för marknadsföringsändamål." },
  { title: "Säkerhet", content: "Vi skyddar dina uppgifter med kryptering och åtkomstkontroll. Endast behörig personal har tillgång till dina uppgifter." },
  { title: "Kontakt och klagomål", content: "Vid frågor om vår behandling av personuppgifter, kontakta dataskyddsombudet på dataskydd@stockholm.se. Du har rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY) på imy.se." },
];

export default async function PrivacyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect("/login");

  const isAdmin = dbUser.role === "ADMIN";

  return (
    <div className="app-layout flex min-h-screen">
      <Sidebar role={isAdmin ? "ADMIN" : "TENANT"} name={dbUser.name} apartment={dbUser.apartment} cityImage={!isAdmin} />
      <MobileTopbar title="Integritetspolicy" backHref={isAdmin ? "/admin" : "/dashboard"} name={dbUser.name} />
      <MobileNav role={isAdmin ? "ADMIN" : "TENANT"} />

      <main className="main-content flex-1 bg-background flex flex-col">

        <div className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 shrink-0">
          <div className="hidden md:block">
            <BackButton href={isAdmin ? "/admin" : "/dashboard"} label="Tillbaka" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #5e35b1, #7c4dff)" }} />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">Juridik</span>
          </div>
          <h1 className="text-[18px] md:text-[28px] font-extrabold text-text-primary tracking-[-0.5px] md:tracking-[-1px] m-0">
            Integritets
            <span style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              policy
            </span>
          </h1>
        </div>

        <div className="p-4 md:p-8 flex-1">
          <div className="max-w-180">

            {/* Intro */}
            <div className="rounded-2xl md:rounded-3xl p-4 md:p-6 mb-5 md:mb-6 flex items-start gap-3 md:gap-4" style={{ background: "#f3f0ff", border: "1px solid #e0d4ff" }}>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}>
                <Shield size={16} color="#fff" />
              </div>
              <div>
                <div className="text-[13px] md:text-[14px] font-bold text-text-primary mb-1">Senast uppdaterad: April 2026</div>
                <p className="text-[12px] md:text-[13px] leading-[1.7] m-0" style={{ color: "#5e35b1" }}>
                  Stockholm Stad värnar om din personliga integritet. Denna policy beskriver hur vi samlar in, använder och skyddar dina personuppgifter.
                </p>
              </div>
            </div>

            {/* Sektioner */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="px-4 md:px-6 py-4 md:py-5"
                  style={{ borderBottom: index < sections.length - 1 ? "1px solid #f5f5f7" : "none" }}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#f3f0ff" }}>
                      <span className="text-[10px] md:text-[11px] font-bold" style={{ color: "#5e35b1" }}>{index + 1}</span>
                    </div>
                    <div>
                      <h2 className="text-[13px] md:text-[14px] font-bold text-text-primary m-0 mb-1.5">{section.title}</h2>
                      <p className="text-[12px] md:text-[13px] text-text-muted m-0 leading-[1.7]">{section.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 md:mt-5 rounded-2xl p-4 flex items-start gap-3" style={{ background: "#f8f8fc", border: "1.5px solid #ebebf0" }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "#5e35b1" }} />
              <p className="text-[12px] text-text-muted m-0 leading-[1.6]">
                Har du frågor? Kontakta{" "}
                <span className="font-semibold" style={{ color: "#5e35b1" }}>dataskydd@stockholm.se</span>
                {" "}eller besök{" "}
                <span className="font-semibold" style={{ color: "#5e35b1" }}>imy.se</span>.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}