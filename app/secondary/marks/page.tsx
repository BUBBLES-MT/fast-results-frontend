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
  PlusCircle
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

// 🔥 SECONDARY EXAM TYPES
const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

// 🔥 SECONDARY GRADING (0-100)
const getGrade = (score: number): string => {
  if (score >= 75) return "A";
  if (score >= 65) return "B";
  if (score >= 45) return "C";
  if (score >= 30) return "D";
  return "F";
};

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case "A": return "bg-green-100 text-green-800";
    case "B": return "bg-blue-100 text-blue-800";
    case "C": return "bg-yellow-100 text-yellow-800";
    case "D": return "bg-orange-100 text-orange-800";
    default: return "bg-red-100 text-red-800";
  }
};

// ============================================================
// GROUP CARD COMPONENT
// ============================================================
const GroupCard = memo(({ 
  group, 
  canEditGroup, 
  saving, 
  handleEditMarks, 
  handleDeleteStudentMarks 
}: any) => {
  const sortedStudents = [...group.students].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className={`py-4 ${canEditGroup ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-white">
            <BookOpen className="h-5 w-5" />
            <span className="font-bold text-lg">{group.subject_name}</span>
            <span className="text-white/60">|</span>
            <span>{group.class_name}</span>
            <span className="text-white/60">|</span>
            <span>Stream {group.stream_name}</span>
            <span className="text-white/60">|</span>
            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
              👨‍🏫 {group.teacher_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!canEditGroup && (
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="h-3 w-3" /> View Only
              </span>
            )}
            {canEditGroup && (
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                ✏️ Can Edit
              </span>
            )}
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full text-white">
              📊 {sortedStudents.length} students
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
                <TableHead className="min-w-[180px]">Student Name</TableHead>
                <TableHead className="min-w-[100px]">Roll Number</TableHead>
                {EXAM_TYPES.map((et) => (
                  <TableHead key={et} className="text-center min-w-[80px] bg-blue-50">
                    <span className="font-bold text-blue-700 text-xs">{et}</span>
                  </TableHead>
                ))}
                {canEditGroup && (
                  <TableHead className="text-center w-24">Actions</TableHead>
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
                  {EXAM_TYPES.map((et) => {
                    const score = student.marks[et];
                    const grade = score ? getGrade(score) : "";
                    return (
                      <TableCell key={et} className="text-center p-2">
                        {score !== undefined && score !== null ? (
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-lg">{score}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getGradeColor(grade)}`}>
                              {grade}
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
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEditMarks(student, group)}
                          disabled={saving}
                          title="Edit marks"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteStudentMarks(student.id, group.subject_id, student.markIds)}
                          disabled={saving}
                          title="Delete all marks"
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

GroupCard.displayName = 'GroupCard';

