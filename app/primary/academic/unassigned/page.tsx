// app/primary/academic/unassigned/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  CheckCircle,
  AlertCircle,
  UserPlus,
  School,
  TrendingUp,
  RefreshCw,
  ChevronLeft,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  Crown,
  Star,
  Clock,
  Users,
  Award,
  BarChart3,
  Filter,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface UnassignedSlot {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number | null;
  stream_name: string | null;
}

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
    >
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-yellow-100/80 mt-0.5 truncate">
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
  onClose,
}: {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
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
      <p className="text-sm sm:text-base break-words flex-1">{message}</p>
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

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[700px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function MasomoYasiyopangiwaPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<UnassignedSlot[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number>(4);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/primary/dashboard");
      return;
    }

    setToken(storedToken);

    const finalSchoolId = schoolId ? parseInt(schoolId) : 4;
    setUserSchoolId(finalSchoolId);

    fetchUnassignedSlots(storedToken, finalSchoolId);
  }, [router]);

  const fetchUnassignedSlots = async (authToken: string, schoolId: number) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log(`🏫 Fetching unassigned slots for school: ${schoolId}`);

      const response = await fetch(
        `${API_BASE}/api/v1/primary/academic/unassigned-slots?school_id=${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kupata masomo yasiyopangiwa");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSlots(data);
        setTotal(data.length);
        if (data.length === 0) {
          setSuccess("✅ Masomo yote yamepangwa! Hongera! 🎉");
        }
      } else {
        setSlots(data.unassigned || []);
        setTotal(data.total || 0);
        if (data.total === 0) {
          setSuccess("✅ Masomo yote yamepangwa! Hongera! 🎉");
        }
      }

      console.log(`📊 Found ${total} unassigned slots`);
    } catch (err: any) {
      console.error("Error fetching unassigned slots:", err);
      setError(err.message || "Imeshindwa kupakia masomo yasiyopangiwa");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUnassignedSlots(token, userSchoolId);
  };

  const getStreamDisplay = (streamName: string | null) => {
    if (!streamName) return "Mikondo Yote";
    return streamName;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia masomo yasiyopangiwa...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Masomo Yasiyopangiwa"
          subtitle="Masomo, madarasa na mikondo ambayo yanahitaji kupangiwa walimu"
          icon={<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <School className="h-3 w-3 sm:h-4 sm:w-4" />
              ID: {userSchoolId}
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-white hover:bg-white/20 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback"
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">Fresh</span>
              <span className="xs:hidden">Fresh</span>
            </Button>
          }
        />

        {/* 🔥🔥🔥 STATS CARD - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                Jumla ya Masomo Yasiyopangiwa
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                {total}
              </p>
              {total === 0 && !loading && (
                <p className="text-xs sm:text-sm text-emerald-200 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  Masomo yote yamepangwa! 🎉
                </p>
              )}
              {total > 0 && (
                <p className="text-[10px] sm:text-xs text-yellow-200/80 mt-1">
                  ⚠️ {total} {total === 1 ? "somo linahitaji" : "masomo yanahitaji"} kupangiwa
                </p>
              )}
            </div>
            <div className="bg-white/20 p-2 sm:p-2.5 md:p-3 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Unassigned Slots Table */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              Masomo na Madarasa Yasiyopangiwa
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({total} {total === 1 ? "somo" : "masomo"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-100 rounded-full">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600" />
                  </div>
                  <p className="text-base sm:text-lg font-medium text-gray-800">Masomo yote yamepangwa!</p>
                  <p className="text-xs sm:text-sm text-gray-500">Kila somo limepangwa mwalimu. Hongera! 🎉</p>
                </div>
              </div>
            ) : (
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[140px]">Somo</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Darasa</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Mkondo</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm w-28 sm:w-36">Kitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slots.map((slot, index) => (
                      <TableRow
                        key={`${slot.subject_id}-${slot.class_id}-${slot.stream_id}`}
                        className="hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-amber-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                              {slot.subject_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700">{slot.class_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700">
                              {getStreamDisplay(slot.stream_name)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/primary/teachers?assign_subject=${slot.subject_id}&class_id=${slot.class_id}&stream_id=${
                                  slot.stream_id || ""
                                }`
                              )
                            }
                            className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs touch-feedback"
                          >
                            <UserPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span className="hidden xs:inline">Pangia Mwalimu</span>
                            <span className="xs:hidden">Pangia</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MobileTableWrapper>
            )}
          </CardContent>
        </MobileCard>

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-yellow-800 text-xs sm:text-sm">📌 Hatua 1</p>
                <p className="text-[10px] sm:text-xs text-yellow-600/80 mt-0.5">
                  Bonyeza "Pangia Mwalimu" kwa somo lisilopangiwa
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">👨‍🏫 Hatua 2</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Utaelekezwa kwenye ukurasa wa Walimu
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✅ Hatua 3</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Chagua mwalimu na pangia somo, darasa na mkondo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-yellow-600">© 2026 MASI FAST RESULTS • Masomo Yasiyopangiwa</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {total} masomo</span>
            <span>•</span>
            <span>🏫 Shule ID: {userSchoolId}</span>
            <span>•</span>
            <span>📋 Pangia walimu</span>
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