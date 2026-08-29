// app/primary/students/my-students/page.tsx

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
  Search,
  FileText,
  BookOpen,
  Users,
  GraduationCap,
  Phone,
  User,
  AlertCircle,
  Eye,
  Filter,
  Layers,
  ChevronLeft,
  Sparkles,
  School,
  Shield,
  ArrowRight,
  RefreshCw,
  X,
  CheckCircle,
  Trophy,
  Crown,
  Star,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  Building,
  Download,
  Printer,
  Menu,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  ChevronRight,
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

interface Student {
  id: number;
  name: string;
  sex: string;
  roll_number: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  subject_id: number;
  subject_name: string;
  father_name: string;
  father_phone: string;
}

interface GroupedStudents {
  class_name: string;
  subject_name: string;
  subject_id: number;
  students: Student[];
}

interface SubjectFilter {
  id: number;
  name: string;
}

interface ClassFilter {
  id: number;
  name: string;
}

// ============================================================
// 🔥 HELPERS
// ============================================================

const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE";
};

const pataRangiYaJinsia = (sex: string): string => {
  return sex === "M"
    ? "bg-blue-100 text-blue-800"
    : "bg-pink-100 text-pink-800";
};

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
  color?: "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan" | "green";
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
    green: "from-green-500 to-teal-500",
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
// 🎯 MAIN COMPONENT
// ============================================================
export default function WanafunziWanguPage() {
  const router = useRouter();
  const [wanafunziWaliopangwa, setWanafunziWaliopangwa] = useState<GroupedStudents[]>([]);
  const [wanafunziWote, setWanafunziWote] = useState<Student[]>([]);
  const [inapakia, setInapakia] = useState(true);
  const [kosa, setKosa] = useState("");
  const [tafuta, setTafuta] = useState("");
  const [jukumuLaMtumiaji, setJukumuLaMtumiaji] = useState("");
  const [token, setToken] = useState("");
  const [schoolId, setSchoolId] = useState("");

  // 🔥 FILTERS
  const [subjects, setSubjects] = useState<SubjectFilter[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [classes, setClasses] = useState<ClassFilter[]>([]);

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const jukumu = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    setJukumuLaMtumiaji(jukumu || "");
    setSchoolId(schoolId || "");
    chukuaWanafunziWangu(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 FETCH MY STUDENTS
  // ============================================================
  const chukuaWanafunziWangu = async (authToken: string) => {
    try {
      setInapakia(true);
      setKosa("");

      const url = `${API_BASE}/api/v1/primary/students/my-students`;

      console.log("📤 Inapakia wanafunzi kutoka:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Kosa la response:", errorText);
        throw new Error(errorText || "Imeshindwa kupata wanafunzi");
      }

      const data = await response.json();
      console.log("✅ Data ya wanafunzi imepokewa:", data.length);

      setWanafunziWote(data);

      if (data.length === 0) {
        setWanafunziWaliopangwa([]);
        setInapakia(false);
        return;
      }

      // 🔥 PATA MASOMO NA MADARASA YA KIPEKEE
      const subjectMap = new Map<number, string>();
      const classMap = new Map<number, string>();

      data.forEach((student: Student) => {
        if (student.subject_id && student.subject_name) {
          subjectMap.set(student.subject_id, student.subject_name);
        }
        if (student.class_id && student.class_name) {
          classMap.set(student.class_id, student.class_name);
        }
      });

      const subjectArray: SubjectFilter[] = Array.from(subjectMap.entries()).map(([id, name]) => ({
        id,
        name,
      }));

      const classArray: ClassFilter[] = Array.from(classMap.entries()).map(([id, name]) => ({
        id,
        name,
      }));

      setSubjects(subjectArray);
      setClasses(classArray);

      console.log("✅ Masomo yaliyopatikana:", subjectArray.length);
      console.log("✅ Madarasa yaliyopatikana:", classArray.length);

      // 🔥 PANGA KWA VIKUNDI
      const groupedMap = new Map<string, GroupedStudents>();

      for (const student of data) {
        const jinaDarasa = student.class_name || "Darasa Lisilojulikana";
        const jinaSomo = student.subject_name || "Somo Lisilojulikana";
        const key = `${jinaDarasa}|${jinaSomo}`;

        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            class_name: jinaDarasa,
            subject_name: jinaSomo,
            subject_id: student.subject_id || 0,
            students: [],
          });
        }
        groupedMap.get(key)!.students.push(student);
      }

      const groupedArray = Array.from(groupedMap.values());
      console.log("📚 Imepangwa katika vikundi:", groupedArray.length, "vikundi");

      setWanafunziWaliopangwa(groupedArray);
    } catch (err: any) {
      console.error("Kosa:", err);
      setKosa(err.message || "Imeshindwa kupakia wanafunzi");
    } finally {
      setInapakia(false);
    }
  };

  // ============================================================
  // 🔥 FILTER FUNCTIONS
  // ============================================================
  const getFilteredGroups = (): GroupedStudents[] => {
    let filtered = wanafunziWaliopangwa;

    // 🔥 CHUJA KWA SOMO
    if (selectedSubject !== "all") {
      const subjectId = parseInt(selectedSubject);
      filtered = filtered.filter((group) => group.subject_id === subjectId);
    }

    // 🔥 CHUJA KWA DARASA
    if (selectedClass !== "all") {
      const classId = parseInt(selectedClass);
      const selectedClassObj = classes.find((c) => c.id === classId);
      if (selectedClassObj) {
        filtered = filtered.filter((group) => group.class_name === selectedClassObj.name);
      }
    }

    return filtered;
  };

  const filteredGroups = getFilteredGroups();

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const tazamaRipoti = (studentId: number) => {
    router.push(`/primary/reports/student/${studentId}`);
  };

  const tazamaMaelezo = (studentId: number) => {
    router.push(`/primary/students/${studentId}`);
  };

  const handleRetry = () => {
    if (token) {
      chukuaWanafunziWangu(token);
    }
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalStudents = wanafunziWote.length;
  const totalSubjects = subjects.length;
  const totalClasses = classes.length;
  const totalFilteredStudents = filteredGroups.reduce((acc, g) => acc + g.students.length, 0);

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (inapakia) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia wanafunzi wako...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // 🎨 RENDER - PRO MAX!
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Wanafunzi Wangu"
          subtitle={
            jukumuLaMtumiaji === "Mwalimu" || jukumuLaMtumiaji === "Teacher"
              ? "Wanafunzi wamepangwa kwa madarasa na masomo unayofundisha"
              : "Wanafunzi wamepangwa kwa madarasa na masomo"
          }
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalStudents} Wanafunzi
            </span>
          }
          action={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              Mwalimu
            </span>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jumla ya Wanafunzi
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

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
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

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Madarasa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalClasses}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <School className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wamechujwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalFilteredStudents}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {kosa && (
          <MobileAlert
            type="error"
            message={kosa}
            onClose={() => setKosa("")}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs sm:text-sm h-7 sm:h-8 touch-feedback mt-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Jaribu Tena
            </Button>
          </MobileAlert>
        )}

        {/* Filters Card */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-sky-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-sky-800 text-sm sm:text-base">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Chuja Wanafunzi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Subject Filter */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                  Chuja kwa Somo
                </Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Masomo Yote" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="all">📚 Masomo Yote</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  {subjects.length} masomo yanapatikana
                </p>
              </div>

              {/* Class Filter */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                  Chuja kwa Darasa
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Madarasa Yote" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="all">🏫 Madarasa Yote</SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  {classes.length} madarasa yanapatikana
                </p>
              </div>

              {/* Search */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-purple-600" />
                  Tafuta kwa Jina au Namba
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tafuta mwanafunzi..."
                    className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                    value={tafuta}
                    onChange={(e) => setTafuta(e.target.value)}
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  {totalFilteredStudents} wanafunzi wamechujwa
                </p>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Groups */}
        <div className="space-y-4 sm:space-y-6">
          {filteredGroups.length === 0 ? (
            <MobileCard>
              <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
              <CardContent className="py-12 sm:py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {jukumuLaMtumiaji === "Mwalimu" || jukumuLaMtumiaji === "Teacher"
                      ? "Hujapewa masomo bado au hakuna wanafunzi wanaolingana na vigezo ulivyochagua."
                      : "Hakuna wanafunzi katika madarasa uliyopangiwa."}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Jaribu kubadilisha vigezo vya uchujaji au wasiliana na Mtaaluma.
                  </p>
                </div>
              </CardContent>
            </MobileCard>
          ) : (
            filteredGroups.map((group, idx) => {
              const wanafunziWaliopepetwa = group.students.filter(
                (student) =>
                  student.name.toLowerCase().includes(tafuta.toLowerCase()) ||
                  (student.roll_number &&
                    student.roll_number.toLowerCase().includes(tafuta.toLowerCase()))
              );

              if (wanafunziWaliopepetwa.length === 0 && tafuta) return null;

              return (
                <MobileCard key={idx} delay={idx * 100 + 200}>
                  <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
                  <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-sky-50 to-blue-50">
                    <CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                          </div>
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            {group.class_name}
                          </span>
                          <span className="text-gray-300 hidden xs:inline">•</span>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                            <span className="text-sm sm:text-base font-semibold text-sky-700">
                              {group.subject_name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/60 rounded-full backdrop-blur-sm">
                          <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500" />
                          <span className="text-xs sm:text-sm font-medium text-gray-600">
                            {wanafunziWaliopepetwa.length}{" "}
                            {wanafunziWaliopepetwa.length === 1 ? "Mwanafunzi" : "Wanafunzi"}
                          </span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MobileTableWrapper>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/80">
                            <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                            <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina la Mwanafunzi</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden xs:table-cell">Jinsia</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Namba</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden md:table-cell">Darasa</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Mkondo</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Baba</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Simu</TableHead>
                            <TableHead className="text-center text-xs sm:text-sm w-16 sm:w-24">Vitendo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {wanafunziWaliopepetwa.map((student, sIdx) => (
                            <TableRow
                              key={student.id}
                              className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group animate-fadeIn"
                              style={{ animationDelay: `${sIdx * 50}ms` }}
                            >
                              <TableCell className="text-center text-xs sm:text-sm text-gray-500 font-mono">
                                {sIdx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0 cursor-pointer"
                                    onClick={() => tazamaMaelezo(student.id)}
                                  >
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span
                                    className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px] cursor-pointer hover:text-sky-600 transition-colors"
                                    onClick={() => tazamaMaelezo(student.id)}
                                  >
                                    {student.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden xs:table-cell">
                                <span
                                  className={cn(
                                    "inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                                    pataRangiYaJinsia(student.sex)
                                  )}
                                >
                                  {pataJinsia(student.sex)}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                                {student.roll_number || "—"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {student.class_name || "—"}
                                </span>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <span className="inline-flex items-center gap-1">
                                  <Layers className="h-3 w-3 text-purple-400" />
                                  <span className="text-xs sm:text-sm text-gray-600">
                                    {student.stream_name || "—"}
                                  </span>
                                </span>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[80px]">
                                  {student.father_name || "—"}
                                </span>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <span className="font-mono text-[10px] sm:text-xs text-gray-500">
                                  {student.father_phone || "—"}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-1 sm:gap-1.5">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => tazamaMaelezo(student.id)}
                                    className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                    title="Maelezo"
                                  >
                                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => tazamaRipoti(student.id)}
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                    title="Ripoti"
                                  >
                                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </MobileTableWrapper>
                  </CardContent>
                </MobileCard>
              );
            })
          )}
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">👨‍🎓 Wanafunzi Wangu</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Orodha ya wanafunzi wote katika masomo unayofundisha
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">👁️ Tazama Ripoti</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Bonyeza ikoni ya jicho kuona ripoti kamili ya mwanafunzi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🔍 Vichujio</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Chuja wanafunzi kwa somo au darasa kwa urahisi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Wanafunzi Wangu</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🎓 {totalStudents} wanafunzi</span>
            <span>•</span>
            <span>📚 {totalSubjects} masomo</span>
            <span>•</span>
            <span>🏫 {totalClasses} madarasa</span>
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
          .xs\\:inline {
            display: inline !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:table-cell {
            display: none !important;
          }
          .xs\\:hidden {
            display: table-cell !important;
          }
          .xs\\:inline {
            display: none !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}