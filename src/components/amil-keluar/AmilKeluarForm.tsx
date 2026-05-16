"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AmilKeluar, amilKeluarSchema } from "@/lib/schema";
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

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // HH:MM
}

interface AmilKeluarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: AmilKeluar | null;
}

export default function AmilKeluarForm({ isOpen, onClose, onSubmit, initialData }: AmilKeluarFormProps) {
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

  useEffect(() => {
    if (initialData) {
      reset({
        nama: initialData.nama,
        keperluan: initialData.keperluan,
        tanggal: (initialData as any).tanggal || getTodayDate(),
        jam: (initialData as any).jam || getCurrentTime(),
      });
    } else {
      reset({
        nama: "",
        keperluan: "",
        tanggal: getTodayDate(),
        jam: getCurrentTime(),
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{initialData ? "Edit Data Amil Keluar" : "Tambah Amil Keluar"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                id="tanggal"
                {...register("tanggal")}
                className={errors.tanggal ? "border-red-500" : ""}
              />
              {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jam">Jam (Otomatis)</Label>
              <Input
                type="time"
                id="jam"
                {...register("jam")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama">Nama Amil <span className="text-red-500">*</span></Label>
            <Input
              id="nama"
              placeholder="Masukkan nama amil..."
              {...register("nama")}
              className={errors.nama ? "border-red-500" : ""}
            />
            {errors.nama && <p className="text-xs text-red-500">{errors.nama.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keperluan">Keperluan <span className="text-red-500">*</span></Label>
            <Input
              id="keperluan"
              placeholder="Contoh: Setor tunai, Survey, dll..."
              {...register("keperluan")}
              className={errors.keperluan ? "border-red-500" : ""}
            />
            {errors.keperluan && <p className="text-xs text-red-500">{errors.keperluan.message as string}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
