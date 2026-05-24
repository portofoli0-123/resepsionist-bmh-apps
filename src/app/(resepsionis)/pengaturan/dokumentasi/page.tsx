"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Mail, 
  Settings, 
  CheckCircle, 
  ShieldAlert, 
  Database, 
  FileText, 
  ChevronRight, 
  Clock, 
  Code,
  LayoutDashboard,
  HelpCircle,
  Sparkles,
  PhoneCall,
  FileSpreadsheet,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "fitur" | "validasi" | "database";

export default function DokumentasiPage() {
  const [activeTab, setActiveTab] = useState<TabId>("fitur");

  const tabs = [
    { id: "fitur" as TabId, label: "Panduan Fitur", icon: BookOpen },
    { id: "validasi" as TabId, label: "Logika Validasi", icon: ShieldAlert },
    { id: "database" as TabId, label: "Struktur Database", icon: Database },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-8 rounded-2xl shadow-lg border border-emerald-900">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Panduan Pengguna &amp; Teknis
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif">Dokumentasi Website</h1>
            <p className="text-emerald-100/80 max-w-2xl text-sm md:text-base font-sans">
              Panduan lengkap operasional frontliner (resepsionis) dan penjelasan logika teknis sistem database BMH Apps.
            </p>
          </div>
          <HelpCircle className="w-16 h-16 text-emerald-600/40 hidden md:block shrink-0" />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 border-b-2 relative",
                isActive 
                  ? "text-emerald-700 dark:text-emerald-400 border-emerald-600 dark:border-emerald-500 font-semibold bg-emerald-50/50 dark:bg-emerald-950/20" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500" 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "fitur" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 font-serif mb-2">
                    Panduan Penggunaan Fitur Utama
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Kenali enam menu utama pada sidebar aplikasi untuk mencatat dan memantau seluruh aktivitas operasional harian.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dashboard */}
                  <div className="p-5 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-muted/20 flex gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg h-fit">
                      <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-foreground">A. Dashboard</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Menyediakan ringkasan operasional real-time harian. Menampilkan total tamu hari ini, staf amil dinas luar, pesan/surat/paket masuk, serta total mustahiq dibantu. Dilengkapi visualisasi grafik tren bulanan.
                      </p>
                    </div>
                  </div>

                  {/* Buku Tamu */}
                  <div className="p-5 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-muted/20 flex gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg h-fit">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-foreground">B. Buku Tamu (Guest Book)</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Mencatat kunjungan eksternal (Donatur, Mustahiq, Mitra). Mendukung kolom nama, kategori, keperluan, tanggal, dan jam masuk. Anda dapat memfilter tanggal, mencari tamu, dan mengekspor laporan ke Excel/PDF.
                      </p>
                    </div>
                  </div>

                  {/* Amil Keluar */}
                  <div className="p-5 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-muted/20 flex gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg h-fit">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-foreground">C. Amil Keluar</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Mencatat staf amil yang bertugas ke luar kantor demi keperluan dinas atau pribadi. Memungkinkan pencatatan jam keluar, estimasi jam kembali, serta ekspor file rekap dinas amil.
                      </p>
                    </div>
                  </div>

                  {/* Pesan Masuk */}
                  <div className="p-5 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-muted/20 flex gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg h-fit">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-foreground">D. Pesan Masuk</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        Pencatatan korespondensi dan logistik masuk yang terbagi ke dalam 3 sub-fitur khusus:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-semibold"><PhoneCall className="w-2.5 h-2.5" /> Telepon</span>
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-semibold"><FileSpreadsheet className="w-2.5 h-2.5" /> Surat</span>
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-semibold"><Package className="w-2.5 h-2.5" /> Paket</span>
                      </div>
                    </div>
                  </div>

                  {/* Kelola Mustahiq */}
                  <div className="p-5 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-muted/20 flex gap-4 md:col-span-2">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg h-fit">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-base text-foreground">E. Kelola Mustahiq</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Mengelola pemberian bantuan langsung tunai kepada mustahiq. Menampung data NIK, nominal bantuan, alamat, dan tanggal pencairan.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-background p-3 rounded-lg border border-border text-xs">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">🛡️ Anti-Double Payout</span>
                          Mengecek NIK secara real-time. Memblokir pengisian dana jika mustahiq tersebut pernah menerima bantuan kurang dari 30 hari yang lalu.
                        </div>
                        <div className="bg-background p-3 rounded-lg border border-border text-xs">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">🔢 Rows per Page Dropdown</span>
                          Pengaturan tampilan data di pojok kiri bawah tabel dengan pilihan: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">10</code>, <code className="font-mono bg-muted px-1.5 py-0.5 rounded">25</code>, <code className="font-mono bg-muted px-1.5 py-0.5 rounded">50</code>, <code className="font-mono bg-muted px-1.5 py-0.5 rounded">100</code>, dan <code className="font-mono bg-muted px-1.5 py-0.5 rounded">All</code>.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pengaturan */}
                  <div className="p-5 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-muted/20 flex gap-4 md:col-span-2">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg h-fit">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-foreground">F. Pengaturan</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Mengakses modul administratif tambahan seperti <strong>Pengaturan Umum</strong> (konfigurasi dasar web), <strong>Dokumentasi Website</strong> (halaman panduan interaktif yang sedang Anda baca), dan <strong>Lainnya</strong> (fitur opsional pendukung sistem).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "validasi" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 font-serif mb-2">
                    Logika Sistem Validasi NIK Cooldown
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Penjelasan mendalam tentang sistem keamanan penginputan dana untuk menghindari terjadinya pencairan berulang (double payout).
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cooldown Concept */}
                  <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-muted/10 space-y-4">
                    <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600" /> Konsep Jeda Waktu (Cooldown)
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sistem website tidak akan memblokir data NIK atau nama mustahiq secara permanen. Web hanya memberlakukan sistem <strong>cooldown / jeda waktu 30 hari</strong> terhitung secara dinamis dari tanggal penyaluran bantuan tunai terakhir.
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Langkah pengamanan ini dipasang di level input formulir (UI client-side validation dan controller). Jika sistem menemukan kecocokan NIK yang tanggal pencairan terakhirnya masih berada di dalam selang jeda 30 hari, tombol submit akan memblokir data agar tidak tersimpan ke dalam database.
                    </p>

                    <div className="p-4 rounded-xl bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 text-xs space-y-2">
                      <span className="font-bold text-destructive flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> Contoh Alert Kegagalan Validasi:
                      </span>
                      <p className="text-muted-foreground font-sans">
                        Ketika petugas resepsionis berusaha menyimpan NIK penerima bantuan yang masih berada dalam masa jeda, sistem menampilkan dialog peringatan:
                      </p>
                      <div className="bg-background text-destructive border border-destructive/30 px-3 py-2 rounded font-mono font-bold w-fit mt-1">
                        Gagal: Mustahiq dengan NIK ini sudah menerima bantuan pada 24 Mei 2026.
                      </div>
                    </div>
                  </div>

                  {/* Validation Benefits */}
                  <div className="p-6 rounded-2xl border border-border bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
                    <h3 className="font-bold text-base text-emerald-800 dark:text-emerald-400">
                      Keunggulan Logika Validasi
                    </h3>
                    <ul className="space-y-3.5">
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Proteksi Akurat:</strong> Mencegah mustahiq mencairkan bantuan ganda di kantor pelayanan terdekat pada periode yang berdekatan.</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Integritas Audit:</strong> Memastikan pencatatan laporan kas bantuan benar-benar teratur dan tidak memiliki rekap duplikasi tak valid.</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Adil &amp; Merata:</strong> Menjamin penyaluran dana zakat, infaq, dan sedekah terdistribusi secara luas untuk seluruh masyarakat penerima bantuan.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "database" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 font-serif mb-2">
                    Struktur Database &amp; Alur Teknis
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Penjelasan skema penyimpanan Firestore dan bagaimana logika filter backend dieksekusi secara asinkron.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Database Schema */}
                  <div className="p-5 rounded-2xl border border-border bg-background space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Code className="w-4 h-4 text-emerald-600" /> Skema Transaksi Histori (Firestore)
                      </h3>
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground font-semibold">mustahiq-uang</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sistem database **tidak memberlakukan unique constraint** pada kolom NIK di level Firestore. Pengguna (Mustahiq) harus dapat diinput berulang kali agar lembaga memiliki histori riwayat pencairan dari bulan ke bulan.
                    </p>

                    <div className="bg-muted p-4 rounded-xl font-mono text-xs overflow-x-auto text-foreground border border-border">
                      <pre>{`{
  id: "mustahiq_doc_12345",
  nama: "Adam",
  nik: "3273240897550001",
  alamat: "Jl. Soekarno Hatta No. 45, Bandung",
  nominal: 500000,
  tanggal: "2026-05-24", // format tanggal
  jam: "14:30",
  createdAt: Timestamp // Firestore Server Timestamp
}`}</pre>
                    </div>
                  </div>

                  {/* Backend Validation logic */}
                  <div className="p-5 rounded-2xl border border-border bg-background space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Settings className="w-4 h-4 text-emerald-600" /> Alur Logika Penyimpanan Asinkron
                      </h3>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-semibold">Next.js + Firebase SDK</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Saat tombol **Simpan Data** diklik, web akan memanggil fungsi validasi di client/server sebelum memicu penambahan dokumen (`addDoc`):
                    </p>

                    <div className="relative pl-6 space-y-4 text-xs text-muted-foreground border-l-2 border-emerald-500/20 ml-2">
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                        <strong>Query Transaksi NIK:</strong> Query Firestore mencari data pada koleksi `mustahiq-uang` dengan mencocokkan `nik === inputNIK` dan diurutkan `orderBy("createdAt", "desc")`.
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                        <strong>Ambil Transaksi Terakhir:</strong> Jika data ditemukan, ambil data teratas (transaksi paling baru/terakhir yang diterima mustahiq tersebut).
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                        <strong>Kalkulasi Jeda Waktu:</strong> Bandingkan `tanggal` hari ini dengan `tanggal` bantuan terakhir. Hitung selisih waktu dalam hari.
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[31px] top-0 w-4.5 h-4.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold">4</span>
                        <strong>Ambil Tindakan Simpan/Batal:</strong> Jika selisih kurang dari 30 hari, batalkan proses penyimpanan dan lemparkan status error. Jika lolos, eksekusi penyimpanan dokumen baru.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
