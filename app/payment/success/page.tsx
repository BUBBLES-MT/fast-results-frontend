// app/payment/success/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  School,
  Calendar,
  CreditCard,
  Sparkles,
  Crown,
  Users,
  Clock,
  Award,
  Gem,
  Star,
  Gift,
  Lock,
  Printer,
  Share2,
  Copy,
  Check,
  Info,
  ChevronDown,
  ShieldCheck,
  LogIn,
  Loader2,
  ChevronLeft,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  TrendingUp,
  GraduationCap,
  Building,
  BadgeCheck,
  ChevronRight,
  Zap,
  Rocket,
  Coins,
  Wallet,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
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
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-emerald-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>
      </div>
    </div>
  );
}

function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "emerald",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "emerald" | "purple" | "amber" | "sky" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    emerald: "from-emerald-500 to-teal-500",
    teal: "from-teal-500 to-cyan-500",
    blue: "from-blue-500 to-indigo-500",
    sky: "from-sky-500 to-blue-500",
    cyan: "from-cyan-500 to-blue-500",
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
        `bg-gradient-to-r ${gradients[color] || gradients.emerald}`
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

function MobileAlert({
  type,
  message,
}: {
  type: "info" | "success";
  message: string;
}) {
  const styles = {
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
  };

  const icons = {
    info: <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
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
    </div>
  );
}

