"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, TrendingUp, Clock, ArrowUpRight, Calendar, UserPlus } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Tamu",
      value: "1,284",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Tamu Hari Ini",
      value: "42",
      change: "+5%",
      icon: UserCheck,
      color: "bg-emerald-500",
    },
    {
      title: "Rata-rata Durasi",
      value: "15m",
      change: "-2%",
      icon: Clock,
      color: "bg-amber-500",
    },
  ];

  const recentGuests = [
    { name: "Ahmad Subarjo", category: "Donatur", time: "10:30", status: "Selesai" },
    { name: "Siti Aminah", category: "Mustahiq", time: "11:15", status: "Menunggu" },
    { name: "Budi Santoso", category: "Kunjungan", time: "11:45", status: "Selesai" },
    { name: "Rina Wijaya", category: "Donatur", time: "12:00", status: "Sedang Berlangsung" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Dashboard</h1>
        <p className="text-gray-500 font-sans">Selamat datang kembali! Berikut ringkasan aktivitas hari ini.</p>
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
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Statistik Tamu Datang</p>
              <h3 className="text-4xl font-bold mt-2 text-gray-900">856 <span className="text-lg font-normal text-emerald-600">+24%</span></h3>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          
          <div className="flex-1 mt-8 flex items-end gap-2">
            {[40, 60, 45, 90, 65, 80, 55, 70, 85, 50, 75, 95].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex-1 bg-emerald-100 rounded-t-lg hover:bg-emerald-500 transition-colors cursor-pointer"
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium uppercase tracking-tighter">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
            <span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span>
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
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
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
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 font-medium">
            <UserPlus className="w-5 h-5" />
            Buku Tamu
          </button>
        </motion.div>

        {/* Recent Activity Card - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-900">Aktivitas Terbaru</h3>
            <button className="text-emerald-600 text-sm font-semibold hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4">Nama Tamu</th>
                  <th className="pb-4">Kategori</th>
                  <th className="pb-4">Waktu</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentGuests.map((guest, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">{guest.name}</td>
                    <td className="py-4">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                        {guest.category}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500 font-medium">{guest.time}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${guest.status === 'Selesai' ? 'bg-emerald-500' : guest.status === 'Menunggu' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <span className="text-xs font-semibold text-gray-600">{guest.status}</span>
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
