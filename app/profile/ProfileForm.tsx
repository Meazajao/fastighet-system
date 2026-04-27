"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { User, Lock, Eye, EyeOff } from "lucide-react";

interface ProfileFormProps {
  userId: string;
  initialName: string;
  initialApartment: string;
  email: string;
  role: string;
}

export default function ProfileForm({
  userId,
  initialName,
  initialApartment,
  email,
  role,
}: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [apartment, setApartment] = useState(initialApartment);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) { toast.error("Namnet måste vara minst 2 tecken"); return; }
    setLoadingProfile(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), apartment: apartment.trim() }),
    });
    if (res.ok) { toast.success("Profilen har uppdaterats"); router.refresh(); }
    else { const data = await res.json(); toast.error(data.error || "Något gick fel"); }
    setLoadingProfile(false);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) { toast.error("Lösenordet måste vara minst 8 tecken"); return; }
    if (newPassword !== confirmPassword) { toast.error("Lösenorden matchar inte"); return; }
    setLoadingPassword(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
    if (signInError) { toast.error("Nuvarande lösenord är felaktigt"); setLoadingPassword(false); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { toast.error(error.message); }
    else {
      toast.success("Lösenordet har uppdaterats");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoadingPassword(false);
  }

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#5e35b1] focus:ring-4 focus:ring-[#5e35b114] outline-none transition text-[14px] font-[inherit] bg-white";
  const labelClass = "block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-[0.06em]";

  return (
    <div className="flex flex-col gap-5">

      {/* Avatar + info */}
      <div
        className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center gap-5"
        style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 4px 16px rgba(94,53,177,0.3)" }}
        >
          <span className="text-[22px] font-extrabold text-white">
            {name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </span>
        </div>
        <div>
          <div className="text-[18px] font-extrabold text-text-primary tracking-[-0.4px] mb-0.5">{name}</div>
          <div className="text-[13px] text-text-muted">{email}</div>
          {apartment && <div className="text-[13px] text-text-muted">Lgh {apartment}</div>}
          <div
            className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold"
            style={{ background: "#f3f0ff", color: "#5e35b1" }}
          >
            {role === "ADMIN" ? "Admin" : "Hyresgäst"}
          </div>
        </div>
      </div>

      {/* Personuppgifter */}
      <div
        className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#f3f0ff" }}>
            <User size={15} color="#5e35b1" />
          </div>
          <span className="text-[15px] font-bold text-text-primary">Personuppgifter</span>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className={inputClass}
              />
              {name.length > 0 && name.length < 2 && (
                <p className="text-[11px] text-danger mt-1">Minst 2 tecken krävs</p>
              )}
            </div>
            {role !== "ADMIN" && (
              <div>
                <label className={labelClass}>Lägenhetsnummer</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="t.ex. Lgh 2B"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>E-postadress</label>
            <div
              className="w-full px-5 py-4 rounded-2xl text-[14px] text-text-disabled"
              style={{ background: "#f8f8fc", border: "1.5px solid #ebebf0" }}
            >
              {email}
            </div>
            <p className="text-[11px] text-text-disabled mt-1.5">E-postadressen kan inte ändras</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingProfile}
              className={`px-6 py-3 rounded-2xl text-white text-[14px] font-bold border-none font-[inherit] flex items-center gap-2 transition-all ${
                loadingProfile ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
              }`}
              style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: loadingProfile ? "none" : "0 4px 16px rgba(94,53,177,0.3)" }}
            >
              {loadingProfile ? "Sparar..." : "Spara ändringar"}
            </button>
          </div>
        </form>
      </div>

      {/* Lösenord */}
      <div
        className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#f3f0ff" }}>
            <Lock size={15} color="#5e35b1" />
          </div>
          <span className="text-[15px] font-bold text-text-primary">Ändra lösenord</span>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 flex flex-col gap-4" noValidate>
          <div>
            <label className={labelClass}>Nuvarande lösenord</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className={`${inputClass} pr-12`}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1">
                {showCurrent ? <EyeOff size={17} color="#aeaeb2" /> : <Eye size={17} color="#aeaeb2" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nytt lösenord</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minst 8 tecken"
                  required
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1">
                  {showNew ? <EyeOff size={17} color="#aeaeb2" /> : <Eye size={17} color="#aeaeb2" />}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-[11px] text-danger mt-1">Minst 8 tecken krävs</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Bekräfta lösenord</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className={inputClass}
              />
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-[11px] text-danger mt-1">Lösenorden matchar inte</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingPassword}
              className={`px-6 py-3 rounded-2xl text-white text-[14px] font-bold border-none font-[inherit] flex items-center gap-2 transition-all ${
                loadingPassword ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
              }`}
              style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: loadingPassword ? "none" : "0 4px 16px rgba(94,53,177,0.3)" }}
            >
              {loadingPassword ? "Uppdaterar..." : "Uppdatera lösenord"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}