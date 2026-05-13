"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Guest, guestSchema, CATEGORIES } from "@/lib/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // HH:MM
}

interface GuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: Guest | null;
}

export default function GuestForm({ isOpen, onClose, onSubmit, initialData }: GuestFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      nama: "",
      whatsapp: "",
      kategori: "" as any,
      keperluan: "",
      institusi: "",
      tanggal: getTodayDate(),
      jam: getCurrentTime(),
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nama: initialData.nama,
        whatsapp: (initialData as any).whatsapp || "",
        kategori: initialData.kategori,
        keperluan: initialData.keperluan || "",
        institusi: (initialData as any).institusi || "",
        tanggal: (initialData as any).tanggal || getTodayDate(),
        jam: (initialData as any).jam || getCurrentTime(),
      });
    } else {
      reset({
        nama: "",
        whatsapp: "",
        kategori: "" as any,
        keperluan: "",
        institusi: "",
        tanggal: getTodayDate(),
        jam: getCurrentTime(),
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: any) => {
    onSubmit(data);
  };

  const currentCategory = watch("kategori");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{initialData ? "Edit Data Tamu" : "Tambah Tamu Baru"}</DialogTitle>
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
              <Label htmlFor="jam">Jam (Opsional)</Label>
              <Input
                type="time"
                id="jam"
                {...register("jam")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap <span className="text-red-500">*</span></Label>
            <Input
              id="nama"
              placeholder="Masukkan nama pengunjung..."
              {...register("nama")}
              className={errors.nama ? "border-red-500" : ""}
            />
            {errors.nama && <p className="text-xs text-red-500">{errors.nama.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">No. WhatsApp (Opsional)</Label>
            <Input
              id="whatsapp"
              placeholder="Contoh: 08123456789"
              {...register("whatsapp")}
              className={errors.whatsapp ? "border-red-500" : ""}
            />
            {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori <span className="text-red-500">*</span></Label>
            <Select
              value={currentCategory}
              onValueChange={(value) => setValue("kategori", value as any, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.kategori ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kategori && <p className="text-xs text-red-500">{errors.kategori.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keperluan">Keperluan (Opsional)</Label>
            <Input
              id="keperluan"
              placeholder="Contoh: Silaturahmi, Donasi, dll..."
              {...register("keperluan")}
              className={errors.keperluan ? "border-red-500" : ""}
            />
            {errors.keperluan && <p className="text-xs text-red-500">{errors.keperluan.message as string}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institusi">Institusi / Lembaga (Opsional)</Label>
            <Input
              id="institusi"
              placeholder="Contoh: PT. Maju Jaya, Sekolah ABC, dll..."
              {...register("institusi")}
              className={errors.institusi ? "border-red-500" : ""}
            />
            {errors.institusi && <p className="text-xs text-red-500">{errors.institusi.message as string}</p>}
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
