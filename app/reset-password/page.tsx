"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lock, ArrowLeft, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Key, Shield, Sparkles, Zap, Star } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://fast-results-backend-ewis.onrender.com";

// ============================================================
// 🔥 CONTENT COMPONENT
// ============================================================
function ResetPasswordContent() {
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
      setError("Invalid or missing reset token");
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/auth/validate-reset-token/${token}`);
        const data = await response.json();

        if (data.valid) {
          setIsValidToken(true);
        } else {
          setError(data.message || "Invalid or expired reset token");
        }
      } catch {
        setError("Failed to validate token");
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

    if (count <= 2) setPasswordStrength({ label: "Weak", color: "bg-red-500", width: 20 });
    else if (count === 3) setPasswordStrength({ label: "Fair", color: "bg-orange-500", width: 40 });
    else if (count === 4) setPasswordStrength({ label: "Good", color: "bg-blue-500", width: 70 });
    else setPasswordStrength({ label: "Strong 💪", color: "bg-emerald-500", width: 100 });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password, confirm_password: confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 🔥 LOADING STATE
  // ============================================================
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-600 mx-auto" />
            <p className="text-gray-600 mt-4">Validating reset link...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-red-100 rounded-2xl w-16 h-16 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Reset Link</CardTitle>
            <CardDescription className="text-gray-600">
              {error || "The password reset link is invalid or has expired"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2 justify-center">
            <Button 
              onClick={() => router.push("/login")} 
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ============================================================
  // 🔥 RESET PASSWORD FORM - SOFT BLUE BACKGROUND!
  // ============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 relative overflow-hidden">
      
      {/* 🔥 Decorative Background Elements - Soft */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
        
        {/* 🔥 Floating Icons - Soft */}
        <div className="absolute top-10 left-10 text-blue-200/20 animate-float hidden lg:block">
          <Lock className="h-16 w-16" />
        </div>
        <div className="absolute bottom-10 right-10 text-sky-200/20 animate-float animation-delay-3000 hidden lg:block">
          <Shield className="h-20 w-20" />
        </div>
        <div className="absolute top-1/2 left-5 text-indigo-200/10 animate-float animation-delay-1000 hidden lg:block">
          <Star className="h-12 w-12" />
        </div>
      </div>

      {/* 🔥 Main Card */}
      <Card 
        className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-xl relative z-10 animate-fadeIn rounded-2xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Gradient Bar - Soft */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse-soft">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
            Create New Password
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your new password below. Make sure it's strong and secure.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center animate-fadeIn">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-700 text-lg">✅ Password Reset Successful!</h3>
              <p className="text-sm text-emerald-600 mt-1">
                Your password has been reset successfully.
              </p>
              <p className="text-xs text-emerald-500 mt-2">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 🔥 New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                  <Key className="h-4 w-4 text-sky-600" />
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-11"
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

                {/* 🔥 Password Strength - PRO MAX */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Password Strength</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.label === "Weak" ? "text-red-500" :
                        passwordStrength.label === "Fair" ? "text-orange-500" :
                        passwordStrength.label === "Good" ? "text-blue-500" :
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
                    {/* 🔥 Requirements Checklist */}
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className="flex items-center gap-1.5">
                        {password.length >= 6 ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${password.length >= 6 ? "text-emerald-600" : "text-gray-400"}`}>
                          Min 6 chars
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[A-Z]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${/[A-Z]/.test(password) ? "text-emerald-600" : "text-gray-400"}`}>
                          Uppercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[a-z]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${/[a-z]/.test(password) ? "text-emerald-600" : "text-gray-400"}`}>
                          Lowercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/[0-9]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${/[0-9]/.test(password) ? "text-emerald-600" : "text-gray-400"}`}>
                          Number
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 🔥 Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-sky-600" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Retype your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-11 ${
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

                {/* 🔥 Match Status */}
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">✅ Passwords match!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">❌ Passwords do not match!</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 🔥 Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-sm text-red-700 animate-slideDown">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 🔥 Submit Button - PRO MAX */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl h-11 touch-feedback relative overflow-hidden group"
                disabled={isLoading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resetting...</>
                ) : (
                  <><Lock className="h-4 w-4 mr-2" /> Reset Password</>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        {/* 🔥 Footer */}
        <CardFooter className="flex justify-center border-t border-gray-200/50 pt-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
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
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-600 mx-auto" />
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}