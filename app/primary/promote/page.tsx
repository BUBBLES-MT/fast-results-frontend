"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Loader2, 
  GraduationCap, 
  ArrowRight, 
  Sparkles,
  Users,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  School,
  Shield
} from "lucide-react"

interface Student {
  id: number
  name: string
  roll_number: string
  class_id: number
  stream_id: number | null
}

interface Class {
  id: number
  name: string
  streams: { id: number; name: string }[]
}

export default function PandaWanafunziPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [schoolId, setSchoolId] = useState("")
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [selectedFromClass, setSelectedFromClass] = useState("")
  const [selectedToClass, setSelectedToClass] = useState("")
  const [selectedToStream, setSelectedToStream] = useState("")
  const [promoting, setPromoting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isTeacher, setIsTeacher] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const schoolId = localStorage.getItem("school_id")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // 🔥 ANGALIA KAMA NI MWALIMU
    const isTeacherRole = role?.toLowerCase() === "mwalimu" || role?.toLowerCase() === "teacher"
    setIsTeacher(isTeacherRole)
    
    // 🔥 RUHUSU ADMIN NA MWALIMU
    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu", "Teacher"]
    const userRoleLower = (role || "").toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower)

    if (!isAllowed) {
      router.push("/primary/dashboard")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    setSchoolId(schoolId || "4")
    fetchClasses(storedToken, schoolId || "4")
  }, [router])

  // 🔥 FETCH CLASSES - PRIMARY API
  const fetchClasses = async (authToken: string, schoolId: string) => {
    try {
      setLoading(true)
      setError("")
      
      const url = `/api/v1/primary/promote/classes-with-streams?school_id=${schoolId}`
      console.log("📤 Inapakia madarasa kutoka:", url)
      
      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kupata madarasa")
      }
      
      const data = await response.json()
      setClasses(data)
      console.log("✅ Madarasa yamepakiwa:", data.length)
    } catch (err: any) {
      console.error("Kosa:", err)
      setError(err.message || "Imeshindwa kupakia madarasa")
    } finally {
      setLoading(false)
    }
  }

  // 🔥🔥🔥 BADILISHA HII - TUMIA API SAHIHI KWA MWALIMU! 🔥🔥🔥
  const fetchStudentsByClass = async (classId: string) => {
    if (!classId) return
    
    try {
      setError("")
      
      // 🔥 IKIWA MWALIMU, TUMIA my-students API!
      const apiUrl = isTeacher 
        ? `/api/v1/primary/students/my-students?class_id=${classId}&school_id=${schoolId}`
        : `/api/v1/primary/students?class_id=${classId}&school_id=${schoolId}`
      
      console.log("📤 Inapakia wanafunzi kutoka:", apiUrl)
      
      const response = await fetch(apiUrl, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kupata wanafunzi")
      }
      
      const data = await response.json()
      setStudents(data)
      setSelectedStudents([])
      console.log("✅ Wanafunzi wamepakiwa:", data.length)
    } catch (err: any) {
      console.error("Kosa:", err)
      setError(err.message || "Imeshindwa kupakia wanafunzi")
    }
  }

  const handleFromClassChange = (value: string) => {
    setSelectedFromClass(value)
    setSelectedToClass("")
    setSelectedToStream("")
    setStudents([])
    setSelectedStudents([])
    setError("")
    setSuccess("")
    fetchStudentsByClass(value)
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map(s => s.id))
    }
  }

  const handleToggleStudent = (studentId: number) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  // 🔥 PROMOTE STUDENTS - PRIMARY API
  const handlePromote = async () => {
    if (selectedStudents.length === 0) {
      setError("Tafadhali chagua angalau mwanafunzi mmoja")
      return
    }
    
    if (!selectedToClass) {
      setError("Tafadhali chagua darasa lengwa")
      return
    }
    
    setPromoting(true)
    setError("")
    setSuccess("")
    
    try {
      const payload = {
        student_ids: selectedStudents,
        from_class_id: parseInt(selectedFromClass),
        to_class_id: parseInt(selectedToClass),
        to_stream_id: selectedToStream && selectedToStream !== "none" ? parseInt(selectedToStream) : null,
        school_id: parseInt(schoolId)
      }
      
      console.log("📤 Inapandisha wanafunzi:", payload)
      
      const response = await fetch("/api/v1/primary/promote/promote", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kupandisha wanafunzi")
      }
      
      const result = await response.json()
      setSuccess(result.message || `✅ Wanafunzi ${selectedStudents.length} wamepandishwa kikamilifu!`)
      setSelectedStudents([])
      
      // Refresh students list
      fetchStudentsByClass(selectedFromClass)
    } catch (err: any) {
      console.error("Kosa:", err)
      setError(err.message || "Imeshindwa kupandisha wanafunzi")
    } finally {
      setPromoting(false)
    }
  }

  const selectedClass = classes.find(c => c.id.toString() === selectedToClass)
  const availableStreams = selectedClass?.streams || []

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
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Panda Wanafunzi</h1>
            <p className="text-sky-100 max-w-2xl">
              Hamisha wanafunzi kutoka darasa moja kwenda darasa linalofuata
              <span className="block text-sm mt-1 text-sky-200">
                🏫 Shule ya Msingi | ID: {schoolId}
              </span>
            </p>
            {isTeacher && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                <Shield className="h-4 w-4" />
                Unaona wanafunzi wako tu
              </div>
            )}
          </div>
        </div>

        {/* Promotion Settings Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-600" />
              Mipangilio ya Upandishaji
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* From Class */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <School className="h-4 w-4 text-sky-600" />
                  Kutoka Darasa
                </Label>
                <Select value={selectedFromClass} onValueChange={handleFromClassChange}>
                  <SelectTrigger className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500">
                    <SelectValue placeholder="Chagua darasa la sasa" />
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

              {/* To Class */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                  Kwenda Darasa
                </Label>
                <Select 
                  value={selectedToClass} 
                  onValueChange={setSelectedToClass}
                  disabled={!selectedFromClass}
                >
                  <SelectTrigger className={`bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 ${!selectedFromClass ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder="Chagua darasa lengwa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {classes
                      .filter(c => c.id.toString() !== selectedFromClass)
                      .map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* To Stream */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Kwenda Mkondo (Si Lazima)
                </Label>
                <Select 
                  value={selectedToStream} 
                  onValueChange={setSelectedToStream}
                  disabled={!selectedToClass || availableStreams.length === 0}
                >
                  <SelectTrigger className={`bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 ${(!selectedToClass || availableStreams.length === 0) ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder="Chagua mkondo (si lazima)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none">Mkondo ule ule</SelectItem>
                    {availableStreams.map((stream) => (
                      <SelectItem key={stream.id} value={stream.id.toString()}>
                        Mkondo {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        {students.length > 0 && (
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                {isTeacher ? "Wanafunzi Wangu" : "Wanafunzi katika Darasa Lililochaguliwa"}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({students.length} wanafunzi)
                </span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleSelectAll} className="border-gray-300 rounded-xl">
                {selectedStudents.length === students.length ? "Ondoa Zote" : "Chagua Zote"}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {/* Error Message */}
              {error && (
                <div className="m-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
              
              {/* Success Message */}
              {success && (
                <div className="m-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{success}</span>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">Chagua</TableHead>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Jina la Mwanafunzi</TableHead>
                      <TableHead>Namba</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">Hakuna wanafunzi katika darasa hili</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow 
                          key={student.id} 
                          className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => handleToggleStudent(student.id)}
                              className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                            />
                          </TableCell>
                          <TableCell className="text-gray-500">{student.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-800">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{student.roll_number || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Promote Button */}
              {students.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <Button 
                    onClick={handlePromote} 
                    disabled={promoting || selectedStudents.length === 0 || !selectedToClass}
                    className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
                  >
                    {promoting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    Panda Wanafunzi Waliochaguliwa ({selectedStudents.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-600" />
              Jinsi Upandishaji Unavyofanya Kazi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold">1</div>
                  Chagua darasa la sasa la wanafunzi unaotaka kupandisha
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold">2</div>
                  Chagua darasa lengwa (mfano: Darasa la 1 → Darasa la 2)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold">3</div>
                  Unaweza kubadilisha mkondo (si lazima)
                </li>
              </ul>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold">4</div>
                  Chagua wanafunzi binafsi au tumia "Chagua Zote"
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold">5</div>
                  Bonyeza "Panda Wanafunzi" kuwasogeza kwenye darasa jipya
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  Taarifa za wanafunzi, alama, na historia zinahifadhiwa
                </li>
              </ul>
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