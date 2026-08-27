"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Search,
  UserPlus,
  Users,
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Eye,
  Plus,
  Trash2,
  X,
  School,
  Building2
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// INTERFACES
// ============================================================

interface School {
  id: number;
  name: string;
  school_level: string;
  school_type: string;
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
}

interface Student {
  id: number;
  name: string;
  roll_number: string;
  class_name: string;
  stream_name: string;
}

interface Child {
  id: number;
  student_id: number;
  student_name: string;
  student_roll_number: string;
  class_name: string;
  stream_name: string;
  relationship: string;
  is_active: boolean;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ParentAddChildPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Children list
  const [children, setChildren] = useState<Child[]>([]);
  
  // 🔥 SCHOOL LEVEL
  const [schoolLevel, setSchoolLevel] = useState("primary");
  
  // 🔥 SCHOOLS LIST
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  
  // Search filters
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStream, setSelectedStream] = useState("all");
  const [rollNumber, setRollNumber] = useState("");
  
  // Search results
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Selected student to add
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [relationship, setRelationship] = useState("Biological");

  // 🔥 GET TOKEN
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userType = typeof window !== "undefined" ? localStorage.getItem("user_type") : null;

  // ============================================================
  // 🔥 USE EFFECTS
  // ============================================================

  useEffect(() => {
    if (!token || userType !== "parent") {
      router.push("/parent/login");
      return;
    }

    fetchChildren();
    fetchSchools();
  }, []);

  // 🔥 FETCH CHILDREN
  const fetchChildren = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parents/children`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
      }
    } catch (err) {
      console.error("Error fetching children:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FETCH SCHOOLS
  const fetchSchools = async () => {
    try {
      console.log("🔄 Fetching schools...");
      const response = await fetch(`${API_BASE_URL}/api/v1/schools`);
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Schools received:", data.length);
        setSchools(data);
      } else {
        console.error("Failed to fetch schools:", response.status);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  // 🔥 FETCH CLASSES - DIRECT (inapokea schoolId parameter)
  const fetchClassesDirect = async (schoolId: string) => {
    if (!schoolId) {
      console.warn("⚠️ No school ID provided");
      return;
    }
    
    console.log("🔄 Fetching classes for school:", schoolId);
    
    try {
      const endpoint = `${API_BASE_URL}/api/v1/parents/public/classes?school_id=${schoolId}`;
      
      console.log("📡 Endpoint:", endpoint);
      
      const response = await fetch(endpoint);
      console.log("📡 Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Classes received:", data);
        console.log("📚 Number of classes:", data.length);
        
        if (data && data.length > 0) {
          setClasses(data);
          console.log("✅ Classes set successfully!");
        } else {
          console.warn("⚠️ No classes received from API");
          setClasses([]);
        }
        
        setSelectedClass("");
        setSelectedStream("all");
        setStreams([]);
      } else {
        console.error("Failed to fetch classes:", response.status);
        setClasses([]);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setClasses([]);
    }
  };

  // 🔥 FETCH STREAMS
  const fetchStreams = async (classId: string) => {
    if (!classId) return;
    
    try {
      console.log("🔄 Fetching streams for class:", classId);
      const endpoint = `${API_BASE_URL}/api/v1/parents/public/streams?class_id=${classId}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Streams received:", data.length);
        setStreams(data);
      } else {
        console.error("Failed to fetch streams:", response.status);
        setStreams([]);
      }
    } catch (err) {
      console.error("Error fetching streams:", err);
      setStreams([]);
    }
  };

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================

  // 🔥 HANDLE SCHOOL LEVEL CHANGE
  const handleSchoolLevelChange = (value: string) => {
    console.log("🔄 School level changed to:", value);
    setSchoolLevel(value);
    setSelectedSchoolId("");
    setClasses([]);
    setStreams([]);
    setSelectedClass("");
    setSelectedStream("all");
    setSearchResults([]);
    setShowResults(false);
    setSelectedStudent(null);
  };

  // 🔥 HANDLE SCHOOL CHANGE
  const handleSchoolChange = (value: string) => {
    console.log("🔄 School changed to:", value);
    
    setSelectedSchoolId(value);
    setClasses([]);
    setStreams([]);
    setSelectedClass("");
    setSelectedStream("all");
    setSearchResults([]);
    setShowResults(false);
    setSelectedStudent(null);
    
    if (value) {
      console.log("📡 Calling fetchClassesDirect with:", value);
      fetchClassesDirect(value);
    }
  };

  // 🔥 HANDLE CLASS CHANGE
  const handleClassChange = (value: string) => {
    console.log("🔄 Class changed to:", value);
    setSelectedClass(value);
    setSelectedStream("all");
    setStreams([]);
    if (value) {
      fetchStreams(value);
    }
  };

  // 🔥 SEARCH STUDENTS - ILIYOBORESHA (AUTO-SELECT IKIWA MMOJA)
  const handleSearch = async () => {
    if (!selectedSchoolId) {
      setError("Tafadhali chagua shule");
      return;
    }
    
    if (!selectedClass) {
      setError("Tafadhali chagua darasa");
      return;
    }

    setSearching(true);
    setError("");
    setShowResults(false);
    setSelectedStudent(null);

    try {
      const params = new URLSearchParams({
        school_id: selectedSchoolId,
        class_id: selectedClass,
      });
      
      if (selectedStream && selectedStream !== "all") {
        params.append("stream_id", selectedStream);
      }
      if (rollNumber) {
        params.append("roll_number", rollNumber);
      }

      const endpoint = `${API_BASE_URL}/api/v1/parents/public/students?${params.toString()}`;
      console.log("📡 Searching students:", endpoint);

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Students found:", data.length);
        setSearchResults(data);
        setShowResults(true);
        
        // 🔥 AUTO-SELECT IKIWA MWANAFUNZI NI MMOJA TU!
        if (data.length === 1) {
          setSelectedStudent(data[0]);
          setSuccess(`✅ Mwanafunzi ${data[0].name} amechaguliwa kiotomatiki! Tafadhali chagua uhusiano na ubonyeze Ongeza.`);
          setTimeout(() => setSuccess(""), 4000);
        } else if (data.length === 0) {
          setError("Hakuna wanafunzi waliopatikana kwa vigezo ulivyochagua");
          setSelectedStudent(null);
        } else {
          // Wazazi wachague mmoja
          setSelectedStudent(null);
          setError("");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Imeshindwa kutafuta wanafunzi");
        setSelectedStudent(null);
      }
    } catch (err: any) {
      setError(err.message || "Imeshindwa kutafuta wanafunzi");
      setSelectedStudent(null);
    } finally {
      setSearching(false);
    }
  };

  // 🔥 ADD CHILD
  const handleAddChild = async () => {
    if (!selectedStudent) {
      setError("Tafadhali chagua mwanafunzi");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parents/children`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          relationship: relationship,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`✅ ${selectedStudent.name} ameongezwa kikamilifu!`);
        setChildren([...children, data]);
        setSelectedStudent(null);
        setShowResults(false);
        setSearchResults([]);
        setRollNumber("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Imeshindwa kuongeza mtoto");
      }
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuongeza mtoto");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 REMOVE CHILD
  const handleRemoveChild = async (childId: number, childName: string) => {
    if (!confirm(`Je, una uhakika unataka kumwondoa ${childName}?`)) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/parents/children/${childId}`,
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
        }
      );

      if (response.ok) {
        setChildren(children.filter(c => c.id !== childId));
        setSuccess(`✅ ${childName} ameondolewa kikamilifu`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Imeshindwa kumwondoa mtoto");
      }
    } catch (err) {
      setError("Imeshindwa kumwondoa mtoto");
    }
  };

  // 🔥 GET SCHOOL LEVEL LABEL
  const getSchoolLevelLabel = (level: string) => {
    return level === "primary" ? "🏫 Shule ya Msingi" : "📚 Shule ya Sekondari";
  };

  // 🔥 FILTER SCHOOLS BY LEVEL
  const filteredSchools = schools.filter(s => s.school_level === schoolLevel);

  // ============================================================
  // 🔥 RENDER
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
          <p className="text-gray-600 mt-4">Inapakia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/parent/dashboard">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden xs:inline">Rudi Dashboard</span>
                <span className="inline xs:hidden">Rudi</span>
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Ongeza Mtoto</h1>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{error}</span>
          </div>
        )}

        {/* Children List */}
        {children.length > 0 && (
          <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-xl">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-sm sm:text-base">Watoto Waliopo ({children.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                        {child.student_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{child.student_name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {child.class_name} {child.stream_name}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveChild(child.id, child.student_name)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Form */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              <span className="text-sm sm:text-base">Tafuta Mtoto Wako</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Chagua aina ya shule, kisha chagua shule na darasa la mtoto wako kumtafuta na kumuongeza kwenye akaunti yako
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-4">
              {/* 🔥 SCHOOL LEVEL SELECT */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                  <School className="h-4 w-4 text-emerald-600" />
                  Aina ya Shule *
                </Label>
                <Select value={schoolLevel} onValueChange={handleSchoolLevelChange}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Chagua aina ya shule" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem value="primary">🏫 Shule ya Msingi (Primary)</SelectItem>
                    <SelectItem value="secondary">📚 Shule ya Sekondari (Secondary)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  Umechagua: <span className="font-medium text-emerald-600">{getSchoolLevelLabel(schoolLevel)}</span>
                </p>
              </div>

              {/* 🔥 SCHOOL SELECT */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Chagua Shule *
                </Label>
                <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder={filteredSchools.length === 0 ? "Hakuna shule za aina hii" : "Chagua shule"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60">
                    {filteredSchools.length === 0 ? (
                      <SelectItem value="none" disabled>Hakuna shule zilizopatikana</SelectItem>
                    ) : (
                      filteredSchools.map((school) => (
                        <SelectItem key={school.id} value={school.id.toString()}>
                          {school.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {selectedSchoolId && (
                  <p className="text-xs text-emerald-600">
                    ✅ Shule imechaguliwa: <span className="font-medium">{schools.find(s => s.id.toString() === selectedSchoolId)?.name}</span>
                  </p>
                )}
              </div>

              {/* 🔥 CLASSES, STREAMS, ROLL NUMBER */}
              {selectedSchoolId && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Darasa *</Label>
                    <Select 
                      value={selectedClass} 
                      onValueChange={handleClassChange}
                      disabled={classes.length === 0}
                    >
                      <SelectTrigger className={`bg-white border-gray-200 ${classes.length === 0 ? "opacity-50" : ""}`}>
                        <SelectValue placeholder={classes.length === 0 ? "Hakuna madarasa" : "Chagua darasa"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60">
                        {classes.length === 0 ? (
                          <SelectItem value="none" disabled>Hakuna madarasa</SelectItem>
                        ) : (
                          classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {classes.length > 0 && (
                      <p className="text-xs text-emerald-600">
                        ✅ Madarasa {classes.length} yamepatikana
                      </p>
                    )}
                    {selectedSchoolId && classes.length === 0 && (
                      <p className="text-xs text-amber-600">
                        ⏳ Hakuna madarasa yaliyopatikana
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Mkondo (si lazima)</Label>
                    <Select 
                      value={selectedStream} 
                      onValueChange={setSelectedStream}
                      disabled={!selectedClass}
                    >
                      <SelectTrigger className={`bg-white border-gray-200 ${!selectedClass ? "opacity-50" : ""}`}>
                        <SelectValue placeholder="Chagua mkondo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60">
                        <SelectItem value="all">Mikondo yote</SelectItem>
                        {streams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Namba (si lazima)</Label>
                    <Input
                      placeholder="Namba ya mtoto"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSearch}
                disabled={searching || !selectedSchoolId || !selectedClass || classes.length === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Tafuta Wanafunzi
              </Button>

              {/* Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                    Wanafunzi Waliopatikana ({searchResults.length})
                  </h3>
                  
                  {/* 🔥 MAELEKEZO KWA MZAZI */}
                  {searchResults.length > 1 && (
                    <p className="text-xs text-amber-600 mb-3 flex items-center gap-1">
                      <span className="text-base">👆</span>
                      Bonyeza mwanafunzi mmoja kati ya hawa kuongeza kwenye akaunti yako
                    </p>
                  )}
                  {searchResults.length === 1 && selectedStudent && (
                    <p className="text-xs text-emerald-600 mb-3 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Mwanafunzi amechaguliwa kiotomatiki! Chagua uhusiano na ubonyeze Ongeza.
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {searchResults.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedStudent?.id === student.id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedStudent(student);
                          setError("");
                        }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm truncate">{student.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.class_name} {student.stream_name} • Namba: {student.roll_number || "-"}
                            </p>
                          </div>
                        </div>
                        {selectedStudent?.id === student.id && (
                          <Badge className="bg-emerald-500 text-xs flex-shrink-0">Imechaguliwa</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Relationship & Add Button */}
                  {selectedStudent && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-emerald-50 rounded-lg border border-emerald-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="flex-1 min-w-[160px] sm:min-w-[200px]">
                          <Label className="text-gray-700 font-medium text-sm">Uhusiano</Label>
                          <Select value={relationship} onValueChange={setRelationship}>
                            <SelectTrigger className="bg-white border-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="Biological">Mzazi wa Kawaida</SelectItem>
                              <SelectItem value="Guardian">Mlezi</SelectItem>
                              <SelectItem value="Step Parent">Mzazi wa Kambo</SelectItem>
                              <SelectItem value="Other">Mwingine</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleAddChild}
                          disabled={submitting}
                          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-sm flex-1 sm:flex-none"
                        >
                          {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Ongeza Mtoto
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}