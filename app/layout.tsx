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

export const metadata: Metadata = {
  title: {
    default: "School Management System",
    template: "%s | School Management System"
  },
  description: "Multi-tenant school management system for Primary, Secondary, and Advanced Level schools",
  keywords: ["school management", "education", "LMS", "school system", "Tanzania"],
  authors: [{ name: "School Management System" }],
  openGraph: {
    title: "School Management System",
    description: "Multi-tenant school management system for Primary, Secondary, and Advanced Level schools",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}