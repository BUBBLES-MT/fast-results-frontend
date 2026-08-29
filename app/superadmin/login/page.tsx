// app/superadmin/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Loader2, Sparkles, Eye, EyeOff, Shield, ArrowLeft, Menu, X, Home, LogOut, Settings, HelpCircle, User, Trophy, Star, Zap, Rocket, Gem, Lock, Key, BadgeCheck, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - EXTREME PRO MAX!
// ============================================================

function MobileHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-blue-500/30 animate-pulse-soft">
        {icon || <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
      </div>
      <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
        {title}
      </CardTitle>
      {subtitle && (
        <CardDescription className="text-gray-600 text-sm sm:text-base mt-1">
          {subtitle}
        </CardDescription>
      )}
    </div>
  );
}

function MobileCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-xl relative z-10 animate-fadeIn rounded-2xl",
        className
      )}
    >
      {children}
    </Card>
  );
}

function MobileAlert({
  type,
  message,
}: {
  type: "error" | "info" | "success";
  message: string;
}) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  const icons = {
    error: <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
    info: <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />,
    success: <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />,
  };

  return (
    <div
      className={cn(
        "px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2 border",
        styles[type]
      )}
    >
      {icons[type]}
      <span className="break-words flex-1">{message}</span>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      const { access_token, user_type, name, user_id } = data;

      if (user_type !== "Superadmin") {
        setError("This login is for superadmin only. Use regular login for school access.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", access_token);
      localStorage.setItem("user_type", user_type);
      localStorage.setItem("user_name", name);

      if (user_id) {
        localStorage.setItem("user_id", user_id.toString());
      }

      router.push("/superadmin");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 relative overflow-hidden p-3 sm:p-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 text-sky-400/30 text-2xl sm:text-4xl animate-float">👑</div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 text-blue-400/30 text-xl sm:text-3xl animate-float-delay">⭐</div>
        <div className="absolute top-1/3 right-10 sm:right-1/4 text-indigo-400/30 text-lg sm:text-2xl animate-float-delay-2">✨</div>
        <div className="absolute bottom-1/3 left-10 sm:left-1/4 text-cyan-400/30 text-lg sm:text-2xl animate-float">🏆</div>
        <div className="absolute top-1/4 left-10 sm:left-20 text-purple-400/30 text-sm sm:text-xl animate-float-delay hidden sm:block">🔑</div>
        <div className="absolute bottom-1/4 right-10 sm:right-20 text-pink-400/30 text-sm sm:text-xl animate-float-delay-2 hidden sm:block">⭐</div>
      </div>

      <MobileCard>
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-t-2xl" />

        <CardHeader className="pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
          <MobileHeader
            title="Super Admin Login"
            subtitle="Enter your credentials to access the superadmin dashboard"
            icon={<Crown className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
          />
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Username */}
            <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "100ms" }}>
              <Label className="text-gray-700 font-medium text-sm sm:text-base flex items-center gap-2">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                Username
              </Label>
              <Input
                type="text"
                placeholder="Enter your superadmin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 rounded-xl h-10 sm:h-11 text-sm sm:text-base"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2 animate-slideIn" style={{ animationDelay: "200ms" }}>
              <Label className="text-gray-700 font-medium text-sm sm:text-base flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-10 rounded-xl h-10 sm:h-11 text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-feedback p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="animate-slideIn" style={{ animationDelay: "300ms" }}>
                <MobileAlert type="error" message={error} />
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl h-11 sm:h-12 text-sm sm:text-base touch-feedback animate-slideIn"
              style={{ animationDelay: "400ms" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Login as Super Admin
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 sm:px-4 bg-white/80 backdrop-blur-sm text-gray-400">or</span>
            </div>
          </div>

          {/* Regular Login Link */}
          <div className="text-center animate-slideIn" style={{ animationDelay: "500ms" }}>
            <p className="text-gray-500 text-xs sm:text-sm">
              Regular school users?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-sky-600 hover:text-sky-700 hover:underline font-medium transition-colors touch-feedback"
              >
                Login here
              </button>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
            <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Secure • Encrypted • Superadmin Access Only</span>
          </div>
        </CardContent>

        {/* Bottom Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-b-2xl" />
      </MobileCard>

      {/* Custom Animations */}
      <style jsx global>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 5s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-delay-2 {
          animation: float 7s ease-in-out infinite;
          animation-delay: 4s;
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
      `}</style>
    </div>
  );
}