// app/primary/reports/class-summary/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Download,
  FileText,
  Printer,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Award,
  School,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  Sparkles,
  Layers,
  Clock,
  Menu,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Star,
  ChevronRight,
  Globe,
  Filter,
  X,
  GraduationCap,
  Crown,
  Trophy,
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

interface SchoolClass {
  id: number;
  name: string;
  school_id: number;
}

interface SubjectGradeSummary {
  subject: string;
  grades: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
  position?: number;
  gpa?: number;
}

interface DivisionSummary {
  A: { M: number; F: number };
  B: { M: number; F: number };
  C: { M: number; F: number };
  D: { M: number; F: number };
  E: { M: number; F: number };
  total_male: number;
  total_female: number;
  total_students: number;
}

interface SummaryData {
  school_name: string;
  region: string;
  class_name: string;
  exam_type: string;
  year: number;
  division_summary: DivisionSummary;
  registration_summary: {
    male_reg: number;
    female_reg: number;
    total_reg: number;
  };
  results: Array<{
    student_id: number;
    exam_no: string;
    name: string;
    sex: string;
    subjects: (number | string)[];
    total: number;
    average: number;
    grade: string;
    position: number;
  }>;
  subject_names: string[];
  subject_grade_summary: SubjectGradeSummary[];
}

