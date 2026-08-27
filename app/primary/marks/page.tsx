"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Loader2, 
  Search, 
  Trash2, 
  Edit, 
  AlertCircle, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  School,
  BookOpen,
  Eye,
  UserCog,
  Star,
  PlusCircle,
  Users
} from "lucide-react";

interface MarkFromAPI {
  id: number;
  student_id: number;
  student_name: string;
  roll_number?: string;
  subject_id: number;
  subject_name: string;
  score: number;
  exam_type: string;
  teacher_id: number;
  teacher_name?: string;
  class_id?: number;
  class_name?: string;
  stream_id?: number;
  stream_name?: string;
  created_at: string;
}

interface StudentWithMarks {
  id: number;
  name: string;
  roll_number: string;
  marks: Record<string, number>;
  markIds: Record<string, number>;
}

interface GroupData {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  teacher_id: number;
  teacher_name: string;
  students: StudentWithMarks[];
}

interface Teacher {
  id: number;
  name: string;
}

// 🔥 AINA ZA MTIHANI
const AINA_ZAMTIHANI = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL"];

// 🔥 PRIMARY GRADING (0-50)
const pataDaraja = (alama: number): string => {
  if (alama >= 41) return "A";
  if (alama >= 31) return "B";
  if (alama >= 21) return "C";
  if (alama >= 11) return "D";
  return "E";
};

const pataRangiYaDaraja = (daraja: string): string => {
  switch (daraja) {
    case "A": return "bg-emerald-100 text-emerald-800";
    case "B": return "bg-blue-100 text-blue-800";
    case "C": return "bg-yellow-100 text-yellow-800";
    case "D": return "bg-orange-100 text-orange-800";
    default: return "bg-red-100 text-red-800";
  }
};

// ============================================================
// KADI YA KIKUNDI
// ============================================================
const KadiYaKikundi = memo(({ 
  group, 
  canEditGroup, 
  saving, 
  handleEditMarks, 
  handleDeleteStudentMarks 
}: any) => {
  const sortedStudents = [...group.students].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className={`py-4 ${canEditGroup ? 'bg-gradient-to-r from-sky-600 to-blue-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-white">
            <BookOpen className="h-5 w-5" />
            <span className="font-bold text-lg">{group.subject_name}</span>
            <span className="text-white/60">|</span>
            <span>{group.class_name}</span>
            <span className="text-white/60">|</span>
            <span>Mkondo {group.stream_name}</span>
            <span className="text-white/60">|</span>
            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
              👨‍🏫 {group.teacher_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!canEditGroup && (
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="h-3 w-3" /> Tazama Tu
              </span>
            )}
            {canEditGroup && (
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                ✏️ Inaweza Hariri
              </span>
            )}
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full text-white">
              📊 {sortedStudents.length} wanafunzi
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="min-w-[180px]">Jina la Mwanafunzi</TableHead>
                <TableHead className="min-w-[100px]">Namba</TableHead>
                {AINA_ZAMTIHANI.map((et) => (
                  <TableHead key={et} className="text-center min-w-[80px] bg-sky-50">
                    <span className="font-bold text-sky-700 text-xs">{et}</span>
                  </TableHead>
                ))}
                {canEditGroup && (
                  <TableHead className="text-center w-24">Vitendo</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student: StudentWithMarks, studentIdx: number) => (
                <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="text-center font-medium">{studentIdx + 1}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {student.roll_number || "-"}
                  </TableCell>
                  {AINA_ZAMTIHANI.map((et) => {
                    const alama = student.marks[et];
                    const daraja = alama ? pataDaraja(alama) : "";
                    return (
                      <TableCell key={et} className="text-center p-2">
                        {alama !== undefined && alama !== null ? (
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-lg">{alama}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${pataRangiYaDaraja(daraja)}`}>
                              {daraja}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-lg">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                  {canEditGroup && (
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                          onClick={() => handleEditMarks(student, group)}
                          disabled={saving}
                          title="Hariri alama"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteStudentMarks(student.id, group.subject_id, student.markIds)}
                          disabled={saving}
                          title="Futa alama zote"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
});

KadiYaKikundi.displayName = 'KadiYaKikundi';

export default function UsimamiziWaAlamaPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [saving, setSaving] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  
  const [openEditMarks, setOpenEditMarks] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});

  // Admin: Teacher filter
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("self");
  const [isChangingTeacher, setIsChangingTeacher] = useState(false);

  // 🔥🔥🔥 BADILISHA HAPA - RUHUSU MWALIMU! 🔥🔥🔥
  // ROLES ZINAZORUHUSIWA KUONA UKURASA HUU
  const ALLOWED_ROLES = ["Mtaaluma", "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mwalimu"];
  const isAllowed = ALLOWED_ROLES.includes(userRole);
  
  // ADMIN ROLES (zinaweza kuhariri alama za walimu wengine)
  const ADMIN_ROLES = ["Mtaaluma", "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi"];
  const isAdmin = ADMIN_ROLES.includes(userRole);
  
  // 🔥 MWALIMU
  const isTeacher = userRole === "Mwalimu";

  // ============================================================
  // 🔥 PERMISSION LOGIC
  // ============================================================
  const canEditGroup = (groupTeacherId: number): boolean => {
    // 🔥 MWALIMU - Anaweza kuhariri alama zake tu
    if (isTeacher) {
      return groupTeacherId === currentUserId;
    }
    
    // 🔥 ADMIN - Anaweza kuhariri kama anaona data zake
    if (isAdmin) {
      const isViewingSelf = selectedTeacherId === "self" || selectedTeacherId === currentUserId?.toString();
      return isViewingSelf && groupTeacherId === currentUserId;
    }
    
    return false;
  };
  
  const canFilterByTeacher = isAdmin;

  // ============================================================
  // 🔥 NAVIGATE TO ADD MARKS
  // ============================================================
  const navigateToAddMarks = () => {
    router.push("/primary/marks/add");
  };

  // ============================================================
  // 🔥 FETCH TEACHERS
  // ============================================================
  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/primary/teachers", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
        console.log("✅ Walimu waliopatikana:", data.length);
      } else {
        console.warn("Hakuna walimu waliopatikana");
        setTeachers([]);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachers([]);
    }
  };

  // ============================================================
  // 🔥 FETCH AVAILABLE YEARS
  // ============================================================
  const fetchAvailableYears = async (authToken: string) => {
    try {
      const schoolId = localStorage.getItem("school_id");
      const response = await fetch(`/api/v1/primary/marks/available-years?school_id=${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableYears(data.years);
        if (data.years.length > 0) {
          setSelectedYear(data.years[0]);
        }
        console.log("📅 Available years:", data.years);
      } else {
        console.warn("Failed to fetch years, using default");
        setAvailableYears([new Date().getFullYear()]);
      }
    } catch (err) {
      console.error("Error fetching years:", err);
      setAvailableYears([new Date().getFullYear()]);
    }
  };

  // ============================================================
  // 🔥 FETCH MARKS DATA - MWALIMU ANAONA WAKE TU!
  // ============================================================
  const fetchMarksData = useCallback(async (authToken: string, year?: number, teacherId?: string) => {
    if (isFetching.current) return;
    if (!isMounted.current) return;
    
    isFetching.current = true;
    setLoading(true);
    setError("");
    
    try {
      const schoolId = localStorage.getItem("school_id");
      const yearToUse = year || selectedYear;
      let url = `/api/v1/primary/marks/my-students?year=${yearToUse}&school_id=${schoolId}`;
      
      // 🔥 MWALIMU - ANAONA WANAFUNZI WAKE TU (BACKEND INAJUA)
      // Hatuna haja ya kuongeza teacher_id kwa mwalimu
      
      let effectiveTeacherId = teacherId;
      
      // 🔥 ADMIN - Anaweza kuchuja kwa mwalimu
      if (isAdmin && teacherId === "self") {
        effectiveTeacherId = currentUserId?.toString();
      }
      
      if (isAdmin && effectiveTeacherId && effectiveTeacherId !== "all" && effectiveTeacherId !== "self") {
        url += `&teacher_id=${effectiveTeacherId}`;
      }
      
      console.log("🔍 Fetching marks from:", url);
      console.log("🔍 User role:", userRole);
      console.log("🔍 Is Teacher:", isTeacher);
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const marksList: MarkFromAPI[] = data.marks || [];
      console.log("📊 Received marks:", marksList.length);
      
      if (marksList.length === 0) {
        setGroups([]);
        setLoading(false);
        
        if (isTeacher) {
          setError("📝 Bado hujajaza alama za wanafunzi wako kwa mwaka huu.");
        } else if (isAdmin && selectedTeacherId !== "self" && selectedTeacherId !== "all") {
          const teacherName = teachers.find(t => t.id.toString() === selectedTeacherId)?.name || "Mwalimu";
          setError(`📝 Mwalimu "${teacherName}" bado hajajaza alama za wanafunzi wake.`);
        } else if (isAdmin && selectedTeacherId === "all") {
          setError("📝 Hakuna alama zilizopatikana kwa walimu wote.");
        } else {
          setError("📝 Hakuna alama zilizopatikana kwa mwaka uliochagua.");
        }
        return;
      }
      
      const groupMap = new Map<string, GroupData>();
      
      for (const mark of marksList) {
        const key = `${mark.subject_id}-${mark.class_id || 0}-${mark.stream_id || 0}-${mark.teacher_id}`;
        
        if (!groupMap.has(key)) {
          groupMap.set(key, {
            subject_id: mark.subject_id,
            subject_name: mark.subject_name,
            class_id: mark.class_id || 0,
            class_name: mark.class_name || "Haijulikani",
            stream_id: mark.stream_id || 0,
            stream_name: mark.stream_name || "",
            teacher_id: mark.teacher_id,
            teacher_name: mark.teacher_name || "Haijulikani",
            students: [],
          });
        }
        
        const group = groupMap.get(key)!;
        let student = group.students.find(s => s.id === mark.student_id);
        
        if (!student) {
          student = {
            id: mark.student_id,
            name: mark.student_name,
            roll_number: mark.roll_number || "",
            marks: {},
            markIds: {},
          };
          group.students.push(student);
        }
        
        student.marks[mark.exam_type] = mark.score;
        student.markIds[mark.exam_type] = mark.id;
      }
      
      const groupsArray = Array.from(groupMap.values());
      setGroups(groupsArray);
      setCurrentPage(1);
      console.log("📚 Groups created:", groupsArray.length);
      
    } catch (err: any) {
      console.error("Error fetching marks:", err);
      setError(err.message || "Imeshindwa kupakia alama");
      setGroups([]);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isFetching.current = false;
    }
  }, [selectedYear, isAdmin, isTeacher, currentUserId, teachers, userRole]);

  // ============================================================
  // INITIALIZATION
  // ============================================================
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const role = localStorage.getItem("user_type");
        const userId = localStorage.getItem("user_id") || localStorage.getItem("teacher_id");
        
        if (!storedToken) {
          router.push("/login");
          return;
        }
        
        setToken(storedToken);
        
        // 🔥 ROLE MAPPING - KISWAHILI TU!
        let formattedRole = role || "";
        const roleLower = formattedRole.toLowerCase();
        
        const roleMap: {[key: string]: string} = {
          "mtaaluma": "Mtaaluma",
          "mwalimu mkuu": "Mwalimu Mkuu",
          "mwalimu mkuu msaidizi": "Mwalimu Mkuu Msaidizi",
          "mwalimu": "Mwalimu",
          "mhasibu": "Mhasibu",
          "msimamizi mkuu": "Msimamizi Mkuu"
        };
        
        formattedRole = roleMap[roleLower] || "";
        
        console.log("🔍 Role from localStorage:", role);
        console.log("🔍 Formatted Role:", formattedRole);
        
        setUserRole(formattedRole);
        
        if (userId) {
          setCurrentUserId(parseInt(userId));
        }
        
        // 🔥🔥🔥 MWALIMU ANARUHUSIWA! 🔥🔥🔥
        const isUserAllowed = ALLOWED_ROLES.includes(formattedRole);
        
        if (!isUserAllowed) {
          setError("Huna ruhusa ya kuona ukurasa huu. Unahitaji kuwa Mtaaluma, Mwalimu Mkuu, Mwalimu Mkuu Msaidizi, au Mwalimu.");
          setLoading(false);
          return;
        }
        
        // 🔥 IKIWA MWALIMU, USIJARIBU KUPATA TEACHERS
        if (isTeacher) {
          // Mwalimu hahitaji kuona walimu wengine
          setTeachers([]);
          setSelectedTeacherId("self");
        } else {
          await fetchTeachers(storedToken);
        }
        
        await fetchAvailableYears(storedToken);
        await fetchMarksData(storedToken, undefined, "self");
        
      } catch (err) {
        console.error("Init error:", err);
        setError("Imeshindwa kuanzisha. Tafadhali onyesha upya.");
        setLoading(false);
      }
    };
    
    init();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ============================================================
  // HANDLE YEAR CHANGE
  // ============================================================
  const handleYearChange = async (value: string) => {
    const newYear = parseInt(value);
    setSelectedYear(newYear);
    setError("");
    if (token) {
      await fetchMarksData(token, newYear, selectedTeacherId);
    }
  };

  // ============================================================
  // HANDLE TEACHER FILTER CHANGE (KWA ADMIN TU)
  // ============================================================
  const handleTeacherChange = async (value: string) => {
    if (!isAdmin) return;
    
    setIsChangingTeacher(true);
    setSelectedTeacherId(value);
    setGroups([]);
    setError("");
    
    if (token) {
      await fetchMarksData(token, selectedYear, value);
    }
    
    setIsChangingTeacher(false);
  };

  // ============================================================
  // 🔥 HANDLE EDIT MARKS
  // ============================================================
  const handleEditMarks = (student: StudentWithMarks, group: GroupData) => {
    if (!canEditGroup(group.teacher_id)) {
      setError("Huna ruhusa ya kuhariri alama hizi. Unaweza kuhariri alama zako mwenyewe tu.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    const formData: Record<string, string> = {};
    AINA_ZAMTIHANI.forEach(et => {
      formData[et] = student.marks[et]?.toString() || "";
    });
    setEditFormData(formData);
    setEditingStudent({
      student_id: student.id,
      student_name: student.name,
      subject_id: group.subject_id,
      subject_name: group.subject_name,
      marks: student.marks,
      markIds: student.markIds,
    });
    setOpenEditMarks(true);
  };

  // ============================================================
  // 🔥 HANDLE UPDATE MARKS
  // ============================================================
  const handleUpdateMarks = async () => {
    if (!editingStudent) return;
    
    setSaving(true);
    setError("");
    setSuccess("");
    
    let savedCount = 0;
    
    for (const examType of AINA_ZAMTIHANI) {
      const newScore = editFormData[examType];
      const existingMarkId = editingStudent.markIds[examType];
      
      if (!newScore || newScore.trim() === "") continue;
      
      const score = parseFloat(newScore);
      if (isNaN(score) || score < 0 || score > 50) continue;
      
      try {
        if (existingMarkId) {
          const response = await fetch(`/api/v1/primary/marks/${existingMarkId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ score, exam_type: examType }),
          });
          if (response.ok) savedCount++;
        } else {
          const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id");
          const response = await fetch("/api/v1/primary/marks", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_id: editingStudent.student_id,
              subject_id: editingStudent.subject_id,
              score,
              exam_type: examType,
              teacher_id: parseInt(teacherId || "0"),
            }),
          });
          if (response.ok) savedCount++;
        }
      } catch (err) {
        console.error(`Error saving ${examType}:`, err);
      }
    }
    
    setOpenEditMarks(false);
    setEditingStudent(null);
    
    if (savedCount > 0) {
      await fetchMarksData(token, selectedYear, selectedTeacherId);
      setSuccess(`Alama ${savedCount} zimehifadhiwa kikamilifu`);
      setTimeout(() => setSuccess(""), 3000);
    }
    
    setSaving(false);
  };

  // ============================================================
  // 🔥 HANDLE DELETE STUDENT MARKS
  // ============================================================
  const handleDeleteStudentMarks = async (studentId: number, subjectId: number, markIds: Record<string, number>) => {
    const group = groups.find(g => g.subject_id === subjectId);
    if (!group) return;
    
    if (!canEditGroup(group.teacher_id)) {
      setError("Huna ruhusa ya kufuta alama hizi. Unaweza kufuta alama zako mwenyewe tu.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    if (!confirm("Je, una uhakika unataka kufuta ALAMA ZOTE za mwanafunzi huyu?")) return;
    
    for (const markId of Object.values(markIds)) {
      try {
        await fetch(`/api/v1/primary/marks/${markId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error deleting mark:", err);
      }
    }
    
    setSuccess("Alama zimefutwa kikamilifu");
    setTimeout(() => setSuccess(""), 3000);
    
    await fetchMarksData(token, selectedYear, selectedTeacherId);
  };

  // ============================================================
  // FILTER AND PAGINATION
  // ============================================================
  const filteredGroups = groups.filter(group => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return group.subject_name.toLowerCase().includes(searchLower) ||
           group.class_name.toLowerCase().includes(searchLower) ||
           group.teacher_name.toLowerCase().includes(searchLower) ||
           group.students.some(s => s.name.toLowerCase().includes(searchLower) ||
                                     s.roll_number?.toLowerCase().includes(searchLower));
  });

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600 mb-4" />
          <p className="text-gray-500">Inapakia data...</p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <School className="h-8 w-8" />
                    <div className="h-6 w-px bg-white/30" />
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold">Usimamizi wa Alama</h1>
                  <p className="text-sky-100 mt-1">
                    Jukumu: {userRole} • {isAdmin ? "Upatikanaji wa Msimamizi" : isTeacher ? "Upatikanaji wa Mwalimu" : "Haijulikani"}
                  </p>
                </div>
                
                <Button 
                  onClick={navigateToAddMarks}
                  className="bg-white text-sky-700 hover:bg-sky-50 shadow-lg hover:shadow-xl transition-all duration-200 gap-2 rounded-xl font-bold px-6 py-6"
                >
                  <PlusCircle className="h-5 w-5" />
                  Ongeza Alama Mpya
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Year Filter */}
                {availableYears.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-sky-600" />
                      Chagua Mwaka
                    </Label>
                    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-sky-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {availableYears.map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400">
                      Miaka {availableYears.length} inapatikana
                    </p>
                  </div>
                )}

                {/* 🔥 TEACHER FILTER - KWA ADMIN TU (MWALIMU HAONI) */}
                {isAdmin && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-indigo-600" />
                      Chuja kwa Mwalimu
                    </Label>
                    <Select 
                      value={selectedTeacherId} 
                      onValueChange={handleTeacherChange} 
                      disabled={isChangingTeacher}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder={teachers.length === 0 ? "Hakuna walimu" : "Chagua mwalimu"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all" className="font-bold text-purple-600 bg-purple-50">
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            Walimu Wote
                          </div>
                        </SelectItem>
                        <SelectItem value="self" className="font-bold text-sky-600 bg-sky-50">
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            Wanafunzi Wangu
                          </div>
                        </SelectItem>
                        <div className="border-t my-1" />
                        {teachers.length === 0 ? (
                          <SelectItem value="none" disabled className="text-gray-400">
                            Hakuna walimu waliopatikana
                          </SelectItem>
                        ) : (
                          teachers.map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                              {teacher.name} {currentUserId === teacher.id ? "(Wewe)" : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    
                    {teachers.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Hakuna walimu waliopatikana shuleni. Hakikisha walimu wameingizwa kwenye mfumo.
                      </p>
                    )}
                    
                    {selectedTeacherId === "all" && teachers.length > 0 && (
                      <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Inaonyesha alama za walimu wote - Huwezi kuhariri alama za walimu wengine
                      </p>
                    )}
                    {selectedTeacherId === "self" && teachers.length > 0 && (
                      <p className="text-xs text-sky-600 mt-1 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        Inaonyesha alama za madarasa unayofundisha - Unaweza kuhariri alama hizi
                      </p>
                    )}
                    {selectedTeacherId !== "self" && selectedTeacherId !== "all" && selectedTeacherId !== currentUserId?.toString() && teachers.length > 0 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Hali ya Kutazama Tu - Huwezi kuhariri alama za walimu wengine
                      </p>
                    )}
                    {selectedTeacherId === currentUserId?.toString() && selectedTeacherId !== "self" && teachers.length > 0 && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        ✏️ Unaweza kuhariri alama hizi (hizi ni data zako mwenyewe)
                      </p>
                    )}
                    {isChangingTeacher && (
                      <p className="text-xs text-sky-600 mt-1 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Inapakia data ya mwalimu...
                      </p>
                    )}
                  </div>
                )}

                {/* 🔥 PERMISSION INFO - MWALIMU ANAONA HALI YAKE */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    Hali ya Sasa
                  </Label>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isTeacher ? 'bg-emerald-100 text-emerald-700' :
                    isAdmin && selectedTeacherId === "self" ? 'bg-emerald-100 text-emerald-700' :
                    isAdmin && selectedTeacherId === "all" ? 'bg-purple-100 text-purple-700' :
                    isAdmin && selectedTeacherId !== "self" && selectedTeacherId !== currentUserId?.toString() ? 'bg-amber-100 text-amber-700' :
                    isAdmin ? 'bg-sky-100 text-sky-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isTeacher && (
                      <span>✏️ Hali ya Mwalimu - Unaona wanafunzi wako tu, unaweza kuhariri alama zako</span>
                    )}
                    {isAdmin && selectedTeacherId === "all" && (
                      <span>👁️ Kutazama Zote - Unaweza kuona alama za walimu wote</span>
                    )}
                    {isAdmin && selectedTeacherId === "self" && (
                      <span>✏️ Hali ya Kuhariri - Unaweza kubadilisha alama zako</span>
                    )}
                    {isAdmin && selectedTeacherId !== "self" && selectedTeacherId !== "all" && selectedTeacherId !== currentUserId?.toString() && (
                      <span>👁️ Kutazama Tu - Huwezi kuhariri alama za walimu wengine</span>
                    )}
                    {isAdmin && selectedTeacherId === currentUserId?.toString() && selectedTeacherId !== "self" && (
                      <span>✏️ Hali ya Kuhariri - Unaweza kubadilisha alama zako</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Search */}
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tafuta kwa somo, darasa, mwalimu, jina la mwanafunzi, au namba..."
                  className="pl-10 bg-white focus:ring-2 focus:ring-sky-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* No Data */}
          {groups.length === 0 && !loading && (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold">Hakuna alama zilizopatikana</p>
                <p className="text-sm mt-2">Mwaka {selectedYear}</p>
                {isTeacher && (
                  <p className="text-sm mt-2">Bado hujajaza alama za wanafunzi wako kwa mwaka huu.</p>
                )}
                {isAdmin && selectedTeacherId === "self" && (
                  <p className="text-sm mt-2">Huna alama zozote za madarasa unayofundisha mwaka {selectedYear}.</p>
                )}
                {isAdmin && selectedTeacherId === "all" && (
                  <p className="text-sm mt-2">Hakuna alama zilizopatikana kwa walimu wote.</p>
                )}
                {isAdmin && selectedTeacherId !== "self" && selectedTeacherId !== "all" && (
                  <p className="text-sm mt-2">Mwalimu aliyechaguliwa bado hajajaza alama.</p>
                )}
                <Button 
                  onClick={navigateToAddMarks}
                  className="mt-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Ongeza Alama Mpya
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Groups Display */}
          {groups.length > 0 && (
            <>
              <div className="space-y-6">
                {paginatedGroups.map((group, idx) => (
                  <KadiYaKikundi
                    key={idx}
                    group={group}
                    canEditGroup={canEditGroup(group.teacher_id)}
                    saving={saving}
                    handleEditMarks={handleEditMarks}
                    handleDeleteStudentMarks={handleDeleteStudentMarks}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Iliyopita
                  </Button>
                  <span className="text-sm text-gray-600">Ukurasa {currentPage} wa {totalPages}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Inayofuata <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Marks Dialog */}
      <Dialog open={openEditMarks} onOpenChange={setOpenEditMarks}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Hariri Alama</DialogTitle>
            <DialogDescription>
              {editingStudent && `Hariri alama za ${editingStudent.student_name} - ${editingStudent.subject_name}`}
              <span className="block text-amber-600 text-sm mt-1">⚠️ Shule ya Msingi - Alama 0-50</span>
              <span className="block text-blue-600 text-sm mt-1">ℹ️ Unaweza kuhariri alama zako mwenyewe tu</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {AINA_ZAMTIHANI.map((examType) => (
              <div key={examType} className="grid grid-cols-3 gap-4 items-center">
                <Label className="font-semibold">{examType}</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  className="col-span-2 bg-white"
                  placeholder="0-50"
                  value={editFormData[examType] || ""}
                  onChange={(e) => {
                    setEditFormData({...editFormData, [examType]: e.target.value});
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditMarks(false)}>Ghairi</Button>
            <Button onClick={handleUpdateMarks} disabled={saving} className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {saving ? "Inahifadhi..." : "Hifadhi Alama Zote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}