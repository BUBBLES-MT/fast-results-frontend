"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  School, 
  UserPlus, 
  LogIn, 
  Loader2, 
  ArrowRight,
  Mail,
  Send,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Shield,
  Crown,
  Search,
  Filter,
  X,
  CreditCard,
  Calendar,
  Zap,
  UsersRound,
  GraduationCap,
  Award,
  Clock,
  TrendingUp,
  Star,
  Rocket,
  ChevronLeft,
  Key,
  Lock,
  Unlock,
  Check,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 TYPING EFFECT - WORDS TO DISPLAY
// ============================================================
const TYPING_WORDS = [
  "Fast & Accurate Results",
  "Excellence in Education",
  "Track Student Performance",
  "Empowering Teachers",
  "Shaping Future Leaders",
  "Quality Education Management",
  "Your Success Starts Here",
  "Innovative Learning Platform",
  " Transforming Education",
  " Building Better Futures",
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
    <div className="h-8 sm:h-10 md:h-12 flex items-center justify-center">
      <span className="text-sm sm:text-base md:text-lg font-medium text-sky-600">
        {text}
        <span className="inline-block w-0.5 h-4 sm:h-5 md:h-6 ml-0.5 bg-sky-500 animate-pulse" />
      </span>
    </div>
  );
}

