"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Telepon, TeleponInput, teleponSchema } from "@/lib/schema-pesan";

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
    formState: { errors },
  } = useForm<TeleponInput>({
    resolver: zodResolver(teleponSchema),
    defaultValues: {
      nama: initialData?.nama || "",
      nomorTelepon: initialData?.nomorTelepon || "",
      keperluan: initialData?.keperluan || "",
      keterangan: initialData?.keterangan || "",
    },
  });

  const onSubmitForm = async (data: TeleponInput) => {
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
            {initialData ? "Edit Data Telepon" : "Tambah Data Telepon"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Penelepon</Label>
            <Input id="nama" {...register("nama")} className={errors.nama ? "border-red-500" : ""} />
            {errors.nama && <p className="text-xs text-red-500">{errors.nama.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomorTelepon">No. Telepon</Label>
            <Input id="nomorTelepon" type="tel" {...register("nomorTelepon")} className={errors.nomorTelepon ? "border-red-500" : ""} />
            {errors.nomorTelepon && <p className="text-xs text-red-500">{errors.nomorTelepon.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keperluan">Keperluan</Label>
            <Input id="keperluan" {...register("keperluan")} className={errors.keperluan ? "border-red-500" : ""} />
            {errors.keperluan && <p className="text-xs text-red-500">{errors.keperluan.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan / Pesan</Label>
            <Input id="keterangan" {...register("keterangan")} />
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
