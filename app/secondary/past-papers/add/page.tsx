// app/secondary/past-papers/add/page.tsx

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ArrowLeft,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  BookOpen,
  GraduationCap,
  FileText,
  Upload,
  Calendar,
  School,
  Layers,
  Plus,
  X,
  Menu,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  Crown,
  Star,
  TrendingUp,
  Clock,
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
  code?: string;
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
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 md:p-8 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
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
          {badge && <div className="flex-shrink-0">{badge}</div>}
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
}: {
  type: "success" | "error" | "warning" | "info";
  message: string;
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
      <p className="text-sm sm:text-base break-words">{message}</p>
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
        "transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-white/70 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[7px] sm:text-[8px] text-white/60 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </div>
      </div>
      {/* 🔥 Animation line at bottom */}
      <div className="mt-2 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft" />
      </div>
    </div>
  );
}

// ============================================================
// 🎯 ADD PAST PAPER FORM
// ============================================================
function AddPastPaperForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  
  // Data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    class_id: "",
    stream_id: "",
    year: new Date().getFullYear().toString(),
    exam_type: "",
    description: "",
    file: null as File | null,
  });
  
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, [router]);

  const fetchData = async (authToken: string) => {
    try {
      const schoolId = localStorage.getItem("school_id");

      // Fetch subjects
      const subjectsRes = await fetch(`${API_BASE}/api/v1/subjects?school_id=${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(data);
      }

      // Fetch classes
      const classesRes = await fetch(`${API_BASE}/api/v1/classes?school_id=${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(data);
      }

      // Fetch streams
      const streamsRes = await fetch(`${API_BASE}/api/v1/streams?school_id=${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (streamsRes.ok) {
        const data = await streamsRes.json();
        setStreams(data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    }
  };

  const handleClassChange = (value: string) => {
    setFormData({ ...formData, class_id: value, stream_id: "" });
    const filtered = streams.filter((s) => s.class_id === parseInt(value));
    setFilteredStreams(filtered);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate
    if (!formData.title || !formData.subject_id || !formData.class_id || !formData.year || !formData.exam_type) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!formData.file) {
      setError("Please select a file to upload");
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("subject_id", formData.subject_id);
      uploadData.append("class_id", formData.class_id);
      if (formData.stream_id) uploadData.append("stream_id", formData.stream_id);
      uploadData.append("year", formData.year);
      uploadData.append("exam_type", formData.exam_type);
      if (formData.description) uploadData.append("description", formData.description);
      uploadData.append("file", formData.file);

      const schoolId = localStorage.getItem("school_id");
      const response = await fetch(`${API_BASE}/api/v1/past-papers?school_id=${schoolId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload past paper");
      }

      setSuccess("Past paper uploaded successfully! 🎉");
      setTimeout(() => {
        router.push("/secondary/past-papers");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to upload past paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Title */}
      <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          Paper Title *
        </Label>
        <Input
          placeholder="e.g., Mathematics Midterm Exam 2024"
          className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* Subject & Class */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600" />
            Subject *
          </Label>
          <Select
            value={formData.subject_id}
            onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name} {s.code && `(${s.code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "300ms" }}>
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            Class *
          </Label>
          <Select
            value={formData.class_id}
            onValueChange={handleClassChange}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stream & Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "400ms" }}>
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-600" />
            Stream (Optional)
          </Label>
          <Select
            value={formData.stream_id}
            onValueChange={(value) => setFormData({ ...formData, stream_id: value })}
            disabled={!formData.class_id || filteredStreams.length === 0}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm">
              <SelectValue placeholder={!formData.class_id ? "Select class first" : "All streams"} />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
              <SelectItem value="all">✅ All Streams</SelectItem>
              {filteredStreams.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  Stream {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "500ms" }}>
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Year *
          </Label>
          <Select
            value={formData.year}
            onValueChange={(value) => setFormData({ ...formData, year: value })}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Exam Type */}
      <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "600ms" }}>
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-rose-600" />
          Exam Type *
        </Label>
        <Select
          value={formData.exam_type}
          onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
        >
          <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl h-10 sm:h-11 text-sm">
            <SelectValue placeholder="Select exam type" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
            <SelectItem value="MIDTERM3">Midterm 3</SelectItem>
            <SelectItem value="MIDTERM9">Midterm 9</SelectItem>
            <SelectItem value="TERMINAL">Terminal</SelectItem>
            <SelectItem value="ANNUAL">Annual</SelectItem>
            <SelectItem value="JOINT MOCK">Joint Mock</SelectItem>
            <SelectItem value="MOCK">Mock</SelectItem>
            <SelectItem value="FINAL">Final</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "700ms" }}>
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          Description (Optional)
        </Label>
        <Textarea
          placeholder="Add any additional notes about this past paper..."
          className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl min-h-[80px] sm:min-h-[100px] text-sm"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* File Upload */}
      <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "800ms" }}>
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Upload className="h-4 w-4 text-emerald-600" />
          Upload File *
        </Label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Input
              type="file"
              className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              required
            />
          </div>
          {fileName && (
            <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              {fileName}
            </span>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-gray-400">
          Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
        </p>
      </div>

      {/* Messages */}
      {error && <MobileAlert type="error" message={error} />}
      {success && <MobileAlert type="success" message={success} />}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-slideIn" style={{ animationDelay: "900ms" }}>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          )}
          {loading ? "Uploading..." : "Upload Past Paper"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/secondary/past-papers")}
          className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-11 sm:h-12 touch-feedback"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ============================================================
// 🎯 MAIN PAGE
// ============================================================
export default function SecondaryAddPastPaperPage() {
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Add Past Paper"
          subtitle="Upload past exam papers for students"
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Upload
            </span>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Subjects
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold mt-0.5">Available</p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
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
                  Classes
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold mt-0.5">All</p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
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
                  Streams
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold mt-0.5">Optional</p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-white/40 rounded-full animate-pulse-soft animation-delay-2000" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Exam Types
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold mt-0.5">7 Types</p>
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

        {/* Form Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Upload Past Paper
              <span className="text-sm font-normal text-gray-400 ml-2">
                Fill in the details below
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <AddPastPaperForm />
          </CardContent>
        </MobileCard>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">💡 Quick Tip</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Upload past papers in <strong>PDF</strong> format for best results.
                  Students will be able to download and view them.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">⭐ Pro Tip</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Add a clear <strong>description</strong> to help students understand
                  what the past paper covers and what to expect.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "500ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Past Papers</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📄 Upload past exam papers</span>
            <span>•</span>
            <span>🎯 Help students prepare</span>
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