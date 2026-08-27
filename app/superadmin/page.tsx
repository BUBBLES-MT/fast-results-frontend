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
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  School,
  Users,
  Calendar,
  DollarSign,
  Lock,
  Unlock,
  LogIn,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Building2,
  Mail,
  Phone,
  MapPin,
  Eye,
  Crown,
  BarChart3,
  Activity,
  Clock,
  Star,
  GraduationCap,
  Loader2,
  Trash2,
  Power,
  PowerOff,
  CalendarPlus,
  CreditCard,
} from "lucide-react"

interface School {
  id: number
  name: string
  school_type: string
  email: string | null
  phone: string | null
  address: string | null
  region: string | null
  district: string | null
  is_active: boolean
  status: string
  subscription_plan: string | null
  subscription_expires_at: string | null
  is_locked_by_superadmin: boolean
  created_at: string
}

interface Stats {
  total_schools: number
  active_schools: number
  expired_schools: number
  locked_schools: number
  total_teachers: number
  total_students: number
}

// ============================================================
// 🔥 REGIONS ZA TANZANIA
// ============================================================
const REGIONS = [
  "ARUSHA", "DAR ES SALAAM", "DODOMA", "GEITA", "IRINGA", "KAGERA",
  "KATAVI", "KIGOMA", "KILIMANJARO", "LINDI", "MANYARA", "MARA",
  "MBEYA", "MOROGORO", "MTWARA", "MWANZA", "NJOMBE", "PWANI",
  "RUKWA", "RUVUMA", "SHINYANGA", "SIMIYU", "SINGIDA", "SONGWE",
  "TABORA", "TANGA", "ZANZIBAR NORTH", "ZANZIBAR SOUTH", "ZANZIBAR WEST"
]

const DISTRICTS_BY_REGION: Record<string, string[]> = {
  "ARUSHA": ["ARUSHA DC", "ARUSHA CC", "KARATU", "MERU", "LONGIDO", "MONDULI", "NGORONGORO"],
  "DAR ES SALAAM": ["ILALA", "KINONDONI", "TEMEKE", "UBUNGO", "KIGAMBONI"],
  "DODOMA": ["DODOMA DC", "KONDOA", "MPWAPWA", "BAHI", "CHAMWINO"],
  "GEITA": ["GEITA", "CHATO", "MBOGWE", "NYAMAHANGA"],
  "IRINGA": ["IRINGA DC", "IRINGA CC", "MUFEZI", "KILOLO", "MAFINGA", "NJOMBE"],
  "KAGERA": ["BUKOBA DC", "BUKOBA MC", "MULEBA", "KARAGWE", "NGARA", "MISENYI"],
  "KATAVI": ["MPANDA", "TANGANYIKA", "KAJUNGU", "KAVI", "KANJELE"],
  "KIGOMA": ["KIGOMA", "KASULU", "KIBONDO", "KAKONKO", "BUHIGWE", "UYINZA"],
  "KILIMANJARO": ["MOSHI DC", "MOSHI MC", "MOCHE", "ROMBO", "HAI", "MWANGA", "SAME"],
  "LINDI": ["LINDI", "KILWA", "NACHINGWEA", "LIWALE", "MTWARA"],
  "MANYARA": ["BABATI", "SIMANJIRO", "MTO WA MBU", "KITETO", "HANANG"],
  "MARA": ["MUSOMA", "BUNDA", "TARIME", "SERENGETI", "RORYA"],
  "MBEYA": ["MBEYA DC", "MBEYA CC", "RUNEWE", "MBOZI", "CHUNYA", "KYELA", "RUNGWE"],
  "MOROGORO": ["MOROGORO DC", "MOROGORO MC", "KILOMBERO", "ULANGA", "MVOMERO", "KIBATI", "KILOSA"],
  "MTWARA": ["MTWARA DC", "MTWARA MC", "MASASI", "MNAZI", "TANDAHIMBA", "NYASA"],
  "MWANZA": ["MWANZA DC", "MWANZA CC", "MISUNGWI", "SENGEREMA", "UKEREWE", "NYAMAGANA"],
  "NJOMBE": ["NJOMBE DC", "NJOMBE MC", "MAKAMBAKO", "LUDENDA", "IPAWALA"],
  "PWANI": ["KISARAWE", "BAGAMOYO", "MKOANI", "RUFIJI", "KIBITI", "DONDO"],
  "RUKWA": ["SUMBAWANGA", "MPANDA", "KALAMBO", "NKAZI", "LAKE"],
  "RUVUMA": ["SONGEA", "MINGOYO", "TUNDURU", "MADABA", "NYASA"],
  "SHINYANGA": ["SHINYANGA DC", "SHINYANGA MC", "KAHAMA", "NZEGA", "BUSOKA", "UKEREWE"],
  "SIMIYU": ["BARIADI", "MASWA", "MEATU", "BUCHOSA"],
  "SINGIDA": ["SINGIDA DC", "IKUNGI", "MANYONI", "MKALAMA", "MPWAPWA"],
  "SONGWE": ["SONGWE DC", "SONGWE MC", "MAKAMBAKO", "LUDENDA", "IPAWALA"],
  "TABORA": ["TABORA DC", "TABORA MC", "NZEGA", "IGANGA", "SINYANGA", "KIGOMA"],
  "TANGA": ["TANGA DC", "TANGA MC", "MUHEZA", "KOROGWE", "HANDENI", "LUSHOTO", "KILINDI"],
  "ZANZIBAR NORTH": ["KASKAZINI A", "KASKAZINI B"],
  "ZANZIBAR SOUTH": ["KUSINI", "KATI"],
  "ZANZIBAR WEST": ["MJINI", "MAGHARIBI"]
}

