"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  Brain, 
  Sparkles, 
  FileText, 
  Download,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Trophy,
  Stars,
  Rocket
} from "lucide-react";

// 🔥 SUBJECTS ZA PRIMARY (KISWAHILI)
const PRIMARY_SUBJECTS = [
  { value: "kiswahili", label: "Kiswahili", icon: "📚" },
  { value: "english", label: "English", icon: "📖" },
  { value: "hisabati", label: "Hisabati", icon: "🔢" },
  { value: "sayansi", label: "Sayansi", icon: "🔬" },
  { value: "jamii", label: "Mazingira na Jamii", icon: "🌍" },
  { value: "uraia", label: "Uraia na Maadili", icon: "🤝" },
  { value: "sanaa", label: "Sanaa na Michezo", icon: "🎨" },
];

// 🔥 MADARASA YA PRIMARY
const PRIMARY_CLASSES = [
  { value: "1", label: "Darasa la 1" },
  { value: "2", label: "Darasa la 2" },
  { value: "3", label: "Darasa la 3" },
  { value: "4", label: "Darasa la 4" },
  { value: "5", label: "Darasa la 5" },
  { value: "6", label: "Darasa la 6" },
  { value: "7", label: "Darasa la 7" },
];

// 🔥 AINA ZA MITIHANI (KISWAHILI)
const EXAM_TYPES = [
  { value: "MIDTERM3", label: "Robo Muhula", icon: "📝" },
  { value: "MIDTERM9", label: "Robo Muhula ya Pili", icon: "📝" },
  { value: "TERMINAL", label: "Muhula wa Kwanza", icon: "📊" },
  { value: "ANNUAL", label: "Muhula wa Pili", icon: "🏆" },
];

