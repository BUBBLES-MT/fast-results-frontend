"use client";

import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Save, ArrowLeft, CheckCircle, AlertCircle, Users, BookOpen, GraduationCap, Layers } from "lucide-react";

interface Student {
  id: number;
  name: string;
  sex: string;
  roll_number: string;
  class_id: number;
  stream_id: number;
}

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface Class {
  id: number;
  name: string;
}

interface Stream {
  id: number;
  name: string;
  class_id: number;
}

interface TeacherAssignment {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
}

const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

// 🔥 FUNCTION YA KUPATA JINSIA
const getGender = (sex: string): string => {
  return sex === "M" ? "M" : "F";
};

export default function AddMarksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [schoolId, setSchoolId] = useState<string>("");
  
  // 🔥 DATA KUTOKA API
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  
  // 🔥 FILTERED DATA
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Form data
  const [formData, setFormData] = useState({
    subject_id: "",
    class_id: "",
    stream_id: "",
    exam_type: "MIDTERM3",
  });
  
  // Marks data for each student
  const [studentMarks, setStudentMarks] = useState<Map<number, string>>(new Map());
  const [loadingStudents, setLoadingStudents] = useState(false);

  // ============================================================
  // 🔥 FETCH DATA - MASOMO, MADARASA, NA MIKONDO
  // ============================================================
  const fetchData = async (authToken: string) => {
    try {
      const storedSchoolId = localStorage.getItem("school_id");
      setSchoolId(storedSchoolId || "");
      
      // 🔥 1. PATA MASOMO YA MWALIMU
      const subjectsUrl = `/api/v1/teachers/me/subjects`;
      console.log("Fetching subjects from:", subjectsUrl);
      
      const subjectsRes = await fetch(subjectsUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(data);
        console.log("✅ Subjects loaded:", data.length);
      } else {
        setError("Failed to fetch your subjects");
        setLoading(false);
        return;
      }
      
      // 🔥 2. PATA MADARASA YA SHULE
      const classesUrl = `/api/v1/classes?school_id=${storedSchoolId}`;
      console.log("Fetching classes from:", classesUrl);
      
      const classesRes = await fetch(classesUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(data);
        console.log("✅ Classes loaded:", data.length);
      } else {
        setError("Failed to fetch classes");
        setLoading(false);
        return;
      }
      
      // 🔥 3. PATA MIKONDO YA SHULE
      const streamsUrl = `/api/v1/streams?school_id=${storedSchoolId}`;
      console.log("Fetching streams from:", streamsUrl);
      
      const streamsRes = await fetch(streamsUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (streamsRes.ok) {
        const data = await streamsRes.json();
        setStreams(data);
        console.log("✅ Streams loaded:", data.length);
      } else {
        setError("Failed to fetch streams");
        setLoading(false);
        return;
      }
      
      // 🔥 4. FILTER CLASSES KULINGANA NA SOMO
      if (formData.subject_id) {
        filterClassesBySubject(parseInt(formData.subject_id));
      }
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 FILTER CLASSES - Kwa somo lililochaguliwa
  // ============================================================
  const filterClassesBySubject = (subjectId: number) => {
    setFilteredClasses(classes);
    setFormData(prev => ({ ...prev, class_id: "", stream_id: "all" }));
    setStudents([]);
  };

  // ============================================================
  // 🔥 FILTER STREAMS - Kwa darasa lililochaguliwa
  // ============================================================
  const filterStreamsByClass = (classId: number) => {
    const filtered = streams.filter(s => s.class_id === classId);
    setFilteredStreams(filtered);
    setFormData(prev => ({ ...prev, stream_id: "all" }));
    setStudents([]);
  };

  // ============================================================
  // 🔥 FETCH STUDENTS - Kwa darasa na mkondo
  // ============================================================
  const fetchStudents = async () => {
    const { class_id, stream_id, subject_id } = formData;
    if (!class_id || !subject_id) return;
    
    setLoadingStudents(true);
    setError("");
    
    try {
      const storedSchoolId = localStorage.getItem("school_id");
      
      let url = `/api/v1/students?class_id=${class_id}&school_id=${storedSchoolId}`;
      if (stream_id && stream_id !== "all" && stream_id !== "") {
        url += `&stream_id=${stream_id}`;
      }
      
      console.log("Fetching students from:", url);
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Students data:", data.length);
        
        // 🔥 ANGAHA KAMA WANAFUNZI WAMEJAZIWA TAYARI
        const checkUrl = `/api/v1/marks/check?subject_id=${subject_id}&exam_type=${formData.exam_type}&class_id=${class_id}&school_id=${storedSchoolId}`;
        const checkResponse = await fetch(checkUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        let markedStudentIds: number[] = [];
        if (checkResponse.ok) {
          const marksData = await checkResponse.json();
          markedStudentIds = marksData.map((m: any) => m.student_id);
        }
        
        // 🔥 CHUJA WANAFUNZI - ONDOA WALIOJAZIWA TAYARI
        const filteredStudents = data.filter((student: Student) => {
          return !markedStudentIds.includes(student.id);
        });
        
        setStudents(filteredStudents);
        
        // Initialize marks map
        const newMarks = new Map<number, string>();
        filteredStudents.forEach((student: Student) => {
          newMarks.set(student.id, "");
        });
        setStudentMarks(newMarks);
        
        if (filteredStudents.length === 0) {
          setError("All students in this class already have marks for this subject.");
        }
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setError("Failed to fetch students");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  // ============================================================
  // 🔥 USE EFFECT - INIT
  // ============================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, [router]);

  // ============================================================
  // 🔥 USE EFFECT - Filter Classes when subject changes
  // ============================================================
  useEffect(() => {
    if (formData.subject_id && classes.length > 0) {
      filterClassesBySubject(parseInt(formData.subject_id));
    }
  }, [formData.subject_id, classes]);

  // ============================================================
  // 🔥 USE EFFECT - Filter Streams when class changes
  // ============================================================
  useEffect(() => {
    if (formData.class_id && streams.length > 0) {
      filterStreamsByClass(parseInt(formData.class_id));
    }
  }, [formData.class_id, streams]);

  // ============================================================
  // 🔥 USE EFFECT - Fetch students when class or stream changes
  // ============================================================
  useEffect(() => {
    if (formData.class_id && formData.class_id !== "" && 
        formData.subject_id && formData.subject_id !== "" && 
        formData.exam_type) {
      fetchStudents();
    }
  }, [formData.class_id, formData.stream_id, formData.subject_id, formData.exam_type]);

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const handleSubjectChange = (value: string) => {
    setFormData({ ...formData, subject_id: value, class_id: "", stream_id: "all" });
    setStudents([]);
  };

  const handleClassChange = (value: string) => {
    setFormData({ ...formData, class_id: value, stream_id: "all" });
    setStudents([]);
  };

  const handleStreamChange = (value: string) => {
    setFormData({ ...formData, stream_id: value === "all" ? "" : value });
  };

  const handleExamTypeChange = (value: string) => {
    setFormData({ ...formData, exam_type: value });
  };

  const handleMarkChange = (studentId: number, value: string) => {
    const newMarks = new Map(studentMarks);
    newMarks.set(studentId, value);
    setStudentMarks(newMarks);
  };

  // ============================================================
  // 🔥 SAVE ALL MARKS - SECONDARY (0-100)
  // ============================================================
  const handleSaveAll = async () => {
    if (!formData.subject_id || !formData.class_id || !formData.exam_type) {
      setError("Please select subject, class, and exam type");
      return;
    }
    
    setSaving(true);
    setError("");
    setSuccess("");
    
    const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id");
    const storedSchoolId = localStorage.getItem("school_id");
    const authToken = localStorage.getItem("token");
    
    if (!authToken) {
      setError("Please login again. No token found.");
      setSaving(false);
      router.push("/login");
      return;
    }
    
    console.log("🔑 Token length:", authToken.length);
    console.log("📚 Teacher ID:", teacherId);
    console.log("🏫 School ID:", storedSchoolId);
    
    let savedCount = 0;
    let failedCount = 0;
    
    for (const student of students) {
      const score = studentMarks.get(student.id);
      if (score && score.trim() !== "") {
        const scoreNum = parseFloat(score);
        
        // 🔥 SECONDARY: 0-100
        if (scoreNum < 0 || scoreNum > 100) {
          setError(`Score must be between 0 and 100 for secondary school`);
          setSaving(false);
          return;
        }
        
        try {
          const payload = {
            student_id: student.id,
            subject_id: parseInt(formData.subject_id),
            score: scoreNum,
            exam_type: formData.exam_type,
            teacher_id: parseInt(teacherId || "0"),
            school_id: parseInt(storedSchoolId || "0"),
          };
          
          // 🔥 TUMIA TRAILING SLASH
          const url = `/api/v1/marks/`;
          console.log(`📤 Sending to: ${url}`);
          
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          
          if (response.ok) {
            savedCount++;
            console.log(`✅ Mark saved for student ${student.id}`);
          } else {
            const errData = await response.json();
            console.error("❌ Error saving mark:", errData);
            failedCount++;
            
            if (response.status === 401) {
              setError("Your session expired. Please login again.");
              localStorage.removeItem("token");
              setTimeout(() => router.push("/login"), 2000);
              setSaving(false);
              return;
            }
          }
        } catch (err) {
          console.error("❌ Error saving mark:", err);
          failedCount++;
        }
      }
    }
    
    if (savedCount > 0) {
      setSuccess(`Successfully saved ${savedCount} marks. ${failedCount > 0 ? `${failedCount} failed.` : ""}`);
      const newMarks = new Map<number, string>();
      students.forEach(student => {
        newMarks.set(student.id, "");
      });
      setStudentMarks(newMarks);
      fetchStudents();
    } else {
      setError("No marks were saved. Please enter scores first.");
    }
    
    setSaving(false);
  };

  // ============================================================
  // 🔥 BULK FILL
  // ============================================================
  const handleBulkFill = () => {
    const value = prompt("Enter score to apply to all students (0-100):");
    if (value !== null) {
      const score = parseFloat(value);
      if (isNaN(score) || score < 0 || score > 100) {
        setError("Please enter a valid score between 0 and 100");
        return;
      }
      const newMarks = new Map(studentMarks);
      students.forEach(student => {
        newMarks.set(student.id, value);
      });
      setStudentMarks(newMarks);
    }
  };

  // ============================================================
  // 🔥 LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="ml-3 text-gray-500">Loading data...</p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-8 w-px bg-white/30" />
              <BookOpen className="h-6 w-6" />
              <div className="h-8 w-px bg-white/30" />
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Add Marks</h1>
            <p className="text-blue-100 mt-1">
              Select subject, class, and enter marks for students
              <span className="text-yellow-300 ml-2 font-semibold">(Secondary School - Marks 0-100)</span>
            </p>
          </div>
        </div>

        {/* Selection Form */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Layers className="h-5 w-5" />
              Select Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {error && !subjects.length && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* SUBJECT */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Subject *
                </Label>
                <Select value={formData.subject_id} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl">
                    <SelectValue placeholder={subjects.length > 0 ? "Select Subject" : "No Subjects Assigned"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {subjects.length > 0 && (
                  <p className="text-xs text-gray-500">{subjects.length} subjects assigned to you</p>
                )}
              </div>
              
              {/* CLASS */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  Class *
                </Label>
                <Select 
                  value={formData.class_id} 
                  onValueChange={handleClassChange} 
                  disabled={!formData.subject_id || filteredClasses.length === 0}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl">
                    <SelectValue placeholder={
                      !formData.subject_id 
                        ? "Select Subject First" 
                        : filteredClasses.length === 0 
                          ? "No Classes" 
                          : "Select Class"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {filteredClasses.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.subject_id && filteredClasses.length === 0 && (
                  <p className="text-xs text-amber-600">⚠️ No classes for this subject</p>
                )}
                {formData.class_id && (
                  <p className="text-xs text-emerald-600">✅ Class selected</p>
                )}
              </div>
              
              {/* STREAM */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-600" />
                  Stream (Optional)
                </Label>
                <Select 
                  value={formData.stream_id || "all"} 
                  onValueChange={handleStreamChange} 
                  disabled={!formData.class_id || filteredStreams.length === 0}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl">
                    <SelectValue placeholder={
                      !formData.class_id 
                        ? "Select Class First" 
                        : filteredStreams.length === 0 
                          ? "No Streams" 
                          : "All Streams"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">✅ All Streams</SelectItem>
                    {filteredStreams.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>Stream {s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.class_id && filteredStreams.length === 0 && (
                  <p className="text-xs text-amber-600">⚠️ No streams for this class</p>
                )}
                {formData.class_id && filteredStreams.length > 0 && (
                  <p className="text-xs text-gray-500">{filteredStreams.length} streams available</p>
                )}
              </div>
              
              {/* EXAM TYPE */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Exam Type *
                </Label>
                <Select value={formData.exam_type} onValueChange={handleExamTypeChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl">
                    <SelectValue placeholder="Select Exam Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {EXAM_TYPES.map(et => (
                      <SelectItem key={et} value={et}>{et}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        {students.length > 0 && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Users className="h-5 w-5" />
                <span>
                  Students 
                  {formData.stream_id && formData.stream_id !== "all" 
                    ? ` (Stream ${filteredStreams.find(s => s.id.toString() === formData.stream_id)?.name})` 
                    : " (All Streams)"}
                </span>
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Total: {students.length})
                </span>
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBulkFill} className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl">
                  📝 Bulk Fill
                </Button>
                <Button onClick={handleSaveAll} disabled={saving} className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-xl">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save All Marks"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loadingStudents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>{success}</span>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-12 text-center">#</TableHead>
                          <TableHead className="min-w-[180px]">Student Name</TableHead>
                          <TableHead className="min-w-[60px] text-center">Gender</TableHead>
                          <TableHead className="min-w-[100px]">Roll Number</TableHead>
                          <TableHead className="min-w-[120px]">Class</TableHead>
                          <TableHead className="min-w-[100px]">Stream</TableHead>
                          <TableHead className="min-w-[150px] text-center">
                            Score (0-100)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student, idx) => {
                          const className = classes.find(c => c.id === student.class_id)?.name || "—";
                          const streamName = streams.find(s => s.id === student.stream_id)?.name || "—";
                          
                          return (
                            <TableRow key={student.id} className="hover:bg-blue-50/50 transition-colors">
                              <TableCell className="text-center font-medium text-gray-500">{idx + 1}</TableCell>
                              <TableCell className="font-medium text-gray-800">{student.name}</TableCell>
                              <TableCell className="text-center">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  student.sex === "M" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-pink-100 text-pink-800"
                                }`}>
                                  {getGender(student.sex)}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{student.roll_number || "-"}</TableCell>
                              <TableCell className="text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3 text-indigo-400" />
                                  {className}
                                </span>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                  <Layers className="h-3 w-3 text-purple-400" />
                                  {streamName}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  className="w-32 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-center"
                                  placeholder="0-100"
                                  value={studentMarks.get(student.id) || ""}
                                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Summary Footer */}
                  <div className="mt-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Total Students: <span className="font-bold text-gray-800">{students.length}</span>
                      {students.some(s => studentMarks.get(s.id) && studentMarks.get(s.id)!.trim() !== "") && (
                        <span className="ml-4">
                          Filled: <span className="font-bold text-emerald-600">
                            {students.filter(s => studentMarks.get(s.id) && studentMarks.get(s.id)!.trim() !== "").length}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* No Subjects Assigned */}
        {!loading && subjects.length === 0 && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="py-16 text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
              <p className="text-lg font-semibold text-gray-700">No Subjects Assigned</p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                You have not been assigned any subjects. Please contact the Headmaster or Academic.
              </p>
            </CardContent>
          </Card>
        )}

        {/* All Students Already Have Marks */}
        {!loading && subjects.length > 0 && formData.subject_id && formData.class_id && students.length === 0 && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
              <p className="text-lg font-semibold text-gray-700">All Students Have Marks!</p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                All students in this class already have marks for this subject.
              </p>
              <Button 
                onClick={() => {
                  setFormData({ ...formData, class_id: "", stream_id: "all" });
                  setStudents([]);
                }}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Select Another Class
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}