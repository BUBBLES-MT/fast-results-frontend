// app/parent/add-child/page.tsx
// 🔥 VERSION 2.0 - PRO MAX WITH MOBILE FIRST DESIGN!

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
  Home,
  User,
  Calendar,
  Star,
  Shield,
  Crown,
  Award,
  TrendingUp,
  Clock,
  Rocket,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE
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
// 🔥 TYPING EFFECT WORDS
// ============================================================
const TYPING_WORDS = [
  "👨‍👧‍👦 Connect with your child",
  "📚 Track academic progress",
  "🏆 Celebrate achievements",
  "❤️ Stay involved in education",
];

// ============================================================
// 🔥 TYPING EFFECT COMPONENT
// ============================================================
function TypingEffect() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];
    
    const timer = setTimeout(() => {
      if (isWaiting) {
        setIsWaiting(false);
        return;
      }
      
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.substring(0, text.length + 1));
        } else {
          setIsWaiting(true);
          setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.substring(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [text, wordIndex, isDeleting, isWaiting]);

  return (
    <div className="h-6 sm:h-8 flex items-center justify-center">
      <span className="text-sm sm:text-base md:text-lg font-medium text-white/95">
        {text}
        <span className="inline-block w-0.5 h-4 sm:h-5 md:h-6 ml-0.5 bg-white animate-pulse" />
      </span>
    </div>
  );
}

// ============================================================
// 🔥 COMPONENTS
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
// 🔥 STAT CARD
// ============================================================

