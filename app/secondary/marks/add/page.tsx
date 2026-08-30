// app/secondary/marks/add/page.tsx

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
import {
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
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

const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback"
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="text-sm font-medium">Rudi</span>
    </button>
  );
}

function MobileHeader({
  title,
  subtitle,
  icon,
  badge,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-xl mb-4 sm:mb-6">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-blue-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </Card>
  );
}

function MobileAlert({
  type,
  message,
}: {
  type: "success" | "error" | "info" | "warning";
  message: string;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-md animate-slideIn",
        styles[type]
      )}
    >
      {icons[type]}
      <p className="text-sm sm:text-base break-words">{message}</p>
    </div>
  );
}

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[700px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function AddMarksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [schoolId, setSchoolId] = useState<string>("");

  // Data from API
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);

  // Filtered data
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
  // 🔥 FETCH DATA - SUBJECTS, CLASSES, STREAMS
  // ============================================================
  const fetchData = async (authToken: string) => {
    try {
      const storedSchoolId = localStorage.getItem("school_id");
      setSchoolId(storedSchoolId || "");

      // 🔥 1. GET TEACHER'S SUBJECTS
      const subjectsUrl = `${API_BASE}/api/v1/teachers/me/subjects`;
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

      // 🔥 2. GET CLASSES
      const classesUrl = `${API_BASE}/api/v1/classes?school_id=${storedSchoolId}`;
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

      // 🔥 3. GET STREAMS
      const streamsUrl = `${API_BASE}/api/v1/streams?school_id=${storedSchoolId}`;
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

      // 🔥 4. FILTER CLASSES BY SUBJECT
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
  // 🔥 FILTER FUNCTIONS
  // ============================================================
  const filterClassesBySubject = (subjectId: number) => {
    setFilteredClasses(classes);
    setFormData((prev) => ({ ...prev, class_id: "", stream_id: "all" }));
    setStudents([]);
  };

  const filterStreamsByClass = (classId: number) => {
    const filtered = streams.filter((s) => s.class_id === classId);
    setFilteredStreams(filtered);
    setFormData((prev) => ({ ...prev, stream_id: "all" }));
    setStudents([]);
  };

  // ============================================================
  // 🔥 FETCH STUDENTS
  // ============================================================
  const fetchStudents = async () => {
    const { class_id, stream_id, subject_id } = formData;
    if (!class_id || !subject_id) return;

    setLoadingStudents(true);
    setError("");

    try {
      const storedSchoolId = localStorage.getItem("school_id");

      let url = `${API_BASE}/api/v1/students?class_id=${class_id}&school_id=${storedSchoolId}`;
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

        // Check if students already have marks
        const checkUrl = `${API_BASE}/api/v1/marks/check?subject_id=${subject_id}&exam_type=${formData.exam_type}&class_id=${class_id}&school_id=${storedSchoolId}`;
        const checkResponse = await fetch(checkUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let markedStudentIds: number[] = [];
        if (checkResponse.ok) {
          const marksData = await checkResponse.json();
          markedStudentIds = marksData.map((m: any) => m.student_id);
        }

        // Filter out students who already have marks
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
  // 🔥 USE EFFECTS
  // ============================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, [router]);

  useEffect(() => {
    if (formData.subject_id && classes.length > 0) {
      filterClassesBySubject(parseInt(formData.subject_id));
    }
  }, [formData.subject_id, classes]);

  useEffect(() => {
    if (formData.class_id && streams.length > 0) {
      filterStreamsByClass(parseInt(formData.class_id));
    }
  }, [formData.class_id, streams]);

  useEffect(() => {
    if (
      formData.class_id &&
      formData.class_id !== "" &&
      formData.subject_id &&
      formData.subject_id !== "" &&
      formData.exam_type
    ) {
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
  // 🔥 SAVE ALL MARKS
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

    let savedCount = 0;
    let failedCount = 0;

    for (const student of students) {
      const score = studentMarks.get(student.id);
      if (score && score.trim() !== "") {
        const scoreNum = parseFloat(score);

        // Secondary: 0-100
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

          const url = `${API_BASE}/api/v1/marks`;
          console.log(`📤 Sending to: ${url}`);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
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
      setSuccess(
        `Successfully saved ${savedCount} marks. ${failedCount > 0 ? `${failedCount} failed.` : ""}`
      );
      const newMarks = new Map<number, string>();
      students.forEach((student) => {
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
      students.forEach((student) => {
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
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading data...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Add Marks"
          subtitle="Secondary School - Marks 0-100"
          icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-yellow-500/30 text-yellow-200 border border-yellow-400/30 text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              {subjects.length} Subjects
            </span>
          }
        />

        {/* Selection Form */}
        <MobileCard>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-blue-800 text-base sm:text-lg">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
              Select Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {error && !subjects.length && (
              <MobileAlert type="error" message={error} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* SUBJECT */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Subject *
                </Label>
                <Select value={formData.subject_id} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue
                      placeholder={
                        subjects.length > 0 ? "Select Subject" : "No Subjects Assigned"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {subjects.length > 0 && (
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {subjects.length} subjects assigned to you
                  </p>
                )}
              </div>

              {/* CLASS */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                  Class *
                </Label>
                <Select
                  value={formData.class_id}
                  onValueChange={handleClassChange}
                  disabled={!formData.subject_id || filteredClasses.length === 0}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue
                      placeholder={
                        !formData.subject_id
                          ? "Select Subject First"
                          : filteredClasses.length === 0
                          ? "No Classes"
                          : "Select Class"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {filteredClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.subject_id && filteredClasses.length === 0 && (
                  <p className="text-[10px] sm:text-xs text-amber-600">
                    ⚠️ No classes for this subject
                  </p>
                )}
              </div>

              {/* STREAM */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                  <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                  Stream (Optional)
                </Label>
                <Select
                  value={formData.stream_id || "all"}
                  onValueChange={handleStreamChange}
                  disabled={!formData.class_id || filteredStreams.length === 0}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue
                      placeholder={
                        !formData.class_id
                          ? "Select Class First"
                          : filteredStreams.length === 0
                          ? "No Streams"
                          : "All Streams"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="all">✅ All Streams</SelectItem>
                    {filteredStreams.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        Stream {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.class_id && filteredStreams.length > 0 && (
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {filteredStreams.length} streams available
                  </p>
                )}
              </div>

              {/* EXAM TYPE */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                  Exam Type *
                </Label>
                <Select value={formData.exam_type} onValueChange={handleExamTypeChange}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select Exam Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {EXAM_TYPES.map((et) => (
                      <SelectItem key={et} value={et}>
                        {et}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </MobileCard>

        {/* Students Table */}
        {students.length > 0 && (
          <MobileCard>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 gap-3 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-emerald-800 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>
                  Students
                  {formData.stream_id && formData.stream_id !== "all"
                    ? ` (Stream ${
                        filteredStreams.find((s) => s.id.toString() === formData.stream_id)
                          ?.name
                      })`
                    : " (All Streams)"}
                </span>
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Total: {students.length})
                </span>
              </CardTitle>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleBulkFill}
                  className="gap-1 sm:gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback flex-1 sm:flex-none"
                >
                  📝 Bulk Fill
                </Button>
                <Button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback flex-1 sm:flex-none"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                  {saving ? "Saving..." : "Save All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingStudents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-3 sm:p-4">
                      <MobileAlert type="error" message={error} />
                    </div>
                  )}
                  {success && (
                    <div className="p-3 sm:p-4">
                      <MobileAlert type="success" message={success} />
                    </div>
                  )}
                  <MobileTableWrapper>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                          <TableHead className="min-w-[120px] text-xs sm:text-sm">Student Name</TableHead>
                          <TableHead className="min-w-[50px] text-center text-xs sm:text-sm hidden xs:table-cell">Gender</TableHead>
                          <TableHead className="min-w-[80px] text-xs sm:text-sm hidden sm:table-cell">Roll Number</TableHead>
                          <TableHead className="min-w-[80px] text-xs sm:text-sm hidden md:table-cell">Class</TableHead>
                          <TableHead className="min-w-[70px] text-xs sm:text-sm hidden lg:table-cell">Stream</TableHead>
                          <TableHead className="min-w-[120px] text-center text-xs sm:text-sm">
                            Score (0-100)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student, idx) => {
                          const className = classes.find((c) => c.id === student.class_id)
                            ?.name || "—";
                          const streamName = streams.find((s) => s.id === student.stream_id)
                            ?.name || "—";

                          return (
                            <TableRow
                              key={student.id}
                              className="hover:bg-blue-50/50 transition-colors"
                            >
                              <TableCell className="text-center text-xs sm:text-sm font-medium text-gray-500">
                                {idx + 1}
                              </TableCell>
                              <TableCell className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                                {student.name}
                              </TableCell>
                              <TableCell className="text-center hidden xs:table-cell">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                                    student.sex === "M"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-pink-100 text-pink-800"
                                  }`}
                                >
                                  {student.sex === "M" ? "M" : "F"}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-[10px] sm:text-sm hidden sm:table-cell">
                                {student.roll_number || "-"}
                              </TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm hidden md:table-cell">
                                <span className="inline-flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3 text-indigo-400" />
                                  {className}
                                </span>
                              </TableCell>
                              <TableCell className="text-gray-600 text-xs sm:text-sm hidden lg:table-cell">
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
                                  className="w-24 sm:w-32 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-center h-9 sm:h-10 text-sm"
                                  placeholder="0-100"
                                  value={studentMarks.get(student.id) || ""}
                                  onChange={(e) =>
                                    handleMarkChange(student.id, e.target.value)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </MobileTableWrapper>

                  {/* Summary Footer */}
                  <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 mx-3 sm:mx-4 mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Total Students:{" "}
                      <span className="font-bold text-gray-800">{students.length}</span>
                      {students.some(
                        (s) =>
                          studentMarks.get(s.id) && studentMarks.get(s.id)!.trim() !== ""
                      ) && (
                        <span className="ml-3 sm:ml-4">
                          Filled:{" "}
                          <span className="font-bold text-emerald-600">
                            {
                              students.filter(
                                (s) =>
                                  studentMarks.get(s.id) &&
                                  studentMarks.get(s.id)!.trim() !== ""
                              ).length
                            }
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </MobileCard>
        )}

        {/* No Subjects Assigned */}
        {!loading && subjects.length === 0 && (
          <MobileCard>
            <CardContent className="py-12 sm:py-16 text-center">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-amber-500 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-semibold text-gray-700">
                No Subjects Assigned
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto px-4">
                You have not been assigned any subjects. Please contact the Headmaster or
                Academic.
              </p>
            </CardContent>
          </MobileCard>
        )}

        {/* All Students Already Have Marks */}
        {!loading &&
          subjects.length > 0 &&
          formData.subject_id &&
          formData.class_id &&
          students.length === 0 && (
            <MobileCard>
              <CardContent className="py-12 sm:py-16 text-center">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-emerald-500 mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-semibold text-gray-700">
                  All Students Have Marks!
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto px-4">
                  All students in this class already have marks for this subject.
                </p>
                <Button
                  onClick={() => {
                    setFormData({ ...formData, class_id: "", stream_id: "all" });
                    setStudents([]);
                  }}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-feedback"
                >
                  Select Another Class
                </Button>
              </CardContent>
            </MobileCard>
          )}

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100">
          <p>© 2026 MASI FAST RESULTS • Marks Entry</p>
          <p className="mt-0.5">Secondary School • Marks 0-100</p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }

        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        @media (max-width: 399px) {
          .xs\\:table-cell {
            display: table-cell !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:table-cell {
            display: none !important;
          }
          .xs\\:hidden {
            display: table-cell !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}