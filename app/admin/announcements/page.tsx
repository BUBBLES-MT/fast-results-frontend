// app/admin/announcements/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CalendarDays,
  Megaphone,
  Users,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Edit,
  Eye,
  School,
  Building2,
  Info,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 MAIN COMPONENT
// ============================================================

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [announcement, setAnnouncement] = useState<any>(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  // Form fields
  const [closingDate, setClosingDate] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");
    const schoolId = localStorage.getItem("school_id");
    const name = localStorage.getItem("user_name") || "";
    const schoolName = localStorage.getItem("school_name") || "Shule";
    const schoolLevel = localStorage.getItem("school_level") || "primary";

    if (!token) {
      router.push("/login");
      return;
    }

    // Check if user is authorized
    const allowedRoles = [
      "Headmaster", "Headmistress", 
      "Second Master", "Second Mistress", 
      "Academic", "Accountant",
      "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", 
      "Mtaaluma", "Mhasibu"
    ];
    
    const userRoleLower = (userType || "").toLowerCase();
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRoleLower);

    if (!isAllowed) {
      router.push("/dashboard");
      return;
    }

    setUserName(name);
    setUserRole(userType || "");
    setSchoolName(schoolName);
    setSchoolLevel(schoolLevel);

    fetchAnnouncement(token, schoolId || "");
  }, [router]);

  // Fetch announcement
  const fetchAnnouncement = async (token: string, schoolId: string) => {
    try {
      setLoadingData(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/school-announcements/${schoolId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnnouncement(data);
        if (data) {
          setClosingDate(data.closing_date ? data.closing_date.split('T')[0] : "");
          setOpeningDate(data.opening_date ? data.opening_date.split('T')[0] : "");
          // 🔥 CHUKUA TANGAZO KUTOKA SWAHILI (au English kama hakuna)
          setAnnouncementText(data.announcement_sw || data.announcement_en || "");
          setMeetingNotes(data.parent_meeting_notes_sw || data.parent_meeting_notes_en || "");
        }
      } else {
        console.log("ℹ️ Hakuna tangazo lililopatikana");
        setAnnouncement(null);
      }
    } catch (err) {
      console.error("Error fetching announcement:", err);
      setError("Imeshindwa kupakia data ya tangazo");
    } finally {
      setLoadingData(false);
    }
  };

  // Save announcement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const schoolId = localStorage.getItem("school_id");

    if (!token || !schoolId) {
      setError("Inahitajika uthibitisho");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/school-announcements/${schoolId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            school_id: parseInt(schoolId),
            closing_date: closingDate || null,
            opening_date: openingDate || null,
            // 🔥 TUMA TANGAZO KWA KISWAHILI (na English kama backup)
            announcement_sw: announcementText || null,
            announcement_en: announcementText || null,
            parent_meeting_notes_sw: meetingNotes || null,
            parent_meeting_notes_en: meetingNotes || null,
            language: "swahili",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAnnouncement(result);
        setSuccess("✅ Tangazo limehifadhiwa kikamilifu!");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Imeshindwa kuhifadhi tangazo");
      }
    } catch (err: any) {
      setError(err.message || "Imeshindwa kuunganisha na server");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return "Haijawekwa";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sw-TZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get role display name
  const getRoleDisplay = () => {
    const roleMap: Record<string, string> = {
      "Headmaster": "Mkuu wa Shule",
      "Headmistress": "Mkuu wa Shule",
      "Second Master": "Makamu Mkuu",
      "Second Mistress": "Makamu Mkuu",
      "Academic": "Mtaaluma",
      "Accountant": "Mhasibu",
      "Mwalimu Mkuu": "Mkuu wa Shule",
      "Mwalimu Mkuu Msaidizi": "Makamu Mkuu",
      "Mtaaluma": "Mtaaluma",
      "Mhasibu": "Mhasibu",
    };
    return roleMap[userRole] || userRole;
  };

  // Get school level label
  const getSchoolLevelLabel = () => {
    return schoolLevel === "primary" ? "🏫 Shule ya Msingi" : "📚 Shule ya Sekondari";
  };

  if (loadingData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-600 mt-4">Inapakia data ya tangazo...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl mb-6">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Megaphone className="h-10 w-10" />
                <div className="h-8 w-px bg-white/30" />
                <School className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold">Tangazo la Shule</h1>
              <p className="text-blue-100">
                Weka tarehe za kufunga na kufungua shule, matangazo, na maelezo ya mkutano wa wazazi.
                Wazazi wataona taarifa hizi kwenye dashboard yao.
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Building2 className="h-3 w-3 mr-1" />
                  {schoolName}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  {getSchoolLevelLabel()}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Users className="h-3 w-3 mr-1" />
                  {getRoleDisplay()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Success/Error */}
          {success && (
            <Card className="mb-6 border-emerald-200 bg-emerald-50 shadow-md">
              <CardContent className="pt-4">
                <p className="text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {success}
                </p>
              </CardContent>
            </Card>
          )}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50 shadow-md">
              <CardContent className="pt-4">
                <p className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Main Form */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Hariri Tangazo
              </CardTitle>
              <CardDescription>
                Weka tarehe za kufunga/kufungua shule, matangazo, na maelezo ya mkutano wa wazazi.
                Wazazi wataona taarifa hizi kwenye dashboard yao mara moja.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tarehe za Kufunga na Kufungua */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    Tarehe za Kalenda ya Shule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-sm text-gray-600">Tarehe ya Kufunga</Label>
                      <Input
                        type="date"
                        value={closingDate}
                        onChange={(e) => setClosingDate(e.target.value)}
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Sasa: {formatDateDisplay(announcement?.closing_date)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Tarehe ya Kufungua</Label>
                      <Input
                        type="date"
                        value={openingDate}
                        onChange={(e) => setOpeningDate(e.target.value)}
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Sasa: {formatDateDisplay(announcement?.opening_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tangazo - Kiswahili tu */}
                <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl p-5 border border-amber-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-amber-600" />
                    Tangazo
                  </h3>
                  <div>
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Kiswahili
                    </Label>
                    <Textarea
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="Andika tangazo kwa Kiswahili..."
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-amber-500 min-h-[120px]"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Tangazo hili litaonekana kwa wazazi kwenye dashboard yao
                    </p>
                  </div>
                </div>

                {/* Maelezo ya Mkutano wa Wazazi - Kiswahili tu */}
                <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    Maelezo ya Mkutano wa Wazazi
                  </h3>
                  <div>
                    <Label className="text-sm text-gray-600 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Kiswahili
                    </Label>
                    <Textarea
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      placeholder="Maelezo ya mkutano wa wazazi (Kiswahili)..."
                      className="bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Maelezo haya yataonekana kwa wazazi pamoja na tangazo
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-4 flex-wrap">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    {loading ? "Inahifadhi..." : "Hifadhi Tangazo"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setClosingDate("");
                      setOpeningDate("");
                      setAnnouncementText("");
                      setMeetingNotes("");
                    }}
                    className="border-gray-300"
                  >
                    Rejesha Fomu
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Live Preview */}
          {announcement && (
            <Card className="mt-6 shadow-xl border-0 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-yellow-500" />
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-amber-600" />
                    Mwonekano (Jinsi Wazazi Watakavyoona)
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                    Kiswahili
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border-l-4 border-amber-500">
                  {/* Dates */}
                  {(announcement.closing_date || announcement.opening_date) && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {announcement.closing_date && (
                        <div className="bg-white/70 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Tarehe ya Kufunga</p>
                          <p className="text-sm font-semibold text-red-600">
                            {formatDateDisplay(announcement.closing_date)}
                          </p>
                        </div>
                      )}
                      {announcement.opening_date && (
                        <div className="bg-white/70 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Tarehe ya Kufungua</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {formatDateDisplay(announcement.opening_date)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Announcement */}
                  {(announcement.announcement_sw || announcement.announcement_en) && (
                    <div className="bg-white/70 p-3 rounded-lg mb-3">
                      <p className="text-xs font-semibold text-amber-700 mb-1">Tangazo</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {announcement.announcement_sw || announcement.announcement_en}
                      </p>
                    </div>
                  )}
                  
                  {/* Meeting Notes */}
                  {(announcement.parent_meeting_notes_sw || announcement.parent_meeting_notes_en) && (
                    <div className="bg-white/70 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-emerald-700 mb-1">Maelezo ya Mkutano wa Wazazi</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {announcement.parent_meeting_notes_sw || announcement.parent_meeting_notes_en}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="mt-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Jinsi inavyofanya kazi:</p>
                  <ul className="text-sm text-gray-600 space-y-1 mt-1">
                    <li>✅ <strong>Tarehe</strong> - Weka tarehe za kufunga na kufungua shule</li>
                    <li>✅ <strong>Tangazo</strong> - Andika tangazo kwa Kiswahili</li>
                    <li>✅ <strong>Maelezo ya Mkutano</strong> - Shiriana maelezo ya mkutano na wazazi</li>
                    <li>✅ <strong>Mwonekano</strong> - Angalia jinsi wazazi watakavyoona</li>
                    <li>✅ <strong>Mabadiliko</strong> - Wazazi wanaona mabadiliko mara moja</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}