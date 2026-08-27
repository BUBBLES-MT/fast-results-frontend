"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Loader2, Sparkles, Eye, EyeOff, Shield } from "lucide-react"

export default function SuperAdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/v1/auth/login", {
        username,
        password,
      })

      const { access_token, user_type, name, user_id } = response.data

      // 🔥 FIXED: Backend returns "Superadmin" with capital S
      if (user_type !== "Superadmin") {
        setError("This login is for superadmin only. Use regular login for school access.")
        setLoading(false)
        return
      }

      localStorage.setItem("token", access_token)
      localStorage.setItem("user_type", user_type)
      localStorage.setItem("user_name", name)
      
      if (user_id) {
        localStorage.setItem("user_id", user_id.toString())
      }

      router.push("/superadmin")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-sky-400/30 text-4xl animate-float">👑</div>
        <div className="absolute bottom-20 right-10 text-blue-400/30 text-3xl animate-float-delay">⭐</div>
        <div className="absolute top-1/3 right-1/4 text-indigo-400/30 text-2xl animate-float-delay-2">✨</div>
        <div className="absolute bottom-1/3 left-1/4 text-cyan-400/30 text-2xl animate-float">🏆</div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-xl relative z-10 animate-fadeIn rounded-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
            Super Admin Login
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access the superadmin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Username</Label>
              <Input
                type="text"
                placeholder="Enter your superadmin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-10"
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
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Login as Super Admin
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">
              Regular school users?{" "}
              <button 
                onClick={() => router.push("/login")} 
                className="text-sky-600 hover:text-sky-700 hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Animations */}
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
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
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}