"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amilKeluarSchema } from "@/lib/schema";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

export default function AmilKeluarGoogleForm() {
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
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f0ebf8] flex flex-col items-center py-6 sm:py-12 px-4">
        <div className="w-full max-w-[770px] space-y-3">
          {/* Header Strip */}
          <div className="h-[10px] w-full bg-[#673ab7] rounded-t-lg" />
          
          <div className="bg-white rounded-b-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] p-6 sm:p-8">
            <h1 className="text-3xl font-medium text-black mb-4">Log Keberangkatan Amil</h1>
            <p className="text-sm text-gray-700 mb-6">Tanggapan Anda telah dicatat.</p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="text-[#1a73e8] text-sm hover:underline font-medium"
            >
              Kirim tanggapan lain
            </button>
          </div>
          
          <div className="text-center pt-6">
            <p className="text-[12px] text-gray-500">Formulir ini dibuat di dalam Laznas BMH.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0ebf8] flex flex-col items-center py-6 sm:py-12 px-4 font-sans">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[770px] space-y-3">
        
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden border-t-[10px] border-[#673ab7]">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-medium text-black mb-2">Log Keberangkatan Amil</h1>
            <p className="text-sm text-gray-700 mb-6">Silakan isi data keberangkatan Amil di bawah ini dengan lengkap.</p>
            <hr className="mb-4" />
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <span>*</span>
              <span>Menunjukkan pertanyaan yang wajib diisi</span>
            </div>
          </div>
        </div>

        {/* Tanggal Card */}
        <div className={`bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-6 sm:p-8 border-l-[6px] ${errors.tanggal ? 'border-red-600' : 'border-transparent'}`}>
          <div className="mb-6">
            <label className="text-base text-black mb-2 block">
              Tanggal Keberangkatan <span className="text-red-600">*</span>
            </label>
            <div className="max-w-[200px]">
              <Input
                type="date"
                {...register("tanggal")}
                className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#673ab7] focus-visible:border-b-2 transition-all bg-transparent"
              />
            </div>
          </div>
          {errors.tanggal && (
            <div className="flex items-center gap-2 text-red-600 text-[12px] mt-2">
              <span className="font-bold">!</span>
              <span>Pertanyaan ini wajib diisi</span>
            </div>
          )}
        </div>

        {/* Jam Card */}
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-6 sm:p-8 border-l-[6px] border-transparent">
          <div className="mb-6">
            <label className="text-base text-black mb-2 block">
              Jam Keluar
            </label>
            <div className="max-w-[150px]">
              <Input
                type="time"
                {...register("jam")}
                className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#673ab7] focus-visible:border-b-2 transition-all bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Nama Card */}
        <div className={`bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-6 sm:p-8 border-l-[6px] ${errors.nama ? 'border-red-600' : 'border-transparent'}`}>
          <div className="mb-2">
            <label className="text-base text-black mb-4 block">
              Nama Lengkap Amil <span className="text-red-600">*</span>
            </label>
            <div className="max-w-full sm:max-w-[50%]">
              <Input
                placeholder="Jawaban Anda"
                {...register("nama")}
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10 focus-visible:ring-0 focus-visible:border-[#673ab7] focus-visible:border-b-2 transition-all bg-transparent placeholder:text-gray-400"
              />
            </div>
          </div>
          {errors.nama && (
            <div className="flex items-center gap-2 text-red-600 text-[12px] mt-4">
              <span className="font-bold">!</span>
              <span>Pertanyaan ini wajib diisi</span>
            </div>
          )}
        </div>

        {/* Keperluan Card */}
        <div className={`bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-6 sm:p-8 border-l-[6px] ${errors.keperluan ? 'border-red-600' : 'border-transparent'}`}>
          <div className="mb-2">
            <label className="text-base text-black mb-4 block">
              Keperluan / Tujuan Keberangkatan <span className="text-red-600">*</span>
            </label>
            <div className="max-w-full">
              <Input
                placeholder="Jawaban Anda"
                {...register("keperluan")}
                className="border-0 border-b border-gray-300 rounded-none px-0 h-10 focus-visible:ring-0 focus-visible:border-[#673ab7] focus-visible:border-b-2 transition-all bg-transparent placeholder:text-gray-400"
              />
            </div>
          </div>
          {errors.keperluan && (
            <div className="flex items-center gap-2 text-red-600 text-[12px] mt-4">
              <span className="font-bold">!</span>
              <span>Pertanyaan ini wajib diisi</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-4 border-l-[6px] border-red-600">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#673ab7] hover:bg-[#5e35b1] text-white font-medium px-6 h-10 rounded shadow-sm w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Mengirim...
              </>
            ) : (
              "Kirim"
            )}
          </Button>
          
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="h-[10px] w-full max-w-[150px] bg-[#673ab7] rounded-full hidden sm:block opacity-20" />
            <span className="text-[12px] text-gray-500">Halaman 1 dari 1</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 space-y-4">
          <p className="text-[12px] text-gray-600">Konten ini tidak dibuat atau didukung oleh Google.</p>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[22px] font-medium text-[#70757a]">BMH Forms</span>
          </div>
        </div>

      </form>
    </div>
  );
}
