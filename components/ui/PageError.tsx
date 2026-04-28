"use client";

import { useEffect } from "react";

interface PageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PageError({ error, reset }: PageErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="app-layout flex min-h-screen">
      <div className="sidebar w-55 min-h-screen bg-sidebar shrink-0" />
      <main className="main-content flex-1 bg-background flex items-center justify-center p-8">
        <div className="text-center max-w-120">
          <div className="w-12 h-12 bg-danger-light border border-danger-border rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#a32d2d">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>

          <h2 className="text-[18px] font-medium text-text-primary m-0 mb-2 tracking-[-0.3px]">
            Sidan kunde inte laddas
          </h2>
          <p className="text-[12px] text-text-muted m-0 mb-6 leading-[1.6]">
            Ett fel uppstod. Försök igen eller kontakta support om problemet kvarstår.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="bg-danger-light border border-danger-border px-4 py-3 mb-6 text-left">
              <p className="text-[9px] font-medium text-danger m-0 mb-1 uppercase tracking-[0.05em]">Dev error</p>
              <p className="text-[11px] text-danger m-0 font-mono break-all">{error.message}</p>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-sidebar text-white text-[11px] font-medium uppercase tracking-[0.3px] border-none cursor-pointer hover:bg-sidebar-dark transition-colors font-[inherit]"
            >
              Försök igen
            </button>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="px-4 py-2 bg-card border border-border text-[11px] text-text-muted font-medium uppercase tracking-[0.3px] cursor-pointer hover:bg-background transition-colors font-[inherit]"
            >
              Startsidan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}