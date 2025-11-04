import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc-provider";
import { WebNetworkBackground } from "@/components/background/web-network";
import { Toaster } from "@/components/toaster";
import { SkipToContent } from "@/components/skip-to-content";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bloghub.vercel.app'),
  title: {
    default: "BlogHub - Modern Blogging Platform",
    template: "%s | BlogHub"
  },
  description: "Create, publish, and manage professional blog posts with markdown support, category organization, and real-time previews. Built with Next.js 15, tRPC, and PostgreSQL.",
  keywords: ["blogging platform", "content management", "markdown editor", "Next.js blog", "modern CMS"],
  authors: [{ name: "BlogHub Team" }],
  creator: "BlogHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloghub.vercel.app",
    title: "BlogHub - Modern Blogging Platform",
    description: "Professional blogging platform with markdown support and real-time previews",
    siteName: "BlogHub",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "BlogHub - Modern Blogging Platform"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogHub - Modern Blogging Platform",
    description: "Professional blogging platform with markdown support",
    images: ["/og-image.png"],
    creator: "@bloghub"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCProvider>
          <SkipToContent />
          <KeyboardShortcuts />
          <div className="app-shell">
            <div className="app-shell__background" aria-hidden="true">
              <div className="aurora-spot aurora-spot--one" />
              <div className="aurora-spot aurora-spot--two" />
              <div className="aurora-spot aurora-spot--three" />
              <div className="grid-overlay" />
              <WebNetworkBackground className="app-shell__web-network" />
            </div>
            <div className="app-shell__content" id="main-content">
              {children}
            </div>
          </div>
          <Toaster />
        </TRPCProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
