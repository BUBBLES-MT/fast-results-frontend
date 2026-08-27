"use client";

import { useEffect, useState } from "react";
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
  Brain,
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
} from "lucide-react";

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
        
        const response = await fetch("/api/v1/teachers/me/dashboard", {
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
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 text-sm">Loading your dashboard...</p>
            <p className="text-xs text-gray-400">Please wait...</p>
          </div>
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
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
            <p className="text-sm text-red-600 mt-1">{error || "No data available"}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again 🔄
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="text-gray-500"
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
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        
        {/* ============================================================
             WELCOME HEADER
             ============================================================ */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-100">{getGreeting()}</p>
                <h1 className="text-2xl md:text-3xl font-bold mt-1">
                  Welcome back, <span className="text-yellow-200">{teacher.name}</span>! 👋
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full mt-2">
                    ⭐ Administrator
                  </span>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-blue-100">
                  <span className="flex items-center gap-1 text-sm bg-white/10 px-3 py-1 rounded-full">
                    <GraduationCap className="h-4 w-4" />
                    {teacher.role}
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-white/10 px-3 py-1 rounded-full">
                    <BookOpen className="h-4 w-4" />
                    {stats.total_subjects} {isAdmin ? "Total" : ""} Subjects
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-white/10 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4" />
                    {stats.total_students} {isAdmin ? "Total" : ""} Students
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-white/10 px-3 py-1 rounded-full">
                    <Award className="h-4 w-4" />
                    {stats.marks_entered} Marks
                  </span>
                  {isAdmin && stats.total_teachers && (
                    <span className="flex items-center gap-1 text-sm bg-white/10 px-3 py-1 rounded-full">
                      <GraduationCap className="h-4 w-4" />
                      {stats.total_teachers} Teachers
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => router.push("/secondary/profile")}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Profile
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => router.push("/secondary/help")}
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
             STATS CARDS
             ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            isAdmin ? 
            [
              {
                title: "Total Students",
                value: stats.total_students,
                icon: Users,
                color: "blue",
                href: "/secondary/students",
                subtitle: "All students in school",
              },
              {
                title: "Total Teachers",
                value: stats.total_teachers || 0,
                icon: GraduationCap,
                color: "green",
                href: "/secondary/teachers",
                subtitle: "All teachers",
              },
              {
                title: "Total Classes",
                value: stats.total_classes,
                icon: BookOpen,
                color: "purple",
                href: "/secondary/classes",
                subtitle: "All classes",
              },
              {
                title: "Total Subjects",
                value: stats.total_subjects,
                icon: FileText,
                color: "orange",
                href: "/secondary/subjects",
                subtitle: "All subjects",
              },
            ]
            :
            [
              {
                title: "My Students",
                value: stats.total_students,
                icon: Users,
                color: "blue",
                href: "/secondary/students/my-students-view",
                subtitle: "Students you teach",
              },
              {
                title: "My Subjects",
                value: stats.total_subjects,
                icon: BookOpen,
                color: "green",
                href: "/secondary/subjects",
                subtitle: "Subjects you teach",
                onClick: () => setShowSubjectsModal(true),
              },
              {
                title: "My Classes",
                value: stats.total_classes,
                icon: GraduationCap,
                color: "purple",
                href: "/secondary/classes",
                subtitle: "Classes you teach",
              },
              {
                title: "Marks Entered",
                value: stats.marks_entered,
                icon: Award,
                color: "orange",
                href: "/secondary/marks",
                subtitle: "Total marks entered",
              },
            ]
          ).map((stat, idx) => (
            <Card
              key={idx}
              className="group shadow-sm border-0 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => stat.onClick ? stat.onClick() : router.push(stat.href)}
            >
              <CardContent className="p-4 text-center relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`inline-flex p-2.5 rounded-xl bg-${stat.color}-100 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs font-medium text-gray-700">{stat.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ============================================================
             MY SUBJECTS / ALL SUBJECTS
             ============================================================ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              {isAdmin ? "School Subjects" : "My Subjects"}
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({subjects.length} subjects)
              </span>
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 text-sm"
                onClick={() => setShowSubjectsModal(true)}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {subjects.length === 0 ? (
            <Card className="shadow-sm border-0 border-dashed border-2 border-gray-200">
              <CardContent className="p-8 text-center text-gray-500">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium">{isAdmin ? "No subjects in school" : "No subjects assigned yet"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {isAdmin ? "Add subjects to get started" : "Contact Academic Master for subject assignments"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subjects.slice(0, 4).map((subject) => (
                <Card
                  key={subject.id}
                  className="group shadow-sm border-0 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/secondary/subjects/${subject.id}`)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md mx-auto mb-2 group-hover:scale-110 transition-transform">
                      {subject.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {subject.name}
                    </p>
                    {subject.code && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Code: {subject.code}
                      </p>
                    )}
                    {subject.class_count !== undefined && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {subject.class_count} classes
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ============================================================
             MY CLASSES & SUBJECTS / ALL CLASSES
             ============================================================ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              {isAdmin ? "School Classes" : "My Classes & Subjects"}
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({classes.length} classes)
              </span>
            </h2>
            {classes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 text-sm"
                onClick={() => router.push("/secondary/classes")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {classes.length === 0 ? (
            <Card className="shadow-sm border-0 border-dashed border-2 border-gray-200">
              <CardContent className="p-8 text-center text-gray-500">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium">{isAdmin ? "No classes in school" : "No classes assigned yet"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {isAdmin ? "Add classes to get started" : "Contact Academic Master or Headmaster for class assignments"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {classes.slice(0, showAllClasses ? undefined : 3).map((cls, idx) => (
                <Card
                  key={idx}
                  className="group shadow-sm border-0 hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                            {cls.class_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-base">
                              {cls.class_name}
                              {cls.stream_name && (
                                <span className="text-gray-500 font-normal ml-2 text-sm">
                                  - {cls.stream_name}
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {cls.student_count} students
                              </span>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" />
                                {cls.subjects.length} subjects
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 ml-13 md:ml-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs hover:bg-blue-50 hover:border-blue-300"
                          onClick={() =>
                            router.push(isAdmin 
                              ? `/secondary/students?class=${cls.class_id}` 
                              : `/secondary/students/my-students-view?class=${cls.class_id}`
                            )
                          }
                        >
                          <Users className="h-3.5 w-3.5 mr-1.5" />
                          Students
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          onClick={() =>
                            router.push(`/secondary/marks?class=${cls.class_id}`)
                          }
                        >
                          <Award className="h-3.5 w-3.5 mr-1.5" />
                          {isAdmin ? "View Marks" : "Enter Marks"}
                        </Button>
                      </div>
                    </div>

                    {cls.subjects.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
                        {cls.subjects.map((subj, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-1 rounded-full hover:shadow-sm transition-shadow cursor-pointer"
                            onClick={() => router.push(`/secondary/subjects/${subj.subject_id}`)}
                          >
                            📚 {subj.subject_name}
                            {subj.subject_code && (
                              <span className="text-gray-400 text-[10px] font-mono">
                                ({subj.subject_code})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {classes.length > 3 && !showAllClasses && (
                <Button
                  variant="outline"
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => setShowAllClasses(true)}
                >
                  Show All Classes ({classes.length})
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ============================================================
             TWO COLUMN: Quick Actions & Recent Activities
             ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quick Actions - 🔥 AI EXAM IMEFICHWA! */}
          <Card className="md:col-span-1 shadow-sm border-0">
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {(isAdmin ? 
                  // ✅ ADMIN - AI EXAM IMEFICHWA!
                  [
                    { icon: Users, label: "Manage Students", path: "/secondary/students", color: "blue", desc: "View all students" },
                    { icon: GraduationCap, label: "Manage Teachers", path: "/secondary/teachers", color: "green", desc: "View all teachers" },
                    { icon: BookOpen, label: "Manage Classes", path: "/secondary/classes", color: "purple", desc: "View all classes" },
                    { icon: FileText, label: "Manage Subjects", path: "/secondary/subjects", color: "orange", desc: "View all subjects" },
                    // 🔥🔥🔥 AI EXAM IMEFICHWA! 🔥🔥🔥
                    // { icon: Brain, label: "AI Exam", path: "/secondary/ai-exam", color: "indigo", desc: "Generate AI exams" },
                    { icon: BarChart3, label: "Reports", path: "/secondary/reports", color: "teal", desc: "View reports" },
                  ]
                  :
                  // ✅ TEACHER - AI EXAM IMEFICHWA!
                  [
                    { icon: Users, label: "My Students", path: "/secondary/students/my-students-view", color: "blue", desc: "View your students" },
                    { icon: Award, label: "Enter Marks", path: "/secondary/marks", color: "green", desc: "Record student scores" },
                    { icon: BookOpen, label: "My Subjects", path: "/secondary/subjects", color: "purple", desc: "View your subjects", onClick: () => setShowSubjectsModal(true) },
                    // 🔥🔥🔥 AI EXAM IMEFICHWA! 🔥🔥🔥
                    // { icon: Brain, label: "AI Exam", path: "/secondary/ai-exam", color: "indigo", desc: "Generate AI exams" },
                    { icon: BarChart3, label: "Reports", path: "/secondary/reports", color: "orange", desc: "View performance" },
                    { icon: UserPlus, label: "Add Student", path: "/secondary/students/add", color: "teal", desc: "Register new student" },
                  ]
                ).map((action, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2.5 px-3 rounded-lg hover:bg-gray-50 group transition-all"
                    onClick={() => action.onClick ? action.onClick() : router.push(action.path)}
                  >
                    <div className={`p-1.5 rounded-lg bg-${action.color}-100 mr-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-gray-700">{action.label}</p>
                      <p className="text-[10px] text-gray-400">{action.desc}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="md:col-span-2 shadow-sm border-0">
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                Recent Activities
                <span className="text-xs font-normal text-gray-400 ml-1">
                  ({recent_activities.length} activities)
                </span>
              </h3>
              
              {recent_activities.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">No recent activities</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Start entering marks to see activity here
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                  {recent_activities.slice(0, 5).map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{activity}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Recently
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ============================================================
             UPCOMING EXAMS
             ============================================================ */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Upcoming Exams
          </h2>
          {upcoming_exams && upcoming_exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming_exams.map((exam) => (
                <Card key={exam.id} className="shadow-sm border-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{exam.name}</p>
                        <p className="text-sm text-gray-500">{exam.subject} • {exam.class}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(exam.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-sm border-0 border-dashed border-2 border-gray-200">
              <CardContent className="p-6 text-center text-gray-500">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">No upcoming exams</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ============================================================
             HELPFUL INFO FOOTER - 🔥 AI EXAM IMEFICHWA!
             ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-sm">💡 Need Help?</p>
                <p className="text-xs text-blue-600/80 mt-0.5">
                  For subject changes or class assignments, contact your 
                  <strong> Academic Master</strong> or <strong>Headmaster</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-sm">📋 Quick Tip</p>
                <p className="text-xs text-purple-600/80 mt-0.5">
                  Use the <strong>Reports</strong> feature to track 
                  student performance and generate progress reports.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
             FOOTER
             ============================================================ */}
        <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          <p>© 2026 EduTrack Teacher Portal • {new Date().getFullYear()}</p>
          <p className="mt-0.5">Your trusted platform for managing students and marks</p>
        </div>
      </div>

      {/* ============================================================
           SUBJECTS MODAL
           ============================================================ */}
      {showSubjectsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  {isAdmin ? "School Subjects" : "My Subjects"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isAdmin ? "All subjects in the school" : "Subjects you are currently teaching"}
                </p>
              </div>
              <button
                onClick={() => setShowSubjectsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {subjects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="font-medium">{isAdmin ? "No subjects in school" : "No subjects assigned"}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isAdmin ? "Add subjects to get started" : "Contact Academic Master for subject assignments"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject) => (
                    <Card
                      key={subject.id}
                      className="group hover:shadow-md transition-all cursor-pointer border-0 shadow-sm"
                      onClick={() => {
                        setShowSubjectsModal(false);
                        router.push(`/secondary/subjects/${subject.id}`);
                      }}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {subject.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {subject.name}
                          </p>
                          {subject.code && (
                            <p className="text-xs text-gray-400">Code: {subject.code}</p>
                          )}
                          {subject.class_count !== undefined && (
                            <p className="text-xs text-gray-400">
                              {subject.class_count} classes
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button
                onClick={() => setShowSubjectsModal(false)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}