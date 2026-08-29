// app/dashboard/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setupSessionMonitoring } from "@/lib/session";
import { 
  Menu, 
  X, 
  Home, 
  School, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  Bell,
  User,
  ChevronDown,
  Crown,
  BarChart3,
  GraduationCap,
  CreditCard,
  Megaphone,
  FileText,
  Award,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ============================================================
// 🔥 MOBILE NAVIGATION COMPONENT
// ============================================================

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

function NavItem({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
  
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 touch-feedback",
        isActive
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
      )}
    >
      <span className={cn("flex-shrink-0", isActive ? "text-white" : "text-gray-500")}>
        {item.icon}
      </span>
      <span className="text-sm sm:text-base font-medium">{item.title}</span>
    </Link>
  );
}

// ============================================================
// 🔥 MOBILE HEADER
// ============================================================

function MobileHeader({ 
  title, 
  subtitle, 
  onMenuToggle, 
  isMenuOpen 
}: { 
  title: string; 
  subtitle?: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("darkMode") === "true";
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", String(newDark));
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        {/* Left - Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors touch-feedback lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            )}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-blue-500/30 flex-shrink-0">
                <School className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-base sm:text-xl font-bold truncate">
                <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </div>
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors touch-feedback"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            )}
          </button>
          <button className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors touch-feedback relative">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
          <button className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors touch-feedback">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// 🔥 MOBILE SIDEBAR
// ============================================================

function MobileSidebar({ 
  isOpen, 
  onClose,
  navItems,
  user
}: { 
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  user: { name: string; role: string; school?: string };
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=; expires=${new Date(0).toUTCString()}; path=/`);
    });
    router.push("/login");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:bg-transparent lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Logged in as</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{user.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user.role}</p>
                {user.school && (
                  <p className="text-[10px] sm:text-xs text-gray-400 truncate">{user.school}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 scrollable">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} onClick={onClose} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200/60 bg-gray-50/50">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors touch-feedback"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">Logout</span>
            </button>
            <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3">
              Version 3.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// 🔥 MAIN DASHBOARD LAYOUT
// ============================================================

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "Mwana Shule", role: "Mwalimu", school: "" });

  // 🔥 SESSION MONITORING
  useEffect(() => {
    const cleanup = setupSessionMonitoring();
    return cleanup;
  }, []);

  // 🔥 GET USER INFO
  useEffect(() => {
    const name = localStorage.getItem("user_name") || "Mwana Shule";
    const role = localStorage.getItem("user_type") || "Mwalimu";
    const school = localStorage.getItem("school_name") || "";
    setUser({ name, role, school });
  }, []);

  // 🔥 DETERMINE NAVIGATION ITEMS
  const getNavItems = (): NavItem[] => {
    const isPrimary = pathname?.includes("/primary");
    const isSecondary = pathname?.includes("/secondary");
    const isSuperAdmin = pathname?.includes("/superadmin");

    if (isSuperAdmin) {
      return [
        { title: "Dashboard", href: "/superadmin", icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Schools", href: "/superadmin/schools", icon: <School className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Stats", href: "/superadmin/stats", icon: <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Homepage Editor", href: "/superadmin/homepage-editor", icon: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Payments", href: "/superadmin/payments", icon: <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" /> },
      ];
    }

    if (isPrimary || isSecondary) {
      const base = isPrimary ? "/primary" : "/secondary";
      return [
        { title: "Dashboard", href: `${base}/dashboard`, icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Students", href: `${base}/students`, icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Teachers", href: `${base}/teachers`, icon: <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Classes", href: `${base}/classes`, icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Marks", href: `${base}/marks`, icon: <Award className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Reports", href: `${base}/reports`, icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Announcements", href: "/admin/announcements", icon: <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" /> },
        { title: "Payment", href: "/payment", icon: <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" /> },
      ];
    }

    return [
      { title: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" /> },
      { title: "Profile", href: "/profile", icon: <User className="h-4 w-4 sm:h-5 sm:w-5" /> },
      { title: "Settings", href: "/settings", icon: <Settings className="h-4 w-4 sm:h-5 sm:w-5" /> },
    ];
  };

  const navItems = getNavItems();
  const pageTitle = navItems.find(item => pathname === item.href || pathname?.startsWith(item.href + "/"))?.title || "Dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <MobileHeader
        title={pageTitle}
        subtitle={user.school || "School Management"}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <MobileSidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navItems={navItems}
          user={user}
        />

        {/* Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }
        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}