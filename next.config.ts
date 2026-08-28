import type { NextConfig } from "next";

/**
 * 🔥 MASI FAST RESULTS - Next.js Configuration
 * 
 * LOCAL DEVELOPMENT: Proxies API to localhost:8000
 * PRODUCTION (Vercel): Uses NEXT_PUBLIC_API_URL from environment
 */

// Determine backend URL
const getBackendUrl = (): string => {
  // 🔥 MUHIMU: Angalia NEXT_PUBLIC_API_URL kwanza
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  
  // For local development, use BACKEND_URL or default
  const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  return backend.replace(/\/$/, "");
};

const backendBase = getBackendUrl();

const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.NODE_ENV === "production";

console.log(`🔧 Next.js Config:`);
console.log(`   Environment: ${process.env.NODE_ENV}`);
console.log(`   Vercel: ${isVercel}`);
console.log(`   Backend URL: ${backendBase}`);

const nextConfig: NextConfig = {
  // 🔥 Images configuration - FIXED!
  images: {
    // ✅ REMOVE domains (deprecated)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
      {
        protocol: "https",
        hostname: "*.render.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // 🔥 Environment variables (available at build time)
  env: {
    NEXT_PUBLIC_API_URL: backendBase,
    NEXT_PUBLIC_IS_VERCEL: String(isVercel),
    NEXT_PUBLIC_IS_PRODUCTION: String(isProduction),
  },

  // 🔥 API Rewrites (ONLY for local development!)
  async rewrites() {
    // Skip rewrites in production (Vercel)
    if (isProduction || isVercel) {
      console.log("🚀 Production mode: Rewrites disabled");
      return [];
    }

    console.log("🔄 Development mode: Rewrites enabled");
    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/api/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
      {
        source: "/docs",
        destination: `${backendBase}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${backendBase}/openapi.json`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/api",
        destination: "/api/v1",
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  output: "standalone",

  compiler: {
    removeConsole: isProduction,
  },

  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;