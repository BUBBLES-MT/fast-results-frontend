// app/primary/marks/page.tsx

"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  School,
  BookOpen,
  Eye,
  UserCog,
  Star,
  PlusCircle,
  Users,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Layers,
  Trophy,
  Sparkles,
  Crown,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Clock,
  TrendingUp,
  Award,
  BarChart3,
  Filter,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface MarkFromAPI {
  id: number;
  student_id: number;
  student_name: string;
  roll_number?: string;
  subject_id: number;
  subject_name: string;
  score: number;
  exam_type: string;
  teacher_id: number;
  teacher_name?: string;
  class_id?: number;
  class_name?: string;
  stream_id?: number;
  stream_name?: string;
  created_at: string;
}

interface StudentWithMarks {
  id: number;
  name: string;
  roll_number: string;
  marks: Record<string, number>;
  markIds: Record<string, number>;
}

interface GroupData {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  teacher_id: number;
  teacher_name: string;
  students: StudentWithMarks[];
}

interface Teacher {
  id: number;
  name: string;
}

// 🔥 AINA ZA MTIHANI - PRIMARY
const AINA_ZAMTIHANI = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL"];

// 🔥 PRIMARY GRADING (0-50)
const pataDaraja = (alama: number): string => {
  if (alama >= 41) return "A";
  if (alama >= 31) return "B";
  if (alama >= 21) return "C";
  if (alama >= 11) return "D";
  return "E";
};