// ============================================================
// 🔥 🔥 🔥 SUCCESS CONTENT COMPONENT
// ============================================================

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction_id");
  const plan = searchParams.get("plan") || "Monthly";
  const amount = searchParams.get("amount") || "0";

  const [countdown, setCountdown] = useState(5);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      setIsRedirecting(true);
      router.push("/login?payment=success");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const formatCurrency = (value: string) => {
    const num = parseInt(value) || 0;
    return `TSh ${num.toLocaleString()}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Payment Successful!",
          text: "I just renewed my school subscription! 🎉",
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoginRedirect = () => {
    setIsRedirecting(true);
    router.push("/login?payment=success");
  };

  const getPlanBadge = () => {
    switch (plan?.toLowerCase()) {
      case "monthly":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "quarterly":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "semester":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "annual":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-sky-100 text-sky-700 border-sky-200";
    }
  };

  const getPlanEmoji = () => {
    switch (plan?.toLowerCase()) {
      case "monthly":
        return "🚀";
      case "quarterly":
        return "🔥";
      case "semester":
        return "⭐";
      case "annual":
        return "👑";
      default:
        return "🎉";
    }
  };

  const getTransactionDisplay = () => {
    if (transactionId && transactionId !== "") {
      return transactionId;
    }
    return "TXN-" + Date.now().toString().slice(-8);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute top-20 right-10 text-emerald-200/20 animate-float-slow">
          <CheckCircle className="h-32 w-32" />
        </div>
        <div className="absolute bottom-20 left-10 text-teal-200/20 animate-float-slow animation-delay-2000">
          <Sparkles className="h-24 w-24" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10 animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header - Different styling (not card) */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-3 sm:mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-float">
              <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-white" strokeWidth={1.5} />
              <div className="absolute -top-1.5 -right-1.5 bg-amber-400 rounded-full p-1 shadow-lg">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Payment Successful! 🎉
          </h1>
          <p className="text-emerald-600/80 text-sm sm:text-base mt-1">Your subscription has been activated successfully</p>
        </div>

        {/* Stats Grid - Mobile first */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <MobileStatCard
            label="Amount"
            value={formatCurrency(amount)}
            icon={Wallet}
            color="emerald"
            subtitle="Paid"
          />
          <MobileStatCard
            label="Plan"
            value={plan}
            icon={Star}
            color="purple"
            subtitle="Selected"
          />
          <MobileStatCard
            label="Status"
            value="Active"
            icon={CheckCircle}
            color="teal"
            subtitle="✅ Confirmed"
          />
          <MobileStatCard
            label="Access"
            value="Unlimited"
            icon={Users}
            color="sky"
            subtitle="Full access"
          />
        </div>

        {/* What's Next - Gradient section (not card) */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-xl p-4 sm:p-5 border border-emerald-100/50 mb-4 sm:mb-6 animate-slideIn" style={{ animationDelay: "100ms" }}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-emerald-800 text-sm sm:text-base">What's Next?</h4>
              <p className="text-xs sm:text-sm text-emerald-600/80 mt-0.5">
                Your subscription is now active! You can now login again.
              </p>
              <div className="mt-2 sm:mt-3 bg-white/60 rounded-xl p-2.5 sm:p-3 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>🔑 Login again</strong> to access your dashboard with your renewed subscription.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details - Collapsible (not card) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 sm:mb-6 animate-slideIn" style={{ animationDelay: "200ms" }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Transaction Details</span>
              <Badge variant="outline" className="text-[10px] border-gray-300 text-gray-500 flex-shrink-0">
                {getTransactionDisplay()}
              </Badge>
            </div>
            <ChevronDown
              className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDetails && (
            <div className="p-3 sm:p-4 pt-0 border-t border-gray-100 animate-slideDown">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono font-medium text-gray-700">{getTransactionDisplay()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="font-medium text-gray-700">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-700">Mobile Money</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Status</span>
                  <Badge className="bg-emerald-500 text-white border-0 text-[10px]">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-6 animate-slideIn" style={{ animationDelay: "300ms" }}>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Secure
          </span>
          <span className="w-px h-3 bg-gray-200 hidden xs:inline" />
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-500" />
            Encrypted
          </span>
          <span className="w-px h-3 bg-gray-200 hidden xs:inline" />
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-emerald-500" />
            24/7 Support
          </span>
          <span className="w-px h-3 bg-gray-200 hidden xs:inline" />
          <span className="flex items-center gap-1">
            <Gift className="h-3 w-3 text-amber-500" />
            {getPlanEmoji()} {plan} Plan
          </span>
        </div>

        {/* Redirect Info - Different styling */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-center mb-4 sm:mb-6 animate-slideIn" style={{ animationDelay: "400ms" }}>
          {isRedirecting ? (
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-amber-600" />
              <span className="text-xs sm:text-sm text-amber-700">Redirecting to login...</span>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-amber-700">
                <strong>⏳ Redirecting to login page in {countdown} seconds...</strong>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-amber-500 mt-1.5">
                After login, you can access your dashboard with the renewed subscription.
              </p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:gap-3 animate-slideIn" style={{ animationDelay: "500ms" }}>
          <Button
            onClick={handleLoginRedirect}
            disabled={isRedirecting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-500/30 text-white py-5 sm:py-6 text-base sm:text-lg group rounded-xl touch-feedback disabled:opacity-50"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                Login to Dashboard
                {countdown > 0 && (
                  <span className="ml-2 text-xs sm:text-sm opacity-70 bg-white/20 px-2 py-0.5 rounded-full">
                    {countdown}s
                  </span>
                )}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isRedirecting}
              className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl h-10 sm:h-11 text-xs sm:text-sm touch-feedback disabled:opacity-50"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={isRedirecting}
              className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl h-10 sm:h-11 text-xs sm:text-sm touch-feedback disabled:opacity-50"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-emerald-500" />
              ) : (
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              )}
              {copied ? "Copied!" : "Share"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/payment/history")}
              disabled={isRedirecting}
              className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-50 rounded-xl h-10 sm:h-11 text-xs sm:text-sm touch-feedback disabled:opacity-50"
            >
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              History
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100/50 mt-4 sm:mt-6 animate-fadeIn" style={{ animationDelay: "600ms" }}>
          <p className="font-medium text-emerald-600">© 2026 MASI FAST RESULTS • Payment Success</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>✅ Payment successful</span>
            <span>•</span>
            <span>🔑 Login to continue</span>
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
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.02);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
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
          animation: slideDown 0.3s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
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

// ============================================================
// 🔥 🔥 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50 animate-pulse" />
              <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-emerald-600 relative z-10" />
            </div>
            <p className="text-gray-600 mt-6 text-base sm:text-lg font-medium">Loading Success...</p>
            <div className="mt-4 h-1 w-48 mx-auto bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}