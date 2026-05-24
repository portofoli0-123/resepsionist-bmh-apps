"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Telepon, TeleponInput, teleponSchema } from "@/lib/schema-pesan";

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // HH:MM
}

interface TeleponFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeleponInput) => Promise<void>;
  initialData?: Telepon | null;
}

export default function TeleponForm({ isOpen, onClose, onSubmit, initialData }: TeleponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeleponInput>({
    resolver: zodResolver(teleponSchema),
    defaultValues: {
      nama: "",
      instansi: "",
      nomorTelepon: "",
      keperluan: "",
      keterangan: "",
      tanggal: getTodayDate(),
      jam: getCurrentTime(),
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nama: initialData.nama,
        instansi: initialData.instansi || "",
        nomorTelepon: initialData.nomorTelepon,
        keperluan: initialData.keperluan,
        keterangan: initialData.keterangan || "",
        tanggal: initialData.tanggal || getTodayDate(),
        jam: initialData.jam || getCurrentTime(),
      });
    } else {
      reset({
        nama: "",
        instansi: "",
        nomorTelepon: "",
        keperluan: "",
        keterangan: "",
        tanggal: getTodayDate(),
        jam: getCurrentTime(),
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmitForm = async (data: TeleponInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] w-[95vw] h-[85vh] max-h-[600px] p-0 flex flex-col overflow-hidden gap-0 rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0 bg-muted/20">
          <DialogTitle className="font-serif text-xl">
            {initialData ? "Edit Data Telepon" : "Tambah Data Telepon"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  id="tanggal"
                  {...register("tanggal")}
                  className={errors.tanggal ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jam">Jam (Opsional)</Label>
                <Input
                  type="time"
                  id="jam"
                  {...register("jam")}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Penelepon <span className="text-red-500">*</span></Label>
              <Input
                id="nama"
                placeholder="Masukkan nama penelepon..."
                {...register("nama")}
                className={errors.nama ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.nama && <p className="text-xs text-red-500">{errors.nama.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instansi">Instansi (Opsional)</Label>
              <Input
                id="instansi"
                placeholder="Masukkan nama instansi/perusahaan..."
                {...register("instansi")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomorTelepon">No. Telepon <span className="text-red-500">*</span></Label>
              <Input
                id="nomorTelepon"
                type="tel"
                placeholder="Contoh: 081234567890"
                {...register("nomorTelepon")}
                className={errors.nomorTelepon ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.nomorTelepon && <p className="text-xs text-red-500">{errors.nomorTelepon.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="keperluan">Keperluan <span className="text-red-500">*</span></Label>
              <Input
                id="keperluan"
                placeholder="Masukkan keperluan telepon..."
                {...register("keperluan")}
                className={errors.keperluan ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.keperluan && <p className="text-xs text-red-500">{errors.keperluan.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan / Pesan</Label>
              <Input
                id="keterangan"
                placeholder="Masukkan keterangan atau pesan tambahan..."
                {...register("keterangan")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border shrink-0 bg-muted/20 flex flex-row justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-lg h-10 text-xs font-medium">
              Batal
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10 text-xs font-medium" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
