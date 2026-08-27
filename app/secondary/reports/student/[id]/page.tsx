// app/reports/student/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ParentReportPDF } from '@/components/ParentReportPDF';
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
  ArrowLeft,
  GraduationCap,
  School,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Download,
  Building,
  Trophy,
  CalendarDays
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  roll_number: string;
  class_name: string;
  stream_name: string;
  sex: string;
  school_id: number;
}

interface SchoolData {
  id: number;
  name: string;
  district?: string;
  region?: string;
  school_level?: string;
}

interface SchoolAnnouncement {
  id: number;
  school_id: number;
  closing_date: string | null;
  opening_date: string | null;
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

export default function SingleStudentReportPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;
  
  const [token, setToken] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("I");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);
  
  // 🔥 DATA ZA SHULE
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);
  const [schoolName, setSchoolName] = useState("");
  
  // 🔥 ANNOUNCEMENT - TAREHE ZINAJAZA AUTOMATIC!
  const [announcement, setAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  
  // 🔥 HEADMASTER DATA
  const [headmasterData, setHeadmasterData] = useState<HeadmasterData | null>(null);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);
  
  // Tarehe - zinajaza AUTOMATIC kutoka announcement
  const [closingDate, setClosingDate] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [teacherDate, setTeacherDate] = useState(new Date().toISOString().split('T')[0]);
  const [headmasterDate, setHeadmasterDate] = useState(new Date().toISOString().split('T')[0]);
  const [teacherName, setTeacherName] = useState("");
  const [headmasterName, setHeadmasterName] = useState("");
  const [districtName, setDistrictName] = useState("");

  const API_BASE_URL = "";

  // ============================================================
  // 🔥 FORMAT DATE - KWA KUONYESHA (DD/MM/YYYY)
  // ============================================================
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

  // 🔥 FORMAT DATE KWA BACKEND (YYYY-MM-DD)
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
      console.log("🏫 Secondary: Fetching school data from: /api/v1/schools/" + schoolId);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/schools/${schoolId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("🏫 Secondary school data fetched:", data);
        
        setSchoolData(data);
        setSchoolName(data.name || "");
        
        // 🔥 DISTRICT INAJAZA AUTOMATIC!
        if (data.district && data.district.trim() !== "") {
          setDistrictName(data.district);
          console.log("📍 Secondary district loaded:", data.district);
        }
        
        // 🔥 FETCH ANNOUNCEMENT
        await fetchAnnouncement(authToken, schoolId);
        
        // 🔥 FETCH HEADMASTER
        await fetchHeadmaster(authToken, schoolId);
      } else {
        console.error("❌ Failed to fetch school data:", response.status);
        await fetchHeadmaster(authToken, schoolId);
      }
    } catch (err) {
      console.error("Error fetching school data:", err);
      await fetchHeadmaster(authToken, schoolId);
    } finally {
      setLoadingSchool(false);
    }
  };

  // ============================================================
  // 🔥 FETCH ANNOUNCEMENT - TAREHE ZINAJAZA AUTOMATIC!
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
        console.log("📅 Secondary announcement fetched:", data);
        setAnnouncement(data);
        
        // 🔥 SET TAREHE ZA KUFUNGA NA KUFUNGUA
        if (data.closing_date) {
          const closeDate = new Date(data.closing_date);
          if (!isNaN(closeDate.getTime())) {
            setClosingDate(closeDate.toISOString().split('T')[0]);
          }
        }
        if (data.opening_date) {
          const openDate = new Date(data.opening_date);
          if (!isNaN(openDate.getTime())) {
            setOpeningDate(openDate.toISOString().split('T')[0]);
          }
        }
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
  // 🔥 FETCH HEADMASTER - SECONDARY (Headmaster/Headmistress PEKEE!)
  // ============================================================
  const fetchHeadmaster = async (authToken: string, schoolId: string) => {
    try {
      setLoadingHeadmaster(true);
      console.log("👑 Secondary: Fetching headmaster from: /api/v1/schools/" + schoolId + "/headmaster");
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/schools/${schoolId}/headmaster`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("👑 Secondary headmaster data:", data);
        
        if (data && data.name) {
          setHeadmasterData(data);
          setHeadmasterName(data.name);
          console.log("✅ Secondary headmaster loaded:", data.name);
          return;
        }
      } else {
        console.log("⚠️ Secondary headmaster API returned:", response.status);
      }
      
      // 🔥 FALLBACK - TUMIA LOGGED-IN USER
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
        console.log("⚠️ Using logged-in user as headmaster (fallback):", userName);
      }
      
    } catch (err) {
      console.error("Error fetching secondary headmaster:", err);
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
      }
    } finally {
      setLoadingHeadmaster(false);
    }
  };

  // ============================================================
  // 🔥 FETCH STUDENT
  // ============================================================
  const fetchStudent = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/students/${studentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        
        // 🔥 FETCH SCHOOL DATA KWA KUTUMIA SCHOOL_ID YA MWANAFUNZI
        if (data.school_id) {
          await fetchSchoolData(authToken, data.school_id.toString());
        }
      } else {
        setError("Student not found");
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userName = localStorage.getItem("user_name") || "";
    const userRole = localStorage.getItem("user_type") || "";
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setTeacherName(userName);
    
    if (userRole?.toLowerCase() === "headmaster" || userRole?.toLowerCase() === "headmistress") {
      setHeadmasterName(userName);
    }
    
    fetchStudent(storedToken);
  }, [router, studentId]);

  // ============================================================
  // 🔥 GENERATE PDF
  // ============================================================
  const handleGeneratePDF = async () => {
    setGenerating(true);
    setError("");
    setPdfData(null);

    try {
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

      const url = `${API_BASE_URL}/api/v1/student/${studentId}/parent-report-data?${params.toString()}`;
      
      console.log("Fetching URL:", url);
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPdfData(data);
      setSuccess("Report data loaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Loading student data...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !student) {
    return (
      <MainLayout>
        <div className="p-6">
          <Card className="border-red-500 bg-red-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <p className="font-semibold">{error || "Student not found"}</p>
              </div>
              <Button className="mt-4" onClick={() => router.push("/reports")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // 🔥 FORMAT TAREHE KWA KUONYESHA
  const displayClosingDate = announcement?.closing_date ? formatDateDisplay(announcement.closing_date) : "";
  const displayOpeningDate = announcement?.opening_date ? formatDateDisplay(announcement.opening_date) : "";

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/reports")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Parent Report</h1>
            <p className="text-blue-100">
              Generate comprehensive parent report for <span className="font-semibold">{student.name}</span>
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
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Student Information Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Student Name</p>
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  {student.name}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Roll Number</p>
                <p className="font-semibold text-gray-800 font-mono">{student.roll_number || "-"}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Class</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <School className="h-3.5 w-3.5 text-gray-400" />
                  {student.class_name || "-"}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Stream</p>
                <p className="font-semibold text-gray-800">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                    {student.stream_name || "-"}
                  </span>
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Sex</p>
                <p className="font-semibold text-gray-800">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    student.sex === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                  }`}>
                    {student.sex === "M" ? "Male" : "Female"}
                  </span>
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Student ID</p>
                <p className="font-semibold text-gray-800 font-mono">{student.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Options Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Report Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Term Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  Muhula (Term)
                </Label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="I">MUHULA WA I (MIDTERM3 + TERMINAL)</SelectItem>
                    <SelectItem value="II">MUHULA WA II (MIDTERM9 + ANNUAL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* A. School Closure Dates - INAJAZA AUTOMATIC! */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-sky-600" />
                A. School Closure Dates
                {loadingAnnouncement ? (
                  <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                ) : announcement ? (
                  <span className="text-sm font-normal text-emerald-600 flex items-center gap-1 ml-2">
                    <CheckCircle className="h-3 w-3" />
                    Auto-loaded
                  </span>
                ) : null}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Closing Date</Label>
                  <Input 
                    type="text" 
                    value={displayClosingDate} 
                    className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium"
                    disabled={true}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Reopening Date</Label>
                  <Input 
                    type="text" 
                    value={displayOpeningDate} 
                    className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium"
                    disabled={true}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>
            </div>

            {/* B. Teacher Signature */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                B. Class Teacher
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Teacher Full Name</Label>
                  <Input 
                    type="text" 
                    value={teacherName} 
                    onChange={(e) => setTeacherName(e.target.value)} 
                    className="bg-white border-gray-200"
                    placeholder="Enter teacher name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Signature Date</Label>
                  <Input 
                    type="date" 
                    value={teacherDate} 
                    onChange={(e) => setTeacherDate(e.target.value)} 
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* C. Headmaster Signature - INAJAZA AUTOMATIC! */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-600" />
                C. Head of School
                {loadingHeadmaster ? (
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                ) : headmasterName ? (
                  <span className="text-sm font-normal text-emerald-600 flex items-center gap-1 ml-2">
                    <CheckCircle className="h-3 w-3" />
                    Auto-loaded
                  </span>
                ) : null}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Headmaster Full Name</Label>
                  <Input 
                    type="text" 
                    value={headmasterName} 
                    onChange={(e) => setHeadmasterName(e.target.value)} 
                    className={`bg-white border-gray-200 ${
                      headmasterName ? 'border-emerald-300 bg-emerald-50' : ''
                    }`}
                    placeholder="Enter headmaster name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Signature Date</Label>
                  <Input 
                    type="date" 
                    value={headmasterDate} 
                    onChange={(e) => setHeadmasterDate(e.target.value)} 
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* D. District Name - INAJAZA AUTOMATIC! */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                D. District Name
                {loadingSchool ? (
                  <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                ) : districtName ? (
                  <span className="text-sm font-normal text-emerald-600 flex items-center gap-1 ml-2">
                    <CheckCircle className="h-3 w-3" />
                    Auto-loaded
                  </span>
                ) : null}
              </h3>
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">District / Region Name</Label>
                <Input 
                  type="text" 
                  value={districtName} 
                  onChange={(e) => setDistrictName(e.target.value)} 
                  className={`bg-white border-gray-200 ${
                    districtName ? 'border-emerald-300 bg-emerald-50' : ''
                  }`}
                  placeholder="e.g., KINONDONI, TEMEKE, ILALA, MBEYA"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t">
              {!pdfData ? (
                <Button 
                  onClick={handleGeneratePDF} 
                  disabled={generating} 
                  className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                  {generating ? "Preparing Data..." : "Generate Parent Report"}
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <PDFDownloadLink
                    document={<ParentReportPDF data={pdfData} />}
                    fileName={`Parent_Report_${student.name}_Term${selectedTerm}.pdf`}
                    className="inline-flex"
                  >
                    {({ loading }) => (
                      <Button 
                        className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                        {loading ? "Generating PDF..." : "Download Parent Report"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setPdfData(null)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    size="lg"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Change Options
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">📋 Parent Report Structure</h3>
                <p className="text-sm text-gray-600">
                  The report includes 13 columns: Subjects, Test Score, Grade, Exam Score, Grade, Total, Average, Grade, Position, Code, Behaviour, Grade
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </MainLayout>
  );
}