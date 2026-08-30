// app/reports/class-summary/page.tsx

"use client";

import React, { useState, useEffect, Fragment } from "react";
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
  ChevronLeft,
  Sparkles,
  CheckCircle,
  Crown,
  Star,
  Trophy,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Clock,
  Layers,
  BarChart3,
  PieChart,
  GraduationCap,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Shield,
  UserCog,
  Globe,
  Building,
  BadgeCheck,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  ArrowRight,
  Zap,
  Rocket,
  Award as AwardIcon,
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
}

interface GradeData {
  M: number;
  F: number;
  Total: number;
}

interface SubjectGradeData {
  subject: string;
  A: GradeData;
  B: GradeData;
  C: GradeData;
  D: GradeData;
  F: GradeData;
  GPA: number;
  position: number;
}

interface DivisionData {
  M: number;
  F: number;
}

interface SummaryData {
  school_name: string;
  region: string;
  class_name: string;
  exam_type: string;
  year: number;
  division_summary: {
    I: DivisionData;
    II: DivisionData;
    III: DivisionData;
    IV: DivisionData;
    O: DivisionData;
    total_male: number;
    total_female: number;
    total_students: number;
  };
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
    points: number;
    division: string;
    position: number;
  }>;
  subject_names: string[];
  subject_grade_summary: Array<{
    subject: string;
    grades: { A: number; B: number; C: number; D: number; F: number };
  }>;
  subject_gpa_data: SubjectGradeData[];
}

const DEFAULT_EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

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
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 md:p-8 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-2xl shadow-lg backdrop-blur-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-blue-100/80 mt-0.5 truncate">
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
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]",
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
  type: "error" | "info" | "warning" | "success";
  message: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  const styles = {
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
  };

  const icons = {
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
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
        "transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95",
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
      {/* 🔥 Animation line at bottom */}
      <div className="mt-2 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft" />
      </div>
    </div>
  );
}

// ============================================================
// 🔥 HELPER FUNCTIONS
// ============================================================
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
    case "F":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
};

