"use client";

import { Paket } from "@/lib/schema-pesan";
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

interface PaketTableProps {
  data: Paket[];
  loading: boolean;
  onEdit: (item: Paket) => void;
  onDelete: (id: string) => void;
}

export default function PaketTable({ data, loading, onEdit, onDelete }: PaketTableProps) {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (data.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data paket masuk.</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold font-serif">Penerima</TableHead>
              <TableHead className="font-semibold font-serif">Ekspedisi</TableHead>
              <TableHead className="font-semibold font-serif">Pengirim</TableHead>
              <TableHead className="font-semibold font-serif">No. Resi</TableHead>
              <TableHead className="font-semibold font-serif">Tanggal</TableHead>
              <TableHead className="font-semibold font-serif">Jam</TableHead>
              <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="text-gray-900 font-medium">{item.namaPenerima}</TableCell>
                <TableCell className="text-gray-600">{item.ekspedisi}</TableCell>
                <TableCell className="text-gray-600">{item.namaPengirim || "-"}</TableCell>
                <TableCell className="text-gray-500 text-sm font-mono">{item.noResi || "-"}</TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {item.tanggal
                    ? format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })
                    : item.createdAt
                      ? format(item.createdAt.toDate(), "dd MMM yyyy", { locale: id })
                      : "-"}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">{item.jam || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                      title="Edit Data"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50"
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
