// app/secondary/help/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  GraduationCap,
  Users,
  Award,
  Brain,
  BarChart3,
  ChevronLeft,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Star,
  Trophy,
  Crown,
  TrendingUp,
  Calendar,
  Layers,
  School,
  Eye,
  UserPlus,
  Download,
  Printer,
  Globe,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  Zap,
  Lightbulb,
  Target,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - PRO MAX!
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
    >
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}

function MobileHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 rounded-2xl shadow-lg backdrop-blur-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-blue-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {badge && <div className="flex-shrink-0">{badge}</div>}
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  children,
  className,
  hover = true,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <Card
      className={cn(
        "border-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm",
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
}

function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "blue" | "emerald" | "amber" | "purple" | "red" | "sky" | "indigo" | "pink";
  subtitle?: string;
  delay?: number;
}) {
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    sky: "from-sky-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    purple: "from-purple-500 to-pink-500",
    red: "from-red-500 to-rose-500",
    indigo: "from-indigo-500 to-purple-500",
    pink: "from-pink-500 to-rose-500",
  };

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.blue}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[8px] sm:text-[10px] text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </div>
      </div>
    </div>
  );
}

function MobileTipCard({
  icon,
  title,
  description,
  color = "blue",
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal" | "indigo" | "pink" | "sky" | "emerald";
  delay?: number;
}) {
  const colors = {
    blue: "bg-blue-50 hover:bg-blue-100 border-blue-100",
    sky: "bg-sky-50 hover:bg-sky-100 border-sky-100",
    green: "bg-green-50 hover:bg-green-100 border-green-100",
    emerald: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100",
    purple: "bg-purple-50 hover:bg-purple-100 border-purple-100",
    orange: "bg-orange-50 hover:bg-orange-100 border-orange-100",
    red: "bg-red-50 hover:bg-red-100 border-red-100",
    teal: "bg-teal-50 hover:bg-teal-100 border-teal-100",
    indigo: "bg-indigo-50 hover:bg-indigo-100 border-indigo-100",
    pink: "bg-pink-50 hover:bg-pink-100 border-pink-100",
  };

  const textColors = {
    blue: "text-blue-800",
    sky: "text-sky-800",
    green: "text-green-800",
    emerald: "text-emerald-800",
    purple: "text-purple-800",
    orange: "text-orange-800",
    red: "text-red-800",
    teal: "text-teal-800",
    indigo: "text-indigo-800",
    pink: "text-pink-800",
  };

  const descColors = {
    blue: "text-blue-600",
    sky: "text-sky-600",
    green: "text-green-600",
    emerald: "text-emerald-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
    teal: "text-teal-600",
    indigo: "text-indigo-600",
    pink: "text-pink-600",
  };

  const iconColors = {
    blue: "text-blue-600",
    sky: "text-sky-600",
    green: "text-green-600",
    emerald: "text-emerald-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
    teal: "text-teal-600",
    indigo: "text-indigo-600",
    pink: "text-pink-600",
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:shadow-md touch-feedback",
        colors[color]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h4 className={cn("font-semibold flex items-center gap-2 text-sm sm:text-base", textColors[color])}>
        <span className={iconColors[color]}>{icon}</span>
        {title}
      </h4>
      <p className={cn("text-xs sm:text-sm mt-1", descColors[color])}>
        {description}
      </p>
    </div>
  );
}

function MobileFAQItem({
  question,
  answer,
  delay = 0,
}: {
  question: string;
  answer: string;
  delay?: number;
}) {
  return (
    <div
      className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-sm animate-slideIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h4 className="font-semibold text-gray-800 text-sm sm:text-base flex items-start gap-2">
        <span className="text-blue-500 mt-0.5">❓</span>
        {question}
      </h4>
      <p className="text-xs sm:text-sm text-gray-600 mt-1 pl-6 sm:pl-7">{answer}</p>
    </div>
  );
}

