// app/payment/history/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ FIXED!
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft, CreditCard, Calendar, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 🔥 🔥 🔥 HISTORY CONTENT COMPONENT
// ============================================================

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ SASA INAFANYA KAZI!
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Tumia searchParams kama unavyohitaji
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/payments/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setHistory(response.data);
        setFilteredHistory(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  // 🔥 Filter history
  useEffect(() => {
    let filtered = history;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.transaction_id?.toLowerCase().includes(term) ||
          p.school_name?.toLowerCase().includes(term) ||
          p.plan?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredHistory(filtered);
  }, [searchTerm, statusFilter, history]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle className="h-3 w-3 mr-1" /> Success</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "monthly":
        return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Monthly</Badge>;
      case "quarterly":
        return <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">Quarterly</Badge>;
      case "semester":
        return <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Semester</Badge>;
      case "annual":
        return <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Annual</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-20 w-20 animate-spin text-purple-400 mx-auto" />
          <p className="text-white/80 mt-6 text-lg font-medium">Loading History...</p>
          <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Payment History
              </h1>
              <p className="text-sm text-gray-500 mt-1">View all your subscription transactions</p>
            </div>
          </div>
          <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 shadow-lg px-4 py-2">
            <CreditCard className="h-4 w-4 mr-2 text-emerald-500" />
            {history.length} Transactions
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by transaction ID, school, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">✅ Success</SelectItem>
              <SelectItem value="pending">⏳ Pending</SelectItem>
              <SelectItem value="failed">❌ Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-b border-sky-100">
            <CardTitle className="text-sky-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-sky-600" />
              All Transactions
              <Badge className="ml-2 bg-sky-100 text-sky-700 border-sky-200">
                {filteredHistory.length} records
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="text-sky-700 font-semibold">Transaction ID</TableHead>
                    <TableHead className="text-sky-700 font-semibold">School</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Plan</TableHead>
                    <TableHead className="text-sky-700 font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Method</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Status</TableHead>
                    <TableHead className="text-sky-700 font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="bg-gray-100 p-4 rounded-full">
                            <CreditCard className="h-12 w-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No payment history found</p>
                          <p className="text-sm text-gray-400">Your transactions will appear here</p>
                          <Button
                            onClick={() => router.push("/payment")}
                            className="mt-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
                          >
                            Make a Payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((payment) => (
                      <TableRow
                        key={payment.id}
                        className="hover:bg-sky-50/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/payment/history/${payment.id}`)}
                      >
                        <TableCell className="font-mono text-sm text-sky-700">
                          {payment.transaction_id || payment.id}
                        </TableCell>
                        <TableCell className="font-medium">{payment.school_name || "N/A"}</TableCell>
                        <TableCell>{getPlanBadge(payment.plan)}</TableCell>
                        <TableCell className="text-right font-semibold text-gray-800">
                          TSh {payment.amount?.toLocaleString()}
                        </TableCell>
                        <TableCell className="capitalize">{payment.payment_method || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} School Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔥 🔥 🔥 MAIN PAGE - WITH SUSPENSE BOUNDARY
// ============================================================

export default function PaymentHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center">
            <Loader2 className="h-20 w-20 animate-spin text-purple-400 mx-auto" />
            <p className="text-white/80 mt-6 text-lg font-medium">Loading History...</p>
            <div className="mt-4 h-1 w-48 mx-auto bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}