// 🔥 PRIMARY EXAM TYPES
const AINA_ZAMTIHANI_CHAGUO = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL"];

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
      <div className="px-4 sm:px-0 min-w-[800px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function MuhtasariWaMatokeoYaDarasaPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number>(4);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [examTypes, setExamTypes] = useState<string[]>(AINA_ZAMTIHANI_CHAGUO);
  const [region, setRegion] = useState("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingExamTypes, setLoadingExamTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ============================================================
  // 🔥 USE EFFECT - INIT
  // ============================================================

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/primary/dashboard");
      return;
    }

    setToken(storedToken);
    setUserSchoolId(schoolId ? parseInt(schoolId) : 4);
    fetchClasses(storedToken);
    fetchExamTypes(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES
  // ============================================================

  const fetchClasses = async (authToken: string) => {
    setLoadingClasses(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/classes`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const primaryClasses = data.filter((cls: SchoolClass) => {
          const name = cls.name.toLowerCase();
          return (
            name.includes("std") ||
            name.includes("darasa") ||
            name.includes("standard") ||
            name.match(/[1-7]/)
          );
        });
        setClasses(primaryClasses);
        if (primaryClasses && primaryClasses.length > 0) {
          setSelectedClass(primaryClasses[0].id.toString());
        } else {
          setError("Hakuna madarasa ya msingi (1-7) yaliyopatikana");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Imeshindwa kupata madarasa: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Tatizo la mtandao wakati wa kupata madarasa");
    } finally {
      setLoadingClasses(false);
    }
  };

  // ============================================================
  // 🔥 FETCH EXAM TYPES
  // ============================================================

  const fetchExamTypes = async (authToken: string) => {
    setLoadingExamTypes(true);
    setError(null);
    try {
      const schoolId = localStorage.getItem("school_id") || "4";
      const url = `${API_BASE}/api/v1/primary/marks/exam-types?school_id=${schoolId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const types = data.exam_types || AINA_ZAMTIHANI_CHAGUO;
        setExamTypes(types);
        if (types.length > 0 && !selectedExamType) {
          setSelectedExamType(types[0]);
        }
      } else {
        setExamTypes(AINA_ZAMTIHANI_CHAGUO);
        setSelectedExamType(AINA_ZAMTIHANI_CHAGUO[0]);
      }
    } catch (err) {
      console.error("Error fetching exam types:", err);
      setExamTypes(AINA_ZAMTIHANI_CHAGUO);
      setSelectedExamType(AINA_ZAMTIHANI_CHAGUO[0]);
    } finally {
      setLoadingExamTypes(false);
    }
  };

  // ============================================================
  // 🔥 CALCULATE SUBJECT POSITIONS
  // ============================================================

  const calculateSubjectPositions = (
    subjectGradeSummary: SubjectGradeSummary[]
  ): SubjectGradeSummary[] => {
    const gradePoints: { [key: string]: number } = { A: 1, B: 2, C: 3, D: 4, E: 5 };

    const withGPA = subjectGradeSummary.map((item) => {
      const grades = item.grades;
      const totalStudents = grades.A + grades.B + grades.C + grades.D + grades.E;

      let totalPoints = 0;
      totalPoints += grades.A * gradePoints.A;
      totalPoints += grades.B * gradePoints.B;
      totalPoints += grades.C * gradePoints.C;
      totalPoints += grades.D * gradePoints.D;
      totalPoints += grades.E * gradePoints.E;

      const gpa = totalStudents > 0 ? totalPoints / totalStudents : 0;

      return {
        ...item,
        gpa: parseFloat(gpa.toFixed(3)),
        position: 0,
      };
    });

    const sorted = [...withGPA].sort((a, b) => (a.gpa || 0) - (b.gpa || 0));
    sorted.forEach((item, idx) => {
      item.position = idx + 1;
    });

    return sorted;
  };

  // ============================================================
  // 🔥 LOAD SUMMARY
  // ============================================================

  const loadSummary = async () => {
    if (!selectedClass) {
      setError("Tafadhali chagua darasa");
      return;
    }
    if (!selectedExamType) {
      setError("Tafadhali chagua aina ya mtihani");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let url = `${API_BASE}/api/v1/primary/marks/class/${selectedClass}/summary-view?exam_type=${selectedExamType}`;
      if (region && region.trim() !== "") {
        url += `&region=${encodeURIComponent(region)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        let subjectGradeSummary = data.subject_grade_summary || [];
        if (subjectGradeSummary.length > 0) {
          subjectGradeSummary = calculateSubjectPositions(subjectGradeSummary);
        }

        const transformedData: SummaryData = {
          school_name: data.school_name || "SHULE YA MSINGI",
          region: data.region || "_________________________",
          class_name: data.class_name || "Darasa",
          exam_type: data.exam_type || selectedExamType,
          year: data.year || new Date().getFullYear(),
          division_summary: {
            A: data.division_summary?.A || { M: 0, F: 0 },
            B: data.division_summary?.B || { M: 0, F: 0 },
            C: data.division_summary?.C || { M: 0, F: 0 },
            D: data.division_summary?.D || { M: 0, F: 0 },
            E: data.division_summary?.E || { M: 0, F: 0 },
            total_male: data.division_summary?.total_male || 0,
            total_female: data.division_summary?.total_female || 0,
            total_students: data.division_summary?.total_students || 0,
          },
          registration_summary: {
            male_reg: data.registration_summary?.male_reg || 0,
            female_reg: data.registration_summary?.female_reg || 0,
            total_reg: data.registration_summary?.total_reg || 0,
          },
          results: data.results || [],
          subject_names: data.subject_names || [],
          subject_grade_summary: subjectGradeSummary,
        };

        setSummaryData(transformedData);
        setSuccess(`✅ Matokeo ya ${data.results?.length || 0} wanafunzi yamepakiwa!`);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Imeshindwa kupakia data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error loading summary:", err);
      setError("Tatizo la mtandao wakati wa kupakia muhtasari");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 DOWNLOAD EXCEL
  // ============================================================

  const downloadExcel = async () => {
    if (!selectedClass) {
      setError("Tafadhali chagua darasa");
      return;
    }
    if (!selectedExamType) {
      setError("Tafadhali chagua aina ya mtihani");
      return;
    }

    setError(null);

    try {
      let url = `${API_BASE}/api/v1/primary/marks/class/${selectedClass}/export-excel?exam_type=${selectedExamType}`;
      if (region && region.trim() !== "") {
        url += `&region=${encodeURIComponent(region)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kupakua Excel");
      }

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      const className = summaryData?.class_name || "Darasa";
      a.download = `${className}_${selectedExamType}_Matokeo_Primary.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlBlob);

      setSuccess("✅ Faili ya Excel imepakuliwa kikamilifu!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error downloading Excel:", err);
      setError(err.message || "Imeshindwa kupakua faili ya Excel");
    }
  };

  // ============================================================
  // 🔥 HELPERS
  // ============================================================

  const handlePrint = () => {
    window.print();
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-emerald-100 text-emerald-800 font-bold";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-amber-100 text-amber-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "E":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const getClassDisplayName = (className: string) => {
    const primaryMap: { [key: string]: string } = {
      "Std 1": "Darasa la I",
      Std1: "Darasa la I",
      "Standard 1": "Darasa la I",
      "Std 2": "Darasa la II",
      Std2: "Darasa la II",
      "Standard 2": "Darasa la II",
      "Std 3": "Darasa la III",
      Std3: "Darasa la III",
      "Standard 3": "Darasa la III",
      "Std 4": "Darasa la IV",
      Std4: "Darasa la IV",
      "Standard 4": "Darasa la IV",
      "Std 5": "Darasa la V",
      Std5: "Darasa la V",
      "Standard 5": "Darasa la V",
      "Std 6": "Darasa la VI",
      Std6: "Darasa la VI",
      "Standard 6": "Darasa la VI",
      "Std 7": "Darasa la VII",
      Std7: "Darasa la VII",
      "Standard 7": "Darasa la VII",
    };
    return primaryMap[className] || className;
  };

  const refreshData = async () => {
    await Promise.all([fetchClasses(token), fetchExamTypes(token)]);
    if (selectedClass && selectedExamType) {
      await loadSummary();
    }
  };

  const getDivisionTotal = (data: { M: number; F: number } | undefined): number => {
    if (!data) return 0;
    return (data.M || 0) + (data.F || 0);
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalClasses = classes.length;
  const totalStudents = summaryData?.results?.length || 0;
  const totalReg = summaryData?.registration_summary?.total_reg || 0;
  const totalExamTypes = examTypes.length;

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================

  if (loadingClasses || loadingExamTypes) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia data ya Primary...
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
          title="Muhtasari wa Matokeo ya Darasa"
          subtitle="Tazama, chapisha na pakua ripoti kamili ya utendaji wa darasa"
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              ID: {userSchoolId}
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
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
                  Wanafunzi Waliojitokeza
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
                  Jumla ya Waliojiandikisha
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalReg}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Aina za Mtihani
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalExamTypes}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess(null)} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError(null)} />}

        {/* Filters Card */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-sky-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Vichujio</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                  Chagua Darasa *
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue
                      placeholder={classes.length === 0 ? "Hakuna madarasa" : "Chagua darasa"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Hakuna madarasa (I-VII)
                      </SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {getClassDisplayName(cls.name)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {classes.length === 0 && (
                  <p className="text-[10px] sm:text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Hakuna madarasa ya msingi (I-VII)
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  Aina ya Mtihani *
                </Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua aina ya mtihani" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {examTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-purple-600" />
                  Wilaya / Mkoa
                </Label>
                <Input
                  type="text"
                  placeholder="Mfano: Singida, Mbeya"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                />
              </div>

              <div className="flex items-end animate-slideIn" style={{ animationDelay: "400ms" }}>
                <Button
                  onClick={loadSummary}
                  disabled={loading || classes.length === 0}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Inapakia..." : "Onesha Matokeo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Action Buttons */}
        {summaryData && !loading && (
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3 no-print">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-1 sm:gap-2 rounded-xl border-sky-300 text-sky-700 hover:bg-sky-50 text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Chapisha
            </Button>
            <Button
              onClick={downloadExcel}
              className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Pakua Excel
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <MobileCard>
            <CardContent className="py-12 sm:py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">Inapakia matokeo ya darasa...</p>
            </CardContent>
          </MobileCard>
        )}

        {/* Results Display */}
        {summaryData && !loading && (
          <div id="print-content" className="space-y-4 sm:space-y-6">
            {/* School Header */}
            <div className="text-center py-4">
              <h2 className="text-base sm:text-xl font-bold text-gray-800">
                JAMHURI YA MUUNGANO WA TANZANIA
              </h2>
              <h3 className="text-sm sm:text-lg text-gray-700">OFISI YA RAIS</h3>
              <h3 className="text-sm sm:text-lg text-gray-700">TAWALA ZA MIKOA NA SERIKALI ZA MITAA</h3>
              <h3 className="text-sm sm:text-lg font-bold text-sky-700 mt-1">
                {summaryData.region || "WILAYA"}
              </h3>
              <h3 className="text-base sm:text-xl font-bold text-gray-800 mt-3">
                {summaryData.class_name} MATOKEO YA {summaryData.exam_type} {summaryData.year}
              </h3>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                {summaryData.school_name}
              </h3>
            </div>

            {/* Grade Summary */}
            <MobileCard delay={100}>
              <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
              <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-sky-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-gray-800">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                  Muhtasari wa Madaraja (A-E)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {["A", "B", "C", "D", "E"].map((grade) => {
                    const data = summaryData.division_summary?.[
                      grade as keyof DivisionSummary
                    ] as { M: number; F: number } | undefined;
                    const total = getDivisionTotal(data);
                    return (
                      <div key={grade} className="bg-gray-50 rounded-lg p-2 sm:p-3 border">
                        <div className="text-xl sm:text-2xl font-bold text-gray-800">
                          {total}
                        </div>
                        <div
                          className={`text-xs sm:text-sm font-semibold ${getGradeColor(
                            grade
                          )} px-2 py-0.5 rounded-full inline-block`}
                        >
                          Daraja {grade}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Wav: {data?.M || 0} | Was: {data?.F || 0}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-center text-xs sm:text-sm text-gray-600">
                  Jumla ya Wanafunzi: {summaryData.registration_summary?.total_reg || 0}
                </div>
              </CardContent>
            </MobileCard>

            {/* Registration Summary */}
            <MobileCard delay={200}>
              <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-gray-800">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  Muhtasari wa Usajili
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="text-xl sm:text-2xl font-bold text-blue-700">
                      {summaryData.registration_summary?.male_reg || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Wavulana</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                    <div className="text-xl sm:text-2xl font-bold text-pink-700">
                      {summaryData.registration_summary?.female_reg || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Wasichana</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <div className="text-xl sm:text-2xl font-bold text-purple-700">
                      {summaryData.registration_summary?.total_reg || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Jumla</div>
                  </div>
                </div>
              </CardContent>
            </MobileCard>

            {/* Student Results Table */}
            <MobileCard delay={300}>
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />
              <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-cyan-50 to-sky-50">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-gray-800">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
                  Matokeo ya Wanafunzi
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({summaryData.results.length} wanafunzi)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MobileTableWrapper>
                  <table className="w-full border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1.5 sm:p-2 w-10 sm:w-12 text-center">#</th>
                        <th className="border p-1.5 sm:p-2">N. MTIHANI</th>
                        <th className="border p-1.5 sm:p-2 text-left min-w-[220px] sm:min-w-[240px]">JINA KAMILI</th>
                        <th className="border p-1.5 sm:p-2 w-10 sm:w-12 text-center">J</th>
                        {summaryData.subject_names.map((sub) => (
                          <th key={sub} className="border p-1.5 sm:p-2 text-center min-w-[50px] sm:min-w-[60px]">
                            {sub}
                          </th>
                        ))}
                        <th className="border p-1.5 sm:p-2 text-center min-w-[40px]">Jumla</th>
                        <th className="border p-1.5 sm:p-2 text-center min-w-[50px]">Wastani</th>
                        <th className="border p-1.5 sm:p-2 text-center min-w-[40px]">Dar.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.results.map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                          <td className="border p-1.5 sm:p-2 text-center font-bold">
                            {student.position}
                          </td>
                          <td className="border p-1.5 sm:p-2 text-center font-mono text-[10px] sm:text-xs">
                            {student.exam_no}
                          </td>
                          <td className="border p-1.5 sm:p-2 font-medium truncate max-w-[80px] sm:max-w-[150px]">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold flex-shrink-0">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              {student.name}
                            </div>
                          </td>
                          <td className="border p-1.5 sm:p-2 text-center">{student.sex}</td>
                          {student.subjects.map((score, i) => (
                            <td key={i} className="border p-1.5 sm:p-2 text-center">
                              {score !== "" && score !== null ? score : "-"}
                            </td>
                          ))}
                          <td className="border p-1.5 sm:p-2 text-center font-semibold">
                            {student.total}
                          </td>
                          <td className="border p-1.5 sm:p-2 text-center">
                            {student.average}
                          </td>
                          <td className="border p-1.5 sm:p-2 text-center">
                            <span
                              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${getGradeColor(
                                student.grade
                              )}`}
                            >
                              {student.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </MobileTableWrapper>
              </CardContent>
            </MobileCard>

            {/* Subject Grade Summary */}
            {summaryData.subject_grade_summary &&
              summaryData.subject_grade_summary.length > 0 && (
                <MobileCard delay={400}>
                  <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
                  <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-gray-800">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      Muhtasari wa Madaraja ya Masomo (A-E)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MobileTableWrapper>
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-1.5 sm:p-2 text-center">Daraja</th>
                            <th className="border p-1.5 sm:p-2 text-center">Jumla</th>
                            {summaryData.subject_names.map((subject) => (
                              <th key={subject} className="border p-1.5 sm:p-2 text-center min-w-[60px] sm:min-w-[70px]">
                                {subject}
                              </th>
                            ))}
                            <th className="border p-1.5 sm:p-2 text-center">Nafasi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {["A", "B", "C", "D", "E"].map((grade) => {
                            const total = summaryData.subject_grade_summary.reduce(
                              (sum, subj) => {
                                return sum + (subj.grades[grade as keyof typeof subj.grades] || 0);
                              },
                              0
                            );

                            return (
                              <tr
                                key={grade}
                                className={getGradeColor(grade).replace("font-bold", "").trim()}
                              >
                                <td className="border p-1.5 sm:p-2 text-center font-bold">{grade}</td>
                                <td className="border p-1.5 sm:p-2 text-center font-bold">{total}</td>
                                {summaryData.subject_grade_summary.map((subj) => (
                                  <td key={subj.subject} className="border p-1.5 sm:p-2 text-center">
                                    {subj.grades[grade as keyof typeof subj.grades] || 0}
                                  </td>
                                ))}
                                <td className="border p-1.5 sm:p-2 text-center">-</td>
                              </tr>
                            );
                          })}
                          <tr className="bg-gray-100 font-bold">
                            <td colSpan={2} className="border p-1.5 sm:p-2 text-center">NAFASI</td>
                            {summaryData.subject_grade_summary.map((subj) => (
                              <td key={subj.subject} className="border p-1.5 sm:p-2 text-center">
                                {subj.position || "-"}
                              </td>
                            ))}
                            <td className="border p-1.5 sm:p-2 text-center"></td>
                          </tr>
                        </tbody>
                      </table>
                    </MobileTableWrapper>
                  </CardContent>
                </MobileCard>
              )}
          </div>
        )}

        {/* No Data State */}
        {!summaryData && !loading && !error && (
          <MobileCard>
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">Hakuna matokeo ya kuonyesha.</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Chagua darasa na aina ya mtihani, kisha bonyeza "Onesha Matokeo"
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
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">👀 Tazama Matokeo</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Tazama matokeo kamili ya darasa kwa aina ya mtihani
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">📥 Pakua Ripoti</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Pakua ripoti ya Excel kwa uchambuzi wa kina
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🖨️ Chapisha</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Chapisha ripoti kwa matumizi ya ofisi na madarasa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Muhtasari wa Matokeo</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalClasses} madarasa</span>
            <span>•</span>
            <span>👨‍🎓 {totalStudents} wanafunzi</span>
            <span>•</span>
            <span>📊 {totalExamTypes} aina za mtihani</span>
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          #print-content {
            margin: 0;
            padding: 0;
          }
          .shadow-md,
          .shadow-lg,
          .shadow-xl {
            box-shadow: none !important;
          }
          .rounded-2xl,
          .rounded-xl,
          .rounded-lg {
            border-radius: 0 !important;
          }
          .border {
            border-color: #000 !important;
          }
          @page {
            size: A4 landscape;
            margin: 0.5cm;
          }
        }

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