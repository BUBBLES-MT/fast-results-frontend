// app/parent/add-child/page.tsx

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
  Plus,
  Trash2,
  X,
  School,
  Building2,
  ChevronLeft,
  Sparkles,
  Heart,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
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
// 🔥 MOBILE LAYOUT COMPONENTS
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
    >
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Rudi</span>
    </button>
  );
}

function MobileAlert({
  type,
  message,
  onClose,
}: {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-lg animate-slideIn border",
        styles[type]
      )}
    >
      {icons[type]}
      <p className="text-sm sm:text-base break-words flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function ParentAddChildPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [children, setChildren] = useState<Child[]>([]);
  const [schoolLevel, setSchoolLevel] = useState("primary");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");

  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStream, setSelectedStream] = useState("all");
  const [rollNumber, setRollNumber] = useState("");

  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [relationship, setRelationship] = useState("Biological");

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

  const fetchChildren = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/parents/children`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

  const fetchSchools = async () => {
    try {
      console.log("🔄 Fetching schools...");
      const response = await fetch(`${API_BASE}/api/v1/schools`);
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Schools received:", data.length);
        setSchools(data);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const fetchClassesDirect = async (schoolId: string) => {
    if (!schoolId) return;

    console.log("🔄 Fetching classes for school:", schoolId);

    try {
      const endpoint = `${API_BASE}/api/v1/parents/public/classes?school_id=${schoolId}`;
      const response = await fetch(endpoint);

      if (response.ok) {
        const data = await response.json();
        console.log("📚 Classes received:", data.length);

        if (data && data.length > 0) {
          setClasses(data);
        } else {
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

  const fetchStreams = async (classId: string) => {
    if (!classId) return;

    try {
      console.log("🔄 Fetching streams for class:", classId);
      const endpoint = `${API_BASE}/api/v1/parents/public/streams?class_id=${classId}`;

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
      fetchClassesDirect(value);
    }
  };

  const handleClassChange = (value: string) => {
    console.log("🔄 Class changed to:", value);
    setSelectedClass(value);
    setSelectedStream("all");
    setStreams([]);
    if (value) {
      fetchStreams(value);
    }
  };

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

      const endpoint = `${API_BASE}/api/v1/parents/public/students?${params.toString()}`;
      console.log("📡 Searching students:", endpoint);

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Students found:", data.length);
        setSearchResults(data);
        setShowResults(true);

        if (data.length === 1) {
          setSelectedStudent(data[0]);
          setSuccess(
            `✅ Mwanafunzi ${data[0].name} amechaguliwa kiotomatiki! Tafadhali chagua uhusiano na ubonyeze Ongeza.`
          );
          setTimeout(() => setSuccess(""), 4000);
        } else if (data.length === 0) {
          setError("Hakuna wanafunzi waliopatikana kwa vigezo ulivyochagua");
          setSelectedStudent(null);
        } else {
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

  const handleAddChild = async () => {
    if (!selectedStudent) {
      setError("Tafadhali chagua mwanafunzi");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/api/v1/parents/children`, {
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

  const handleRemoveChild = async (childId: number, childName: string) => {
    if (!confirm(`Je, una uhakika unataka kumwondoa ${childName}?`)) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/parents/children/${childId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setChildren(children.filter((c) => c.id !== childId));
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

  const getSchoolLevelLabel = (level: string) => {
    return level === "primary" ? "🏫 Shule ya Msingi" : "📚 Shule ya Sekondari";
  };

  const getRelationshipLabel = (rel: string) => {
    switch (rel) {
      case "Biological":
        return "Mzazi wa Kawaida";
      case "Guardian":
        return "Mlezi";
      case "Step Parent":
        return "Mzazi wa Kambo";
      default:
        return "Mwingine";
    }
  };

  const filteredSchools = schools.filter((s) => s.school_level === schoolLevel);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 relative z-10" />
          </div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base">Inapakia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/parent/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl h-9 sm:h-10 text-xs sm:text-sm touch-feedback"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Rudi Dashboard</span>
                <span className="inline xs:hidden">Rudi</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-emerald-500/30">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Ongeza Mtoto
              </h1>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] sm:text-xs">
            <Heart className="h-3 w-3 mr-1" />
            {children.length} Watoto
          </Badge>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Children List */}
        {children.length > 0 && (
          <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl text-emerald-800">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-sm sm:text-base">Watoto Waliopo ({children.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-all duration-300 border border-emerald-100"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 shadow-md">
                        {child.student_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                          {child.student_name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                          {child.class_name} {child.stream_name} • {getRelationshipLabel(child.relationship)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveChild(child.id, child.student_name)}
                      className="flex-shrink-0 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Form */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-sm sm:text-base text-gray-800">Tafuta Mtoto Wako</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600">
              Chagua aina ya shule, kisha chagua shule na darasa la mtoto wako kumtafuta na kumuongeza kwenye
              akaunti yako
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-4">
              {/* School Level */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                  <School className="h-4 w-4 text-emerald-600" />
                  Aina ya Shule *
                </Label>
                <Select value={schoolLevel} onValueChange={handleSchoolLevelChange}>
                  <SelectTrigger className="bg-white border-emerald-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua aina ya shule" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-emerald-200 shadow-lg rounded-xl">
                    <SelectItem value="primary">🏫 Shule ya Msingi (Primary)</SelectItem>
                    <SelectItem value="secondary">📚 Shule ya Sekondari (Secondary)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Umechagua:{" "}
                  <span className="font-medium text-emerald-600">{getSchoolLevelLabel(schoolLevel)}</span>
                </p>
              </div>

              {/* School Select */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  Chagua Shule *
                </Label>
                <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
                  <SelectTrigger
                    className={cn(
                      "bg-white border-blue-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm",
                      filteredSchools.length === 0 && "opacity-50"
                    )}
                  >
                    <SelectValue
                      placeholder={
                        filteredSchools.length === 0 ? "Hakuna shule za aina hii" : "Chagua shule"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200 shadow-lg rounded-xl max-h-60">
                    {filteredSchools.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Hakuna shule zilizopatikana
                      </SelectItem>
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
                  <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Shule imechaguliwa:{" "}
                    <span className="font-medium">
                      {schools.find((s) => s.id.toString() === selectedSchoolId)?.name}
                    </span>
                  </p>
                )}
              </div>

              {/* Class, Stream, Roll Number */}
              {selectedSchoolId && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Class */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      Darasa *
                    </Label>
                    <Select
                      value={selectedClass}
                      onValueChange={handleClassChange}
                      disabled={classes.length === 0}
                    >
                      <SelectTrigger
                        className={cn(
                          "bg-white border-purple-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm",
                          classes.length === 0 && "opacity-50"
                        )}
                      >
                        <SelectValue
                          placeholder={classes.length === 0 ? "Hakuna madarasa" : "Chagua darasa"}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-purple-200 shadow-lg rounded-xl max-h-60">
                        {classes.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Hakuna madarasa
                          </SelectItem>
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
                      <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Madarasa {classes.length} yamepatikana
                      </p>
                    )}
                  </div>

                  {/* Stream */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                      Mkondo (si lazima)
                    </Label>
                    <Select
                      value={selectedStream}
                      onValueChange={setSelectedStream}
                      disabled={!selectedClass}
                    >
                      <SelectTrigger
                        className={cn(
                          "bg-white border-amber-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm",
                          !selectedClass && "opacity-50"
                        )}
                      >
                        <SelectValue placeholder="Chagua mkondo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-amber-200 shadow-lg rounded-xl max-h-60">
                        <SelectItem value="all">Mikondo yote</SelectItem>
                        {streams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-cyan-600" />
                      Namba (si lazima)
                    </Label>
                    <Input
                      placeholder="Namba ya mtoto"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="bg-white border-cyan-200 focus:ring-2 focus:ring-cyan-500 rounded-xl h-10 sm:h-11 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={searching || !selectedSchoolId || !selectedClass || classes.length === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
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
                <div className="mt-4 sm:mt-6 animate-slideIn">
                  <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    Wanafunzi Waliopatikana ({searchResults.length})
                  </h3>

                  {searchResults.length > 1 && (
                    <p className="text-[10px] sm:text-xs text-amber-600 mb-3 flex items-center gap-1">
                      <span className="text-base">👆</span>
                      Bonyeza mwanafunzi mmoja kati ya hawa kuongeza kwenye akaunti yako
                    </p>
                  )}
                  {searchResults.length === 1 && selectedStudent && (
                    <p className="text-[10px] sm:text-xs text-emerald-600 mb-3 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Mwanafunzi amechaguliwa kiotomatiki! Chagua uhusiano na ubonyeze Ongeza.
                    </p>
                  )}

                  <div className="space-y-2">
                    {searchResults.map((student) => (
                      <div
                        key={student.id}
                        className={cn(
                          "flex items-center justify-between p-2 sm:p-3 rounded-xl border-2 transition-all cursor-pointer touch-feedback",
                          selectedStudent?.id === student.id
                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                        )}
                        onClick={() => {
                          setSelectedStudent(student);
                          setError("");
                        }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 shadow-md">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                              {student.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                              {student.class_name} {student.stream_name} • Namba:{" "}
                              {student.roll_number || "-"}
                            </p>
                          </div>
                        </div>
                        {selectedStudent?.id === student.id && (
                          <Badge className="bg-emerald-500 text-white text-[10px] sm:text-xs flex-shrink-0 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Imechaguliwa
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Relationship & Add Button */}
                  {selectedStudent && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 animate-slideIn shadow-md">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="flex-1 min-w-[160px] sm:min-w-[200px]">
                          <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                            <Heart className="h-4 w-4 text-rose-500" />
                            Uhusiano
                          </Label>
                          <Select value={relationship} onValueChange={setRelationship}>
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-9 sm:h-10 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              <SelectItem value="Biological">❤️ Mzazi wa Kawaida</SelectItem>
                              <SelectItem value="Guardian">👨‍👦 Mlezi</SelectItem>
                              <SelectItem value="Step Parent">👨‍👩‍👦 Mzazi wa Kambo</SelectItem>
                              <SelectItem value="Other">🤝 Mwingine</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleAddChild}
                          disabled={submitting}
                          className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-9 sm:h-10 text-sm flex-1 sm:flex-none touch-feedback"
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

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100/50 mt-4 sm:mt-6 animate-fadeIn">
          <p className="font-medium text-emerald-600">© 2026 MASI FAST RESULTS • Parent Portal</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>❤️ {children.length} watoto</span>
            <span>•</span>
            <span>🏫 {schools.length} shule</span>
            <span>•</span>
            <span>🔍 Tafuta mtoto wako</span>
          </p>
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

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
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
    </div>
  );
}