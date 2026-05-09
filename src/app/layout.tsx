import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Augle — Augmented Deliberation",
  description: "AI-powered prediction market research and deliberation platform",
  icons: {
    icon: "/fav.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary min-h-screen">{children}</body>
    </html>
  );
}
