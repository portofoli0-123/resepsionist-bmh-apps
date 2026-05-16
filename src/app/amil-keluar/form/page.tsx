"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amilKeluarSchema } from "@/lib/schema";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Calendar, User, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

export default function AmilKeluarFormPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(amilKeluarSchema),
    defaultValues: {
      nama: "",
      keperluan: "",
      tanggal: getTodayDate(),
      jam: getCurrentTime(),
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      await addDoc(collection(db, "amil-keluar"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      reset();
      // Auto-reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] relative z-10"
      >
        {/* Logo/Header Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-200">
              <span className="font-bold text-xl tracking-tight">BMH</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200" />
            <h1 className="text-2xl font-bold text-gray-900 font-serif italic">Log Amil</h1>
          </div>
          <p className="text-gray-500 font-medium">Formulir Keberangkatan Amil</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 rounded-[24px] sm:rounded-[32px] overflow-hidden">
          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tanggal" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tanggal</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <Input
                          type="date"
                          id="tanggal"
                          {...register("tanggal")}
                          className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        />
                      </div>
                      {errors.tanggal && <p className="text-xs text-red-500 mt-1">{errors.tanggal.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jam" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Jam Keluar</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <Input
                          type="time"
                          id="jam"
                          {...register("jam")}
                          className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <Input
                        id="nama"
                        placeholder="Siapa yang berangkat?"
                        {...register("nama")}
                        className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keperluan" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Keperluan</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <Input
                        id="keperluan"
                        placeholder="Tujuan keberangkatan..."
                        {...register("keperluan")}
                        className="pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    {errors.keperluan && <p className="text-xs text-red-500 mt-1">{errors.keperluan.message as string}</p>}
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl shadow-xl shadow-emerald-200/50 font-bold text-base transition-all active:scale-[0.98] group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Kirim Laporan
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 sm:py-12 flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"
                    >
                      <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-400 rounded-full -z-10"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-serif">Berhasil Terkirim!</h2>
                  <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-[280px]">
                    Laporan keberangkatan Amil telah berhasil dicatat ke sistem.
                  </p>
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold"
                  >
                    Isi Lagi
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-sm text-gray-400 font-medium">
          © {new Date().getFullYear()} Laznas BMH - Frontdesk Log System
        </p>
      </motion.div>
    </div>
  );
}
