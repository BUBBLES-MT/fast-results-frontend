"use client"

import { useState, useEffect, useCallback } from "react"
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
  BookOpen,
  Eye,
  RefreshCw,
  School
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

// 🔥 AINA ZA MITIHANI KWA SHULE ZA MSINGI (KISWAHILI)
const AINA_ZAMTIHANI = [
  { value: "MIDTERM3", label: "Robo Muhula", icon: "📝" },
  { value: "MIDTERM9", label: "Robo Muhula ya Pili", icon: "📝" },
  { value: "TERMINAL", label: "Muhula wa Kwanza", icon: "📊" },
  { value: "ANNUAL", label: "Muhula wa Pili", icon: "🏆" },
];

const CHAGUO_ZAKIWIANO = [
  { value: "5", label: "Bora 5", icon: "👑" },
  { value: "10", label: "Bora 10", icon: "🏆" },
  { value: "20", label: "Bora 20", icon: "⭐" },
  { value: "30", label: "Bora 30", icon: "📊" },
  { value: "50", label: "Bora 50", icon: "🎯" },
  { value: "100", label: "Bora 100", icon: "🔥" },
  { value: "all", label: "Wanafunzi Wote", icon: "👥" },
]

export default function WanafunziBoraPage() {
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
  const [userRole, setUserRole] = useState("")
  const [isTeacher, setIsTeacher] = useState(false)
  const [schoolName, setSchoolName] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const school = localStorage.getItem("school_name") || "Shule ya Msingi"
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    setToken(storedToken)
    setSchoolName(school)
    
    // 🔥 ANGALIA KAMA NI MWALIMU
    const formattedRole = role || ""
    const isTeacherRole = formattedRole.toLowerCase() === "mwalimu" || formattedRole.toLowerCase() === "teacher"
    setIsTeacher(isTeacherRole)
    setUserRole(formattedRole)
    
    fetchClasses(storedToken)
  }, [router])

  // 🔥 FETCH CLASSES - KWA MWALIMU NA ADMIN
  const fetchClasses = async (authToken: string) => {
    try {
      setLoading(true)
      setError("")
      
      // 🔥 IKIWA MWALIMU, PATA MADARASA YAKE
      if (isTeacher) {
        // Pata madarasa ya mwalimu kupitia assignments
        const assignmentsRes = await fetch("/api/v1/primary/teachers/me/assignments", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        
        if (assignmentsRes.ok) {
          const assignments = await assignmentsRes.json()
          console.log("📚 Mwalimu assignments:", assignments)
          
          // Pata class IDs za mwalimu
          const classIds = [...new Set(assignments.map((a: any) => a.class_id))]
          console.log("📚 Class IDs:", classIds)
          
          if (classIds.length === 0) {
            setError("Hujapewa darasa lolote. Wasiliana na Mtaaluma.")
            setClasses([])
            setLoading(false)
            return
          }
          
          // Pata details za classes
          const classesRes = await fetch("/api/v1/primary/classes", {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          
          if (classesRes.ok) {
            const allClasses = await classesRes.json()
            // Chuja classes za mwalimu
            const myClasses = allClasses.filter((cls: Class) => classIds.includes(cls.id))
            setClasses(myClasses)
            
            if (myClasses.length > 0) {
              setSelectedClass(myClasses[0].id.toString())
            } else {
              setError("Hujapewa darasa lolote. Wasiliana na Mtaaluma.")
            }
          } else {
            setError("Imeshindwa kupata madarasa")
          }
        } else {
          setError("Imeshindwa kupata madarasa yako. Wasiliana na Mtaaluma.")
        }
      } else {
        // 🔥 ADMIN - Pata madarasa yote
        const response = await fetch("/api/v1/primary/classes", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        
        if (response.ok) {
          const data = await response.json()
          setClasses(data)
          if (data.length > 0) {
            setSelectedClass(data[0].id.toString())
          } else {
            setError("Hakuna madarasa yaliyopatikana")
          }
        } else {
          setError("Imeshindwa kupata madarasa")
        }
      }
      
      setLoading(false)
    } catch (err) {
      console.error("Error fetching classes:", err)
      setError("Imeshindwa kuunganisha na server")
      setLoading(false)
    }
  }

  // 🔥 FETCH TOP STUDENTS
  const fetchTopStudents = async () => {
    if (!selectedClass) {
      setError("Tafadhali chagua darasa")
      return
    }
    
    setFetching(true)
    setError("")
    try {
      const limitParam = selectedLimit === "all" ? "" : `&limit=${selectedLimit}`
      const url = `/api/v1/primary/reports/class/${selectedClass}/top-students?exam_type=${selectedExamType}${limitParam}`
      
      console.log("🔍 Fetching top students:", url)
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Imeshindwa kupata wanafunzi bora")
      }
      
      const data = await response.json()
      setTopStudents(data.top_students || [])
      
      if (data.top_students?.length === 0) {
        setError("Hakuna wanafunzi waliopata alama kwa mtihani huu.")
      }
    } catch (err: any) {
      console.error("Error fetching top students:", err)
      setError(err.message || "Imeshindwa kupakia wanafunzi bora")
    } finally {
      setFetching(false)
    }
  }

  // 🔥 AUTO FETCH WHEN CLASS CHANGES
  useEffect(() => {
    if (selectedClass && !loading && !fetching) {
      const delay = setTimeout(() => {
        fetchTopStudents()
      }, 300)
      return () => clearTimeout(delay)
    }
  }, [selectedClass, selectedExamType, selectedLimit])

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
      case "C": return "bg-yellow-100 text-yellow-800"
      case "D": return "bg-orange-100 text-orange-800"
      case "E": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getLimitLabel = () => {
    const option = CHAGUO_ZAKIWIANO.find(opt => opt.value === selectedLimit)
    return option ? option.label : "Bora 10"
  }

  const getLimitIcon = () => {
    const option = CHAGUO_ZAKIWIANO.find(opt => opt.value === selectedLimit)
    return option ? option.icon : "🏆"
  }

  const handleRefresh = () => {
    if (selectedClass) {
      fetchTopStudents()
    } else {
      fetchClasses(token)
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
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia madarasa...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div className="h-8 w-px bg-white/30" />
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Star className="h-6 w-6" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Wanafunzi Bora</h1>
                <p className="text-amber-100 max-w-2xl">
                  Adhimisha ubora! Tazama wanafunzi waliofanya vyema katika madarasa na mitihani yote.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <School className="h-4 w-4" />
                  {schoolName}
                </div>
                {isTeacher && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <Eye className="h-4 w-4" />
                    Unaona wanafunzi wa madarasa unayofundisha tu
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Class Select */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-sky-600" />
                  Chagua Darasa
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500">
                    <SelectValue placeholder={classes.length === 0 ? "Hakuna madarasa" : "Chagua darasa"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>Hakuna madarasa</SelectItem>
                    ) : (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {classes.length === 0 && (
                  <p className="text-xs text-amber-600">{error || "Hakuna madarasa yaliyopatikana"}</p>
                )}
              </div>

              {/* Exam Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Aina ya Mtihani
                </label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <SelectValue placeholder="Chagua aina ya mtihani" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {AINA_ZAMTIHANI.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Limit */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Idadi ya Wanafunzi
                </label>
                <Select value={selectedLimit} onValueChange={setSelectedLimit}>
                  <SelectTrigger className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Chagua kiwango" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {CHAGUO_ZAKIWIANO.map((option) => (
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

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={fetchTopStudents} 
                  disabled={fetching || !selectedClass || classes.length === 0}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
                >
                  {fetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trophy className="h-4 w-4 mr-2" />}
                  {fetching ? "Inapakia..." : `Tazama ${getLimitLabel()}`}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={fetching}
                  className="w-full rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50"
                  size="sm"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${fetching ? 'animate-spin' : ''}`} />
                  Onyesha Upya
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
          <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                {getLimitLabel()} Wanafunzi Bora
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {getLimitIcon()} Orodha ya Heshima
                </span>
                <span className="text-xs font-normal text-gray-400 ml-auto">
                  {classes.find(c => c.id.toString() === selectedClass)?.name || ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-20">Nafasi</TableHead>
                      <TableHead>Jina la Mwanafunzi</TableHead>
                      <TableHead>Namba</TableHead>
                      <TableHead className="text-center">Jumla</TableHead>
                      <TableHead className="text-center">Wastani</TableHead>
                      <TableHead className="text-center">Daraja</TableHead>
                      <TableHead className="text-center">Masomo</TableHead>
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
              
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-t border-yellow-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-gray-600">
                      Inaonyesha <span className="font-semibold text-gray-800">{topStudents.length}</span> wanafunzi bora
                      {selectedLimit !== "all" && ` kati ya ${selectedLimit}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <p className="text-xs text-gray-500">Hongera kwa wanafunzi wote waliofanya vyema!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !fetching && topStudents.length === 0 && !error ? (
          <Card className="shadow-xl border-0 rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-gray-500 to-gray-600" />
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Trophy className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Hakuna data inayopatikana</p>
                <p className="text-sm text-gray-400">Chagua darasa na aina ya mtihani kuona wanafunzi bora.</p>
                <Button 
                  variant="outline"
                  onClick={handleRefresh}
                  className="mt-4 rounded-xl"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Onyesha Upya
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Loading state */}
        {fetching && (
          <Card className="shadow-xl border-0 rounded-2xl">
            <CardContent className="py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-500">Inapakia wanafunzi bora...</p>
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