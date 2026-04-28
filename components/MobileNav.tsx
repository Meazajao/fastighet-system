"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Plus, Users, LogOut } from "lucide-react";

interface MobileNavProps {
  role: "TENANT" | "ADMIN";
}

export default function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();

  const tenantItems: { href: string; label: string; icon: React.ElementType; special?: boolean }[] = [
    { href: "/dashboard", label: "Översikt", icon: LayoutDashboard },
    { href: "/tickets", label: "Ärenden", icon: FileText },
    { href: "/tickets/new", label: "Nytt", icon: Plus, special: true },
    { href: "/api/auth/signout", label: "Logga ut", icon: LogOut },
  ];
  
  const adminItems: { href: string; label: string; icon: React.ElementType; special?: boolean }[] = [
    { href: "/admin", label: "Översikt", icon: LayoutDashboard },
    { href: "/admin/tickets", label: "Ärenden", icon: FileText },
    { href: "/admin/users", label: "Användare", icon: Users },
    { href: "/api/auth/signout", label: "Logga ut", icon: LogOut },
  ];

  const items = role === "ADMIN" ? adminItems : tenantItems;

  return (
    <div
      className="mobile-bottom-nav hidden fixed bottom-0 left-0 right-0 z-100 bg-white border-t border-gray-100 px-2 pb-safe"
      style={{
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        boxShadow: "0 -1px 12px rgba(0,0,0,0.06)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingTop: "8px",
      }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.special) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 no-underline"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-6"
                style={{
                  background: "linear-gradient(135deg, #5e35b1, #7c4dff)",
                  boxShadow: "0 4px 16px rgba(94,53,177,0.4)",
                }}
              >
                <Icon size={20} color="#fff" />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: "#5e35b1" }}>
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 no-underline py-1"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ background: isActive ? "#f3f0ff" : "transparent" }}
            >
              <Icon size={18} color={isActive ? "#5e35b1" : "#aeaeb2"} />
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: isActive ? "#5e35b1" : "#aeaeb2" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}