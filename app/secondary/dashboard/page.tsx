// app/secondary/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
// ✅ SAWA - Moja tu
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Eye,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  FileText,
  AlertCircle,
  ChevronRight,
  Calendar,
  Star,
  Activity,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Settings,
  HelpCircle,
  UserPlus,
  Edit,
  Trash2,
  MoreVertical,
  X,
  ChevronLeft,
  Menu,
  Home,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface TeacherDashboardData {
  teacher: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    school_id?: number;
    school_name?: string;
    is_admin?: boolean;
  };
  stats: {
    total_students: number;
    total_classes: number;
    total_subjects: number;
    marks_entered: number;
    total_teachers?: number;
    pending_marks?: number;
    total_exams?: number;
  };
  classes: Array<{
    class_id: number;
    class_name: string;
    stream_name?: string;
    student_count: number;
    subjects: Array<{
      subject_id: number;
      subject_name: string;
      subject_code?: string;
    }>;
  }>;
  subjects: Array<{
    id: number;
    name: string;
    code?: string;
    class_count?: number;
    student_count?: number;
  }>;
  recent_activities: string[];
  upcoming_exams?: Array<{
    id: number;
    name: string;
    date: string;
    subject: string;
    class: string;
  }>;
}

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback"
    >
      <ChevronLeft className="h-4 w-4" />
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-xl mb-4 sm:mb-6">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-blue-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {badge && <div className="flex-shrink-0">{badge}</div>}
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={cn(
        "border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm",
        onClick && "cursor-pointer hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

// ✅ FIXED: MobileStatCard with useRouter inside
function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  onClick,
  href,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal" | "indigo" | "pink";
  subtitle?: string;
  onClick?: () => void;
  href?: string;
}) {
  const router = useRouter();

  const lightColors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    teal: "bg-teal-50 text-teal-600",
    indigo: "bg-indigo-50 text-indigo-600",
    pink: "bg-pink-50 text-pink-600",
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <MobileCard className="text-center relative group" onClick={handleClick}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-3 sm:p-4">
        <div
          className={cn(
            "inline-flex p-2 sm:p-2.5 rounded-xl mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform duration-300",
            lightColors[color]
          )}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-[10px] sm:text-xs font-medium text-gray-700">{label}</p>
        {subtitle && (
          <p className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5 truncate">{subtitle}</p>
        )}
      </CardContent>
    </MobileCard>
  );
}

