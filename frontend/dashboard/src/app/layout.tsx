import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AC monitor APP",
  description: "Monitor your home AC temperature and humidity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="min-h-dvh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
