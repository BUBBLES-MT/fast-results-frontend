// app/primary/reports/parent-report/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PrimaryClassParentReportPDF } from '@/components/PrimaryClassParentReportPDF';
import { MainLayout } from "@/components/layout/MainLayout";
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
  Calendar, 
  User, 
  MapPin, 
  GraduationCap,
  BookOpen,
  Download,
  Printer,
  School,
  AlertCircle,
  CheckCircle,
  CalendarDays,
  Building,
  Trophy
} from "lucide-react";

interface SchoolClass {
  id: number;
  name: string;
  school_id: number;
}

interface SchoolAnnouncement {
  id: number;
  school_id: number;
  closing_date: string | null;
  opening_date: string | null;
}

interface SchoolData {
  id: number;
  name: string;
  district?: string;
  school_level?: string;
}

interface HeadmasterData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status: string;
  school_id: number;
}

export default function RipotiZaMaendeleoYaDarasaPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number>(1);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("I");
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);
  
  const [announcement, setAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);
  
  const [headmasterData, setHeadmasterData] = useState<HeadmasterData | null>(null);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);
  
  const [teacherDate, setTeacherDate] = useState(new Date().toISOString().split('T')[0]);
  const [headmasterDate, setHeadmasterDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [teacherName, setTeacherName] = useState("");
  const [headmasterName, setHeadmasterName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // ============================================================
  // 🔥 FORMAT DATE
  // ============================================================

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateForBackend = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  // ============================================================
  // 🔥 FETCH SCHOOL DATA
  // ============================================================
  const fetchSchoolData = async (authToken: string, schoolId: string) => {
    try {
      setLoadingSchool(true);
      console.log("🏫 Primary: Fetching school data from: /api/v1/schools/" + schoolId);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/schools/${schoolId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("🏫 Primary school data fetched:", data);
        
        setSchoolData(data);
        setSchoolName(data.name || "");
        
        if (data.district && data.district.trim() !== "") {
          setDistrictName(data.district);
          console.log("📍 Primary district found:", data.district);
        }
        
        await fetchHeadmaster(authToken, schoolId);
      } else {
        console.error("❌ Failed to fetch primary school data:", response.status);
        await fetchHeadmaster(authToken, schoolId);
      }
    } catch (err) {
      console.error("Error fetching primary school data:", err);
      await fetchHeadmaster(authToken, schoolId);
    } finally {
      setLoadingSchool(false);
    }
  };

  // ============================================================
  // 🔥🔥🔥 FETCH HEADMASTER - MWALIMU MKUU PEKEE! 🔥🔥🔥
  // ============================================================
  const fetchHeadmaster = async (authToken: string, schoolId: string) => {
    try {
      setLoadingHeadmaster(true);
      console.log("👑 Primary: Fetching headmaster from: /api/v1/schools/" + schoolId + "/headmaster");
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/schools/${schoolId}/headmaster`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("👑 Primary headmaster data:", data);
        
        if (data && data.name) {
          setHeadmasterData(data);
          setHeadmasterName(data.name);
          console.log("✅ Primary headmaster (Mwalimu Mkuu) loaded:", data.name);
          return;
        }
      } else {
        console.log("⚠️ Primary headmaster API returned:", response.status);
      }
      
      // 🔥🔥🔥 FALLBACK - KAMA SECONDARY! 🔥🔥🔥
      // IKIWA HAKUNA MWALIMU MKUU KWENYE DATABASE,
      // TUMIA LOGGED-IN USER KAMA FALLBACK
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
        console.log("⚠️ Using logged-in user as headmaster (fallback):", userName);
      }
      
    } catch (err) {
      console.error("Error fetching primary headmaster:", err);
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
        console.log("⚠️ Using logged-in user as headmaster (catch):", userName);
      }
    } finally {
      setLoadingHeadmaster(false);
    }
  };

  // ============================================================
  // 🔥 FETCH CLASS TEACHER
  // ============================================================
  const fetchClassTeacher = async (authToken: string) => {
    try {
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setTeacherName(userName);
        console.log("👨‍🏫 Class teacher set to:", userName);
      }
    } catch (err) {
      console.error("Error setting class teacher:", err);
    }
  };

  // ============================================================
  // 🔥 FETCH CLASSES - PRIMARY
  // ============================================================
  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/classes`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        if (data.length > 0) {
          setSelectedClass(data[0].id.toString());
        }
        console.log("🏫 Primary classes loaded:", data.length);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Imeshindwa kupata madarasa: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Imeshindwa kuunganisha na server. Tafadhali hakikisha backend inaendesha.");
    } finally {
      setLoadingClasses(false);
    }
  };

  // ============================================================
  // 🔥 FETCH ANNOUNCEMENT
  // ============================================================
  const fetchAnnouncement = async (authToken: string, schoolId: string) => {
    try {
      setLoadingAnnouncement(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/school-announcements/teacher/${schoolId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Primary announcement fetched:", data);
        setAnnouncement(data);
      } else {
        console.log("ℹ️ No announcement found for this school");
        setAnnouncement(null);
      }
    } catch (err) {
      console.error("Error fetching announcement:", err);
      setAnnouncement(null);
    } finally {
      setLoadingAnnouncement(false);
    }
  };

  // ============================================================
  // 🔥 USEFFECT - INITIALIZATION
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userName = localStorage.getItem("user_name") || "";
    const userRole = localStorage.getItem("user_type") || "";
    const schoolId = localStorage.getItem("school_id");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"];
    const userRoleLower = (userRole || "").toLowerCase();
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/primary/dashboard");
      return;
    }
    
    setToken(storedToken);
    setUserRole(userRole);
    setUserSchoolId(schoolId ? parseInt(schoolId) : 1);
    setTeacherName(userName);
    
    if (userRole?.toLowerCase() === "mwalimu mkuu") {
      setHeadmasterName(userName);
    }
    
    fetchClasses(storedToken);
    fetchClassTeacher(storedToken);
    
    if (schoolId) {
      fetchSchoolData(storedToken, schoolId);
      fetchAnnouncement(storedToken, schoolId);
    }
  }, [router]);

  // ============================================================
  // 🔥 HANDLE CLASS CHANGE
  // ============================================================
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
  };

  // ============================================================
  // 🔥 GENERATE PDF
  // ============================================================
  const handleGeneratePDF = async () => {
    if (!selectedClass) {
      alert("Tafadhali chagua darasa");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setPdfData(null);

    try {
      const closingDate = announcement?.closing_date ? formatDateForBackend(announcement.closing_date) : "";
      const openingDate = announcement?.opening_date ? formatDateForBackend(announcement.opening_date) : "";

      console.log("📅 Closing date (backend):", closingDate);
      console.log("📅 Opening date (backend):", openingDate);

      const params = new URLSearchParams({
        term: selectedTerm,
        year: new Date().getFullYear().toString(),
        closing_date: closingDate,
        opening_date: openingDate,
        teacher_date: teacherDate,
        headmaster_date: headmasterDate,
        teacher_name: teacherName,
        headmaster_name: headmasterName,
        district_name: districtName,
        school_name: schoolName,
      });

      const url = `${API_BASE_URL}/api/v1/primary/marks/class/${selectedClass}/parent-reports-data?${params.toString()}`;
      
      console.log("📤 Fetching parent report data:", url);
      
      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Data received:", data);
      
      if (data && data.students && data.students.length > 0) {
        setPdfData(data);
        setSuccess(`✅ Ripoti za ${data.students.length} wanafunzi zimeandaliwa!`);
      } else {
        setError("Hakuna wanafunzi waliopatikana katika darasa hili.");
      }
      
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Imeshindwa kuandaa ripoti");
    } finally {
      setLoading(false);
    }
  };

  const getClassDisplayName = (className: string) => {
    const romanMap: { [key: string]: string } = {
      "Form 1": "Form I", "Form1": "Form I",
      "Form 2": "Form II", "Form2": "Form II",
      "Form 3": "Form III", "Form3": "Form III",
      "Form 4": "Form IV", "Form4": "Form IV",
      "Std 1": "Darasa la I", "Std1": "Darasa la I",
      "Std 2": "Darasa la II", "Std2": "Darasa la II",
      "Std 3": "Darasa la III", "Std3": "Darasa la III",
      "Std 4": "Darasa la IV", "Std4": "Darasa la IV",
      "Std 5": "Darasa la V", "Std5": "Darasa la V",
      "Std 6": "Darasa la VI", "Std6": "Darasa la VI",
      "Std 7": "Darasa la VII", "Std7": "Darasa la VII",
    };
    return romanMap[className] || className;
  };

  const hasHeadmasterName = headmasterName && headmasterName.trim() !== "";

  if (loadingClasses) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia madarasa...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <School className="h-10 w-10" />
                <div className="h-8 w-px bg-white/30" />
                <GraduationCap className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Ripoti za Maendeleo ya Darasa</h1>
              <p className="text-sky-100 max-w-2xl">
                Tengeneza ripoti kamili za kitaaluma kwa wanafunzi wote katika darasa.
                Kila mwanafunzi anapata ripoti ya kina kwenye ukurasa tofauti.
              </p>
              {schoolName && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Building className="h-4 w-4" />
                  {schoolName}
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn shadow-md">
              <CheckCircle className="h-5 w-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn shadow-md">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Form Card */}
          <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-600" />
                Mipangilio ya Ripoti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Class and Term Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-sky-600" />
                    Chagua Darasa
                  </Label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl">
                      <SelectValue placeholder="Chagua darasa" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {classes.length === 0 ? (
                        <SelectItem value="none" disabled>Hakuna madarasa</SelectItem>
                      ) : (
                        classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {getClassDisplayName(cls.name)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {classes.length === 0 && (
                    <p className="text-xs text-amber-600">Hakuna madarasa yaliyopatikana. Unda darasa kwanza.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-sky-600" />
                    Muhula wa Mwaka
                  </Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl">
                      <SelectValue placeholder="Chagua muhula" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="I">Muhula I (Midterm + Terminal)</SelectItem>
                      <SelectItem value="II">Muhula II (Midterm + Annual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SCHOOL CALENDAR */}
              <div className="bg-gradient-to-r from-gray-50 to-sky-50 rounded-xl p-5 border border-sky-100">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="p-1 bg-sky-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-sky-600" />
                    </div>
                    Kalenda ya Shule
                  </h3>
                  {loadingAnnouncement ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Inapakia tarehe...
                    </div>
                  ) : announcement ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      Tarehe zimechukuliwa
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Hakuna tarehe zilizowekwa
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-red-500" />
                      Tarehe ya Kufunga
                    </Label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={announcement?.closing_date ? formatDateDisplay(announcement.closing_date) : ""} 
                        className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium rounded-xl"
                        disabled={true}
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-emerald-500" />
                      Tarehe ya Kufungua
                    </Label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={announcement?.opening_date ? formatDateDisplay(announcement.opening_date) : ""} 
                        className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium rounded-xl"
                        disabled={true}
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TEACHER SECTION */}
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="p-1 bg-indigo-100 rounded-lg">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  Taarifa za Mwalimu wa Darasa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Jina Kamili</Label>
                    <Input 
                      type="text" 
                      value={teacherName} 
                      onChange={(e) => setTeacherName(e.target.value)} 
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                      placeholder="Weka jina kamili la mwalimu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Tarehe ya Sahihi</Label>
                    <Input 
                      type="date" 
                      value={teacherDate} 
                      onChange={(e) => setTeacherDate(e.target.value)} 
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 🔥 HEADMASTER SECTION - MWALIMU MKUU PEKEE! */}
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-5 border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="p-1 bg-purple-100 rounded-lg">
                    <Trophy className="h-4 w-4 text-purple-600" />
                  </div>
                  Taarifa za Mkuu wa Shule
                  {loadingHeadmaster ? (
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  ) : null}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Jina Kamili</Label>
                    <Input 
                      type="text" 
                      value={headmasterName} 
                      onChange={(e) => setHeadmasterName(e.target.value)} 
                      className={`bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl ${
                        hasHeadmasterName ? 'border-emerald-300 bg-emerald-50' : ''
                      }`}
                      placeholder="Weka jina kamili la Mkuu wa Shule (Mwalimu Mkuu)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Tarehe ya Sahihi</Label>
                    <Input 
                      type="date" 
                      value={headmasterDate} 
                      onChange={(e) => setHeadmasterDate(e.target.value)} 
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* DISTRICT SECTION */}
              <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-5 border border-emerald-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="p-1 bg-emerald-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  Taarifa za Wilaya
                  {loadingSchool ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  ) : null}
                </h3>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Jina la Wilaya</Label>
                  <Input 
                    type="text" 
                    value={districtName} 
                    onChange={(e) => setDistrictName(e.target.value)} 
                    className={`bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl ${
                      districtName ? 'border-emerald-300 bg-emerald-50' : ''
                    }`}
                    placeholder="Mfano: SINGIDA DC, MKALAMA, SINGIDA MANISPAA, N.K"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                {!pdfData ? (
                  <Button 
                    onClick={handleGeneratePDF} 
                    disabled={loading || !selectedClass || classes.length === 0} 
                    className="w-full md:w-auto bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-8 py-6 text-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                    {loading ? "Inaandaa Data..." : "Tengeneza Ripoti za Darasa"}
                  </Button>
                ) : (
                  <PDFDownloadLink
                    document={<PrimaryClassParentReportPDF data={pdfData} />}
                    fileName={`Ripoti_${getClassDisplayName(classes.find(c => c.id.toString() === selectedClass)?.name || "Darasa")}_Muhula${selectedTerm}.pdf`}
                    className="inline-flex w-full md:w-auto"
                  >
                    {({ loading: pdfLoading }) => (
                      <Button 
                        className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                        size="lg"
                        disabled={pdfLoading}
                      >
                        {pdfLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Download className="h-5 w-5" />
                        )}
                        {pdfLoading ? "Inatengeneza PDF..." : "Pakua Ripoti"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}
                
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <Printer className="h-3 w-3" />
                  PDF inajumuisha ukurasa kamili wa ripoti kwa kila mwanafunzi katika darasa lililochaguliwa
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}