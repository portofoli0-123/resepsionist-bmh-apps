"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import {
  Users, Phone, Mail, TrendingUp, Clock, ArrowUpRight,
  UserPlus, BookOpen, PhoneCall, FileText, Activity, Zap
} from "lucide-react";
import {
  collection, query, orderBy, onSnapshot, limit,
  Timestamp, where, addDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Guest } from "@/lib/schema";
import { Telepon } from "@/lib/schema-pesan";
import { Surat } from "@/lib/schema-pesan";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import GuestForm from "@/components/guest/GuestForm";

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

/* ──────────────── Main Component ──────────────── */

export default function DashboardPage() {
  const [totalGuests, setTotalGuests] = useState(0);
  const [todayGuests, setTodayGuests] = useState(0);
  const [last7DaysStats, setLast7DaysStats] = useState<number[]>(new Array(7).fill(0));
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);

  const [totalTelepon, setTotalTelepon] = useState(0);
  const [todayTelepon, setTodayTelepon] = useState(0);
  const [recentTelepon, setRecentTelepon] = useState<Telepon[]>([]);

  const [totalSurat, setTotalSurat] = useState(0);
  const [todaySurat, setTodaySurat] = useState(0);
  const [recentSurat, setRecentSurat] = useState<Surat[]>([]);

  const [loading, setLoading] = useState(true);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);

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

    return () => {
      unsubscribeTotal();
      unsubscribeStats();
      unsubscribeRecent();
      unsubTeleponTotal();
      unsubTeleponRecent();
      unsubSuratTotal();
      unsubSuratRecent();
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

  const daysLabel = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), "EEE", { locale: localeId })
  );
  const maxVal = Math.max(...last7DaysStats, 1);

  const statCards = [
    { title: "Total Buku Tamu", total: totalGuests, today: todayGuests, icon: Users, gradient: "from-emerald-500 to-teal-600", light: "bg-emerald-50", text: "text-emerald-700", ring: "#10b981", href: "/buku-tamu" },
    { title: "Log Telepon", total: totalTelepon, today: todayTelepon, icon: PhoneCall, gradient: "from-blue-500 to-indigo-600", light: "bg-blue-50", text: "text-blue-700", ring: "#3b82f6", href: "/pesan-masuk/telepon" },
    { title: "Surat Masuk", total: totalSurat, today: todaySurat, icon: FileText, gradient: "from-amber-500 to-orange-600", light: "bg-amber-50", text: "text-amber-700", ring: "#f59e0b", href: "/pesan-masuk/surat" },
  ];

  const quickActions = [
    { label: "Tambah Tamu", desc: "Catat kunjungan baru", icon: UserPlus, onClick: () => setIsAddGuestOpen(true), gradient: "from-emerald-500 to-teal-600", hover: "hover:shadow-emerald-200" },
    { label: "Buku Tamu", desc: `${totalGuests} data`, icon: BookOpen, href: "/buku-tamu", gradient: "from-emerald-400 to-emerald-600", hover: "hover:shadow-emerald-200" },
    { label: "Log Telepon", desc: `${totalTelepon} data`, icon: Phone, href: "/pesan-masuk/telepon", gradient: "from-blue-400 to-blue-600", hover: "hover:shadow-blue-200" },
    { label: "Surat Masuk", desc: `${totalSurat} data`, icon: Mail, href: "/pesan-masuk/surat", gradient: "from-amber-400 to-amber-600", hover: "hover:shadow-amber-200" },
  ];

  const recentSections = [
    { title: "Tamu Terbaru", color: "emerald", dot: "bg-emerald-500", link: "/buku-tamu", linkColor: "text-emerald-600", items: recentGuests.map(g => ({ id: g.id!, initial: g.nama?.charAt(0)?.toUpperCase() || "?", name: g.nama || "-", sub: `${g.kategori} · ${g.createdAt ? format(g.createdAt.toDate(), "HH:mm", { locale: localeId }) : "-"}`, bg: "bg-emerald-100", textColor: "text-emerald-700" })) },
    { title: "Telepon Terbaru", color: "blue", dot: "bg-blue-500", link: "/pesan-masuk/telepon", linkColor: "text-blue-600", items: recentTelepon.map(t => ({ id: t.id!, initial: t.nama?.charAt(0)?.toUpperCase() || "T", name: t.nama || "-", sub: `${t.nomorTelepon} · ${t.keperluan}`, bg: "bg-blue-100", textColor: "text-blue-700" })) },
    { title: "Surat Terbaru", color: "amber", dot: "bg-amber-500", link: "/pesan-masuk/surat", linkColor: "text-amber-600", items: recentSurat.map(s => ({ id: s.id!, initial: s.jenisDokumen?.charAt(0)?.toUpperCase() || "S", name: s.jenisDokumen || "-", sub: `Dari: ${s.namaPengirim} → ${s.ditujukanKepada}`, bg: "bg-amber-100", textColor: "text-amber-700" })) },
  ];

  return (
    <motion.div
      className="space-y-6 max-w-[1200px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              Selamat Datang Kembali!
            </h1>
            <p className="text-gray-400 text-sm mt-1">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.title} variants={itemVariants}>
            <Link href={s.href} className="group block relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden">
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
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.title}</p>
              <motion.p
                className="text-3xl font-bold text-gray-900 mt-1"
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
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tren Tamu 7 Hari</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {last7DaysStats.reduce((a, b) => a + b, 0)}
                <span className="text-sm font-normal text-emerald-600 ml-2">Tamu</span>
              </p>
            </div>
            <motion.div
              className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl text-white"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-40 mt-2">
            {last7DaysStats.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-full relative flex flex-col justify-end h-32">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((count / maxVal) * 100, 3)}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full bg-gradient-to-t from-emerald-400/80 to-emerald-200/60 rounded-t-lg group-hover:from-emerald-500 group-hover:to-emerald-400 transition-colors duration-300 relative"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500 group-hover:text-emerald-600 transition-colors whitespace-nowrap">
                      {count}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{daysLabel[i]}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 text-xs text-gray-400 border-t pt-3">
            <span>{format(subDays(new Date(), 6), "dd MMM")}</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Trend Mingguan
            </span>
            <span>{format(new Date(), "dd MMM")}</span>
          </div>
        </motion.div>

        {/* Quick Access - 2 cols */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            Akses Cepat
          </p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const content = (
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 ${action.hover} hover:shadow-md transition-all duration-300 cursor-pointer text-center group`}
                >
                  <div className={`bg-gradient-to-br ${action.gradient} p-2.5 rounded-xl text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{action.label}</p>
                    <p className="text-[11px] text-gray-400">{action.desc}</p>
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

      {/* ── Recent Activity (Linear 3-col grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recentSections.map((section, si) => (
          <motion.div
            key={section.title}
            variants={itemVariants}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
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
                <p className="text-sm text-gray-400 text-center py-4">Belum ada data.</p>
              )}
              {section.items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center ${item.textColor} font-bold text-xs flex-shrink-0`}>
                    {item.initial ? item.initial : "•"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate">{item.sub}</p>
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
      </AnimatePresence>
    </motion.div>
  );
}
