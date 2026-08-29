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
  BarChart3,
  Target,
  Medal,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 TYPING EFFECT WORDS
// ============================================================
const TYPING_WORDS = [
  "📊 Fast & Accurate Results",
  "🏆 Excellence in Education",
  "📈 Track Student Performance",
  "👨‍🏫 Empowering Teachers",
  "🎓 Shaping Future Leaders",
];

// ============================================================
// 🔥 TYPING EFFECT COMPONENT
// ============================================================
function TypingEffect() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];
    
    const timer = setTimeout(() => {
      if (isWaiting) {
        setIsWaiting(false);
        return;
      }
      
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.substring(0, text.length + 1));
        } else {
          setIsWaiting(true);
          setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.substring(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [text, wordIndex, isDeleting, isWaiting]);

  return (
    <div className="h-7 sm:h-9 md:h-10 flex items-center justify-center">
      <span className="text-lg sm:text-xl md:text-2xl font-semibold text-white/95">
        {text}
        <span className="inline-block w-0.5 h-5 sm:h-6 md:h-7 ml-0.5 bg-white animate-pulse" />
      </span>
    </div>
  );
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
    <header className="bg-white/95 backdrop-blur-xl shadow-md sticky top-0 z-50 border-b border-sky-200/60">
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
// 🔥 HERO SECTION - PRO MAX, ILIYOPUNGUZWA UKUBWA!
// ============================================================

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-72 h-72 md:w-96 md:h-96 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 md:w-96 md:h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-fadeIn">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            MASI FAST RESULTS
          </div>

          {/* Main Title - Big and Readable */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 animate-fadeIn animation-delay-200 leading-tight">
            Fast & Accurate
            <span className="block text-sky-200">Student Results</span>
          </h1>

          {/* Typing Effect - Professional */}
          <div className="mb-3 sm:mb-4 animate-fadeIn animation-delay-400">
            <TypingEffect />
          </div>

          {/* Description - Clear and Readable for Parents */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 animate-fadeIn animation-delay-600 leading-relaxed">
            A modern platform for teachers, parents, and students to track 
            academic progress quickly and accurately.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-5 sm:mt-6 animate-fadeIn animation-delay-800">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-sky-700 hover:bg-gray-100 gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 touch-feedback"
              >
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                Login as Teacher
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/parent/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 touch-feedback"
              >
                <UsersRound className="h-4 w-4 sm:h-5 sm:w-5" />
                Ingia kama Mzazi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔥 FEATURE CARD - PRO MAX!
// ============================================================

function FeatureCard({ icon, title, description, color = "sky" }: { icon: React.ReactNode; title: string; description: string; color?: "sky" | "emerald" | "purple" | "amber" | "rose" | "indigo" }) {
  const colors = {
    sky: "from-sky-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    purple: "from-purple-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
  };

  return (
    <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-2 hover:scale-[1.02] touch-feedback group">
      <CardContent className="pt-5 sm:pt-7 px-4 sm:px-6 pb-5 sm:pb-7">
        <div className={cn(
          "mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4",
          "bg-gradient-to-br",
          colors[color]
        )}>
          <div className="h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

// ============================================================
// 🔥 LOGIN CARD - PRO MAX!
// ============================================================

function LoginCard({ 
  title, 
  description, 
  icon, 
  gradient, 
  loginHref, 
  registerHref, 
  loginLabel, 
  registerLabel,
  color = "sky"
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  loginHref: string;
  registerHref: string;
  loginLabel: string;
  registerLabel: string;
  color?: "sky" | "emerald";
}) {
  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
      <CardHeader className="text-center pt-5 sm:pt-7 px-4 sm:px-6">
        <div className={cn(
          "mx-auto p-3 sm:p-3.5 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 sm:mb-4 shadow-lg",
          gradient
        )}>
          <div className="h-7 w-7 sm:h-9 sm:w-9 text-white">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-7">
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

  return (
    <MobileLayout>
      <MobileHeader />

      <main>
        {/* Hero Section - PRO MAX, ILIYOPUNGUZWA! */}
        <HeroSection />

        {/* Features Section */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-sky-100 text-sky-700 border-sky-200 mb-3 sm:mb-4 text-sm sm:text-base px-4 py-1.5">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Why MASI FAST RESULTS?
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Empowering Education
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2 max-w-3xl mx-auto leading-relaxed">
              A modern system for viewing student results quickly and accurately
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCard 
              icon={<Clock className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Fast Results"
              description="Get student results instantly with just a few clicks"
              color="sky"
            />
            <FeatureCard 
              icon={<CheckCircle className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Accurate & Detailed"
              description="Complete student information with detailed reports"
              color="emerald"
            />
            <FeatureCard 
              icon={<UsersRound className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Easy for Parents"
              description="Track your child's academic progress easily"
              color="purple"
            />
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />}
              title="Progress Tracking"
              description="Monitor grade trends and performance over time"
              color="amber"
            />
          </div>
        </section>

        {/* Login Cards */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-3 sm:mb-4 text-sm sm:text-base px-4 py-1.5">
              <UsersRound className="h-4 w-4 mr-1.5" />
              Get Started
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Choose Your Role
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2 max-w-3xl mx-auto leading-relaxed">
              Select the appropriate login based on your role in the education system
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <LoginCard
              title="Teacher / Academic"
              description="Manage students, marks, and reports"
              icon={<Users className="h-6 w-6 sm:h-9 sm:w-9 text-white" />}
              gradient="bg-gradient-to-r from-sky-500 to-blue-600 shadow-sky-500/30"
              loginHref="/login"
              registerHref="/register"
              loginLabel="Login as Teacher"
              registerLabel="Register as Teacher"
              color="sky"
            />
            <LoginCard
              title="Mzazi / Mlezi"
              description="Angalia matokeo ya mtoto wako"
              icon={<UsersRound className="h-6 w-6 sm:h-9 sm:w-9 text-white" />}
              gradient="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30"
              loginHref="/parent/login"
              registerHref="/parent/register"
              loginLabel="Ingia kama Mzazi"
              registerLabel="Jisajili kama Mzazi"
              color="emerald"
            />
          </div>
        </section>

        {/* CTA Section - PRO MAX */}
        <section className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-sm sm:text-base font-medium mb-4 sm:mb-5">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              MASI FAST RESULTS
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to See Results?
            </h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
              Join our system and start viewing student results quickly and accurately
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-sky-700 hover:bg-gray-100 gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 touch-feedback"
                >
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                  Login as Teacher
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/parent/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 touch-feedback"
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
          opacity: 0;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
          opacity: 0;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
          opacity: 0;
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