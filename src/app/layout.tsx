import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/data/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import EsmiChatLoader from "@/components/EsmiChatLoader";

/**
 * Self-hosted rather than pulled from `next/font/google`, because Google's
 * `latin` subsets of these three faces came to 86 KB — all of it preloaded, all
 * of it ahead of the hero still, which is the page's largest paint. Cut to the
 * characters this site sets and to the 400–700 weights it uses, the same three
 * faces are 40 KB. See scripts/subset-fonts.py; both families are OFL.
 */
const anton = localFont({
  src: "./fonts/anton-latin.woff2",
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});

const archivo = localFont({
  src: [
    { path: "./fonts/archivo-latin.woff2", weight: "400 700", style: "normal" },
    // Italics are only ever set at 400, so this face is a static instance.
    {
      path: "./fonts/archivo-italic-latin.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Premium Latino barbershop in Toronto and North York — Weston Rd & Keele St. Expert fades, beard trims, kids' cuts. Walk-ins always welcome. English & Spanish.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      "Two barbershop locations. Expert fades. Walk-ins always welcome. Weston Rd (Toronto) & Keele St (North York).",
    url: site.url,
    siteName: site.name,
    locale: "en_CA",
    type: "website",
    images: [{ url: "/images/og-social.jpg", width: 1200, height: 1200 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0f12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${anton.variable} ${archivo.variable} h-full antialiased`}
    >
      <head>
        {/* Hero LCP: start the still as soon as the head is parsed. Only the
            AVIF is preloaded — preloading the WebP too would make every
            AVIF-capable browser fetch both; clients without AVIF pick it up
            from the <picture> at the very top of the document. */}
        <link
          rel="preload"
          as="image"
          href="/media/hero-poster.avif"
          type="image/avif"
          fetchPriority="high"
        />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-cream">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-red focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <EsmiChatLoader />
      </body>
    </html>
  );
}
