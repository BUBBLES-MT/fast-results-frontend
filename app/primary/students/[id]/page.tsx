'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  User, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap,
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Mail,
  Shield,
  School,
  Award,
  Heart,
  Home,
  RefreshCw
} from 'lucide-react';

// 🔥 FUNCTION YA KUPATA JINSIA KWA KISWAHILI (ME/KE)
const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE";
};

// 🔥 FUNCTION YA KUPATA RANGI KWA JINSIA
const pataRangiYaJinsia = (sex: string): string => {
  return sex === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700";
};

interface Student {
  id: number;
  name: string;
  sex: string;
  roll_number: string;
  school_id: number;
  class_id: number | null;
  stream_id: number | null;
  father_name: string;
  father_phone: string;
  mother_name?: string;
  mother_phone?: string;
  address?: string;
  health_info?: string;
  enrollment_date?: string;
  class_name?: string;
  stream_name?: string;
  school_name?: string;
}

export default function MaelezoYaMwanafunzi() {
  const { id } = useParams();
  const router = useRouter();
  const [mwanafunzi, setMwanafunzi] = useState<Student | null>(null);
  const [inapakia, setInapakia] = useState(true);
  const [kosa, setKosa] = useState('');
  const [token, setToken] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("user_type") || "";
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setUserRole(role);
    chukuaMwanafunzi(storedToken);
  }, [id]);

  // 🔥 BADILISHA: TUMIA API YA PRIMARY
  const chukuaMwanafunzi = async (authToken: string) => {
    try {
      setInapakia(true);
      setKosa('');
      
      // ✅ TUMIA API YA PRIMARY - HII NI SAWA KWA MWALIMU NA ADMIN
      const response = await fetch(`/api/v1/primary/students/${id}`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Imeshindwa kupata taarifa za mwanafunzi');
      }
      
      const data = await response.json();
      setMwanafunzi(data);
      setKosa('');
    } catch (err: any) {
      console.error('Kosa la kupata mwanafunzi:', err);
      setKosa(err.message || 'Kuna tatizo katika kupata taarifa');
    } finally {
      setInapakia(false);
    }
  };

  const handleRetry = () => {
    if (token) {
      chukuaMwanafunzi(token);
    }
  };

  if (inapakia) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia taarifa za mwanafunzi...</p>
        </div>
      </MainLayout>
    );
  }

  if (kosa) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96 p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
            <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium">{kosa}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
              <Button 
                variant="outline" 
                className="rounded-xl border-red-300 text-red-700 hover:bg-red-50"
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Jaribu Tena
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl border-sky-300 text-sky-700 hover:bg-sky-50"
                onClick={() => router.push('/primary/students')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Rudi kwa Wanafunzi
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!mwanafunzi) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center max-w-md">
            <div className="bg-gray-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Mwanafunzi hajapatikana</p>
            <Button 
              variant="outline" 
              className="mt-4 rounded-xl border-sky-300 text-sky-700 hover:bg-sky-50"
              onClick={() => router.push('/primary/students')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Rudi kwa Wanafunzi
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 🔥 FORMAT DATE
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('sw', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-6 animate-fadeIn max-w-5xl mx-auto">
        {/* Sehemu ya Kichwa */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Maelezo ya Mwanafunzi
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span>Taarifa kamili za mwanafunzi</span>
              {userRole?.toLowerCase() === "mwalimu" && (
                <span className="inline-flex items-center gap-1 text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                  <Shield className="h-3 w-3" />
                  Mwalimu
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => router.push('/primary/students')}
              className="rounded-xl border-sky-300 text-sky-700 hover:bg-sky-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Rudi
            </Button>
          </div>
        </div>

        {/* Kadi Kuu ya Mwanafunzi */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Picha/Icon ya Mwanafunzi */}
              <div className="flex-shrink-0">
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-4 ring-sky-100">
                  {mwanafunzi.name?.charAt(0).toUpperCase() || '?'}
                </div>
              </div>
              
              {/* Taarifa za Msingi */}
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {mwanafunzi.name}
                </h2>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${pataRangiYaJinsia(mwanafunzi.sex)}`}>
                    {pataJinsia(mwanafunzi.sex)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    Namba: {mwanafunzi.roll_number || '-'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-700">
                    Darasa: {mwanafunzi.class_name || '-'}
                  </span>
                </div>
                {mwanafunzi.stream_name && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <School className="h-4 w-4" />
                    Mkondo: {mwanafunzi.stream_name}
                  </p>
                )}
                {mwanafunzi.school_name && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <School className="h-4 w-4" />
                    Shule: {mwanafunzi.school_name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid ya Taarifa Zote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Taarifa za Mama na Baba */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Users className="h-5 w-5" />
                Taarifa za Wazazi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mwanafunzi.father_name && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Jina la Baba</p>
                    <p className="text-gray-900 font-semibold">{mwanafunzi.father_name}</p>
                    {mwanafunzi.father_phone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {mwanafunzi.father_phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {mwanafunzi.mother_name && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-pink-100 rounded-full">
                    <User className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Jina la Mama</p>
                    <p className="text-gray-900 font-semibold">{mwanafunzi.mother_name}</p>
                    {mwanafunzi.mother_phone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {mwanafunzi.mother_phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {!mwanafunzi.father_name && !mwanafunzi.mother_name && (
                <div className="text-center py-6 text-gray-400">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  Hakuna taarifa za wazazi
                </div>
              )}
            </CardContent>
          </Card>

          {/* Taarifa Nyingine */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <FileText className="h-5 w-5" />
                Taarifa Nyingine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {mwanafunzi.address && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <MapPin className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Anuani</p>
                    <p className="text-gray-900">{mwanafunzi.address}</p>
                  </div>
                </div>
              )}
              {mwanafunzi.health_info && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Heart className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Taarifa za Afya</p>
                    <p className="text-gray-900">{mwanafunzi.health_info}</p>
                  </div>
                </div>
              )}
              {mwanafunzi.enrollment_date && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tarehe ya Kujiunga</p>
                    <p className="text-gray-900">{formatDate(mwanafunzi.enrollment_date)}</p>
                  </div>
                </div>
              )}
              {!mwanafunzi.address && !mwanafunzi.health_info && !mwanafunzi.enrollment_date && (
                <div className="text-center py-6 text-gray-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  Hakuna taarifa za ziada
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vitendo vya Haraka */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50 to-sky-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-600" />
              Vitendo vya Haraka
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 rounded-xl group transition-all"
                onClick={() => router.push(`/primary/marks/add?student=${mwanafunzi.id}`)}
              >
                <BookOpen className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Ingiza Alama
              </Button>
              <Button 
                variant="outline" 
                className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 rounded-xl group transition-all"
                onClick={() => router.push(`/primary/reports/student/${mwanafunzi.id}`)}
              >
                <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Tazama Ripoti
              </Button>
              <Button 
                variant="outline" 
                className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 rounded-xl group transition-all"
                onClick={() => router.push(`/primary/students/edit/${mwanafunzi.id}`)}
              >
                <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Hariri
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 rounded-xl group transition-all"
                onClick={() => router.push(`/primary/promote?student=${mwanafunzi.id}`)}
              >
                <GraduationCap className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Panda Darasa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          <p>Kitambulisho: {mwanafunzi.id} • Shule: {mwanafunzi.school_id}</p>
          <p className="mt-0.5">Taarifa zimechapishwa kwa usahihi</p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </MainLayout>
  );
}