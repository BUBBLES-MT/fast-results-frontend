// app/teachers/assign-subjects/page.tsx

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
} from "@/components/ui/dialog";
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
  Edit,
  Save,
  Plus,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCog,
  Sparkles,
  Briefcase,
  School,
  Layers,
  ArrowLeft,
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
  Building,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Download,
  Printer,
  BarChart3,
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
  username: string;
  email: string;
  role: string;
  active: boolean;
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

interface TeacherAssignment {
  id: number;
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
        "border-0 overflow-hidden rounded-2xl sm:rounded-3xl", // 🔥 UKUBWA WA ROUNDING!
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
        "rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white shadow-xl", // 🔥 UKUBWA!
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-0.5 truncate"> {/* 🔥 UKUBWA WA TEXT! */}
            {value}
          </p>
          {subtitle && (
            <p className="text-[8px] sm:text-[10px] text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" /> {/* 🔥 UKUBWA WA IKONI! */}
        </div>
      </div>
    </div>
  );
}

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[900px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function AssignSubjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");

  // Data states
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<Map<number, TeacherAssignment[]>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");

  // Edit dialog states
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingAssignments, setEditingAssignments] = useState<TeacherAssignment[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [availableStreams, setAvailableStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    subject_id: "",
    class_id: "",
    stream_id: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    let role = localStorage.getItem("user_type");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);

    const roleMap: Record<string, string> = {
      academic: "Academic",
      headmaster: "Headmaster",
      headmistress: "Headmistress",
      "second master": "Second Master",
      "second mistress": "Second Mistress",
      teacher: "Teacher",
    };
    const formattedRole = roleMap[role?.toLowerCase() || ""] || role || "";
    setUserRole(formattedRole);

    const allowedRoles = ["Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"];
    const hasPermission = allowedRoles.includes(formattedRole);

    if (!hasPermission) {
      router.push("/dashboard");
      return;
    }

    fetchData(storedToken);
  }, [router]);

  const fetchData = async (authToken: string) => {
    try {
      setLoading(true);

      // Fetch teachers
      const teachersRes = await fetch(`${API_BASE}/api/v1/teachers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const teachersData = await teachersRes.json();
      setTeachers(teachersData);

      // Fetch subjects
      const subjectsRes = await fetch(`${API_BASE}/api/v1/subjects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const subjectsData = await subjectsRes.json();
      setSubjects(subjectsData);
      setAvailableSubjects(subjectsData);

      // Fetch classes
      const classesRes = await fetch(`${API_BASE}/api/v1/classes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const classesData = await classesRes.json();
      setClasses(classesData);
      setAvailableClasses(classesData);

      // Fetch streams
      const streamsRes = await fetch(`${API_BASE}/api/v1/streams`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const streamsData = await streamsRes.json();
      setStreams(streamsData);
      setAvailableStreams(streamsData);

      // Fetch assignments for each teacher
      const assignmentsMap = new Map<number, TeacherAssignment[]>();
      for (const teacher of teachersData) {
        const assignmentsRes = await fetch(`${API_BASE}/api/v1/teachers/${teacher.id}/assignments`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (assignmentsRes.ok) {
          const assignments = await assignmentsRes.json();
          assignmentsMap.set(teacher.id, assignments);
        } else {
          assignmentsMap.set(teacher.id, []);
        }
      }
      setTeacherAssignments(assignmentsMap);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    const assignments = teacherAssignments.get(teacher.id) || [];
    setEditingAssignments([...assignments]);
    setNewAssignment({
      subject_id: "",
      class_id: "",
      stream_id: "",
    });
    setOpenEditDialog(true);
  };

  const handleAddAssignment = () => {
    if (!newAssignment.subject_id || !newAssignment.class_id) {
      setError("Please select subject and class");
      return;
    }

    const subject = availableSubjects.find((s) => s.id.toString() === newAssignment.subject_id);
    const classObj = availableClasses.find((c) => c.id.toString() === newAssignment.class_id);
    const stream = newAssignment.stream_id
      ? availableStreams.find((s) => s.id.toString() === newAssignment.stream_id)
      : null;

    const newAssignmentObj: TeacherAssignment = {
      id: Date.now(),
      subject_id: parseInt(newAssignment.subject_id),
      subject_name: subject?.name || "Unknown",
      class_id: parseInt(newAssignment.class_id),
      class_name: classObj?.name || "Unknown",
      stream_id: newAssignment.stream_id ? parseInt(newAssignment.stream_id) : 0,
      stream_name: stream?.name || "",
    };

    setEditingAssignments([...editingAssignments, newAssignmentObj]);
    setNewAssignment({
      subject_id: "",
      class_id: "",
      stream_id: "",
    });
    setError("");
  };

  const handleRemoveAssignment = (index: number) => {
    const newAssignments = [...editingAssignments];
    newAssignments.splice(index, 1);
    setEditingAssignments(newAssignments);
  };

  const handleSaveAssignments = async () => {
    if (!selectedTeacher) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const existingAssignments = teacherAssignments.get(selectedTeacher.id) || [];
      for (const assignment of existingAssignments) {
        if (assignment.id && assignment.id > 0) {
          await fetch(`${API_BASE}/api/v1/teachers/${selectedTeacher.id}/assignments/${assignment.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      for (const assignment of editingAssignments) {
        const payload = {
          subject_id: assignment.subject_id,
          class_id: assignment.class_id,
          stream_id: assignment.stream_id || 0,
        };

        await fetch(`${API_BASE}/api/v1/teachers/${selectedTeacher.id}/assign`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      await fetchData(token);
      setSuccess("Assignments saved successfully! ✅");
      setTimeout(() => setSuccess(""), 3000);
      setOpenEditDialog(false);
    } catch (err: any) {
      console.error("Error saving assignments:", err);
      setError(err.message || "Failed to save assignments");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setOpenEditDialog(false);
    setSelectedTeacher(null);
    setEditingAssignments([]);
    setError("");
    router.back();
  };

  useEffect(() => {
    if (newAssignment.class_id) {
      const filtered = availableStreams.filter(
        (stream) => stream.class_id === parseInt(newAssignment.class_id)
      );
      setFilteredStreams(filtered);
      setNewAssignment((prev) => ({ ...prev, stream_id: "" }));
    } else {
      setFilteredStreams([]);
    }
  }, [newAssignment.class_id, availableStreams]);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAssignmentsSummary = (teacherId: number) => {
    const assignments = teacherAssignments.get(teacherId) || [];
    if (assignments.length === 0) {
      return { subjects: [], classes: [] };
    }

    const subjects = [...new Set(assignments.map((a) => a.subject_name))];
    const classes = [
      ...new Set(assignments.map((a) => `${a.class_name}${a.stream_name ? ` ${a.stream_name}` : ""}`)),
    ];

    return { subjects, classes };
  };

  // Calculate stats
  const totalTeachers = teachers.length;
  const totalWithAssignments = teachers.filter((t) => (teacherAssignments.get(t.id) || []).length > 0).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading teachers data...
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
          title="Teacher Subject Assignment"
          subtitle="Assign and manage subjects for teachers"
          icon={<UserCog className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTeachers} Teachers
            </span>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Teachers
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalTeachers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  With Assignments
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalWithAssignments}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Subjects
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {subjects.length}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Classes
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {classes.length}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Search Bar */}
        <MobileCard hover={false} delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by teacher name, username, or email..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </MobileCard>

        {/* Teachers Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Teachers List
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredTeachers.length} {filteredTeachers.length === 1 ? "teacher" : "teachers"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[140px]">Teacher Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Username</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Subjects</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden 2xl:table-cell">Classes</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm w-16 sm:w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                          <p className="text-gray-500 text-sm sm:text-base">
                            {searchTerm ? "No teachers found matching your search" : "No teachers found"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {searchTerm ? "Try adjusting your search" : "Teachers will appear here"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher, idx) => {
                      const { subjects: teacherSubjects, classes: teacherClasses } = getAssignmentsSummary(
                        teacher.id
                      );
                      const hasAssignments = teacherSubjects.length > 0;

                      return (
                        <TableRow
                          key={teacher.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                                {teacher.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                                {teacher.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                            {teacher.username}
                          </TableCell>
                          <TableCell className="text-[10px] sm:text-sm hidden md:table-cell truncate max-w-[100px]">
                            {teacher.email}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                                teacher.role === "Academic"
                                  ? "bg-purple-100 text-purple-800"
                                  : teacher.role === "Headmaster" || teacher.role === "Headmistress"
                                  ? "bg-red-100 text-red-800"
                                  : teacher.role === "Second Master" || teacher.role === "Second Mistress"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                              )}
                            >
                              {teacher.role}
                            </span>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {hasAssignments ? (
                              <div className="flex flex-wrap gap-0.5 sm:gap-1">
                                {teacherSubjects.slice(0, 2).map((s, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-xs font-medium bg-emerald-100 text-emerald-700"
                                  >
                                    <BookOpen className="h-2 w-2 mr-0.5" />
                                    {s}
                                  </span>
                                ))}
                                {teacherSubjects.length > 2 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-xs font-medium bg-gray-100 text-gray-600">
                                    +{teacherSubjects.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-red-500">
                                <XCircle className="h-2.5 w-2.5" />
                                No subjects
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="hidden 2xl:table-cell">
                            {hasAssignments ? (
                              <div className="flex flex-wrap gap-0.5 sm:gap-1">
                                {teacherClasses.slice(0, 2).map((c, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-xs font-medium bg-blue-100 text-blue-700"
                                  >
                                    <School className="h-2 w-2 mr-0.5" />
                                    {c}
                                  </span>
                                ))}
                                {teacherClasses.length > 2 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-xs font-medium bg-gray-100 text-gray-600">
                                    +{teacherClasses.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[10px] sm:text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTeacher(teacher)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-0.5 sm:gap-1 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              title="Assign Subjects"
                            >
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </MobileTableWrapper>
          </CardContent>
        </MobileCard>

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">📋 Assignment Management</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Assign teachers to subjects, classes, and streams
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">📚 Subject Access</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Teachers only see students in their assigned subjects
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✅ Easy Management</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Add or remove assignments with a single click
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Teacher Assignment</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>👨‍🏫 {totalTeachers} teachers</span>
            <span>•</span>
            <span>📚 {subjects.length} subjects</span>
            <span>•</span>
            <span>📋 {totalWithAssignments} assigned</span>
          </p>
        </div>
      </div>

      {/* Edit Assignments Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Assign Subjects to {selectedTeacher?.name}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Add or remove subjects that this teacher will teach. Teachers will only see students in their assigned
              classes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-4">
            {editingAssignments.length > 0 && (
              <div>
                <Label className="font-semibold mb-2 block flex items-center gap-2 text-sm sm:text-base text-gray-700">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Current Assignments ({editingAssignments.length})
                </Label>
                <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto border rounded-xl p-2 bg-gray-50 scrollable">
                  {editingAssignments.map((assignment, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 sm:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-100 text-emerald-700">
                          <BookOpen className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                          {assignment.subject_name}
                        </span>
                        <span className="text-gray-300 text-[10px] sm:text-xs">→</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-700">
                          <School className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                          {assignment.class_name}
                        </span>
                        {assignment.stream_name && (
                          <>
                            <span className="text-gray-300 text-[10px] sm:text-xs">/</span>
                            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-700">
                              <Layers className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                              {assignment.stream_name}
                            </span>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                        onClick={() => handleRemoveAssignment(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 sm:pt-4">
              <Label className="font-semibold mb-2 block flex items-center gap-2 text-sm sm:text-base text-gray-700">
                <Plus className="h-4 w-4 text-emerald-600" />
                Add New Assignment
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3">
                <div>
                  <Select
                    value={newAssignment.subject_id}
                    onValueChange={(v) => setNewAssignment({ ...newAssignment, subject_id: v })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-9 sm:h-10 text-sm">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {availableSubjects.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={newAssignment.class_id}
                    onValueChange={(v) => setNewAssignment({ ...newAssignment, class_id: v })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-9 sm:h-10 text-sm">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {availableClasses.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={newAssignment.stream_id}
                    onValueChange={(v) => setNewAssignment({ ...newAssignment, stream_id: v })}
                    disabled={!newAssignment.class_id}
                  >
                    <SelectTrigger
                      className={cn(
                        "bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-9 sm:h-10 text-sm",
                        !newAssignment.class_id && "opacity-50"
                      )}
                    >
                      <SelectValue placeholder="Stream (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      <SelectItem value="all">All Streams</SelectItem>
                      {filteredStreams.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          Stream {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={handleAddAssignment}
                    className="w-full gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Add
                  </Button>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5">
                Tip: Leave stream empty to assign to all streams in the selected class
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm animate-slideIn">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl touch-feedback"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAssignments}
              disabled={saving}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl touch-feedback"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Assignments"}
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