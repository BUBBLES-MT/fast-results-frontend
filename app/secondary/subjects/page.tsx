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
  AlertCircle
} from "lucide-react"

interface School {
  id: number
  name: string
}

interface Subject {
  id: number
  name: string
  code: string | null
  school_id: number
}

export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
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

  const fetchSubjects = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/subjects", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setSubjects(response.data)
    } catch (err) {
      console.error("Error fetching subjects:", err)
      setError("Failed to load subjects")
    } finally {
      setLoading(false)
    }
  }

  const fetchSchools = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/schools", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setSchools(response.data)
    } catch (err) {
      console.error("Error fetching schools:", err)
    }
  }

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError("")
    try {
      await axios.post("/api/v1/subjects", formData, {
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
      fetchSubjects(token)
    } catch (err: any) {
      console.error("Error creating subject:", err)
      setError(err.response?.data?.detail || "Failed to create subject")
    } finally {
      setAdding(false)
    }
  }

  const handleUpdateSubject = async () => {
    if (!editingSubject) return
    setUpdating(true)
    setError("")
    try {
      await axios.put(`/api/v1/subjects/${editingSubject.id}`, {
        name: editName,
        code: editCode,
        school_id: editingSubject.school_id,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOpenEdit(false)
      setEditingSubject(null)
      fetchSubjects(token)
    } catch (err: any) {
      console.error("Error updating subject:", err)
      setError(err.response?.data?.detail || "Failed to update subject")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subject?")) return
    try {
      await axios.delete(`/api/v1/subjects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchSubjects(token)
    } catch (err) {
      console.error("Error deleting subject:", err)
      setError("Failed to delete subject")
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
    return school ? school.name : "Unknown"
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Loading subjects...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">
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
            <h1 className="text-3xl font-bold mb-2">Subjects Management</h1>
            <p className="text-blue-100 max-w-2xl">
              Manage all subjects offered in your school. Add, edit, or remove subjects as needed.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by subject name..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Add New Subject
                </DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new subject to your school.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubject}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Subject Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Mathematics, English, Biology"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-semibold text-gray-700">
                      Subject Code
                    </Label>
                    <Input
                      id="code"
                      placeholder="e.g., MATH, ENG, BIO"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <p className="text-xs text-gray-400">Optional short code for the subject</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_id" className="text-sm font-semibold text-gray-700">
                      School <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.school_id.toString()}
                      onValueChange={(value) => setFormData({ ...formData, school_id: parseInt(value) })}
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select school" />
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
                  <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={adding} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {adding ? "Saving..." : "Save Subject"}
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
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Subjects List
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredSubjects.length} {filteredSubjects.length === 1 ? 'subject' : 'subjects'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-16 text-center">#</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead className="text-right w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">No subjects found</p>
                          <p className="text-sm text-gray-400">Click "Add Subject" to create one.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubjects.map((subject, index) => (
                      <TableRow key={subject.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-colors group">
                        <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                        <TableCell className="font-semibold text-gray-800">
                          {subject.name}
                        </TableCell>
                        <TableCell>
                          {subject.code ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
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
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubject(subject.id)}
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
      </div>

      {/* Edit Subject Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Subject
            </DialogTitle>
            <DialogDescription>
              Update the subject name and code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">
                Subject Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-sm font-semibold text-gray-700">
                Subject Code
              </Label>
              <Input
                id="edit-code"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="e.g., MATH, ENG, BIO"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubject} disabled={updating} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {updating ? "Updating..." : "Update Subject"}
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