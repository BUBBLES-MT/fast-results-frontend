"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Loader2, 
  Save, 
  ArrowLeft, 
  BookOpen,
  Sparkles,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Users,
  Layers,
  UserPlus,
  XCircle,
  Info
} from "lucide-react"

interface Subject {
  id: number
  name: string
  code: string | null
}

interface Class {
  id: number
  name: string
}

interface Stream {
  id: number
  name: string
  class_id: number
}

interface Assignment {
  id: number
  teacher_id: number
  teacher_name: string
  subject_id: number
  subject_name: string
  class_id: number
  class_name: string
  stream_id: number
  stream_name: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function PangiaMwalimuPage() {
  const router = useRouter()
  const params = useParams()
  const teacherId = params?.id as string
  
  const [token, setToken] = useState("")
  const [teacher, setTeacher] = useState<any>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [streams, setStreams] = useState<Stream[]>([])
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([])
  const [existingAssignments, setExistingAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [info, setInfo] = useState("")
  
  const [formData, setFormData] = useState({
    subject_id: "",
    class_id: "",
    stream_id: "",
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
      return
    }
    setToken(storedToken)
    fetchData(storedToken)
  }, [teacherId])

  const fetchData = async (authToken: string) => {
    try {
      await Promise.all([
        fetchTeacher(authToken),
        fetchSubjects(authToken),
        fetchClasses(authToken),
        fetchStreams(authToken),
        fetchExistingAssignments(authToken)
      ])
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacher = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch teacher")
      const data = await response.json()
      setTeacher(data)
    } catch (err) {
      setError("Imeshindwa kupakia mwalimu")
    }
  }

  const fetchSubjects = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/subjects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch subjects")
      const data = await response.json()
      setSubjects(data)
    } catch (err) {
      console.error("Error fetching subjects:", err)
    }
  }

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/classes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch classes")
      const data = await response.json()
      setClasses(data)
    } catch (err) {
      console.error("Error fetching classes:", err)
    }
  }

  const fetchStreams = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/streams`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch streams")
      const data = await response.json()
      setStreams(data)
    } catch (err) {
      console.error("Error fetching streams:", err)
    }
  }

  const fetchExistingAssignments = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/teachers/${teacherId}/assignments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch assignments")
      const data = await response.json()
      setExistingAssignments(data)
    } catch (err) {
      console.error("Error fetching assignments:", err)
    }
  }

  // Filter streams when class changes
  useEffect(() => {
    if (formData.class_id) {
      const filtered = streams.filter(
        (stream) => stream.class_id === parseInt(formData.class_id)
      )
      setFilteredStreams(filtered)
      setFormData((prev) => ({ ...prev, stream_id: "" }))
      // Clear messages when selection changes
      setError("")
      setSuccess("")
      setInfo("")
    } else {
      setFilteredStreams([])
    }
  }, [formData.class_id, streams])

  // 🔥 CHECK IF SUBJECT IS ALREADY ASSIGNED
  const checkIfAlreadyAssigned = () => {
    if (!formData.subject_id || !formData.class_id || !formData.stream_id) {
      return false
    }

    const existing = existingAssignments.find(
      (a) => 
        a.subject_id === parseInt(formData.subject_id) &&
        a.class_id === parseInt(formData.class_id) &&
        a.stream_id === parseInt(formData.stream_id)
    )

    if (existing) {
      setError(`❌ Somo "${existing.subject_name}" tayari limepangwa kwa ${existing.teacher_name} katika darasa "${existing.class_name}" na mkondo "${existing.stream_name}"`)
      return true
    }
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 🔥 CHECK IF ALL FIELDS ARE SELECTED
    if (!formData.subject_id || !formData.class_id || !formData.stream_id) {
      setError("Tafadhali chagua somo, darasa, na mkondo")
      return
    }

    // 🔥 CHECK IF ALREADY ASSIGNED
    if (checkIfAlreadyAssigned()) {
      return
    }
    
    setSaving(true)
    setError("")
    setSuccess("")
    setInfo("")
    
    try {
      const payload = {
        subject_id: parseInt(formData.subject_id),
        class_id: parseInt(formData.class_id),
        stream_id: parseInt(formData.stream_id),
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/primary/teachers/${teacherId}/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        // 🔥 HANDLE DUPLICATE ERROR FROM BACKEND
        if (responseData.detail && responseData.detail.includes("already assigned")) {
          setError(`❌ ${responseData.detail}`)
        } else {
          throw new Error(responseData.detail || "Failed to assign")
        }
        return
      }
      
      // 🔥 SUCCESS MESSAGE WITH DETAILS
      const subjectName = subjects.find(s => s.id === parseInt(formData.subject_id))?.name || "Somo"
      const className = classes.find(c => c.id === parseInt(formData.class_id))?.name || "Darasa"
      const streamName = streams.find(s => s.id === parseInt(formData.stream_id))?.name || "Mkondo"
      
      setSuccess(`✅ Mafanikio! ${teacher?.name} amepangiwa kufundisha "${subjectName}" katika darasa "${className}" na mkondo "${streamName}"`)
      
      // 🔥 REFRESH ASSIGNMENTS
      await fetchExistingAssignments(token)
      
      // 🔥 CLEAR FORM
      setFormData({
        subject_id: "",
        class_id: "",
        stream_id: "",
      })
      
      // 🔥 AUTO REDIRECT AFTER 3 SECONDS
      setTimeout(() => {
        router.push("/primary/teachers")
      }, 3000)
      
    } catch (err: any) {
      setError(err.message || "Imeshindwa kumpangia mwalimu")
    } finally {
      setSaving(false)
    }
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
          <p className="text-gray-500 mt-4">Inapakia fomu ya upangiaji...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
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
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Pangia Mwalimu</h1>
            <p className="text-sky-100 flex items-center gap-2">
              <span className="text-lg">{getRoleIcon(teacher?.role)}</span>
              Pangia {teacher?.name} kufundisha somo katika darasa na mkondo maalum
            </p>
          </div>
        </div>

        {/* 🔥 SUCCESS MESSAGE - INATOLEWA WAZI */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-4 rounded-lg flex items-start gap-3 animate-slideIn shadow-md">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{success}</p>
              <p className="text-sm text-emerald-600 mt-1">Utarudishwa kwenye orodha ya walimu baada ya sekunde 3...</p>
            </div>
          </div>
        )}

        {/* 🔥 ERROR MESSAGE - INAELEKEZA KWA MWALIMU ALIYEPANGIWA */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg flex items-start gap-3 animate-slideIn shadow-md">
            <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              {error.includes("tayari limepangwa") && (
                <p className="text-sm text-red-600 mt-1">
                  💡 Tafadhali chagua somo, darasa au mkondo tofauti au futa upangiaji uliopo kwanza.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 🔥 INFO MESSAGE */}
        {info && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn shadow-md">
            <Info className="h-5 w-5" />
            <span>{info}</span>
          </div>
        )}

        {/* Existing Assignments Summary */}
        {existingAssignments.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{teacher?.name} tayari amepangiwa masomo {existingAssignments.length}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {existingAssignments.map((a) => (
                <span key={a.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-purple-100 text-purple-700 border border-purple-200">
                  {a.subject_name} - {a.class_name} {a.stream_name ? `(${a.stream_name})` : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-600" />
              Maelezo ya Upangiaji
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Teacher Info */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {teacher?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mwalimu Aliyechaguliwa</p>
                    <p className="font-semibold text-gray-800 text-lg">{teacher?.name}</p>
                    <p className="text-xs text-gray-400">Kitambulisho: {teacher?.id}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-sky-600" />
                  Somo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, subject_id: value })
                    setError("")
                    setSuccess("")
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500">
                    <SelectValue placeholder="Chagua somo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {subjects.length === 0 ? (
                      <SelectItem value="none" disabled>Hakuna masomo</SelectItem>
                    ) : (
                      subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name} {subject.code ? `(${subject.code})` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  Darasa <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.class_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, class_id: value })
                    setError("")
                    setSuccess("")
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <SelectValue placeholder="Chagua darasa" />
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
              </div>

              {/* Stream */}
              {formData.class_id && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-600" />
                    Mkondo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.stream_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, stream_id: value })
                      setError("")
                      setSuccess("")
                    }}
                  >
                    <SelectTrigger className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <SelectValue placeholder="Chagua mkondo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {filteredStreams.length === 0 ? (
                        <SelectItem value="none" disabled>Hakuna mikondo katika darasa hili</SelectItem>
                      ) : (
                        filteredStreams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            Mkondo {stream.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/primary/teachers")}
                  className="border-gray-300 rounded-xl"
                >
                  Ghairi
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || !formData.subject_id || !formData.class_id || !formData.stream_id}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inapangia...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Pangia Mwalimu
                    </>
                  )}
                </Button>
              </div>
            </form>
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