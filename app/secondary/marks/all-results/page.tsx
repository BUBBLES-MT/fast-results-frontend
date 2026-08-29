// app/secondary/results/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Loader2,
  Edit,
  AlertTriangle,
  ChevronLeft,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  Printer,
  BarChart3,
  School,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  Star,
  Trophy,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface Teacher {
  id: number;
  name: string;
}

interface GroupData {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  students: Map<
    number,
    {
      name: string;
      marks: Map<string, number>;
      markIds: Map<string, number>;
    }
  >;
  exam_types: Set<string>;
}

interface TeacherGroup {
  teacher_id: number;
  teacher_name: string;
  groups: GroupData[];
}

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - EXTREME PRO MAX!
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group"
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
  stats,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  stats?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6">
      {/* Decorative blobs */}
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
            {stats && <div className="flex-shrink-0">{stats}</div>}
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
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
}) {
  return (
    <Card
      className={cn(
        "border-0 overflow-hidden rounded-2xl",
        gradient || "bg-white/90 backdrop-blur-sm",
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </Card>
  );
}

// ✅ FIXED: MobileStatCard with ALL colors
function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal" | "indigo" | "pink" | "amber" | "emerald" | "sky" | "rose";
  subtitle?: string;
  onClick?: () => void;
}) {
  // 🔥 ALL GRADIENTS
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    sky: "from-sky-500 to-blue-500",
    green: "from-green-500 to-emerald-500",
    emerald: "from-emerald-500 to-teal-500",
    teal: "from-teal-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-amber-500",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-rose-500",
    rose: "from-rose-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
    pink: "from-pink-500 to-rose-500",
  };

  // 🔥 ALL LIGHT COLORS
  const lightColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    sky: "bg-sky-50 text-sky-600",
    green: "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
    teal: "bg-teal-50 text-teal-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
    pink: "bg-pink-50 text-pink-600",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-3 sm:p-4 text-white shadow-xl cursor-pointer",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
      onClick={onClick}
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

