// app/primary/results/page.tsx

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
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Trophy,
  Crown,
  Star,
  Calendar,
  Filter,
  Search,
  Eye,
  Award,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  School,
  Building2,
  BadgeCheck,
  Clock,
  RefreshCw,
  ChevronRight,
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
// 🔥 MOBILE LAYOUT COMPONENTS
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
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
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
          {badge && <div className="flex-shrink-0">{badge}</div>}
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

// ✅ FIXED: MobileAlert with children support
function MobileAlert({
  type,
  message,
  children,
  onClose,
}: {
  type: "error" | "warning" | "info";
  message: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  const styles = {
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
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
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base break-words font-medium">{message}</p>
        {children && <div className="mt-1">{children}</div>}
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
  color = "sky",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan";
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
      <div className="px-4 sm:px-0 min-w-[700px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🔥 GROUP CARD COMPONENT
// ============================================================
function GroupCard({
  group,
  teacherId,
  handleEditMarks,
}: {
  group: GroupData;
  teacherId: number;
  handleEditMarks: (studentId: number, subjectId: number, teacherId: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedStudents = Array.from(group.students.entries()).sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  );
  const examTypes = Array.from(group.exam_types).sort();

  return (
    <Card className="border border-gray-200 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Group Header - Collapsible */}
      <div
        className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white cursor-pointer hover:bg-gray-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white">
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <span className="font-bold text-sky-700 text-sm sm:text-base truncate max-w-[80px] sm:max-w-[150px]">
            {group.subject_name}
          </span>
          <span className="text-gray-300 hidden xs:inline">|</span>
          <span className="text-gray-600 text-xs sm:text-sm hidden xs:inline">
            {group.class_name}
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">
            Mkondo {group.stream_name}
          </span>
          <span className="ml-auto text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {sortedStudents.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">
            {examTypes.length} aina
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
        <CardContent className="p-0">
          <MobileTableWrapper>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80">
                  <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                  <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina la Mwanafunzi</TableHead>
                  {examTypes.map((et) => (
                    <TableHead
                      key={et}
                      className="text-center min-w-[70px] sm:min-w-[100px] bg-gradient-to-r from-sky-50 to-blue-50"
                    >
                      <span className="font-bold text-sky-700 text-[8px] sm:text-xs">{et}</span>
                    </TableHead>
                  ))}
                  <TableHead className="text-center w-16 sm:w-24 text-xs sm:text-sm">Vitendo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map(([studentId, studentData], studentIdx) => (
                  <TableRow
                    key={studentId}
                    className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group"
                  >
                    <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                      {studentIdx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[8px] sm:text-xs font-bold flex-shrink-0">
                          {studentData.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                          {studentData.name}
                        </span>
                      </div>
                    </TableCell>
                    {examTypes.map((et) => (
                      <TableCell key={et} className="text-center">
                        {studentData.marks.has(et) ? (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs sm:text-sm min-w-[40px] sm:min-w-[50px]">
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
                        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                        onClick={() =>
                          handleEditMarks(studentId, group.subject_id, teacherId)
                        }
                        title="Hariri Alama"
                      >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </MobileTableWrapper>
        </CardContent>
      )}
    </Card>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function MatokeoYaWalimuWotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);

  const [teacherGroups, setTeacherGroups] = useState<TeacherGroup[]>([]);
  const [teachersWithoutMarks, setTeachersWithoutMarks] = useState<Teacher[]>([]);
  const [allExamTypes, setAllExamTypes] = useState<string[]>([]);

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

      const teacherGroupsArray = Array.from(teacherMap.values()).map((teacher) => ({
        ...teacher,
        groups: teacher.groups,
      }));

      setTeacherGroups(teacherGroupsArray);
      setAllExamTypes(Array.from(allExamSet).sort());

      const teachersWithout = teachers.filter((t) => !teachersWithMarksSet.has(t.id));
      setTeachersWithoutMarks(teachersWithout);

      if (data.years) setYears(data.years);
    } catch (err: any) {
      console.error("Error fetching results:", err);
      setError(err.message || "Imeshindwa kupakia matokeo");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    fetchAllResults(token, selectedTeacherId, selectedYear);
  };

  const handleEditMarks = (studentId: number, subjectId: number, teacherId: number) => {
    router.push(`/primary/marks/edit/${studentId}/${subjectId}?teacher_id=${teacherId}`);
  };

  // Calculate stats
  const totalTeachers = teacherGroups.length;
  const totalGroups = teacherGroups.reduce((acc, t) => acc + t.groups.length, 0);
  const totalStudents = teacherGroups.reduce(
    (acc, t) => acc + t.groups.reduce((acc2, g) => acc2 + g.students.size, 0),
    0
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia matokeo...
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
          title="Matokeo ya Walimu Wote"
          subtitle="Tazama na simamia alama za walimu wote"
          icon={<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTeachers} Walimu
            </span>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Walimu"
            value={totalTeachers}
            icon={Users}
            color="sky"
            subtitle="Wamejaza alama"
          />
          <MobileStatCard
            label="Makundi"
            value={totalGroups}
            icon={Layers}
            color="purple"
            subtitle="Somo-Darasa-Mkondo"
          />
          <MobileStatCard
            label="Wanafunzi"
            value={totalStudents}
            icon={GraduationCap}
            color="emerald"
            subtitle="Wamejaziwa alama"
          />
          <MobileStatCard
            label="Aina za Mtihani"
            value={allExamTypes.length}
            icon={Trophy}
            color="amber"
            subtitle="Tofauti"
          />
        </div>

        {/* Filters */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-sky-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Vichujio</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-sky-600" />
                  Mwalimu
                </Label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="-- Walimu Wote --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="">-- Walimu Wote --</SelectItem>
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
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  Mwaka
                </Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="-- Miaka Yote --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="">-- Miaka Yote --</SelectItem>
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
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tekeleza Vichujio
                </Button>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* ✅ FIXED: Teachers Without Marks Warning with children */}
        {teachersWithoutMarks.length > 0 && (
          <MobileAlert
            type="warning"
            message={`Walimu ${teachersWithoutMarks.length} wasio na alama`}
          >
            <div className="flex flex-wrap gap-1.5 mt-2">
              {teachersWithoutMarks.map((teacher) => (
                <span
                  key={teacher.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-medium"
                >
                  <User className="h-3 w-3" />
                  {teacher.name}
                </span>
              ))}
            </div>
          </MobileAlert>
        )}

        {/* Results - Grouped by Teacher */}
        {teacherGroups.length === 0 ? (
          <MobileCard>
            <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">
                  Hakuna alama zilizopatikana
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Tafadhali ongeza alama kwanza au jaribu kuchagua vichujio tofauti.
                </p>
              </div>
            </CardContent>
          </MobileCard>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {teacherGroups.map((teacher) => (
              <MobileCard key={teacher.teacher_id} delay={0}>
                <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
                <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    {teacher.teacher_name}
                    <span className="text-xs sm:text-sm text-sky-100/80 ml-2">
                      ({teacher.groups.length} makundi)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {teacher.groups.map((group, groupIdx) => (
                    <GroupCard
                      key={groupIdx}
                      group={group}
                      teacherId={teacher.teacher_id}
                      handleEditMarks={handleEditMarks}
                    />
                  ))}
                </CardContent>
              </MobileCard>
            ))}
          </div>
        )}

        {/* Info Box */}
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
                  Tazama alama zote za walimu kwa darasa na somo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✏️ Hariri Alama</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Bonyeza ikoni ya hariri kurekebisha alama za mwanafunzi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">🔍 Vichujio</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Chuja kwa mwalimu au mwaka kupata matokeo unayotaka
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Matokeo ya Walimu</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🏫 {totalTeachers} walimu</span>
            <span>•</span>
            <span>📚 {totalGroups} makundi</span>
            <span>•</span>
            <span>👨‍🎓 {totalStudents} wanafunzi</span>
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