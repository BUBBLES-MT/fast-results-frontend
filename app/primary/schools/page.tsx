// app/primary/schools/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Loader2, 
  School, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  RefreshCw
} from "lucide-react"

interface School {
  id: number
  name: string
  school_type: string
  school_level?: string
  address: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  status: string
  created_at: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function UsimamiziWaShulePage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userSchoolLevel, setUserSchoolLevel] = useState<string>("primary")
  const [userSchoolId, setUserSchoolId] = useState<number>(4)
  
  // Form state
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    school_type: "primary",
    address: "",
    phone: "",
    email: "",
    admin_email: "",
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const schoolLevel = localStorage.getItem("school_level") || "primary"
    const schoolId = localStorage.getItem("school_id") || "4"
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // 🔥 PRIMARY ROLES
    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"]
    const role = localStorage.getItem("user_type") || ""
    const userRoleLower = role.toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower)

    if (!isAllowed) {
      router.push("/primary/dashboard")
      return
    }
    
    setToken(storedToken)
    setUserSchoolLevel(schoolLevel)
    setUserSchoolId(parseInt(schoolId))
    fetchSchools(storedToken, schoolLevel)
  }, [router])

  // 🔥 FETCH SCHOOLS - PRIMARY TU
  const fetchSchools = async (authToken: string, schoolLevel?: string) => {
    setLoading(true)
    setError("")
    try {
      const level = schoolLevel || userSchoolLevel || "primary"
      
      // 🔥 TUMIA PARAMETER YA KUCHUJA
      const response = await axios.get(`${API_BASE_URL}/api/v1/schools?school_level=${level}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      
      // 🔥 AU CHUJA UPANDE WA FRONTEND
      const allSchools = response.data
      const filtered = allSchools.filter(
        (school: School) => school.school_type === level || school.school_level === level
      )
      
      setSchools(filtered)
      console.log(`🏫 Found ${filtered.length} ${level} schools`)
      setError("")
    } catch (err) {
      console.error("Error fetching schools:", err)
      setError("Imeshindwa kupakia shule za msingi")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      // 🔥 HAKIKISHA SHULE INAUNDWA KAMA PRIMARY
      const payload = {
        ...formData,
        school_type: "primary", // 🔥 Lazima iwe primary!
        school_level: "primary",
      }
      
      await axios.post(`${API_BASE_URL}/api/v1/schools`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setOpen(false)
      setFormData({
        name: "",
        school_type: "primary",
        address: "",
        phone: "",
        email: "",
        admin_email: "",
      })
      setSuccess("Shule ya msingi imeongezwa kikamilifu! ✅")
      setTimeout(() => setSuccess(""), 3000)
      fetchSchools(token, "primary")
    } catch (err: any) {
      console.error("Error creating school:", err)
      setError(err.response?.data?.detail || "Imeshindwa kuongeza shule")
    }
  }

  const handleDeleteSchool = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kufuta shule hii?")) return
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/schools/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSuccess("Shule imefutwa kikamilifu! ✅")
      setTimeout(() => setSuccess(""), 3000)
      fetchSchools(token, "primary")
    } catch (err) {
      console.error("Error deleting school:", err)
      setError("Imeshindwa kufuta shule")
    }
  }

  const getSchoolTypeLabel = (type: string) => {
    switch (type) {
      case "primary": return "🏫 Msingi"
      case "secondary": return "📚 Sekondari"
      case "advanced": return "🎓 Kiwango cha Juu"
      default: return type
    }
  }

  const getSchoolTypeColor = (type: string) => {
    switch (type) {
      case "primary": return "bg-sky-100 text-sky-800"
      case "secondary": return "bg-blue-100 text-blue-800"
      case "advanced": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia shule za msingi...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <School className="h-6 w-6" />
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Building className="h-6 w-6" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Usimamizi wa Shule za Msingi</h1>
              <p className="text-sky-100 max-w-2xl">
                Simamia shule zote za msingi zilizosajiliwa kwenye mfumo.
                <span className="block text-sm mt-1 text-sky-200">
                  🏫 Shule ya Msingi pekee | ID: {userSchoolId}
                </span>
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => fetchSchools(token, "primary")}
              className="text-white hover:bg-white/20 rounded-xl transition-all"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Fresh
            </Button>
          </div>
        </div>

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

        {/* Schools List Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-sky-600" />
              Orodha ya Shule za Msingi
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({schools.length} {schools.length === 1 ? 'shule' : 'shule'})
              </span>
            </CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-full">
                  <Plus className="h-4 w-4" />
                  Ongeza Shule ya Msingi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    Ongeza Shule Mpya ya Msingi
                  </DialogTitle>
                  <DialogDescription>
                    Jaza taarifa zote ili kuongeza shule mpya ya msingi kwenye mfumo.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSchool}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right font-semibold text-gray-700">
                        Jina la Shule *
                      </Label>
                      <Input
                        id="name"
                        className="col-span-3 bg-white rounded-xl focus:ring-2 focus:ring-sky-500"
                        placeholder="Weka jina la shule ya msingi"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right font-semibold text-gray-700">
                        <MapPin className="h-4 w-4 inline mr-1 text-gray-500" />
                        Anuani
                      </Label>
                      <Input
                        id="address"
                        className="col-span-3 bg-white rounded-xl"
                        placeholder="Weka anuani ya shule"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right font-semibold text-gray-700">
                        <Phone className="h-4 w-4 inline mr-1 text-gray-500" />
                        Simu
                      </Label>
                      <Input
                        id="phone"
                        className="col-span-3 bg-white rounded-xl"
                        placeholder="Mfano: 0712345678"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right font-semibold text-gray-700">
                        <Mail className="h-4 w-4 inline mr-1 text-gray-500" />
                        Barua Pepe
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="col-span-3 bg-white rounded-xl"
                        placeholder="Weka barua pepe ya shule"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="admin_email" className="text-right font-semibold text-gray-700">
                        <GraduationCap className="h-4 w-4 inline mr-1 text-gray-500" />
                        Barua Pepe ya Msimamizi
                      </Label>
                      <Input
                        id="admin_email"
                        type="email"
                        className="col-span-3 bg-white rounded-xl"
                        placeholder="Weka barua pepe ya msimamizi wa shule"
                        value={formData.admin_email}
                        onChange={(e) =>
                          setFormData({ ...formData, admin_email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right font-semibold text-gray-700">
                        Aina ya Shule
                      </Label>
                      <div className="col-span-3">
                        <span className="inline-flex items-center px-3 py-2 rounded-xl bg-sky-100 text-sky-800 font-medium">
                          🏫 Shule ya Msingi
                        </span>
                        <p className="text-xs text-gray-400 mt-1">Shule za msingi pekee zinaweza kuongezwa</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                      Ghairi
                    </Button>
                    <Button type="submit" className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700">
                      Hifadhi Shule
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12 font-bold">#</TableHead>
                    <TableHead className="font-bold">Jina la Shule</TableHead>
                    <TableHead className="font-bold">Aina</TableHead>
                    <TableHead className="font-bold">Simu</TableHead>
                    <TableHead className="font-bold">Barua Pepe</TableHead>
                    <TableHead className="font-bold">Hali</TableHead>
                    <TableHead className="text-right font-bold">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <School className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Hakuna shule za msingi zilizopatikana</p>
                          <p className="text-sm text-gray-400">Bonyeza "Ongeza Shule ya Msingi" kuanza.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    schools.map((school, idx) => (
                      <TableRow key={school.id} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group">
                        <TableCell className="text-gray-500">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                              {school.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{school.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSchoolTypeColor(school.school_type)}`}>
                            {getSchoolTypeLabel(school.school_type)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600">{school.phone || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600">{school.email || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              school.is_active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {school.is_active ? "Inafanya Kazi" : "Haifanyi Kazi"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSchool(school.id)}
                            className="gap-1 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Futa</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-600" />
              Kuhusu Shule za Msingi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold mt-0.5">1</div>
                <span>Darasa la 1 hadi 7</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold mt-0.5">2</div>
                <span>Mtaala wa Msingi (Primary Curriculum)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold mt-0.5">3</div>
                <span>Alama 0-50</span>
              </div>
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
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </MainLayout>
  )
}