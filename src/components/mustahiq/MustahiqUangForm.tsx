"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MustahiqUang, mustahiqUangSchema } from "@/lib/schema";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

/**
 * Formats a date to a localized Indonesian date string.
 */
function formatTanggal(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface MustahiqUangFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: MustahiqUang | null;
}

export default function MustahiqUangForm({ isOpen, onClose, onSubmit, initialData }: MustahiqUangFormProps) {
  const [isCheckingNik, setIsCheckingNik] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mustahiqUangSchema),
    defaultValues: {
      nama: "",
      nik: "",
      alamat: "",
      nominal: 0,
      tanggal: getTodayDate(),
      jam: getCurrentTime(),
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nama: initialData.nama,
        nik: initialData.nik,
        alamat: initialData.alamat,
        nominal: initialData.nominal,
        tanggal: initialData.tanggal || getTodayDate(),
        jam: initialData.jam || getCurrentTime(),
      });
    } else {
      reset({
        nama: "",
        nik: "",
        alamat: "",
        nominal: 0,
        tanggal: getTodayDate(),
        jam: getCurrentTime(),
      });
    }
  }, [initialData, reset]);

  /**
   * Validates the NIK against Firestore distribution history.
   * Returns true if the NIK is allowed (no transaction in the last 30 days),
   * or false if a recent transaction exists (within 30 days).
   */
  async function validateNikCooldown(nik: string): Promise<boolean> {
    const q = query(
      collection(db, "mustahiq-uang"),
      where("nik", "==", nik),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    // No history found — NIK is clear
    if (snapshot.empty) {
      return true;
    }

    const lastDoc = snapshot.docs[0];
    const lastData = lastDoc.data();

    // When editing the same record, skip cooldown check
    if (initialData && lastDoc.id === initialData.id) {
      return true;
    }

    // Determine the last received date
    let lastDate: Date;
    if (lastData.createdAt?.toDate) {
      lastDate = lastData.createdAt.toDate();
    } else if (lastData.tanggal) {
      lastDate = new Date(lastData.tanggal);
    } else {
      // Cannot determine date — allow save
      return true;
    }

    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 30) {
      toast.error(
        `Gagal: NIK ini sudah menerima bantuan pada ${formatTanggal(lastDate)}. Silakan tunggu hingga bulan (30 hari) berikutnya.`,
        { duration: 6000 }
      );
      return false;
    }

    return true;
  }

  /**
   * Handles form submission with NIK cooldown validation.
   */
  const handleFormSubmit = async (formData: any) => {
    setIsCheckingNik(true);

    try {
      // Run NIK cooldown check before saving
      const isAllowed = await validateNikCooldown(formData.nik);

      if (!isAllowed) {
        return; // Abort — toast already displayed
      }

      // NIK is valid — proceed with save
      await onSubmit(formData);
      toast.success(
        initialData ? "Data berhasil diperbarui!" : "Data berhasil disimpan!",
        { duration: 3000 }
      );
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.", {
        duration: 5000,
      });
    } finally {
      setIsCheckingNik(false);
    }
  };

  const isBusy = isSubmitting || isCheckingNik;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{initialData ? "Edit Data Mustahiq" : "Input Penerima Uang"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                id="tanggal"
                {...register("tanggal")}
                className={errors.tanggal ? "border-red-500" : ""}
                disabled={isBusy}
              />
              {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jam">Jam</Label>
              <Input
                type="time"
                id="jam"
                {...register("jam")}
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama">Nama Mustahiq <span className="text-red-500">*</span></Label>
            <Input
              id="nama"
              placeholder="Masukkan nama mustahiq..."
              {...register("nama")}
              className={errors.nama ? "border-red-500" : ""}
              disabled={isBusy}
            />
            {errors.nama && <p className="text-xs text-red-500">{errors.nama.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nik">NIK <span className="text-red-500">*</span></Label>
            <Input
              id="nik"
              placeholder="16 digit NIK..."
              {...register("nik")}
              className={errors.nik ? "border-red-500" : ""}
              disabled={isBusy}
            />
            {errors.nik && <p className="text-xs text-red-500">{errors.nik.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat <span className="text-red-500">*</span></Label>
            <Textarea
              id="alamat"
              placeholder="Masukkan alamat lengkap..."
              {...register("alamat")}
              className={errors.alamat ? "border-red-500" : ""}
              disabled={isBusy}
            />
            {errors.alamat && <p className="text-xs text-red-500">{errors.alamat.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nominal">Nominal (Rp) <span className="text-red-500">*</span></Label>
            <Input
              id="nominal"
              type="number"
              placeholder="Contoh: 100000"
              {...register("nominal")}
              className={errors.nominal ? "border-red-500" : ""}
              disabled={isBusy}
            />
            {errors.nominal && <p className="text-xs text-red-500">{errors.nominal.message as string}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
              Batal
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isBusy}>
              {isBusy ? "Memverifikasi..." : initialData ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
