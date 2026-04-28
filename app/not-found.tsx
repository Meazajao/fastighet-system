import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "#f8f8fc" }}>
      <div className="text-center max-w-120">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 8px 24px rgba(94,53,177,0.3)" }}
        >
          <span className="text-[32px] font-bold text-white">?</span>
        </div>

        <div
          className="text-[80px] font-bold tracking-[-4px] leading-none mb-4"
          style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          404
        </div>

        <h1 className="text-[22px] font-bold text-text-primary m-0 mb-3 tracking-[-0.4px]">
          Sidan hittades inte
        </h1>

        <p className="text-[14px] text-text-muted m-0 mb-8 leading-[1.6]">
          Sidan du letar efter finns inte eller har flyttats. Kontrollera adressen och försök igen.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold no-underline hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #5e35b1, #7c4dff)", boxShadow: "0 4px 12px rgba(94,53,177,0.3)" }}
          >
            Startsidan
          </Link>
          <Link
            href="/tickets/new"
            className="px-5 py-2.5 rounded-xl bg-card border border-border text-[13px] text-text-muted font-semibold no-underline hover:bg-background transition-colors"
          >
            Nytt ärende
          </Link>
        </div>
      </div>
    </div>
  );
}