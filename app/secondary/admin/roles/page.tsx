// app/admin/roles/page.tsx

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
  Filter,
  Menu,
  X,
  School,
  Building,
  Award,
  Trophy,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Star,
  ChevronRight,
  RefreshCw,
  Globe,
  Eye,
  Download,
  Printer,
  Edit,
  Trash2,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 INTERFACES
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
// 🔥 CONSTANTS - ENGLISH!
// ============================================================
const ROLES = [
  { value: "Teacher", label: "Teacher", icon: "👨‍🏫" },
  { value: "Headmaster", label: "Headmaster", icon: "👨‍💼" },
  { value: "Headmistress", label: "Headmistress", icon: "👩‍💼" },
  { value: "Second Master", label: "Second Master", icon: "📚" },
  { value: "Second Mistress", label: "Second Mistress", icon: "📚" },
  { value: "Academic", label: "Academic", icon: "🎓" },
  { value: "Accountant", label: "Accountant", icon: "💰" },
  { value: "Superadmin", label: "Superadmin", icon: "👑" },
];

const ROLE_ICONS: Record<string, string> = {
  Headmaster: "👨‍💼",
  Headmistress: "👩‍💼",
  "Second Master": "📚",
  "Second Mistress": "📚",
  Academic: "🎓",
  Accountant: "💰",
  Teacher: "👨‍🏫",
  Superadmin: "👑",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  Headmaster: "Full school management access",
  Headmistress: "Full school management access",
  "Second Master": "Deputy headmaster permissions",
  "Second Mistress": "Deputy headmistress permissions",
  Academic: "Manage students, teachers, classes, and exams",
  Accountant: "Manage fees and payments",
  Teacher: "Manage own students and marks",
  Superadmin: "Full system management access",
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  Headmaster: "bg-purple-100 text-purple-800 border-purple-200",
  Headmistress: "bg-pink-100 text-pink-800 border-pink-200",
  "Second Master": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Second Mistress": "bg-rose-100 text-rose-800 border-rose-200",
  Academic: "bg-blue-100 text-blue-800 border-blue-200",
  Accountant: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Teacher: "bg-gray-100 text-gray-800 border-gray-200",
  Superadmin: "bg-red-100 text-red-800 border-red-200",
};

