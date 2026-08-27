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
  Save, 
  X,
  School,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Users
} from "lucide-react"

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

export default function ClassesStreamsPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    const allowedRoles = ["Superadmin", "Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"]
    const userRole = (role || "").toLowerCase()
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRole)

if (!isAllowed) {
  router.push("/secondary/dashboard")
  return
}
    
    setToken(storedToken)
    setUserRole(role || "")
    fetchClasses(storedToken)
    fetchStreams(storedToken)
  }, [router])

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/classes", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch classes")
      const data = await response.json()
      setClasses(data)
    } catch (err) {
      setError("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  const fetchStreams = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/streams", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch streams")
      const data = await response.json()
      const streamsWithClass = data.map((stream: Stream) => ({
        ...stream,
        class_name: classes.find(c => c.id === stream.class_id)?.name || "Unknown"
      }))
      setStreams(streamsWithClass)
    } catch (err) {
      console.error("Error fetching streams:", err)
    }
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClassName.trim()) return
    
    const existing = classes.find(c => c.name.toLowerCase() === newClassName.toLowerCase())
    if (existing) {
      setError(`Class "${newClassName}" already exists!`)
      return
    }
    
    setClassLoading(true)
    setError("")
    try {
      const response = await fetch("/api/v1/classes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClassName,
          school_id: 1,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create class")
      }
      
      setClassDialogOpen(false)
      setNewClassName("")
      setSuccess("Class created successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
      fetchStreams(token)
    } catch (err: any) {
      setError(err.message || "Failed to create class")
    } finally {
      setClassLoading(false)
    }
  }

  const handleUpdateClass = async () => {
    if (!editingClass) return
    if (!editClassName.trim()) return
    
    const existing = classes.find(c => c.name.toLowerCase() === editClassName.toLowerCase() && c.id !== editingClass.id)
    if (existing) {
      setError(`Class "${editClassName}" already exists!`)
      return
    }
    
    setClassLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/v1/classes/${editingClass.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editClassName,
          school_id: editingClass.school_id,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update class")
      }
      
      setEditClassDialogOpen(false)
      setEditingClass(null)
      setEditClassName("")
      setSuccess("Class updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
      fetchStreams(token)
    } catch (err: any) {
      setError(err.message || "Failed to update class")
    } finally {
      setClassLoading(false)
    }
  }

  const handleDeleteClass = async (id: number) => {
    const classStreams = streams.filter(s => s.class_id === id)
    if (classStreams.length > 0) {
      setError(`Cannot delete class with ${classStreams.length} stream(s). Delete streams first.`)
      return
    }
    
    if (!confirm("Are you sure? This will also delete all students in this class!")) return
    try {
      await fetch(`/api/v1/classes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Class deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
      fetchStreams(token)
    } catch (err) {
      setError("Failed to delete class")
    }
  }

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStreamName.trim() || !selectedClassId) return
    
    const existing = streams.find(s => 
      s.name.toLowerCase() === newStreamName.toLowerCase() && 
      s.class_id === parseInt(selectedClassId)
    )
    if (existing) {
      setError(`Stream "${newStreamName}" already exists in this class!`)
      return
    }
    
    setStreamLoading(true)
    setError("")
    try {
      const response = await fetch("/api/v1/streams", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newStreamName,
          class_id: parseInt(selectedClassId),
          school_id: 1,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create stream")
      }
      
      setStreamDialogOpen(false)
      setNewStreamName("")
      setSelectedClassId("")
      setSuccess("Stream created successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchStreams(token)
    } catch (err: any) {
      setError(err.message || "Failed to create stream")
    } finally {
      setStreamLoading(false)
    }
  }

  const handleUpdateStream = async () => {
    if (!editingStream) return
    if (!editStreamName.trim()) return
    
    const existing = streams.find(s => 
      s.name.toLowerCase() === editStreamName.toLowerCase() && 
      s.class_id === parseInt(editStreamClassId) &&
      s.id !== editingStream.id
    )
    if (existing) {
      setError(`Stream "${editStreamName}" already exists in this class!`)
      return
    }
    
    setStreamLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/v1/streams/${editingStream.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editStreamName,
          class_id: parseInt(editStreamClassId),
          school_id: 1,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update stream")
      }
      
      setEditStreamDialogOpen(false)
      setEditingStream(null)
      setEditStreamName("")
      setEditStreamClassId("")
      setSuccess("Stream updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchStreams(token)
    } catch (err: any) {
      setError(err.message || "Failed to update stream")
    } finally {
      setStreamLoading(false)
    }
  }

  const handleDeleteStream = async (id: number) => {
    if (!confirm("Are you sure you want to delete this stream?")) return
    try {
      await fetch(`/api/v1/streams/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Stream deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchStreams(token)
    } catch (err) {
      setError("Failed to delete stream")
    }
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Loading classes & streams...</p>
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
                <School className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Layers className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Classes & Streams Management</h1>
            <p className="text-blue-100 max-w-2xl">
              Manage school classes and streams (A, B, C, etc.) to organize students effectively.
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

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="classes" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all">
              <BookOpen className="h-4 w-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="streams" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all">
              <Layers className="h-4 w-4" />
              Streams
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="mt-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-600" />
                  All Classes
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({classes.length} {classes.length === 1 ? 'class' : 'classes'})
                  </span>
                </CardTitle>
                <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Plus className="h-4 w-4" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        Add New Class
                      </DialogTitle>
                      <DialogDescription>
                        Create a new class (e.g., Form 1, Form 2, Std 1, etc.)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass}>
                      <div className="py-4">
                        <Label htmlFor="className" className="text-sm font-semibold text-gray-700">Class Name</Label>
                        <Input
                          id="className"
                          className="mt-2 bg-white"
                          placeholder="e.g., Form 1, Form 2, Std 1"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setClassDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={classLoading} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                          {classLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Class"}
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
                        <TableHead>Class Name</TableHead>
                        <TableHead>Streams</TableHead>
                        <TableHead className="text-right w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <School className="h-12 w-12 text-gray-300" />
                              <p className="text-gray-500">No classes found</p>
                              <p className="text-sm text-gray-400">Click "Add Class" to create one.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        classes.map((cls, idx) => (
                          <TableRow key={cls.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group">
                            <TableCell className="text-gray-500">{idx + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                  {cls.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-gray-800">{cls.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {getStreamsForClass(cls.id).map((stream) => (
                                  <span key={stream.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    {stream.name}
                                  </span>
                                ))}
                                {getStreamsForClass(cls.id).length === 0 && (
                                  <span className="text-xs text-gray-400">No streams yet</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditClassDialog(cls)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClass(cls.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

          {/* Streams Tab */}
          <TabsContent value="streams" className="mt-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
              <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  All Streams
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({streams.length} {streams.length === 1 ? 'stream' : 'streams'})
                  </span>
                </CardTitle>
                <Dialog open={streamDialogOpen} onOpenChange={setStreamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Plus className="h-4 w-4" />
                      Add Stream
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        Add New Stream
                      </DialogTitle>
                      <DialogDescription>
                        Create a new stream for a class (e.g., A, B, C)
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateStream}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Class</Label>
                          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="bg-white">
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
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Stream Name</Label>
                          <Input
                            className="bg-white"
                            placeholder="e.g., A, B, C, D"
                            value={newStreamName}
                            onChange={(e) => setNewStreamName(e.target.value.toUpperCase())}
                            required
                          />
                          <p className="text-xs text-gray-400">Stream names are typically letters (A, B, C) or numbers (1, 2, 3)</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setStreamDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={streamLoading} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                          {streamLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Stream"}
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
                        <TableHead>Stream Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="text-right w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {streams.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <Layers className="h-12 w-12 text-gray-300" />
                              <p className="text-gray-500">No streams found</p>
                              <p className="text-sm text-gray-400">Create classes first, then add streams.</p>
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
                                <span className="font-semibold text-gray-800">Stream {stream.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <School className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-sm text-gray-600">{stream.class_name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditStreamDialog(stream)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStream(stream.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Class
            </DialogTitle>
            <DialogDescription>
              Update the class name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="editClassName" className="text-sm font-semibold text-gray-700">Class Name</Label>
            <Input
              id="editClassName"
              className="mt-2 bg-white"
              value={editClassName}
              onChange={(e) => setEditClassName(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditClassDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateClass} disabled={classLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              {classLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Stream Dialog */}
      <Dialog open={editStreamDialogOpen} onOpenChange={setEditStreamDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-purple-600" />
              Edit Stream
            </DialogTitle>
            <DialogDescription>
              Update the stream name or class.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Class</Label>
              <Select value={editStreamClassId} onValueChange={setEditStreamClassId}>
                <SelectTrigger className="bg-white">
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
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Stream Name</Label>
              <Input
                className="bg-white"
                value={editStreamName}
                onChange={(e) => setEditStreamName(e.target.value.toUpperCase())}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStreamDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStream} disabled={streamLoading} className="bg-gradient-to-r from-purple-600 to-pink-600">
              {streamLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
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