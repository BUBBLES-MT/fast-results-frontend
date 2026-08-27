// app/reports/parent-report-class/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ClassParentReportPDF } from '@/components/ClassParentReportPDF';
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

interface ClassTeacher {
  id: number;
  name: string;
  role: string;
}

export default function ParentReportClassPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("I");
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState("");
  const [pdfData, setPdfData] = useState<any>(null);
  
  const [announcement, setAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);
  
  const [headmasterData, setHeadmasterData] = useState<HeadmasterData | null>(null);
  const [loadingHeadmaster, setLoadingHeadmaster] = useState(false);
  
  const [classTeacher, setClassTeacher] = useState<ClassTeacher | null>(null);
  const [loadingClassTeacher, setLoadingClassTeacher] = useState(false);
  
  const [teacherDate, setTeacherDate] = useState(new Date().toISOString().split('T')[0]);
  const [headmasterDate, setHeadmasterDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [teacherName, setTeacherName] = useState("");
  const [headmasterName, setHeadmasterName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const API_BASE_URL = "";

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
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/schools/${schoolId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSchoolData(data);
        setSchoolName(data.name || "");
        
        if (data.district && data.district.trim() !== "") {
          setDistrictName(data.district);
        }
        
        await fetchHeadmaster(authToken, schoolId);
      } else {
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
  // 🔥 FETCH HEADMASTER
  // ============================================================
  const fetchHeadmaster = async (authToken: string, schoolId: string) => {
    try {
      setLoadingHeadmaster(true);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/schools/${schoolId}/headmaster`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.name) {
          setHeadmasterData(data);
          setHeadmasterName(data.name);
          return;
        }
      }
      
      // 🔥 FALLBACK - TUMIA LOGGED-IN USER
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
      }
      
    } catch (err) {
      console.error("Error fetching headmaster:", err);
      const userName = localStorage.getItem("user_name") || "";
      if (userName) {
        setHeadmasterName(userName);
      }
    } finally {
      setLoadingHeadmaster(false);
    }
  };

  // ============================================================
  // 🔥 FETCH CLASS TEACHER
  // ============================================================
  const fetchClassTeacher = async (authToken: string, classId: string) => {
    try {
      setLoadingClassTeacher(true);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/classes/${classId}/teacher`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.name) {
          setClassTeacher(data);
          setTeacherName(data.name);
        } else {
          const userName = localStorage.getItem("user_name") || "";
          if (userName) setTeacherName(userName);
        }
      } else {
        const userName = localStorage.getItem("user_name") || "";
        if (userName) setTeacherName(userName);
      }
    } catch (err) {
      console.error("Error fetching class teacher:", err);
      const userName = localStorage.getItem("user_name") || "";
      if (userName) setTeacherName(userName);
    } finally {
      setLoadingClassTeacher(false);
    }
  };

  // ============================================================
  // 🔥 USEFFECT
  // ============================================================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userName = localStorage.getItem("user_name") || "";
    const userRole = localStorage.getItem("user_type") || "";
    const schoolId = localStorage.getItem("school_id") || "";
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    
    setTeacherName(userName);
    
    if (userRole?.toLowerCase() === "headmaster" || userRole?.toLowerCase() === "headmistress") {
      setHeadmasterName(userName);
    }
    
    fetchClasses(storedToken);
    
    if (schoolId) {
      fetchSchoolData(storedToken, schoolId);
      fetchAnnouncement(storedToken, schoolId);
    }
  }, [router]);

  // ============================================================
  // 🔥 FETCH CLASSES
  // ============================================================
  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/classes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        if (data.length > 0) {
          const firstClassId = data[0].id.toString();
          setSelectedClass(firstClassId);
          fetchClassTeacher(authToken, firstClassId);
        }
      } else {
        setError(`Failed to fetch classes: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Cannot connect to server. Please ensure backend is running.");
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
        setAnnouncement(data);
      } else {
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
  // 🔥 HANDLE CLASS CHANGE
  // ============================================================
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    if (token && classId) {
      fetchClassTeacher(token, classId);
    }
  };

  // ============================================================
  // 🔥 GENERATE PDF
  // ============================================================
  const handleGeneratePDF = async () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    setLoading(true);
    setError("");
    setPdfData(null);

    try {
      const closingDate = announcement?.closing_date ? formatDateForBackend(announcement.closing_date) : "";
      const openingDate = announcement?.opening_date ? formatDateForBackend(announcement.opening_date) : "";

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

      const url = `${API_BASE_URL}/api/v1/class/${selectedClass}/parent-reports-pdf?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPdfData(data);
      
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
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
    };
    return romanMap[className] || className;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <School className="h-10 w-10" />
                <div className="h-8 w-px bg-white/30" />
                <GraduationCap className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Class Progress Reports</h1>
              <p className="text-blue-100 max-w-2xl">
                Generate comprehensive academic reports for all students in a class. 
                Each student receives a detailed report on a separate page.
              </p>
              {schoolName && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Building className="h-4 w-4" />
                  {schoolName}
                </div>
              )}
            </div>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50 shadow-md">
              <CardContent className="pt-6">
                <p className="text-red-600 font-medium">⚠️ {error}</p>
                <p className="text-sm text-red-500 mt-2">Please verify backend connection on port 8000</p>
              </CardContent>
            </Card>
          )}

          {/* Main Form Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Class and Term Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    Select Class
                  </Label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Choose a class" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {getClassDisplayName(cls.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    Academic Term
                  </Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Choose term" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="I">Term I (Midterm + Terminal)</SelectItem>
                      <SelectItem value="II">Term II (Midterm + Annual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SCHOOL CALENDAR */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    School Calendar
                  </h3>
                  {loadingAnnouncement ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading dates...
                    </div>
                  ) : announcement ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      Dates loaded
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      No dates set
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-red-500" />
                      Closing Date
                    </Label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={announcement?.closing_date ? formatDateDisplay(announcement.closing_date) : ""} 
                        className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium"
                        disabled={true}
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-emerald-500" />
                      Reopening Date
                    </Label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={announcement?.opening_date ? formatDateDisplay(announcement.opening_date) : ""} 
                        className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-700 font-medium"
                        disabled={true}
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 TEACHER SECTION */}
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="p-1 bg-indigo-100 rounded-lg">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  Class Teacher Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Full Name</Label>
                    <Input 
                      type="text" 
                      value={teacherName} 
                      onChange={(e) => setTeacherName(e.target.value)} 
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter teacher's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Signature Date</Label>
                    <Input 
                      type="date" 
                      value={teacherDate} 
                      onChange={(e) => setTeacherDate(e.target.value)} 
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 🔥 HEADMASTER SECTION */}
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-5 border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="p-1 bg-purple-100 rounded-lg">
                    <Trophy className="h-4 w-4 text-purple-600" />
                  </div>
                  Head of School Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Full Name</Label>
                    <Input 
                      type="text" 
                      value={headmasterName} 
                      onChange={(e) => setHeadmasterName(e.target.value)} 
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter headmaster's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Signature Date</Label>
                    <Input 
                      type="date" 
                      value={headmasterDate} 
                      onChange={(e) => setHeadmasterDate(e.target.value)} 
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* 🔥 DISTRICT SECTION */}
              <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-5 border border-emerald-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="p-1 bg-emerald-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  District Information
                </h3>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">District Name</Label>
                  <Input 
                    type="text" 
                    value={districtName} 
                    onChange={(e) => setDistrictName(e.target.value)} 
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., SINGIDA DC, MKALAMA, SINGIDA MANISPAA, N.K"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                {!pdfData ? (
                  <Button 
                    onClick={handleGeneratePDF} 
                    disabled={loading || !selectedClass} 
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                    {loading ? "Preparing Data..." : "Generate Class Reports"}
                  </Button>
                ) : (
                  <PDFDownloadLink
                    document={<ClassParentReportPDF data={pdfData} />}
                    fileName={`Parent_Reports_${getClassDisplayName(selectedClass)}_Term${selectedTerm}.pdf`}
                    className="inline-flex w-full md:w-auto"
                  >
                    {({ loading: pdfLoading }) => (
                      <Button 
                        className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                        disabled={pdfLoading}
                      >
                        {pdfLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Download className="h-5 w-5" />
                        )}
                        {pdfLoading ? "Generating PDF..." : "Download Reports"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}
                
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <Printer className="h-3 w-3" />
                  The PDF includes a complete report page for each student in the selected class
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}