const pataRangiYaDaraja = (daraja: string): string => {
  switch (daraja) {
    case "A":
      return "bg-emerald-100 text-emerald-800";
    case "B":
      return "bg-blue-100 text-blue-800";
    case "C":
      return "bg-amber-100 text-amber-800";
    case "D":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

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
  children,
  onClose,
}: {
  type: "success" | "error" | "info" | "warning";
  message: string;
  children?: React.ReactNode;
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
      <div className="px-4 sm:px-0 min-w-[800px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🔥 GROUP CARD COMPONENT - PRO MAX!
// ============================================================
const KadiYaKikundi = memo(
  ({
    group,
    canEditGroup,
    saving,
    handleEditMarks,
    handleDeleteStudentMarks,
  }: any) => {
    const sortedStudents = [...group.students].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0">
        {/* Gradient Header */}
        <div
          className={cn(
            "p-4 sm:p-5 cursor-pointer transition-all duration-300",
            canEditGroup
              ? "bg-gradient-to-r from-sky-600 to-blue-600"
              : "bg-gradient-to-r from-gray-600 to-gray-700"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 text-white flex-wrap min-w-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="font-bold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[200px]">
                {group.subject_name}
              </span>
              <span className="text-white/40 hidden xs:inline">|</span>
              <span className="text-xs sm:text-sm text-white/80 hidden xs:inline">
                {group.class_name}
              </span>
              <span className="text-white/40 hidden sm:inline">|</span>
              <span className="text-xs sm:text-sm text-white/70 hidden sm:inline">
                Mkondo {group.stream_name}
              </span>
              <span className="text-white/40 hidden md:inline">|</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white hidden md:inline">
                👨‍🏫 {group.teacher_name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {!canEditGroup && (
                <span className="text-[10px] sm:text-xs bg-amber-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center gap-1">
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Tazama Tu
                </span>
              )}
              {canEditGroup && (
                <span className="text-[10px] sm:text-xs bg-emerald-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center gap-1">
                  ✏️ Inaweza Hariri
                </span>
              )}
              <span className="text-[10px] sm:text-xs bg-white/20 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-white">
                📊 {sortedStudents.length}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              ) : (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Content - Table */}
        {isExpanded && (
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina la Mwanafunzi</TableHead>
                    <TableHead className="min-w-[80px] text-xs sm:text-sm hidden sm:table-cell">
                      Namba
                    </TableHead>
                    {AINA_ZAMTIHANI.map((et) => (
                      <TableHead
                        key={et}
                        className="text-center min-w-[60px] sm:min-w-[80px] bg-gradient-to-r from-sky-50 to-blue-50"
                      >
                        <span className="font-bold text-sky-700 text-[8px] sm:text-xs">
                          {et}
                        </span>
                      </TableHead>
                    ))}
                    {canEditGroup && (
                      <TableHead className="text-center w-16 sm:w-24 text-xs sm:text-sm">
                        Vitendo
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((student: StudentWithMarks, studentIdx: number) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group"
                    >
                      <TableCell className="text-center text-xs sm:text-sm font-medium text-gray-500">
                        {studentIdx + 1}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[8px] sm:text-xs font-bold flex-shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                        {student.roll_number || "-"}
                      </TableCell>
                      {AINA_ZAMTIHANI.map((et) => {
                        const alama = student.marks[et];
                        const daraja = alama ? pataDaraja(alama) : "";
                        return (
                          <TableCell key={et} className="text-center p-1 sm:p-2">
                            {alama !== undefined && alama !== null ? (
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-xs sm:text-base">
                                  {alama}
                                </span>
                                <span
                                  className={cn(
                                    "text-[8px] sm:text-xs px-1.5 py-0.5 rounded-full",
                                    pataRangiYaDaraja(daraja)
                                  )}
                                >
                                  {daraja}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-xs sm:text-lg">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                      {canEditGroup && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              onClick={() => handleEditMarks(student, group)}
                              disabled={saving}
                              title="Hariri alama"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              onClick={() =>
                                handleDeleteStudentMarks(
                                  student.id,
                                  group.subject_id,
                                  student.markIds
                                )
                              }
                              disabled={saving}
                              title="Futa alama zote"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
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
);

KadiYaKikundi.displayName = "KadiYaKikundi";

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function UsimamiziWaAlamaPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [saving, setSaving] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const isMounted = useRef(true);
  const isFetching = useRef(false);

  const [openEditMarks, setOpenEditMarks] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});

  // Admin: Teacher filter
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("self");
  const [isChangingTeacher, setIsChangingTeacher] = useState(false);

  // 🔥🔥🔥 ROLES - KISWAHILI TU!
  const ALLOWED_ROLES = ["Mtaaluma", "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mwalimu"];
  const isAllowed = ALLOWED_ROLES.includes(userRole);

  const ADMIN_ROLES = ["Mtaaluma", "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi"];
  const isAdmin = ADMIN_ROLES.includes(userRole);
  const isTeacher = userRole === "Mwalimu";

  // ============================================================
  // 🔥 PERMISSION LOGIC
  // ============================================================
  const canEditGroup = (groupTeacherId: number): boolean => {
    if (isTeacher) {
      return groupTeacherId === currentUserId;
    }
    if (isAdmin) {
      const isViewingSelf =
        selectedTeacherId === "self" || selectedTeacherId === currentUserId?.toString();
      return isViewingSelf && groupTeacherId === currentUserId;
    }
    return false;
  };

  const canFilterByTeacher = isAdmin;

  // ============================================================
  // 🔥 NAVIGATE TO ADD MARKS
  // ============================================================
  const navigateToAddMarks = () => {
    router.push("/primary/marks/add");
  };

  // ============================================================
  // 🔥 FETCH TEACHERS
  // ============================================================
  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/teachers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
        console.log("✅ Walimu waliopatikana:", data.length);
      } else {
        console.warn("Hakuna walimu waliopatikana");
        setTeachers([]);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachers([]);
    }
  };

  // ============================================================
  // 🔥 FETCH AVAILABLE YEARS
  // ============================================================
  const fetchAvailableYears = async (authToken: string) => {
    try {
      const schoolId = localStorage.getItem("school_id");
      const response = await fetch(
        `${API_BASE}/api/v1/primary/marks/available-years?school_id=${schoolId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableYears(data.years);
        if (data.years.length > 0) {
          setSelectedYear(data.years[0]);
        }
        console.log("📅 Available years:", data.years);
      } else {
        console.warn("Failed to fetch years, using default");
        setAvailableYears([new Date().getFullYear()]);
      }
    } catch (err) {
      console.error("Error fetching years:", err);
      setAvailableYears([new Date().getFullYear()]);
    }
  };

  // ============================================================
  // 🔥 FETCH MARKS DATA
  // ============================================================
  const fetchMarksData = useCallback(
    async (authToken: string, year?: number, teacherId?: string) => {
      if (isFetching.current) return;
      if (!isMounted.current) return;

      isFetching.current = true;
      setLoading(true);
      setError("");

      try {
        const schoolId = localStorage.getItem("school_id");
        const yearToUse = year || selectedYear;
        let url = `${API_BASE}/api/v1/primary/marks/my-students?year=${yearToUse}&school_id=${schoolId}`;

        let effectiveTeacherId = teacherId;

        if (isAdmin && teacherId === "self") {
          effectiveTeacherId = currentUserId?.toString();
        }

        if (
          isAdmin &&
          effectiveTeacherId &&
          effectiveTeacherId !== "all" &&
          effectiveTeacherId !== "self"
        ) {
          url += `&teacher_id=${effectiveTeacherId}`;
        }

        console.log("🔍 Fetching marks from:", url);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const marksList: MarkFromAPI[] = data.marks || [];
        console.log("📊 Received marks:", marksList.length);

        if (marksList.length === 0) {
          setGroups([]);
          setLoading(false);

          if (isTeacher) {
            setError("📝 Bado hujajaza alama za wanafunzi wako kwa mwaka huu.");
          } else if (
            isAdmin &&
            selectedTeacherId !== "self" &&
            selectedTeacherId !== "all"
          ) {
            const teacherName =
              teachers.find((t) => t.id.toString() === selectedTeacherId)?.name ||
              "Mwalimu";
            setError(`📝 Mwalimu "${teacherName}" bado hajajaza alama za wanafunzi wake.`);
          } else if (isAdmin && selectedTeacherId === "all") {
            setError("📝 Hakuna alama zilizopatikana kwa walimu wote.");
          } else {
            setError("📝 Hakuna alama zilizopatikana kwa mwaka uliochagua.");
          }
          return;
        }

        const groupMap = new Map<string, GroupData>();

        for (const mark of marksList) {
          const key = `${mark.subject_id}-${mark.class_id || 0}-${mark.stream_id || 0}-${mark.teacher_id}`;

          if (!groupMap.has(key)) {
            groupMap.set(key, {
              subject_id: mark.subject_id,
              subject_name: mark.subject_name,
              class_id: mark.class_id || 0,
              class_name: mark.class_name || "Haijulikani",
              stream_id: mark.stream_id || 0,
              stream_name: mark.stream_name || "",
              teacher_id: mark.teacher_id,
              teacher_name: mark.teacher_name || "Haijulikani",
              students: [],
            });
          }

          const group = groupMap.get(key)!;
          let student = group.students.find((s) => s.id === mark.student_id);

          if (!student) {
            student = {
              id: mark.student_id,
              name: mark.student_name,
              roll_number: mark.roll_number || "",
              marks: {},
              markIds: {},
            };
            group.students.push(student);
          }

          student.marks[mark.exam_type] = mark.score;
          student.markIds[mark.exam_type] = mark.id;
        }

        const groupsArray = Array.from(groupMap.values());
        setGroups(groupsArray);
        setCurrentPage(1);
        console.log("📚 Groups created:", groupsArray.length);
      } catch (err: any) {
        console.error("Error fetching marks:", err);
        setError(err.message || "Imeshindwa kupakia alama");
        setGroups([]);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
        isFetching.current = false;
      }
    },
    [selectedYear, isAdmin, isTeacher, currentUserId, teachers, userRole]
  );

  // ============================================================
  // INITIALIZATION
  // ============================================================
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const role = localStorage.getItem("user_type");
        const userId = localStorage.getItem("user_id") || localStorage.getItem("teacher_id");

        if (!storedToken) {
          router.push("/login");
          return;
        }

        setToken(storedToken);

        let formattedRole = role || "";
        const roleLower = formattedRole.toLowerCase();

        const roleMap: { [key: string]: string } = {
          mtaaluma: "Mtaaluma",
          "mwalimu mkuu": "Mwalimu Mkuu",
          "mwalimu mkuu msaidizi": "Mwalimu Mkuu Msaidizi",
          mwalimu: "Mwalimu",
          mhasibu: "Mhasibu",
          "msimamizi mkuu": "Msimamizi Mkuu",
        };

        formattedRole = roleMap[roleLower] || "";

        console.log("🔍 Role from localStorage:", role);
        console.log("🔍 Formatted Role:", formattedRole);

        setUserRole(formattedRole);

        if (userId) {
          setCurrentUserId(parseInt(userId));
        }

        const isUserAllowed = ALLOWED_ROLES.includes(formattedRole);

        if (!isUserAllowed) {
          setError(
            "Huna ruhusa ya kuona ukurasa huu. Unahitaji kuwa Mtaaluma, Mwalimu Mkuu, Mwalimu Mkuu Msaidizi, au Mwalimu."
          );
          setLoading(false);
          return;
        }

        if (isTeacher) {
          setTeachers([]);
          setSelectedTeacherId("self");
        } else {
          await fetchTeachers(storedToken);
        }

        await fetchAvailableYears(storedToken);
        await fetchMarksData(storedToken, undefined, "self");
      } catch (err) {
        console.error("Init error:", err);
        setError("Imeshindwa kuanzisha. Tafadhali onyesha upya.");
        setLoading(false);
      }
    };

    init();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // ============================================================
  // HANDLE YEAR CHANGE
  // ============================================================
  const handleYearChange = async (value: string) => {
    const newYear = parseInt(value);
    setSelectedYear(newYear);
    setError("");
    if (token) {
      await fetchMarksData(token, newYear, selectedTeacherId);
    }
  };

  // ============================================================
  // HANDLE TEACHER FILTER CHANGE
  // ============================================================
  const handleTeacherChange = async (value: string) => {
    if (!isAdmin) return;

    setIsChangingTeacher(true);
    setSelectedTeacherId(value);
    setGroups([]);
    setError("");

    if (token) {
      await fetchMarksData(token, selectedYear, value);
    }

    setIsChangingTeacher(false);
  };

  // ============================================================
  // HANDLE EDIT MARKS
  // ============================================================
  const handleEditMarks = (student: StudentWithMarks, group: GroupData) => {
    if (!canEditGroup(group.teacher_id)) {
      setError(
        "Huna ruhusa ya kuhariri alama hizi. Unaweza kuhariri alama zako mwenyewe tu."
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    const formData: Record<string, string> = {};
    AINA_ZAMTIHANI.forEach((et) => {
      formData[et] = student.marks[et]?.toString() || "";
    });
    setEditFormData(formData);
    setEditingStudent({
      student_id: student.id,
      student_name: student.name,
      subject_id: group.subject_id,
      subject_name: group.subject_name,
      marks: student.marks,
      markIds: student.markIds,
    });
    setOpenEditMarks(true);
  };

  // ============================================================
  // HANDLE UPDATE MARKS
  // ============================================================
  const handleUpdateMarks = async () => {
    if (!editingStudent) return;

    setSaving(true);
    setError("");
    setSuccess("");

    let savedCount = 0;

    for (const examType of AINA_ZAMTIHANI) {
      const newScore = editFormData[examType];
      const existingMarkId = editingStudent.markIds[examType];

      if (!newScore || newScore.trim() === "") continue;

      const score = parseFloat(newScore);
      if (isNaN(score) || score < 0 || score > 50) continue;

      try {
        if (existingMarkId) {
          const response = await fetch(`${API_BASE}/api/v1/primary/marks/${existingMarkId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ score, exam_type: examType }),
          });
          if (response.ok) savedCount++;
        } else {
          const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id");
          const response = await fetch(`${API_BASE}/api/v1/primary/marks`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_id: editingStudent.student_id,
              subject_id: editingStudent.subject_id,
              score,
              exam_type: examType,
              teacher_id: parseInt(teacherId || "0"),
            }),
          });
          if (response.ok) savedCount++;
        }
      } catch (err) {
        console.error(`Error saving ${examType}:`, err);
      }
    }

    setOpenEditMarks(false);
    setEditingStudent(null);

    if (savedCount > 0) {
      await fetchMarksData(token, selectedYear, selectedTeacherId);
      setSuccess(`Alama ${savedCount} zimehifadhiwa kikamilifu`);
      setTimeout(() => setSuccess(""), 3000);
    }

    setSaving(false);
  };

  // ============================================================
  // HANDLE DELETE STUDENT MARKS
  // ============================================================
  const handleDeleteStudentMarks = async (
    studentId: number,
    subjectId: number,
    markIds: Record<string, number>
  ) => {
    const group = groups.find((g) => g.subject_id === subjectId);
    if (!group) return;

    if (!canEditGroup(group.teacher_id)) {
      setError(
        "Huna ruhusa ya kufuta alama hizi. Unaweza kufuta alama zako mwenyewe tu."
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!confirm("Je, una uhakika unataka kufuta ALAMA ZOTE za mwanafunzi huyu?")) return;

    for (const markId of Object.values(markIds)) {
      try {
        await fetch(`${API_BASE}/api/v1/primary/marks/${markId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error deleting mark:", err);
      }
    }

    setSuccess("Alama zimefutwa kikamilifu");
    setTimeout(() => setSuccess(""), 3000);

    await fetchMarksData(token, selectedYear, selectedTeacherId);
  };

  // ============================================================
  // FILTER AND PAGINATION
  // ============================================================
  const filteredGroups = groups.filter((group) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      group.subject_name.toLowerCase().includes(searchLower) ||
      group.class_name.toLowerCase().includes(searchLower) ||
      group.teacher_name.toLowerCase().includes(searchLower) ||
      group.students.some(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.roll_number?.toLowerCase().includes(searchLower)
      )
    );
  });

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================================
  // 📊 CALCULATE STATS - FIXED! (Wanafunzi wa kipekee!)
  // ============================================================
  
  // 🔥 HESABU WANAFUNZI, WALIMU, MADARASA, MASOMO NA MAKUNDI YA KIPEEKEE
  const uniqueStudents = new Set<number>();
  const uniqueTeachers = new Set<number>();
  const uniqueClasses = new Set<string>();
  const uniqueSubjects = new Set<string>();
  const uniqueGroups = new Set<string>();  // 🔥 IMEPO SASA!

  groups.forEach((group) => {
    // Ongeza walimu wa kipekee
    if (group.teacher_id) {
      uniqueTeachers.add(group.teacher_id);
    }
    
    // Ongeza madarasa ya kipekee
    if (group.class_name) {
      uniqueClasses.add(group.class_name);
    }
    
    // Ongeza masomo ya kipekee
    if (group.subject_name) {
      uniqueSubjects.add(group.subject_name);
    }
    
    // 🔥 ONGEZA KIKUNDI CHA KIPEEKEE
    const key = `${group.subject_id}-${group.class_id}-${group.stream_id}`;
    uniqueGroups.add(key);
    
    // Ongeza wanafunzi wa kipekee
    group.students.forEach((student) => {
      uniqueStudents.add(student.id);
    });
  });

  // 🔥 STATS ZA KWELI!
  const totalStudents = uniqueStudents.size;    // ✅ 50
  const totalTeachers = uniqueTeachers.size;    // ✅ Walimu wa kipekee
  const totalClasses = uniqueClasses.size;      // ✅ Madarasa ya kipekee (2)
  const totalSubjects = uniqueSubjects.size;    // ✅ Masomo ya kipekee (7)
  const totalGroups = uniqueGroups.size;        // ✅ Makundi ya kipekee (28) - SAHIHI!

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia data...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header - PRO MAX */}
        <MobileHeader
          title="Usimamizi wa Alama"
          subtitle={`Jukumu: ${userRole} • ${
            isAdmin ? "Upatikanaji wa Msimamizi" : isTeacher ? "Upatikanaji wa Mwalimu" : "Haijulikani"
          }`}
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalStudents} Wanafunzi
            </span>
          }
          action={
            <Button
              onClick={navigateToAddMarks}
              className="bg-white text-sky-700 hover:bg-sky-50 shadow-lg hover:shadow-xl transition-all duration-200 gap-1.5 sm:gap-2 rounded-xl font-bold px-3 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm h-auto touch-feedback"
            >
              <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Ongeza Alama Mpya</span>
              <span className="xs:hidden">Ongeza</span>
            </Button>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          
          {/* 1. Wanafunzi */}
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wanafunzi
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

          {/* 2. Walimu */}
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Walimu
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalTeachers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* 3. Masomo */}
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Masomo
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalSubjects}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* 4. Aina za Mtihani */}
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Aina za Mtihani
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {AINA_ZAMTIHANI.length}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-sky-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Vichujio</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Year Filter */}
              {availableYears.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-sky-600" />
                    Chagua Mwaka
                  </Label>
                  <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Teacher Filter - Admin Only */}
              {canFilterByTeacher && teachers.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <UserCog className="h-3.5 w-3.5 text-indigo-600" />
                    Chuja kwa Mwalimu
                  </Label>
                  <Select
                    value={selectedTeacherId}
                    onValueChange={handleTeacherChange}
                    disabled={isChangingTeacher}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue placeholder={teachers.length === 0 ? "Hakuna walimu" : "Chagua mwalimu"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      <SelectItem value="all" className="font-bold text-purple-600 bg-purple-50">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          Walimu Wote
                        </div>
                      </SelectItem>
                      <SelectItem value="self" className="font-bold text-sky-600 bg-sky-50">
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-yellow-500" />
                          Wanafunzi Wangu
                        </div>
                      </SelectItem>
                      <div className="border-t my-1" />
                      {teachers.length === 0 ? (
                        <SelectItem value="none" disabled className="text-gray-400">
                          Hakuna walimu waliopatikana
                        </SelectItem>
                      ) : (
                        teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name} {currentUserId === teacher.id ? "(Wewe)" : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  {teachers.length === 0 && (
                    <p className="text-[10px] sm:text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Hakuna walimu waliopatikana shuleni.
                    </p>
                  )}

                  {selectedTeacherId === "all" && teachers.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-purple-600 mt-1 flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Inaonyesha alama za walimu wote - Huwezi kuhariri alama za walimu wengine
                    </p>
                  )}
                  {selectedTeacherId === "self" && teachers.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-sky-600 mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      Inaonyesha alama za madarasa unayofundisha - Unaweza kuhariri alama hizi
                    </p>
                  )}
                  {isChangingTeacher && (
                    <p className="text-[10px] sm:text-xs text-sky-600 mt-1 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Inapakia data ya mwalimu...
                    </p>
                  )}
                </div>
              )}

              {/* Permission Info */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-purple-600" />
                  Hali ya Sasa
                </Label>
                <div
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs sm:text-sm font-medium",
                    isTeacher
                      ? "bg-emerald-100 text-emerald-700"
                      : isAdmin && selectedTeacherId === "all"
                      ? "bg-purple-100 text-purple-700"
                      : isAdmin && selectedTeacherId === "self"
                      ? "bg-emerald-100 text-emerald-700"
                      : isAdmin &&
                        selectedTeacherId !== "self" &&
                        selectedTeacherId !== currentUserId?.toString()
                      ? "bg-amber-100 text-amber-700"
                      : isAdmin
                      ? "bg-sky-100 text-sky-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {isTeacher && (
                    <span>
                      ✏️ Hali ya Mwalimu - Unaona wanafunzi wako tu, unaweza kuhariri alama zako
                    </span>
                  )}
                  {isAdmin && selectedTeacherId === "all" && (
                    <span>👁️ Kutazama Zote - Unaweza kuona alama za walimu wote</span>
                  )}
                  {isAdmin && selectedTeacherId === "self" && (
                    <span>✏️ Hali ya Kuhariri - Unaweza kubadilisha alama zako</span>
                  )}
                  {isAdmin &&
                    selectedTeacherId !== "self" &&
                    selectedTeacherId !== "all" &&
                    selectedTeacherId !== currentUserId?.toString() && (
                      <span>👁️ Kutazama Tu - Huwezi kuhariri alama za walimu wengine</span>
                    )}
                  {isAdmin &&
                    selectedTeacherId === currentUserId?.toString() &&
                    selectedTeacherId !== "self" && (
                      <span>✏️ Hali ya Kuhariri - Unaweza kubadilisha alama zako</span>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Search */}
        <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tafuta kwa somo, darasa, mwalimu, jina la mwanafunzi, au namba..."
                className="pl-10 bg-white focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* No Data */}
        {groups.length === 0 && !loading && (
          <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
            <CardContent className="py-12 sm:py-16 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700">Hakuna alama zilizopatikana</p>
              <p className="text-sm text-gray-500 mt-2">Mwaka {selectedYear}</p>
              {isTeacher && (
                <p className="text-sm text-gray-500 mt-2">
                  Bado hujajaza alama za wanafunzi wako kwa mwaka huu.
                </p>
              )}
              {isAdmin && selectedTeacherId === "self" && (
                <p className="text-sm text-gray-500 mt-2">
                  Huna alama zozote za madarasa unayofundisha mwaka {selectedYear}.
                </p>
              )}
              {isAdmin && selectedTeacherId === "all" && (
                <p className="text-sm text-gray-500 mt-2">
                  Hakuna alama zilizopatikana kwa walimu wote.
                </p>
              )}
              <Button
                onClick={navigateToAddMarks}
                className="mt-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 gap-2 shadow-lg hover:shadow-xl transition-all rounded-xl touch-feedback"
              >
                <PlusCircle className="h-4 w-4" />
                Ongeza Alama Mpya
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Groups Display */}
        {groups.length > 0 && (
          <>
            <div className="space-y-4 sm:space-y-6">
              {paginatedGroups.map((group, idx) => (
                <KadiYaKikundi
                  key={idx}
                  group={group}
                  canEditGroup={canEditGroup(group.teacher_id)}
                  saving={saving}
                  handleEditMarks={handleEditMarks}
                  handleDeleteStudentMarks={handleDeleteStudentMarks}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="gap-1 sm:gap-2 rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Iliyopita</span>
                </Button>
                <span className="text-xs sm:text-sm text-gray-600">
                  Ukurasa {currentPage} wa {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1 sm:gap-2 rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
                >
                  <span className="hidden xs:inline">Inayofuata</span>
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            )}
          </>
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
                <p className="font-medium text-sky-800 text-xs sm:text-sm">👀 Tazama Alama</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Tazama alama zote za wanafunzi kwa darasa na somo
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
                  Chuja kwa mwalimu au mwaka kupata alama unayotaka
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Usimamizi wa Alama</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🎓 {totalStudents} wanafunzi</span>
            <span>•</span>
            <span>👨‍🏫 {totalTeachers} walimu</span>
            <span>•</span>
            <span>📚 {totalSubjects} masomo</span>
            <span>•</span>
            <span>📅 {selectedYear}</span>
          </p>
        </div>
      </div>

      {/* Edit Marks Dialog */}
      <Dialog open={openEditMarks} onOpenChange={setOpenEditMarks}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-sky-600" />
              Hariri Alama
            </DialogTitle>
            <DialogDescription>
              {editingStudent &&
                `Hariri alama za ${editingStudent.student_name} - ${editingStudent.subject_name}`}
              <span className="block text-amber-600 text-xs sm:text-sm mt-1">
                ⚠️ Shule ya Msingi - Alama 0-50
              </span>
              <span className="block text-blue-600 text-xs sm:text-sm mt-1">
                ℹ️ Unaweza kuhariri alama zako mwenyewe tu
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            {AINA_ZAMTIHANI.map((examType) => (
              <div key={examType} className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                <Label className="font-semibold text-gray-700 text-xs sm:text-sm">{examType}</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  className="col-span-2 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-9 sm:h-10 text-sm"
                  placeholder="0-50"
                  value={editFormData[examType] || ""}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, [examType]: e.target.value });
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOpenEditMarks(false)} className="touch-feedback">
              Ghairi
            </Button>
            <Button
              onClick={handleUpdateMarks}
              disabled={saving}
              className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 touch-feedback"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              {saving ? "Inahifadhi..." : "Hifadhi Alama Zote"}
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
}