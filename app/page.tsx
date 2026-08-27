"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  School, 
  LogIn, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Award,
  Sparkles,
  Clock,
  CheckCircle,
  TrendingUp,
  Shield,
  UsersRound,
  ArrowRight,
  UserPlus
} from "lucide-react"

interface Slide {
  id: number
  image_url: string
  caption: string
  order: number
  active: boolean
}

interface SidebarItem {
  id: number
  image_url: string
  title: string
  caption: string
  order: number
  active: boolean
}

interface Ad {
  id: number
  image_url: string
  title: string
  caption: string
  link: string
  order: number
  active: boolean
}

export default function HomePage() {
  const router = useRouter()
  const [slides, setSlides] = useState<Slide[]>([])
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepageData()
  }, [])

  const fetchHomepageData = async () => {
    try {
      const [slidesRes, sidebarRes, adsRes] = await Promise.all([
        fetch("/api/v1/homepage/slides?active_only=true"),
        fetch("/api/v1/homepage/sidebar?active_only=true"),
        fetch("/api/v1/homepage/ads?active_only=true"),
      ])

      if (slidesRes.ok) {
        const slidesData = await slidesRes.json()
        setSlides(slidesData.sort((a: Slide, b: Slide) => a.order - b.order))
      }
      if (sidebarRes.ok) {
        const sidebarData = await sidebarRes.json()
        setSidebarItems(sidebarData.sort((a: SidebarItem, b: SidebarItem) => a.order - b.order))
      }
      if (adsRes.ok) {
        const adsData = await adsRes.json()
        setAds(adsData.sort((a: Ad, b: Ad) => a.order - b.order))
      }
    } catch (err) {
      console.error("Error fetching homepage data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Auto slide change
  useEffect(() => {
    if (slides.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-sky-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-xl shadow-lg">
              <School className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                MASI FAST RESULTS
              </span>
              <p className="text-xs text-sky-700/60">Fast and Accurate Results</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-50">
                <LogIn className="h-4 w-4" />
                Teacher Login
              </Button>
            </Link>
            <Link href="/parent/login">
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <UsersRound className="h-4 w-4" />
                Mzazi Ingia
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Slideshow */}
        <section className="relative h-[500px] overflow-hidden">
          {slides.length > 0 ? (
            <>
              <div
                className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="w-full flex-shrink-0 h-full relative"
                  >
                    <img
                      src={slide.image_url}
                      alt={slide.caption || "School slide"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <div className="mb-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">MASI FAST RESULTS</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                          Fast and Accurate Results
                        </h1>
                        <p className="text-lg md:text-xl text-white/90">
                          {slide.caption || "Track student progress with ease"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    type="button"
                    className={`w-3 h-3 rounded-full transition-all focus:outline-none ${
                      currentSlide === idx ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="mb-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">MASI FAST RESULTS</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Fast and Accurate Results
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Track student progress with ease
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Why MASI FAST RESULTS?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A modern system for viewing student results quickly and accurately
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mx-auto w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Results</h3>
                <p className="text-gray-600">Get student results instantly</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mx-auto w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Accurate & Detailed</h3>
                <p className="text-gray-600">Complete student information</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mx-auto w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <UsersRound className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Easy for Parents</h3>
                <p className="text-gray-600">Track your child's progress easily</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mx-auto w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Progress Tracking</h3>
                <p className="text-gray-600">Monitor grade trends over time</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Login Cards - Teacher & Parent */}
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Teacher Card */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Teacher / Academic
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage students, marks, and reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/login">
                  <Button className="w-full gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl">
                    <LogIn className="h-4 w-4" />
                    Login as Teacher
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full gap-2 border-sky-300 text-sky-700 hover:bg-sky-50">
                    <UserPlus className="h-4 w-4" />
                    Register as Teacher
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Parent Card */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                  <UsersRound className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Mzazi / Mlezi
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Angalia matokeo ya mtoto wako
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/parent/login">
                  <Button className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl">
                    <LogIn className="h-4 w-4" />
                    Ingia kama Mzazi
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/parent/register">
                  <Button variant="outline" className="w-full gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    <UserPlus className="h-4 w-4" />
                    Jisajili kama Mzazi
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sidebar Items Section */}
        {sidebarItems.length > 0 && (
          <section className="py-16 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sidebarItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-xl transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.caption}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ads Section */}
        {ads.length > 0 && (
          <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ads.map((ad) => (
                <a
                  key={ad.id}
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:scale-105 transition-transform duration-300"
                >
                  <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="pt-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{ad.title}</h3>
                      <p className="text-gray-600 text-sm">{ad.caption}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              MASI FAST RESULTS
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to See Results?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join our system and start viewing student results quickly and accurately
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white text-sky-700 hover:bg-gray-100 gap-2 shadow-lg hover:shadow-xl"
                >
                  <LogIn className="h-5 w-5" />
                  Login as Teacher
                </Button>
              </Link>
              <Link href="/parent/login">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-gray-100 gap-2 shadow-lg hover:shadow-xl"
                >
                  <UsersRound className="h-5 w-5" />
                  Ingia kama Mzazi
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <School className="h-5 w-5 text-sky-400" />
            <span className="font-bold text-sky-400">MASI FAST RESULTS</span>
          </div>
          <p className="text-gray-400 text-sm">
            Fast and Accurate Results
          </p>
          <p className="text-gray-500 text-xs mt-4">
            &copy; {new Date().getFullYear()} MASI FAST RESULTS SYSTEM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}