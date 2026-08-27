'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, Building, MapPin, School, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function HaririShulePage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchSchool(storedToken);
  }, [id]);

  const fetchSchool = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/schools/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setName(response.data.name);
      setLocation(response.data.address || response.data.location || '');
      setError('');
    } catch (err) {
      console.error('Error fetching school:', err);
      setError('Imeshindwa kupata taarifa za shule');
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async () => {
    if (!name.trim()) {
      setError('Tafadhali ingiza jina la shule');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(
        `/api/v1/schools/${id}`,
        { name, address: location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Taarifa za shule zimesasishwa kikamilifu!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating school:', err);
      setError(err.response?.data?.detail || 'Imeshindwa kusasisha taarifa za shule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Inapakia taarifa za shule...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 max-w-3xl mx-auto animate-fadeIn">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/primary/schools')}
                className="text-white hover:bg-white/20 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <School className="h-6 w-6" />
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Hariri Shule</h1>
            <p className="text-sky-100">Sasisha taarifa za shule</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <Sparkles className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slideIn">
            <span>{error}</span>
          </div>
        )}

        {/* Edit Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Building className="h-5 w-5 text-sky-600" />
              Taarifa za Shule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-gray-700 flex items-center gap-2">
                <School className="h-4 w-4 text-sky-600" />
                Jina la Shule *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl"
                placeholder="Weka jina la shule"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-600" />
                Anuani / Mahali
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl"
                placeholder="Weka anuani ya shule"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <Button
                onClick={updateSchool}
                disabled={saving}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-xl"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Inasasisha...' : 'Sasisha Shule'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/primary/schools')}
                className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Rudi kwa Shule
              </Button>
            </div>

            {/* Info Note */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-600" />
                Hakikisha jina la shule ni sahihi na linapatana na hati rasmi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </MainLayout>
  );
}