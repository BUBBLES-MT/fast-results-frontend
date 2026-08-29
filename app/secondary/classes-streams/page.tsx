// app/classes-streams/page.tsx

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  BookOpen,
  Layers,
  Loader2,
  Edit,
  Save,
  X,
  School,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Users,
  ChevronLeft,
  Search,
  Filter,
  Menu,
  Home,
  TrendingUp,
  BarChart3,
  Award,
  Crown,
  Trophy,
  Star,
  Clock,
  RefreshCw,
  Eye,
  Shield,
  UserCog,
  Mail,
  Phone,
  User,
  ChevronRight,
  ArrowRight,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
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
  class_name?: string;
}

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
  hover = true,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <Card
      className={cn(
        "border-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm",
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
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "amber" | "purple" | "red" | "sky" | "indigo" | "pink";
  subtitle?: string;
  delay?: number;
}) {
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    sky: "from-sky-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    purple: "from-purple-500 to-pink-500",
    red: "from-red-500 to-rose-500",
    indigo: "from-indigo-500 to-purple-500",
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
          <p className="text-xs sm:text-sm md:text-base font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
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

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function ClassesStreamsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Classes state
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [classLoading, setClassLoading] = useState(false);

  // Edit Class state
  const [editClassDialogOpen, setEditClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editClassName, setEditClassName] = useState("");

  // Streams state
  const [allStreams, setAllStreams] = useState<Stream[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [streamDialogOpen, setStreamDialogOpen] = useState(false);
  const [newStreamName, setNewStreamName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [streamLoading, setStreamLoading] = useState(false);

  // Edit Stream state
  const [editStreamDialogOpen, setEditStreamDialogOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [editStreamName, setEditStreamName] = useState("");
  const [editStreamClassId, setEditStreamClassId] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const allowedRoles = [
      "Superadmin",
      "Headmaster",
      "Headmistress",
      "Second Master",
      "Second Mistress",
      "Academic",
    ];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/secondary/dashboard");
      return;
    }

    setToken(storedToken);
    setUserRole(role || "");
    
    // 🔥 GET SCHOOL ID FROM LOCAL STORAGE
    const schoolIdNum = schoolId ? parseInt(schoolId) : null;
    setUserSchoolId(schoolIdNum);
    
    fetchClasses(storedToken, schoolIdNum);
    fetchStreams(storedToken, schoolIdNum);
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES - FILTER BY SCHOOL ID!
  // ============================================================
  const fetchClasses = async (authToken: string, schoolId: number | null) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/classes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      
      // 🔥 FILTER CLASSES BY SCHOOL ID
      setAllClasses(data);
      if (schoolId) {
        const filtered = data.filter((cls: Class) => cls.school_id === schoolId);
        setClasses(filtered);
        console.log(`🏫 Filtered classes for school ${schoolId}: ${filtered.length}`);
      } else {
        setClasses(data);
      }
    } catch (err) {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FETCH STREAMS - FILTER BY SCHOOL ID!
  // ============================================================
  const fetchStreams = async (authToken: string, schoolId: number | null) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/streams`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      
      // 🔥 FILTER STREAMS BY SCHOOL ID
      setAllStreams(data);
      
      let filteredStreams = data;
      if (schoolId) {
        filteredStreams = data.filter((stream: Stream) => stream.school_id === schoolId);
        console.log(`🏫 Filtered streams for school ${schoolId}: ${filteredStreams.length}`);
      }
      
      // 🔥 ADD CLASS NAMES TO STREAMS
      const streamsWithClass = filteredStreams.map((stream: Stream) => ({
        ...stream,
        class_name: classes.find((c) => c.id === stream.class_id)?.name || "Unknown",
      }));
      setStreams(streamsWithClass);
    } catch (err) {
      console.error("Error fetching streams:", err);
    }
  };

  // ============================================================
  // 🔥 REFRESH DATA
  // ============================================================
  const refreshData = async () => {
    if (token) {
      await fetchClasses(token, userSchoolId);
      await fetchStreams(token, userSchoolId);
    }
  };

  // ============================================================
  // 🔥 CREATE CLASS
  // ============================================================
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const existing = classes.find(
      (c) => c.name.toLowerCase() === newClassName.toLowerCase()
    );
    if (existing) {
      setError(`Class "${newClassName}" already exists!`);
      return;
    }

    setClassLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/classes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClassName,
          school_id: userSchoolId || 1,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create class");
      }

      setClassDialogOpen(false);
      setNewClassName("");
      setSuccess("✅ Class created successfully!");
      setTimeout(() => setSuccess(""), 3000);
      refreshData();
    } catch (err: any) {
      setError(err.message || "Failed to create class");
    } finally {
      setClassLoading(false);
    }
  };

  // ============================================================
  // 🔥 UPDATE CLASS
  // ============================================================
  const handleUpdateClass = async () => {
    if (!editingClass) return;
    if (!editClassName.trim()) return;

    const existing = classes.find(
      (c) =>
        c.name.toLowerCase() === editClassName.toLowerCase() &&
        c.id !== editingClass.id
    );
    if (existing) {
      setError(`Class "${editClassName}" already exists!`);
      return;
    }

    setClassLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/classes/${editingClass.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editClassName,
          school_id: editingClass.school_id,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update class");
      }

      setEditClassDialogOpen(false);
      setEditingClass(null);
      setEditClassName("");
      setSuccess("✅ Class updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      refreshData();
    } catch (err: any) {
      setError(err.message || "Failed to update class");
    } finally {
      setClassLoading(false);
    }
  };

  // ============================================================
  // 🔥 DELETE CLASS
  // ============================================================
  const handleDeleteClass = async (id: number) => {
    const classStreams = streams.filter((s) => s.class_id === id);
    if (classStreams.length > 0) {
      setError(
        `❌ Cannot delete class with ${classStreams.length} stream(s). Delete streams first.`
      );
      return;
    }

    if (!confirm("⚠️ Are you sure you want to delete this class?")) return;
    try {
      await fetch(`${API_BASE}/api/v1/classes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Class deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      refreshData();
    } catch (err) {
      setError("Failed to delete class");
    }
  };

  // ============================================================
  // 🔥 CREATE STREAM
  // ============================================================
  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreamName.trim() || !selectedClassId) return;

    const existing = streams.find(
      (s) =>
        s.name.toLowerCase() === newStreamName.toLowerCase() &&
        s.class_id === parseInt(selectedClassId)
    );
    if (existing) {
      setError(`Stream "${newStreamName}" already exists in this class!`);
      return;
    }

    setStreamLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/streams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newStreamName,
          class_id: parseInt(selectedClassId),
          school_id: userSchoolId || 1,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create stream");
      }

      setStreamDialogOpen(false);
      setNewStreamName("");
      setSelectedClassId("");
      setSuccess("✅ Stream created successfully!");
      setTimeout(() => setSuccess(""), 3000);
      refreshData();
    } catch (err: any) {
      setError(err.message || "Failed to create stream");
    } finally {
      setStreamLoading(false);
    }
  };

  // ============================================================
  // 🔥 UPDATE STREAM
  // ============================================================
  const handleUpdateStream = async () => {
    if (!editingStream) return;
    if (!editStreamName.trim()) return;

    const existing = streams.find(
      (s) =>
        s.name.toLowerCase() === editStreamName.toLowerCase() &&
        s.class_id === parseInt(editStreamClassId) &&
        s.id !== editingStream.id
    );
    if (existing) {
      setError(`Stream "${editStreamName}" already exists in this class!`);
      return;
    }

    setStreamLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/streams/${editingStream.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editStreamName,
          class_id: parseInt(editStreamClassId),
          school_id: userSchoolId || 1,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update stream");
      }

      setEditStreamDialogOpen(false);
      setEditingStream(null);
      setEditStreamName("");
      setEditStreamClassId("");
      setSuccess("✅ Stream updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      refreshData();
    } catch (err: any) {
      setError(err.message || "Failed to update stream");
    } finally {
      setStreamLoading(false);
    }
  };

  // ============================================================
  // 🔥 DELETE STREAM
  // ============================================================
  const handleDeleteStream = async (id: number) => {
    if (!confirm("⚠️ Are you sure you want to delete this stream?")) return;
    try {
      await fetch(`${API_BASE}/api/v1/streams/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Stream deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      refreshData();
    } catch (err) {
      setError("Failed to delete stream");
    }
  };

  const openEditClassDialog = (cls: Class) => {
    setEditingClass(cls);
    setEditClassName(cls.name);
    setEditClassDialogOpen(true);
  };

  const openEditStreamDialog = (stream: Stream) => {
    setEditingStream(stream);
    setEditStreamName(stream.name);
    setEditStreamClassId(stream.class_id.toString());
    setEditStreamDialogOpen(true);
  };

  const getStreamsForClass = (classId: number) => {
    return streams.filter((s) => s.class_id === classId);
  };

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStreams = streams.filter(
    (stream) =>
      stream.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stream.class_name &&
        stream.class_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ============================================================
  // 📊 STATS - FILTERED BY SCHOOL!
  // ============================================================
  const totalClasses = classes.length;
  const totalStreams = streams.length;
  const avgPerClass = totalClasses > 0 ? (totalStreams / totalClasses).toFixed(1) : "0";
  const classesWithStreams = classes.filter(c => getStreamsForClass(c.id).length > 0).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading classes & streams...
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
          title="Classes & Streams"
          subtitle={`Manage school classes and streams • School ID: ${userSchoolId || "All"}`}
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalClasses} Classes
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              className="text-white hover:bg-white/20 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
          }
        />

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Classes
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalClasses}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Streams
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStreams}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Avg Streams Per Class
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {avgPerClass}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  School ID
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {userSchoolId || "All"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Building className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes or streams by name..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {userSchoolId && (
              <p className="text-[10px] sm:text-xs text-blue-600 mt-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Showing data for School ID: {userSchoolId}
              </p>
            )}
          </CardContent>
        </MobileCard>

        {/* Tabs */}
        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100/50 p-1 rounded-xl">
            <TabsTrigger
              value="classes"
              className="gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              Classes
              <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5 sm:ml-1">
                ({totalClasses})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="streams"
              className="gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
              Streams
              <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5 sm:ml-1">
                ({totalStreams})
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="mt-4 sm:mt-6">
            <MobileCard delay={200}>
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100 gap-3 sm:gap-0">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
                  <School className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  All Classes
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"})
                  </span>
                </CardTitle>
                <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback w-full sm:w-auto"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Add Class</span>
                      <span className="xs:hidden">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        Add New Class
                      </DialogTitle>
                      <DialogDescription className="text-sm sm:text-base">
                        Create a new class (e.g., Form 1, Form 2, Std 1, etc.)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass}>
                      <div className="py-4">
                        <Label className="text-sm font-semibold text-gray-700">
                          Class Name
                        </Label>
                        <Input
                          className="mt-2 bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                          placeholder="e.g., Form 1, Form 2, Std 1"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          required
                        />
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                          🏫 School ID: {userSchoolId || "Auto"}
                        </p>
                      </div>
                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setClassDialogOpen(false)}
                          className="w-full sm:w-auto touch-feedback"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={classLoading}
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                        >
                          {classLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Create Class"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <MobileTableWrapper>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/80">
                        <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                        <TableHead className="min-w-[140px] text-xs sm:text-sm">Class Name</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Streams</TableHead>
                        <TableHead className="text-center text-xs sm:text-sm w-20 sm:w-28">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClasses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-2">
                              <School className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                              <p className="text-gray-500 text-sm sm:text-base">
                                {searchTerm ? "No classes found matching your search" : "No classes found"}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                {searchTerm ? "Try adjusting your search" : 'Click "Add Class" to create one.'}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredClasses.map((cls, idx) => {
                          const classStreams = getStreamsForClass(cls.id);
                          return (
                            <TableRow
                              key={cls.id}
                              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                                {idx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                                    {cls.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-800 text-sm sm:text-base truncate max-w-[100px] sm:max-w-[200px]">
                                    {cls.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {classStreams.map((stream) => (
                                    <span
                                      key={stream.id}
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-700"
                                    >
                                      {stream.name}
                                    </span>
                                  ))}
                                  {classStreams.length === 0 && (
                                    <span className="text-[10px] sm:text-xs text-gray-400">
                                      No streams yet
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditClassDialog(cls)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-8 w-8 sm:h-9 sm:w-9 p-0 touch-feedback"
                                    title="Edit Class"
                                  >
                                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClass(cls.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-8 w-8 sm:h-9 sm:w-9 p-0 touch-feedback"
                                    title="Delete Class"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
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
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams" className="mt-4 sm:mt-6">
            <MobileCard delay={300}>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100 gap-3 sm:gap-0">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  All Streams
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({filteredStreams.length} {filteredStreams.length === 1 ? "stream" : "streams"})
                  </span>
                </CardTitle>
                <Dialog open={streamDialogOpen} onOpenChange={setStreamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback w-full sm:w-auto"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Add Stream</span>
                      <span className="xs:hidden">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        Add New Stream
                      </DialogTitle>
                      <DialogDescription className="text-sm sm:text-base">
                        Create a new stream for a class (e.g., A, B, C)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateStream}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">
                            Class
                          </Label>
                          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
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
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">
                            Stream Name
                          </Label>
                          <Input
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                            placeholder="e.g., A, B, C, D"
                            value={newStreamName}
                            onChange={(e) => setNewStreamName(e.target.value.toUpperCase())}
                            required
                          />
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            Stream names are typically letters (A, B, C) or numbers (1, 2, 3)
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            🏫 School ID: {userSchoolId || "Auto"}
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStreamDialogOpen(false)}
                          className="w-full sm:w-auto touch-feedback"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={streamLoading}
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                        >
                          {streamLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Create Stream"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <MobileTableWrapper>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/80">
                        <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                        <TableHead className="min-w-[140px] text-xs sm:text-sm">Stream Name</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Class</TableHead>
                        <TableHead className="text-center text-xs sm:text-sm w-20 sm:w-28">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStreams.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-2">
                              <Layers className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                              <p className="text-gray-500 text-sm sm:text-base">
                                {searchTerm ? "No streams found matching your search" : "No streams found"}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                {searchTerm ? "Try adjusting your search" : "Create classes first, then add streams."}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStreams.map((stream, idx) => (
                          <TableRow
                            key={stream.id}
                            className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200 group animate-fadeIn"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                                  {stream.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-gray-800 text-sm sm:text-base truncate max-w-[80px] sm:max-w-[150px]">
                                  Stream {stream.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="flex items-center gap-1">
                                <School className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px]">
                                  {stream.class_name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditStreamDialog(stream)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-8 w-8 sm:h-9 sm:w-9 p-0 touch-feedback"
                                  title="Edit Stream"
                                >
                                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStream(stream.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-8 w-8 sm:h-9 sm:w-9 p-0 touch-feedback"
                                  title="Delete Stream"
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
          </TabsContent>
        </Tabs>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">📚 Classes</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Main groups for students (e.g., Form 1, Form 2)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🔀 Streams</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Subdivisions of classes (e.g., A, B, C)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">🏫 Multi-Tenant</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Showing data for School ID: {userSchoolId || "All"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Classes & Streams</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalClasses} classes</span>
            <span>•</span>
            <span>🔀 {totalStreams} streams</span>
            <span>•</span>
            <span>📊 {avgPerClass} avg per class</span>
            <span>•</span>
            <span>🏫 School ID: {userSchoolId || "All"}</span>
          </p>
        </div>
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={editClassDialogOpen} onOpenChange={setEditClassDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Class
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update the class name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm font-semibold text-gray-700">Class Name</Label>
            <Input
              className="mt-2 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
              value={editClassName}
              onChange={(e) => setEditClassName(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setEditClassDialogOpen(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateClass}
              disabled={classLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-feedback"
            >
              {classLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Stream Dialog */}
      <Dialog open={editStreamDialogOpen} onOpenChange={setEditStreamDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-purple-600" />
              Edit Stream
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update the stream name or class.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Class</Label>
              <Select value={editStreamClassId} onValueChange={setEditStreamClassId}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
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
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Stream Name</Label>
              <Input
                className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                value={editStreamName}
                onChange={(e) => setEditStreamName(e.target.value.toUpperCase())}
                required
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setEditStreamDialogOpen(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStream}
              disabled={streamLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 touch-feedback"
            >
              {streamLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
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