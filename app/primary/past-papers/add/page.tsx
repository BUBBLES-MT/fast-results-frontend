// app/primary/past-papers/add/page.tsx
"use client"

import { AddPastPaper } from "@/components/past-papers/AddPastPaper"
import { MainLayout } from "@/components/layout/MainLayout"

export default function PrimaryAddPastPaperPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <AddPastPaper />
      </div>
    </MainLayout>
  )
}