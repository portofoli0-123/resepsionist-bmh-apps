"use client";

import { Surat } from "@/lib/schema-pesan";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Edit2, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface SuratTableProps {
  suratList: Surat[];
  loading: boolean;
  onView: (surat: Surat) => void;
  onEdit: (surat: Surat) => void;
  onDelete: (id: string) => void;
}

export default function SuratTable({ suratList, loading, onView, onEdit, onDelete }: SuratTableProps) {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (suratList.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data surat.</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold font-serif w-12 text-center">No</TableHead>
              <TableHead className="font-semibold font-serif">Jenis Dokumen</TableHead>
              <TableHead className="font-semibold font-serif">Kode Dokumen</TableHead>
              <TableHead className="font-semibold font-serif">Nama Pengirim</TableHead>
              <TableHead className="font-semibold font-serif">Ditujukan Kepada</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal Masuk Dokumen</TableHead>
              <TableHead className="font-semibold font-serif">Diserahkan Kepada</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal Diserahkan</TableHead>
              <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suratList.map((s, index) => (
              <TableRow key={s.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="text-center text-gray-500 font-medium">{index + 1}</TableCell>
                <TableCell className="text-gray-900 font-medium">{s.jenisDokumen}</TableCell>
                <TableCell className="text-gray-600">{s.kodeDokumen}</TableCell>
                <TableCell className="text-gray-600">{s.namaPengirim}</TableCell>
                <TableCell className="text-gray-600">{s.ditujukanKepada}</TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {s.tanggalMasuk ? format(new Date(s.tanggalMasuk), "dd MMM yyyy", { locale: id }) : "-"}
                </TableCell>
                <TableCell className="text-gray-600">{s.diserahkanKepada}</TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {s.tanggalDiserahkan ? format(new Date(s.tanggalDiserahkan), "dd MMM yyyy", { locale: id }) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(s)}
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(s)}
                      className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(s.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
