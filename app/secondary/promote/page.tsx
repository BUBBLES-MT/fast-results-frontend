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
  School
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

export default function PromotePage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // Baada (case-insensitive):
const allowedRoles = ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"]
const userRole = (role || "").toLowerCase()
const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRole)

if (!isAllowed) {
  router.push("/secondary/dashboard")
  return
}
    
    setToken(storedToken)
    setUserRole(role || "")
    fetchClasses(storedToken)
  }, [router])

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(
        "/api/v1/promote/classes-with-streams?school_id=1",
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      if (!response.ok) throw new Error("Failed to fetch classes")
      const data = await response.json()
      setClasses(data)
    } catch (err) {
      setError("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentsByClass = async (classId: string) => {
    if (!classId) return
    
    try {
      const response = await fetch(
        `/api/v1/students?class_id=${classId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!response.ok) throw new Error("Failed to fetch students")
      const data = await response.json()
      setStudents(data)
      setSelectedStudents([])
    } catch (err) {
      setError("Failed to load students")
    }
  }

  const handleFromClassChange = (value: string) => {
    setSelectedFromClass(value)
    setSelectedToClass("")
    setSelectedToStream("")
    setStudents([])
    setSelectedStudents([])
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

  const handlePromote = async () => {
    if (selectedStudents.length === 0) {
      setError("Please select at least one student")
      return
    }
    
    if (!selectedToClass) {
      setError("Please select target class")
      return
    }
    
    setPromoting(true)
    setError("")
    setSuccess("")
    
    try {
      const response = await fetch("/api/v1/promote/promote", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_ids: selectedStudents,
          from_class_id: parseInt(selectedFromClass),
          to_class_id: parseInt(selectedToClass),
          to_stream_id: selectedToStream ? parseInt(selectedToStream) : null,
        }),
      })
      
      if (!response.ok) throw new Error("Failed to promote students")
      
      const result = await response.json()
      setSuccess(result.message)
      setSelectedStudents([])
      fetchStudentsByClass(selectedFromClass)
    } catch (err) {
      setError("Failed to promote students")
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">
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
            <h1 className="text-3xl font-bold mb-2">Promote Students</h1>
            <p className="text-blue-100 max-w-2xl">
              Move students from one class to the next level (e.g., Form 1 → Form 2, Form 2 → Form 3)
            </p>
          </div>
        </div>

        {/* Promotion Settings Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Promotion Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* From Class - FIXED: bg-white */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <School className="h-4 w-4 text-blue-600" />
                  From Class
                </Label>
                <Select value={selectedFromClass} onValueChange={handleFromClassChange}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select current class" />
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

              {/* To Class - FIXED: bg-white */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                  To Class
                </Label>
                <Select 
                  value={selectedToClass} 
                  onValueChange={setSelectedToClass}
                  disabled={!selectedFromClass}
                >
                  <SelectTrigger className={`bg-white border-gray-200 ${!selectedFromClass ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder="Select target class" />
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

              {/* To Stream - FIXED: bg-white */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  To Stream (Optional)
                </Label>
                <Select 
                  value={selectedToStream} 
                  onValueChange={setSelectedToStream}
                  disabled={!selectedToClass || availableStreams.length === 0}
                >
                  <SelectTrigger className={`bg-white border-gray-200 ${(!selectedToClass || availableStreams.length === 0) ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder="Select stream (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none">Same stream</SelectItem>
                    {availableStreams.map((stream) => (
                      <SelectItem key={stream.id} value={stream.id.toString()}>
                        Stream {stream.name}
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
                Students in Selected Class
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({students.length} students)
                </span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleSelectAll} className="border-gray-300">
                {selectedStudents.length === students.length ? "Deselect All" : "Select All"}
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
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead className="w-16">ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">No students found in this class</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow 
                          key={student.id} 
                          className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => handleToggleStudent(student.id)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </TableCell>
                          <TableCell className="text-gray-500">{student.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
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
                    className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {promoting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    Promote Selected Students ({selectedStudents.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              How Promotion Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">1</div>
                  Select the current class of students you want to promote
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">2</div>
                  Choose the target class (e.g., Form 1 → Form 2)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">3</div>
                  You can optionally change the stream
                </li>
              </ul>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">4</div>
                  Select individual students or use "Select All"
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">5</div>
                  Click "Promote" to move them to the new class
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">✓</div>
                  Student records, marks, and history are preserved
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