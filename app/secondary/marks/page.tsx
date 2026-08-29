// app/secondary/marks/page.tsx
// 🔥 VERSION 4.0 - FULLY FIXED WITH PROPER ROLE MAPPING!

"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronDown,
  ChevronUp,
  Users,
  GraduationCap,
  Layers,
  Trophy,
  Filter,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
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
  school_id?: number;
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
  school_id: number;
  students: StudentWithMarks[];
}

interface Teacher {
  id: number;
  name: string;
}

// ============================================================
// 🔥 CONSTANTS
// ============================================================
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
  const colors: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-800",
    B: "bg-blue-100 text-blue-800",
    C: "bg-amber-100 text-amber-800",
    D: "bg-orange-100 text-orange-800",
    F: "bg-red-100 text-red-800",
  };
  return colors[grade] || "bg-gray-100 text-gray-800";
};

const ADMIN_ROLES = ["Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"];

// ============================================================
// 🔥 COMPONENTS
// ============================================================

const MobileBackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
    >
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

// ============================================================
// GROUP CARD
// ============================================================
const GroupCard = memo(
  ({
    group,
    canEditGroup,
    saving,
    handleEditMarks,
    handleDeleteStudentMarks,
  }: any) => {
    const sortedStudents = [...group.students].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0">
        {/* Header */}
        <div
          className={cn(
            "p-4 sm:p-5 cursor-pointer transition-all duration-300",
            canEditGroup
              ? "bg-gradient-to-r from-blue-600 to-indigo-600"
              : "bg-gradient-to-r from-gray-600 to-gray-700"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 text-white flex-wrap min-w-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="font-bold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[200px]">
                {group.subject_name}
              </span>
              <span className="text-white/40 hidden xs:inline">|</span>
              <span className="text-xs sm:text-sm text-white/80 hidden xs:inline">
                {group.class_name}
              </span>
              <span className="text-white/40 hidden sm:inline">|</span>
              <span className="text-xs sm:text-sm text-white/70 hidden sm:inline">
                Stream {group.stream_name}
              </span>
              <span className="text-white/40 hidden md:inline">|</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
                👨‍🏫 {group.teacher_name || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {!canEditGroup && (
                <span className="text-[10px] sm:text-xs bg-amber-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center gap-1">
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> View Only
                </span>
              )}
              {canEditGroup && (
                <span className="text-[10px] sm:text-xs bg-emerald-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center gap-1">
                  ✏️ Can Edit
                </span>
              )}
              <span className="text-[10px] sm:text-xs bg-white/20 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-white">
                📊 {sortedStudents.length}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              ) : (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollable">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="min-w-[140px] text-xs sm:text-sm">Student Name</TableHead>
                    <TableHead className="min-w-[80px] text-xs sm:text-sm hidden sm:table-cell">
                      Roll No
                    </TableHead>
                    {EXAM_TYPES.map((et) => (
                      <TableHead
                        key={et}
                        className="text-center min-w-[60px] sm:min-w-[80px] bg-gradient-to-r from-blue-50 to-indigo-50"
                      >
                        <span className="font-bold text-blue-700 text-[8px] sm:text-xs">
                          {et}
                        </span>
                      </TableHead>
                    ))}
                    {canEditGroup && (
                      <TableHead className="text-center w-16 sm:w-24 text-xs sm:text-sm">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((student: StudentWithMarks, studentIdx: number) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                    >
                      <TableCell className="text-center text-xs sm:text-sm font-medium text-gray-500">
                        {studentIdx + 1}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[8px] sm:text-xs font-bold flex-shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                        {student.roll_number || "-"}
                      </TableCell>
                      {EXAM_TYPES.map((et) => {
                        const score = student.marks[et];
                        const grade = score ? getGrade(score) : "";
                        return (
                          <TableCell key={et} className="text-center p-1 sm:p-2">
                            {score !== undefined && score !== null ? (
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-xs sm:text-base">
                                  {score}
                                </span>
                                <span
                                  className={cn(
                                    "text-[8px] sm:text-xs px-1.5 py-0.5 rounded-full",
                                    getGradeColor(grade)
                                  )}
                                >
                                  {grade}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-xs sm:text-lg">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                      {canEditGroup && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              onClick={() => handleEditMarks(student, group)}
                              disabled={saving}
                              title="Edit marks"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              onClick={() =>
                                handleDeleteStudentMarks(
                                  student.id,
                                  group.subject_id,
                                  student.markIds
                                )
                              }
                              disabled={saving}
                              title="Delete all marks"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
        )}
      </Card>
    );
  }
);

GroupCard.displayName = "GroupCard";

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
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
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null);

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
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");
  const [isChangingTeacher, setIsChangingTeacher] = useState(false);

  // 🔥 HELPER: Get teacher name from teachers array
  const getTeacherName = useCallback((teacherId: number): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "Unknown";
  }, [teachers]);

  // 🔥 ROLE DEFINITIONS - HII INAAMUA KAMA NI ADMIN AU TEACHER!
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
  // 🔥 NAVIGATE TO ADD MARKS
  // ============================================================
  const navigateToAddMarks = () => {
    router.push("/secondary/marks/add");
  };

  // ============================================================
  // FETCH TEACHERS (For Admin)
  // ============================================================
  const fetchTeachers = async (authToken: string) => {
    try {
      console.log("📡 Fetching teachers for secondary...");
      const response = await fetch(`${API_BASE}/api/v1/teachers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
        console.log(`✅ Found ${data.length} teachers`);
      } else {
        console.warn("⚠️ Failed to fetch teachers");
        setTeachers([]);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachers([]);
    }
  };

  // ============================================================
  // FETCH AVAILABLE YEARS
  // ============================================================
  const fetchAvailableYears = async (authToken: string) => {
    try {
      const schoolId = localStorage.getItem("school_id");
      const response = await fetch(
        `${API_BASE}/api/v1/marks/available-years?school_id=${schoolId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
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
  // 🔥 FETCH MARKS DATA - SHOW ALL BY DEFAULT + MULTI-TENANT SAFE!
  // ============================================================
  const fetchMarksData = useCallback(
    async (authToken: string, year?: number, teacherId?: string) => {
      if (isFetching.current) return;
      if (!isMounted.current) return;

      isFetching.current = true;
      setLoading(true);
      setError("");

      try {
        const schoolId = localStorage.getItem("school_id");
        const yearToUse = year || selectedYear;
        
        let url = `${API_BASE}/api/v1/marks/my-students?year=${yearToUse}&school_id=${schoolId}`;

        let effectiveTeacherId = teacherId;
        if (isAdmin && teacherId === "self") {
          effectiveTeacherId = currentUserId?.toString();
        }

        if (
          effectiveTeacherId &&
          effectiveTeacherId !== "all" &&
          effectiveTeacherId !== "self"
        ) {
          url += `&teacher_id=${effectiveTeacherId}`;
        }

        console.log(`📡 Fetching marks for teacher: ${effectiveTeacherId || "all"}`);
        console.log(`📡 URL: ${url}`);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const marksList: MarkFromAPI[] = data.marks || [];
        console.log(`📊 Received marks: ${marksList.length}`);

        if (marksList.length === 0) {
          setGroups([]);
          setLoading(false);
          return;
        }

        // 🔥 BUILD GROUPS - MULTI-TENANT SAFE!
        const groupMap = new Map<string, GroupData>();
        const schoolIdNum = schoolId ? parseInt(schoolId) : 1;

        for (const mark of marksList) {
          // 🔥 KEY: school_id + teacher_id + subject_id + class_id + stream_id
          const key = `${schoolIdNum}-${mark.teacher_id}-${mark.subject_id}-${mark.class_id || 0}-${mark.stream_id || 0}`;

          if (!groupMap.has(key)) {
            // 🔥 GET TEACHER NAME - FROM API OR TEACHERS ARRAY!
            let teacherName = mark.teacher_name || "Unknown";
            
            // If API doesn't return teacher_name, try from teachers array
            if (teacherName === "Unknown" || teacherName === "") {
              const foundTeacher = getTeacherName(mark.teacher_id);
              if (foundTeacher !== "Unknown") {
                teacherName = foundTeacher;
              }
            }

            groupMap.set(key, {
              subject_id: mark.subject_id,
              subject_name: mark.subject_name,
              class_id: mark.class_id || 0,
              class_name: mark.class_name || "Unknown",
              stream_id: mark.stream_id || 0,
              stream_name: mark.stream_name || "",
              teacher_id: mark.teacher_id,
              teacher_name: teacherName,
              school_id: schoolIdNum,
              students: [],
            });
          }

          const group = groupMap.get(key)!;
          let student = group.students.find((s) => s.id === mark.student_id);

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
        console.log(`📚 Groups created: ${groupsArray.length}`);
        
        const teachersWithMarks = new Set(groupsArray.map(g => g.teacher_name));
        console.log(`👨‍🏫 Teachers with marks:`, Array.from(teachersWithMarks));
        console.log(`📋 Groups:`, groupsArray.map(g => `${g.teacher_name} - ${g.subject_name} - ${g.class_name} (${g.stream_name})`));
        
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
    },
    [selectedYear, isAdmin, currentUserId, getTeacherName]
  );

  // ============================================================
  // 🔥🔥🔥 INITIALIZATION - FIXED WITH PROPER ROLE MAPPING! 🔥🔥🔥
  // ============================================================
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const role = localStorage.getItem("user_type");
        const userId = localStorage.getItem("user_id") || localStorage.getItem("teacher_id");
        const schoolId = localStorage.getItem("school_id");

        if (!storedToken) {
          router.push("/login");
          return;
        }

        setToken(storedToken);
        setUserSchoolId(schoolId ? parseInt(schoolId) : null);

        // 🔥🔥🔥 FIX: PROPER ROLE MAPPING - KISWAHILI + KINGEREZA! 🔥🔥🔥
        let formattedRole = role || "Teacher";
        const roleMap: { [key: string]: string } = {
          // ✅ ROLES ZA KISWAHILI (kutoka localStorage)
          "mtaaluma": "Academic",
          "mwalimu mkuu": "Headmaster",
          "mwalimu mkuu msaidizi": "Second Master",
          "mwalimu": "Teacher",
          "mhasibu": "Accountant",
          "msimamizi mkuu": "SuperAdmin",
          
          // ✅ ROLES ZA KINGEREZA (kwa usalama - ikiwa zipo)
          "academic": "Academic",
          "headmaster": "Headmaster",
          "headmistress": "Headmistress",
          "second master": "Second Master",
          "second mistress": "Second Mistress",
          "teacher": "Teacher",
          "superadmin": "SuperAdmin",
          "accountant": "Accountant",
        };
        formattedRole = roleMap[formattedRole.toLowerCase()] || "Teacher";
        setUserRole(formattedRole);

        console.log("🔍 Original role from localStorage:", role);
        console.log("🔍 Mapped role:", formattedRole);

        if (userId) {
          setCurrentUserId(parseInt(userId));
        }

        const isUserAdmin = ADMIN_ROLES.includes(formattedRole);

        await fetchAvailableYears(storedToken);

        // 🔥 ENSURE TEACHERS ARE FETCHED FOR ADMIN!
        if (isUserAdmin) {
          await fetchTeachers(storedToken);
        }

        // 🔥 DEFAULT: SHOW ALL MARKS ("all" INSTEAD OF "self")
        await fetchMarksData(storedToken, undefined, "all");
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
      setError(
        "You don't have permission to edit these marks. Only the teacher who created them can edit."
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    const formData: Record<string, string> = {};
    EXAM_TYPES.forEach((et) => {
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
          const response = await fetch(`${API_BASE}/api/v1/marks/${existingMarkId}`, {
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
          const response = await fetch(`${API_BASE}/api/v1/marks`, {
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
  const handleDeleteStudentMarks = async (
    studentId: number,
    subjectId: number,
    markIds: Record<string, number>
  ) => {
    const group = groups.find((g) => g.subject_id === subjectId);
    if (!group) return;

    if (!canEditGroup(group.teacher_id)) {
      setError("You don't have permission to delete these marks.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!confirm("Are you sure you want to delete ALL marks for this student?")) return;

    for (const markId of Object.values(markIds)) {
      try {
        await fetch(`${API_BASE}/api/v1/marks/${markId}`, {
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
  const filteredGroups = groups.filter((group) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      group.subject_name.toLowerCase().includes(searchLower) ||
      group.class_name.toLowerCase().includes(searchLower) ||
      group.teacher_name.toLowerCase().includes(searchLower) ||
      group.students.some(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.roll_number?.toLowerCase().includes(searchLower)
      )
    );
  });

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔥🔥🔥 STATS - UNIQUE CALCULATIONS! 🔥🔥🔥
  const uniqueStudents = new Set<number>();
  const uniqueTeachers = new Set<number>();
  const uniqueClasses = new Set<string>();
  const uniqueSubjects = new Set<string>();
  const uniqueGroups = new Set<string>();

  groups.forEach((group) => {
    if (group.teacher_id) {
      uniqueTeachers.add(group.teacher_id);
    }
    if (group.class_name && group.class_name !== "Unknown") {
      uniqueClasses.add(group.class_name);
    }
    if (group.subject_name) {
      uniqueSubjects.add(group.subject_name);
    }
    const groupKey = `${group.subject_id}-${group.class_id}-${group.stream_id}`;
    uniqueGroups.add(groupKey);
    group.students.forEach((student) => {
      uniqueStudents.add(student.id);
    });
  });

  const totalStudents = uniqueStudents.size;
  const totalTeachers = uniqueTeachers.size;
  const totalClasses = uniqueClasses.size;
  const totalSubjects = uniqueSubjects.size;
  const totalGroups = uniqueGroups.size;

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading marks...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <School className="h-6 w-6 sm:h-8 sm:w-8" />
                  <div className="h-4 w-px sm:h-6 sm:w-px bg-white/30" />
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">Marks Management</h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
                  Role: {userRole} • {isAdmin ? "Administrator Access" : "Teacher Access"}
                </p>
              </div>

              <Button
                onClick={navigateToAddMarks}
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 gap-1.5 sm:gap-2 rounded-xl font-bold px-3 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm h-auto touch-feedback"
              >
                <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Add New Marks</span>
                <span className="xs:hidden">Add Marks</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 🔥🔥🔥 STATS GRID 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Groups
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalGroups}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Students
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStudents}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Total Teachers
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalTeachers}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Year
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {selectedYear}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Year Filter */}
              {availableYears.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    Select Year
                  </Label>
                  <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Teacher Filter - Admin Only */}
              {canFilterByTeacher && teachers.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <UserCog className="h-3.5 w-3.5 text-indigo-600" />
                    Filter by Teacher
                  </Label>
                  <Select
                    value={selectedTeacherId}
                    onValueChange={handleTeacherChange}
                    disabled={isChangingTeacher}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      <SelectItem value="all" className="font-bold text-blue-600 bg-blue-50">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-blue-500" />
                          All Teachers
                        </div>
                      </SelectItem>
                      <SelectItem value="self" className="font-bold text-emerald-600 bg-emerald-50">
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-yellow-500" />
                          My Students
                        </div>
                      </SelectItem>
                      <div className="border-t my-1" />
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.name} {currentUserId === teacher.id ? "(You)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Messages */}
                  {selectedTeacherId === "all" && (
                    <p className="text-[10px] sm:text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-500" />
                      Showing all teachers' marks
                    </p>
                  )}
                  {selectedTeacherId === "self" && (
                    <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      Showing your own marks - You can edit these
                    </p>
                  )}
                  {selectedTeacherId !== "all" &&
                    selectedTeacherId !== "self" &&
                    selectedTeacherId !== currentUserId?.toString() && (
                      <p className="text-[10px] sm:text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View only mode - You cannot edit other teachers' marks
                      </p>
                    )}
                  {selectedTeacherId === currentUserId?.toString() && (
                    <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      Showing your marks - You can edit these
                    </p>
                  )}
                  {isChangingTeacher && (
                    <p className="text-[10px] sm:text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading teacher data...
                    </p>
                  )}
                </div>
              )}

              {/* Permission Info */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-purple-600" />
                  Current Mode
                </Label>
                <div
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs sm:text-sm font-medium",
                    selectedTeacherId === "all"
                      ? "bg-blue-100 text-blue-700"
                      : selectedTeacherId === "self" || selectedTeacherId === currentUserId?.toString()
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {selectedTeacherId === "all" && (
                    <span>👁️ View All - Showing all teachers' marks</span>
                  )}
                  {(selectedTeacherId === "self" || selectedTeacherId === currentUserId?.toString()) && (
                    <span>✏️ Edit Mode - You can modify your own marks</span>
                  )}
                  {selectedTeacherId !== "all" &&
                    selectedTeacherId !== "self" &&
                    selectedTeacherId !== currentUserId?.toString() && (
                      <span>👁️ View Only - You cannot edit other teachers' marks</span>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-md animate-slideIn">
            <CheckCircle className="h-5 w-5" /> {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-md animate-slideIn">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        {/* Search */}
        <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by subject, class, teacher, student name, or roll number..."
                className="pl-10 bg-white focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* No Data */}
        {groups.length === 0 && !loading && (
          <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
            <CardContent className="py-12 sm:py-16 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700">No marks found</p>
              <p className="text-sm text-gray-500 mt-2">Year {selectedYear}</p>
              {selectedTeacherId === "all" && (
                <p className="text-sm text-gray-500 mt-2">
                  No marks found for any teacher in {selectedYear}.
                </p>
              )}
              {selectedTeacherId === "self" && (
                <p className="text-sm text-gray-500 mt-2">
                  You haven't added any marks for your students in {selectedYear}.
                </p>
              )}
              {selectedTeacherId !== "all" &&
                selectedTeacherId !== "self" && (
                  <p className="text-sm text-gray-500 mt-2">
                    No marks found for the selected teacher in {selectedYear}.
                  </p>
                )}
              <Button
                onClick={navigateToAddMarks}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2 shadow-lg hover:shadow-xl transition-all rounded-xl touch-feedback"
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
            <div className="space-y-4 sm:space-y-6">
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
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="gap-1 sm:gap-2 rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Previous</span>
                </Button>
                <span className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1 sm:gap-2 rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Marks Management</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📊 {totalGroups} groups</span>
            <span>•</span>
            <span>👨‍🎓 {totalStudents} students</span>
            <span>•</span>
            <span>👨‍🏫 {totalTeachers} teachers</span>
            <span>•</span>
            <span>📅 {selectedYear}</span>
          </p>
        </div>
      </div>

      {/* Edit Marks Dialog */}
      <Dialog open={openEditMarks} onOpenChange={setOpenEditMarks}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Marks
            </DialogTitle>
            <DialogDescription>
              {editingStudent &&
                `Edit marks for ${editingStudent.student_name} - ${editingStudent.subject_name}`}
              <span className="block text-blue-600 text-xs sm:text-sm mt-1">
                📊 Secondary School - Marks 0-100
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            {EXAM_TYPES.map((examType) => (
              <div key={examType} className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                <Label className="font-semibold text-gray-700 text-xs sm:text-sm">{examType}</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  className="col-span-2 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-9 sm:h-10 text-sm"
                  placeholder="0-100"
                  value={editFormData[examType] || ""}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, [examType]: e.target.value });
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOpenEditMarks(false)} className="touch-feedback">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateMarks}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-feedback"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save All Marks"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }

        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        @media (max-width: 399px) {
          .xs\\:inline {
            display: inline !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:inline {
            display: none !important;
          }
          .xs\\:hidden {
            display: inline !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}