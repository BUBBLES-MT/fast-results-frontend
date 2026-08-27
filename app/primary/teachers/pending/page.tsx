// app/primary/teachers/pending/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, UserPlus, AlertCircle, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PendingTeacher {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  phone1: string;
  status: string;
  created_at: string;
  school_id: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Dialog state
  const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userRole = localStorage.getItem("user_type");
    const schoolLevel = localStorage.getItem("school_level");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    // 🔥 Check if user has admin rights
    const adminRoles = ["Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi", "Mtaaluma"];
    if (!adminRoles.some(r => userRole?.toLowerCase() === r.toLowerCase())) {
      router.push("/primary/dashboard");
      return;
    }
    
    setToken(storedToken);
    fetchPendingTeachers(storedToken);
  }, [router]);

  const fetchPendingTeachers = async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/teachers/pending`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to fetch pending teachers");
      }
      
      const data = await response.json();
      setPendingTeachers(data.teachers || []);
    } catch (err: any) {
      setError(err.message || "Failed to load pending teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId: number) => {
    setProcessing(teacherId);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/primary/teachers/${teacherId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to approve teacher");
      }
      
      setSuccess("✅ Teacher approved successfully!");
      fetchPendingTeachers(token);
    } catch (err: any) {
      setError(err.message || "Failed to approve teacher");
    } finally {
      setProcessing(null);
      setDialogOpen(false);
    }
  };

  const handleReject = async (teacherId: number) => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    
    setProcessing(teacherId);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/primary/teachers/${teacherId}/reject?reason=${encodeURIComponent(rejectionReason)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to reject teacher");
      }
      
      setSuccess("❌ Teacher rejected!");
      fetchPendingTeachers(token);
    } catch (err: any) {
      setError(err.message || "Failed to reject teacher");
    } finally {
      setProcessing(null);
      setDialogOpen(false);
      setRejectionReason("");
    }
  };

  const openRejectDialog = (teacher: PendingTeacher) => {
    setSelectedTeacher(teacher);
    setRejectionReason("");
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('sw-TZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600 mb-4" />
            <p className="text-gray-500">Inapakia walimu wanaosubiri idhini...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <UserPlus className="h-8 w-8" />
              <div className="h-8 w-px bg-white/30" />
              <CheckCircle className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Idhini ya Walimu Wapya</h1>
            <p className="text-sky-100 mt-1">
              Idhinisha au kataa walimu waliojisajili kwenye shule yako
              <span className="block text-sm mt-1 text-sky-200">
                🏫 Shule ya Msingi | Walimu wanaosubiri: {pendingTeachers.length}
              </span>
            </p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Pending Teachers Table */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardHeader className="bg-white/50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-sky-600" />
              Walimu Wanaosubiri Idhini
              <Badge className="ml-2 bg-amber-100 text-amber-800">
                {pendingTeachers.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingTeachers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                <p className="text-lg font-medium">Hakuna walimu wanaosubiri idhini</p>
                <p className="text-sm">Walimu wote wameidhinishwa</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Jina Kamili</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Jukumu</TableHead>
                      <TableHead>Simu</TableHead>
                      <TableHead>Tarehe ya Kujisajili</TableHead>
                      <TableHead className="text-right">Vitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTeachers.map((teacher, idx) => (
                      <TableRow key={teacher.id} className="hover:bg-sky-50/50 transition-colors">
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell className="font-semibold">{teacher.name}</TableCell>
                        <TableCell>{teacher.username}</TableCell>
                        <TableCell className="text-sm">{teacher.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-sky-50">
                            {teacher.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{teacher.phone1 || "-"}</TableCell>
                        <TableCell className="text-sm">{formatDate(teacher.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(teacher.id)}
                              disabled={processing === teacher.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            >
                              {processing === teacher.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Idhinisha
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(teacher)}
                              disabled={processing === teacher.id}
                              className="gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Kataa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reject Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Kataa Mwalimu
              </DialogTitle>
              <DialogDescription>
                Je, una uhakika unataka kumkataa mwalimu <strong>{selectedTeacher?.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Sababu ya Kukataa <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Weka sababu ya kumkataa mwalimu huyu..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-400">Sababu hii itaonekana kwa mwalimu aliyekataliwa</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Ghairi
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedTeacher?.id || 0)}
                disabled={!rejectionReason.trim() || processing !== null}
                className="gap-2"
              >
                {processing === selectedTeacher?.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Kataa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}