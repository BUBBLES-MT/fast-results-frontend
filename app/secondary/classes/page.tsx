// app/classes/page.tsx

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
  Trash2,
  Loader2,
  School,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Layers,
  Edit,
  X,
  ChevronLeft,
  Search,
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  RefreshCw,
  Eye,
  Award,
  Crown,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface School {
  id: number;
  name: string;
  school_type: string;
}

interface Class {
  id: number;
  name: string;
  school_id: number;
  school_name?: string;
}

interface Stream {
  id: number;
  name: string;
  class_id: number;
  school_id: number;
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
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
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
      <div className="px-4 sm:px-0 min-w-[500px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null);
  const [userSchoolLevel, setUserSchoolLevel] = useState<string>("secondary");
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    school_id: 1,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    school_id: 1,
  });

  // ============================================================
  // 🔥 INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");
    const schoolLevel = localStorage.getItem("school_level") || "secondary";

    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setUserRole(role || "");
    setUserSchoolId(schoolId ? parseInt(schoolId) : null);
    setUserSchoolLevel(schoolLevel);

    fetchClasses(storedToken);
    fetchSchools(storedToken);
    fetchStreams(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES
  // ============================================================
  const fetchClasses = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/classes`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data);
      setError("");
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FETCH SCHOOLS
  // ============================================================
  const fetchSchools = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/schools`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  // ============================================================
// 🔥 FETCH STREAMS - HAKIKISHA school_id IKO!
// ============================================================
const fetchStreams = async (authToken: string) => {
  try {
    // 🔥 HAKIKISHA school_id IKO!
    let schoolId = userSchoolId;
    if (!schoolId) {
      const storedSchoolId = localStorage.getItem("school_id");
      if (storedSchoolId) {
        schoolId = parseInt(storedSchoolId);
        setUserSchoolId(schoolId);
        console.log(`✅ Retrieved school_id from localStorage: ${schoolId}`);
      } else {
        console.warn(`⚠️ No school_id found!`);
        setStreams([]);
        return;
      }
    }
    
    // 🔥 ONGEZA school_id KENYE URL! (SASA NI NUMBER, SI NULL!)
    const url = `${API_BASE}/api/v1/streams?school_id=${schoolId}`;
    
    console.log(`📡 Fetching streams from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch streams: ${response.status}`);
    }
    const data = await response.json();
    
    console.log(`📊 Total streams from API: ${data.length}`);
    
    // 🔥 CHUJA KWA CLASS ID (SECONDARY)
    const secondaryClassIds = classes
      .filter((cls: Class) => cls.name.includes("Form"))
      .map((cls: Class) => cls.id);
    
    console.log(`📚 Secondary class IDs:`, secondaryClassIds);
    
    let filtered = data;
    if (secondaryClassIds.length > 0) {
      filtered = filtered.filter((stream: Stream) => 
        secondaryClassIds.includes(stream.class_id)
      );
      console.log(`🏫 After class filter: ${filtered.length}`);
    }
    
    setStreams(filtered);
    console.log(`🏫 Final streams: ${filtered.length}`);
  } catch (err) {
    console.error("Error fetching streams:", err);
    setStreams([]);
  }
};
  // ============================================================
  // 🔥 CREATE CLASS
  // ============================================================
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        school_id: userSchoolId || formData.school_id,
      };

      const response = await fetch(`${API_BASE}/api/v1/classes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create class");
      }

      setOpen(false);
      setFormData({ name: "", school_id: userSchoolId || 1 });
      setSuccess("✅ Class created successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchClasses(token);
    } catch (err: any) {
      console.error("Error creating class:", err);
      setError(err.message || "Failed to create class");
    } finally {
      setAdding(false);
    }
  };

  // ============================================================
  // 🔥 UPDATE CLASS
  // ============================================================
  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    setAdding(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: editFormData.name,
        school_id: userSchoolId || editFormData.school_id,
      };

      const response = await fetch(`${API_BASE}/api/v1/classes/${editingClass.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update class");
      }

      setEditOpen(false);
      setEditingClass(null);
      setSuccess("✅ Class updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchClasses(token);
    } catch (err: any) {
      console.error("Error updating class:", err);
      setError(err.message || "Failed to update class");
    } finally {
      setAdding(false);
    }
  };

  // ============================================================
  // 🔥 DELETE CLASS
  // ============================================================
  const handleDeleteClass = async (id: number) => {
    if (
      !confirm(
        "⚠️ Are you sure you want to delete this class? This will also delete all students and marks in this class!"
      )
    )
      return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/classes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      setSuccess("✅ Class deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchClasses(token);
    } catch (err) {
      console.error("Error deleting class:", err);
      setError("Failed to delete class");
    }
  };

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const openEditDialog = (cls: Class) => {
    setEditingClass(cls);
    setEditFormData({
      name: cls.name,
      school_id: cls.school_id,
    });
    setEditOpen(true);
  };

  const getSchoolName = (schoolId: number) => {
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Unknown";
  };

  const handleRetry = () => {
    if (token) {
      fetchClasses(token);
      fetchStreams(token);
    }
  };

  // ============================================================
  // 🔍 FILTER
  // ============================================================
  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalClasses = classes.length;
  const totalStreams = streams.length; // 🔥 SASA INAONYESHA 4 (si 8!)
  const filteredCount = filteredClasses.length;
  const avgPerSchool = schools.length > 0 ? (totalClasses / schools.length).toFixed(1) : "0";

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading classes...
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
          title="Classes Management"
          subtitle="Manage all classes in your school"
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalClasses} Classes
            </span>
          }
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 touch-feedback">
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
                    Fill in the details to add a new class to your school.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateClass}>
                  <div className="space-y-3 sm:space-y-4 py-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Class Name *
                      </Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="e.g., Form 1, Form 2, Std 1, etc."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    {userRole?.toLowerCase() === "superadmin" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          School *
                        </Label>
                        <Select
                          value={formData.school_id.toString()}
                          onValueChange={(value) =>
                            setFormData({ ...formData, school_id: parseInt(value) })
                          }
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                            <SelectValue placeholder="Select school" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                            {schools.map((school) => (
                              <SelectItem key={school.id} value={school.id.toString()}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {userRole?.toLowerCase() !== "superadmin" && userSchoolId && (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <School className="h-3.5 w-3.5 text-gray-400" />
                          School ID: {userSchoolId}
                        </p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <MobileAlert type="error" message={error} onClose={() => setError("")} />
                  )}
                  {success && (
                    <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />
                  )}

                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
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
                      disabled={adding}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                    >
                      {adding ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {adding ? "Creating..." : "Create Class"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && (
          <MobileAlert
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {/* Card 1 - Total Classes */}
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
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white/40 rounded-full animate-pulse-soft" />
            </div>
          </div>

          {/* Card 2 - Streams (Filtered by school_id + school_level!) */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Streams
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStreams}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft animation-delay-1000" />
            </div>
          </div>

          {/* Card 3 - Avg Per School */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Avg Per School
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {avgPerSchool}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-white/40 rounded-full animate-pulse-soft animation-delay-2000" />
            </div>
          </div>

          {/* Card 4 - Filtered */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Filtered
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {filteredCount}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-white/40 rounded-full animate-pulse-soft animation-delay-1500" />
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
                placeholder="Search classes by name..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {userSchoolId && (
              <p className="text-[10px] sm:text-xs text-blue-600 mt-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Showing data for School ID: {userSchoolId} • {userSchoolLevel} • Streams: {totalStreams}
              </p>
            )}
          </CardContent>
        </MobileCard>

        {/* Classes Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Classes List
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredCount} {filteredCount === 1 ? "class" : "classes"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="min-w-[140px] text-xs sm:text-sm">Class Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">School</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm w-20 sm:w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-2">
                          <School className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                          <p className="text-gray-500 text-sm sm:text-base">No classes found</p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {searchTerm ? "Try adjusting your search" : 'Click "Add Class" to create one.'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((cls, idx) => (
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
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                              {cls.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <School className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px]">
                              {getSchoolName(cls.school_id)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1 sm:gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(cls)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-0.5 sm:gap-1 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs touch-feedback"
                              title="Edit Class"
                            >
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="hidden xs:inline">Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClass(cls.id)}
                              className="gap-0.5 sm:gap-1 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs touch-feedback"
                              title="Delete Class"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="hidden xs:inline">Delete</span>
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

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">📚 Classes</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Classes are the main organizational units for students
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
                  Streams divide classes into smaller groups (e.g., A, B, C)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">⚠️ Warning</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Deleting a class removes all associated students and marks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Classes Management</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalClasses} classes</span>
            <span>•</span>
            <span>🔀 {totalStreams} streams</span>
            <span>•</span>
            <span>📊 {avgPerSchool} avg per school</span>
            <span>•</span>
            <span>🏫 {userSchoolLevel}</span>
          </p>
        </div>
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Class
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update the class details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClass}>
            <div className="space-y-3 sm:space-y-4 py-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Class Name *
                </Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  placeholder="e.g., Form 1, Form 2, Std 1, etc."
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                />
              </div>

              {userRole?.toLowerCase() === "superadmin" && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    School *
                  </Label>
                  <Select
                    value={editFormData.school_id.toString()}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, school_id: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id.toString()}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {userRole?.toLowerCase() !== "superadmin" && userSchoolId && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <School className="h-3.5 w-3.5 text-gray-400" />
                    School ID: {userSchoolId}
                  </p>
                </div>
              )}
            </div>

            {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
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
                disabled={adding}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-feedback"
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {adding ? "Updating..." : "Update Class"}
              </Button>
            </DialogFooter>
          </form>
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

        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
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