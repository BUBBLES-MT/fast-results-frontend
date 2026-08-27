"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CreditCard, Calendar, CheckCircle, Loader2 } from "lucide-react"

interface SchoolInfo {
  id: number
  name: string
  subscription_expires_at: string | null
}

const PLANS = [
  { id: "weekly", name: "Weekly", days: 7, price: "5,000", priceTZS: 5000 },
  { id: "biweekly", name: "Bi-Weekly", days: 14, price: "8,000", priceTZS: 8000 },
  { id: "monthly", name: "Monthly", days: 30, price: "15,000", priceTZS: 15000 },
  { id: "2months", name: "2 Months", days: 60, price: "25,000", priceTZS: 25000 },
]

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [school, setSchool] = useState<SchoolInfo | null>(null)
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [step, setStep] = useState<"info" | "payment" | "success">("info")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const schoolId = searchParams.get("school_id")
    
    if (!schoolId) {
      router.push("/login")
      return
    }
    
    fetchSchoolInfo(schoolId)
  }, [router, searchParams])

  const fetchSchoolInfo = async (schoolId: string) => {
    try {
      const response = await axios.get(`/api/v1/schools/${schoolId}`)
      setSchool(response.data)
    } catch (err) {
      console.error("Error fetching school info:", err)
      setError("Failed to load school information")
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      const plan = PLANS.find(p => p.id === selectedPlan)
      
      // Simulate payment processing
      // In production, integrate with ClickPesa, M-Pesa, etc.
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // After successful payment, extend subscription
      await axios.post(
        `/api/v1/schools/${school?.id}/extend-subscription`,
        { days: plan?.days, plan: selectedPlan },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      
      setStep("success")
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
      
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.response?.data?.detail || "Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanDetails = PLANS.find(p => p.id === selectedPlan)

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">School Subscription</h1>
          <p className="text-gray-600 mt-2">Renew your subscription to continue using the system</p>
        </div>

        {step === "info" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-800">Subscription Expired</CardTitle>
                  <CardDescription className="text-red-600">
                    Your subscription expired on {school.subscription_expires_at 
                      ? new Date(school.subscription_expires_at).toLocaleDateString() 
                      : "unknown date"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{school.name}</h2>
                <p className="text-gray-600">Choose a plan to renew your subscription and regain access to the system.</p>
              </div>

              <form onSubmit={handlePayment}>
                <div className="mb-6">
                  <Label className="text-lg font-semibold mb-4 block">Select Plan</Label>
                  <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-lg">{plan.name}</div>
                            <div className="text-sm text-gray-500">{plan.days} days access</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-blue-600">TSh {plan.price}</div>
                            <div className="text-xs text-gray-400">≈ ${Math.round(plan.priceTZS / 2500)} USD</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mb-6">
                  <Label htmlFor="phone" className="text-lg font-semibold mb-2 block">
                    M-Pesa / Tigo Pesa / Airtel Money Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., 0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    We'll send a payment request to this number
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Selected Plan:</span>
                    <span className="font-semibold">{selectedPlanDetails?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Access Period:</span>
                    <span className="font-semibold">{selectedPlanDetails?.days} days</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">TSh {selectedPlanDetails?.price}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay TSh {selectedPlanDetails?.price}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card className="border-0 shadow-xl text-center">
            <CardContent className="p-12">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl mb-2">Payment Successful!</CardTitle>
              <CardDescription className="text-lg mb-6">
                Your subscription has been renewed successfully.
              </CardDescription>
              <p className="text-gray-600 mb-8">
                You will be redirected to the login page in a few seconds...
              </p>
              <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}