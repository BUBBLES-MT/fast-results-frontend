// components/past-papers/AddPastPaper.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X, FileText, Calendar, GraduationCap, BookOpen, Sparkles } from "lucide-react";

// ============================================================
// 🔥 API BASE - FIXED! Inatumia Environment Variable
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Subject {
  id: number;
  name: string;
  code: string;
  level?: string;
}

interface PastPaperForm {
  title: string;
  subject: string;
  exam_type: string;
  year: number;
  class_level: string;
  school_level: string;
  description: string;
  file: File | null;
}

const EXAM_TYPES = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "NATIONAL", "JOINT MOCK"];

const CLASS_LEVELS = {
  primary: ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"],
  secondary: ["Form 1", "Form 2", "Form 3", "Form 4"],
  advanced: ["Form 5", "Form 6"],
};

const SCHOOL_LEVEL_LABELS = {
  primary: "🏫 Primary School",
  secondary: "📚 Secondary School",
  advanced: "🎓 Advanced Level"
};

export function AddPastPaper() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [token, setToken] = useState("");
  const [userSchoolLevel, setUserSchoolLevel] = useState<string>("secondary");

  const [form, setForm] = useState<PastPaperForm>({
    title: '',
    subject: '',
    exam_type: '',
    year: new Date().getFullYear(),
    class_level: '',
    school_level: 'secondary',
    description: '',
    file: null
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    
    const schoolLevel = localStorage.getItem("school_level") || "secondary";
    setUserSchoolLevel(schoolLevel);
    setForm(prev => ({ ...prev, school_level: schoolLevel }));
    
    loadSubjects(storedToken, schoolLevel);
  }, [router]);

  // ============================================================
  // 🔥 FIXED: Load subjects with API_BASE!
  // ============================================================
  const loadSubjects = async (authToken: string, schoolLevel: string) => {
    try {
      setLoading(true);
      console.log(`🔍 Loading subjects for level: ${schoolLevel}`);
      console.log(`📡 API URL: ${API_BASE}/api/v1/subjects?level=${schoolLevel}`);
      
      // 🔥🔥🔥 SAHIHI: Tumia API_BASE! 🔥🔥🔥
      const response = await fetch(`${API_BASE}/api/v1/subjects?level=${schoolLevel}`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📚 Subjects from API (raw):', data);
        
        // 🔥 REMOVE DUPLICATES by name
        const seen = new Set();
        const uniqueSubjects = (data || []).filter((sub: Subject) => {
          const key = sub.name;
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        });
        
        console.log('📚 Subjects after removing duplicates:', uniqueSubjects);
        
        setSubjects(uniqueSubjects);
        
        if (uniqueSubjects.length > 0) {
          setForm(prev => ({ ...prev, subject: uniqueSubjects[0].name }));
        } else {
          setSubjects([]);
          setMessage({ 
            type: 'info', 
            text: `No subjects found for ${schoolLevel} level. Please contact your academic master.` 
          });
        }
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        setSubjects([]);
        setMessage({ 
          type: 'error', 
          text: error.detail || 'Failed to load subjects. Please refresh and try again.' 
        });
      }
    } catch (error: any) {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Network error. Please check your connection.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File too large. Maximum size is 10MB' });
        e.target.value = '';
        return;
      }
      
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedExtensions.includes(`.${ext}`)) {
        setMessage({ type: 'error', text: 'File type not allowed. Allowed: PDF, Word, TXT' });
        e.target.value = '';
        return;
      }

      setForm({ ...form, file });
      setMessage(null);
    }
  };

  // ============================================================
  // 🔥 FIXED: Upload with API_BASE!
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a title' });
      return;
    }
    if (!form.subject) {
      setMessage({ type: 'error', text: 'Please select a subject' });
      return;
    }
    if (!form.exam_type) {
      setMessage({ type: 'error', text: 'Please select an exam type' });
      return;
    }
    if (!form.class_level) {
      setMessage({ type: 'error', text: 'Please select a class level' });
      return;
    }
    if (!form.file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('subject', form.subject);
      formData.append('exam_type', form.exam_type);
      formData.append('year', String(form.year));
      formData.append('class_level', form.class_level);
      formData.append('school_level', form.school_level);
      if (form.description) {
        formData.append('description', form.description.trim());
      }
      formData.append('file', form.file);

      // 🔥🔥🔥 SAHIHI: Tumia API_BASE! 🔥🔥🔥
      const url = `${API_BASE}/api/v1/past-papers/upload`;
      console.log(`📤 Uploading to: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload');
      }

      setMessage({ 
        type: 'success', 
        text: `✅ "${form.title}" uploaded successfully!` 
      });
      
      setTimeout(() => {
        setForm({
          title: '',
          subject: subjects.length > 0 ? subjects[0].name : '',
          exam_type: '',
          year: new Date().getFullYear(),
          class_level: '',
          school_level: userSchoolLevel,
          description: '',
          file: null
        });
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        router.push(`/${userSchoolLevel}/past-papers`);
      }, 2000);

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMsg = error.message || 'Failed to upload past paper';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 blur-xl opacity-50 animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 relative z-10" />
        </div>
        <p className="text-gray-500 mt-4 animate-pulse">Loading subjects...</p>
      </div>
    );
  }

  const availableClassLevels = CLASS_LEVELS[userSchoolLevel as keyof typeof CLASS_LEVELS] || [];

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl border-0 overflow-hidden bg-white">
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
        
        <CardHeader className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Upload Past Paper
                </CardTitle>
                <p className="text-sm text-gray-500 mt-0.5">
                  {SCHOOL_LEVEL_LABELS[userSchoolLevel as keyof typeof SCHOOL_LEVEL_LABELS]}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-white">
          {message && (
            <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
              message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <span className="text-lg">{message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}</span>
              <span className="flex-1">{message.text}</span>
              <button 
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {subjects.length === 0 ? (
            <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-yellow-800">No Subjects Found</h3>
              <p className="text-yellow-700 mt-2 max-w-md mx-auto">
                No subjects found for {userSchoolLevel} level. Please contact your academic master.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                onClick={() => router.push(`/${userSchoolLevel}/dashboard`)}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Mathematics Terminal Examination 2024"
                    className="pl-10 bg-white"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.subject}
                  onValueChange={(value) => setForm({ ...form, subject: value })}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-200">
                    <SelectValue placeholder={`Select subject (${userSchoolLevel})`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                    {subjects.map((sub) => (
                      <SelectItem 
                        key={`subject-${sub.id}`}
                        value={sub.name}
                        className="hover:bg-gray-100 cursor-pointer py-2 px-3"
                      >
                        {sub.name} {sub.code && `(${sub.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <span>📌</span> Showing subjects for {userSchoolLevel} level only
                </p>
              </div>

              {/* Exam Type, Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Exam Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.exam_type}
                    onValueChange={(value) => setForm({ ...form, exam_type: value })}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-200">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                      {EXAM_TYPES.map((type) => (
                        <SelectItem 
                          key={`exam-${type}`} 
                          value={type}
                          className="hover:bg-gray-100 cursor-pointer py-2 px-3"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      required
                      min="2000"
                      max="2100"
                      className="pl-10 bg-white"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    />
                  </div>
                </div>
              </div>

              {/* School Level - Readonly */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  School Level <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 ml-2">(Automatic)</span>
                </Label>
                <div className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
                  {SCHOOL_LEVEL_LABELS[userSchoolLevel as keyof typeof SCHOOL_LEVEL_LABELS] || userSchoolLevel}
                </div>
                <input type="hidden" name="school_level" value={userSchoolLevel} />
                <p className="text-xs text-gray-400 mt-1.5">
                  School level is automatically set based on your account
                </p>
              </div>

              {/* Class Level */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Class Level <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select
                    value={form.class_level}
                    onValueChange={(value) => setForm({ ...form, class_level: value })}
                  >
                    <SelectTrigger className="w-full pl-10 bg-white border border-gray-200">
                      <SelectValue placeholder={`Select class level (${userSchoolLevel})`} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                      {availableClassLevels.map((level) => (
                        <SelectItem 
                          key={`class-${level}`} 
                          value={level}
                          className="hover:bg-gray-100 cursor-pointer py-2 px-3"
                        >
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <span>📚</span> Classes for {userSchoolLevel} level
                </p>
              </div>

              {/* File Upload */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  File <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg transition-all ${
                      form.file 
                        ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                        : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50 bg-white'
                    }`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">{form.file ? '📎' : '📤'}</div>
                        <div className="text-sm font-medium text-gray-700">
                          {form.file ? form.file.name : 'Click to select file'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {form.file ? `${(form.file.size / 1024).toFixed(1)} KB` : 'PDF, Word, TXT (Max 10MB)'}
                        </div>
                      </div>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      required
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {form.file && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setForm({ ...form, file: null });
                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description <span className="text-gray-400 text-xs">(optional)</span>
                </Label>
                <Textarea
                  rows={3}
                  placeholder="Brief description of the past paper"
                  className="w-full resize-none bg-white"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={uploading}
                className="w-full py-6 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Past Paper
                  </span>
                )}
              </Button>

              {/* Info Note */}
              <div className="text-xs text-gray-400 text-center mt-2 border-t pt-3 space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  All uploaded papers will be visible to all teachers and students
                </p>
                <p className="flex items-center justify-center gap-1">
                  <BookOpen className="h-3 w-3 text-amber-500" />
                  You can only upload papers for subjects you teach
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}