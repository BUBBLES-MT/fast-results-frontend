// app/primary/promote/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Users,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  School,
  Shield,
  ChevronLeft,
  Layers,
  Award,
  Clock,
  Menu,
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
  X,
  BookOpen,
  Crown,
  Trophy,
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
  roll_number: string;
  class_id: number;
  stream_id: number | null;
}

interface Class {
  id: number;
  name: string;
  streams: { id: number; name: string }[];
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
  onClose,
}: {
  type: "success" | "error" | "info" | "warning";
  message: string;
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
      <div className="px-4 sm:px-0 min-w-[500px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function PandaWanafunziPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedFromClass, setSelectedFromClass] = useState("");
  const [selectedToClass, setSelectedToClass] = useState("");
  const [selectedToStream, setSelectedToStream] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const storedSchoolId = localStorage.getItem("school_id");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const isTeacherRole =
      role?.toLowerCase() === "mwalimu" || role?.toLowerCase() === "teacher";
    setIsTeacher(isTeacherRole);

    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu", "Teacher"];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/primary/dashboard");
      return;
    }

    setToken(storedToken);
    setUserRole(role || "");
    setSchoolId(storedSchoolId || "4");
    fetchClasses(storedToken, storedSchoolId || "4");
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES
  // ============================================================
  const fetchClasses = async (authToken: string, schoolId: string) => {
    try {
      setLoading(true);
      setError("");

      const url = `${API_BASE}/api/v1/primary/promote/classes-with-streams?school_id=${schoolId}`;
      console.log("📤 Inapakia madarasa kutoka:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kupata madarasa");
      }

      const data = await response.json();
      setClasses(data);
      console.log("✅ Madarasa yamepakiwa:", data.length);
    } catch (err: any) {
      console.error("Kosa:", err);
      setError(err.message || "Imeshindwa kupakia madarasa");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FETCH STUDENTS
  // ============================================================
  const fetchStudentsByClass = async (classId: string) => {
    if (!classId) return;

    setLoadingStudents(true);
    setError("");

    try {
      const apiUrl = isTeacher
        ? `${API_BASE}/api/v1/primary/students/my-students?class_id=${classId}&school_id=${schoolId}`
        : `${API_BASE}/api/v1/primary/students?class_id=${classId}&school_id=${schoolId}`;

      console.log("📤 Inapakia wanafunzi kutoka:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kupata wanafunzi");
      }

      const data = await response.json();
      setStudents(data);
      setSelectedStudents([]);
      console.log("✅ Wanafunzi wamepakiwa:", data.length);
    } catch (err: any) {
      console.error("Kosa:", err);
      setError(err.message || "Imeshindwa kupakia wanafunzi");
    } finally {
      setLoadingStudents(false);
    }
  };

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const handleFromClassChange = (value: string) => {
    setSelectedFromClass(value);
    setSelectedToClass("");
    setSelectedToStream("");
    setStudents([]);
    setSelectedStudents([]);
    setError("");
    setSuccess("");
    fetchStudentsByClass(value);
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    }
  };

  const handleToggleStudent = (studentId: number) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // ============================================================
  // 🔥 PROMOTE STUDENTS
  // ============================================================
  const handlePromote = async () => {
    if (selectedStudents.length === 0) {
      setError("Tafadhali chagua angalau mwanafunzi mmoja");
      return;
    }

    if (!selectedToClass) {
      setError("Tafadhali chagua darasa lengwa");
      return;
    }

    setPromoting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        student_ids: selectedStudents,
        from_class_id: parseInt(selectedFromClass),
        to_class_id: parseInt(selectedToClass),
        to_stream_id:
          selectedToStream && selectedToStream !== "none" ? parseInt(selectedToStream) : null,
        school_id: parseInt(schoolId),
      };

      console.log("📤 Inapandisha wanafunzi:", payload);

      const response = await fetch(`${API_BASE}/api/v1/primary/promote/promote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kupandisha wanafunzi");
      }

      const result = await response.json();
      setSuccess(
        result.message || `✅ Wanafunzi ${selectedStudents.length} wamepandishwa kikamilifu!`
      );
      setSelectedStudents([]);

      // Refresh students list
      fetchStudentsByClass(selectedFromClass);
    } catch (err: any) {
      console.error("Kosa:", err);
      setError(err.message || "Imeshindwa kupandisha wanafunzi");
    } finally {
      setPromoting(false);
    }
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const selectedCount = selectedStudents.length;

  const selectedClass = classes.find((c) => c.id.toString() === selectedToClass);
  const availableStreams = selectedClass?.streams || [];

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
          title="Panda Wanafunzi"
          subtitle="Hamisha wanafunzi kutoka darasa moja kwenda darasa linalofuata"
          icon={<GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <School className="h-3 w-3 sm:h-4 sm:w-4" />
              ID: {schoolId}
            </span>
          }
          action={
            isTeacher && (
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
                  Jumla ya Madarasa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalClasses}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <School className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wanafunzi
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStudents}
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
                  Wamechaguliwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {selectedCount}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Kitendo
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                 {isTeacher ? "Mwalimu" : "admin"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Promotion Settings Card */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Mipangilio ya Upandishaji
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* From Class */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <School className="h-3.5 w-3.5 text-sky-600" />
                  Kutoka Darasa *
                </Label>
                <Select value={selectedFromClass} onValueChange={handleFromClassChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua darasa la sasa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFromClass && (
                  <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Darasa limechaguliwa
                  </p>
                )}
              </div>

              {/* To Class */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-600" />
                  Kwenda Darasa *
                </Label>
                <Select
                  value={selectedToClass}
                  onValueChange={setSelectedToClass}
                  disabled={!selectedFromClass}
                >
                  <SelectTrigger
                    className={cn(
                      "bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm",
                      !selectedFromClass && "opacity-50"
                    )}
                  >
                    <SelectValue placeholder="Chagua darasa lengwa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes
                      .filter((c) => c.id.toString() !== selectedFromClass)
                      .map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {!selectedFromClass && (
                  <p className="text-[10px] sm:text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Chagua darasa la sasa kwanza
                  </p>
                )}
                {selectedToClass && (
                  <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Darasa lengwa limechaguliwa
                  </p>
                )}
              </div>

              {/* To Stream */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-purple-600" />
                  Kwenda Mkondo (Si Lazima)
                </Label>
                <Select
                  value={selectedToStream}
                  onValueChange={setSelectedToStream}
                  disabled={!selectedToClass || availableStreams.length === 0}
                >
                  <SelectTrigger
                    className={cn(
                      "bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm",
                      (!selectedToClass || availableStreams.length === 0) && "opacity-50"
                    )}
                  >
                    <SelectValue placeholder="Chagua mkondo (si lazima)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="none">Mkondo ule ule</SelectItem>
                    {availableStreams.map((stream) => (
                      <SelectItem key={stream.id} value={stream.id.toString()}>
                        Mkondo {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedToClass && availableStreams.length === 0 && (
                  <p className="text-[10px] sm:text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Hakuna mikondo kwa darasa hili
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Students Table */}
        {students.length > 0 && (
          <MobileCard delay={200}>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100 gap-3 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                {isTeacher ? "Wanafunzi Wangu" : "Wanafunzi katika Darasa Lililochaguliwa"}
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({students.length} wanafunzi)
                </span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="border-gray-300 rounded-xl text-xs sm:text-sm h-8 sm:h-9 touch-feedback w-full sm:w-auto"
              >
                {selectedStudents.length === students.length ? "Ondoa Zote" : "Chagua Zote"}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loadingStudents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
              ) : (
                <>
                  <MobileTableWrapper>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80">
                          <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">
                            Chagua
                          </TableHead>
                          <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                          <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina la Mwanafunzi</TableHead>
                          <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Namba</TableHead>
                          <TableHead className="text-xs sm:text-sm hidden md:table-cell">Darasa</TableHead>
                          <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Mkondo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 sm:py-16">
                              <div className="flex flex-col items-center gap-2">
                                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                                <p className="text-gray-500 text-sm sm:text-base">
                                  Hakuna wanafunzi katika darasa hili
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          students.map((student, idx) => (
                            <TableRow
                              key={student.id}
                              className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group animate-fadeIn"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={selectedStudents.includes(student.id)}
                                  onCheckedChange={() => handleToggleStudent(student.id)}
                                  className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 rounded-lg"
                                />
                              </TableCell>
                              <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                                {idx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                                    {student.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs sm:text-sm hidden sm:table-cell">
                                {student.roll_number || "-"}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                                {classes.find((c) => c.id === student.class_id)?.name || "-"}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                                {student.stream_id
                                  ? classes
                                      .find((c) => c.id === student.class_id)
                                      ?.streams.find((s) => s.id === student.stream_id)?.name || "-"
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </MobileTableWrapper>

                  {/* Promote Button - PRO MAX */}
                  {students.length > 0 && (
                    <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs sm:text-sm text-gray-500">
                        {selectedStudents.length > 0 ? (
                          <span>
                            ✅ <span className="font-bold text-emerald-600">{selectedStudents.length}</span>{" "}
                            wanafunzi wamechaguliwa kupandishwa
                          </span>
                        ) : (
                          <span>💡 Chagua wanafunzi unaotaka kupandisha</span>
                        )}
                      </div>
                      <Button
                        onClick={handlePromote}
                        disabled={promoting || selectedStudents.length === 0 || !selectedToClass}
                        className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback w-full sm:w-auto"
                      >
                        {promoting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                        Panda Wanafunzi ({selectedStudents.length})
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </MobileCard>
        )}

        {/* No Students Message */}
        {selectedFromClass && students.length === 0 && !loadingStudents && (
          <MobileCard>
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">
                  Hakuna wanafunzi katika darasa hili
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {isTeacher
                    ? "Hujapangiwa wanafunzi katika darasa hili"
                    : "Darasa hili halina wanafunzi"}
                </p>
              </div>
            </CardContent>
          </MobileCard>
        )}

        {/* Select Class Prompt */}
        {!selectedFromClass && (
          <MobileCard>
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-sky-100 rounded-full">
                  <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-sky-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">
                  Chagua darasa la sasa kuona wanafunzi
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Chagua "Kutoka Darasa" juu kuanza
                </p>
              </div>
            </CardContent>
          </MobileCard>
        )}

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <School className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">📚 Chagua Darasa</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Chagua darasa la sasa la wanafunzi unaotaka kupandisha
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">⬆️ Panda Wanafunzi</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Chagua wanafunzi na uwapandishe kwenye darasa jipya
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
                <p className="font-medium text-amber-800 text-xs sm:text-sm">💾 Historia Inahifadhiwa</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Taarifa zote za wanafunzi, alama, na historia zinahifadhiwa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Panda Wanafunzi</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalClasses} madarasa</span>
            <span>•</span>
            <span>👨‍🎓 {totalStudents} wanafunzi</span>
            <span>•</span>
            <span>✅ {selectedCount} wamechaguliwa</span>
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