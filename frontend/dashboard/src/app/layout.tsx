import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta", // Creamos una variable CSS
});

const inter = Inter({
  subsets: ["latin"],
});

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
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
