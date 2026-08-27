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
  BarChart3
} from "lucide-react";

export default function HelpPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push("/secondary/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Help Card */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Quick Tips */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Quick Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Entering Marks
                  </h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Go to <strong>Marks</strong> section to record student grades and scores
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-green-800 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    My Students
                  </h4>
                  <p className="text-sm text-green-600 mt-1">
                    View all students assigned to your classes in <strong>My Students</strong>
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Exam
                  </h4>
                  <p className="text-sm text-purple-600 mt-1">
                    Generate practice questions and exams using <strong>AI Exam</strong> feature
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Reports
                  </h4>
                  <p className="text-sm text-orange-600 mt-1">
                    Generate and print student report cards in <strong>Reports</strong> section
                  </p>
                </div>
              </div>
            </div>

            {/* Common Questions */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 mt-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800">How do I enter marks?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to <strong>Marks</strong> section, select your class and subject, then enter scores for each student.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800">How do I view my students?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to <strong>My Students</strong> section to see all students assigned to your classes.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800">How do I generate a report?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to <strong>Reports</strong> section, select a student, and click "View Report" to generate their report card.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800">How do I use AI Exam?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to <strong>AI Exam</strong> section, select subject and class, and click "Generate" to create practice questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Contact Support
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">support@schoolms.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800">+255 763 298 3??</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Quick Links
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                <Button variant="outline" className="justify-start" onClick={() => router.push("/secondary/dashboard")}>
                  📊 Dashboard
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push("/secondary/marks")}>
                  📝 Enter Marks
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push("/secondary/students/my-students-view")}>
                  👨‍🎓 My Students
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push("/secondary/ai-exam")}>
                  🤖 AI Exam
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push("/secondary/reports")}>
                  📊 Reports
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push("/secondary/profile")}>
                  👤 My Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}