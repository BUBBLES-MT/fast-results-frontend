import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ============================================================
// 🔥 METADATA - MASI FAST RESULTS
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "MASI FAST RESULTS",
    template: "%s | MASI FAST RESULTS"
  },
  description: "Fast and Accurate Results for Primary, Secondary, and Advanced Level schools in Tanzania",
  keywords: [
    "MASI FAST RESULTS", 
    "school management", 
    "education", 
    "LMS", 
    "school system", 
    "Tanzania",
    "student results",
    "fast results",
    "accurate results"
  ],
  authors: [{ name: "MASI FAST RESULTS" }],
  openGraph: {
    title: "MASI FAST RESULTS",
    description: "Fast and Accurate Results - School Management System",
    type: "website",
    url: "https://masifastresults.com",
    siteName: "MASI FAST RESULTS",
  },
  twitter: {
    card: "summary_large_image",
    title: "MASI FAST RESULTS",
    description: "Fast and Accurate Results for Schools",
  },
};

// ============================================================
// 🔥 VIEWPORT - MOBILE OPTIMIZED
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
};

// ============================================================
// 🔥 ROOT LAYOUT
// ============================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="application-name" content="MASI FAST RESULTS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MASI FAST RESULTS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
          {children}
        </div>
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}