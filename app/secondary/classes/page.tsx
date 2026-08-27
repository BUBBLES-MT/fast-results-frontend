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
}

interface Class {
  id: number
  name: string
  school_id: number
  school_name?: string
}

export default function ClassesPage() {
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

  const fetchClasses = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/classes", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setClasses(response.data)
    } catch (err) {
      console.error("Error fetching classes:", err)
      setError("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  const fetchSchools = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/schools", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setSchools(response.data)
    } catch (err) {
      console.error("Error fetching schools:", err)
    }
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError("")
    try {
      await axios.post("/api/v1/classes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setOpen(false)
      setFormData({ name: "", school_id: 1 })
      setSuccess("Class created successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
    } catch (err: any) {
      console.error("Error creating class:", err)
      setError(err.response?.data?.detail || "Failed to create class")
    } finally {
      setAdding(false)
    }
  }

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClass) return
    setAdding(true)
    setError("")
    try {
      await axios.put(`/api/v1/classes/${editingClass.id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setEditOpen(false)
      setEditingClass(null)
      setSuccess("Class updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
    } catch (err: any) {
      console.error("Error updating class:", err)
      setError(err.response?.data?.detail || "Failed to update class")
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteClass = async (id: number) => {
    if (!confirm("Are you sure you want to delete this class? This will also delete all students and marks in this class!")) return
    try {
      await axios.delete(`/api/v1/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Class deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
      fetchClasses(token)
    } catch (err) {
      console.error("Error deleting class:", err)
      setError("Failed to delete class")
    }
  }

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls)
    setEditFormData({
      name: cls.name,
      school_id: cls.school_id,
    })
    setEditOpen(true)
  }

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
                <School className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Classes Management</h1>
            <p className="text-blue-100 max-w-2xl">
              Manage all classes in your school. Classes are the main organizational units for students, subjects, and teachers.
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
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all">
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
                  Fill in the details to add a new class to your school.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateClass}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right font-semibold">
                      Class Name *
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3 bg-white"
                      placeholder="e.g., Form 1, Form 2, Std 1, etc."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="school_id" className="text-right font-semibold">
                      School *
                    </Label>
                    <Select
                      value={formData.school_id.toString()}
                      onValueChange={(value) => setFormData({ ...formData, school_id: parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3 bg-white">
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
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={adding} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {adding ? "Creating..." : "Create Class"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Table */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              Classes List
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({classes.length} {classes.length === 1 ? 'class' : 'classes'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Class Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1"
                              title="Edit Class"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClass(cls.id)}
                              className="gap-1"
                              title="Delete Class"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Delete</span>
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
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Class
            </DialogTitle>
            <DialogDescription>
              Update the class details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClass}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right font-semibold">
                  Class Name *
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3 bg-white"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-school_id" className="text-right font-semibold">
                  School *
                </Label>
                <Select
                  value={editFormData.school_id.toString()}
                  onValueChange={(value) => setEditFormData({ ...editFormData, school_id: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3 bg-white">
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
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={adding} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {adding ? "Updating..." : "Update Class"}
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