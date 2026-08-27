// app/primary/reports/page.tsx

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
  Eye, 
  Users,
  GraduationCap,
  FileText,
  Sparkles,
  AlertCircle,
  School,
  RefreshCw,
  Shield,
  ArrowRight,
  UserPlus
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  roll_number: string;
  class_name: string;
  stream_name: string;
}

export default function RipotiZaWanafunziPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type") || "";
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    
    // 🔥 ANGALIA KAMA NI MWALIMU
    const isTeacherRole = role.toLowerCase() === "mwalimu" || role.toLowerCase() === "teacher";
    setIsTeacher(isTeacherRole);
    setUserRole(role);
    
    // 🔥🔥🔥 IKIWA MWALIMU, PELEKA MOJA KWA MOJA KWENYE MY-STUDENTS! 🔥🔥🔥
    if (isTeacherRole) {
      console.log("👨‍🏫 Mwalimu amegunduliwa - kupelekwa my-students moja kwa moja!");
      router.push("/primary/students/my-students");
      return;
    }
    
    // 🔥 ADMIN - ENDELEA KUVUTA WANAFUNZI WOTE
    fetchStudents(storedToken);
  }, [router]);

  // 🔥 FETCH STUDENTS - KWA ADMIN TU!
  const fetchStudents = async (authToken: string) => {
    try {
      setLoading(true);
      setError("");
      
      // ✅ ADMIN - ANAONA WANAFUNZI WOTE!
      const apiUrl = "/api/v1/primary/students";
      
      console.log("📡 Admin fetching all students from:", apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("📡 Students received:", data.length);
        setStudents(data);
        setError("");
      } else {
        let errorMsg = "Imeshindwa kupata wanafunzi";
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMsg = errorData.detail;
          }
        } catch (e) {
          // Ignore
        }
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Tatizo la mtandao. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (studentId: number) => {
    router.push(`/primary/reports/student/${studentId}`);
  };

  const handleRetry = () => {
    if (token) {
      fetchStudents(token);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.roll_number && student.roll_number.includes(searchTerm))
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia wanafunzi...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Ripoti za Wanafunzi</h1>
            <p className="text-sky-100 max-w-2xl">
              Chagua mwanafunzi kuona ripoti yao kamili inayojumuisha utendaji wa kitaaluma, alama, na maoni ya walimu.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between gap-2 animate-slideIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl flex-shrink-0"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Jaribu Tena
            </Button>
          </div>
        )}

        {/* Search Bar - KWA ADMIN TU */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tafuta kwa jina la mwanafunzi au namba ya uandikishaji..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-500 transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table - KWA ADMIN TU */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" />
              Orodha ya Wanafunzi
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredStudents.length} {filteredStudents.length === 1 ? 'mwanafunzi' : 'wanafunzi'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Jina la Mwanafunzi</TableHead>
                    <TableHead>Namba</TableHead>
                    <TableHead>Darasa</TableHead>
                    <TableHead>Mkondo</TableHead>
                    <TableHead className="text-center w-32">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Hakuna wanafunzi waliopatikana</p>
                          <p className="text-sm text-gray-400">Jaribu kubadilisha tafuta yako</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student, idx) => (
                      <TableRow 
                        key={student.id} 
                        className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group"
                      >
                        <TableCell className="text-gray-500">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{student.roll_number || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <School className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600">{student.class_name || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {student.stream_name || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(student.id)}
                            className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 gap-1 rounded-xl"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Tazama Ripoti</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Info Box - KWA ADMIN TU */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-600" />
              Kuhusu Ripoti za Wanafunzi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold mt-0.5">1</div>
                <span>Chagua mwanafunzi yeyote kutoka orodha hapo juu</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold mt-0.5">2</div>
                <span>Tazama utendaji kamili wa kitaaluma</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold mt-0.5">3</div>
                <span>Chapisha au pakua kama PDF kwa wazazi</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
      `}</style>
    </MainLayout>
  );
}