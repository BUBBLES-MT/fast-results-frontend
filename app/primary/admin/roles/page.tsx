// app/primary/academic/roles/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  Star,
  Clock,
  TrendingUp,
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
interface Teacher {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  school_id: number;
  active: boolean;
}

// 🔥 MAJUKUMU KWA KISWAHILI NA KINGEREZA KWA BACKEND
const MAJUKUMU_YOTE = [
  { value: "Superadmin", label: "Msimamizi Mkuu", icon: "👑" },
  { value: "Headmaster", label: "Mwalimu Mkuu", icon: "👨‍💼" },
  { value: "Headmistress", label: "Mwalimu Mkuu", icon: "👩‍💼" },
  { value: "Second Master", label: "Mwalimu Mkuu Msaidizi", icon: "📚" },
  { value: "Second Mistress", label: "Mwalimu Mkuu Msaidizi", icon: "📚" },
  { value: "Academic", label: "Mtaaluma", icon: "🎓" },
  { value: "Accountant", label: "Mhasibu", icon: "💰" },
  { value: "Teacher", label: "Mwalimu", icon: "👨‍🏫" },
];

const ROLE_ICONS: Record<string, string> = {
  Superadmin: "👑",
  Headmaster: "👨‍💼",
  Headmistress: "👩‍💼",
  "Second Master": "📚",
  "Second Mistress": "📚",
  Academic: "🎓",
  Accountant: "💰",
  Teacher: "👨‍🏫",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  Superadmin: "Udhibiti kamili wa mfumo mzima",
  Headmaster: "Udhibiti kamili wa shule",
  Headmistress: "Udhibiti kamili wa shule",
  "Second Master": "Ruhusa za naibu mwalimu mkuu",
  "Second Mistress": "Ruhusa za naibu mwalimu mkuu",
  Academic: "Simamia wanafunzi, walimu, madarasa na mitihani",
  Accountant: "Simamia ada na malipo",
  Teacher: "Simamia wanafunzi wake na alama zao",
};

// 🔥 TAFSIRI JUKUMU KWA KISWAHILI KWA UI
const getRoleDisplay = (role: string) => {
  const found = MAJUKUMU_YOTE.find((r) => r.value === role);
  return found ? found.label : role;
};

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
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const allowedRoles = ["Superadmin", "Mwalimu Mkuu", "Mtaaluma"];
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

  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/teachers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      setError("Imeshindwa kupakia walimu");
    } finally {
      setLoading(false);
    }
  };

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
      if (!response.ok) throw new Error("Failed to update role");

      setTeachers(
        teachers.map((t) => (t.id === teacherId ? { ...t, role: newRole } : t))
      );
      const teacherName = teachers.find((t) => t.id === teacherId)?.name;
      setSuccess(`Jukumu la ${teacherName} limebadilishwa kikamilifu!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Imeshindwa kubadilisha jukumu");
    } finally {
      setSaving(null);
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    if (role === "Superadmin") return "bg-red-100 text-red-800 border-red-200";
    switch (role) {
      case "Headmaster":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Headmistress":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Second Master":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Second Mistress":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Academic":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Accountant":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate stats
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.active).length;
  const totalRoles = new Set(teachers.map((t) => t.role)).size;

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

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Usimamizi wa Majukumu"
          subtitle="Pangia na simamia majukumu ya walimu"
          icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTeachers} Walimu
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

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Walimu Wanaofanya Kazi
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {activeTeachers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Aina za Majukumu
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalRoles}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Walimu Wasiofanya Kazi
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalTeachers - activeTeachers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Search Bar */}
        <MobileCard hover={false} delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
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
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Walimu Wote
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredTeachers.length}{" "}
                {filteredTeachers.length === 1 ? "mwalimu" : "walimu"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[140px]">Mwalimu</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Jina la Mtumiaji</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Barua Pepe</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Jukumu la Sasa</TableHead>
                    <TableHead className="text-xs sm:text-sm">Badilisha Jukumu</TableHead>
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
                            {searchTerm ? "Hakuna walimu waliopatikana" : "Hakuna walimu"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {searchTerm ? "Jaribu kubadilisha tafuta yako" : "Walimu wataonekana hapa"}
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
                                {teacher.username}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                          {teacher.username}
                        </TableCell>
                        <TableCell className="text-[10px] sm:text-sm hidden md:table-cell truncate max-w-[100px]">
                          {teacher.email}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border",
                              getRoleBadgeColor(teacher.role)
                            )}
                          >
                            {ROLE_ICONS[teacher.role] || "👨‍🏫"}{" "}
                            {getRoleDisplay(teacher.role)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={teacher.role}
                            onValueChange={(value) =>
                              handleRoleChange(teacher.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 sm:w-44 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-8 sm:h-9 text-[10px] sm:text-sm">
                              <SelectValue placeholder="Chagua jukumu" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              {MAJUKUMU_YOTE.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
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
                            <Loader2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 animate-spin text-sky-600 mx-auto" />
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRoleChange(teacher.id, teacher.role)}
                              disabled
                              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                            </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">🔒 Udhibiti wa Majukumu</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Badilisha majukumu ya walimu ili kudhibiti upatikanaji wa mfumo
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
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✅ Mabadiliko ya Moja kwa Moja</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Mabadiliko yanaanza kutumika mara moja. Watumiaji wanaweza kuhitaji kuingia tena.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Usimamizi wa Majukumu</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🏫 {totalTeachers} walimu</span>
            <span>•</span>
            <span>✅ {activeTeachers} wanaofanya kazi</span>
            <span>•</span>
            <span>📋 {totalRoles} majukumu</span>
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