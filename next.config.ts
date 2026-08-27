import type { NextConfig } from "next";

/**
 * 🔥 MASI FAST RESULTS - Next.js Configuration
 * 
 * LOCAL DEVELOPMENT: Proxies API to localhost:8000
 * PRODUCTION (Vercel): Uses NEXT_PUBLIC_API_URL from environment
 */

// Determine backend URL
// Priority: NEXT_PUBLIC_API_URL > BACKEND_URL > localhost:8000
const getBackendUrl = (): string => {
  // For production (Vercel), use NEXT_PUBLIC_API_URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  
  // For local development, use BACKEND_URL or default
  const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  return backend.replace(/\/$/, "");
};

const backendBase = getBackendUrl();

// Determine if running on Vercel (production)
const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.NODE_ENV === "production";

console.log(`🔧 Next.js Config:`);
console.log(`   Environment: ${process.env.NODE_ENV}`);
console.log(`   Vercel: ${isVercel}`);
console.log(`   Backend URL: ${backendBase}`);

const nextConfig: NextConfig = {
  // 🔥 Images configuration
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "*.vercel.app",
      "*.render.com",
      "*.supabase.co",
      "*.cloudinary.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
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
    // Instead, frontend will use NEXT_PUBLIC_API_URL directly
    if (isProduction || isVercel) {
      console.log("🚀 Production mode: Rewrites disabled");
      return [];
    }

    console.log("🔄 Development mode: Rewrites enabled");
    return [
      {
        source: "/api/:path*",  // Also catch /api/* (without /v1)
        destination: `${backendBase}/api/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
      // Add specific routes if needed
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

  // 🔥 Redirects (optional)
  async redirects() {
    return [
      {
        source: "/api",
        destination: "/api/v1",
        permanent: false,
      },
    ];
  },

  // 🔥 Headers for security
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

  // 🔥 Output configuration for Vercel
  output: "standalone",  // For better Vercel deployment

  // 🔥 Compiler options
  compiler: {
    removeConsole: isProduction,  // Remove console.log in production
  },

  // 🔥 Powered by header
  poweredByHeader: false,

  // 🔥 React strict mode
  reactStrictMode: true,

  // 🔥 SWC minification
  //swcMinify: true,

  // 🔥 Trailing slashes
  trailingSlash: false,

  // 🔥 Experimental features
  experimental: {
    // optimizeCss: true,  // Uncomment if needed
    // serverActions: true, // For Next.js 14+
  },
};

export default nextConfig;