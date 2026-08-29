// app/primary/classes-streams/page.tsx

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
  School,
  Sparkles,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  GraduationCap,
  ChevronLeft,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  Crown,
  Star,
  Clock,
  Users,
  Award,
  BarChart3,
  Filter,
  ChevronRight,
  Building2,
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
      <div className="px-4 sm:px-0 min-w-[600px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function MadarasaNaMikondoPage() {
  const router = useRouter();

  // Auth state
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Classes state
  const [classes, setClasses] = useState<Class[]>([]);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [classLoading, setClassLoading] = useState(false);

  // Edit Class state
  const [editClassDialogOpen, setEditClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editClassName, setEditClassName] = useState("");

  // Streams state
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

    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/primary/dashboard");
      return;
    }

    setToken(storedToken);
    setUserRole(role || "");
    setUserSchoolId(schoolId ? parseInt(schoolId) : 1);
    fetchData(storedToken);
  }, [router]);

  const fetchData = async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchClasses(authToken), fetchStreams(authToken)]);
    } catch (err) {
      setError("Imeshindwa kupakia data");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/classes`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Imeshindwa kupata madarasa");
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      throw err;
    }
  };

  const fetchStreams = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/streams`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Imeshindwa kupata mikondo");
      const data = await response.json();
      setStreams(data);
    } catch (err) {
      console.error("Error fetching streams:", err);
      throw err;
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      setError("Tafadhali jaza jina la darasa");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const existing = classes.find((c) => c.name.toLowerCase() === newClassName.toLowerCase());
    if (existing) {
      setError(`Darasa "${newClassName}" tayari lipo!`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setClassLoading(true);
    setError("");
    try {
      const payload = {
        name: newClassName.trim(),
        school_id: userSchoolId,
      };

      const response = await fetch(`${API_BASE}/api/v1/primary/classes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kuongeza darasa");
      }

      setClassDialogOpen(false);
      setNewClassName("");
      showSuccess("Darasa limeongezwa kikamilifu! ✅");
      await fetchData(token);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuongeza darasa");
      setTimeout(() => setError(""), 3000);
    } finally {
      setClassLoading(false);
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;
    if (!editClassName.trim()) return;

    const existing = classes.find(
      (c) => c.name.toLowerCase() === editClassName.toLowerCase() && c.id !== editingClass.id
    );
    if (existing) {
      setError(`Darasa "${editClassName}" tayari lipo!`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setClassLoading(true);
    setError("");
    try {
      const payload = {
        name: editClassName.trim(),
        school_id: userSchoolId,
      };

      const response = await fetch(`${API_BASE}/api/v1/primary/classes/${editingClass.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kusasisha darasa");
      }

      setEditClassDialogOpen(false);
      setEditingClass(null);
      setEditClassName("");
      showSuccess("Darasa limebadilishwa kikamilifu! ✅");
      await fetchData(token);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kusasisha darasa");
      setTimeout(() => setError(""), 3000);
    } finally {
      setClassLoading(false);
    }
  };

  const handleDeleteClass = async (id: number) => {
    const classStreams = streams.filter((s) => s.class_id === id);
    if (classStreams.length > 0) {
      setError(
        `❌ Hauwezi kufuta darasa lenye mikondo ${classStreams.length}. Futa mikondo kwanza.`
      );
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (!confirm("⚠️ Je, una uhakika unataka kufuta darasa hili?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/classes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kufuta darasa");
      }

      showSuccess("Darasa limefutwa kikamilifu! ✅");
      await fetchData(token);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kufuta darasa");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreamName.trim()) {
      setError("Tafadhali jaza jina la mkondo");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!selectedClassId) {
      setError("Tafadhali chagua darasa");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const existing = streams.find(
      (s) =>
        s.name.toLowerCase() === newStreamName.toLowerCase() &&
        s.class_id === parseInt(selectedClassId)
    );
    if (existing) {
      setError(`Mkondo "${newStreamName}" tayari upo katika darasa hili!`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setStreamLoading(true);
    setError("");
    try {
      const payload = {
        name: newStreamName.trim().toUpperCase(),
        class_id: parseInt(selectedClassId),
        school_id: userSchoolId,
      };

      const response = await fetch(`${API_BASE}/api/v1/primary/streams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kuongeza mkondo");
      }

      setStreamDialogOpen(false);
      setNewStreamName("");
      setSelectedClassId("");
      showSuccess("Mkondo umeongezwa kikamilifu! ✅");
      await fetchData(token);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuongeza mkondo");
      setTimeout(() => setError(""), 3000);
    } finally {
      setStreamLoading(false);
    }
  };

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
      setError(`Mkondo "${editStreamName}" tayari upo katika darasa hili!`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setStreamLoading(true);
    setError("");
    try {
      const payload = {
        name: editStreamName.trim().toUpperCase(),
        class_id: parseInt(editStreamClassId),
        school_id: userSchoolId,
      };

      const response = await fetch(`${API_BASE}/api/v1/primary/streams/${editingStream.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kusasisha mkondo");
      }

      setEditStreamDialogOpen(false);
      setEditingStream(null);
      setEditStreamName("");
      setEditStreamClassId("");
      showSuccess("Mkondo umebadilishwa kikamilifu! ✅");
      await fetchData(token);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kusasisha mkondo");
      setTimeout(() => setError(""), 3000);
    } finally {
      setStreamLoading(false);
    }
  };

  const handleDeleteStream = async (id: number) => {
    if (!confirm("⚠️ Je, una uhakika unataka kufuta mkondo huu?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/streams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kufuta mkondo");
      }

      showSuccess("Mkondo umefutwa kikamilifu! ✅");
      await fetchData(token);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kufuta mkondo");
      setTimeout(() => setError(""), 3000);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
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

  // Calculate stats
  const totalClasses = classes.length;
  const totalStreams = streams.length;
  const avgStreamsPerClass = totalClasses > 0 ? (totalStreams / totalClasses).toFixed(1) : "0";

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia madarasa na mikondo...
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
          title="Usimamizi wa Madarasa na Mikondo"
          subtitle="Simamia madarasa na mikondo (A, B, C, n.k.)"
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
              ID: {userSchoolId}
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchData(token)}
              className="text-white hover:bg-white/20 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              <span className="hidden xs:inline">Fresh</span>
              <span className="xs:hidden">Fresh</span>
            </Button>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jumla ya Madarasa
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

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jumla ya Mikondo
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

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Mikondo kwa Darasa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {avgStreamsPerClass}
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
                  Kiwango
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  Msingi
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Tabs */}
        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100/50 p-1 rounded-xl">
            <TabsTrigger
              value="classes"
              className="gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              Madarasa
              <span className="ml-1 text-[10px] sm:text-xs bg-sky-100 text-sky-700 px-1.5 sm:px-2 py-0.5 rounded-full">
                {totalClasses}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="streams"
              className="gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
              Mikondo
              <span className="ml-1 text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-1.5 sm:px-2 py-0.5 rounded-full">
                {totalStreams}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="mt-4 sm:mt-6">
            <MobileCard delay={100}>
              <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100 gap-3 sm:gap-0">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-gray-800">
                  <School className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                  Madarasa Yote
                </CardTitle>
                <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback w-full sm:w-auto"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Ongeza Darasa</span>
                      <span className="xs:hidden">Ongeza</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        Ongeza Darasa Jipya
                      </DialogTitle>
                      <DialogDescription className="text-sm sm:text-base">
                        Unda darasa jipya (mfano: Darasa la 1, Darasa la 2, n.k.)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass}>
                      <div className="space-y-3 sm:space-y-4 py-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">
                            Jina la Darasa
                          </Label>
                          <Input
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                            placeholder="Mfano: Darasa la 1"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            required
                            autoFocus
                          />
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            🏫 Shule ID: {userSchoolId}
                          </p>
                        </div>
                      </div>

                      {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setClassDialogOpen(false)}
                          className="w-full sm:w-auto touch-feedback"
                        >
                          Ghairi
                        </Button>
                        <Button
                          type="submit"
                          disabled={classLoading}
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                        >
                          {classLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Ongeza Darasa"
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
                        <TableHead className="text-xs sm:text-sm min-w-[140px]">Jina la Darasa</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Mikondo</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm w-20 sm:w-28">Vitendo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-2">
                              <School className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                              <p className="text-gray-500 text-sm sm:text-base">Hakuna madarasa</p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                Bonyeza "Ongeza Darasa" kuanza.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        classes.map((cls, idx) => {
                          const classStreams = getStreamsForClass(cls.id);
                          return (
                            <TableRow
                              key={cls.id}
                              className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group animate-fadeIn"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                                {idx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md flex-shrink-0">
                                    {cls.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-800 text-sm sm:text-base truncate max-w-[100px] sm:max-w-[200px]">
                                    {cls.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {classStreams.length > 0 ? (
                                    classStreams.map((stream) => (
                                      <span
                                        key={stream.id}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
                                      >
                                        {stream.name}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] sm:text-xs text-gray-400 italic">
                                      Hakuna mikondo
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditClassDialog(cls)}
                                    className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                  >
                                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClass(cls.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
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
            <MobileCard delay={200}>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100 gap-3 sm:gap-0">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-gray-800">
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  Mikondo Yote
                </CardTitle>
                <Dialog open={streamDialogOpen} onOpenChange={setStreamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-1 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback w-full sm:w-auto"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Ongeza Mkondo</span>
                      <span className="xs:hidden">Ongeza</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        Ongeza Mkondo Mpya
                      </DialogTitle>
                      <DialogDescription className="text-sm sm:text-base">
                        Unda mkondo mpya kwa darasa (mfano: A, B, C)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateStream}>
                      <div className="space-y-3 sm:space-y-4 py-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Darasa</Label>
                          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
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
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Jina la Mkondo</Label>
                          <Input
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                            placeholder="Mfano: A, B, C, D"
                            value={newStreamName}
                            onChange={(e) => setNewStreamName(e.target.value.toUpperCase())}
                            required
                          />
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            Mikondo kawaida ni herufi (A, B, C) au namba (1, 2, 3)
                          </p>
                        </div>
                      </div>

                      {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStreamDialogOpen(false)}
                          className="w-full sm:w-auto touch-feedback"
                        >
                          Ghairi
                        </Button>
                        <Button
                          type="submit"
                          disabled={streamLoading}
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                        >
                          {streamLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Ongeza Mkondo"
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
                        <TableHead className="text-xs sm:text-sm min-w-[140px]">Jina la Mkondo</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Darasa</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm w-20 sm:w-28">Vitendo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {streams.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-2">
                              <Layers className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                              <p className="text-gray-500 text-sm sm:text-base">Hakuna mikondo</p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                Unda madarasa kwanza, kisha ongeza mikondo.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        streams.map((stream, idx) => (
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
                                  Mkondo {stream.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="flex items-center gap-1">
                                <School className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px]">
                                  {classes.find((c) => c.id === stream.class_id)?.name ||
                                    stream.class_name ||
                                    "Haijulikani"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditStreamDialog(stream)}
                                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                >
                                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStream(stream.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
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

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <School className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">📚 Madarasa</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Madarasa ni nguzo kuu za shirika kwa wanafunzi
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
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🔀 Mikondo</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Mikondo husaidia kupanga wanafunzi katika vikundi
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
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✅ Usimamizi Rahisi</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Unda, hariri na futa madarasa na mikondo kwa urahisi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Madarasa na Mikondo</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalClasses} madarasa</span>
            <span>•</span>
            <span>🔀 {totalStreams} mikondo</span>
            <span>•</span>
            <span>🏫 Shule ID: {userSchoolId}</span>
          </p>
        </div>
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={editClassDialogOpen} onOpenChange={setEditClassDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-sky-600" />
              Hariri Darasa
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">Sasisha jina la darasa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Jina la Darasa</Label>
              <Input
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setEditClassDialogOpen(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Ghairi
            </Button>
            <Button
              onClick={handleUpdateClass}
              disabled={classLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 touch-feedback"
            >
              {classLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hifadhi Mabadiliko"}
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
              Hariri Mkondo
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Sasisha jina la mkondo au darasa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Darasa</Label>
              <Select value={editStreamClassId} onValueChange={setEditStreamClassId}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
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
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Jina la Mkondo</Label>
              <Input
                className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                value={editStreamName}
                onChange={(e) => setEditStreamName(e.target.value.toUpperCase())}
                required
              />
            </div>
          </div>

          {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setEditStreamDialogOpen(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Ghairi
            </Button>
            <Button
              onClick={handleUpdateStream}
              disabled={streamLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 touch-feedback"
            >
              {streamLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hifadhi Mabadiliko"}
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