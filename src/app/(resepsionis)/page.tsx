"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Phone, Mail, TrendingUp, Clock, ArrowUpRight,
  UserPlus, BookOpen, PhoneCall, FileText, X, Plus
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

export default function DashboardPage() {
  // Guest stats
  const [totalGuests, setTotalGuests] = useState(0);
  const [todayGuests, setTodayGuests] = useState(0);
  const [last7DaysStats, setLast7DaysStats] = useState<number[]>(new Array(7).fill(0));
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);

  // Telepon & Surat stats
  const [totalTelepon, setTotalTelepon] = useState(0);
  const [todayTelepon, setTodayTelepon] = useState(0);
  const [recentTelepon, setRecentTelepon] = useState<Telepon[]>([]);

  const [totalSurat, setTotalSurat] = useState(0);
  const [todaySurat, setTodaySurat] = useState(0);
  const [recentSurat, setRecentSurat] = useState<Surat[]>([]);

  const [loading, setLoading] = useState(true);

  // Quick add tamu
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = startOfDay(subDays(today, 6));

    // --- GUESTS ---
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

    // --- TELEPON ---
    const unsubTeleponTotal = onSnapshot(collection(db, "telepon"), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Telepon[];
      setTotalTelepon(snap.size);
      setTodayTelepon(all.filter(t => t.createdAt && isSameDay(t.createdAt.toDate(), today)).length);
    });

    const qRecentTelepon = query(collection(db, "telepon"), orderBy("createdAt", "desc"), limit(3));
    const unsubTeleponRecent = onSnapshot(qRecentTelepon, (snap) => {
      setRecentTelepon(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Telepon[]);
    });

    // --- SURAT ---
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
    {
      title: "Total Buku Tamu",
      total: totalGuests,
      today: todayGuests,
      icon: Users,
      color: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-700",
      href: "/buku-tamu",
    },
    {
      title: "Log Telepon",
      total: totalTelepon,
      today: todayTelepon,
      icon: PhoneCall,
      color: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-700",
      href: "/pesan-masuk/telepon",
    },
    {
      title: "Surat Masuk",
      total: totalSurat,
      today: todaySurat,
      icon: FileText,
      color: "bg-amber-500",
      light: "bg-amber-50",
      text: "text-amber-700",
      href: "/pesan-masuk/surat",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 font-serif">Dashboard</h1>
          <p className="text-gray-500 font-sans">Selamat datang kembali! Berikut ringkasan aktivitas hari ini.</p>
        </div>
        <button
          onClick={() => setIsAddGuestOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200 w-full sm:w-auto justify-center"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Tamu Baru
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={s.href} className="block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${s.color} p-3 rounded-xl text-white`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-sm font-medium text-gray-500">{s.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? "..." : s.total.toLocaleString()}</p>
              <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${s.text} ${s.light} px-2.5 py-1 rounded-full`}>
                <Clock className="w-3 h-3" />
                {s.today} hari ini
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tren Tamu 7 Hari</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {last7DaysStats.reduce((a, b) => a + b, 0)}
                <span className="text-base font-normal text-emerald-600 ml-2">Tamu</span>
              </p>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {last7DaysStats.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full relative flex flex-col justify-end h-32">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxVal) * 100}%` }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="w-full bg-emerald-100 rounded-t-lg group-hover:bg-emerald-500 transition-colors cursor-pointer relative min-h-[4px]"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {count} tamu
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{daysLabel[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 border-t pt-3">
            <span>{format(subDays(new Date(), 6), "dd MMM")}</span>
            <span className="text-emerald-600 font-semibold">Trend Mingguan</span>
            <span>{format(new Date(), "dd MMM")}</span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3"
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Akses Cepat</p>

          <button
            onClick={() => setIsAddGuestOpen(true)}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors w-full text-left"
          >
            <div className="bg-white/20 p-2 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Tambah Tamu Baru</p>
              <p className="text-xs text-emerald-100">Catat kunjungan sekarang</p>
            </div>
          </button>

          <Link
            href="/buku-tamu"
            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-100 border border-gray-100 transition-colors w-full text-left group"
          >
            <div className="bg-emerald-100 p-2 rounded-lg">
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800 group-hover:text-emerald-700">Buku Tamu</p>
              <p className="text-xs text-gray-400">{totalGuests} data tamu</p>
            </div>
          </Link>

          <Link
            href="/pesan-masuk/telepon"
            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-100 border border-gray-100 transition-colors w-full text-left group"
          >
            <div className="bg-blue-100 p-2 rounded-lg">
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-700">Log Telepon</p>
              <p className="text-xs text-gray-400">{totalTelepon} data telepon</p>
            </div>
          </Link>

          <Link
            href="/pesan-masuk/surat"
            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-amber-50 hover:border-amber-100 border border-gray-100 transition-colors w-full text-left group"
          >
            <div className="bg-amber-100 p-2 rounded-lg">
              <Mail className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800 group-hover:text-amber-700">Surat Masuk</p>
              <p className="text-xs text-gray-400">{totalSurat} data surat</p>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Guests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Tamu Terbaru
            </h3>
            <Link href="/buku-tamu" className="text-xs text-emerald-600 font-semibold hover:underline">Lihat semua</Link>
          </div>
          <div className="space-y-3">
            {recentGuests.length === 0 && !loading && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada data.</p>
            )}
            {recentGuests.map(g => (
              <div key={g.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                  {g.nama?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{g.nama}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {g.kategori} · {g.createdAt ? format(g.createdAt.toDate(), "HH:mm", { locale: localeId }) : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Telepon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Telepon Terbaru
            </h3>
            <Link href="/pesan-masuk/telepon" className="text-xs text-blue-600 font-semibold hover:underline">Lihat semua</Link>
          </div>
          <div className="space-y-3">
            {recentTelepon.length === 0 && !loading && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada data.</p>
            )}
            {recentTelepon.map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{t.nama || "-"}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {t.nomorTelepon} · {t.keperluan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Surat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              Surat Terbaru
            </h3>
            <Link href="/pesan-masuk/surat" className="text-xs text-amber-600 font-semibold hover:underline">Lihat semua</Link>
          </div>
          <div className="space-y-3">
            {recentSurat.length === 0 && !loading && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada data.</p>
            )}
            {recentSurat.map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.jenisDokumen || "-"}</p>
                  <p className="text-xs text-gray-400 truncate">
                    Dari: {s.namaPengirim} → {s.ditujukanKepada}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Add Guest Modal */}
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
    </div>
  );
}
