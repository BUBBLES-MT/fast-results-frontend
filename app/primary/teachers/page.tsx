"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MainLayout } from "@/components/layout/MainLayout"
import { 
  Search, 
  Trash2, 
  BookOpen, 
  Users, 
  Loader2,
  GraduationCap,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function UsimamiziWaWalimuPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userSchoolId, setUserSchoolId] = useState<number>(4)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const schoolId = localStorage.getItem("school_id")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // 🔥 ALLOWED ROLES - PRIMARY
    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"]
    const userRoleLower = (role || "").toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower)

    if (!isAllowed) {
      router.push("/primary/dashboard")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    setUserSchoolId(schoolId ? parseInt(schoolId) : 4)
    fetchTeachers(storedToken)
  }, [router])

  // 🔥 FETCH TEACHERS - PRIMARY API
  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/primary/teachers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setTeachers(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching teachers:", err)
      setError("Imeshindwa kupakia walimu")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 DELETE TEACHER - PRIMARY API
  const handleDeleteTeacher = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kumfuta mwalimu huyu?")) return
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/primary/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Mwalimu amefutwa kikamilifu! 🗑️")
      setTimeout(() => setSuccess(""), 3000)
      fetchTeachers(token)
    } catch (err) {
      console.error("Error deleting teacher:", err)
      setError("Imeshindwa kumfuta mwalimu")
    }
  }

  // 🔥 VIEW STUDENTS
  const handleViewStudents = (teacherId: number) => {
    router.push(`/primary/teachers/${teacherId}/students`)
  }

  // 🔥 ASSIGN SUBJECT
  const handleAssignSubject = (teacherId: number) => {
    router.push(`/primary/teachers/${teacherId}/assign`)
  }

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Mwalimu Mkuu":
        return "bg-purple-100 text-purple-800"
      case "Mwalimu Mkuu Msaidizi":
        return "bg-indigo-100 text-indigo-800"
      case "Mtaaluma":
        return "bg-blue-100 text-blue-800"
      case "Mhasibu":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-emerald-100 text-emerald-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Mwalimu Mkuu":
        return "👨‍💼"
      case "Mwalimu Mkuu Msaidizi":
        return "📚"
      case "Mtaaluma":
        return "🎓"
      case "Mhasibu":
        return "💰"
      default:
        return "👨‍🏫"
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
          <p className="text-gray-500 mt-4">Inapakia walimu...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="h-8 w-8" />
              <div className="h-8 w-px bg-white/30" />
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Usimamizi wa Walimu</h1>
            <p className="text-sky-100 max-w-2xl">
              Walimu wote waliosajiliwa kwenye shule yako.
              <span className="block text-sm mt-1 text-sky-200">
                🏫 Shule ya Msingi | ID: {userSchoolId}
              </span>
            </p>
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

        {/* 🔥 SEARCH ONLY - HAKUNA BUTTON YA KUONGEZA! */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
          <p className="text-sm text-gray-500">
            Walimu hujisajili wenyewe kupitia ukurasa wa Login
          </p>
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
                          <p className="text-sm text-gray-400">Walimu wataonekana hapa baada ya kujisajili.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher, idx) => (
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
                            {getRoleIcon(teacher.role)} {teacher.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            teacher.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          }`}>
                            {teacher.active ? "Anafanya Kazi" : "Haifanyi Kazi"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignSubject(teacher.id)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 rounded-xl"
                              title="Pangia Mwalimu Masomo"
                            >
                              <BookOpen className="h-4 w-4" />
                              <span className="hidden sm:inline">Pangia Somo</span>
                            </Button>
                            
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
                    ))
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
      `}</style>
    </MainLayout>
  )
}