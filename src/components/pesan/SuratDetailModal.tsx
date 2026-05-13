"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Surat } from "@/lib/schema-pesan";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface SuratDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Surat | null;
}

export default function SuratDetailModal({ isOpen, onClose, data }: SuratDetailModalProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-emerald-800 border-b pb-4">
            Detail Surat Masuk
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Tanggal</span>
            <span className="col-span-2 text-sm text-gray-900">
              {data.tanggal ? format(new Date(data.tanggal), "dd MMMM yyyy", { locale: id }) : "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Jam</span>
            <span className="col-span-2 text-sm text-gray-900">{data.jam || "-"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Jenis Dokumen</span>
            <span className="col-span-2 text-sm text-gray-900 font-semibold">{data.jenisDokumen}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Kode Dokumen</span>
            <span className="col-span-2 text-sm text-gray-900">{data.kodeDokumen || "-"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Nama Pengirim</span>
            <span className="col-span-2 text-sm text-gray-900">{data.namaPengirim}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Instansi</span>
            <span className="col-span-2 text-sm text-gray-900">{data.instansi || "-"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Ditujukan Kepada</span>
            <span className="col-span-2 text-sm text-gray-900">{data.ditujukanKepada}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Tanggal Masuk</span>
            <span className="col-span-2 text-sm text-gray-900">
              {data.tanggalMasuk ? format(new Date(data.tanggalMasuk), "dd MMMM yyyy", { locale: id }) : "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Diserahkan Kepada</span>
            <span className="col-span-2 text-sm text-gray-900">{data.diserahkanKepada}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
            <span className="text-sm font-medium text-gray-500">Tgl. Diserahkan</span>
            <span className="col-span-2 text-sm text-gray-900">
              {data.tanggalDiserahkan ? format(new Date(data.tanggalDiserahkan), "dd MMMM yyyy", { locale: id }) : "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-sm font-medium text-gray-500">Waktu Entri Data</span>
            <span className="col-span-2 text-sm text-gray-900">
              {data.createdAt ? format(data.createdAt.toDate(), "HH.mm / dd MMMM yyyy", { locale: id }) : "-"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
