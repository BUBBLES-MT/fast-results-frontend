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
} from "lucide-react";

// ============================================================
// 🔥 🔥 🔥 SUCCESS CONTENT COMPONENT (Wrapped in Suspense)
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

  // ✅ Auto-redirect to LOGIN after 5 seconds
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
      // ✅ Elekeza kwenye LOGIN
      router.push("/login?payment=success");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  // Format currency
  const formatCurrency = (value: string) => {
    const num = parseInt(value) || 0;
    return `TSh ${num.toLocaleString()}`;
  };

  // Handle copy
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle share
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

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle manual redirect to login
  const handleLoginRedirect = () => {
    setIsRedirecting(true);
    router.push("/login?payment=success");
  };

  // Get plan badge
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

  // Get transaction display
  const getTransactionDisplay = () => {
    if (transactionId && transactionId !== "") {
      return transactionId;
    }
    return "TXN-" + Date.now().toString().slice(-8);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 p-4">
      <Card className="max-w-2xl w-full border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        {/* Premium Header Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <CardHeader className="text-center pt-8">
          {/* Success Icon with Animation */}
          <div className="mx-auto bg-gradient-to-br from-emerald-400 to-green-600 p-5 rounded-full w-32 h-32 flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/30 animate-float">
            <CheckCircle className="h-16 w-16 text-white" strokeWidth={1.5} />
          </div>

          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Payment Successful! 🎉
          </CardTitle>
          <CardDescription className="text-emerald-600 text-base mt-2">
            Your subscription has been activated successfully
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 text-center border border-emerald-100">
              <CreditCard className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Amount</p>
              <p className="text-sm font-bold text-emerald-700">{formatCurrency(amount)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border border-purple-100">
              <Star className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wider">Plan</p>
              <p className="text-sm font-bold text-purple-700 capitalize">{plan}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-100">
              <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <p className="text-[10px] text-amber-500 font-medium uppercase tracking-wider">Status</p>
              <Badge className="bg-emerald-500 text-white border-0 text-xs px-2 py-0.5">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-3 text-center border border-sky-100">
              <Users className="h-5 w-5 text-sky-600 mx-auto mb-1" />
              <p className="text-[10px] text-sky-500 font-medium uppercase tracking-wider">Access</p>
              <p className="text-sm font-bold text-sky-700">Unlimited</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Transaction Details</span>
                <Badge variant="outline" className="text-[10px] border-gray-300 text-gray-500">
                  {getTransactionDisplay()}
                </Badge>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                  showDetails ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDetails && (
              <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono font-medium text-gray-700">{getTransactionDisplay()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="font-medium text-gray-700">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-700">Mobile Money</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <Badge className="bg-emerald-500 text-white border-0 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-2xl p-5 border border-emerald-100/50">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-emerald-800 text-base">What's Next?</h4>
                <p className="text-sm text-emerald-600/80 mt-1">
                  Your subscription is now active! You can now login again.
                </p>
                <div className="mt-3">
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <p className="text-sm text-gray-600">
                      <strong>🔑 Login again</strong> to access your dashboard with your renewed subscription.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Secure
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-emerald-500" />
              Encrypted
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-emerald-500" />
              24/7 Support
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Gift className="h-3 w-3 text-amber-500" />
              {getPlanEmoji()} {plan} Plan
            </span>
          </div>

          {/* ✅ REDIRECT INFO - Login not Dashboard */}
          <div
            className={`bg-amber-50 border border-amber-200 rounded-xl p-3 text-center transition-all duration-300 ${
              isRedirecting ? "opacity-50" : ""
            }`}
          >
            {isRedirecting ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                <span className="text-sm text-amber-700">Redirecting to login...</span>
              </div>
            ) : (
              <>
                <p className="text-sm text-amber-700">
                  <strong>⏳ Redirecting to login page in {countdown} seconds...</strong>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-amber-500 mt-2">
                  After login, you can access your dashboard with the renewed subscription.
                </p>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2 pb-6 px-6">
          {/* ✅ MAIN BUTTON - GO TO LOGIN */}
          <Button
            onClick={handleLoginRedirect}
            disabled={isRedirecting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-500/30 text-white py-7 text-lg group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Login to Dashboard
                {countdown > 0 && (
                  <span className="ml-2 text-sm opacity-70 bg-white/20 px-2 py-0.5 rounded-full">
                    {countdown}s
                  </span>
                )}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full flex-wrap">
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isRedirecting}
              className="flex-1 min-w-[100px] border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={isRedirecting}
              className="flex-1 min-w-[100px] border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied!" : "Share"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/payment/history")}
              disabled={isRedirecting}
              className="flex-1 min-w-[100px] border-sky-300 text-sky-700 hover:bg-sky-50 disabled:opacity-50"
            >
              <Clock className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center">
            <p className="text-[10px] text-gray-400">
              © {new Date().getFullYear()} School Management System. All rights reserved.
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center">
            <Loader2 className="h-20 w-20 animate-spin text-emerald-400 mx-auto" />
            <p className="text-white/80 mt-6 text-lg font-medium">Loading Success Page...</p>
            <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
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