"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  UserPlus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Rocket,
  Globe,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Slide {
  id: number;
  image_url: string;
  caption: string;
  order: number;
  active: boolean;
}

interface SidebarItem {
  id: number;
  image_url: string;
  title: string;
  caption: string;
  order: number;
  active: boolean;
}

interface Ad {
  id: number;
  image_url: string;
  title: string;
  caption: string;
  link: string;
  order: number;
  active: boolean;
}

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS
// ============================================================

function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {children}
    </div>
  );
}

function MobileHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-sky-200/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer touch-feedback flex-shrink-0"
            onClick={() => router.push("/")}
          >
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <School className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent truncate">
                MASI FAST RESULTS
              </h1>
              <p className="text-[8px] sm:text-xs text-sky-700/60 truncate hidden xs:block">
                Fast and Accurate Results
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 text-xs sm:text-sm h-9 sm:h-10">
                <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Teacher Login</span>
                <span className="xs:hidden">Login</span>
              </Button>
            </Link>
            <Link href="/parent/login">
              <Button size="sm" className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs sm:text-sm h-9 sm:h-10">
                <UsersRound className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Mzazi Ingia</span>
                <span className="xs:hidden">Mzazi</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-1.5 rounded-xl hover:bg-gray-100 transition-colors touch-feedback"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden py-3 border-t border-sky-200/60 space-y-2 animate-slideDown">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 text-sm h-11">
                <LogIn className="h-4 w-4" />
                Teacher Login
              </Button>
            </Link>
            <Link href="/parent/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm h-11">
                <UsersRound className="h-4 w-4" />
                Mzazi Ingia
              </Button>
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full gap-2 text-gray-600 hover:text-gray-800 text-sm h-11">
                <UserPlus className="h-4 w-4" />
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

// ============================================================
// 🔥 MOBILE SLIDESHOW
// ============================================================

