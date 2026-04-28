"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, FileText, Plus, Users, Settings, LogOut, Home } from "lucide-react";

interface SidebarProps {
  role: "TENANT" | "ADMIN";
  name: string;
  apartment?: string | null;
  cityImage?: boolean;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Sidebar({ role, name, apartment, cityImage = false }: SidebarProps) {
  const pathname = usePathname();

  const tenantLinks = [
    { href: "/dashboard", label: "Översikt", icon: LayoutDashboard },
    { href: "/tickets", label: "Mina ärenden", icon: FileText },
    { href: "/tickets/new", label: "Nytt ärende", icon: Plus },
  ];

  const adminLinks = [
    { href: "/admin", label: "Översikt", icon: LayoutDashboard },
    { href: "/admin/tickets", label: "Alla ärenden", icon: FileText },
    { href: "/admin/users", label: "Användare", icon: Users },
  ];

  const links = role === "ADMIN" ? adminLinks : tenantLinks;

  return (
    <div className="sidebar w-55 min-h-screen flex flex-col shrink-0 sticky top-0 h-screen bg-card border-r border-border">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
            style={{
              background: "linear-gradient(135deg, #5e35b1, #7c4dff)",
              boxShadow: "0 4px 10px rgba(94,53,177,0.3)",
            }}
          >
            <Home size={16} color="#fff" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-text-primary tracking-[-0.3px]">
              Fastighet
            </div>
            <div className="text-[10px] text-text-muted mt-0.5 font-medium">
              Stockholm Stad
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="p-3 flex-1">
        <div className="text-[10px] text-text-disabled uppercase tracking-widest px-3 mb-2 font-semibold">
          {role === "ADMIN" ? "Hantera" : "Navigation"}
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-150"
                style={{
                  background: isActive ? "#f3f0ff" : "transparent",
                  borderLeft: isActive ? "3px solid #5e35b1" : "3px solid transparent",
                  paddingLeft: isActive ? "9px" : "12px",
                }}
              >
                <Icon size={16} color={isActive ? "#5e35b1" : "#aeaeb2"} />
                <span
                  className="text-[13px]"
                  style={{
                    color: isActive ? "#5e35b1" : "#6e6e73",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="h-px bg-border my-3 mx-2" />

        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-150 hover:bg-background"
          style={{ borderLeft: "3px solid transparent" }}
        >
          <Settings size={16} color="#aeaeb2" />
          <span className="text-[13px] text-text-muted font-normal">Inställningar</span>
        </Link>
      </div>

     {/* Stadsbild — bara för TENANT */}
{cityImage && (
  <div
    className="relative overflow-hidden mx-3 mb-3 rounded-2xl shrink-0"
    style={{ height: "160px" }}
  >
    <Image
      src="/sidebar-city.jpg"
      alt="Stockholm"
      fill
      style={{ objectFit: "cover", objectPosition: "center" }}
      quality={85}
    />

    {/* Lila gradient overlay */}
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(to bottom, rgba(94,53,177,0.1) 0%, rgba(94,53,177,0.65) 100%)" }}
    />

    {/* Stjärneffekt */}
    <div className="absolute top-3 right-4 w-1 h-1 rounded-full" style={{ background: "#f5c400", boxShadow: "0 0 6px #f5c400" }} />
    <div className="absolute top-5 right-10 w-0.5 h-0.5 rounded-full bg-white opacity-70" />
    <div className="absolute top-4 right-16 w-1 h-1 rounded-full bg-white opacity-40" />

    {/* Text */}
    <div className="absolute top-3 left-3 right-3">
      <p className="text-[12px] font-bold text-white m-0 tracking-[-0.2px]">Stockholm</p>
      <p className="text-[10px] m-0 mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
        Fastighetsförvaltning
      </p>
    </div>
  </div>
)}
      {/* User */}
      <div className="px-4 py-4 border-t border-border">
        <Link href="/profile" className="flex items-center gap-3 no-underline mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}
          >
            <span className="text-[12px] text-white font-bold">
              {getInitials(name)}
            </span>
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="text-[13px] text-text-primary truncate font-semibold">
              {name}
            </div>
            <div className="text-[10px] text-text-muted">
              {apartment ? `Lgh ${apartment}` : "Stockholm Stad"}
            </div>
          </div>
        </Link>

        <Link
          href="/api/auth/signout"
          className="flex items-center justify-center gap-2 py-2 rounded-xl no-underline transition-all hover:bg-danger-light"
          style={{ background: "#f5f5f7" }}
        >
          <LogOut size={13} color="#6e6e73" />
          <span className="text-[12px] text-text-muted font-medium">Logga ut</span>
        </Link>
      </div>
    </div>
  );
}