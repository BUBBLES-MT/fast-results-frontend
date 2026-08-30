"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  X, 
  Smartphone, 
  Sparkles, 
  ArrowRight,
  Zap,
  CheckCircle,
  Clock,
  WifiOff,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed === 'true') {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
      setTimeout(() => setIsVisible(true), 100);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (iOS) {
      setShowPrompt(true);
      setTimeout(() => setIsVisible(true), 100);
    }

    const installedHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert("📱 Install App on iOS:\n\n1. Tap 'Share' icon 📤\n2. Select 'Add to Home Screen' ➕\n3. Tap 'Add' ✅");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowPrompt(false);
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }, 300);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50",
        "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className={cn(
        "relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl",
        "border border-sky-200/50 dark:border-slate-700/50",
        "p-4 sm:p-5 md:p-6",
        "transition-all duration-500",
        isHovered && "shadow-3xl -translate-y-1"
      )}>
        
        {/* 🔥 Animated Gradient Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-2xl blur opacity-20 animate-pulse" />
        
        {/* 🔥 Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl animate-pulse" />

        {/* 🔥 Content */}
        <div className="relative">
          {/* Header with Icon */}
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Animated Icon */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl blur-lg animate-pulse" />
              <div className="relative p-2.5 sm:p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-float" />
              </div>
              {/* Badge */}
              <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 animate-pulse">
                <Zap className="h-2.5 w-2.5 text-white" />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white">
                  📱 Install App
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {isIOS 
                  ? "Tap 'Share' 📤 then 'Add to Home Screen' ➕"
                  : "Get fast results & offline access in one tap!"
                }
              </p>

              {/* 🔥 Features Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
                  <CheckCircle className="h-2.5 w-2.5 text-emerald-500" />
                  <span className="text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Free
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 rounded-full">
                  <Clock className="h-2.5 w-2.5 text-blue-500" />
                  <span className="text-[9px] sm:text-[10px] text-blue-700 dark:text-blue-400 font-medium">
                    2 min
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 rounded-full">
                  <WifiOff className="h-2.5 w-2.5 text-amber-500" />
                  <span className="text-[9px] sm:text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    Offline
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 Buttons */}
          <div className="flex items-center gap-2 mt-3 sm:mt-4">
            <Button
              onClick={handleInstall}
              size="sm"
              className={cn(
                "flex-1 bg-gradient-to-r from-sky-600 to-blue-600",
                "hover:from-sky-700 hover:to-blue-700",
                "text-white shadow-lg hover:shadow-xl",
                "h-9 sm:h-10 md:h-11",
                "text-xs sm:text-sm font-semibold",
                "gap-1.5 sm:gap-2",
                "transition-all duration-300",
                "hover:scale-105 active:scale-95",
                "touch-feedback",
                "relative overflow-hidden group"
              )}
            >
              {/* Button Shimmer Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110" />
              <span>{isIOS ? "Learn How" : "Install Now"}</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                "h-9 sm:h-10 md:h-11",
                "px-2 sm:px-3",
                "transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-white/10",
                "touch-feedback"
              )}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* 🔥 Footer */}
          <div className="flex items-center justify-center gap-2 mt-2.5">
            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
            <p className="text-[8px] sm:text-[9px] text-gray-400 dark:text-gray-500 text-center">
              Available on Android & iOS 
            </p>
            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
}