function StatCard({ label, value, icon: Icon, color = "sky" }: { label: string; value: string | number; icon: any; color?: "sky" | "emerald" | "purple" | "amber" | "rose" }) {
  const colors = {
    sky: "from-sky-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    purple: "from-purple-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
  };

  return (
    <div className={cn(
      "rounded-2xl p-4 text-white shadow-xl",
      "bg-gradient-to-r",
      colors[color]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-0.5">{value}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      <div className="mt-2 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft" />
      </div>
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
      const response = await fetch(`${API_BASE}/api/v1/schools`);
      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const fetchClassesDirect = async (schoolId: string) => {
    if (!schoolId) return;
    try {
      const response = await fetch(`${API_BASE}/api/v1/parents/public/classes?school_id=${schoolId}`);
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        setSelectedClass("");
        setSelectedStream("all");
        setStreams([]);
      } else {
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
      const response = await fetch(`${API_BASE}/api/v1/parents/public/streams?class_id=${classId}`);
      if (response.ok) {
        const data = await response.json();
        setStreams(data);
      } else {
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

      const response = await fetch(`${API_BASE}/api/v1/parents/public/students?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowResults(true);
        if (data.length === 1) {
          setSelectedStudent(data[0]);
          setSuccess(`✅ Mwanafunzi ${data[0].name} amechaguliwa kiotomatiki!`);
          setTimeout(() => setSuccess(""), 4000);
        } else if (data.length === 0) {
          setError("Hakuna wanafunzi waliopatikana");
          setSelectedStudent(null);
        } else {
          setSelectedStudent(null);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Imeshindwa kutafuta wanafunzi");
      }
    } catch (err: any) {
      setError(err.message || "Imeshindwa kutafuta wanafunzi");
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
      case "Biological": return "Mzazi wa Kawaida";
      case "Guardian": return "Mlezi";
      case "Step Parent": return "Mzazi wa Kambo";
      default: return "Mwingine";
    }
  };

  const filteredSchools = schools.filter((s) => s.school_level === schoolLevel);

  // ============================================================
  // 🔥 LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 relative z-10" />
          </div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100">
      {/* Hero Section - PRO MAX! */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-72 h-72 md:w-96 md:h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-72 h-72 md:w-96 md:h-96 bg-teal-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                Parent Portal
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Add Your Child
              </h1>
              <div className="mt-1">
                <TypingEffect />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-3 py-1.5 text-sm">
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                {children.length} Children
              </Badge>
              <Link href="/parent/dashboard">
                <Button className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 gap-2 rounded-xl h-9 sm:h-10 text-sm touch-feedback">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 animate-fadeIn">
        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard label="Watoto" value={children.length} icon={Heart} color="emerald" />
          <StatCard label="Schools" value={schools.length} icon={School} color="sky" />
          <StatCard label="Search Results" value={searchResults.length} icon={Search} color="purple" />
          <StatCard label="Status" value={children.length > 0 ? "✅ Active" : "📝 Pending"} icon={CheckCircle} color="amber" />
        </div>

        {/* Children List */}
        {children.length > 0 && (
          <Card className="mb-4 sm:mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl text-emerald-800">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-sm sm:text-base">My Children ({children.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-all duration-300 border border-emerald-100 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0 shadow-md">
                        {child.student_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                          {child.student_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded-full">{child.class_name}</span>
                          {child.stream_name && <span className="bg-gray-100 px-1.5 py-0.5 rounded-full">{child.stream_name}</span>}
                          <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                            {getRelationshipLabel(child.relationship)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveChild(child.id, child.student_name)}
                      className="flex-shrink-0 rounded-xl h-8 w-8 sm:h-9 sm:w-9 p-0 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Form */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-sm sm:text-base text-gray-800">Find Your Child</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600">
              Select school type, then choose your child's school and class to find and add them
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-4">
              {/* School Level */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                  <School className="h-4 w-4 text-emerald-600" />
                  School Type *
                </Label>
                <Select value={schoolLevel} onValueChange={handleSchoolLevelChange}>
                  <SelectTrigger className="bg-white border-emerald-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-emerald-200 shadow-lg rounded-xl">
                    <SelectItem value="primary">🏫 Primary School</SelectItem>
                    <SelectItem value="secondary">📚 Secondary School</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* School */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  Select School *
                </Label>
                <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
                  <SelectTrigger className={cn(
                    "bg-white border-blue-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm",
                    filteredSchools.length === 0 && "opacity-50"
                  )}>
                    <SelectValue placeholder={filteredSchools.length === 0 ? "No schools available" : "Select school"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200 shadow-lg rounded-xl max-h-60">
                    {filteredSchools.length === 0 ? (
                      <SelectItem value="none" disabled>No schools found</SelectItem>
                    ) : (
                      filteredSchools.map((school) => (
                        <SelectItem key={school.id} value={school.id.toString()}>
                          {school.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Class, Stream, Roll Number */}
              {selectedSchoolId && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      Class *
                    </Label>
                    <Select value={selectedClass} onValueChange={handleClassChange} disabled={classes.length === 0}>
                      <SelectTrigger className={cn(
                        "bg-white border-purple-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm",
                        classes.length === 0 && "opacity-50"
                      )}>
                        <SelectValue placeholder={classes.length === 0 ? "No classes" : "Select class"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-purple-200 shadow-lg rounded-xl max-h-60">
                        {classes.length === 0 ? (
                          <SelectItem value="none" disabled>No classes available</SelectItem>
                        ) : (
                          classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                      Stream (Optional)
                    </Label>
                    <Select value={selectedStream} onValueChange={setSelectedStream} disabled={!selectedClass}>
                      <SelectTrigger className={cn(
                        "bg-white border-amber-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm",
                        !selectedClass && "opacity-50"
                      )}>
                        <SelectValue placeholder="All streams" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-amber-200 shadow-lg rounded-xl max-h-60">
                        <SelectItem value="all">All Streams</SelectItem>
                        {streams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-cyan-600" />
                      Roll Number (Optional)
                    </Label>
                    <Input
                      placeholder="Enter roll number"
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
                Search Students
              </Button>

              {/* Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="mt-4 sm:mt-6 animate-slideIn">
                  <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    Results ({searchResults.length})
                  </h3>

                  {searchResults.length > 1 && (
                    <p className="text-[10px] sm:text-xs text-amber-600 mb-3 flex items-center gap-1">
                      <span className="text-base">👆</span>
                      Select one student to add to your account
                    </p>
                  )}

                  <div className="space-y-2">
                    {searchResults.map((student) => (
                      <div
                        key={student.id}
                        className={cn(
                          "flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer touch-feedback",
                          selectedStudent?.id === student.id
                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                        )}
                        onClick={() => {
                          setSelectedStudent(student);
                          setError("");
                        }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0 shadow-md">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                              {student.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                              {student.class_name} {student.stream_name} • Roll: {student.roll_number || "-"}
                            </p>
                          </div>
                        </div>
                        {selectedStudent?.id === student.id && (
                          <Badge className="bg-emerald-500 text-white text-[10px] sm:text-xs flex-shrink-0 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Relationship & Add */}
                  {selectedStudent && (
                    <div className="mt-4 p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 animate-slideIn shadow-md">
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <div className="w-full sm:flex-1">
                          <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                            <Heart className="h-4 w-4 text-rose-500" />
                            Relationship
                          </Label>
                          <Select value={relationship} onValueChange={setRelationship}>
                            <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-9 sm:h-10 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                              <SelectItem value="Biological">❤️ Biological Parent</SelectItem>
                              <SelectItem value="Guardian">👨‍👦 Guardian</SelectItem>
                              <SelectItem value="Step Parent">👨‍👩‍👦 Step Parent</SelectItem>
                              <SelectItem value="Other">🤝 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleAddChild}
                          disabled={submitting}
                          className="w-full sm:w-auto gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 text-sm touch-feedback"
                        >
                          {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Add Child
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 sm:py-6 mt-4 sm:mt-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base text-emerald-400">MASI FAST RESULTS</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">Parent Portal • Connect with Your Child</p>
          <p className="text-gray-600 text-[10px] sm:text-xs mt-2">
            &copy; {new Date().getFullYear()} MASI FAST RESULTS SYSTEM. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .touch-feedback { @apply active:scale-95 transition-transform duration-150; }
        @media (max-width: 399px) {
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
        @media (min-width: 400px) {
          .xs\\:inline { display: none !important; }
          .xs\\:hidden { display: inline !important; }
        }
      `}</style>
    </div>
  );
}