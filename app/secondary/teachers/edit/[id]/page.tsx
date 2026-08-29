// app/secondary/teachers/edit/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Save,
  X,
  User,
  Mail,
  Phone,
  Shield,
  School,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 MOBILE COMPONENTS
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
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
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
      </div>
    </div>
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
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />,
  };

  return (
    <div className={cn("p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3 shadow-lg animate-slideIn", styles[type])}>
      {icons[type]}
      <p className="text-sm sm:text-base flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function MobileCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-0 overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg", className)}>
      {children}
    </Card>
  );
}

// ============================================================
// 🔥 MAIN COMPONENT - SECONDARY EDIT TEACHER
// ============================================================

export default function SecondaryEditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone1: "",
    phone2: "",
    role: "Teacher",
  });

  const MAJUKUMU = [
    "Teacher",
    "Headmaster",
    "Headmistress",
    "Second Master",
    "Second Mistress",
    "Academic",
    "Accountant",
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchTeacher(storedToken);
  }, [teacherId]);

  // ============================================================
  // 🔥 FETCH TEACHER - SECONDARY API
  // ============================================================
  const fetchTeacher = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        throw new Error("Imeshindwa kupata taarifa za mwalimu");
      }

      const data = await response.json();
      setFormData({
        name: data.name || "",
        username: data.username || "",
        email: data.email || "",
        phone1: data.phone1 || "",
        phone2: data.phone2 || "",
        role: data.role || "Teacher",
      });
      setError("");
    } catch (err) {
      console.error("Error fetching teacher:", err);
      setError("Imeshindwa kupakia taarifa za mwalimu");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 UPDATE TEACHER - SECONDARY API
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Imeshindwa kuhariri mwalimu");
      }

      setSuccess("✅ Taarifa za mwalimu zimehaririwa kikamilifu!");
      setTimeout(() => {
        router.push("/secondary/teachers");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuhariri mwalimu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia taarifa za mwalimu...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-4xl mx-auto animate-fadeIn">
        <MobileBackButton />

        <MobileHeader
          title="Hariri Mwalimu"
          subtitle="Badilisha taarifa za mwalimu"
          icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        />

        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        <MobileCard>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Taarifa za Mwalimu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Jina Kamili */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Full Name *
                </Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  placeholder="e.g., John Teacher"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Jina la Mtumiaji */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Username *
                </Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  placeholder="e.g., johnteacher"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              {/* Barua Pepe */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Email *
                </Label>
                <Input
                  type="email"
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  placeholder="e.g., john@school.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Namba ya Simu 1 */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Phone Number
                </Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  placeholder="e.g., 0712345678"
                  value={formData.phone1}
                  onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                />
              </div>

              {/* Namba ya Simu 2 */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Phone Number (Alternative)
                </Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                  placeholder="e.g., 0712345678"
                  value={formData.phone2}
                  onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                />
              </div>

              {/* Jukumu */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  Role *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {MAJUKUMU.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 sm:pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/teachers")}
                  className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-10 sm:h-11 touch-feedback"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-10 sm:h-11 touch-feedback"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </MobileCard>
      </div>

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
        .animation-delay-2000 { animation-delay: 2s; }
        .touch-feedback { @apply active:scale-95 transition-transform duration-150; }
      `}</style>
    </MainLayout>
  );
}