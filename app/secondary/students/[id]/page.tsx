// app/students/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  School,
  BookOpen,
  Users,
  Award,
  Edit,
  Save,
  Trash2,
  ArrowLeft,
  Home,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Crown,
  Star,
  Trophy,
  Building,
  BadgeCheck,
  Clock,
  UserCircle,
  FileText,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface StudentData {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  grade?: string;
  class_name?: string;
  stream_name?: string;
  roll_number?: string;
  school_id?: number;
  school_name?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  enrollment_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - EXTREME PRO MAX!
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
    >
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Rudi</span>
    </button>
  );
}

function MobileHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 rounded-2xl shadow-lg backdrop-blur-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-blue-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {badge && <div className="flex-shrink-0">{badge}</div>}
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  children,
  className,
  gradient,
  hover = true,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <Card
      className={cn(
        "border-0 overflow-hidden rounded-2xl",
        gradient || "bg-white/90 backdrop-blur-sm",
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
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

function InfoItem({
  icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  color?: "blue" | "purple" | "green" | "orange" | "red" | "teal" | "indigo" | "pink" | "amber" | "sky" | "rose" | "cyan" | "emerald" | "yellow" | "violet";
}) {
  if (!value) return null;

  const bgColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    sky: "bg-sky-50 text-sky-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    rose: "bg-rose-50 text-rose-600",
    teal: "bg-teal-50 text-teal-600",
    cyan: "bg-cyan-50 text-cyan-600",
    indigo: "bg-indigo-50 text-indigo-600",
    pink: "bg-pink-50 text-pink-600",
    amber: "bg-amber-50 text-amber-600",
    yellow: "bg-yellow-50 text-yellow-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200 group">
      <div
        className={cn(
          "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center flex-shrink-0",
          bgColors[color] || bgColors.blue
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "",
    grade: "",
    roll_number: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
  });

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/students/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }

      const data = await response.json();
      setStudent(data);

      // Populate form
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        grade: data.grade || "",
        roll_number: data.roll_number || "",
        parent_name: data.parent_name || "",
        parent_phone: data.parent_phone || "",
        parent_email: data.parent_email || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        grade: formData.grade,
        roll_number: formData.roll_number,
        parent_name: formData.parent_name,
        parent_phone: formData.parent_phone,
        parent_email: formData.parent_email,
      };

      const response = await fetch(`${API_BASE}/api/v1/students/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update student");
      }

      const updated = await response.json();
      setStudent(updated);
      setIsEditing(false);
      setSuccess("Student updated successfully! ✅");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone!")) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/api/v1/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      router.push("/students");
    } catch (err: any) {
      setError(err.message || "Failed to delete student");
      setSaving(false);
    }
  };

  const fullName = student ? `${student.first_name} ${student.last_name}` : "";

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading student...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error && !student) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <Button
              variant="outline"
              onClick={() => fetchStudent()}
              className="mt-4 touch-feedback"
            >
              Try Again 🔄
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title={isEditing ? "Edit Student" : fullName || "Student Details"}
          subtitle={isEditing ? "Update student information" : "View student information and details"}
          icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              {student?.id ? `#${student.id}` : "Student"}
            </span>
          }
          action={
            !isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 touch-feedback"
              >
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Edit Student</span>
                <span className="xs:hidden">Edit</span>
              </Button>
            ) : null
          }
        />

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Student Info Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              {isEditing ? "Edit Student Information" : "Student Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      First Name *
                    </Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-indigo-600" />
                      Last Name *
                    </Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-rose-600" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl h-10 sm:h-11 text-sm"
                      placeholder="student@example.com"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-green-600" />
                      Phone
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm"
                      placeholder="+255 712 345 678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-amber-600" />
                      Date of Birth
                    </Label>
                    <Input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-purple-600" />
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="O">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                      Grade / Class
                    </Label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                      placeholder="e.g., Form 1, Form 2"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-amber-600" />
                      Roll Number
                    </Label>
                    <Input
                      value={formData.roll_number}
                      onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl h-10 sm:h-11 text-sm"
                      placeholder="Enter roll number"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" />
                    Address
                  </Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-teal-500 rounded-xl min-h-[60px] sm:min-h-[80px] text-sm"
                    placeholder="Enter student address..."
                  />
                </div>

                {/* Parent Information */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    Parent / Guardian Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Parent Name</Label>
                      <Input
                        value={formData.parent_name}
                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="Enter parent name"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Parent Phone</Label>
                      <Input
                        value={formData.parent_phone}
                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="+255 712 345 678"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 mt-3">
                    <Label className="text-sm font-semibold text-gray-700">Parent Email</Label>
                    <Input
                      type="email"
                      value={formData.parent_email}
                      onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm"
                      placeholder="parent@example.com"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      fetchStudent();
                    }}
                    className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-11 sm:h-12 touch-feedback"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={saving}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 rounded-xl h-11 sm:h-12 touch-feedback"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <InfoItem
                    icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="First Name"
                    value={student?.first_name}
                    color="blue"
                  />
                  <InfoItem
                    icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Last Name"
                    value={student?.last_name}
                    color="indigo"
                  />
                </div>

                <InfoItem
                  icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Email"
                  value={student?.email}
                  color="rose"
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Phone"
                  value={student?.phone}
                  color="green"
                />
                <InfoItem
                  icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Address"
                  value={student?.address}
                  color="teal"
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Date of Birth"
                  value={student?.date_of_birth}
                  color="amber"
                />
                <InfoItem
                  icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Gender"
                  value={student?.gender}
                  color="purple"
                />
                <InfoItem
                  icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Grade / Class"
                  value={student?.grade}
                  color="blue"
                />
                <InfoItem
                  icon={<FileText className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Roll Number"
                  value={student?.roll_number}
                  color="amber"
                />
                {student?.class_name && (
                  <InfoItem
                    icon={<School className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Class"
                    value={student.class_name}
                    color="purple"
                  />
                )}
                {student?.stream_name && (
                  <InfoItem
                    icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Stream"
                    value={student.stream_name}
                    color="cyan"
                  />
                )}
                {student?.school_name && (
                  <InfoItem
                    icon={<Building className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="School"
                    value={student.school_name}
                    color="emerald"
                  />
                )}

                {/* Parent Information */}
                {(student?.parent_name || student?.parent_phone || student?.parent_email) && (
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      Parent / Guardian
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      {student?.parent_name && (
                        <InfoItem
                          icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
                          label="Parent Name"
                          value={student.parent_name}
                          color="purple"
                        />
                      )}
                      {student?.parent_phone && (
                        <InfoItem
                          icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />}
                          label="Parent Phone"
                          value={student.parent_phone}
                          color="green"
                        />
                      )}
                      {student?.parent_email && (
                        <InfoItem
                          icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
                          label="Parent Email"
                          value={student.parent_email}
                          color="rose"
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="text-[10px] sm:text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last updated: {student?.updated_at ? new Date(student.updated_at).toLocaleDateString() : "N/A"}
                </div>
              </div>
            )}
          </CardContent>
        </MobileCard>

        {/* Quick Actions */}
        {!isEditing && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-300 touch-feedback animate-slideIn"
              style={{ animationDelay: "100ms" }}
              onClick={() => router.push("/students")}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">All Students</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Back to list</p>
                </div>
              </div>
            </div>

            <div
              className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-300 touch-feedback animate-slideIn"
              style={{ animationDelay: "200ms" }}
              onClick={() => router.push(`/students/${id}/marks`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">Marks</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">View marks</p>
                </div>
              </div>
            </div>

            <div
              className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-300 touch-feedback animate-slideIn"
              style={{ animationDelay: "300ms" }}
              onClick={() => router.push(`/students/${id}/reports`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">Reports</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">View reports</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Student Details</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>👨‍🎓 {fullName || "Student"}</span>
            <span>•</span>
            <span>📚 {student?.grade || "Grade"}</span>
            <span>•</span>
            <span>🏫 {student?.school_name || "School"}</span>
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

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }

        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
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
    </MainLayout>
  );
}