"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Search, 
  FileText, 
  BookOpen, 
  Users,
  GraduationCap,
  Phone,
  User,
  Mail,
  MapPin,
  Sparkles,
  AlertCircle,
  Eye,
  Download
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  sex: string;
  roll_number: string;
  class_id: number;
  class_name: string;
  stream_name: string;
  subject_id: number;
  subject_name: string;
  father_name: string;
  father_phone: string;
}

interface GroupedStudents {
  class_name: string;
  subject_name: string;
  subject_id: number;
  students: Student[];
}

export default function MyStudentsPage() {
  const router = useRouter();
  const [groupedStudents, setGroupedStudents] = useState<GroupedStudents[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_type");
    
    if (!token) {
      router.push("/login");
      return;
    }
    
    setUserRole(role || "");
    fetchMyStudents(token);
  }, [router]);

  const fetchMyStudents = async (token: string) => {
    try {
      setLoading(true);
      
      const userType = localStorage.getItem("user_type");
      let url = "/api/v1/students/my-students";
      
      if (userType === "Teacher") {
        url = "/api/v1/teacher-my-students";
      }
      
      console.log("Fetching my students from:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(errorText || "Failed to fetch students");
      }
      
      const data = await response.json();
      console.log("Students data received:", data.length);
      
      if (data.length === 0) {
        setGroupedStudents([]);
        setLoading(false);
        return;
      }
      
      const groupedMap = new Map();
      
      for (const student of data) {
        const className = student.class_name || "Unknown Class";
        const subjectName = student.subject_name || "Unknown Subject";
        const key = `${className}|${subjectName}`;
        
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            class_name: className,
            subject_name: subjectName,
            subject_id: student.subject_id || 0,
            students: []
          });
        }
        groupedMap.get(key).students.push(student);
      }
      
      const groupedArray = Array.from(groupedMap.values());
      console.log("Grouped into:", groupedArray.length, "groups");
      
      setGroupedStudents(groupedArray);
      setError("");
      
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (studentId: number) => {
    router.push(`/secondary/reports/student/${studentId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Loading your students...</p>
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
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">My Students</h1>
            <p className="text-blue-100 max-w-2xl">
              {userRole === "Teacher" 
                ? "Students grouped by the classes and subjects you teach"
                : "Students grouped by classes and subjects"}
            </p>
          </div>
        </div>

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
                placeholder="Search by student name or roll number..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Grouped Cards */}
        <div className="space-y-8">
          {groupedStudents.length === 0 ? (
            <Card className="shadow-xl border-0">
              <div className="h-1 w-full bg-gradient-to-r from-gray-500 to-gray-600" />
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    {userRole === "Teacher" 
                      ? "You haven't been assigned any subjects yet."
                      : "No students found in your assigned classes."}
                  </p>
                  <p className="text-sm text-gray-400">
                    Please contact the Academic Master to assign subjects and classes.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            groupedStudents.map((group, idx) => {
              const filteredStudents = group.students.filter((student) =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (student.roll_number && student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()))
              );

              if (filteredStudents.length === 0 && searchTerm) return null;

              return (
                <Card 
                  key={idx} 
                  className="shadow-xl border-0 overflow-hidden animate-fadeIn hover:shadow-2xl transition-all duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {group.class_name}
                          </span>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="text-md font-semibold text-blue-700">
                              {group.subject_name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full backdrop-blur-sm">
                          <Users className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
                          </span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Father Name</TableHead>
                            <TableHead>Father Phone</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStudents.map((student, sIdx) => (
                            <TableRow 
                              key={student.id} 
                              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                            >
                              <TableCell className="text-gray-500 font-mono">{sIdx + 1}</TableCell>
                              <TableCell className="font-semibold text-gray-800">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  {student.name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  student.sex === "M" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-pink-100 text-pink-800"
                                }`}>
                                  {student.sex === "M" ? "Male" : "Female"}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {student.roll_number || "—"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3 text-gray-400" />
                                  <span>{student.father_name || "—"}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="font-mono text-sm">{student.father_phone || "—"}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewReport(student.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"
                                  title="View Report Card"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">Report</span>
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
            })
          )}
        </div>
      </div>

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
            transform: translateX(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
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