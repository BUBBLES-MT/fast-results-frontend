// app/primary/marks/add/page.tsx

"use client";

import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Award,
  School,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Trophy,
  Crown,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  Filter,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Eye,
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
  stream_id: number;
}

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface Class {
  id: number;
  name: string;
}

interface Stream {
  id: number;
  name: string;
  class_id: number;
}

const AINA_ZAMTIHANI = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL"];

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

function MobileAlert({
  type,
  message,
  onClose,
}: {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
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

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[800px] sm:min-w-full">{children}</div>
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

// ============================================================
// 🔥 HELPERS
// ============================================================
const getSchoolLevel = (): string => {
  if (typeof window === "undefined") return "primary";
  return localStorage.getItem("school_level") || "primary";
};

const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE";
};

const isPrimary = getSchoolLevel() === "primary";
const MAX_SCORE = isPrimary ? 50 : 100;

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function OngezaAlamaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [schoolId, setSchoolId] = useState<string>("");
  const [userRole, setUserRole] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);

  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [formData, setFormData] = useState({
    subject_id: "",
    class_id: "",
    stream_id: "",
    exam_type: "MIDTERM3",
  });

  const [studentMarks, setStudentMarks] = useState<Map<number, string>>(new Map());
  const [loadingStudents, setLoadingStudents] = useState(false);

  // ============================================================
  // 🔥 FETCH DATA
  // ============================================================
  const fetchData = async (authToken: string) => {
    try {
      const storedSchoolId = localStorage.getItem("school_id");
      const role = localStorage.getItem("user_type");
      setUserRole(role || "");
      setSchoolId(storedSchoolId || "");

      const baseUrl = isPrimary ? "/api/v1/primary" : "/api/v1";

      // Subjects
      const subjectsRes = await fetch(`${API_BASE}${baseUrl}/teachers/me/subjects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(data);
      } else {
        setError("Imeshindwa kupata masomo yako");
        setLoading(false);
        return;
      }

      // Classes
      const classesRes = await fetch(`${API_BASE}${baseUrl}/classes?school_id=${storedSchoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(data);
      } else {
        setError("Imeshindwa kupata madarasa");
        setLoading(false);
        return;
      }

      // Streams
      const streamsRes = await fetch(`${API_BASE}${baseUrl}/streams?school_id=${storedSchoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (streamsRes.ok) {
        const data = await streamsRes.json();
        setStreams(data);
      } else {
        setError("Imeshindwa kupata mikondo");
        setLoading(false);
        return;
      }

      if (formData.subject_id) {
        filterClassesBySubject(parseInt(formData.subject_id));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Imeshindwa kupata data");
    } finally {
      setLoading(false);
    }
  };

  const filterClassesBySubject = (subjectId: number) => {
    setFilteredClasses(classes);
    setFormData((prev) => ({ ...prev, class_id: "", stream_id: "all" }));
    setStudents([]);
  };

  const filterStreamsByClass = (classId: number) => {
    const filtered = streams.filter((s) => s.class_id === classId);
    setFilteredStreams(filtered);
    setFormData((prev) => ({ ...prev, stream_id: "all" }));
    setStudents([]);
  };

  // ============================================================
  // 🔥 FETCH STUDENTS
  // ============================================================
  const fetchStudents = async () => {
    const { class_id, stream_id, subject_id } = formData;
    if (!class_id || !subject_id) return;

    setLoadingStudents(true);
    setError("");

    try {
      const storedSchoolId = localStorage.getItem("school_id");
      const baseUrl = isPrimary ? "/api/v1/primary" : "/api/v1";
      const isTeacher = userRole === "Mwalimu" || userRole === "Teacher";

      let url = "";
      if (isTeacher) {
        url = `${API_BASE}${baseUrl}/students/my-students?class_id=${class_id}&school_id=${storedSchoolId}`;
        if (stream_id && stream_id !== "all" && stream_id !== "") {
          url += `&stream_id=${stream_id}`;
        }
      } else {
        url = `${API_BASE}${baseUrl}/students?class_id=${class_id}&school_id=${storedSchoolId}`;
        if (stream_id && stream_id !== "all" && stream_id !== "") {
          url += `&stream_id=${stream_id}`;
        }
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();

        const checkUrl = `${API_BASE}${baseUrl}/marks/check?subject_id=${subject_id}&exam_type=${formData.exam_type}&class_id=${class_id}&school_id=${storedSchoolId}`;
        const checkResponse = await fetch(checkUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let markedStudentIds: number[] = [];
        if (checkResponse.ok) {
          const marksData = await checkResponse.json();
          markedStudentIds = marksData.map((m: any) => m.student_id);
        }

        const filteredStudents = data.filter((student: Student) => {
          return !markedStudentIds.includes(student.id);
        });

        setStudents(filteredStudents);

        const newMarks = new Map<number, string>();
        filteredStudents.forEach((student: Student) => {
          newMarks.set(student.id, "");
        });
        setStudentMarks(newMarks);

        if (filteredStudents.length === 0) {
          setError("Wanafunzi wote katika darasa hili wamejaziwa alama za somo hili.");
        }
      } else {
        setError("Imeshindwa kupata wanafunzi");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Imeshindwa kupata wanafunzi");
    } finally {
      setLoadingStudents(false);
    }
  };

  // ============================================================
  // 🔥 USE EFFECTS
  // ============================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, [router]);

  useEffect(() => {
    if (formData.subject_id && classes.length > 0) {
      filterClassesBySubject(parseInt(formData.subject_id));
    }
  }, [formData.subject_id, classes]);

  useEffect(() => {
    if (formData.class_id && streams.length > 0) {
      filterStreamsByClass(parseInt(formData.class_id));
    }
  }, [formData.class_id, streams]);

  useEffect(() => {
    if (
      formData.class_id &&
      formData.class_id !== "" &&
      formData.subject_id &&
      formData.subject_id !== "" &&
      formData.exam_type
    ) {
      fetchStudents();
    }
  }, [formData.class_id, formData.stream_id, formData.subject_id, formData.exam_type]);

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const handleSubjectChange = (value: string) => {
    setFormData({ ...formData, subject_id: value, class_id: "", stream_id: "all" });
    setStudents([]);
  };

  const handleClassChange = (value: string) => {
    setFormData({ ...formData, class_id: value, stream_id: "all" });
    setStudents([]);
  };

  const handleStreamChange = (value: string) => {
    setFormData({ ...formData, stream_id: value === "all" ? "" : value });
  };

  const handleExamTypeChange = (value: string) => {
    setFormData({ ...formData, exam_type: value });
  };

  const handleMarkChange = (studentId: number, value: string) => {
    const newMarks = new Map(studentMarks);
    newMarks.set(studentId, value);
    setStudentMarks(newMarks);
  };

  // ============================================================
  // 🔥 SAVE ALL MARKS
  // ============================================================
  const handleSaveAll = async () => {
    if (!formData.subject_id || !formData.class_id || !formData.exam_type) {
      setError("Tafadhali chagua somo, darasa, na aina ya mtihani");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id");
    const storedSchoolId = localStorage.getItem("school_id");
    const baseUrl = isPrimary ? "/api/v1/primary" : "/api/v1";
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      setError("Tafadhali ingia tena. Hakuna token.");
      setSaving(false);
      router.push("/login");
      return;
    }

    let savedCount = 0;
    let failedCount = 0;

    for (const student of students) {
      const score = studentMarks.get(student.id);
      if (score && score.trim() !== "") {
        const scoreNum = parseFloat(score);

        if (scoreNum < 0 || scoreNum > MAX_SCORE) {
          setError(`Alama lazima iwe kati ya 0 na ${MAX_SCORE}`);
          setSaving(false);
          return;
        }

        try {
          const payload = {
            student_id: student.id,
            subject_id: parseInt(formData.subject_id),
            score: scoreNum,
            exam_type: formData.exam_type,
            teacher_id: parseInt(teacherId || "0"),
            school_id: parseInt(storedSchoolId || "0"),
          };

          const url = `${API_BASE}${baseUrl}/marks`;
          console.log(`📤 Sending to: ${url}`);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            savedCount++;
          } else {
            const errData = await response.json();
            console.error("❌ Error saving mark:", errData);
            failedCount++;

            if (response.status === 401) {
              setError("Wakati wako umeisha. Tafadhali ingia tena.");
              localStorage.removeItem("token");
              setTimeout(() => router.push("/login"), 2000);
              setSaving(false);
              return;
            }
          }
        } catch (err) {
          console.error("❌ Error saving mark:", err);
          failedCount++;
        }
      }
    }

    if (savedCount > 0) {
      setSuccess(
        `Alama ${savedCount} zimehifadhiwa kikamilifu. ${failedCount > 0 ? `${failedCount} zimeshindwa.` : ""}`
      );
      const newMarks = new Map<number, string>();
      students.forEach((student) => {
        newMarks.set(student.id, "");
      });
      setStudentMarks(newMarks);
      fetchStudents();
    } else {
      setError("Hakuna alama zilizohifadhiwa. Tafadhali ingiza alama kwanza.");
    }

    setSaving(false);
  };

  // ============================================================
  // 🔥 BULK FILL
  // ============================================================
  const handleBulkFill = () => {
    const value = prompt(`Ingiza alama ya kuwapa wanafunzi wote (0-${MAX_SCORE}):`);
    if (value !== null) {
      const score = parseFloat(value);
      if (isNaN(score) || score < 0 || score > MAX_SCORE) {
        setError(`Tafadhali ingiza alama sahihi kati ya 0 na ${MAX_SCORE}`);
        return;
      }
      const newMarks = new Map(studentMarks);
      students.forEach((student) => {
        newMarks.set(student.id, value);
      });
      setStudentMarks(newMarks);
    }
  };

  // Calculate stats
  const totalSubjects = subjects.length;
  const totalClasses = classes.length;
  const totalStudents = students.length;

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

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Ongeza Alama"
          subtitle={`Chagua somo, darasa, na ingiza alama kwa wanafunzi • ${isPrimary ? "Msingi (0-50)" : "Sekondari (0-100)"}`}
          icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Award className="h-3 w-3 sm:h-4 sm:w-4" />
              {isPrimary ? "Msingi" : "Sekondari"}
            </span>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Masomo"
            value={totalSubjects}
            icon={BookOpen}
            color="sky"
            subtitle="Uliyopangiwa"
          />
          <MobileStatCard
            label="Madarasa"
            value={totalClasses}
            icon={GraduationCap}
            color="purple"
            subtitle="Yanayopatikana"
          />
          <MobileStatCard
            label="Wanafunzi"
            value={totalStudents}
            icon={Users}
            color="emerald"
            subtitle="Wanaosubiri"
          />
          <MobileStatCard
            label="Alama"
            value={`0-${MAX_SCORE}`}
            icon={Award}
            color="amber"
            subtitle={isPrimary ? "Shule ya Msingi" : "Shule ya Sekondari"}
          />
        </div>

        {/* Selection Form */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Chagua Vigezo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {error && !subjects.length && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Subject */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                  Somo *
                </Label>
                <Select value={formData.subject_id} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue
                      placeholder={subjects.length > 0 ? "Chagua Somo" : "Hujapangiwa Somo"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {subjects.length > 0 && (
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Masomo {subjects.length} uliyopangiwa
                  </p>
                )}
              </div>

              {/* Class */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                  Darasa *
                </Label>
                <Select
                  value={formData.class_id}
                  onValueChange={handleClassChange}
                  disabled={!formData.subject_id || filteredClasses.length === 0}
                >
                  <SelectTrigger
                    className={cn(
                      "bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm",
                      (!formData.subject_id || filteredClasses.length === 0) && "opacity-50"
                    )}
                  >
                    <SelectValue
                      placeholder={
                        !formData.subject_id
                          ? "Chagua Somo Kwanza"
                          : filteredClasses.length === 0
                          ? "Hakuna Darasa"
                          : "Chagua Darasa"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {filteredClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.subject_id && filteredClasses.length === 0 && (
                  <p className="text-[10px] sm:text-xs text-amber-600">
                    ⚠️ Hakuna darasa kwa somo hili
                  </p>
                )}
                {formData.class_id && (
                  <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Darasa limechaguliwa
                  </p>
                )}
              </div>

              {/* Stream */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-purple-600" />
                  Mkondo (Si Lazima)
                </Label>
                <Select
                  value={formData.stream_id || "all"}
                  onValueChange={handleStreamChange}
                  disabled={!formData.class_id || filteredStreams.length === 0}
                >
                  <SelectTrigger
                    className={cn(
                      "bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm",
                      (!formData.class_id || filteredStreams.length === 0) && "opacity-50"
                    )}
                  >
                    <SelectValue
                      placeholder={
                        !formData.class_id
                          ? "Chagua Darasa Kwanza"
                          : filteredStreams.length === 0
                          ? "Hakuna Mikondo"
                          : "Mikondo Yote"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="all">✅ Mikondo Yote</SelectItem>
                    {filteredStreams.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.class_id && filteredStreams.length === 0 && (
                  <p className="text-[10px] sm:text-xs text-amber-600">
                    ⚠️ Hakuna mikondo kwa darasa hili
                  </p>
                )}
                {formData.class_id && filteredStreams.length > 0 && (
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Mikondo {filteredStreams.length} inapatikana
                  </p>
                )}
              </div>

              {/* Exam Type */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "400ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  Aina ya Mtihani *
                </Label>
                <Select value={formData.exam_type} onValueChange={handleExamTypeChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua Aina ya Mtihani" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {AINA_ZAMTIHANI.map((et) => (
                      <SelectItem key={et} value={et}>
                        {et}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Students Table */}
        {students.length > 0 && (
          <MobileCard delay={200}>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 gap-3 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-emerald-800 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>
                  Wanafunzi
                  {formData.stream_id && formData.stream_id !== "all"
                    ? ` (Mkondo ${filteredStreams.find((s) => s.id.toString() === formData.stream_id)?.name})`
                    : " (Mikondo Yote)"}
                </span>
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Jumla: {students.length})
                </span>
              </CardTitle>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleBulkFill}
                  className="gap-1 sm:gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback flex-1 sm:flex-none"
                >
                  📝 Jaza Wote
                </Button>
                <Button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback flex-1 sm:flex-none"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                  {saving ? "Inahifadhi..." : "Hifadhi Alama Zote"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingStudents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-3 sm:p-4">
                      <MobileAlert type="error" message={error} onClose={() => setError("")} />
                    </div>
                  )}
                  {success && (
                    <div className="p-3 sm:p-4">
                      <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />
                    </div>
                  )}
                  <MobileTableWrapper>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80">
                          <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                          <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina la Mwanafunzi</TableHead>
                          <TableHead className="min-w-[50px] text-center text-xs sm:text-sm hidden xs:table-cell">
                            Jinsia
                          </TableHead>
                          <TableHead className="min-w-[80px] text-xs sm:text-sm hidden sm:table-cell">
                            Namba
                          </TableHead>
                          <TableHead className="min-w-[80px] text-xs sm:text-sm hidden md:table-cell">
                            Darasa
                          </TableHead>
                          <TableHead className="min-w-[70px] text-xs sm:text-sm hidden lg:table-cell">
                            Mkondo
                          </TableHead>
                          <TableHead className="min-w-[120px] text-center text-xs sm:text-sm">
                            Alama {isPrimary ? "(0-50)" : "(0-100)"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student, idx) => {
                          const className = classes.find((c) => c.id === student.class_id)?.name ||
                            "—";
                          const streamName = streams.find((s) => s.id === student.stream_id)
                            ?.name || "—";

                          return (
                            <TableRow
                              key={student.id}
                              className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group animate-fadeIn"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <TableCell className="text-center text-xs sm:text-sm font-medium text-gray-500">
                                {idx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[8px] sm:text-xs font-bold flex-shrink-0">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                                    {student.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center hidden xs:table-cell">
                                <span
                                  className={cn(
                                    "inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                                    student.sex === "M"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-pink-100 text-pink-700"
                                  )}
                                >
                                  {pataJinsia(student.sex)}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                                {student.roll_number || "-"}
                              </TableCell>
                              <TableCell className="text-gray-600 text-[10px] sm:text-sm hidden md:table-cell">
                                <span className="inline-flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3 text-indigo-400" />
                                  {className}
                                </span>
                              </TableCell>
                              <TableCell className="text-gray-600 text-[10px] sm:text-sm hidden lg:table-cell">
                                <span className="inline-flex items-center gap-1">
                                  <Layers className="h-3 w-3 text-purple-400" />
                                  {streamName}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max={MAX_SCORE}
                                  className="w-24 sm:w-32 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl text-center h-9 sm:h-10 text-sm"
                                  placeholder={isPrimary ? "0-50" : "0-100"}
                                  value={studentMarks.get(student.id) || ""}
                                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </MobileTableWrapper>

                  {/* Summary Footer */}
                  <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 mx-3 sm:mx-4 mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-2 sm:gap-4">
                      <span>
                        Jumla ya Wanafunzi:{" "}
                        <span className="font-bold text-gray-800">{students.length}</span>
                      </span>
                      {students.some(
                        (s) =>
                          studentMarks.get(s.id) && studentMarks.get(s.id)!.trim() !== ""
                      ) && (
                        <span>
                          Wamejaziwa:{" "}
                          <span className="font-bold text-emerald-600">
                            {
                              students.filter(
                                (s) =>
                                  studentMarks.get(s.id) &&
                                  studentMarks.get(s.id)!.trim() !== ""
                              ).length
                            }
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </MobileCard>
        )}

        {/* No Data States */}
        {!loading && subjects.length === 0 && (
          <MobileCard>
            <CardContent className="py-12 sm:py-16 text-center">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-amber-500 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-semibold text-gray-700">
                Hujapangiwa Masomo
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto px-4">
                Wasiliana na Mkuu wa Shule au Mtaaluma ili kupangiwa masomo.
              </p>
            </CardContent>
          </MobileCard>
        )}

        {!loading &&
          subjects.length > 0 &&
          formData.subject_id &&
          formData.class_id &&
          students.length === 0 && (
            <MobileCard>
              <CardContent className="py-12 sm:py-16 text-center">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-emerald-500 mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-semibold text-gray-700">
                  Wanafunzi Wote Wamejaziwa! 🎉
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto px-4">
                  Wanafunzi wote katika darasa hili wamejaziwa alama za somo hili.
                </p>
                <Button
                  onClick={() => {
                    setFormData({ ...formData, class_id: "", stream_id: "all" });
                    setStudents([]);
                  }}
                  className="mt-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-xl touch-feedback"
                >
                  Chagua Darasa Nyingine
                </Button>
              </CardContent>
            </MobileCard>
          )}

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">📚 Chagua Somo</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Chagua somo unalofundisha na darasa la wanafunzi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">📝 Ingiza Alama</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Ingiza alama kwa kila mwanafunzi kulingana na aina ya mtihani
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">💾 Hifadhi</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Hifadhi alama zote kwa bonyeza moja. Alama zinawekwa kwenye rekodi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Ongeza Alama</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalSubjects} masomo</span>
            <span>•</span>
            <span>👨‍🎓 {totalStudents} wanafunzi</span>
            <span>•</span>
            <span>📊 {isPrimary ? "Msingi (0-50)" : "Sekondari (0-100)"}</span>
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