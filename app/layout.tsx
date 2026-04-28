import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fastighet — Stockholm Stad",
    template: "%s · Fastighet",
  },
  description: "Ärendehanteringssystem för fastigheter i Stockholm Stad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), -apple-system, sans-serif" }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "13px",
              borderRadius: "12px",
              border: "1px solid #ebebf0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}