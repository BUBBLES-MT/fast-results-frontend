// app/reports/parent-report-class/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ClassParentReportPDF } from "@/components/ClassParentReportPDF";
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
  FileText,
  Calendar,
  User,
  MapPin,
  GraduationCap,
  BookOpen,
  Download,
  Printer,
  School,
  AlertCircle,
  CheckCircle,
  CalendarDays,
  Building,
  Trophy,
  ChevronLeft,
  Sparkles,
  Shield,
  Clock,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  Star,
  Crown,
  Users,
  Layers,
  ArrowRight,
  Zap,
  Award,
  RefreshCw,
  Globe,
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

interface SchoolAnnouncement {
  id: number;
  school_id: number;
  closing_date: string | null;
  opening_date: string | null;
}

interface SchoolData {
  id: number;
  name: string;
  district?: string;
  school_level?: string;
}

interface HeadmasterData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status: string;
  school_id: number;
}

interface ClassTeacher {
  id: number;
  name: string;
  role: string;
}

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
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
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
            {children && <div className="flex-shrink-0">{children}</div>}
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
const formatDateDisplay = (dateString: string | null) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatDateForBackend = (dateString: string | null) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
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

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function ParentReportClassPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("I");
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);

  const [announcement, setAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);

  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);

  const [headmasterData, setHeadmasterData] = useState<HeadmasterData | null>(null);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);

  const [classTeacher, setClassTeacher] = useState<ClassTeacher | null>(null);
  const [loadingClassTeacher, setLoadingClassTeacher] = useState(false);

  const [teacherDate, setTeacherDate] = useState(new Date().toISOString().split("T")[0]);
  const [headmasterDate, setHeadmasterDate] = useState(new Date().toISOString().split("T")[0]);

  const [teacherName, setTeacherName] = useState("");
  const [headmasterName, setHeadmasterName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [schoolName, setSchoolName] = useState("");

  // ============================================================
  // 🔥 FETCH SCHOOL DATA
  // ============================================================
  const fetchSchoolData = async (authToken: string, schoolId: string) => {
    try {
      setLoadingSchool(true);

      const response = await fetch(`${API_BASE}/api/v1/schools/${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSchoolData(data);
        setSchoolName(data.name || "");

        if (data.district && data.district.trim() !== "") {
          setDistrictName(data.district);
        }

        await fetchHeadmaster(authToken, schoolId);
      } else {
        await fetchHeadmaster(authToken, schoolId);
      }
    } catch (err) {
      console.error("Error fetching school data:", err);
      await fetchHeadmaster(authToken, schoolId);
    } finally {
      setLoadingSchool(false);
    }
  };

  // ============================================================
  // 🔥 FETCH HEADMASTER
  // ============================================================
  const fetchHeadmaster = async (authToken: string, schoolId: string) => {
    try {
      setLoadingHeadmaster(true);

      const response = await fetch(`${API_BASE}/api/v1/schools/${schoolId}/headmaster`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.name) {
          setHeadmasterData(data);
          setHeadmasterName(data.name);
          return;
        }
      }

      // Fallback - use logged-in user
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
      }
    } catch (err) {
      console.error("Error fetching headmaster:", err);
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
      }
    } finally {
      setLoadingHeadmaster(false);
    }
  };

  // ============================================================
  // 🔥 FETCH CLASS TEACHER
  // ============================================================
  const fetchClassTeacher = async (authToken: string, classId: string) => {
    try {
      setLoadingClassTeacher(true);

      const response = await fetch(`${API_BASE}/api/v1/classes/${classId}/teacher`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.name) {
          setClassTeacher(data);
          setTeacherName(data.name);
        } else {
          const userName = localStorage.getItem("user_name") || "";
          if (userName) setTeacherName(userName);
        }
      } else {
        const userName = localStorage.getItem("user_name") || "";
        if (userName) setTeacherName(userName);
      }
    } catch (err) {
      console.error("Error fetching class teacher:", err);
      const userName = localStorage.getItem("user_name") || "";
      if (userName) setTeacherName(userName);
    } finally {
      setLoadingClassTeacher(false);
    }
  };

  // ============================================================
  // 🔥 USEFFECT
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userName = localStorage.getItem("user_name") || "";
    const userRole = localStorage.getItem("user_type") || "";
    const schoolId = localStorage.getItem("school_id") || "";

    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);

    setTeacherName(userName);

    if (userRole?.toLowerCase() === "headmaster" || userRole?.toLowerCase() === "headmistress") {
      setHeadmasterName(userName);
    }

    fetchClasses(storedToken);

    if (schoolId) {
      fetchSchoolData(storedToken, schoolId);
      fetchAnnouncement(storedToken, schoolId);
    }
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES
  // ============================================================
  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/classes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        if (data.length > 0) {
          const firstClassId = data[0].id.toString();
          setSelectedClass(firstClassId);
          fetchClassTeacher(authToken, firstClassId);
        }
      } else {
        setError(`Failed to fetch classes: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Cannot connect to server. Please ensure backend is running.");
    } finally {
      setLoadingClasses(false);
    }
  };

  // ============================================================
  // 🔥 FETCH ANNOUNCEMENT
  // ============================================================
  const fetchAnnouncement = async (authToken: string, schoolId: string) => {
    try {
      setLoadingAnnouncement(true);
      const response = await fetch(`${API_BASE}/api/v1/school-announcements/teacher/${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncement(data);
      } else {
        setAnnouncement(null);
      }
    } catch (err) {
      console.error("Error fetching announcement:", err);
      setAnnouncement(null);
    } finally {
      setLoadingAnnouncement(false);
    }
  };

  // ============================================================
  // 🔥 HANDLE CLASS CHANGE
  // ============================================================
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    if (token && classId) {
      fetchClassTeacher(token, classId);
    }
  };

  // ============================================================
  // 🔥 GENERATE PDF
  // ============================================================
  const handleGeneratePDF = async () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    setLoading(true);
    setError("");
    setPdfData(null);

    try {
      const closingDate = announcement?.closing_date ? formatDateForBackend(announcement.closing_date) : "";
      const openingDate = announcement?.opening_date ? formatDateForBackend(announcement.opening_date) : "";

      const params = new URLSearchParams({
        term: selectedTerm,
        year: new Date().getFullYear().toString(),
        closing_date: closingDate,
        opening_date: openingDate,
        teacher_date: teacherDate,
        headmaster_date: headmasterDate,
        teacher_name: teacherName,
        headmaster_name: headmasterName,
        district_name: districtName,
        school_name: schoolName,
      });

      const url = `${API_BASE}/api/v1/class/${selectedClass}/parent-reports-pdf?${params.toString()}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPdfData(data);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalClasses = classes.length;

  if (loadingClasses || loadingSchool || loadingAnnouncement) {
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
          title="Class Progress Reports"
          subtitle="Generate comprehensive academic reports for all students in a class"
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalClasses} Classes
            </span>
          }
        >
          {schoolName && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              {schoolName}
            </span>
          )}
        </MobileHeader>

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
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white/40 rounded-full animate-pulse-soft" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Selected Class
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1 truncate max-w-[100px] sm:max-w-[180px]">
                  {selectedClass ? getClassDisplayName(classes.find(c => c.id.toString() === selectedClass)?.name || "") : "None"}
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
                  Term
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {selectedTerm}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
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
                  Status
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-1 truncate max-w-[80px] sm:max-w-[160px]">
                  {announcement ? "✅ Active" : "⏳ Pending"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-white/40 rounded-full animate-pulse-soft animation-delay-1500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Main Form Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Class and Term Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                  Select Class
                </Label>
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Choose a class" />
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

              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  Academic Term
                </Label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Choose term" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="I">Term I (Midterm + Terminal)</SelectItem>
                    <SelectItem value="II">Term II (Midterm + Annual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* School Calendar */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-5 border border-blue-100 animate-slideIn" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  School Calendar
                </h3>
                {loadingAnnouncement ? (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                    Loading dates...
                  </div>
                ) : announcement ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Dates loaded
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-amber-600">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    No dates set
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-red-500" />
                    Closing Date
                  </Label>
                  <Input
                    type="text"
                    value={announcement?.closing_date ? formatDateDisplay(announcement.closing_date) : ""}
                    className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium rounded-xl text-sm h-9 sm:h-10"
                    disabled={true}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-emerald-500" />
                    Reopening Date
                  </Label>
                  <Input
                    type="text"
                    value={announcement?.opening_date ? formatDateDisplay(announcement.opening_date) : ""}
                    className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium rounded-xl text-sm h-9 sm:h-10"
                    disabled={true}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>
            </div>

            {/* Teacher Section */}
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-indigo-100 animate-slideIn" style={{ animationDelay: "400ms" }}>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                <div className="p-1 bg-indigo-100 rounded-lg">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                </div>
                Class Teacher Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Full Name</Label>
                  <Input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-9 sm:h-10 text-sm"
                    placeholder="Enter teacher's full name"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Signature Date</Label>
                  <Input
                    type="date"
                    value={teacherDate}
                    onChange={(e) => setTeacherDate(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-9 sm:h-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Headmaster Section */}
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-4 sm:p-5 border border-purple-100 animate-slideIn" style={{ animationDelay: "500ms" }}>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                <div className="p-1 bg-purple-100 rounded-lg">
                  <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
                Head of School Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Full Name</Label>
                  <Input
                    type="text"
                    value={headmasterName}
                    onChange={(e) => setHeadmasterName(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-9 sm:h-10 text-sm"
                    placeholder="Enter headmaster's full name"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Signature Date</Label>
                  <Input
                    type="date"
                    value={headmasterDate}
                    onChange={(e) => setHeadmasterDate(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-9 sm:h-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* District Section */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-emerald-100 animate-slideIn" style={{ animationDelay: "600ms" }}>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded-lg">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
                District Information
              </h3>
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-xs sm:text-sm text-gray-600">District Name</Label>
                <Input
                  type="text"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-9 sm:h-10 text-sm"
                  placeholder="e.g., SINGIDA DC, MKALAMA, SINGIDA MANISPAA"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-2 sm:pt-4 animate-slideIn" style={{ animationDelay: "700ms" }}>
              {!pdfData ? (
                <Button
                  onClick={handleGeneratePDF}
                  disabled={loading || !selectedClass}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  )}
                  {loading ? "Preparing Data..." : "Generate Class Reports"}
                </Button>
              ) : (
                <PDFDownloadLink
                  document={<ClassParentReportPDF data={pdfData} />}
                  fileName={`Parent_Reports_${getClassDisplayName(selectedClass)}_Term${selectedTerm}.pdf`}
                  className="w-full"
                >
                  {({ loading: pdfLoading }) => (
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback"
                      disabled={pdfLoading}
                    >
                      {pdfLoading ? (
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      )}
                      {pdfLoading ? "Generating PDF..." : "Download Reports"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}

              <p className="text-[10px] sm:text-xs text-gray-400 mt-3 flex items-center gap-1 justify-center">
                <Printer className="h-3 w-3" />
                The PDF includes a complete report page for each student in the selected class
              </p>
            </div>
          </CardContent>
        </MobileCard>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">📄 One Report Per Student</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Each student gets their own dedicated report page
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">📅 Term-Based Reports</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Choose between Term I and Term II reports
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✅ Easy to Download</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Download all reports as a single PDF file
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Class Progress Reports</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalClasses} classes</span>
            <span>•</span>
            <span>📄 PDF reports</span>
            <span>•</span>
            <span>🏫 {schoolName || "School"}</span>
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