const ROLE_GRADIENT: Record<string, string> = {
  Headmaster: "from-purple-500 to-pink-500",
  Headmistress: "from-pink-500 to-rose-500",
  "Second Master": "from-indigo-500 to-blue-500",
  "Second Mistress": "from-rose-500 to-pink-500",
  Academic: "from-blue-500 to-sky-500",
  Accountant: "from-amber-500 to-orange-500",
  Teacher: "from-emerald-500 to-teal-500",
  Superadmin: "from-red-500 to-rose-500",
};

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - PRO MAX!
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
      <span className="text-sm font-medium">Back</span>
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
        "border-0 overflow-hidden rounded-2xl sm:rounded-3xl",
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
  color = "blue",
  subtitle,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "amber" | "purple" | "red" | "sky" | "indigo" | "pink";
  subtitle?: string;
  delay?: number;
}) {
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    sky: "from-sky-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    purple: "from-purple-500 to-pink-500",
    red: "from-red-500 to-rose-500",
    indigo: "from-indigo-500 to-purple-500",
    pink: "from-pink-500 to-rose-500",
  };

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[8px] sm:text-[10px] text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </div>
      </div>
    </div>
  );
}

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[600px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🔥 HELPERS
// ============================================================

const getRoleDisplay = (role: string) => {
  const found = ROLES.find((r) => r.value === role);
  return found ? found.label : role;
};

const getRoleBadgeColor = (role: string) => {
  return ROLE_BADGE_COLORS[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getRoleIcon = (role: string) => {
  return ROLE_ICONS[role] || "👨‍🏫";
};

const getRoleGradient = (role: string) => {
  return ROLE_GRADIENT[role] || "from-gray-400 to-gray-500";
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function RolesPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

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

    const allowedRoles = ["superadmin", "Headmaster", "Headmistress", "Academic"];
    if (!allowedRoles.includes(role || "")) {
      router.push("/dashboard");
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
      const response = await fetch(`${API_BASE}/api/v1/teachers`, {
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
      setError("Failed to load teachers");
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
      const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}/role`, {
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
      setSuccess(`✅ Role updated for ${teacherName}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update role");
    } finally {
      setSaving(null);
    }
  };

  // ============================================================
  // 🔍 FILTER
  // ============================================================
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || teacher.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalTeachers = teachers.length;
  const filteredCount = filteredTeachers.length;

  const roleCounts = teachers.reduce((acc, t) => {
    acc[t.role] = (acc[t.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading teachers...
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
          title="Manage Teacher Roles"
          subtitle="Assign and manage roles for teachers"
          icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTeachers} Teachers
            </span>
          }
          action={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <UserCog className="h-3 w-3 sm:h-4 sm:w-4" />
              Manage
            </span>
          }
        />

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Teachers
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

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Headmasters
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {(roleCounts.Headmaster || 0) + (roleCounts.Headmistress || 0)}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Teachers
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {roleCounts.Teacher || 0}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Academics
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {roleCounts.Academic || 0}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, username or email..."
                  className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-shrink-0">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-44 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      <SelectValue placeholder="All Roles" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="all">📋 All Roles</SelectItem>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <span className="flex items-center gap-2">
                          <span>{role.icon}</span>
                          <span>{role.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Teachers Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              All Teachers
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredCount} {filteredCount === 1 ? "teacher" : "teachers"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="min-w-[140px] text-xs sm:text-sm">Teacher</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Username</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Role</TableHead>
                    <TableHead className="min-w-[150px] text-xs sm:text-sm">Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                          <p className="text-gray-500 text-sm sm:text-base">No teachers found</p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Try adjusting your search or filter
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher, idx) => {
                      const roleDisplay = getRoleDisplay(teacher.role);
                      const roleIcon = getRoleIcon(teacher.role);
                      return (
                        <TableRow
                          key={teacher.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0",
                                  getRoleGradient(teacher.role)
                                )}
                              >
                                {teacher.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                                  {teacher.name}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-400 truncate sm:hidden">
                                  @{teacher.username}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-[10px] sm:text-sm truncate max-w-[80px]">
                            {teacher.username}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-[10px] sm:text-sm truncate max-w-[100px]">
                            {teacher.email}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border",
                                getRoleBadgeColor(teacher.role)
                              )}
                            >
                              {roleIcon} {roleDisplay}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={teacher.role}
                              onValueChange={(value) => handleRoleChange(teacher.id, value)}
                              disabled={saving === teacher.id}
                            >
                              <SelectTrigger
                                className={cn(
                                  "bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-8 sm:h-9 text-[10px] sm:text-xs w-full min-w-[130px]",
                                  saving === teacher.id && "opacity-50"
                                )}
                              >
                                {saving === teacher.id ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Saving...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span>{getRoleIcon(teacher.role)}</span>
                                    <span className="truncate">{getRoleDisplay(teacher.role)}</span>
                                  </div>
                                )}
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                                {ROLES.map((role) => (
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
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </MobileTableWrapper>
          </CardContent>
        </MobileCard>

        {/* Role Permissions Info Box */}
        <MobileCard delay={300}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Role Permissions & Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {ROLES.map((role) => (
                <div
                  key={role.value}
                  className="flex items-start gap-2 p-2.5 sm:p-3 bg-white/60 rounded-xl hover:bg-white/90 transition-all duration-200 hover:shadow-md border border-gray-100"
                >
                  <div
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r flex items-center justify-center text-base sm:text-lg flex-shrink-0",
                      getRoleGradient(role.value)
                    )}
                  >
                    {role.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                      {role.label}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {ROLE_DESCRIPTIONS[role.value] || "Description not available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white/70 rounded-xl border border-gray-100">
              <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500 flex-shrink-0" />
                Role changes take effect immediately. Users may need to log out and back in.
              </p>
            </div>
          </CardContent>
        </MobileCard>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Role Management</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🏫 {totalTeachers} teachers</span>
            <span>•</span>
            <span>👑 {(roleCounts.Headmaster || 0) + (roleCounts.Headmistress || 0)} headmasters</span>
            <span>•</span>
            <span>🎓 {roleCounts.Academic || 0} academics</span>
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