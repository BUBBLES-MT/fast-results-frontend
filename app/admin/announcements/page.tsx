// app/admin/announcements/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CalendarDays,
  Megaphone,
  Users,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Edit,
  Eye,
  School,
  Building2,
  Info,
  ChevronLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - PRO MAX!
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
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 md:p-8 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-2xl shadow-lg backdrop-blur-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-blue-100/80 mt-0.5 truncate">
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
        "border-0 overflow-hidden rounded-2xl sm:rounded-3xl",
        gradient || "bg-white/90 backdrop-blur-sm",
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]",
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
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-lg animate-slideIn border",
        styles[type]
      )}
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base break-words font-medium">{message}</p>
      </div>
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
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "sky" | "rose" | "orange" | "cyan";
  subtitle?: string;
  delay?: number;
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
        "rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-white/70 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[7px] sm:text-[8px] text-white/60 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </div>
      </div>
      {/* 🔥 Animation line at bottom */}
      <div className="mt-2 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft" />
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [announcement, setAnnouncement] = useState<any>(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Get current year
  const currentYear = new Date().getFullYear();

  // Form fields
  const [closingDate, setClosingDate] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");
    const name = localStorage.getItem("user_name") || "";
    const schoolNameLocal = localStorage.getItem("school_name") || "Shule";
    const schoolLevelLocal = localStorage.getItem("school_level") || "primary";

    if (!token) {
      router.push("/login");
      return;
    }

    // Check if user is authorized
    const allowedRoles = [
      "Headmaster", "Headmistress", 
      "Second Master", "Second Mistress", 
      "Academic", "Accountant",
      "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", 
      "Mtaaluma", "Mhasibu"
    ];
    
    const userRoleLower = (userType || "").toLowerCase();
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/dashboard");
      return;
    }

    setUserName(name);
    setUserRole(userType || "");
    setSchoolName(schoolNameLocal);
    setSchoolLevel(schoolLevelLocal);

    fetchAnnouncement(token, schoolId || "");
  }, [router]);

  // Fetch announcement
  const fetchAnnouncement = async (token: string, schoolId: string) => {
    try {
      setLoadingData(true);
      const response = await fetch(
        `${API_BASE}/api/v1/school-announcements/${schoolId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnnouncement(data);
        if (data) {
          setClosingDate(data.closing_date ? data.closing_date.split('T')[0] : "");
          setOpeningDate(data.opening_date ? data.opening_date.split('T')[0] : "");
          setAnnouncementText(data.announcement_sw || data.announcement_en || "");
          setMeetingNotes(data.parent_meeting_notes_sw || data.parent_meeting_notes_en || "");
        }
      } else {
        console.log("ℹ️ Hakuna tangazo lililopatikana");
        setAnnouncement(null);
      }
    } catch (err) {
      console.error("Error fetching announcement:", err);
      setError("Imeshindwa kupakia data ya tangazo");
    } finally {
      setLoadingData(false);
    }
  };

  // Save announcement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const schoolId = localStorage.getItem("school_id");

    if (!token || !schoolId) {
      setError("Inahitajika uthibitisho");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/school-announcements/${schoolId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            school_id: parseInt(schoolId),
            closing_date: closingDate || null,
            opening_date: openingDate || null,
            announcement_sw: announcementText || null,
            announcement_en: announcementText || null,
            parent_meeting_notes_sw: meetingNotes || null,
            parent_meeting_notes_en: meetingNotes || null,
            language: "swahili",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAnnouncement(result);
        setSuccess("✅ Tangazo limehifadhiwa kikamilifu!");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Imeshindwa kuhifadhi tangazo");
      }
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuunganisha na server");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return "Haijawekwa";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sw-TZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get role display name
  const getRoleDisplay = () => {
    const roleMap: Record<string, string> = {
      "Headmaster": "Mkuu wa Shule",
      "Headmistress": "Mkuu wa Shule",
      "Second Master": "Makamu Mkuu",
      "Second Mistress": "Makamu Mkuu",
      "Academic": "Mtaaluma",
      "Accountant": "Mhasibu",
      "Mwalimu Mkuu": "Mkuu wa Shule",
      "Mwalimu Mkuu Msaidizi": "Makamu Mkuu",
      "Mtaaluma": "Mtaaluma",
      "Mhasibu": "Mhasibu",
    };
    return roleMap[userRole] || userRole;
  };

  // Get school level label
  const getSchoolLevelLabel = () => {
    return schoolLevel === "primary" ? "🏫 Shule ya Msingi" : "📚 Shule ya Sekondari";
  };

  // Determine which MainLayout to use
  const isSecondary = schoolLevel === "secondary" || schoolLevel === "advanced";
  const LayoutComponent = MainLayout;

  if (loadingData) {
    return (
      <LayoutComponent>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia data ya tangazo...
          </p>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Tangazo la Shule"
          subtitle="Weka tarehe na matangazo kwa wazazi"
          icon={<Megaphone className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              {currentYear}
            </span>
          }
          action={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
              {schoolName}
            </span>
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        {/* 🔥 MPANGILIO: MWAKA (1), KUFUNGA (2), KUFUNGUA (3), SHULE (4) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {/* Card 1 - MWAKA (Blue) - SASA SAWA NA CARD ZINGINE! */}
<div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
        Mwaka
      </p>
      <p className="text-lg sm:text-xl md:text-2xl font-bold mt-0.5">
        {currentYear}
      </p>
    </div>
    <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl flex-shrink-0 backdrop-blur-sm">
      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
    </div>
  </div>
  <div className="mt-2 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
    <div className="h-full w-1/3 bg-white/40 rounded-full animate-pulse-soft" />
  </div>
</div>
          {/* Card 2 - KUFUNGA (Emerald) */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Kufunga
                </p>
                <p className="text-sm sm:text-base md:text-lg font-bold mt-0.5 truncate max-w-[80px] sm:max-w-[120px]">
                  {formatDateDisplay(announcement?.closing_date)}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-white/40 rounded-full animate-pulse-soft animation-delay-1000" />
            </div>
          </div>

          {/* Card 3 - KUFUNGUA (Purple) */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Kufungua
                </p>
                <p className="text-sm sm:text-base md:text-lg font-bold mt-0.5 truncate max-w-[80px] sm:max-w-[120px]">
                  {formatDateDisplay(announcement?.opening_date)}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-white/40 rounded-full animate-pulse-soft animation-delay-2000" />
            </div>
          </div>

          {/* Card 4 - SHULE (Amber) */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Shule
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold mt-0.5 truncate max-w-[80px] sm:max-w-[120px]">
                  {schoolLevel === "primary" ? "🏫 Msingi" : "📚 Sekondari"}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-white/40 rounded-full animate-pulse-soft animation-delay-1500" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && <MobileAlert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Main Form - PRO MAX Card */}
        <MobileCard gradient="bg-gradient-to-r from-white to-blue-50/30" delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg text-gray-800">Hariri Tangazo</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Wazazi wataona taarifa hizi kwenye dashboard yao
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Dates - PRO MAX */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-5 border border-blue-100 animate-slideIn" style={{ animationDelay: "200ms" }}>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                  </div>
                  Tarehe za Kalenda
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm text-gray-600">Tarehe ya Kufunga</Label>
                    <Input
                      type="date"
                      value={closingDate}
                      onChange={(e) => setClosingDate(e.target.value)}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Sasa: {formatDateDisplay(announcement?.closing_date)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm text-gray-600">Tarehe ya Kufungua</Label>
                    <Input
                      type="date"
                      value={openingDate}
                      onChange={(e) => setOpeningDate(e.target.value)}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-10 sm:h-11 text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Sasa: {formatDateDisplay(announcement?.opening_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Announcement - PRO MAX */}
              <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl p-4 sm:p-5 border border-amber-100 animate-slideIn" style={{ animationDelay: "300ms" }}>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <div className="bg-amber-100 p-1.5 rounded-lg">
                    <Megaphone className="h-4 w-4 text-amber-600" />
                  </div>
                  Tangazo
                </h3>
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Kiswahili
                  </Label>
                  <Textarea
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Andika tangazo kwa Kiswahili..."
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl min-h-[100px] sm:min-h-[120px] text-sm"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Tangazo hili litaonekana kwa wazazi kwenye dashboard yao
                  </p>
                </div>
              </div>

              {/* Meeting Notes - PRO MAX */}
              <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-emerald-100 animate-slideIn" style={{ animationDelay: "400ms" }}>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <div className="bg-emerald-100 p-1.5 rounded-lg">
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  Maelezo ya Mkutano wa Wazazi
                </h3>
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Kiswahili
                  </Label>
                  <Textarea
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder="Maelezo ya mkutano wa wazazi (Kiswahili)..."
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 rounded-xl min-h-[80px] sm:min-h-[100px] text-sm"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Maelezo haya yataonekana kwa wazazi pamoja na tangazo
                  </p>
                </div>
              </div>

              {/* Action Buttons - PRO MAX */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-slideIn" style={{ animationDelay: "500ms" }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-11 sm:h-12 text-sm sm:text-base gap-2 touch-feedback"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  {loading ? "Inahifadhi..." : "Hifadhi Tangazo"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setClosingDate(announcement?.closing_date ? announcement.closing_date.split('T')[0] : "");
                    setOpeningDate(announcement?.opening_date ? announcement.opening_date.split('T')[0] : "");
                    setAnnouncementText(announcement?.announcement_sw || announcement?.announcement_en || "");
                    setMeetingNotes(announcement?.parent_meeting_notes_sw || announcement?.parent_meeting_notes_en || "");
                  }}
                  className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl h-11 sm:h-12 touch-feedback"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rejesha Fomu
                </Button>
                {announcement && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full sm:w-auto border-amber-300 text-amber-600 hover:bg-amber-50 rounded-xl h-11 sm:h-12 touch-feedback"
                  >
                    {showPreview ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {showPreview ? "Ficha Mwonekano" : "Ona Mwonekano"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </MobileCard>

        {/* Live Preview - Collapsible Mobile */}
        {announcement && showPreview && (
          <div className="mt-4 sm:mt-6 animate-slideDown">
            <MobileCard gradient="bg-gradient-to-r from-white to-amber-50/30" delay={600}>
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
              <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 p-1.5 rounded-lg">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-base sm:text-lg text-gray-800">Mwonekano</CardTitle>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                    Jinsi Wazazi Watakavyoona
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 sm:p-5 rounded-xl border-l-4 border-amber-500">
                  {/* Dates */}
                  {(announcement.closing_date || announcement.opening_date) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                      {announcement.closing_date && (
                        <div className="bg-white/70 p-2 sm:p-3 rounded-lg">
                          <p className="text-[10px] sm:text-xs text-gray-500">Tarehe ya Kufunga</p>
                          <p className="text-xs sm:text-sm font-semibold text-red-600">
                            {formatDateDisplay(announcement.closing_date)}
                          </p>
                        </div>
                      )}
                      {announcement.opening_date && (
                        <div className="bg-white/70 p-2 sm:p-3 rounded-lg">
                          <p className="text-[10px] sm:text-xs text-gray-500">Tarehe ya Kufungua</p>
                          <p className="text-xs sm:text-sm font-semibold text-emerald-600">
                            {formatDateDisplay(announcement.opening_date)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Announcement */}
                  {(announcement.announcement_sw || announcement.announcement_en) && (
                    <div className="bg-white/70 p-3 sm:p-4 rounded-lg mb-3">
                      <p className="text-[10px] sm:text-xs font-semibold text-amber-700 mb-1">📢 Tangazo</p>
                      <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
                        {announcement.announcement_sw || announcement.announcement_en}
                      </p>
                    </div>
                  )}
                  
                  {/* Meeting Notes */}
                  {(announcement.parent_meeting_notes_sw || announcement.parent_meeting_notes_en) && (
                    <div className="bg-white/70 p-3 sm:p-4 rounded-lg">
                      <p className="text-[10px] sm:text-xs font-semibold text-emerald-700 mb-1">📋 Maelezo ya Mkutano</p>
                      <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
                        {announcement.parent_meeting_notes_sw || announcement.parent_meeting_notes_en}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </MobileCard>
          </div>
        )}

        {/* Info Card - PRO MAX */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-3 sm:p-5 border border-blue-100 shadow-lg animate-slideIn" style={{ animationDelay: "700ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full flex-shrink-0">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-700">Jinsi inavyofanya kazi:</p>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1 mt-1 list-disc list-inside">
                <li><strong>Tarehe</strong> - Weka tarehe za kufunga na kufungua shule</li>
                <li><strong>Tangazo</strong> - Andika tangazo kwa Kiswahili</li>
                <li><strong>Maelezo ya Mkutano</strong> - Shiriana maelezo na wazazi</li>
                <li><strong>Mwonekano</strong> - Angalia jinsi wazazi watakavyoona</li>
                <li><strong>Mabadiliko</strong> - Wazazi wanaona mabadiliko mara moja</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "800ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Tangazo la Shule</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>📅 {currentYear}</span>
            <span>•</span>
            <span>📢 {announcement ? "Tangazo lipo" : "Hakuna tangazo"}</span>
            <span>•</span>
            <span>🏫 {schoolName}</span>
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
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
    </LayoutComponent>
  );
}