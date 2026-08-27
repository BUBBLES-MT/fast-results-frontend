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
  CheckCircle
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

export default function TeacherStudentsPage() {
  const router = useRouter()
  const params = useParams()
  const teacherId = params?.id as string
  
  const [token, setToken] = useState("")
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
      return
    }
    setToken(storedToken)
    fetchTeacher(storedToken)
    fetchTeacherAssignments(storedToken)
  }, [teacherId])

  const fetchTeacher = async (authToken: string) => {
    try {
      const response = await fetch(`/api/v1/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch teacher")
      const data = await response.json()
      setTeacher(data)
    } catch (err) {
      setError("Failed to load teacher")
    }
  }

  const fetchTeacherAssignments = async (authToken: string) => {
    try {
      const assignmentsRes = await fetch(`/api/v1/teachers/${teacherId}/assignments`, {
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
      
      const allStudentsRes = await fetch(`/api/v1/students`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      
      let allStudents: Student[] = []
      if (allStudentsRes.ok) {
        allStudents = await allStudentsRes.json()
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
      case "Headmaster": return "👨‍💼"
      case "Headmistress": return "👩‍💼"
      case "Academic": return "🎓"
      case "Teacher": return "👨‍🏫"
      default: return "👨‍🏫"
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
          <p className="text-gray-500 mt-4 animate-pulse">Loading teacher data...</p>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <Card className="border-red-500 bg-red-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <p className="font-semibold">{error}</p>
              </div>
              <Button className="mt-4" onClick={() => router.push("/teachers")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Teachers
              </Button>
            </CardContent>
          </Card>
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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/teachers")}
                className="text-white hover:bg-white/20"
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
            <h1 className="text-3xl font-bold mb-2">Teacher's Students</h1>
            <p className="text-blue-100 flex items-center gap-2">
              <span className="text-lg">{getRoleIcon(teacher?.role || "Teacher")}</span>
              {teacher?.name} ({teacher?.role}) - Students they teach
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Assignments</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {assignments.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Students</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {totalUniqueStudents()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Classes Taught</p>
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
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name or roll number..."
                  className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Assignments State */}
        {assignments.length === 0 ? (
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-gray-500 to-gray-600" />
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">This teacher has no assigned subjects yet.</p>
                <p className="text-sm text-gray-400">Assign them to subjects, classes, and streams first.</p>
                <Button
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => router.push(`/teachers/assign-subjects`)}
                >
                  Assign Teacher
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAssignments.map((assignment, idx) => (
              <Card 
                key={`${assignment.id}-${assignment.class_id}-${assignment.stream_id}-${idx}`} 
                className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {assignment.subject_name}
                      </CardTitle>
                      <div className="flex gap-2 ml-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <GraduationCap className="h-3 w-3" />
                          {assignment.class_name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <Layers className="h-3 w-3" />
                          Stream {assignment.stream_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full backdrop-blur-sm">
                      <Users className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {assignment.uniqueStudentCount} students
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
                          No students enrolled in {assignment.class_name} Stream {assignment.stream_name} for {assignment.subject_name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead className="w-24">Gender</TableHead>
                            <TableHead>Roll Number</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignment.students.map((student, studentIdx) => (
                            <TableRow key={student.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group">
                              <TableCell className="text-gray-500">{studentIdx + 1}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-800">{student.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  student.sex === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                }`}>
                                  {student.sex === "M" ? "Male" : "Female"}
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
          <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                About This Teacher
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Teacher Name</p>
                    <p className="font-medium">{teacher?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Role</p>
                    <p className="font-medium">{teacher?.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Impact</p>
                    <p className="font-medium">{totalUniqueStudents()} students taught</p>
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