"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href, label = "Tillbaka" }: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (href) router.push(href);
    else router.back();
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-[13px] text-text-muted font-medium bg-transparent border-none cursor-pointer p-0 mb-5 hover:text-primary transition-colors font-[inherit] group"
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary-bg"
        style={{ background: "#f5f5f7" }}
      >
        <ArrowLeft size={14} color="#6e6e73" />
      </div>
      {label}
    </button>
  );
}