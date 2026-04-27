"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apartment, setApartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) { setError("Namnet måste vara minst 2 tecken"); return; }
    if (password.length < 8) { setError("Lösenordet måste vara minst 8 tecken"); return; }
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, apartment, role: "TENANT" } },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, apartment }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Något gick fel");
      setLoading(false);
      return;
    }

    setEmailSent(true);
    setLoading(false);
  }

  const LeftPanel = () => (
    <div className="hidden lg:flex flex-1 relative">
      <Image src="/login-bg.jpg" alt="Stockholm" fill className="object-cover" priority />
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
            Kom igång på några minuter
          </h2>
          <p className="text-sm opacity-80">
            Skapa ett konto och börja anmäla ärenden direkt — enkelt och smidigt.
          </p>
        </div>
      </div>
    </div>
  );

  if (emailSent) {
    return (
      <div className="min-h-screen flex bg-[#fafaff]">
        <LeftPanel />
        <div className="flex-1 flex items-center justify-center px-8 py-10" style={{ background: "#fafaff" }}>
          <div className="w-full max-w-105 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 8px 24px rgba(94,53,177,0.3)" }}
            >
              <Mail size={32} color="#fff" />
            </div>
            <h1 className="text-[32px] font-extrabold text-text-primary tracking-[-1.5px] mb-3">
              Kolla din inbox!
            </h1>
            <p className="text-[15px] text-text-muted mb-4 leading-[1.6]">
              Vi har skickat ett bekräftelsemail till:
            </p>
            <div
              className="px-5 py-3 rounded-2xl mb-8 text-[15px] font-bold"
              style={{ background: "#f3f0ff", color: "#5e35b1" }}
            >
              {email}
            </div>
            <div
              className="px-5 py-4 rounded-2xl mb-8 text-left"
              style={{ background: "#fff", border: "1.5px solid #ebebf0" }}
            >
              <p className="text-[13px] text-text-muted m-0 leading-[1.7]">
                Klicka på länken i mailet för att aktivera ditt konto. Kolla även skräpposten om du inte hittar det.
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white text-[15px] font-bold no-underline hover:opacity-90 transition-all mb-4"
              style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 8px 28px rgba(94,53,177,0.4)" }}
            >
              Gå till inloggning
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              onClick={() => setEmailSent(false)}
              className="text-[13px] font-semibold bg-transparent border-none cursor-pointer font-[inherit] hover:underline"
              style={{ color: "#5e35b1" }}
            >
              Fick du inget mail? Försök igen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fafaff]">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center px-8 py-10" style={{ background: "#fafaff" }}>
        <div className="w-full max-w-105">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #5e35b1, #7c4dff)" }} />
              <span className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em]">Kom igång gratis</span>
            </div>
            <h1 className="text-[38px] font-extrabold text-text-primary tracking-[-2px] leading-[1.1] mb-3">
              Skapa ditt<br />
              <span style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                konto
              </span>
            </h1>
            <p className="text-[15px] text-text-muted leading-[1.6]">
              Registrera dig och börja anmäla ärenden direkt.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-[0.06em]">Namn</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anna L."
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5e35b1] focus:ring-4 focus:ring-[#5e35b114] outline-none transition text-[14px] font-[inherit] bg-white"
                />
                {name.length > 0 && name.length < 2 && (
                  <p className="text-[11px] text-danger mt-1">Minst 2 tecken</p>
                )}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-[0.06em]">Lgh-nr</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Lgh 2B"
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#5e35b1] focus:ring-4 focus:ring-[#5e35b114] outline-none transition text-[14px] font-[inherit] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-[0.06em]">E-postadress</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@organisation.se"
                required
                autoComplete="email"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#5e35b1] focus:ring-4 focus:ring-[#5e35b114] outline-none transition text-[14px] font-[inherit] bg-white"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-[0.06em]">Lösenord</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minst 8 tecken"
                  required
                  autoComplete="new-password"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#5e35b1] focus:ring-4 focus:ring-[#5e35b114] outline-none transition text-[14px] font-[inherit] bg-white pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={17} color="#aeaeb2" /> : <Eye size={17} color="#aeaeb2" />}
                </button>
              </div>
              {password.length > 0 && password.length < 8 && (
                <p className="text-[11px] text-danger mt-1">Minst 8 tecken krävs</p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium" style={{ background: "#fff5f5", border: "1.5px solid #ffc0bc", color: "#ff3b30" }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff3b30" }} />
                {error}
              </div>
            )}

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
              {loading ? "Skapar konto..." : (
                <>
                  Skapa konto
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[12px] text-gray-400 font-medium">eller</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-[14px] text-text-muted text-center m-0 mb-8">
            Har du redan ett konto?{" "}
            <Link href="/login" className="font-bold no-underline hover:underline" style={{ color: "#5e35b1" }}>
              Logga in
            </Link>
          </p>

          <p className="text-[11px] text-text-disabled text-center">
            Stockholm Stad · Fastighetsförvaltning · 2026
          </p>
        </div>
      </div>
    </div>
  );
}