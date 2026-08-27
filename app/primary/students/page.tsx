"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash2, Loader2, FileText, Edit, BookOpen, GraduationCap, Users, Download, Shield } from "lucide-react";

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
  health_info?: string;
  address?: string;
}

interface Class {
  id: number;
  name: string;
  school_id: number;
}

interface Stream {
  id: number;
  name: string;
  class_id: number;
  school_id: number;
}

interface GroupedStudents {
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  stream_id: number;
  stream_name: string;
  students: Student[];
}

const AINA_ZAMAONI = ["MIDTERM3", "MIDTERM9", "TERMINAL", "ANNUAL", "JOINT MOCK"];

// 🔥 FUNCTION YA KUPATA JINSIA KWA KISWAHILI (ME/KE)
const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE";
};

// 🔥 FUNCTION YA KUANGALIA KAMA NI MWALIMU
const niMwalimu = (jukumu: string): boolean => {
  return jukumu?.toLowerCase() === "mwalimu" || jukumu?.toLowerCase() === "teacher";
};

export default function WanafunziPage() {
  const router = useRouter();
  const [wanafunzi, setWanafunzi] = useState<Student[]>([]);
  const [wanafunziWaliopangwa, setWanafunziWaliopangwa] = useState<GroupedStudents[]>([]);
  const [madarasa, setMadarasa] = useState<Class[]>([]);
  const [mikondo, setMikondo] = useState<Stream[]>([]);
  const [mikondoIliyochujwa, setMikondoIliyochujwa] = useState<Stream[]>([]);
  const [inapakia, setInapakia] = useState(true);
  const [kosa, setKosa] = useState("");
  const [token, setToken] = useState("");
  const [jukumuLaMtumiaji, setJukumuLaMtumiaji] = useState("");
  const [tafuta, setTafuta] = useState("");
  const [dialogFungua, setDialogFungua] = useState(false);
  
  const [mtazamo, setMtazamo] = useState<"zote" | "zangu">(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem("user_type");
      if (niMwalimu(role || "")) return "zangu";
    }
    return "zote";
  });
  
  const [dialogPDF, setDialogPDF] = useState(false);
  const [mwanafunziAliyechaguliwa, setMwanafunziAliyechaguliwa] = useState<number | null>(null);
  const [ainaYaMtihani, setAinaYaMtihani] = useState("MIDTERM3");
  
  const [dialogHaririFungua, setDialogHaririFungua] = useState(false);
  const [mwanafunziAnayehaririwa, setMwanafunziAnayehaririwa] = useState<Student | null>(null);
  const [dataYaHariri, setDataYaHariri] = useState({
    name: "",
    sex: "M",
    father_name: "",
    father_phone: "",
    health_info: "",
    address: "",
    school_id: 1,
    class_id: "",
    stream_id: "",
    roll_number: "",
  });
  
  const [dataYaMwanzilishi, setDataYaMwanzilishi] = useState({
    name: "",
    sex: "M",
    father_name: "",
    father_phone: "",
    health_info: "",
    address: "",
    school_id: 1,
    class_id: "",
    stream_id: "",
    roll_number: "",
  });

  // ============================================================
  // 🔥 INITIALIZATION - MWALIMU ANAONA WAKE TU!
  // ============================================================
  useEffect(() => {
    const tokenIliyohifadhiwa = localStorage.getItem("token");
    const jukumu = localStorage.getItem("user_type");
    
    if (!tokenIliyohifadhiwa) {
      router.push("/login");
      return;
    }
    setToken(tokenIliyohifadhiwa);
    setJukumuLaMtumiaji(jukumu || "");
    
    const isTeacher = niMwalimu(jukumu || "");
    
    // 🔥 CHUKUA MADARASA NA MIKONDO
    chukuaMadarasa(tokenIliyohifadhiwa);
    chukuaMikondo(tokenIliyohifadhiwa);
    
    // 🔥 IKIWA MWALIMU, ANAONA WANAFUNZI WAKE TU!
    if (isTeacher) {
      setMtazamo("zangu");
      chukuaWanafunziWaliopangwa(tokenIliyohifadhiwa);
    } else {
      chukuaWanafunziWote(tokenIliyohifadhiwa);
    }
  }, [router]);

  // ============================================================
  // 🔥 EFFECT YA MTAZAMO
  // ============================================================
  useEffect(() => {
    if (token) {
      const isTeacher = niMwalimu(jukumuLaMtumiaji);
      
      if (isTeacher || mtazamo === "zangu") {
        chukuaWanafunziWaliopangwa(token);
      } else if (mtazamo === "zote") {
        chukuaWanafunziWote(token);
      }
    }
  }, [mtazamo, token]);

  // ============================================================
  // 🔥 FETCH WANAFUNZI WOTE - ADMIN TU!
  // ============================================================
  const chukuaWanafunziWote = async (authToken: string) => {
    try {
      setInapakia(true);
      
      // 🔥 IKIWA MWALIMU, TUMIA my-students API!
      const isTeacher = niMwalimu(jukumuLaMtumiaji);
      const apiUrl = isTeacher 
        ? "/api/v1/primary/students/my-students"
        : "/api/v1/primary/students";
      
      console.log("📡 Fetching students from:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Imeshindwa kupata wanafunzi");
      }
      
      const data = await response.json();
      setWanafunzi(data);
      setKosa("");
    } catch (err: any) {
      console.error("Kosa la kupata data:", err);
      setKosa(err.message || "Imeshindwa kupakia wanafunzi");
    } finally {
      setInapakia(false);
    }
  };

  // ============================================================
  // 🔥 FETCH WANAFUNZI WALIOPANGWA - MWALIMU TU!
  // ============================================================
  const chukuaWanafunziWaliopangwa = async (authToken: string) => {
    try {
      setInapakia(true);
      
      const response = await fetch("/api/v1/primary/students/my-students", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Imeshindwa kupata wanafunzi");
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        setWanafunziWaliopangwa([]);
        setInapakia(false);
        return;
      }
      
      const groupedMap = new Map();
      
      for (const student of data) {
        const key = `${student.subject_id}-${student.class_id}-${student.stream_id}`;
        
        if (!groupedMap.has(key)) {
          let jinaDarasa = student.class_name || "Darasa Lisilojulikana";
          const jinaMkondo = student.stream_name || "";
          
          if (jinaMkondo && !jinaDarasa.includes(jinaMkondo)) {
            jinaDarasa = `${jinaDarasa} ${jinaMkondo}`;
          }
          
          jinaDarasa = jinaDarasa.replace(/(\w+)\s+\1$/, '$1');
          
          groupedMap.set(key, {
            subject_id: student.subject_id,
            subject_name: student.subject_name || "Somo Lisilojulikana",
            class_id: student.class_id,
            class_name: jinaDarasa,
            stream_id: student.stream_id,
            stream_name: jinaMkondo,
            students: []
          });
        }
        groupedMap.get(key).students.push(student);
      }
      
      setWanafunziWaliopangwa(Array.from(groupedMap.values()));
      setKosa("");
    } catch (err: any) {
      console.error("Kosa la kupata wanafunzi waliopangwa:", err);
      setKosa(err.message || "Imeshindwa kupakia wanafunzi");
    } finally {
      setInapakia(false);
    }
  };

  // ============================================================
  // 🔥 FETCH MADARASA - PRIMARY API
  // ============================================================
  const chukuaMadarasa = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/primary/classes", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Imeshindwa kupata madarasa");
      const data = await response.json();
      setMadarasa(data);
    } catch (err) {
      console.error("Kosa la kupata madarasa:", err);
      setKosa("Imeshindwa kupata madarasa");
    }
  };

  // ============================================================
  // 🔥 FETCH MIKONDO - PRIMARY API
  // ============================================================
  const chukuaMikondo = async (authToken: string) => {
    try {
      const response = await fetch("/api/v1/primary/streams", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Imeshindwa kupata mikondo");
      const data = await response.json();
      setMikondo(data);
    } catch (err) {
      console.error("Kosa la kupata mikondo:", err);
      setKosa("Imeshindwa kupata mikondo");
    }
  };

  useEffect(() => {
    if (dataYaMwanzilishi.class_id) {
      const filtered = mikondo.filter(
        (stream) => stream.class_id === parseInt(dataYaMwanzilishi.class_id)
      );
      setMikondoIliyochujwa(filtered);
      setDataYaMwanzilishi((prev) => ({ ...prev, stream_id: "" }));
    } else {
      setMikondoIliyochujwa([]);
    }
  }, [dataYaMwanzilishi.class_id, mikondo]);

  useEffect(() => {
    if (dataYaHariri.class_id) {
      const filtered = mikondo.filter(
        (stream) => stream.class_id === parseInt(dataYaHariri.class_id)
      );
      setMikondoIliyochujwa(filtered);
      setDataYaHariri((prev) => ({ ...prev, stream_id: "" }));
    } else {
      setMikondoIliyochujwa([]);
    }
  }, [dataYaHariri.class_id, mikondo]);

  // ============================================================
  // 🔥 ONGEZA MWANAFUNZI - PRIMARY API
  // ============================================================
  const ongezaMwanafunzi = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataYaMwanzilishi.class_id) {
      setKosa("Tafadhali chagua darasa");
      return;
    }
    if (!dataYaMwanzilishi.stream_id) {
      setKosa("Tafadhali chagua mkondo");
      return;
    }
    
    setKosa("");
    
    try {
      const payload = {
        name: dataYaMwanzilishi.name,
        sex: dataYaMwanzilishi.sex,
        father_name: dataYaMwanzilishi.father_name,
        father_phone: dataYaMwanzilishi.father_phone,
        health_info: dataYaMwanzilishi.health_info || null,
        address: dataYaMwanzilishi.address || null,
        school_id: dataYaMwanzilishi.school_id,
        class_id: parseInt(dataYaMwanzilishi.class_id),
        stream_id: parseInt(dataYaMwanzilishi.stream_id),
        roll_number: dataYaMwanzilishi.roll_number || null,
      };
      
      const response = await fetch("/api/v1/primary/students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setKosa(errorData.detail || "Imeshindwa kuongeza mwanafunzi");
        return;
      }
      
      setDialogFungua(false);
      setDataYaMwanzilishi({
        name: "",
        sex: "M",
        father_name: "",
        father_phone: "",
        health_info: "",
        address: "",
        school_id: 1,
        class_id: "",
        stream_id: "",
        roll_number: "",
      });
      
      // 🔥 REFRESH KWA MTAZAMO WA SASA
      if (niMwalimu(jukumuLaMtumiaji) || mtazamo === "zangu") {
        chukuaWanafunziWaliopangwa(token);
      } else {
        chukuaWanafunziWote(token);
      }
      setKosa("");
    } catch (err) {
      console.error("Kosa la kuongeza mwanafunzi:", err);
      setKosa("Tatizo la mtandao. Tafadhali jaribu tena.");
    }
  };

  // ============================================================
  // 🔥 Futa MWANAFUNZI - PRIMARY API
  // ============================================================
  const futaMwanafunzi = async (id: number) => {
    if (!confirm("Je, una uhakika unataka kumfuta mwanafunzi huyu?")) return;
    try {
      await fetch(`/api/v1/primary/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // 🔥 REFRESH KWA MTAZAMO WA SASA
      if (niMwalimu(jukumuLaMtumiaji) || mtazamo === "zangu") {
        chukuaWanafunziWaliopangwa(token);
      } else {
        chukuaWanafunziWote(token);
      }
    } catch (err) {
      setKosa("Imeshindwa kumfuta mwanafunzi");
    }
  };

  const tazamaRipoti = (studentId: number) => {
    router.push(`/primary/reports/student/${studentId}`);
  };

  const tengenezaPDF = (studentId: number) => {
    setMwanafunziAliyechaguliwa(studentId);
    setDialogPDF(true);
  };

  const thibitishaTengenezaPDF = () => {
    if (mwanafunziAliyechaguliwa) {
      const url = `/api/v1/reports/student/${mwanafunziAliyechaguliwa}/parent-report?exam_type=${ainaYaMtihani}`;
      window.open(url, "_blank");
    }
    setDialogPDF(false);
  };

  const funguaDialogHariri = (student: Student) => {
    setMwanafunziAnayehaririwa(student);
    setDataYaHariri({
      name: student.name ?? "",
      sex: student.sex ?? "M",
      father_name: student.father_name ?? "",
      father_phone: student.father_phone ?? "",
      health_info: student.health_info ?? "",
      address: student.address ?? "",
      school_id: student.school_id ?? 1,
      class_id: student.class_id?.toString() ?? "",
      stream_id: student.stream_id?.toString() ?? "",
      roll_number: student.roll_number ?? "",
    });
    setDialogHaririFungua(true);
  };

  // ============================================================
  // 🔥 SASISHA MWANAFUNZI - PRIMARY API
  // ============================================================
  const sasishaMwanafunzi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mwanafunziAnayehaririwa) return;
    
    try {
      const payload = {
        name: dataYaHariri.name,
        sex: dataYaHariri.sex,
        father_name: dataYaHariri.father_name,
        father_phone: dataYaHariri.father_phone,
        health_info: dataYaHariri.health_info || null,
        address: dataYaHariri.address || null,
        school_id: dataYaHariri.school_id,
        class_id: parseInt(dataYaHariri.class_id),
        stream_id: parseInt(dataYaHariri.stream_id),
        roll_number: dataYaHariri.roll_number || null,
      };
      
      const response = await fetch(`/api/v1/primary/students/${mwanafunziAnayehaririwa.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Imeshindwa kumsasisha mwanafunzi");
      
      setDialogHaririFungua(false);
      setMwanafunziAnayehaririwa(null);
      
      // 🔥 REFRESH KWA MTAZAMO WA SASA
      if (niMwalimu(jukumuLaMtumiaji) || mtazamo === "zangu") {
        chukuaWanafunziWaliopangwa(token);
      } else {
        chukuaWanafunziWote(token);
      }
      setKosa("");
    } catch (err) {
      setKosa("Imeshindwa kumsasisha mwanafunzi");
    }
  };

  const wanafunziWaliopepetwa = wanafunzi.filter((student) =>
    student.name.toLowerCase().includes(tafuta.toLowerCase()) ||
    (student.roll_number && student.roll_number.includes(tafuta))
  );

  const jinaLaDarasa = (classId: number | null) => {
    if (!classId) return "-";
    const cls = madarasa.find((c) => c.id === classId);
    return cls ? cls.name : "-";
  };

  const jinaLaMkondo = (streamId: number | null) => {
    if (!streamId) return "-";
    const stream = mikondo.find((s) => s.id === streamId);
    return stream ? stream.name : "-";
  };

  const anawezaKuzote = () => {
    const majukumuYaUongozi = ["Mtaaluma", "Mwalimu Mkuu", "Mwalimu Mkuu Msaidizi"];
    return majukumuYaUongozi.includes(jukumuLaMtumiaji);
  };

  const anawezaZakeTu = () => {
    return niMwalimu(jukumuLaMtumiaji);
  };

  if (inapakia) {
    return (
      <MainLayout>
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-sky-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Inapakia wanafunzi...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200/50 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                {anawezaZakeTu() ? "Wanafunzi Wangu" : "Usimamizi wa Wanafunzi"}
              </h1>
              <p className="text-gray-500 mt-1">
                {anawezaZakeTu()
                  ? "Orodha ya wanafunzi unaowafundisha"
                  : "Simamia wanafunzi wote wa shule"}
              </p>
              {anawezaZakeTu() && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-sky-100 rounded-full text-sm text-sky-700">
                  <Shield className="h-4 w-4" />
                  Unaona wanafunzi wako tu
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {anawezaKuzote() && (
                <div className="flex gap-2">
                  <Button
                    variant={mtazamo === "zote" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMtazamo("zote")}
                    className="rounded-full transition-all duration-200 hover:scale-105"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Wanafunzi Wote
                  </Button>
                  <Button
                    variant={mtazamo === "zangu" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMtazamo("zangu")}
                    className="rounded-full transition-all duration-200 hover:scale-105"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Wanafunzi Wangu
                  </Button>
                </div>
              )}
              
              {anawezaZakeTu() && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setMtazamo("zangu")}
                    className="rounded-full transition-all duration-200 hover:scale-105"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Wanafunzi Wangu
                  </Button>
                </div>
              )}
              
              {!anawezaZakeTu() && (
                <Dialog open={dialogFungua} onOpenChange={setDialogFungua}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-md">
                      <Plus className="h-4 w-4" />
                      Ongeza Mwanafunzi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-2xl animate-in fade-in zoom-in duration-300">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Ongeza Mwanafunzi Mpya</DialogTitle>
                      <DialogDescription>
                        Jaza taarifa zote ili kuongeza mwanafunzi mpya. Darasa na Mkondo vinahitajika.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={ongezaMwanafunzi}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right font-semibold">Jina Kamili *</Label>
                          <Input
                            id="name"
                            className="col-span-3 rounded-xl focus:ring-2 focus:ring-sky-400 transition-all"
                            placeholder="Weka jina kamili la mwanafunzi"
                            value={dataYaMwanzilishi.name}
                            onChange={(e) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, name: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sex" className="text-right font-semibold">Jinsia *</Label>
                          <Select
                            value={dataYaMwanzilishi.sex}
                            onValueChange={(value) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, sex: value })}
                          >
                            <SelectTrigger className="col-span-3 rounded-xl">
                              <SelectValue placeholder="Chagua jinsia" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">ME</SelectItem>
                              <SelectItem value="F">KE</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="class_id" className="text-right font-semibold">Darasa *</Label>
                          <Select
                            value={dataYaMwanzilishi.class_id}
                            onValueChange={(value) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, class_id: value })}
                          >
                            <SelectTrigger className="col-span-3 rounded-xl">
                              <SelectValue placeholder="Chagua darasa" />
                            </SelectTrigger>
                            <SelectContent>
                              {madarasa.length === 0 ? (
                                <SelectItem value="none" disabled>Hakuna madarasa</SelectItem>
                              ) : (
                                madarasa.map((cls) => (
                                  <SelectItem key={cls.id} value={cls.id.toString()}>
                                    {cls.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {dataYaMwanzilishi.class_id && (
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stream_id" className="text-right font-semibold">Mkondo *</Label>
                            <Select
                              value={dataYaMwanzilishi.stream_id}
                              onValueChange={(value) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, stream_id: value })}
                            >
                              <SelectTrigger className="col-span-3 rounded-xl">
                                <SelectValue placeholder="Chagua mkondo" />
                              </SelectTrigger>
                              <SelectContent>
                                {mikondoIliyochujwa.length === 0 ? (
                                  <SelectItem value="none" disabled>Hakuna mikondo</SelectItem>
                                ) : (
                                  mikondoIliyochujwa.map((stream) => (
                                    <SelectItem key={stream.id} value={stream.id.toString()}>
                                      Mkondo {stream.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="father_name" className="text-right font-semibold">Jina la Baba *</Label>
                          <Input
                            id="father_name"
                            className="col-span-3 rounded-xl"
                            placeholder="Weka jina kamili la baba"
                            value={dataYaMwanzilishi.father_name}
                            onChange={(e) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, father_name: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="father_phone" className="text-right font-semibold">Simu ya Baba *</Label>
                          <Input
                            id="father_phone"
                            className="col-span-3 rounded-xl"
                            placeholder="Mfano: 0712345678"
                            value={dataYaMwanzilishi.father_phone}
                            onChange={(e) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, father_phone: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="health_info" className="text-right font-semibold">Taarifa za Afya</Label>
                          <Input
                            id="health_info"
                            className="col-span-3 rounded-xl"
                            placeholder="Mfano: Mzio, Hali ya kiafya"
                            value={dataYaMwanzilishi.health_info ?? ""}
                            onChange={(e) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, health_info: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right font-semibold">Anuani</Label>
                          <Input
                            id="address"
                            className="col-span-3 rounded-xl"
                            placeholder="Anuani ya nyumbani"
                            value={dataYaMwanzilishi.address ?? ""}
                            onChange={(e) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, address: e.target.value })}
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="roll_number" className="text-right font-semibold">Namba ya Uandikishaji</Label>
                          <Input
                            id="roll_number"
                            className="col-span-3 rounded-xl"
                            placeholder="Si lazima"
                            value={dataYaMwanzilishi.roll_number}
                            onChange={(e) => setDataYaMwanzilishi({ ...dataYaMwanzilishi, roll_number: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      {kosa && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                          {kosa}
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button type="submit" className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600">
                          Hifadhi Mwanafunzi
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Tafuta kwa jina au namba ya uandikishaji..."
                className="pl-12 py-6 text-lg rounded-xl focus:ring-2 focus:ring-sky-400 transition-all"
                value={tafuta}
                onChange={(e) => setTafuta(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* WANAFUNZI WOTE - ADMIN TU */}
        {mtazamo === "zote" && !anawezaZakeTu() && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-2xl font-bold text-gray-800">Wanafunzi Wote</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-100 to-gray-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-bold">#</TableHead>
                      <TableHead className="font-bold">Jina</TableHead>
                      <TableHead className="font-bold">Jinsia</TableHead>
                      <TableHead className="font-bold">Darasa</TableHead>
                      <TableHead className="font-bold">Mkondo</TableHead>
                      <TableHead className="font-bold">Namba</TableHead>
                      <TableHead className="font-bold">Baba</TableHead>
                      <TableHead className="font-bold">Simu</TableHead>
                      <TableHead className="text-right font-bold">Vitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wanafunziWaliopepetwa.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-16 text-gray-500">
                          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          Hakuna wanafunzi. Bonyeza "Ongeza Mwanafunzi" kuanza.
                        </TableCell>
                      </TableRow>
                    ) : (
                      wanafunziWaliopepetwa.map((student, index) => (
                        <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-mono">{index + 1}</TableCell>
                          <TableCell className="font-semibold">{student.name}</TableCell>
                          <TableCell>{pataJinsia(student.sex)}</TableCell>
                          <TableCell>{jinaLaDarasa(student.class_id)}</TableCell>
                          <TableCell>{jinaLaMkondo(student.stream_id)}</TableCell>
                          <TableCell>{student.roll_number || "-"}</TableCell>
                          <TableCell>{student.father_name || "-"}</TableCell>
                          <TableCell>{student.father_phone || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => funguaDialogHariri(student)}
                                className="rounded-full text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-all duration-200 hover:scale-110"
                                title="Hariri Mwanafunzi"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => tazamaRipoti(student.id)}
                                className="rounded-full text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-110"
                                title="Tazama Ripoti"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => tengenezaPDF(student.id)}
                                className="rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:scale-110"
                                title="Pakua Ripoti ya Mzazi (PDF)"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => futaMwanafunzi(student.id)}
                                className="rounded-full transition-all duration-200 hover:scale-110"
                                title="Futa Mwanafunzi"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* WANAFUNZI WANGU - MWALIMU NA ADMIN (zangu) */}
        {(mtazamo === "zangu" || anawezaZakeTu()) && (
          <div className="space-y-8">
            {wanafunziWaliopangwa.length === 0 ? (
              <Card className="border-0 shadow-xl rounded-2xl">
                <CardContent className="py-20 text-center">
                  <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    {anawezaZakeTu()
                      ? "Hujapewa masomo bado. Wasiliana na Mtaaluma."
                      : "Hakuna wanafunzi katika madarasa uliyopangiwa."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              wanafunziWaliopangwa.map((group, index) => {
                const wanafunziWaliopepetwaKikundi = group.students.filter((student) =>
                  student.name.toLowerCase().includes(tafuta.toLowerCase()) ||
                  (student.roll_number && student.roll_number.includes(tafuta))
                );

                if (wanafunziWaliopepetwaKikundi.length === 0 && tafuta) return null;

                return (
                  <Card 
                    key={`${group.class_id}-${group.stream_id}-${group.subject_id}`}
                    className="border-0 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                  >
                    <CardHeader className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-t-2xl text-white">
                      <CardTitle>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-6 w-6" />
                            <span className="text-xl font-bold">
                              {group.class_name}
                            </span>
                            <span className="text-white/60">•</span>
                            <span className="text-lg">
                              <BookOpen className="h-5 w-5 inline mr-2" />
                              {group.subject_name}
                            </span>
                          </div>
                          <div className="text-sm bg-white/20 px-4 py-2 rounded-full">
                            Jumla: {wanafunziWaliopepetwaKikundi.length}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                            <TableRow>
                              <TableHead className="font-bold">#</TableHead>
                              <TableHead className="font-bold">Jina</TableHead>
                              <TableHead className="font-bold">Jinsia</TableHead>
                              <TableHead className="font-bold">Namba</TableHead>
                              <TableHead className="font-bold">Baba</TableHead>
                              <TableHead className="font-bold">Simu</TableHead>
                              <TableHead className="text-right font-bold">Vitendo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {wanafunziWaliopepetwaKikundi.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                  Hakuna wanafunzi katika kikundi hiki.
                                </TableCell>
                              </TableRow>
                            ) : (
                              wanafunziWaliopepetwaKikundi.map((student, idx) => (
                                <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                                  <TableCell className="font-mono">{idx + 1}</TableCell>
                                  <TableCell className="font-semibold">{student.name}</TableCell>
                                  <TableCell>{pataJinsia(student.sex)}</TableCell>
                                  <TableCell>{student.roll_number || "-"}</TableCell>
                                  <TableCell>{student.father_name || "-"}</TableCell>
                                  <TableCell>{student.father_phone || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => funguaDialogHariri(student)}
                                        className="rounded-full text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-all duration-200 hover:scale-110"
                                        title="Hariri Mwanafunzi"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => tazamaRipoti(student.id)}
                                        className="rounded-full text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-110"
                                        title="Tazama Ripoti"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => tengenezaPDF(student.id)}
                                        className="rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:scale-110"
                                        title="Pakua Ripoti ya Mzazi"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => futaMwanafunzi(student.id)}
                                        className="rounded-full transition-all duration-200 hover:scale-110"
                                        title="Futa Mwanafunzi"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* HARIRI MWANAFUNZI DIALOG */}
      <Dialog open={dialogHaririFungua} onOpenChange={setDialogHaririFungua}>
        <DialogContent className="max-w-2xl rounded-2xl animate-in fade-in zoom-in duration-300">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Hariri Mwanafunzi</DialogTitle>
            <DialogDescription>
              Sasisha taarifa za mwanafunzi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={sasishaMwanafunzi}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right font-semibold">Jina Kamili *</Label>
                <Input
                  id="edit-name"
                  className="col-span-3 rounded-xl"
                  value={dataYaHariri.name}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-sex" className="text-right font-semibold">Jinsia *</Label>
                <Select
                  value={dataYaHariri.sex}
                  onValueChange={(value) => setDataYaHariri({ ...dataYaHariri, sex: value })}
                >
                  <SelectTrigger className="col-span-3 rounded-xl">
                    <SelectValue placeholder="Chagua jinsia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">ME</SelectItem>
                    <SelectItem value="F">KE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-class" className="text-right font-semibold">Darasa *</Label>
                <Select
                  value={dataYaHariri.class_id}
                  onValueChange={(value) => setDataYaHariri({ ...dataYaHariri, class_id: value })}
                >
                  <SelectTrigger className="col-span-3 rounded-xl">
                    <SelectValue placeholder="Chagua darasa" />
                  </SelectTrigger>
                  <SelectContent>
                    {madarasa.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {dataYaHariri.class_id && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-stream" className="text-right font-semibold">Mkondo *</Label>
                  <Select
                    value={dataYaHariri.stream_id}
                    onValueChange={(value) => setDataYaHariri({ ...dataYaHariri, stream_id: value })}
                  >
                    <SelectTrigger className="col-span-3 rounded-xl">
                      <SelectValue placeholder="Chagua mkondo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mikondo
                        .filter(s => s.class_id === parseInt(dataYaHariri.class_id))
                        .map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            Mkondo {stream.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-father-name" className="text-right font-semibold">Jina la Baba *</Label>
                <Input
                  id="edit-father-name"
                  className="col-span-3 rounded-xl"
                  value={dataYaHariri.father_name}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, father_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-father-phone" className="text-right font-semibold">Simu ya Baba *</Label>
                <Input
                  id="edit-father-phone"
                  className="col-span-3 rounded-xl"
                  value={dataYaHariri.father_phone}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, father_phone: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-roll-number" className="text-right font-semibold">Namba ya Uandikishaji</Label>
                <Input
                  id="edit-roll-number"
                  className="col-span-3 rounded-xl"
                  value={dataYaHariri.roll_number ?? ""}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, roll_number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-health-info" className="text-right font-semibold">Taarifa za Afya</Label>
                <Input
                  id="edit-health-info"
                  className="col-span-3 rounded-xl"
                  value={dataYaHariri.health_info ?? ""}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, health_info: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right font-semibold">Anuani</Label>
                <Input
                  id="edit-address"
                  className="col-span-3 rounded-xl"
                  value={dataYaHariri.address ?? ""}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogHaririFungua(false)} className="rounded-xl">
                Ghairi
              </Button>
              <Button type="submit" className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600">
                Sasisha Mwanafunzi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PDF DIALOG */}
      <Dialog open={dialogPDF} onOpenChange={setDialogPDF}>
        <DialogContent className="rounded-2xl animate-in fade-in zoom-in duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Chagua Aina ya Mtihani</DialogTitle>
            <DialogDescription>
              Chagua aina ya mtihani kwa ripoti ya mzazi.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={ainaYaMtihani} onValueChange={setAinaYaMtihani}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chagua aina ya mtihani" />
              </SelectTrigger>
              <SelectContent>
                {AINA_ZAMAONI.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogPDF(false)} className="rounded-xl">
              Ghairi
            </Button>
            <Button onClick={thibitishaTengenezaPDF} className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              Tengeneza PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}