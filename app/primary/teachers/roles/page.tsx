// app/primary/teachers/roles/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Save,
  Loader2,
  Shield,
  Users,
  Sparkles,
  AlertCircle,
  CheckCircle,
  UserCog,
  GraduationCap,
  Briefcase,
  Crown,
  BookOpen,
  ChevronLeft,
  Layers,
  Clock,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Star,
  ChevronRight,
  RefreshCw,
  Globe,
  Filter,
  School,
  Building,
  Award,
  Trophy,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  Download,
  Printer,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================

interface Teacher {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  school_id: number;
  active: boolean;
}

// ============================================================
// 🔥 CONSTANTS - MAJUKUMU YOTE KWA KISWAHILI
// ============================================================

const MAJUKUMU_YOTE = [
  { value: "Msimamizi Mkuu", label: "Msimamizi Mkuu", icon: "👑" },
  { value: "Mwalimu Mkuu", label: "Mwalimu Mkuu", icon: "👨‍💼" },
  { value: "Mwalimu Mkuu Msaidizi", label: "Mwalimu Mkuu Msaidizi", icon: "📚" },
  { value: "Mtaaluma", label: "Mtaaluma", icon: "🎓" },
  { value: "Mhasibu", label: "Mhasibu", icon: "💰" },
  { value: "Mwalimu", label: "Mwalimu", icon: "👨‍🏫" },
];

const ROLE_ICONS: Record<string, string> = {
  "Msimamizi Mkuu": "👑",
  "Mwalimu Mkuu": "👨‍💼",
  "Mwalimu Mkuu Msaidizi": "📚",
  "Mtaaluma": "🎓",
  "Mhasibu": "💰",
  "Mwalimu": "👨‍🏫",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  "Msimamizi Mkuu": "Udhibiti kamili wa mfumo mzima",
  "Mwalimu Mkuu": "Udhibiti kamili wa shule",
  "Mwalimu Mkuu Msaidizi": "Ruhusa za naibu mwalimu mkuu",
  "Mtaaluma": "Simamia wanafunzi, walimu, madarasa na mitihani",
  "Mhasibu": "Simamia ada na malipo",
  "Mwalimu": "Simamia wanafunzi wake na alama zao",
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  "Msimamizi Mkuu": "bg-red-100 text-red-800",
  "Mwalimu Mkuu": "bg-purple-100 text-purple-800",
  "Mwalimu Mkuu Msaidizi": "bg-indigo-100 text-indigo-800",
  "Mtaaluma": "bg-blue-100 text-blue-800",
  "Mhasibu": "bg-yellow-100 text-yellow-800",
  "Mwalimu": "bg-gray-100 text-gray-800",
};

