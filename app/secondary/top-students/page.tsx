"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Trophy, 
  Medal, 
  Award, 
  Sparkles,
  TrendingUp,
  Users,
  GraduationCap,
  Star,
  Crown,
  AlertCircle,
  BookOpen
} from "lucide-react"

interface Class {
  id: number
  name: string
  school_id: number
}

interface TopStudent {
  position: number
  student_id: number
  name: string
  roll_number: string
  average: number
  total: number
  grade: string
  subjects_count: number
}

const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"]
const LIMIT_OPTIONS = [
  { value: "5", label: "Top 5", icon: "👑" },
  { value: "10", label: "Top 10", icon: "🏆" },
  { value: "20", label: "Top 20", icon: "⭐" },
  { value: "30", label: "Top 30", icon: "📊" },
  { value: "50", label: "Top 50", icon: "🎯" },
  { value: "100", label: "Top 100", icon: "🔥" },
  { value: "all", label: "All Students", icon: "👥" },
]

export default function TopStudentsPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedExamType, setSelectedExamType] = useState("MIDTERM3")
  const [selectedLimit, setSelectedLimit] = useState("10")
  const [topStudents, setTopStudents] = useState<TopStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
      return
    }
    setToken(storedToken)
    fetchClasses(storedToken)
  }, [router])

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/classes", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch classes")
      const data = await response.json()
      setClasses(data)
      if (data.length > 0) {
        setSelectedClass(data[0].id.toString())
      }
      setLoading(false)
    } catch (err) {
      setError("Failed to load classes")
      setLoading(false)
    }
  }

  const fetchTopStudents = async () => {
    if (!selectedClass) return
    
    setFetching(true)
    setError("")
    try {
      const limitParam = selectedLimit === "all" ? "" : `&limit=${selectedLimit}`
      const response = await fetch(
        `/api/v1/reports/class/${selectedClass}/top-students?exam_type=${selectedExamType}${limitParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!response.ok) throw new Error("Failed to fetch top students")
      const data = await response.json()
      setTopStudents(data.top_students)
    } catch (err) {
      setError("Failed to load top students")
    } finally {
      setFetching(false)
    }
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-5 w-5 text-blue-400" />
    }
  }

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-100 text-emerald-800"
      case "B": return "bg-blue-100 text-blue-800"
      case "C": return "bg-amber-100 text-amber-800"
      case "D": return "bg-orange-100 text-orange-800"
      default: return "bg-red-100 text-red-800"
    }
  }

  const getLimitLabel = () => {
    const option = LIMIT_OPTIONS.find(opt => opt.value === selectedLimit)
    return option ? option.label : "Top 10"
  }

  const getLimitIcon = () => {
    const option = LIMIT_OPTIONS.find(opt => opt.value === selectedLimit)
    return option ? option.icon : "🏆"
  }

  if (loading && classes.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Loading classes...</p>
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
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Star className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Top Performing Students</h1>
            <p className="text-amber-100 max-w-2xl">
              Celebrate excellence! View the best performing students across all classes and exams.
            </p>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Class Select - FIXED: bg-white on both trigger and content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Select Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Type Select - FIXED: bg-white on both trigger and content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Exam Type
                </label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Limit Select - FIXED: bg-white on both trigger and content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Number of Students
                </label>
                <Select value={selectedLimit} onValueChange={setSelectedLimit}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {LIMIT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Button */}
              <div className="flex items-end">
                <Button 
                  onClick={fetchTopStudents} 
                  disabled={fetching}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all"
                >
                  {fetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trophy className="h-4 w-4 mr-2" />}
                  {fetching ? "Loading..." : `View ${getLimitLabel()}`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {topStudents.length > 0 && !fetching ? (
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                {getLimitLabel()} Students
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {getLimitIcon()} Honor Roll
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-20">Position</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead className="text-center">Total Score</TableHead>
                      <TableHead className="text-center">Average</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Subjects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((student) => (
                      <TableRow 
                        key={student.student_id} 
                        className="hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-amber-50/50 transition-all duration-200 group"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPositionBadge(student.position)}`}>
                              {student.position}
                            </div>
                            {getMedalIcon(student.position)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{student.roll_number || "-"}</TableCell>
                        <TableCell className="text-center font-semibold text-gray-800">{student.total}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{student.average}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getGradeColor(student.grade)}`}>
                            {student.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 text-gray-600">
                            <BookOpen className="h-3 w-3" />
                            {student.subjects_count}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Summary Banner */}
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-t border-yellow-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-800">{topStudents.length}</span> out of{' '}
                      <span className="font-semibold text-gray-800">
                        {selectedLimit === "all" ? topStudents.length : selectedLimit}
                      </span>{' '}
                      top students
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <p className="text-xs text-gray-500">Congratulations to all outstanding students!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !fetching && topStudents.length === 0 && !error ? (
          <Card className="shadow-xl border-0">
            <div className="h-1 w-full bg-gradient-to-r from-gray-500 to-gray-600" />
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Trophy className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No data available</p>
                <p className="text-sm text-gray-400">Select a class and exam type to view top students.</p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Loading state while fetching */}
        {fetching && (
          <Card className="shadow-xl border-0">
            <CardContent className="py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading top students...</p>
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
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </MainLayout>
  )
}