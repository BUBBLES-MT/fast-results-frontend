// app/secondary/academic/unassigned/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Users,
  ArrowRight,
  Clock,
  Eye,
  Shield,
  Crown,
  Trophy,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 INTERFACES
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
// 🔥 MOBILE LAYOUT COMPONENTS - PRO MAX!
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-5 touch-feedback group animate-slideIn"
    >
      <div className="p-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <span className="text-sm sm:text-base font-medium">Back</span>
    </button>
  );
}

function MobileHeader({
  title,
  subtitle,
  icon,
  badge,
  onRefresh,
  loading,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 p-5 sm:p-7 md:p-8 text-white shadow-2xl mb-5 sm:mb-7 md:mb-8 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-2xl flex-shrink-0 shadow-lg backdrop-blur-sm">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-amber-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {badge}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2.5 sm:p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 touch-feedback hover:scale-105"
                disabled={loading}
              >
                <RefreshCw className={cn("h-5 w-5 sm:h-6 sm:w-6", loading && "animate-spin")} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Card
      className={cn(
        "border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden hover:-translate-y-1 hover:scale-[1.01]",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
}

function MobileStatCard({
  label,
  value,
  icon,
  color = "amber",
  subtitle,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "amber" | "emerald" | "red" | "sky" | "purple" | "indigo";
  subtitle?: React.ReactNode;
  delay?: number;
}) {
  const colors = {
    amber: "from-amber-500 to-orange-500",
    emerald: "from-emerald-500 to-teal-500",
    red: "from-red-500 to-rose-500",
    sky: "from-sky-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
  };

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]",
        `bg-gradient-to-r ${colors[color] || colors.amber}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-white/70 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <div className="text-[7px] sm:text-[8px] text-white/60 mt-0.5">{subtitle}</div>
          )}
        </div>
        <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl flex-shrink-0 backdrop-blur-sm">
          {icon}
        </div>
      </div>
      {/* 🔥 Animation line at bottom */}
      <div className="mt-2 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft" />
      </div>
    </div>
  );
}

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[600px] sm:min-w-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================

export default function UnassignedSlotsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<UnassignedSlot[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number>(1);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const allowedRoles = ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/secondary/dashboard");
      return;
    }

    setToken(storedToken);
    const finalSchoolId = schoolId ? parseInt(schoolId) : 1;
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
        `${API_BASE}/api/v1/academic/unassigned-slots?school_id=${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch unassigned slots");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSlots(data);
        setTotal(data.length);
        if (data.length === 0) {
          setSuccess("✅ All subjects assigned! Great job! 🎉");
        }
      } else {
        setSlots(data.unassigned || []);
        setTotal(data.total || 0);
        if (data.total === 0) {
          setSuccess("✅ All subjects assigned! Great job! 🎉");
        }
      }
    } catch (err: any) {
      console.error("Error fetching unassigned slots:", err);
      setError(err.message || "Failed to load unassigned slots");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUnassignedSlots(token, userSchoolId);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-amber-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base font-medium">
            Loading unassigned subjects...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Unassigned Subjects"
          subtitle={`School ID: ${userSchoolId}`}
          icon={<AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7" />}
          badge={
            <Badge className="bg-white/20 text-white border-white/30 text-sm sm:text-base px-3 sm:px-4 py-1.5 rounded-2xl">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              {total} remaining
            </Badge>
          }
          onRefresh={handleRefresh}
          loading={loading}
        />

        {/* Success/Error */}
        {success && (
          <div className="p-4 sm:p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl flex items-start gap-3 shadow-lg animate-slideIn">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-700 text-sm sm:text-base font-medium">{success}</p>
          </div>
        )}
        {error && (
          <div className="p-4 sm:p-5 bg-red-50 border-l-4 border-red-500 rounded-2xl flex items-start gap-3 shadow-lg animate-slideIn">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-600 text-sm sm:text-base font-medium">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid - PRO MAX SIZE! */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <MobileStatCard
            label="Remaining Slots"
            value={total}
            icon={<AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />}
            color="amber"
            subtitle={total === 0 ? "All assigned! 🎉" : undefined}
            delay={100}
          />
          <MobileStatCard
            label="School"
            value={userSchoolId}
            icon={<School className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />}
            color="sky"
            delay={200}
          />
          <MobileStatCard
            label="Subjects"
            value={slots.length > 0 ? new Set(slots.map(s => s.subject_name)).size : 0}
            icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />}
            color="purple"
            subtitle="Remaining"
            delay={300}
          />
          <MobileStatCard
            label="Classes"
            value={slots.length > 0 ? new Set(slots.map(s => s.class_name)).size : 0}
            icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />}
            color="indigo"
            subtitle="Remaining"
            delay={400}
          />
        </div>

        {/* Main Table */}
        <MobileCard delay={500}>
          <div className="h-1.5 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardHeader className="p-5 sm:p-6 md:p-8 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2.5">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                <span className="text-gray-800 font-bold">Unassigned Subjects List</span>
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 border-0 text-sm sm:text-base px-3 py-1">
                  {total} {total === 1 ? 'subject' : 'subjects'}
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? (
              <div className="text-center py-16 sm:py-20 md:py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 sm:p-5 bg-emerald-100 rounded-full">
                    <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">All Assigned! 🎉</p>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md px-4">
                    Every subject has been assigned to a teacher. Great job!
                  </p>
                </div>
              </div>
            ) : (
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-10 sm:w-12 text-center text-xs sm:text-sm font-semibold text-gray-600">#</TableHead>
                      <TableHead className="text-xs sm:text-sm font-semibold text-gray-600">Subject</TableHead>
                      <TableHead className="text-xs sm:text-sm font-semibold text-gray-600 hidden sm:table-cell">Class</TableHead>
                      <TableHead className="text-xs sm:text-sm font-semibold text-gray-600 hidden md:table-cell">Stream</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm font-semibold text-gray-600 w-24 sm:w-32">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slots.map((slot, index) => (
                      <TableRow
                        key={`${slot.subject_id}-${slot.class_id}-${slot.stream_id}`}
                        className="hover:bg-amber-50/60 transition-colors duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${index * 50 + 600}ms` }}
                      >
                        <TableCell className="text-center text-xs sm:text-sm text-gray-500 font-mono">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[100px] sm:max-w-[200px]">
                              {slot.subject_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[70px] sm:max-w-[120px]">
                              {slot.class_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[70px] sm:max-w-[120px]">
                              {slot.stream_name || "All Streams"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => router.push(
                              `/secondary/teachers?assign_subject=${slot.subject_id}&class_id=${slot.class_id}&stream_id=${slot.stream_id || ''}`
                            )}
                            className="gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-2xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 touch-feedback"
                          >
                            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline font-medium">Assign</span>
                            <span className="xs:hidden">Assign</span>
                            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 hidden sm:inline group-hover:translate-x-0.5 transition-transform" />
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

        {/* Info Box - PRO MAX */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-blue-100 shadow-xl animate-fadeIn" style={{ animationDelay: "700ms" }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="bg-blue-100 p-2.5 rounded-2xl flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3">
                How to Assign Teachers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                <div className="flex items-start gap-3 bg-white/60 rounded-2xl p-3 sm:p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-md">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <span>Click <strong>"Assign"</strong> on any unassigned slot</span>
                </div>
                <div className="flex items-start gap-3 bg-white/60 rounded-2xl p-3 sm:p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-md">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <span>You'll be redirected to the <strong>Teachers</strong> page</span>
                </div>
                <div className="flex items-start gap-3 bg-white/60 rounded-2xl p-3 sm:p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-md">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <span>Select teacher and <strong>assign</strong> subject/class/stream</span>
                </div>
              </div>
              <div className="mt-4 p-3 sm:p-4 bg-white/80 rounded-2xl border border-blue-100">
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                  Once assigned, the slot will automatically disappear from this list
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-200 animate-fadeIn" style={{ animationDelay: "800ms" }}>
          <p className="font-medium text-amber-600">© 2026 MASI FAST RESULTS • Unassigned Subjects</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {slots.length > 0 ? new Set(slots.map(s => s.subject_name)).size : 0} subjects</span>
            <span>•</span>
            <span>🏫 {slots.length > 0 ? new Set(slots.map(s => s.class_name)).size : 0} classes</span>
            <span>•</span>
            <span>⏳ {total} remaining</span>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
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
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
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
        
        @media (max-width: 400px) {
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
        @media (min-width: 401px) {
          .xs\\:inline { display: none !important; }
          .xs\\:hidden { display: inline !important; }
        }
      `}</style>
    </MainLayout>
  );
}