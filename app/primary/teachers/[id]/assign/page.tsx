// app/primary/teachers/assign/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Save,
  ArrowLeft,
  BookOpen,
  Sparkles,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Users,
  Layers,
  UserPlus,
  XCircle,
  Info,
  ChevronLeft,
  School,
  Shield,
  Trophy,
  Crown,
  Star,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  ChevronRight,
  RefreshCw,
  Globe,
  Filter,
  Building,
  Award,
  Eye,
  Download,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================

interface Subject {
  id: number;
  name: string;
  code: string | null;
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

interface Assignment {
  id: number;
  teacher_id: number;
  teacher_name: string;
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
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

// ============================================================
// 🔥 HELPERS
// ============================================================

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Mwalimu Mkuu":
      return "👨‍💼";
    case "Mwalimu Mkuu Msaidizi":
      return "👩‍💼";
    case "Mtaaluma":
      return "🎓";
    case "Mwalimu":
      return "👨‍🏫";
    default:
      return "👨‍🏫";
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Mwalimu Mkuu":
      return "from-amber-500 to-orange-500";
    case "Mwalimu Mkuu Msaidizi":
      return "from-purple-500 to-pink-500";
    case "Mtaaluma":
      return "from-sky-500 to-blue-500";
    case "Mwalimu":
      return "from-emerald-500 to-teal-500";
    default:
      return "from-sky-500 to-blue-500";
  }
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function PangiaMwalimuPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id as string;

  const [token, setToken] = useState("");
  const [teacher, setTeacher] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState("");

