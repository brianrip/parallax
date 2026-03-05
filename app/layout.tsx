import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parallax — Same event. Every angle.",
  description:
    "Dual-source news intelligence. Formal journalism bias-rated across the spectrum. Live X discourse and breaking signals. Side by side.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-[family-name:var(--font-inter)] antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
