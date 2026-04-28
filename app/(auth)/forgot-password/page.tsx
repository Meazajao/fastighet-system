"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Något gick fel"); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex bg-[#fafaff]">

      {/* Left panel */}
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
              Inget att oroa sig för
            </h2>
            <p className="text-sm opacity-80">
              Vi hjälper dig att komma åt ditt konto igen på nolltid.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-105">

          {sent ? (
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 8px 24px rgba(94,53,177,0.3)" }}
              >
                <Mail size={32} color="#fff" />
              </div>
              <h1 className="text-[32px] font-extrabold text-text-primary tracking-[-1.5px] mb-3">
                Mail skickat!
              </h1>
              <p className="text-[15px] text-text-muted mb-4 leading-[1.6]">
                Om <strong>{email}</strong> finns registrerat skickas en återställningslänk inom några minuter. Kolla även skräpposten.
              </p>
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white text-[15px] font-bold no-underline hover:opacity-90 transition-all mt-4"
                style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 8px 28px rgba(94,53,177,0.4)" }}
              >
                <ArrowLeft size={18} />
                Tillbaka till inloggning
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #5e35b1, #7c4dff)" }} />
                  <span className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.08em]">Återställ lösenord</span>
                </div>
                <h1 className="text-[38px] font-extrabold text-text-primary tracking-[-2px] leading-[1.1] mb-3">
                  Glömt ditt<br />
                  <span style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    lösenord?
                  </span>
                </h1>
                <p className="text-[15px] text-text-muted leading-[1.6]">
                  Inga problem — ange din e-post så skickar vi en återställningslänk direkt.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                <div>
                  <label className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-[0.06em]">
                    E-postadress
                  </label>
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
                    loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90 hover:scale-[1.01]"
                  }`}
                  style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: loading ? "none" : "0 8px 28px rgba(94,53,177,0.45)" }}
                >
                  {loading ? "Skickar..." : (
                    <>
                      Skicka återställningslänk
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-[13px] font-semibold no-underline hover:underline"
                  style={{ color: "#5e35b1" }}
                >
                  <ArrowLeft size={14} />
                  Tillbaka till inloggning
                </Link>
              </div>

              <p className="text-[11px] text-text-disabled text-center mt-8">
                Stockholm Stad · 2026
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}