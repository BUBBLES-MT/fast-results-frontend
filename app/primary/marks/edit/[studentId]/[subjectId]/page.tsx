// app/primary/marks/edit/[studentId]/[subjectId]/page.tsx

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Save,
  ArrowLeft,
  Trash2,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  BookOpen,
  GraduationCap,
  Award,
  Edit,
  X,
  User,
  School,
  Calendar,
  TrendingUp,
  Clock,
  Menu,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  Crown,
  Star,
  Trophy,
  Users,
  Layers,
  FileText,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface Mark {
  id: number;
  exam_type: string;
  score: number;
}

const AINA_ZAMTIHANI = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

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
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
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

function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "sky",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
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
        `bg-gradient-to-r ${gradients[color] || gradients.sky}`
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
// 🔥 EXAM TYPE CARD COMPONENT
// ============================================================
function ExamTypeCard({
  examType,
  value,
  hasExistingMark,
  onChange,
  onDelete,
  index,
}: {
  examType: string;
  value: string;
  hasExistingMark: boolean;
  onChange: (value: string) => void;
  onDelete: () => void;
  index: number;
}) {
  const getExamIcon = (type: string) => {
    switch (type) {
      case "MIDTERM3":
        return "📝";
      case "MIDTERM9":
        return "📖";
      case "TERMINAL":
        return "📚";
      case "ANNUAL":
        return "🎯";
      case "JOINT MOCK":
        return "🏆";
      default:
        return "📋";
    }
  };

  const getExamColor = (type: string) => {
    switch (type) {
      case "MIDTERM3":
        return "from-blue-500 to-cyan-500";
      case "MIDTERM9":
        return "from-cyan-500 to-sky-500";
      case "TERMINAL":
        return "from-emerald-500 to-teal-500";
      case "ANNUAL":
        return "from-purple-500 to-indigo-500";
      case "JOINT MOCK":
        return "from-amber-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200/60 hover:border-sky-300/60 transition-all duration-300 hover:shadow-md animate-slideIn"
      style={{ animationDelay: `${index * 100 + 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div
            className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-md flex-shrink-0",
              `bg-gradient-to-r ${getExamColor(examType)}`
            )}
          >
            {getExamIcon(examType)}
          </div>
          <div className="min-w-0 flex-1">
            <Label className="font-semibold text-gray-800 text-sm sm:text-base">
              {examType}
            </Label>
            {hasExistingMark ? (
              <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Alama ipo
              </p>
            ) : (
              <p className="text-[10px] sm:text-xs text-gray-400">Hakuna alama</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-9 sm:h-10 text-sm sm:text-base w-full sm:w-28"
              placeholder="0-100"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          {hasExistingMark && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-9 sm:h-10 px-2 sm:px-3 touch-feedback flex-shrink-0"
              onClick={onDelete}
              title="Futa alama za mtihani huu"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function HaririAlamaPage({
  params,
}: {
  params: Promise<{ studentId: string; subjectId: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { studentId, subjectId } = unwrappedParams;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [studentName, setStudentName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [marks, setMarks] = useState<Mark[]>([]);
  const [formData, setFormData] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchMarksData(storedToken);
  }, [router, studentId, subjectId]);

  const fetchMarksData = async (authToken: string) => {
    try {
      setLoading(true);
      setError("");

      // Fetch marks for this student and subject
      const marksRes = await fetch(
        `${API_BASE}/api/v1/marks?student_id=${studentId}&subject_id=${subjectId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      let marksData: Mark[] = [];
      if (marksRes.ok) {
        marksData = await marksRes.json();
      }

      // Fetch student name
      const studentRes = await fetch(`${API_BASE}/api/v1/students/${studentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (studentRes.ok) {
        const student = await studentRes.json();
        setStudentName(student.name);
        setClassName(student.class_name || "");
        setSchoolName(student.school_name || "");
      }

      // Fetch subject name
      const subjectRes = await fetch(`${API_BASE}/api/v1/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (subjectRes.ok) {
        const subject = await subjectRes.json();
        setSubjectName(subject.name);
      }

      setMarks(marksData);

      // Initialize form data with existing marks
      const newFormData = new Map<string, string>();
      AINA_ZAMTIHANI.forEach((et) => {
        const existingMark = marksData.find((m) => m.exam_type === et);
        newFormData.set(et, existingMark ? existingMark.score.toString() : "");
      });
      setFormData(newFormData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Imeshindwa kupakia data");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (examType: string, value: string) => {
    const newFormData = new Map(formData);
    newFormData.set(examType, value);
    setFormData(newFormData);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id");
    let savedCount = 0;
    let failedCount = 0;

    for (const examType of AINA_ZAMTIHANI) {
      const score = formData.get(examType);
      if (score && score.trim() !== "") {
        const scoreNum = parseFloat(score);
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
          setError(`Alama lazima iwe kati ya 0 na 100 kwa ${examType}`);
          setSaving(false);
          return;
        }

        const existingMark = marks.find((m) => m.exam_type === examType);

        try {
          if (existingMark) {
            // Update existing mark
            const response = await fetch(`${API_BASE}/api/v1/marks/${existingMark.id}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                score: scoreNum,
                exam_type: examType,
              }),
            });

            if (response.ok) {
              savedCount++;
            } else {
              failedCount++;
            }
          } else {
            // Create new mark
            const payload = {
              student_id: parseInt(studentId),
              subject_id: parseInt(subjectId),
              score: scoreNum,
              exam_type: examType,
              teacher_id: parseInt(teacherId || "0"),
            };

            const response = await fetch(`${API_BASE}/api/v1/marks`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              savedCount++;
            } else {
              failedCount++;
            }
          }
        } catch (err) {
          failedCount++;
        }
      }
    }

    if (savedCount > 0) {
      setSuccess(
        `Alama ${savedCount} zimehifadhiwa kikamilifu. ${failedCount > 0 ? `${failedCount} zimeshindwa.` : ""}`
      );
      fetchMarksData(token);
    } else {
      setError("Hakuna alama zilizohifadhiwa.");
    }

    setSaving(false);
  };

  const handleDeleteExamType = async (examType: string) => {
    const existingMark = marks.find((m) => m.exam_type === examType);
    if (!existingMark) return;

    if (!confirm(`Je, una uhakika unataka kufuta alama za ${examType} za mwanafunzi huyu?`)) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/marks/${existingMark.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchMarksData(token);
        setSuccess(`Alama za ${examType} zimefutwa kikamilifu`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Imeshindwa kufuta alama");
      }
    } catch (err) {
      setError("Imeshindwa kufuta alama");
    }
  };

  // Calculate filled count
  const filledCount = Array.from(formData.values()).filter((v) => v && v.trim() !== "").length;
  const totalTypes = AINA_ZAMTIHANI.length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia alama...
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
          title="Hariri Alama"
          subtitle={`${studentName} - ${subjectName}`}
          icon={<Edit className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Award className="h-3 w-3 sm:h-4 sm:w-4" />
              {filledCount}/{totalTypes} Zimejazwa
            </span>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Mwanafunzi"
            value={studentName || "N/A"}
            icon={User}
            color="sky"
            subtitle="Jina la mwanafunzi"
          />
          <MobileStatCard
            label="Somo"
            value={subjectName || "N/A"}
            icon={BookOpen}
            color="purple"
            subtitle="Somo lililochaguliwa"
          />
          <MobileStatCard
            label="Aina za Mtihani"
            value={totalTypes}
            icon={Layers}
            color="emerald"
            subtitle="Jumla ya aina"
          />
          <MobileStatCard
            label="Zimejazwa"
            value={filledCount}
            icon={CheckCircle}
            color="amber"
            subtitle="Alama zimeingizwa"
          />
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-3 sm:p-4 border border-sky-100 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-sky-600" />
              <span className="text-[10px] sm:text-xs text-gray-500">Mwanafunzi</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base mt-1 truncate">
              {studentName || "—"}
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-100 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <span className="text-[10px] sm:text-xs text-gray-500">Somo</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base mt-1 truncate">
              {subjectName || "—"}
            </p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 sm:p-4 border border-emerald-100 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] sm:text-xs text-gray-500">Shule</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base mt-1 truncate">
              {schoolName || className || "—"}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <MobileCard gradient="bg-gradient-to-r from-white to-sky-50/30" delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              Ingiza Alama kwa Kila Aina ya Mtihani
              <span className="text-sm font-normal text-gray-400 ml-2">
                (0-100)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}
            {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}

            <div className="space-y-3 sm:space-y-4">
              {AINA_ZAMTIHANI.map((examType, idx) => {
                const hasExistingMark = marks.some((m) => m.exam_type === examType);
                return (
                  <ExamTypeCard
                    key={examType}
                    examType={examType}
                    value={formData.get(examType) || ""}
                    hasExistingMark={hasExistingMark}
                    onChange={(value) => handleMarkChange(examType, value)}
                    onDelete={() => handleDeleteExamType(examType)}
                    index={idx}
                  />
                );
              })}
            </div>

            {/* Progress Summary */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 animate-slideIn" style={{ animationDelay: "400ms" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Maendeleo:</span>{" "}
                  <span className="font-bold text-sky-600">{filledCount}</span> kati ya{" "}
                  <span className="font-bold">{totalTypes}</span> aina za mtihani zimejazwa
                </p>
                <div className="w-full sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(filledCount / totalTypes) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Save Button - PRO MAX */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 animate-slideIn" style={{ animationDelay: "500ms" }}>
              <Button
                onClick={handleSaveAll}
                disabled={saving}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                )}
                {saving ? "Inahifadhi..." : "Hifadhi Alama Zote"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-11 sm:h-12 touch-feedback"
              >
                Ghairi
              </Button>
            </div>
          </CardContent>
        </MobileCard>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">💡 Kidokezo</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Ingiza alama kati ya <strong>0 na 100</strong> kwa kila aina ya mtihani.
                  Acha tupu kwa alama ambazo hujawa.
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
                <p className="font-medium text-amber-800 text-xs sm:text-sm">⚠️ Muhimu</p>
                <p className="text-[10px] sm:text-xs text-amber-600/80 mt-0.5">
                  Kufuta alama kutaziondoa kabisa. Hatua hii haiwezi kurudishwa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Hariri Alama</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📝 {studentName || "Mwanafunzi"}</span>
            <span>•</span>
            <span>📚 {subjectName || "Somo"}</span>
            <span>•</span>
            <span>📊 {filledCount}/{totalTypes} imejazwa</span>
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