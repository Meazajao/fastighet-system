"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("VVS");
  const [priority, setPriority] = useState("MEDIUM");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, priority }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Något gick fel");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" />
          <span className="font-semibold text-gray-900">Fastighet</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Tillbaka
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Nytt ärende</h1>
          <p className="text-gray-500 text-sm mt-1">
            Beskriv felet så detaljerat som möjligt
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Rubrik
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="t.ex. Läckande kran i badrummet"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Prioritet
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-white"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Beskrivning
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beskriv problemet så detaljerat som möjligt..."
                required
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="flex-1 text-center border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Avbryt
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-50"
              >
                {loading ? "Skickar..." : "Skicka ärende"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}