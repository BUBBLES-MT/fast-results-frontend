// app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { PWAPrompt } from "@/components/pwa/PWAPrompt";
import { PWABanner } from "@/components/pwa/PWABanner";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ============================================================
// 🔥 METADATA - MASI FAST RESULTS (INTERNATIONAL)
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "MASI FAST RESULTS",
    template: "%s | MASI FAST RESULTS"
  },
  description: "Fast and Accurate Results for Primary, Secondary, and Advanced Level schools in Tanzania and beyond",
  keywords: [
    "MASI FAST RESULTS", 
    "school management", 
    "education", 
    "LMS", 
    "school system", 
    "Tanzania",
    "student results",
    "fast results",
    "accurate results",
    "education management",
    "school results",
    "academic tracking",
    "teacher dashboard",
    "parent portal"
  ],
  authors: [{ name: "MASI FAST RESULTS", url: "https://masifastresults.com" }],
  creator: "MASI FAST RESULTS",
  publisher: "MASI FAST RESULTS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MASI FAST RESULTS - School Management System",
    description: "Fast and Accurate Results - The ultimate school management system for Primary, Secondary, and Advanced Level schools",
    type: "website",
    url: "https://masifastresults.com",
    siteName: "MASI FAST RESULTS",
    locale: "sw_TZ",
    alternateLocale: ["en_US", "en_GB"],
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MASI FAST RESULTS - School Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MASI FAST RESULTS - School Management System",
    description: "Fast and Accurate Results for Schools",
    images: ["/og-image.jpg"],
    creator: "@masifastresults",
    site: "@masifastresults",
  },
  alternates: {
    canonical: "https://masifastresults.com",
    languages: {
      "sw": "https://masifastresults.com/sw",
      "en": "https://masifastresults.com/en",
    },
  },
  category: "Education",
  classification: "School Management System",
  // 🔥 PWA MANIFEST
  manifest: "/manifest.json",
  // 🔥 APPLE PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MASI FAST RESULTS",
  },
  // 🔥 ICONS
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },
  // 🔥 OTHER
  verification: {
    google: "google-site-verification-code",
  },
  other: {
    "msapplication-TileColor": "#0ea5e9",
    "msapplication-tap-highlight": "no",
    "application-name": "MASI FAST RESULTS",
  },
};

// ============================================================
// 🔥 VIEWPORT - MOBILE OPTIMIZED + PWA
// ============================================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0284c7" },
  ],
  // 🔥 PWA VIEWPORT
  viewportFit: "cover",
};

// ============================================================
// 🔥 ROOT LAYOUT - INTERNATIONAL + PWA
// ============================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="sw" 
      suppressHydrationWarning 
      data-scroll-behavior="smooth"
    >
      <head>
        {/* 🔥 BASIC META */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 🔥 PWA MANIFEST */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* 🔥 PWA META TAGS */}
        <meta name="application-name" content="MASI FAST RESULTS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MASI FAST RESULTS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* 🔥 THEME COLOR */}
        <meta name="theme-color" content="#0ea5e9" />
        
        {/* 🔥 OPEN GRAPH - INTERNATIONAL */}
        <meta property="og:locale" content="sw_TZ" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_GB" />
        <meta property="og:site_name" content="MASI FAST RESULTS" />
        <meta property="og:type" content="website" />
        
        {/* 🔥 TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@masifastresults" />
        <meta name="twitter:site" content="@masifastresults" />
        
        {/* 🔥 PWA SERVICE WORKER REGISTRATION */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('✅ Service Worker registered successfully:', registration);
                    })
                    .catch(function(error) {
                      console.log('❌ Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body 
        className={`${inter.className} antialiased`} 
        suppressHydrationWarning
      >
        {/* 🔥 PWA BANNER - Juu ya ukurasa (wapya tu!) */}
        <PWABanner />
        
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {children}
        </div>
        
        {/* 🔥 TOASTERS */}
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
        
        {/* 🔥 PWA PROMPT - Popup ya kuinstall app (wapya tu!) */}
        <PWAPrompt />
      </body>
    </html>
  );
}