  const [formData, setFormData] = useState({
    subject_id: "",
    class_id: "",
    stream_id: "",
  });

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, [teacherId]);

  const fetchData = async (authToken: string) => {
    try {
      await Promise.all([
        fetchTeacher(authToken),
        fetchSubjects(authToken),
        fetchClasses(authToken),
        fetchStreams(authToken),
        fetchExistingAssignments(authToken),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FETCH FUNCTIONS
  // ============================================================
  const fetchTeacher = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch teacher");
      const data = await response.json();
      setTeacher(data);
    } catch (err) {
      setError("Imeshindwa kupakia mwalimu");
    }
  };

  const fetchSubjects = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/subjects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/classes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchStreams = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/streams`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams(data);
    } catch (err) {
      console.error("Error fetching streams:", err);
    }
  };

  const fetchExistingAssignments = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/teachers/${teacherId}/assignments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch assignments");
      const data = await response.json();
      setExistingAssignments(data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  // ============================================================
  // 🔥 EFFECTS
  // ============================================================
  useEffect(() => {
    if (formData.class_id) {
      const filtered = streams.filter(
        (stream) => stream.class_id === parseInt(formData.class_id)
      );
      setFilteredStreams(filtered);
      setFormData((prev) => ({ ...prev, stream_id: "" }));
      setError("");
      setSuccess("");
      setInfo("");
    } else {
      setFilteredStreams([]);
    }
  }, [formData.class_id, streams]);

  // ============================================================
  // 🔥 CHECK IF ALREADY ASSIGNED
  // ============================================================
  const checkIfAlreadyAssigned = () => {
    if (!formData.subject_id || !formData.class_id || !formData.stream_id) {
      return false;
    }

    const existing = existingAssignments.find(
      (a) =>
        a.subject_id === parseInt(formData.subject_id) &&
        a.class_id === parseInt(formData.class_id) &&
        a.stream_id === parseInt(formData.stream_id)
    );

    if (existing) {
      setError(
        `❌ Somo "${existing.subject_name}" tayari limepangwa kwa ${existing.teacher_name} katika darasa "${existing.class_name}" na mkondo "${existing.stream_name}"`
      );
      return true;
    }
    return false;
  };

  // ============================================================
  // 🔥 HANDLE SUBMIT
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject_id || !formData.class_id || !formData.stream_id) {
      setError("Tafadhali chagua somo, darasa, na mkondo");
      return;
    }

    if (checkIfAlreadyAssigned()) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    setInfo("");

    try {
      const payload = {
        subject_id: parseInt(formData.subject_id),
        class_id: parseInt(formData.class_id),
        stream_id: parseInt(formData.stream_id),
      };

      const response = await fetch(`${API_BASE}/api/v1/primary/teachers/${teacherId}/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.detail && responseData.detail.includes("already assigned")) {
          setError(`❌ ${responseData.detail}`);
        } else {
          throw new Error(responseData.detail || "Failed to assign");
        }
        return;
      }

      const subjectName = subjects.find((s) => s.id === parseInt(formData.subject_id))?.name || "Somo";
      const className = classes.find((c) => c.id === parseInt(formData.class_id))?.name || "Darasa";
      const streamName = streams.find((s) => s.id === parseInt(formData.stream_id))?.name || "Mkondo";

      setSuccess(
        `✅ Mafanikio! ${teacher?.name} amepangiwa kufundisha "${subjectName}" katika darasa "${className}" na mkondo "${streamName}"`
      );

      await fetchExistingAssignments(token);

      setFormData({
        subject_id: "",
        class_id: "",
        stream_id: "",
      });

      setTimeout(() => {
        router.push("/primary/teachers");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kumpangia mwalimu");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalSubjects = subjects.length;
  const totalClasses = classes.length;
  const totalAssignments = existingAssignments.length;
  const totalStreams = streams.length;

  // ============================================================
  // ⏳ LOADING STATE
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
            Inapakia fomu ya upangiaji...
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
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-5xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Pangia Mwalimu"
          subtitle={`Pangia ${teacher?.name} kufundisha somo katika darasa na mkondo maalum`}
          icon={<UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalAssignments} Masomo
            </span>
          }
          action={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <span className="text-base sm:text-lg">{getRoleIcon(teacher?.role)}</span>
              {teacher?.role || "Mwalimu"}
            </span>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Mwalimu
                </p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 truncate max-w-[100px] sm:max-w-[180px]">
                  {teacher?.name || "-"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm text-xl sm:text-2xl">
                {getRoleIcon(teacher?.role)}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Masomo Yaliyopangiwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalAssignments}
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
                  Jumla ya Masomo
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalSubjects}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
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
        </div>

        {/* Messages */}
        {success && (
          <MobileAlert type="success" message={success} onClose={() => setSuccess("")}>
            <p className="text-[10px] sm:text-xs text-emerald-600 mt-1">
              ⏳ Utarudishwa kwenye orodha ya walimu baada ya sekunde 3...
            </p>
          </MobileAlert>
        )}
        {error && (
          <MobileAlert type="error" message={error} onClose={() => setError("")}>
            {error.includes("tayari limepangwa") && (
              <p className="text-[10px] sm:text-xs text-red-600 mt-1">
                💡 Tafadhali chagua somo, darasa au mkondo tofauti au futa upangiaji uliopo kwanza.
              </p>
            )}
          </MobileAlert>
        )}
        {info && <MobileAlert type="info" message={info} onClose={() => setInfo("")} />}

        {/* Existing Assignments Summary */}
        {existingAssignments.length > 0 && (
          <MobileCard delay={100}>
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-purple-800 text-sm sm:text-base">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                Masomo Aliyopangiwa
                <span className="text-sm font-normal text-purple-400 ml-2">
                  ({totalAssignments})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-wrap gap-2">
                {existingAssignments.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs bg-purple-100 text-purple-700 border border-purple-200"
                  >
                    {a.subject_name} - {a.class_name} {a.stream_name ? `(${a.stream_name})` : ""}
                  </span>
                ))}
              </div>
            </CardContent>
          </MobileCard>
        )}

        {/* Assignment Form Card */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Maelezo ya Upangiaji
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Teacher Info */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={cn(
                      "h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md flex-shrink-0",
                      getRoleColor(teacher?.role)
                    )}
                  >
                    {teacher?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Mwalimu Aliyechaguliwa</p>
                    <p className="font-semibold text-gray-800 text-base sm:text-lg">
                      {teacher?.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        🆔 ID: {teacher?.id}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400">•</span>
                      <span className="text-[10px] sm:text-xs text-sky-600 flex items-center gap-1">
                        {getRoleIcon(teacher?.role)} {teacher?.role || "Mwalimu"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                  Somo *
                </Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, subject_id: value });
                    setError("");
                    setSuccess("");
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua somo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {subjects.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Hakuna masomo
                      </SelectItem>
                    ) : (
                      subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name} {subject.code ? `(${subject.code})` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Class */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                  Darasa *
                </Label>
                <Select
                  value={formData.class_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, class_id: value });
                    setError("");
                    setSuccess("");
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua darasa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Hakuna madarasa
                      </SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Stream */}
              {formData.class_id && (
                <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "400ms" }}>
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-purple-600" />
                    Mkondo *
                  </Label>
                  <Select
                    value={formData.stream_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, stream_id: value });
                      setError("");
                      setSuccess("");
                    }}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue placeholder="Chagua mkondo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {filteredStreams.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Hakuna mikondo katika darasa hili
                        </SelectItem>
                      ) : (
                        filteredStreams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            Mkondo {stream.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons - PRO MAX */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 animate-slideIn" style={{ animationDelay: "500ms" }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/primary/teachers")}
                  className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                >
                  Ghairi
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.subject_id || !formData.class_id || !formData.stream_id}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Inapangia...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Pangia Mwalimu
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </MobileCard>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">📋 Pangia Mwalimu</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Chagua somo, darasa na mkondo kumpangia mwalimu
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">📚 Masomo Yote</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  {totalSubjects} masomo yanapatikana kwa upangiaji
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">✅ Angalia Marudio</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Mfumo utakujulisha kama somo tayari limepangwa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Pangia Mwalimu</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🏫 {teacher?.name || "-"}</span>
            <span>•</span>
            <span>📚 {totalAssignments} yamepangwa</span>
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