function MobileContactCard({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-sm animate-slideIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-500">{label}</p>
        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
export default function HelpPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-5xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title="Help & Support"
          subtitle="Find answers and get assistance"
          icon={<HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Resources
            </span>
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-white hover:bg-white/20 rounded-xl text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-feedback"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <MobileStatCard
            label="Quick Tips"
            value={6}
            icon={Lightbulb}
            color="blue"
            subtitle="Helpful guides"
            delay={100}
          />
          <MobileStatCard
            label="FAQs"
            value={4}
            icon={MessageSquare}
            color="purple"
            subtitle="Common questions"
            delay={200}
          />
          <MobileStatCard
            label="Support"
            value={2}
            icon={Mail}
            color="emerald"
            subtitle="Contact options"
            delay={300}
          />
          <MobileStatCard
            label="Quick Links"
            value={6}
            icon={Zap}
            color="amber"
            subtitle="Fast navigation"
            delay={400}
          />
        </div>

        {/* Quick Tips */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <MobileTipCard
              icon={<Award className="h-4 w-4" />}
              title="Entering Marks"
              description="Go to Marks section to record student grades and scores"
              color="blue"
              delay={100}
            />
            <MobileTipCard
              icon={<Users className="h-4 w-4" />}
              title="My Students"
              description="View all students assigned to your classes in My Students"
              color="green"
              delay={200}
            />
            <MobileTipCard
              icon={<Brain className="h-4 w-4" />}
              title="AI Exam"
              description="Generate practice questions and exams using AI Exam feature"
              color="purple"
              delay={300}
            />
            <MobileTipCard
              icon={<BarChart3 className="h-4 w-4" />}
              title="Reports"
              description="Generate and print student report cards in Reports section"
              color="orange"
              delay={400}
            />
            <MobileTipCard
              icon={<GraduationCap className="h-4 w-4" />}
              title="Class Management"
              description="Manage classes, streams, and subject assignments easily"
              color="indigo"
              delay={500}
            />
            <MobileTipCard
              icon={<Shield className="h-4 w-4" />}
              title="Role Permissions"
              description="Admins can assign and manage teacher roles"
              color="pink"
              delay={600}
            />
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <MobileFAQItem
              question="How do I enter marks?"
              answer="Go to Marks section, select your class and subject, then enter scores for each student."
              delay={100}
            />
            <MobileFAQItem
              question="How do I view my students?"
              answer="Go to My Students section to see all students assigned to your classes."
              delay={200}
            />
            <MobileFAQItem
              question="How do I generate a report?"
              answer="Go to Reports section, select a student, and click 'View Report' to generate their report card."
              delay={300}
            />
            <MobileFAQItem
              question="How do I use AI Exam?"
              answer="Go to AI Exam section, select subject and class, and click 'Generate' to create practice questions."
              delay={400}
            />
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Contact Support
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <MobileContactCard
              icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="Email"
              value="support@masifastresults.com"
              delay={100}
            />
            <MobileContactCard
              icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="Phone"
              value="+255 763 298 398"
              delay={200}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
            Quick Links
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="justify-start text-xs sm:text-sm h-9 sm:h-10 rounded-xl touch-feedback border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              onClick={() => router.push("/secondary/dashboard")}
            >
              📊 Dashboard
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs sm:text-sm h-9 sm:h-10 rounded-xl touch-feedback border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
              onClick={() => router.push("/secondary/marks")}
            >
              📝 Enter Marks
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs sm:text-sm h-9 sm:h-10 rounded-xl touch-feedback border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
              onClick={() => router.push("/secondary/students/my-students-view")}
            >
              👨‍🎓 My Students
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs sm:text-sm h-9 sm:h-10 rounded-xl touch-feedback border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              onClick={() => router.push("/secondary/ai-exam")}
            >
              🤖 AI Exam
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs sm:text-sm h-9 sm:h-10 rounded-xl touch-feedback border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
              onClick={() => router.push("/secondary/reports")}
            >
              📊 Reports
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs sm:text-sm h-9 sm:h-10 rounded-xl touch-feedback border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
              onClick={() => router.push("/secondary/profile")}
            >
              👤 Profile
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-blue-100 shadow-lg animate-slideIn" style={{ animationDelay: "700ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-2xl flex-shrink-0">
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">Need More Help?</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Our support team is available Monday-Friday, 8:00 AM - 5:00 PM EAT.
                We typically respond to emails within 24 hours.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-xs sm:text-sm h-8 sm:h-9 touch-feedback"
                  onClick={() => window.open("mailto:support@masifastresults.com")}
                >
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  Email Us
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs sm:text-sm h-8 sm:h-9 touch-feedback"
                  onClick={() => window.open("tel:+255763298398")}
                >
                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                  Call Us
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "800ms" }}>
          <p className="font-medium text-blue-600">© 2026 MASI FAST RESULTS • Help & Support</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>💡 6 tips</span>
            <span>•</span>
            <span>❓ 4 FAQs</span>
            <span>•</span>
            <span>📧 2 contact options</span>
            <span>•</span>
            <span>⚡ 6 quick links</span>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }

        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        @media (max-width: 399px) {
          .xs\\:inline {
            display: inline !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:inline {
            display: none !important;
          }
          .xs\\:hidden {
            display: inline !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}