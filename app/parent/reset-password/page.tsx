"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lock, ArrowLeft, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Key, Shield, Users, School } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://fast-results-backend-ewis.onrender.com";

// ============================================================
// 🔥 CONTENT COMPONENT - KISWAHILI!
// ============================================================
function ParentResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({ label: "", color: "", width: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 🔥 Validate token on load
  useEffect(() => {
    if (!token) {
      setError("Kiungo batili au hakipo");
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/parents/validate-reset-token/${token}`);
        const data = await response.json();

        if (data.valid) {
          setIsValidToken(true);
        } else {
          setError(data.message || "Kiungo batili au kimeisha muda wake");
        }
      } catch {
        setError("Imeshindwa kuthibitisha kiungo");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // 🔥 Check password strength
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength({ label: "", color: "", width: 0 });
      return;
    }

    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const met = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
    const count = met.filter(Boolean).length;

    if (count <= 2) setPasswordStrength({ label: "Dhaifu", color: "bg-red-500", width: 20 });
    else if (count === 3) setPasswordStrength({ label: "Wastani", color: "bg-orange-500", width: 40 });
    else if (count === 4) setPasswordStrength({ label: "Nzuri", color: "bg-blue-500", width: 70 });
    else setPasswordStrength({ label: "Imara 💪", color: "bg-emerald-500", width: 100 });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Manenosiri hayafanani");
      return;
    }

    if (password.length < 6) {
      setError("Nenosiri lazima iwe na herufi 6 au zaidi");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/parents/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password, confirm_password: confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Imeshindwa kuweka upya nenosiri");
      }

      setSuccess(true);
      setTimeout(() => router.push("/parent/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuweka upya nenosiri");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 🔥 LOADING STATE
  // ============================================================
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto" />
            <p className="text-gray-600 mt-4">Inathibitisha kiungo...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================
  // 🔥 INVALID TOKEN
  // ============================================================
  if (!isValidToken && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-red-100 rounded-2xl w-16 h-16 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Kiungo Batili</CardTitle>
            <CardDescription className="text-gray-600">
              {error || "Kiungo cha kuweka upya nenosiri ni batili au kimeisha muda wake"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2 justify-center">
            <Link href="/parent/login" className="w-full">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                Rudi kwenye Kuingia
              </Button>
            </Link>
            <Link href="/parent/forgot-password" className="w-full">
              <Button variant="outline" className="w-full">
                Omba Kiungo Kipya
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ============================================================
  // 🔥 RESET PASSWORD FORM - KISWAHILI!
  // ============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 relative overflow-hidden">
      
      {/* 🔥 Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
        
        {/* 🔥 Floating Icons */}
        <div className="absolute top-10 left-10 text-emerald-200/20 animate-float hidden lg:block">
          <Users className="h-16 w-16" />
        </div>
        <div className="absolute bottom-10 right-10 text-teal-200/20 animate-float animation-delay-3000 hidden lg:block">
          <School className="h-20 w-20" />
        </div>
      </div>

      {/* 🔥 Main Card */}
      <Card 
        className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-xl relative z-10 animate-fadeIn rounded-2xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse-soft">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
            Weka Upya Nenosiri
          </CardTitle>
          <CardDescription className="text-gray-500">
            Ingiza nenosiri lako jipya hapa chini. Hakikisha ni imara na salama.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center animate-fadeIn">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-700 text-lg">✅ Nenosiri Limewekwa Upya!</h3>
              <p className="text-sm text-emerald-600 mt-1">
                Nenosiri lako limebadilishwa kikamilifu.
              </p>
              <p className="text-xs text-emerald-500 mt-2">
                Unaelekezwa kwenye ukurasa wa kuingia...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 🔥 New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                  <Key className="h-4 w-4 text-emerald-600" />
                  Nenosiri Jipya
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Angalau herufi 6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* 🔥 Password Strength - KISWAHILI */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Nguvu ya Nenosiri</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.label === "Dhaifu" ? "text-red-500" :
                        passwordStrength.label === "Wastani" ? "text-orange-500" :
                        passwordStrength.label === "Nzuri" ? "text-blue-500" :
                        "text-emerald-500"
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.width}%` }}
                      />
                    </div>
                    {/* 🔥 Requirements Checklist - KISWAHILI */}
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className="flex items-center gap-1.5">
                        {password.length >= 6 ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${password.length >= 6 ? "text-emerald-600" : "text-gray-400"}`}>
                          Herufi 6+
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[A-Z]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${/[A-Z]/.test(password) ? "text-emerald-600" : "text-gray-400"}`}>
                          Herufi Kubwa
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[a-z]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${/[a-z]/.test(password) ? "text-emerald-600" : "text-gray-400"}`}>
                          Herufi Ndogo
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[0-9]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${/[0-9]/.test(password) ? "text-emerald-600" : "text-gray-400"}`}>
                          Nambari
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 🔥 Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Thibitisha Nenosiri
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Andika tena nenosiri lako"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 h-11 ${
                      confirmPassword.length > 0 && password === confirmPassword ? "border-emerald-500 ring-2 ring-emerald-200" : ""
                    } ${
                      confirmPassword.length > 0 && password !== confirmPassword ? "border-red-500 ring-2 ring-red-200" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* 🔥 Match Status - KISWAHILI */}
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">✅ Manenosiri yanafanana!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">❌ Manenosiri hayafanani!</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 🔥 Error - KISWAHILI */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-sm text-red-700 animate-slideDown">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 🔥 Submit Button - KISWAHILI */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl h-11 touch-feedback relative overflow-hidden group"
                disabled={isLoading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Inasubiri...</>
                ) : (
                  <><Lock className="h-4 w-4 mr-2" /> Weka Upya Nenosiri</>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        {/* 🔥 Footer - KISWAHILI */}
        <CardFooter className="flex justify-center border-t border-gray-200/50 pt-4">
          <Link href="/parent/login" className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Rudi kwenye Kuingia
          </Link>
        </CardFooter>
      </Card>

      {/* 🔥 Global Styles */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .touch-feedback { @apply active:scale-95 transition-transform duration-150; }
      `}</style>
    </div>
  );
}

// ============================================================
// 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY!
// ============================================================
export default function ParentResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto" />
            <p className="text-gray-600 mt-4">Inapakia...</p>
          </div>
        </div>
      }
    >
      <ParentResetPasswordContent />
    </Suspense>
  );
}