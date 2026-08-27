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
  Search, 
  Trash2, 
  Edit, 
  Loader2, 
  Save, 
  BookOpen, 
  GraduationCap,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface School {
  id: number
  name: string
  school_level: string  // 🔥 ADDED
}

interface Subject {
  id: number
  name: string
  code: string | null
  school_id: number
}

export default function UsimamiziWaMasomoPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Add Subject state
  const [openAdd, setOpenAdd] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    school_id: 1,
  })
  const [adding, setAdding] = useState(false)
  
  // Edit Subject state
  const [openEdit, setOpenEdit] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editName, setEditName] = useState("")
  const [editCode, setEditCode] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    fetchSubjects(storedToken)
    fetchSchools(storedToken)
  }, [router])

  // 🔥 BADILISHA: TUMIA PRIMARY API
  const fetchSubjects = async (authToken: string) => {
    try {
      // ✅ TUMIA API YA PRIMARY
      const response = await axios.get("/api/v1/primary/subjects", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setSubjects(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching subjects:", err)
      setError("Imeshindwa kupakia masomo")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 BADILISHA: PATA SHULE ZA PRIMARY PEKEE
  const fetchSchools = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/schools", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      // 🔥 CHUJA SHULE ZA PRIMARY PEKEE
      const primarySchools = response.data.filter(
        (school: School) => school.school_level === "primary"
      )
      setSchools(primarySchools)
    } catch (err) {
      console.error("Error fetching schools:", err)
    }
  }

  // 🔥 BADILISHA: TUMIA PRIMARY API
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError("")
    setSuccess("")
    try {
      // ✅ TUMIA API YA PRIMARY
      await axios.post("/api/v1/primary/subjects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setOpenAdd(false)
      setFormData({
        name: "",
        code: "",
        school_id: 1,
      })
      setSuccess("Somo limeongezwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchSubjects(token)
    } catch (err: any) {
      console.error("Error creating subject:", err)
      setError(err.response?.data?.detail || "Imeshindwa kuongeza somo")
    } finally {
      setAdding(false)
    }
  }

  // 🔥 BADILISHA: TUMIA PRIMARY API
  const handleUpdateSubject = async () => {
    if (!editingSubject) return
    setUpdating(true)
    setError("")
    setSuccess("")
    try {
      // ✅ TUMIA API YA PRIMARY
      await axios.put(`/api/v1/primary/subjects/${editingSubject.id}`, {
        name: editName,
        code: editCode,
        school_id: editingSubject.school_id,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOpenEdit(false)
      setEditingSubject(null)
      setSuccess("Somo limebadilishwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchSubjects(token)
    } catch (err: any) {
      console.error("Error updating subject:", err)
      setError(err.response?.data?.detail || "Imeshindwa kusasisha somo")
    } finally {
      setUpdating(false)
    }
  }

  // 🔥 BADILISHA: TUMIA PRIMARY API
  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kufuta somo hili?")) return
    try {
      // ✅ TUMIA API YA PRIMARY
      await axios.delete(`/api/v1/primary/subjects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSuccess("Somo limefutwa kikamilifu!")
      setTimeout(() => setSuccess(""), 3000)
      fetchSubjects(token)
    } catch (err) {
      console.error("Error deleting subject:", err)
      setError("Imeshindwa kufuta somo")
    }
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setEditName(subject.name)
    setEditCode(subject.code || "")
    setOpenEdit(true)
  }

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia masomo...</p>
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
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Usimamizi wa Masomo</h1>
            <p className="text-sky-100 max-w-2xl">
              Simamia masomo yote yanayotolewa shule ya msingi. Ongeza, hariri, au futa masomo inavyohitajika.
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

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tafuta kwa jina la somo..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-500 transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                <Plus className="h-4 w-4" />
                Ongeza Somo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-sky-600" />
                  Ongeza Somo Jipya
                </DialogTitle>
                <DialogDescription>
                  Jaza taarifa ili kuongeza somo jipya shuleni.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubject}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Jina la Somo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Mfano: Hisabati, Kiswahili, Sayansi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-semibold text-gray-700">
                      Msimbo wa Somo
                    </Label>
                    <Input
                      id="code"
                      placeholder="Mfano: HIS, KIS, SAY"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl font-mono"
                    />
                    <p className="text-xs text-gray-400">Msimbo mfupi wa somo (si lazima)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_id" className="text-sm font-semibold text-gray-700">
                      Shule <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.school_id.toString()}
                      onValueChange={(value) => setFormData({ ...formData, school_id: parseInt(value) })}
                    >
                      <SelectTrigger className="bg-white border-gray-200 rounded-xl">
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
                  <Button type="button" variant="outline" onClick={() => setOpenAdd(false)} className="rounded-xl">
                    Ghairi
                  </Button>
                  <Button type="submit" disabled={adding} className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-xl">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {adding ? "Inahifadhi..." : "Hifadhi Somo"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Subjects Table */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-600" />
              Orodha ya Masomo
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredSubjects.length} {filteredSubjects.length === 1 ? 'somo' : 'masomo'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-16 text-center">#</TableHead>
                    <TableHead>Jina la Somo</TableHead>
                    <TableHead className="w-24">Msimbo</TableHead>
                    <TableHead>Shule</TableHead>
                    <TableHead className="text-right w-32">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Hakuna masomo</p>
                          <p className="text-sm text-gray-400">Bonyeza "Ongeza Somo" kuanza.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubjects.map((subject, index) => (
                      <TableRow key={subject.id} className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-colors group">
                        <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                        <TableCell className="font-semibold text-gray-800">
                          {subject.name}
                        </TableCell>
                        <TableCell>
                          {subject.code ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800">
                              {subject.code}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <GraduationCap className="h-3 w-3" />
                            {getSchoolName(subject.school_id)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(subject)}
                              className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubject(subject.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
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
      </div>

      {/* Edit Subject Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-sky-600" />
              Hariri Somo
            </DialogTitle>
            <DialogDescription>
              Sasisha jina na msimbo wa somo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">
                Jina la Somo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-sm font-semibold text-gray-700">
                Msimbo wa Somo
              </Label>
              <Input
                id="edit-code"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl font-mono"
                placeholder="Mfano: HIS, KIS, SAY"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)} className="rounded-xl">
              Ghairi
            </Button>
            <Button onClick={handleUpdateSubject} disabled={updating} className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-xl">
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {updating ? "Inasasisha..." : "Sasisha Somo"}
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
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </MainLayout>
  )
}