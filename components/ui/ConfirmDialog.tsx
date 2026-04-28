"use client";

import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Bekräfta",
  cancelLabel = "Avbryt",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = {
    danger: {
      icon: <AlertCircle size={20} color="#ff3b30" />,
      iconBg: "#fff5f5",
      btnBg: "linear-gradient(135deg, #ff3b30, #ff6b6b)",
      btnShadow: "0 4px 12px rgba(255,59,48,0.3)",
    },
    warning: {
      icon: <AlertTriangle size={20} color="#f5a623" />,
      iconBg: "#fff9e6",
      btnBg: "linear-gradient(135deg, #f5a623, #ffc107)",
      btnShadow: "0 4px 12px rgba(245,166,35,0.3)",
    },
    default: {
      icon: <Info size={20} color="#5e35b1" />,
      iconBg: "#f3f0ff",
      btnBg: "linear-gradient(135deg, #5e35b1, #7c4dff)",
      btnShadow: "0 4px 12px rgba(94,53,177,0.3)",
    },
  };

  const c = config[variant];

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{ background: "rgba(26,26,46,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="bg-card w-full max-w-100 rounded-2xl overflow-hidden border border-border"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: c.iconBg }}
          >
            {c.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-[16px] font-bold text-text-primary m-0 mb-1 tracking-[-0.3px]">
              {title}
            </h2>
            <p className="text-[13px] text-text-muted m-0 leading-[1.6]">
              {description}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer shrink-0"
            style={{ background: "#f5f5f7" }}
          >
            <X size={14} color="#6e6e73" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end border-t border-border pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-card border border-border rounded-xl text-[13px] text-text-muted font-semibold cursor-pointer hover:bg-background transition-colors font-[inherit]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-white text-[13px] font-semibold cursor-pointer border-none rounded-xl font-[inherit]"
            style={{ background: c.btnBg, boxShadow: c.btnShadow }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}