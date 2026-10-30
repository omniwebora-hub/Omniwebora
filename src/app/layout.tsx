import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import Script from "next/script";
import { Hanken_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientBoot } from "@/components/layout/ClientBoot";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/content/site";
import "./globals.css";

// Display serif: Newsreader's display cut (opsz 72) at weight 500 is the only instance the design
// uses, so it is self-hosted as one static 24 KB file instead of the 129 KB variable font.
// SIL Open Font License 1.1, see src/app/fonts/Newsreader-OFL.txt.
const newsreader = localFont({
  src: "./fonts/newsreader-display-500-latin.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: site.name, type: "website", locale: "en" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#faf8f3",
  width: "device-width",
  initialScale: 1,
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${hanken.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Marks JS availability before paint so progressive-enhancement styles never flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {/* Route changes dissolve between pages (globals.css "Page transitions"); browsers without the
              View Transitions API, and reduced motion, simply swap the page. */}
          <ViewTransition default="page">{children}</ViewTransition>
        </main>
        <Footer />
        <ClientBoot />
        <JsonLd data={organizationJsonLd()} />
        {plausibleDomain && (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
