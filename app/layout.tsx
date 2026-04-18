import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Fastighet — Ärendehantering",
    template: "%s | Fastighet",
  },
  description: "Internt ärendehanteringssystem för fastighetsförvaltning. Hantera felanmälningar, kommunicera med hyresgäster och följ upp ärenden.",
  keywords: ["fastighet", "ärendehantering", "felanmälan", "hyresgäst"],
  authors: [{ name: "Fastighet AB" }],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Fastighet — Ärendehantering",
    description: "Internt ärendehanteringssystem",
    type: "website",
    locale: "sv_SE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#111827",
            },
          }}
        />
      </body>
    </html>
  );
}