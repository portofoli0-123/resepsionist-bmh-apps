"use client";

import { Telepon } from "@/lib/schema-pesan";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TeleponTableProps {
  teleponList: Telepon[];
  loading: boolean;
  onEdit: (telepon: Telepon) => void;
  onDelete: (id: string) => void;
}

export default function TeleponTable({ teleponList, loading, onEdit, onDelete }: TeleponTableProps) {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (teleponList.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data telepon.</div>;
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
              <TableHead className="font-semibold font-serif">Nama</TableHead>
              <TableHead className="font-semibold font-serif">Instansi</TableHead>
              <TableHead className="font-semibold font-serif">No. Telepon</TableHead>
              <TableHead className="font-semibold font-serif">Keperluan</TableHead>
              <TableHead className="font-semibold font-serif">Keterangan</TableHead>
              <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teleponList.map((t, index) => (
              <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-center text-muted-foreground font-medium">{index + 1}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {t.tanggal ? format(new Date(t.tanggal), "dd MMM yyyy", { locale: id }) : 
                    t.createdAt ? format(t.createdAt.toDate(), "dd MMM yyyy", { locale: id }) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{t.jam || "-"}</TableCell>
                <TableCell className="text-foreground font-medium">{t.nama}</TableCell>
                <TableCell className="text-muted-foreground">{t.instansi || "-"}</TableCell>
                <TableCell className="text-muted-foreground">{t.nomorTelepon}</TableCell>
                <TableCell className="text-muted-foreground">{t.keperluan}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{t.keterangan || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(t)}
                      className="text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(t.id)}
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
