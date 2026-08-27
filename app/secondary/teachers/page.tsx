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

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userSchoolId, setUserSchoolId] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const schoolId = localStorage.getItem("school_id")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // 🔥 ALLOWED ROLES - SECONDARY
    const allowedRoles = ["Superadmin", "Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"]
    const userRoleLower = (role || "").toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower)

    if (!isAllowed) {
      router.push("/secondary/dashboard")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    setUserSchoolId(schoolId ? parseInt(schoolId) : 1)
    fetchTeachers(storedToken)
  }, [router])

  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/teachers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setTeachers(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching teachers:", err)
      setError("Failed to load teachers")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeacher = async (id: number) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Teacher deleted successfully! 🗑️")
      setTimeout(() => setSuccess(""), 3000)
      fetchTeachers(token)
    } catch (err) {
      console.error("Error deleting teacher:", err)
      setError("Failed to delete teacher")
    }
  }

  const handleViewStudents = (teacherId: number) => {
    router.push(`/secondary/teachers/${teacherId}/students`)
  }

  const handleAssignSubject = (teacherId: number) => {
    router.push(`/secondary/teachers/${teacherId}/assign`)
  }

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Headmaster": return "bg-purple-100 text-purple-800"
      case "Headmistress": return "bg-pink-100 text-pink-800"
      case "Second Master": return "bg-indigo-100 text-indigo-800"
      case "Second Mistress": return "bg-rose-100 text-rose-800"
      case "Academic": return "bg-blue-100 text-blue-800"
      case "Accountant": return "bg-yellow-100 text-yellow-800"
      default: return "bg-emerald-100 text-emerald-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Headmaster": return "👨‍💼"
      case "Headmistress": return "👩‍💼"
      case "Second Master": return "📚"
      case "Second Mistress": return "📚"
      case "Academic": return "🎓"
      case "Accountant": return "💰"
      default: return "👨‍🏫"
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-500 mt-4">Loading teachers...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="h-8 w-8" />
              <div className="h-8 w-px bg-white/30" />
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Teachers Management</h1>
            <p className="text-blue-100 max-w-2xl">
              All registered teachers in your school.
              <span className="block text-sm mt-1 text-blue-200">
                🏫 School ID: {userSchoolId}
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
                placeholder="Search by name, username or email..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Teachers register themselves via the Login page
          </p>
        </div>

        {/* Teachers Table */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Teachers List
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">No teachers found</p>
                          <p className="text-sm text-gray-400">Teachers will appear here after registration.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher, idx) => (
                      <TableRow key={teacher.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group">
                        <TableCell className="text-gray-500">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
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
                            {teacher.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignSubject(teacher.id)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 rounded-xl"
                              title="Assign Subject to Teacher"
                            >
                              <BookOpen className="h-4 w-4" />
                              <span className="hidden sm:inline">Assign Subject</span>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewStudents(teacher.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1 rounded-xl"
                              title="View Teacher's Students"
                            >
                              <Users className="h-4 w-4" />
                              <span className="hidden sm:inline">Students</span>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 rounded-xl"
                              title="Delete Teacher"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Delete</span>
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
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </MainLayout>
  )
}