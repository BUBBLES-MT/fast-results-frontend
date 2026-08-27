"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
  Loader2, 
  ArrowLeft, 
  Search, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Layers,
  Sparkles,
  User,
  Mail,
  Phone,
  School,
  Trophy,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Shield
} from "lucide-react"

interface Student {
  id: number
  name: string
  sex: string
  roll_number: string
  class_id: number
  class_name?: string
  stream_id: number
  stream_name?: string
}

interface Assignment {
  id: number
  subject_id: number
  subject_name: string
  class_id: number
  class_name: string
  stream_id: number
  stream_name: string
  students: Student[]
  uniqueStudentCount: number
}

interface Teacher {
  id: number
  name: string
  role: string
}

// 🔥 FUNCTION YA KUPATA JINSIA KWA KISWAHILI (ME/KE)
const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE"
}

export default function WanafunziWaMwalimuPage() {
  const router = useRouter()
  const params = useParams()
  const teacherId = params?.id as string
  
  const [token, setToken] = useState("")
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type") || ""
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    setToken(storedToken)
    setUserRole(role)
    fetchTeacher(storedToken)
    fetchTeacherAssignments(storedToken)
  }, [teacherId])

  // 🔥 FETCH TEACHER - PRIMARY API
  const fetchTeacher = async (authToken: string) => {
    try {
      const response = await fetch(`/api/v1/primary/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch teacher")
      const data = await response.json()
      setTeacher(data)
    } catch (err) {
      setError("Imeshindwa kupakia mwalimu")
    }
  }

  // 🔥🔥🔥 BADILISHA HII - TUMIA API SAHIHI! 🔥🔥🔥
  const fetchTeacherAssignments = async (authToken: string) => {
    try {
      const assignmentsRes = await fetch(`/api/v1/primary/teachers/${teacherId}/assignments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      
      if (!assignmentsRes.ok) {
        setAssignments([])
        setLoading(false)
        return
      }
      
      const assignmentsData = await assignmentsRes.json()
      
      if (assignmentsData.length === 0) {
        setAssignments([])
        setLoading(false)
        return
      }
      
      // 🔥🔥🔥 BADILISHA HAPA - TUMIA API SAHIHI! 🔥🔥🔥
      // IKIWA MWALIMU ANAANGALIA WANAFUNZI WAKE, TUMIA my-students
      // IKIWA ADMIN, TUMIA students
      const isTeacher = userRole?.toLowerCase() === "mwalimu" || userRole?.toLowerCase() === "teacher"
      
      // 🔥 KWA MWALIMU, TUMIA my-students
      const studentsApiUrl = isTeacher 
        ? `/api/v1/primary/students/my-students`
        : `/api/v1/primary/students`
      
      console.log("📡 Fetching students from:", studentsApiUrl)
      
      const allStudentsRes = await fetch(studentsApiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      
      let allStudents: Student[] = []
      if (allStudentsRes.ok) {
        allStudents = await allStudentsRes.json()
        console.log("✅ Students loaded:", allStudents.length)
      } else {
        console.error("❌ Failed to fetch students:", allStudentsRes.status)
        // Ikiwa ni 403, toa ujumbe mzuri
        if (allStudentsRes.status === 403) {
          setError("Huna ruhusa ya kuona wanafunzi wa mwalimu huyu. Wasiliana na Mtaaluma.")
          setAssignments([])
          setLoading(false)
          return
        }
      }
      
      const assignmentsWithStudents = assignmentsData.map((assignment: any) => {
        const filteredStudents = allStudents.filter(student => 
          student.class_id === assignment.class_id && 
          student.stream_id === assignment.stream_id
        )
        
        const uniqueStudentsMap = new Map<number, Student>()
        for (const student of filteredStudents) {
          if (!uniqueStudentsMap.has(student.id)) {
            uniqueStudentsMap.set(student.id, student)
          }
        }
        
        return {
          ...assignment,
          students: Array.from(uniqueStudentsMap.values()),
          uniqueStudentCount: uniqueStudentsMap.size,
        }
      })
      
      setAssignments(assignmentsWithStudents)
    } catch (err) {
      console.error("Error fetching teacher assignments:", err)
      setAssignments([])
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAssignments = () => {
    if (!searchTerm) return assignments
    
    return assignments.map(assignment => ({
      ...assignment,
      students: assignment.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.roll_number && student.roll_number.includes(searchTerm))
      )
    })).filter(assignment => assignment.students.length > 0)
  }

  const filteredAssignments = getFilteredAssignments()
  
  const totalUniqueStudents = () => {
    const uniqueStudentIds = new Set<number>()
    for (const assignment of assignments) {
      for (const student of assignment.students) {
        uniqueStudentIds.add(student.id)
      }
    }
    return uniqueStudentIds.size
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Mwalimu Mkuu": return "👨‍💼"
      case "Mwalimu Mkuu Msaidizi": return "👩‍💼"
      case "Mtaaluma": return "🎓"
      case "Mwalimu": return "👨‍🏫"
      default: return "👨‍🏫"
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "Mwalimu Mkuu": return "Mwalimu Mkuu"
      case "Mwalimu Mkuu Msaidizi": return "Mwalimu Mkuu Msaidizi"
      case "Mtaaluma": return "Mtaaluma"
      case "Mwalimu": return "Mwalimu"
      default: return role
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
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia data ya mwalimu...</p>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <Card className="border-red-500 bg-red-50 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <p className="font-semibold">{error}</p>
              </div>
              <Button className="mt-4 rounded-xl" onClick={() => router.push("/primary/teachers")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Rudi kwa Walimu
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  // 🔥 ANGALIA KAMA NI MWALIMU ANAYEJARIBU KUONA MWALIMU MWINGINE
  const isTeacher = userRole?.toLowerCase() === "mwalimu" || userRole?.toLowerCase() === "teacher"
  const isViewingSelf = isTeacher && teacher?.id === parseInt(localStorage.getItem("user_id") || "0")

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/primary/teachers")}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Wanafunzi wa Mwalimu</h1>
            <p className="text-sky-100 flex items-center gap-2">
              <span className="text-lg">{getRoleIcon(teacher?.role || "Mwalimu")}</span>
              {teacher?.name} ({getRoleDisplay(teacher?.role || "Mwalimu")}) - Wanafunzi anaowafundisha
            </p>
            {isTeacher && !isViewingSelf && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/30 text-amber-200 rounded-full text-sm">
                <Shield className="h-4 w-4" />
                Unaona wanafunzi wa mwalimu mwingine (Tazama Tu)
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-cyan-500" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Jumla ya Mapangio</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                    {assignments.length}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-full group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Jumla ya Wanafunzi</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {totalUniqueStudents()}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Madarasa Yanayofundisha</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {assignments.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        {totalUniqueStudents() > 0 && (
          <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tafuta wanafunzi kwa jina au namba..."
                  className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-500 transition-all rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Assignments State */}
        {assignments.length === 0 ? (
          <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-gray-500 to-gray-600" />
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Mwalimu huyu hajapewa masomo bado.</p>
                <p className="text-sm text-gray-400">Pangia masomo, madarasa na mikondo kwanza.</p>
                <Button
                  className="mt-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
                  onClick={() => router.push(`/primary/teachers/${teacherId}/assign`)}
                >
                  Pangia Mwalimu
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAssignments.map((assignment, idx) => (
              <Card 
                key={`${assignment.id}-${assignment.class_id}-${assignment.stream_id}-${idx}`} 
                className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fadeIn rounded-2xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <BookOpen className="h-5 w-5 text-sky-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {assignment.subject_name}
                      </CardTitle>
                      <div className="flex gap-2 ml-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                          <GraduationCap className="h-3 w-3" />
                          {assignment.class_name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <Layers className="h-3 w-3" />
                          Mkondo {assignment.stream_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full backdrop-blur-sm">
                      <Users className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {assignment.uniqueStudentCount} wanafunzi
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {assignment.students.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500">
                          Hakuna wanafunzi waliosajiliwa katika {assignment.class_name} Mkondo {assignment.stream_name} kwa {assignment.subject_name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Jina la Mwanafunzi</TableHead>
                            <TableHead className="w-24">Jinsia</TableHead>
                            <TableHead>Namba</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignment.students.map((student, studentIdx) => (
                            <TableRow key={student.id} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group">
                              <TableCell className="text-gray-500">{studentIdx + 1}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-800">{student.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  student.sex === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                }`}>
                                  {pataJinsia(student.sex)}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{student.roll_number || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        {assignments.length > 0 && (
          <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-600" />
                Kuhusu Mwalimu Huyu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Jina la Mwalimu</p>
                    <p className="font-medium">{teacher?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Jukumu</p>
                    <p className="font-medium">{getRoleDisplay(teacher?.role || "Mwalimu")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Athari Jumla</p>
                    <p className="font-medium">{totalUniqueStudents()} wanafunzi anawafundisha</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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