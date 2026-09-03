// app/primary/dashboard/page.tsx

"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  School,
  GraduationCap,
  BookOpen,
  FileText,
  Brain,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Star,
  Clock,
  Activity,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Eye,
  Shield,
  Sparkles,
  Sun,
  Cloud,
  Loader2,
  AlertCircle,
  RefreshCw,
  WifiOff,
  ChevronLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface Stats {
  total_students: number;
  total_teachers: number;
  total_schools: number;
  total_classes: number;
  total_subjects: number;
  total_marks: number;
  recent_activities: string[];
  upcoming_exams: string[];
}

interface TeacherSubject {
  id: number;
  name: string;
  code: string;
}

interface DashboardStatsResponse {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  total_subjects: number;
  new_students_this_week: number;
  new_teachers_this_week: number;
  upcoming_exams_count: number;
  recent_activities: string[];
}

interface TeacherDashboardResponse {
  teacher: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    is_admin: boolean;
    school_id: number;
    school_name?: string;
  };
  stats: {
    total_students: number;
    total_classes: number;
    total_subjects: number;
    marks_entered: number;
    total_teachers?: number;
  };
  classes: any[];
  subjects: TeacherSubject[];
  recent_activities: string[];
  upcoming_exams: any[];
}

// ============================================================
// 🔥 STAT CARD INTERFACE - FIXED WITH onClick!
// ============================================================
interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  gradient: string;
  href: string;
  editable: boolean;
  onClick?: () => void;  // ✅ IMEPO SASA!
}

// ============================================================
// 🔥 MOBILE COMPONENTS
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

