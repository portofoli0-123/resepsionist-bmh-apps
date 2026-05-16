"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import {
  Users, Phone, Mail, TrendingUp, Clock, ArrowUpRight,
  UserPlus, BookOpen, PhoneCall, FileText, Activity, Zap, Package
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  collection, query, orderBy, onSnapshot, limit,
  Timestamp, where, addDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Guest, AmilKeluar } from "@/lib/schema";
import { Telepon, Surat, Paket } from "@/lib/schema-pesan";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import GuestForm from "@/components/guest/GuestForm";
import AmilKeluarForm from "@/components/amil-keluar/AmilKeluarForm";
import PaketForm from "@/components/paket-masuk/PaketForm";

/* ──────────────── Animated SVG Decorations ──────────────── */

function FloatingCircles() {
  return (
    <svg className="absolute top-0 right-0 w-64 h-64 opacity-[0.07] pointer-events-none" viewBox="0 0 200 200">
      <motion.circle cx="150" cy="50" r="40" fill="#10b981"
        animate={{ cy: [50, 70, 50], r: [40, 45, 40] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx="60" cy="130" r="25" fill="#3b82f6"
        animate={{ cx: [60, 80, 60], r: [25, 30, 25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.circle cx="170" cy="160" r="15" fill="#f59e0b"
        animate={{ cy: [160, 140, 160] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  );
}

function PulseRing({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <svg className="absolute -top-1 -right-1 w-4 h-4" viewBox="0 0 16 16">
      <motion.circle cx="8" cy="8" r="3" fill={color}
        animate={{ r: [3, 7, 3], opacity: [1, 0, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay }}
      />
      <circle cx="8" cy="8" r="2.5" fill={color} />
    </svg>
  );
}

function WaveLine() {
  return (
    <svg className="w-full h-6 opacity-20" viewBox="0 0 1200 24" preserveAspectRatio="none">
      <motion.path
        d="M0 12 Q150 0 300 12 T600 12 T900 12 T1200 12"
        fill="none" stroke="#10b981" strokeWidth="1.5"
        animate={{ d: [
          "M0 12 Q150 0 300 12 T600 12 T900 12 T1200 12",
          "M0 12 Q150 24 300 12 T600 12 T900 12 T1200 12",
          "M0 12 Q150 0 300 12 T600 12 T900 12 T1200 12"
        ]}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function ChartDots({ stats, maxVal }: { stats: number[]; maxVal: number }) {
  const w = 100, h = 50, px = 6;
  const stepX = (w - px * 2) / 6;
  const points = stats.map((v, i) => ({
    x: px + i * stepX,
    y: h - px - ((v / maxVal) * (h - px * 2))
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[6]?.x ?? points[points.length-1].x} ${h - px} L${px} ${h - px} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={areaPath} fill="url(#chartGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.path d={linePath} fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      />
      {points.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="2" fill="#10b981"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
        />
      ))}
    </svg>
  );
}

/* ──────────────── Animation Variants ──────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

/* ──────────────── Main Component ──────────────── */

export default function DashboardPage() {
  const [totalGuests, setTotalGuests] = useState(0);
  const [todayGuests, setTodayGuests] = useState(0);
  const [last7DaysStats, setLast7DaysStats] = useState<number[]>(new Array(7).fill(0));
  const [last7DaysByCategory, setLast7DaysByCategory] = useState<{
    donatur: number[];
    mustahiq: number[];
    kunjungan: number[];
  }>({ donatur: new Array(7).fill(0), mustahiq: new Array(7).fill(0), kunjungan: new Array(7).fill(0) });
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);

  const [totalTelepon, setTotalTelepon] = useState(0);
  const [todayTelepon, setTodayTelepon] = useState(0);
  const [recentTelepon, setRecentTelepon] = useState<Telepon[]>([]);

  const [totalSurat, setTotalSurat] = useState(0);
  const [todaySurat, setTodaySurat] = useState(0);
  const [recentSurat, setRecentSurat] = useState<Surat[]>([]);

  const [totalAmil, setTotalAmil] = useState(0);
  const [todayAmil, setTodayAmil] = useState(0);
  const [recentAmil, setRecentAmil] = useState<AmilKeluar[]>([]);

  const [totalPaket, setTotalPaket] = useState(0);
  const [todayPaket, setTodayPaket] = useState(0);
  const [recentPaket, setRecentPaket] = useState<Paket[]>([]);

  const [loading, setLoading] = useState(true);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isAddAmilOpen, setIsAddAmilOpen] = useState(false);
  const [isAddPaketOpen, setIsAddPaketOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = startOfDay(subDays(today, 6));

    const unsubscribeTotal = onSnapshot(collection(db, "guests"), (snap) => {
      setTotalGuests(snap.size);
    });

    const qStats = query(
      collection(db, "guests"),
      where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo)),
      orderBy("createdAt", "desc")
    );
    const unsubscribeStats = onSnapshot(qStats, (snap) => {
      const guests = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Guest[];
      setTodayGuests(guests.filter(g => g.createdAt && isSameDay(g.createdAt.toDate(), today)).length);
      const stats = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(today, 6 - i);
        return guests.filter(g => g.createdAt && isSameDay(g.createdAt.toDate(), day)).length;
      });
      setLast7DaysStats(stats);

      // Per-category breakdown
      const donatur = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(today, 6 - i);
        return guests.filter(g => g.createdAt && isSameDay(g.createdAt.toDate(), day) && g.kategori === "Donatur").length;
      });
      const mustahiq = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(today, 6 - i);
        return guests.filter(g => g.createdAt && isSameDay(g.createdAt.toDate(), day) && g.kategori === "Mustahiq").length;
      });
      const kunjungan = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(today, 6 - i);
        return guests.filter(g => g.createdAt && isSameDay(g.createdAt.toDate(), day) && g.kategori === "Kunjungan & Lainnya").length;
      });
      setLast7DaysByCategory({ donatur, mustahiq, kunjungan });

      setLoading(false);
    });

    const qRecent = query(collection(db, "guests"), orderBy("createdAt", "desc"), limit(5));
    const unsubscribeRecent = onSnapshot(qRecent, (snap) => {
      setRecentGuests(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Guest[]);
    });

    const unsubTeleponTotal = onSnapshot(collection(db, "telepon"), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Telepon[];
      setTotalTelepon(snap.size);
      setTodayTelepon(all.filter(t => t.createdAt && isSameDay(t.createdAt.toDate(), today)).length);
    });

    const qRecentTelepon = query(collection(db, "telepon"), orderBy("createdAt", "desc"), limit(3));
    const unsubTeleponRecent = onSnapshot(qRecentTelepon, (snap) => {
      setRecentTelepon(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Telepon[]);
    });

    const unsubSuratTotal = onSnapshot(collection(db, "surat"), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Surat[];
      setTotalSurat(snap.size);
      setTodaySurat(all.filter(s => s.createdAt && isSameDay(s.createdAt.toDate(), today)).length);
    });

    const qRecentSurat = query(collection(db, "surat"), orderBy("createdAt", "desc"), limit(3));
    const unsubSuratRecent = onSnapshot(qRecentSurat, (snap) => {
      setRecentSurat(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Surat[]);
    });

    const unsubAmilTotal = onSnapshot(collection(db, "amil-keluar"), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as AmilKeluar[];
      setTotalAmil(snap.size);
      setTodayAmil(all.filter(a => a.createdAt && isSameDay(a.createdAt.toDate(), today)).length);
    });

    const qRecentAmil = query(collection(db, "amil-keluar"), orderBy("createdAt", "desc"), limit(3));
    const unsubAmilRecent = onSnapshot(qRecentAmil, (snap) => {
      setRecentAmil(snap.docs.map(d => ({ id: d.id, ...d.data() })) as AmilKeluar[]);
    });

    const unsubPaketTotal = onSnapshot(collection(db, "paket-masuk"), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Paket[];
      setTotalPaket(snap.size);
      setTodayPaket(all.filter(p => p.createdAt && isSameDay(p.createdAt.toDate(), today)).length);
    });

    const qRecentPaket = query(collection(db, "paket-masuk"), orderBy("createdAt", "desc"), limit(3));
    const unsubPaketRecent = onSnapshot(qRecentPaket, (snap) => {
      setRecentPaket(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Paket[]);
    });

    return () => {
      unsubscribeTotal();
      unsubscribeStats();
      unsubscribeRecent();
      unsubTeleponTotal();
      unsubTeleponRecent();
      unsubSuratTotal();
      unsubSuratRecent();
      unsubAmilTotal();
      unsubAmilRecent();
      unsubPaketTotal();
      unsubPaketRecent();
    };
  }, []);

  const handleAddGuest = async (data: any) => {
    try {
      await addDoc(collection(db, "guests"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setIsAddGuestOpen(false);
    } catch (error) {
      console.error("Error saving guest:", error);
    }
  };

  const handleAddAmil = async (data: any) => {
    try {
      await addDoc(collection(db, "amil-keluar"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setIsAddAmilOpen(false);
    } catch (error) {
      console.error("Error saving amil keluar:", error);
    }
  };

  const handleAddPaket = async (data: any) => {
    try {
      await addDoc(collection(db, "paket-masuk"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setIsAddPaketOpen(false);
    } catch (error) {
      console.error("Error saving paket masuk:", error);
    }
  };

  const daysLabel = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), "EEE", { locale: localeId })
  );
  const maxVal = Math.max(...last7DaysStats, 1);

  // Recharts data for the area chart — per category
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    day: format(subDays(new Date(), 6 - i), "EEE", { locale: localeId }),
    date: format(subDays(new Date(), 6 - i), "dd MMM", { locale: localeId }),
    donatur: last7DaysByCategory.donatur[i],
    mustahiq: last7DaysByCategory.mustahiq[i],
    kunjungan: last7DaysByCategory.kunjungan[i],
  }));

  const chartConfig = {
    donatur: {
      label: "Donatur",
      color: "hsl(217, 91%, 60%)",
    },
    mustahiq: {
      label: "Mustahiq",
      color: "hsl(30, 80%, 55%)",
    },
    kunjungan: {
      label: "Kunjungan & Lainnya",
      color: "hsl(160, 60%, 45%)",
    },
  } satisfies ChartConfig;

  const statCards = [
    { title: "Total Buku Tamu", total: totalGuests, today: todayGuests, icon: Users, gradient: "from-emerald-500 to-teal-600", light: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", ring: "#10b981", href: "/buku-tamu" },
    { title: "Log Telepon", total: totalTelepon, today: todayTelepon, icon: PhoneCall, gradient: "from-blue-500 to-indigo-600", light: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", ring: "#3b82f6", href: "/pesan-masuk/telepon" },
    { title: "Surat Masuk", total: totalSurat, today: todaySurat, icon: FileText, gradient: "from-amber-500 to-orange-600", light: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", ring: "#f59e0b", href: "/pesan-masuk/surat" },
    { title: "Paket Masuk", total: totalPaket, today: todayPaket, icon: Package, gradient: "from-rose-500 to-red-600", light: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-700 dark:text-rose-400", ring: "#f43f5e", href: "/pesan-masuk/paket" },
    { title: "Amil Keluar", total: totalAmil, today: todayAmil, icon: Users, gradient: "from-purple-500 to-pink-600", light: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400", ring: "#a855f7", href: "/amil-keluar" },
  ];

  const quickActions = [
    { label: "Amil Keluar", desc: "Catat amil keluar", icon: UserPlus, onClick: () => setIsAddAmilOpen(true), gradient: "from-purple-500 to-pink-600", hover: "hover:shadow-purple-200" },
    { label: "Buku Tamu", desc: `${totalGuests} data`, icon: BookOpen, href: "/buku-tamu", gradient: "from-emerald-400 to-emerald-600", hover: "hover:shadow-emerald-200" },
    { label: "Paket Masuk", desc: `${totalPaket} data`, icon: Package, href: "/pesan-masuk/paket", gradient: "from-rose-400 to-red-600", hover: "hover:shadow-rose-200" },
    { label: "Amil Keluar", desc: `${totalAmil} data`, icon: Users, href: "/amil-keluar", gradient: "from-purple-400 to-pink-600", hover: "hover:shadow-purple-200" },
    { label: "Log Telepon", desc: `${totalTelepon} data`, icon: Phone, href: "/pesan-masuk/telepon", gradient: "from-blue-400 to-blue-600", hover: "hover:shadow-blue-200" },
    { label: "Surat Masuk", desc: `${totalSurat} data`, icon: Mail, href: "/pesan-masuk/surat", gradient: "from-amber-400 to-amber-600", hover: "hover:shadow-amber-200" },
  ];

  const recentSections = [
    { title: "Tamu Terbaru", color: "emerald", dot: "bg-emerald-500", link: "/buku-tamu", linkColor: "text-emerald-600 dark:text-emerald-400", items: recentGuests.map(g => ({ id: g.id!, initial: g.nama?.charAt(0)?.toUpperCase() || "?", name: g.nama || "-", sub: `${g.kategori} · ${g.createdAt ? format(g.createdAt.toDate(), "HH:mm", { locale: localeId }) : "-"}`, bg: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-700 dark:text-emerald-400" })) },
    { title: "Paket Terbaru", color: "rose", dot: "bg-rose-500", link: "/pesan-masuk/paket", linkColor: "text-rose-600 dark:text-rose-400", items: recentPaket.map(p => ({ id: p.id!, initial: p.namaPenerima?.charAt(0)?.toUpperCase() || "P", name: p.namaPenerima || "-", sub: `${p.ekspedisi} · ${p.createdAt ? format(p.createdAt.toDate(), "HH:mm", { locale: localeId }) : "-"}`, bg: "bg-rose-100 dark:bg-rose-900/30", textColor: "text-rose-700 dark:text-rose-400" })) },
    { title: "Amil Keluar Terbaru", color: "purple", dot: "bg-purple-500", link: "/amil-keluar", linkColor: "text-purple-600 dark:text-purple-400", items: recentAmil.map(a => ({ id: a.id!, initial: a.nama?.charAt(0)?.toUpperCase() || "A", name: a.nama || "-", sub: `${a.keperluan} · ${a.createdAt ? format(a.createdAt.toDate(), "HH:mm", { locale: localeId }) : "-"}`, bg: "bg-purple-100 dark:bg-purple-900/30", textColor: "text-purple-700 dark:text-purple-400" })) },
    { title: "Telepon Terbaru", color: "blue", dot: "bg-blue-500", link: "/pesan-masuk/telepon", linkColor: "text-blue-600 dark:text-blue-400", items: recentTelepon.map(t => ({ id: t.id!, initial: t.nama?.charAt(0)?.toUpperCase() || "T", name: t.nama || "-", sub: `${t.nomorTelepon} · ${t.keperluan}`, bg: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-700 dark:text-blue-400" })) },
    { title: "Surat Terbaru", color: "amber", dot: "bg-amber-500", link: "/pesan-masuk/surat", linkColor: "text-amber-600 dark:text-amber-400", items: recentSurat.map(s => ({ id: s.id!, initial: s.jenisDokumen?.charAt(0)?.toUpperCase() || "S", name: s.jenisDokumen || "-", sub: `Dari: ${s.namaPengirim} → ${s.ditujukanKepada}`, bg: "bg-amber-100 dark:bg-amber-900/30", textColor: "text-amber-700 dark:text-amber-400" })) },
  ];

  return (
    <motion.div
      className="space-y-6 max-w-[1200px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="relative bg-card rounded-2xl p-6 border border-border shadow-sm overflow-hidden">
        <FloatingCircles />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Activity className="w-5 h-5 text-emerald-500" />
              </motion.div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-serif">
              Selamat Datang Kembali!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {format(new Date(), "EEEE, dd MMMM yyyy", { locale: localeId })}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddGuestOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-200/50 transition-shadow w-full sm:w-auto justify-center"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Tamu
          </motion.button>
        </div>
        <div className="mt-4">
          <WaveLine />
        </div>
      </motion.div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.title} variants={itemVariants}>
            <Link href={s.href} className="group block relative bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md hover:border-muted-foreground/30 transition-all duration-300 overflow-hidden">
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient} rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-start justify-between mb-3">
                <div className="relative">
                  <motion.div
                    className={`bg-gradient-to-br ${s.gradient} p-2.5 rounded-xl text-white shadow-sm`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <s.icon className="w-5 h-5" />
                  </motion.div>
                  <PulseRing color={s.ring} delay={i * 0.8} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.title}</p>
              <motion.p
                className="text-3xl font-bold text-foreground mt-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                {loading ? "..." : s.total.toLocaleString()}
              </motion.p>
              <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${s.text} ${s.light} px-2.5 py-1 rounded-full`}>
                <Clock className="w-3 h-3" />
                {s.today} hari ini
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Chart + Quick Access (Linear Row) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Chart - 3 cols */}
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">Statistik Tamu per Kategori</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Total <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{last7DaysStats.reduce((a, b) => a + b, 0)}</span> pengunjung dalam 7 hari terakhir
              </p>
            </div>
            <motion.div
              className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg text-white"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Area Chart — 3 categories */}
          <div className="px-2 pt-4 pb-2 sm:px-4 flex-grow flex flex-col">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto flex-1 h-full w-full min-h-[220px]"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillDonatur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-donatur)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-donatur)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillMustahiq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-mustahiq)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-mustahiq)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillKunjungan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-kunjungan)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-kunjungan)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return (payload[0].payload as any).date;
                        }
                        return value;
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="donatur"
                  type="natural"
                  fill="url(#fillDonatur)"
                  stroke="var(--color-donatur)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="mustahiq"
                  type="natural"
                  fill="url(#fillMustahiq)"
                  stroke="var(--color-mustahiq)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="kunjungan"
                  type="natural"
                  fill="url(#fillKunjungan)"
                  stroke="var(--color-kunjungan)"
                  strokeWidth={2}
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </div>
        </motion.div>

        {/* Quick Access - 2 cols */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            Akses Cepat
          </p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const content = (
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border hover:border-muted-foreground/30 ${action.hover} hover:shadow-md transition-all duration-300 cursor-pointer text-center group`}
                >
                  <div className={`bg-gradient-to-br ${action.gradient} p-2.5 rounded-xl text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{action.label}</p>
                    <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                  </div>
                </motion.div>
              );

              if (action.onClick) {
                return <button key={i} onClick={action.onClick} className="text-left">{content}</button>;
              }
              return <Link key={i} href={action.href!}>{content}</Link>;
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Recent Activity (Linear Row Grid) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {recentSections.map((section, si) => (
          <motion.div
            key={section.title}
            variants={itemVariants}
            className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
                <motion.div
                  className={`w-2 h-2 rounded-full ${section.dot}`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: si * 0.5 }}
                />
                {section.title}
              </h3>
              <Link href={section.link} className={`text-xs ${section.linkColor} font-semibold hover:underline`}>
                Lihat semua
              </Link>
            </div>
            <div className="space-y-2.5">
              {section.items.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada data.</p>
              )}
              {section.items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center ${item.textColor} font-bold text-xs flex-shrink-0`}>
                    {item.initial ? item.initial : "•"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Guest Form Modal ── */}
      <AnimatePresence>
        {isAddGuestOpen && (
          <GuestForm
            isOpen={isAddGuestOpen}
            onClose={() => setIsAddGuestOpen(false)}
            onSubmit={handleAddGuest}
            initialData={null}
          />
        )}
        {isAddAmilOpen && (
          <AmilKeluarForm
            isOpen={isAddAmilOpen}
            onClose={() => setIsAddAmilOpen(false)}
            onSubmit={handleAddAmil}
            initialData={null}
          />
        )}
        {isAddPaketOpen && (
          <PaketForm
            isOpen={isAddPaketOpen}
            onClose={() => setIsAddPaketOpen(false)}
            onSubmit={handleAddPaket}
            initialData={null}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
