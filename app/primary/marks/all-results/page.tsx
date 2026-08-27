"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Edit, AlertTriangle } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
}

interface GroupData {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  students: Map<number, { 
    name: string; 
    marks: Map<string, number>; 
    markIds: Map<string, number>;
  }>;
  exam_types: Set<string>;
}

interface TeacherGroup {
  teacher_id: number;
  teacher_name: string;
  groups: GroupData[];
}

export default function MatokeoYaWalimuWotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  
  // Filter states
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);
  
  // Data states
  const [teacherGroups, setTeacherGroups] = useState<TeacherGroup[]>([]);
  const [teachersWithoutMarks, setTeachersWithoutMarks] = useState<Teacher[]>([]);
  const [allExamTypes, setAllExamTypes] = useState<string[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    setToken(storedToken);
    setUserRole(role || "");
    fetchTeachers(storedToken);
    fetchAllResults(storedToken);
  }, [router]);

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

  const fetchAllResults = async (authToken: string, teacherId?: string, year?: string) => {
    try {
      setLoading(true);
      
      let url = "/api/v1/marks/all-results";
      const params = new URLSearchParams();
      if (teacherId) params.append("teacher_id", teacherId);
      if (year) params.append("year", year);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch results");
      
      const data = await response.json();
      
      // Process data into groups
      const teacherMap = new Map<number, TeacherGroup>();
      const allExamSet = new Set<string>();
      const teachersWithMarksSet = new Set<number>();
      
      for (const mark of data.marks || []) {
        teachersWithMarksSet.add(mark.teacher_id);
        allExamSet.add(mark.exam_type);
        
        if (!teacherMap.has(mark.teacher_id)) {
          teacherMap.set(mark.teacher_id, {
            teacher_id: mark.teacher_id,
            teacher_name: mark.teacher_name,
            groups: [],
          });
        }
        
        const teacher = teacherMap.get(mark.teacher_id)!;
        const groupKey = `${mark.subject_id}-${mark.class_id}-${mark.stream_id}`;
        let group = teacher.groups.find(g => 
          g.subject_id === mark.subject_id && 
          g.class_id === mark.class_id && 
          g.stream_id === mark.stream_id
        );
        
        if (!group) {
          group = {
            subject_id: mark.subject_id,
            subject_name: mark.subject_name,
            class_id: mark.class_id,
            class_name: mark.class_name,
            stream_id: mark.stream_id,
            stream_name: mark.stream_name,
            students: new Map(),
            exam_types: new Set(),
          };
          teacher.groups.push(group);
        }
        
        group.exam_types.add(mark.exam_type);
        
        if (!group.students.has(mark.student_id)) {
          group.students.set(mark.student_id, {
            name: mark.student_name,
            marks: new Map(),
            markIds: new Map(),
          });
        }
        
        const student = group.students.get(mark.student_id)!;
        student.marks.set(mark.exam_type, mark.score);
        student.markIds.set(mark.exam_type, mark.id);
      }
      
      // Convert to array and sort
      const teacherGroupsArray = Array.from(teacherMap.values()).map(teacher => ({
        ...teacher,
        groups: teacher.groups,
      }));
      
      setTeacherGroups(teacherGroupsArray);
      setAllExamTypes(Array.from(allExamSet).sort());
      
      // Find teachers without marks
      const teachersWithout = teachers.filter(t => !teachersWithMarksSet.has(t.id));
      setTeachersWithoutMarks(teachersWithout);
      
      // Set years
      if (data.years) setYears(data.years);
      
    } catch (err: any) {
      console.error("Error fetching results:", err);
      setError(err.message || "Imeshindwa kupakia matokeo");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    fetchAllResults(token, selectedTeacherId, selectedYear);
  };

  const handleEditMarks = (studentId: number, subjectId: number, teacherId: number) => {
    router.push(`/primary/marks/edit/${studentId}/${subjectId}?teacher_id=${teacherId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold">Matokeo ya Walimu Wote</h1>
            <p className="text-sky-100 mt-1">Tazama na simamia alama za walimu wote</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Mwalimu</Label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl">
                    <SelectValue placeholder="-- Walimu Wote --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="">-- Walimu Wote --</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Mwaka</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl">
                    <SelectValue placeholder="-- Miaka Yote --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="">-- Miaka Yote --</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleFilterChange} className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all rounded-xl">
                  Tekeleza Vichujio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Without Marks Warning */}
        {teachersWithoutMarks.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 rounded-2xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Walimu wasio na alama:</h3>
                  <ul className="list-disc list-inside mt-2 text-yellow-700">
                    {teachersWithoutMarks.map((teacher) => (
                      <li key={teacher.id}>{teacher.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results - Grouped by Teacher */}
        {teacherGroups.length === 0 ? (
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
            <CardContent className="py-12 text-center text-gray-500">
              Hakuna alama zilizopatikana. Tafadhali ongeza alama kwanza.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {teacherGroups.map((teacher) => (
              <Card key={teacher.teacher_id} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    👨‍🏫 {teacher.teacher_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                  {teacher.groups.map((group, groupIdx) => {
                    const sortedStudents = Array.from(group.students.entries()).sort((a, b) => 
                      a[1].name.localeCompare(b[1].name)
                    );
                    const examTypes = Array.from(group.exam_types).sort();
                    
                    return (
                      <Card key={groupIdx} className="border border-gray-200 overflow-hidden rounded-xl shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 py-3">
                          <CardTitle className="text-md">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-bold text-sky-700 text-lg">{group.subject_name}</span>
                              <span className="text-gray-400">|</span>
                              <span className="text-gray-700">{group.class_name}</span>
                              <span className="text-gray-400">|</span>
                              <span className="text-gray-700">Mkondo {group.stream_name}</span>
                              <span className="ml-auto text-sm text-gray-500">
                                📊 {sortedStudents.length} wanafunzi
                              </span>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 p-0">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="w-12 text-center">#</TableHead>
                                  <TableHead className="min-w-[180px]">Jina la Mwanafunzi</TableHead>
                                  {examTypes.map((et) => (
                                    <TableHead key={et} className="text-center min-w-[100px] bg-sky-50">
                                      <span className="font-bold text-sky-700">{et}</span>
                                    </TableHead>
                                  ))}
                                  <TableHead className="text-center w-24">Vitendo</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sortedStudents.map(([studentId, studentData], studentIdx) => (
                                  <TableRow key={studentId} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="text-center text-gray-500">{studentIdx + 1}</TableCell>
                                    <TableCell className="font-medium text-gray-800">{studentData.name}</TableCell>
                                    {examTypes.map((et) => (
                                      <TableCell key={et} className="text-center">
                                        {studentData.marks.has(et) ? (
                                          <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm min-w-[60px]">
                                            {studentData.marks.get(et)}
                                          </span>
                                        ) : (
                                          <span className="text-gray-300">—</span>
                                        )}
                                      </TableCell>
                                    ))}
                                    <TableCell className="text-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl gap-1"
                                        onClick={() => handleEditMarks(
                                          studentId,
                                          group.subject_id,
                                          teacher.teacher_id
                                        )}
                                        title="Hariri Alama"
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span className="ml-1 hidden sm:inline">Hariri</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}