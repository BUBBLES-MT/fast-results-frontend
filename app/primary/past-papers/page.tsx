// app/primary/past-papers/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { 
  Loader2, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
  Eye,
  TrendingUp,
  Upload,
  School,
  Filter,
  X
} from "lucide-react"
import Link from "next/link"

interface PastPaper {
  id: number
  title: string
  subject: string
  exam_type: string
  year: number
  class_level: string
  school_level: string
  file_url: string
  file_name: string
  file_size: number
  description: string
  school_name: string
  downloads: number
  created_at: string
}

interface Subject {
  id: number
  name: string
  code: string
  level?: string
}

// 🔥 PRIMARY SCHOOL EXAM TYPES
const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "NATIONAL"]

// 🔥 PRIMARY CLASS LEVELS (Std 1 - 7)
const CLASS_LEVELS = {
  primary: ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"],
}

export default function PrimaryPastPapersPage() {
  const router = useRouter()
  const [papers, setPapers] = useState<PastPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userSchoolLevel, setUserSchoolLevel] = useState("primary")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterYear, setFilterYear] = useState("")
  const [filterExamType, setFilterExamType] = useState("all")
  // 🔥 DEFAULT: primary kwa primary users
  const [filterSchoolLevel, setFilterSchoolLevel] = useState("primary")
  
  const [openUpload, setOpenUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    exam_type: "",
    year: new Date().getFullYear(),
    class_level: "",
    school_level: "primary",
    description: "",
    file: null as File | null,
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const schoolLevel = localStorage.getItem("school_level") || "primary"
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    setToken(storedToken)
    setUserRole(role || "")
    setUserSchoolLevel(schoolLevel)
    setFilterSchoolLevel(schoolLevel)
    setFormData(prev => ({ ...prev, school_level: schoolLevel }))
    
    fetchPastPapers(storedToken)
    fetchMySubjects(storedToken)
  }, [router])

  // 🔥 FETCH PAST PAPERS - "all" inamaanisha primary zote
  const fetchPastPapers = async (authToken: string) => {
    try {
      const params = new URLSearchParams()
      if (filterSubject) params.append("subject", filterSubject)
      if (filterYear) params.append("year", filterYear)
      if (filterExamType && filterExamType !== "all") params.append("exam_type", filterExamType)
      
      // 🔥 "all" inamaanisha primary zote, vinginevyo primary
      if (filterSchoolLevel === "all") {
        params.append("school_level", "primary")
      } else if (filterSchoolLevel) {
        params.append("school_level", filterSchoolLevel)
      }
      
      const url = `/api/v1/past-papers${params.toString() ? `?${params}` : ""}`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch past papers")
      const data = await response.json()
      
      setPapers(data.papers || data || [])
    } catch (err) {
      setError("Imeshindwa kupakia mitihani iliyopita")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 FETCH TEACHER'S SUBJECTS ONLY (for adding)
  const fetchMySubjects = async (authToken: string) => {
    setLoadingSubjects(true)
    try {
      const response = await fetch("/api/v1/past-papers/my-subjects", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSubjects(data.subjects || [])
        if (data.subjects && data.subjects.length > 0) {
          setFormData(prev => ({ ...prev, subject: data.subjects[0].name }))
        }
      } else {
        setSubjects([])
      }
    } catch (err) {
      console.error("Error fetching subjects:", err)
      setSubjects([])
    } finally {
      setLoadingSubjects(false)
    }
  }

  // 🔥 Refetch when filters change
  useEffect(() => {
    if (token) {
      fetchPastPapers(token)
    }
  }, [filterSubject, filterYear, filterExamType, filterSchoolLevel])

  // 🔥 School Level Options - Primary tu
  const getSchoolLevelOptions = () => {
    return [
      { value: "all", label: "🏫 Shule Zote za Msingi" },
      { value: "primary", label: "🏫 Primary" }
    ]
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.file) {
      setError("Tafadhali chagua faili")
      return
    }
    
    const maxSize = 10 * 1024 * 1024
    if (formData.file.size > maxSize) {
      setError(`Faili kubwa sana! Ukubwa wa juu ni 10MB. Faili yako ni ${(formData.file.size / (1024 * 1024)).toFixed(2)}MB`)
      return
    }
    
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
    if (!allowedTypes.includes(formData.file.type)) {
      setError("Aina ya faili hairuhusiwi! Tafadhali pakia PDF, DOC, DOCX, au TXT pekee.")
      return
    }
    
    setUploading(true)
    setError("")
    
    const formDataObj = new FormData()
    formDataObj.append("title", formData.title)
    formDataObj.append("subject", formData.subject)
    formDataObj.append("exam_type", formData.exam_type)
    formDataObj.append("year", formData.year.toString())
    formDataObj.append("class_level", formData.class_level)
    formDataObj.append("school_level", formData.school_level || userSchoolLevel)
    if (formData.description) formDataObj.append("description", formData.description)
    formDataObj.append("file", formData.file)
    
    try {
      const response = await fetch("/api/v1/past-papers/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Imeshindwa kupakia")
      }
      
      setOpenUpload(false)
      setSuccess("Mtihani uliopita umepakiwa kikamilifu! ✅")
      setTimeout(() => setSuccess(""), 3000)
      setFormData({
        title: "",
        subject: subjects.length > 0 ? subjects[0].name : "",
        exam_type: "",
        year: new Date().getFullYear(),
        class_level: "",
        school_level: userSchoolLevel,
        description: "",
        file: null,
      })
      fetchPastPapers(token)
    } catch (err: any) {
      setError(err.message || "Imeshindwa kupakia mtihani uliopita")
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (paper: PastPaper) => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/v1/past-papers/${paper.id}/download`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Download failed: ${response.status} - ${errorText}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = paper.file_name || `past_paper_${paper.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setSuccess(`Imepakuliwa: ${paper.title}`)
      setTimeout(() => setSuccess(""), 3000)
      fetchPastPapers(token)
      
    } catch (err: any) {
      console.error("Download error:", err)
      setError(err.message || "Imeshindwa kupakua faili. Tafadhali jaribu tena.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kufuta mtihani huu uliopita?")) return
    try {
      await fetch(`/api/v1/past-papers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Mtihani uliopita umefutwa kikamilifu! ✅")
      setTimeout(() => setSuccess(""), 3000)
      fetchPastPapers(token)
    } catch (err) {
      setError("Imeshindwa kufuta")
    }
  }

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // 🔥 Primary School Roles
  const canUpload = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"].includes(userRole)
  const canDelete = userRole === "Superadmin"

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-teal-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-green-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia mitihani iliyopita...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn">
        {/* 🔥 Header Section - Primary School Colors (Green/Teal) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 via-teal-700 to-emerald-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">📚 Mitihani Iliyopita</h1>
            <p className="text-green-100 max-w-2xl">
              Tazama, pakua, na shiriki mitihani iliyopita kutoka shule za msingi Tanzania.
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
            <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header with Upload Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {filterSchoolLevel === "all" ? "📄 Mitihani Yote ya Msingi" : "📄 Mitihani ya Msingi"}
            </h2>
            <p className="text-sm text-gray-500">
              {filterSchoolLevel === "all" ? "Kuonyesha shule zote za msingi" : "Kuonyesha shule za msingi"}
            </p>
          </div>
          <div className="flex gap-2">
            {canUpload && (
              <Dialog open={openUpload} onOpenChange={setOpenUpload}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-4 w-4" />
                    Pakia Mtihani
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      Pakia Mtihani Uliopita
                    </DialogTitle>
                    <DialogDescription>
                      Shiriki mitihani iliyopita. Unaweza kupakia tu kwa masomo unayofundisha.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Jina la Mtihani *</Label>
                        <Input
                          className="col-span-3 bg-white"
                          placeholder="mfano: Hesabu Std 7 Midterm 2024"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Somo *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger className="col-span-3 bg-white">
                            <SelectValue placeholder="Chagua somo" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {loadingSubjects ? (
                              <SelectItem value="loading" disabled>Inapakia masomo...</SelectItem>
                            ) : subjects.length === 0 ? (
                              <SelectItem value="none" disabled>Hakuna masomo uliyopangiwa</SelectItem>
                            ) : (
                              subjects.map((subj) => (
                                <SelectItem key={subj.id} value={subj.name}>
                                  {subj.name} {subj.code && `(${subj.code})`}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-400 col-span-3 col-start-2">
                          📌 Unaweza kupakia tu kwa masomo unayofundisha
                        </p>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Aina ya Mtihani *</Label>
                        <Select
                          value={formData.exam_type}
                          onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                        >
                          <SelectTrigger className="col-span-3 bg-white">
                            <SelectValue placeholder="Chagua aina" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {EXAM_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Mwaka *</Label>
                        <Input
                          type="number"
                          className="col-span-3 bg-white"
                          placeholder="mfano: 2024"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Darasa *</Label>
                        <Select
                          value={formData.class_level}
                          onValueChange={(value) => setFormData({ ...formData, class_level: value })}
                        >
                          <SelectTrigger className="col-span-3 bg-white">
                            <SelectValue placeholder="Chagua darasa" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {CLASS_LEVELS.primary.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Faili *</Label>
                        <Input
                          type="file"
                          className="col-span-3 bg-white"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                          required
                        />
                        <p className="text-xs text-gray-400 col-span-3 col-start-2">PDF, DOC, DOCX, TXT pekee (Upeo 10MB)</p>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Maelezo</Label>
                        <Textarea
                          className="col-span-3 bg-white"
                          placeholder="Maelezo ya ziada kuhusu mtihani huu"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setOpenUpload(false)}>
                        Ghairi
                      </Button>
                      <Button type="submit" disabled={uploading || subjects.length === 0} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                        {uploading ? "Inapakia..." : "Pakia Mtihani"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Filters Card */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tafuta kwa jina au somo..."
                  className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Input
                placeholder="Chuja kwa somo"
                className="bg-white/80 backdrop-blur-sm border-gray-200"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              />
              <Input
                placeholder="Chuja kwa mwaka"
                type="number"
                className="bg-white/80 backdrop-blur-sm border-gray-200"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger className="bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue placeholder="Chuja kwa aina" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">📋 Aina Zote</SelectItem>
                  {EXAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* 🔥 School Level Filter - Primary tu */}
              <Select value={filterSchoolLevel} onValueChange={setFilterSchoolLevel}>
                <SelectTrigger className="bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue placeholder="Chuja kwa aina ya shule" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {getSchoolLevelOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setFilterSubject("")
                  setFilterYear("")
                  setFilterExamType("all")
                  setFilterSchoolLevel(userSchoolLevel)
                  setSearchTerm("")
                  fetchPastPapers(token)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Ondoa Vichujio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Past Papers Table */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              {filterSchoolLevel === "all" ? "Mitihani Yote ya Msingi" : "Mitihani ya Msingi"}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredPapers.length} {filteredPapers.length === 1 ? 'mtihani' : 'mitihani'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Jina la Mtihani</TableHead>
                    <TableHead>Somo</TableHead>
                    <TableHead>Aina</TableHead>
                    <TableHead>Mwaka</TableHead>
                    <TableHead>Darasa</TableHead>
                    <TableHead className="text-center">Imepakuliwa</TableHead>
                    <TableHead>Shule</TableHead>
                    <TableHead className="text-right w-24">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPapers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="h-12 w-12 text-gray-300" />
                          <p className="text-gray-500">Hakuna mitihani iliyopita</p>
                          <p className="text-sm text-gray-400">Jaribu kubadilisha vichujio au pakia mtihani mpya!</p>
                          {canUpload && (
                            <Button 
                              onClick={() => setOpenUpload(true)}
                              className="mt-2 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
                            >
                              <Plus className="h-4 w-4" />
                              Pakia Mtihani wa Kwanza
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPapers.map((paper) => (
                      <TableRow key={paper.id} className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-teal-50/50 transition-all duration-200 group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-gray-800">{paper.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {paper.subject}
                          </span>
                        </TableCell>
                        <TableCell>{paper.exam_type}</TableCell>
                        <TableCell className="font-mono">{paper.year}</TableCell>
                        <TableCell>{paper.class_level}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Download className="h-3 w-3 text-gray-400" />
                            <span className="font-semibold">{paper.downloads}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <School className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600">{paper.school_name || "Shule isiyojulikana"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(paper)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Pakua"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(paper.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Futa"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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

        {/* Info Box - Primary */}
        <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-r from-green-50 to-teal-50">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" />
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              Kuhusu Mitihani Iliyopita
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold mt-0.5">1</div>
                <div>
                  <span className="font-medium text-gray-700">Tazama & Pakua</span>
                  <p className="text-xs text-gray-500">Walimu na wanafunzi wote wanaweza kuona na kupakua mitihani kutoka shule zote</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold mt-0.5">2</div>
                <div>
                  <span className="font-medium text-gray-700">Pakia</span>
                  <p className="text-xs text-gray-500">Walimu wanaweza kupakia tu mitihani kwa masomo wanayofundisha</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold mt-0.5">3</div>
                <div>
                  <span className="font-medium text-gray-700">Ushirikiano</span>
                  <p className="text-xs text-gray-500">Mitihani inashirikiwa kwa shule zote kwa ajili ya kujifunza pamoja</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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