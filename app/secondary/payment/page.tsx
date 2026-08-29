// app/secondary/payment/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  CreditCard,
  Calendar,
  CheckCircle,
  Loader2,
  ChevronLeft,
  Sparkles,
  Shield,
  Lock,
  Smartphone,
  Clock,
  TrendingUp,
  Star,
  Crown,
  Zap,
  ArrowRight,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Trophy,
  Wallet,
  Coins,
  Gem,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 INTERFACES
// ============================================================
interface SchoolInfo {
  id: number;
  name: string;
  subscription_expires_at: string | null;
}

const PLANS = [
  { id: "weekly", name: "Weekly", days: 7, price: "5,000", priceTZS: 5000, icon: "⭐", color: "from-blue-500 to-cyan-500" },
  { id: "biweekly", name: "Bi-Weekly", days: 14, price: "8,000", priceTZS: 8000, icon: "🌟", color: "from-cyan-500 to-teal-500" },
  { id: "monthly", name: "Monthly", days: 30, price: "15,000", priceTZS: 15000, icon: "🔥", color: "from-emerald-500 to-teal-500" },
  { id: "2months", name: "2 Months", days: 60, price: "25,000", priceTZS: 25000, icon: "👑", color: "from-amber-500 to-orange-500" },
];

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
}: {
  type: "error" | "info" | "warning";
  message: string;
}) {
  const styles = {
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
  };

  const icons = {
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
      <p className="text-sm sm:text-base break-words">{message}</p>
    </div>
  );
}

// ============================================================
// 🔥 PAYMENT CONTENT COMPONENT
// ============================================================

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState<"info" | "payment" | "success">("info");

  const schoolId = searchParams.get("school_id");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!schoolId) {
      router.push("/login");
      return;
    }

    fetchSchoolInfo(schoolId);
  }, [router, schoolId]);

  const fetchSchoolInfo = async (schoolId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/v1/schools/${schoolId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSchool(response.data);
    } catch (err) {
      console.error("Error fetching school info:", err);
      setError("Failed to load school information");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const plan = PLANS.find((p) => p.id === selectedPlan);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        return;
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // After successful payment, extend subscription
      await axios.post(
        `${API_BASE}/api/v1/schools/${school?.id}/extend-subscription`,
        { days: plan?.days, plan: selectedPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStep("success");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.response?.data?.detail || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanDetails = PLANS.find((p) => p.id === selectedPlan);

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-emerald-400 relative z-10" />
          </div>
          <p className="text-white/80 mt-6 text-base sm:text-lg font-medium">Loading School Info...</p>
          <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="School Subscription"
          subtitle="Renew your subscription to continue using the system"
          icon={<CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              Secure Payment
            </span>
          }
        />

        {step === "info" && (
          <MobileCard gradient="bg-gradient-to-r from-white to-emerald-50/30" delay={100}>
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
            <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 p-4 sm:p-6">
              <div className="flex items-start sm:items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-800 text-base sm:text-lg">Subscription Expired</CardTitle>
                  <CardDescription className="text-red-600 text-sm sm:text-base">
                    Your subscription expired on{" "}
                    {school.subscription_expires_at
                      ? new Date(school.subscription_expires_at).toLocaleDateString()
                      : "unknown date"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{school.name}</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Choose a plan to renew your subscription and regain access to the system.
                </p>
              </div>

              <form onSubmit={handlePayment}>
                <div className="mb-4 sm:mb-6">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block">Select Plan</Label>
                  <RadioGroup
                    value={selectedPlan}
                    onValueChange={setSelectedPlan}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  >
                    {PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className={cn(
                          "border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 touch-feedback",
                          selectedPlan === plan.id
                            ? "border-emerald-500 bg-emerald-50 shadow-lg scale-[1.02]"
                            : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                        )}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{plan.icon}</span>
                              <div className="font-semibold text-base sm:text-lg">{plan.name}</div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">{plan.days} days access</div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="font-bold text-base sm:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              TSh {plan.price}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-400">
                              ≈ ${Math.round(plan.priceTZS / 2500)} USD
                            </div>
                          </div>
                        </div>
                        {selectedPlan === plan.id && (
                          <div className="mt-1 sm:mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Selected
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mb-4 sm:mb-6">
                  <Label htmlFor="phone" className="text-base sm:text-lg font-semibold mb-2 block">
                    <Smartphone className="h-4 w-4 inline mr-2 text-emerald-600" />
                    M-Pesa / Tigo Pesa / Airtel Money Number
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <span className="text-sm font-bold">+255</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-16 text-base sm:text-lg h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    We'll send a payment request to this number
                  </p>
                </div>

                {error && <MobileAlert type="error" message={error} />}

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-3 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">School:</span>
                      <span className="font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[250px]">
                        {school.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Selected Plan:</span>
                      <span className="font-semibold text-gray-800">{selectedPlanDetails?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Access Period:</span>
                      <span className="font-semibold text-gray-800">{selectedPlanDetails?.days} days</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-base sm:text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        TSh {selectedPlanDetails?.price}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-5 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all rounded-xl touch-feedback"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Pay TSh {selectedPlanDetails?.price}
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-400">
                  <Shield className="h-3 w-3" />
                  <span>Secure payment powered by MASI</span>
                </div>
              </form>
            </CardContent>
          </MobileCard>
        )}

        {step === "success" && (
          <MobileCard gradient="bg-gradient-to-r from-white to-emerald-50/30" delay={100}>
            <CardContent className="p-6 sm:p-12 text-center">
              <div className="relative">
                <div className="bg-emerald-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600" />
                </div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4">
                  <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl mb-2 text-gray-800">Payment Successful! 🎉</CardTitle>
              <CardDescription className="text-base sm:text-lg mb-4 sm:mb-6 text-gray-600">
                Your subscription has been renewed successfully.
              </CardDescription>
              <div className="bg-emerald-50 rounded-xl p-4 mb-6 max-w-sm mx-auto">
                <p className="text-sm text-emerald-700">
                  <span className="font-semibold">✅ Access Granted</span>
                  <br />
                  You now have full access to all features
                </p>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                You will be redirected to the login page in a few seconds...
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl touch-feedback"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Go to Login
              </Button>
            </CardContent>
          </MobileCard>
        )}

        {/* Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-xs sm:text-sm">🔒 Secure Payment</p>
                <p className="text-[10px] sm:text-xs text-blue-600/80 mt-0.5">
                  Your payment is processed securely through MASI payment system
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">⏰ Instant Activation</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Your subscription activates immediately after successful payment
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "500ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Gem className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">💎 Best Value</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Choose monthly or 2-month plans for the best value for your school
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 mt-4 sm:mt-6 animate-fadeIn" style={{ animationDelay: "600ms" }}>
          <p className="font-medium">© 2026 MASI FAST RESULTS • Payment Portal</p>
          <p className="mt-0.5 flex items-center justify-center gap-2">
            <span>💳 Secure Payment</span>
            <span>•</span>
            <span>🔒 Encrypted</span>
            <span>•</span>
            <span>⚡ Instant Access</span>
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

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
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
// 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function SecondaryPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50 animate-pulse" />
              <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-emerald-400 relative z-10" />
            </div>
            <p className="text-white/80 mt-6 text-base sm:text-lg font-medium">Loading Payment...</p>
            <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}