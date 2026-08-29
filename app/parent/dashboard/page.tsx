"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Users,
  GraduationCap,
  BookOpen,
  LogOut,
  User,
  Phone,
  Mail,
  MapPin,
  School,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye,
  Award,
  Trophy,
  Star,
  UserPlus,
  Plus,
  Filter,
  Layers,
  Home,
  Heart,
  Sparkles,
  Crown,
  Medal,
  BarChart3,
  Clock,
  Zap,
  Rocket,
  Shield,
  Gem,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 INTERFACES
// ============================================================
interface Child {
  id: number;
  student_id: number;
  student_name: string;
  student_roll_number: string;
  class_name: string;
  stream_name: string;
  relationship: string;
  is_active: boolean;
}

interface ParentProfile {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  username: string;
  school_id: number;
  is_active: boolean;
}

interface OverallResult {
  total_score: number;
  average: number;
  grade: string;
  points?: number;
  division?: string;
  position: number;
  total_students: number;
  teacher_remarks: string;
  headmaster_remarks: string;
}

interface SubjectResult {
  id: number;
  subject_id: number;
  subject_name: string;
  score: number;
  grade: string;
  exam_type: string;
  year: number;
  position: number;
  total_students: number;
  a_score?: number;
  b_score?: number;
  jumla?: number;
  wastani?: number;
}

interface FullResults {
  student: {
    id: number;
    name: string;
    roll_number: string;
    class_name: string;
    stream_name: string;
  };
  results: SubjectResult[];
  overall: OverallResult;
  exam_types: string[];
  exam_a?: string;
  exam_b?: string;
  term?: string;
}

type ViewMode = "term" | "individual";

// ============================================================
// 🔥 TYPING WORDS - KISWAHILI KWA WAZAZI!
// ============================================================
const TYPING_WORDS = [
  "👇 Bonyeza kitufe cha BLUE kuona matokeo ya mtoto wako",
  "📊 Tazama alama na daraja la kila somo",
  "📈 Fuatilia maendeleo ya mtoto wako shuleni",
  "📅 Angalia tarehe za kufunga na kufungua shule",
  "📢 Pata taarifa na tangazo la shule",
  "👨‍👩‍👧‍👦 Shirikiana na walimu kumsaidia mtoto",
  "⭐ Kila mtoto ana uwezo wa kufaulu",
];

function TypingEffect() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];
    
    const timer = setTimeout(() => {
      if (isWaiting) {
        setIsWaiting(false);
        return;
      }
      
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.substring(0, text.length + 1));
        } else {
          setIsWaiting(true);
          setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.substring(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [text, wordIndex, isDeleting, isWaiting]);

  return (
    <div className="h-6 sm:h-8 flex items-center justify-center">
      <span className="text-sm sm:text-base md:text-lg font-medium text-white/95">
        {text}
        <span className="inline-block w-0.5 h-4 sm:h-5 md:h-6 ml-0.5 bg-white animate-pulse" />
      </span>
    </div>
  );
}

// ============================================================
// 🔥 STAT CARD - UREFU UMEONGEZWA!
// ============================================================
function StatCard({ label, value, icon: Icon, color = "blue" }: { label: string; value: string | number; icon: any; color?: "blue" | "purple" | "gold" | "rose" | "emerald" | "indigo" }) {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    purple: "from-purple-500 to-pink-600",
    gold: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
    emerald: "from-emerald-500 to-teal-600",
    indigo: "from-indigo-500 to-blue-600",
  };

  return (
    <div className={cn(
      "rounded-2xl p-5 sm:p-6 text-white shadow-xl", // 🔥 UREFU: p-5 sm:p-6
      "bg-gradient-to-r",
      colors[color],
      "min-h-[110px] sm:min-h-[120px]" // 🔥 UREFU umeongezwa!
    )}>
      <div className="flex items-start justify-between h-full">
        <div>
          <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1.5">{value}</p> {/* 🔥 mt-1.5, text kubwa */}
        </div>
        <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl backdrop-blur-sm flex-shrink-0"> {/* 🔥 p-2.5 sm:p-3 */}
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" /> {/* 🔥 icons kubwa zaidi */}
        </div>
      </div>
      <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden"> {/* 🔥 mt-3 */}
        <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft" />
      </div>
    </div>
  );
}

