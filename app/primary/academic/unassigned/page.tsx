// app/primary/academic/unassigned/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Loader2, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap, 
  Layers,
  Sparkles,
  CheckCircle,
  AlertCircle,
  UserPlus,
  School,
  TrendingUp,
  RefreshCw
} from "lucide-react"

interface UnassignedSlot {
  subject_id: number
  subject_name: string
  class_id: number
  class_name: string
  stream_id: number | null
  stream_name: string | null
}

// 🔥 API BASE URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function MasomoYasiyopangiwaPage() {
  const router = useRouter()
  const [slots, setSlots] = useState<UnassignedSlot[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userSchoolId, setUserSchoolId] = useState<number>(4)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const schoolId = localStorage.getItem("school_id")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // 🔥 PRIMARY ROLES
    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"]
    const userRoleLower = (role || "").toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower)

    if (!isAllowed) {
      router.push("/primary/dashboard")
      return
    }
    
    setToken(storedToken)
    
    // 🔥 CHAGUA SCHOOL_ID KUTOKA CURRENT USER
    const finalSchoolId = schoolId ? parseInt(schoolId) : 4
    setUserSchoolId(finalSchoolId)
    
    // 🔥 PATA DATA
    fetchUnassignedSlots(storedToken, finalSchoolId)
  }, [router])

  const fetchUnassignedSlots = async (authToken: string, schoolId: number) => {
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      // 🔥 TUMIA SCHOOL_ID KUTOKA CURRENT USER
      console.log(`🏫 Fetching unassigned slots for school: ${schoolId}`)
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/primary/academic/unassigned-slots?school_id=${schoolId}`,
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kupata masomo yasiyopangiwa")
      }
      
      const data = await response.json()
      
      // 🔥 DATA INAWEZA KUWA ARRAY AU OBJECT
      if (Array.isArray(data)) {
        setSlots(data)
        setTotal(data.length)
        if (data.length === 0) {
          setSuccess("✅ Masomo yote yamepangwa! Hongera! 🎉")
        }
      } else {
        setSlots(data.unassigned || [])
        setTotal(data.total || 0)
        if (data.total === 0) {
          setSuccess("✅ Masomo yote yamepangwa! Hongera! 🎉")
        }
      }
      
      console.log(`📊 Found ${total} unassigned slots`)
    } catch (err: any) {
      console.error("Error fetching unassigned slots:", err)
      setError(err.message || "Imeshindwa kupakia masomo yasiyopangiwa")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchUnassignedSlots(token, userSchoolId)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia masomo yasiyopangiwa...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Masomo Yasiyopangiwa</h1>
              <p className="text-amber-100 max-w-2xl">
                Masomo, madarasa na mikondo ambayo yanahitaji kupangiwa walimu. 
                Pangia walimu ili kuhakikisha kila kitu kimefunzwa.
                <span className="block text-sm mt-1 text-amber-200">
                  🏫 Shule ya Msingi | ID: {userSchoolId}
                </span>
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="text-white hover:bg-white/20 rounded-xl transition-all"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Fresh
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Jumla ya Masomo Yasiyopangiwa</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  {total}
                </p>
                {total === 0 && !loading && (
                  <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Masomo yote yamepangwa! 🎉
                  </p>
                )}
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full">
                <AlertTriangle className="h-10 w-10 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn shadow-md">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn shadow-md">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Unassigned Slots Table */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              Masomo na Madarasa Yasiyopangiwa
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({total} {total === 1 ? 'somo' : 'masomo'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-100 rounded-full">
                    <CheckCircle className="h-12 w-12 text-emerald-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">Masomo yote yamepangwa!</p>
                  <p className="text-sm text-gray-500">Kila somo limepangwa mwalimu. Hongera! 🎉</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Somo</TableHead>
                      <TableHead>Darasa</TableHead>
                      <TableHead>Mkondo</TableHead>
                      <TableHead className="text-right w-32">Kitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slots.map((slot, index) => (
                      <TableRow 
                        key={`${slot.subject_id}-${slot.class_id}-${slot.stream_id}`} 
                        className="hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-amber-50/50 transition-all duration-200 group"
                      >
                        <TableCell className="text-gray-500">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-gray-800">{slot.subject_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-700">{slot.class_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-emerald-500" />
                            <span className="text-gray-700">{slot.stream_name || "Mikondo Yote"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => router.push(
                              `/primary/teachers?assign_subject=${slot.subject_id}&class_id=${slot.class_id}&stream_id=${slot.stream_id || ''}`
                            )}
                            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-xl"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Pangia Mwalimu
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Jinsi ya Kupangia Walimu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold mt-0.5">1</div>
                <span>Bonyeza "Pangia Mwalimu" kwa somo lisilopangiwa</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold mt-0.5">2</div>
                <span>Utaelekezwa kwenye ukurasa wa Walimu</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold mt-0.5">3</div>
                <span>Chagua mwalimu na pangia somo, darasa na mkondo</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                Mara tu kitakapopangiwa, kitatoweka kiotomatiki kwenye orodha hii
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </MainLayout>
  )
}