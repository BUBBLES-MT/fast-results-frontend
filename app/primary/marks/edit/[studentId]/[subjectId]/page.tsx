"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";

interface Mark {
  id: number;
  exam_type: string;
  score: number;
}

const AINA_ZAMTIHANI = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

export default function HaririAlamaPage({ params }: { params: Promise<{ studentId: string; subjectId: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { studentId, subjectId } = unwrappedParams;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [studentName, setStudentName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [marks, setMarks] = useState<Mark[]>([]);
  const [formData, setFormData] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchMarksData(storedToken);
  }, [router, studentId, subjectId]);

  const fetchMarksData = async (authToken: string) => {
    try {
      setLoading(true);
      
      // Fetch marks for this student and subject
      const marksRes = await fetch(`/api/v1/marks?student_id=${studentId}&subject_id=${subjectId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      let marksData: Mark[] = [];
      if (marksRes.ok) {
        marksData = await marksRes.json();
      }
      
      // Fetch student name
      const studentRes = await fetch(`/api/v1/students/${studentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (studentRes.ok) {
        const student = await studentRes.json();
        setStudentName(student.name);
      }
      
      // Fetch subject name
      const subjectRes = await fetch(`/api/v1/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (subjectRes.ok) {
        const subject = await subjectRes.json();
        setSubjectName(subject.name);
      }
      
      setMarks(marksData);
      
      // Initialize form data with existing marks
      const newFormData = new Map<string, string>();
      AINA_ZAMTIHANI.forEach(et => {
        const existingMark = marksData.find(m => m.exam_type === et);
        newFormData.set(et, existingMark ? existingMark.score.toString() : "");
      });
      setFormData(newFormData);
      
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Imeshindwa kupakia data");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (examType: string, value: string) => {
    const newFormData = new Map(formData);
    newFormData.set(examType, value);
    setFormData(newFormData);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id");
    let savedCount = 0;
    let failedCount = 0;
    
    for (const examType of AINA_ZAMTIHANI) {
      const score = formData.get(examType);
      if (score && score.trim() !== "") {
        const existingMark = marks.find(m => m.exam_type === examType);
        
        try {
          if (existingMark) {
            // Update existing mark
            const response = await fetch(`/api/v1/marks/${existingMark.id}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                score: parseFloat(score),
                exam_type: examType,
              }),
            });
            
            if (response.ok) {
              savedCount++;
            } else {
              failedCount++;
            }
          } else {
            // Create new mark
            const payload = {
              student_id: parseInt(studentId),
              subject_id: parseInt(subjectId),
              score: parseFloat(score),
              exam_type: examType,
              teacher_id: parseInt(teacherId || "0"),
            };
            
            const response = await fetch("/api/v1/marks", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            
            if (response.ok) {
              savedCount++;
            } else {
              failedCount++;
            }
          }
        } catch (err) {
          failedCount++;
        }
      }
    }
    
    if (savedCount > 0) {
      setSuccess(`Alama ${savedCount} zimehifadhiwa kikamilifu. ${failedCount > 0 ? `${failedCount} zimeshindwa.` : ""}`);
      fetchMarksData(token);
    } else {
      setError("Hakuna alama zilizohifadhiwa.");
    }
    
    setSaving(false);
  };

  const handleDeleteExamType = async (examType: string) => {
    const existingMark = marks.find(m => m.exam_type === examType);
    if (!existingMark) return;
    
    if (!confirm(`Je, una uhakika unataka kufuta alama za ${examType} za mwanafunzi huyu?`)) return;
    
    try {
      const response = await fetch(`/api/v1/marks/${existingMark.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        fetchMarksData(token);
        setSuccess(`Alama za ${examType} zimefutwa kikamilifu`);
      } else {
        setError("Imeshindwa kufuta alama");
      }
    } catch (err) {
      setError("Imeshindwa kufuta alama");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()} className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            Rudi
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hariri Alama</h1>
            <p className="text-gray-500 mt-1">
              {studentName} - {subjectName}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
            <CardTitle className="text-sky-800">Ingiza Alama kwa Kila Aina ya Mtihani</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-200">{error}</div>
            )}
            {success && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-4 border border-emerald-200">{success}</div>
            )}
            
            <div className="space-y-4">
              {AINA_ZAMTIHANI.map((examType) => {
                const hasExistingMark = marks.some(m => m.exam_type === examType);
                return (
                  <div key={examType} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="md:col-span-1">
                      <Label className="font-semibold text-gray-700">{examType}</Label>
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl"
                        placeholder="Weka alama (0-100)"
                        value={formData.get(examType) || ""}
                        onChange={(e) => handleMarkChange(examType, e.target.value)}
                      />
                    </div>
                    <div>
                      {hasExistingMark && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                          onClick={() => handleDeleteExamType(examType)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Futa
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveAll} disabled={saving} className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-xl">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Hifadhi Alama Zote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}