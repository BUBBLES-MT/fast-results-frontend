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
} from "lucide-react";

// ============================================================
// 🔥 HELP CENTER OPTIONS
// ============================================================
const HELP_OPTIONS = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    description: "Chat with us instantly",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    action: () => window.open("https://wa.me/255712345678", "_blank"),
  },
  {
    id: "phone",
    icon: Phone,
    label: "Call Us",
    description: "Talk to our support team",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    action: () => window.location.href = "tel:+255712345678",
  },
  {
    id: "email",
    icon: Mail,
    label: "Email Support",
    description: "Send us an email",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    action: () => window.location.href = "mailto:support@schoolmanagement.com",
  },
  {
    id: "faq",
    icon: HelpCircle,
    label: "FAQ",
    description: "Find answers quickly",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    action: () => window.open("/faq", "_blank"),
  },
];

// ============================================================
// 🔥 🔥 🔥 CANCELED CONTENT COMPONENT
// ============================================================

function CanceledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // ✅ Get params safely
  const reason = searchParams.get("reason") || "Payment was canceled by user.";
  const plan = searchParams.get("plan") || "";
  const schoolName = searchParams.get("school_name") || "";

  // Auto-redirect to payment after 10 seconds
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100 p-4 relative overflow-hidden">
      {/* Premium Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute top-20 right-10 text-rose-200/20 animate-float-slow">
          <XCircle className="h-32 w-32" />
        </div>
        <div className="absolute bottom-20 left-10 text-amber-200/20 animate-float-slow animation-delay-2000">
          <AlertTriangle className="h-24 w-24" />
        </div>
      </div>

      <Card className="max-w-2xl w-full border-0 shadow-2xl bg-white/95 backdrop-blur-xl relative z-10 animate-slideUp overflow-hidden">
        {/* Premium Header Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />

        <CardHeader className="text-center pt-8">
          {/* Premium Icon with Glow */}
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-rose-500/30">
              <XCircle className="h-16 w-16 text-white" strokeWidth={1.5} />
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1.5 shadow-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            Payment Canceled
          </CardTitle>
          <CardDescription className="text-rose-500/80 text-base mt-2">
            Your payment was not completed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Premium Status Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 px-4 py-2 text-sm font-medium">
              <XCircle className="h-4 w-4 mr-2" />
              Transaction Canceled
            </Badge>
          </div>

          {/* School & Plan Info */}
          {(schoolName || plan) && (
            <div className="bg-white/60 rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {schoolName && (
                  <div>
                    <p className="text-gray-400">School</p>
                    <p className="font-medium text-gray-700">{schoolName}</p>
                  </div>
                )}
                {plan && (
                  <div>
                    <p className="text-gray-400">Plan</p>
                    <p className="font-medium text-gray-700 capitalize">{plan}</p>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <p><strong>Reason:</strong> {reason}</p>
              </div>
            </div>
          )}

          {/* What Happened Section */}
          <div className="bg-gradient-to-br from-rose-50/80 to-amber-50/80 rounded-2xl p-6 border border-rose-200/50 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-rose-100 p-2 rounded-xl">
                <Info className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-semibold text-rose-800 text-lg">Transaction Details</h4>
                <p className="text-sm text-rose-600/80 mt-1">
                  You have successfully canceled the payment process. No charges have been made to your account.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-white/60 rounded-xl p-3">
                    <p className="text-xs text-rose-400 font-medium">Status</p>
                    <p className="text-sm font-semibold text-rose-700 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Canceled
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3">
                    <p className="text-xs text-rose-400 font-medium">Time</p>
                    <p className="text-sm font-semibold text-rose-700 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What Now Section */}
          <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 rounded-2xl p-6 border border-amber-200/50 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 text-lg">What Now?</h4>
                <p className="text-sm text-amber-600/80 mt-1">
                  Don't worry! You can try again or explore other options:
                </p>
                <div className="mt-3 space-y-2">
                  <div
                    className="flex items-center gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors cursor-pointer"
                    onClick={handleTryAgain}
                  >
                    <RefreshCw className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-700">Try Again</p>
                      <p className="text-xs text-amber-500">Complete your subscription payment</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-amber-400 ml-auto" />
                  </div>
                  <div
                    className="flex items-center gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors cursor-pointer"
                    onClick={() => router.push("/payment/history")}
                  >
                    <Clock className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-700">View History</p>
                      <p className="text-xs text-amber-500">Check your payment history</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-amber-400 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section - Collapsible */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-sky-600" />
                <span className="font-medium text-gray-700">Need Help?</span>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 text-xs">
                  24/7 Support
                </Badge>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                  showHelp ? "rotate-180" : ""
                }`}
              />
            </button>

            {showHelp && (
              <div className="p-4 pt-0 border-t border-gray-100 animate-slideDown">
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {HELP_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={option.action}
                        className={`${option.color} rounded-xl p-4 text-center border transition-all hover:scale-105 hover:shadow-md`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs opacity-70 mt-1">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Auto-redirect Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
              <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
              <span>
                Redirecting to payment page in <span className="font-bold text-amber-600">{countdown}</span> seconds...
              </span>
              <button
                onClick={handleTryAgain}
                className="text-amber-600 hover:text-amber-700 font-medium underline-offset-2 hover:underline"
              >
                Go now
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2 pb-6 px-6">
          <Button
            onClick={handleTryAgain}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/30 text-white py-6 text-lg group"
          >
            <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex-1 border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>

          {/* Premium Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 w-full">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Secure Payment
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Encrypted
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  24/7 Support
                </span>
              </div>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} School Management System. All rights reserved.
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.02);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// 🔥 🔥 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function PaymentCanceledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100">
          <div className="text-center">
            <Loader2 className="h-20 w-20 animate-spin text-amber-500 mx-auto" />
            <p className="text-gray-600 mt-6 text-lg font-medium">Loading...</p>
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