"use client";

import { MustahiqUang } from "@/lib/schema";
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

interface MustahiqUangTableProps {
  data: MustahiqUang[];
  loading: boolean;
  onEdit: (item: MustahiqUang) => void;
  onDelete: (id: string) => void;
}

export default function MustahiqUangTable({ data, loading, onEdit, onDelete }: MustahiqUangTableProps) {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (data.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data mustahiq.</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold font-serif">Nama</TableHead>
              <TableHead className="font-semibold font-serif">NIK</TableHead>
              <TableHead className="font-semibold font-serif">Alamat</TableHead>
              <TableHead className="font-semibold font-serif">Nominal</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal</TableHead>
              <TableHead className="font-semibold font-serif">Jam</TableHead>
              <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-foreground font-medium">{item.nama}</TableCell>
                <TableCell className="text-muted-foreground text-sm font-mono">{item.nik}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{item.alamat}</TableCell>
                <TableCell className="text-emerald-700 dark:text-emerald-400 font-bold">{formatCurrency(item.nominal)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {item.tanggal
                    ? format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })
                    : item.createdAt
                      ? format(item.createdAt.toDate(), "dd MMM yyyy", { locale: id })
                      : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{item.jam || "-"}</TableCell>
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