const getDivisionColor = (division: string) => {
  switch (division) {
    case "I":
      return "bg-green-100 text-green-800";
    case "II":
      return "bg-blue-100 text-blue-800";
    case "III":
      return "bg-yellow-100 text-yellow-800";
    case "IV":
      return "bg-orange-100 text-orange-800";
    case "O":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getClassDisplayName = (className: string) => {
  const romanMap: { [key: string]: string } = {
    "Form 1": "Form I",
    Form1: "Form I",
    "Form 2": "Form II",
    Form2: "Form II",
    "Form 3": "Form III",
    Form3: "Form III",
    "Form 4": "Form IV",
    Form4: "Form IV",
  };
  return romanMap[className] || className;
};

const getDivisionValue = (data: DivisionData | undefined | null, key: keyof DivisionData): number => {
  if (!data) return 0;
  return data[key] || 0;
};

const getDivisionTotal = (data: DivisionData | undefined | null): number => {
  if (!data) return 0;
  return (data.M || 0) + (data.F || 0);
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function ClassSummaryPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [examTypes, setExamTypes] = useState<string[]>(DEFAULT_EXAM_TYPES);
  const [region, setRegion] = useState("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingExamTypes, setLoadingExamTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchClasses(storedToken);
    fetchExamTypes(storedToken);
  }, [router]);

  const fetchClasses = async (authToken: string) => {
    setLoadingClasses(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/classes`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        if (data && data.length > 0) {
          setSelectedClass(data[0].id.toString());
        } else {
          setError("No classes found for your school");
        }
      } else {
        setError(`Failed to fetch classes: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Network error while fetching classes");
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchExamTypes = async (authToken: string) => {
    setLoadingExamTypes(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/exam-types`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const types = data.exam_types || DEFAULT_EXAM_TYPES;
        setExamTypes(types);
        if (types.length > 0 && !selectedExamType) {
          setSelectedExamType(types[0]);
        }
      } else {
        setExamTypes(DEFAULT_EXAM_TYPES);
        setSelectedExamType(DEFAULT_EXAM_TYPES[0]);
      }
    } catch (err) {
      console.error("Error fetching exam types:", err);
      setExamTypes(DEFAULT_EXAM_TYPES);
      setSelectedExamType(DEFAULT_EXAM_TYPES[0]);
    } finally {
      setLoadingExamTypes(false);
    }
  };

  const calculateSubjectGPA = (subjectGradeSummary: any[]): SubjectGradeData[] => {
    const gradePoints: { [key: string]: number } = { A: 1, B: 2, C: 3, D: 4, F: 5 };

    const subjectGPAData: SubjectGradeData[] = subjectGradeSummary.map((item) => {
      const grades = item.grades;
      const totalStudents = grades.A + grades.B + grades.C + grades.D + grades.F;

      let totalPoints = 0;
      totalPoints += grades.A * gradePoints.A;
      totalPoints += grades.B * gradePoints.B;
      totalPoints += grades.C * gradePoints.C;
      totalPoints += grades.D * gradePoints.D;
      totalPoints += grades.F * gradePoints.F;

      const GPA = totalStudents > 0 ? totalPoints / totalStudents : 0;

      return {
        subject: item.subject,
        A: { M: 0, F: 0, Total: grades.A },
        B: { M: 0, F: 0, Total: grades.B },
        C: { M: 0, F: 0, Total: grades.C },
        D: { M: 0, F: 0, Total: grades.D },
        F: { M: 0, F: 0, Total: grades.F },
        GPA: parseFloat(GPA.toFixed(3)),
        position: 0,
      };
    });

    const sortedByGPA = [...subjectGPAData].sort((a, b) => a.GPA - b.GPA);
    sortedByGPA.forEach((item, idx) => {
      item.position = idx + 1;
    });

    return subjectGPAData;
  };

  const loadSummary = async () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    if (!selectedExamType) {
      alert("Please select an exam type");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/api/v1/class/${selectedClass}/summary-view?exam_type=${selectedExamType}`;
      if (region && region.trim() !== "") {
        url += `&region=${encodeURIComponent(region)}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.subject_grade_summary && data.subject_grade_summary.length > 0) {
          const subjectGPAData = calculateSubjectGPA(data.subject_grade_summary);
          data.subject_gpa_data = subjectGPAData;
        } else {
          data.subject_gpa_data = [];
        }

        setSummaryData(data);
      } else {
        setError(`Failed to load data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error loading summary:", err);
      setError("Network error while loading summary");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    if (!selectedClass) return;
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/class/${selectedClass}/export-excel?exam_type=${selectedExamType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${summaryData?.class_name || "Class"}_${selectedExamType}_Results.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading Excel:", err);
      alert("Failed to download Excel file");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRetry = () => {
    if (token) {
      fetchClasses(token);
      fetchExamTypes(token);
    }
  };

  // Calculate stats
  const totalStudents = summaryData?.results?.length || 0;
  const totalSubjects = summaryData?.subject_names?.length || 0;

  if (loadingClasses || loadingExamTypes) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading data...
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
          title="Class Results Summary"
          subtitle="View, print, and export comprehensive class performance report"
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              Results Summary
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-white hover:bg-white/20 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Students
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStudents}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white/40 rounded-full animate-pulse-soft" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Subjects
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalSubjects}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft animation-delay-1000" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Divisions
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  I-0
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-white/40 rounded-full animate-pulse-soft animation-delay-2000" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Exam Type
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1 truncate max-w-[100px] sm:max-w-[180px]">
                  {selectedExamType || "N/A"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-white/40 rounded-full animate-pulse-soft animation-delay-1500" />
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Class Select */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  Select Class *
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue
                      placeholder={classes.length === 0 ? "No classes found" : "Choose class"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {getClassDisplayName(cls.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Type */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  Exam Type *
                </Label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select exam type" />
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

              {/* Region */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPinIcon className="h-3.5 w-3.5 text-purple-600" />
                  District / Region
                </Label>
                <Input
                  type="text"
                  placeholder="e.g., Kinondoni, Temeke"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                />
              </div>

              {/* Load Button */}
              <div className="flex items-end animate-slideIn" style={{ animationDelay: "400ms" }}>
                <Button
                  onClick={loadSummary}
                  disabled={loading || classes.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Loading..." : "Load Results"}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4">
                <MobileAlert type="error" message={error} onClose={() => setError(null)} />
              </div>
            )}
          </CardContent>
        </MobileCard>

        {/* Action Buttons */}
        {summaryData && !loading && (
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3 no-print">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-1 sm:gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Print Report</span>
              <span className="xs:hidden">Print</span>
            </Button>
            <Button
              onClick={downloadExcel}
              className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Export Excel</span>
              <span className="xs:hidden">Export</span>
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <MobileCard hover={false}>
            <CardContent className="py-12 sm:py-16 text-center">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">Loading class results...</p>
            </CardContent>
          </MobileCard>
        )}

        {/* Results Display */}
        {summaryData && !loading && (
          <div id="print-content" className="space-y-4 sm:space-y-6">
            {/* School Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">THE UNITED REPUBLIC OF TANZANIA</h2>
              <h3 className="text-base sm:text-lg text-gray-700">PRESIDENT'S OFFICE</h3>
              <h3 className="text-base sm:text-lg text-gray-700">REGIONAL ADMINISTRATION AND LOCAL GOVERNMENT</h3>
              <h3 className="text-base sm:text-lg font-bold text-blue-700 mt-1">{summaryData.region}</h3>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mt-3">
                {summaryData.class_name} {summaryData.exam_type} RESULTS {summaryData.year}
              </h3>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">{summaryData.school_name}</h3>
            </div>

            {/* Division & Registration Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <MobileCard hover={false} delay={100}>
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Award className="h-4 w-4 text-blue-600" />
                    Division Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 overflow-x-auto">
                  <table className="w-full border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1 text-center">Division</th>
                        <th className="border p-1 text-center">Male</th>
                        <th className="border p-1 text-center">Female</th>
                        <th className="border p-1 text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["I", "II", "III", "IV", "O"].map((div) => {
                        const key = div as keyof typeof summaryData.division_summary;
                        const divData = summaryData.division_summary[key];
                        const safeData =
                          divData && typeof divData === "object" && "M" in divData && "F" in divData
                            ? (divData as DivisionData)
                            : null;
                        return (
                          <tr key={div}>
                            <td className="border p-1 text-center font-bold">{div}</td>
                            <td className="border p-1 text-center">
                              {safeData ? getDivisionValue(safeData, "M") : 0}
                            </td>
                            <td className="border p-1 text-center">
                              {safeData ? getDivisionValue(safeData, "F") : 0}
                            </td>
                            <td className="border p-1 text-center">
                              {safeData ? getDivisionTotal(safeData) : 0}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50 font-bold">
                        <td className="border p-1 text-center">Total</td>
                        <td className="border p-1 text-center">
                          {summaryData.division_summary.total_male}
                        </td>
                        <td className="border p-1 text-center">
                          {summaryData.division_summary.total_female}
                        </td>
                        <td className="border p-1 text-center">
                          {summaryData.division_summary.total_students}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </MobileCard>

              <MobileCard hover={false} delay={200}>
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Users className="h-4 w-4 text-green-600" />
                    Registration Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 overflow-x-auto">
                  <table className="w-full border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1 text-left">Sex</th>
                        <th className="border p-1 text-center">REG</th>
                        <th className="border p-1 text-center">ABS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1">Male</td>
                        <td className="border p-1 text-center">{summaryData.registration_summary.male_reg}</td>
                        <td className="border p-1 text-center">0</td>
                      </tr>
                      <tr>
                        <td className="border p-1">Female</td>
                        <td className="border p-1 text-center">{summaryData.registration_summary.female_reg}</td>
                        <td className="border p-1 text-center">0</td>
                      </tr>
                      <tr className="bg-gray-50 font-bold">
                        <td className="border p-1">Total</td>
                        <td className="border p-1 text-center">{summaryData.registration_summary.total_reg}</td>
                        <td className="border p-1 text-center">0</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </MobileCard>
            </div>

            {/* Student Results Table */}
            <MobileCard hover={false} delay={300}>
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500" />
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 sm:p-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="h-4 w-4 text-cyan-600" />
                  Student Results
                  <span className="text-xs font-normal text-gray-400 ml-2">
                    ({summaryData.results.length} students)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <div className="scrollable">
                  <table className="w-full border-collapse text-[10px] sm:text-sm min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1 sm:p-2 w-8 sm:w-12 text-center">#</th>
                        <th className="border p-1 sm:p-2 text-center">EXAM NO</th>
                        <th className="border p-1 sm:p-2 text-left min-w-[180px]">STUDENT NAME</th>
                        <th className="border p-1 sm:p-2 w-8 sm:w-12 text-center hidden xs:table-cell">SEX</th>
                        {summaryData.subject_names.map((sub) => (
                          <th key={sub} className="border p-1 sm:p-2 text-center min-w-[40px] sm:min-w-[60px]">
                            {sub}
                          </th>
                        ))}
                        <th className="border p-1 sm:p-2 text-center">TOTAL</th>
                        <th className="border p-1 sm:p-2 text-center hidden sm:table-cell">AVG</th>
                        <th className="border p-1 sm:p-2 text-center">GRADE</th>
                        <th className="border p-1 sm:p-2 text-center hidden md:table-cell">POINTS</th>
                        <th className="border p-1 sm:p-2 text-center">DIV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.results.map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                          <td className="border p-1 sm:p-2 text-center">{student.position}</td>
                          <td className="border p-1 sm:p-2 text-center font-mono text-[8px] sm:text-sm">
                            {student.exam_no}
                          </td>
                          <td className="border p-1 sm:p-2 font-medium text-[10px] sm:text-sm">
                            {student.name}
                          </td>
                          <td className="border p-1 sm:p-2 text-center hidden xs:table-cell">
                            {student.sex}
                          </td>
                          {student.subjects.map((score, i) => (
                            <td key={i} className="border p-1 sm:p-2 text-center text-[10px] sm:text-sm">
                              {score !== "" && score !== null ? score : "-"}
                            </td>
                          ))}
                          <td className="border p-1 sm:p-2 text-center font-semibold text-[10px] sm:text-sm">
                            {student.total}
                          </td>
                          <td className="border p-1 sm:p-2 text-center hidden sm:table-cell text-[10px] sm:text-sm">
                            {student.average}
                          </td>
                          <td className="border p-1 sm:p-2 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-xs font-bold ${getGradeColor(
                                student.grade
                              )}`}
                            >
                              {student.grade}
                            </span>
                          </td>
                          <td className="border p-1 sm:p-2 text-center hidden md:table-cell text-[10px] sm:text-sm">
                            {student.points}
                          </td>
                          <td className="border p-1 sm:p-2 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-xs font-bold ${getDivisionColor(
                                student.division
                              )}`}
                            >
                              {student.division}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </MobileCard>

            {/* Subject Grade Summary */}
            {summaryData.subject_gpa_data && summaryData.subject_gpa_data.length > 0 && (
              <MobileCard hover={false} delay={400}>
                <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    Subject Grade Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <div className="scrollable">
                    <table className="w-full border-collapse text-[10px] sm:text-sm min-w-[700px]">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-1 sm:p-2 text-left">Grade</th>
                          <th className="border p-1 sm:p-2 text-center">Sex</th>
                          {summaryData.subject_names.map((subject) => (
                            <th key={subject} className="border p-1 sm:p-2 text-center min-w-[50px] sm:min-w-[70px]">
                              {subject}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {["A", "B", "C", "D", "F"].map((grade) => (
                          <Fragment key={grade}>
                            <tr
                              className={`${
                                grade === "A"
                                  ? "bg-emerald-50"
                                  : grade === "B"
                                  ? "bg-blue-50"
                                  : grade === "C"
                                  ? "bg-amber-50"
                                  : grade === "D"
                                  ? "bg-orange-50"
                                  : "bg-red-50"
                              }`}
                            >
                              <td rowSpan={3} className="border p-1 sm:p-2 text-center font-bold align-middle">
                                <span
                                  className={
                                    grade === "A"
                                      ? "text-emerald-700"
                                      : grade === "B"
                                      ? "text-blue-700"
                                      : grade === "C"
                                      ? "text-amber-700"
                                      : grade === "D"
                                      ? "text-orange-700"
                                      : "text-red-700"
                                  }
                                >
                                  {grade}
                                </span>
                              </td>
                              <td className="border p-1 sm:p-2 text-center">M</td>
                              {summaryData.subject_gpa_data.map((subj) => {
                                const key = grade as keyof Pick<
                                  SubjectGradeData,
                                  "A" | "B" | "C" | "D" | "F"
                                >;
                                const data = subj[key] as GradeData;
                                return (
                                  <td key={subj.subject} className="border p-1 sm:p-2 text-center">
                                    {data?.Total || 0}
                                  </td>
                                );
                              })}
                            </tr>
                            <tr
                              className={`${
                                grade === "A"
                                  ? "bg-emerald-50"
                                  : grade === "B"
                                  ? "bg-blue-50"
                                  : grade === "C"
                                  ? "bg-amber-50"
                                  : grade === "D"
                                  ? "bg-orange-50"
                                  : "bg-red-50"
                              }`}
                            >
                              <td className="border p-1 sm:p-2 text-center">F</td>
                              {summaryData.subject_gpa_data.map((subj) => {
                                const key = grade as keyof Pick<
                                  SubjectGradeData,
                                  "A" | "B" | "C" | "D" | "F"
                                >;
                                const data = subj[key] as GradeData;
                                return (
                                  <td key={subj.subject} className="border p-1 sm:p-2 text-center">
                                    {data?.Total || 0}
                                  </td>
                                );
                              })}
                            </tr>
                            <tr
                              className={`${
                                grade === "A"
                                  ? "bg-emerald-50"
                                  : grade === "B"
                                  ? "bg-blue-50"
                                  : grade === "C"
                                  ? "bg-amber-50"
                                  : grade === "D"
                                  ? "bg-orange-50"
                                  : "bg-red-50"
                              }`}
                            >
                              <td className="border p-1 sm:p-2 text-center font-bold">Total</td>
                              {summaryData.subject_gpa_data.map((subj) => {
                                const key = grade as keyof Pick<
                                  SubjectGradeData,
                                  "A" | "B" | "C" | "D" | "F"
                                >;
                                const data = subj[key] as GradeData;
                                return (
                                  <td key={subj.subject} className="border p-1 sm:p-2 text-center font-bold">
                                    {data?.Total || 0}
                                  </td>
                                );
                              })}
                            </tr>
                          </Fragment>
                        ))}

                        {/* GPA Row */}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan={2} className="border p-1 sm:p-2 text-center">
                            GPA
                          </td>
                          {summaryData.subject_gpa_data.map((subj) => (
                            <td key={subj.subject} className="border p-1 sm:p-2 text-center">
                              {subj.GPA}
                            </td>
                          ))}
                        </tr>

                        {/* POSITION Row */}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan={2} className="border p-1 sm:p-2 text-center">
                            POSITION
                          </td>
                          {summaryData.subject_gpa_data.map((subj) => (
                            <td key={subj.subject} className="border p-1 sm:p-2 text-center">
                              {subj.position}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </MobileCard>
            )}
          </div>
        )}

        {/* No Data State */}
        {!summaryData && !loading && !error && (
          <MobileCard hover={false}>
            <CardContent className="text-center py-12 sm:py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">No results to display.</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Select a class and exam type, then click "Load Results"
                </p>
              </div>
            </CardContent>
          </MobileCard>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Class Results Summary</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📊 {totalStudents} students</span>
            <span>•</span>
            <span>📚 {totalSubjects} subjects</span>
            <span>•</span>
            <span>🏆 {summaryData?.class_name || "Class"}</span>
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
          .rounded-3xl,
          .rounded-xl {
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

        @media (max-width: 399px) {
          .xs\\:inline {
            display: inline !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
          .xs\\:table-cell {
            display: table-cell !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:inline {
            display: none !important;
          }
          .xs\\:hidden {
            display: inline !important;
          }
          .xs\\:table-cell {
            display: none !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}