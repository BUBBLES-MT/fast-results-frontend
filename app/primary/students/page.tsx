// app/primary/students/page.tsx

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
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  FileText,
  Edit,
  BookOpen,
  GraduationCap,
  Users,
  Download,
  Shield,
  ChevronLeft,
  Sparkles,
  Layers,
  Clock,
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Star,
  ChevronRight,
  RefreshCw,
  Globe,
  Filter,
  School,
  Building,
  Award,
  Crown,
  Trophy,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// 🔥 API BASE - Works EVERYWHERE (Local + Live!)
// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 📊 INTERFACES
// ============================================================

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

// ============================================================
// 🔥 HELPERS
// ============================================================

const pataJinsia = (sex: string): string => {
  return sex === "M" ? "ME" : "KE";
};

const pataRangiYaJinsia = (sex: string): string => {
  return sex === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700";
};

const niMwalimu = (jukumu: string): boolean => {
  return jukumu?.toLowerCase() === "mwalimu" || jukumu?.toLowerCase() === "teacher";
};

// ============================================================
// 🔥 MOBILE LAYOUT COMPONENTS - EXTREME PRO MAX!
// ============================================================

function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 touch-feedback group animate-slideIn"
    >
      <div className="p-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">Rudi</span>
    </button>
  );
}

function MobileHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 p-4 sm:p-6 text-white shadow-2xl mb-4 sm:mb-6 animate-fadeIn">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-soft animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="bg-white/20 p-2.5 rounded-2xl shadow-lg backdrop-blur-sm flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-sky-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {badge && <div className="flex-shrink-0">{badge}</div>}
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  children,
  className,
  gradient,
  hover = true,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <Card
      className={cn(
        "border-0 overflow-hidden rounded-2xl",
        gradient || "bg-white/90 backdrop-blur-sm",
        hover && "shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
}

function MobileAlert({
  type,
  message,
  children,
  onClose,
}: {
  type: "success" | "error" | "info" | "warning";
  message: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  const styles = {
    success: "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
    error: "bg-red-50 border-l-4 border-red-500 text-red-700",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700",
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />,
    info: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 shadow-lg animate-slideIn border",
        styles[type]
      )}
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base break-words font-medium">{message}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function MobileStatCard({
  label,
  value,
  icon: Icon,
  color = "sky",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: "sky" | "emerald" | "purple" | "amber" | "red" | "teal" | "indigo" | "pink" | "blue" | "rose" | "orange" | "cyan" | "green";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    sky: "from-sky-500 to-blue-500",
    blue: "from-blue-500 to-indigo-500",
    cyan: "from-cyan-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    teal: "from-teal-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    orange: "from-orange-500 to-red-500",
    red: "from-red-500 to-rose-500",
    rose: "from-rose-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
    pink: "from-pink-500 to-rose-500",
    green: "from-green-500 to-teal-500",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-3 sm:p-4 text-white shadow-xl",
        "transition-all duration-500 hover:scale-105 active:scale-95",
        `bg-gradient-to-r ${gradients[color] || gradients.sky}`
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-medium text-white/80 truncate uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl sm:text-3xl font-bold mt-0.5 truncate">{value}</p>
          {subtitle && (
            <p className="text-[8px] sm:text-[10px] text-white/70 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}

function MobileTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollable">
      <div className="px-4 sm:px-0 min-w-[800px] sm:min-w-full">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================
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
    if (typeof window !== "undefined") {
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

  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ============================================================
  // 🔥 INITIALIZATION
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

    chukuaMadarasa(tokenIliyohifadhiwa);
    chukuaMikondo(tokenIliyohifadhiwa);

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
  // 🔥 FETCH WANAFUNZI WOTE
  // ============================================================
  const chukuaWanafunziWote = async (authToken: string) => {
    try {
      setInapakia(true);
      const isTeacher = niMwalimu(jukumuLaMtumiaji);
      const apiUrl = isTeacher
        ? `${API_BASE}/api/v1/primary/students/my-students`
        : `${API_BASE}/api/v1/primary/students`;

      console.log("📡 Fetching students from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
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
  // 🔥 FETCH WANAFUNZI WALIOPANGWA
  // ============================================================
  const chukuaWanafunziWaliopangwa = async (authToken: string) => {
    try {
      setInapakia(true);

      const response = await fetch(`${API_BASE}/api/v1/primary/students/my-students`, {
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

          jinaDarasa = jinaDarasa.replace(/(\w+)\s+\1$/, "$1");

          groupedMap.set(key, {
            subject_id: student.subject_id,
            subject_name: student.subject_name || "Somo Lisilojulikana",
            class_id: student.class_id,
            class_name: jinaDarasa,
            stream_id: student.stream_id,
            stream_name: jinaMkondo,
            students: [],
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
  // 🔥 FETCH MADARASA
  // ============================================================
  const chukuaMadarasa = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/classes`, {
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
  // 🔥 FETCH MIKONDO
  // ============================================================
  const chukuaMikondo = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/primary/streams`, {
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

  // ============================================================
  // 🔥 EFFECTS FOR STREAMS FILTER
  // ============================================================
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
  // 🔥 ONGEZA MWANAFUNZI
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

    setAdding(true);
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

      const response = await fetch(`${API_BASE}/api/v1/primary/students`, {
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
        setAdding(false);
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

      if (niMwalimu(jukumuLaMtumiaji) || mtazamo === "zangu") {
        chukuaWanafunziWaliopangwa(token);
      } else {
        chukuaWanafunziWote(token);
      }
      setKosa("");
      setAdding(false);
    } catch (err) {
      console.error("Kosa la kuongeza mwanafunzi:", err);
      setKosa("Tatizo la mtandao. Tafadhali jaribu tena.");
      setAdding(false);
    }
  };

  // ============================================================
  // 🔥 Futa MWANAFUNZI
  // ============================================================
  const futaMwanafunzi = async (id: number) => {
    if (!confirm("⚠️ Je, una uhakika unataka kumfuta mwanafunzi huyu?")) return;
    try {
      await fetch(`${API_BASE}/api/v1/primary/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (niMwalimu(jukumuLaMtumiaji) || mtazamo === "zangu") {
        chukuaWanafunziWaliopangwa(token);
      } else {
        chukuaWanafunziWote(token);
      }
    } catch (err) {
      setKosa("Imeshindwa kumfuta mwanafunzi");
    }
  };

  // ============================================================
  // 🔥 SASISHA MWANAFUNZI
  // ============================================================
  const sasishaMwanafunzi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mwanafunziAnayehaririwa) return;

    setUpdating(true);
    setKosa("");

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

      const response = await fetch(`${API_BASE}/api/v1/primary/students/${mwanafunziAnayehaririwa.id}`, {
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

      if (niMwalimu(jukumuLaMtumiaji) || mtazamo === "zangu") {
        chukuaWanafunziWaliopangwa(token);
      } else {
        chukuaWanafunziWote(token);
      }
      setKosa("");
      setUpdating(false);
    } catch (err) {
      setKosa("Imeshindwa kumsasisha mwanafunzi");
      setUpdating(false);
    }
  };

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const tazamaRipoti = (studentId: number) => {
    router.push(`/primary/reports/student/${studentId}`);
  };

  const tazamaMaelezo = (studentId: number) => {
    router.push(`/primary/students/${studentId}`);
  };

  const tengenezaPDF = (studentId: number) => {
    setMwanafunziAliyechaguliwa(studentId);
    setDialogPDF(true);
  };

  const thibitishaTengenezaPDF = () => {
    if (mwanafunziAliyechaguliwa) {
      const url = `${API_BASE}/api/v1/reports/student/${mwanafunziAliyechaguliwa}/parent-report?exam_type=${ainaYaMtihani}`;
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

  // ============================================================
  // 🔍 FILTER STUDENTS - ✅ FIXED: Defined BEFORE use!
  // ============================================================
  const wanafunziWaliopepetwa = wanafunzi.filter(
    (student) =>
      student.name.toLowerCase().includes(tafuta.toLowerCase()) ||
      (student.roll_number && student.roll_number.includes(tafuta))
  );

  // ============================================================
  // 📊 STATS
  // ============================================================
  const totalStudents = wanafunzi.length;
  const totalClasses = madarasa.length;
  const totalStreams = mikondo.length;
  const totalFiltered = wanafunziWaliopepetwa?.length || 0;

  // ============================================================
  // ⏳ LOADING STATE
  // ============================================================
  if (inapakia) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 relative z-10" />
          </div>
          <p className="text-gray-500 mt-4 animate-pulse text-sm sm:text-base">
            Inapakia wanafunzi...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ============================================================
  // 🎨 RENDER - PRO MAX!
  // ============================================================
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Back Button */}
        <MobileBackButton />

        {/* Header */}
        <MobileHeader
          title={anawezaZakeTu() ? "Wanafunzi Wangu" : "Usimamizi wa Wanafunzi"}
          subtitle={
            anawezaZakeTu()
              ? "Orodha ya wanafunzi unaowafundisha"
              : "Simamia wanafunzi wote wa shule"
          }
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
              {totalStudents} Wanafunzi
            </span>
          }
          action={
            anawezaZakeTu() ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm backdrop-blur-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                Mwalimu
              </span>
            ) : null
          }
        />

        {/* 🔥🔥🔥 STATS GRID - PRO MAX SIZE! 🔥🔥🔥 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Jumla ya Wanafunzi
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStudents}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Madarasa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalClasses}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <School className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Mikondo
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalStreams}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 text-white shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
                  Wamechujwa
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1">
                  {totalFiltered}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {kosa && (
          <MobileAlert type="error" message={kosa} onClose={() => setKosa("")} />
        )}

        {/* View Toggle & Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap gap-2">
            {anawezaKuzote() && (
              <>
                <Button
                  variant={mtazamo === "zote" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMtazamo("zote")}
                  className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
                >
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  Wanafunzi Wote
                </Button>
                <Button
                  variant={mtazamo === "zangu" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMtazamo("zangu")}
                  className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 touch-feedback"
                >
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  Wanafunzi Wangu
                </Button>
              </>
            )}
          </div>

          {!anawezaZakeTu() && (
            <Dialog open={dialogFungua} onOpenChange={setDialogFungua}>
              <DialogTrigger asChild>
                <Button className="gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-xs sm:text-sm h-9 sm:h-10 touch-feedback">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Ongeza Mwanafunzi</span>
                  <span className="xs:hidden">Ongeza</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    Ongeza Mwanafunzi Mpya
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Jaza taarifa zote ili kuongeza mwanafunzi mpya. Darasa na Mkondo vinahitajika.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={ongezaMwanafunzi}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jina Kamili *</Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="Weka jina kamili la mwanafunzi"
                        value={dataYaMwanzilishi.name}
                        onChange={(e) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jinsia *</Label>
                      <Select
                        value={dataYaMwanzilishi.sex}
                        onValueChange={(value) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, sex: value })
                        }
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                          <SelectValue placeholder="Chagua jinsia" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                          <SelectItem value="M">ME</SelectItem>
                          <SelectItem value="F">KE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Darasa *</Label>
                      <Select
                        value={dataYaMwanzilishi.class_id}
                        onValueChange={(value) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, class_id: value })
                        }
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                          <SelectValue placeholder="Chagua darasa" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                          {madarasa.length === 0 ? (
                            <SelectItem value="none" disabled>
                              Hakuna madarasa
                            </SelectItem>
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
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Mkondo *</Label>
                        <Select
                          value={dataYaMwanzilishi.stream_id}
                          onValueChange={(value) =>
                            setDataYaMwanzilishi({ ...dataYaMwanzilishi, stream_id: value })
                          }
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                            <SelectValue placeholder="Chagua mkondo" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                            {mikondoIliyochujwa.length === 0 ? (
                              <SelectItem value="none" disabled>
                                Hakuna mikondo
                              </SelectItem>
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

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jina la Baba *</Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="Weka jina kamili la baba"
                        value={dataYaMwanzilishi.father_name}
                        onChange={(e) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, father_name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Simu ya Baba *</Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="Mfano: 0712345678"
                        value={dataYaMwanzilishi.father_phone}
                        onChange={(e) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, father_phone: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Taarifa za Afya</Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="Mfano: Mzio, Hali ya kiafya"
                        value={dataYaMwanzilishi.health_info ?? ""}
                        onChange={(e) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, health_info: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Anuani</Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="Anuani ya nyumbani"
                        value={dataYaMwanzilishi.address ?? ""}
                        onChange={(e) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Namba ya Uandikishaji</Label>
                      <Input
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                        placeholder="Si lazima"
                        value={dataYaMwanzilishi.roll_number}
                        onChange={(e) =>
                          setDataYaMwanzilishi({ ...dataYaMwanzilishi, roll_number: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {kosa && (
                    <MobileAlert type="error" message={kosa} onClose={() => setKosa("")} />
                  )}

                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogFungua(false)}
                      className="w-full sm:w-auto touch-feedback"
                    >
                      Ghairi
                    </Button>
                    <Button
                      type="submit"
                      disabled={adding}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 touch-feedback"
                    >
                      {adding ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {adding ? "Inaongeza..." : "Hifadhi Mwanafunzi"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search Bar */}
        <MobileCard delay={100}>
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tafuta kwa jina au namba ya uandikishaji..."
                className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                value={tafuta}
                onChange={(e) => setTafuta(e.target.value)}
              />
            </div>
          </CardContent>
        </MobileCard>

        {/* WANAFUNZI WOTE - ADMIN TU */}
        {mtazamo === "zote" && !anawezaZakeTu() && (
          <MobileCard delay={200}>
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-gray-800 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                Wanafunzi Wote
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({wanafunziWaliopepetwa.length} wanafunzi)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MobileTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                      <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xs:table-cell">Jinsia</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Darasa</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Mkondo</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Namba</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Baba</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Simu</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm w-20 sm:w-28">Vitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wanafunziWaliopepetwa.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 sm:py-16 text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                            <p className="text-sm sm:text-base">Hakuna wanafunzi</p>
                            <p className="text-xs sm:text-sm text-gray-400">
                              Bonyeza "Ongeza Mwanafunzi" kuanza.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      wanafunziWaliopepetwa.map((student, index) => (
                        <TableRow
                          key={student.id}
                          className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group animate-fadeIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="text-center text-xs sm:text-sm text-gray-500 font-mono">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0 cursor-pointer"
                                onClick={() => tazamaMaelezo(student.id)}
                              >
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <span
                                className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px] cursor-pointer hover:text-sky-600 transition-colors"
                                onClick={() => tazamaMaelezo(student.id)}
                              >
                                {student.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden xs:table-cell">
                            <span
                              className={cn(
                                "inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                                pataRangiYaJinsia(student.sex)
                              )}
                            >
                              {pataJinsia(student.sex)}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                            {jinaLaDarasa(student.class_id)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                            {jinaLaMkondo(student.stream_id)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell font-mono text-xs sm:text-sm">
                            {student.roll_number || "-"}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-xs sm:text-sm truncate max-w-[80px]">
                            {student.father_name || "-"}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell font-mono text-xs sm:text-sm">
                            {student.father_phone || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1 sm:gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => tazamaMaelezo(student.id)}
                                className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Maelezo"
                              >
                                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => funguaDialogHariri(student)}
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Hariri"
                              >
                                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => tazamaRipoti(student.id)}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Ripoti"
                              >
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => tengenezaPDF(student.id)}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Pakua PDF"
                              >
                                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => futaMwanafunzi(student.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                title="Futa"
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </MobileTableWrapper>
            </CardContent>
          </MobileCard>
        )}

        {/* WANAFUNZI WANGU - MWALIMU NA ADMIN (zangu) */}
        {(mtazamo === "zangu" || anawezaZakeTu()) && (
          <div className="space-y-4 sm:space-y-6">
            {wanafunziWaliopangwa.length === 0 ? (
              <MobileCard>
                <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
                <CardContent className="py-12 sm:py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {anawezaZakeTu()
                        ? "Hujapewa masomo bado. Wasiliana na Mtaaluma."
                        : "Hakuna wanafunzi katika madarasa uliyopangiwa."}
                    </p>
                  </div>
                </CardContent>
              </MobileCard>
            ) : (
              wanafunziWaliopangwa.map((group, groupIdx) => {
                const wanafunziWaliopepetwaKikundi = group.students.filter(
                  (student) =>
                    student.name.toLowerCase().includes(tafuta.toLowerCase()) ||
                    (student.roll_number && student.roll_number.includes(tafuta))
                );

                if (wanafunziWaliopepetwaKikundi.length === 0 && tafuta) return null;

                return (
                  <MobileCard
                    key={`${group.class_id}-${group.stream_id}-${group.subject_id}`}
                    delay={groupIdx * 100 + 200}
                  >
                    <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
                    <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white rounded-t-2xl">
                      <CardTitle className="text-sm sm:text-base">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center flex-wrap gap-2">
                            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-bold text-base sm:text-lg">
                              {group.class_name}
                            </span>
                            <span className="text-white/40 hidden xs:inline">•</span>
                            <span className="text-sm sm:text-base flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline" />
                              {group.subject_name}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full">
                            Jumla: {wanafunziWaliopepetwaKikundi.length}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <MobileTableWrapper>
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="w-8 sm:w-12 text-center text-xs sm:text-sm">#</TableHead>
                              <TableHead className="min-w-[140px] text-xs sm:text-sm">Jina</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden xs:table-cell">Jinsia</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Namba</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden md:table-cell">Baba</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Simu</TableHead>
                              <TableHead className="text-center text-xs sm:text-sm w-16 sm:w-24">Vitendo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {wanafunziWaliopepetwaKikundi.map((student, idx) => (
                              <TableRow
                                key={student.id}
                                className="hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-blue-50/50 transition-all duration-200 group animate-fadeIn"
                                style={{ animationDelay: `${idx * 50}ms` }}
                              >
                                <TableCell className="text-center text-xs sm:text-sm text-gray-500 font-mono">
                                  {idx + 1}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] sm:text-sm font-bold flex-shrink-0 cursor-pointer"
                                      onClick={() => tazamaMaelezo(student.id)}
                                    >
                                      {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span
                                      className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px] cursor-pointer hover:text-sky-600 transition-colors"
                                      onClick={() => tazamaMaelezo(student.id)}
                                    >
                                      {student.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden xs:table-cell">
                                  <span
                                    className={cn(
                                      "inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium",
                                      pataRangiYaJinsia(student.sex)
                                    )}
                                  >
                                    {pataJinsia(student.sex)}
                                  </span>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell font-mono text-xs sm:text-sm">
                                  {student.roll_number || "-"}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-xs sm:text-sm truncate max-w-[80px]">
                                  {student.father_name || "-"}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell font-mono text-xs sm:text-sm">
                                  {student.father_phone || "-"}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => tazamaMaelezo(student.id)}
                                      className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                      title="Maelezo"
                                    >
                                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => tazamaRipoti(student.id)}
                                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl h-7 w-7 sm:h-8 sm:w-8 p-0 touch-feedback"
                                      title="Ripoti"
                                    >
                                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </MobileTableWrapper>
                    </CardContent>
                  </MobileCard>
                );
              })
            )}
          </div>
        )}

        {/* Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sky-800 text-xs sm:text-sm">👨‍🎓 Wanafunzi</p>
                <p className="text-[10px] sm:text-xs text-sky-600/80 mt-0.5">
                  Simamia wanafunzi wote wa shule
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs sm:text-sm">➕ Ongeza Mwanafunzi</p>
                <p className="text-[10px] sm:text-xs text-emerald-600/80 mt-0.5">
                  Ongeza mwanafunzi mpya kwenye darasa
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 sm:p-4 animate-slideIn" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-800 text-xs sm:text-sm">👁️ Tazama Maelezo</p>
                <p className="text-[10px] sm:text-xs text-purple-600/80 mt-0.5">
                  Bonyeza herufi ya kwanza kuona maelezo kamili
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-xs text-gray-400 py-3 sm:py-4 border-t border-gray-100 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <p className="font-medium text-sky-600">© 2026 MASI FAST RESULTS • Usimamizi wa Wanafunzi</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-2">
            <span>👨‍🎓 {totalStudents} wanafunzi</span>
            <span>•</span>
            <span>📚 {totalClasses} madarasa</span>
            <span>•</span>
            <span>🔀 {totalStreams} mikondo</span>
          </p>
        </div>
      </div>

      {/* EDIT STUDENT DIALOG */}
      <Dialog open={dialogHaririFungua} onOpenChange={setDialogHaririFungua}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Edit className="h-5 w-5 text-sky-600" />
              Hariri Mwanafunzi
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Sasisha taarifa za mwanafunzi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={sasishaMwanafunzi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Jina Kamili *</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={dataYaHariri.name}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Jinsia *</Label>
                <Select
                  value={dataYaHariri.sex}
                  onValueChange={(value) => setDataYaHariri({ ...dataYaHariri, sex: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua jinsia" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="M">ME</SelectItem>
                    <SelectItem value="F">KE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Darasa *</Label>
                <Select
                  value={dataYaHariri.class_id}
                  onValueChange={(value) => setDataYaHariri({ ...dataYaHariri, class_id: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Chagua darasa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    {madarasa.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {dataYaHariri.class_id && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Mkondo *</Label>
                  <Select
                    value={dataYaHariri.stream_id}
                    onValueChange={(value) => setDataYaHariri({ ...dataYaHariri, stream_id: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm">
                      <SelectValue placeholder="Chagua mkondo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                      {mikondo
                        .filter((s) => s.class_id === parseInt(dataYaHariri.class_id))
                        .map((stream) => (
                          <SelectItem key={stream.id} value={stream.id.toString()}>
                            Mkondo {stream.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Jina la Baba *</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={dataYaHariri.father_name}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, father_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Simu ya Baba *</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={dataYaHariri.father_phone}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, father_phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Namba ya Uandikishaji</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={dataYaHariri.roll_number ?? ""}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, roll_number: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Taarifa za Afya</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={dataYaHariri.health_info ?? ""}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, health_info: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">Anuani</Label>
                <Input
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 rounded-xl h-10 sm:h-11 text-sm"
                  value={dataYaHariri.address ?? ""}
                  onChange={(e) => setDataYaHariri({ ...dataYaHariri, address: e.target.value })}
                />
              </div>
            </div>

            {kosa && <MobileAlert type="error" message={kosa} onClose={() => setKosa("")} />}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogHaririFungua(false)}
                className="w-full sm:w-auto touch-feedback"
              >
                Ghairi
              </Button>
              <Button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 touch-feedback"
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {updating ? "Inasasisha..." : "Sasisha Mwanafunzi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PDF DIALOG */}
      <Dialog open={dialogPDF} onOpenChange={setDialogPDF}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-gray-800">
              <Download className="h-5 w-5 text-purple-600" />
              Chagua Aina ya Mtihani
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Chagua aina ya mtihani kwa ripoti ya mzazi.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={ainaYaMtihani} onValueChange={setAinaYaMtihani}>
              <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl h-10 sm:h-11 text-sm">
                <SelectValue placeholder="Chagua aina ya mtihani" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                {AINA_ZAMAONI.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogPDF(false)}
              className="w-full sm:w-auto touch-feedback"
            >
              Ghairi
            </Button>
            <Button
              onClick={thibitishaTengenezaPDF}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 touch-feedback"
            >
              <Download className="h-4 w-4 mr-2" />
              Tengeneza PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .touch-feedback {
          @apply active:scale-95 transition-transform duration-150;
        }

        .scrollable {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        @media (max-width: 399px) {
          .xs\\:table-cell {
            display: table-cell !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
          .xs\\:inline {
            display: inline !important;
          }
        }
        @media (min-width: 400px) {
          .xs\\:table-cell {
            display: none !important;
          }
          .xs\\:hidden {
            display: table-cell !important;
          }
          .xs\\:inline {
            display: none !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}