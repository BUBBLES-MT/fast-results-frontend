// app/schools/page.tsx

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Search,
  Trash2,
  Eye,
  Edit,
  School,
  Building,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  Crown,
  Star,
  Clock,
  Layers,
  BookOpen,
  ArrowRight,
  Filter,
  Download,
  Printer,
  BarChart3,
  TrendingUp,
  Award,
  GraduationCap,
  Shield,
  BadgeCheck,
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
  school_type: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  status: string;
  created_at: string;
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
  type: "error" | "info";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
  };

  const icons = {
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

function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "sky" | "rose" | "orange" | "cyan";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    sky: "from-sky-500 to-blue-500",
    cyan: "from-cyan-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    teal: "from-teal-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    orange: "from-orange-500 to-red-500",
    red: "from-red-500 to-rose-500",
    rose: "from-rose-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
    pink: "from-pink-500 to-rose-500",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-3 sm:p-4 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl sm:text-3xl font-bold mt-0.5 truncate">{value}</p>
          {subtitle && (
            <p className="text-[8px] sm:text-[10px] text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[700px] sm:min-w-full">{children}</div>
    </div>
  );
}

function getSchoolTypeLabel(type: string) {
  switch (type) {
    case "primary":
      return "🏫 Primary";
    case "secondary":
      return "📚 Secondary";
    case "advanced":
      return "🎓 Advanced";
    default:
      return type;
  }
}

function getSchoolTypeColor(type: string) {
  switch (type) {
    case "primary":
      return "bg-blue-100 text-blue-700";
    case "secondary":
      return "bg-purple-100 text-purple-700";
    case "advanced":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function SchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    school_type: "secondary",
    address: "",
    phone: "",
    email: "",
    admin_email: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchSchools(storedToken);
  }, [router]);

  const fetchSchools = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/schools`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError("Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/schools`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create school");
      }

      setOpen(false);
      setFormData({
        name: "",
        school_type: "secondary",
        address: "",
        phone: "",
        email: "",
        admin_email: "",
      });
      fetchSchools(token);
    } catch (err: any) {
      console.error("Error creating school:", err);
      setError(err.message || "Failed to create school");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchool = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this school? This will delete all associated students and teachers!"
      )
    )
      return;
    try {
      await fetch(`${API_BASE}/api/v1/schools/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSchools(token);
    } catch (err) {
      console.error("Error deleting school:", err);
      setError("Failed to delete school");
    }
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school.email && school.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate stats
  const totalSchools = schools.length;
  const activeSchools = schools.filter((s) => s.is_active).length;
  const totalTypes = new Set(schools.map((s) => s.school_type)).size;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Loading schools...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Schools"
          subtitle="Manage all schools in the system"
          icon={<School className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalSchools} Schools
            </span>
          }
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 touch-feedback">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Add School</span>
                  <span className="xs:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    Add New School
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Fill in the details to add a new school.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSchool}>
                  <div className="space-y-3 sm:space-y-4 py-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        School Name *
                      </Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        School Type *
                      </Label>
                      <Select
                        value={formData.school_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, school_type: value })
                        }
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                          <SelectValue placeholder="Select school type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                          <SelectItem value="primary">🏫 Primary School</SelectItem>
                          <SelectItem value="secondary">📚 Secondary School</SelectItem>
                          <SelectItem value="advanced">🎓 Advanced Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Address
                      </Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl h-10 sm:h-11 text-sm"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Phone
                        </Label>
                        <Input
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-xl h-10 sm:h-11 text-sm"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Email
                        </Label>
                        <Input
                          type="email"
                          className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl h-10 sm:h-11 text-sm"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Admin Email
                      </Label>
                      <Input
                        type="email"
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl h-10 sm:h-11 text-sm"
                        value={formData.admin_email}
                        onChange={(e) =>
                          setFormData({ ...formData, admin_email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {error && (
                    <MobileAlert type="error" message={error} onClose={() => setError("")} />
                  )}

                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="w-full sm:w-auto touch-feedback"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {saving ? "Saving..." : "Save School"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Total Schools"
            value={totalSchools}
            icon={School}
            color="blue"
            subtitle="All registered schools"
          />
          <MobileStatCard
            label="Active Schools"
            value={activeSchools}
            icon={BadgeCheck}
            color="emerald"
            subtitle="Currently active"
          />
          <MobileStatCard
            label="School Types"
            value={totalTypes}
            icon={Layers}
            color="purple"
            subtitle="Different types"
          />
          <MobileStatCard
            label="Inactive"
            value={totalSchools - activeSchools}
            icon={AlertCircle}
            color="amber"
            subtitle="Inactive schools"
          />
        </div>

        {/* Search */}
        <MobileCard hover={false} delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by school name or email..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </MobileCard>

        {/* Schools Table */}
        <MobileCard delay={200}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              All Schools
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredSchools.length} {filteredSchools.length === 1 ? "school" : "schools"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                    <TableHead className="text-xs sm:text-sm min-w-[140px]">School Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Type</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Phone</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Status</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm w-20 sm:w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-2">
                          <School className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                          <p className="text-gray-500 text-sm sm:text-base">
                            {searchTerm ? "No schools found matching your search" : "No schools found"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {searchTerm ? "Try adjusting your search" : 'Click "Add School" to create one.'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchools.map((school, idx) => (
                      <TableRow
                        key={school.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <TableCell className="text-center text-xs sm:text-sm text-gray-500">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0">
                              {school.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                              {school.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                              getSchoolTypeColor(school.school_type)
                            )}
                          >
                            {getSchoolTypeLabel(school.school_type)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                          {school.phone || "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs sm:text-sm truncate max-w-[100px]">
                          {school.email || "-"}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                              school.is_active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {school.is_active ? "✅ Active" : "❌ Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/schools/${school.id}`)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              title="View School"
                            >
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/schools/${school.id}/edit`)}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              title="Edit School"
                            >
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSchool(school.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                              title="Delete School"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </MobileTableWrapper>
          </CardContent>
        </MobileCard>

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <School className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">🏫 School Management</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Add, edit, and manage all schools in the system
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">📚 School Types</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Primary, Secondary, and Advanced Level schools
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">✅ Active Management</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Activate or deactivate schools as needed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Schools Management</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>🏫 {totalSchools} schools</span>
            <span>•</span>
            <span>✅ {activeSchools} active</span>
            <span>•</span>
            <span>📚 {totalTypes} types</span>
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