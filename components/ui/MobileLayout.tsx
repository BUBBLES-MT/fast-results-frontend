// components/ui/MobileLayout.tsx

"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS
// ============================================================

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function MobileLayout({ children, className, noPadding }: MobileLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
      !noPadding && "p-3 sm:p-4 md:p-6",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// 🔥 MOBILE CARD
// ============================================================

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function MobileCard({ children, className, noPadding }: MobileCardProps) {
  return (
    <div className={cn(
      "bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border-0 overflow-hidden",
      !noPadding && "p-4 sm:p-6",
      className
    )}>
      {children}
    </div>
  );
}

// ============================================================
// 🔥 MOBILE HEADER
// ============================================================

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function MobileHeader({ title, subtitle, icon, className, children }: MobileHeaderProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700",
      "p-4 sm:p-6 text-white shadow-xl mb-4 sm:mb-6",
      className
    )}>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-sky-100/80 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {children && (
            <div className="flex-shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔥 MOBILE GRID
// ============================================================

interface MobileGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MobileGrid({ children, cols = 1, className }: MobileGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };
  
  return (
    <div className={cn(
      "grid gap-3 sm:gap-4",
      gridCols[cols] || gridCols[1],
      className
    )}>
      {children}
    </div>
  );
}

// ============================================================
// 🔥 MOBILE STAT CARD
// ============================================================

interface MobileStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: "sky" | "emerald" | "amber" | "red" | "purple" | "indigo" | "blue" | "green";
  onClick?: () => void;
  className?: string;
}

export function MobileStatCard({ 
  label, 
  value, 
  icon, 
  color = "sky",
  onClick,
  className
}: MobileStatCardProps) {
  const colors = {
    sky: "from-sky-500 to-blue-600",
    blue: "from-blue-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-600",
    green: "from-green-500 to-emerald-600",
    amber: "from-amber-500 to-orange-600",
    red: "from-red-500 to-rose-600",
    purple: "from-purple-500 to-pink-600",
    indigo: "from-indigo-500 to-blue-600",
  };
  
  return (
    <div 
      className={cn(
        "rounded-2xl p-3 sm:p-4 text-white shadow-lg",
        "transition-all duration-300 active:scale-95 touch-feedback",
        onClick && "cursor-pointer hover:scale-105",
        `bg-gradient-to-r ${colors[color] || colors.sky}`,
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-sm font-medium text-white/80 truncate">{label}</p>
          <p className="text-lg sm:text-2xl md:text-3xl font-bold mt-0.5 truncate">{value}</p>
        </div>
        <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔥 MOBILE BACK BUTTON
// ============================================================

interface MobileBackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function MobileBackButton({ onClick, label = "Rudi", className }: MobileBackButtonProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// ============================================================
// 🔥 MOBILE SECTION
// ============================================================

interface MobileSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function MobileSection({ title, description, children, className }: MobileSectionProps) {
  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ============================================================
// 🔥 MOBILE TABLE WRAPPER
// ============================================================

interface MobileTableWrapperProps {
  children: ReactNode;
  className?: string;
}

export function MobileTableWrapper({ children, className }: MobileTableWrapperProps) {
  return (
    <div className={cn(
      "overflow-x-auto -mx-4 sm:mx-0 scrollable",
      className
    )}>
      <div className="px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// 🔥 MOBILE EMPTY STATE
// ============================================================

interface MobileEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function MobileEmptyState({ icon, title, description, action }: MobileEmptyStateProps) {
  return (
    <div className="text-center py-8 sm:py-12">
      {icon && (
        <div className="text-gray-300 mb-3">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  );
}

// ============================================================
// 🔥 MOBILE LOADING
// ============================================================

export function MobileLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-sky-400/30 border-t-sky-500 border-r-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-400/30 border-b-purple-500 border-l-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
        </div>
        <p className="text-gray-600 mt-4 text-sm sm:text-base animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// ============================================================
// 🔥 MOBILE SUCCESS/ERROR ALERT
// ============================================================

interface MobileAlertProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  className?: string;
}

export function MobileAlert({ type, message, className }: MobileAlertProps) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-600",
    info: "bg-sky-50 border-l-4 border-sky-500 text-sky-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
  };
  
  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Info className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
  };
  
  return (
    <div className={cn(
      "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-md animate-slideIn",
      styles[type],
      className
    )}>
      {icons[type]}
      <p className="text-sm sm:text-base break-words">{message}</p>
    </div>
  );
}

// ============================================================
// 🔥 IMPORTS FOR COMPONENTS
// ============================================================

import { useRouter } from "next/navigation";
import { 
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle 
} from "lucide-react";