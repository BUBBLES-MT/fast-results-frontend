// app/subjects/page.tsx

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
  Edit,
  Loader2,
  Save,
  BookOpen,
  GraduationCap,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  School,
  Building,
  BadgeCheck,
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
  Download,
  Printer,
  BarChart3,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  Eye,
  CheckCircle,
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
interface School {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  code: string | null;
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
      <div className="px-4 sm:px-0 min-w-[600px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function SubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null);

  // Add Subject state
  const [openAdd, setOpenAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    school_id: 1,
  });
  const [adding, setAdding] = useState(false);

  // Edit Subject state
  const [openEdit, setOpenEdit] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [updating, setUpdating] = useState(false);

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

    fetchSubjects(storedToken, schoolId);
    fetchSchools(storedToken);
  }, [router]);

  const fetchSubjects = async (authToken: string, schoolId?: string | null) => {
    try {
      let url = `${API_BASE}/api/v1/subjects`;
      if (schoolId) {
        url += `?school_id=${schoolId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/schools`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, school_id: data[0].id }));
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...formData,
        school_id: userSchoolId || formData.school_id,
      };

      const response = await fetch(`${API_BASE}/api/v1/subjects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create subject");
      }

      setOpenAdd(false);
      setSuccess("✅ Subject created successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setFormData({
        name: "",
        code: "",
        school_id: userSchoolId || 1,
      });
      fetchSubjects(token, userSchoolId?.toString());
    } catch (err: any) {
      console.error("Error creating subject:", err);
      setError(err.message || "Failed to create subject");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/subjects/${editingSubject.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          code: editCode,
          school_id: editingSubject.school_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update subject");
      }

      setOpenEdit(false);
      setEditingSubject(null);
      setSuccess("✅ Subject updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchSubjects(token, userSchoolId?.toString());
    } catch (err: any) {
      console.error("Error updating subject:", err);
      setError(err.message || "Failed to update subject");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("⚠️ Are you sure you want to delete this subject?")) return;
    try {
      const response = await fetch(`${API_BASE}/api/v1/subjects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete subject");

      setSuccess("✅ Subject deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchSubjects(token, userSchoolId?.toString());
    } catch (err) {
      console.error("Error deleting subject:", err);
      setError("Failed to delete subject");
    }
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditCode(subject.code || "");
    setOpenEdit(true);
  };

  const handleRetry = () => {
    if (token) {
      fetchSubjects(token, userSchoolId?.toString());
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSchoolName = (schoolId: number) => {
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Unknown";
  };

  // 🔥 STATS - HAZIONYESHI SHULE!
  const totalSubjects = subjects.length;
  const subjectsWithCode = subjects.filter((s) => s.code).length;
  const noCode = totalSubjects - subjectsWithCode;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading subjects...
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
          title="Subjects Management"
          subtitle="Manage all subjects offered in your school"
          icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalSubjects} Subjects
            </span>
          }
          action={
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 touch-feedback">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Add Subject</span>
                  <span className="xs:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    Add New Subject
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Fill in the details to add a new subject to your school.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSubject}>
                  <div className="space-y-3 sm:space-y-4 py-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Subject Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="e.g., Mathematics, English, Biology"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Subject Code
                      </Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm font-mono"
                        placeholder="e.g., MATH, ENG, BIO"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value.toUpperCase() })
                        }
                      />
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        Optional short code for the subject
                      </p>
                    </div>

                    {userRole?.toLowerCase() === "superadmin" && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          School <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.school_id.toString()}
                          onValueChange={(value) =>
                            setFormData({ ...formData, school_id: parseInt(value) })
                          }
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
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
                  {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}

                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenAdd(false)}
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
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {adding ? "Saving..." : "Save Subject"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {/* 1. Total Subjects */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Subjects
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

          {/* 2. With Code */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  With Code
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {subjectsWithCode}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* 3. No Code */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  No Code
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {noCode}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* 4. School ID - BADALA YA SCHOOLS! */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  {userRole?.toLowerCase() === "superadmin" ? "All Schools" : "School ID"}
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {userRole?.toLowerCase() === "superadmin" ? schools.length : userSchoolId || "N/A"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                {userRole?.toLowerCase() === "superadmin" ? (
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                ) : (
                  <School className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <MobileAlert
            type="error"
            message={error}
            onClose={() => setError("")}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs sm:text-sm h-7 sm:h-8 touch-feedback mt-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </MobileAlert>
        )}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}

        {/* Search */}
        <MobileCard hover={false} delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by subject name..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </MobileCard>

        {/* Subjects Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Subjects List
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredSubjects.length} {filteredSubjects.length === 1 ? "subject" : "subjects"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="min-w-[140px] text-xs sm:text-sm">Subject Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Code</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">School</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm w-20 sm:w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                          <p className="text-gray-500 text-sm sm:text-base">
                            {searchTerm ? "No subjects found matching your search" : "No subjects found"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {searchTerm ? "Try adjusting your search" : 'Click "Add Subject" to create one.'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubjects.map((subject, index) => (
                      <TableRow
                        key={subject.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                              {subject.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                              {subject.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {subject.code ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                              {subject.code}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs sm:text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-600 truncate max-w-[100px]">
                            <GraduationCap className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            {getSchoolName(subject.school_id)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(subject)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              title="Edit Subject"
                            >
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubject(subject.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              title="Delete Subject"
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
                <p className="font-medium text-blue-800 text-xs sm:text-sm">📚 Subject Management</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Add, edit, and manage all subjects offered in your school
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🏷️ Subject Codes</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Assign unique codes to subjects for easy identification
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
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">🎓 Curriculum Setup</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Subjects are the foundation of academic programs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Subjects Management</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📚 {totalSubjects} subjects</span>
            <span>•</span>
            <span>🏷️ {subjectsWithCode} with codes</span>
            <span>•</span>
            <span>📌 {noCode} without code</span>
          </p>
        </div>
      </div>

      {/* Edit Subject Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Subject
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update the subject name and code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Subject Name <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Subject Code
              </Label>
              <Input
                className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm font-mono"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                placeholder="e.g., MATH, ENG, BIO"
              />
            </div>
          </div>

          {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}
          {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenEdit(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubject}
              disabled={updating}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-feedback"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {updating ? "Updating..." : "Update Subject"}
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