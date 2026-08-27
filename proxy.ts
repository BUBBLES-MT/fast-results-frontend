import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================
// 🔥 PUBLIC PATHS - No authentication required
// ============================================================
const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];

// Pages that Superadmin is allowed to access
const SUPERADMIN_ALLOWED_PATHS = ["/superadmin", "/login", "/api/auth/logout"];

// School pages that require authentication
const SCHOOL_PATHS = [
  "/secondary/dashboard",
  "/secondary/students",
  "/secondary/teachers", 
  "/secondary/classes", 
  "/secondary/subjects", 
  "/secondary/marks", 
  "/secondary/reports", 
  "/secondary/ai-exam", 
  "/secondary/top-students",
  "/secondary/promote",
  "/secondary/past-papers",
  "/secondary/classes-streams",
  "/secondary/academic/unassigned",
  "/primary/dashboard",
  "/primary/students",
  "/primary/teachers",
  "/primary/classes",
  "/primary/subjects",
  "/primary/marks",
  "/primary/reports",
  "/primary/ai-exam",
  "/primary/top-students",
  "/primary/promote",
  "/advanced/dashboard",
];

// ✅ MUHIMU: Function inaitwa "proxy"
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get("token")?.value;
  const userType = request.cookies.get("user_type")?.value;
  const schoolLevel = request.cookies.get("school_level")?.value;
  
  console.log(`🔐 PROXY: ${pathname} | userType: ${userType} | token: ${!!token} | schoolLevel: ${schoolLevel}`);

  // ============================================================
  // 🔥 CASE 0: PUBLIC PATHS - Allow access without authentication
  // ============================================================
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path);
  
  if (isPublicPath) {
    console.log(`🌐 PUBLIC ACCESS allowed: ${pathname}`);
    return NextResponse.next();
  }

  // ============================================================
  // CASE 1: No token - redirect to homepage
  // ============================================================
  if (!token) {
    console.log(`🔴 No token, redirecting to homepage: ${pathname}`);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ============================================================
  // CASE 2: Superadmin access control
  // ============================================================
  const isSuperadmin = userType === "superadmin" || userType === "Superadmin";

  if (isSuperadmin) {
    const isSchoolPath = SCHOOL_PATHS.some(path => pathname.startsWith(path));
    const isAllowedPath = SUPERADMIN_ALLOWED_PATHS.some(path => pathname.startsWith(path));
    
    if (isAllowedPath) {
      console.log(`👑 SUPERADMIN allowed: ${pathname}`);
      return NextResponse.next();
    }
    
    if (isSchoolPath) {
      console.log(`🔴 SUPERADMIN BLOCKED from school page: ${pathname} → redirecting to /superadmin`);
      return NextResponse.redirect(new URL("/superadmin", request.url));
    }
    
    console.log(`👑 SUPERADMIN accessing: ${pathname}`);
    return NextResponse.next();
  }

  // ============================================================
  // CASE 3: Regular user trying to access /superadmin - BLOCK!
  // ============================================================
  if (userType && !isSuperadmin && pathname.startsWith("/superadmin")) {
    console.log(`🔴 REGULAR USER (${userType}) BLOCKED from superadmin: ${pathname} → redirecting to appropriate dashboard`);
    // Redirect based on school level
    if (schoolLevel === "primary") {
      return NextResponse.redirect(new URL("/primary/dashboard", request.url));
    } else if (schoolLevel === "advanced") {
      return NextResponse.redirect(new URL("/advanced/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/secondary/dashboard", request.url));
  }

  // ============================================================
  // CASE 4: Regular user accessing school pages - ALLOW!
  // ============================================================
  if (userType && !isSuperadmin) {
    console.log(`📚 REGULAR USER (${userType}) allowed: ${pathname}`);
    return NextResponse.next();
  }

  // ============================================================
  // CASE 5: Default - Allow everything else
  // ============================================================
  console.log(`✅ DEFAULT allow: ${pathname}`);
  return NextResponse.next();
}

// ============================================================
// CONFIG: Paths that trigger the proxy
// ============================================================
export const config = {
  matcher: [
    "/",                        // Homepage
    "/login",                   // Login page
    "/register",                // Register page
    "/secondary/:path*",        // Secondary dashboard and pages
    "/primary/:path*",          // Primary dashboard and pages
    "/advanced/:path*",         // Advanced dashboard
    "/superadmin/:path*",       // Superadmin pages
  ],
};