"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MustahiqUang, mustahiqUangSchema } from "@/lib/schema";
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

interface MustahiqUangFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: MustahiqUang | null;
}

export default function MustahiqUangForm({ isOpen, onClose, onSubmit, initialData }: MustahiqUangFormProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{initialData ? "Edit Data Mustahiq" : "Input Penerima Uang"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
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
              <Label htmlFor="jam">Jam</Label>
              <Input
                type="time"
                id="jam"
                {...register("jam")}
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
            />
            {errors.nominal && <p className="text-xs text-red-500">{errors.nominal.message as string}</p>}
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