export default function MarksPage() {
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

  // Role definitions
  const ADMIN_ROLES = ["Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"];
  const isAdmin = ADMIN_ROLES.includes(userRole);
  const isTeacher = userRole === "Teacher";
  
  // Permission logic
  const canEditGroup = (groupTeacherId: number): boolean => {
    if (isTeacher) {
      return groupTeacherId === currentUserId;
    }
    if (isAdmin) {
      const isViewingSelf = selectedTeacherId === "self" || selectedTeacherId === currentUserId?.toString();
      return isViewingSelf && groupTeacherId === currentUserId;
    }
    return false;
  };
  
  const canFilterByTeacher = isAdmin;

  // ============================================================
  // 🔥 NAVIGATE TO ADD MARKS - SECONDARY
  // ============================================================
  const navigateToAddMarks = () => {
    router.push("/secondary/marks/add");

  };

  // ============================================================
  // FETCH TEACHERS (For Admin)
  // ============================================================
  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/teachers", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  // ============================================================
  // FETCH AVAILABLE YEARS
  // ============================================================
  const fetchAvailableYears = async (authToken: string) => {
    try {
      const schoolId = localStorage.getItem("school_id");
      const response = await fetch(`/api/v1/marks/available-years?school_id=${schoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableYears(data.years);
        if (data.years.length > 0) {
          setSelectedYear(data.years[0]);
        }
      } else {
        setAvailableYears([new Date().getFullYear()]);
      }
    } catch (err) {
      console.error("Error fetching years:", err);
      setAvailableYears([new Date().getFullYear()]);
    }
  };

  // ============================================================
  // FETCH MARKS DATA
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
      let url = `/api/v1/marks/my-students?year=${yearToUse}&school_id=${schoolId}`;
      
      let effectiveTeacherId = teacherId;
      if (isAdmin && teacherId === "self") {
        effectiveTeacherId = currentUserId?.toString();
      }
      
      if (isAdmin && effectiveTeacherId && effectiveTeacherId !== "all" && effectiveTeacherId !== "self") {
        url += `&teacher_id=${effectiveTeacherId}`;
      }
      
      console.log("Fetching marks from:", url);
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const marksList: MarkFromAPI[] = data.marks || [];
      console.log("Received marks:", marksList.length);
      
      if (marksList.length === 0) {
        setGroups([]);
        setLoading(false);
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
            class_name: mark.class_name || "Unknown",
            stream_id: mark.stream_id || 0,
            stream_name: mark.stream_name || "",
            teacher_id: mark.teacher_id,
            teacher_name: mark.teacher_name || "Unknown",
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
      console.log("Groups created:", groupsArray.length);
      
    } catch (err: any) {
      console.error("Error fetching marks:", err);
      setError(err.message || "Failed to load marks data");
      setGroups([]);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isFetching.current = false;
    }
  }, [selectedYear, isAdmin, currentUserId]);

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
        
        let formattedRole = role || "Teacher";
        const roleMap: {[key: string]: string} = {
          "teacher": "Teacher",
          "academic": "Academic",
          "headmaster": "Headmaster",
          "headmistress": "Headmistress",
          "second master": "Second Master",
          "second mistress": "Second Mistress"
        };
        formattedRole = roleMap[formattedRole.toLowerCase()] || "Teacher";
        setUserRole(formattedRole);
        
        if (userId) {
          setCurrentUserId(parseInt(userId));
        }
        
        const isUserAdmin = ADMIN_ROLES.includes(formattedRole);
        
        await fetchAvailableYears(storedToken);
        
        if (isUserAdmin) {
          await fetchTeachers(storedToken);
        }
        
        await fetchMarksData(storedToken, undefined, "self");
        
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to initialize. Please refresh.");
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
    if (token) {
      await fetchMarksData(token, newYear, selectedTeacherId);
    }
  };

  // ============================================================
  // HANDLE TEACHER FILTER CHANGE (Admin only)
  // ============================================================
  const handleTeacherChange = async (value: string) => {
    setIsChangingTeacher(true);
    setSelectedTeacherId(value);
    setGroups([]);
    if (token) {
      await fetchMarksData(token, selectedYear, value);
    }
    setIsChangingTeacher(false);
  };

  // ============================================================
  // HANDLE EDIT MARKS
  // ============================================================
  const handleEditMarks = (student: StudentWithMarks, group: GroupData) => {
    if (!canEditGroup(group.teacher_id)) {
      setError("You don't have permission to edit these marks. Only the teacher who created them can edit.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    const formData: Record<string, string> = {};
    EXAM_TYPES.forEach(et => {
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
  // HANDLE UPDATE MARKS
  // ============================================================
  const handleUpdateMarks = async () => {
    if (!editingStudent) return;
    
    setSaving(true);
    setError("");
    setSuccess("");
    
    let savedCount = 0;
    
    for (const examType of EXAM_TYPES) {
      const newScore = editFormData[examType];
      const existingMarkId = editingStudent.markIds[examType];
      
      if (!newScore || newScore.trim() === "") continue;
      
      const score = parseFloat(newScore);
      if (isNaN(score) || score < 0 || score > 100) continue;
      
      try {
        if (existingMarkId) {
          const response = await fetch(`/api/v1/marks/${existingMarkId}`, {
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
          const response = await fetch("/api/v1/marks", {
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
      setSuccess(`Successfully saved ${savedCount} mark(s)`);
      setTimeout(() => setSuccess(""), 3000);
    }
    
    setSaving(false);
  };

  // ============================================================
  // HANDLE DELETE STUDENT MARKS
  // ============================================================
  const handleDeleteStudentMarks = async (studentId: number, subjectId: number, markIds: Record<string, number>) => {
    const group = groups.find(g => g.subject_id === subjectId);
    if (!group) return;
    
    if (!canEditGroup(group.teacher_id)) {
      setError("You don't have permission to delete these marks.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    if (!confirm("Are you sure you want to delete ALL marks for this student?")) return;
    
    for (const markId of Object.values(markIds)) {
      try {
        await fetch(`/api/v1/marks/${markId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error deleting mark:", err);
      }
    }
    
    setSuccess("Marks deleted successfully");
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
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Loading data...</p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 text-white shadow-xl">
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
                  <h1 className="text-2xl font-bold">Marks Management</h1>
                  <p className="text-blue-100 mt-1">
                    Role: {userRole} • {isAdmin ? "Administrator Access" : "Teacher Access"}
                  </p>
                </div>
                
                {/* 🔥 BUTTON YA ONGEZA ALAMA MPYA - SECONDARY */}
                <Button 
                  onClick={navigateToAddMarks}
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 gap-2 rounded-xl font-bold px-6 py-6"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add New Marks
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Year Filter */}
                {availableYears.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Select Year
                    </Label>
                    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {availableYears.map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Teacher Filter - Admin Only */}
                {canFilterByTeacher && teachers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-indigo-600" />
                      Filter by Teacher
                    </Label>
                    <Select value={selectedTeacherId} onValueChange={handleTeacherChange} disabled={isChangingTeacher}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="self" className="font-bold text-blue-600 bg-blue-50">
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            My Students (Classes I Teach)
                          </div>
                        </SelectItem>
                        <div className="border-t my-1" />
                        {teachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name} {currentUserId === teacher.id ? "(You)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Status Messages */}
                    {selectedTeacherId === "self" && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        Showing marks for classes you teach - You can edit these marks
                      </p>
                    )}
                    {selectedTeacherId !== "self" && selectedTeacherId && selectedTeacherId !== currentUserId?.toString() && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View only mode - You cannot edit other teachers' marks
                      </p>
                    )}
                    {selectedTeacherId === currentUserId?.toString() && selectedTeacherId !== "self" && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        ✏️ You can edit these marks (this is your own data)
                      </p>
                    )}
                    {isChangingTeacher && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading teacher data...
                      </p>
                    )}
                  </div>
                )}

                {/* Permission Info */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    Current Mode
                  </Label>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isAdmin && selectedTeacherId === "self" ? 'bg-emerald-100 text-emerald-700' :
                    isAdmin && selectedTeacherId !== "self" && selectedTeacherId !== currentUserId?.toString() ? 'bg-amber-100 text-amber-700' :
                    isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {isAdmin && selectedTeacherId === "self" && (
                      <span>✏️ Edit Mode - You can modify your own marks</span>
                    )}
                    {isAdmin && selectedTeacherId !== "self" && selectedTeacherId !== currentUserId?.toString() && (
                      <span>👁️ View Only - You cannot edit other teachers' marks</span>
                    )}
                    {isAdmin && selectedTeacherId === currentUserId?.toString() && selectedTeacherId !== "self" && (
                      <span>✏️ Edit Mode - You can modify your own marks</span>
                    )}
                    {isTeacher && (
                      <span>✏️ Full Access - You can edit your marks</span>
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
              <AlertCircle className="h-5 w-5" /> {error}
            </div>
          )}

          {/* Search */}
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by subject, class, teacher, student name, or roll number..."
                  className="pl-10 bg-white focus:ring-2 focus:ring-blue-500"
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
                <p className="text-lg font-semibold">No marks found</p>
                <p className="text-sm mt-2">Year {selectedYear}</p>
                {isAdmin && selectedTeacherId === "self" && (
                  <p className="text-sm mt-2">You don't have any marks for classes you teach in {selectedYear}.</p>
                )}
                {isAdmin && selectedTeacherId !== "self" && (
                  <p className="text-sm mt-2">Try selecting a different teacher from the filter above.</p>
                )}
                {isTeacher && (
                  <p className="text-sm mt-2">Try changing the year or add new marks.</p>
                )}
                {/* 🔥 BUTTON YA ONGEZA ALAMA - SECONDARY */}
                <Button 
                  onClick={navigateToAddMarks}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Marks
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Groups Display */}
          {groups.length > 0 && (
            <>
              <div className="space-y-6">
                {paginatedGroups.map((group, idx) => (
                  <GroupCard
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
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Next <ChevronRight className="h-4 w-4" />
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
            <DialogTitle>Edit Marks</DialogTitle>
            <DialogDescription>
              {editingStudent && `Edit marks for ${editingStudent.student_name} - ${editingStudent.subject_name}`}
              <span className="block text-blue-600 text-sm mt-1">📊 Secondary School - Marks 0-100</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {EXAM_TYPES.map((examType) => (
              <div key={examType} className="grid grid-cols-3 gap-4 items-center">
                <Label className="font-semibold">{examType}</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  className="col-span-2 bg-white"
                  placeholder="0-100"
                  value={editFormData[examType] || ""}
                  onChange={(e) => {
                    setEditFormData({...editFormData, [examType]: e.target.value});
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditMarks(false)}>Cancel</Button>
            <Button onClick={handleUpdateMarks} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Save All Marks"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}