// ============================================================
// 🔥 MAIN COMPONENT
// ============================================================
export default function ParentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [error, setError] = useState("");
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [fullResults, setFullResults] = useState<FullResults | null>(null);
  const [viewingResults, setViewingResults] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("term");
  const [examType, setExamType] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("I");
  const [availableExamTypes, setAvailableExamTypes] = useState<string[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    if (!token || userType !== "parent") {
      router.push("/parent/login");
      return;
    }

    fetchDashboard(token);
  }, [router]);

  const fetchDashboard = async (token: string) => {
    try {
      setLoading(true);
      
      const profileRes = await fetch(`${API_BASE_URL}/api/v1/parents/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }

      const childrenRes = await fetch(`${API_BASE_URL}/api/v1/parents/children`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (childrenRes.ok) {
        const data = await childrenRes.json();
        setChildren(data);
      }

    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Imeshindwa kupakia data. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (studentId: number) => {
    const token = localStorage.getItem("token");
    setSelectedChildId(studentId);
    setViewingResults(true);
    setLoadingResults(true);
    setError("");

    try {
      console.log("🔥 ===== HANDLE VIEW RESULTS STARTED =====");
      console.log("📡 Student ID:", studentId);
      
      const studentInfoRes = await fetch(
        `${API_BASE_URL}/api/v1/parents/children/${studentId}/info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (studentInfoRes.ok) {
        const studentData = await studentInfoRes.json();
        console.log("👶 Student info:", studentData);
        
        const studentInfoToSave = {
          id: studentData.id,
          name: studentData.name,
          roll_number: studentData.roll_number || "",
          class_name: studentData.class_name,
          stream_name: studentData.stream_name || "",
          school_name: studentData.school_name,
          school_level: studentData.school_level || "secondary",
          school_id: studentData.school_id
        };
        
        localStorage.setItem("studentInfo", JSON.stringify(studentInfoToSave));
        console.log("💾 studentInfo saved to localStorage");
      }

      let url = "";
      
      if (viewMode === "term") {
        url = `${API_BASE_URL}/api/v1/parents/children/${studentId}/term-results?term=${selectedTerm}`;
      } else {
        if (!examType) {
          setError("Tafadhali chagua aina ya mtihani");
          setLoadingResults(false);
          return;
        }
        url = `${API_BASE_URL}/api/v1/parents/children/${studentId}/exam-results?exam_type=${examType}`;
      }

      console.log("📡 Fetching results from:", url);

      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const data: FullResults = await response.json();
        console.log("📊 Results received successfully");
        setFullResults(data);
        setAvailableExamTypes(data.exam_types || []);
        router.push(`/parent/results/${studentId}`);
      } else {
        const errorData = await response.json();
        console.error("❌ Results error:", errorData);
        setError(errorData.detail || "Imeshindwa kupakia matokeo");
        setFullResults(null);
      }
    } catch (err) {
      console.error("❌ Error fetching results:", err);
      setError("Imeshindwa kuunganisha na server. Tafadhali jaribu tena.");
      setFullResults(null);
    } finally {
      setLoadingResults(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: "bg-emerald-500 text-white",
      B: "bg-blue-500 text-white",
      C: "bg-yellow-500 text-white",
      D: "bg-orange-500 text-white",
      E: "bg-red-500 text-white",
      F: "bg-red-600 text-white",
    };
    return colors[grade] || "bg-gray-500 text-white";
  };

  const getGradeBadge = (grade: string) => {
    return (
      <Badge className={`${getGradeColor(grade)} text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 font-bold border-0`}>
        {grade}
      </Badge>
    );
  };

  const getPositionDisplay = (position: number, total: number) => {
    if (!position || position === 0) return "N/A";
    return `${position} / ${total}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const getViewModeLabel = () => {
    if (viewMode === "term") {
      return selectedTerm === "I" ? "Muhula wa Kwanza (MIDTERM 3 + TERMINAL)" : "Muhula wa Pili (MIDTERM 9 + ANNUAL)";
    } else {
      return `Matokeo ya ${examType || "Mtihani"}`;
    }
  };

  const getViewModeDescription = () => {
    if (viewMode === "term") {
      return selectedTerm === "I" 
        ? "Jumla ya alama za MIDTERM 3 na TERMINAL kwa kila somo" 
        : "Jumla ya alama za MIDTERM 9 na ANNUAL kwa kila somo";
    } else {
      return `Matokeo ya ${examType || "mtihani"} pekee`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section - PRO MAX! */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-72 h-72 md:w-96 md:h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-72 h-72 md:w-96 md:h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                Parent Portal
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Dashboard ya Mzazi
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                Karibu {profile?.name}
              </p>
              <div className="mt-1">
                <TypingEffect />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Link href="/parent/add-child">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 gap-2 rounded-xl h-9 sm:h-10 text-sm shadow-lg hover:shadow-xl touch-feedback">
                  <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Ongeza Mtoto</span>
                  <span className="inline xs:hidden">Ongeza</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-white/30 text-white hover:bg-white/20 hover:text-white rounded-xl h-9 sm:h-10 text-sm touch-feedback"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Ondoka</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 animate-fadeIn">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-4 flex items-center gap-2 text-sm shadow-md">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm flex-1">{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-800 text-xs"
              onClick={() => setError("")}
            >
              Funga
            </Button>
          </div>
        )}

        {/* Stats Cards - UREFU UMEONGEZWA! */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard label="Watoto" value={children.length} icon={Heart} color="blue" />
          <StatCard label="Wanafunzi" value={children.length} icon={Users} color="purple" />
          <StatCard label="Masomo" value={fullResults?.results.length || 0} icon={BookOpen} color="gold" />
          <StatCard label="Hali" value={children.length > 0 ? "✅ Active" : "📝 Pending"} icon={CheckCircle} color="emerald" />
        </div>

        {/* Profile Card - UREFU UMEONGEZWA! */}
        {profile && (
          <Card className="mb-4 sm:mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50"> {/* 🔥 p-4 sm:p-6 */}
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base">Taarifa Zangu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0"> {/* 🔥 p-4 sm:p-6 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500">Jina Kamili</p>
                  <p className="font-medium text-sm sm:text-base">{profile.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jina la Mtumiaji</p>
                  <p className="font-medium text-sm sm:text-base">{profile.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Namba ya Simu</p>
                  <p className="font-medium text-sm sm:text-base">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Barua Pepe</p>
                  <p className="font-medium text-sm sm:text-base">{profile.email || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Children & Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Children List - UREFU UMEONGEZWA! */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50"> {/* 🔥 p-4 sm:p-6 */}
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base">Orodha ya Watoto Wangu</span>
                <Badge className="bg-blue-100 text-blue-700 border-0 ml-1 sm:ml-2">
                  {children.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Bonyeza mtoto kuona matokeo yake
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0"> {/* 🔥 p-4 sm:p-6 */}
              {children.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Hujasajili mtoto yeyote bado</p>
                  <p className="text-xs text-gray-400 mt-1">Bonyeza "Ongeza Mtoto" kuunganisha mtoto wako</p>
                  <Link href="/parent/add-child">
                    <Button className="mt-4 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm touch-feedback">
                      <Plus className="h-4 w-4" />
                      Ongeza Mtoto Sasa
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className={cn(
                        "flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all cursor-pointer touch-feedback",
                        selectedChildId === child.student_id 
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-md" 
                          : "bg-gray-50 hover:bg-blue-50/50 border-2 border-transparent"
                      )}
                      onClick={() => handleViewResults(child.student_id)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-md">
                          {child.student_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate">{child.student_name}</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full">{child.class_name}</span>
                            {child.stream_name && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{child.stream_name}</span>}
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {child.relationship}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewResults(child.student_id);
                        }}
                        className="gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs sm:text-sm flex-shrink-0 rounded-xl touch-feedback"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Angalia</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section - UREFU UMEONGEZWA! */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50"> {/* 🔥 p-4 sm:p-6 */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <span className="text-sm sm:text-base">Matokeo ya Mtihani</span>
                </CardTitle>
                {/* View Mode Switch */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                  <button
                    className={cn(
                      "px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-sm font-medium transition-all",
                      viewMode === "term" 
                        ? "bg-white shadow-sm text-purple-700" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => {
                      setViewMode("term");
                      if (selectedChildId) handleViewResults(selectedChildId);
                    }}
                  >
                    <Layers className="h-3 w-3 inline mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">Muhula</span>
                    <span className="inline xs:hidden">Muhula</span>
                  </button>
                  <button
                    className={cn(
                      "px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-sm font-medium transition-all",
                      viewMode === "individual" 
                        ? "bg-white shadow-sm text-purple-700" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => {
                      setViewMode("individual");
                      if (selectedChildId) handleViewResults(selectedChildId);
                    }}
                  >
                    <Filter className="h-3 w-3 inline mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">Mtihani</span>
                    <span className="inline xs:hidden">Mtihani</span>
                  </button>
                </div>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                {viewingResults && fullResults ? (
                  <>
                    <span className="font-medium text-purple-700">{fullResults.student.name}</span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span>{getViewModeLabel()}</span>
                  </>
                ) : (
                  "Chagua mtoto kutoka upande wa kushoto kuona matokeo yake"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0"> {/* 🔥 p-4 sm:p-6 */}
              {loadingResults ? (
                <div className="text-center py-8 sm:py-12">
                  <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-purple-600 mx-auto" />
                  <p className="text-gray-500 mt-3 text-sm">Inapakia matokeo...</p>
                </div>
              ) : !viewingResults || !fullResults ? (
                <div className="text-center py-8 sm:py-12">
                  <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Hakuna matokeo yaliyochaguliwa</p>
                  <p className="text-xs text-gray-400 mt-1">Chagua mtoto kutoka orodha ya kushoto</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 items-center bg-gradient-to-r from-gray-50 to-gray-100 p-2 sm:p-3 rounded-xl">
                    {viewMode === "term" ? (
                      <>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Chagua Muhula:</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={selectedTerm === "I" ? "default" : "outline"}
                            onClick={() => {
                              setSelectedTerm("I");
                              if (selectedChildId) handleViewResults(selectedChildId);
                            }}
                            className={selectedTerm === "I" ? "bg-purple-600 text-xs h-7 sm:h-9 rounded-lg" : "text-xs h-7 sm:h-9 rounded-lg"}
                          >
                            Muhula I
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedTerm === "II" ? "default" : "outline"}
                            onClick={() => {
                              setSelectedTerm("II");
                              if (selectedChildId) handleViewResults(selectedChildId);
                            }}
                            className={selectedTerm === "II" ? "bg-purple-600 text-xs h-7 sm:h-9 rounded-lg" : "text-xs h-7 sm:h-9 rounded-lg"}
                          >
                            Muhula II
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Chagua Mtihani:</span>
                        <select
                          className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          value={examType}
                          onChange={(e) => {
                            setExamType(e.target.value);
                            if (selectedChildId) handleViewResults(selectedChildId);
                          }}
                        >
                          <option value="">-- Chagua --</option>
                          {availableExamTypes.length > 0 ? (
                            availableExamTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))
                          ) : (
                            <>
                              <option value="MIDTERM3">MIDTERM 3</option>
                              <option value="MIDTERM9">MIDTERM 9</option>
                              <option value="TERMINAL">TERMINAL</option>
                              <option value="ANNUAL">ANNUAL</option>
                            </>
                          )}
                        </select>
                      </>
                    )}
                  </div>

                  {/* Overall Summary - UREFU UMEONGEZWA! */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl text-center border border-blue-100 min-h-[75px] sm:min-h-[85px] flex flex-col justify-center"> {/* 🔥 UREFU umeongezwa! */}
                      <p className="text-[10px] sm:text-xs text-gray-500">Jumla</p>
                      <p className="text-base sm:text-xl font-bold text-blue-700">{fullResults.overall.total_score || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 sm:p-4 rounded-xl text-center border border-emerald-100 min-h-[75px] sm:min-h-[85px] flex flex-col justify-center"> {/* 🔥 UREFU umeongezwa! */}
                      <p className="text-[10px] sm:text-xs text-gray-500">Wastani</p>
                      <p className="text-base sm:text-xl font-bold text-emerald-700">{fullResults.overall.average || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-xl text-center border border-purple-100 min-h-[75px] sm:min-h-[85px] flex flex-col justify-center"> {/* 🔥 UREFU umeongezwa! */}
                      <p className="text-[10px] sm:text-xs text-gray-500">Daraja</p>
                      <div className="flex justify-center mt-0.5">{getGradeBadge(fullResults.overall.grade)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 sm:p-4 rounded-xl text-center border border-amber-100 min-h-[75px] sm:min-h-[85px] flex flex-col justify-center"> {/* 🔥 UREFU umeongezwa! */}
                      <p className="text-[10px] sm:text-xs text-gray-500">Nafasi</p>
                      <p className="text-base sm:text-xl font-bold text-amber-700">
                        {getPositionDisplay(fullResults.overall.position, fullResults.overall.total_students)}
                      </p>
                    </div>
                  </div>

                  {/* Division & Points for Secondary - UREFU UMEONGEZWA! */}
                  {fullResults.overall.division && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 sm:p-4 rounded-xl text-center border border-indigo-100 min-h-[70px] sm:min-h-[80px] flex flex-col justify-center"> {/* 🔥 UREFU umeongezwa! */}
                        <p className="text-[10px] sm:text-xs text-gray-500">Division</p>
                        <p className="text-base sm:text-xl font-bold text-indigo-700">{fullResults.overall.division}</p>
                      </div>
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-3 sm:p-4 rounded-xl text-center border border-teal-100 min-h-[70px] sm:min-h-[80px] flex flex-col justify-center"> {/* 🔥 UREFU umeongezwa! */}
                        <p className="text-[10px] sm:text-xs text-gray-500">Points</p>
                        <p className="text-base sm:text-xl font-bold text-teal-700">{fullResults.overall.points || 0}</p>
                      </div>
                    </div>
                  )}

                  {/* Subject Results Table */}
                  <div className="overflow-x-auto -mx-3 sm:-mx-0">
                    <Table className="min-w-full sm:min-w-0">
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <TableHead className="w-6 sm:w-8 text-center text-[10px] sm:text-sm">#</TableHead>
                          <TableHead className="text-[10px] sm:text-sm">Somo</TableHead>
                          {viewMode === "term" && fullResults.exam_a && fullResults.exam_b ? (
                            <>
                              <TableHead className="text-center text-[10px] sm:text-sm">{fullResults.exam_a}</TableHead>
                              <TableHead className="text-center text-[10px] sm:text-sm">{fullResults.exam_b}</TableHead>
                              <TableHead className="text-center text-[10px] sm:text-sm font-semibold">Jumla</TableHead>
                              <TableHead className="text-center text-[10px] sm:text-sm font-semibold">Wastani</TableHead>
                            </>
                          ) : (
                            <TableHead className="text-center text-[10px] sm:text-sm font-semibold">Alama</TableHead>
                          )}
                          <TableHead className="text-center text-[10px] sm:text-sm">Daraja</TableHead>
                          <TableHead className="text-center text-[10px] sm:text-sm">Nafasi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fullResults.results.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4 text-gray-500 text-sm">
                              Hakuna matokeo ya masomo
                            </TableCell>
                          </TableRow>
                        ) : (
                          fullResults.results.map((subject, idx) => (
                            <TableRow key={subject.subject_id || `subject-${idx}`} className="hover:bg-gray-50/50">
                              <TableCell className="text-gray-500 text-center text-xs sm:text-sm">{idx + 1}</TableCell>
                              <TableCell className="font-medium text-xs sm:text-sm">{subject.subject_name}</TableCell>
                              {viewMode === "term" ? (
                                <>
                                  <TableCell className="text-center text-xs sm:text-sm">
                                    {subject.a_score !== undefined && subject.a_score !== null ? subject.a_score : "-"}
                                  </TableCell>
                                  <TableCell className="text-center text-xs sm:text-sm">
                                    {subject.b_score !== undefined && subject.b_score !== null ? subject.b_score : "-"}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold text-xs sm:text-sm">
                                    {subject.jumla !== undefined && subject.jumla !== null ? subject.jumla : "-"}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold text-xs sm:text-sm">
                                    {subject.wastani !== undefined && subject.wastani !== null ? subject.wastani : "-"}
                                  </TableCell>
                                </>
                              ) : (
                                <TableCell className="text-center font-semibold text-xs sm:text-sm">
                                  {subject.score !== undefined && subject.score !== null ? subject.score : "-"}
                                </TableCell>
                              )}
                              <TableCell className="text-center">{getGradeBadge(subject.grade)}</TableCell>
                              <TableCell className="text-center text-xs sm:text-sm">
                                {subject.position ? `${subject.position}/${subject.total_students}` : "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Remarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2">
                    {fullResults.overall.teacher_remarks && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                        <p className="text-[10px] sm:text-xs font-semibold text-blue-700 flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          Maoni ya Mwalimu
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 italic mt-1">"{fullResults.overall.teacher_remarks}"</p>
                      </div>
                    )}
                    {fullResults.overall.headmaster_remarks && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-xl border border-purple-100">
                        <p className="text-[10px] sm:text-xs font-semibold text-purple-700 flex items-center gap-1">
                          <Award className="h-3.5 w-3.5" />
                          Maoni ya Mkuu
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 italic mt-1">"{fullResults.overall.headmaster_remarks}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - UREFU UMEONGEZWA! */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link href="/parent/add-child">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-xl hover:shadow-2xl transition-all cursor-pointer rounded-2xl overflow-hidden group">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:scale-x-100 transition-transform origin-left" />
              <CardContent className="p-4 sm:p-5 flex items-center gap-3"> {/* 🔥 p-4 sm:p-5 */}
                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md"> {/* 🔥 p-2.5 */}
                  <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> {/* 🔥 icons kubwa */}
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Ongeza Mtoto</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Unganisha mtoto mwingine</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/parent/dashboard">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-xl hover:shadow-2xl transition-all cursor-pointer rounded-2xl overflow-hidden group">
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-x-100 transition-transform origin-left" />
              <CardContent className="p-4 sm:p-5 flex items-center gap-3"> {/* 🔥 p-4 sm:p-5 */}
                <div className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md"> {/* 🔥 p-2.5 */}
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> {/* 🔥 icons kubwa */}
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Matokeo Yote</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Rudi kwenye dashboard</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-xl hover:shadow-2xl transition-all cursor-pointer rounded-2xl overflow-hidden group">
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-x-100 transition-transform origin-left" />
              <CardContent className="p-4 sm:p-5 flex items-center gap-3"> {/* 🔥 p-4 sm:p-5 */}
                <div className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-md"> {/* 🔥 p-2.5 */}
                  <Home className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> {/* 🔥 icons kubwa */}
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Ukurasa Mkuu</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Nenda kwenye mwanzo</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 sm:py-6 mt-4 sm:mt-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-purple-400" />
            <span className="font-bold text-sm sm:text-base text-purple-400">MASI FAST RESULTS</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">Parent Portal • Care for Your Child's Education</p>
          <p className="text-gray-600 text-[10px] sm:text-xs mt-2">
            &copy; {new Date().getFullYear()} MASI FAST RESULTS SYSTEM. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .touch-feedback { @apply active:scale-95 transition-transform duration-150; }
        @media (max-width: 399px) {
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
        @media (min-width: 400px) {
          .xs\\:inline { display: none !important; }
          .xs\\:hidden { display: inline !important; }
        }
      `}</style>
    </div>
  );
}