// ============================================================
// 🔥 ROLE FUNCTIONS
// ============================================================
const getRoleDisplay = (role: string): { icon: string; text: string } => {
  const roleMap: Record<string, { icon: string; text: string }> = {
    Mwalimu: { icon: "", text: "Umeingia kama Mwalimu" },
    Mtaaluma: { icon: "", text: "Umeingia kama Mtaaluma" },
    "Mwalimu Mkuu": { icon: "", text: "Umeingia kama Mwalimu Mkuu" },
    "Mwalimu Mkuu Msaidizi": { icon: "", text: "Umeingia kama Mwalimu Mkuu Msaidizi" },
  };
  return roleMap[role] || { icon: "", text: "Umeingia kama Mkuu wa Shule" };
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function PrimaryDashboardPage() {
  const router = useRouter();

  // ============================================================
  // 📊 STATE
  // ============================================================
  const [stats, setStats] = useState<Stats>({
    total_students: 0,
    total_teachers: 0,
    total_schools: 0,
    total_classes: 0,
    total_subjects: 0,
    total_marks: 0,
    recent_activities: [],
    upcoming_exams: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubject[]>([]);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const isFetching = useRef(false);
  const initialized = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ============================================================
  // 🔥 FETCH TEACHER DATA
  // ============================================================
  const fetchTeacherData = useCallback(
    async (authToken: string) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        console.log("📡 [TEACHER] Fetching primary teacher dashboard...");

        const response = await fetch(`${API_BASE}/api/v1/primary/teachers/me/dashboard`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        });

        console.log("📡 [TEACHER] Response status:", response.status);

        if (!response.ok) {
          let errorMessage = `Server error: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            // Ignore JSON parsing error
          }
          throw new Error(errorMessage);
        }

        const data: TeacherDashboardResponse = await response.json();
        console.log("📡 [TEACHER] Data received:", data);

        const newStats: Stats = {
          total_students: data.stats?.total_students ?? 0,
          total_teachers: data.stats?.total_teachers ?? 0,
          total_schools: 0,
          total_classes: data.stats?.total_classes ?? 0,
          total_subjects: data.stats?.total_subjects ?? 0,
          total_marks: data.stats?.marks_entered ?? 0,
          recent_activities:
            data.recent_activities?.length > 0
              ? data.recent_activities
              : ["Karibu kwenye dashibodi yako"],
          upcoming_exams:
            data.upcoming_exams?.length > 0
              ? data.upcoming_exams.map((e: any) => e.name || "Mtihani ujao")
              : ["Hakuna mitihani iliyopangwa"],
        };

        setStats(newStats);
        setTeacherSubjects(data.subjects || []);

        console.log("✅ [TEACHER] Stats set:", newStats);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("⚠️ [TEACHER] Request was aborted");
          return;
        }

        console.error("❌ [TEACHER] Error fetching teacher data:", error);
        setError(error.message || "Tatizo la kupata data ya mwalimu");

        setStats({
          total_students: 0,
          total_teachers: 0,
          total_schools: 0,
          total_classes: 0,
          total_subjects: 0,
          total_marks: 0,
          recent_activities: [`⚠️ ${error.message || "Tatizo la kupata data. Jaribu tena."}`],
          upcoming_exams: ["Hakuna mitihani iliyopangwa"],
        });
        setTeacherSubjects([]);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    []
  );

  // ============================================================
  // 🔥 FETCH ADMIN DATA
  // ============================================================
  const fetchAdminData = useCallback(
    async (authToken: string) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        console.log("📡 [ADMIN] Fetching admin dashboard...");

        const response = await fetch(`${API_BASE}/api/v1/primary/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        });

        console.log("📡 [ADMIN] Response status:", response.status);

        if (!response.ok) {
          let errorMessage = `Server error: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            // Ignore
          }
          throw new Error(errorMessage);
        }

        const realStats: DashboardStatsResponse = await response.json();
        console.log("📡 [ADMIN] Data received:", realStats);

        let upcomingExamsMsg = "Hakuna mitihani iliyopangwa";
        if (realStats.upcoming_exams_count > 0) {
          upcomingExamsMsg = `Mitihani ${realStats.upcoming_exams_count} inakuja hivi karibuni`;
        }

        const newStats: Stats = {
          total_students: realStats.total_students ?? 0,
          total_teachers: realStats.total_teachers ?? 0,
          total_schools: 0,
          total_classes: realStats.total_classes ?? 0,
          total_subjects: realStats.total_subjects ?? 0,
          total_marks: 0,
          recent_activities:
            realStats.recent_activities?.length > 0
              ? realStats.recent_activities
              : ["📊 Data imepakiwa"],
          upcoming_exams: [upcomingExamsMsg],
        };

        setStats(newStats);
        console.log("✅ [ADMIN] Stats set:", newStats);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("⚠️ [ADMIN] Request was aborted");
          return;
        }

        console.error("❌ [ADMIN] Error fetching admin data:", error);
        setError(error.message || "Tatizo la kupata data");

        setStats({
          total_students: 0,
          total_teachers: 0,
          total_schools: 0,
          total_classes: 0,
          total_subjects: 0,
          total_marks: 0,
          recent_activities: [`⚠️ ${error.message || "Tatizo la kupata data. Jaribu tena."}`],
          upcoming_exams: ["Hakuna mitihani iliyopangwa"],
        });
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    []
  );

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    if (initialized.current) {
      console.log("⚠️ Already initialized, skipping...");
      return;
    }
    initialized.current = true;

    console.log("🚀 [INIT] Starting dashboard initialization...");

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user_name");
    const userType = localStorage.getItem("user_type");
    const schoolLevel = localStorage.getItem("school_level");

    console.log("📋 [INIT] Token:", token ? "✅ Ipo" : "❌ Haipo");
    console.log("📋 [INIT] user_type:", userType);

    if (!token) {
      console.warn("⚠️ [INIT] No token found, redirecting to login...");
      router.push("/login");
      return;
    }

    if (schoolLevel && schoolLevel !== "primary") {
      console.log(`📋 [INIT] School level is ${schoolLevel}, redirecting...`);
      if (schoolLevel === "secondary") {
        router.push("/secondary/dashboard");
      } else if (schoolLevel === "advanced") {
        router.push("/advanced/dashboard");
      } else {
        router.push("/login");
      }
      return;
    }

    if (userType === "superadmin" || userType === "Superadmin") {
      console.warn("⚠️ [INIT] Superadmin trying to access primary dashboard");
      setAccessDenied(true);
      setTimeout(() => {
        router.push("/superadmin");
      }, 2000);
      return;
    }

    const roleMap: Record<string, string> = {
      teacher: "Mwalimu",
      Teacher: "Mwalimu",
      academic: "Mtaaluma",
      Academic: "Mtaaluma",
      headmaster: "Mwalimu Mkuu",
      Headmaster: "Mwalimu Mkuu",
      headmistress: "Mwalimu Mkuu",
      Headmistress: "Mwalimu Mkuu",
      second_master: "Mwalimu Mkuu Msaidizi",
      "Second Master": "Mwalimu Mkuu Msaidizi",
      second_mistress: "Mwalimu Mkuu Msaidizi",
      "Second Mistress": "Mwalimu Mkuu Msaidizi",
      mwalimu: "Mwalimu",
      Mwalimu: "Mwalimu",
      mtaaluma: "Mtaaluma",
      Mtaaluma: "Mtaaluma",
      "mwalimu mkuu": "Mwalimu Mkuu",
      "Mwalimu Mkuu": "Mwalimu Mkuu",
      "mwalimu mkuu msaidizi": "Mwalimu Mkuu Msaidizi",
      "Mwalimu Mkuu Msaidizi": "Mwalimu Mkuu Msaidizi",
    };

    let formattedRole = "Mwalimu";
    const userTypeStr = String(userType || "").trim();

    if (roleMap[userTypeStr]) {
      formattedRole = roleMap[userTypeStr];
    } else if (roleMap[userTypeStr.toLowerCase()]) {
      formattedRole = roleMap[userTypeStr.toLowerCase()];
    } else {
      const lowerType = userTypeStr.toLowerCase();
      if (
        lowerType.includes("teacher") ||
        (lowerType.includes("mwalimu") && !lowerType.includes("mkuu"))
      ) {
        formattedRole = "Mwalimu";
      } else if (lowerType.includes("academic") || lowerType.includes("mtaaluma")) {
        formattedRole = "Mtaaluma";
      } else if (
        lowerType.includes("headmaster") ||
        lowerType.includes("headmistress") ||
        lowerType.includes("mwalimu mkuu")
      ) {
        formattedRole = "Mwalimu Mkuu";
      } else if (lowerType.includes("second") || lowerType.includes("msaidizi")) {
        formattedRole = "Mwalimu Mkuu Msaidizi";
      }
    }

    console.log(`📋 [INIT] Formatted role: "${formattedRole}"`);

    const isTeacherRole = formattedRole === "Mwalimu";
    setIsTeacher(isTeacherRole);
    setUserName(name || "Mtumiaji");
    setUserRole(formattedRole);

    if (isTeacherRole) {
      console.log("📡 [INIT] Fetching TEACHER data...");
      fetchTeacherData(token);
    } else {
      console.log("📡 [INIT] Fetching ADMIN data...");
      fetchAdminData(token);
    }

    return () => {
      console.log("🧹 [INIT] Cleaning up...");
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [router, fetchTeacherData, fetchAdminData]);

  // ============================================================
  // 🔄 RETRY FUNCTION
  // ============================================================
  const handleRetry = useCallback(() => {
    console.log("🔄 [RETRY] Retrying data fetch...");
    setLoading(true);
    setError(null);
    setRetryCount((prev) => prev + 1);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (isTeacher) {
      fetchTeacherData(token);
    } else {
      fetchAdminData(token);
    }
  }, [isTeacher, fetchTeacherData, fetchAdminData, router]);

  // ============================================================
  // ⏰ GREETING
  // ============================================================
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Habari za Asubuhi";
    if (hour < 18) return "☀️ Habari za Mchana";
    return "🌙 Habari za Jioni";
  }, []);

  // ============================================================
  // 📊 STAT CARDS - PRO MAX SIZE! (FIXED TYPES)
  // ============================================================
  const statCards = useMemo((): StatCard[] => {
    console.log("🔍 [CARDS] Building statCards - isTeacher:", isTeacher);

    try {
      const safeStudents = typeof stats?.total_students === "number" ? stats.total_students : 0;
      const safeTeachers = typeof stats?.total_teachers === "number" ? stats.total_teachers : 0;
      const safeClasses = typeof stats?.total_classes === "number" ? stats.total_classes : 0;
      const safeSubjects = typeof stats?.total_subjects === "number" ? stats.total_subjects : 0;
      const safeMarks = typeof stats?.total_marks === "number" ? stats.total_marks : 0;

      const displayValue = (val: number) => {
        return val > 0 ? val : "-";
      };

      if (isTeacher) {
        return [
          {
            title: "👨‍🎓 Wanafunzi Wangu",
            value: displayValue(safeStudents),
            icon: Users,
            gradient: "from-sky-500 to-blue-600",
            href: "/primary/students/my-students",
            editable: false,
          },
          {
            title: "📚 Masomo Yangu",
            value: displayValue(safeSubjects),
            icon: BookOpen,
            gradient: "from-emerald-500 to-teal-600",
            href: "#",
            editable: false,
            onClick: () => setShowSubjectsModal(true),  // ✅ onClick imefafanuliwa!
          },
          {
            title: "📝 Alama Zangu",
            value: displayValue(safeMarks),
            icon: Award,
            gradient: "from-amber-500 to-orange-600",
            href: "/primary/marks",
            editable: false,
          },
        ];
      }

      return [
        {
          title: "Jumla ya Wanafunzi",
          value: displayValue(safeStudents),
          icon: Users,
          gradient: "from-sky-500 to-blue-600",
          href: "/primary/students",
          editable: true,
        },
        {
          title: "Jumla ya Walimu",
          value: displayValue(safeTeachers),
          icon: GraduationCap,
          gradient: "from-sky-600 to-blue-700",
          href: "/primary/teachers",
          editable: true,
        },
        {
          title: "Jumla ya Madarasa",
          value: displayValue(safeClasses),
          icon: BookOpen,
          gradient: "from-sky-500 to-indigo-600",
          href: "/primary/classes",
          editable: true,
        },
        {
          title: "Jumla ya Masomo",
          value: displayValue(safeSubjects),
          icon: FileText,
          gradient: "from-sky-600 to-cyan-600",
          href: "/primary/subjects",
          editable: true,
        },
      ];
    } catch (error) {
      console.error("❌ [CARDS] Error building stat cards:", error);
      return [];
    }
  }, [isTeacher, stats]);

  // ============================================================
  // ⚡ QUICK ACTIONS
  // ============================================================
  const quickActions = useMemo(() => {
    console.log("🔍 [ACTIONS] Building quickActions - isTeacher:", isTeacher);

    try {
      if (isTeacher) {
        return [
          {
            title: "👨‍🎓 Wanafunzi Wangu",
            icon: Users,
            href: "/primary/students/my-students",
            gradient: "from-sky-500 to-blue-600",
          },
          {
            title: "📝 Ingiza Alama",
            icon: Award,
            href: "/primary/marks/add",
            gradient: "from-amber-500 to-orange-600",
          },
          {
            title: "📊 Ripoti",
            icon: FileText,
            href: "/primary/reports",
            gradient: "from-emerald-500 to-teal-600",
          },
        ];
      }

      return [
        {
          title: "Ongeza Mwanafunzi",
          icon: Users,
          href: "/primary/students",
          gradient: "from-sky-500 to-blue-600",
        },
        {
          title: "Ongeza Mwalimu",
          icon: GraduationCap,
          href: "/primary/teachers",
          gradient: "from-sky-600 to-blue-700",
        },
        {
          title: "Simamia Madarasa",
          icon: BookOpen,
          href: "/primary/classes",
          gradient: "from-sky-500 to-indigo-600",
        },
      ];
    } catch (error) {
      console.error("❌ [ACTIONS] Error building quick actions:", error);
      return [];
    }
  }, [isTeacher]);

  const roleDisplay = getRoleDisplay(userRole);

  // ============================================================
  // 🚫 ACCESS DENIED
  // ============================================================
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
        <Card className="max-w-md mx-auto text-center border-0 shadow-2xl rounded-2xl">
          <CardContent className="pt-12 pb-8">
            <div className="bg-red-100 p-4 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">Hakuna Ruhusa</h1>
            <p className="text-gray-600 mb-4">
              Msimamizi Mkuu hawezi kuingia kwenye mfumo wa shule moja kwa moja.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Tafadhali tumia paneli ya Msimamizi Mkuu kudhibiti shule.
            </p>
            <div className="animate-pulse">
              <p className="text-xs text-gray-400">Inakuelekeza kwenye paneli ya Msimamizi Mkuu...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">Inapakia dashibodi yako...</p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // ❌ ERROR STATE
  // ============================================================
  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="bg-red-100 p-4 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <WifiOff className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800">Kuna Tatizo</h3>
            <p className="text-gray-600 mt-2">{error}</p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button
                onClick={handleRetry}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 rounded-xl touch-feedback"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Jaribu Tena
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="rounded-xl touch-feedback"
              >
                Ingia Tena
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // 🎨 RENDER - PRO MAX!
  // ============================================================
  try {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
          >
            <div className="p-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
              <ChevronLeft className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Rudi</span>
          </button>

          {/* Welcome Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 p-4 sm:p-6 md:p-8 text-white shadow-2xl">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 animate-pulse-soft" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 animate-pulse-soft animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <Cloud className="absolute top-4 right-20 h-12 w-12 text-white/20 hidden sm:block" />
            <Sun className="absolute bottom-4 left-20 h-12 w-12 text-white/20 hidden sm:block" />

            <div className="relative z-10">
              <p className="text-xs sm:text-sm font-medium text-sky-100">{getGreeting()}</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
                Karibu tena, <span className="text-yellow-200">{userName || "Mtumiaji"}</span>! 👋
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-base sm:text-lg">{roleDisplay.icon}</span>
                <span className="text-sm sm:text-base">{roleDisplay.text}</span>
                {isTeacher && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 text-[10px] sm:text-xs">
                    <BookOpen className="h-3 w-3" />
                    {teacherSubjects.length} Masomo
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {statCards && statCards.length > 0 ? (
              statCards.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl cursor-pointer",
                    "transition-all duration-500 hover:scale-105 hover:shadow-2xl",
                    `bg-gradient-to-r ${stat.gradient}`
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  // ✅ FIXED: onClick sasa inafanya kazi vizuri!
                  onClick={() => {
                    if (stat.onClick) {
                      stat.onClick();
                    } else {
                      router.push(stat.href);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                      <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-[10px] sm:text-xs text-white/70">
                    {stat.editable ? (
                      <>
                        <span>Bonyeza kudhibiti</span>
                        <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        <span>Tazama tu</span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                <p>Hakuna data ya kuonyesha</p>
              </div>
            )}
          </div>

          {/* Quick Actions & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 shadow-md border-0 overflow-hidden rounded-2xl">
              <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-blue-500" />
              <CardHeader className="pb-3 bg-gradient-to-r from-sky-50 to-blue-50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-sky-800">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                  Vitendo vya Haraka
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="space-y-2.5 sm:space-y-3">
                  {quickActions && quickActions.length > 0 ? (
                    quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-between h-auto py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-sky-50 group text-xs sm:text-sm touch-feedback"
                        onClick={() => router.push(action.href)}
                        style={{ animationDelay: `${index * 100 + 300}ms` }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className={`bg-gradient-to-r ${action.gradient} p-1.5 sm:p-2 rounded-lg shadow-md`}
                          >
                            <action.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-700">{action.title}</span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">Hakuna vitendo vya haraka</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="lg:col-span-2 shadow-md border-0 overflow-hidden rounded-2xl">
              <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-emerald-800">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                  Shughuli za Hivi Karibuni
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {stats.recent_activities && stats.recent_activities.length > 0 ? (
                    stats.recent_activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-sky-50/50 hover:bg-sky-100 transition-colors"
                        style={{ animationDelay: `${idx * 100 + 400}ms` }}
                      >
                        <div className="mt-0.5">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700 break-words">{activity}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Hivi Karibuni
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <Activity className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm sm:text-base">Hakuna shughuli za hivi karibuni</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exams & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Upcoming Exams */}
            <Card className="shadow-md border-0 overflow-hidden rounded-2xl">
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-purple-800">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  Mitihani Inayokuja
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="space-y-2.5 sm:space-y-3">
                  {stats.upcoming_exams && stats.upcoming_exams.length > 0 &&
                  stats.upcoming_exams[0] !== "Hakuna mitihani iliyopangwa" ? (
                    stats.upcoming_exams.map((exam, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50"
                        style={{ animationDelay: `${idx * 100 + 500}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
                            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {exam}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              Jitayarishe ipasavyo
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-purple-600 text-xs sm:text-sm touch-feedback">
                          Maelezo
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 sm:py-6 text-gray-500">
                      <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm sm:text-base">Hakuna mitihani iliyopangwa</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="shadow-md border-0 overflow-hidden rounded-2xl">
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-amber-800">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                  Muhtasari wa Utendaji
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 animate-pulse-soft">
                    <Award className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {isTeacher ? "Fuatilia Maendeleo ya Wanafunzi Wako" : "Utendaji wa Shule"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs px-4">
                    {isTeacher
                      ? "Tazama ripoti na uchambuzi wa maendeleo ya wanafunzi wako"
                      : "Fuatilia utendaji wa jumla wa shule na mafanikio ya wanafunzi"}
                  </p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all rounded-xl text-sm sm:text-base touch-feedback"
                    onClick={() => router.push("/primary/top-students")}
                  >
                    Tazama Ripoti
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "600ms" }}>
            <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Dashibodi ya Msingi</p>
            <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
              <span>👨‍🎓 {stats.total_students || 0} wanafunzi</span>
              <span>•</span>
              <span>👨‍🏫 {stats.total_teachers || 0} walimu</span>
              <span>•</span>
              <span>📚 {stats.total_subjects || 0} masomo</span>
            </p>
          </div>
        </div>

        {/* Subjects Modal */}
        <Dialog open={showSubjectsModal} onOpenChange={setShowSubjectsModal}>
          <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sky-800 text-base sm:text-lg">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                {isTeacher ? "Masomo Unayofundisha" : "Masomo ya Shule"}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                {isTeacher
                  ? "Orodha ya masomo uliyopangiwa. Wasiliana na Mtaaluma kwa mabadiliko."
                  : "Orodha ya masomo yote shuleni."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-80 sm:max-h-96 overflow-y-auto scrollable">
              {teacherSubjects && teacherSubjects.length > 0 ? (
                teacherSubjects.map((subject, idx) => (
                  <div
                    key={subject.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 hover:shadow-md transition-all"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white font-bold text-base sm:text-lg">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {subject.name}
                      </p>
                      {subject.code && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          Msimbo: {subject.code}
                        </p>
                      )}
                    </div>
                    <div className="bg-white/50 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                      <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm sm:text-base text-gray-500">
                    {isTeacher ? "Hujapewa masomo bado" : "Hakuna masomo shuleni"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    {isTeacher ? "Wasiliana na Mtaaluma" : "Ongeza masomo"}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => setShowSubjectsModal(false)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl touch-feedback"
              >
                Funga
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
  } catch (error) {
    console.error("❌ RENDER ERROR:", error);
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800">Kuna Tatizo</h3>
            <p className="text-gray-600 mt-2">Tafadhali wasiliana na msimamizi wa mfumo.</p>
            <Button className="mt-4 rounded-xl touch-feedback" onClick={() => window.location.reload()}>
              Jaribu tena
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
}