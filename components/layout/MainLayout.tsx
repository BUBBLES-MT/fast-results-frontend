"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Users,
  School,
  GraduationCap,
  BookOpen,
  FileText,
  Brain,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Award,
  TrendingUp,
  Layers,
  AlertTriangle,
  BarChart,
  Sparkles,
  Sun,
  Moon,
  Crown,
  Loader2,
  UserCog,
  Settings,
  HelpCircle,
  Calendar,
  Clock,
  UserPlus,
  Megaphone,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: string[]
}

// ============================================================
// 🔥 SECONDARY SCHOOL NAVIGATION ITEMS - AI EXAM IMEFICHWA!
// ============================================================
const secondaryNavItems: Omit<NavItem, 'title'>[] = [
  {
    href: "/secondary/dashboard",
    icon: LayoutDashboard,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  },
  {
    href: "/admin/announcements",
    icon: Megaphone,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress"],
  },
  {
    href: "/secondary/students",
    icon: Users,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  {
    href: "/secondary/students/my-students-view",
    icon: Users,
    roles: ["Teacher", "Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"],
  },
  {
    href: "/secondary/teachers/assign-subjects",
    icon: Users,
    roles: ["Academic", "Headmaster", "Headmistress", "Second Master", "Second Mistress"],
  },
  {
    href: "/secondary/teachers",
    icon: GraduationCap,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  {
    href: "/secondary/teachers/pending",
    icon: UserPlus,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress"],
  },
  {
    href: "/secondary/classes",
    icon: BookOpen,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  {
    href: "/secondary/classes-streams",
    icon: Layers,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  {
    href: "/secondary/subjects",
    icon: FileText,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  {
    href: "/secondary/academic/unassigned",
    icon: AlertTriangle,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  // 🔥🔥🔥 AI EXAM IMEFICHWA KWA SECONDARY! 🔥🔥🔥
  // {
  //   href: "/secondary/ai-exam",
  //   icon: Brain,
  //   roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  // },
  {
    href: "/secondary/marks",
    icon: Award,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  },
  {
    href: "/secondary/top-students",
    icon: Award,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  },
  {
    href: "/secondary/promote",
    icon: TrendingUp,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  {
    href: "/secondary/reports",
    icon: FileText,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic"],
  },
  {
    href: "/secondary/reports/parent-report-class",
    icon: FileText,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  },
  {
    href: "/secondary/reports/class-summary",
    icon: BarChart,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  },
  {
    href: "/secondary/past-papers",
    icon: FileText,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  },
  {
    href: "/secondary/past-papers/add",
    icon: FileText,
    roles: ["Headmaster", "Headmistress", "Second Master", "Second Mistress", "Academic", "Teacher"],
  },
]

// ============================================================
// 🔥 PRIMARY SCHOOL NAVIGATION ITEMS - AI EXAM IMEFICHWA!
// ============================================================
const primaryNavItems: Omit<NavItem, 'title'>[] = [
  {
    href: "/primary/dashboard",
    icon: LayoutDashboard,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  },
  {
    href: "/admin/announcements",
    icon: Megaphone,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi"],
  },
  {
    href: "/primary/students",
    icon: Users,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  {
    href: "/primary/students/my-students",
    icon: Users,
    roles: ["Mwalimu", "Mtaaluma", "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi"],
  },
  {
    href: "/primary/teachers",
    icon: GraduationCap,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  {
    href: "/primary/teachers/pending",
    icon: UserPlus,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi"],
  },
  {
    href: "/primary/teachers/roles",
    icon: UserCog,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi"],
  },
  {
    href: "/primary/classes",
    icon: BookOpen,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  {
    href: "/primary/classes-streams",
    icon: Layers,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  {
    href: "/primary/subjects",
    icon: FileText,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  {
    href: "/primary/academic/unassigned",
    icon: AlertTriangle,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  // 🔥🔥🔥 AI EXAM IMEFICHWA KWA PRIMARY! 🔥🔥🔥
  // {
  //   href: "/primary/ai-exam",
  //   icon: Brain,
  //   roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  // },
  {
    href: "/primary/marks",
    icon: Award,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  },
  {
    href: "/primary/top-students",
    icon: Award,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  },
  {
    href: "/primary/promote",
    icon: TrendingUp,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  {
    href: "/primary/reports",
    icon: FileText,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"],
  },
  {
    href: "/primary/reports/parent-report",
    icon: FileText,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  },
  {
    href: "/primary/reports/class-summary",
    icon: BarChart,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  },
  {
    href: "/primary/past-papers",
    icon: FileText,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  },
  {
    href: "/primary/past-papers/add",
    icon: FileText,
    roles: ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma", "Mwalimu"],
  },
]

// ============================================================
// 🔥 GET NAVIGATION ITEM TITLES
// ============================================================
const getNavItemTitle = (item: Omit<NavItem, 'title'>, role: string, schoolLevel: string): string => {
  if (schoolLevel === "primary") {
    const titles: Record<string, string> = {
      "/primary/dashboard": "Dashibodi",
      "/primary/students": "Wanafunzi",
      "/primary/students/my-students": "Wanafunzi Wangu",
      "/primary/teachers": "Walimu",
      "/primary/teachers/pending": "Idhini ya Walimu",
      "/primary/teachers/roles": "Majukumu ya Walimu",
      "/primary/classes": "Madarasa",
      "/primary/subjects": "Masomo",
      // 🔥 AI EXAM IMEFICHWA! HAIONYESHWI KWA USER!
      // "/primary/ai-exam": "Mtihani wa AI",
      "/primary/marks": "Alama",
      "/primary/top-students": "Wanafunzi Bora",
      "/primary/promote": "Kukuza",
      "/primary/reports": "Ripoti",
      "/primary/past-papers": "Mitihani Iliyopita",
      "/primary/past-papers/add": "Pakia Mtihani",
      "/primary/classes-streams": "Madarasa na Mikondo",
      "/primary/reports/parent-report": "Ripoti ya Mzazi",
      "/primary/reports/class-summary": "Muhtasari wa Darasa",
      "/primary/academic/unassigned": "Masomo Yasiyopangiwa",
      "/admin/announcements": "Tangazo la Shule",
    }
    return titles[item.href] || ""
  }
  
  const titles: Record<string, string> = {
    "/secondary/dashboard": "Dashboard",
    "/secondary/students": role === "Teacher" ? "My Students" : "Students",
    "/secondary/students/my-students-view": "My Students",
    "/secondary/teachers/assign-subjects": "Assign Subjects",
    "/secondary/teachers": "Teachers",
    "/secondary/teachers/pending": "Teacher Approval",
    "/secondary/classes": "Classes",
    "/secondary/subjects": "Subjects",
    // 🔥 AI EXAM IMEFICHWA! HAIONYESHWI KWA USER!
    // "/secondary/ai-exam": "AI Exam",
    "/secondary/marks": "Marks",
    "/secondary/top-students": "Top Students",
    "/secondary/promote": "Promote",
    "/secondary/reports": "Reports",
    "/secondary/past-papers": "Past Papers",
    "/secondary/past-papers/add": "Add Past Paper",
    "/secondary/classes-streams": "Classes & Streams",
    "/secondary/reports/parent-report-class": "Parent Reports",
    "/secondary/reports/class-summary": "Class Summary",
    "/secondary/academic/unassigned": "Unassigned Slots",
    "/admin/announcements": "School Announcement",
  }
  return titles[item.href] || ""
}

const roleMatches = (itemRoles: string[], userRole: string): boolean => {
  return itemRoles.some(role => role.toLowerCase() === userRole.toLowerCase())
}

// ============================================================
// 🔥 MAIN LAYOUT COMPONENT
// ============================================================
export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>("")
  const [userName, setUserName] = useState("")
  const [isDark, setIsDark] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [schoolLevel, setSchoolLevel] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("user_type")
    const name = localStorage.getItem("user_name")
    const impersonating = localStorage.getItem("impersonating") === "true"
    const level = localStorage.getItem("school_level")

    if (!token) {
      router.push("/login")
      return
    }
    
    setIsImpersonating(impersonating)
    setSchoolLevel(level || "secondary")
    
    let formattedRole = role || "Teacher"
    
    const roleMap: Record<string, string> = {
      "teacher": "Teacher",
      "headmaster": "Headmaster",
      "headmistress": "Headmistress",
      "second master": "Second Master",
      "second mistress": "Second Mistress",
      "academic": "Academic",
      "mwalimu": "Mwalimu",
      "mtaaluma": "Mtaaluma",
      "mwalimu mkuu": "Mwalimu Mkuu",
      "mwalimu mkuu msaidizi": "Mwalimu Mkuu Msaidizi",
      "superadmin": "Superadmin"
    }
    
    formattedRole = roleMap[formattedRole.toLowerCase()] || "Teacher"
    setUserRole(formattedRole)
    setUserName(name || "User")
    
    console.log("🔍 MainLayout Debug:", { formattedRole, level, schoolLevel: level, pathname })
    
    // ============================================================
    // 🔥 SUPERADMIN BLOCK
    // ============================================================
    if (formattedRole === "Superadmin") {
      if (pathname?.startsWith("/dashboard") || pathname === "/" || !pathname?.startsWith("/superadmin")) {
        router.push("/superadmin")
        return
      }
    }
    
    // ============================================================
    // 🔥 REGULAR USERS - Cannot access superadmin
    // ============================================================
    if (formattedRole !== "Superadmin" && pathname?.startsWith("/superadmin")) {
      if (level === "primary") {
        router.push("/primary/dashboard")
      } else {
        router.push("/secondary/dashboard")
      }
      return
    }
    
    // ============================================================
    // 🔥 TEACHER REDIRECT
    // ============================================================
    if (formattedRole === "Teacher" || formattedRole === "Mwalimu") {
      if (pathname === "/dashboard" || pathname === "/") {
        if (level === "primary") {
          router.push("/primary/dashboard")
        } else {
          router.push("/secondary/dashboard")
        }
        return
      }
      
      if (pathname?.startsWith("/secondary/dashboard") && level === "primary") {
        router.push("/primary/dashboard")
        return
      }
      
      if (pathname?.startsWith("/primary/dashboard") && level === "secondary") {
        router.push("/secondary/dashboard")
        return
      }
      
      if (pathname?.startsWith("/primary/") && pathname !== "/primary/dashboard") {
        console.log("✅ Teacher on primary page:", pathname)
      }
      
      if (pathname?.startsWith("/secondary/") && pathname !== "/secondary/dashboard") {
        console.log("✅ Teacher on secondary page:", pathname)
      }
    }
    
    // ============================================================
    // 🔥 ADMIN REDIRECT
    // ============================================================
    if (formattedRole !== "Teacher" && formattedRole !== "Mwalimu" && formattedRole !== "Superadmin") {
      if (pathname === "/dashboard" || pathname === "/") {
        if (level === "primary") {
          router.push("/primary/dashboard")
        } else {
          router.push("/secondary/dashboard")
        }
        return
      }
      
      if (pathname?.startsWith("/secondary/dashboard") && level === "primary") {
        router.push("/primary/dashboard")
        return
      }
      if (pathname?.startsWith("/primary/dashboard") && level === "secondary") {
        router.push("/secondary/dashboard")
        return
      }
    }
    
    // ============================================================
    // 🔥 THEME
    // ============================================================
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
    
    setIsLoading(false)
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_type")
    localStorage.removeItem("user_name")
    localStorage.removeItem("user_role")
    localStorage.removeItem("impersonating")
    localStorage.removeItem("original_school_id")
    localStorage.removeItem("original_school_name")
    localStorage.removeItem("school_level")
    router.push("/login")
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-sky-800 mt-4">Inapakia...</p>
        </div>
      </div>
    )
  }

  // ============================================================
  // 🔥 SUPERADMIN RENDER
  // ============================================================
  if (userRole === "Superadmin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
        <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-sky-200 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                Paneli ya Msimamizi Mkuu
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 rounded-full">
                <Sparkles className="h-3 w-3 text-yellow-500" />
                <span className="text-sm text-sky-700">{userName}</span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="border-sky-300 text-sky-700 hover:bg-sky-100 rounded-xl">
                <LogOut className="h-4 w-4 mr-2" />
                Toka
              </Button>
            </div>
          </div>
        </header>
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    )
  }

  // ============================================================
  // 🔥 CHOOSE NAVIGATION
  // ============================================================
  const baseItems = schoolLevel === "primary" ? primaryNavItems : secondaryNavItems
  
  const navItems: NavItem[] = baseItems.map(item => ({
    ...item,
    title: getNavItemTitle(item, userRole, schoolLevel),
  }))

  const filteredNavItems = navItems.filter((item) =>
    roleMatches(item.roles, userRole)
  )

  console.log("🔍 Sidebar Debug:", { 
    schoolLevel, 
    userRole, 
    pathname,
    totalNavItems: navItems.length, 
    filteredNavItems: filteredNavItems.length,
  })

  // ============================================================
  // 🔥 RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-4 w-4" />
            <span>Umeingia kama {userRole}: {userName}</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:text-white/80 text-xs h-6 px-2"
              onClick={() => {
                const originalSchoolId = localStorage.getItem("original_school_id")
                if (originalSchoolId) {
                  window.location.href = "/superadmin"
                } else {
                  handleLogout()
                }
              }}
            >
              Toka
            </Button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/80 backdrop-blur-sm shadow-lg border-sky-200 rounded-xl"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div className="fixed top-4 right-4 z-50 lg:right-8">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-white/80 backdrop-blur-sm shadow-lg border-sky-200 dark:bg-slate-800/80 rounded-xl"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-sky-200/50 dark:border-white/10 shadow-2xl transform transition-all duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ top: isImpersonating ? '40px' : '0' }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sky-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg">
                <School className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                  SchoolMS
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {schoolLevel === "primary" ? "Shule ya Msingi" : "Secondary School"}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isImpersonating ? `🔓 ${userRole} (Impersonated)` : `Jukumu: ${userRole}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-6 overflow-y-auto">
            <div className="space-y-1.5 px-4">
              {filteredNavItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Hakuna vitu vya menyu
                </div>
              ) : (
                filteredNavItems.map((item, idx) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:translate-x-1"
                      )}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <Icon className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                      )} />
                      <span className="flex-1">{item.title}</span>
                      {isActive && <ChevronRight className="h-3 w-3 animate-pulse" />}
                    </Link>
                  )
                })
              )}
            </div>
          </nav>

          <div className="p-4 border-t border-sky-200/50 dark:border-white/10">
            <div className="p-3 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                © 2026 SchoolMS<br />All rights reserved
              </p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-200 group"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              LOGOUT
            </Button>
          </div>
        </div>
      </aside>

      <main className={cn("lg:pl-72", isImpersonating && "pt-10")}>
        <div className="min-h-screen p-6 md:p-8 animate-fadeIn">
          {children}
        </div>
      </main>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #38bdf8, #3b82f6);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0ea5e9, #2563eb);
        }
        
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  )
}