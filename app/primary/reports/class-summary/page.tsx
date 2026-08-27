// app/primary/reports/class-summary/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Download, 
  FileText, 
  Printer, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Users,
  Award,
  School,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

// ================================
// 🔥 INTERFACES - PRIMARY PEKEE!
// ================================

interface SchoolClass {
  id: number;
  name: string;
  school_id: number;
}

interface SubjectGradeSummary {
  subject: string;
  grades: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
  position?: number;  // 🔥 NAFASI YA SOMO
  gpa?: number;       // 🔥 GPA (kwa mahesabu tu, haionyeshwi)
}

interface SummaryData {
  school_name: string;
  region: string;
  class_name: string;
  exam_type: string;
  year: number;
  division_summary: {
    A: { M: number; F: number };
    B: { M: number; F: number };
    C: { M: number; F: number };
    D: { M: number; F: number };
    E: { M: number; F: number };
    total_male: number;
    total_female: number;
    total_students: number;
  };
  registration_summary: {
    male_reg: number;
    female_reg: number;
    total_reg: number;
  };
  results: Array<{
    student_id: number;
    exam_no: string;
    name: string;
    sex: string;
    subjects: (number | string)[];
    total: number;
    average: number;
    grade: string;
    position: number;
  }>;
  subject_names: string[];
  subject_grade_summary: SubjectGradeSummary[];
}

// 🔥 PRIMARY EXAM TYPES
const AINA_ZAMTIHANI_CHAGUO = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL"];

// 🔥 PRIMARY CLASSES - DARASA LA 1 HADI 7
const DARASA_ZA_MSINGI = [
  { id: 1, name: "Darasa la I" },
  { id: 2, name: "Darasa la II" },
  { id: 3, name: "Darasa la III" },
  { id: 4, name: "Darasa la IV" },
  { id: 5, name: "Darasa la V" },
  { id: 6, name: "Darasa la VI" },
  { id: 7, name: "Darasa la VII" },
];

