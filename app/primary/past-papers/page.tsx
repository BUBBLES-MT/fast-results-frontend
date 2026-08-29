// app/primary/past-papers/page.tsx

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
  Layers,
  Award,
  Clock,
  Menu,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Star,
  ChevronRight,
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

// 🔥 PRIMARY SCHOOL EXAM TYPES
const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "NATIONAL"];

// 🔥 PRIMARY CLASS LEVELS (Std 1 - 7)
const CLASS_LEVELS = ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"];

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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 via-teal-700 to-emerald-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-green-100/80 mt-0.5 truncate">
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
  type: "success" | "error" | "info" | "warning";
  message: string;
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
  color = "green",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "green" | "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    green: "from-green-500 to-teal-500",
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
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-3 sm:p-4 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.green}`
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
export default function PrimaryPastPapersPage() {
  const router = useRouter();
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userSchoolLevel, setUserSchoolLevel] = useState("primary");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterExamType, setFilterExamType] = useState("all");
  const [filterSchoolLevel, setFilterSchoolLevel] = useState("primary");

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
    school_level: "primary",
    description: "",
    file: null as File | null,
  });

  // ============================================================
  // 🔥 FETCH DATA
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolLevel = localStorage.getItem("school_level") || "primary";

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
        params.append("school_level", "primary");
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
      setError("Imeshindwa kupakia mitihani iliyopita");
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

  // Refetch when filters change
  useEffect(() => {
    if (token) {
      fetchPastPapers(token);
    }
  }, [filterSubject, filterYear, filterExamType, filterSchoolLevel]);

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const getSchoolLevelOptions = () => {
    return [
      { value: "all", label: "🏫 Shule Zote za Msingi" },
      { value: "primary", label: "🏫 Primary" },
    ];
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      setError("Tafadhali chagua faili");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (formData.file.size > maxSize) {
      setError(
        `Faili kubwa sana! Ukubwa wa juu ni 10MB. Faili yako ni ${(formData.file.size / (1024 * 1024)).toFixed(2)}MB`
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
      setError("Aina ya faili hairuhusiwi! Tafadhali pakia PDF, DOC, DOCX, au TXT pekee.");
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
        throw new Error(errorData.detail || "Imeshindwa kupakia");
      }

      setOpenUpload(false);
      setSuccess("Mtihani uliopita umepakiwa kikamilifu! ✅");
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
      setError(err.message || "Imeshindwa kupakia mtihani uliopita");
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

      setSuccess(`Imepakuliwa: ${paper.title}`);
      setTimeout(() => setSuccess(""), 3000);
      fetchPastPapers(token);
    } catch (err: any) {
      console.error("Download error:", err);
      setError(err.message || "Imeshindwa kupakua faili. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kufuta mtihani huu uliopita?")) return;
    try {
      await fetch(`${API_BASE}/api/v1/past-papers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Mtihani uliopita umefutwa kikamilifu! ✅");
      setTimeout(() => setSuccess(""), 3000);
      fetchPastPapers(token);
    } catch (err) {
      setError("Imeshindwa kufuta");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================================
  // 🔥 PERMISSIONS
  // ============================================================
  const canUpload = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"].includes(
    userRole
  );
  const canDelete = userRole === "Superadmin";

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalPapers = papers.length;
  const uniqueSubjects = new Set(papers.map((p) => p.subject)).size;
  const totalDownloads = papers.reduce((acc, p) => acc + p.downloads, 0);
  const uniqueYears = new Set(papers.map((p) => p.year)).size;

  // ============================================================
  // 🔍 FILTERED PAPERS
  // ============================================================
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-teal-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-green-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia mitihani iliyopita...
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
          title="Mitihani Iliyopita"
          subtitle="Tazama, pakua, na shiriki mitihani iliyopita kutoka shule za msingi"
          icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalPapers} Mitihani
            </span>
          }
          action={
            canUpload && (
              <Dialog open={openUpload} onOpenChange={setOpenUpload}>
                <DialogTrigger asChild>
                  
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      Pakia Mtihani Uliopita
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      Shiriki mitihani iliyopita. Unaweza kupakia tu kwa masomo unayofundisha.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload}>
                    <div className="space-y-3 sm:space-y-4 py-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Jina la Mtihani *
                        </Label>
                        <Input
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                          placeholder="mfano: Hesabu Std 7 Midterm 2024"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Somo *
                        </Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                            <SelectValue placeholder="Chagua somo" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                            {loadingSubjects ? (
                              <SelectItem value="loading" disabled>
                                Inapakia masomo...
                              </SelectItem>
                            ) : subjects.length === 0 ? (
                              <SelectItem value="none" disabled>
                                Hakuna masomo uliyopangiwa
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
                          📌 Unaweza kupakia tu kwa masomo unayofundisha
                        </p>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Aina ya Mtihani *
                        </Label>
                        <Select
                          value={formData.exam_type}
                          onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                            <SelectValue placeholder="Chagua aina" />
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

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Mwaka *
                        </Label>
                        <Input
                          type="number"
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                          placeholder="mfano: 2024"
                          value={formData.year}
                          onChange={(e) =>
                            setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Darasa *
                        </Label>
                        <Select
                          value={formData.class_level}
                          onValueChange={(value) =>
                            setFormData({ ...formData, class_level: value })
                          }
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                            <SelectValue placeholder="Chagua darasa" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                            {CLASS_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Faili *
                        </Label>
                        <Input
                          type="file"
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) =>
                            setFormData({ ...formData, file: e.target.files?.[0] || null })
                          }
                          required
                        />
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          PDF, DOC, DOCX, TXT pekee (Upeo 10MB)
                        </p>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Maelezo
                        </Label>
                        <Textarea
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl text-sm"
                          placeholder="Maelezo ya ziada kuhusu mtihani huu"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                        />
                      </div>
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
                        onClick={() => setOpenUpload(false)}
                        className="w-full sm:w-auto touch-feedback"
                      >
                        Ghairi
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
                        {uploading ? "Inapakia..." : "Pakia Mtihani"}
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
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jumla ya Mitihani
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalPapers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Masomo Tofauti
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {uniqueSubjects}
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
                  Jumla ya Kupakuliwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalDownloads}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Miaka Tofauti
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {uniqueYears}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Filters Card */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Vichujio</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tafuta kwa jina au somo..."
                  className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Input
                placeholder="Chuja kwa somo"
                className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              />
              <Input
                placeholder="Chuja kwa mwaka"
                type="number"
                className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm">
                  <SelectValue placeholder="Chuja kwa aina" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                  <SelectItem value="all">📋 Aina Zote</SelectItem>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSchoolLevel} onValueChange={setFilterSchoolLevel}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm">
                  <SelectValue placeholder="Chuja kwa aina ya shule" />
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
            <div className="flex justify-end mt-4">
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
                Ondoa Vichujio
              </Button>
            </div>
          </CardContent>
        </MobileCard>

        {/* Past Papers Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              {filterSchoolLevel === "all" ? "Mitihani Yote ya Msingi" : "Mitihani ya Msingi"}
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredPapers.length} {filteredPapers.length === 1 ? "mtihani" : "mitihani"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="text-xs sm:text-sm min-w-[140px]">Jina la Mtihani</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Somo</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Aina</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Mwaka</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Darasa</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm">Imepakuliwa</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Shule</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm w-20 sm:w-28">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPapers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                          <p className="text-gray-500 text-sm sm:text-base">
                            Hakuna mitihani iliyopita
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Jaribu kubadilisha vichujio au pakia mtihani mpya!
                          </p>
                          {canUpload && (
                            <Button
                              onClick={() => setOpenUpload(true)}
                              className="mt-2 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl touch-feedback"
                            >
                              <Plus className="h-4 w-4" />
                              Pakia Mtihani wa Kwanza
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPapers.map((paper, idx) => (
                      <TableRow
                        key={paper.id}
                        className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-teal-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
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
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <School className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[80px] sm:max-w-[120px]">
                              {paper.school_name || "Shule isiyojulikana"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(paper)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-0.5 sm:gap-1 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs touch-feedback"
                              title="Pakua"
                            >
                              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="hidden xs:inline">Pakua</span>
                            </Button>
                            {canDelete && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(paper.id)}
                                className="gap-0.5 sm:gap-1 rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs touch-feedback"
                                title="Futa"
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden xs:inline">Futa</span>
                              </Button>
                            )}
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
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-green-800 text-xs sm:text-sm">👀 Tazama & Pakua</p>
                <p className="text-[10px] sm:text-xs text-green-600/80 mt-0.5">
                  Walimu na wanafunzi wote wanaweza kuona na kupakua mitihani
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">📤 Pakia</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Walimu wanaweza kupakia tu mitihani kwa masomo wanayofundisha
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">🤝 Ushirikiano</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Mitihani inashirikiwa kwa shule zote kwa ajili ya kujifunza pamoja
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-green-600">© 2026 MASI FAST RESULTS • Mitihani Iliyopita</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📄 {totalPapers} mitihani</span>
            <span>•</span>
            <span>📚 {uniqueSubjects} masomo</span>
            <span>•</span>
            <span>📥 {totalDownloads} kupakuliwa</span>
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