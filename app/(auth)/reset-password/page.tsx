"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Lösenordet måste vara minst 8 tecken");
      return;
    }

    if (password !== confirm) {
      setError("Lösenorden matchar inte");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex font-[inherit]">
      <div className="login-left w-[45%] relative overflow-hidden shrink-0" aria-hidden="true">
        <Image src="/login-bg.jpg" alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} priority quality={85} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(13,24,37,0.3) 0%, rgba(26,58,107,0.35) 50%, rgba(13,24,37,0.4) 100%)" }} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-accent z-10" />
        <div className="relative z-10 p-10 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3 self-start px-3 py-2" style={{ background: "rgba(13,24,37,0.75)", backdropFilter: "blur(4px)" }}>
            <div className="w-1 h-7 bg-sidebar-accent rounded-sm shrink-0" />
            <div>
              <div className="text-[15px] font-medium text-white">Fastighet</div>
              <div className="text-[9px] text-sidebar-inactive uppercase tracking-[0.6px] mt-0.5">Stockholm Stad</div>
            </div>
          </div>
          <div className="p-5" style={{ background: "rgba(13,24,37,0.72)", backdropFilter: "blur(4px)" }}>
            <h2 className="text-[22px] font-medium text-white m-0 mb-3 tracking-[-0.5px] leading-[1.3]">
              Återställ ditt lösenord
            </h2>
            <p className="text-[12px] text-[#c8dff0] m-0 leading-[1.7]">
              Välj ett nytt starkt lösenord för ditt konto.
            </p>
          </div>
          <div className="p-4" style={{ background: "rgba(13,24,37,0.75)", backdropFilter: "blur(4px)" }}>
            <div className="h-px bg-white/20 mb-4" />
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[26px] font-medium text-sidebar-accent tracking-[-1px]">98%</div>
                <div className="text-[10px] text-[#7da8d4] mt-1 uppercase tracking-[0.05em]">Lösta ärenden</div>
              </div>
              <div>
                <div className="text-[26px] font-medium text-white tracking-[-1px]">&lt;48h</div>
                <div className="text-[10px] text-[#7da8d4] mt-1 uppercase tracking-[0.05em]">Svarstid</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-background flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-95">
          {success ? (
            <div>
              <div className="w-12 h-12 bg-success-light border border-success flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0f6e56">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h1 className="text-[22px] font-medium text-text-primary m-0 mb-2 tracking-[-0.4px]">
                Lösenord uppdaterat
              </h1>
              <p className="text-[13px] text-text-muted m-0 mb-6">
                Ditt lösenord har uppdaterats. Du kan nu logga in med ditt nya lösenord.
              </p>
              <Link
                href="/login"
                className="block w-full py-2.5 bg-sidebar text-white text-[11px] font-medium uppercase tracking-[0.4px] text-center no-underline hover:bg-sidebar-dark transition-colors"
              >
                Gå till inloggning
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h1 className="text-[22px] font-medium text-text-primary m-0 mb-1.5 tracking-[-0.4px]">
                  Nytt lösenord
                </h1>
                <p className="text-[13px] text-text-muted m-0">
                  Välj ett nytt lösenord för ditt konto
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
                <div>
                  <label htmlFor="password" className="block text-[9px] font-medium text-text-muted mb-1.5 uppercase tracking-widest">
                    Nytt lösenord
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minst 8 tecken"
                    required
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 bg-card border border-border border-l-[3px] border-l-sidebar text-[12px] text-text-primary outline-none font-[inherit]"
                  />
                  {password.length > 0 && password.length < 8 && (
                    <p className="text-[9px] text-danger mt-1">Minst 8 tecken krävs</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-[9px] font-medium text-text-muted mb-1.5 uppercase tracking-widest">
                    Bekräfta lösenord
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 bg-card border border-border border-l-[3px] border-l-sidebar text-[12px] text-text-primary outline-none font-[inherit]"
                  />
                  {confirm.length > 0 && password !== confirm && (
                    <p className="text-[9px] text-danger mt-1">Lösenorden matchar inte</p>
                  )}
                </div>

                {error && (
                  <div role="alert" aria-live="polite" className="bg-danger-light border border-danger-border border-l-[3px] border-l-danger px-3 py-2.5 text-[12px] text-danger">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 bg-sidebar text-white text-[11px] font-medium uppercase tracking-[0.4px] border-none font-[inherit] mt-1 ${
                    loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-sidebar-dark transition-colors"
                  }`}
                >
                  {loading ? "Sparar..." : "Spara nytt lösenord"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/login" className="text-[12px] text-accent no-underline hover:underline">
                  Tillbaka till inloggning
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}