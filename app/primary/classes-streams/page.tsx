// app/primary/classes-streams/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Layers, 
  Loader2, 
  Edit, 
  School,
  Sparkles,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  GraduationCap
} from "lucide-react"

// ================================
// INTERFACES
// ================================

interface Class {
  id: number
  name: string
  school_id: number
}

interface Stream {
  id: number
  name: string
  class_id: number
  school_id: number
  class_name?: string
}

// ================================
// CONSTANTS - 🔥 SAHIHISHA HAPA!
// ================================

// ✅ SASA NI API_URL PEKEE - HAKUNA /api/v1
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ================================
// MAIN COMPONENT
// ================================

export default function MadarasaNaMikondoPage() {
  const router = useRouter()
  
  // Auth state
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userSchoolId, setUserSchoolId] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Classes state
  const [classes, setClasses] = useState<Class[]>([])
  const [classDialogOpen, setClassDialogOpen] = useState(false)
  const [newClassName, setNewClassName] = useState("")
  const [classLoading, setClassLoading] = useState(false)
  
  // Edit Class state
  const [editClassDialogOpen, setEditClassDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [editClassName, setEditClassName] = useState("")
  
  // Streams state
  const [streams, setStreams] = useState<Stream[]>([])
  const [streamDialogOpen, setStreamDialogOpen] = useState(false)
  const [newStreamName, setNewStreamName] = useState("")
  const [selectedClassId, setSelectedClassId] = useState("")
  const [streamLoading, setStreamLoading] = useState(false)
  
  // Edit Stream state
  const [editStreamDialogOpen, setEditStreamDialogOpen] = useState(false)
  const [editingStream, setEditingStream] = useState<Stream | null>(null)
  const [editStreamName, setEditStreamName] = useState("")
  const [editStreamClassId, setEditStreamClassId] = useState("")

  // ================================
  // USE EFFECT
  // ================================

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const schoolId = localStorage.getItem("school_id")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    // 🔥 PRIMARY ROLES
    const allowedRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"]
    const userRoleLower = (role || "").toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower)

    if (!isAllowed) {
      router.push("/primary/dashboard")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    setUserSchoolId(schoolId ? parseInt(schoolId) : 1)
    fetchData(storedToken)
  }, [router])

  // ================================
  // FETCH DATA - PRIMARY API
  // ================================

  const fetchData = async (authToken: string) => {
    setLoading(true)
    setError("")
    try {
      await Promise.all([
        fetchClasses(authToken),
        fetchStreams(authToken)
      ])
    } catch (err) {
      setError("Imeshindwa kupakia data")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 FETCH CLASSES - PRIMARY API (SAHIHI)
  const fetchClasses = async (authToken: string) => {
    try {
      // ✅ SASA NI /api/v1/primary/classes - SI /api/v1/api/v1/primary/classes
      const response = await fetch(`${API_URL}/api/v1/primary/classes`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Imeshindwa kupata madarasa")
      const data = await response.json()
      setClasses(data)
    } catch (err) {
      console.error("Error fetching classes:", err)
      throw err
    }
  }

  // 🔥 FETCH STREAMS - PRIMARY API (SAHIHI)
  const fetchStreams = async (authToken: string) => {
    try {
      // ✅ SASA NI /api/v1/primary/streams - SI /api/v1/api/v1/primary/streams
      const response = await fetch(`${API_URL}/api/v1/primary/streams`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Imeshindwa kupata mikondo")
      const data = await response.json()
      setStreams(data)
    } catch (err) {
      console.error("Error fetching streams:", err)
      throw err
    }
  }

  // 🔥 CREATE CLASS - PRIMARY API
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClassName.trim()) {
      setError("Tafadhali jaza jina la darasa")
      setTimeout(() => setError(""), 3000)
      return
    }
    
    const existing = classes.find(c => c.name.toLowerCase() === newClassName.toLowerCase())
    if (existing) {
      setError(`Darasa "${newClassName}" tayari lipo!`)
      setTimeout(() => setError(""), 3000)
      return
    }
    
    setClassLoading(true)
    setError("")
    try {
      const payload = {
        name: newClassName.trim(),
        school_id: userSchoolId,
      }
      
      console.log("📤 Creating class with payload:", payload)
      
      const response = await fetch(`${API_URL}/api/v1/primary/classes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.detail || "Imeshindwa kuongeza darasa")
      }
      
      setClassDialogOpen(false)
      setNewClassName("")
      showSuccess("Darasa limeongezwa kikamilifu! ✅")
      await fetchData(token)
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuongeza darasa")
      setTimeout(() => setError(""), 3000)
    } finally {
      setClassLoading(false)
    }
  }

  // 🔥 UPDATE CLASS - PRIMARY API
  const handleUpdateClass = async () => {
    if (!editingClass) return
    if (!editClassName.trim()) return
    
    const existing = classes.find(c => 
      c.name.toLowerCase() === editClassName.toLowerCase() && 
      c.id !== editingClass.id
    )
    if (existing) {
      setError(`Darasa "${editClassName}" tayari lipo!`)
      setTimeout(() => setError(""), 3000)
      return
    }
    
    setClassLoading(true)
    setError("")
    try {
      const payload = {
        name: editClassName.trim(),
        school_id: userSchoolId,
      }
      
      console.log("📤 Updating class with payload:", payload)
      
      const response = await fetch(`${API_URL}/api/v1/primary/classes/${editingClass.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kusasisha darasa")
      }
      
      setEditClassDialogOpen(false)
      setEditingClass(null)
      setEditClassName("")
      showSuccess("Darasa limebadilishwa kikamilifu! ✅")
      await fetchData(token)
    } catch (err: any) {
      setError(err.message || "Imeshindwa kusasisha darasa")
      setTimeout(() => setError(""), 3000)
    } finally {
      setClassLoading(false)
    }
  }

  // 🔥 DELETE CLASS - PRIMARY API
  const handleDeleteClass = async (id: number) => {
    const classStreams = streams.filter(s => s.class_id === id)
    if (classStreams.length > 0) {
      setError(`❌ Hauwezi kufuta darasa lenye mikondo ${classStreams.length}. Futa mikondo kwanza.`)
      setTimeout(() => setError(""), 4000)
      return
    }
    
    if (!confirm("⚠️ Je, una uhakika unataka kufuta darasa hili?")) return
    
    try {
      const response = await fetch(`${API_URL}/api/v1/primary/classes/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kufuta darasa")
      }
      
      showSuccess("Darasa limefutwa kikamilifu! ✅")
      await fetchData(token)
    } catch (err: any) {
      setError(err.message || "Imeshindwa kufuta darasa")
      setTimeout(() => setError(""), 3000)
    }
  }

  // 🔥 CREATE STREAM - PRIMARY API
  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStreamName.trim()) {
      setError("Tafadhali jaza jina la mkondo")
      setTimeout(() => setError(""), 3000)
      return
    }
    if (!selectedClassId) {
      setError("Tafadhali chagua darasa")
      setTimeout(() => setError(""), 3000)
      return
    }
    
    const existing = streams.find(s => 
      s.name.toLowerCase() === newStreamName.toLowerCase() && 
      s.class_id === parseInt(selectedClassId)
    )
    if (existing) {
      setError(`Mkondo "${newStreamName}" tayari upo katika darasa hili!`)
      setTimeout(() => setError(""), 3000)
      return
    }
    
    setStreamLoading(true)
    setError("")
    try {
      const payload = {
        name: newStreamName.trim().toUpperCase(),
        class_id: parseInt(selectedClassId),
        school_id: userSchoolId,
      }
      
      console.log("📤 Creating stream with payload:", payload)
      
      const response = await fetch(`${API_URL}/api/v1/primary/streams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kuongeza mkondo")
      }
      
      setStreamDialogOpen(false)
      setNewStreamName("")
      setSelectedClassId("")
      showSuccess("Mkondo umeongezwa kikamilifu! ✅")
      await fetchData(token)
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuongeza mkondo")
      setTimeout(() => setError(""), 3000)
    } finally {
      setStreamLoading(false)
    }
  }

  // 🔥 UPDATE STREAM - PRIMARY API
  const handleUpdateStream = async () => {
    if (!editingStream) return
    if (!editStreamName.trim()) return
    
    const existing = streams.find(s => 
      s.name.toLowerCase() === editStreamName.toLowerCase() && 
      s.class_id === parseInt(editStreamClassId) &&
      s.id !== editingStream.id
    )
    if (existing) {
      setError(`Mkondo "${editStreamName}" tayari upo katika darasa hili!`)
      setTimeout(() => setError(""), 3000)
      return
    }
    
    setStreamLoading(true)
    setError("")
    try {
      const payload = {
        name: editStreamName.trim().toUpperCase(),
        class_id: parseInt(editStreamClassId),
        school_id: userSchoolId,
      }
      
      console.log("📤 Updating stream with payload:", payload)
      
      const response = await fetch(`${API_URL}/api/v1/primary/streams/${editingStream.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kusasisha mkondo")
      }
      
      setEditStreamDialogOpen(false)
      setEditingStream(null)
      setEditStreamName("")
      setEditStreamClassId("")
      showSuccess("Mkondo umebadilishwa kikamilifu! ✅")
      await fetchData(token)
    } catch (err: any) {
      setError(err.message || "Imeshindwa kusasisha mkondo")
      setTimeout(() => setError(""), 3000)
    } finally {
      setStreamLoading(false)
    }
  }

  // 🔥 DELETE STREAM - PRIMARY API
  const handleDeleteStream = async (id: number) => {
    if (!confirm("⚠️ Je, una uhakika unataka kufuta mkondo huu?")) return
    
    try {
      const response = await fetch(`${API_URL}/api/v1/primary/streams/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kufuta mkondo")
      }
      
      showSuccess("Mkondo umefutwa kikamilifu! ✅")
      await fetchData(token)
    } catch (err: any) {
      setError(err.message || "Imeshindwa kufuta mkondo")
      setTimeout(() => setError(""), 3000)
    }
  }

  // ================================
  // HELPERS
  // ================================

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 3000)
  }

  const openEditClassDialog = (cls: Class) => {
    setEditingClass(cls)
    setEditClassName(cls.name)
    setEditClassDialogOpen(true)
  }

  const openEditStreamDialog = (stream: Stream) => {
    setEditingStream(stream)
    setEditStreamName(stream.name)
    setEditStreamClassId(stream.class_id.toString())
    setEditStreamDialogOpen(true)
  }

  const getStreamsForClass = (classId: number) => {
    return streams.filter(s => s.class_id === classId)
  }

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia madarasa na mikondo...</p>
        </div>
      </MainLayout>
    )
  }

  // ================================
  // RENDER
  // ================================

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <School className="h-6 w-6" />
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Usimamizi wa Madarasa na Mikondo</h1>
              <p className="text-sky-100 max-w-2xl">
                Simamia madarasa na mikondo (A, B, C, n.k.) ili kupanga wanafunzi vizuri.
                <span className="block text-sm mt-1 text-sky-200">
                  🏫 Shule ya Msingi pekee | ID: {userSchoolId}
                </span>
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => fetchData(token)}
              className="text-white hover:bg-white/20 rounded-xl transition-all"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Fresh
            </Button>
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

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="classes" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all">
              <BookOpen className="h-4 w-4" />
              Madarasa
              <span className="ml-1 text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                {classes.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="streams" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all">
              <Layers className="h-4 w-4" />
              Mikondo
              <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {streams.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="mt-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
              <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-100 py-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <School className="h-5 w-5 text-sky-600" />
                  Madarasa Yote
                </CardTitle>
                <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <Plus className="h-4 w-4" />
                      Ongeza Darasa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        Ongeza Darasa Jipya
                      </DialogTitle>
                      <DialogDescription>
                        Unda darasa jipya (mfano: Darasa la 1, Darasa la 2, n.k.)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass}>
                      <div className="py-4">
                        <Label htmlFor="className" className="text-sm font-semibold text-gray-700">Jina la Darasa</Label>
                        <Input
                          id="className"
                          className="mt-2 bg-white rounded-xl border-2 focus:border-emerald-500"
                          placeholder="Mfano: Darasa la 1"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          required
                          autoFocus
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          🏫 Shule: {userSchoolId > 0 ? `ID ${userSchoolId}` : "Haijulikani"}
                        </p>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setClassDialogOpen(false)} className="rounded-xl">
                          Ghairi
                        </Button>
                        <Button type="submit" disabled={classLoading} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg">
                          {classLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ongeza Darasa"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Jina la Darasa</TableHead>
                        <TableHead>Mikondo</TableHead>
                        <TableHead className="text-right w-28">Vitendo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <School className="h-12 w-12 text-gray-300" />
                              <p className="text-gray-500">Hakuna madarasa</p>
                              <p className="text-sm text-gray-400">Bonyeza "Ongeza Darasa" kuanza.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        classes.map((cls, idx) => {
                          const classStreams = getStreamsForClass(cls.id)
                          return (
                            <TableRow key={cls.id} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group">
                              <TableCell className="text-gray-500 font-medium">{idx + 1}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                    {cls.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-800">{cls.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1.5">
                                  {classStreams.length > 0 ? (
                                    classStreams.map((stream) => (
                                      <span key={stream.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                                        {stream.name}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-gray-400 italic">Hakuna mikondo</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditClassDialog(cls)}
                                    className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClass(cls.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-8 w-8 p-0"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams" className="mt-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
              <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-100 py-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Mikondo Yote
                </CardTitle>
                <Dialog open={streamDialogOpen} onOpenChange={setStreamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <Plus className="h-4 w-4" />
                      Ongeza Mkondo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        Ongeza Mkondo Mpya
                      </DialogTitle>
                      <DialogDescription>
                        Unda mkondo mpya kwa darasa (mfano: A, B, C)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateStream}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Darasa</Label>
                          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="bg-white rounded-xl">
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
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Jina la Mkondo</Label>
                          <Input
                            className="bg-white rounded-xl"
                            placeholder="Mfano: A, B, C, D"
                            value={newStreamName}
                            onChange={(e) => setNewStreamName(e.target.value.toUpperCase())}
                            required
                          />
                          <p className="text-xs text-gray-400">Mikondo kawaida ni herufi (A, B, C) au namba (1, 2, 3)</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setStreamDialogOpen(false)} className="rounded-xl">
                          Ghairi
                        </Button>
                        <Button type="submit" disabled={streamLoading} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg">
                          {streamLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ongeza Mkondo"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Jina la Mkondo</TableHead>
                        <TableHead>Darasa</TableHead>
                        <TableHead className="text-right w-28">Vitendo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {streams.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <Layers className="h-12 w-12 text-gray-300" />
                              <p className="text-gray-500">Hakuna mikondo</p>
                              <p className="text-sm text-gray-400">Unda madarasa kwanza, kisha ongeza mikondo.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        streams.map((stream, idx) => (
                          <TableRow key={stream.id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200 group">
                            <TableCell className="text-gray-500">{idx + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                                  {stream.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-gray-800">Mkondo {stream.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <School className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {classes.find(c => c.id === stream.class_id)?.name || stream.class_name || "Haijulikani"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditStreamDialog(stream)}
                                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStream(stream.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={editClassDialogOpen} onOpenChange={setEditClassDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-sky-600" />
              Hariri Darasa
            </DialogTitle>
            <DialogDescription>Sasisha jina la darasa.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="editClassName" className="text-sm font-semibold text-gray-700">Jina la Darasa</Label>
            <Input
              id="editClassName"
              className="mt-2 bg-white rounded-xl"
              value={editClassName}
              onChange={(e) => setEditClassName(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditClassDialogOpen(false)} className="rounded-xl">Ghairi</Button>
            <Button onClick={handleUpdateClass} disabled={classLoading} className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-xl shadow-lg">
              {classLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hifadhi Mabadiliko"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Stream Dialog */}
      <Dialog open={editStreamDialogOpen} onOpenChange={setEditStreamDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-purple-600" />
              Hariri Mkondo
            </DialogTitle>
            <DialogDescription>Sasisha jina la mkondo au darasa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Darasa</Label>
              <Select value={editStreamClassId} onValueChange={setEditStreamClassId}>
                <SelectTrigger className="bg-white rounded-xl">
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
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Jina la Mkondo</Label>
              <Input
                className="bg-white rounded-xl"
                value={editStreamName}
                onChange={(e) => setEditStreamName(e.target.value.toUpperCase())}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStreamDialogOpen(false)} className="rounded-xl">Ghairi</Button>
            <Button onClick={handleUpdateStream} disabled={streamLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg">
              {streamLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hifadhi Mabadiliko"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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