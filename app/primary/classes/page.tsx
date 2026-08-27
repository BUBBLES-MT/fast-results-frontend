"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
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
import { MainLayout } from "@/components/layout/MainLayout"
import { 
  Plus, 
  Trash2, 
  Loader2,
  School,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Layers,
  Edit
} from "lucide-react"

interface School {
  id: number
  name: string
  school_type: string
  school_level: string  // 🔥 ADDED
}

interface Class {
  id: number
  name: string
  school_id: number
  school_name?: string
}

export default function MadarasaPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    school_id: 1,
  })
  const [editFormData, setEditFormData] = useState({
    name: "",
    school_id: 1,
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    setToken(storedToken)
    setUserRole(role || "")
    fetchClasses(storedToken)
    fetchSchools(storedToken)
  }, [router])

  // 🔥 BADILISHA: TUMIA PRIMARY API KWA CLASSES
  const fetchClasses = async (authToken: string) => {
    try {
      // ✅ TUMIA API YA PRIMARY
      const response = await axios.get("/api/v1/primary/classes", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setClasses(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching classes:", err)
      setError("Imeshindwa kupakia madarasa")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 BADILISHA: PATA SHULE ZA PRIMARY PEKEE
  const fetchSchools = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/schools", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      // 🔥 CHUJA SHULE ZA PRIMARY PEKEE
      const primarySchools = response.data.filter(
        (school: School) => school.school_level === "primary" || school.school_type === "primary"
      )
      setSchools(primarySchools)
    } catch (err) {
      console.error("Error fetching schools:", err)
    }
  }

  // 🔥 BADILISHA: TUMIA PRIMARY API
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError("")
    setSuccess("")
    try {
      // ✅ TUMIA API YA PRIMARY
      await axios.post("/api/v1/primary/classes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setOpen(false)
      setFormData({ name: "", school_id: 1 })
      setSuccess("Darasa limeongezwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
    } catch (err: any) {
      console.error("Error creating class:", err)
      setError(err.response?.data?.detail || "Imeshindwa kuongeza darasa")
    } finally {
      setAdding(false)
    }
  }

  // 🔥 BADILISHA: TUMIA PRIMARY API
  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClass) return
    setEditing(true)
    setError("")
    setSuccess("")
    try {
      // ✅ TUMIA API YA PRIMARY
      await axios.put(`/api/v1/primary/classes/${editingClass.id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setEditOpen(false)
      setEditingClass(null)
      setSuccess("Darasa limebadilishwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
    } catch (err: any) {
      console.error("Error updating class:", err)
      setError(err.response?.data?.detail || "Imeshindwa kusasisha darasa")
    } finally {
      setEditing(false)
    }
  }

  // 🔥 BADILISHA: TUMIA PRIMARY API
  const handleDeleteClass = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kufuta darasa hili? Hii itafuta pia wanafunzi na alama zote katika darasa hili!")) return
    try {
      // ✅ TUMIA API YA PRIMARY
      await axios.delete(`/api/v1/primary/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Darasa limefutwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
    } catch (err) {
      console.error("Error deleting class:", err)
      setError("Imeshindwa kufuta darasa")
    }
  }

  // Open edit dialog
  const openEditDialog = (cls: Class) => {
    setEditingClass(cls)
    setEditFormData({
      name: cls.name,
      school_id: cls.school_id,
    })
    setEditOpen(true)
  }

  // Get school name by ID
  const getSchoolName = (schoolId: number) => {
    const school = schools.find(s => s.id === schoolId)
    return school ? school.name : "Haijulikani"
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
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <School className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Usimamizi wa Madarasa</h1>
            <p className="text-sky-100 max-w-2xl">
              Simamia madarasa yote ya shule ya msingi. Madarasa ni nguzo kuu za shirika kwa wanafunzi, masomo na walimu.
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

        {/* Add Class Button */}
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl">
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
                  Jaza taarifa ili kuongeza darasa jipya kwa shule ya msingi.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateClass}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right font-semibold">
                      Jina la Darasa *
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3 bg-white rounded-xl"
                      placeholder="Mfano: Darasa la 1, Darasa la 2, n.k."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="school_id" className="text-right font-semibold">
                      Shule *
                    </Label>
                    <Select
                      value={formData.school_id.toString()}
                      onValueChange={(value) => setFormData({ ...formData, school_id: parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3 bg-white rounded-xl">
                        <SelectValue placeholder="Chagua shule" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.length === 0 ? (
                          <SelectItem value="none" disabled>Hakuna shule za msingi</SelectItem>
                        ) : (
                          schools.map((school) => (
                            <SelectItem key={school.id} value={school.id.toString()}>
                              {school.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                    Ghairi
                  </Button>
                  <Button type="submit" disabled={adding} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {adding ? "Inaongeza..." : "Ongeza Darasa"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Table */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-sky-600" />
              Orodha ya Madarasa
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({classes.length} {classes.length === 1 ? 'darasa' : 'madarasa'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Jina la Darasa</TableHead>
                    <TableHead>Shule</TableHead>
                    <TableHead className="text-right">Vitendo</TableHead>
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
                    classes.map((cls, idx) => (
                      <TableRow key={cls.id} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group">
                        <TableCell className="text-gray-500">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                              {cls.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{cls.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <School className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600">{getSchoolName(cls.school_id)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(cls)}
                              className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 border-sky-200 gap-1 rounded-xl"
                              title="Hariri Darasa"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Hariri</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClass(cls.id)}
                              className="gap-1 rounded-xl"
                              title="Futa Darasa"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Futa</span>
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
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-sky-600" />
              Hariri Darasa
            </DialogTitle>
            <DialogDescription>
              Sasisha taarifa za darasa.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClass}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right font-semibold">
                  Jina la Darasa *
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3 bg-white rounded-xl"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-school_id" className="text-right font-semibold">
                  Shule *
                </Label>
                <Select
                  value={editFormData.school_id.toString()}
                  onValueChange={(value) => setEditFormData({ ...editFormData, school_id: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3 bg-white rounded-xl">
                    <SelectValue placeholder="Chagua shule" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id.toString()}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">
                Ghairi
              </Button>
              <Button type="submit" disabled={editing} className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-xl">
                {editing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {editing ? "Inasasisha..." : "Sasisha Darasa"}
              </Button>
            </DialogFooter>
          </form>
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
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </MainLayout>
  )
}