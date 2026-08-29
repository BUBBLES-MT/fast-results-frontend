// app/reports/student/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ParentReportPDF } from "@/components/ParentReportPDF";
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
  ArrowLeft,
  GraduationCap,
  School,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Download,
  Building,
  Trophy,
  CalendarDays,
  ChevronLeft,
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
  Award,
  BookOpen,
  UserCircle,
  BadgeCheck,
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
  class_name: string;
  stream_name: string;
  sex: string;
  school_id: number;
}

interface SchoolData {
  id: number;
  name: string;
  district?: string;
  region?: string;
  school_level?: string;
}

interface SchoolAnnouncement {
  id: number;
  school_id: number;
  closing_date: string | null;
  opening_date: string | null;
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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
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
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
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
  color = "blue",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "sky" | "rose" | "orange" | "cyan";
  subtitle?: string;
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
        "rounded-2xl p-3 sm:p-4 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
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

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function SingleStudentReportPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [token, setToken] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("I");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);

  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);
  const [schoolName, setSchoolName] = useState("");

  const [announcement, setAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);

  const [headmasterData, setHeadmasterData] = useState<HeadmasterData | null>(null);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);

  const [closingDate, setClosingDate] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [teacherDate, setTeacherDate] = useState(new Date().toISOString().split("T")[0]);
  const [headmasterDate, setHeadmasterDate] = useState(new Date().toISOString().split("T")[0]);
  const [teacherName, setTeacherName] = useState("");
  const [headmasterName, setHeadmasterName] = useState("");
  const [districtName, setDistrictName] = useState("");

  // ============================================================
  // 🔥 FETCH SCHOOL DATA
  // ============================================================
  const fetchSchoolData = async (authToken: string, schoolId: string) => {
    try {
      setLoadingSchool(true);
      console.log("🏫 Fetching school data from:", `${API_BASE}/api/v1/schools/${schoolId}`);

      const response = await fetch(`${API_BASE}/api/v1/schools/${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🏫 School data fetched:", data);

        setSchoolData(data);
        setSchoolName(data.name || "");

        if (data.district && data.district.trim() !== "") {
          setDistrictName(data.district);
          console.log("📍 District loaded:", data.district);
        }

        await fetchAnnouncement(authToken, schoolId);
        await fetchHeadmaster(authToken, schoolId);
      } else {
        console.error("❌ Failed to fetch school data:", response.status);
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
        console.log("📅 Announcement fetched:", data);
        setAnnouncement(data);

        if (data.closing_date) {
          const closeDate = new Date(data.closing_date);
          if (!isNaN(closeDate.getTime())) {
            setClosingDate(closeDate.toISOString().split("T")[0]);
          }
        }
        if (data.opening_date) {
          const openDate = new Date(data.opening_date);
          if (!isNaN(openDate.getTime())) {
            setOpeningDate(openDate.toISOString().split("T")[0]);
          }
        }
      } else {
        console.log("ℹ️ No announcement found for this school");
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
  // 🔥 FETCH HEADMASTER
  // ============================================================
  const fetchHeadmaster = async (authToken: string, schoolId: string) => {
    try {
      setLoadingHeadmaster(true);
      console.log("👑 Fetching headmaster from:", `${API_BASE}/api/v1/schools/${schoolId}/headmaster`);

      const response = await fetch(`${API_BASE}/api/v1/schools/${schoolId}/headmaster`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("👑 Headmaster data:", data);

        if (data && data.name) {
          setHeadmasterData(data);
          setHeadmasterName(data.name);
          console.log("✅ Headmaster loaded:", data.name);
          return;
        }
      } else {
        console.log("⚠️ Headmaster API returned:", response.status);
      }

      // Fallback - use logged-in user
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
        console.log("⚠️ Using logged-in user as headmaster (fallback):", userName);
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
  // 🔥 FETCH STUDENT
  // ============================================================
  const fetchStudent = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/students/${studentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStudent(data);

        if (data.school_id) {
          await fetchSchoolData(authToken, data.school_id.toString());
        }
      } else {
        setError("Student not found");
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userName = localStorage.getItem("user_name") || "";
    const userRole = localStorage.getItem("user_type") || "";

    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setTeacherName(userName);

    if (userRole?.toLowerCase() === "headmaster" || userRole?.toLowerCase() === "headmistress") {
      setHeadmasterName(userName);
    }

    fetchStudent(storedToken);
  }, [router, studentId]);

  // ============================================================
  // 🔥 GENERATE PDF
  // ============================================================
  const handleGeneratePDF = async () => {
    setGenerating(true);
    setError("");
    setPdfData(null);

    try {
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

      const url = `${API_BASE}/api/v1/student/${studentId}/parent-report-data?${params.toString()}`;

      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPdfData(data);
      setSuccess("Report data loaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Calculate stats
  const displayClosingDate = announcement?.closing_date ? formatDateDisplay(announcement.closing_date) : "";
  const displayOpeningDate = announcement?.opening_date ? formatDateDisplay(announcement.opening_date) : "";

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading student data...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error || !student) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6">
          <MobileCard gradient="bg-gradient-to-r from-red-50 to-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="font-semibold text-red-700 text-sm sm:text-base">
                  {error || "Student not found"}
                </p>
                <Button onClick={() => router.push("/reports")} className="touch-feedback">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Reports
                </Button>
              </div>
            </CardContent>
          </MobileCard>
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
          title="Parent Report"
          subtitle={`Generate comprehensive parent report for ${student.name}`}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              {student.class_name || "Student"}
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

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Student Information Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Student Name</p>
                <div className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  {student.name}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Roll Number</p>
                <p className="font-semibold text-gray-800 font-mono text-sm sm:text-base">
                  {student.roll_number || "-"}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Class</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-1">
                  <School className="h-3.5 w-3.5 text-gray-400" />
                  {student.class_name || "-"}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Stream</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {student.stream_name || "-"}
                  </span>
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Sex</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                      student.sex === "M"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                    )}
                  >
                    {student.sex === "M" ? "Male" : "Female"}
                  </span>
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Student ID</p>
                <p className="font-semibold text-gray-800 font-mono text-sm sm:text-base">
                  #{student.id}
                </p>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Report Options Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-emerald-50/30" delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              Report Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Term Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  Muhula (Term)
                </Label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="I">MUHULA WA I (MIDTERM3 + TERMINAL)</SelectItem>
                    <SelectItem value="II">MUHULA WA II (MIDTERM9 + ANNUAL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* School Closure Dates - Auto-loaded */}
            <div className="border-t border-gray-100 pt-4 sm:pt-6 animate-slideIn" style={{ animationDelay: "200ms" }}>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-sky-600" />
                A. School Closure Dates
                {loadingAnnouncement ? (
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-sky-600" />
                ) : announcement ? (
                  <span className="text-xs sm:text-sm font-normal text-emerald-600 flex items-center gap-1 ml-2">
                    <CheckCircle className="h-3 w-3" />
                    Auto-loaded
                  </span>
                ) : null}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Closing Date</Label>
                  <Input
                    type="text"
                    value={displayClosingDate}
                    className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium rounded-xl h-9 sm:h-10 text-sm"
                    disabled={true}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Reopening Date</Label>
                  <Input
                    type="text"
                    value={displayOpeningDate}
                    className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium rounded-xl h-9 sm:h-10 text-sm"
                    disabled={true}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>
            </div>

            {/* Teacher Signature */}
            <div className="border-t border-gray-100 pt-4 sm:pt-6 animate-slideIn" style={{ animationDelay: "300ms" }}>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                B. Class Teacher
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Teacher Full Name</Label>
                  <Input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-9 sm:h-10 text-sm"
                    placeholder="Enter teacher name"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Signature Date</Label>
                  <Input
                    type="date"
                    value={teacherDate}
                    onChange={(e) => setTeacherDate(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-9 sm:h-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Headmaster Signature - Auto-loaded */}
            <div className="border-t border-gray-100 pt-4 sm:pt-6 animate-slideIn" style={{ animationDelay: "400ms" }}>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-600" />
                C. Head of School
                {loadingHeadmaster ? (
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-purple-600" />
                ) : headmasterName ? (
                  <span className="text-xs sm:text-sm font-normal text-emerald-600 flex items-center gap-1 ml-2">
                    <CheckCircle className="h-3 w-3" />
                    Auto-loaded
                  </span>
                ) : null}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm text-gray-600">Headmaster Full Name</Label>
                  <Input
                    type="text"
                    value={headmasterName}
                    onChange={(e) => setHeadmasterName(e.target.value)}
                    className={cn(
                      "bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-9 sm:h-10 text-sm",
                      headmasterName && "border-emerald-300 bg-emerald-50"
                    )}
                    placeholder="Enter headmaster name"
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

            {/* District Name - Auto-loaded */}
            <div className="border-t border-gray-100 pt-4 sm:pt-6 animate-slideIn" style={{ animationDelay: "500ms" }}>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                D. District Name
                {loadingSchool ? (
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-amber-600" />
                ) : districtName ? (
                  <span className="text-xs sm:text-sm font-normal text-emerald-600 flex items-center gap-1 ml-2">
                    <CheckCircle className="h-3 w-3" />
                    Auto-loaded
                  </span>
                ) : null}
              </h3>
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-xs sm:text-sm text-gray-600">District / Region Name</Label>
                <Input
                  type="text"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className={cn(
                    "bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-9 sm:h-10 text-sm",
                    districtName && "border-emerald-300 bg-emerald-50"
                  )}
                  placeholder="e.g., KINONDONI, TEMEKE, ILALA, MBEYA"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-2 sm:pt-4 border-t border-gray-100 animate-slideIn" style={{ animationDelay: "600ms" }}>
              {!pdfData ? (
                <Button
                  onClick={handleGeneratePDF}
                  disabled={generating}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  {generating ? "Preparing Data..." : "Generate Parent Report"}
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <PDFDownloadLink
                    document={<ParentReportPDF data={pdfData} />}
                    fileName={`Parent_Report_${student.name}_Term${selectedTerm}.pdf`}
                    className="w-full sm:flex-1"
                  >
                    {({ loading }) => (
                      <Button
                        className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                        {loading ? "Generating PDF..." : "Download Parent Report"}
                      </Button>
                    )}
                  </PDFDownloadLink>

                  <Button
                    variant="outline"
                    onClick={() => setPdfData(null)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-11 sm:h-12 touch-feedback w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Change Options
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </MobileCard>

        {/* Info Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">📋 Report Structure</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  13 columns: Subjects, Tests, Grades, Exams, Totals, Averages, Positions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">✅ Auto-loaded Data</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  School dates, district, and headmaster names load automatically
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Parent Report</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>👨‍🎓 {student.name}</span>
            <span>•</span>
            <span>📚 {student.class_name || "Class"}</span>
            <span>•</span>
            <span>📄 PDF Report</span>
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