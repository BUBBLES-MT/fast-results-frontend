// app/ai-exam/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  FileText,
  Download,
  Sparkles,
  BookOpen,
  GraduationCap,
  Menu,
  X,
  LogOut,
  Home,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Zap,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 HELPER FUNCTIONS
// ============================================================
function detailFromBody(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const d = (data as { detail?: unknown }).detail;
  if (typeof d === "string") return d;
  if (d != null && typeof d === "object") {
    try {
      return JSON.stringify(d);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function formatApiError(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  return detailFromBody(data, fallback);
}

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS
// ============================================================

function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {children}
    </div>
  );
}

function MobileHeader({
  title,
  subtitle,
  onMenuToggle,
  isMenuOpen,
  onLogout,
}: {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onLogout: () => void;
}) {
  const router = useRouter();

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left - Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onMenuToggle}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors touch-feedback lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer touch-feedback"
              onClick={() => router.push("/dashboard")}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-blue-500/30 flex-shrink-0">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  MASI FAST RESULTS
                </h1>
                {subtitle && (
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate hidden xs:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="hidden sm:flex gap-1 sm:gap-2 text-gray-600 hover:text-blue-600 text-xs sm:text-sm h-8 sm:h-9"
            >
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-9 gap-1 sm:gap-2"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-200/60 space-y-2 animate-slideDown">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-600 hover:text-blue-600 text-sm h-11"
              onClick={() => {
                router.push("/dashboard");
                onMenuToggle();
              }}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 text-sm h-11"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

function MobileCard({
  children,
  className,
  gradient,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <Card
      className={cn(
        "border-0 shadow-xl overflow-hidden rounded-2xl",
        gradient && `bg-gradient-to-r ${gradient}`,
        className
      )}
    >
      {children}
    </Card>
  );
}

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback"
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="text-sm font-medium">Rudi</span>
    </button>
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
    info: <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div className={cn("p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-md animate-slideIn", styles[type])}>
      {icons[type]}
      <p className="text-sm sm:text-base break-words">{message}</p>
    </div>
  );
}

// ============================================================
// 🔥 MAIN COMPONENT
// ============================================================
export default function AIExamPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examContent, setExamContent] = useState("");
  const [markingScheme, setMarkingScheme] = useState("");
  const [showMarking, setShowMarking] = useState(false);
  const [markingWarning, setMarkingWarning] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    class_level: "",
    num_questions: 10,
    exam_type: "Midterm",
    school_level: "secondary",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  const handleGenerateExam = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setExamContent("");
    setMarkingScheme("");
    setShowMarking(false);
    setMarkingWarning("");

    const billingHint =
      "OpenAI: hakuna salio au billing haijawashwa. Angalia https://platform.openai.com/account/billing";

    try {
      const response = await axios.post(
        `${API_BASE}/api/v1/ai-exam/generate-exam`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: () => true,
        }
      );

      if (response.status !== 200) {
        setError(detailFromBody(response.data, billingHint));
        return;
      }

      if (response.data.success) {
        setExamContent(response.data.exam_content || "");
        const ms = response.data.marking_scheme as string | undefined;
        if (ms) {
          setMarkingScheme(ms);
          setShowMarking(true);
          setMarkingWarning("");
        } else {
          setMarkingScheme("");
          setShowMarking(false);
          const note = response.data.marking_scheme_note as string | undefined;
          const msErr = response.data.marking_scheme_error as string | undefined;
          setMarkingWarning(note || msErr || "");
        }
      } else {
        setError(response.data.error || "Failed to generate exam");
      }
    } catch (err: unknown) {
      console.error("AI exam generate error:", err);
      setError(formatApiError(err, billingHint));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMarkingScheme = async () => {
    if (!examContent) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE}/api/v1/ai-exam/generate-marking-scheme`,
        { exam_content: examContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: () => true,
        }
      );

      if (response.status !== 200) {
        setError(
          detailFromBody(
            response.data,
            "Marking scheme haikutengenezwa. Angalia OpenAI billing au jaribu tena."
          )
        );
        return;
      }

      if (response.data.success) {
        setMarkingScheme(response.data.marking_scheme);
        setShowMarking(true);
        setMarkingWarning("");
      } else {
        setError(response.data.error || "Failed to generate marking scheme");
      }
    } catch (err: unknown) {
      console.error("Marking scheme error:", err);
      setError(formatApiError(err, "Failed to generate marking scheme."));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNumberChange = (value: string) => {
    const intValue = parseInt(value);
    if (value === "") {
      setFormData({ ...formData, num_questions: 10 });
    } else if (!isNaN(intValue)) {
      const clamped = Math.min(50, Math.max(1, intValue));
      setFormData({ ...formData, num_questions: clamped });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_name");
    router.push("/login");
  };

  const getSchoolLevelLabel = (level: string) => {
    switch (level) {
      case "primary":
        return "🏫 Primary School";
      case "secondary":
        return "📚 Secondary School";
      case "advanced":
        return "🎓 Advanced Level";
      default:
        return level;
    }
  };

  return (
    <MobileLayout>
      {/* Header */}
      <MobileHeader
        title="MASI FAST RESULTS"
        subtitle="AI Powered Exam Generator"
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button - Mobile Friendly */}
        <MobileBackButton />

        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm mb-3 sm:mb-4">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>AI Powered Exam Generator</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create Exams Instantly
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Generate a professional exam and its marking scheme in one step.
            Fill in subject, topic, and class level — AI returns both documents when possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <MobileCard gradient="from-white to-white">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Exam Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleGenerateExam} className="space-y-4 sm:space-y-5">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium text-sm sm:text-base">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, English, Biology"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="border-gray-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="topic" className="text-gray-700 font-medium text-sm sm:text-base">
                    Topic *
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Algebra, Grammar, Photosynthesis"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    className="border-gray-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="class_level" className="text-gray-700 font-medium text-sm sm:text-base">
                    Class Level *
                  </Label>
                  <Input
                    id="class_level"
                    placeholder="e.g., Form 3, Std 5, Form 6"
                    value={formData.class_level}
                    onChange={(e) =>
                      setFormData({ ...formData, class_level: e.target.value })
                    }
                    className="border-gray-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="num_questions" className="text-gray-700 font-medium text-sm sm:text-base">
                      Questions
                    </Label>
                    <Input
                      id="num_questions"
                      type="text"
                      placeholder="10"
                      value={formData.num_questions}
                      onChange={(e) => handleNumberChange(e.target.value)}
                      className="border-gray-200 focus:border-blue-400 h-10 sm:h-11 text-sm sm:text-base rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="exam_type" className="text-gray-700 font-medium text-sm sm:text-base">
                      Exam Type
                    </Label>
                    <Select
                      name="exam_type"
                      value={formData.exam_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, exam_type: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 h-10 sm:h-11 text-sm rounded-xl">
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                        <SelectItem value="Midterm">Midterm Exam</SelectItem>
                        <SelectItem value="Terminal">Terminal Exam</SelectItem>
                        <SelectItem value="Annual">Annual Exam</SelectItem>
                        <SelectItem value="Test">Test</SelectItem>
                        <SelectItem value="Quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="school_level" className="text-gray-700 font-medium text-sm sm:text-base">
                    School Level
                  </Label>
                  <Select
                    name="school_level"
                    value={formData.school_level}
                    onValueChange={(value) =>
                      setFormData({ ...formData, school_level: value })
                    }
                  >
                    <SelectTrigger className="border-gray-200 h-10 sm:h-11 text-sm rounded-xl">
                      <SelectValue placeholder="Select school level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      <SelectItem value="primary">🏫 Primary School (Std 1-7)</SelectItem>
                      <SelectItem value="secondary">📚 Secondary School (Form 1-4)</SelectItem>
                      <SelectItem value="advanced">🎓 Advanced Level (Form 5-6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && <MobileAlert type="error" message={error} />}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all touch-feedback"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Generate Exam + Marking
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </MobileCard>

          {/* Right Column - Results */}
          <div className="space-y-4 sm:space-y-6">
            {!examContent && !loading && (
              <MobileCard gradient="from-gray-50 to-white">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Ready to Create Exams
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Fill in the details on the left and click
                    <br className="hidden xs:block" />
                    <span className="font-medium text-blue-600">
                      "Generate Exam + Marking"
                    </span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                    Mtihani na mfumo wa alama utajitokeza hapa
                  </p>
                </CardContent>
              </MobileCard>
            )}

            {examContent && (
              <MobileCard>
                <div className="h-1 w-full bg-gradient-to-r from-green-500 to-teal-500" />
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-xl flex flex-row items-center justify-between p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                    Generated Exam
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDownload(
                        examContent,
                        `exam_${formData.subject}_${Date.now()}.txt`
                      )
                    }
                    className="text-white hover:bg-white/20 gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Download</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3">
                  {markingWarning && (
                    <MobileAlert type="warning" message={markingWarning} />
                  )}
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 max-h-[300px] sm:max-h-[400px] overflow-auto scrollable">
                    <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {examContent}
                    </pre>
                  </div>
                </CardContent>
              </MobileCard>
            )}

            {examContent && (!markingScheme || markingWarning) && (
              <Button
                onClick={handleGenerateMarkingScheme}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all touch-feedback"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {markingScheme ? "Regenerate Marking Scheme" : "Generate Marking Scheme Only"}
                  </>
                )}
              </Button>
            )}

            {showMarking && markingScheme && (
              <MobileCard>
                <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-xl flex flex-row items-center justify-between p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                    Marking Scheme
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDownload(
                        markingScheme,
                        `marking_scheme_${formData.subject}_${Date.now()}.txt`
                      )
                    }
                    className="text-white hover:bg-white/20 gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Download</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 max-h-[300px] sm:max-h-[400px] overflow-auto scrollable">
                    <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {markingScheme}
                    </pre>
                  </div>
                </CardContent>
              </MobileCard>
            )}
          </div>
        </div>

        {/* Tips Section - Mobile Optimized */}
        <MobileCard gradient="from-blue-50 to-purple-50" className="mt-6 sm:mt-8">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-gray-800">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Pro Tips for Better Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li>✨ Be specific with the topic for more focused questions</li>
                <li>📚 Choose appropriate school level for age-appropriate content</li>
                <li>🔢 Adjust number of questions based on exam duration</li>
              </ul>
              <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li>📝 Mtihani na marking scheme hutoka pamoja</li>
                <li>💾 Download exams as text files for printing</li>
                <li>🔄 You can regenerate with different parameters anytime</li>
              </ul>
            </div>
          </CardContent>
        </MobileCard>
      </main>

      {/* Custom Animations */}
      <style jsx global>{`
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }

        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        @media (max-width: 399px) {
          .xs\\:block {
            display: block !important;
          }
          .xs\\:inline {
            display: inline !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:block {
            display: none !important;
          }
          .xs\\:inline {
            display: none !important;
          }
          .xs\\:hidden {
            display: inline !important;
          }
        }
      `}</style>
    </MobileLayout>
  );
}