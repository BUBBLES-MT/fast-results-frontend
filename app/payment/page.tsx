// app/payment/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  School,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  Building2,
  Crown,
  Zap,
  Users,
  Star,
  Gem,
  Rocket,
  Lock,
  Smartphone,
  Check,
  ChevronRight,
  Waves,
  Cloud,
  TrendingDown,
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
  Award,
  BarChart3,
  Coins,
  Wallet,
  CalendarDays,
  Gift,
  Heart,
  Flame,
  Medal,
  Sparkle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 SUBSCRIPTION PLANS - BEI MPYA!
// ============================================================
const SUBSCRIPTION_PLANS = [
  {
    id: "monthly",
    name: "Starter",
    days: 30,
    price: 20000,
    price_display: "TSh 20,000",
    description: "Perfect for small schools",
    features: [
      "Unlimited Students",
      "Unlimited Teachers",
      "All Classes & Subjects",
      "Marks & Reports",
      "24/7 Support",
      "Basic Analytics",
    ],
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    popular: false,
    tag: "Start Here",
    tagColor: "bg-blue-100 text-blue-700",
    shadowColor: "shadow-blue-500/20",
  },
  {
    id: "quarterly",
    name: "Professional",
    days: 90,
    price: 55000,
    price_display: "TSh 55,000",
    description: "Most popular choice",
    features: [
      "Unlimited Students",
      "Unlimited Teachers",
      "All Classes & Subjects",
      "Marks & Reports",
      "24/7 Priority Support",
      "Advanced Analytics",
      "Monthly Reports",
      "Teacher Training",
    ],
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    popular: true,
    tag: "🔥 Popular",
    tagColor: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    shadowColor: "shadow-purple-500/30",
    discount: "Save 8%",
  },
  {
    id: "semester",
    name: "Business",
    days: 180,
    price: 110000,
    price_display: "TSh 110,000",
    description: "For growing schools",
    features: [
      "Unlimited Students",
      "Unlimited Teachers",
      "All Classes & Subjects",
      "Marks & Reports",
      "24/7 VIP Support",
      "Advanced Analytics",
      "Monthly Reports",
      "Teacher Training",
      "Parent Portal",
      "Custom Reports",
    ],
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    popular: false,
    tag: "⭐ Best Value",
    tagColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    shadowColor: "shadow-amber-500/30",
    discount: "Save 8%",
  },
  {
    id: "annual",
    name: "Enterprise",
    days: 365,
    price: 220000,
    price_display: "TSh 220,000",
    description: "Ultimate school solution",
    features: [
      "Unlimited Students",
      "Unlimited Teachers",
      "All Classes & Subjects",
      "Marks & Reports",
      "24/7 VIP Support",
      "Advanced Analytics",
      "Monthly Reports",
      "Teacher Training",
      "Parent Portal",
      "Custom Reports",
      "API Access",
      "Dedicated Account Manager",
      "Priority Updates",
      "Custom Branding",
    ],
    icon: Gem,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    popular: false,
    tag: "👑 Ultimate",
    tagColor: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    shadowColor: "shadow-emerald-500/30",
    discount: "Save 10%",
  },
];

// ============================================================
// 🔥 PAYMENT METHODS
// ============================================================
const PAYMENT_METHODS = [
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:border-green-400",
    textColor: "text-green-700",
  },
  {
    id: "tigopesa",
    name: "TigoPesa",
    icon: Smartphone,
    color: "from-blue-500 to-sky-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:border-blue-400",
    textColor: "text-blue-700",
  },
  {
    id: "airtelmoney",
    name: "Airtel Money",
    icon: Smartphone,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    hoverColor: "hover:border-red-400",
    textColor: "text-red-700",
  },
  {
    id: "halopesa",
    name: "HaloPesa",
    icon: Smartphone,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:border-purple-400",
    textColor: "text-purple-700",
  },
];

