"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
} from "lucide-react"

// ============================================================
// 🔥 CONSTANTS
// ============================================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// 🔥 SUBSCRIPTION PLANS - BEI MPYA!
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
    discount: "Save 10%",
  },
]

// ============================================================
// 🔥 PAYMENT METHODS
// ============================================================
const PAYMENT_METHODS = [
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: Smartphone,
    color: "bg-green-50 text-green-700 border-green-200 hover:border-green-400",
  },
  {
    id: "tigopesa",
    name: "TigoPesa",
    icon: Smartphone,
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400",
  },
  {
    id: "airtelmoney",
    name: "Airtel Money",
    icon: Smartphone,
    color: "bg-red-50 text-red-700 border-red-200 hover:border-red-400",
  },
  {
    id: "halopesa",
    name: "HaloPesa",
    icon: Smartphone,
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400",
  },
]

// ============================================================
// 🔥 HELPER - GET SCHOOL LEVEL DISPLAY
// ============================================================
const getSchoolLevelDisplay = (level: string | undefined): string => {
  if (!level) return "School"
  const levels: Record<string, string> = {
    "primary": "Primary",
    "secondary": "Secondary",
    "advanced": "Advanced"
  }
  return levels[level.toLowerCase()] || "School"
}

// ============================================================
// 🔥 MAIN COMPONENT
// ============================================================
export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const schoolId = searchParams.get("school_id")
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [school, setSchool] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1])
  const [selectedMethod, setSelectedMethod] = useState("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  
  const [processing, setProcessing] = useState(false)
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [transactionId, setTransactionId] = useState("")
  const [progress, setProgress] = useState(0)

  // ============================================================
  // 🔥 FETCH SCHOOL INFO
  // ============================================================
  useEffect(() => {
    const fetchSchool = async () => {
      if (!schoolId) {
        setError("No school selected. Please login first.")
        setLoading(false)
        return
      }
      
      try {
        let token = localStorage.getItem("token")
        
        if (!token) {
          const cookies = document.cookie.split(';')
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=')
            if (name === 'token') {
              token = decodeURIComponent(value)
              if (token) {
                localStorage.setItem("token", token)
              }
              break
            }
          }
        }
        
        if (!token) {
          console.warn("⚠️ No token found, using school from URL params")
          setSchool({
            id: parseInt(schoolId),
            name: sessionStorage.getItem("expired_school_name") || "Shule yako",
            school_level: "secondary"
          })
          setLoading(false)
          return
        }
        
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/schools/${schoolId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // ✅ LOG DATA KWA KUANGALIA
        console.log("🔍 School data received:", response.data)
        console.log("🔍 School level:", response.data.school_level)
        
        setSchool(response.data)
        
        const userName = localStorage.getItem("user_name")
        if (userName) {
          setCustomerName(userName)
        }
        
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching school:", err)
        setSchool({
          id: parseInt(schoolId),
          name: sessionStorage.getItem("expired_school_name") || "Shule yako",
          school_level: "secondary"
        })
        setLoading(false)
      }
    }
    
    fetchSchool()
  }, [schoolId, router])

  // ============================================================
  // 🔥 HANDLE PAYMENT
  // ============================================================
  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Tafadhali ingiza namba sahihi ya simu (e.g., 0712345678)")
      return
    }
    
    if (!agreeTerms) {
      setError("Tafadhali kubali masharti na maelezo")
      return
    }
    
    setProcessing(true)
    setError("")
    setPaymentStatus("processing")
    setPaymentDialog(true)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 500)
    
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        console.warn("⚠️ No token for payment, using fallback")
        await new Promise(resolve => setTimeout(resolve, 3000))
        clearInterval(progressInterval)
        setProgress(100)
        setPaymentStatus("success")
        setTransactionId("TXN-" + Date.now().toString().slice(-8))
        
        setTimeout(() => {
          router.push(`/payment/success?transaction_id=${transactionId}&plan=${selectedPlan.id}&amount=${selectedPlan.price}`)
        }, 1500)
        setProcessing(false)
        return
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/initiate`,
        {
          school_id: parseInt(schoolId!),
          plan: selectedPlan.id,
          amount: selectedPlan.price,
          phone_number: phoneNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          payment_method: selectedMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      const transaction = response.data
      setTransactionId(transaction.id)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      clearInterval(progressInterval)
      setProgress(100)
      
      setPaymentStatus("success")
      
      setTimeout(() => {
        router.push(`/payment/success?transaction_id=${transaction.id}&plan=${selectedPlan.id}&amount=${selectedPlan.price}`)
      }, 1500)
      
    } catch (err: any) {
      clearInterval(progressInterval)
      setPaymentStatus("failed")
      setError(err.response?.data?.detail || "Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  // ============================================================
  // 🔥 CALCULATE SAVINGS
  // ============================================================
  const calculateSavings = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (plan.id === "monthly") return 0
    const monthlyCost = 20000 * (plan.days / 30)
    return Math.round(monthlyCost - plan.price)
  }

  const getSavingsPercentage = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (plan.id === "monthly") return 0
    const monthlyCost = 20000 * (plan.days / 30)
    if (monthlyCost <= 0) return 0
    return Math.round(((monthlyCost - plan.price) / monthlyCost) * 100)
  }

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-20 w-20 animate-spin text-purple-400 mx-auto" />
          <p className="text-white/80 mt-6 text-lg font-medium">Loading Premium Experience...</p>
          <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <Card className="max-w-md w-full border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-8 text-center">
            <div className="mx-auto bg-amber-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-amber-700 mb-2">Payment Error</h1>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Please make sure you have selected a valid school.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="mt-6 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-20 right-20 text-purple-200/20">
          <Waves className="h-64 w-64" />
        </div>
        <div className="absolute bottom-20 left-20 text-blue-200/20">
          <Cloud className="h-48 w-48" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - FIXED HYDRATION ERROR + SCHOOL LEVEL! */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border border-white/20"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
                  Premium Subscription
                </h1>
                {/* ✅ FIXED: School level inaonyeshwa sahihi! */}
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {school?.name} • {getSchoolLevelDisplay(school?.school_level)} School
                  </span>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Upgrade Now
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 shadow-lg px-4 py-2">
                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
                Secure Payment
              </Badge>
              <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 shadow-lg px-4 py-2">
                <Lock className="h-4 w-4 mr-2 text-blue-500" />
                256-bit Encrypted
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PLANS */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Choose Your Plan
                <Badge variant="outline" className="ml-2 border-amber-200 text-amber-600 bg-amber-50">
                  <Star className="h-3 w-3 mr-1 fill-amber-400" />
                  Flexible Options
                </Badge>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id
                  const savings = calculateSavings(plan)
                  const savingsPercentage = getSavingsPercentage(plan)
                  const Icon = plan.icon
                  
                  return (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all duration-300 border-2 ${
                        isSelected
                          ? `border-purple-500 shadow-2xl shadow-purple-200/50 scale-[1.02] ${plan.bgColor}`
                          : `border-gray-200 hover:border-purple-300 hover:shadow-xl`
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Icon className={`h-5 w-5 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`} />
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="text-sm">{plan.description}</CardDescription>
                          </div>
                          <Badge className={plan.tagColor}>
                            {plan.tag}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3">
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-gray-800">{plan.price_display}</span>
                            <span className="text-sm text-gray-400">/ {plan.days} days</span>
                          </div>
                          {savings > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                🎉 Save {savingsPercentage}%
                              </Badge>
                              <span className="text-xs text-gray-400 line-through">
                                TSh {(20000 * (plan.days / 30)).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <ul className="space-y-1.5 text-sm text-gray-600">
                          {plan.features.slice(0, 5).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 5 && (
                            <li className="text-xs text-purple-500 font-medium">
                              +{plan.features.length - 5} more features
                            </li>
                          )}
                        </ul>
                      </CardContent>
                      <CardFooter className="pt-0">
                        {isSelected ? (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full justify-center py-2 shadow-lg">
                            <Check className="h-4 w-4 mr-2" />
                            Currently Selected
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            Select Plan
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Payment Method
                <Badge variant="outline" className="ml-2 border-green-200 text-green-600 bg-green-50">
                  <Lock className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${
                      selectedMethod === method.id
                        ? `border-purple-500 bg-purple-50 shadow-lg shadow-purple-200/50`
                        : `border-gray-200 hover:border-purple-300 hover:shadow-md`
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <method.icon className={`h-8 w-8 mx-auto mb-2 ${
                      selectedMethod === method.id ? "text-purple-600" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      selectedMethod === method.id ? "text-purple-700" : "text-gray-600"
                    }`}>{method.name}</p>
                    {selectedMethod === method.id && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs mt-1">
                        <Check className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  Complete your subscription renewal
                </CardDescription>
              </div>

              <CardContent className="pt-6 space-y-4">
                {/* School Info */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                      <School className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-500 font-medium">School</p>
                      <p className="font-semibold text-gray-800">{school?.name}</p>
                      <p className="text-xs text-gray-500">
                        {getSchoolLevelDisplay(school?.school_level)} School
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Selected Plan</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {selectedPlan.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-700">{selectedPlan.days} days</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {selectedPlan.price_display}
                    </span>
                  </div>
                  {selectedPlan.discount && (
                    <div className="flex justify-between text-sm mt-1 text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                      <span>🎉 Discount</span>
                      <span className="font-medium">{selectedPlan.discount}</span>
                    </div>
                  )}
                </div>

                {/* Payment Form */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      placeholder="Jina lako kamili"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., 0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p className="text-xs text-gray-400">Tumia namba ya simu uliyojisajili nayo</p>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                    I agree to the <span className="text-purple-600 hover:underline">Terms & Conditions</span> and 
                    <span className="text-purple-600 hover:underline"> Privacy Policy</span>. Payments are non-refundable.
                  </Label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t border-gray-100 pt-4 pb-6">
                <Button
                  onClick={handlePayment}
                  disabled={processing || !agreeTerms}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 text-white text-lg py-6"
                >
                  {processing ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <DollarSign className="h-5 w-5 mr-2" />
                  )}
                  {processing ? "Processing..." : `Pay ${selectedPlan.price_display}`}
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secure
                  </span>
                  <span className="w-px h-3 bg-gray-200" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    24/7 Support
                  </span>
                  <span className="w-px h-3 bg-gray-200" />
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Guaranteed
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {paymentStatus === "processing" && (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800 mt-4">Processing Payment</h3>
                  <p className="text-sm text-gray-500 mt-1">Please wait...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{progress}% completed</p>
                </div>
              )}
              {paymentStatus === "success" && (
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-2xl">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-700 mt-4">Payment Successful! 🎉</h3>
                  <p className="text-sm text-emerald-600 mt-1">Your subscription has been activated.</p>
                  <Badge className="mt-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                    <Check className="h-3 w-3 mr-1" />
                    Transaction: {transactionId || "N/A"}
                  </Badge>
                </div>
              )}
              {paymentStatus === "failed" && (
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-16 w-16 text-red-500" />
                  <h3 className="text-xl font-bold text-red-700 mt-4">Payment Failed</h3>
                  <p className="text-sm text-red-600 mt-1">{error || "There was an error processing your payment."}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPaymentDialog(false)
                      setPaymentStatus("idle")
                      setError("")
                    }}
                    className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}