export default function MuhtasariWaMatokeoYaDarasaPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userSchoolId, setUserSchoolId] = useState<number>(4);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [examTypes, setExamTypes] = useState<string[]>(AINA_ZAMTIHANI_CHAGUO);
  const [region, setRegion] = useState("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingExamTypes, setLoadingExamTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // ================================
  // 🔥 USE EFFECT - INIT
  // ================================

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    // 🔥 PRIMARY ROLES
    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"];
    const userRoleLower = (role || "").toLowerCase();
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/primary/dashboard");
      return;
    }
    
    setToken(storedToken);
    setUserSchoolId(schoolId ? parseInt(schoolId) : 4);
    fetchClasses(storedToken);
    fetchExamTypes(storedToken);
  }, [router]);

  // ================================
  // 🔥 FETCH CLASSES - PRIMARY (DARASA 1-7)
  // ================================

  const fetchClasses = async (authToken: string) => {
    setLoadingClasses(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/classes`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // 🔥 FILTER - TUONYESHE DARASA LA 1 HADI 7 PEKEE
        const primaryClasses = data.filter((cls: SchoolClass) => {
          const name = cls.name.toLowerCase();
          return name.includes("std") || 
                 name.includes("darasa") ||
                 name.includes("standard") ||
                 name.match(/[1-7]/);
        });
        setClasses(primaryClasses);
        if (primaryClasses && primaryClasses.length > 0) {
          setSelectedClass(primaryClasses[0].id.toString());
        } else {
          setError("Hakuna madarasa ya msingi (1-7) yaliyopatikana");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Imeshindwa kupata madarasa: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Tatizo la mtandao wakati wa kupata madarasa");
    } finally {
      setLoadingClasses(false);
    }
  };

  // ================================
  // 🔥 FETCH EXAM TYPES
  // ================================

  const fetchExamTypes = async (authToken: string) => {
    setLoadingExamTypes(true);
    setError(null);
    try {
      const schoolId = localStorage.getItem("school_id") || "4";
      const url = `${API_BASE_URL}/api/v1/primary/marks/exam-types?school_id=${schoolId}`;
      
      console.log("📤 Fetching exam types:", url);
      
      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const types = data.exam_types || AINA_ZAMTIHANI_CHAGUO;
        setExamTypes(types);
        if (types.length > 0 && !selectedExamType) {
          setSelectedExamType(types[0]);
        }
        console.log("📋 Primary exam types loaded:", types);
      } else {
        console.warn("⚠️ Using default exam types");
        setExamTypes(AINA_ZAMTIHANI_CHAGUO);
        setSelectedExamType(AINA_ZAMTIHANI_CHAGUO[0]);
      }
    } catch (err) {
      console.error("Error fetching exam types:", err);
      setExamTypes(AINA_ZAMTIHANI_CHAGUO);
      setSelectedExamType(AINA_ZAMTIHANI_CHAGUO[0]);
    } finally {
      setLoadingExamTypes(false);
    }
  };

  // ================================
  // 🔥 CALCULATE SUBJECT POSITIONS (NAFASI YA SOMO)
  // ================================

  const calculateSubjectPositions = (subjectGradeSummary: SubjectGradeSummary[]): SubjectGradeSummary[] => {
    // 🔥 Hesabu GPA kwa kila somo
    const gradePoints: { [key: string]: number } = { A: 1, B: 2, C: 3, D: 4, E: 5 };
    
    const withGPA = subjectGradeSummary.map((item) => {
      const grades = item.grades;
      const totalStudents = grades.A + grades.B + grades.C + grades.D + grades.E;
      
      let totalPoints = 0;
      totalPoints += grades.A * gradePoints.A;
      totalPoints += grades.B * gradePoints.B;
      totalPoints += grades.C * gradePoints.C;
      totalPoints += grades.D * gradePoints.D;
      totalPoints += grades.E * gradePoints.E;
      
      const gpa = totalStudents > 0 ? totalPoints / totalStudents : 0;
      
      return {
        ...item,
        gpa: parseFloat(gpa.toFixed(3)),
        position: 0
      };
    });
    
    // 🔥 SORT BY GPA (NDOGO ZAIDI = NAFASI YA KWANZA)
    const sorted = [...withGPA].sort((a, b) => (a.gpa || 0) - (b.gpa || 0));
    sorted.forEach((item, idx) => {
      item.position = idx + 1;
    });
    
    return sorted;
  };

  // ================================
  // 🔥 LOAD SUMMARY - PRIMARY
  // ================================

  const loadSummary = async () => {
    if (!selectedClass) {
      alert("Tafadhali chagua darasa");
      return;
    }
    if (!selectedExamType) {
      alert("Tafadhali chagua aina ya mtihani");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      let url = `${API_BASE_URL}/api/v1/primary/marks/class/${selectedClass}/summary-view?exam_type=${selectedExamType}`;
      if (region && region.trim() !== "") {
        url += `&region=${encodeURIComponent(region)}`;
      }
      
      console.log("📤 Fetching primary summary:", url);
      
      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("📊 Primary summary data:", data);
        
        // 🔥 CALCULATE SUBJECT POSITIONS
        let subjectGradeSummary = data.subject_grade_summary || [];
        if (subjectGradeSummary.length > 0) {
          subjectGradeSummary = calculateSubjectPositions(subjectGradeSummary);
        }
        
        // 🔥 TRANSFORM DATA - PRIMARY FORMAT
        const transformedData: SummaryData = {
          school_name: data.school_name || "SHULE YA MSINGI",
          region: data.region || "_________________________",
          class_name: data.class_name || "Darasa",
          exam_type: data.exam_type || selectedExamType,
          year: data.year || new Date().getFullYear(),
          division_summary: {
            A: data.division_summary?.A || { M: 0, F: 0 },
            B: data.division_summary?.B || { M: 0, F: 0 },
            C: data.division_summary?.C || { M: 0, F: 0 },
            D: data.division_summary?.D || { M: 0, F: 0 },
            E: data.division_summary?.E || { M: 0, F: 0 },
            total_male: data.division_summary?.total_male || 0,
            total_female: data.division_summary?.total_female || 0,
            total_students: data.division_summary?.total_students || 0
          },
          registration_summary: {
            male_reg: data.registration_summary?.male_reg || 0,
            female_reg: data.registration_summary?.female_reg || 0,
            total_reg: data.registration_summary?.total_reg || 0
          },
          results: data.results || [],
          subject_names: data.subject_names || [],
          subject_grade_summary: subjectGradeSummary
        };
        
        setSummaryData(transformedData);
        setSuccess(`✅ Matokeo ya ${data.results?.length || 0} wanafunzi yamepakiwa!`);
        console.log("📊 Primary summary loaded:", transformedData);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Imeshindwa kupakia data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error loading summary:", err);
      setError("Tatizo la mtandao wakati wa kupakia muhtasari");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 🔥 DOWNLOAD EXCEL - PRIMARY
  // ================================

  const downloadExcel = async () => {
    if (!selectedClass) {
      alert("Tafadhali chagua darasa");
      return;
    }
    if (!selectedExamType) {
      alert("Tafadhali chagua aina ya mtihani");
      return;
    }
    
    setError(null);
    
    try {
      let url = `${API_BASE_URL}/api/v1/primary/marks/class/${selectedClass}/export-excel?exam_type=${selectedExamType}`;
      if (region && region.trim() !== "") {
        url += `&region=${encodeURIComponent(region)}`;
      }
      
      console.log("📤 Downloading Excel:", url);
      
      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kupakua Excel");
      }
      
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      const className = summaryData?.class_name || "Darasa";
      a.download = `${className}_${selectedExamType}_Matokeo_Primary.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlBlob);
      
      setSuccess("✅ Faili ya Excel imepakuliwa kikamilifu!");
    } catch (err: any) {
      console.error("Error downloading Excel:", err);
      setError(err.message || "Imeshindwa kupakua faili ya Excel");
    }
  };

  // ================================
  // 🔥 HELPERS
  // ================================

  const handlePrint = () => {
    window.print();
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-100 text-emerald-800 font-bold";
      case "B": return "bg-blue-100 text-blue-800";
      case "C": return "bg-amber-100 text-amber-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "E": return "bg-red-100 text-red-800";
      default: return "";
    }
  };

  const getClassDisplayName = (className: string) => {
    // 🔥 PRIMARY - DARASA LA 1 HADI 7
    const primaryMap: { [key: string]: string } = {
      "Std 1": "Darasa la I",
      "Std1": "Darasa la I",
      "Standard 1": "Darasa la I",
      "Std 2": "Darasa la II",
      "Std2": "Darasa la II",
      "Standard 2": "Darasa la II",
      "Std 3": "Darasa la III",
      "Std3": "Darasa la III",
      "Standard 3": "Darasa la III",
      "Std 4": "Darasa la IV",
      "Std4": "Darasa la IV",
      "Standard 4": "Darasa la IV",
      "Std 5": "Darasa la V",
      "Std5": "Darasa la V",
      "Standard 5": "Darasa la V",
      "Std 6": "Darasa la VI",
      "Std6": "Darasa la VI",
      "Standard 6": "Darasa la VI",
      "Std 7": "Darasa la VII",
      "Std7": "Darasa la VII",
      "Standard 7": "Darasa la VII",
    };
    return primaryMap[className] || className;
  };

  const refreshData = async () => {
    await Promise.all([
      fetchClasses(token),
      fetchExamTypes(token)
    ]);
    if (selectedClass && selectedExamType) {
      await loadSummary();
    }
  };

  // ================================
  // 🔥 LOADING STATE
  // ================================

  if (loadingClasses || loadingExamTypes) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia data ya Primary...</p>
        </div>
      </MainLayout>
    );
  }

  // ================================
  // 🔥 MAIN RENDER
  // ================================

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <School className="h-8 w-8" />
                  <div className="h-6 w-px bg-white/30" />
                  <Award className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold">Muhtasari wa Matokeo ya Darasa</h1>
                <p className="text-sky-100 mt-1">
                  Tazama, chapisha na pakua ripoti kamili ya utendaji wa darasa
                  <span className="block text-sm mt-1 text-sky-200">
                    🏫 Shule ya Msingi (Darasa la I - VII) | ID: {userSchoolId}
                  </span>
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshData}
                className="text-white hover:bg-white/20 rounded-xl transition-all"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Fresh
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn shadow-md">
              <CheckCircle className="h-5 w-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Filters Card */}
          <Card className="shadow-lg border-0 overflow-hidden no-print">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-sky-600" />
                    Chagua Darasa
                  </Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500">
                      <SelectValue placeholder={classes.length === 0 ? "Hakuna madarasa" : "Chagua darasa"} />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.length === 0 ? (
                        <SelectItem value="none" disabled>Hakuna madarasa (I-VII)</SelectItem>
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
                    <p className="text-xs text-amber-600">Hakuna madarasa ya msingi (I-VII)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    Aina ya Mtihani
                  </Label>
                  <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Chagua aina ya mtihani" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    Wilaya / Mkoa
                  </Label>
                  <Input
                    type="text"
                    placeholder="Mfano: Singida, Mbeya"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button 
                    onClick={loadSummary} 
                    disabled={loading || classes.length === 0}
                    className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {loading ? "Inapakia..." : "Onesha Matokeo"}
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {summaryData && !loading && (
            <div className="flex justify-end gap-3 no-print">
              <Button variant="outline" onClick={handlePrint} className="gap-2 rounded-xl border-sky-300 text-sky-700 hover:bg-sky-50">
                <Printer className="h-4 w-4" /> Chapisha Ripoti
              </Button>
              <Button 
                onClick={downloadExcel} 
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Download className="h-4 w-4" /> Pakua Excel
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-4" />
                <p className="text-gray-500">Inapakia matokeo ya darasa...</p>
              </CardContent>
            </Card>
          )}

          {/* Results Display */}
          {summaryData && !loading && (
            <div id="print-content" className="space-y-6">
              {/* School Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">JAMHURI YA MUUNGANO WA TANZANIA</h2>
                <h3 className="text-lg text-gray-700">OFISI YA RAIS</h3>
                <h3 className="text-lg text-gray-700">TAWALA ZA MIKOA NA SERIKALI ZA MITAA</h3>
                <h3 className="text-lg font-bold text-sky-700 mt-1">{summaryData.region || "WILAYA"}</h3>
                <h3 className="text-xl font-bold text-gray-800 mt-3">{summaryData.class_name} MATOKEO YA {summaryData.exam_type} {summaryData.year}</h3>
                <h3 className="text-lg font-bold text-gray-800">{summaryData.school_name}</h3>
              </div>

              {/* Grade Summary - PRIMARY A-E */}
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="h-4 w-4 text-sky-600" />
                    Muhtasari wa Madaraja (A-E)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {["A", "B", "C", "D", "E"].map((grade) => {
                      const data = summaryData.division_summary?.[grade as keyof typeof summaryData.division_summary];
                      const total = data ? data.M + data.F : 0;
                      return (
                        <div key={grade} className="bg-gray-50 rounded-lg p-2 border">
                          <div className="text-2xl font-bold text-gray-800">
                            {total}
                          </div>
                          <div className={`text-sm font-semibold ${getGradeColor(grade)} px-2 py-0.5 rounded-full inline-block`}>
                            Daraja {grade}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Wav: {data?.M || 0} | Was: {data?.F || 0}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-center text-sm text-gray-600">
                    Jumla ya Wanafunzi: {summaryData.registration_summary?.total_reg || 0}
                  </div>
                </CardContent>
              </Card>

              {/* Registration Summary */}
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-emerald-600" />
                    Muhtasari wa Usajili
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="text-2xl font-bold text-blue-700">
                        {summaryData.registration_summary?.male_reg || 0}
                      </div>
                      <div className="text-sm text-gray-600">Wavulana</div>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                      <div className="text-2xl font-bold text-pink-700">
                        {summaryData.registration_summary?.female_reg || 0}
                      </div>
                      <div className="text-sm text-gray-600">Wasichana</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                      <div className="text-2xl font-bold text-purple-700">
                        {summaryData.registration_summary?.total_reg || 0}
                      </div>
                      <div className="text-sm text-gray-600">Jumla</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Results Table */}
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50 py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-cyan-600" />
                    Matokeo ya Wanafunzi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 w-12">#</th>
                        <th className="border p-2">N. MTIHANI</th>
                        <th className="border p-2 text-left">JINA LA MWANAFUNZI</th>
                        <th className="border p-2 w-12">JINSIA</th>
                        {summaryData.subject_names.map((sub) => (
                          <th key={sub} className="border p-2 text-center min-w-[60px]">{sub}</th>
                        ))}
                        <th className="border p-2">JUMLA</th>
                        <th className="border p-2">WASTANI</th>
                        <th className="border p-2">DAR.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.results.map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                          <td className="border p-2 text-center font-bold">{student.position}</td>
                          <td className="border p-2 text-center font-mono">{student.exam_no}</td>
                          <td className="border p-2 font-medium">{student.name}</td>
                          <td className="border p-2 text-center">{student.sex}</td>
                          {student.subjects.map((score, i) => (
                            <td key={i} className="border p-2 text-center">{score !== "" && score !== null ? score : "-"}</td>
                          ))}
                          <td className="border p-2 text-center font-semibold">{student.total}</td>
                          <td className="border p-2 text-center">{student.average}</td>
                          <td className="border p-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* 🔥 SUBJECT GRADE SUMMARY - PRIMARY (NA NAFASI YA SOMO!) */}
              {summaryData.subject_grade_summary && summaryData.subject_grade_summary.length > 0 && (
                <Card className="shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Muhtasari wa Madaraja ya Masomo (A-E)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Daraja</th>
                          <th className="border p-2 text-center">Jumla</th>
                          {summaryData.subject_names.map((subject) => (
                            <th key={subject} className="border p-2 text-center min-w-[70px]">{subject}</th>
                          ))}
                          <th className="border p-2 text-center">NAFASI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {["A", "B", "C", "D", "E"].map((grade) => {
                          const total = summaryData.subject_grade_summary.reduce((sum, subj) => {
                            return sum + (subj.grades[grade as keyof typeof subj.grades] || 0);
                          }, 0);
                          
                          return (
                            <tr key={grade} className={getGradeColor(grade).replace('font-bold', '').trim()}>
                              <td className="border p-2 text-center font-bold">{grade}</td>
                              <td className="border p-2 text-center font-bold">{total}</td>
                              {summaryData.subject_grade_summary.map((subj) => (
                                <td key={subj.subject} className="border p-2 text-center">
                                  {subj.grades[grade as keyof typeof subj.grades] || 0}
                                </td>
                              ))}
                              <td className="border p-2 text-center">-</td>
                            </tr>
                          );
                        })}
                        {/* 🔥 ROW YA NAFASI (POSITION) */}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan={2} className="border p-2 text-center">NAFASI</td>
                          {summaryData.subject_grade_summary.map((subj) => (
                            <td key={subj.subject} className="border p-2 text-center">
                              {subj.position || "-"}
                            </td>
                          ))}
                          <td className="border p-2 text-center"></td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* No Data State */}
          {!summaryData && !loading && !error && (
            <Card className="shadow-md">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Hakuna matokeo ya kuonyesha.</p>
                <p className="text-sm text-gray-400 mt-2">Chagua darasa na aina ya mtihani, kisha bonyeza "Onesha Matokeo"</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          #print-content {
            margin: 0;
            padding: 0;
          }
          .shadow-md, .shadow-lg, .shadow-xl {
            box-shadow: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
        }
      `}</style>
    </MainLayout>
  );
}