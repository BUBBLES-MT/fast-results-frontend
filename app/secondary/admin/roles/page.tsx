"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Save, 
  Loader2, 
  Shield,
  Users,
  Sparkles,
  AlertCircle,
  CheckCircle,
  UserCog,
  GraduationCap,
  Briefcase,
  Crown,
  BookOpen
} from "lucide-react"

interface Teacher {
  id: number
  name: string
  username: string
  email: string
  role: string
  school_id: number
  active: boolean
}

const ROLES = [
  "Teacher",
  "Headmaster",
  "Headmistress",
  "Second Master",
  "Second Mistress",
  "Academic",
  "Accountant"
]

const ROLE_ICONS: Record<string, string> = {
  "Headmaster": "👨‍💼",
  "Headmistress": "👩‍💼",
  "Second Master": "📚",
  "Second Mistress": "📚",
  "Academic": "🎓",
  "Accountant": "💰",
  "Teacher": "👨‍🏫"
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  "Headmaster": "Full school management access",
  "Headmistress": "Full school management access",
  "Second Master": "Deputy headmaster permissions",
  "Second Mistress": "Deputy headmistress permissions",
  "Academic": "Manage students, teachers, classes, and exams",
  "Accountant": "Manage fees and payments",
  "Teacher": "Manage own students and marks"
}

export default function RolesPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    const allowedRoles = ["superadmin", "Headmaster", "Headmistress", "Academic"]
    if (!allowedRoles.includes(role || "")) {
      router.push("/dashboard")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    fetchTeachers(storedToken)
  }, [router])

  const fetchTeachers = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/teachers", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch teachers")
      const data = await response.json()
      setTeachers(data)
    } catch (err) {
      setError("Failed to load teachers")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (teacherId: number, newRole: string) => {
    setSaving(teacherId)
    setError("")
    setSuccess("")
    try {
      const response = await fetch(`/api/v1/teachers/${teacherId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })
      if (!response.ok) throw new Error("Failed to update role")
      
      setTeachers(teachers.map(t => 
        t.id === teacherId ? { ...t, role: newRole } : t
      ))
      setSuccess(`Role updated successfully for ${teachers.find(t => t.id === teacherId)?.name}`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to update role")
    } finally {
      setSaving(null)
    }
  }

  const filteredTeachers = teachers.filter(teacher =>
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
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Loading teachers...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <UserCog className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Manage Teacher Roles</h1>
            <p className="text-blue-100 max-w-2xl">
              Assign and manage roles for teachers (Headmaster, Academic, Teacher, etc.) to control system access.
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

        {/* Search Bar */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, username or email..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              All Teachers
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
                    <TableHead>Current Role</TableHead>
                    <TableHead>Change Role</TableHead>
                    <TableHead className="text-center w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">No teachers found</p>
                          <p className="text-sm text-gray-400">Try adjusting your search</p>
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
                              <p className="text-xs text-gray-400">{teacher.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{teacher.username}</TableCell>
                        <TableCell className="text-sm">{teacher.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(teacher.role)}`}>
                            {ROLE_ICONS[teacher.role] || "👨‍🏫"} {teacher.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={teacher.role}
                            onValueChange={(value) => handleRoleChange(teacher.id, value)}
                          >
                            <SelectTrigger className="w-44 bg-white border-gray-200">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {ROLES.map((role) => (
                                <SelectItem key={role} value={role}>
                                  <span className="flex items-center gap-2">
                                    <span>{ROLE_ICONS[role] || "👨‍🏫"}</span>
                                    <span>{role}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          {saving === teacher.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600 mx-auto" />
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRoleChange(teacher.id, teacher.role)}
                              disabled
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Save className="h-4 w-4 text-gray-400" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions Info Box */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Role Permissions & Responsibilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ROLES.map((role) => (
                <div key={role} className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-lg">
                    {ROLE_ICONS[role] || "👨‍🏫"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{role}</p>
                    <p className="text-xs text-gray-500">{ROLE_DESCRIPTIONS[role]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                Role changes take effect immediately. Users may need to log out and back in to see changes.
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