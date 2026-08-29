// app/teachers/[id]/students/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  ArrowLeft,
  Search,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  User,
  Mail,
  Phone,
  School,
  Trophy,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  Crown,
  Clock,
  Building,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Download,
  Printer,
  BarChart3,
  Award,
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
  sex: string;
  roll_number: string;
  class_id: number;
  class_name?: string;
  stream_id: number;
  stream_name?: string;
}

interface Assignment {
  id: number;
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  students: Student[];
  uniqueStudentCount: number;
}

interface Teacher {
  id: number;
  name: string;
  role: string;
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

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[600px] sm:min-w-full">{children}</div>
    </div>
  );
}

function MobileAlert({
  type,
  message,
  onClose,
}: {
  type: "error" | "info";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
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
// 🎯 MAIN COMPONENT
// ============================================================
export default function TeacherStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id as string;

  const [token, setToken] = useState("");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAssignments, setExpandedAssignments] = useState<Set<number>>(new Set());

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchTeacher(storedToken);
    fetchTeacherAssignments(storedToken);
  }, [teacherId]);

  const fetchTeacher = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch teacher");
      const data = await response.json();
      setTeacher(data);
    } catch (err) {
      setError("Failed to load teacher");
    }
  };

  const fetchTeacherAssignments = async (authToken: string) => {
    try {
      const assignmentsRes = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}/assignments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!assignmentsRes.ok) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      const assignmentsData = await assignmentsRes.json();

      if (assignmentsData.length === 0) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      const allStudentsRes = await fetch(`${API_BASE}/api/v1/students`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      let allStudents: Student[] = [];
      if (allStudentsRes.ok) {
        allStudents = await allStudentsRes.json();
      }

      const assignmentsWithStudents = assignmentsData.map((assignment: any) => {
        const filteredStudents = allStudents.filter(
          (student) => student.class_id === assignment.class_id && student.stream_id === assignment.stream_id
        );

        const uniqueStudentsMap = new Map<number, Student>();
        for (const student of filteredStudents) {
          if (!uniqueStudentsMap.has(student.id)) {
            uniqueStudentsMap.set(student.id, student);
          }
        }

        return {
          ...assignment,
          students: Array.from(uniqueStudentsMap.values()),
          uniqueStudentCount: uniqueStudentsMap.size,
        };
      });

      setAssignments(assignmentsWithStudents);

      // ✅ FIXED: Auto-expand all assignments - using index directly
      const allKeys = new Set<number>();
      assignmentsWithStudents.forEach((_assignment: Assignment, index: number) => {
        allKeys.add(index);
      });
      setExpandedAssignments(allKeys);
    } catch (err) {
      console.error("Error fetching teacher assignments:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAssignment = (key: number) => {
    const newExpanded = new Set(expandedAssignments);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedAssignments(newExpanded);
  };

  const getFilteredAssignments = () => {
    if (!searchTerm) return assignments;

    return assignments
      .map((assignment) => ({
        ...assignment,
        students: assignment.students.filter(
          (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.roll_number && student.roll_number.includes(searchTerm))
        ),
      }))
      .filter((assignment) => assignment.students.length > 0);
  };

  const filteredAssignments = getFilteredAssignments();

  const totalUniqueStudents = () => {
    const uniqueStudentIds = new Set<number>();
    for (const assignment of assignments) {
      for (const student of assignment.students) {
        uniqueStudentIds.add(student.id);
      }
    }
    return uniqueStudentIds.size;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Headmaster":
        return "👨‍💼";
      case "Headmistress":
        return "👩‍💼";
      case "Academic":
        return "🎓";
      case "Teacher":
        return "👨‍🏫";
      default:
        return "👨‍🏫";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading teacher data...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6">
          <MobileCard gradient="bg-gradient-to-r from-red-50 to-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="font-semibold text-red-700 text-sm sm:text-base">{error}</p>
                <Button onClick={() => router.push("/teachers")} className="touch-feedback">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teachers
                </Button>
              </div>
            </CardContent>
          </MobileCard>
        </div>
      </MainLayout>
    );
  }

  const totalStudents = totalUniqueStudents();
  const totalAssignments = assignments.length;

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Teacher's Students"
          subtitle={
            teacher
              ? `${getRoleIcon(teacher.role)} ${teacher.name} (${teacher.role}) - Students they teach`
              : "Students they teach"
          }
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalStudents} Students
            </span>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Total Students"
            value={totalStudents}
            icon={Users}
            color="blue"
            subtitle="All students taught"
          />
          <MobileStatCard
            label="Assignments"
            value={totalAssignments}
            icon={BookOpen}
            color="purple"
            subtitle="Subject-Class-Stream"
          />
          <MobileStatCard
            label="Subjects"
            value={new Set(assignments.map((a) => a.subject_name)).size}
            icon={GraduationCap}
            color="emerald"
            subtitle="Different subjects"
          />
          <MobileStatCard
            label="Classes"
            value={new Set(assignments.map((a) => a.class_name)).size}
            icon={School}
            color="amber"
            subtitle="Different classes"
          />
        </div>

        {/* No Assignments State */}
        {assignments.length === 0 ? (
          <MobileCard>
            <div className="h-1 w-full bg-gradient-to-r from-gray-500 to-gray-600" />
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">This teacher has no assigned subjects yet.</p>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm px-4">
                  Assign them to subjects, classes, and streams first.
                </p>
                <Button
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all touch-feedback"
                  onClick={() => router.push(`/teachers/assign-subjects`)}
                >
                  Assign Teacher
                </Button>
              </div>
            </CardContent>
          </MobileCard>
        ) : (
          <>
            {/* Search Bar */}
            <MobileCard hover={false} delay={100}>
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name or roll number..."
                    className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </MobileCard>

            {/* Assignments */}
            <div className="space-y-4 sm:space-y-6">
              {filteredAssignments.map((assignment, idx) => {
                const isExpanded = expandedAssignments.has(idx);
                const hasStudents = assignment.students.length > 0;

                return (
                  <MobileCard key={idx} delay={idx * 100}>
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    {/* Assignment Header - Collapsible */}
                    <div
                      className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                      onClick={() => toggleAssignment(idx)}
                    >
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <span className="text-base sm:text-lg font-bold text-gray-800">
                          {assignment.subject_name}
                        </span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-1">
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium bg-blue-100 text-blue-700">
                            <GraduationCap className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {assignment.class_name}
                          </span>
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium bg-purple-100 text-purple-700">
                            <Layers className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            Stream {assignment.stream_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-white/60 rounded-full backdrop-blur-sm ml-1">
                          <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500" />
                          <span className="text-[10px] sm:text-sm font-medium text-gray-600">
                            {assignment.uniqueStudentCount} students
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">
                          {isExpanded ? "Collapse" : "Expand"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Assignment Content - Students Table */}
                    {isExpanded && (
                      <CardContent className="p-0">
                        {!hasStudents ? (
                          <div className="text-center py-8 sm:py-12">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
                              <p className="text-gray-500 text-xs sm:text-sm">
                                No students enrolled in {assignment.class_name} Stream {assignment.stream_name}{" "}
                                for {assignment.subject_name}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <MobileTableWrapper>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50/80">
                                  <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                                  <TableHead className="text-xs sm:text-sm min-w-[140px]">Student Name</TableHead>
                                  <TableHead className="text-xs sm:text-sm hidden xs:table-cell w-20">Gender</TableHead>
                                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Roll Number</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {assignment.students.map((student, studentIdx) => (
                                  <TableRow
                                    key={student.id}
                                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                                    style={{ animationDelay: `${studentIdx * 30}ms` }}
                                  >
                                    <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                                      {studentIdx + 1}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                                          {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                                          {student.name}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden xs:table-cell">
                                      <span
                                        className={cn(
                                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                                          student.sex === "M"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-pink-100 text-pink-700"
                                        )}
                                      >
                                        {student.sex === "M" ? "Male" : "Female"}
                                      </span>
                                    </TableCell>
                                    <TableCell className="font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                                      {student.roll_number || "-"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </MobileTableWrapper>
                        )}
                      </CardContent>
                    )}
                  </MobileCard>
                );
              })}

              {filteredAssignments.length === 0 && searchTerm && (
                <MobileCard>
                  <CardContent className="py-12 sm:py-16 text-center">
                    <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm sm:text-base">No students found matching your search</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
                  </CardContent>
                </MobileCard>
              )}
            </div>
          </>
        )}

        {/* Info Box - Teacher Profile */}
        {assignments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-blue-800 text-xs sm:text-sm">👨‍🏫 Teacher</p>
                  <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">{teacher?.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-purple-800 text-xs sm:text-sm">🏆 Role</p>
                  <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">{teacher?.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-emerald-800 text-xs sm:text-sm">📈 Impact</p>
                  <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                    {totalStudents} students taught across {totalAssignments} assignments
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Teacher's Students</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>👨‍🏫 {teacher?.name || "Teacher"}</span>
            <span>•</span>
            <span>👨‍🎓 {totalStudents} students</span>
            <span>•</span>
            <span>📚 {totalAssignments} assignments</span>
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
          .xs\\:table-cell {
            display: table-cell !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:table-cell {
            display: none !important;
          }
          .xs\\:hidden {
            display: table-cell !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}