// app/top-students/page.tsx

"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  School,
  Building,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Download,
  Printer,
  BarChart3,
  CheckCircle,
  Filter,
  Search,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  ArrowRight,
  Zap,
  Lightbulb,
  Target,
  Rocket,
  Shield,
  UserCog,
  MailQuestion,
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
const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

const LIMIT_OPTIONS = [
  { value: "5", label: "Top 5", icon: "👑" },
  { value: "10", label: "Top 10", icon: "🏆" },
  { value: "20", label: "Top 20", icon: "⭐" },
  { value: "30", label: "Top 30", icon: "📊" },
  { value: "50", label: "Top 50", icon: "🎯" },
  { value: "100", label: "Top 100", icon: "🔥" },
  { value: "all", label: "All Students", icon: "👥" },
];

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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-amber-100/80 mt-0.5 truncate">
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
  color = "amber",
  subtitle,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "sky" | "rose" | "orange" | "cyan";
  subtitle?: string;
  delay?: number;
}) {
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    sky: "from-sky-500 to-blue-500",
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
  };

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.amber}`
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
      <div className="px-4 sm:px-0 min-w-[700px] sm:min-w-full">{children}</div>
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
      return "bg-amber-100 text-amber-800";
    case "D":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function TopStudentsPage() {
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

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchClasses(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES
  // ============================================================
  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/classes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data);
      if (data.length > 0) {
        setSelectedClass(data[0].id.toString());
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load classes");
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FETCH TOP STUDENTS
  // ============================================================
  const fetchTopStudents = async () => {
    if (!selectedClass) return;

    setFetching(true);
    setError("");
    try {
      const limitParam = selectedLimit === "all" ? "" : `&limit=${selectedLimit}`;
      const response = await fetch(
        `${API_BASE}/api/v1/reports/class/${selectedClass}/top-students?exam_type=${selectedExamType}${limitParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch top students");
      const data = await response.json();
      setTopStudents(data.top_students || []);
    } catch (err) {
      setError("Failed to load top students");
    } finally {
      setFetching(false);
    }
  };

  // ============================================================
  // 🔥 AUTO FETCH ON CHANGE
  // ============================================================
  useEffect(() => {
    if (selectedClass && !loading) {
      const timer = setTimeout(() => {
        fetchTopStudents();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedClass, selectedExamType, selectedLimit]);

  // ============================================================
  // 🔍 HELPERS
  // ============================================================
  const getLimitLabel = () => {
    const option = LIMIT_OPTIONS.find((opt) => opt.value === selectedLimit);
    return option ? option.label : "Top 10";
  };

  const getLimitIcon = () => {
    const option = LIMIT_OPTIONS.find((opt) => opt.value === selectedLimit);
    return option ? option.icon : "🏆";
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalClasses = classes.length;
  const totalStudents = topStudents.length;

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (loading && classes.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading classes...
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
          title="Top Performing Students"
          subtitle="Celebrate excellence! View the best performing students"
          icon={<Trophy className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalStudents} Students
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchTopStudents}
              className="text-white hover:bg-white/20 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback"
              disabled={fetching}
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 ${fetching ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">Refresh</span>
              <span className="xs:hidden">Refresh</span>
            </Button>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Classes
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

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Top Students
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStudents}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Showing
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {getLimitLabel()}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Exam Type
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1 truncate max-w-[100px] sm:max-w-[180px]">
                  {selectedExamType}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
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
              onClick={fetchTopStudents}
              className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs sm:text-sm h-7 sm:h-8 touch-feedback mt-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </MobileAlert>
        )}

        {/* Filters */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Class Select */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                  Select Class *
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Type Select */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
                  Exam Type *
                </Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Limit Select */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  Number of Students
                </Label>
                <Select value={selectedLimit} onValueChange={setSelectedLimit}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {LIMIT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-1 sm:gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Button */}
              <div className="flex items-end animate-slideIn" style={{ animationDelay: "400ms" }}>
                <Button
                  onClick={fetchTopStudents}
                  disabled={fetching || !selectedClass}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                >
                  {fetching ? (
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin mr-1.5 sm:mr-2" />
                  ) : (
                    <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  )}
                  {fetching ? "Loading..." : `View ${getLimitLabel()}`}
                </Button>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Results */}
        {topStudents.length > 0 && !fetching ? (
          <MobileCard delay={200}>
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-gray-800 text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  {getLimitLabel()} Students
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    {getLimitIcon()} Honor Roll
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full">
                  {classes.find(c => c.id.toString() === selectedClass)?.name || ""}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-14 sm:w-20 text-center text-xs sm:text-sm">Position</TableHead>
                      <TableHead className="min-w-[140px] text-xs sm:text-sm">Student Name</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Roll Number</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden md:table-cell">Total</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden lg:table-cell">Average</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden xl:table-cell">Grade</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm hidden 2xl:table-cell">Subjects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((student) => (
                      <TableRow
                        key={student.student_id}
                        className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${student.position * 50}ms` }}
                      >
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <div
                              className={cn(
                                "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold",
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
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                              {student.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                          {student.roll_number || "-"}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-gray-800 text-xs sm:text-sm hidden md:table-cell">
                          {student.total}
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <span className="font-semibold text-xs sm:text-sm">{student.average}%</span>
                        </TableCell>
                        <TableCell className="text-center hidden xl:table-cell">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold",
                              getGradeColor(student.grade)
                            )}
                          >
                            {student.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-center hidden 2xl:table-cell">
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-gray-600 text-xs sm:text-sm">
                            <BookOpen className="h-3 w-3" />
                            {student.subjects_count}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MobileTableWrapper>

              {/* Summary Banner */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-gray-600">
                      Showing <span className="font-semibold text-gray-800">{topStudents.length}</span> top students
                      {selectedLimit !== "all" && ` out of ${selectedLimit}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Congratulations to all outstanding students! 🎉
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
                <p className="text-gray-500 text-sm sm:text-base">No data available</p>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm px-4">
                  Select a class and exam type to view top students.
                </p>
                <Button
                  variant="outline"
                  onClick={fetchTopStudents}
                  className="mt-2 rounded-xl text-sm touch-feedback"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Data
                </Button>
              </div>
            </CardContent>
          </MobileCard>
        ) : null}

        {/* Loading state while fetching */}
        {fetching && (
          <MobileCard hover={false}>
            <CardContent className="py-12 sm:py-16 text-center">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-amber-600 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">Loading top students...</p>
            </CardContent>
          </MobileCard>
        )}

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">👑 Top Performers</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Students with the highest academic performance
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">📚 Academic Excellence</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Recognizing outstanding academic achievement
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🏆 Honor Roll</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Celebrating excellence and hard work
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-amber-600">© 2026 MASI FAST RESULTS • Top Students</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>🏆 {totalStudents} top students</span>
            <span>•</span>
            <span>📚 {totalClasses} classes</span>
            <span>•</span>
            <span>⭐ Honor Roll</span>
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