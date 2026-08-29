// app/primary/top-students/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Trophy,
  Medal,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  GraduationCap,
  Star,
  Crown,
  AlertCircle,
  BookOpen,
  Eye,
  RefreshCw,
  School,
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
  ChevronRight,
  Globe,
  Filter,
  Building,
  CheckCircle,
  Info,
  BarChart3,
  Calendar,
  MapPin,
  Download,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================

interface Class {
  id: number;
  name: string;
  school_id: number;
}

interface TopStudent {
  position: number;
  student_id: number;
  name: string;
  roll_number: string;
  average: number;
  total: number;
  grade: string;
  subjects_count: number;
}

// ============================================================
// 🔥 CONSTANTS
// ============================================================

const AINA_ZAMTIHANI = [
  { value: "MIDTERM3", label: "Robo Muhula", icon: "📝" },
  { value: "MIDTERM9", label: "Robo Muhula ya Pili", icon: "📝" },
  { value: "TERMINAL", label: "Muhula wa Kwanza", icon: "📊" },
  { value: "ANNUAL", label: "Muhula wa Pili", icon: "🏆" },
];

const CHAGUO_ZAKIWIANO = [
  { value: "5", label: "Bora 5", icon: "👑" },
  { value: "10", label: "Bora 10", icon: "🏆" },
  { value: "20", label: "Bora 20", icon: "⭐" },
  { value: "30", label: "Bora 30", icon: "📊" },
  { value: "50", label: "Bora 50", icon: "🎯" },
  { value: "100", label: "Bora 100", icon: "🔥" },
  { value: "all", label: "Wanafunzi Wote", icon: "👥" },
];

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
  color = "yellow",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "yellow" | "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan" | "green";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    yellow: "from-yellow-500 to-amber-500",
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
        `bg-gradient-to-r ${gradients[color] || gradients.yellow}`
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
      <div className="px-4 sm:px-0 min-w-[600px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🔥 HELPERS
// ============================================================

const getMedalIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <Award className="h-5 w-5 text-blue-400" />;
  }
};

