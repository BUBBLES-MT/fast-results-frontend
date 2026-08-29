// app/secondary/past-papers/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2,
  Plus,
  Search,
  Download,
  Trash2,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
  Eye,
  TrendingUp,
  Upload,
  School,
  Filter,
  X,
  ChevronLeft,
  Menu,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  Crown,
  Star,
  Clock,
  Layers,
  ArrowLeft,
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
interface PastPaper {
  id: number;
  title: string;
  subject: string;
  exam_type: string;
  year: number;
  class_level: string;
  school_level: string;
  file_url: string;
  file_name: string;
  file_size: number;
  description: string;
  school_name: string;
  downloads: number;
  created_at: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  level?: string;
}

const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "NATIONAL", "JOINT MOCK"];
const CLASS_LEVELS = {
  primary: ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"],
  secondary: ["Form 1", "Form 2", "Form 3", "Form 4"],
  advanced: ["Form 5", "Form 6"],
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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 p-4 sm:p-6 md:p-8 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-2xl shadow-lg backdrop-blur-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-amber-100/80 mt-0.5 truncate">
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
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]",
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
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
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
  color = "amber",
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
        "transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.amber}`
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
      {/* 🔥 Animation line at bottom */}
      <div className="mt-2 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft" />
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
export default function SecondaryPastPapersPage() {
  const router = useRouter();
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userSchoolLevel, setUserSchoolLevel] = useState("secondary");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterExamType, setFilterExamType] = useState("all");
  const [filterSchoolLevel, setFilterSchoolLevel] = useState("secondary");

  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    exam_type: "",
    year: new Date().getFullYear(),
    class_level: "",
    school_level: "secondary",
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolLevel = localStorage.getItem("school_level") || "secondary";

    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    setUserRole(role || "");
    setUserSchoolLevel(schoolLevel);
    setFilterSchoolLevel(schoolLevel);
    setFormData((prev) => ({ ...prev, school_level: schoolLevel }));

    fetchPastPapers(storedToken);
    fetchMySubjects(storedToken);
  }, [router]);

  const fetchPastPapers = async (authToken: string) => {
    try {
      const params = new URLSearchParams();
      if (filterSubject) params.append("subject", filterSubject);
      if (filterYear) params.append("year", filterYear);
      if (filterExamType && filterExamType !== "all") params.append("exam_type", filterExamType);

      if (filterSchoolLevel === "all") {
        params.append("school_level", userSchoolLevel);
      } else if (filterSchoolLevel) {
        params.append("school_level", filterSchoolLevel);
      }

      const url = `${API_BASE}/api/v1/past-papers${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch past papers");
      const data = await response.json();

      setPapers(data.papers || data || []);
    } catch (err) {
      setError("Failed to load past papers");
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubjects = async (authToken: string) => {
    setLoadingSubjects(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/past-papers/my-subjects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
        if (data.subjects && data.subjects.length > 0) {
          setFormData((prev) => ({ ...prev, subject: data.subjects[0].name }));
        }
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPastPapers(token);
    }
  }, [filterSubject, filterYear, filterExamType, filterSchoolLevel]);

  const getSchoolLevelOptions = () => {
    const userLevel = userSchoolLevel || "secondary";
    const levelLabels: Record<string, string> = {
      primary: "🏫 Primary",
      secondary: "📚 Secondary",
      advanced: "🎓 Advanced",
    };
    return [
      { value: "all", label: `🏫 All ${userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Schools` },
      { value: userLevel, label: levelLabels[userLevel] || userLevel },
    ];
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      setError("Please select a file");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (formData.file.size > maxSize) {
      setError(
        `File too large! Maximum size is 10MB. Your file is ${(formData.file.size / (1024 * 1024)).toFixed(2)}MB`
      );
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(formData.file.type)) {
      setError("File type not allowed! Please upload PDF, DOC, DOCX, or TXT files only.");
      return;
    }

    setUploading(true);
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("subject", formData.subject);
    formDataObj.append("exam_type", formData.exam_type);
    formDataObj.append("year", formData.year.toString());
    formDataObj.append("class_level", formData.class_level);
    formDataObj.append("school_level", formData.school_level || userSchoolLevel);
    if (formData.description) formDataObj.append("description", formData.description);
    formDataObj.append("file", formData.file);

    try {
      const response = await fetch(`${API_BASE}/api/v1/past-papers/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload");
      }

      setOpenUpload(false);
      setSuccess("Past paper uploaded successfully! ✅");
      setTimeout(() => setSuccess(""), 3000);
      setFormData({
        title: "",
        subject: subjects.length > 0 ? subjects[0].name : "",
        exam_type: "",
        year: new Date().getFullYear(),
        class_level: "",
        school_level: userSchoolLevel,
        description: "",
        file: null,
      });
      fetchPastPapers(token);
    } catch (err: any) {
      setError(err.message || "Failed to upload past paper");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (paper: PastPaper) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/v1/past-papers/${paper.id}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = paper.file_name || `past_paper_${paper.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`✅ Downloaded: ${paper.title}`);
      setTimeout(() => setSuccess(""), 3000);
      fetchPastPapers(token);
    } catch (err: any) {
      console.error("Download error:", err);
      setError(err.message || "Failed to download file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this past paper?")) return;
    try {
      await fetch(`${API_BASE}/api/v1/past-papers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Past paper deleted successfully! ✅");
      setTimeout(() => setSuccess(""), 3000);
      fetchPastPapers(token);
    } catch (err) {
      setError("Failed to delete");
    }
  };

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canUpload = [
    "Teacher",
    "Academic",
    "Headmaster",
    "Headmistress",
    "Second Master",
    "Second Mistress",
    "Mwalimu",
    "Mtaaluma",
    "Mwalimu Mkuu",
    "Mwalimu Mkuu Msaidizi",
  ].includes(userRole);
  const canDelete = userRole === "Superadmin";

  // Calculate stats
  const totalPapers = papers.length;
  const totalDownloads = papers.reduce((acc, p) => acc + p.downloads, 0);
  const uniqueSubjects = new Set(papers.map((p) => p.subject)).size;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading past papers...
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
          title="📚 Past Papers Library"
          subtitle={`Browse and download past examination papers from ${userSchoolLevel} schools across Tanzania`}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalPapers} Papers
            </span>
          }
          action={
            canUpload && (
              <Dialog open={openUpload} onOpenChange={setOpenUpload}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-amber-700 hover:bg-amber-50 shadow-lg hover:shadow-xl transition-all gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 touch-feedback">
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Upload Past Paper</span>
                    <span className="xs:hidden">Upload</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      Upload Past Paper
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      Share past examination papers. You can only upload for subjects you teach.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload}>
                    <div className="space-y-3 sm:space-y-4 py-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Title *</Label>
                        <Input
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                          placeholder="e.g., Mathematics Form 4 Midterm 2024"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Subject *</Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) => setFormData({ ...formData, subject: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              {loadingSubjects ? (
                                <SelectItem value="loading" disabled>
                                  Loading subjects...
                                </SelectItem>
                              ) : subjects.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No subjects assigned to you
                                </SelectItem>
                              ) : (
                                subjects.map((subj) => (
                                  <SelectItem key={subj.id} value={subj.name}>
                                    {subj.name} {subj.code && `(${subj.code})`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            📌 You can only upload for subjects you teach
                          </p>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Exam Type *</Label>
                          <Select
                            value={formData.exam_type}
                            onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                          >
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Year *</Label>
                          <Input
                            type="number"
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm"
                            placeholder="e.g., 2024"
                            value={formData.year}
                            onChange={(e) =>
                              setFormData({ ...formData, year: parseInt(e.target.value) })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">School Level *</Label>
                          <Select
                            value={formData.school_level}
                            onValueChange={(value) => {
                              setFormData({ ...formData, school_level: value, class_level: "" });
                            }}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl h-10 sm:h-11 text-sm">
                              <SelectValue placeholder="Select school level" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              {["primary", "secondary", "advanced"].map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level === "primary"
                                    ? "🏫 Primary School"
                                    : level === "secondary"
                                    ? "📚 Secondary School"
                                    : "🎓 Advanced Level"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Class Level *</Label>
                          <Select
                            value={formData.class_level}
                            onValueChange={(value) => setFormData({ ...formData, class_level: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                              <SelectValue placeholder="Select class level" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              {CLASS_LEVELS[
                                formData.school_level as keyof typeof CLASS_LEVELS
                              ]?.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">File *</Label>
                          <Input
                            type="file"
                            className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) =>
                              setFormData({ ...formData, file: e.target.files?.[0] || null })
                            }
                            required
                          />
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            PDF, DOC, DOCX, TXT files only (Max 10MB)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Description (Optional)</Label>
                        <Textarea
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl min-h-[60px] sm:min-h-[80px] text-sm"
                          placeholder="Additional information about this past paper"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpenUpload(false)}
                        className="w-full sm:w-auto touch-feedback"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={uploading || subjects.length === 0}
                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {uploading ? "Uploading..." : "Upload Paper"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Papers
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalPapers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white/40 rounded-full animate-pulse-soft" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Downloads
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalDownloads}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft animation-delay-1000" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Subjects
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {uniqueSubjects}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-white/40 rounded-full animate-pulse-soft animation-delay-2000" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-rose-500 to-red-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Exam Types
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {EXAM_TYPES.length}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-white/40 rounded-full animate-pulse-soft animation-delay-1500" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Filters */}
        <MobileCard gradient="bg-gradient-to-r from-white to-amber-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or subject..."
                  className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter by Subject */}
              <Input
                placeholder="Filter by subject"
                className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              />

              {/* Filter by Year */}
              <Input
                placeholder="Filter by year"
                type="number"
                className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />

              {/* Filter by Exam Type */}
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl h-10 sm:h-11 text-sm">
                  <SelectValue placeholder="Filter by exam type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                  <SelectItem value="all">📋 All Exam Types</SelectItem>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* School Level Filter */}
              <Select value={filterSchoolLevel} onValueChange={setFilterSchoolLevel}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                  <SelectValue placeholder="Filter by school level" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                  {getSchoolLevelOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-3 sm:mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setFilterSubject("");
                  setFilterYear("");
                  setFilterExamType("all");
                  setFilterSchoolLevel(userSchoolLevel);
                  setSearchTerm("");
                  fetchPastPapers(token);
                }}
                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm touch-feedback"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </MobileCard>

        {/* Past Papers Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              {filterSchoolLevel === "all"
                ? `All ${userSchoolLevel.charAt(0).toUpperCase() + userSchoolLevel.slice(1)} Past Papers`
                : `${userSchoolLevel.charAt(0).toUpperCase() + userSchoolLevel.slice(1)} Past Papers`}
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredPapers.length} {filteredPapers.length === 1 ? "paper" : "papers"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPapers.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="flex flex-col items-center gap-3">
                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
                  <p className="text-base sm:text-lg font-medium text-gray-700">No past papers found</p>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm px-4">
                    Try adjusting your filters or upload a new paper!
                  </p>
                  {canUpload && (
                    <Button
                      onClick={() => setOpenUpload(true)}
                      className="mt-2 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                    >
                      <Plus className="h-4 w-4" />
                      Upload First Paper
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="min-w-[160px] text-xs sm:text-sm">Title</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Subject</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Exam Type</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Year</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Class</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm w-20">Downloads</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPapers.map((paper, idx) => (
                      <TableRow
                        key={paper.id}
                        className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">
                              {paper.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-700">
                            {paper.subject}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                          {paper.exam_type}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs sm:text-sm">
                          {paper.year}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-xs sm:text-sm">
                          {paper.class_level}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Download className="h-3 w-3 text-gray-400" />
                            <span className="font-semibold text-xs sm:text-sm">{paper.downloads}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(paper)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              title="Download"
                            >
                              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(paper.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MobileTableWrapper>
            )}
          </CardContent>
        </MobileCard>

        {/* Info Box - EXTREME PRO MAX */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-amber-800 text-xs sm:text-sm">👀 View & Download</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  All teachers and students can view and download past papers from all schools
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">📤 Upload</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Teachers can only upload past papers for subjects they teach
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "500ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🤝 Collaboration</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Papers are shared across all schools for collaborative learning
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "600ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Past Papers Library</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📄 {totalPapers} papers</span>
            <span>•</span>
            <span>📚 {uniqueSubjects} subjects</span>
            <span>•</span>
            <span>📥 {totalDownloads} downloads</span>
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