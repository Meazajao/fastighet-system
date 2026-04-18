"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { theme } from "@/lib/theme";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Felaktigt e-post eller lösenord");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: theme.colors.accentLight,
    border: `1px solid ${theme.colors.accentBorder}`,
    borderRadius: theme.borderRadius.md,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
    color: theme.colors.textPrimary,
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: theme.colors.textSecondary,
    marginBottom: "6px",
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 40%, #93c5fd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Bakgrundscirklar */}
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", background: "#93c5fd", borderRadius: "50%", opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "280px", height: "280px", background: "#bfdbfe", borderRadius: "50%", opacity: 0.5 }} />
      <div style={{ position: "absolute", top: "30%", left: "10%", width: "120px", height: "120px", background: "#7dd3fc", borderRadius: "50%", opacity: 0.3 }} />
      <div style={{ position: "absolute", top: "10%", right: "20%", width: "80px", height: "80px", background: "#60a5fa", borderRadius: "50%", opacity: 0.25 }} />

      {/* Formulärkort */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.9)",
          borderRadius: theme.borderRadius.xl,
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: theme.colors.accent,
              borderRadius: theme.borderRadius.lg,
              margin: "0 auto 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "24px", height: "24px", background: "#fff", borderRadius: "5px" }} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: theme.colors.textPrimary, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Välkommen
          </h1>
          <p style={{ fontSize: "13px", color: theme.colors.textSecondary, margin: 0 }}>
            Logga in för att hantera dina ärenden
          </p>
        </div>

        {/* Formulär */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>E-POST</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>LÖSENORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: theme.colors.dangerLight,
              border: `1px solid #fecaca`,
              borderRadius: theme.borderRadius.md,
              padding: "10px 14px",
              fontSize: "13px",
              color: theme.colors.danger,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#7dd3fc" : theme.colors.accent,
              border: "none",
              borderRadius: theme.borderRadius.md,
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: theme.colors.textSecondary, marginTop: "20px", marginBottom: 0 }}>
          Inget konto?{" "}
          <Link href="/register" style={{ color: theme.colors.accent, fontWeight: 600, textDecoration: "none" }}>
            Registrera dig
          </Link>
        </p>
      </div>
    </div>
  );
}