"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/lib/theme";

interface NavItem {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactElement;
  special?: boolean;
}

interface MobileNavProps {
  role: "TENANT" | "ADMIN";
}

export default function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();

  const tenantItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Hem",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? theme.colors.accent : "#94a3b8"}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      href: "/tickets",
      label: "Ärenden",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? theme.colors.accent : "#94a3b8"}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
    },
    {
      href: "/tickets/new",
      label: "Nytt",
      special: true,
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "#fff" : "#fff"}>
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      ),
    },
    {
      href: "/api/auth/signout",
      label: "Logga ut",
      icon: (_active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#94a3b8">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      ),
    },
  ];

  const adminItems: NavItem[] = [
    {
      href: "/admin",
      label: "Översikt",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? theme.colors.accent : "#94a3b8"}>
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      href: "/admin/tickets",
      label: "Ärenden",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? theme.colors.accent : "#94a3b8"}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
    },
    {
      href: "/admin/users",
      label: "Användare",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? theme.colors.accent : "#94a3b8"}>
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      href: "/api/auth/signout",
      label: "Logga ut",
      icon: (_active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#94a3b8">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      ),
    },
  ];

  const items = role === "ADMIN" ? adminItems : tenantItems;

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "#fff",
        borderTop: "1px solid #f1f5f9",
        padding: "8px 0 12px",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        textAlign: "center",
      }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              textDecoration: "none",
              padding: "4px 0",
            }}
          >
            {item.special ? (
              <div style={{
                width: "36px",
                height: "36px",
                background: theme.colors.accent,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-16px",
                boxShadow: "0 4px 12px rgba(14,165,233,0.4)",
              }}>
                {item.icon(isActive)}
              </div>
            ) : (
              item.icon(isActive)
            )}
            <span style={{
              fontSize: "10px",
              color: isActive ? theme.colors.accent : "#94a3b8",
              fontWeight: isActive ? 600 : 400,
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}