function MobileAlert({
  type,
  message,
}: {
  type: "success" | "error" | "info";
  message: string;
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
        "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-md animate-slideIn",
        styles[type]
      )}
    >
      {icons[type]}
      <p className="text-sm sm:text-base break-words">{message}</p>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function TeacherDashboard() {
  const router = useRouter();
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");
    const name = localStorage.getItem("user_name");
    const schoolId = localStorage.getItem("school_id");

    if (!token) {
      router.push("/login");
      return;
    }

    setTeacherName(name || "User");

    const fetchDashboard = async () => {
      try {
        console.log("📡 Fetching dashboard data for school:", schoolId);

        const response = await fetch(`${API_BASE}/api/v1/teachers/me/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || "Failed to fetch dashboard data");
        }

        const result = await response.json();
        console.log("📡 Data received:", result);

        if (result && result.teacher) {
          setData(result);
          setIsAdmin(result.teacher.is_admin === true);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err: any) {
        console.error("❌ Error fetching dashboard:", err);
        setError(err.message || "Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Good Morning";
    if (hour < 18) return "☀️ Good Afternoon";
    return "🌙 Good Evening";
  };

  // ============================================================
  // LOADING STATE
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
            Loading your dashboard...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error || !data) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
            <p className="text-sm text-red-600 mt-1">{error || "No data available"}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full touch-feedback"
              >
                Try Again 🔄
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="text-gray-500 w-full touch-feedback"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { teacher, stats, classes, subjects, recent_activities, upcoming_exams } = data;

  // ============================================================
  // RENDER DASHBOARD
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Welcome Header - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-100">{getGreeting()}</p>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mt-0.5 sm:mt-1">
                  Welcome back, <span className="text-yellow-200">{teacher.name}</span>! 👋
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full mt-1 sm:mt-2">
                    ⭐ Administrator
                  </span>
                )}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-blue-100">
                  <span className="flex items-center gap-1 text-[10px] sm:text-sm bg-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">{teacher.role}</span>
                    <span className="xs:hidden truncate max-w-[40px]">{teacher.role}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[10px] sm:text-sm bg-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    {stats.total_subjects} {isAdmin ? "Total" : ""} Subj
                  </span>
                  <span className="flex items-center gap-1 text-[10px] sm:text-sm bg-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    {stats.total_students} {isAdmin ? "Total" : ""} Students
                  </span>
                  <span className="flex items-center gap-1 text-[10px] sm:text-sm bg-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                    {stats.marks_entered} Marks
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm h-8 sm:h-9 touch-feedback"
                  onClick={() => router.push("/secondary/profile")}
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Profile</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm h-8 sm:h-9 touch-feedback"
                  onClick={() => router.push("/secondary/help")}
                >
                  <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Help</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Mobile First Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {(isAdmin
            ? [
                {
                  label: "Total Students",
                  value: stats.total_students,
                  icon: Users,
                  color: "blue" as const,
                  href: "/secondary/students",
                  subtitle: "All students in school",
                },
                {
                  label: "Total Teachers",
                  value: stats.total_teachers || 0,
                  icon: GraduationCap,
                  color: "green" as const,
                  href: "/secondary/teachers",
                  subtitle: "All teachers",
                },
                {
                  label: "Total Classes",
                  value: stats.total_classes,
                  icon: BookOpen,
                  color: "purple" as const,
                  href: "/secondary/classes",
                  subtitle: "All classes",
                },
                {
                  label: "Total Subjects",
                  value: stats.total_subjects,
                  icon: FileText,
                  color: "orange" as const,
                  href: "/secondary/subjects",
                  subtitle: "All subjects",
                },
              ]
            : [
                {
                  label: "My Students",
                  value: stats.total_students,
                  icon: Users,
                  color: "blue" as const,
                  href: "/secondary/students/my-students-view",
                  subtitle: "Students you teach",
                },
                {
                  label: "My Subjects",
                  value: stats.total_subjects,
                  icon: BookOpen,
                  color: "green" as const,
                  href: "/secondary/subjects",
                  subtitle: "Subjects you teach",
                },
                {
                  label: "My Classes",
                  value: stats.total_classes,
                  icon: GraduationCap,
                  color: "purple" as const,
                  href: "/secondary/classes",
                  subtitle: "Classes you teach",
                },
                {
                  label: "Marks Entered",
                  value: stats.marks_entered,
                  icon: Award,
                  color: "orange" as const,
                  href: "/secondary/marks",
                  subtitle: "Total marks entered",
                },
              ]
          ).map((stat, idx) => (
            <MobileStatCard
              key={idx}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              subtitle={stat.subtitle}
              href={stat.href}
            />
          ))}
        </div>

        {/* My Subjects / All Subjects */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              {isAdmin ? "School Subjects" : "My Subjects"}
              <span className="text-xs sm:text-sm font-normal text-gray-400 ml-1 sm:ml-2">
                ({subjects.length} subjects)
              </span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 text-xs sm:text-sm touch-feedback"
              onClick={() => setShowSubjectsModal(true)}
            >
              View All
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </div>

          {subjects.length === 0 ? (
            <MobileCard className="border-dashed border-2 border-gray-200">
              <CardContent className="p-6 sm:p-8 text-center text-gray-500">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-sm sm:text-base">
                  {isAdmin ? "No subjects in school" : "No subjects assigned yet"}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {isAdmin
                    ? "Add subjects to get started"
                    : "Contact Academic Master for subject assignments"}
                </p>
              </CardContent>
            </MobileCard>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {subjects.slice(0, 4).map((subject) => (
                <MobileCard
                  key={subject.id}
                  className="text-center hover:shadow-md"
                  onClick={() => router.push(`/secondary/subjects/${subject.id}`)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md mx-auto mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
                      {subject.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                      {subject.name}
                    </p>
                    {subject.code && (
                      <p className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5">
                        Code: {subject.code}
                      </p>
                    )}
                  </CardContent>
                </MobileCard>
              ))}
            </div>
          )}
        </div>

        {/* My Classes & Subjects */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              {isAdmin ? "School Classes" : "My Classes & Subjects"}
              <span className="text-xs sm:text-sm font-normal text-gray-400 ml-1 sm:ml-2">
                ({classes.length} classes)
              </span>
            </h2>
            {classes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 text-xs sm:text-sm touch-feedback"
                onClick={() => router.push("/secondary/classes")}
              >
                View All
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            )}
          </div>

          {classes.length === 0 ? (
            <MobileCard className="border-dashed border-2 border-gray-200">
              <CardContent className="p-6 sm:p-8 text-center text-gray-500">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-sm sm:text-base">
                  {isAdmin ? "No classes in school" : "No classes assigned yet"}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {isAdmin
                    ? "Add classes to get started"
                    : "Contact Academic Master or Headmaster for class assignments"}
                </p>
              </CardContent>
            </MobileCard>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {classes.slice(0, showAllClasses ? undefined : 3).map((cls, idx) => (
                <MobileCard key={idx}>
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                            {cls.class_name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                              {cls.class_name}
                              {cls.stream_name && (
                                <span className="text-gray-500 font-normal ml-1 sm:ml-2 text-xs sm:text-sm">
                                  - {cls.stream_name}
                                </span>
                              )}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5">
                              <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {cls.student_count} students
                              </span>
                              <span className="text-[10px] sm:text-xs text-gray-300">•</span>
                              <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {cls.subjects.length} subjects
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-11 sm:ml-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] sm:text-xs hover:bg-blue-50 hover:border-blue-300 h-7 sm:h-8 px-2 sm:px-3 rounded-xl touch-feedback"
                          onClick={() =>
                            router.push(
                              isAdmin
                                ? `/secondary/students?class=${cls.class_id}`
                                : `/secondary/students/my-students-view?class=${cls.class_id}`
                            )
                          }
                        >
                          <Users className="h-3 w-3 mr-1" />
                          <span className="hidden xs:inline">Students</span>
                          <span className="xs:hidden">Std</span>
                        </Button>
                        <Button
                          size="sm"
                          className="text-[10px] sm:text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-7 sm:h-8 px-2 sm:px-3 rounded-xl touch-feedback"
                          onClick={() =>
                            router.push(`/secondary/marks?class=${cls.class_id}`)
                          }
                        >
                          <Award className="h-3 w-3 mr-1" />
                          <span className="hidden xs:inline">
                            {isAdmin ? "View Marks" : "Enter Marks"}
                          </span>
                          <span className="xs:hidden">Marks</span>
                        </Button>
                      </div>
                    </div>

                    {cls.subjects.length > 0 && (
                      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 pt-2 sm:pt-3 border-t border-gray-50">
                        {cls.subjects.slice(0, 5).map((subj, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[9px] sm:text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full hover:shadow-sm transition-shadow cursor-pointer touch-feedback"
                            onClick={() =>
                              router.push(`/secondary/subjects/${subj.subject_id}`)
                            }
                          >
                            📚 {subj.subject_name}
                            {subj.subject_code && (
                              <span className="text-gray-400 text-[8px] sm:text-[10px] font-mono">
                                ({subj.subject_code})
                              </span>
                            )}
                          </span>
                        ))}
                        {cls.subjects.length > 5 && (
                          <span className="inline-flex items-center text-[9px] sm:text-xs text-gray-400 px-2 py-0.5">
                            +{cls.subjects.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </MobileCard>
              ))}

              {classes.length > 3 && !showAllClasses && (
                <Button
                  variant="outline"
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 text-xs sm:text-sm h-10 sm:h-11 rounded-xl touch-feedback"
                  onClick={() => setShowAllClasses(true)}
                >
                  Show All Classes ({classes.length})
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Two Column: Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <MobileCard className="md:col-span-1">
            <CardContent className="p-4 sm:p-5">
              <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="space-y-1.5 sm:space-y-2">
                {(isAdmin
                  ? [
                      {
                        icon: Users,
                        label: "Manage Students",
                        path: "/secondary/students",
                        color: "blue" as const,
                        desc: "View all students",
                      },
                      {
                        icon: GraduationCap,
                        label: "Manage Teachers",
                        path: "/secondary/teachers",
                        color: "green" as const,
                        desc: "View all teachers",
                      },
                      {
                        icon: BookOpen,
                        label: "Manage Classes",
                        path: "/secondary/classes",
                        color: "purple" as const,
                        desc: "View all classes",
                      },
                      {
                        icon: FileText,
                        label: "Manage Subjects",
                        path: "/secondary/subjects",
                        color: "orange" as const,
                        desc: "View all subjects",
                      },
                      {
                        icon: BarChart3,
                        label: "Reports",
                        path: "/secondary/reports",
                        color: "teal" as const,
                        desc: "View reports",
                      },
                    ]
                  : [
                      {
                        icon: Users,
                        label: "My Students",
                        path: "/secondary/students/my-students-view",
                        color: "blue" as const,
                        desc: "View your students",
                      },
                      {
                        icon: Award,
                        label: "Enter Marks",
                        path: "/secondary/marks",
                        color: "green" as const,
                        desc: "Record student scores",
                      },
                      {
                        icon: BookOpen,
                        label: "My Subjects",
                        path: "/secondary/subjects",
                        color: "purple" as const,
                        desc: "View your subjects",
                      },
                      {
                        icon: BarChart3,
                        label: "Reports",
                        path: "/secondary/reports",
                        color: "orange" as const,
                        desc: "View performance",
                      },
                      {
                        icon: UserPlus,
                        label: "Add Student",
                        path: "/secondary/students/add",
                        color: "teal" as const,
                        desc: "Register new student",
                      },
                    ]
                ).map((action, i) => {
                  const lightColors = {
                    blue: "bg-blue-50 text-blue-600",
                    green: "bg-emerald-50 text-emerald-600",
                    purple: "bg-purple-50 text-purple-600",
                    orange: "bg-orange-50 text-orange-600",
                    teal: "bg-teal-50 text-teal-600",
                    indigo: "bg-indigo-50 text-indigo-600",
                    pink: "bg-pink-50 text-pink-600",
                    red: "bg-red-50 text-red-600",
                  };
                  return (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl hover:bg-gray-50 group transition-all text-xs sm:text-sm touch-feedback"
                      onClick={() => router.push(action.path)}
                    >
                      <div
                        className={cn(
                          "p-1 rounded-lg mr-2 sm:mr-3 group-hover:scale-110 transition-transform",
                          lightColors[action.color]
                        )}
                      >
                        <action.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-medium text-gray-700 truncate">{action.label}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-400 truncate">{action.desc}</p>
                      </div>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-300 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </MobileCard>

          {/* Recent Activities */}
          <MobileCard className="md:col-span-2">
            <CardContent className="p-4 sm:p-5">
              <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Activity className="h-4 w-4 text-emerald-600" />
                Recent Activities
                <span className="text-xs font-normal text-gray-400 ml-1">
                  ({recent_activities.length} activities)
                </span>
              </h3>

              {recent_activities.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-400">
                  <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm">No recent activities</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Start entering marks to see activity here
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 sm:pr-2 scrollable">
                  {recent_activities.slice(0, 5).map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-700 break-words">{activity}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          Recently
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </MobileCard>
        </div>

        {/* Upcoming Exams */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            Upcoming Exams
          </h2>
          {upcoming_exams && upcoming_exams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {upcoming_exams.map((exam) => (
                <MobileCard key={exam.id}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                          {exam.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {exam.subject} • {exam.class}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(exam.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 ml-2">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </MobileCard>
              ))}
            </div>
          ) : (
            <MobileCard className="border-dashed border-2 border-gray-200">
              <CardContent className="p-4 sm:p-6 text-center text-gray-500">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">No upcoming exams</p>
              </CardContent>
            </MobileCard>
          )}
        </div>

        {/* Helpful Info Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">💡 Need Help?</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  For subject changes or class assignments, contact your
                  <strong> Academic Master</strong> or <strong>Headmaster</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">📋 Quick Tip</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Use the <strong>Reports</strong> feature to track
                  student performance and generate progress reports.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100">
          <p>© 2026 MASI FAST RESULTS • Teacher Portal</p>
          <p className="mt-0.5">Your trusted platform for managing students and marks</p>
        </div>
      </div>

      {/* Subjects Modal - Mobile Optimized */}
      {showSubjectsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-fadeIn">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  {isAdmin ? "School Subjects" : "My Subjects"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                  {isAdmin ? "All subjects in the school" : "Subjects you are currently teaching"}
                </p>
              </div>
              <button
                onClick={() => setShowSubjectsModal(false)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors touch-feedback flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-120px)] scrollable">
              {subjects.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="font-medium text-sm sm:text-base">
                    {isAdmin ? "No subjects in school" : "No subjects assigned"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {isAdmin
                      ? "Add subjects to get started"
                      : "Contact Academic Master for subject assignments"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {subjects.map((subject) => (
                    <MobileCard
                      key={subject.id}
                      onClick={() => {
                        setShowSubjectsModal(false);
                        router.push(`/secondary/subjects/${subject.id}`);
                      }}
                    >
                      <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md flex-shrink-0">
                          {subject.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {subject.name}
                          </p>
                          {subject.code && (
                            <p className="text-[10px] sm:text-xs text-gray-400">Code: {subject.code}</p>
                          )}
                          {subject.class_count !== undefined && (
                            <p className="text-[10px] sm:text-xs text-gray-400">
                              {subject.class_count} classes
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </CardContent>
                    </MobileCard>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button
                onClick={() => setShowSubjectsModal(false)}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm touch-feedback"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
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