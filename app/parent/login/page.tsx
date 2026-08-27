"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Users,
  GraduationCap,
  Shield,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  School,
  Star,
  Award,
  TrendingUp,
  Clock,
  UserCheck,
  Lock,
  Globe,
  Heart,
  User,
  Key,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ParentLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Forgot Password Dialog
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  // Check if already logged in as parent
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");
    if (token && userType === "parent") {
      router.push("/parent/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parents/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if subscription expired (402)
        if (response.status === 402) {
          const detail = data.detail;
          throw new Error(
            detail?.message || 
            "⚠️ Muda wa usajili wa shule umeisha. Tafadhali wasiliana na menejimenti ya shule."
          );
        }
        throw new Error(data.detail || "Jina la mtumiaji au nenosiri si sahihi");
      }

      // Save auth data
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_type", "parent");
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("parent_id", data.parent_id.toString());
      localStorage.setItem("school_id", data.school_id.toString());

      setSuccess("✅ Kuingia kumefanikiwa! Unaelekezwa kwenye dashibodi...");
      setTimeout(() => {
        router.push("/parent/dashboard");
      }, 1200);

    } catch (err: any) {
      setError(err.message || "Kuingia kumeshindwa. Tafadhali jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotError("Tafadhali ingiza barua pepe yako iliyosajiliwa");
      return;
    }

    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/parents/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Imeshindwa kutuma kiungo cha kuweka upya nenosiri");
      }

      setForgotSuccess("✅ Kiungo cha kuweka upya nenosiri kimetumwa kwa barua pepe yako!");
      setTimeout(() => {
        setForgotOpen(false);
        setForgotEmail("");
        setForgotSuccess("");
      }, 3000);
    } catch (err: any) {
      setForgotError(err.message || "Imeshindwa kutuma kiungo. Tafadhali jaribu tena.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 p-6 relative overflow-hidden">
      {/* 🔥 Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Floating icons */}
        <div className="absolute top-10 left-10 text-sky-200/20 animate-float">
          <GraduationCap className="h-16 w-16" />
        </div>
        <div className="absolute bottom-10 right-10 text-blue-200/20 animate-float animation-delay-3000">
          <School className="h-20 w-20" />
        </div>
        <div className="absolute top-1/3 right-20 text-indigo-200/20 animate-float animation-delay-1500">
          <Star className="h-12 w-12" />
        </div>
        <div className="absolute bottom-1/3 left-20 text-sky-200/20 animate-float animation-delay-2500">
          <Heart className="h-14 w-14" />
        </div>
      </div>

      {/* 🔥 Main Card */}
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-xl relative z-10 animate-fadeIn rounded-2xl overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
        
        <CardHeader className="text-center pt-8">
          <div className="mx-auto bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 p-3 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 animate-pulse-soft">
            <Users className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Lango la Mzazi
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            <span className="font-medium text-sky-600">📊 Angalia maendeleo ya mtoto wako</span>
            <br />
            <span className="text-sm text-gray-500">Haraka, salama, na daima sasisho</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* 🔥 Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg shadow-sm animate-slideIn">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">Kuingia Kumeshindwa</p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 🔥 Success Message */}
            {success && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-4 rounded-lg shadow-sm animate-slideIn">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-500" />
                  <div>
                    <p className="font-medium text-sm">Imefanikiwa!</p>
                    <p className="text-sm text-emerald-600 mt-0.5">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 🔥 Username Field */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-sky-600" />
                Jina la Mtumiaji
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ingiza jina lako la mtumiaji"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pl-10 h-12 rounded-xl transition-all duration-200"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* 🔥 Password Field */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <Key className="h-4 w-4 text-sky-600" />
                Nenosiri
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingiza nenosiri lako"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/80 border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pl-10 pr-12 h-12 rounded-xl transition-all duration-200"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Key className="h-4 w-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 🔥 Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-gray-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 data-[state=checked]:text-white h-5 w-5 rounded-lg"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                  Nikumbuke
                </Label>
              </div>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium hover:underline transition-all"
              >
                Nimepassword?
              </button>
            </div>

            {/* 🔥 Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Inaingiza...
                </>
              ) : (
                <>
                  Ingia kwenye Dashibodi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        {/* 🔥 Footer */}
        <CardFooter className="flex flex-col gap-3 border-t border-gray-200/60 pt-5 pb-6 px-6 bg-gray-50/30">
          <p className="text-sm text-gray-600">
            Hujasajiliwa?{" "}
            <Link
              href="/parent/register"
              className="text-sky-600 hover:text-sky-700 font-semibold hover:underline transition-all"
            >
              Jisajili Sasa
            </Link>
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Rudi Nyumbani
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Sera ya Faragha
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">
              Sheria na Masharti
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <Shield className="h-3 w-3 text-emerald-500" />
            <span>Salama • Imesimbwa • Inalindwa</span>
          </div>
        </CardFooter>
      </Card>

      {/* 🔥 Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0">
          <DialogHeader>
            <div className="mx-auto bg-gradient-to-r from-sky-500 to-blue-500 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              Weka Upya Nenosiri
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Ingiza barua pepe yako iliyosajiliwa na tutakutumia kiungo cha kuweka upya nenosiri.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Barua Pepe</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Ingiza barua pepe yako iliyosajiliwa"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 h-11 rounded-xl"
                />
              </div>
            </div>
            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{forgotError}</span>
              </div>
            )}
            {forgotSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{forgotSuccess}</span>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setForgotOpen(false)}
              className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Ghairi
            </Button>
            <Button
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
            >
              {forgotLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Tuma Kiungo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔥 Global Styles */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.4s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2500 { animation-delay: 2.5s; }
      `}</style>
    </div>
  );
}