import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Archivo } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FIT CHECK — Know Your Size In Every Brand",
    template: "%s — FIT CHECK",
  },
  description:
    "Cross-brand size conversion for India. Anchor once on your foot, chest or waist measurement — convert into Nike, Adidas, Levi's, Zara and 20+ more brands instantly.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable}`}>
      <body className="bg-ink font-body text-bone antialiased">
        <Nav />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
