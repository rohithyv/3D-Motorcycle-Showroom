import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "VOLT R1 — Silence. Accelerated.",
  description:
    "A new kind of electric. Explore the VOLT R1 electric motorcycle and make it your own.",
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
