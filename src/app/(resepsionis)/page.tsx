"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, TrendingUp, Clock, ArrowUpRight, UserPlus } from "lucide-react";
import { collection, query, orderBy, onSnapshot, limit, Timestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Guest } from "@/lib/schema";
import { format, subDays, startOfDay, endOfDay, isSameDay } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";

export default function DashboardPage() {
  const [totalGuests, setTotalGuests] = useState(0);
  const [todayGuests, setTodayGuests] = useState(0);
  const [last7DaysStats, setLast7DaysStats] = useState<number[]>(new Array(7).fill(0));
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch total guests and recent guests
    const qRecent = query(collection(db, "guests"), orderBy("createdAt", "desc"), limit(4));
    const unsubscribeRecent = onSnapshot(qRecent, (snapshot) => {
      const guests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Guest[];
      setRecentGuests(guests);
    });

    // 2. Fetch all guests to calculate statistics (in a real app, you'd use a server-side aggregation or specific queries)
    // For this app, we'll fetch guests from the last 7 days to calculate the trend
    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
    const qStats = query(
      collection(db, "guests"), 
      where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo)),
      orderBy("createdAt", "desc")
    );

    const unsubscribeStats = onSnapshot(qStats, (snapshot) => {
      const guests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Guest[];
      
      // Calculate today's guests
      const today = new Date();
      const todayCount = guests.filter(g => g.createdAt && isSameDay(g.createdAt.toDate(), today)).length;
      setTodayGuests(todayCount);

      // Calculate last 7 days trend
      const stats = new Array(7).fill(0);
      for (let i = 0; i < 7; i++) {
        const date = subDays(today, 6 - i);
        stats[i] = guests.filter(g => g.createdAt && isSameDay(g.createdAt.toDate(), date)).length;
      }
      setLast7DaysStats(stats);
      setLoading(false);
    });

    // Fetch total count (simple way for small/medium collections)
    const unsubscribeTotal = onSnapshot(collection(db, "guests"), (snapshot) => {
      setTotalGuests(snapshot.size);
    });

    return () => {
      unsubscribeRecent();
      unsubscribeStats();
      unsubscribeTotal();
    };
  }, []);

  const stats = [
    {
      title: "Total Tamu",
      value: totalGuests.toLocaleString(),
      change: "Semua Waktu",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Tamu Hari Ini",
      value: todayGuests.toString(),
      change: `+${todayGuests} baru`,
      icon: UserCheck,
      color: "bg-emerald-500",
    },
    {
      title: "Statistik 7 Hari",
      value: last7DaysStats.reduce((a, b) => a + b, 0).toString(),
      change: "Minggu Ini",
      icon: TrendingUp,
      color: "bg-amber-500",
    },
  ];

  const daysLabel = Array.from({ length: 7 }).map((_, i) => {
    return format(subDays(new Date(), 6 - i), "EEE", { locale: localeId });
  });

  const maxVal = Math.max(...last7DaysStats, 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Dashboard</h1>
        <p className="text-gray-500 font-sans">Selamat datang kembali! Berikut ringkasan aktivitas tamu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
        {/* Main Chart Card - Bento Style (Large) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Statistik Tamu (7 Hari Terakhir)</p>
              <h3 className="text-4xl font-bold mt-2 text-gray-900">
                {last7DaysStats.reduce((a, b) => a + b, 0)} 
                <span className="text-lg font-normal text-emerald-600 ml-2">Tamu Datang</span>
              </h3>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          
          <div className="flex-1 mt-8 flex items-end gap-3 min-h-[200px]">
            {last7DaysStats.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex flex-col justify-end h-48">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxVal) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="w-full bg-emerald-100 rounded-t-xl group-hover:bg-emerald-500 transition-colors cursor-pointer relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {count} Tamu
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{daysLabel[i]}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-6 text-xs text-gray-400 font-medium uppercase tracking-widest border-t pt-4">
             <span>{format(subDays(new Date(), 6), "dd MMM")}</span>
             <span className="text-emerald-600 font-bold">Trend Mingguan</span>
             <span>{format(new Date(), "dd MMM")}</span>
          </div>
        </motion.div>

        {/* Metric Cards */}
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-emerald-200 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mt-4">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{loading ? "..." : stat.value}</h3>
            </div>
          </motion.div>
        ))}

        {/* Quick Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-600 rounded-3xl p-6 shadow-lg shadow-emerald-200 text-white flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-lg leading-tight">Mulai Catat<br />Tamu Baru</h4>
            <ArrowUpRight className="w-5 h-5 opacity-60" />
          </div>
          <Link href="/buku-tamu" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 font-medium">
            <UserPlus className="w-5 h-5" />
            Buku Tamu
          </Link>
        </motion.div>

        {/* Recent Activity Card - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-900">Aktivitas Terbaru</h3>
            <Link href="/buku-tamu" className="text-emerald-600 text-sm font-semibold hover:underline">Lihat Semua</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4">Nama Tamu</th>
                  <th className="pb-4">Kategori</th>
                  <th className="pb-4">Waktu</th>
                  <th className="pb-4">Institusi</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentGuests.length === 0 && !loading && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-gray-500">Belum ada tamu hari ini.</td>
                   </tr>
                )}
                {recentGuests.map((guest, i) => (
                  <tr key={guest.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">{guest.nama}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                        guest.kategori === 'Donatur' ? 'bg-blue-100 text-blue-700' :
                        guest.kategori === 'Mustahiq' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {guest.kategori}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500 font-medium">
                      {guest.createdAt ? format(guest.createdAt.toDate(), "HH:mm") : "-"}
                    </td>
                    <td className="py-4 text-sm text-gray-600">{(guest as any).institusi || "-"}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-gray-600">Selesai</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
