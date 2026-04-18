"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { theme } from "@/lib/theme";
import { getInitials } from "@/lib/utils";

interface SidebarProps {
  role: "TENANT" | "ADMIN";
  name: string;
  apartment?: string | null;
}

export default function Sidebar({ role, name, apartment }: SidebarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const tenantLinks = [
    { href: "/dashboard", label: "Översikt" },
    { href: "/tickets", label: "Mina ärenden" },
    { href: "/tickets/new", label: "+ Nytt ärende" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Översikt" },
    { href: "/admin/tickets", label: "Alla ärenden" },
    { href: "/admin/users", label: "Användare" },
  ];

  const links = role === "ADMIN" ? adminLinks : tenantLinks;
  const initials = getInitials(name);

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="sidebar"
        style={{
          width: "220px",
          minHeight: "100vh",
          background: theme.colors.sidebar,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
          <div style={{ width: "32px", height: "32px", background: theme.colors.accent, borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: "16px", height: "16px", background: "#fff", borderRadius: "3px" }} />
          </div>
          <div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: theme.colors.sidebarTextActive, letterSpacing: "-0.2px" }}>
              Fastighet
            </span>
            {role === "ADMIN" && (
              <span style={{ display: "block", fontSize: "9px", color: theme.colors.accent, background: `${theme.colors.accent}20`, padding: "1px 6px", borderRadius: "4px", marginTop: "2px", width: "fit-content" }}>
                Admin
              </span>
            )}
          </div>
        </div>

        <p className="sidebar-section-label" style={{ fontSize: "9px", color: "#2d5478", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 10px" }}>
          {role === "ADMIN" ? "Hantera" : "Navigering"}
        </p>

        <nav className="sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 10px",
                  borderRadius: theme.borderRadius.sm,
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? theme.colors.sidebarTextActive : theme.colors.sidebarTextInactive,
                  background: isActive ? `${theme.colors.accent}18` : "transparent",
                  borderLeft: isActive ? `2px solid ${theme.colors.accent}` : "2px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  display: "block",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-user" style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${theme.colors.sidebarBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 4px" }}>
            <div style={{ width: "32px", height: "32px", background: `${theme.colors.accent}25`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "11px", color: theme.colors.accent, fontWeight: 600 }}>{initials}</span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: "12px", color: theme.colors.sidebarTextActive, margin: 0, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {name}
              </p>
              <p style={{ fontSize: "10px", color: theme.colors.sidebarTextInactive, margin: 0 }}>
                {apartment || ""}
              </p>
            </div>
          </div>
          <Link href="/api/auth/signout" style={{ display: "block", padding: "7px 10px", borderRadius: theme.borderRadius.sm, fontSize: "12px", color: theme.colors.sidebarTextInactive, textDecoration: "none", marginTop: "4px" }}>
            Logga ut
          </Link>
        </div>
      </div>

      {/* Mobil topbar */}
      <div
        className="mobile-nav"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: theme.colors.sidebar,
          padding: "12px 16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: theme.colors.accent, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "14px", height: "14px", background: "#fff", borderRadius: "3px" }} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: theme.colors.sidebarTextActive }}>Fastighet</span>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <div style={{ width: "20px", height: "2px", background: theme.colors.sidebarTextActive, borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <div style={{ width: "20px", height: "2px", background: theme.colors.sidebarTextActive, borderRadius: "2px", transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: "20px", height: "2px", background: theme.colors.sidebarTextActive, borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobil dropdown-meny */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            display: "none",
            position: "fixed",
            top: "52px",
            left: 0,
            right: 0,
            zIndex: 99,
            background: theme.colors.sidebar,
            padding: "8px 16px 16px",
            borderTop: `1px solid ${theme.colors.sidebarBorder}`,
          }}
        >
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: theme.borderRadius.sm,
                  fontSize: "14px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? theme.colors.sidebarTextActive : theme.colors.sidebarTextInactive,
                  background: isActive ? `${theme.colors.accent}18` : "transparent",
                  textDecoration: "none",
                  marginBottom: "2px",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <div style={{ borderTop: `1px solid ${theme.colors.sidebarBorder}`, marginTop: "8px", paddingTop: "8px" }}>
            <Link
              href="/api/auth/signout"
              style={{ display: "block", padding: "10px 12px", fontSize: "13px", color: theme.colors.sidebarTextInactive, textDecoration: "none" }}
            >
              Logga ut
            </Link>
          </div>
        </div>
      )}
    </>
  );
}