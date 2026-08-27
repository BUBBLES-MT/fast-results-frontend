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
import { 
  Loader2, 
  Search, 
  FileText, 
  BookOpen, 
  Users,
  GraduationCap,
  Phone,
  User,
  AlertCircle,
  Eye,
  Filter,
  Layers
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  sex: string;
  roll_number: string;
  class_id: number;
  class_name: string;
  stream_id: number;
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

interface SubjectFilter {
  id: number;
  name: string;
}

interface ClassFilter {
  id: number;
  name: string;
}

// 🔥 FUNCTION YA KUPATA JINSIA KWA KISWAHILI (ME/KE)
const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE";
};

export default function WanafunziWanguPage() {
  const router = useRouter();
  const [wanafunziWaliopangwa, setWanafunziWaliopangwa] = useState<GroupedStudents[]>([]);
  const [wanafunziWote, setWanafunziWote] = useState<Student[]>([]);
  const [inapakia, setInapakia] = useState(true);
  const [kosa, setKosa] = useState("");
  const [tafuta, setTafuta] = useState("");
  const [jukumuLaMtumiaji, setJukumuLaMtumiaji] = useState("");
  const [token, setToken] = useState("");
  const [schoolId, setSchoolId] = useState("");
  
  // 🔥 FILTERS
  const [subjects, setSubjects] = useState<SubjectFilter[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [classes, setClasses] = useState<ClassFilter[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const jukumu = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    setToken(storedToken);
    setJukumuLaMtumiaji(jukumu || "");
    setSchoolId(schoolId || "");
    chukuaWanafunziWangu(storedToken);
  }, [router]);

  // 🔥 CHUKUA WANAFUNZI WA MWALIMU
  const chukuaWanafunziWangu = async (authToken: string) => {
    try {
      setInapakia(true);
      setKosa("");
      
      const url = "/api/v1/primary/students/my-students";
      
      console.log("Inapakia wanafunzi kutoka:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Kosa la response:", errorText);
        throw new Error(errorText || "Imeshindwa kupata wanafunzi");
      }
      
      const data = await response.json();
      console.log("Data ya wanafunzi imepokewa:", data.length);
      
      setWanafunziWote(data);
      
      if (data.length === 0) {
        setWanafunziWaliopangwa([]);
        setInapakia(false);
        return;
      }
      
      // 🔥 PATA MASOMO NA MADARASA YA KIPEKEE - NJIA MPYA!
      const subjectMap = new Map<number, string>();
      const classMap = new Map<number, string>();
      
      data.forEach((student: Student) => {
        if (student.subject_id && student.subject_name) {
          subjectMap.set(student.subject_id, student.subject_name);
        }
        if (student.class_id && student.class_name) {
          classMap.set(student.class_id, student.class_name);
        }
      });
      
      // 🔥 BADILISHA KUWA ARRAY
      const subjectArray: SubjectFilter[] = Array.from(subjectMap.entries()).map(([id, name]) => ({
        id,
        name
      }));
      
      const classArray: ClassFilter[] = Array.from(classMap.entries()).map(([id, name]) => ({
        id,
        name
      }));
      
      setSubjects(subjectArray);
      setClasses(classArray);
      
      console.log("✅ Masomo yaliyopatikana:", subjectArray.length);
      console.log("✅ Madarasa yaliyopatikana:", classArray.length);
      
      // 🔥 PANGA KWA VIKUNDI
      const groupedMap = new Map<string, GroupedStudents>();
      
      for (const student of data) {
        const jinaDarasa = student.class_name || "Darasa Lisilojulikana";
        const jinaSomo = student.subject_name || "Somo Lisilojulikana";
        const key = `${jinaDarasa}|${jinaSomo}`;
        
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            class_name: jinaDarasa,
            subject_name: jinaSomo,
            subject_id: student.subject_id || 0,
            students: []
          });
        }
        groupedMap.get(key)!.students.push(student);
      }
      
      const groupedArray = Array.from(groupedMap.values());
      console.log("Imepangwa katika vikundi:", groupedArray.length, "vikundi");
      
      setWanafunziWaliopangwa(groupedArray);
      
    } catch (err: any) {
      console.error("Kosa:", err);
      setKosa(err.message || "Imeshindwa kupakia wanafunzi");
    } finally {
      setInapakia(false);
    }
  };

  // 🔥 CHUJA WANAFUNZI KWA SOMO NA DARASA
  const getFilteredGroups = (): GroupedStudents[] => {
    let filtered = wanafunziWaliopangwa;
    
    // 🔥 CHUJA KWA SOMO
    if (selectedSubject !== "all") {
      const subjectId = parseInt(selectedSubject);
      filtered = filtered.filter(group => 
        group.subject_id === subjectId
      );
    }
    
   // 🔥 CHUJA KWA DARASA
if (selectedClass !== "all") {
  const classId = parseInt(selectedClass);
  // PATA JINA LA DARASA KUTOKA KWENYE LIST YA CLASSES
  const selectedClassObj = classes.find(c => c.id === classId);
  if (selectedClassObj) {
    filtered = filtered.filter(group => 
      group.class_name === selectedClassObj.name
    );
  }
}
    
    return filtered;
  };

  const filteredGroups = getFilteredGroups();

  const tazamaRipoti = (studentId: number) => {
    router.push(`/primary/reports/student/${studentId}`);
  };

  // 🔥 HESABU YA JUMLA YA WANAFUNZI WALIOCHUJWA
  const totalFilteredStudents = filteredGroups.reduce((acc, g) => acc + g.students.length, 0);

  if (inapakia) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia wanafunzi wako...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn max-w-7xl mx-auto">
        {/* Sehemu ya Kichwa */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
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
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Wanafunzi Wangu</h1>
            <p className="text-sky-100 max-w-2xl">
              {jukumuLaMtumiaji === "Mwalimu" || jukumuLaMtumiaji === "Teacher"
                ? "Wanafunzi wamepangwa kwa madarasa na masomo unayofundisha"
                : "Wanafunzi wamepangwa kwa madarasa na masomo"}
            </p>
            <div className="mt-3 flex gap-4 text-sm text-sky-200">
              <span>📚 Masomo: {subjects.length}</span>
              <span>🏫 Madarasa: {classes.length}</span>
              <span>👨‍🎓 Wanafunzi: {wanafunziWote.length}</span>
            </div>
          </div>
        </div>

        {/* Ujumbe wa Kosa */}
        {kosa && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            <span>{kosa}</span>
          </div>
        )}

        {/* 🔥 FILTERS */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-sky-800">
              <Filter className="h-5 w-5" />
              Chuja Wanafunzi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 🔥 SOMO FILTER */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-sky-600" />
                  Chuja kwa Somo
                </Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl">
                    <SelectValue placeholder="Masomo Yote" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">📚 Masomo Yote</SelectItem>
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  {subjects.length} masomo yanapatikana
                </p>
              </div>

              {/* 🔥 DARASA FILTER */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  Chuja kwa Darasa
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl">
                    <SelectValue placeholder="Madarasa Yote" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">🏫 Madarasa Yote</SelectItem>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  {classes.length} madarasa yanapatikana
                </p>
              </div>

              {/* 🔥 UPEO WA KUTAFUTA */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Search className="h-4 w-4 text-purple-600" />
                  Tafuta kwa Jina au Namba
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tafuta mwanafunzi..."
                    className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl"
                    value={tafuta}
                    onChange={(e) => setTafuta(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {totalFilteredStudents} wanafunzi wamechujwa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🔥 VIKUNDI VILIVYOPANGWA */}
        <div className="space-y-8">
          {filteredGroups.length === 0 ? (
            <Card className="shadow-xl border-0">
              <div className="h-1 w-full bg-gradient-to-r from-gray-500 to-gray-600" />
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    {jukumuLaMtumiaji === "Mwalimu" || jukumuLaMtumiaji === "Teacher"
                      ? "Hujapewa masomo bado au hakuna wanafunzi wanaolingana na vigezo ulivyochagua."
                      : "Hakuna wanafunzi katika madarasa uliyopangiwa."}
                  </p>
                  <p className="text-sm text-gray-400">
                    Jaribu kubadilisha vigezo vya uchujaji au wasiliana na Mtaaluma.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredGroups.map((group, idx) => {
              const wanafunziWaliopepetwa = group.students.filter((student) =>
                student.name.toLowerCase().includes(tafuta.toLowerCase()) ||
                (student.roll_number && student.roll_number.toLowerCase().includes(tafuta.toLowerCase()))
              );

              if (wanafunziWaliopepetwa.length === 0 && tafuta) return null;

              return (
                <Card 
                  key={idx} 
                  className="shadow-xl border-0 overflow-hidden animate-fadeIn hover:shadow-2xl transition-all duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
                  <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
                    <CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <GraduationCap className="h-5 w-5 text-sky-600" />
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {group.class_name}
                          </span>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-sky-600" />
                            <span className="text-md font-semibold text-sky-700">
                              {group.subject_name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full backdrop-blur-sm">
                          <Users className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            {wanafunziWaliopepetwa.length} {wanafunziWaliopepetwa.length === 1 ? 'Mwanafunzi' : 'Wanafunzi'}
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
                            <TableHead>Jina la Mwanafunzi</TableHead>
                            <TableHead>Jinsia</TableHead>
                            <TableHead>Namba</TableHead>
                            <TableHead>Darasa</TableHead>
                            <TableHead>Mkondo</TableHead>
                            <TableHead>Jina la Baba</TableHead>
                            <TableHead>Simu ya Baba</TableHead>
                            <TableHead className="text-right">Vitendo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {wanafunziWaliopepetwa.map((student, sIdx) => (
                            <TableRow 
                              key={student.id} 
                              className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group"
                            >
                              <TableCell className="text-gray-500 font-mono">{sIdx + 1}</TableCell>
                              <TableCell className="font-semibold text-gray-800">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
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
                                  {pataJinsia(student.sex)}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {student.roll_number || "—"}
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3 text-indigo-400" />
                                  {student.class_name || "—"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center gap-1">
                                  <Layers className="h-3 w-3 text-purple-400" />
                                  {student.stream_name || "—"}
                                </span>
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
                                  onClick={() => tazamaRipoti(student.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1 rounded-xl"
                                  title="Tazama Ripoti"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">Ripoti</span>
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

      {/* Animations */}
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