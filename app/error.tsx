"use client";

import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sv">
      <body>
        <ErrorBoundary error={error} reset={reset} title="Ett kritiskt fel uppstod" />
      </body>
    </html>
  );
}