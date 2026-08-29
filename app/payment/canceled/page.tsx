// app/payment/canceled/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XCircle,
  RefreshCw,
  Home,
  AlertTriangle,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Info,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Lock,
  Loader2,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Calendar,
  CreditCard,
  Zap,
  Rocket,
  Gem,
  Star,
  Trophy,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 HELP CENTER OPTIONS
// ============================================================
const HELP_OPTIONS = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    description: "Chat with us instantly",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
    action: () => window.open("https://wa.me/255712345678", "_blank"),
  },
  {
    id: "phone",
    icon: Phone,
    label: "Call Us",
    description: "Talk to our support team",
    color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
    action: () => window.location.href = "tel:+255712345678",
  },
  {
    id: "email",
    icon: Mail,
    label: "Email Support",
    description: "Send us an email",
    color: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
    action: () => window.location.href = "mailto:support@masifastresults.com",
  },
  {
  id: "faq",
  icon: HelpCircle,
  label: "FAQ",
  description: "Find answers quickly",
  color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
  action: () => window.location.href = "/faq",  // ✅ NJIA NYINGINE
},
];

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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Rudi</span>
    </button>
  );
}

// ============================================================
// 🔥 🔥 🔥 CANCELED CONTENT COMPONENT
// ============================================================

function CanceledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const reason = searchParams.get("reason") || "Payment was canceled by user.";
  const plan = searchParams.get("plan") || "";
  const schoolName = searchParams.get("school_name") || "";

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
      router.push("/payment");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryAgain = () => {
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Main Card - Only one card as container */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />

          <CardHeader className="text-center pt-6 sm:pt-8 pb-4 sm:pb-6">
            {/* Icon */}
            <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full opacity-20 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-rose-500/30">
                <XCircle className="h-12 w-12 sm:h-14 sm:w-14 text-white" strokeWidth={1.5} />
                <div className="absolute -top-1.5 -right-1.5 bg-amber-400 rounded-full p-1 shadow-lg">
                  <AlertTriangle className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              Payment Canceled
            </CardTitle>
            <CardDescription className="text-rose-500/80 text-sm sm:text-base mt-1">
              Your payment was not completed
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6">
            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full">
                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Transaction Canceled
              </Badge>
            </div>

            {/* School & Plan Info - Bordered section (not card) */}
            {(schoolName || plan) && (
              <div className="bg-white/60 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {schoolName && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">School</p>
                      <p className="font-medium text-gray-700 text-sm sm:text-base truncate">{schoolName}</p>
                    </div>
                  )}
                  {plan && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Plan</p>
                      <p className="font-medium text-gray-700 text-sm sm:text-base capitalize">{plan}</p>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[10px] sm:text-xs text-gray-400">
                  <p><strong>Reason:</strong> {reason}</p>
                </div>
              </div>
            )}

            {/* What Happened - Gradient section (not card) */}
            <div className="bg-gradient-to-br from-rose-50/80 to-amber-50/80 rounded-xl p-4 sm:p-5 border border-rose-200/50">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-rose-100 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-rose-800 text-sm sm:text-base">Transaction Details</h4>
                  <p className="text-xs sm:text-sm text-rose-600/80 mt-0.5">
                    You have successfully canceled the payment process. No charges have been made to your account.
                  </p>
                  <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white/60 rounded-xl p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-rose-400 font-medium">Status</p>
                      <p className="text-xs sm:text-sm font-semibold text-rose-700 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Canceled
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-rose-400 font-medium">Time</p>
                      <p className="text-xs sm:text-sm font-semibold text-rose-700 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What Now - Different gradient (not card) */}
            <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 rounded-xl p-4 sm:p-5 border border-amber-200/50">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-amber-100 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-amber-800 text-sm sm:text-base">What Now?</h4>
                  <p className="text-xs sm:text-sm text-amber-600/80 mt-0.5">
                    Don't worry! You can try again or explore other options:
                  </p>
                  <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                    <div
                      className="flex items-center gap-3 bg-white/60 rounded-xl p-2.5 sm:p-3 hover:bg-white/80 transition-colors cursor-pointer touch-feedback"
                      onClick={handleTryAgain}
                    >
                      <RefreshCw className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-amber-700">Try Again</p>
                        <p className="text-[10px] sm:text-xs text-amber-500 truncate">Complete your subscription payment</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    </div>
                    <div
                      className="flex items-center gap-3 bg-white/60 rounded-xl p-2.5 sm:p-3 hover:bg-white/80 transition-colors cursor-pointer touch-feedback"
                      onClick={() => router.push("/payment/history")}
                    >
                      <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-amber-700">View History</p>
                        <p className="text-[10px] sm:text-xs text-amber-500 truncate">Check your payment history</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section - Collapsible with different styling */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 flex-shrink-0" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">Need Help?</span>
                  <Badge variant="secondary" className="bg-sky-100 text-sky-700 text-[10px] sm:text-xs flex-shrink-0">
                    24/7 Support
                  </Badge>
                </div>
                <ChevronDown
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                    showHelp ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showHelp && (
                <div className="p-3 sm:p-4 pt-0 border-t border-gray-100 animate-slideDown">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
                    {HELP_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={option.action}
                          className={cn(
                            option.color,
                            "rounded-xl p-3 sm:p-4 text-center border transition-all hover:scale-105 hover:shadow-md touch-feedback"
                          )}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1.5 sm:mb-2" />
                          <p className="font-medium text-xs sm:text-sm">{option.label}</p>
                          <p className="text-[10px] sm:text-xs opacity-70 mt-0.5">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Auto-redirect Info */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 animate-spin" />
                <span>
                  Redirecting to payment page in <span className="font-bold text-amber-600">{countdown}</span> seconds...
                </span>
                <button
                  onClick={handleTryAgain}
                  className="text-amber-600 hover:text-amber-700 font-medium underline-offset-2 hover:underline text-xs sm:text-sm"
                >
                  Go now
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2 pb-5 sm:pb-6 px-4 sm:px-6">
            <Button
              onClick={handleTryAgain}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/30 text-white py-5 sm:py-6 text-base sm:text-lg group rounded-xl touch-feedback"
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex gap-2 sm:gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 rounded-xl h-10 sm:h-11 text-xs sm:text-sm touch-feedback"
              >
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-1 border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400 rounded-xl h-10 sm:h-11 text-xs sm:text-sm touch-feedback"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                )}
                {copied ? "Copied!" : "Share"}
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 w-full">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Secure Payment
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Encrypted
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    24/7 Support
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  © {new Date().getFullYear()} MASI FAST RESULTS. All rights reserved.
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
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

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
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
// 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function PaymentCanceledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 blur-xl opacity-50 animate-pulse" />
              <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-amber-500 relative z-10" />
            </div>
            <p className="text-gray-600 mt-6 text-base sm:text-lg font-medium">Loading...</p>
            <div className="mt-4 h-1 w-48 mx-auto bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <CanceledContent />
    </Suspense>
  );
}