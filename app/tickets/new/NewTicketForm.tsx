"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

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
    if (title.length < 3) { toast.error("Rubriken måste vara minst 3 tecken"); return; }
    if (description.length < 10) { toast.error("Beskrivningen måste vara minst 10 tecken"); return; }

    setLoading(true);
    const loadingToast = toast.loading("Skickar ärende...");
    let imageUrl = null;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      const uploadRes = await fetch("/api/storage/upload", { method: "POST", body: formData });
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
    router.push("/tickets");
  }

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-xl text-[13px] text-text-primary outline-none font-[inherit] focus:border-primary transition-colors";
  const labelClass = "block text-[12px] font-semibold text-text-secondary mb-2";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Grundinfo */}
      <div
        className="bg-card rounded-2xl border border-border overflow-hidden"
        style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="px-6 py-4 border-b border-border">
          <span className="text-[14px] font-bold text-text-primary">Grundinformation</span>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className={labelClass}>Rubrik</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="t.ex. Läckande kran i badrummet"
              required
              className={inputClass}
            />
            {title.length > 0 && title.length < 3 && (
              <p className="text-[11px] text-danger mt-1.5">Minst 3 tecken krävs</p>
            )}
          </div>

          <div className="form-grid-2 grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Prioritet</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Beskrivning</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskriv problemet så detaljerat som möjligt — när det uppstod, hur ofta det händer och eventuella konsekvenser."
              required
              rows={5}
              className={`${inputClass} resize-none leading-[1.7]`}
            />
            {description.length > 0 && description.length < 10 && (
              <p className="text-[11px] text-danger mt-1.5">Minst 10 tecken krävs</p>
            )}
          </div>
        </div>
      </div>

      {/* Bild */}
      <div
        className="bg-card rounded-2xl border border-border overflow-hidden"
        style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="px-6 py-4 border-b border-border">
          <span className="text-[14px] font-bold text-text-primary">Bifoga bild</span>
          <span className="text-[12px] text-text-muted ml-2">(valfritt)</span>
        </div>
        <div className="p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
            style={{ background: "#f8f8fc" }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Förhandsvisning"
                className="max-h-50 mx-auto block object-cover rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "#f3f0ff" }}
                >
                  <Upload size={20} color="#5e35b1" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-text-primary m-0 mb-1">
                    Klicka för att ladda upp
                  </p>
                  <p className="text-[12px] text-text-muted m-0">
                    PNG, JPG upp till 10MB
                  </p>
                </div>
              </div>
            )}
          </label>
          {imagePreview && (
            <button
              type="button"
              onClick={() => { setImage(null); setImagePreview(null); }}
              className="mt-3 flex items-center gap-1.5 text-[12px] text-danger bg-transparent border-none cursor-pointer p-0 font-medium font-[inherit]"
            >
              <X size={13} />
              Ta bort bild
            </button>
          )}
        </div>
      </div>

      {/* Knappar */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.push("/tickets")}
          className="px-5 py-2.5 bg-card border border-border rounded-xl text-[13px] text-text-muted font-semibold cursor-pointer hover:bg-background transition-colors font-[inherit]"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold border-none font-[inherit] ${
            loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90 transition-opacity"
          }`}
          style={{
            background: "linear-gradient(135deg, #5e35b1, #7c4dff)",
            boxShadow: loading ? "none" : "0 4px 12px rgba(94,53,177,0.3)",
          }}
        >
          {loading ? "Skickar..." : "Skicka ärende"}
        </button>
      </div>
    </form>
  );
}