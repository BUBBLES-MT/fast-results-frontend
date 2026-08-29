// app/teachers/[id]/assign/page.tsx

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
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  Trophy,
  Crown,
  Star,
  Clock,
  TrendingUp,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  School,
  Building,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
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
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
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
  onClose,
  children,
}: {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
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
        {children && <div className="mt-1 text-xs sm:text-sm">{children}</div>}
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

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function AssignTeacherPage() {
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

  const fetchSubjects = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/subjects`, {
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
      const response = await fetch(`${API_BASE}/api/v1/classes`, {
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
      const response = await fetch(`${API_BASE}/api/v1/streams`, {
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
      const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}/assignments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch assignments");
      const data = await response.json();
      setExistingAssignments(data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  // Filter streams when class changes
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
        `❌ Subject "${existing.subject_name}" is already assigned to ${existing.teacher_name} in class "${existing.class_name}" and stream "${existing.stream_name}"`
      );
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject_id || !formData.class_id || !formData.stream_id) {
      setError("Please select subject, class, and stream");
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

      const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}/assign`, {
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

      const subjectName = subjects.find((s) => s.id === parseInt(formData.subject_id))?.name || "Subject";
      const className = classes.find((c) => c.id === parseInt(formData.class_id))?.name || "Class";
      const streamName = streams.find((s) => s.id === parseInt(formData.stream_id))?.name || "Stream";

      setSuccess(
        `✅ Success! ${teacher?.name} has been assigned to teach "${subjectName}" in class "${className}" and stream "${streamName}"`
      );

      await fetchExistingAssignments(token);

      setFormData({
        subject_id: "",
        class_id: "",
        stream_id: "",
      });

      setTimeout(() => {
        router.push("/teachers");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to assign teacher");
    } finally {
      setSaving(false);
    }
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
            Loading assignment form...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Assign Teacher"
          subtitle={
            teacher
              ? `${getRoleIcon(teacher.role)} Assign ${teacher.name} to teach a subject`
              : "Assign teacher to a subject"
          }
          icon={<UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              {existingAssignments.length} Assignments
            </span>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Subjects Available"
            value={subjects.length}
            icon={BookOpen}
            color="blue"
            subtitle="To choose from"
          />
          <MobileStatCard
            label="Classes"
            value={classes.length}
            icon={GraduationCap}
            color="purple"
            subtitle="Available classes"
          />
          <MobileStatCard
            label="Current Assignments"
            value={existingAssignments.length}
            icon={Users}
            color="emerald"
            subtitle="Already assigned"
          />
          <MobileStatCard
            label="Teacher"
            value={teacher?.name || "N/A"}
            icon={User}
            color="amber"
            subtitle="Being assigned"
          />
        </div>

        {/* Messages */}
        {success && (
          <MobileAlert type="success" message={success}>
            <p className="text-emerald-600/80">You will be redirected to teacher list in 3 seconds...</p>
          </MobileAlert>
        )}

        {error && (
          <MobileAlert type="error" message={error}>
            {error.includes("already assigned") && (
              <p className="text-red-600/80">
                💡 Please choose a different subject, class, stream or remove the existing assignment first.
              </p>
            )}
          </MobileAlert>
        )}

        {info && <MobileAlert type="info" message={info} />}

        {/* Existing Assignments Summary */}
        {existingAssignments.length > 0 && (
          <MobileCard gradient="bg-gradient-to-r from-purple-50 to-pink-50" hover={false} delay={100}>
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-purple-800 text-xs sm:text-sm">
                    {teacher?.name} already has {existingAssignments.length} assignment(s)
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    {existingAssignments.map((a) => (
                      <span
                        key={a.id}
                        className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs bg-purple-100 text-purple-700 border border-purple-200"
                      >
                        {a.subject_name} - {a.class_name} {a.stream_name ? `(${a.stream_name})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </MobileCard>
        )}

        {/* Assignment Form */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Teacher Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100 animate-slideIn" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md flex-shrink-0">
                    {teacher?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500">Selected Teacher</p>
                    <p className="font-semibold text-gray-800 text-base sm:text-lg truncate">{teacher?.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">ID: {teacher?.id}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {getRoleIcon(teacher?.role)} {teacher?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, subject_id: value });
                    setError("");
                    setSuccess("");
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {subjects.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No subjects available
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
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                  Class <span className="text-red-500">*</span>
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
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No classes available
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
                    <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                    Stream <span className="text-red-500">*</span>
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
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {filteredStreams.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No streams available for this class
                        </SelectItem>
                      ) : (
                        filteredStreams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            Stream {stream.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 sm:pt-4 border-t border-gray-100 animate-slideIn" style={{ animationDelay: "500ms" }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/teachers")}
                  className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-10 sm:h-11 touch-feedback"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    saving || !formData.subject_id || !formData.class_id || !formData.stream_id
                  }
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 touch-feedback"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Teacher
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </MobileCard>

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">💡 Assignment Rules</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  A teacher can be assigned to the same subject in multiple classes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">⚠️ Duplicate Check</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  The system will prevent assigning the same subject-class-stream combination twice
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Assign Teacher</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>👨‍🏫 {teacher?.name || "Teacher"}</span>
            <span>•</span>
            <span>📚 {subjects.length} subjects</span>
            <span>•</span>
            <span>📋 {existingAssignments.length} assignments</span>
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