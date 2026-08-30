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
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  UserPlus,
  School,
  Phone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
  Search,
  UserCheck,
  Users,
  GraduationCap,
  Shield,
  Sparkles,
  Star,
  Heart,
  Globe,
  Award,
  TrendingUp,
  Clock,
  User,
  Key,
  BookOpen,
  Calendar,
  Check,
  XCircle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface School {
  id: number;
  name: string;
  school_type: string;
  school_level: string;
}

interface Class {
  id: number;
  name: string;
}

interface Stream {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  roll_number: string;
  class_name: string;
  stream_name: string;
}

// ============================================================
// 🔥 PASSWORD STRENGTH COMPONENT
// ============================================================
function PasswordSection({
  password,
  confirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onPasswordChange,
  onConfirmChange,
}: {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // Check password requirements
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const requirementsMet = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
  const requirementsCount = requirementsMet.filter(Boolean).length;

  // Calculate strength
  const getStrength = () => {
    if (password.length === 0) return { label: "", color: "", width: 0 };
    if (requirementsCount <= 2) return { label: "Dhaifu", color: "bg-red-500", width: 20 };
    if (requirementsCount === 3) return { label: "Wastani", color: "bg-orange-500", width: 40 };
    if (requirementsCount === 4) return { label: "Nzuri", color: "bg-blue-500", width: 70 };
    return { label: "Imara 💪", color: "bg-emerald-500", width: 100 };
  };

  const strength = getStrength();

  // Check if passwords match
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="space-y-3">
      {/* Password Field */}
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium flex items-center gap-2">
          <Lock className="h-4 w-4 text-sky-600" />
          Nenosiri *
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Angalau herufi 6, herufi, namba na alama maalum"
            value={password}
            onChange={onPasswordChange}
            className={cn(
              "bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-12 h-11 rounded-xl transition-all duration-200",
              password.length > 0 && "border-sky-300"
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-feedback"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Password Strength Bar */}
      {password.length > 0 && (
        <div className="space-y-1 animate-slideIn">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Nguvu ya Nenosiri</span>
            <span
              className={cn(
                "text-xs font-semibold",
                strength.label === "Dhaifu" && "text-red-500",
                strength.label === "Wastani" && "text-orange-500",
                strength.label === "Nzuri" && "text-blue-500",
                strength.label === "Imara 💪" && "text-emerald-500"
              )}
            >
              {strength.label}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", strength.color)}
              style={{ width: `${strength.width}%` }}
            />
          </div>
        </div>
      )}

      {/* Password Requirements Checklist */}
      {password.length > 0 && (
        <div className="grid grid-cols-2 gap-1 animate-slideIn">
          <div className="flex items-center gap-1.5">
            {hasMinLength ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-300" />
            )}
            <span className={cn("text-[10px]", hasMinLength ? "text-emerald-600" : "text-gray-400")}>
              Angalau herufi 6
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {hasUpperCase ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-300" />
            )}
            <span className={cn("text-[10px]", hasUpperCase ? "text-emerald-600" : "text-gray-400")}>
              Herufi Kubwa (A-Z)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {hasLowerCase ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-300" />
            )}
            <span className={cn("text-[10px]", hasLowerCase ? "text-emerald-600" : "text-gray-400")}>
              Herufi Ndogo (a-z)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {hasNumber ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-300" />
            )}
            <span className={cn("text-[10px]", hasNumber ? "text-emerald-600" : "text-gray-400")}>
              Namba (0-9)
            </span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            {hasSpecialChar ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-300" />
            )}
            <span className={cn("text-[10px]", hasSpecialChar ? "text-emerald-600" : "text-gray-400")}>
              Alama Maalum (!@#$%^&* n.k.)
            </span>
          </div>
        </div>
      )}

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium flex items-center gap-2">
          <Lock className="h-4 w-4 text-sky-600" />
          Hakikisha Nenosiri *
        </Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Hakikisha nenosiri lako"
            value={confirmPassword}
            onChange={onConfirmChange}
            className={cn(
              "bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-12 h-11 rounded-xl transition-all duration-200",
              passwordsMatch && "border-emerald-500 ring-2 ring-emerald-200",
              passwordsDontMatch && "border-red-500 ring-2 ring-red-200"
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-feedback"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Match Status Indicator */}
        {confirmPassword.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1 animate-slideIn">
            {passwordsMatch ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">
                  ✅ Nenosiri zinafanana!
                </span>
              </>
            ) : passwordsDontMatch ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs text-red-600 font-medium">
                  ❌ Nenosiri hazifanani!
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ParentRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // School Data
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searching, setSearching] = useState(false);

  // Child Search Form
  const [childSearch, setChildSearch] = useState({
    school_level: "",
    school_id: "",
    class_id: "",
    stream_id: "all",
    roll_number: "",
  });

  // Parent Form
  const [parentData, setParentData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (childSearch.school_id) {
      fetchClasses(childSearch.school_id);
    }
  }, [childSearch.school_id]);

  useEffect(() => {
    if (childSearch.class_id) {
      fetchStreams(childSearch.class_id);
    }
  }, [childSearch.class_id]);

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/schools`);
      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const fetchClasses = async (schoolId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/parents/public/classes?school_id=${schoolId}`
      );
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setClasses([]);
    }
  };

  const fetchStreams = async (classId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/parents/public/streams?class_id=${classId}`
      );
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

  const handleSearchChild = async () => {
    if (!childSearch.school_id || !childSearch.class_id) {
      setError("⚠️ Tafadhali chagua shule na darasa");
      return;
    }

    setSearching(true);
    setError("");
    setSelectedStudent(null);

    try {
      const params = new URLSearchParams({
        school_id: childSearch.school_id,
        class_id: childSearch.class_id,
      });
      
      if (childSearch.stream_id && childSearch.stream_id !== "all") {
        params.append("stream_id", childSearch.stream_id);
      }
      if (childSearch.roll_number) {
        params.append("roll_number", childSearch.roll_number);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/parents/public/students?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        if (data.length === 0) {
          setError("🔍 Hakuna mtoto aliyepatikana. Tafadhali hakiki taarifa zako.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Imeshindwa kutafuta mtoto. Tafadhali jaribu tena.");
      }
    } catch (err) {
      console.error("Error searching child:", err);
      setError("⚠️ Imeshindwa kuunganisha na server. Tafadhali jaribu tena.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudents([]);
    setError("");
    setSuccess(`✅ Mwanafunzi ${student.name} amepatikana! Sasa jaza taarifa zako.`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleParentChange = (field: string, value: string) => {
    setParentData({ ...parentData, [field]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentData({ ...parentData, password: e.target.value });
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentData({ ...parentData, confirm_password: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (parentData.password !== parentData.confirm_password) {
      setError("⚠️ Nenosiri hazifanani");
      setLoading(false);
      return;
    }

    if (parentData.password.length < 6) {
      setError("⚠️ Nenosiri lazima iwe na herufi 6 au zaidi");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parents/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parentData.name,
          phone: parentData.phone,
          email: parentData.email || undefined,
          address: parentData.address || undefined,
          username: parentData.username,
          password: parentData.password,
          confirm_password: parentData.confirm_password,
          school_id: parseInt(childSearch.school_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Usajili umeshindwa");
      }

      const linkResponse = await fetch(`${API_BASE_URL}/api/v1/parents/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          student_id: selectedStudent?.id,
          relationship: "Mzazi",
        }),
      });

      if (!linkResponse.ok) {
        console.warn("Failed to link child, but parent was created.");
      }

      setSuccess(
        `✅ Usajili wako umekamilika! Mwanafunzi ${selectedStudent?.name} ameunganishwa na akaunti yako.`
      );
      setTimeout(() => {
        router.push("/parent/login");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Usajili umeshindwa. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-6 relative overflow-hidden">
      {/* 🔥 Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Floating icons */}
        <div className="absolute top-10 left-10 text-sky-200/20 animate-float">
          <GraduationCap className="h-16 w-16" />
        </div>
        <div className="absolute bottom-10 right-10 text-blue-200/20 animate-float animation-delay-3000">
          <School className="h-20 w-20" />
        </div>
        <div className="absolute top-1/3 right-20 text-indigo-200/20 animate-float animation-delay-1500">
          <Star className="h-12 w-12" />
        </div>
        <div className="absolute bottom-1/3 left-20 text-sky-200/20 animate-float animation-delay-2500">
          <Heart className="h-14 w-14" />
        </div>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-xl relative z-10 animate-fadeIn rounded-2xl overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
        
        <CardHeader className="text-center pt-8">
          <div className="mx-auto bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 p-3 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 animate-pulse-soft">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Jisajili kama Mzazi
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            <span className="font-medium text-sky-600">👨‍👩‍👧‍👦 Unganisha na mtoto wako</span>
            <br />
            <span className="text-sm text-gray-500">Jaza taarifa za mtoto wako kwanza, kisha zako</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`flex items-center gap-2 ${step === 1 ? "text-sky-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === 1 ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-gray-200 text-gray-500"}`}>
                  1
                </div>
                <span className="text-sm font-medium">Mtoto</span>
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-gray-300 to-gray-300 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500 ${step === 2 ? "w-full" : "w-0"}`} />
              </div>
              <div className={`flex items-center gap-2 ${step === 2 ? "text-sky-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === 2 ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-gray-200 text-gray-500"}`}>
                  2
                </div>
                <span className="text-sm font-medium">Mzazi</span>
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg shadow-sm animate-slideIn">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">Hitilafu</p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-4 rounded-lg shadow-sm animate-slideIn">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-500" />
                  <div>
                    <p className="font-medium text-sm">Imefanikiwa!</p>
                    <p className="text-sm text-emerald-600 mt-0.5">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Search Child */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-sky-600" />
                    Aina ya Shule *
                  </Label>
                  <Select
                    value={childSearch.school_level}
                    onValueChange={(value) => {
                      setChildSearch({ ...childSearch, school_level: value, school_id: "" });
                      setClasses([]);
                      setStreams([]);
                    }}
                  >
                    <SelectTrigger className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all">
                      <SelectValue placeholder="Chagua aina ya shule" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg">
                      <SelectItem value="primary">🏫 Shule ya Msingi</SelectItem>
                      <SelectItem value="secondary">📚 Shule ya Sekondari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <School className="h-4 w-4 text-sky-600" />
                    Chagua Shule *
                  </Label>
                  <Select
                    value={childSearch.school_id}
                    onValueChange={(value) => {
                      setChildSearch({ ...childSearch, school_id: value, class_id: "" });
                      setClasses([]);
                      setStreams([]);
                    }}
                    disabled={!childSearch.school_level}
                  >
                    <SelectTrigger className={`bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all ${!childSearch.school_level ? "opacity-50" : ""}`}>
                      <SelectValue placeholder="Chagua shule" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                      {schools
                        .filter(s => !childSearch.school_level || s.school_level === childSearch.school_level)
                        .map((school) => (
                          <SelectItem key={school.id} value={school.id.toString()}>
                            {school.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-sky-600" />
                      Darasa *
                    </Label>
                    <Select
                      value={childSearch.class_id}
                      onValueChange={(value) => {
                        setChildSearch({ ...childSearch, class_id: value, stream_id: "all" });
                        setStreams([]);
                      }}
                      disabled={!childSearch.school_id}
                    >
                      <SelectTrigger className={`bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all ${!childSearch.school_id ? "opacity-50" : ""}`}>
                        <SelectValue placeholder="Chagua darasa" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-sky-600" />
                      Mkondo (si lazima)
                    </Label>
                    <Select
                      value={childSearch.stream_id}
                      onValueChange={(value) => setChildSearch({ ...childSearch, stream_id: value })}
                      disabled={!childSearch.class_id}
                    >
                      <SelectTrigger className={`bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all ${!childSearch.class_id ? "opacity-50" : ""}`}>
                        <SelectValue placeholder="Chagua mkondo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                        <SelectItem value="all">📊 Mikondo yote</SelectItem>
                        {streams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-sky-600" />
                    Namba ya Mtoto (Roll Number)
                  </Label>
                  <Input
                    placeholder="Weka namba ya mtoto (kama unaijua)"
                    value={childSearch.roll_number}
                    onChange={(e) => setChildSearch({ ...childSearch, roll_number: e.target.value })}
                    className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSearchChild}
                  disabled={searching || !childSearch.school_id || !childSearch.class_id}
                  className="w-full h-12 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-base font-semibold"
                >
                  {searching ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  Tafuta Mtoto
                </Button>

                {/* Search Results */}
                {students.length > 0 && (
                  <div className="mt-4 space-y-2 animate-fadeIn">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-sky-600" />
                      Wanafunzi Waliopatikana ({students.length})
                    </h3>
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-sky-50/50 rounded-xl hover:from-sky-50 hover:to-blue-50 cursor-pointer border-2 border-transparent hover:border-sky-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => handleSelectStudent(student)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{student.name}</p>
                            <p className="text-sm text-gray-500">
                              {student.class_name} {student.stream_name} • Namba: {student.roll_number || "-"}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-lg">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Chagua
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedStudent && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl animate-slideIn">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800">🎉 Mtoto amepatikana!</p>
                        <p className="text-sm text-emerald-600">
                          {selectedStudent.name} - {selectedStudent.class_name} {selectedStudent.stream_name}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="ml-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl"
                      >
                        Endelea <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Parent Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border-2 border-sky-200">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-sky-600" />
                    <p className="text-sm text-sky-700">
                      <strong>Unajisajili kwa mwanafunzi:</strong> {selectedStudent?.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-sky-600" />
                      Jina Kamili *
                    </Label>
                    <Input
                      placeholder="Jina lako kamili"
                      value={parentData.name}
                      onChange={(e) => handleParentChange("name", e.target.value)}
                      className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Key className="h-4 w-4 text-sky-600" />
                      Username *
                    </Label>
                    <Input
                      placeholder="Chagua username"
                      value={parentData.username}
                      onChange={(e) => handleParentChange("username", e.target.value)}
                      className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-sky-600" />
                      Namba ya Simu *
                    </Label>
                    <Input
                      type="tel"
                      placeholder="0712345678"
                      value={parentData.phone}
                      onChange={(e) => handleParentChange("phone", e.target.value)}
                      className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-sky-600" />
                      Barua Pepe (si lazima)
                    </Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={parentData.email}
                      onChange={(e) => handleParentChange("email", e.target.value)}
                      className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-sky-600" />
                    Anwani (si lazima)
                  </Label>
                  <Input
                    placeholder="Anwani yako"
                    value={parentData.address}
                    onChange={(e) => handleParentChange("address", e.target.value)}
                    className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-11 transition-all"
                  />
                </div>

                {/* 🔥 PASSWORD SECTION WITH STRENGTH INDICATOR */}
                <PasswordSection
                  password={parentData.password}
                  confirmPassword={parentData.confirm_password}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  onPasswordChange={handlePasswordChange}
                  onConfirmChange={handleConfirmChange}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    ← Rudi
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-base font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <>
                        Jisajili
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-gray-200/60 pt-5 pb-6 px-6 bg-gray-50/30">
          <p className="text-sm text-gray-600">
            Tayari una akaunti?{" "}
            <Link href="/parent/login" className="text-sky-600 hover:text-sky-700 font-semibold hover:underline transition-all">
              Ingia Sasa
            </Link>
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Rudi Nyumbani
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Sera ya Faragha
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">
              Sheria na Masharti
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <Shield className="h-3 w-3 text-emerald-500" />
            <span>Salama • Imesimbwa • Inalindwa</span>
          </div>
        </CardFooter>
      </Card>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.4s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2500 { animation-delay: 2.5s; }
        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }
      `}</style>
    </div>
  );
}