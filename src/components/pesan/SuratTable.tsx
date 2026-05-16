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
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold font-serif w-12 text-center">No</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal</TableHead>
              <TableHead className="font-semibold font-serif">Jam</TableHead>
              <TableHead className="font-semibold font-serif">Jenis Dokumen</TableHead>
              <TableHead className="font-semibold font-serif">Kode Dokumen</TableHead>
              <TableHead className="font-semibold font-serif">Nama Pengirim</TableHead>
              <TableHead className="font-semibold font-serif">Instansi</TableHead>
              <TableHead className="font-semibold font-serif">Ditujukan Kepada</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal Masuk Dokumen</TableHead>
              <TableHead className="font-semibold font-serif">Diserahkan Kepada</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal Diserahkan</TableHead>
              <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suratList.map((s, index) => (
              <TableRow key={s.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-center text-muted-foreground font-medium">{index + 1}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {s.tanggal ? format(new Date(s.tanggal), "dd MMM yyyy", { locale: id }) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{s.jam || "-"}</TableCell>
                <TableCell className="text-foreground font-medium">{s.jenisDokumen}</TableCell>
                <TableCell className="text-muted-foreground">{s.kodeDokumen || "-"}</TableCell>
                <TableCell className="text-muted-foreground">{s.namaPengirim}</TableCell>
                <TableCell className="text-muted-foreground">{s.instansi || "-"}</TableCell>
                <TableCell className="text-muted-foreground">{s.ditujukanKepada}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {s.tanggalMasuk ? format(new Date(s.tanggalMasuk), "dd MMM yyyy", { locale: id }) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">{s.diserahkanKepada}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {s.tanggalDiserahkan ? format(new Date(s.tanggalDiserahkan), "dd MMM yyyy", { locale: id }) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(s)}
                      className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(s)}
                      className="text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(s.id)}
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
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
