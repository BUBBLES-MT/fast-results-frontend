// app/secondary/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  ArrowLeft,
  Settings,
  UserCog,
  ChevronLeft,
  Sparkles,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Crown,
  Star,
  Trophy,
  Menu,
  X,
  Home,
  LogOut,
  HelpCircle,
  Edit,
  UserCircle,
  BadgeCheck,
  Building,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface TeacherProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  school_id?: number;
  school_name?: string;
  school_level?: string;
  created_at?: string;
}

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - EXTREME PRO MAX!
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
    >
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Rudi</span>
    </button>
  );
}

function MobileHeader({
  title,
  subtitle,
  icon,
  badge,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 rounded-2xl shadow-lg backdrop-blur-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-blue-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  children,
  className,
  gradient,
  hover = true,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <Card
      className={cn(
        "border-0 overflow-hidden rounded-2xl",
        gradient || "bg-white/90 backdrop-blur-sm",
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
}

function MobileAlert({
  type,
  message,
}: {
  type: "error" | "info";
  message: string;
}) {
  const styles = {
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-lg animate-slideIn border",
        styles[type]
      )}
    >
      {icons[type]}
      <p className="text-sm sm:text-base break-words">{message}</p>
    </div>
  );
}

function ProfileInfoItem({
  icon,
  label,
  value,
  color = "blue",
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: "blue" | "purple" | "green" | "orange" | "red" | "teal" | "indigo" | "pink" | "amber";
  delay?: number;
}) {
  const bgColors = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    teal: "bg-teal-100 text-teal-600",
    indigo: "bg-indigo-100 text-indigo-600",
    pink: "bg-pink-100 text-pink-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200 group animate-slideIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center flex-shrink-0",
          bgColors[color]
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/teachers/me/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data.teacher);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    const roleMap: Record<string, string> = {
      Headmaster: "bg-purple-100 text-purple-800 border-purple-200",
      Headmistress: "bg-pink-100 text-pink-800 border-pink-200",
      "Second Master": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Second Mistress": "bg-rose-100 text-rose-800 border-rose-200",
      Academic: "bg-blue-100 text-blue-800 border-blue-200",
      Accountant: "bg-amber-100 text-amber-800 border-amber-200",
      Teacher: "bg-gray-100 text-gray-800 border-gray-200",
      Mwalimu: "bg-green-100 text-green-800 border-green-200",
      "Mwalimu Mkuu": "bg-purple-100 text-purple-800 border-purple-200",
      "Mwalimu Mkuu Msaidizi": "bg-indigo-100 text-indigo-800 border-indigo-200",
      Mtaaluma: "bg-blue-100 text-blue-800 border-blue-200",
      Mhasibu: "bg-amber-100 text-amber-800 border-amber-200",
    };
    return roleMap[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    const iconMap: Record<string, string> = {
      Headmaster: "👨‍💼",
      Headmistress: "👩‍💼",
      "Second Master": "📚",
      "Second Mistress": "📚",
      Academic: "🎓",
      Accountant: "💰",
      Teacher: "👨‍🏫",
      Mwalimu: "👨‍🏫",
      "Mwalimu Mkuu": "👨‍💼",
      "Mwalimu Mkuu Msaidizi": "📚",
      Mtaaluma: "🎓",
      Mhasibu: "💰",
    };
    return iconMap[role] || "👤";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading profile...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
            <p className="text-sm text-red-600 mt-1">{error || "Profile not found"}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4 touch-feedback"
            >
              Try Again 🔄
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="My Profile"
          subtitle="View your personal information and account details"
          icon={<UserCog className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              Verified
            </span>
          }
        />

        {/* Profile Avatar Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{profile.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium border",
                      getRoleBadgeColor(profile.role)
                    )}
                  >
                    <span>{getRoleIcon(profile.role)}</span>
                    {profile.role}
                  </span>
                  {profile.school_level && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <School className="h-3 w-3" />
                      {profile.school_level}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-1">
                  <Calendar className="h-3 w-3" />
                  Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recently"}
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-1 sm:gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl text-xs sm:text-sm touch-feedback"
                onClick={() => router.push("/secondary/profile/edit")}
              >
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Edit Profile</span>
                <span className="xs:hidden">Edit</span>
              </Button>
            </div>
          </CardContent>
        </MobileCard>

        {/* Profile Info */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <ProfileInfoItem
              icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="Full Name"
              value={profile.name}
              color="blue"
              delay={100}
            />

            <ProfileInfoItem
              icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="Email Address"
              value={profile.email}
              color="purple"
              delay={200}
            />

            <ProfileInfoItem
              icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="Role"
              value={profile.role}
              color="green"
              delay={300}
            />

            {profile.phone && (
              <ProfileInfoItem
                icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />}
                label="Phone Number"
                value={profile.phone}
                color="orange"
                delay={400}
              />
            )}

            <ProfileInfoItem
              icon={<School className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="School"
              value={profile.school_name || `School ID: ${profile.school_id}`}
              color="indigo"
              delay={500}
            />

            {profile.school_id && (
              <ProfileInfoItem
                icon={<Building className="h-4 w-4 sm:h-5 sm:w-5" />}
                label="School ID"
                value={`#${profile.school_id}`}
                color="amber"
                delay={600}
              />
            )}
          </CardContent>
        </MobileCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-300 touch-feedback animate-slideIn"
            style={{ animationDelay: "100ms" }}
            onClick={() => router.push("/secondary/dashboard")}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">Dashboard</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Go to main dashboard</p>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-300 touch-feedback animate-slideIn"
            style={{ animationDelay: "200ms" }}
            onClick={() => router.push("/secondary/settings")}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">Settings</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Account settings</p>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-300 touch-feedback animate-slideIn"
            style={{ animationDelay: "300ms" }}
            onClick={() => router.push("/secondary/help")}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-xs sm:text-sm">Help</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Get assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">🔒 Account Security</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Your account is protected with secure authentication
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">⏰ Session Info</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Your session is active. Logout to end your session.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • My Profile</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>👤 {profile.name}</span>
            <span>•</span>
            <span>🎓 {profile.role}</span>
            <span>•</span>
            <span>🏫 {profile.school_name || "School"}</span>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }

        @media (max-width: 399px) {
          .xs\\:inline {
            display: inline !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:inline {
            display: none !important;
          }
          .xs\\:hidden {
            display: inline !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}