const getPositionBadge = (position: number) => {
  switch (position) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white";
    case 2:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-orange-600 text-white";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A":
      return "bg-emerald-100 text-emerald-800";
    case "B":
      return "bg-blue-100 text-blue-800";
    case "C":
      return "bg-yellow-100 text-yellow-800";
    case "D":
      return "bg-orange-100 text-orange-800";
    case "E":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function WanafunziBoraPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("MIDTERM3");
  const [selectedLimit, setSelectedLimit] = useState("10");
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [schoolName, setSchoolName] = useState("");

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const school = localStorage.getItem("school_name") || "Shule ya Msingi";

    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setSchoolName(school);

    const formattedRole = role || "";
    const isTeacherRole =
      formattedRole.toLowerCase() === "mwalimu" || formattedRole.toLowerCase() === "teacher";
    setIsTeacher(isTeacherRole);
    setUserRole(formattedRole);

    fetchClasses(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES
  // ============================================================
  const fetchClasses = async (authToken: string) => {
    try {
      setLoading(true);
      setError("");

      if (isTeacher) {
        const assignmentsRes = await fetch(`${API_BASE}/api/v1/primary/teachers/me/assignments`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (assignmentsRes.ok) {
          const assignments = await assignmentsRes.json();
          console.log("📚 Mwalimu assignments:", assignments);

          const classIds = [...new Set(assignments.map((a: any) => a.class_id))];
          console.log("📚 Class IDs:", classIds);

          if (classIds.length === 0) {
            setError("Hujapewa darasa lolote. Wasiliana na Mtaaluma.");
            setClasses([]);
            setLoading(false);
            return;
          }

          const classesRes = await fetch(`${API_BASE}/api/v1/primary/classes`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          if (classesRes.ok) {
            const allClasses = await classesRes.json();
            const myClasses = allClasses.filter((cls: Class) => classIds.includes(cls.id));
            setClasses(myClasses);

            if (myClasses.length > 0) {
              setSelectedClass(myClasses[0].id.toString());
            } else {
              setError("Hujapewa darasa lolote. Wasiliana na Mtaaluma.");
            }
          } else {
            setError("Imeshindwa kupata madarasa");
          }
        } else {
          setError("Imeshindwa kupata madarasa yako. Wasiliana na Mtaaluma.");
        }
      } else {
        const response = await fetch(`${API_BASE}/api/v1/primary/classes`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          setClasses(data);
          if (data.length > 0) {
            setSelectedClass(data[0].id.toString());
          } else {
            setError("Hakuna madarasa yaliyopatikana");
          }
        } else {
          setError("Imeshindwa kupata madarasa");
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Imeshindwa kuunganisha na server");
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FETCH TOP STUDENTS
  // ============================================================
  const fetchTopStudents = async () => {
    if (!selectedClass) {
      setError("Tafadhali chagua darasa");
      return;
    }

    setFetching(true);
    setError("");
    try {
      const limitParam = selectedLimit === "all" ? "" : `&limit=${selectedLimit}`;
      const url = `${API_BASE}/api/v1/primary/reports/class/${selectedClass}/top-students?exam_type=${selectedExamType}${limitParam}`;

      console.log("🔍 Fetching top students:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Imeshindwa kupata wanafunzi bora");
      }

      const data = await response.json();
      setTopStudents(data.top_students || []);

      if (data.top_students?.length === 0) {
        setError("Hakuna wanafunzi waliopata alama kwa mtihani huu.");
      }
    } catch (err: any) {
      console.error("Error fetching top students:", err);
      setError(err.message || "Imeshindwa kupakia wanafunzi bora");
    } finally {
      setFetching(false);
    }
  };

  // ============================================================
  // 🔥 AUTO FETCH
  // ============================================================
  useEffect(() => {
    if (selectedClass && !loading && !fetching) {
      const delay = setTimeout(() => {
        fetchTopStudents();
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [selectedClass, selectedExamType, selectedLimit]);

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const handleRefresh = () => {
    if (selectedClass) {
      fetchTopStudents();
    } else {
      fetchClasses(token);
    }
  };

  const getLimitLabel = () => {
    const option = CHAGUO_ZAKIWIANO.find((opt) => opt.value === selectedLimit);
    return option ? option.label : "Bora 10";
  };

  const getLimitIcon = () => {
    const option = CHAGUO_ZAKIWIANO.find((opt) => opt.value === selectedLimit);
    return option ? option.icon : "🏆";
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalClasses = classes.length;
  const totalTopStudents = topStudents.length;
  const totalSubjects = topStudents.length > 0 ? topStudents[0]?.subjects_count || 0 : 0;

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
            Inapakia madarasa...
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
          title="Wanafunzi Bora"
          subtitle="Adhimisha ubora! Tazama wanafunzi waliofanya vyema katika madarasa na mitihani yote"
          icon={<Trophy className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTopStudents} Wanafunzi
            </span>
          }
          action={
            isTeacher ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                Mwalimu
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
                <School className="h-3 w-3 sm:h-4 sm:w-4" />
                {schoolName}
              </span>
            )
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wanafunzi Bora
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalTopStudents}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Madarasa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalClasses}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Masomo
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalSubjects}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  {isTeacher ? "Madarasa Yangu" : "Kiwango"}
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1 truncate max-w-[100px] sm:max-w-[180px]">
                  {isTeacher ? totalClasses : "Msingi"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                {isTeacher ? (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                ) : (
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <MobileAlert
            type="error"
            message={error}
            onClose={() => setError("")}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs sm:text-sm h-7 sm:h-8 touch-feedback mt-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Jaribu Tena
            </Button>
          </MobileAlert>
        )}

        {/* Filters Card */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-yellow-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Vichujio</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Class */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
                  Chagua Darasa *
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-yellow-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue
                      placeholder={classes.length === 0 ? "Hakuna madarasa" : "Chagua darasa"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Hakuna madarasa
                      </SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {classes.length === 0 && (
                  <p className="text-[10px] sm:text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error || "Hakuna madarasa yaliyopatikana"}
                  </p>
                )}
              </div>

              {/* Exam Type */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
                  Aina ya Mtihani *
                </Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua aina ya mtihani" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {AINA_ZAMTIHANI.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Limit */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  Idadi ya Wanafunzi
                </Label>
                <Select value={selectedLimit} onValueChange={setSelectedLimit}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua kiwango" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {CHAGUO_ZAKIWIANO.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 animate-slideIn" style={{ animationDelay: "400ms" }}>
                <Button
                  onClick={fetchTopStudents}
                  disabled={fetching || !selectedClass || classes.length === 0}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                >
                  {fetching ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trophy className="h-4 w-4 mr-2" />
                  )}
                  {fetching ? "Inapakia..." : `Tazama ${getLimitLabel()}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={fetching}
                  className="w-full rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9 touch-feedback"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${fetching ? "animate-spin" : ""}`} />
                  Onyesha Upya
                </Button>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Results Table */}
        {topStudents.length > 0 && !fetching ? (
          <MobileCard delay={200}>
            <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-gray-100">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-gray-800 text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  {getLimitLabel()} Wanafunzi Bora
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    {getLimitIcon()} Orodha ya Heshima
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full">
                  {classes.find((c) => c.id.toString() === selectedClass)?.name || ""}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-12 sm:w-16 text-center text-xs sm:text-sm">Nafasi</TableHead>
                      <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina la Mwanafunzi</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Namba</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">Jumla</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">Wastani</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden xl:table-cell">Daraja</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden 2xl:table-cell">Masomo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((student) => (
                      <TableRow
                        key={student.student_id}
                        className="hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-amber-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${student.position * 50}ms` }}
                      >
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <div
                              className={cn(
                                "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold",
                                getPositionBadge(student.position)
                              )}
                            >
                              {student.position}
                            </div>
                            {getMedalIcon(student.position)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                              {student.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-[10px] sm:text-sm">
                          {student.roll_number || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center font-semibold text-gray-800 text-xs sm:text-sm">
                          {student.total}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-center text-xs sm:text-sm">
                          <span className="font-semibold">{student.average}%</span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-center">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold",
                              getGradeColor(student.grade)
                            )}
                          >
                            {student.grade}
                          </span>
                        </TableCell>
                        <TableCell className="hidden 2xl:table-cell text-center">
                          <span className="inline-flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                            <BookOpen className="h-3 w-3" />
                            {student.subjects_count}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MobileTableWrapper>

              <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-t border-yellow-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-gray-600">
                      Inaonyesha{" "}
                      <span className="font-semibold text-gray-800">{topStudents.length}</span>{" "}
                      wanafunzi bora
                      {selectedLimit !== "all" && ` kati ya ${selectedLimit}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Hongera kwa wanafunzi wote waliofanya vyema! 🎉
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </MobileCard>
        ) : !fetching && topStudents.length === 0 && !error ? (
          <MobileCard>
            <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">Hakuna data inayopatikana</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Chagua darasa na aina ya mtihani kuona wanafunzi bora.
                </p>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="mt-4 rounded-xl text-xs sm:text-sm touch-feedback"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Onyesha Upya
                </Button>
              </div>
            </CardContent>
          </MobileCard>
        ) : null}

        {/* Loading State */}
        {fetching && (
          <MobileCard>
            <CardContent className="py-12 sm:py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">Inapakia wanafunzi bora...</p>
            </CardContent>
          </MobileCard>
        )}

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-yellow-800 text-xs sm:text-sm">👑 Nafasi ya Kwanza</p>
                <p className="text-[10px] sm:text-xs text-yellow-600/80 mt-0.5">
                  Mwanafunzi aliyefanya vyema zaidi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Medal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">🥈 Nafasi ya Pili na Tatu</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Wanafunzi waliofanya vizuri pia
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">🏅 Wanafunzi Wengine</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Wote waliofanya vyema katika orodha
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-yellow-600">© 2026 MASI FAST RESULTS • Wanafunzi Bora</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>🏆 {totalTopStudents} wanafunzi bora</span>
            <span>•</span>
            <span>📚 {totalClasses} madarasa</span>
            <span>•</span>
            <span>⭐ {getLimitLabel()}</span>
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