"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Award,
  User,
  Calendar,
  School,
  Printer,
  Users,
  CalendarDays,
  Megaphone,
  Globe,
  Layers,
  Filter,
  Heart,
  Sparkles,
  Star,
  Trophy,
  Crown,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 INTERFACES
// ============================================================

interface SubjectResult {
  id: number;
  subject_id: number;
  subject_name: string;
  score: number;
  grade: string;
  exam_type: string;
  year: number;
  position?: number;
  a_score?: number;
  b_score?: number;
  jumla?: number;
  wastani?: number;
  total_students?: number;
}

interface StudentInfo {
  id: number;
  name: string;
  roll_number: string;
  class_name: string;
  stream_name: string;
  school_name: string;
  school_level: string;
  school_id?: number;
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

interface SchoolAnnouncement {
  id: number;
  school_id: number;
  closing_date: string | null;
  opening_date: string | null;
  announcement_sw: string | null;
  announcement_en: string | null;
  parent_meeting_notes_sw: string | null;
  parent_meeting_notes_en: string | null;
  language: string;
  created_at: string;
}

type Language = "swahili" | "english";
type ViewMode = "term" | "individual";

// ============================================================
// 🔥 GRADE BADGE COMPONENT - FIXED!
// ============================================================
function GradeBadge({ grade }: { grade?: string }) {
  const safeGrade = grade || "—";
  const colors: Record<string, string> = {
    A: "bg-emerald-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-amber-500 text-white",
    D: "bg-orange-500 text-white",
    E: "bg-red-500 text-white",
    F: "bg-red-600 text-white",
    "—": "bg-gray-400 text-white",
  };
  return (
    <Badge className={`${colors[safeGrade] || "bg-gray-400 text-white"} text-xs sm:text-sm px-2 sm:px-2.5 py-0.5 font-bold border-0 min-w-[28px] text-center`}>
      {safeGrade}
    </Badge>
  );
}

// ============================================================
// 🔥 STAT CARD - UREFU UMEONGEZWA ZAIDI!
// ============================================================
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = "blue", 
  subtitle 
}: { 
  label: string; 
  value: string | number | React.ReactNode;
  icon: any; 
  color?: "blue" | "emerald" | "purple" | "amber" | "rose" | "indigo";
  subtitle?: string;
}) {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-pink-600",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
    indigo: "from-indigo-500 to-blue-600",
  };

  return (
    <div className={cn(
      "rounded-2xl p-5 sm:p-6 text-white shadow-lg", // 🔥 UREFU: p-5 sm:p-6
      "bg-gradient-to-r",
      colors[color],
      "min-h-[110px] sm:min-h-[120px]" // 🔥 UREFU umeongezwa zaidi!
    )}>
      <div className="flex items-start justify-between h-full">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wider truncate">
            {label}
          </p>
          <div className="text-2xl sm:text-3xl font-bold mt-1.5 truncate"> {/* 🔥 text kubwa, mt-1.5 */}
            {value}
          </div>
          {subtitle && <p className="text-[9px] sm:text-[11px] text-white/70 truncate mt-1">{subtitle}</p>} {/* 🔥 mt-1 */}
        </div>
        <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl flex-shrink-0"> {/* 🔥 p-2.5 sm:p-3 */}
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" /> {/* 🔥 icons kubwa zaidi */}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔥 MAIN COMPONENT
// ============================================================
export default function ParentChildResultsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  // ============================================================
  // 🔥 STATE
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [results, setResults] = useState<SubjectResult[]>([]);
  const [overall, setOverall] = useState<OverallResult | null>(null);
  const [selectedTerm, setSelectedTerm] = useState("I");
  const [viewMode, setViewMode] = useState<ViewMode>("term");
  const [examType, setExamType] = useState("TERMINAL");
  const [availableExamTypes, setAvailableExamTypes] = useState<string[]>([]);
  const [isPrimary, setIsPrimary] = useState(false);
  const [examA, setExamA] = useState<string>("");
  const [examB, setExamB] = useState<string>("");
  
  const [announcement, setAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>("swahili");
  const [announcementFetched, setAnnouncementFetched] = useState(false);

  // ============================================================
  // 🔥 EFFECTS
  // ============================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    if (!token || userType !== "parent") {
      router.push("/parent/login");
      return;
    }

    const savedStudent = localStorage.getItem("studentInfo");
    if (savedStudent && !student) {
      try {
        const parsed = JSON.parse(savedStudent);
        setStudent(parsed);
        setIsPrimary(parsed.school_level === "primary");
        if (parsed.school_id && !announcementFetched) {
          fetchAnnouncementForStudent(parsed);
        }
      } catch (e) {
        console.error("Error parsing student:", e);
      }
    }

    fetchStudentInfo();
  }, [studentId]);

  useEffect(() => {
    if (student) {
      fetchResults();
      if (!announcementFetched && student.school_id) {
        fetchAnnouncementForStudent(student);
      }
    }
  }, [student, viewMode, selectedTerm, examType]);

  // ============================================================
  // 🔥 FETCH FUNCTIONS
  // ============================================================

  const fetchStudentInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/v1/parents/children/${studentId}/info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        setIsPrimary(data.school_level === "primary");
        localStorage.setItem("studentInfo", JSON.stringify(data));
        if (data.school_id && !announcementFetched) {
          await fetchAnnouncementForStudent(data);
        }
      } else {
        setError("Failed to load student information");
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setError("Error loading student information");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncementForStudent = async (studentData?: StudentInfo) => {
    try {
      const token = localStorage.getItem("token");
      const currentStudent = studentData || student;
      let schoolId = currentStudent?.school_id;

      if (!schoolId) {
        const savedStudent = localStorage.getItem("studentInfo");
        if (savedStudent) {
          const parsed = JSON.parse(savedStudent);
          schoolId = parsed.school_id;
        }
      }

      if (!schoolId) {
        setLoadingAnnouncement(false);
        setAnnouncementFetched(true);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/school-announcements/public/${schoolId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          setAnnouncement(data);
        } else {
          setAnnouncement(null);
        }
        setAnnouncementFetched(true);
      } else {
        setAnnouncement(null);
        setAnnouncementFetched(true);
      }
    } catch (err) {
      console.error("Error fetching announcement:", err);
      setAnnouncement(null);
      setAnnouncementFetched(true);
    } finally {
      setLoadingAnnouncement(false);
    }
  };

  const getAnnouncementText = () => {
    if (!announcement) return null;
    if (preferredLanguage === "english") {
      return announcement.announcement_en || announcement.announcement_sw;
    }
    return announcement.announcement_sw || announcement.announcement_en;
  };

  const getMeetingNotes = () => {
    if (!announcement) return null;
    if (preferredLanguage === "english") {
      return announcement.parent_meeting_notes_en || announcement.parent_meeting_notes_sw;
    }
    return announcement.parent_meeting_notes_sw || announcement.parent_meeting_notes_en;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('sw-TZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Africa/Dar_es_Salaam'
      });
    } catch {
      return null;
    }
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "";

      if (viewMode === "term") {
        url = `${API_BASE_URL}/api/v1/parents/children/${studentId}/term-results?term=${selectedTerm}`;
      } else {
        if (!examType) {
          setError("Tafadhali chagua aina ya mtihani");
          return;
        }
        url = `${API_BASE_URL}/api/v1/parents/children/${studentId}/exam-results?exam_type=${examType}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedResults = (data.results || []).map((subject: any) => ({
          ...subject,
          score: Math.round((subject.score || subject.wastani || subject.jumla || 0) * 100) / 100
        }));
        setResults(formattedResults);
        setOverall(data.overall || null);
        setAvailableExamTypes(data.exam_types || ["MIDTERM3", "TERMINAL", "MIDTERM9", "ANNUAL"]);
        if (data.exam_a) setExamA(data.exam_a);
        if (data.exam_b) setExamB(data.exam_b);
      } else {
        setError("Failed to load results");
      }
    } catch (err) {
      console.error("Error loading results:", err);
      setError("Error loading results");
    }
  };

  const getPositionDisplay = (position: number, total: number) => {
    if (!position || position === 0) return "N/A";
    return `${position}/${total}`;
  };

  const getViewModeLabel = () => {
    if (viewMode === "term") {
      return selectedTerm === "I" ? "Muhula I (MID3+TERM)" : "Muhula II (MID9+ANN)";
    }
    return examType;
  };

  // ============================================================
  // 🔥 LOADING & ERROR
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base animate-pulse">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 text-sm">{error || "Student not found"}</p>
            <Link href="/parent/dashboard">
              <Button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-sm">Rudi Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================
  // 🔥 RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Header - Compact! */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/parent/dashboard">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 rounded-xl h-8 sm:h-9 text-xs">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Rudi
                </Button>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                  {student.name}
                </h1>
                <p className="text-white/80 text-xs sm:text-sm">
                  {student.class_name} {student.stream_name} • {student.school_name}
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.print()}
              size="sm"
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 rounded-xl h-8 sm:h-9 text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Chapisha
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 animate-fadeIn">
        {/* Stats Cards - Compact! */}
        {overall && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <StatCard label="Jumla" value={overall.total_score || 0} icon={Trophy} color="blue" />
            <StatCard label="Wastani" value={overall.average || 0} icon={Star} color="emerald" />
            <StatCard 
              label="Daraja" 
              value={overall.grade ? <GradeBadge grade={overall.grade} /> : "—"} 
              icon={Award} 
              color="purple" 
            />
            <StatCard 
              label="Nafasi" 
              value={getPositionDisplay(overall.position, overall.total_students)} 
              icon={Crown} 
              color="amber" 
              subtitle={`kati ya ${overall.total_students}`}
            />
          </div>
        )}

        {/* Division & Points - UREFU UMEONGEZWA! */}
        {overall?.division && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="rounded-2xl p-5 sm:p-6 text-white shadow-lg bg-gradient-to-r from-indigo-500 to-blue-600 min-h-[100px]"> {/* 🔥 UREFU umeongezwa! */}
              <div className="flex items-start justify-between h-full">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wider">Division</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1.5">{overall.division}</p> {/* 🔥 mt-1.5 */}
                </div>
                <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl">
                  <Medal className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-5 sm:p-6 text-white shadow-lg bg-gradient-to-r from-teal-500 to-cyan-600 min-h-[100px]"> {/* 🔥 UREFU umeongezwa! */}
              <div className="flex items-start justify-between h-full">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wider">Points</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1.5">{overall.points || 0}</p> {/* 🔥 mt-1.5 */}
                </div>
                <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Controls - Compact! */}
        <Card className="mb-3 sm:mb-4 shadow-md border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-2 sm:p-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Aina:</span>
              <div className="flex gap-0.5">
                <button
                  className={cn(
                    "px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all",
                    viewMode === "term" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                  onClick={() => { setViewMode("term"); fetchResults(); }}
                >
                  <Layers className="h-3 w-3 inline mr-0.5" />
                  Muhula
                </button>
                <button
                  className={cn(
                    "px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all",
                    viewMode === "individual" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                  onClick={() => { setViewMode("individual"); fetchResults(); }}
                >
                  <Filter className="h-3 w-3 inline mr-0.5" />
                  Mtihani
                </button>
              </div>

              {viewMode === "term" && (
                <>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 ml-1">Muhula:</span>
                  <div className="flex gap-0.5">
                    <button
                      className={cn(
                        "px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all min-w-[28px] text-center",
                        selectedTerm === "I" 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      onClick={() => { setSelectedTerm("I"); fetchResults(); }}
                    >
                      I
                    </button>
                    <button
                      className={cn(
                        "px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all min-w-[28px] text-center",
                        selectedTerm === "II" 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      onClick={() => { setSelectedTerm("II"); fetchResults(); }}
                    >
                      II
                    </button>
                  </div>
                </>
              )}

              {viewMode === "individual" && (
                <>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 ml-1">Mtihani:</span>
                  <select
                    className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={examType}
                    onChange={(e) => { setExamType(e.target.value); fetchResults(); }}
                  >
                    <option value="">-- Chagua --</option>
                    {availableExamTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Table - COMPACT! */}
        <Card className="shadow-md border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-sm sm:text-base">Matokeo - {getViewModeLabel()}</span>
              <Badge className="bg-blue-100 text-blue-700 border-0 ml-1 text-[10px] sm:text-xs">
                {results.length} masomo
              </Badge>
            </CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">
              {isPrimary ? "Alama 0-50 • Daraja A-E" : "Alama 0-100 • Daraja A-F"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-6 text-center text-[10px] sm:text-xs text-gray-500">#</TableHead>
                    <TableHead className="text-[10px] sm:text-xs text-gray-700 font-semibold">Somo</TableHead>
                    {viewMode === "term" && examA && examB && (
                      <>
                        <TableHead className="text-center text-[9px] sm:text-xs text-gray-500 min-w-[40px]">{examA}</TableHead>
                        <TableHead className="text-center text-[9px] sm:text-xs text-gray-500 min-w-[40px]">{examB}</TableHead>
                        <TableHead className="text-center text-[10px] sm:text-xs font-semibold text-blue-700 min-w-[45px]">Jumla</TableHead>
                        <TableHead className="text-center text-[10px] sm:text-xs font-semibold text-blue-700 min-w-[50px]">Wastani</TableHead>
                      </>
                    )}
                    {viewMode === "individual" && (
                      <TableHead className="text-center text-[10px] sm:text-xs font-semibold text-blue-700 min-w-[45px]">Alama</TableHead>
                    )}
                    <TableHead className="text-center text-[10px] sm:text-xs text-gray-700 font-semibold min-w-[40px]">Daraja</TableHead>
                    <TableHead className="text-center text-[10px] sm:text-xs text-gray-500 min-w-[45px]">Nafasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500 text-xs sm:text-sm">
                        Hakuna matokeo
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((subject, idx) => (
                      <TableRow key={subject.id || idx} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="text-center text-[10px] sm:text-xs text-gray-400">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm text-gray-800 truncate max-w-[80px] sm:max-w-[150px]">
                          {subject.subject_name}
                        </TableCell>
                        {viewMode === "term" && examA && examB && (
                          <>
                            <TableCell className="text-center text-[10px] sm:text-sm">
                              {subject.a_score !== undefined && subject.a_score !== null ? subject.a_score : "-"}
                            </TableCell>
                            <TableCell className="text-center text-[10px] sm:text-sm">
                              {subject.b_score !== undefined && subject.b_score !== null ? subject.b_score : "-"}
                            </TableCell>
                            <TableCell className="text-center font-semibold text-[10px] sm:text-sm text-blue-700">
                              {subject.jumla !== undefined && subject.jumla !== null ? subject.jumla : "-"}
                            </TableCell>
                            <TableCell className="text-center font-semibold text-[10px] sm:text-sm text-blue-700">
                              {subject.wastani !== undefined && subject.wastani !== null ? subject.wastani : "-"}
                            </TableCell>
                          </>
                        )}
                        {viewMode === "individual" && (
                          <TableCell className="text-center font-semibold text-[10px] sm:text-sm text-blue-700">
                            {subject.score || "-"}
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          <GradeBadge grade={subject.grade} />
                        </TableCell>
                        <TableCell className="text-center text-[10px] sm:text-xs text-gray-500">
                          {subject.position ? `${subject.position}/${subject.total_students || overall?.total_students || 0}` : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Remarks - Compact! */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
          {overall?.teacher_remarks && (
            <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
              <div className="h-0.5 w-full bg-gradient-to-r from-blue-400 to-indigo-500" />
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                  <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Mwalimu wa Darasa
                </p>
                <p className="text-xs sm:text-sm text-gray-700 italic mt-0.5">"{overall.teacher_remarks}"</p>
              </CardContent>
            </Card>
          )}
          {overall?.headmaster_remarks && (
            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden">
              <div className="h-0.5 w-full bg-gradient-to-r from-purple-400 to-pink-500" />
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                  <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Mkuu wa Shule
                </p>
                <p className="text-xs sm:text-sm text-gray-700 italic mt-0.5">"{overall.headmaster_remarks}"</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Announcement - Compact! */}
        <Card className="mt-3 sm:mt-4 shadow-md border-0 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl overflow-hidden border-l-4 border-amber-500">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <span className="text-xs sm:text-sm font-semibold text-amber-800">
                  {preferredLanguage === "english" ? "School Announcement" : "Tangazo la Shule"}
                </span>
              </div>
              <div className="flex gap-0.5 bg-white/50 rounded-lg p-0.5">
                <button
                  className={cn(
                    "px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-xs font-medium transition-all",
                    preferredLanguage === "swahili" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-100"
                  )}
                  onClick={() => setPreferredLanguage("swahili")}
                >
                  <Globe className="h-2.5 w-2.5 inline mr-0.5" />
                  SW
                </button>
                <button
                  className={cn(
                    "px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-xs font-medium transition-all",
                    preferredLanguage === "english" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-100"
                  )}
                  onClick={() => setPreferredLanguage("english")}
                >
                  <Globe className="h-2.5 w-2.5 inline mr-0.5" />
                  EN
                </button>
              </div>
            </div>

            {loadingAnnouncement ? (
              <div className="text-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-600 mx-auto" />
              </div>
            ) : announcement ? (
              <div className="space-y-1.5 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/70 p-1.5 sm:p-2 rounded-lg border border-red-100">
                    <p className="text-[8px] sm:text-[9px] text-gray-500 flex items-center gap-0.5">
                      <CalendarDays className="h-2.5 w-2.5" />
                      {preferredLanguage === "english" ? "Closing" : "Kufunga"}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-red-600">
                      {announcement.closing_date ? formatDate(announcement.closing_date) : "—"}
                    </p>
                  </div>
                  <div className="bg-white/70 p-1.5 sm:p-2 rounded-lg border border-emerald-100">
                    <p className="text-[8px] sm:text-[9px] text-gray-500 flex items-center gap-0.5">
                      <CalendarDays className="h-2.5 w-2.5" />
                      {preferredLanguage === "english" ? "Opening" : "Kufungua"}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-600">
                      {announcement.opening_date ? formatDate(announcement.opening_date) : "—"}
                    </p>
                  </div>
                </div>
                <div className="bg-white/70 p-2 rounded-lg border border-amber-100">
                  <p className="text-[10px] sm:text-xs text-gray-700 whitespace-pre-line">
                    {getAnnouncementText() || (preferredLanguage === "english" ? "No announcement" : "Hakuna tangazo")}
                  </p>
                </div>
                {getMeetingNotes() && (
                  <div className="bg-white/70 p-2 rounded-lg border border-amber-100">
                    <p className="text-[9px] sm:text-[10px] font-semibold text-amber-700 flex items-center gap-0.5">
                      <Users className="h-2.5 w-2.5" />
                      {preferredLanguage === "english" ? "Meeting Notes" : "Mkutano wa Wazazi"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-700 whitespace-pre-line mt-0.5">
                      {getMeetingNotes()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-2">
                {preferredLanguage === "english" ? "No announcement available" : "Hakuna tangazo"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Print Button */}
        <div className="text-center mt-4 sm:mt-5">
          <Button
            onClick={() => window.print()}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl text-sm rounded-xl px-4 sm:px-6 h-10 sm:h-11 touch-feedback"
          >
            <Printer className="h-4 w-4" />
            Chapisha Matokeo
          </Button>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .touch-feedback { @apply active:scale-95 transition-transform duration-150; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .min-h-screen { min-height: auto !important; }
        }
      `}</style>
    </div>
  );
}