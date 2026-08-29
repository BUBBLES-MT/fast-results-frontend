// app/payment/history/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
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
  Sparkles,
  TrendingUp,
  Award,
  GraduationCap,
  School,
  Building,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Download,
  Printer,
  BarChart3,
  Wallet,
  Coins,
  Gem,
  Zap,
  Rocket,
  Shield,
  Lock,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-sky-100/80 mt-0.5 truncate">
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

function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "sky",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    sky: "from-sky-500 to-blue-500",
    blue: "from-blue-500 to-indigo-500",
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
        `bg-gradient-to-r ${gradients[color] || gradients.sky}`
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
      <div className="px-4 sm:px-0 min-w-[800px] sm:min-w-full">{children}</div>
    </div>
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
    error: <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
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
// 🔥 🔥 🔥 HISTORY CONTENT COMPONENT
// ============================================================

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${API_BASE}/api/v1/payments/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch payment history");
        }

        const data = await response.json();
        setHistory(data);
        setFilteredHistory(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  useEffect(() => {
    let filtered = history;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.transaction_id?.toLowerCase().includes(term) ||
          p.school_name?.toLowerCase().includes(term) ||
          p.plan?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredHistory(filtered);
  }, [searchTerm, statusFilter, history]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 text-white">
            <CheckCircle className="h-3 w-3 mr-1" /> Success
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 border-0 text-white">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 border-0 text-white">
            <XCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "monthly":
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
            Monthly
          </Badge>
        );
      case "quarterly":
        return (
          <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
            Quarterly
          </Badge>
        );
      case "semester":
        return (
          <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">
            Semester
          </Badge>
        );
      case "annual":
        return (
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
            Annual
          </Badge>
        );
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  // Calculate stats
  const totalTransactions = history.length;
  const totalAmount = history.reduce((acc, p) => acc + (p.amount || 0), 0);
  const successCount = history.filter((p) => p.status === "success").length;
  const pendingCount = history.filter((p) => p.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-600 mt-6 text-base sm:text-lg font-medium">Loading History...</p>
          <div className="mt-4 h-1 w-48 mx-auto bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Payment History"
          subtitle="View all your subscription transactions"
          icon={<CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalTransactions} Transactions
            </span>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <MobileStatCard
            label="Total Transactions"
            value={totalTransactions}
            icon={CreditCard}
            color="sky"
            subtitle="All time"
          />
          <MobileStatCard
            label="Total Spent"
            value={`TSh ${totalAmount.toLocaleString()}`}
            icon={Coins}
            color="emerald"
            subtitle="All payments"
          />
          <MobileStatCard
            label="Successful"
            value={successCount}
            icon={CheckCircle}
            color="teal"
            subtitle="Completed"
          />
          <MobileStatCard
            label="Pending"
            value={pendingCount}
            icon={Clock}
            color="amber"
            subtitle="Awaiting confirmation"
          />
        </div>

        {/* Error Message */}
        {error && <MobileAlert type="error" message={error} onClose={() => setError("")} />}

        {/* Filters - Different styling (not card) */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by transaction ID, school, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] sm:w-[180px] bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                <SelectItem value="all">📋 All Status</SelectItem>
                <SelectItem value="success">✅ Success</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="failed">❌ Failed</SelectItem>
              </SelectContent>
            </Select>
            <button
              className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm touch-feedback bg-white/80"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              <XCircle className="h-4 w-4 text-gray-400" />
              <span className="hidden xs:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Table - Different styling (not card inside card) */}
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-b border-sky-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-sky-800 flex items-center gap-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                All Transactions
                <Badge className="ml-2 bg-sky-100 text-sky-700 border-sky-200">
                  {filteredHistory.length} records
                </Badge>
              </h2>
              <div className="text-xs text-gray-400">
                Page {page} • {limit} per page
              </div>
            </div>
          </div>

          <div className="p-0">
            <MobileTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="text-sky-700 font-semibold text-xs sm:text-sm">
                      Transaction ID
                    </TableHead>
                    <TableHead className="text-sky-700 font-semibold text-xs sm:text-sm">
                      School
                    </TableHead>
                    <TableHead className="text-sky-700 font-semibold text-xs sm:text-sm hidden md:table-cell">
                      Plan
                    </TableHead>
                    <TableHead className="text-sky-700 font-semibold text-xs sm:text-sm text-right">
                      Amount
                    </TableHead>
                    <TableHead className="text-sky-700 font-semibold text-xs sm:text-sm hidden lg:table-cell">
                      Method
                    </TableHead>
                    <TableHead className="text-sky-700 font-semibold text-xs sm:text-sm">
                      Status
                    </TableHead>
                    <TableHead className="text-sky-700 font-semibold text-xs sm:text-sm hidden xl:table-cell">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="bg-gray-100 p-4 rounded-full">
                            <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium text-sm sm:text-base">
                            {searchTerm || statusFilter !== "all"
                              ? "No matching transactions found"
                              : "No payment history found"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {searchTerm || statusFilter !== "all"
                              ? "Try adjusting your filters"
                              : "Your transactions will appear here"}
                          </p>
                          {!searchTerm && statusFilter === "all" && (
                            <Button
                              onClick={() => router.push("/payment")}
                              className="mt-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all rounded-xl touch-feedback"
                            >
                              Make a Payment
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((payment, idx) => (
                      <TableRow
                        key={payment.id || idx}
                        className="hover:bg-sky-50/50 transition-colors cursor-pointer group animate-fadeIn"
                        style={{ animationDelay: `${idx * 50}ms` }}
                        onClick={() => router.push(`/payment/history/${payment.id}`)}
                      >
                        <TableCell className="font-mono text-[10px] sm:text-sm text-sky-700 truncate max-w-[80px] sm:max-w-[150px]">
                          {payment.transaction_id || payment.id}
                        </TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
                          {payment.school_name || "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {getPlanBadge(payment.plan)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-800 text-xs sm:text-sm">
                          TSh {payment.amount?.toLocaleString() || "0"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs sm:text-sm capitalize">
                          {payment.payment_method || "N/A"}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="hidden xl:table-cell text-[10px] sm:text-sm text-gray-500">
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </MobileTableWrapper>
          </div>

          {/* Summary Footer - Different styling */}
          {filteredHistory.length > 0 && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-sky-50 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <span>
                    Showing <span className="font-semibold text-gray-700">{filteredHistory.length}</span> of{" "}
                    <span className="font-semibold text-gray-700">{history.length}</span> transactions
                  </span>
                  {statusFilter !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      Filter: {statusFilter}
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="outline" className="text-xs">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5 text-sky-500" />
                  <span>
                    Total:{" "}
                    <span className="font-semibold text-gray-700">
                      TSh {filteredHistory.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box - Different styling */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">🔒 Secure Transactions</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  All payments are processed securely
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">⏳ Real-time Updates</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Payment status updates in real-time
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">💬 Need Help?</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Contact support for payment assistance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100/50 mt-4 sm:mt-6 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Payment History</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>💳 {totalTransactions} transactions</span>
            <span>•</span>
            <span>💰 TSh {totalAmount.toLocaleString()}</span>
            <span>•</span>
            <span>✅ {successCount} successful</span>
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
    </div>
  );
}

// ============================================================
// 🔥 🔥 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function PaymentHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 blur-xl opacity-50 animate-pulse" />
              <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-sky-600 relative z-10" />
            </div>
            <p className="text-gray-600 mt-6 text-base sm:text-lg font-medium">Loading History...</p>
            <div className="mt-4 h-1 w-48 mx-auto bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}