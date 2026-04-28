"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Felaktiga inloggningsuppgifter. Försök igen.");
      setLoading(false);
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex bg-[#fafaff]">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/login-bg.jpg"
          alt="Stockholm"
          fill
          className="object-cover"
          priority
        />
<div className="absolute inset-0 bg-linear-to-br from-[#00000066] via-[#1a1a2e55] to-[#00000066]" />

        <div className="relative z-10 p-12 flex flex-col justify-between text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <div>
              <p className="text-sm font-bold">Fastighet</p>
              <p className="text-xs opacity-70">Stockholm Stad</p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-3 leading-tight">
              Hantera fastigheter smartare
            </h2>
            <p className="text-sm opacity-80">
              Rapportera fel, följ ärenden och effektivisera arbetet – allt i ett modernt system.
            </p>
          </div>
        </div>
      </div>

{/* RIGHT PANEL */}
<div className="flex-1 flex items-center justify-center px-8 py-10" style={{ background: "#fafaff" }}>
  <div className="w-full max-w-105">

    {/* Header */}
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #5e35b1, #7c4dff)" }} />
        <span className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em]">Välkommen tillbaka</span>
      </div>
      <h1 className="text-[38px] font-extrabold text-text-primary tracking-[-2px] leading-[1.1] mb-3">
        Logga in på<br />
        <span style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Fastighet
        </span>
      </h1>
      <p className="text-[15px] text-text-muted leading-[1.6]">
        Anmäl fel och följ dina ärenden enkelt och smidigt.
      </p>
    </div>

    {/* Formulär */}
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>

      <div>
        <label htmlFor="email" className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-[0.06em]">
          E-postadress
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="namn@organisation.se"
          required
          autoComplete="email"
          className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#5e35b1] focus:ring-4 focus:ring-[#5e35b114] outline-none transition text-[14px] font-[inherit]"
          style={{ background: "#fff" }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="text-[12px] font-semibold text-text-secondary uppercase tracking-[0.06em]">
            Lösenord
          </label>
          <Link href="/forgot-password" className="text-[12px] font-semibold no-underline hover:underline" style={{ color: "#5e35b1" }}>
            Glömt lösenord?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#5e35b1] focus:ring-4 focus:ring-[#5e35b114] outline-none transition text-[14px] font-[inherit] pr-12"
            style={{ background: "#fff" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
          >
            {showPassword ? <EyeOff size={17} color="#aeaeb2" /> : <Eye size={17} color="#aeaeb2" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium" style={{ background: "#fff5f5", border: "1.5px solid #ffc0bc", color: "#ff3b30" }}>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff3b30" }} />
          {error}
        </div>
      )}

      {/* Knapp med gradient + ikon */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-2xl text-white text-[15px] font-bold border-none font-[inherit] mt-2 flex items-center justify-center gap-3 transition-all ${
          loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
        }`}
        style={{
          background: "linear-gradient(135deg, #5e35b1, #7c4dff)",
          boxShadow: loading ? "none" : "0 8px 28px rgba(94,53,177,0.45)",
        }}
      >
        {loading ? (
          "Loggar in..."
        ) : (
          <>
            Logga in
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>

    {/* Divider */}
    <div className="flex items-center gap-4 my-7">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-[12px] text-gray-400 font-medium">eller</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>

    {/* Register */}
    <p className="text-[14px] text-text-muted text-center m-0 mb-8">
      Har du inget konto?{" "}
      <Link href="/register" className="font-bold no-underline hover:underline" style={{ color: "#5e35b1" }}>
        Registrera dig
      </Link>
    </p>

    {/* Features */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: "🔔", text: "Realtids-notiser" },
        { icon: "💬", text: "Direkt-chatt" },
        { icon: "📊", text: "Ärendestatus" },
      ].map((f) => (
        <div
          key={f.text}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center"
          style={{ background: "#f3f0ff" }}
        >
          <span className="text-[20px]">{f.icon}</span>
          <span className="text-[10px] font-semibold text-text-muted leading-tight">{f.text}</span>
        </div>
      ))}
    </div>

    {/* Footer */}
    <p className="text-[11px] text-text-disabled text-center mt-8">
      Stockholm Stad · Fastighetsförvaltning · 2026
    </p>
  </div>
</div>

    </div>
  );
}
