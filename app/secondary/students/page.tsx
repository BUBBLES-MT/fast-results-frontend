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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash2, Loader2, FileText, Edit, BookOpen, GraduationCap, Users, Download } from "lucide-react";

interface Student {
  id: number;
  name: string;
  sex: string;
  roll_number: string;
  school_id: number;
  class_id: number | null;
  stream_id: number | null;
  father_name: string;
  father_phone: string;
  health_info?: string;
  address?: string;
}

interface Class {
  id: number;
  name: string;
  school_id: number;
}

interface Stream {
  id: number;
  name: string;
  class_id: number;
  school_id: number;
}

interface GroupedStudents {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  students: Student[];
}

const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [groupedStudents, setGroupedStudents] = useState<GroupedStudents[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  
  const [viewMode, setViewMode] = useState<"all" | "my">(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem("user_type");
      if (role === "Teacher") return "my";
    }
    return "all";
  });
  
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState("MIDTERM3");
  
  const [editOpen, setEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    sex: "M",
    father_name: "",
    father_phone: "",
    health_info: "",
    address: "",
    school_id: 1,
    class_id: "",
    stream_id: "",
    roll_number: "",
  });
  
  const [formData, setFormData] = useState({
    name: "",
    sex: "M",
    father_name: "",
    father_phone: "",
    health_info: "",
    address: "",
    school_id: 1,
    class_id: "",
    stream_id: "",
    roll_number: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setUserRole(role || "");
    fetchClasses(storedToken);
    fetchStreams(storedToken);
  }, [router]);

  useEffect(() => {
    if (token) {
      const userType = localStorage.getItem("user_type");
      if (userType === "Teacher") {
        fetchGroupedStudents(token);
      } else if (viewMode === "my") {
        fetchGroupedStudents(token);
      } else {
        fetchStudents(token);
      }
    }
  }, [viewMode, token]);

  const fetchStudents = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/students", {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to fetch students");
      }
      
      const data = await response.json();
      setStudents(data);
      setError("");
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupedStudents = async (authToken: string) => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/v1/teacher-my-students", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch students");
      }
      
      const studentsData = await response.json();
      
      if (studentsData.length === 0) {
        setGroupedStudents([]);
        setLoading(false);
        return;
      }
      
      const groupedMap = new Map();
      
      for (const student of studentsData) {
        const key = `${student.subject_id}-${student.class_id}-${student.stream_id}`;
        
        if (!groupedMap.has(key)) {
          let displayClass = student.class_name || "Unknown Class";
          const streamName = student.stream_name || "";
          
          if (streamName && !displayClass.includes(streamName)) {
            displayClass = `${displayClass} ${streamName}`;
          }
          
          displayClass = displayClass.replace(/(\w+)\s+\1$/, '$1');
          
          groupedMap.set(key, {
            subject_id: student.subject_id,
            subject_name: student.subject_name || "Unknown Subject",
            class_id: student.class_id,
            class_name: displayClass,
            stream_id: student.stream_id,
            stream_name: streamName,
            students: []
          });
        }
        groupedMap.get(key).students.push(student);
      }
      
      setGroupedStudents(Array.from(groupedMap.values()));
      setError("");
    } catch (err: any) {
      console.error("Fetch grouped students error:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/classes", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchStreams = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/streams", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams(data);
    } catch (err) {
      console.error("Error fetching streams:", err);
    }
  };

  useEffect(() => {
    if (formData.class_id) {
      const filtered = streams.filter(
        (stream) => stream.class_id === parseInt(formData.class_id)
      );
      setFilteredStreams(filtered);
      setFormData((prev) => ({ ...prev, stream_id: "" }));
    } else {
      setFilteredStreams([]);
    }
  }, [formData.class_id, streams]);

  useEffect(() => {
    if (editFormData.class_id) {
      const filtered = streams.filter(
        (stream) => stream.class_id === parseInt(editFormData.class_id)
      );
      setFilteredStreams(filtered);
      setEditFormData((prev) => ({ ...prev, stream_id: "" }));
    } else {
      setFilteredStreams([]);
    }
  }, [editFormData.class_id, streams]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.class_id) {
      setError("Please select a class");
      return;
    }
    if (!formData.stream_id) {
      setError("Please select a stream");
      return;
    }
    
    setError("");
    
    try {
      const payload = {
        name: formData.name,
        sex: formData.sex,
        father_name: formData.father_name,
        father_phone: formData.father_phone,
        health_info: formData.health_info || null,
        address: formData.address || null,
        school_id: formData.school_id,
        class_id: parseInt(formData.class_id),
        stream_id: parseInt(formData.stream_id),
        roll_number: formData.roll_number || null,
      };
      
      const response = await fetch("/api/v1/students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to create student");
        return;
      }
      
      setOpen(false);
      setFormData({
        name: "",
        sex: "M",
        father_name: "",
        father_phone: "",
        health_info: "",
        address: "",
        school_id: 1,
        class_id: "",
        stream_id: "",
        roll_number: "",
      });
      fetchStudents(token);
      setError("");
    } catch (err) {
      console.error("Error creating student:", err);
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetch(`/api/v1/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (viewMode === "my") {
        fetchGroupedStudents(token);
      } else {
        fetchStudents(token);
      }
    } catch (err) {
      setError("Failed to delete student");
    }
  };

  const handleViewReport = (studentId: number) => {
    router.push(`/secondary/reports/student/${studentId}`);
  };

  const handleGeneratePDF = (studentId: number) => {
    setSelectedStudentId(studentId);
    setPdfDialogOpen(true);
  };

  const confirmGeneratePDF = () => {
    if (selectedStudentId) {
      const url = `/api/v1/reports/student/${selectedStudentId}/parent-report?exam_type=${selectedExamType}`;
      window.open(url, "_blank");
    }
    setPdfDialogOpen(false);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name ?? "",
      sex: student.sex ?? "M",
      father_name: student.father_name ?? "",
      father_phone: student.father_phone ?? "",
      health_info: student.health_info ?? "",
      address: student.address ?? "",
      school_id: student.school_id ?? 1,
      class_id: student.class_id?.toString() ?? "",
      stream_id: student.stream_id?.toString() ?? "",
      roll_number: student.roll_number ?? "",
    });
    setEditOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    try {
      const payload = {
        name: editFormData.name,
        sex: editFormData.sex,
        father_name: editFormData.father_name,
        father_phone: editFormData.father_phone,
        health_info: editFormData.health_info || null,
        address: editFormData.address || null,
        school_id: editFormData.school_id,
        class_id: parseInt(editFormData.class_id),
        stream_id: parseInt(editFormData.stream_id),
        roll_number: editFormData.roll_number || null,
      };
      
      const response = await fetch(`/api/v1/students/${editingStudent.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update student");
      
      setEditOpen(false);
      setEditingStudent(null);
      if (viewMode === "my") {
        fetchGroupedStudents(token);
      } else {
        fetchStudents(token);
      }
      setError("");
    } catch (err) {
      setError("Failed to update student");
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.roll_number && student.roll_number.includes(searchTerm))
  );

  const getClassName = (classId: number | null) => {
    if (!classId) return "-";
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : "-";
  };

  const getStreamName = (streamId: number | null) => {
    if (!streamId) return "-";
    const stream = streams.find((s) => s.id === streamId);
    return stream ? stream.name : "-";
  };

  const canSeeBothButtons = () => {
    const adminRoles = ["Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"];
    return adminRoles.includes(userRole);
  };

  const canSeeOnlyMyStudents = () => {
    return userRole === "Teacher";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading students...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* GLASSMORPHISM HEADER */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200/50 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Students Management
              </h1>
              <p className="text-gray-500 mt-1">
                {userRole === "Teacher" 
                  ? "Manage your students"
                  : "Manage all students in your school"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {canSeeBothButtons() && (
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("all")}
                    className="rounded-full transition-all duration-200 hover:scale-105"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    All Students
                  </Button>
                  <Button
                    variant={viewMode === "my" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("my")}
                    className="rounded-full transition-all duration-200 hover:scale-105"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    My Students
                  </Button>
                </div>
              )}
              
              {canSeeOnlyMyStudents() && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setViewMode("my")}
                    className="rounded-full transition-all duration-200 hover:scale-105"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    My Students
                  </Button>
                </div>
              )}
              
              {userRole !== "Teacher" && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-md">
                      <Plus className="h-4 w-4" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-2xl animate-in fade-in zoom-in duration-300">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Add New Student</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new student. Class and Stream are required.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateStudent}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right font-semibold">Full Name *</Label>
                          <Input
                            id="name"
                            className="col-span-3 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all"
                            placeholder="Enter student's full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sex" className="text-right font-semibold">Sex *</Label>
                          <Select
                            value={formData.sex}
                            onValueChange={(value) => setFormData({ ...formData, sex: value })}
                          >
                            <SelectTrigger className="col-span-3 rounded-xl">
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">Male</SelectItem>
                              <SelectItem value="F">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="class_id" className="text-right font-semibold">Class *</Label>
                          <Select
  value={editFormData.class_id}
  onValueChange={(value) => setEditFormData({ ...editFormData, class_id: value })}
>
  <SelectTrigger className="col-span-3 rounded-xl bg-white">
    <SelectValue placeholder="Select class" />
  </SelectTrigger>
  {/* 🔥 FIXED: Added bg-white */}
  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
    {classes.map((cls) => (
      <SelectItem key={cls.id} value={cls.id.toString()}>
        {cls.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                        </div>

                        {formData.class_id && (
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stream_id" className="text-right font-semibold">Stream *</Label>
                            <Select
  value={formData.stream_id}
  onValueChange={(value) => setFormData({ ...formData, stream_id: value })}
>
  <SelectTrigger className="col-span-3 rounded-xl bg-white">
    <SelectValue placeholder="Select stream" />
  </SelectTrigger>
  {/* 🔥 FIXED: Added bg-white */}
  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
    {filteredStreams.length === 0 ? (
      <SelectItem value="none" disabled>No streams available</SelectItem>
    ) : (
      filteredStreams.map((stream) => (
        <SelectItem key={stream.id} value={stream.id.toString()}>
          Stream {stream.name}
        </SelectItem>
      ))
    )}
  </SelectContent>
</Select>
                          </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="father_name" className="text-right font-semibold">Father Name *</Label>
                          <Input
                            id="father_name"
                            className="col-span-3 rounded-xl"
                            placeholder="Enter father's full name"
                            value={formData.father_name}
                            onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="father_phone" className="text-right font-semibold">Father Phone *</Label>
                          <Input
                            id="father_phone"
                            className="col-span-3 rounded-xl"
                            placeholder="e.g., 0712345678"
                            value={formData.father_phone}
                            onChange={(e) => setFormData({ ...formData, father_phone: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="health_info" className="text-right font-semibold">Health Info</Label>
                          <Input
                            id="health_info"
                            className="col-span-3 rounded-xl"
                            placeholder="e.g., Allergies, Medical conditions"
                            value={formData.health_info ?? ""}
                            onChange={(e) => setFormData({ ...formData, health_info: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right font-semibold">Address</Label>
                          <Input
                            id="address"
                            className="col-span-3 rounded-xl"
                            placeholder="Home address / Residence"
                            value={formData.address ?? ""}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="roll_number" className="text-right font-semibold">Roll Number</Label>
                          <Input
                            id="roll_number"
                            className="col-span-3 rounded-xl"
                            placeholder="Optional"
                            value={formData.roll_number}
                            onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                          {error}
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
                          Save Student
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH BAR - Modern */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name or roll number..."
                className="pl-12 py-6 text-lg rounded-xl focus:ring-2 focus:ring-blue-400 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ALL STUDENTS VIEW */}
        {viewMode === "all" && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-2xl font-bold text-gray-800">All Students</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-100 to-gray-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-bold">ID</TableHead>
                      <TableHead className="font-bold">Name</TableHead>
                      <TableHead className="font-bold">Sex</TableHead>
                      <TableHead className="font-bold">Class</TableHead>
                      <TableHead className="font-bold">Stream</TableHead>
                      <TableHead className="font-bold">Roll Number</TableHead>
                      <TableHead className="font-bold">Father Name</TableHead>
                      <TableHead className="font-bold">Father Phone</TableHead>
                      <TableHead className="font-bold">Health Info</TableHead>
                      <TableHead className="font-bold">Address</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-16 text-gray-500">
                          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          No students found. Click "Add Student" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-mono">{student.id}</TableCell>
                          <TableCell className="font-semibold">{student.name}</TableCell>
                          <TableCell>{student.sex === "M" ? "Male" : "Female"}</TableCell>
                          <TableCell>{getClassName(student.class_id)}</TableCell>
                          <TableCell>{getStreamName(student.stream_id)}</TableCell>
                          <TableCell>{student.roll_number || "-"}</TableCell>
                          <TableCell>{student.father_name || "-"}</TableCell>
                          <TableCell>{student.father_phone || "-"}</TableCell>
                          <TableCell>{student.health_info || "-"}</TableCell>
                          <TableCell>{student.address || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(student)}
                                className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                                title="Edit Student"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewReport(student.id)}
                                className="rounded-full text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-110"
                                title="View Report Card"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGeneratePDF(student.id)}
                                className="rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:scale-110"
                                title="Download Parent Report PDF"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteStudent(student.id)}
                                className="rounded-full transition-all duration-200 hover:scale-110"
                                title="Delete Student"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MY STUDENTS VIEW - Grouped with Premium Design */}
        {viewMode === "my" && (
          <div className="space-y-8">
            {groupedStudents.length === 0 ? (
              <Card className="border-0 shadow-xl rounded-2xl">
                <CardContent className="py-20 text-center">
                  <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    {userRole === "Teacher" 
                      ? "You haven't been assigned any subjects yet. Contact the Academic Master."
                      : "No students found in your assigned classes."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              groupedStudents.map((group, index) => {
                const filteredGroupStudents = group.students.filter((student) =>
                  student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (student.roll_number && student.roll_number.includes(searchTerm))
                );

                if (filteredGroupStudents.length === 0 && searchTerm) return null;

                return (
                  <Card 
                    key={`${group.class_id}-${group.stream_id}-${group.subject_id}`}
                    className="border-0 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-2xl text-white">
                      <CardTitle>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-6 w-6" />
                            <span className="text-xl font-bold">
                              {group.class_name}
                            </span>
                            <span className="text-white/60">•</span>
                            <span className="text-lg">
                              <BookOpen className="h-5 w-5 inline mr-2" />
                              {group.subject_name}
                            </span>
                          </div>
                          <div className="text-sm bg-white/20 px-4 py-2 rounded-full">
                            Total Students: {filteredGroupStudents.length}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                            <TableRow>
                              <TableHead className="font-bold">ID</TableHead>
                              <TableHead className="font-bold">Name</TableHead>
                              <TableHead className="font-bold">Sex</TableHead>
                              <TableHead className="font-bold">Roll Number</TableHead>
                              <TableHead className="font-bold">Father Name</TableHead>
                              <TableHead className="font-bold">Father Phone</TableHead>
                              <TableHead className="text-right font-bold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredGroupStudents.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                  No students found in this class.
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredGroupStudents.map((student) => (
                                <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                                  <TableCell className="font-mono">{student.id}</TableCell>
                                  <TableCell className="font-semibold">{student.name}</TableCell>
                                  <TableCell>{student.sex === "M" ? "Male" : "Female"}</TableCell>
                                  <TableCell>{student.roll_number || "-"}</TableCell>
                                  <TableCell>{student.father_name || "-"}</TableCell>
                                  <TableCell>{student.father_phone || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditDialog(student)}
                                        className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                                        title="Edit Student"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewReport(student.id)}
                                        className="rounded-full text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-110"
                                        title="View Report Card"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleGeneratePDF(student.id)}
                                        className="rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:scale-110"
                                        title="Download Parent Report PDF"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="rounded-full transition-all duration-200 hover:scale-110"
                                        title="Delete Student"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl rounded-2xl animate-in fade-in zoom-in duration-300">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStudent}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right font-semibold">Full Name *</Label>
                <Input
                  id="edit-name"
                  className="col-span-3 rounded-xl"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-sex" className="text-right font-semibold">Sex *</Label>
                <Select
                  value={editFormData.sex}
                  onValueChange={(value) => setEditFormData({ ...editFormData, sex: value })}
                >
                  <SelectTrigger className="col-span-3 rounded-xl">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-class" className="text-right font-semibold">Class *</Label>
                <Select
                  value={editFormData.class_id}
                  onValueChange={(value) => setEditFormData({ ...editFormData, class_id: value })}
                >
                  <SelectTrigger className="col-span-3 rounded-xl">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editFormData.class_id && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-stream" className="text-right font-semibold">Stream *</Label>
                  <Select
                    value={editFormData.stream_id}
                    onValueChange={(value) => setEditFormData({ ...editFormData, stream_id: value })}
                  >
                    <SelectTrigger className="col-span-3 rounded-xl">
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streams
                        .filter(s => s.class_id === parseInt(editFormData.class_id))
                        .map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            Stream {stream.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-father-name" className="text-right font-semibold">Father Name *</Label>
                <Input
                  id="edit-father-name"
                  className="col-span-3 rounded-xl"
                  value={editFormData.father_name}
                  onChange={(e) => setEditFormData({ ...editFormData, father_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-father-phone" className="text-right font-semibold">Father Phone *</Label>
                <Input
                  id="edit-father-phone"
                  className="col-span-3 rounded-xl"
                  value={editFormData.father_phone}
                  onChange={(e) => setEditFormData({ ...editFormData, father_phone: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-roll-number" className="text-right font-semibold">Roll Number</Label>
                <Input
                  id="edit-roll-number"
                  className="col-span-3 rounded-xl"
                  value={editFormData.roll_number ?? ""}
                  onChange={(e) => setEditFormData({ ...editFormData, roll_number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-health-info" className="text-right font-semibold">Health Info</Label>
                <Input
                  id="edit-health-info"
                  className="col-span-3 rounded-xl"
                  value={editFormData.health_info ?? ""}
                  onChange={(e) => setEditFormData({ ...editFormData, health_info: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right font-semibold">Address</Label>
                <Input
                  id="edit-address"
                  className="col-span-3 rounded-xl"
                  value={editFormData.address ?? ""}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
                Update Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PDF Exam Type Selection Dialog */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="rounded-2xl animate-in fade-in zoom-in duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Select Exam Type</DialogTitle>
            <DialogDescription>
              Choose the exam type for the parent report PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={confirmGeneratePDF} className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              Generate PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}