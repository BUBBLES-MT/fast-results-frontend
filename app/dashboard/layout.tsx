// app/dashboard/layout.tsx
"use client";

import { useEffect } from "react";
import { setupSessionMonitoring } from "@/lib/session";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 🔥 ANZA SESSION MONITORING
    const cleanup = setupSessionMonitoring();
    return cleanup;
  }, []);

  return <>{children}</>;
}