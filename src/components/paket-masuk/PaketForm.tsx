"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paket, paketSchema } from "@/lib/schema-pesan";
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
  return now.toISOString().split("T")[0];
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

interface PaketFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: Paket | null;
}

export default function PaketForm({ isOpen, onClose, onSubmit, initialData }: PaketFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paketSchema),
    defaultValues: {
      namaPenerima: "",
      ekspedisi: "",
      namaPengirim: "",
      noResi: "",
      keterangan: "",
      tanggal: getTodayDate(),
      jam: getCurrentTime(),
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        namaPenerima: initialData.namaPenerima,
        ekspedisi: initialData.ekspedisi,
        namaPengirim: initialData.namaPengirim || "",
        noResi: initialData.noResi || "",
        keterangan: initialData.keterangan || "",
        tanggal: initialData.tanggal || getTodayDate(),
        jam: initialData.jam || getCurrentTime(),
      });
    } else {
      reset({
        namaPenerima: "",
        ekspedisi: "",
        namaPengirim: "",
        noResi: "",
        keterangan: "",
        tanggal: getTodayDate(),
        jam: getCurrentTime(),
      });
    }
  }, [initialData, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] w-[95vw] h-[85vh] max-h-[600px] p-0 flex flex-col overflow-hidden gap-0 rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0 bg-muted/20">
          <DialogTitle className="font-serif text-xl">{initialData ? "Edit Data Paket" : "Tambah Paket Masuk"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
              <Label htmlFor="namaPenerima">Nama Penerima <span className="text-red-500">*</span></Label>
              <Input
                id="namaPenerima"
                placeholder="Masukkan nama penerima..."
                {...register("namaPenerima")}
                className={errors.namaPenerima ? "border-red-500" : ""}
              />
              {errors.namaPenerima && <p className="text-xs text-red-500">{errors.namaPenerima.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ekspedisi">Kurir / Ekspedisi <span className="text-red-500">*</span></Label>
              <Input
                id="ekspedisi"
                placeholder="Contoh: JNE, J&T, Sicepat, dll..."
                {...register("ekspedisi")}
                className={errors.ekspedisi ? "border-red-500" : ""}
              />
              {errors.ekspedisi && <p className="text-xs text-red-500">{errors.ekspedisi.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="namaPengirim">Nama Pengirim (Opsional)</Label>
              <Input
                id="namaPengirim"
                placeholder="Masukkan nama pengirim..."
                {...register("namaPengirim")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="noResi">No. Resi (Opsional)</Label>
              <Input
                id="noResi"
                placeholder="Masukkan nomor resi..."
                {...register("noResi")}
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border shrink-0 bg-muted/20 flex flex-row justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-10 text-xs font-medium">
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
