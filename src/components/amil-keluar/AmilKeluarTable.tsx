"use client";

import { AmilKeluar } from "@/lib/schema";
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

interface AmilKeluarTableProps {
  data: AmilKeluar[];
  loading: boolean;
  onEdit: (item: AmilKeluar) => void;
  onDelete: (id: string) => void;
}

export default function AmilKeluarTable({ data, loading, onEdit, onDelete }: AmilKeluarTableProps) {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (data.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data Amil Keluar.</div>;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold font-serif">Nama</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal</TableHead>
              <TableHead className="font-semibold font-serif">Jam</TableHead>
              <TableHead className="font-semibold font-serif">Keperluan</TableHead>
              <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-foreground font-medium">{item.nama}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {(item as any).tanggal
                    ? format(new Date((item as any).tanggal), "dd MMM yyyy", { locale: id })
                    : item.createdAt
                      ? format(item.createdAt.toDate(), "dd MMM yyyy", { locale: id })
                      : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{(item as any).jam || "-"}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{item.keperluan}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                      title="Edit Data"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                      title="Hapus Data"
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