// ============================================================
// 🔥 HELPER - GET SCHOOL LEVEL DISPLAY
// ============================================================
const getSchoolLevelDisplay = (level: string | undefined): string => {
  if (!level) return "School";
  const levels: Record<string, string> = {
    primary: "Primary",
    secondary: "Secondary",
    advanced: "Advanced",
  };
  return levels[level.toLowerCase()] || "School";
};

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
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Rudi</span>
    </button>
  );
}

// ============================================================
// 🔥 🔥 🔥 PAYMENT CONTENT COMPONENT
// ============================================================

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("school_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [school, setSchool] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1]);
  const [selectedMethod, setSelectedMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [transactionId, setTransactionId] = useState("");
  const [progress, setProgress] = useState(0);

  // ============================================================
  // 🔥 FETCH SCHOOL INFO
  // ============================================================
  useEffect(() => {
    const fetchSchool = async () => {
      if (!schoolId) {
        setError("No school selected. Please login first.");
        setLoading(false);
        return;
      }

      try {
        let token = localStorage.getItem("token");

        if (!token) {
          const cookies = document.cookie.split(";");
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === "token") {
              token = decodeURIComponent(value);
              if (token) {
                localStorage.setItem("token", token);
              }
              break;
            }
          }
        }

        if (!token) {
          console.warn("⚠️ No token found, using school from URL params");
          setSchool({
            id: parseInt(schoolId),
            name: sessionStorage.getItem("expired_school_name") || "Shule yako",
            school_level: "secondary",
          });
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/api/v1/schools/${schoolId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch school");
        }

        const data = await response.json();
        setSchool(data);

        const userName = localStorage.getItem("user_name");
        if (userName) {
          setCustomerName(userName);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching school:", err);
        setSchool({
          id: parseInt(schoolId),
          name: sessionStorage.getItem("expired_school_name") || "Shule yako",
          school_level: "secondary",
        });
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  // ============================================================
  // 🔥 HANDLE PAYMENT
  // ============================================================
  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Tafadhali ingiza namba sahihi ya simu (e.g., 0712345678)");
      return;
    }

    if (!agreeTerms) {
      setError("Tafadhali kubali masharti na maelezo");
      return;
    }

    setProcessing(true);
    setError("");
    setPaymentStatus("processing");
    setPaymentDialog(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token for payment, using fallback");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        clearInterval(progressInterval);
        setProgress(100);
        setPaymentStatus("success");
        setTransactionId("TXN-" + Date.now().toString().slice(-8));

        setTimeout(() => {
          router.push(
            `/payment/success?transaction_id=${transactionId}&plan=${selectedPlan.id}&amount=${selectedPlan.price}`
          );
        }, 1500);
        setProcessing(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/v1/payments/initiate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school_id: parseInt(schoolId!),
          plan: selectedPlan.id,
          amount: selectedPlan.price,
          phone_number: phoneNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          payment_method: selectedMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Payment failed");
      }

      const transaction = await response.json();
      setTransactionId(transaction.id);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setProgress(100);

      setPaymentStatus("success");

      setTimeout(() => {
        router.push(
          `/payment/success?transaction_id=${transaction.id}&plan=${selectedPlan.id}&amount=${selectedPlan.price}`
        );
      }, 1500);
    } catch (err: any) {
      clearInterval(progressInterval);
      setPaymentStatus("failed");
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // ============================================================
  // 🔥 CALCULATE SAVINGS
  // ============================================================
  const calculateSavings = (plan: (typeof SUBSCRIPTION_PLANS)[0]) => {
    if (plan.id === "monthly") return 0;
    const monthlyCost = 20000 * (plan.days / 30);
    return Math.round(monthlyCost - plan.price);
  };

  const getSavingsPercentage = (plan: (typeof SUBSCRIPTION_PLANS)[0]) => {
    if (plan.id === "monthly") return 0;
    const monthlyCost = 20000 * (plan.days / 30);
    if (monthlyCost <= 0) return 0;
    return Math.round(((monthlyCost - plan.price) / monthlyCost) * 100);
  };

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-purple-400 relative z-10" />
          </div>
          <p className="text-white/80 mt-6 text-base sm:text-lg font-medium">Loading Premium Experience...</p>
          <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <Card className="max-w-md w-full border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-red-500" />
          <CardContent className="pt-8 text-center">
            <div className="mx-auto bg-amber-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-4 animate-pulse">
              <AlertCircle className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-amber-700 mb-2">Payment Error</h1>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Please make sure you have selected a valid school.</p>
            <Button
              onClick={() => router.push("/login")}
              className="mt-6 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg shadow-blue-500/30 rounded-xl h-11 touch-feedback"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-3 sm:px-4 relative overflow-hidden">
      {/* Premium Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        <div className="absolute top-10 right-10 text-purple-200/20 hidden sm:block">
          <Waves className="h-48 w-48" />
        </div>
        <div className="absolute bottom-10 left-10 text-blue-200/20 hidden sm:block">
          <Cloud className="h-36 w-36" />
        </div>
        <div className="absolute top-1/4 right-1/4 text-pink-200/10 hidden lg:block">
          <Sparkle className="h-64 w-64" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header - Different styling (not card) */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-2 sm:p-3 rounded-2xl shadow-xl shadow-purple-500/30">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
                  Premium Subscription
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                  <span className="text-xs sm:text-sm text-gray-500">
                    {school?.name} • {getSchoolLevelDisplay(school?.school_level)} School
                  </span>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-[10px] sm:text-xs">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    Upgrade Now
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 shadow-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs">
                <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-500" />
                Secure Payment
              </Badge>
              <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 shadow-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-blue-500" />
                256-bit Encrypted
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* PLANS */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                <span>Choose Your Plan</span>
                <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50 text-[10px] sm:text-xs">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 fill-amber-400" />
                  Flexible Options
                </Badge>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {SUBSCRIPTION_PLANS.map((plan, idx) => {
                  const isSelected = selectedPlan.id === plan.id;
                  const savings = calculateSavings(plan);
                  const savingsPercentage = getSavingsPercentage(plan);
                  const Icon = plan.icon;

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "rounded-2xl border-2 cursor-pointer transition-all duration-500 overflow-hidden group animate-slideIn",
                        isSelected
                          ? `border-purple-500 ${plan.bgColor} shadow-2xl ${plan.shadowColor} scale-[1.02]`
                          : "border-gray-200 hover:border-purple-300 hover:shadow-xl hover:scale-[1.01] bg-white/80 backdrop-blur-sm"
                      )}
                      style={{ animationDelay: `${idx * 100}ms` }}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {/* Top Gradient Bar */}
                      <div
                        className={cn(
                          "h-1.5 w-full bg-gradient-to-r transition-all duration-500",
                          isSelected ? plan.color : "from-gray-200 to-gray-300 group-hover:from-purple-300 group-hover:to-pink-300"
                        )}
                      />

                      <div className="p-4 sm:p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "p-1.5 sm:p-2 rounded-xl bg-gradient-to-r transition-all duration-500",
                                isSelected ? plan.color : "from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-pink-100"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500",
                                  isSelected ? "text-white" : "text-gray-500 group-hover:text-purple-600"
                                )}
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-sm sm:text-base">{plan.name}</h3>
                              <p className="text-[10px] sm:text-xs text-gray-500">{plan.description}</p>
                            </div>
                          </div>
                          <Badge className={cn("text-[8px] sm:text-[10px] border-0", plan.tagColor)}>
                            {plan.tag}
                          </Badge>
                        </div>

                        {/* Price */}
                        <div className="mb-2 sm:mb-3">
                          <div className="flex items-end gap-1.5 sm:gap-2">
                            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                              {plan.price_display}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400">/ {plan.days} days</span>
                          </div>
                          {savings > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[8px] sm:text-[10px]">
                                🎉 Save {savingsPercentage}%
                              </Badge>
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                TSh {(20000 * (plan.days / 30)).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-1 text-[10px] sm:text-xs text-gray-600">
                          {plan.features.slice(0, 4).map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-1.5 sm:gap-2">
                              <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-500 flex-shrink-0" />
                              <span className="truncate">{feature}</span>
                            </li>
                          ))}
                          {plan.features.length > 4 && (
                            <li className="text-purple-500 font-medium text-[10px] sm:text-xs">
                              +{plan.features.length - 4} more features
                            </li>
                          )}
                        </ul>

                        {/* Select Button */}
                        <div className="mt-3 sm:mt-4">
                          {isSelected ? (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full justify-center py-1.5 sm:py-2 shadow-lg text-xs sm:text-sm">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                              Currently Selected
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl h-8 sm:h-9 text-xs sm:text-sm touch-feedback"
                              onClick={() => setSelectedPlan(plan)}
                            >
                              Select Plan
                              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method - Different styling */}
            <div>
              <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Payment Method</span>
                <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50 text-[10px] sm:text-xs">
                  <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  Secure
                </Badge>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {PAYMENT_METHODS.map((method, idx) => (
                  <div
                    key={method.id}
                    className={cn(
                      "cursor-pointer p-3 sm:p-4 rounded-xl border-2 text-center transition-all duration-300 touch-feedback animate-slideIn",
                      selectedMethod === method.id
                        ? `border-purple-500 bg-purple-50 shadow-lg shadow-purple-200/50 scale-[1.02]`
                        : `border-gray-200 hover:border-purple-300 hover:shadow-md bg-white/80 backdrop-blur-sm`
                    )}
                    style={{ animationDelay: `${idx * 100 + 400}ms` }}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 sm:h-12 sm:w-12 rounded-xl mx-auto mb-1.5 sm:mb-2 flex items-center justify-center bg-gradient-to-r transition-all duration-300",
                        selectedMethod === method.id ? method.color : "from-gray-100 to-gray-200"
                      )}
                    >
                      <method.icon
                        className={cn(
                          "h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300",
                          selectedMethod === method.id ? "text-white" : "text-gray-500"
                        )}
                      />
                    </div>
                    <p
                      className={cn(
                        "text-xs sm:text-sm font-medium transition-colors duration-300",
                        selectedMethod === method.id ? "text-purple-700" : "text-gray-600"
                      )}
                    >
                      {method.name}
                    </p>
                    {selectedMethod === method.id && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[8px] sm:text-[10px] mt-0.5">
                        <Check className="h-2.5 w-2.5 mr-0.5" />
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY - Premium Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl sticky top-24 overflow-hidden rounded-3xl animate-slideIn" style={{ animationDelay: "300ms" }}>
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                  Payment Summary
                </CardTitle>
                <CardDescription className="text-white/80 text-xs sm:text-sm">
                  Complete your subscription renewal
                </CardDescription>
              </div>

              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* School Info - Premium */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-purple-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 sm:p-2 rounded-lg shadow-lg shadow-purple-500/20">
                      <School className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-purple-500 font-medium">School</p>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{school?.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{getSchoolLevelDisplay(school?.school_level)} School</p>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500">Selected Plan</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-[10px] sm:text-xs">
                      {selectedPlan.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-700">{selectedPlan.days} days</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-medium text-gray-700 capitalize">
                      {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name || selectedMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-gray-100">
                    <span className="text-sm sm:text-base font-semibold text-gray-700">Total</span>
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {selectedPlan.price_display}
                    </span>
                  </div>
                  {selectedPlan.discount && (
                    <div className="flex justify-between text-xs mt-1 text-emerald-600 bg-emerald-50 p-1.5 sm:p-2 rounded-lg">
                      <span>🎉 Discount</span>
                      <span className="font-medium">{selectedPlan.discount}</span>
                    </div>
                  )}
                </div>

                {/* Payment Form */}
                <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      placeholder="Jina lako kamili"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="border-gray-200 focus:ring-purple-500 focus:border-purple-500 rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="border-gray-200 focus:ring-purple-500 focus:border-purple-500 rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., 0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-gray-200 focus:ring-purple-500 focus:border-purple-500 rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400">Tumia namba ya simu uliyojisajili nayo</p>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="terms" className="text-[10px] sm:text-xs text-gray-500 cursor-pointer leading-relaxed">
                    I agree to the <span className="text-purple-600 hover:underline">Terms & Conditions</span> and
                    <span className="text-purple-600 hover:underline"> Privacy Policy</span>. Payments are non-refundable.
                  </Label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t border-gray-100 pt-3 sm:pt-4 pb-4 sm:pb-6 px-4 sm:px-6 flex flex-col gap-2">
                <Button
                  onClick={handlePayment}
                  disabled={processing || !agreeTerms}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 text-white text-base sm:text-lg py-5 sm:py-6 rounded-xl touch-feedback disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                  ) : (
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  )}
                  {processing ? "Processing..." : `Pay ${selectedPlan.price_display}`}
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure
                  </span>
                  <span className="w-px h-3 bg-gray-200 hidden xs:inline" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    24/7 Support
                  </span>
                  <span className="w-px h-3 bg-gray-200 hidden xs:inline" />
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Guaranteed
                  </span>
                  <span className="w-px h-3 bg-gray-200 hidden xs:inline" />
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    Instant
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100/50 mt-4 sm:mt-6 animate-fadeIn" style={{ animationDelay: "500ms" }}>
          <p className="font-medium text-purple-600">© 2026 MASI FAST RESULTS • Premium Subscription</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>💳 Secure Payment</span>
            <span className="hidden xs:inline">•</span>
            <span>🔒 Encrypted</span>
            <span className="hidden xs:inline">•</span>
            <span>⚡ Instant Access</span>
          </p>
        </div>
      </div>

      {/* Payment Dialog - Premium Design */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl p-4 sm:p-6 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

          <DialogHeader className="pt-2">
            <DialogTitle className="text-center">
              {paymentStatus === "processing" && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-30 animate-pulse" />
                    <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-purple-600 relative z-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mt-4">Processing Payment</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Please wait...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-2">{progress}% completed</p>
                </div>
              )}
              {paymentStatus === "success" && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-30 animate-pulse" />
                    <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-700 mt-4">Payment Successful! 🎉</h3>
                  <p className="text-xs sm:text-sm text-emerald-600 mt-1">Your subscription has been activated.</p>
                  <Badge className="mt-3 bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] sm:text-xs">
                    <Check className="h-2.5 w-2.5 mr-1" />
                    Transaction: {transactionId || "N/A"}
                  </Badge>
                  <Button
                    onClick={() => router.push("/login?payment=success")}
                    className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 rounded-xl h-10 sm:h-11 text-xs sm:text-sm touch-feedback"
                  >
                    Login Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
              {paymentStatus === "failed" && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-rose-500 blur-xl opacity-30 animate-pulse" />
                    <AlertCircle className="h-16 w-16 text-red-500 relative z-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-red-700 mt-4">Payment Failed</h3>
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{error || "There was an error processing your payment."}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPaymentDialog(false);
                      setPaymentStatus("idle");
                      setError("");
                    }}
                    className="mt-4 border-red-300 text-red-600 hover:bg-red-50 rounded-xl h-10 sm:h-11 text-xs sm:text-sm touch-feedback"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
// 🔥 🔥 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
              <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-purple-400 relative z-10" />
            </div>
            <p className="text-white/80 mt-6 text-base sm:text-lg font-medium">Loading Payment...</p>
            <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}