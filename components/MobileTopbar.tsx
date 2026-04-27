"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface MobileTopbarProps {
  title: string;
  backHref?: string;
  name?: string;
}

export default function MobileTopbar({ title, backHref, name }: MobileTopbarProps) {
  return (
    <div className="mobile-topbar hidden fixed top-0 left-0 right-0 z-100 px-4 h-14 items-center justify-between gap-3 bg-white border-b border-gray-100"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="w-8 h-8 rounded-xl flex items-center justify-center no-underline"
            style={{ background: "#f3f0ff" }}
          >
            <ArrowLeft size={16} color="#5e35b1" />
          </Link>
        ) : (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}
          >
            <div className="w-3.5 h-3.5 bg-white rounded-sm" />
          </div>
        )}
        <span className="text-[15px] font-bold text-text-primary tracking-[-0.3px]">
          {title}
        </span>
      </div>

      {name && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}
        >
          <span className="text-[11px] font-bold text-white">
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  );
}