function MobileAlert({
  type,
  message,
}: {
  type: "success" | "error" | "warning" | "info";
  message: string;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
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
      <p className="text-sm sm:text-base break-words">{message}</p>
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

function MobileEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto px-4">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function AllResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");

  // Filter states
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);

  // Data states
  const [teacherGroups, setTeacherGroups] = useState<TeacherGroup[]>([]);
  const [teachersWithoutMarks, setTeachersWithoutMarks] = useState<Teacher[]>([]);
  const [allExamTypes, setAllExamTypes] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    setUserRole(role || "");
    fetchTeachers(storedToken);
    fetchAllResults(storedToken);
  }, [router]);

  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/teachers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const fetchAllResults = async (authToken: string, teacherId?: string, year?: string) => {
    try {
      setLoading(true);
      setError("");

      let url = `${API_BASE}/api/v1/marks/all-results`;
      const params = new URLSearchParams();
      if (teacherId) params.append("teacher_id", teacherId);
      if (year) params.append("year", year);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch results");

      const data = await response.json();

      // Process data into groups
      const teacherMap = new Map<number, TeacherGroup>();
      const allExamSet = new Set<string>();
      const teachersWithMarksSet = new Set<number>();

      for (const mark of data.marks || []) {
        teachersWithMarksSet.add(mark.teacher_id);
        allExamSet.add(mark.exam_type);

        if (!teacherMap.has(mark.teacher_id)) {
          teacherMap.set(mark.teacher_id, {
            teacher_id: mark.teacher_id,
            teacher_name: mark.teacher_name,
            groups: [],
          });
        }

        const teacher = teacherMap.get(mark.teacher_id)!;
        let group = teacher.groups.find(
          (g) =>
            g.subject_id === mark.subject_id &&
            g.class_id === mark.class_id &&
            g.stream_id === mark.stream_id
        );

        if (!group) {
          group = {
            subject_id: mark.subject_id,
            subject_name: mark.subject_name,
            class_id: mark.class_id,
            class_name: mark.class_name,
            stream_id: mark.stream_id,
            stream_name: mark.stream_name,
            students: new Map(),
            exam_types: new Set(),
          };
          teacher.groups.push(group);
        }

        group.exam_types.add(mark.exam_type);

        if (!group.students.has(mark.student_id)) {
          group.students.set(mark.student_id, {
            name: mark.student_name,
            marks: new Map(),
            markIds: new Map(),
          });
        }

        const student = group.students.get(mark.student_id)!;
        student.marks.set(mark.exam_type, mark.score);
        student.markIds.set(mark.exam_type, mark.id);
      }

      // Convert to array and sort
      const teacherGroupsArray = Array.from(teacherMap.values()).map((teacher) => ({
        ...teacher,
        groups: teacher.groups,
      }));

      setTeacherGroups(teacherGroupsArray);
      setAllExamTypes(Array.from(allExamSet).sort());

      // Find teachers without marks
      const teachersWithout = teachers.filter((t) => !teachersWithMarksSet.has(t.id));
      setTeachersWithoutMarks(teachersWithout);

      // Set years
      if (data.years) setYears(data.years);
    } catch (err: any) {
      console.error("Error fetching results:", err);
      setError(err.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    fetchAllResults(token, selectedTeacherId, selectedYear);
  };

  const handleEditMarks = (studentId: number, subjectId: number, teacherId: number) => {
    router.push(`/secondary/marks/edit/${studentId}/${subjectId}?teacher_id=${teacherId}`);
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  // Calculate total stats
  const totalStudents = teacherGroups.reduce(
    (acc, t) => acc + t.groups.reduce((acc2, g) => acc2 + g.students.size, 0),
    0
  );
  const totalGroups = teacherGroups.reduce((acc, t) => acc + t.groups.length, 0);
  const totalTeachers = teacherGroups.length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading results...
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

        {/* Header - EXTREME PRO MAX */}
        <MobileHeader
          title="All Teachers' Results"
          subtitle="View and manage marks for all teachers"
          icon={<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTeachers} Teachers
            </span>
          }
        />

        {/* Stats Grid - EXTREME PRO MAX */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Total Teachers"
            value={totalTeachers}
            icon={Users}
            color="blue"
            subtitle="Active teachers"
          />
          <MobileStatCard
            label="Total Groups"
            value={totalGroups}
            icon={Layers}
            color="purple"
            subtitle="Subject-class-stream"
          />
          <MobileStatCard
            label="Total Students"
            value={totalStudents}
            icon={GraduationCap}
            color="emerald"
            subtitle="With marks entered"
          />
          <MobileStatCard
            label="Exam Types"
            value={allExamTypes.length}
            icon={Award}
            color="amber"
            subtitle="Different exams"
          />
        </div>

        {/* Filters - EXTREME PRO MAX */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/50">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  Teacher
                </Label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="-- All Teachers --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="">-- All Teachers --</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-purple-600" />
                  Year
                </Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="-- All Years --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="">-- All Years --</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleFilterChange}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 touch-feedback"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Teachers Without Marks Warning - EXTREME PRO MAX */}
        {teachersWithoutMarks.length > 0 && (
          <MobileCard gradient="bg-gradient-to-r from-amber-50 to-yellow-50" hover={false}>
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-amber-800 text-sm sm:text-base">
                    Teachers without marks:
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    {teachersWithoutMarks.map((teacher) => (
                      <span
                        key={teacher.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"
                      >
                        <User className="h-3 w-3" />
                        {teacher.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </MobileCard>
        )}

        {/* Results - Grouped by Teacher - EXTREME PRO MAX */}
        {teacherGroups.length === 0 ? (
          <MobileCard>
            <CardContent className="py-12 sm:py-16">
              <MobileEmptyState
                icon={<BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />}
                title="No Marks Found"
                description="No marks have been entered yet. Start adding marks to see results here."
                action={
                  <Button
                    onClick={() => router.push("/secondary/marks/add")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-feedback"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Add Marks
                  </Button>
                }
              />
            </CardContent>
          </MobileCard>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {teacherGroups.map((teacher) => (
              <MobileCard
                key={teacher.teacher_id}
                gradient="bg-gradient-to-r from-white to-blue-50/30"
                className="overflow-hidden"
              >
                {/* Teacher Header - EXTREME PRO MAX */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <User className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-xl font-bold text-white">
                          {teacher.teacher_name}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-blue-100/80">
                          {teacher.groups.length} groups •{" "}
                          {teacher.groups.reduce((acc, g) => acc + g.students.size, 0)} students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs backdrop-blur-sm">
                        <Crown className="h-3 w-3" />
                        Teacher
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {teacher.groups.map((group, groupIdx) => {
                    const sortedStudents = Array.from(group.students.entries()).sort((a, b) =>
                      a[1].name.localeCompare(b[1].name)
                    );
                    const examTypes = Array.from(group.exam_types).sort();
                    const groupKey = `${teacher.teacher_id}-${group.subject_id}-${group.class_id}-${group.stream_id}`;
                    const isExpanded = expandedGroups.has(groupKey);

                    return (
                      <Card
                        key={groupIdx}
                        className="border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Group Header - Collapsible */}
                        <div
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white cursor-pointer hover:bg-gray-100/50 transition-colors"
                          onClick={() => toggleGroup(groupKey)}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <span className="font-bold text-blue-700 text-sm sm:text-base">
                              {group.subject_name}
                            </span>
                            <span className="text-gray-300 hidden xs:inline">|</span>
                            <span className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {group.class_name}
                            </span>
                            <span className="text-gray-300 hidden xs:inline">|</span>
                            <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              Stream {group.stream_name}
                            </span>
                            <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {sortedStudents.length} students
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">
                              {examTypes.length} exam types
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Group Content - Table */}
                        {isExpanded && (
                          <div className="p-0">
                            <MobileTableWrapper>
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-50/80">
                                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                                    <TableHead className="min-w-[140px] text-xs sm:text-sm">
                                      Student Name
                                    </TableHead>
                                    {examTypes.map((et) => (
                                      <TableHead
                                        key={et}
                                        className="text-center min-w-[80px] sm:min-w-[100px] bg-gradient-to-r from-blue-50 to-indigo-50"
                                      >
                                        <span className="font-bold text-blue-700 text-[10px] sm:text-xs">
                                          {et}
                                        </span>
                                      </TableHead>
                                    ))}
                                    <TableHead className="text-center w-16 sm:w-24 text-xs sm:text-sm">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {sortedStudents.map(([studentId, studentData], studentIdx) => (
                                    <TableRow
                                      key={studentId}
                                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                                    >
                                      <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                                        {studentIdx + 1}
                                      </TableCell>
                                      <TableCell className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                                        <div className="flex items-center gap-2">
                                          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0">
                                            {studentData.name.charAt(0).toUpperCase()}
                                          </div>
                                          {studentData.name}
                                        </div>
                                      </TableCell>
                                      {examTypes.map((et) => (
                                        <TableCell key={et} className="text-center">
                                          {studentData.marks.has(et) ? (
                                            <span className="inline-flex items-center justify-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-semibold text-xs sm:text-sm min-w-[40px] sm:min-w-[50px]">
                                              {studentData.marks.get(et)}
                                            </span>
                                          ) : (
                                            <span className="text-gray-300 text-xs sm:text-sm">—</span>
                                          )}
                                        </TableCell>
                                      ))}
                                      <TableCell className="text-center">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-7 sm:h-8 px-1.5 sm:px-2 touch-feedback"
                                          onClick={() =>
                                            handleEditMarks(
                                              studentId,
                                              group.subject_id,
                                              teacher.teacher_id
                                            )
                                          }
                                          title="Edit Marks"
                                        >
                                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                          <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs hidden xs:inline">
                                            Edit
                                          </span>
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </MobileTableWrapper>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </CardContent>
              </MobileCard>
            ))}
          </div>
        )}

        {/* Footer - EXTREME PRO MAX */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100">
          <p className="font-medium">© 2026 MASI FAST RESULTS • Results Dashboard</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>📊 {totalGroups} groups</span>
            <span>•</span>
            <span>👨‍🏫 {totalTeachers} teachers</span>
            <span>•</span>
            <span>🎓 {totalStudents} students</span>
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
          animation: slideIn 0.4s ease-out;
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