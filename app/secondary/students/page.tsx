// app/students/page.tsx

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  FileText,
  Edit,
  BookOpen,
  GraduationCap,
  Users,
  Download,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Eye,
  Phone,
  User,
  Mail,
  MapPin,
  School,
  Building,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
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
  Layers,
  ArrowRight,
  Filter,
  Printer,
  BarChart3,
  TrendingUp,
  Award,
  Shield,
  UserCog,
  RefreshCw,
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
  school_id: number;
  class_id: number | null;
  stream_id: number | null;
  father_name: string;
  father_phone: string;
  health_info?: string;
  address?: string;
}

interface Class {
  id: number;
  name: string;
  school_id: number;
}

interface Stream {
  id: number;
  name: string;
  class_id: number;
  school_id: number;
}

interface GroupedStudents {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  students: Student[];
}

const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - PRO MAX!
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
      <span className="text-sm font-medium">Back</span>
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-blue-100/80 mt-0.5 truncate">
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
        "border-0 overflow-hidden rounded-2xl sm:rounded-3xl",
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
  color = "blue",
  subtitle,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "sky" | "rose" | "orange" | "cyan";
  subtitle?: string;
  delay?: number;
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
        "rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[8px] sm:text-[10px] text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
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
// 🎯 MAIN COMPONENT
// ============================================================
export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [groupedStudents, setGroupedStudents] = useState<GroupedStudents[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [viewMode, setViewMode] = useState<"all" | "my">(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("user_type");
      if (role === "Teacher") return "my";
    }
    return "all";
  });

  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState("MIDTERM3");

  const [editOpen, setEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    sex: "M",
    father_name: "",
    father_phone: "",
    health_info: "",
    address: "",
    school_id: 1,
    class_id: "",
    stream_id: "",
    roll_number: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    sex: "M",
    father_name: "",
    father_phone: "",
    health_info: "",
    address: "",
    school_id: 1,
    class_id: "",
    stream_id: "",
    roll_number: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");

    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setUserRole(role || "");
    setUserSchoolId(schoolId ? parseInt(schoolId) : null);
    fetchClasses(storedToken);
    fetchStreams(storedToken);
  }, [router]);

  useEffect(() => {
    if (token) {
      const userType = localStorage.getItem("user_type");
      if (userType === "Teacher") {
        fetchGroupedStudents(token);
      } else if (viewMode === "my") {
        fetchGroupedStudents(token);
      } else {
        fetchStudents(token);
      }
    }
  }, [viewMode, token]);

  const fetchStudents = async (authToken: string) => {
    try {
      setLoading(true);
      let url = `${API_BASE}/api/v1/students`;
      if (userSchoolId) {
        url += `?school_id=${userSchoolId}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
      setError("");
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupedStudents = async (authToken: string) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/v1/teacher-my-students`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch students");
      }

      const studentsData = await response.json();

      if (studentsData.length === 0) {
        setGroupedStudents([]);
        setLoading(false);
        return;
      }

      const groupedMap = new Map();

      for (const student of studentsData) {
        const key = `${student.subject_id}-${student.class_id}-${student.stream_id}`;

        if (!groupedMap.has(key)) {
          let displayClass = student.class_name || "Unknown Class";
          const streamName = student.stream_name || "";

          if (streamName && !displayClass.includes(streamName)) {
            displayClass = `${displayClass} ${streamName}`;
          }

          displayClass = displayClass.replace(/(\w+)\s+\1$/, "$1");

          groupedMap.set(key, {
            subject_id: student.subject_id,
            subject_name: student.subject_name || "Unknown Subject",
            class_id: student.class_id,
            class_name: displayClass,
            stream_id: student.stream_id,
            stream_name: streamName,
            students: [],
          });
        }
        groupedMap.get(key).students.push(student);
      }

      setGroupedStudents(Array.from(groupedMap.values()));
      setError("");
    } catch (err: any) {
      console.error("Fetch grouped students error:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (formData.class_id) {
      const filtered = streams.filter(
        (stream) => stream.class_id === parseInt(formData.class_id)
      );
      setFilteredStreams(filtered);
      setFormData((prev) => ({ ...prev, stream_id: "" }));
    } else {
      setFilteredStreams([]);
    }
  }, [formData.class_id, streams]);

  useEffect(() => {
    if (editFormData.class_id) {
      const filtered = streams.filter(
        (stream) => stream.class_id === parseInt(editFormData.class_id)
      );
      setFilteredStreams(filtered);
      setEditFormData((prev) => ({ ...prev, stream_id: "" }));
    } else {
      setFilteredStreams([]);
    }
  }, [editFormData.class_id, streams]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.class_id) {
      setError("Please select a class");
      return;
    }
    if (!formData.stream_id) {
      setError("Please select a stream");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        sex: formData.sex,
        father_name: formData.father_name,
        father_phone: formData.father_phone,
        health_info: formData.health_info || null,
        address: formData.address || null,
        school_id: userSchoolId || formData.school_id,
        class_id: parseInt(formData.class_id),
        stream_id: parseInt(formData.stream_id),
        roll_number: formData.roll_number || null,
      };

      const response = await fetch(`${API_BASE}/api/v1/students`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to create student");
        setSaving(false);
        return;
      }

      setOpen(false);
      setSuccess("✅ Student created successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setFormData({
        name: "",
        sex: "M",
        father_name: "",
        father_phone: "",
        health_info: "",
        address: "",
        school_id: userSchoolId || 1,
        class_id: "",
        stream_id: "",
        roll_number: "",
      });
      fetchStudents(token);
      setError("");
    } catch (err) {
      console.error("Error creating student:", err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("⚠️ Are you sure you want to delete this student?")) return;
    try {
      await fetch(`${API_BASE}/api/v1/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Student deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      if (viewMode === "my") {
        fetchGroupedStudents(token);
      } else {
        fetchStudents(token);
      }
    } catch (err) {
      setError("Failed to delete student");
    }
  };

  const handleViewReport = (studentId: number) => {
    router.push(`/secondary/reports/student/${studentId}`);
  };

  const handleGeneratePDF = (studentId: number) => {
    setSelectedStudentId(studentId);
    setPdfDialogOpen(true);
  };

  const confirmGeneratePDF = () => {
    if (selectedStudentId) {
      const url = `${API_BASE}/api/v1/reports/student/${selectedStudentId}/parent-report?exam_type=${selectedExamType}`;
      window.open(url, "_blank");
    }
    setPdfDialogOpen(false);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name ?? "",
      sex: student.sex ?? "M",
      father_name: student.father_name ?? "",
      father_phone: student.father_phone ?? "",
      health_info: student.health_info ?? "",
      address: student.address ?? "",
      school_id: student.school_id ?? 1,
      class_id: student.class_id?.toString() ?? "",
      stream_id: student.stream_id?.toString() ?? "",
      roll_number: student.roll_number ?? "",
    });
    setEditOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: editFormData.name,
        sex: editFormData.sex,
        father_name: editFormData.father_name,
        father_phone: editFormData.father_phone,
        health_info: editFormData.health_info || null,
        address: editFormData.address || null,
        school_id: editFormData.school_id,
        class_id: parseInt(editFormData.class_id),
        stream_id: parseInt(editFormData.stream_id),
        roll_number: editFormData.roll_number || null,
      };

      const response = await fetch(`${API_BASE}/api/v1/students/${editingStudent.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update student");

      setEditOpen(false);
      setEditingStudent(null);
      setSuccess("✅ Student updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      if (viewMode === "my") {
        fetchGroupedStudents(token);
      } else {
        fetchStudents(token);
      }
      setError("");
    } catch (err) {
      setError("Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.roll_number && student.roll_number.includes(searchTerm))
  );

  const getClassName = (classId: number | null) => {
    if (!classId) return "-";
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : "-";
  };

  const getStreamName = (streamId: number | null) => {
    if (!streamId) return "-";
    const stream = streams.find((s) => s.id === streamId);
    return stream ? stream.name : "-";
  };

  const canSeeBothButtons = () => {
    const adminRoles = ["Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"];
    return adminRoles.includes(userRole);
  };

  const canSeeOnlyMyStudents = () => {
    return userRole === "Teacher";
  };

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalStudents = students.length;
  const totalClasses = new Set(students.map((s) => s.class_id)).size;
  const totalMale = students.filter((s) => s.sex === "M").length;
  const totalFemale = students.filter((s) => s.sex === "F").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading students...
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
          title="Students Management"
          subtitle={
            userRole === "Teacher"
              ? "Manage your students"
              : "Manage all students in your school"
          }
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalStudents} Students
            </span>
          }
          action={
            userRole !== "Teacher" ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 touch-feedback">
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Add Student</span>
                    <span className="xs:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                {/* 🔥🔥🔥 ADD STUDENT DIALOG - FIXED FOR MOBILE! 🔥🔥🔥 */}
                <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      Add New Student
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      Fill in the details to add a new student. Class and Stream are required.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateStudent}>
                    <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Full Name *</Label>
                        <Input
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                          placeholder="Enter student's full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Sex *</Label>
                          <Select
                            value={formData.sex}
                            onValueChange={(value) => setFormData({ ...formData, sex: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              <SelectItem value="M">Male</SelectItem>
                              <SelectItem value="F">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Roll Number</Label>
                          <Input
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm"
                            placeholder="Optional"
                            value={formData.roll_number}
                            onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Class *</Label>
                          <Select
                            value={formData.class_id}
                            onValueChange={(value) => {
                              setFormData({ ...formData, class_id: value, stream_id: "" });
                            }}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                  {cls.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Stream *</Label>
                          <Select
                            value={formData.stream_id}
                            onValueChange={(value) => setFormData({ ...formData, stream_id: value })}
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
                                    ? "Select class first"
                                    : filteredStreams.length === 0
                                    ? "No streams"
                                    : "Select stream"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              {filteredStreams.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No streams available
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Father Name *</Label>
                          <Input
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                            placeholder="Enter father's full name"
                            value={formData.father_name}
                            onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Father Phone *</Label>
                          <Input
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm"
                            placeholder="e.g., 0712345678"
                            value={formData.father_phone}
                            onChange={(e) => setFormData({ ...formData, father_phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Health Info</Label>
                        <Input
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl h-10 sm:h-11 text-sm"
                          placeholder="e.g., Allergies, Medical conditions"
                          value={formData.health_info ?? ""}
                          onChange={(e) => setFormData({ ...formData, health_info: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Address</Label>
                        <Input
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-teal-500 rounded-xl h-10 sm:h-11 text-sm"
                          placeholder="Home address / Residence"
                          value={formData.address ?? ""}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </div>

                    {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}
                    {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sticky bottom-0 bg-white pb-2 pt-2 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="w-full sm:w-auto touch-feedback"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {saving ? "Saving..." : "Save Student"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : null
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Students
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

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Male
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalMale}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Female
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalFemale}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Classes
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalClasses}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-wrap gap-2">
          {canSeeBothButtons() && (
            <>
              <Button
                variant={viewMode === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("all")}
                className={cn(
                  "rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback",
                  viewMode === "all"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                )}
              >
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                All Students
              </Button>
              <Button
                variant={viewMode === "my" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("my")}
                className={cn(
                  "rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback",
                  viewMode === "my"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                )}
              >
                <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                My Students
              </Button>
            </>
          )}

          {canSeeOnlyMyStudents() && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setViewMode("my")}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
            >
              <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              My Students
            </Button>
          )}
        </div>

        {/* Messages */}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}

        {/* Search Bar */}
        <MobileCard hover={false} delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or roll number..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </MobileCard>

        {/* All Students View */}
        {viewMode === "all" && (
          <MobileCard delay={200}>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                All Students
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                      <TableHead className="min-w-[140px] text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xs:table-cell">Sex</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Class</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Stream</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Roll No</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Father</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm w-20 sm:w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 sm:py-16">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                            <p className="text-gray-500 text-sm sm:text-base">
                              {searchTerm ? "No students found matching your search" : "No students found"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400">
                              {searchTerm ? "Try adjusting your search" : 'Click "Add Student" to create one.'}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student, idx) => (
                        <TableRow
                          key={student.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                          style={{ animationDelay: `${idx * 30}ms` }}
                        >
                          <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                            {idx + 1}
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
                          <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                            {getClassName(student.class_id)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                            {getStreamName(student.stream_id)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell font-mono text-xs sm:text-sm">
                            {student.roll_number || "-"}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-xs sm:text-sm truncate max-w-[80px]">
                            {student.father_name || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(student)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Edit"
                              >
                                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewReport(student.id)}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Report"
                              >
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGeneratePDF(student.id)}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="PDF"
                              >
                                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </MobileTableWrapper>
            </CardContent>
          </MobileCard>
        )}

        {/* My Students View */}
        {viewMode === "my" && (
          <div className="space-y-4 sm:space-y-6">
            {groupedStudents.length === 0 ? (
              <MobileCard>
                <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
                <CardContent className="py-12 sm:py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {userRole === "Teacher"
                        ? "You haven't been assigned any subjects yet. Contact the Academic Master."
                        : "No students found in your assigned classes."}
                    </p>
                  </div>
                </CardContent>
              </MobileCard>
            ) : (
              groupedStudents.map((group, index) => {
                const filteredGroupStudents = group.students.filter(
                  (student) =>
                    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (student.roll_number && student.roll_number.includes(searchTerm))
                );

                if (filteredGroupStudents.length === 0 && searchTerm) return null;

                return (
                  <MobileCard key={`${group.class_id}-${group.stream_id}-${group.subject_id}`} delay={index * 100 + 300}>
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                    <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl">
                      <CardTitle>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-base sm:text-lg font-bold">{group.class_name}</span>
                            <span className="text-white/40 hidden xs:inline">•</span>
                            <span className="text-sm sm:text-base">
                              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                              {group.subject_name}
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-sm bg-white/20 px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full">
                            {filteredGroupStudents.length} Students
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
                              <TableHead className="min-w-[140px] text-xs sm:text-sm">Name</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden xs:table-cell">Sex</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Roll No</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden md:table-cell">Father</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Father Phone</TableHead>
                              <TableHead className="text-right text-xs sm:text-sm w-20 sm:w-28">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredGroupStudents.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                  No students found in this group.
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredGroupStudents.map((student, sIdx) => (
                                <TableRow
                                  key={student.id}
                                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                                  style={{ animationDelay: `${sIdx * 30}ms` }}
                                >
                                  <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                                    {sIdx + 1}
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
                                  <TableCell className="hidden md:table-cell text-xs sm:text-sm truncate max-w-[80px]">
                                    {student.father_name || "-"}
                                  </TableCell>
                                  <TableCell className="hidden lg:table-cell font-mono text-xs sm:text-sm">
                                    {student.father_phone || "-"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditDialog(student)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                        title="Edit"
                                      >
                                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewReport(student.id)}
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                        title="Report"
                                      >
                                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleGeneratePDF(student.id)}
                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                        title="PDF"
                                      >
                                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </MobileTableWrapper>
                    </CardContent>
                  </MobileCard>
                );
              })
            )}
          </div>
        )}

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">👤 Student Management</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Add, edit, and manage all students in your school
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">📊 View Reports</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Generate and download student report cards
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">🎓 Academic Records</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Track student academic performance over time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Students Management</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🎓 {totalStudents} students</span>
            <span>•</span>
            <span>📚 {totalClasses} classes</span>
            <span>•</span>
            <span>👤 {totalMale} M / {totalFemale} F</span>
          </p>
        </div>
      </div>

      {/* 🔥🔥🔥 EDIT STUDENT DIALOG - FIXED FOR MOBILE! 🔥🔥🔥 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Student
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update the student's information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStudent}>
            <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Full Name *</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Sex *</Label>
                  <Select
                    value={editFormData.sex}
                    onValueChange={(value) => setEditFormData({ ...editFormData, sex: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Roll Number</Label>
                  <Input
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm"
                    value={editFormData.roll_number ?? ""}
                    onChange={(e) => setEditFormData({ ...editFormData, roll_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Class *</Label>
                  <Select
                    value={editFormData.class_id}
                    onValueChange={(value) => setEditFormData({ ...editFormData, class_id: value, stream_id: "" })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Stream *</Label>
                  <Select
                    value={editFormData.stream_id}
                    onValueChange={(value) => setEditFormData({ ...editFormData, stream_id: value })}
                    disabled={!editFormData.class_id}
                  >
                    <SelectTrigger
                      className={cn(
                        "bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm",
                        !editFormData.class_id && "opacity-50"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          !editFormData.class_id
                            ? "Select class first"
                            : "Select stream"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {streams
                        .filter((s) => s.class_id === parseInt(editFormData.class_id))
                        .map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            Stream {stream.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Father Name *</Label>
                  <Input
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                    value={editFormData.father_name}
                    onChange={(e) => setEditFormData({ ...editFormData, father_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Father Phone *</Label>
                  <Input
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm"
                    value={editFormData.father_phone}
                    onChange={(e) => setEditFormData({ ...editFormData, father_phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Health Info</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={editFormData.health_info ?? ""}
                  onChange={(e) => setEditFormData({ ...editFormData, health_info: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Address</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-teal-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={editFormData.address ?? ""}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>
            </div>

            {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}
            {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sticky bottom-0 bg-white pb-2 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="w-full sm:w-auto touch-feedback"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-feedback"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {saving ? "Saving..." : "Update Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PDF Exam Type Selection Dialog */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Download className="h-5 w-5 text-purple-600" />
              Select Exam Type
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Choose the exam type for the parent report PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                {EXAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setPdfDialogOpen(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmGeneratePDF}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 touch-feedback"
            >
              Generate PDF
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