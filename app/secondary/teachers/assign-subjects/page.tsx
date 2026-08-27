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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  Search, 
  Edit, 
  Save, 
  Plus, 
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCog,
  Sparkles,
  Briefcase,
  School,
  Layers,
  ArrowLeft
} from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
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
  id: number;
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
}

export default function AssignSubjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  
  // Data states
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<Map<number, TeacherAssignment[]>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit dialog states
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingAssignments, setEditingAssignments] = useState<TeacherAssignment[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [availableStreams, setAvailableStreams] = useState<Stream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    subject_id: "",
    class_id: "",
    stream_id: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    let role = localStorage.getItem("user_type");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    setToken(storedToken);
    
    // Format role properly
    const roleMap: Record<string, string> = {
      "academic": "Academic",
      "headmaster": "Headmaster",
      "headmistress": "Headmistress",
      "second master": "Second Master",
      "second mistress": "Second Mistress",
      "teacher": "Teacher"
    };
    const formattedRole = roleMap[role?.toLowerCase() || ""] || role || "";
    setUserRole(formattedRole);
    
    // Check if user has permission
    const allowedRoles = ["Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"];
    const hasPermission = allowedRoles.includes(formattedRole);
    
    if (!hasPermission) {
      router.push("/dashboard");
      return;
    }
    
    fetchData(storedToken);
    
  }, [router]);

  const fetchData = async (authToken: string) => {
    try {
      setLoading(true);
      
      // Fetch teachers
      const teachersRes = await fetch("/api/v1/teachers", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const teachersData = await teachersRes.json();
      setTeachers(teachersData);
      
      // Fetch subjects
      const subjectsRes = await fetch("/api/v1/subjects", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const subjectsData = await subjectsRes.json();
      setSubjects(subjectsData);
      setAvailableSubjects(subjectsData);
      
      // Fetch classes
      const classesRes = await fetch("/api/v1/classes", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const classesData = await classesRes.json();
      setClasses(classesData);
      setAvailableClasses(classesData);
      
      // Fetch streams
      const streamsRes = await fetch("/api/v1/streams", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const streamsData = await streamsRes.json();
      setStreams(streamsData);
      setAvailableStreams(streamsData);
      
      // Fetch assignments for each teacher
      const assignmentsMap = new Map<number, TeacherAssignment[]>();
      for (const teacher of teachersData) {
        const assignmentsRes = await fetch(`/api/v1/teachers/${teacher.id}/assignments`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (assignmentsRes.ok) {
          const assignments = await assignmentsRes.json();
          assignmentsMap.set(teacher.id, assignments);
        } else {
          assignmentsMap.set(teacher.id, []);
        }
      }
      setTeacherAssignments(assignmentsMap);
      
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    const assignments = teacherAssignments.get(teacher.id) || [];
    setEditingAssignments([...assignments]);
    setNewAssignment({
      subject_id: "",
      class_id: "",
      stream_id: "",
    });
    setOpenEditDialog(true);
  };

  const handleAddAssignment = () => {
    if (!newAssignment.subject_id || !newAssignment.class_id) {
      setError("Please select subject and class");
      return;
    }
    
    const subject = availableSubjects.find(s => s.id.toString() === newAssignment.subject_id);
    const classObj = availableClasses.find(c => c.id.toString() === newAssignment.class_id);
    const stream = newAssignment.stream_id ? availableStreams.find(s => s.id.toString() === newAssignment.stream_id) : null;
    
    const newAssignmentObj: TeacherAssignment = {
      id: Date.now(),
      subject_id: parseInt(newAssignment.subject_id),
      subject_name: subject?.name || "Unknown",
      class_id: parseInt(newAssignment.class_id),
      class_name: classObj?.name || "Unknown",
      stream_id: newAssignment.stream_id ? parseInt(newAssignment.stream_id) : 0,
      stream_name: stream?.name || "",
    };
    
    setEditingAssignments([...editingAssignments, newAssignmentObj]);
    setNewAssignment({
      subject_id: "",
      class_id: "",
      stream_id: "",
    });
    setError("");
  };

  const handleRemoveAssignment = (index: number) => {
    const newAssignments = [...editingAssignments];
    newAssignments.splice(index, 1);
    setEditingAssignments(newAssignments);
  };

  const handleSaveAssignments = async () => {
    if (!selectedTeacher) return;
    
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const existingAssignments = teacherAssignments.get(selectedTeacher.id) || [];
      for (const assignment of existingAssignments) {
        if (assignment.id && assignment.id > 0) {
          await fetch(`/api/v1/teachers/${selectedTeacher.id}/assignments/${assignment.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
      
      for (const assignment of editingAssignments) {
        const payload = {
          subject_id: assignment.subject_id,
          class_id: assignment.class_id,
          stream_id: assignment.stream_id || 0,
        };
        
        await fetch(`/api/v1/teachers/${selectedTeacher.id}/assign`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }
      
      await fetchData(token);
      setSuccess("Assignments saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setOpenEditDialog(false);
      
    } catch (err: any) {
      console.error("Error saving assignments:", err);
      setError(err.message || "Failed to save assignments");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // 🔥 HANDLE CANCEL - RUDI NYUMA TU!
  // ============================================================
  const handleCancel = () => {
    setOpenEditDialog(false);
    setSelectedTeacher(null);
    setEditingAssignments([]);
    setError("");
    router.back();  // 🔥 RUDI NYUMA MOJA KWA MOJA!
  };

  useEffect(() => {
    if (newAssignment.class_id) {
      const filtered = availableStreams.filter(
        (stream) => stream.class_id === parseInt(newAssignment.class_id)
      );
      setFilteredStreams(filtered);
      setNewAssignment(prev => ({ ...prev, stream_id: "" }));
    } else {
      setFilteredStreams([]);
    }
  }, [newAssignment.class_id, availableStreams]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAssignmentsSummary = (teacherId: number) => {
    const assignments = teacherAssignments.get(teacherId) || [];
    if (assignments.length === 0) {
      return { subjects: [], classes: [] };
    }
    
    const subjects = [...new Set(assignments.map(a => a.subject_name))];
    const classes = [...new Set(assignments.map(a => `${a.class_name}${a.stream_name ? ` ${a.stream_name}` : ''}`))];
    
    return { subjects, classes };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Loading teachers data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <UserCog className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Teacher Subject Assignment</h1>
            <p className="text-blue-100 max-w-2xl">
              Assign and manage subjects for teachers. Teachers will only see students in their assigned classes and subjects.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by teacher name, username, or email..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Teachers List
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead className="text-center w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">No teachers found</p>
                          <p className="text-sm text-gray-400">Try adjusting your search</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher, idx) => {
                      const { subjects: teacherSubjects, classes: teacherClasses } = getAssignmentsSummary(teacher.id);
                      const hasAssignments = teacherSubjects.length > 0;
                      
                      return (
                        <TableRow key={teacher.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group">
                          <TableCell className="text-gray-500">{idx + 1}</TableCell>
                          <TableCell className="font-semibold text-gray-800">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                {teacher.name.charAt(0).toUpperCase()}
                              </div>
                              {teacher.name}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{teacher.username}</TableCell>
                          <TableCell className="text-sm">{teacher.email}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              teacher.role === "Academic" ? "bg-purple-100 text-purple-800" :
                              teacher.role === "Headmaster" || teacher.role === "Headmistress" ? "bg-red-100 text-red-800" :
                              teacher.role === "Second Master" || teacher.role === "Second Mistress" ? "bg-orange-100 text-orange-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {teacher.role}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {hasAssignments ? (
                              <div className="flex flex-wrap gap-1">
                                {teacherSubjects.slice(0, 3).map((s, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                    <BookOpen className="h-2.5 w-2.5 mr-1" />
                                    {s}
                                  </span>
                                ))}
                                {teacherSubjects.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    +{teacherSubjects.length - 3}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-red-500">
                                <XCircle className="h-3 w-3" />
                                No subjects
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {hasAssignments ? (
                              <div className="flex flex-wrap gap-1">
                                {teacherClasses.slice(0, 3).map((c, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    <School className="h-2.5 w-2.5 mr-1" />
                                    {c}
                                  </span>
                                ))}
                                {teacherClasses.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    +{teacherClasses.length - 3}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTeacher(teacher)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1"
                              title="Assign Subjects"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Assignments Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Assign Subjects to {selectedTeacher?.name}
            </DialogTitle>
            <DialogDescription>
              Add or remove subjects that this teacher will teach. Teachers will only see students in their assigned classes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editingAssignments.length > 0 && (
              <div>
                <Label className="font-semibold mb-2 block flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Current Assignments ({editingAssignments.length})
                </Label>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {editingAssignments.map((assignment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {assignment.subject_name}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <School className="h-3 w-3 mr-1" />
                          {assignment.class_name}
                        </span>
                        {assignment.stream_name && (
                          <>
                            <span className="text-gray-400">/</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <Layers className="h-3 w-3 mr-1" />
                              Stream {assignment.stream_name}
                            </span>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveAssignment(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <Label className="font-semibold mb-2 block flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600" />
                Add New Assignment
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Select
                    value={newAssignment.subject_id}
                    onValueChange={(v) => setNewAssignment({ ...newAssignment, subject_id: v })}
                  >
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableSubjects.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={newAssignment.class_id}
                    onValueChange={(v) => setNewAssignment({ ...newAssignment, class_id: v })}
                  >
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableClasses.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={newAssignment.stream_id}
                    onValueChange={(v) => setNewAssignment({ ...newAssignment, stream_id: v })}
                    disabled={!newAssignment.class_id}
                  >
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="Stream (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Streams</SelectItem>
                      {filteredStreams.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>Stream {s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={handleAddAssignment}
                    className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Tip: Leave stream empty to assign to all streams in the selected class
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignments} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Save Assignments"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </MainLayout>
  );
}