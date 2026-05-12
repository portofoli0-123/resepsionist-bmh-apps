"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Surat, SuratInput, suratSchema } from "@/lib/schema-pesan";

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // HH:MM
}

interface SuratFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SuratInput) => Promise<void>;
  initialData?: Surat | null;
}

export default function SuratForm({ isOpen, onClose, onSubmit, initialData }: SuratFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuratInput>({
    resolver: zodResolver(suratSchema),
    defaultValues: {
      jenisDokumen: initialData?.jenisDokumen || "",
      kodeDokumen: initialData?.kodeDokumen || "",
      namaPengirim: initialData?.namaPengirim || "",
      ditujukanKepada: initialData?.ditujukanKepada || "",
      tanggalMasuk: initialData?.tanggalMasuk || "",
      diserahkanKepada: initialData?.diserahkanKepada || "",
      tanggalDiserahkan: initialData?.tanggalDiserahkan || "",
      tanggal: initialData?.tanggal || getTodayDate(),
      jam: initialData?.jam || getCurrentTime(),
    },
  });

  const onSubmitForm = async (data: SuratInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-emerald-800">
            {initialData ? "Edit Data Surat" : "Tambah Data Surat"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input type="date" id="tanggal" {...register("tanggal")} className={errors.tanggal ? "border-red-500" : ""} />
              {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jam">Jam (Opsional)</Label>
              <Input type="time" id="jam" {...register("jam")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenisDokumen">Jenis Dokumen</Label>
            <Input id="jenisDokumen" {...register("jenisDokumen")} className={errors.jenisDokumen ? "border-red-500" : ""} />
            {errors.jenisDokumen && <p className="text-xs text-red-500">{errors.jenisDokumen.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kodeDokumen">Kode Dokumen (Opsional)</Label>
            <Input id="kodeDokumen" {...register("kodeDokumen")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="namaPengirim">Nama Pengirim</Label>
            <Input id="namaPengirim" {...register("namaPengirim")} className={errors.namaPengirim ? "border-red-500" : ""} />
            {errors.namaPengirim && <p className="text-xs text-red-500">{errors.namaPengirim.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ditujukanKepada">Ditujukan Kepada</Label>
            <Input id="ditujukanKepada" {...register("ditujukanKepada")} className={errors.ditujukanKepada ? "border-red-500" : ""} />
            {errors.ditujukanKepada && <p className="text-xs text-red-500">{errors.ditujukanKepada.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalMasuk">Tanggal Masuk Dokumen</Label>
            <Input type="date" id="tanggalMasuk" {...register("tanggalMasuk")} className={errors.tanggalMasuk ? "border-red-500" : ""} />
            {errors.tanggalMasuk && <p className="text-xs text-red-500">{errors.tanggalMasuk.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="diserahkanKepada">Diserahkan Kepada (Opsional)</Label>
            <Input id="diserahkanKepada" {...register("diserahkanKepada")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalDiserahkan">Tanggal Diserahkan (Opsional)</Label>
            <Input type="date" id="tanggalDiserahkan" {...register("tanggalDiserahkan")} className={errors.tanggalDiserahkan ? "border-red-500" : ""} />
            {errors.tanggalDiserahkan && <p className="text-xs text-red-500">{errors.tanggalDiserahkan.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
