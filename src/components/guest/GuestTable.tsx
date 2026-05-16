"use client";

import { Guest } from "@/lib/schema";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Edit2, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface GuestTableProps {
  guests: Guest[];
  loading: boolean;
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
  onView: (guest: Guest) => void;
}

export default function GuestTable({ guests, loading, onEdit, onDelete, onView }: GuestTableProps) {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (guests.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data pengunjung.</div>;
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
            <TableHead className="font-semibold font-serif">Kategori</TableHead>
            <TableHead className="font-semibold font-serif">Keperluan</TableHead>
            <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="text-foreground font-medium">{guest.nama}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {(guest as any).tanggal
                  ? format(new Date((guest as any).tanggal), "dd MMM yyyy", { locale: id })
                  : guest.createdAt
                    ? format(guest.createdAt.toDate(), "dd MMM yyyy", { locale: id })
                    : "-"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{(guest as any).jam || "-"}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  guest.kategori === 'Donatur' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                  guest.kategori === 'Mustahiq' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                }`}>
                  {guest.kategori}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate">{guest.keperluan}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(guest)}
                    className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(guest)}
                    className="text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                    title="Edit Data"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(guest.id)}
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
