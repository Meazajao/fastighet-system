"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { theme } from "@/lib/theme";

const CATEGORIES = [
  { value: "VVS", label: "VVS (vatten, avlopp)" },
  { value: "EL", label: "El" },
  { value: "VENTILATION", label: "Ventilation" },
  { value: "HISS", label: "Hiss" },
  { value: "LAUNDRY", label: "Tvättstuga" },
  { value: "EXTERIOR", label: "Yttre miljö" },
  { value: "OTHER", label: "Övrigt" },
];

const PRIORITIES = [
  { value: "LOW", label: "Låg" },
  { value: "MEDIUM", label: "Normal" },
  { value: "HIGH", label: "Hög" },
  { value: "URGENT", label: "Akut" },
];

export default function NewTicketForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("VVS");
  const [priority, setPriority] = useState("MEDIUM");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Bilden får inte vara större än 10MB");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.length < 3) {
      toast.error("Rubriken måste vara minst 3 tecken");
      return;
    }
    if (description.length < 10) {
      toast.error("Beskrivningen måste vara minst 10 tecken");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Skickar ärende...");

    let imageUrl = null;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.dismiss(loadingToast);
        toast.error(uploadData.error || "Kunde inte ladda upp bilden");
        setLoading(false);
        return;
      }

      imageUrl = uploadData.path;
    }

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, priority, imageUrl }),
    });

    toast.dismiss(loadingToast);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Något gick fel");
      setLoading(false);
      return;
    }

    toast.success("Ärendet har skickats in");
    router.push("/dashboard");
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: theme.colors.background,
    border: "1px solid #e2e8f0",
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
    <div style={{ background: theme.colors.card, border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.lg, padding: "28px" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={labelStyle}>RUBRIK</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="t.ex. Läckande kran i badrummet"
            required
            style={inputStyle}
          />
          {title.length > 0 && title.length < 3 && (
            <p style={{ fontSize: "11px", color: theme.colors.danger, margin: "4px 0 0" }}>
              Minst 3 tecken krävs
            </p>
          )}
        </div>

        <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>KATEGORI</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>PRIORITET</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>BESKRIVNING</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beskriv problemet så detaljerat som möjligt..."
            required
            rows={5}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.7 }}
          />
          {description.length > 0 && description.length < 10 && (
            <p style={{ fontSize: "11px", color: theme.colors.danger, margin: "4px 0 0" }}>
              Minst 10 tecken krävs
            </p>
          )}
        </div>

        <div>
          <label style={labelStyle}>BIFOGA BILD (VALFRITT)</label>
          <div style={{ border: "2px dashed #e2e8f0", borderRadius: theme.borderRadius.md, padding: "24px", textAlign: "center", cursor: "pointer" }}>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="image-upload" />
            <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Förhandsvisning" style={{ maxHeight: "200px", margin: "0 auto", borderRadius: "8px", objectFit: "cover", display: "block" }} />
              ) : (
                <div>
                  <p style={{ fontSize: "14px", color: theme.colors.textMuted, margin: "0 0 4px" }}>Klicka för att ladda upp</p>
                  <p style={{ fontSize: "12px", color: "#cbd5e1", margin: 0 }}>PNG, JPG upp till 10MB</p>
                </div>
              )}
            </label>
          </div>
          {imagePreview && (
            <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} style={{ fontSize: "12px", color: theme.colors.danger, background: "none", border: "none", cursor: "pointer", marginTop: "8px", padding: 0 }}>
              Ta bort bild
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #e2e8f0", borderRadius: theme.borderRadius.md, fontSize: "14px", fontWeight: 600, color: theme.colors.textSecondary, cursor: "pointer" }}
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 1, padding: "12px", background: loading ? "#7dd3fc" : theme.colors.accent, border: "none", borderRadius: theme.borderRadius.md, fontSize: "14px", fontWeight: 600, color: "#fff", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Skickar..." : "Skicka ärende"}
          </button>
        </div>
      </form>
    </div>
  );
}