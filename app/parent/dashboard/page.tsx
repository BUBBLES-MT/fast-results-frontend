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
  Layers
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  // 🔥🔥🔥 HANDLE VIEW RESULTS - VERSION MPYA KABISA 🔥🔥🔥
  const handleViewResults = async (studentId: number) => {
    const token = localStorage.getItem("token");
    setSelectedChildId(studentId);
    setViewingResults(true);
    setLoadingResults(true);
    setError("");

    try {
      console.log("🔥🔥🔥 ===== HANDLE VIEW RESULTS STARTED =====");
      console.log("📡 1. Student ID:", studentId);
      
      // 🔥🔥🔥 KABLA YA KWENYE MATOKEO, FETCH STUDENT INFO!
      console.log("📡 2. Fetching student info for ID:", studentId);
      
      const studentInfoRes = await fetch(
        `${API_BASE_URL}/api/v1/parents/children/${studentId}/info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (studentInfoRes.ok) {
        const studentData = await studentInfoRes.json();
        console.log("👶 3. Student info received:", studentData);
        console.log("🔑 4. School ID:", studentData.school_id);
        console.log("🏫 5. School Name:", studentData.school_name);
        console.log("📚 6. School Level:", studentData.school_level);
        
        // 🔥🔥🔥 WEKA KWENYE LOCALSTORAGE!
        const studentInfoToSave = {
          id: studentData.id,
          name: studentData.name,
          roll_number: studentData.roll_number || "",
          class_name: studentData.class_name,
          stream_name: studentData.stream_name || "",
          school_name: studentData.school_name,
          school_level: studentData.school_level || "secondary",
          school_id: studentData.school_id  // 🔥 HII NI MUHIMU KWA TANGAZO!
        };
        
        localStorage.setItem("studentInfo", JSON.stringify(studentInfoToSave));
        console.log("💾 7. studentInfo saved to localStorage:", studentInfoToSave);
        
        // 🔥 THIBITISHA IMEHIFADHIWA
        const checkSaved = localStorage.getItem("studentInfo");
        console.log("✅ 8. Verification - studentInfo in localStorage:", checkSaved ? "YES ✅" : "NO ❌");
        
        if (checkSaved) {
          const parsed = JSON.parse(checkSaved);
          console.log("✅ 9. Saved school_id:", parsed.school_id);
        }
        
      } else {
        console.error("❌ Failed to fetch student info, status:", studentInfoRes.status);
        setError("Imeshindwa kupata taarifa za mtoto");
        setLoadingResults(false);
        return;
      }

      // 🔥 ENDELEA KUPATA MATOKEO
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

      console.log("📡 10. Fetching results from:", url);

      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const data: FullResults = await response.json();
        console.log("📊 11. Results data received successfully");
        setFullResults(data);
        setAvailableExamTypes(data.exam_types || []);
        
        // 🔥🔥🔥 NAVIGATE - SAHIHI KWA PATH YAKO! 🔥🔥🔥
        console.log("🚀 12. Navigating to:", `/parent/results/${studentId}`);
        router.push(`/parent/results/${studentId}`);
      } else {
        const errorData = await response.json();
        console.error("❌ 13. Results error:", errorData);
        setError(errorData.detail || "Imeshindwa kupakia matokeo");
        setFullResults(null);
      }
    } catch (err) {
      console.error("❌ Error fetching results:", err);
      setError("Imeshindwa kuunganisha na server. Tafadhali jaribu tena.");
      setFullResults(null);
    } finally {
      setLoadingResults(false);
      console.log("🔥🔥🔥 ===== HANDLE VIEW RESULTS COMPLETE =====");
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
      <Badge className={`${getGradeColor(grade)} text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 font-bold`}>
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
      return selectedTerm === "I" ? "Matokeo ya Muhula wa Kwanza (MIDTERM 3 + TERMINAL)" : "Matokeo ya Muhula wa Pili (MIDTERM 9 + ANNUAL)";
    } else {
      return `Matokeo ya ${examType || "Mtihani"}`;
    }
  };

  const getViewModeDescription = () => {
    if (viewMode === "term") {
      return selectedTerm === "I" 
        ? "Inaonyesha jumla ya alama za MIDTERM 3 na TERMINAL kwa kila somo" 
        : "Inaonyesha jumla ya alama za MIDTERM 9 na ANNUAL kwa kila somo";
    } else {
      return `Inaonyesha matokeo ya ${examType || "mtihani"} pekee`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
          <p className="text-gray-600 mt-4">Inapakia Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard ya Mzazi</h1>
            <p className="text-sm sm:text-base text-gray-600">Karibu {profile?.name}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link href="/parent/add-child">
              <Button size="sm" className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs sm:text-sm">
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Ongeza Mtoto</span>
                <span className="inline xs:hidden">Ongeza</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="gap-1 sm:gap-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-xs sm:text-sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Ondoka</span>
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-red-600 hover:text-red-800 text-xs"
              onClick={() => setError("")}
            >
              Funga
            </Button>
          </div>
        )}

        {/* Profile Card */}
        {profile && (
          <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-xl">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-sm sm:text-base">Taarifa Zangu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500">Jina Kamili</p>
                  <p className="font-medium text-xs sm:text-sm">{profile.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jina la Mtumiaji</p>
                  <p className="font-medium text-xs sm:text-sm">{profile.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Namba ya Simu</p>
                  <p className="font-medium text-xs sm:text-sm">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Barua Pepe</p>
                  <p className="font-medium text-xs sm:text-sm">{profile.email || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Children Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Children List */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-sm sm:text-base">Orodha ya Watoto Wangu</span>
                <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1 sm:ml-2">
                  ({children.length})
                </span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Watoto waliounganishwa na akaunti yako. Bonyeza mtoto kuona matokeo yake.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {children.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm text-gray-500">Hujasajili mtoto yeyote bado</p>
                  <p className="text-xs text-gray-400">Bonyeza "Ongeza Mtoto" kuunganisha mtoto wako</p>
                  <Link href="/parent/add-child">
                    <Button size="sm" className="mt-2 sm:mt-3 gap-2 bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      Ongeza Mtoto Sasa
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all cursor-pointer ${
                        selectedChildId === child.student_id 
                          ? "bg-emerald-50 border-2 border-emerald-300" 
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                      onClick={() => handleViewResults(child.student_id)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                          {child.student_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{child.student_name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {child.class_name} {child.stream_name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                            Namba ya Mtihani: {child.student_roll_number || "-"} • Uhusiano: {child.relationship}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewResults(child.student_id);
                        }}
                        className="gap-1 bg-sky-600 hover:bg-sky-700 text-xs sm:text-sm flex-shrink-0"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Angalia Matokeo</span>
                        <span className="inline xs:hidden">Matokeo</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span className="text-sm sm:text-base">Matokeo ya Mtihani</span>
                </CardTitle>
                {/* View Mode Switch */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                  <button
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-sm font-medium transition-all ${
                      viewMode === "term" 
                        ? "bg-white shadow-sm text-emerald-700" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => {
                      setViewMode("term");
                      if (selectedChildId) handleViewResults(selectedChildId);
                    }}
                  >
                    <Layers className="h-3 w-3 inline mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">Muhtasari wa Muhula</span>
                    <span className="inline xs:hidden">Muhula</span>
                  </button>
                  <button
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-sm font-medium transition-all ${
                      viewMode === "individual" 
                        ? "bg-white shadow-sm text-emerald-700" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => {
                      setViewMode("individual");
                      if (selectedChildId) handleViewResults(selectedChildId);
                    }}
                  >
                    <Filter className="h-3 w-3 inline mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">Mtihani Binafsi</span>
                    <span className="inline xs:hidden">Mtihani</span>
                  </button>
                </div>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                {viewingResults && fullResults ? (
                  <>
                    <span className="font-medium">{fullResults.student.name}</span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span>{getViewModeLabel()}</span>
                    <br />
                    <span className="text-gray-400 text-[10px] sm:text-xs">{getViewModeDescription()}</span>
                  </>
                ) : (
                  "Chagua mtoto kutoka upande wa kushoto kuona matokeo yake"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {loadingResults ? (
                <div className="text-center py-6 sm:py-8">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-emerald-600 mx-auto" />
                  <p className="text-gray-500 mt-2 text-xs sm:text-sm">Inapakia matokeo ya mtihani...</p>
                </div>
              ) : !viewingResults || !fullResults ? (
                <div className="text-center py-6 sm:py-8">
                  <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm text-gray-500">Hakuna matokeo yaliyochaguliwa</p>
                  <p className="text-xs text-gray-400">Tafadhali chagua mtoto kutoka orodha ya kushoto</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 items-center bg-gray-50 p-2 sm:p-3 rounded-lg">
                    {viewMode === "term" ? (
                      <>
                        <span className="text-[10px] sm:text-sm font-medium text-gray-700">Chagua Muhula:</span>
                        <div className="flex gap-0.5 sm:gap-1">
                          <Button
                            key="term-I"
                            size="sm"
                            variant={selectedTerm === "I" ? "default" : "outline"}
                            onClick={() => {
                              setSelectedTerm("I");
                              if (selectedChildId) handleViewResults(selectedChildId);
                            }}
                            className={selectedTerm === "I" ? "bg-sky-600 text-xs h-7 sm:h-9" : "text-xs h-7 sm:h-9"}
                          >
                            Muhula wa Kwanza (I)
                          </Button>
                          <Button
                            key="term-II"
                            size="sm"
                            variant={selectedTerm === "II" ? "default" : "outline"}  
                            onClick={() => {
                              setSelectedTerm("II");
                              if (selectedChildId) handleViewResults(selectedChildId);
                            }}
                            className={selectedTerm === "II" ? "bg-sky-600 text-xs h-7 sm:h-9" : "text-xs h-7 sm:h-9"}
                          >
                            Muhula wa Pili (II)
                          </Button>
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-400 ml-1 sm:ml-2">
                          {selectedTerm === "I" ? "MIDTERM 3 + TERMINAL" : "MIDTERM 9 + ANNUAL"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] sm:text-sm font-medium text-gray-700">Chagua Aina ya Mtihani:</span>
                        <select
                          className="text-[10px] sm:text-sm border border-gray-300 rounded-lg px-1.5 sm:px-3 py-0.5 sm:py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[140px] sm:max-w-none"
                          value={examType}
                          onChange={(e) => {
                            setExamType(e.target.value);
                            if (selectedChildId) handleViewResults(selectedChildId);
                          }}
                        >
                          <option value="">-- Chagua Mtihani --</option>
                          {availableExamTypes.length > 0 ? (
                            availableExamTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))
                          ) : (
                            <>
                              <option key="midterm3" value="MIDTERM3">MIDTERM 3 (Mtihani wa Kati)</option>
                              <option key="midterm9" value="MIDTERM9">MIDTERM 9 (Mtihani wa Kati)</option>
                              <option key="terminal" value="TERMINAL">TERMINAL (Mtihani wa Mwisho wa Muhula)</option>
                              <option key="annual" value="ANNUAL">ANNUAL (Mtihani wa Mwisho wa Mwaka)</option>
                            </>
                          )}
                        </select>
                      </>
                    )}
                  </div>

                  {/* Overall Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3">
                    <div key="summary-total" className="bg-gradient-to-br from-sky-50 to-blue-50 p-2 sm:p-3 rounded-lg text-center">
                      <p className="text-[10px] sm:text-xs text-gray-500">Jumla ya Alama</p>
                      <p className="text-base sm:text-lg font-bold text-sky-700">{fullResults.overall.total_score || 0}</p>
                    </div>
                    <div key="summary-average" className="bg-gradient-to-br from-emerald-50 to-teal-50 p-2 sm:p-3 rounded-lg text-center">
                      <p className="text-[10px] sm:text-xs text-gray-500">Wastani wa Alama</p>
                      <p className="text-base sm:text-lg font-bold text-emerald-700">{fullResults.overall.average || 0}</p>
                    </div>
                    <div key="summary-grade" className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-3 rounded-lg text-center">
                      <p className="text-[10px] sm:text-xs text-gray-500">Daraja la Jumla</p>
                      <div className="flex justify-center">
                        {getGradeBadge(fullResults.overall.grade)}
                      </div>
                    </div>
                    <div key="summary-position" className="bg-gradient-to-br from-amber-50 to-orange-50 p-2 sm:p-3 rounded-lg text-center">
                      <p className="text-[10px] sm:text-xs text-gray-500">Nafasi Darasani</p>
                      <p className="text-base sm:text-lg font-bold text-amber-700">
                        {getPositionDisplay(fullResults.overall.position, fullResults.overall.total_students)}
                      </p>
                      <p className="text-[8px] sm:text-xs text-gray-400">
                        kati ya wanafunzi {fullResults.overall.total_students} darasani
                      </p>
                    </div>
                  </div>

                  {/* 🔥 DIVISION NA POINTS - KWA SECONDARY TU */}
                  {fullResults.overall.division && (
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-3 mt-1 sm:mt-2">
                      <div key="summary-division" className="bg-gradient-to-br from-indigo-50 to-blue-50 p-2 sm:p-3 rounded-lg text-center">
                        <p className="text-[10px] sm:text-xs text-gray-500">Division</p>
                        <p className="text-base sm:text-lg font-bold text-indigo-700">{fullResults.overall.division}</p>
                      </div>
                      <div key="summary-points" className="bg-gradient-to-br from-teal-50 to-cyan-50 p-2 sm:p-3 rounded-lg text-center">
                        <p className="text-[10px] sm:text-xs text-gray-500">Points</p>
                        <p className="text-base sm:text-lg font-bold text-teal-700">{fullResults.overall.points || 0}</p>
                      </div>
                    </div>
                  )}

                  {/* Subject Results Table */}
                  <div className="overflow-x-auto -mx-3 sm:-mx-0">
                    <Table className="min-w-full sm:min-w-0">
                      <TableHeader>
                        <TableRow key="header-row" className="bg-gray-50">
                          <TableHead className="w-6 sm:w-8 text-center text-[10px] sm:text-sm">#</TableHead>
                          <TableHead className="text-[10px] sm:text-sm">Jina la Somo</TableHead>
                          {viewMode === "term" && fullResults.exam_a && fullResults.exam_b ? (
                            <>
                              <TableHead key="header-exam-a" className="text-center text-[10px] sm:text-sm">
                                {fullResults.exam_a}
                              </TableHead>
                              <TableHead key="header-exam-b" className="text-center text-[10px] sm:text-sm">
                                {fullResults.exam_b}
                              </TableHead>
                              <TableHead key="header-jumla" className="text-center text-[10px] sm:text-sm font-semibold">
                                Jumla
                              </TableHead>
                              <TableHead key="header-wastani" className="text-center text-[10px] sm:text-sm font-semibold">
                                Wastani
                              </TableHead>
                            </>
                          ) : (
                            <TableHead key="header-score" className="text-center text-[10px] sm:text-sm font-semibold">
                              Alama
                            </TableHead>
                          )}
                          <TableHead key="header-grade" className="text-center text-[10px] sm:text-sm">
                            Daraja
                          </TableHead>
                          <TableHead key="header-position" className="text-center text-[10px] sm:text-sm">
                            Nafasi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fullResults.results.length === 0 ? (
                          <TableRow key="no-results-row">
                            <TableCell colSpan={7} className="text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
                              Hakuna matokeo ya masomo yaliyopatikana
                            </TableCell>
                          </TableRow>
                        ) : (
                          fullResults.results.map((subject, idx) => (
                            <TableRow key={subject.subject_id || `subject-${idx}`} className="hover:bg-gray-50">
                              <TableCell className="text-gray-500 text-center text-[10px] sm:text-sm">{idx + 1}</TableCell>
                              <TableCell className="font-medium text-[10px] sm:text-sm">{subject.subject_name}</TableCell>
                              {viewMode === "term" ? (
                                <>
                                  <TableCell className="text-center text-[10px] sm:text-sm">
                                    {subject.a_score !== undefined && subject.a_score !== null ? subject.a_score : "-"}
                                  </TableCell>
                                  <TableCell className="text-center text-[10px] sm:text-sm">
                                    {subject.b_score !== undefined && subject.b_score !== null ? subject.b_score : "-"}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold text-[10px] sm:text-sm">
                                    {subject.jumla !== undefined && subject.jumla !== null ? subject.jumla : "-"}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold text-[10px] sm:text-sm">
                                    {subject.wastani !== undefined && subject.wastani !== null ? subject.wastani : "-"}
                                  </TableCell>
                                </>
                              ) : (
                                <TableCell className="text-center font-semibold text-[10px] sm:text-sm">
                                  {subject.score !== undefined && subject.score !== null ? subject.score : "-"}
                                </TableCell>
                              )}
                              <TableCell className="text-center">
                                {getGradeBadge(subject.grade)}
                              </TableCell>
                              <TableCell className="text-center text-[10px] sm:text-sm">
                                {subject.position ? `${subject.position}/${subject.total_students}` : "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Remarks */}
                  <div key="remarks-container" className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4">
                    {fullResults.overall.teacher_remarks && (
                      <div key="teacher-remarks" className="bg-gradient-to-br from-indigo-50 to-blue-50 p-2 sm:p-3 rounded-lg">
                        <p className="text-[10px] sm:text-xs font-semibold text-indigo-700 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Maoni ya Mwalimu wa Darasa
                        </p>
                        <p className="text-[10px] sm:text-sm text-gray-700 italic">"{fullResults.overall.teacher_remarks}"</p>
                      </div>
                    )}
                    {fullResults.overall.headmaster_remarks && (
                      <div key="headmaster-remarks" className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-3 rounded-lg">
                        <p className="text-[10px] sm:text-xs font-semibold text-purple-700 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Maoni ya Mkuu wa Shule
                        </p>
                        <p className="text-[10px] sm:text-sm text-gray-700 italic">"{fullResults.overall.headmaster_remarks}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <Link key="action-add-child" href="/parent/add-child">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-full">
                  <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-xs sm:text-sm">Ongeza Mtoto Mwingine</p>
                  <p className="text-[10px] sm:text-sm text-gray-500">Unganisha mtoto mwingine kwenye akaunti yako</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link key="action-all-results" href="/parent/dashboard">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-sky-100 rounded-full">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                </div>
                <div>
                  <p className="font-medium text-xs sm:text-sm">Angalia Matokeo Yote</p>
                  <p className="text-[10px] sm:text-sm text-gray-500">Rudi kwenye dashboard ya matokeo</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link key="action-home" href="/">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-full">
                  <School className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-xs sm:text-sm">Rudi Ukurasa Mkuu</p>
                  <p className="text-[10px] sm:text-sm text-gray-500">Nenda kwenye ukurasa wa mwanzo</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}