const ROLE_GRADIENT_COLORS: Record<string, string> = {
  "Msimamizi Mkuu": "from-red-500 to-rose-500",
  "Mwalimu Mkuu": "from-purple-500 to-pink-500",
  "Mwalimu Mkuu Msaidizi": "from-indigo-500 to-blue-500",
  "Mtaaluma": "from-sky-500 to-blue-500",
  "Mhasibu": "from-amber-500 to-orange-500",
  "Mwalimu": "from-emerald-500 to-teal-500",
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

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[800px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function UsimamiziWaMajukumuPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const allowedRoles = ["Msimamizi Mkuu", "Mwalimu Mkuu", "Mtaaluma"];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/primary/dashboard");
      return;
    }

    setToken(storedToken);
    setUserRole(role || "");
    fetchTeachers(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 FETCH TEACHERS
  // ============================================================
  const fetchTeachers = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/primary/teachers`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data);
      setError("");
    } catch (err) {
      setError("Imeshindwa kupakia walimu");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 HANDLE ROLE CHANGE
  // ============================================================
  const handleRoleChange = async (teacherId: number, newRole: string) => {
    setSaving(teacherId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/teachers/${teacherId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update role");
      }

      setTeachers(
        teachers.map((t) => (t.id === teacherId ? { ...t, role: newRole } : t))
      );

      const teacherName = teachers.find((t) => t.id === teacherId)?.name;
      setSuccess(`✅ Jukumu la ${teacherName} limebadilishwa kikamilifu!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kubadilisha jukumu");
    } finally {
      setSaving(null);
    }
  };

  // ============================================================
  // 🔍 FILTER
  // ============================================================
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalTeachers = teachers.length;
  const filteredCount = filteredTeachers.length;

  // Count roles
  const roleCounts: Record<string, number> = {};
  teachers.forEach((t) => {
    roleCounts[t.role] = (roleCounts[t.role] || 0) + 1;
  });

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
            Inapakia walimu...
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
          title="Usimamizi wa Majukumu"
          subtitle="Pangia na simamia majukumu ya walimu ili kudhibiti upatikanaji wa mfumo"
          icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTeachers} Walimu
            </span>
          }
          action={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <UserCog className="h-3 w-3 sm:h-4 sm:w-4" />
              Simamia
            </span>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jumla ya Walimu
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalTeachers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Walimu Mkuu
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {roleCounts["Mwalimu Mkuu"] || 0}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Walimu
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {roleCounts["Mwalimu"] || 0}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wamechujwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {filteredCount}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Search Bar */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tafuta kwa jina, jina la mtumiaji au barua pepe..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </MobileCard>

        {/* Teachers Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Walimu Wote
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredCount} {filteredCount === 1 ? "mwalimu" : "walimu"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="min-w-[140px] text-xs sm:text-sm">Mwalimu</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Jina la Mtumiaji</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Barua Pepe</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Jukumu la Sasa</TableHead>
                    <TableHead className="min-w-[160px] text-xs sm:text-sm">Badilisha Jukumu</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm w-12 sm:w-16">Kitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                          <p className="text-gray-500 text-sm sm:text-base">
                            Hakuna walimu waliopatikana
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Jaribu kubadilisha tafuta yako
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher, idx) => (
                      <TableRow
                        key={teacher.id}
                        className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                              {teacher.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                                {teacher.name}
                              </p>
                              <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                                @{teacher.username}
                              </p>
                            </div>
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
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                              ROLE_BADGE_COLORS[teacher.role] || "bg-gray-100 text-gray-800"
                            )}
                          >
                            {ROLE_ICONS[teacher.role] || "👨‍🏫"} {teacher.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={teacher.role}
                            onValueChange={(value) => handleRoleChange(teacher.id, value)}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-8 sm:h-9 text-[10px] sm:text-xs w-full min-w-[140px]">
                              <SelectValue placeholder="Chagua jukumu" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              {MAJUKUMU_YOTE.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  <span className="flex items-center gap-2 text-xs sm:text-sm">
                                    <span>{role.icon}</span>
                                    <span>{role.label}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          {saving === teacher.id ? (
                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-sky-600 mx-auto" />
                          ) : (
                            <div className="flex justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRoleChange(teacher.id, teacher.role)}
                                disabled
                                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </MobileTableWrapper>
          </CardContent>
        </MobileCard>

        {/* Role Permissions Info Box */}
        <MobileCard delay={300}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Ruhusa na Majukumu ya Kila Jukumu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MAJUKUMU_YOTE.map((role) => (
                <div
                  key={role.value}
                  className="flex items-start gap-2 p-3 bg-white/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r flex items-center justify-center text-lg sm:text-xl flex-shrink-0",
                      ROLE_GRADIENT_COLORS[role.value] || "from-gray-400 to-gray-500"
                    )}
                  >
                    {role.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                      {role.label}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {ROLE_DESCRIPTIONS[role.value]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-xl border border-gray-100">
              <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                Mabadiliko ya majukumu yanaanza kutumika mara moja.
              </p>
            </div>
          </CardContent>
        </MobileCard>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">🛡️ Usalama</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Majukumu yanadhibiti upatikanaji wa mfumo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <UserCog className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">⚙️ Badilisha</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Badilisha jukumu la mwalimu kwa urahisi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">✅ Inatumika Mara Moja</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Mabadiliko yanaanza kutumika papo hapo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Usimamizi wa Majukumu</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🏫 {totalTeachers} walimu</span>
            <span>•</span>
            <span>👑 {roleCounts["Mwalimu Mkuu"] || 0} walimu wakuu</span>
            <span>•</span>
            <span>📚 {roleCounts["Mtaaluma"] || 0} wataaluma</span>
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