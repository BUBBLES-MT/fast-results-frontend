"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
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
import { Loader2, FileText, Download, Sparkles, BookOpen, GraduationCap } from "lucide-react"

function detailFromBody(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = (data as { detail?: unknown }).detail
  if (typeof d === "string") return d
  if (d != null && typeof d === "object") {
    try {
      return JSON.stringify(d)
    } catch {
      return fallback
    }
  }
  return fallback
}

function formatApiError(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data
  return detailFromBody(data, fallback)
}

export default function AIExamPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [examContent, setExamContent] = useState("")
  const [markingScheme, setMarkingScheme] = useState("")
  const [showMarking, setShowMarking] = useState(false)
  const [markingWarning, setMarkingWarning] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    class_level: "",
    num_questions: 10,
    exam_type: "Midterm",
    school_level: "secondary",
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
      return
    }
    setToken(storedToken)
  }, [router])

  const handleGenerateExam = async (e: React.FormEvent) => {
  e.preventDefault()

  setLoading(true)
  setError("")
  setExamContent("")
  setMarkingScheme("")
  setShowMarking(false)
  setMarkingWarning("")

  const billingHint =
    "OpenAI: hakuna salio au billing haijawashwa. Angalia https://platform.openai.com/account/billing"

  try {
    // validateStatus: usitupe AxiosError kwa 429/503 — uonyeshe ujumbe kwenye UI bila kelele ya console
    const response = await axios.post(
      "/api/v1/ai-exam/generate-exam",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    )

    if (response.status !== 200) {
      setError(detailFromBody(response.data, billingHint))
      return
    }

    if (response.data.success) {
      setExamContent(response.data.exam_content || "")
      const ms = response.data.marking_scheme as string | undefined
      if (ms) {
        setMarkingScheme(ms)
        setShowMarking(true)
        setMarkingWarning("")
      } else {
        setMarkingScheme("")
        setShowMarking(false)
        const note = response.data.marking_scheme_note as string | undefined
        const msErr = response.data.marking_scheme_error as string | undefined
        setMarkingWarning(note || msErr || "")
      }
    } else {
      setError(response.data.error || "Failed to generate exam")
    }
  } catch (err: unknown) {
    console.error("AI exam generate error:", err)
    setError(formatApiError(err, billingHint))
  } finally {
    setLoading(false)
  }
}



  const handleGenerateMarkingScheme = async () => {
    if (!examContent) return
    
    setLoading(true)
    setError("")

    try {
      const response = await axios.post(
        "/api/v1/ai-exam/generate-marking-scheme",
        { exam_content: examContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: () => true,
        }
      )

      if (response.status !== 200) {
        setError(
          detailFromBody(
            response.data,
            "Marking scheme haikutengenezwa. Angalia OpenAI billing au jaribu tena."
          )
        )
        return
      }

      if (response.data.success) {
        setMarkingScheme(response.data.marking_scheme)
        setShowMarking(true)
        setMarkingWarning("")
      } else {
        setError(response.data.error || "Failed to generate marking scheme")
      }
    } catch (err: unknown) {
      console.error("Marking scheme error:", err)
      setError(formatApiError(err, "Failed to generate marking scheme."))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleNumberChange = (value: string) => {
    const intValue = parseInt(value)
    if (value === "") {
      setFormData({ ...formData, num_questions: 10 })
    } else if (!isNaN(intValue)) {
      const clamped = Math.min(50, Math.max(1, intValue))
      setFormData({ ...formData, num_questions: clamped })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_type")
    localStorage.removeItem("user_name")
    router.push("/login")
  }

  const getSchoolLevelLabel = (level: string) => {
    switch (level) {
      case "primary": return "Primary School"
      case "secondary": return "Secondary School"
      case "advanced": return "Advanced Level"
      default: return level
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              School Management System
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI Powered Exam Generator</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Exams Instantly</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate a professional exam and its marking scheme in one step. Fill in subject, topic, and class level — AI returns both documents when possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Exam Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleGenerateExam} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, English, Biology"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="border-gray-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-gray-700 font-medium">Topic *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Algebra, Grammar, Photosynthesis"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    className="border-gray-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class_level" className="text-gray-700 font-medium">Class Level *</Label>
                  <Input
                    id="class_level"
                    placeholder="e.g., Form 3, Std 5, Form 6"
                    value={formData.class_level}
                    onChange={(e) =>
                      setFormData({ ...formData, class_level: e.target.value })
                    }
                    className="border-gray-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="num_questions" className="text-gray-700 font-medium">Number of Questions</Label>
                    <Input
                      id="num_questions"
                      type="text"
                      placeholder="10"
                      value={formData.num_questions}
                      onChange={(e) => handleNumberChange(e.target.value)}
                      className="border-gray-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exam_type" className="text-gray-700 font-medium">Exam Type</Label>
                    <Select
                     name="exam_type"
                      value={formData.exam_type}
                       onValueChange={(value) =>
                          setFormData({ ...formData, exam_type: value })
                         }
                          >
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Midterm">Midterm Exam</SelectItem>
                        <SelectItem value="Terminal">Terminal Exam</SelectItem>
                        <SelectItem value="Annual">Annual Exam</SelectItem>
                        <SelectItem value="Test">Test</SelectItem>
                        <SelectItem value="Quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_level" className="text-gray-700 font-medium">School Level</Label>
                  <Select
                    name="school_level"
                    value={formData.school_level}
                    onValueChange={(value) =>
                     setFormData({ ...formData, school_level: value })
                       }
                       >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select school level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">🏫 Primary School (Std 1-7)</SelectItem>
                      <SelectItem value="secondary">📚 Secondary School (Form 1-4)</SelectItem>
                      <SelectItem value="advanced">🎓 Advanced Level (Form 5-6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating exam &amp; marking scheme...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate exam + marking scheme
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {!examContent && !loading && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Create Exams</h3>
                  <p className="text-gray-500 text-sm">
                    Fill in the details on the left and click &quot;Generate exam + marking scheme&quot;.
                    <br />
                    Mtihani na mfumo wa alama utajitokeza hapa endapo OpenAI iwe tayari.
                  </p>
                </CardContent>
              </Card>
            )}

            {examContent && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-xl flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generated Exam
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(examContent, `exam_${formData.subject}_${Date.now()}.txt`)}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {markingWarning && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-3 rounded-lg">
                      <strong>Marking scheme:</strong> {markingWarning}
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                      {examContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {examContent && (!markingScheme || markingWarning) && (
              <Button
                onClick={handleGenerateMarkingScheme}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating marking scheme...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    {markingScheme ? "Regenerate marking scheme" : "Generate marking scheme only"}
                  </>
                )}
              </Button>
            )}

            {showMarking && markingScheme && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-xl flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Marking Scheme
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(markingScheme, `marking_scheme_${formData.subject}_${Date.now()}.txt`)}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                      {markingScheme}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Pro Tips for Better Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>✨ Be specific with the topic for more focused questions</li>
                <li>📚 Choose appropriate school level for age-appropriate content</li>
                <li>🔢 Adjust number of questions based on exam duration</li>
              </ul>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>📝 Mtihani na marking scheme hutoka pamoja; ukitaka unaweza kutengeneza marking scheme tena peke yake</li>
                <li>💾 Download exams as text files for printing</li>
                <li>🔄 You can regenerate with different parameters anytime</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}