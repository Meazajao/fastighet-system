import Link from "next/link";

export default function Footer() {
  return (
    <div className="border-t border-border bg-card px-8 py-4 flex items-center justify-between flex-wrap gap-3 mt-auto">
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)" }}
        >
          <div className="w-2 h-2 bg-white rounded-sm" />
        </div>
        <span className="text-[11px] font-semibold text-text-muted">
          Fastighet · Stockholm Stad
        </span>
      </div>

      <div className="flex gap-5">
        <Link href="/about" className="text-[11px] text-text-muted no-underline hover:text-primary transition-colors font-medium">
          Om systemet
        </Link>
        <Link href="/contact" className="text-[11px] text-text-muted no-underline hover:text-primary transition-colors font-medium">
          Kontakt & support
        </Link>
        <Link href="/privacy" className="text-[11px] text-text-muted no-underline hover:text-primary transition-colors font-medium">
          Integritetspolicy
        </Link>
      </div>

      <span className="text-[11px] text-text-disabled">© 2026</span>
    </div>
  );
}