// ============================================================
// 🔥 SUBSCRIPTION PLANS
// ============================================================
const SUBSCRIPTION_PLANS = [
  { value: "monthly", label: "Mwezi 1 (siku 30)", days: 30 },
  { value: "quarterly", label: "Miezi 3 (siku 90)", days: 90 },
  { value: "semester", label: "Miezi 6 (siku 180)", days: 180 },
  { value: "annual", label: "Mwaka 1 (siku 365)", days: 365 },
]

// ============================================================
// 🔥 COOKIE MANAGEMENT
// ============================================================
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
}

const setCookie = (name: string, value: string, days: number = 1) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

const clearAllCookies = () => {
  deleteCookie("token")
  deleteCookie("user_type")
  deleteCookie("user_name")
  deleteCookie("user_role")
}

export default function SuperAdminPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  
  // Add School Dialog
  const [openAddSchool, setOpenAddSchool] = useState(false)
  const [addingSchool, setAddingSchool] = useState(false)
  const [newSchool, setNewSchool] = useState({
    name: "",
    school_type: "SECONDARY",
    email: "",
    phone: "",
    address: "",
    region: "",
    district: "",
  })
  
  // Extend Subscription Dialog
  const [openExtendDialog, setOpenExtendDialog] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [subscriptionPlan, setSubscriptionPlan] = useState("monthly")
  const [subscriptionDays, setSubscriptionDays] = useState(30)
  
  // Activate/Deactivate Dialog
  const [openToggleDialog, setOpenToggleDialog] = useState(false)
  const [toggleSchool, setToggleSchool] = useState<School | null>(null)
  const [toggleAction, setToggleAction] = useState<"activate" | "deactivate">("activate")
  const [toggleLoading, setToggleLoading] = useState(false)
  
  // View School Status Dialog
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [statusSchool, setStatusSchool] = useState<any>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUserType = localStorage.getItem("user_type")
    
    if (!storedToken) {
      router.push("/login")
      return
    }
    
    if (storedUserType !== "superadmin" && storedUserType !== "Superadmin") {
      router.push("/dashboard")
      return
    }
    
    setToken(storedToken)
    
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchSchools(storedToken),
          fetchStats(storedToken)
        ])
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [router])

  const fetchSchools = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/superadmin/schools", {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 15000
      })
      setSchools(response.data)
      setError("")
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.")
        localStorage.removeItem("token")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setError(err.response?.data?.detail || err.message || "Failed to load schools")
      }
    }
  }

  const fetchStats = async (authToken: string) => {
    try {
      const response = await axios.get("/api/v1/superadmin/stats", {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 15000
      })
      setStats(response.data)
    } catch (err: any) {
      console.error("Error fetching stats:", err)
      setStats({
        total_schools: schools.length || 0,
        active_schools: 0,
        expired_schools: 0,
        locked_schools: 0,
        total_teachers: 0,
        total_students: 0
      })
    }
  }

  // ============================================================
  // 🔥 ADD SCHOOL
  // ============================================================
  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingSchool(true)
    setError("")
    setSuccess("")
    
    try {
      const response = await axios.post(
        "/api/v1/superadmin/schools",
        newSchool,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess(`School "${newSchool.name}" created successfully!`)
      setTimeout(() => setSuccess(""), 3000)
      setOpenAddSchool(false)
      setNewSchool({
        name: "",
        school_type: "SECONDARY",
        email: "",
        phone: "",
        address: "",
        region: "",
        district: "",
      })
      await fetchSchools(token)
      await fetchStats(token)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create school")
    } finally {
      setAddingSchool(false)
    }
  }

  // ============================================================
  // 🔥 TOGGLE LOCK
  // ============================================================
  const handleToggleLock = async (schoolId: number, isLocked: boolean) => {
    try {
      await axios.put(
        `/api/v1/superadmin/schools/${schoolId}/lock`,
        { is_locked: !isLocked },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess(`School ${!isLocked ? 'locked' : 'unlocked'} successfully!`)
      setTimeout(() => setSuccess(""), 3000)
      await fetchSchools(token)
      await fetchStats(token)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update school status")
    }
  }














  
  // ============================================================
// 🔥 TOGGLE ACTIVE/DEACTIVATE - FIXED!
// ============================================================
const handleToggleActive = async () => {
    if (!toggleSchool) return
    
    setToggleLoading(true)
    setError("")
    setSuccess("")
    
    try {
        const isActive = toggleAction === "activate"
        let response
        
        // ✅ TUMIA ENDPOINT MPYA - ACTIVATE/DEACTIVATE
        if (isActive) {
            response = await axios.put(
                `/api/v1/superadmin/schools/${toggleSchool.id}/activate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } else {
            response = await axios.put(
                `/api/v1/superadmin/schools/${toggleSchool.id}/deactivate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
        }
        
        setSuccess(response.data.message)
        setTimeout(() => setSuccess(""), 3000)
        setOpenToggleDialog(false)
        setToggleSchool(null)
        await fetchSchools(token)
        await fetchStats(token)
    } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to toggle school status")
    } finally {
        setToggleLoading(false)
    }
}


















  // ============================================================
  // 🔥 VIEW SCHOOL STATUS
  // ============================================================
  const handleViewStatus = async (schoolId: number) => {
    setStatusLoading(true)
    setError("")
    
    try {
      const response = await axios.get(
        `/api/v1/superadmin/schools/${schoolId}/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStatusSchool(response.data)
      setOpenStatusDialog(true)
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("⚠️ Endpoint ya status haijapatikana. Hakikisha backend imesasishwa.")
      } else if (err.response?.status === 404) {
        setError("⚠️ Shule haijapatikana.")
      } else {
        setError(err.response?.data?.detail || "Failed to fetch school status")
      }
      setStatusSchool({
        error: true,
        message: error,
        school: { name: "Error loading status" }
      })
      setOpenStatusDialog(true)
    } finally {
      setStatusLoading(false)
    }
  }

  // ============================================================
  // 🔥 EXTEND SUBSCRIPTION - ILIYOBORESHA!
  // ============================================================
  const handleExtendSubscription = async () => {
    if (!selectedSchool) return
    
    setError("")
    setSuccess("")
    
    try {
      console.log(`📡 Extending subscription for school ${selectedSchool.id}...`)
      console.log(`📡 Plan: ${subscriptionPlan}, Days: ${subscriptionDays}`)
      
      // ✅ JARIBU ENDPOINT YA KWANZA
      let response
      try {
        response = await axios.post(
          `/api/v1/superadmin/schools/${selectedSchool.id}/extend-subscription`,
          { plan: subscriptionPlan, days: subscriptionDays },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (firstError: any) {
        // ✅ IKIWA ENDPOINT YA KWANZA INAKATAZA, JARIBU ENDPOINT YA PILI
        if (firstError.response?.status === 403) {
          console.log("⚠️ First endpoint returned 403, trying manual endpoint...")
          response = await axios.post(
            `/api/v1/superadmin/schools/${selectedSchool.id}/extend-subscription-manual`,
            { plan: subscriptionPlan, days: subscriptionDays },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } else {
          throw firstError
        }
      }
      
      console.log("✅ Subscription extended:", response.data)
      setSuccess(response.data.message || `Subscription extended for ${selectedSchool.name}!`)
      setTimeout(() => setSuccess(""), 3000)
      setOpenExtendDialog(false)
      setSelectedSchool(null)
      await fetchSchools(token)
      await fetchStats(token)
    } catch (err: any) {
      console.error("❌ Error extending subscription:", err)
      
      // ✅ ERROR MESSAGE BORA
      if (err.response?.status === 403) {
        setError("⚠️ Access denied. Make sure you are logged in as Superadmin and have the right permissions. Please try refreshing the page.")
      } else if (err.response?.status === 404) {
        setError("⚠️ Endpoint not found. Please check backend configuration.")
      } else {
        setError(err.response?.data?.detail || err.message || "Failed to extend subscription")
      }
    }
  }

  // ============================================================
  // 🔥 IMPERSONATE
  // ============================================================
  const handleImpersonate = async (schoolId: number, schoolName: string) => {
    try {
      setSuccess(`Logging into ${schoolName}...`)
      
      const academicResponse = await axios.get(
        `/api/v1/superadmin/schools/${schoolId}/academic`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
      )
      
      if (academicResponse.data && academicResponse.data.id) {
        const academicId = academicResponse.data.id
        const response = await axios.post(
          `/api/v1/superadmin/impersonate/${schoolId}?user_id=${academicId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
        )
        
        localStorage.clear()
        clearAllCookies()
        
        localStorage.setItem("token", response.data.access_token)
        localStorage.setItem("user_type", "academic")
        localStorage.setItem("user_role", "Academic")
        localStorage.setItem("user_name", response.data.user_name)
        localStorage.setItem("impersonating", "true")
        localStorage.setItem("original_school_id", String(schoolId))
        localStorage.setItem("original_school_name", schoolName)
        
        setCookie("token", response.data.access_token, 1)
        setCookie("user_type", "academic", 1)
        setCookie("user_name", encodeURIComponent(response.data.user_name), 1)
        
        setSuccess(`✅ Logged into ${schoolName} as Academic: ${response.data.user_name}`)
        
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 500)
        return
      }
    } catch (err: any) {
      console.log("⚠️ No Academic found:", err.message)
    }
    
    // Try Headmaster
    try {
      const headResponse = await axios.get(
        `/api/v1/superadmin/schools/${schoolId}/head`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
      )
      
      if (headResponse.data && headResponse.data.id) {
        const headId = headResponse.data.id
        const response = await axios.post(
          `/api/v1/superadmin/impersonate/${schoolId}?user_id=${headId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
        )
        
        localStorage.clear()
        clearAllCookies()
        
        localStorage.setItem("token", response.data.access_token)
        localStorage.setItem("user_type", headResponse.data.role?.toLowerCase() || "headmaster")
        localStorage.setItem("user_role", headResponse.data.role || "Headmaster")
        localStorage.setItem("user_name", response.data.user_name)
        localStorage.setItem("impersonating", "true")
        localStorage.setItem("original_school_id", String(schoolId))
        localStorage.setItem("original_school_name", schoolName)
        
        setCookie("token", response.data.access_token, 1)
        setCookie("user_type", headResponse.data.role?.toLowerCase() || "headmaster", 1)
        setCookie("user_name", encodeURIComponent(response.data.user_name), 1)
        
        setSuccess(`✅ Logged into ${schoolName} as ${headResponse.data.role}: ${response.data.user_name}`)
        
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 500)
        return
      }
    } catch (err: any) {
      console.log("⚠️ No Headmaster found:", err.message)
    }
    
    // Default impersonation
    try {
      const response = await axios.post(
        `/api/v1/superadmin/impersonate/${schoolId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
      )
      
      localStorage.clear()
      clearAllCookies()
      
      localStorage.setItem("token", response.data.access_token)
      localStorage.setItem("user_type", response.data.user_role?.toLowerCase() || "teacher")
      localStorage.setItem("user_role", response.data.user_role || "Teacher")
      localStorage.setItem("user_name", response.data.user_name)
      localStorage.setItem("impersonating", "true")
      localStorage.setItem("original_school_id", String(schoolId))
      localStorage.setItem("original_school_name", schoolName)
      
      setCookie("token", response.data.access_token, 1)
      setCookie("user_type", response.data.user_role?.toLowerCase() || "teacher", 1)
      setCookie("user_name", encodeURIComponent(response.data.user_name), 1)
      
      setSuccess(`✅ Logged into ${schoolName} as: ${response.data.user_name}`)
      
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)
      
    } catch (err: any) {
      let errorMessage = "Failed to login to school"
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
      setTimeout(() => setError(""), 5000)
    }
  }

  // ============================================================
  // 🔥 DELETE SCHOOL
  // ============================================================
  const handleDeleteSchool = async (schoolId: number, schoolName: string) => {
    const confirmed = window.confirm(
      `⚠️ WARNING: Are you sure you want to delete "${schoolName}"?\n\n` +
      `This action will permanently delete:\n` +
      `- All teachers and students in this school\n` +
      `- All classes, subjects, and streams\n` +
      `- All marks and reports\n` +
      `- ALL data associated with this school\n\n` +
      `This action CANNOT be undone!`
    )
    
    if (!confirmed) return
    
    try {
      await axios.delete(
        `/api/v1/superadmin/schools/${schoolId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess(`School "${schoolName}" deleted successfully!`)
      setTimeout(() => setSuccess(""), 3000)
      await fetchSchools(token)
      await fetchStats(token)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete school")
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    clearAllCookies()
    router.push("/login")
  }

  // ============================================================
  // 🔥 BADGES
  // ============================================================
  const getStatusBadge = (school: School) => {
    if (school.is_locked_by_superadmin) {
      return <Badge variant="destructive" className="flex items-center gap-1"><Lock className="h-3 w-3" /> Locked</Badge>
    }
    
    const isExpired = !school.subscription_expires_at || 
      new Date(school.subscription_expires_at) < new Date()
    
    if (isExpired) {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Expired</Badge>
    }
    
    if (school.is_active) {
      return <Badge className="bg-emerald-500 flex items-center gap-1"><Power className="h-3 w-3" /> Active</Badge>
    }
    
    return <Badge variant="secondary" className="flex items-center gap-1"><PowerOff className="h-3 w-3" /> Inactive</Badge>
  }

  const getSubscriptionStatus = (school: School) => {
    if (!school.subscription_expires_at) {
      return <Badge variant="outline" className="text-amber-600">No subscription</Badge>
    }
    const expires = new Date(school.subscription_expires_at)
    const now = new Date()
    const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 3600 * 24))
    
    if (daysLeft <= 0) {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Expired</Badge>
    }
    if (daysLeft <= 7) {
      return <Badge className="bg-amber-500">{daysLeft} days left</Badge>
    }
    return <Badge className="bg-emerald-500">{daysLeft} days left</Badge>
  }

  const getSchoolTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case "PRIMARY":
        return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">🏫 Primary</Badge>
      case "SECONDARY":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">📚 Secondary</Badge>
      case "ADVANCED":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">🎓 Advanced</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // ============================================================
  // 🔥 LOADING & ERROR
  // ============================================================
  if (error && schools.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-red-700 mb-2">Connection Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-sky-600 mx-auto" />
          <p className="text-sky-800/80 mt-4 text-lg font-medium">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-sky-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-xl shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-sm text-sky-700/60">Manage all schools and subscriptions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/superadmin/homepage-editor")}
              className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-100"
            >
              <TrendingUp className="h-4 w-4" />
              Edit Homepage
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-100">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 animate-slideIn">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-sky-700/60 font-medium">Total Schools</p>
                      <p className="text-3xl font-bold text-sky-800">{stats.total_schools}</p>
                    </div>
                    <div className="bg-sky-100 p-3 rounded-full">
                      <School className="h-6 w-6 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-sky-700/60 font-medium">Active Schools</p>
                      <p className="text-3xl font-bold text-emerald-600">{stats.active_schools}</p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <Power className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-sky-700/60 font-medium">Expired Subscriptions</p>
                      <p className="text-3xl font-bold text-red-600">{stats.expired_schools}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-sky-700/60 font-medium">Locked Schools</p>
                      <p className="text-3xl font-bold text-amber-600">{stats.locked_schools}</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Lock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-sky-700/60 font-medium">Total Teachers</p>
                      <p className="text-2xl font-bold text-sky-800">{stats.total_teachers.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-sky-700/60 font-medium">Total Students</p>
                      <p className="text-2xl font-bold text-sky-800">{stats.total_students.toLocaleString()}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-sky-600">
            <span className="font-medium">{schools.length}</span> schools registered
          </div>
          <Button
            onClick={() => setOpenAddSchool(true)}
            className="gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Add New School
          </Button>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-sky-50/50 border-b border-sky-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sky-800 text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                All Schools
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  setLoading(true)
                  await fetchSchools(token)
                  await fetchStats(token)
                  setLoading(false)
                }}
                className="gap-2 text-sky-600 hover:text-sky-700 hover:bg-sky-100"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sky-50/30 border-b border-sky-100">
                    <TableHead className="text-sky-700 font-semibold">ID</TableHead>
                    <TableHead className="text-sky-700 font-semibold">School Name</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Type</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Mkoa</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Wilaya</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Contact</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Status</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Subscription</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Expires</TableHead>
                    <TableHead className="text-sky-700 font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-sky-500/50">
                        <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        No schools found. Click "Add New School" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    schools.map((school) => (
                      <TableRow key={school.id} className="hover:bg-sky-50/30 transition-colors border-b border-sky-100">
                        <TableCell className="font-mono text-sm text-sky-700">{school.id}</TableCell>
                        <TableCell className="font-medium text-sky-800">{school.name}</TableCell>
                        <TableCell>{getSchoolTypeBadge(school.school_type)}</TableCell>
                        <TableCell className="text-sm text-sky-700">{school.region || "-"}</TableCell>
                        <TableCell className="text-sm text-sky-700">{school.district || "-"}</TableCell>
                        <TableCell>
                          <div className="text-sm text-sky-700">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {school.email || "-"}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-sky-500 mt-1">
                              <Phone className="h-3 w-3" />
                              {school.phone || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(school)}</TableCell>
                        <TableCell>{getSubscriptionStatus(school)}</TableCell>
                        <TableCell className="text-sm text-sky-600">
                          {school.subscription_expires_at 
                            ? new Date(school.subscription_expires_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center flex-wrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewStatus(school.id)}
                              className="gap-1 text-sky-600 hover:bg-sky-100"
                              title="View school status"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant={school.is_active ? "outline" : "default"}
                              onClick={() => {
                                setToggleSchool(school)
                                setToggleAction(school.is_active ? "deactivate" : "activate")
                                setOpenToggleDialog(true)
                              }}
                              className={school.is_active ? "border-amber-500 text-amber-600 hover:bg-amber-50" : "bg-emerald-600 hover:bg-emerald-700"}
                              title={school.is_active ? "Deactivate school" : "Activate school"}
                            >
                              {school.is_active ? (
                                <><PowerOff className="h-3 w-3" /> Off</>
                              ) : (
                                <><Power className="h-3 w-3" /> On</>
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleImpersonate(school.id, school.name)}
                              className="gap-1 border-sky-300 text-sky-600 hover:bg-sky-100"
                              title={`Login to ${school.name}`}
                            >
                              <LogIn className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant={school.is_locked_by_superadmin ? "default" : "destructive"}
                              onClick={() => handleToggleLock(school.id, school.is_locked_by_superadmin)}
                              className="gap-1"
                              title={school.is_locked_by_superadmin ? "Unlock school" : "Lock school"}
                            >
                              {school.is_locked_by_superadmin ? (
                                <><Unlock className="h-3 w-3" /></>
                              ) : (
                                <><Lock className="h-3 w-3" /></>
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedSchool(school)
                                setOpenExtendDialog(true)
                              }}
                              className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                              title="Extend subscription"
                            >
                              <CalendarPlus className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSchool(school.id, school.name)}
                              className="gap-1"
                              title="Delete school permanently"
                            >
                              <Trash2 className="h-3 w-3" />
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

        {/* Add School Dialog */}
        <Dialog open={openAddSchool} onOpenChange={setOpenAddSchool}>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl border-sky-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2 text-sky-800">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Add New School
              </DialogTitle>
              <DialogDescription className="text-sky-600">
                Create a new school in the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSchool}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-sky-700">School Name *</Label>
                  <Input
                    placeholder="e.g., St. Mary's Secondary School"
                    value={newSchool.name}
                    onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                    className="border-sky-200 focus:ring-sky-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sky-700">School Type *</Label>
                  <Select
                    value={newSchool.school_type}
                    onValueChange={(value) => setNewSchool({ ...newSchool, school_type: value })}
                  >
                    <SelectTrigger className="border-sky-200 bg-white">
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-sky-200">
                      <SelectItem value="PRIMARY">🏫 Primary School</SelectItem>
                      <SelectItem value="SECONDARY">📚 Secondary School</SelectItem>
                      <SelectItem value="ADVANCED">🎓 Advanced Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sky-700">Mkoa (Region)</Label>
                    <Select
                      value={newSchool.region}
                      onValueChange={(value) => {
                        setNewSchool({ ...newSchool, region: value, district: "" })
                      }}
                    >
                      <SelectTrigger className="border-sky-200 bg-white">
                        <SelectValue placeholder="Chagua Mkoa" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-sky-200 max-h-48 overflow-y-auto">
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sky-700">Wilaya (District)</Label>
                    <Select
                      value={newSchool.district}
                      onValueChange={(value) => setNewSchool({ ...newSchool, district: value })}
                      disabled={!newSchool.region}
                    >
                      <SelectTrigger className="border-sky-200 bg-white">
                        <SelectValue placeholder={newSchool.region ? "Chagua Wilaya" : "Chagua Mkoa kwanza"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-sky-200 max-h-48 overflow-y-auto">
                        {newSchool.region && DISTRICTS_BY_REGION[newSchool.region]?.map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sky-700">Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@school.com"
                    value={newSchool.email}
                    onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                    className="border-sky-200 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sky-700">Phone</Label>
                  <Input
                    placeholder="0712345678"
                    value={newSchool.phone}
                    onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                    className="border-sky-200 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sky-700">Address</Label>
                  <Input
                    placeholder="School address"
                    value={newSchool.address}
                    onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                    className="border-sky-200 focus:ring-sky-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAddSchool(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addingSchool} className="bg-gradient-to-r from-sky-600 to-blue-600">
                  {addingSchool ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create School
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Extend Subscription Dialog */}
        <Dialog open={openExtendDialog} onOpenChange={setOpenExtendDialog}>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl border-sky-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-sky-800 flex items-center gap-2">
                <CalendarPlus className="h-5 w-5 text-emerald-600" />
                Extend Subscription
              </DialogTitle>
              <DialogDescription className="text-sky-600">
                Extend subscription for <span className="font-semibold text-sky-800">{selectedSchool?.name}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sky-700">Select Plan</Label>
                <Select
                  value={subscriptionPlan}
                  onValueChange={(value) => {
                    const plan = SUBSCRIPTION_PLANS.find(p => p.value === value)
                    setSubscriptionPlan(value)
                    setSubscriptionDays(plan?.days || 30)
                  }}
                >
                  <SelectTrigger className="border-sky-200 bg-white">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-sky-200">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sky-700">Days (Manually adjust if needed)</Label>
                <Input
                  type="number"
                  className="border-sky-200 focus:ring-sky-500 bg-white"
                  value={subscriptionDays}
                  onChange={(e) => setSubscriptionDays(parseInt(e.target.value) || 0)}
                  min={1}
                  max={365}
                />
              </div>
              <div className="bg-sky-50 p-3 rounded-lg mt-2">
                <p className="text-sm text-sky-700">
                  New expiry date:{" "}
                  <span className="font-semibold">
                    {new Date(Date.now() + subscriptionDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenExtendDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleExtendSubscription} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Extend Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Toggle Active/Deactivate Dialog */}
        <Dialog open={openToggleDialog} onOpenChange={setOpenToggleDialog}>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl border-sky-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                {toggleAction === "activate" ? (
                  <><Power className="h-5 w-5 text-emerald-600" /> Activate School</>
                ) : (
                  <><PowerOff className="h-5 w-5 text-red-600" /> Deactivate School</>
                )}
              </DialogTitle>
              <DialogDescription>
                {toggleAction === "activate" ? (
                  <>You are about to <strong className="text-emerald-600">activate</strong> <span className="font-semibold">{toggleSchool?.name}</span></>
                ) : (
                  <>You are about to <strong className="text-red-600">deactivate</strong> <span className="font-semibold">{toggleSchool?.name}</span></>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {toggleAction === "activate" ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-700">✅ Activating will:</p>
                  <ul className="text-sm text-emerald-600 mt-2 space-y-1 list-disc list-inside">
                    <li>Allow all teachers and students to login</li>
                    <li>Set subscription to active (30 days trial if expired)</li>
                    <li>Remove superadmin lock if applied</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-700">⚠️ Deactivating will:</p>
                  <ul className="text-sm text-amber-600 mt-2 space-y-1 list-disc list-inside">
                    <li>Block all teachers and students from logging in</li>
                    <li>Set school status to inactive</li>
                    <li>Apply superadmin lock</li>
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenToggleDialog(false)}>Cancel</Button>
              <Button
                onClick={handleToggleActive}
                disabled={toggleLoading}
                className={toggleAction === "activate" 
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600" 
                  : "bg-gradient-to-r from-red-600 to-rose-600"
                }
              >
                {toggleLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : toggleAction === "activate" ? <Power className="h-4 w-4 mr-2" /> : <PowerOff className="h-4 w-4 mr-2" />}
                {toggleAction === "activate" ? "Activate" : "Deactivate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View School Status Dialog */}
        <Dialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl border-sky-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-sky-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-sky-600" />
                {statusSchool?.error ? "⚠️ Status Unavailable" : `School Status: ${statusSchool?.school?.name || "Loading..."}`}
              </DialogTitle>
            </DialogHeader>
            {statusLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
              </div>
            ) : statusSchool?.error ? (
              <div className="py-8 text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <p className="text-amber-700 font-medium">{statusSchool.message || "Failed to load status"}</p>
                <p className="text-sm text-gray-500 mt-2">Please check backend connection or update the API.</p>
              </div>
            ) : statusSchool ? (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <p className="text-xs text-sky-500">School Level</p>
                    <p className="font-semibold text-sky-800">{statusSchool.school?.school_level || "-"}</p>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <p className="text-xs text-sky-500">Type</p>
                    <p className="font-semibold text-sky-800">{statusSchool.school?.school_type || "-"}</p>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <p className="text-xs text-sky-500">Region</p>
                    <p className="font-semibold text-sky-800">{statusSchool.school?.region || "-"}</p>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <p className="text-xs text-sky-500">District</p>
                    <p className="font-semibold text-sky-800">{statusSchool.school?.district || "-"}</p>
                  </div>
                </div>

                <div className="border-t border-sky-100 pt-4">
                  <h4 className="font-semibold text-sky-700 mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-amber-50 p-2 rounded-lg">
                      <p className="text-xs text-amber-500">Plan</p>
                      <p className="font-semibold text-amber-700">{statusSchool.subscription?.plan || "-"}</p>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg">
                      <p className="text-xs text-amber-500">Days Left</p>
                      <p className="font-semibold text-amber-700">{statusSchool.subscription?.days_left || 0}</p>
                    </div>
                    <div className="col-span-2 bg-amber-50 p-2 rounded-lg">
                      <p className="text-xs text-amber-500">Expires At</p>
                      <p className="font-semibold text-amber-700">
                        {statusSchool.subscription?.expires_at 
                          ? new Date(statusSchool.subscription.expires_at).toLocaleDateString()
                          : "No expiry date"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-sky-100 pt-4">
                  <h4 className="font-semibold text-sky-700 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-sky-50 p-2 rounded-lg">
                      <p className="text-xs text-sky-500">Active</p>
                      <p className="font-semibold text-sky-700">{statusSchool.subscription?.is_active ? "✅ Yes" : "❌ No"}</p>
                    </div>
                    <div className="bg-sky-50 p-2 rounded-lg">
                      <p className="text-xs text-sky-500">Locked</p>
                      <p className="font-semibold text-sky-700">{statusSchool.subscription?.is_locked_by_superadmin ? "🔒 Yes" : "🔓 No"}</p>
                    </div>
                    <div className="col-span-2 bg-sky-50 p-2 rounded-lg">
                      <p className="text-xs text-sky-500">Can Login</p>
                      <p className="font-semibold text-sky-700">{statusSchool.can_login ? "✅ Yes" : "❌ No"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-sky-100 pt-4">
                  <h4 className="font-semibold text-sky-700 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <p className="text-xs text-purple-500">Total Teachers</p>
                      <p className="font-semibold text-purple-700">{statusSchool.statistics?.total_teachers || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <p className="text-xs text-purple-500">Active Teachers</p>
                      <p className="font-semibold text-purple-700">{statusSchool.statistics?.active_teachers || 0}</p>
                    </div>
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <p className="text-xs text-indigo-500">Total Students</p>
                      <p className="font-semibold text-indigo-700">{statusSchool.statistics?.total_students || 0}</p>
                    </div>
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <p className="text-xs text-indigo-500">Active Students</p>
                      <p className="font-semibold text-indigo-700">{statusSchool.statistics?.active_students || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-sky-500">No data available</div>
            )}
            <DialogFooter>
              <Button onClick={() => setOpenStatusDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}