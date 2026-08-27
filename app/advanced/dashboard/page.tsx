"use client";

import { MainLayout } from "@/components/layout/MainLayout";

export default function AdvancedDashboard() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Advanced Level Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Advanced Level Management System</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h3 className="font-semibold">Students</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-teal-50 p-6 rounded-lg">
            <h3 className="font-semibold">Teachers</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg">
            <h3 className="font-semibold">Combinations</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}