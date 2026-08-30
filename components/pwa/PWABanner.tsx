"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone, Sparkles, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function PWABanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (!dismissed) {
      setShowBanner(true);
      setTimeout(() => setIsVisible(true), 100);
    }

    const installedHandler = () => {
      setIsInstalled(true);
      setShowBanner(false);
      localStorage.setItem('pwa-banner-dismissed', 'true');
    };

    window.addEventListener('appinstalled', installedHandler);
    return () => window.removeEventListener('appinstalled', installedHandler);
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstall = () => {
    if (isIOS) {
      alert("📱 Install App on iOS:\n\n1. Tap 'Share' icon 📤\n2. Select 'Add to Home Screen' ➕\n3. Tap 'Add' ✅");
    } else {
      const event = new Event('beforeinstallprompt');
      window.dispatchEvent(event);
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div 
      className={cn(
        "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-800 dark:via-blue-800 dark:to-indigo-800",
        "border-b border-white/10 shadow-lg",
        "py-1.5 px-3 sm:px-4",
        "flex items-center justify-between gap-2 flex-wrap",
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      )}
    >
      {/* Left Section - App Info */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Animated Icon */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse" />
          <div className="relative p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full">
            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              📱 Install App
            </span>
            <span className="hidden xs:inline-block text-[10px] sm:text-xs text-white/80 truncate">
              • Fast results access
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] sm:text-[10px] text-white/70 font-medium">
                Free Download
              </span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-white/50">•</span>
            <div className="flex items-center gap-0.5">
              <Zap className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-amber-400" />
              <span className="text-[8px] sm:text-[10px] text-white/70 font-medium">
                2 min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <Button
          onClick={handleInstall}
          size="sm"
          className={cn(
            "bg-white text-sky-700 hover:bg-gray-100",
            "shadow-lg hover:shadow-xl",
            "h-7 sm:h-8 md:h-9",
            "text-[10px] sm:text-xs md:text-sm",
            "px-2 sm:px-3 md:px-4",
            "gap-1 sm:gap-1.5",
            "font-semibold",
            "transition-all duration-300",
            "hover:scale-105 active:scale-95",
            "touch-feedback"
          )}
        >
          <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sky-600" />
          <span className="hidden xs:inline">Install</span>
          <span className="xs:hidden">Get</span>
          <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-sky-400 hidden sm:block" />
        </Button>

        <button
          onClick={handleDismiss}
          className={cn(
            "text-white/50 hover:text-white/90",
            "p-1 sm:p-1.5",
            "rounded-full",
            "hover:bg-white/10",
            "transition-all duration-200",
            "touch-feedback"
          )}
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>

      {/* Decorative Sparkles */}
      <div className="absolute -right-2 -top-2 opacity-20 pointer-events-none">
        <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
      </div>
      <div className="absolute -left-2 -bottom-2 opacity-10 pointer-events-none">
        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      </div>
    </div>
  );
}