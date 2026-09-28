import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { getFirebaseConfig } from "@/lib/firebase/app";
import { CONFIG_ELEMENT_ID } from "@/lib/firebase/configElement";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const DESCRIPTION =
  "Brands disagree on what a UK 8 is. Fit Check anchors your size to one body measurement and reads it back in every brand's own chart — Nike, Adidas, Levi's, Zara, Uniqlo and more, for India.";

export const metadata: Metadata = {
  title: {
    default: "Fit Check — your size in every brand",
    template: "%s · Fit Check",
  },
  description: DESCRIPTION,
  icons: [{ url: "/logo.svg", type: "image/svg+xml" }],
  openGraph: {
    title: "Fit Check — your size in every brand",
    description: DESCRIPTION,
    type: "website",
    locale: "en_IN",
    siteName: "Fit Check",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const firebaseConfig = getFirebaseConfig();
  return (
    <html lang="en-IN" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="bg-ink font-body text-bone antialiased">
        {firebaseConfig && (
          <script
            id={CONFIG_ELEMENT_ID}
            type="application/json"
            // Public identifiers only — see src/lib/firebase/app.ts.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(firebaseConfig) }}
          />
        )}
        <a
          href="#main"
          className="kicker sr-only z-50 bg-signal px-4 py-3 text-bone focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main" className="pt-14">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
