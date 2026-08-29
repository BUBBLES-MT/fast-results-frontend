// app/primary/teachers/pending/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";  // ✅ IMEPO SASA!
import { Textarea } from "@/components/ui/textarea";  // ✅ IMEPO SASA!
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";  // ✅ IMEPO SASA!
import {
  Loader2,
  CheckCircle,
  XCircle,
  UserPlus,
  AlertCircle,
  Eye,
  ChevronLeft,
  Sparkles,
  Users,
  GraduationCap,
  Shield,
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  Menu,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  Star,
  ChevronRight,
  RefreshCw,
  Globe,
  Filter,
  School,
  Building,
  Award,
  Crown,
  Trophy,
  TrendingUp,
  BarChart3,
  MapPin,
  Download,
  Printer,
  Edit,
  Trash2,
  Search,
  Layers,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================

interface PendingTeacher {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  phone1: string;
  status: string;
  created_at: string;
  school_id: number;
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

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[700px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🔥 HELPERS
// ============================================================

const getRoleDisplay = (role: string) => {
  switch (role) {
    case "Headmaster":
    case "Headmistress":
      return "Mwalimu Mkuu";
    case "Second Master":
    case "Second Mistress":
      return "Mwalimu Mkuu Msaidizi";
    case "Academic":
      return "Mtaaluma";
    case "Accountant":
      return "Mhasibu";
    case "Teacher":
      return "Mwalimu";
    default:
      return role;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Headmaster":
    case "Headmistress":
      return "bg-purple-100 text-purple-800";
    case "Second Master":
    case "Second Mistress":
      return "bg-indigo-100 text-indigo-800";
    case "Academic":
      return "bg-blue-100 text-blue-800";
    case "Accountant":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("sw-TZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function PendingApprovalPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog state
  const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userRole = localStorage.getItem("user_type");
    const schoolLevel = localStorage.getItem("school_level");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const adminRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"];
    if (!adminRoles.some((r) => userRole?.toLowerCase() === r.toLowerCase())) {
      router.push("/primary/dashboard");
      return;
    }

    setToken(storedToken);
    fetchPendingTeachers(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 FETCH PENDING TEACHERS
  // ============================================================
  const fetchPendingTeachers = async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/teachers/pending`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to fetch pending teachers");
      }

      const data = await response.json();
      setPendingTeachers(data.teachers || []);
    } catch (err: any) {
      setError(err.message || "Failed to load pending teachers");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 APPROVE TEACHER
  // ============================================================
  const handleApprove = async (teacherId: number) => {
    setProcessing(teacherId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/teachers/${teacherId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to approve teacher");
      }

      setSuccess("✅ Mwalimu ameidhinishwa kikamilifu!");
      setTimeout(() => setSuccess(""), 3000);
      fetchPendingTeachers(token);
    } catch (err: any) {
      setError(err.message || "Failed to approve teacher");
    } finally {
      setProcessing(null);
      setDialogOpen(false);
    }
  };

  // ============================================================
  // 🔥 REJECT TEACHER
  // ============================================================
  const handleReject = async (teacherId: number) => {
    if (!rejectionReason.trim()) {
      setError("Tafadhali weka sababu ya kukataa");
      return;
    }

    setProcessing(teacherId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/primary/teachers/${teacherId}/reject?reason=${encodeURIComponent(rejectionReason)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to reject teacher");
      }

      setSuccess("❌ Mwalimu amekataliwa!");
      setTimeout(() => setSuccess(""), 3000);
      fetchPendingTeachers(token);
    } catch (err: any) {
      setError(err.message || "Failed to reject teacher");
    } finally {
      setProcessing(null);
      setDialogOpen(false);
      setRejectionReason("");
    }
  };

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const openRejectDialog = (teacher: PendingTeacher) => {
    setSelectedTeacher(teacher);
    setRejectionReason("");
    setDialogOpen(true);
  };

  const handleRetry = () => {
    if (token) {
      fetchPendingTeachers(token);
    }
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalPending = pendingTeachers.length;

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia walimu wanaosubiri idhini...
          </p>
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
          title="Idhini ya Walimu Wapya"
          subtitle="Idhinisha au kataa walimu waliojisajili kwenye shule yako"
          icon={<UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalPending} Wanaosubiri
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-white hover:bg-white/20 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback"
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Fresh</span>
              <span className="xs:hidden">Fresh</span>
            </Button>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wanaosubiri Idhini
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalPending}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wameidhinishwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  0
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wamekataliwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  0
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Kiwango
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  Msingi
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Pending Teachers Table */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              Walimu Wanaosubiri Idhini
              <Badge className="ml-2 bg-amber-100 text-amber-800 text-xs sm:text-sm">
                {totalPending}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {totalPending === 0 ? (
              <div className="text-center py-12 sm:py-16 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-100 rounded-full">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-500" />
                  </div>
                  <p className="text-base sm:text-lg font-medium text-gray-700">
                    Hakuna walimu wanaosubiri idhini
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Walimu wote wameidhinishwa ✅
                  </p>
                </div>
              </div>
            ) : (
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                      <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina Kamili</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Username</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Jukumu</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Simu</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden 2xl:table-cell">Tarehe</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm w-20 sm:w-28">Vitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTeachers.map((teacher, idx) => {
                      const roleDisplay = getRoleDisplay(teacher.role);
                      return (
                        <TableRow
                          key={teacher.id}
                          className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200 group animate-fadeIn"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                                {teacher.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                                {teacher.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-[10px] sm:text-sm">
                            {teacher.username}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-[10px] sm:text-sm truncate max-w-[120px]">
                            {teacher.email}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                                getRoleBadgeColor(teacher.role)
                              )}
                            >
                              {roleDisplay}
                            </span>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-[10px] sm:text-sm">
                            {teacher.phone1 || "-"}
                          </TableCell>
                          <TableCell className="hidden 2xl:table-cell text-[10px] sm:text-sm">
                            {formatDate(teacher.created_at)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-1.5 sm:gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(teacher.id)}
                                disabled={processing === teacher.id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-0.5 sm:gap-1 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs touch-feedback"
                              >
                                {processing === teacher.id ? (
                                  <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                )}
                                <span className="hidden xs:inline">Idhinisha</span>
                                <span className="xs:hidden">Ndio</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openRejectDialog(teacher)}
                                disabled={processing === teacher.id}
                                className="gap-0.5 sm:gap-1 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs touch-feedback"
                              >
                                <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden xs:inline">Kataa</span>
                                <span className="xs:hidden">Hapana</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </MobileTableWrapper>
            )}
          </CardContent>
        </MobileCard>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">⏳ Wanaosubiri</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Walimu waliojisajili na kusubiri idhini yako
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✅ Idhinisha</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Idhinisha mwalimu kuanza kufundisha mara moja
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-red-800 text-xs sm:text-sm">❌ Kataa</p>
                <p className="text-[10px] sm:text-xs text-red-600/80 mt-0.5">
                  Kataa mwalimu kwa sababu maalum (itawasilishwa kwao)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-amber-600">© 2026 MASI FAST RESULTS • Idhini ya Walimu</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>⏳ {totalPending} wanaosubiri</span>
            <span>•</span>
            <span>👨‍🏫 Walimu wapya</span>
            <span>•</span>
            <span>🏫 Shule ya Msingi</span>
          </p>
        </div>
      </div>

      {/* ✅✅✅ REJECT DIALOG - FIXED WITH IMPORTS! ✅✅✅ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <XCircle className="h-5 w-5 text-red-600" />
              Kataa Mwalimu
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Je, una uhakika unataka kumkataa mwalimu{" "}
              <strong>{selectedTeacher?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Sababu ya Kukataa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Weka sababu ya kumkataa mwalimu huyu..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none bg-white border-gray-200 focus:ring-2 focus:ring-red-500 rounded-xl text-sm"
              />
              <p className="text-[10px] sm:text-xs text-gray-400">
                Sababu hii itaonekana kwa mwalimu aliyekataliwa
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Ghairi
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleReject(selectedTeacher?.id || 0)}
              disabled={!rejectionReason.trim() || processing !== null}
              className="w-full sm:w-auto gap-2 touch-feedback"
            >
              {processing === selectedTeacher?.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Kataa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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