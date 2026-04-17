import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Fastighet — Ärendesystem",
  description: "Felanmälan och fastighetsskötsel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}