// ============================================================
// 🔥 PASSWORD STRENGTH COMPONENT
// ============================================================
interface PasswordStrengthProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordSection({ 
  password, 
  confirmPassword, 
  showPassword, 
  setShowPassword,
  onPasswordChange,
  onConfirmChange
}: PasswordStrengthProps) {
  
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
    if (requirementsCount <= 2) return { label: "Weak", color: "bg-red-500", width: 20 };
    if (requirementsCount === 3) return { label: "Fair", color: "bg-orange-500", width: 40 };
    if (requirementsCount === 4) return { label: "Good", color: "bg-blue-500", width: 70 };
    return { label: "Strong 💪", color: "bg-emerald-500", width: 100 };
  };
  
  const strength = getStrength();
  
  // Check if passwords match (only when both have text)
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;
  
  return (
    <div className="space-y-3">
      {/* Password Field */}
      <div className="space-y-1">
        <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base flex items-center gap-2">
          <Key className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
          Password *
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Min 6 chars with letters, numbers & special chars"
            value={password}
            onChange={onPasswordChange}
            className={cn(
              "bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-10 h-9 sm:h-10 md:h-11 text-sm md:text-base",
              password.length > 0 && "border-sky-300"
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-feedback p-1"
          >
            {showPassword ? (
              <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Password Strength Bar */}
      {password.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-gray-500">Password Strength</span>
            <span className={cn(
              "text-[10px] sm:text-xs font-semibold",
              strength.label === "Weak" && "text-red-500",
              strength.label === "Fair" && "text-orange-500",
              strength.label === "Good" && "text-blue-500",
              strength.label === "Strong 💪" && "text-emerald-500"
            )}>
              {strength.label}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                strength.color
              )}
              style={{ width: `${strength.width}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Password Requirements Checklist */}
      <div className="grid grid-cols-2 gap-1">
        <div className="flex items-center gap-1.5">
          {hasMinLength ? (
            <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
          ) : (
            <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-300" />
          )}
          <span className={cn(
            "text-[9px] sm:text-[10px]",
            hasMinLength ? "text-emerald-600" : "text-gray-400"
          )}>
            Min 6 chars
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasUpperCase ? (
            <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
          ) : (
            <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-300" />
          )}
          <span className={cn(
            "text-[9px] sm:text-[10px]",
            hasUpperCase ? "text-emerald-600" : "text-gray-400"
          )}>
            Uppercase (A-Z)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasLowerCase ? (
            <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
          ) : (
            <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-300" />
          )}
          <span className={cn(
            "text-[9px] sm:text-[10px]",
            hasLowerCase ? "text-emerald-600" : "text-gray-400"
          )}>
            Lowercase (a-z)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasNumber ? (
            <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
          ) : (
            <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-300" />
          )}
          <span className={cn(
            "text-[9px] sm:text-[10px]",
            hasNumber ? "text-emerald-600" : "text-gray-400"
          )}>
            Number (0-9)
          </span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          {hasSpecialChar ? (
            <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
          ) : (
            <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-300" />
          )}
          <span className={cn(
            "text-[9px] sm:text-[10px]",
            hasSpecialChar ? "text-emerald-600" : "text-gray-400"
          )}>
            Special char (!@#$%^&* etc.)
          </span>
        </div>
      </div>
      
      {/* Confirm Password Field */}
      <div className="space-y-1">
        <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
          Confirm Password *
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Retype your password"
            value={confirmPassword}
            onChange={onConfirmChange}
            className={cn(
              "bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-10 h-9 sm:h-10 md:h-11 text-sm md:text-base",
              passwordsMatch && "border-emerald-500 ring-2 ring-emerald-200",
              passwordsDontMatch && "border-red-500 ring-2 ring-red-200"
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-feedback p-1"
          >
            {showPassword ? (
              <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
        
        {/* Match Status Indicator */}
        {confirmPassword.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            {passwordsMatch ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                <span className="text-[10px] sm:text-xs text-emerald-600 font-medium">
                  ✅ Passwords match!
                </span>
              </>
            ) : passwordsDontMatch ? (
              <>
                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                <span className="text-[10px] sm:text-xs text-red-600 font-medium">
                  ❌ Passwords do not match!
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 🔥 CONSTANTS
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SESSION_TIMEOUT_MINUTES = 15;

// ============================================================
// 🔥 INTERFACES
// ============================================================
interface School {
  id: number;
  name: string;
  school_type: string;
  school_level?: string;
}

// ============================================================
// 🔥 ROLES ZINAZOITWA "ADMIN"
// ============================================================
const ADMIN_ROLES = [
  "Mwalimu Mkuu",
  "Headmaster",
  "Headmistress",
  "Second Master",
  "Second Mistress"
];

// ============================================================
// 🔥 ROLES
// ============================================================
const AVAILABLE_ROLES = [
  { value: "Teacher", label: "👨‍🏫 Teacher", description: "Manage your students and marks", school_level: "secondary" },
  { value: "Academic", label: "🎓 Academic", description: "Manage students, teachers, exams", school_level: "secondary" },
  { value: "Headmaster", label: "👨‍💼 Headmaster", description: "Full school management", school_level: "secondary" },
  { value: "Headmistress", label: "👩‍💼 Headmistress", description: "Full school management", school_level: "secondary" },
  { value: "Second Master", label: "📚 Second Master", description: "Deputy headmaster", school_level: "secondary" },
  { value: "Second Mistress", label: "📚 Second Mistress", description: "Deputy headmistress", school_level: "secondary" },
  { value: "Mwalimu", label: "👨‍🏫 Mwalimu", description: "Kusimamia wanafunzi na alama", school_level: "primary" },
  { value: "Mtaaluma", label: "📚 Mtaaluma", description: "Kusimamia wanafunzi, walimu na mitihani", school_level: "primary" },
  { value: "Mwalimu Mkuu", label: "👨‍💼 Mwalimu Mkuu", description: "Usimamizi kamili wa shule", school_level: "primary" },
  { value: "Mwalimu Mkuu Msaidizi", label: "👩‍💼 Mwalimu Mkuu Msaidizi", description: "Kusaidia Mwalimu Mkuu", school_level: "primary" },
];

const ROLE_MAPPING: Record<string, string> = {
  "Academic": "Mtaaluma",
  "Headmaster": "Mwalimu Mkuu",
  "Headmistress": "Mwalimu Mkuu",
  "Second Master": "Mwalimu Mkuu Msaidizi",
  "Second Mistress": "Mwalimu Mkuu Msaidizi",
  "Teacher": "Mwalimu",
};

const schoolLevelOptions = [
  { value: "all", label: "🏫 Shule Zote" },
  { value: "primary", label: "🏫 Shule za Msingi" },
  { value: "secondary", label: "📚 Shule za Sekondari" },
  { value: "advanced", label: "🎓 Kiwango cha Juu" },
];

// ============================================================
// 🔥 COOKIE MANAGEMENT
// ============================================================
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

// ============================================================
// 🔥 AUTH CONTENT COMPONENT (With Suspense for useSearchParams)
// ============================================================

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("login");
  
  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  // ✅ SUBSCRIPTION EXPIRED
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [expiredSchool, setExpiredSchool] = useState<{id: number, name: string, expiry_date: string} | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  // Forgot Password
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  
  // Register state
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    school_id: "",
    role: "Teacher",
    phone1: "",
  });
  const [registerError, setRegisterError] = useState<string>("");
  const [registerSuccess, setRegisterSuccess] = useState<string>("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const filteredRoles = AVAILABLE_ROLES.filter(role => 
    !selectedSchoolLevel || role.school_level === selectedSchoolLevel
  );

  // Check for payment success param
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      setLoginSuccess("✅ Payment successful! Please login to continue.");
      setTimeout(() => setLoginSuccess(""), 5000);
    }
  }, [searchParams]);

  // ============================================================
  // 🔥 USE EFFECT
  // ============================================================
  useEffect(() => {
    const clearAuthData = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_id");
      localStorage.removeItem("teacher_id");
      localStorage.removeItem("school_level");
      localStorage.removeItem("school_id");
      localStorage.removeItem("last_activity");
      deleteCookie("token");
      deleteCookie("user_type");
      deleteCookie("user_name");
    };
    
    clearAuthData();
    
    const savedUsername = localStorage.getItem("remembered_username");
    const savedPassword = localStorage.getItem("remembered_password");
    const savedRemember = localStorage.getItem("remember_me");
    
    if (savedRemember === "true" && savedUsername) {
      setUsername(savedUsername);
      if (savedPassword) setPassword(savedPassword);
      setRememberMe(true);
    }
    
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/v1/schools`);
        setSchools(response.data);
        setFilteredSchools(response.data);
        console.log("🏫 Schools loaded:", response.data.length);
      } catch (err) {
        console.error("Error fetching schools:", err);
      }
    };
    fetchSchools();
  }, []);

  // 🔥 FILTER SCHOOLS
  useEffect(() => {
    let filtered = [...schools];
    
    if (selectedSchoolLevel && selectedSchoolLevel !== "all") {
      filtered = filtered.filter(school => 
        school.school_level === selectedSchoolLevel || 
        school.school_type === selectedSchoolLevel
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(school => 
        school.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredSchools(filtered);
  }, [selectedSchoolLevel, searchQuery, schools]);

  // 🔥 COUNTDOWN FOR REDIRECT TO PAYMENT
  useEffect(() => {
    if (showExpiredDialog && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showExpiredDialog && redirectCountdown === 0) {
      if (expiredSchool && expiredSchool.id) {
        console.log("🚀 Auto-redirecting to payment for school:", expiredSchool.id);
        router.push(`/payment?school_id=${expiredSchool.id}`);
      } else {
        console.error("❌ No school_id for auto-redirect!");
        setLoginError("⚠️ Unable to renew. Please contact support.");
        setShowExpiredDialog(false);
      }
    }
  }, [showExpiredDialog, redirectCountdown, expiredSchool, router]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSchoolChange = (schoolId: string) => {
    setRegisterData({ ...registerData, school_id: schoolId });
    const selectedSchool = schools.find(s => s.id.toString() === schoolId);
    if (selectedSchool) {
      setSelectedSchoolLevel(selectedSchool.school_level || selectedSchool.school_type || "secondary");
    }
  };

  const mapRoleToSchoolLevel = (role: string, schoolLevel: string): string => {
    if (schoolLevel === "primary" && ROLE_MAPPING[role]) {
      return ROLE_MAPPING[role];
    }
    return role;
  };

  // ============================================================
  // 🔥 PASSWORD HANDLERS
  // ============================================================
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, password: e.target.value });
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, confirmPassword: e.target.value });
  };

  // ============================================================
  // 🔥 LOGIN - FIXED VERSION
  // ============================================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // 🔥 CHECK FOR 402 - SUBSCRIPTION EXPIRED
      if (response.status === 402) {
        // ✅ SAFELY extract from detail object
        const detail = data.detail || {};
        
        // ✅ SAFELY extract values with fallbacks
        const schoolId = detail.school_id || detail.schoolId || null;
        const schoolName = detail.school_name || detail.schoolName || "Shule yako";
        const expiryDate = detail.expiry_date || detail.expiryDate || new Date().toISOString();
        
        console.log("🔴 Subscription Expired Response:", { schoolId, schoolName, expiryDate });
        
        if (!schoolId) {
          console.error("❌ No school_id in 402 response!");
          setLoginError("⚠️ Unable to identify school. Please contact support.");
          setLoginLoading(false);
          return;
        }
        
        setExpiredSchool({
          id: schoolId,
          name: schoolName,
          expiry_date: expiryDate
        });
        setShowExpiredDialog(true);
        setRedirectCountdown(5);
        setLoginError(""); // ✅ Clear error - use dialog instead
        setLoginLoading(false);
        return;
      }

      // ✅ CHECK FOR OTHER ERRORS
      if (!response.ok) {
        let errorMessage = "Login failed. Please check your credentials.";
        
        // ✅ SAFELY extract error message
        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (data.detail?.message) {
          errorMessage = data.detail.message;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data.detail === "object") {
          // ✅ If detail is object, log it and use generic message
          console.error("Error detail object:", data.detail);
          errorMessage = "Login failed. Please check your credentials.";
        }
        
        throw new Error(errorMessage);
      }

      // ✅ SUCCESSFUL LOGIN
      const { access_token, user_type, name, user_id, role, school_level, school_id } = data;

      localStorage.clear();
      deleteCookie("token");
      deleteCookie("user_type");
      deleteCookie("user_name");
      
      const finalSchoolLevel = school_level || "secondary";
      let finalUserType = user_type;
      
      if (finalSchoolLevel === "primary") {
        finalUserType = mapRoleToSchoolLevel(user_type, finalSchoolLevel);
      }
      
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_type", finalUserType);
      localStorage.setItem("user_name", name);
      localStorage.setItem("school_level", finalSchoolLevel);
      localStorage.setItem("last_activity", Date.now().toString());
      
      if (school_id) {
        localStorage.setItem("school_id", school_id.toString());
      } else {
        const fetchedSchoolId = await fetchUserSchool(access_token);
        if (fetchedSchoolId) {
          localStorage.setItem("school_id", fetchedSchoolId.toString());
        }
      }
      
      if (user_id) {
        localStorage.setItem("user_id", user_id.toString());
        if (finalUserType === "Mwalimu" || finalUserType === "Teacher") {
          localStorage.setItem("teacher_id", user_id.toString());
        }
      }
      
      setCookie("token", access_token, 7);
      setCookie("user_type", finalUserType, 7);
      setCookie("user_name", encodeURIComponent(name), 7);
      setCookie("school_level", finalSchoolLevel, 7);
      if (school_id) {
        setCookie("school_id", school_id.toString(), 7);
      }
      
      if (rememberMe) {
        localStorage.setItem("remembered_username", username);
        localStorage.setItem("remembered_password", password);
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remembered_username");
        localStorage.removeItem("remembered_password");
        localStorage.setItem("remember_me", "false");
      }

      const isSuperadmin = user_type === "superadmin" || user_type === "Superadmin";
      
      if (isSuperadmin) {
        setLoginSuccess("Welcome Superadmin! Redirecting...");
        setTimeout(() => window.location.href = "/superadmin", 500);
      } else {
        let targetUrl = "/secondary/dashboard";
        if (finalSchoolLevel === "primary") targetUrl = "/primary/dashboard";
        else if (finalSchoolLevel === "advanced") targetUrl = "/advanced/dashboard";
        
        setLoginSuccess(`Welcome ${name}! Redirecting...`);
        setTimeout(() => window.location.href = targetUrl, 500);
      }
      
    } catch (err: any) {
      // ✅ SAFELY set error message
      setLoginError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchUserSchool = async (token: string): Promise<number | null> => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.school_id) return data.school_id;
    } catch (err) {
      console.error("Error fetching user school:", err);
    }
    return null;
  };

  const goToPayment = () => {
    console.log("🔍 goToPayment called");
    console.log("🔍 expiredSchool:", expiredSchool);
    
    if (expiredSchool && expiredSchool.id) {
      console.log("🚀 Redirecting to payment for school:", expiredSchool.id);
      setShowExpiredDialog(false);
      router.push(`/payment?school_id=${expiredSchool.id}`);
    } else {
      console.error("❌ No school_id in expiredSchool:", expiredSchool);
      setLoginError("⚠️ Unable to renew. Please contact support.");
      setShowExpiredDialog(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotError("Please enter your email address");
      return;
    }
    
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to send reset link");
      }
      
      setForgotSuccess("Password reset link sent to your email!");
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setForgotEmail("");
        setForgotSuccess("");
      }, 3000);
    } catch (err: any) {
      setForgotError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match");
      setRegisterLoading(false);
      return;
    }
    if (!registerData.school_id) {
      setRegisterError("Tafadhali chagua shule yako");
      setRegisterLoading(false);
      return;
    }
    if (registerData.password.length < 6) {
      setRegisterError("Nenosiri lazima iwe na herufi 6 au zaidi");
      setRegisterLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/api/v1/auth/register`, {
        name: registerData.name,
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        phone1: registerData.phone1,
        role: registerData.role,
        school_id: parseInt(registerData.school_id),
      });

      if (response.status === 200 || response.status === 201) {
        const selectedSchool = schools.find(s => s.id === parseInt(registerData.school_id));
        const schoolLevel = selectedSchool?.school_level || "secondary";
        const schoolName = selectedSchool?.name || "shule yako";
        
        const isAdmin = ADMIN_ROLES.includes(registerData.role);
        
        let successMessage = "";
        let loginMessage = "";
        
        if (isAdmin) {
          if (registerData.role === "Mwalimu Mkuu") {
            successMessage = `🎉 Hongera! Usajili wako umekamilika.\n\nSasa wewe ni Mwalimu Mkuu wa shule ya "${schoolName}".\n\nTayari unaweza kuingia na kuanza kusimamia shule yako!`;
            loginMessage = `🎉 Karibu Mwalimu Mkuu wa ${schoolName}!`;
          } else if (registerData.role === "Headmaster") {
            successMessage = `🎉 Congratulations! Your registration is complete.\n\nYou are now the Headmaster of "${schoolName}".\n\nYou can now login and start managing your school!`;
            loginMessage = `🎉 Welcome Headmaster of ${schoolName}!`;
          } else if (registerData.role === "Headmistress") {
            successMessage = `🎉 Congratulations! Your registration is complete.\n\nYou are now the Headmistress of "${schoolName}".\n\nYou can now login and start managing your school!`;
            loginMessage = `🎉 Welcome Headmistress of ${schoolName}!`;
          } else if (registerData.role === "Second Master") {
            successMessage = `🎉 Congratulations! Your registration is complete.\n\nYou are now the Second Master of "${schoolName}".\n\nYou can now login and start managing your school!`;
            loginMessage = `🎉 Welcome Second Master of ${schoolName}!`;
          } else if (registerData.role === "Second Mistress") {
            successMessage = `🎉 Congratulations! Your registration is complete.\n\nYou are now the Second Mistress of "${schoolName}".\n\nYou can now login and start managing your school!`;
            loginMessage = `🎉 Welcome Second Mistress of ${schoolName}!`;
          } else {
            successMessage = `🎉 Registration complete! Welcome to ${schoolName}!`;
            loginMessage = `🎉 Welcome to ${schoolName}!`;
          }
        } else {
          if (schoolLevel === "primary") {
            successMessage = 
              `✅ Usajili wako umefanikiwa!\n\n` +
              `Ombi lako limepelekwa kwa wakuu wa shule ya "${schoolName}" kwa idhini.\n\n` +
              `Watu wanaoidhinisha:\n` +
              `👨‍💼 Mwalimu Mkuu\n` +
              `👩‍💼 Mwalimu Mkuu Msaidizi\n` +
              `📚 Mtaaluma\n\n` +
              `Utapata arifa baada ya idhini.\n` +
              `Asante kwa kujiandikisha!`;
            loginMessage = 
              `✅ Usajili wako umefanikiwa!\n` +
              `Ombi lako linasubiri idhini ya Mwalimu Mkuu, Mwalimu Mkuu Msaidizi, au Mtaaluma.`;
          } else {
            successMessage = 
              `✅ Registration successful!\n\n` +
              `Your application has been sent to "${schoolName}" school administrators for approval.\n\n` +
              `Approving authorities:\n` +
              `👨‍💼 Headmaster/Headmistress\n` +
              `👩‍💼 Second Master/Second Mistress\n` +
              `📚 Academic\n\n` +
              `You will receive a notification after approval.\n` +
              `Thank you for registering!`;
            loginMessage = 
              `✅ Registration successful!\n` +
              `Your application is pending approval from Headmaster, Second Master, or Academic.`;
          }
        }
        
        setRegisterSuccess(successMessage);
        
        setTimeout(() => {
          setActiveTab("login");
          setRegisterSuccess("");
          setLoginSuccess(loginMessage);
        }, 4000);
        
        setRegisterData({
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          school_id: "",
          role: "Teacher",
          phone1: "",
        });
        setSelectedSchoolLevel("");
        setSearchQuery("");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Usajili umeshindwa. Tafadhali jaribu tena.";
      setRegisterError(errorMsg);
    } finally {
      setRegisterLoading(false);
    }
  };

  const getSchoolTypeLabel = (type: string) => {
    switch (type) {
      case "primary": return "🏫 Msingi";
      case "secondary": return "📚 Sekondari";
      case "advanced": return "🎓 Kiwango cha Juu";
      default: return type;
    }
  };

  const getRoleDescription = (roleValue: string) => {
    const role = AVAILABLE_ROLES.find(r => r.value === roleValue);
    return role?.description || "";
  };

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Floating Icons - Hidden on mobile */}
        <div className="absolute top-10 left-10 text-sky-200/20 animate-float hidden lg:block">
          <GraduationCap className="h-16 w-16 lg:h-20 lg:w-20" />
        </div>
        <div className="absolute bottom-10 right-10 text-blue-200/20 animate-float animation-delay-3000 hidden lg:block">
          <School className="h-20 w-20 lg:h-24 lg:w-24" />
        </div>
      </div>

      {/* Main Card - Responsive Size */}
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl shadow-2xl border-0 bg-white/90 backdrop-blur-xl relative z-10 animate-fadeIn rounded-2xl overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
        
        <CardHeader className="text-center pt-5 sm:pt-6 md:pt-8 lg:pt-10 px-4 sm:px-6 md:px-8">
          <div className="mx-auto bg-gradient-to-r from-sky-500 to-blue-600 p-2.5 sm:p-3 rounded-2xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-blue-500/30 animate-pulse-soft">
            <School className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
            MASI FAST RESULTS
          </CardTitle>
          
          {/* TYPING EFFECT - HERE! */}
          <div className="mt-2 sm:mt-3">
            <TypingEffect />
          </div>
          
          <CardDescription className="text-gray-600 text-xs sm:text-sm md:text-base mt-2">
            Fast and Accurate Results
          </CardDescription>
        </CardHeader>

        {loginSuccess && (
          <div className="mx-3 sm:mx-4 md:mx-6 mb-3 sm:mb-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md">
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 text-emerald-500" />
              <div>
                <p className="font-medium text-xs sm:text-sm md:text-base whitespace-pre-line">{loginSuccess}</p>
                {!loginSuccess.includes("🎉") && !loginSuccess.includes("Karibu") && !loginSuccess.includes("Welcome") && (
                  <p className="text-[10px] sm:text-xs text-emerald-600 mt-1">⏳ Utapata taarifa baada ya idhini. Asante!</p>
                )}
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-sky-100/50 rounded-xl p-1 mx-auto w-[92%] sm:w-[90%] md:w-[88%]">
            <TabsTrigger 
              value="login" 
              className="gap-1 sm:gap-2 text-xs sm:text-sm md:text-base data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-md rounded-lg transition-all py-1.5 sm:py-2"
            >
              <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Login</span>
              <span className="xs:hidden">Login</span>
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="gap-1 sm:gap-2 text-xs sm:text-sm md:text-base data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-md rounded-lg transition-all py-1.5 sm:py-2"
            >
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Register</span>
              <span className="xs:hidden">Register</span>
            </TabsTrigger>
          </TabsList>

          {/* Login Tab - Responsive */}
          <TabsContent value="login">
            <CardContent className="pt-3 sm:pt-4 md:pt-6 px-3 sm:px-4 md:px-6">
              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Username</Label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-10 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-feedback p-1"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    </button>
                  </div>
                </div>

                {/* Small Round Checkbox - Fixed! */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className={cn(
                        "border-gray-300",
                        "data-[state=checked]:bg-sky-600",
                        "data-[state=checked]:border-sky-600",
                        "h-3.5 w-3.5",
                        "rounded-full",
                        "cursor-pointer",
                        "transition-all duration-200",
                        "focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
                        "flex-shrink-0",
                        "[&>span]:h-2.5 [&>span]:w-2.5"
                      )}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none"
                    >
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-xs sm:text-sm text-sky-600 hover:text-sky-700 hover:underline transition-all touch-feedback"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* ✅ SAFE ERROR RENDERING - FIXED! */}
                {loginError && typeof loginError === 'string' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">{loginError}</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-10 sm:h-11 md:h-12 text-sm md:text-base touch-feedback" 
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> Logging in...</>
                  ) : (
                    <>Login <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          {/* Register Tab - Responsive WITH NEW PASSWORD SECTION */}
          <TabsContent value="register">
            <CardContent className="pt-3 sm:pt-4 md:pt-6 px-3 sm:px-4 md:px-6">
              <form onSubmit={handleRegister} className="space-y-2.5 sm:space-y-3 md:space-y-4">
                {registerSuccess && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs sm:text-sm md:text-base whitespace-pre-line">{registerSuccess}</p>
                        {!registerSuccess.includes("🎉") && !registerSuccess.includes("Karibu") && !registerSuccess.includes("Welcome") && (
                          <p className="text-[10px] sm:text-xs text-emerald-600 mt-1">⏳ Utapata arifa baada ya idhini. Asante!</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Full Name *</Label>
                  <Input
                    placeholder="Enter your full name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Username *</Label>
                  <Input
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Email *</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2 text-xs sm:text-sm md:text-base">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-sky-600" />
                    Chagua Aina ya Shule
                  </Label>
                  <Select
                    value={selectedSchoolLevel || "all"}
                    onValueChange={(value) => setSelectedSchoolLevel(value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="bg-white border-gray-200 h-9 sm:h-10 md:h-11 text-sm md:text-base">
                      <SelectValue placeholder="Chagua aina ya shule" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg">
                      {schoolLevelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="hover:bg-sky-50 text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] sm:text-xs text-gray-500">Chagua aina ya shule ili kuona shule zinazolingana</p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2 text-xs sm:text-sm md:text-base">
                    <Search className="h-3 w-3 sm:h-4 sm:w-4 text-sky-600" />
                    Tafuta Shule Yako
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Andika jina la shule yako..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 pr-10 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-feedback"
                      >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {filteredSchools.length > 0 
                      ? `${filteredSchools.length} shule zimepatikana` 
                      : "Hakuna shule inayolingana na utafutaji wako"}
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Select Your School *</Label>
                  <Select
                    value={registerData.school_id}
                    onValueChange={handleSchoolChange}
                  >
                    <SelectTrigger className="bg-white border-gray-200 h-9 sm:h-10 md:h-11 text-sm md:text-base">
                      <SelectValue placeholder="Choose your school" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                      {filteredSchools.length === 0 ? (
                        <SelectItem value="none" disabled className="text-sm">
                          {searchQuery ? "Hakuna shule inayolingana" : "No schools available"}
                        </SelectItem>
                      ) : (
                        filteredSchools.map((school) => (
                          <SelectItem key={school.id} value={school.id.toString()} className="hover:bg-sky-50 text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                              <span className="text-sm">{school.name}</span>
                              <span className="text-xs text-gray-400">- {getSchoolTypeLabel(school.school_type)}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {filteredSchools.length > 0 
                      ? `${filteredSchools.length} shule zilizopatikana. Chagua shule yako.`
                      : "Badilisha aina ya shule au tafuta kwa jina"}
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Your Role *</Label>
                  <Select
                    value={registerData.role}
                    onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 h-9 sm:h-10 md:h-11 text-sm md:text-base">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                      {filteredRoles.length === 0 ? (
                        <SelectItem value="none" disabled className="text-sm">Please select a school first</SelectItem>
                      ) : (
                        filteredRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value} className="hover:bg-sky-50 text-sm">
                            {role.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] sm:text-xs text-sky-600">{getRoleDescription(registerData.role)}</p>
                  <p className="text-[10px] sm:text-xs text-amber-600">⚠️ Headmaster and Academic roles require admin approval.</p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">Phone Number</Label>
                  <Input
                    placeholder="e.g., 0712345678"
                    value={registerData.phone1}
                    onChange={(e) => setRegisterData({ ...registerData, phone1: e.target.value })}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-9 sm:h-10 md:h-11 text-sm md:text-base"
                  />
                </div>

                {/* NEW PASSWORD SECTION WITH STRENGTH INDICATOR */}
                <PasswordSection
                  password={registerData.password}
                  confirmPassword={registerData.confirmPassword}
                  showPassword={showRegisterPassword}
                  setShowPassword={setShowRegisterPassword}
                  onPasswordChange={handlePasswordChange}
                  onConfirmChange={handleConfirmChange}
                />

                {/* ✅ SAFE ERROR RENDERING - FIXED! */}
                {registerError && typeof registerError === 'string' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">{registerError}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 h-10 sm:h-11 md:h-12 text-sm md:text-base touch-feedback" 
                  disabled={registerLoading}
                >
                  {registerLoading ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> Registering...</>
                  ) : (
                    <>Register <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex flex-col gap-2 border-t border-gray-200/60 pt-3 sm:pt-4 md:pt-5 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-5">
          <p className="text-[10px] sm:text-xs text-gray-500 text-center">By registering, you agree to our terms and conditions.</p>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 text-center flex-wrap justify-center">
            <Shield className="h-3 w-3" /> Superadmin access is by invitation only.
            <Crown className="h-3 w-3 text-amber-500" />
          </div>
        </CardFooter>
      </Card>

      {/* SUBSCRIPTION EXPIRED DIALOG - Responsive */}
      <Dialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg bg-white rounded-2xl border-0 shadow-2xl p-4 sm:p-6">
          <DialogHeader>
            <div className="mx-auto bg-amber-100 p-3 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center animate-pulse">
              <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 text-amber-600" />
            </div>
            <DialogTitle className="text-lg sm:text-xl text-center text-amber-800">
              ⚠️ Subscription Expired
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-xs sm:text-sm">
              The subscription for <strong className="text-amber-700">{expiredSchool?.name || "Shule yako"}</strong> has expired.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2.5 sm:space-y-3 md:space-y-4 py-3 sm:py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong>Expired on:</strong>{" "}
                    {expiredSchool?.expiry_date 
                      ? new Date(expiredSchool.expiry_date).toLocaleDateString()
                      : "Tarehe haijulikani"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-red-700 font-semibold">🔒 Account Suspended</p>
              <p className="text-xs sm:text-sm text-red-600 mt-1">
                Your school account has been temporarily suspended due to an expired subscription.
                To restore full access, please renew your subscription immediately.
              </p>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-sky-700 font-semibold">📋 What You Need to Do:</p>
              <ul className="text-xs sm:text-sm text-sky-600 mt-2 space-y-1 list-disc list-inside">
                <li>Contact your school management to process payment</li>
                <li>Choose a subscription plan that fits your needs</li>
                <li>Complete the renewal process</li>
                <li>Contact support if you need assistance</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-700 font-semibold">📞 Need Help?</p>
              <div className="text-xs sm:text-sm text-gray-600 mt-2 space-y-0.5">
                <p>📧 Email: <strong>support@masifastresults.com</strong></p>
                <p>📞 Phone: <strong>+255 700 000 000</strong></p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-amber-700">
                <strong>⏳ Redirecting to payment in {redirectCountdown}s...</strong>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - redirectCountdown) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={goToPayment}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg touch-feedback"
            >
              <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
              Renew Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowExpiredDialog(false)}
              className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog - Responsive */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Enter your email address and we'll send you a link to reset your password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="space-y-2">
              <Label className="text-gray-700 text-xs sm:text-sm">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="pl-9 sm:pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-9 sm:h-10 md:h-11 text-sm"
                />
              </div>
            </div>
            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {forgotSuccess}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setForgotPasswordOpen(false)}>Cancel</Button>
            <Button onClick={handleForgotPassword} disabled={forgotLoading} className="bg-gradient-to-r from-sky-600 to-blue-600 touch-feedback">
              {forgotLoading ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin mr-2" /> : <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />}
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 400px) {
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
        @media (min-width: 401px) {
          .xs\\:inline { display: none !important; }
          .xs\\:hidden { display: inline !important; }
        }
        @media (min-width: 640px) {
          .sm\\:inline { display: inline !important; }
        }
        @media (min-width: 768px) {
          .md\\:inline { display: inline !important; }
        }
        @media (min-width: 1024px) {
          .lg\\:inline { display: inline !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
          <div className="text-center">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-sky-600 mx-auto" />
            <p className="text-gray-600 mt-4 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}