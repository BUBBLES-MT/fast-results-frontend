// app/primary/students/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Mail,
  Shield,
  School,
  Award,
  Heart,
  Home,
  RefreshCw,
  ChevronLeft,
  Sparkles,
  Layers,
  Clock,
  Menu,
  X,
  Settings,
  HelpCircle,
  Star,
  ChevronRight,
  Globe,
  Filter,
  Building,
  Download,
  Printer,
  CheckCircle,
  AlertCircle,
  Trophy,
  Crown,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================

interface Student {
  id: number;
  name: string;
  sex: string;
  roll_number: string;
  school_id: number;
  class_id: number | null;
  stream_id: number | null;
  father_name: string;
  father_phone: string;
  mother_name?: string;
  mother_phone?: string;
  address?: string;
  health_info?: string;
  enrollment_date?: string;
  class_name?: string;
  stream_name?: string;
  school_name?: string;
}

// ============================================================
// 🔥 HELPERS
// ============================================================

const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE";
};

const pataRangiYaJinsia = (sex: string): string => {
  return sex === "M"
    ? "bg-blue-100 text-blue-700"
    : "bg-pink-100 text-pink-700";
};

const pataIconYaJinsia = (sex: string): string => {
  return sex === "M" ? "👦" : "👧";
};

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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-sky-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {badge && <div className="flex-shrink-0">{badge}</div>}
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
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
  children,
  onClose,
}: {
  type: "success" | "error" | "info" | "warning";
  message: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-lg animate-slideIn border",
        styles[type]
      )}
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base break-words font-medium">{message}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "sky",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan" | "green";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    sky: "from-sky-500 to-blue-500",
    blue: "from-blue-500 to-indigo-500",
    cyan: "from-cyan-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    teal: "from-teal-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    orange: "from-orange-500 to-red-500",
    red: "from-red-500 to-rose-500",
    rose: "from-rose-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
    pink: "from-pink-500 to-rose-500",
    green: "from-green-500 to-teal-500",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-3 sm:p-4 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.sky}`
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl sm:text-3xl font-bold mt-0.5 truncate">{value}</p>
          {subtitle && (
            <p className="text-[8px] sm:text-[10px] text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function MaelezoYaMwanafunzi() {
  const { id } = useParams();
  const router = useRouter();
  const [mwanafunzi, setMwanafunzi] = useState<Student | null>(null);
  const [inapakia, setInapakia] = useState(true);
  const [kosa, setKosa] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type") || "";

    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setUserRole(role);
    chukuaMwanafunzi(storedToken);
  }, [id]);

  // ============================================================
  // 🔥 FETCH STUDENT - PRIMARY API
  // ============================================================
  const chukuaMwanafunzi = async (authToken: string) => {
    try {
      setInapakia(true);
      setKosa("");

      const response = await fetch(`${API_BASE}/api/v1/primary/students/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Imeshindwa kupata taarifa za mwanafunzi");
      }

      const data = await response.json();
      setMwanafunzi(data);
      setKosa("");
    } catch (err: any) {
      console.error("Kosa la kupata mwanafunzi:", err);
      setKosa(err.message || "Kuna tatizo katika kupata taarifa");
    } finally {
      setInapakia(false);
    }
  };

  const handleRetry = () => {
    if (token) {
      chukuaMwanafunzi(token);
    }
  };

  // ============================================================
  // 🔥 FORMAT DATE
  // ============================================================
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("sw", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const hasFather = mwanafunzi?.father_name && mwanafunzi.father_name.trim() !== "";
  const hasMother = mwanafunzi?.mother_name && mwanafunzi.mother_name.trim() !== "";
  const hasAddress = mwanafunzi?.address && mwanafunzi.address.trim() !== "";
  const hasHealthInfo = mwanafunzi?.health_info && mwanafunzi.health_info.trim() !== "";
  const hasEnrollment = mwanafunzi?.enrollment_date && mwanafunzi.enrollment_date.trim() !== "";

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (inapakia) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia taarifa za mwanafunzi...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // ❌ ERROR STATE
  // ============================================================
  if (kosa) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
          <MobileBackButton />
          <MobileAlert
            type="error"
            message={kosa}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs sm:text-sm h-8 sm:h-9 touch-feedback"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Jaribu Tena
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/primary/students")}
                className="border-sky-300 text-sky-700 hover:bg-sky-50 rounded-xl text-xs sm:text-sm h-8 sm:h-9 touch-feedback"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Rudi kwa Wanafunzi
              </Button>
            </div>
          </MobileAlert>
        </div>
      </MainLayout>
    );
  }

  if (!mwanafunzi) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
          <MobileBackButton />
          <MobileAlert
            type="warning"
            message="Mwanafunzi hajapatikana"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/primary/students")}
              className="border-sky-300 text-sky-700 hover:bg-sky-50 rounded-xl text-xs sm:text-sm h-8 sm:h-9 touch-feedback mt-2"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Rudi kwa Wanafunzi
            </Button>
          </MobileAlert>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // 🎨 RENDER - PRO MAX!
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Maelezo ya Mwanafunzi"
          subtitle={`Taarifa kamili za ${mwanafunzi.name}`}
          icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <School className="h-3 w-3 sm:h-4 sm:w-4" />
              ID: {mwanafunzi.id}
            </span>
          }
          action={
            userRole?.toLowerCase() === "mwalimu" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                Mwalimu
              </span>
            )
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jina
                </p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 truncate max-w-[100px] sm:max-w-[180px]">
                  {mwanafunzi.name}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Darasa
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1 truncate max-w-[100px] sm:max-w-[180px]">
                  {mwanafunzi.class_name || "-"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jinsia
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1">
                  {pataJinsia(mwanafunzi.sex)}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm text-2xl sm:text-3xl">
                {pataIconYaJinsia(mwanafunzi.sex)}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Namba
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1 font-mono truncate max-w-[100px] sm:max-w-[180px]">
                  {mwanafunzi.roll_number || "-"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Student Card */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 flex justify-center">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-lg ring-4 ring-sky-100">
                  {mwanafunzi.name?.charAt(0).toUpperCase() || "?"}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {mwanafunzi.name}
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      pataRangiYaJinsia(mwanafunzi.sex)
                    )}
                  >
                    {pataJinsia(mwanafunzi.sex)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    Namba: {mwanafunzi.roll_number || "-"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-700">
                    Darasa: {mwanafunzi.class_name || "-"}
                  </span>
                </div>
                {mwanafunzi.stream_name && (
                  <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                    <School className="h-4 w-4" />
                    Mkondo: {mwanafunzi.stream_name}
                  </p>
                )}
                {mwanafunzi.school_name && (
                  <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                    <Building className="h-4 w-4" />
                    Shule: {mwanafunzi.school_name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Parent Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Father */}
          <MobileCard delay={200}>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2 text-blue-700 text-sm sm:text-base">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Taarifa za Baba
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              {hasFather ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Jina la Baba</p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">
                        {mwanafunzi.father_name}
                      </p>
                      {mwanafunzi.father_phone && (
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {mwanafunzi.father_phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  Hakuna taarifa za baba
                </div>
              )}
            </CardContent>
          </MobileCard>

          {/* Mother */}
          <MobileCard delay={300}>
            <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-rose-500" />
            <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-pink-50 to-rose-50">
              <CardTitle className="flex items-center gap-2 text-pink-700 text-sm sm:text-base">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Taarifa za Mama
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              {hasMother ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="p-2 bg-pink-100 rounded-full flex-shrink-0">
                      <User className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Jina la Mama</p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">
                        {mwanafunzi.mother_name}
                      </p>
                      {mwanafunzi.mother_phone && (
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {mwanafunzi.mother_phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  Hakuna taarifa za mama
                </div>
              )}
            </CardContent>
          </MobileCard>
        </div>

        {/* Additional Info */}
        <MobileCard delay={400}>
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-purple-700 text-sm sm:text-base">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Taarifa Nyingine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hasAddress && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-gray-200 rounded-full flex-shrink-0">
                    <MapPin className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Anuani</p>
                    <p className="text-sm sm:text-base text-gray-900">{mwanafunzi.address}</p>
                  </div>
                </div>
              )}
              {hasHealthInfo && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-amber-100 rounded-full flex-shrink-0">
                    <Heart className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Taarifa za Afya</p>
                    <p className="text-sm sm:text-base text-gray-900">{mwanafunzi.health_info}</p>
                  </div>
                </div>
              )}
              {hasEnrollment && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors sm:col-span-2">
                  <div className="p-2 bg-emerald-100 rounded-full flex-shrink-0">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Tarehe ya Kujiunga</p>
                    <p className="text-sm sm:text-base text-gray-900">
                      {formatDate(mwanafunzi.enrollment_date)}
                    </p>
                  </div>
                </div>
              )}
              {!hasAddress && !hasHealthInfo && !hasEnrollment && (
                <div className="text-center py-6 text-gray-400 col-span-2">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  Hakuna taarifa za ziada
                </div>
              )}
            </div>
          </CardContent>
        </MobileCard>

        {/* Quick Actions */}
        <MobileCard delay={500}>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              Vitendo vya Haraka
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
                onClick={() => router.push(`/primary/marks/add?student=${mwanafunzi.id}`)}
              >
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Ingiza Alama</span>
                <span className="xs:hidden">Alama</span>
              </Button>
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
                onClick={() => router.push(`/primary/reports/student/${mwanafunzi.id}`)}
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Tazama Ripoti</span>
                <span className="xs:hidden">Ripoti</span>
              </Button>
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
                onClick={() => router.push(`/primary/students/edit/${mwanafunzi.id}`)}
              >
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Hariri</span>
                <span className="xs:hidden">Hariri</span>
              </Button>
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
                onClick={() => router.push(`/primary/promote?student=${mwanafunzi.id}`)}
              >
                <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Panda Darasa</span>
                <span className="xs:hidden">Panda</span>
              </Button>
            </div>
          </CardContent>
        </MobileCard>

        {/* Info Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Maelezo ya Mwanafunzi</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>🆔 ID: {mwanafunzi.id}</span>
            <span>•</span>
            <span>🏫 Shule: {mwanafunzi.school_id}</span>
            <span>•</span>
            <span>📚 Darasa: {mwanafunzi.class_name || "-"}</span>
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

        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
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