export default function PrimaryAIExamPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [examContent, setExamContent] = useState("");
  const [markingScheme, setMarkingScheme] = useState("");
  const [showMarking, setShowMarking] = useState(false);
  const [userName, setUserName] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    class_level: "",
    num_questions: 10,
    exam_type: "MIDTERM3",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const name = localStorage.getItem("user_name") || "Mwalimu";
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setUserName(name);
  }, [router]);

  // 🔥🔥🔥 API MOJA TU - GENERATE EXAM + MARKING SCHEME PAMOJA! 🔥🔥🔥
  const handleGenerateExam = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");
    setExamContent("");
    setMarkingScheme("");
    setShowMarking(false);

    try {
      // ✅ TUMIA API MOJA YA PRIMARY
      const response = await fetch("/api/v1/primary/ai-exam/generate-exam", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: formData.subject,
          topic: formData.topic,
          class_level: formData.class_level,
          num_questions: formData.num_questions,
          exam_type: formData.exam_type,
          school_level: "primary",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Imeshindwa kuunda mtihani");
      }

      if (data.success) {
        setExamContent(data.exam_content || "");
        // 🔥 MARKING SCHEME INATOKA KUTOKA API MOJA!
        setMarkingScheme(data.marking_scheme || "");
        setShowMarking(!!data.marking_scheme);
        setSuccess("✅ Mtihani na Mwongozo wa Alama vimeundwa kikamilifu!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Imeshindwa kuunda mtihani");
      }
    } catch (err: any) {
      console.error("AI exam error:", err);
      setError(err.message || "Tatizo la mtandao. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNumberChange = (value: string) => {
    const intValue = parseInt(value);
    if (value === "") {
      setFormData({ ...formData, num_questions: 10 });
    } else if (!isNaN(intValue)) {
      const clamped = Math.min(50, Math.max(1, intValue));
      setFormData({ ...formData, num_questions: clamped });
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push("/primary/dashboard")}
                      className="text-white hover:bg-white/20 rounded-xl"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="h-8 w-px bg-white/30" />
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div className="h-8 w-px bg-white/30" />
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Jenereta ya Mtihani wa AI</h1>
                  <p className="text-sky-100 max-w-2xl">
                    Unda mtihani na mwongozo wa alama kwa kutumia Akili Bandia (AI) kwa wanafunzi wa shule ya msingi.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Shule ya Msingi
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      <Rocket className="h-3 w-3 mr-1" />
                      AI Powered
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/50 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mtihani + Mwongozo
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-white/20 rounded-full text-sm">
                    👩‍🏫 {userName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
              <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
              <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <FileText className="h-5 w-5 text-sky-600" />
                  Mipangilio ya Mtihani
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleGenerateExam} className="space-y-5">
                  {/* Subject */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-sky-600" />
                      Somo *
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subject: value })
                      }
                      required
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl">
                        <SelectValue placeholder="Chagua somo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {PRIMARY_SUBJECTS.map((sub) => (
                          <SelectItem key={sub.value} value={sub.value}>
                            <span className="flex items-center gap-2">
                              <span>{sub.icon}</span>
                              {sub.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topic */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Stars className="h-4 w-4 text-indigo-600" />
                      Mada *
                    </Label>
                    <Input
                      placeholder="Mfano: Nyakati, Kuzidisha, Mimea"
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl"
                      required
                    />
                  </div>

                  {/* Class Level */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      Darasa *
                    </Label>
                    <Select
                      value={formData.class_level}
                      onValueChange={(value) =>
                        setFormData({ ...formData, class_level: value })
                      }
                      required
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl">
                        <SelectValue placeholder="Chagua darasa" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {PRIMARY_CLASSES.map((cls) => (
                          <SelectItem key={cls.value} value={cls.value}>
                            {cls.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Questions & Exam Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-600" />
                        Idadi ya Maswali
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        placeholder="10"
                        value={formData.num_questions}
                        onChange={(e) => handleNumberChange(e.target.value)}
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 rounded-xl"
                      />
                      <p className="text-xs text-gray-400">Maswali 1 hadi 50</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-rose-600" />
                        Aina ya Mtihani
                      </Label>
                      <Select
                        value={formData.exam_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, exam_type: value })
                        }
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-rose-500 rounded-xl">
                          <SelectValue placeholder="Chagua aina" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {EXAM_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <span className="flex items-center gap-2">
                                <span>{type.icon}</span>
                                {type.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Messages */}
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{success}</span>
                    </div>
                  )}

                  {/* Generate Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all rounded-xl py-6 text-lg font-bold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Inaunda mtihani na mwongozo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Tengeneza Mtihani + Mwongozo wa Alama
                      </>
                    )}
                  </Button>

                  {/* Note */}
                  <p className="text-xs text-gray-400 text-center">
                    💡 Mtihani na mwongozo wa alama zinatengenezwa pamoja kwa kutumia API moja
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {!examContent && !loading && (
                <Card className="shadow-xl border-0 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50">
                  <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-12 w-12 text-sky-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Tayari Kuunda Mtihani
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      Jaza maelezo upande wa kushoto na bonyeza 
                      <span className="font-semibold text-sky-600"> "Tengeneza Mtihani + Mwongozo"</span>
                      <br />
                      Mtihani na mwongozo wa alama vitajitokeza hapa.
                    </p>
                    <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
                      <span>✅ Maswali 7</span>
                      <span>✅ Alama 0-50</span>
                      <span>✅ Daraja A-E</span>
                      <span>✅ Mwongozo wa Alama</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {examContent && (
                <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 flex flex-row items-center justify-between flex-wrap gap-2">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      Mtihani Umeundwa
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          examContent,
                          `Mtihani_${formData.subject}_Darasa${formData.class_level}_${Date.now()}.txt`
                        )
                      }
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Pakua
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <div className="bg-gray-50 rounded-xl p-4 max-h-[400px] overflow-auto border border-gray-100">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                        {examContent}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showMarking && markingScheme && (
                <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
                  <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 flex flex-row items-center justify-between flex-wrap gap-2">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <FileText className="h-5 w-5 text-amber-600" />
                      Mwongozo wa Alama
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          markingScheme,
                          `Mwongozo_${formData.subject}_Darasa${formData.class_level}_${Date.now()}.txt`
                        )
                      }
                      className="border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Pakua
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-gray-50 rounded-xl p-4 max-h-[300px] overflow-auto border border-gray-100">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                        {markingScheme}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="shadow-xl border-0 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Sparkles className="h-5 w-5 text-sky-600" />
                Vidokezo vya Matumizi Bora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600">✨</span>
                    <span>Weka mada mahususi kwa maswali yaliyolenga</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600">📚</span>
                    <span>Chagua darasa sahihi kwa wanafunzi wako</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600">🔢</span>
                    <span>Rekebisha idadi ya maswali kulingana na muda</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600">💾</span>
                    <span>Pakua mitihani kama faili za maandishi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600">🔄</span>
                    <span>Unaweza kutengeneza tena na vigezo tofauti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600">📝</span>
                    <span>Mtihani na mwongozo wa alama hutoka pamoja kwa API moja</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}