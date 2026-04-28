import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Logga in | Fastighet",
    template: "%s | Fastighet",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}