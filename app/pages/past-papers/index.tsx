// app/pages/past-papers/index.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  BookOpen,
  Calendar,
  School,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
  Trophy,
  Crown,
  Star,
  Clock,
  ChevronLeft,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  GraduationCap,
  Award,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle,
  Trash2,
  Edit,
  MoreVertical,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================
interface PastPaper {
  id: number;
  title: string;
  subject: string;
  year: number;
  exam_type: string;
  class_level: string;
  school_level: string;
  file_url: string;
  file_name: string;
  file_size: number;
  description: string;
  school_name: string;
  downloads: number;
  created_at: string;
  uploaded_by: string;
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
    <div
      className={cn(
        "border-0 overflow-hidden rounded-2xl",
        gradient || "bg-white/90 backdrop-blur-sm",
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
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

// ============================================================
// 🔥 PAST PAPER CARD
// ============================================================
function PastPaperCard({
  paper,
  index,
}: {
  paper: PastPaper;
  index: number;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/v1/past-papers/${paper.id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = paper.file_name || `past_paper_${paper.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "MIDTERM3":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "MIDTERM9":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "TERMINAL":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ANNUAL":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "JOINT MOCK":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 group animate-fadeIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="p-4 sm:p-5">
        {/* Header - Title & Type */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate flex-1">
            {paper.title}
          </h3>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border flex-shrink-0",
              getExamTypeColor(paper.exam_type)
            )}
          >
            {paper.exam_type}
          </span>
        </div>

        {/* Subject & Year */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {paper.subject}
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {paper.year}
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            {paper.class_level}
          </span>
        </div>

        {/* Downloads & Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Download className="h-3 w-3" />
              {paper.downloads || 0}
            </span>
            <span className="inline-flex items-center gap-1 hidden sm:inline-flex">
              <School className="h-3 w-3" />
              {paper.school_name || "Unknown"}
            </span>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all touch-feedback disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span className="hidden xs:inline">{isDownloading ? "Downloading..." : "Download"}</span>
            <span className="xs:hidden">{isDownloading ? "..." : "DL"}</span>
          </button>
        </div>

        {/* Description (if exists) */}
        {paper.description && (
          <p className="mt-2 text-xs text-gray-400 truncate">{paper.description}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function PastPapersList() {
  const router = useRouter();
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_type") || "";
    setUserRole(role);
    if (!token) {
      router.push("/login");
      return;
    }
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/v1/past-papers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load papers");
      }

      const data = await response.json();
      setPapers(data.papers || data || []);
    } catch (error) {
      console.error("Failed to load papers:", error);
      setError("Failed to load past papers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user can add papers
  const canAddPapers = ["teacher", "admin", "superadmin", "Academic", "Headmaster"].some((role) =>
    userRole?.toLowerCase().includes(role.toLowerCase())
  );

  // Get unique subjects and years for filters
  const subjects = [...new Set(papers.map((p) => p.subject))];
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);

  // Filter papers
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || paper.subject === selectedSubject;
    const matchesYear = !selectedYear || paper.year === parseInt(selectedYear);
    return matchesSearch && matchesSubject && matchesYear;
  });

  // Calculate stats
  const totalPapers = papers.length;
  const totalDownloads = papers.reduce((acc, p) => acc + (p.downloads || 0), 0);
  const uniqueSubjects = subjects.length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
        </div>
        <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
          Loading past papers...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="📚 Past Papers"
          subtitle="Browse and download past examination papers"
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalPapers} Papers
            </span>
          }
          action={
            canAddPapers && (
              <Link
                href="/past-papers/add"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all touch-feedback"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Add Past Paper</span>
                <span className="xs:hidden">Add</span>
              </Link>
            )
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Total Papers"
            value={totalPapers}
            icon={FileText}
            color="blue"
            subtitle="Available for download"
          />
          <MobileStatCard
            label="Total Downloads"
            value={totalDownloads}
            icon={Download}
            color="emerald"
            subtitle="All time downloads"
          />
          <MobileStatCard
            label="Subjects"
            value={uniqueSubjects}
            icon={BookOpen}
            color="purple"
            subtitle="Different subjects"
          />
          <MobileStatCard
            label="Uploaded"
            value={papers.length > 0 ? "✅" : "⏳"}
            icon={CheckCircle}
            color="amber"
            subtitle={papers.length > 0 ? "Papers available" : "No papers yet"}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-start gap-2 sm:gap-3 shadow-md animate-slideIn">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base break-words flex-1">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject, title, or year..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              className="px-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm touch-feedback"
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("");
                setSelectedYear("");
              }}
            >
              <XCircle className="h-4 w-4 text-gray-400" />
              <span className="hidden xs:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Papers Grid */}
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-700">No Past Papers Found</h3>
            <p className="text-gray-500 mt-1 text-sm">
              {searchTerm || selectedSubject || selectedYear
                ? "Try adjusting your search or filters"
                : "Upload past papers to help students prepare"}
            </p>
            {canAddPapers && (
              <Link
                href="/past-papers/add"
                className="inline-block mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all touch-feedback"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Upload First Paper
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredPapers.map((paper, index) => (
              <PastPaperCard key={paper.id} paper={paper} index={index} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPapers.length > 0 && (
          <div className="text-center text-xs text-gray-400">
            Showing {filteredPapers.length} of {totalPapers} papers
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Past Papers</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>📄 {totalPapers} papers</span>
            <span>•</span>
            <span>📚 {uniqueSubjects} subjects</span>
            <span>•</span>
            <span>📥 {totalDownloads} downloads</span>
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