function MobileSlideshow({ slides }: { slides: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">MASI FAST RESULTS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4">
            Fast and Accurate Results
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white/90">
            Track student progress with ease
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
            <img
              src={slide.image_url}
              alt={slide.caption || "School slide"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="text-center text-white max-w-2xl">
                <div className="mb-2 sm:mb-4 inline-flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-medium">MASI FAST RESULTS</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4">
                  Fast and Accurate Results
                </h1>
                <p className="text-sm sm:text-lg md:text-xl text-white/90">
                  {slide.caption || "Track student progress with ease"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on very small screens */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all touch-feedback hidden xs:block"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all touch-feedback hidden xs:block"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Slide indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            type="button"
            className={cn(
              "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all focus:outline-none touch-feedback",
              currentSlide === idx 
                ? "bg-white w-4 sm:w-6" 
                : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 🔥 FEATURE CARD
// ============================================================

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1 touch-feedback">
      <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
        <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4 bg-sky-100">
          <div className="h-6 w-6 sm:h-7 sm:w-7 text-sky-600">
            {icon}
          </div>
        </div>
        <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

// ============================================================
// 🔥 LOGIN CARD
// ============================================================

function LoginCard({ 
  title, 
  description, 
  icon, 
  gradient, 
  loginHref, 
  registerHref, 
  loginLabel, 
  registerLabel 
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  loginHref: string;
  registerHref: string;
  loginLabel: string;
  registerLabel: string;
}) {
  return (
    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="text-center pt-4 sm:pt-6 px-4 sm:px-6">
        <div className={cn(
          "mx-auto p-2.5 sm:p-3 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 sm:mb-4 shadow-lg",
          gradient
        )}>
          {icon}
        </div>
        <CardTitle className="text-lg sm:text-2xl font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
        <Link href={loginHref}>
          <Button className="w-full gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl text-sm sm:text-base h-11 sm:h-12 touch-feedback">
            <LogIn className="h-4 w-4" />
            {loginLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={registerHref}>
          <Button variant="outline" className="w-full gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 text-sm sm:text-base h-11 sm:h-12 touch-feedback">
            <UserPlus className="h-4 w-4" />
            {registerLabel}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ============================================================
// 🔥 MAIN COMPONENT
// ============================================================

export default function HomePage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      const [slidesRes, sidebarRes, adsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/homepage/slides?active_only=true`),
        fetch(`${API_BASE}/api/v1/homepage/sidebar?active_only=true`),
        fetch(`${API_BASE}/api/v1/homepage/ads?active_only=true`),
      ]);

      if (slidesRes.ok) {
        const slidesData = await slidesRes.json();
        setSlides(slidesData.sort((a: Slide, b: Slide) => a.order - b.order));
      }
      if (sidebarRes.ok) {
        const sidebarData = await sidebarRes.json();
        setSidebarItems(sidebarData.sort((a: SidebarItem, b: SidebarItem) => a.order - b.order));
      }
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        setAds(adsData.sort((a: Ad, b: Ad) => a.order - b.order));
      }
    } catch (err) {
      console.error("Error fetching homepage data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <MobileHeader />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-sky-400/30 border-t-sky-500 border-r-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-400/30 border-b-purple-500 border-l-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-sm sm:text-base animate-pulse">Loading...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <MobileHeader />

      <main>
        {/* Hero Slideshow */}
        <MobileSlideshow slides={slides} />

        {/* Features Section */}
        <section className="py-8 sm:py-16 px-3 sm:px-4 max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-12">
            <Badge className="bg-sky-100 text-sky-700 border-sky-200 mb-2 sm:mb-3 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Why MASI FAST RESULTS?
            </Badge>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
              Fast & Accurate Results
            </h2>
            <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2 max-w-2xl mx-auto">
              A modern system for viewing student results quickly and accurately
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <FeatureCard 
              icon={<Clock className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Fast Results"
              description="Get student results instantly"
            />
            <FeatureCard 
              icon={<CheckCircle className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Accurate & Detailed"
              description="Complete student information"
            />
            <FeatureCard 
              icon={<UsersRound className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Easy for Parents"
              description="Track your child's progress easily"
            />
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Progress Tracking"
              description="Monitor grade trends over time"
            />
          </div>
        </section>

        {/* Login Cards */}
        <section className="py-8 sm:py-12 px-3 sm:px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <LoginCard
              title="Teacher / Academic"
              description="Manage students, marks, and reports"
              icon={<Users className="h-6 w-6 sm:h-10 sm:w-10 text-white" />}
              gradient="bg-gradient-to-r from-sky-500 to-blue-600 shadow-sky-500/30"
              loginHref="/login"
              registerHref="/register"
              loginLabel="Login as Teacher"
              registerLabel="Register as Teacher"
            />
            <LoginCard
              title="Mzazi / Mlezi"
              description="Angalia matokeo ya mtoto wako"
              icon={<UsersRound className="h-6 w-6 sm:h-10 sm:w-10 text-white" />}
              gradient="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30"
              loginHref="/parent/login"
              registerHref="/parent/register"
              loginLabel="Ingia kama Mzazi"
              registerLabel="Jisajili kama Mzazi"
            />
          </div>
        </section>

        {/* Sidebar Items Section */}
        {sidebarItems.length > 0 && (
          <section className="py-8 sm:py-16 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              <div className="text-center mb-6 sm:mb-12">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-2 sm:mb-3 text-xs sm:text-sm">
                  <Star className="h-3 w-3 mr-1" />
                  Our Services
                </Badge>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800">What We Offer</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {sidebarItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1">
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-32 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                      />
                      <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{item.caption}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ads Section */}
        {ads.length > 0 && (
          <section className="py-8 sm:py-16 px-3 sm:px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {ads.map((ad) => (
                <a
                  key={ad.id}
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:scale-105 transition-transform duration-300 touch-feedback"
                >
                  <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-32 sm:h-48 object-cover"
                    />
                    <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6 pb-3 sm:pb-4">
                      <h3 className="text-sm sm:text-lg font-semibold mb-1 text-gray-800">{ad.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{ad.caption}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 py-8 sm:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              MASI FAST RESULTS
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
              Ready to See Results?
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Join our system and start viewing student results quickly and accurately
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-sky-700 hover:bg-gray-100 gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base h-11 sm:h-12 touch-feedback"
                >
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                  Login as Teacher
                </Button>
              </Link>
              <Link href="/parent/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-gray-100 gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base h-11 sm:h-12 touch-feedback"
                >
                  <UsersRound className="h-4 w-4 sm:h-5 sm:w-5" />
                  Ingia kama Mzazi
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <School className="h-4 w-4 sm:h-5 sm:w-5 text-sky-400" />
            <span className="font-bold text-sm sm:text-base text-sky-400">MASI FAST RESULTS</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">Fast and Accurate Results</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 text-xs text-gray-500">
            <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
          <p className="text-gray-600 text-[10px] sm:text-xs mt-3 sm:mt-4">
            &copy; {new Date().getFullYear()} MASI FAST RESULTS SYSTEM. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }
        @media (max-width: 400px) {
          .xs\\:block { display: block !important; }
          .xs\\:hidden { display: none !important; }
        }
        @media (min-width: 401px) {
          .xs\\:block { display: none !important; }
          .xs\\:hidden { display: block !important; }
        }
      `}</style>
    </MobileLayout>
  );
}