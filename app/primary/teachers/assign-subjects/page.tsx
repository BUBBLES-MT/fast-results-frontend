"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
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
import { MainLayout } from "@/components/layout/MainLayout"
import { 
  Plus, 
  Search, 
  Trash2, 
  BookOpen, 
  Users, 
  Loader2,
  GraduationCap,
  Mail,
  Phone,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Eye,
  Briefcase,
  Shield
} from "lucide-react"

interface Teacher {
  id: number
  name: string
  username: string
  email: string
  phone1: string | null
  phone2: string | null
  role: string
  school_id: number
  active: boolean
}

const MAJUKUMU_YA_WALIMU = [
  "Mwalimu",
  "Mwalimu Mkuu",
  "Mwalimu Mkuu Msaidizi",
  "Mtaaluma",
  "Mhasibu"
]

// 🔥 TUNAWEKA SUPERADMIN KWA MAJUKUMU YA KINGEREZA KWA BACKEND
const MAJUKUMU_YOTE = [
  "Superadmin",
  "Mwalimu",
  "Mwalimu Mkuu",
  "Mwalimu Mkuu Msaidizi",
  "Mtaaluma",
  "Mhasibu"
]

export default function UsimamiziWaWalimuPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [adding, setAdding] = useState(false)
  
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone1: "",
    phone2: "",
    role: "Mwalimu",
    school_id: 1,
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // 🔥 TUNAWEKA SUPERADMIN KWA ALLOWED ROLES
    const allowedRoles = ["Superadmin", "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"]
    const userRoleLower = (role || "").toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower)

    // 🔥 KAMA SUPERADMIN, RUDISHA KWA SUPERADMIN DASHBOARD
    if (userRoleLower === "superadmin") {
      // Superadmin inaruhusiwa kuona ukurasa huu
    } else if (!isAllowed) {
      router.push("/primary/dashboard")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    fetchTeachers(storedToken)
  }, [router])

  // 🔥 BADILISHA: TUMIA API YA PRIMARY
  const fetchTeachers = async (authToken: string) => {
    try {
      // ✅ TUMIA API YA PRIMARY
      const response = await axios.get("/api/v1/primary/teachers", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setTeachers(response.data)
    } catch (err) {
      console.error("Error fetching teachers:", err)
      setError("Imeshindwa kupakia walimu")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 BADILISHA: TUMIA API YA PRIMARY
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError("")
    setSuccess("")
    try {
      // 🔥 TAFSIRI JUKUMU KWA KINGEREZA KWA BACKEND
      let roleForBackend = formData.role
      if (roleForBackend === "Mwalimu Mkuu") roleForBackend = "Headmaster"
      else if (roleForBackend === "Mwalimu Mkuu Msaidizi") roleForBackend = "Second Master"
      else if (roleForBackend === "Mtaaluma") roleForBackend = "Academic"
      else if (roleForBackend === "Mhasibu") roleForBackend = "Accountant"
      else if (roleForBackend === "Mwalimu") roleForBackend = "Teacher"
      
      // ✅ TUMIA API YA PRIMARY
      await axios.post("/api/v1/primary/teachers", {
        ...formData,
        role: roleForBackend,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setOpen(false)
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        phone1: "",
        phone2: "",
        role: "Mwalimu",
        school_id: 1,
      })
      setSuccess("Mwalimu ameongezwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchTeachers(token)
    } catch (err: any) {
      console.error("Error creating teacher:", err)
      setError(err.response?.data?.detail || "Imeshindwa kuongeza mwalimu")
    } finally {
      setAdding(false)
    }
  }

  // 🔥 BADILISHA: TUMIA API YA PRIMARY
  const handleDeleteTeacher = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kumfuta mwalimu huyu? Hii itafuta madarasa na masomo yote waliyopangiwa.")) return
    try {
      // ✅ TUMIA API YA PRIMARY
      await axios.delete(`/api/v1/primary/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Mwalimu amefutwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchTeachers(token)
    } catch (err) {
      console.error("Error deleting teacher:", err)
      setError("Imeshindwa kumfuta mwalimu")
    }
  }

  const handleViewStudents = (teacherId: number) => {
    router.push(`/primary/teachers/${teacherId}/students`)
  }

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 🔥 BADILISHA MAJUKUMU KWA KISWAHILI KWA UI
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "Headmaster":
      case "Headmistress":
        return "Mwalimu Mkuu"
      case "Second Master":
      case "Second Mistress":
        return "Mwalimu Mkuu Msaidizi"
      case "Academic":
        return "Mtaaluma"
      case "Accountant":
        return "Mhasibu"
      case "Teacher":
        return "Mwalimu"
      default:
        return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    if (role === "Superadmin") return "bg-red-100 text-red-800"
    switch (role) {
      case "Headmaster":
      case "Headmistress":
        return "bg-purple-100 text-purple-800"
      case "Second Master":
      case "Second Mistress":
        return "bg-indigo-100 text-indigo-800"
      case "Academic":
        return "bg-blue-100 text-blue-800"
      case "Accountant":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-emerald-100 text-emerald-800"
    }
  }

  const getRoleIcon = (role: string) => {
    if (role === "Superadmin") return "👑"
    switch (role) {
      case "Headmaster":
      case "Headmistress":
        return "👨‍💼"
      case "Second Master":
      case "Second Mistress":
        return "📚"
      case "Academic":
        return "🎓"
      case "Accountant":
        return "💰"
      default:
        return "👨‍🏫"
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
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia walimu...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Usimamizi wa Walimu</h1>
            <p className="text-sky-100 max-w-2xl">
              {userRole === "Superadmin" 
                ? "Simamia walimu wote katika shule zote"
                : "Simamia walimu, panga masomo, madarasa na mikondo"}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tafuta kwa jina, jina la mtumiaji au barua pepe..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-500 transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl">
                <Plus className="h-4 w-4" />
                Ongeza Mwalimu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Ongeza Mwalimu Mpya
                </DialogTitle>
                <DialogDescription>
                  Jaza taarifa ili kuongeza mwalimu mpya. Baada ya usajili, unaweza kuwapanga madarasa na masomo.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTeacher}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold flex items-center gap-1 text-gray-700">
                      <User className="h-4 w-4" />
                      Jina Kamili *
                    </Label>
                    <Input
                      className="col-span-3 bg-white rounded-xl"
                      placeholder="Mfano: Juma Mwalimu"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold text-gray-700">Jina la Mtumiaji *</Label>
                    <Input
                      className="col-span-3 bg-white rounded-xl"
                      placeholder="Mfano: jumamwalimu"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold flex items-center gap-1 text-gray-700">
                      <Mail className="h-4 w-4" />
                      Barua Pepe *
                    </Label>
                    <Input
                      type="email"
                      className="col-span-3 bg-white rounded-xl"
                      placeholder="Mfano: juma@shule.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold text-gray-700">Nenosiri *</Label>
                    <Input
                      type="password"
                      className="col-span-3 bg-white rounded-xl"
                      placeholder="Angalau herufi 6"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold flex items-center gap-1 text-gray-700">
                      <Phone className="h-4 w-4" />
                      Namba ya Simu
                    </Label>
                    <Input
                      className="col-span-3 bg-white rounded-xl"
                      placeholder="Mfano: 0712345678"
                      value={formData.phone1}
                      onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold flex items-center gap-1 text-gray-700">
                      <Shield className="h-4 w-4" />
                      Jukumu *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="col-span-3 bg-white rounded-xl">
                        <SelectValue placeholder="Chagua jukumu" />
                      </SelectTrigger>
                      <SelectContent>
                        {MAJUKUMU_YOTE.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role === "Superadmin" ? "👑" : ""} {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                    Ghairi
                  </Button>
                  <Button type="submit" disabled={adding} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {adding ? "Inaongeza..." : "Ongeza Mwalimu"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teachers Table */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" />
              Orodha ya Walimu
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTeachers.length} {filteredTeachers.length === 1 ? 'mwalimu' : 'walimu'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Mwalimu</TableHead>
                    <TableHead>Jina la Mtumiaji</TableHead>
                    <TableHead>Barua Pepe</TableHead>
                    <TableHead>Jukumu</TableHead>
                    <TableHead>Hali</TableHead>
                    <TableHead className="text-right">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Hakuna walimu</p>
                          <p className="text-sm text-gray-400">Bonyeza "Ongeza Mwalimu" kuanza.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher, idx) => {
                      const roleDisplay = getRoleDisplay(teacher.role)
                      return (
                        <TableRow key={teacher.id} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group">
                          <TableCell className="text-gray-500">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                {teacher.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{teacher.name}</p>
                                {teacher.phone1 && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {teacher.phone1}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{teacher.username}</TableCell>
                          <TableCell className="text-sm">{teacher.email}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(teacher.role)}`}>
                              {getRoleIcon(teacher.role)} {roleDisplay}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              teacher.active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {teacher.active ? "Anafanya Kazi" : "Haifanyi Kazi"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewStudents(teacher.id)}
                                className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 gap-1 rounded-xl"
                                title="Tazama Wanafunzi wa Mwalimu"
                              >
                                <Users className="h-4 w-4" />
                                <span className="hidden sm:inline">Wanafunzi</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTeacher(teacher.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 rounded-xl"
                                title="Futa Mwalimu"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Futa</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
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