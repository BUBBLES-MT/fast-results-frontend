// app/reports/class-summary/page.tsx

"use client";

import React, { useState, useEffect, Fragment } from "react";
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
  AlertCircle
} from "lucide-react";

interface SchoolClass {
  id: number;
  name: string;
}

interface GradeData {
  M: number;
  F: number;
  Total: number;
}

interface SubjectGradeData {
  subject: string;
  A: GradeData;
  B: GradeData;
  C: GradeData;
  D: GradeData;
  F: GradeData;
  GPA: number;
  position: number;
}

interface DivisionData {
  M: number;
  F: number;
}

interface SummaryData {
  school_name: string;
  region: string;
  class_name: string;
  exam_type: string;
  year: number;
  division_summary: {
    I: DivisionData;
    II: DivisionData;
    III: DivisionData;
    IV: DivisionData;
    O: DivisionData;
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
    points: number;
    division: string;
    position: number;
  }>;
  subject_names: string[];
  subject_grade_summary: Array<{
    subject: string;
    grades: { A: number; B: number; C: number; D: number; F: number };
  }>;
  subject_gpa_data: SubjectGradeData[];
}

const DEFAULT_EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

export default function ClassSummaryPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [examTypes, setExamTypes] = useState<string[]>(DEFAULT_EXAM_TYPES);
  const [region, setRegion] = useState("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingExamTypes, setLoadingExamTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchClasses(storedToken);
    fetchExamTypes(storedToken);
  }, [router]);

  const fetchClasses = async (authToken: string) => {
    setLoadingClasses(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/classes", {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        if (data && data.length > 0) {
          setSelectedClass(data[0].id.toString());
        } else {
          setError("No classes found for your school");
        }
      } else {
        setError(`Failed to fetch classes: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Network error while fetching classes");
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchExamTypes = async (authToken: string) => {
    setLoadingExamTypes(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/exam-types", {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const types = data.exam_types || DEFAULT_EXAM_TYPES;
        setExamTypes(types);
        if (types.length > 0 && !selectedExamType) {
          setSelectedExamType(types[0]);
        }
      } else {
        setExamTypes(DEFAULT_EXAM_TYPES);
        setSelectedExamType(DEFAULT_EXAM_TYPES[0]);
      }
    } catch (err) {
      console.error("Error fetching exam types:", err);
      setExamTypes(DEFAULT_EXAM_TYPES);
      setSelectedExamType(DEFAULT_EXAM_TYPES[0]);
    } finally {
      setLoadingExamTypes(false);
    }
  };

  // 🔥 Type-safe helper function
  const getDivisionValue = (data: DivisionData | undefined | null, key: keyof DivisionData): number => {
    if (!data) return 0;
    return data[key] || 0;
  };

  const getDivisionTotal = (data: DivisionData | undefined | null): number => {
    if (!data) return 0;
    return (data.M || 0) + (data.F || 0);
  };

  const calculateSubjectGPA = (subjectGradeSummary: any[]): SubjectGradeData[] => {
    const gradePoints: { [key: string]: number } = { 
      A: 1, B: 2, C: 3, D: 4, F: 5
    };
    
    const subjectGPAData: SubjectGradeData[] = subjectGradeSummary.map((item) => {
      const grades = item.grades;
      const totalStudents = grades.A + grades.B + grades.C + grades.D + grades.F;
      
      let totalPoints = 0;
      totalPoints += grades.A * gradePoints.A;
      totalPoints += grades.B * gradePoints.B;
      totalPoints += grades.C * gradePoints.C;
      totalPoints += grades.D * gradePoints.D;
      totalPoints += grades.F * gradePoints.F;
      
      const GPA = totalStudents > 0 ? totalPoints / totalStudents : 0;
      
      return {
        subject: item.subject,
        A: { M: 0, F: 0, Total: grades.A },
        B: { M: 0, F: 0, Total: grades.B },
        C: { M: 0, F: 0, Total: grades.C },
        D: { M: 0, F: 0, Total: grades.D },
        F: { M: 0, F: 0, Total: grades.F },
        GPA: parseFloat(GPA.toFixed(3)),
        position: 0
      };
    });
    
    const sortedByGPA = [...subjectGPAData].sort((a, b) => a.GPA - b.GPA);
    sortedByGPA.forEach((item, idx) => {
      item.position = idx + 1;
    });
    
    return subjectGPAData;
  };

  const loadSummary = async () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    if (!selectedExamType) {
      alert("Please select an exam type");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let url = `/api/v1/class/${selectedClass}/summary-view?exam_type=${selectedExamType}`;
      if (region && region.trim() !== "") {
        url += `&region=${encodeURIComponent(region)}`;
      }
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.subject_grade_summary && data.subject_grade_summary.length > 0) {
          const subjectGPAData = calculateSubjectGPA(data.subject_grade_summary);
          data.subject_gpa_data = subjectGPAData;
        } else {
          data.subject_gpa_data = [];
        }
        
        setSummaryData(data);
      } else {
        setError(`Failed to load data: ${response.status}`);
      }
    } catch (err) {
      console.error("Error loading summary:", err);
      setError("Network error while loading summary");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    if (!selectedClass) return;
    try {
      const response = await fetch(
        `/api/v1/class/${selectedClass}/export-excel?exam_type=${selectedExamType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${summaryData?.class_name || "Class"}_${selectedExamType}_Results.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading Excel:", err);
      alert("Failed to download Excel file");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-100 text-emerald-800 font-bold";
      case "B": return "bg-blue-100 text-blue-800";
      case "C": return "bg-amber-100 text-amber-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "F": return "bg-red-100 text-red-800";
      default: return "";
    }
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case "I": return "bg-green-100 text-green-800";
      case "II": return "bg-blue-100 text-blue-800";
      case "III": return "bg-yellow-100 text-yellow-800";
      case "IV": return "bg-orange-100 text-orange-800";
      case "O": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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

  if (loadingClasses || loadingExamTypes) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Loading data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 text-white shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <School className="h-8 w-8" />
                <div className="h-6 w-px bg-white/30" />
                <Award className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">Class Results Summary</h1>
              <p className="text-blue-100 mt-1">View, print, and export comprehensive class performance report</p>
            </div>
          </div>

          {/* Filters Card */}
          <Card className="shadow-lg border-0 overflow-hidden no-print">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    Select Class
                  </Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder={classes.length === 0 ? "No classes found" : "Choose class"} />
                    </SelectTrigger>
                    <SelectContent>
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
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    Exam Type
                  </Label>
                  <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select exam type" />
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
                    District / Region
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., Kinondoni, Temeke, Mbeya"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button 
                    onClick={loadSummary} 
                    disabled={loading || classes.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {loading ? "Loading..." : "Load Results"}
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {summaryData && !loading && (
            <div className="flex justify-end gap-3 no-print">
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" /> Print Report
              </Button>
              <Button onClick={downloadExcel} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4" /> Export Excel
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading class results...</p>
              </CardContent>
            </Card>
          )}

          {/* Results Display */}
          {summaryData && !loading && (
            <div id="print-content" className="space-y-6">
              {/* School Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">THE UNITED REPUBLIC OF TANZANIA</h2>
                <h3 className="text-lg text-gray-700">PRESIDENT'S OFFICE</h3>
                <h3 className="text-lg text-gray-700">REGIONAL ADMINISTRATION AND LOCAL GOVERNMENT</h3>
                <h3 className="text-lg font-bold text-blue-700 mt-1">{summaryData.region}</h3>
                <h3 className="text-xl font-bold text-gray-800 mt-3">{summaryData.class_name} {summaryData.exam_type} RESULTS {summaryData.year}</h3>
                <h3 className="text-lg font-bold text-gray-800">{summaryData.school_name}</h3>
              </div>

              {/* 🔥 Division & Registration Summary - TYPE SAFE! */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Award className="h-4 w-4 text-blue-600" />
                      Division Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-1 text-center">Division</th>
                          <th className="border p-1 text-center">Male</th>
                          <th className="border p-1 text-center">Female</th>
                          <th className="border p-1 text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {["I", "II", "III", "IV", "O"].map((div) => {
                          const key = div as keyof typeof summaryData.division_summary;
                          const divData = summaryData.division_summary[key];
                          // Type guard to ensure divData is DivisionData
                          const safeData = (divData && typeof divData === 'object' && 'M' in divData && 'F' in divData) 
                            ? divData as DivisionData 
                            : null;
                          return (
                            <tr key={div}>
                              <td className="border p-1 text-center font-bold">{div}</td>
                              <td className="border p-1 text-center">{safeData ? getDivisionValue(safeData, 'M') : 0}</td>
                              <td className="border p-1 text-center">{safeData ? getDivisionValue(safeData, 'F') : 0}</td>
                              <td className="border p-1 text-center">{safeData ? getDivisionTotal(safeData) : 0}</td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gray-50 font-bold">
                          <td className="border p-1 text-center">Total</td>
                          <td className="border p-1 text-center">{summaryData.division_summary.total_male}</td>
                          <td className="border p-1 text-center">{summaryData.division_summary.total_female}</td>
                          <td className="border p-1 text-center">{summaryData.division_summary.total_students}</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <Card className="shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 py-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-4 w-4 text-green-600" />
                      Registration Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-1 text-left">Sex</th>
                          <th className="border p-1 text-center">REG</th>
                          <th className="border p-1 text-center">ABS</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-1">Male</td>
                          <td className="border p-1 text-center">{summaryData.registration_summary.male_reg}</td>
                          <td className="border p-1 text-center">0</td>
                        </tr>
                        <tr>
                          <td className="border p-1">Female</td>
                          <td className="border p-1 text-center">{summaryData.registration_summary.female_reg}</td>
                          <td className="border p-1 text-center">0</td>
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                          <td className="border p-1">Total</td>
                          <td className="border p-1 text-center">{summaryData.registration_summary.total_reg}</td>
                          <td className="border p-1 text-center">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              {/* Student Results Table */}
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-cyan-600" />
                    Student Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 w-12">#</th>
                        <th className="border p-2">EXAM NO</th>
                        <th className="border p-2 text-left">STUDENT NAME</th>
                        <th className="border p-2 w-12">SEX</th>
                        {summaryData.subject_names.map((sub) => (
                          <th key={sub} className="border p-2 text-center min-w-[60px]">{sub}</th>
                        ))}
                        <th className="border p-2">TOTAL</th>
                        <th className="border p-2">AVG</th>
                        <th className="border p-2">GRADE</th>
                        <th className="border p-2">POINTS</th>
                        <th className="border p-2">DIV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.results.map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                          <td className="border p-2 text-center">{student.position}</td>
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
                          <td className="border p-2 text-center">{student.points}</td>
                          <td className="border p-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getDivisionColor(student.division)}`}>
                              {student.division}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* 🔥 Subject Grade Summary */}
              {summaryData.subject_gpa_data && summaryData.subject_gpa_data.length > 0 && (
                <Card className="shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Subject Grade Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Grade</th>
                          <th className="border p-2 text-center">Sex</th>
                          {summaryData.subject_names.map((subject) => (
                            <th key={subject} className="border p-2 text-center min-w-[70px]">{subject}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {["A", "B", "C", "D", "F"].map((grade) => (
                          <Fragment key={grade}>
                            <tr className={`${grade === 'A' ? 'bg-emerald-50' : grade === 'B' ? 'bg-blue-50' : grade === 'C' ? 'bg-amber-50' : grade === 'D' ? 'bg-orange-50' : 'bg-red-50'}`}>
                              <td rowSpan={3} className="border p-2 text-center font-bold align-middle">
                                <span className={grade === 'A' ? 'text-emerald-700' : grade === 'B' ? 'text-blue-700' : grade === 'C' ? 'text-amber-700' : grade === 'D' ? 'text-orange-700' : 'text-red-700'}>
                                  {grade}
                                </span>
                              </td>
                              <td className="border p-2 text-center">M</td>
                              {summaryData.subject_gpa_data.map((subj) => {
                                const key = grade as keyof Pick<SubjectGradeData, 'A' | 'B' | 'C' | 'D' | 'F'>;
                                const data = subj[key] as GradeData;
                                return <td key={subj.subject} className="border p-2 text-center">{data?.Total || 0}</td>;
                              })}
                            </tr>
                            <tr className={`${grade === 'A' ? 'bg-emerald-50' : grade === 'B' ? 'bg-blue-50' : grade === 'C' ? 'bg-amber-50' : grade === 'D' ? 'bg-orange-50' : 'bg-red-50'}`}>
                              <td className="border p-2 text-center">F</td>
                              {summaryData.subject_gpa_data.map((subj) => {
                                const key = grade as keyof Pick<SubjectGradeData, 'A' | 'B' | 'C' | 'D' | 'F'>;
                                const data = subj[key] as GradeData;
                                return <td key={subj.subject} className="border p-2 text-center">{data?.Total || 0}</td>;
                              })}
                            </tr>
                            <tr className={`${grade === 'A' ? 'bg-emerald-50' : grade === 'B' ? 'bg-blue-50' : grade === 'C' ? 'bg-amber-50' : grade === 'D' ? 'bg-orange-50' : 'bg-red-50'}`}>
                              <td className="border p-2 text-center font-bold">Total</td>
                              {summaryData.subject_gpa_data.map((subj) => {
                                const key = grade as keyof Pick<SubjectGradeData, 'A' | 'B' | 'C' | 'D' | 'F'>;
                                const data = subj[key] as GradeData;
                                return <td key={subj.subject} className="border p-2 text-center font-bold">{data?.Total || 0}</td>;
                              })}
                            </tr>
                          </Fragment>
                        ))}

                        {/* GPA Row */}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan={2} className="border p-2 text-center">GPA</td>
                          {summaryData.subject_gpa_data.map((subj) => (
                            <td key={subj.subject} className="border p-2 text-center">{subj.GPA}</td>
                          ))}
                        </tr>

                        {/* POSITION Row */}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan={2} className="border p-2 text-center">POSITION</td>
                          {summaryData.subject_gpa_data.map((subj) => (
                            <td key={subj.subject} className="border p-2 text-center">{subj.position}</td>
                          ))}
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
                <p className="text-gray-500">No results to display.</p>
                <p className="text-sm text-gray-400 mt-2">Select a class and exam type, then click "Load Results"</p>
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