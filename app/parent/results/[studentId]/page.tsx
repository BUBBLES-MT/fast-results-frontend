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
  Filter
} from "lucide-react";

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
  
  // 🔥 TANGAZO LA SHULE
  const [announcement, setAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>("swahili");
  const [announcementFetched, setAnnouncementFetched] = useState(false);

  // ============================================================
  // 🔥 EFFECTS
  // ============================================================

  useEffect(() => {
    console.log("🔥🔥🔥 PARENT CHILD RESULTS PAGE LOADED 🔥🔥🔥");
    console.log("📌 Student ID from params:", studentId);
    
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    if (!token || userType !== "parent") {
      router.push("/parent/login");
      return;
    }

    const savedStudent = localStorage.getItem("studentInfo");
    console.log("📚 Raw studentInfo from localStorage:", savedStudent);
    
    if (savedStudent && !student) {
      try {
        const parsed = JSON.parse(savedStudent);
        console.log("✅ Parsed student from localStorage:", parsed);
        console.log("🔑 School ID from localStorage:", parsed.school_id);
        console.log("🏫 School Name from localStorage:", parsed.school_name);
        
        setStudent(parsed);
        setIsPrimary(parsed.school_level === "primary");
        
        if (parsed.school_id && !announcementFetched) {
          console.log("📡 Fetching announcement from localStorage student...");
          fetchAnnouncementForStudent(parsed);
        }
      } catch (e) {
        console.error("Error parsing student from localStorage:", e);
      }
    }

    fetchStudentInfo();
  }, [studentId]);

  useEffect(() => {
    console.log("🔄 useEffect triggered - student changed:", student);
    if (student) {
      console.log("✅ Student exists, fetching results...");
      fetchResults();
      if (!announcementFetched && student.school_id) {
        console.log("📡 Fetching announcement for student:", student.school_id);
        fetchAnnouncementForStudent(student);
      }
    } else {
      console.log("❌ No student yet");
    }
  }, [student, viewMode, selectedTerm, examType]);

  // ============================================================
  // 🔥 FETCH FUNCTIONS
  // ============================================================

  const fetchStudentInfo = async () => {
    try {
      console.log("📡 Fetching student info from API for ID:", studentId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/v1/parents/children/${studentId}/info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("👶 Student info from API:", data);
        console.log("🔑 School ID from API:", data.school_id);
        console.log("🏫 School Name from API:", data.school_name);
        
        setStudent(data);
        setIsPrimary(data.school_level === "primary");
        
        localStorage.setItem("studentInfo", JSON.stringify(data));
        console.log("💾 Student info saved to localStorage");
        
        if (data.school_id && !announcementFetched) {
          console.log("📡 Fetching announcement from API data...");
          await fetchAnnouncementForStudent(data);
        }
      } else {
        console.error("❌ Failed to load student info:", response.status);
        setError("Failed to load student information");
      }
    } catch (err) {
      console.error("❌ Error fetching student info:", err);
      setError("Error loading student information");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncementForStudent = async (studentData?: StudentInfo) => {
    try {
      console.log("🔍 ===== FETCHING ANNOUNCEMENT =====");
      const token = localStorage.getItem("token");
      const currentStudent = studentData || student;
      
      console.log("🔍 Current student data:", currentStudent);
      console.log("🔍 School ID from currentStudent:", currentStudent?.school_id);
      
      let schoolId = currentStudent?.school_id;
      
      if (!schoolId) {
        console.log("ℹ️ No school_id in student, trying localStorage...");
        const savedStudent = localStorage.getItem("studentInfo");
        
        if (savedStudent) {
          try {
            const parsed = JSON.parse(savedStudent);
            schoolId = parsed.school_id;
            console.log("📚 Found school_id in localStorage:", schoolId);
          } catch (e) {
            console.error("❌ Error parsing localStorage:", e);
          }
        }
      }
      
      if (!schoolId) {
        console.log("❌❌❌ NO SCHOOL_ID FOUND ANYWHERE! ❌❌❌");
        setLoadingAnnouncement(false);
        setAnnouncement(null);
        setAnnouncementFetched(true);
        return;
      }

      console.log(`📡 Fetching announcement for school ID: ${schoolId}`);
      console.log(`📡 URL: ${API_BASE_URL}/api/v1/school-announcements/public/${schoolId}`);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/school-announcements/public/${schoolId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log(`📡 Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📚 Announcement data received:`, data);
        
        if (data && data.id) {
          console.log(`✅✅✅ ANNOUNCEMENT SET SUCCESSFULLY! ID: ${data.id}`);
          console.log(`📅 Closing date: ${data.closing_date}`);
          console.log(`📅 Opening date: ${data.opening_date}`);
          console.log(`📢 Announcement SW: ${data.announcement_sw}`);
          setAnnouncement(data);
        } else {
          console.log(`ℹ️ No announcement data (null or empty)`);
          setAnnouncement(null);
        }
        setAnnouncementFetched(true);
      } else {
        const errorText = await response.text();
        console.log(`❌ Error response: ${response.status} - ${errorText}`);
        setAnnouncement(null);
        setAnnouncementFetched(true);
      }
    } catch (err) {
      console.error("❌❌❌ Error fetching announcement:", err);
      setAnnouncement(null);
      setAnnouncementFetched(true);
    } finally {
      setLoadingAnnouncement(false);
      console.log("🔍 ===== ANNOUNCEMENT FETCH COMPLETE =====");
    }
  };

  // ============================================================
  // 🔥 HELPER FUNCTIONS
  // ============================================================

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

  // 🔥🔥🔥 FETCH RESULTS 🔥🔥🔥
  const fetchResults = async () => {
    try {
      console.log("📡 Fetching results for student:", studentId);
      console.log("📡 View Mode:", viewMode);
      console.log("📡 Selected Term:", selectedTerm);
      console.log("📡 Exam Type:", examType);
      
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

      console.log(`📡 URL: ${url}`);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Results data from API:", data);
        
        const formattedResults = (data.results || []).map((subject: any) => {
          let score = subject.score;
          if (!score || score === 0) {
            score = subject.wastani || subject.jumla || 0;
          }
          return {
            ...subject,
            score: Math.round(score * 100) / 100
          };
        });
        
        console.log("📊 Formatted results with scores:", formattedResults);
        setResults(formattedResults);
        setOverall(data.overall || null);
        setAvailableExamTypes(data.exam_types || ["MIDTERM3", "TERMINAL", "MIDTERM9", "ANNUAL"]);
        
        if (data.exam_a) setExamA(data.exam_a);
        if (data.exam_b) setExamB(data.exam_b);
      } else {
        console.error("❌ Failed to load results:", response.status);
        setError("Failed to load results");
      }
    } catch (err) {
      console.error("❌ Error loading results:", err);
      setError("Error loading results");
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
      <Badge className={`${getGradeColor(grade)} text-sm px-3 py-1 font-semibold`}>
        {grade}
      </Badge>
    );
  };

  const getPositionDisplay = (position: number, total: number) => {
    if (!position || position === 0) return "N/A";
    return `${position} / ${total}`;
  };

  const getViewModeLabel = () => {
    if (viewMode === "term") {
      return selectedTerm === "I" 
        ? "Matokeo ya Muhula wa Kwanza (MIDTERM 3 + TERMINAL)" 
        : "Matokeo ya Muhula wa Pili (MIDTERM 9 + ANNUAL)";
    } else {
      return `Matokeo ya ${examType}`;
    }
  };

  const getViewModeDescription = () => {
    if (viewMode === "term") {
      return selectedTerm === "I" 
        ? "Inaonyesha jumla ya alama za MIDTERM 3 na TERMINAL kwa kila somo" 
        : "Inaonyesha jumla ya alama za MIDTERM 9 na ANNUAL kwa kila somo";
    } else {
      return `Inaonyesha matokeo ya ${examType} pekee`;
    }
  };

  // ============================================================
  // 🔥 RENDER
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-sky-600 mx-auto" />
          <p className="text-gray-600 mt-3 text-sm">Inapakia matokeo...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 text-sm">{error || "Student not found"}</p>
            <Link href="/parent/dashboard">
              <Button className="mt-4 text-sm">Rudi Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <Link href="/parent/dashboard">
              <Button variant="outline" size="sm" className="gap-1 text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                Rudi
              </Button>
            </Link>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                Matokeo ya {student.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {student.class_name} {student.stream_name} • {student.school_name}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1 text-xs sm:text-sm" onClick={() => window.print()}>
            <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
            Chapisha
          </Button>
        </div>

        {/* Student Info Card */}
        <Card className="mb-4 shadow-sm border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-sky-100 rounded-full">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Mwanafunzi</p>
                  <p className="font-semibold text-sm sm:text-base truncate">{student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-full">
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Darasa</p>
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {student.class_name} {student.stream_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-full">
                  <School className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Shule</p>
                  <p className="font-semibold text-sm sm:text-base truncate">{student.school_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-amber-100 rounded-full">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Namba</p>
                  <p className="font-semibold text-sm sm:text-base">{student.roll_number || "-"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Mode */}
        <Card className="mb-4 shadow-sm border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="p-2 sm:p-3">
            <div className="flex flex-wrap gap-2 items-center text-xs sm:text-sm">
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Aina:</span>
              <div className="flex gap-0.5">
                <Button
                  size="sm"
                  variant={viewMode === "term" ? "default" : "outline"}
                  onClick={() => { setViewMode("term"); fetchResults(); }}
                  className={viewMode === "term" ? "bg-sky-600 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3" : "h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"}
                >
                  <Layers className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  Muhula
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "individual" ? "default" : "outline"}
                  onClick={() => { setViewMode("individual"); fetchResults(); }}
                  className={viewMode === "individual" ? "bg-sky-600 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3" : "h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"}
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  Mtihani
                </Button>
              </div>

              {viewMode === "term" && (
                <>
                  <span className="font-medium text-gray-700 text-xs sm:text-sm ml-1">Muhula:</span>
                  <div className="flex gap-0.5">
                    <Button
                      size="sm"
                      variant={selectedTerm === "I" ? "default" : "outline"}
                      onClick={() => { setSelectedTerm("I"); fetchResults(); }}
                      className={selectedTerm === "I" ? "bg-sky-600 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3" : "h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"}
                    >
                      I
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedTerm === "II" ? "default" : "outline"}
                      onClick={() => { setSelectedTerm("II"); fetchResults(); }}
                      className={selectedTerm === "II" ? "bg-sky-600 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3" : "h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"}
                    >
                      II
                    </Button>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5">
                    {selectedTerm === "I" ? "MIDTERM3+TERMINAL" : "MIDTERM9+ANNUAL"}
                  </span>
                </>
              )}

              {viewMode === "individual" && (
                <>
                  <span className="font-medium text-gray-700 text-xs sm:text-sm ml-1">Mtihani:</span>
                  <select
                    className="text-xs sm:text-sm border border-gray-300 rounded px-2 sm:px-3 py-0.5 sm:py-1 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 h-7 sm:h-8"
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

        {/* Overall Summary */}
        {overall && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-sky-50 to-blue-50">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500">Jumla</p>
                <p className="text-base sm:text-lg font-bold text-sky-700">{overall.total_score || 0}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500">Wastani</p>
                <p className="text-base sm:text-lg font-bold text-emerald-700">{overall.average || 0}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500">Daraja</p>
                <div className="flex justify-center">{getGradeBadge(overall.grade)}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500">Nafasi</p>
                <p className="text-base sm:text-lg font-bold text-amber-700">
                  {getPositionDisplay(overall.position, overall.total_students)}
                </p>
                <p className="text-[8px] sm:text-[10px] text-gray-400">kati ya {overall.total_students}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Division & Points */}
        {overall?.division && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500">Division</p>
                <p className="text-base sm:text-lg font-bold text-indigo-700">{overall.division}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500">Points</p>
                <p className="text-base sm:text-lg font-bold text-teal-700">{overall.points || 0}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
          <CardHeader className="p-2 sm:p-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-1.5 sm:gap-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Matokeo - {getViewModeLabel()}
            </CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">
              {isPrimary ? "Alama 0-50 • Daraja A-E" : "Alama 0-100 • Daraja A-F"}
              <span className="block text-gray-400 text-[10px] sm:text-xs">{getViewModeDescription()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-8 text-center text-[10px] sm:text-xs">#</TableHead>
                    <TableHead className="text-[10px] sm:text-xs">Somo</TableHead>
                    {viewMode === "term" && examA && examB && (
                      <>
                        <TableHead className="text-center text-[10px] sm:text-xs">{examA}</TableHead>
                        <TableHead className="text-center text-[10px] sm:text-xs">{examB}</TableHead>
                        <TableHead className="text-center text-[10px] sm:text-xs font-semibold">Jumla</TableHead>
                        <TableHead className="text-center text-[10px] sm:text-xs font-semibold">Wastani</TableHead>
                      </>
                    )}
                    {viewMode === "individual" && (
                      <TableHead className="text-center text-[10px] sm:text-xs font-semibold">Alama</TableHead>
                    )}
                    <TableHead className="text-center text-[10px] sm:text-xs">Daraja</TableHead>
                    <TableHead className="text-center text-[10px] sm:text-xs">Nafasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
                        Hakuna matokeo
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((subject, idx) => (
                      <TableRow key={subject.id || idx} className="hover:bg-gray-50">
                        <TableCell className="text-center text-gray-500 text-[10px] sm:text-xs">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-[10px] sm:text-sm">{subject.subject_name}</TableCell>
                        {viewMode === "term" && examA && examB && (
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
                        )}
                        {viewMode === "individual" && (
                          <TableCell className="text-center font-semibold text-[10px] sm:text-sm">
                            {subject.score || "-"}
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          {getGradeBadge(subject.grade)}
                        </TableCell>
                        <TableCell className="text-center text-[10px] sm:text-sm">
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

        {/* Remarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
          {overall?.teacher_remarks && (
            <Card className="shadow-sm border-0 bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardHeader className="p-2 sm:p-3">
                <CardTitle className="text-xs sm:text-sm font-semibold text-indigo-700 flex items-center gap-1.5 sm:gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Mwalimu wa Darasa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 pt-0">
                <p className="text-xs sm:text-sm text-gray-700 italic">"{overall.teacher_remarks}"</p>
              </CardContent>
            </Card>
          )}
          {overall?.headmaster_remarks && (
            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="p-2 sm:p-3">
                <CardTitle className="text-xs sm:text-sm font-semibold text-purple-700 flex items-center gap-1.5 sm:gap-2">
                  <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                  Mkuu wa Shule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 pt-0">
                <p className="text-xs sm:text-sm text-gray-700 italic">"{overall.headmaster_remarks}"</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 🔥 TANGAZO LA SHULE */}
        <Card className="mt-4 shadow-sm border-0 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-xl border-l-4 border-amber-500">
          <CardHeader className="p-2 sm:p-3">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-amber-800">
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
                {preferredLanguage === "english" ? "School Announcement" : "Tangazo la Shule"}
                {student && (
                  <span className="text-[10px] sm:text-xs font-normal text-amber-600">({student.school_name})</span>
                )}
              </CardTitle>
              <div className="flex gap-0.5 bg-white/50 rounded p-0.5">
                <button
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium transition-all ${
                    preferredLanguage === "swahili" ? "bg-amber-600 text-white" : "text-gray-500"
                  }`}
                  onClick={() => setPreferredLanguage("swahili")}
                >
                  <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-0.5" />
                  Kiswahili
                </button>
                <button
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium transition-all ${
                    preferredLanguage === "english" ? "bg-amber-600 text-white" : "text-gray-500"
                  }`}
                  onClick={() => setPreferredLanguage("english")}
                >
                  <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-0.5" />
                  English
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 pt-0">
            {loadingAnnouncement ? (
              <div className="text-center py-2">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-amber-600 mx-auto" />
                <p className="text-[10px] sm:text-xs text-gray-500">Inapakia...</p>
              </div>
            ) : announcement ? (
              <>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2">
                  <div className="bg-white/70 p-1.5 sm:p-2 rounded border border-red-100">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 flex items-center gap-0.5">
                      <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500" />
                      {preferredLanguage === "english" ? "Closing" : "Kufunga"}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-red-600">
                      {announcement.closing_date ? formatDate(announcement.closing_date) : "Haijawekwa"}
                    </p>
                  </div>
                  <div className="bg-white/70 p-1.5 sm:p-2 rounded border border-emerald-100">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 flex items-center gap-0.5">
                      <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-500" />
                      {preferredLanguage === "english" ? "Opening" : "Kufungua"}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-600">
                      {announcement.opening_date ? formatDate(announcement.opening_date) : "Haijawekwa"}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/70 p-2 sm:p-3 rounded mb-2 border border-amber-100">
                  <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-0.5 flex items-center gap-0.5">
                    <Megaphone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {preferredLanguage === "english" ? "Announcement" : "Tangazo"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                    {getAnnouncementText() || (preferredLanguage === "english" ? "No announcement" : "Hakuna tangazo")}
                  </p>
                </div>
                
                <div className="bg-white/70 p-2 sm:p-3 rounded border border-amber-100">
                  <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-0.5 flex items-center gap-0.5">
                    <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {preferredLanguage === "english" ? "Meeting Notes" : "Mkutano wa Wazazi"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                    {getMeetingNotes() || (preferredLanguage === "english" ? "No notes" : "Hakuna maelezo")}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-2 text-gray-500 text-xs sm:text-sm">
                <Megaphone className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-300 mb-1" />
                {preferredLanguage === "english" ? "No announcement" : "Hakuna tangazo"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Download Button */}
        <div className="mt-4 text-center">
          <Button
            onClick={() => window.print()}
            size="sm"
            className="gap-1.5 sm:gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-xs sm:text-sm"
          >
            <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
            Chapisha Matokeo
          </Button>
        </div>
      </div>
    </div>
  );
}