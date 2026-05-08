"use client";

import { Guest } from "@/lib/schema";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
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
}

export default function GuestTable({ guests, loading, onEdit, onDelete }: GuestTableProps) {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (guests.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data pengunjung.</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold font-serif">Nama</TableHead>
            <TableHead className="font-semibold font-serif">Kategori</TableHead>
            <TableHead className="font-semibold font-serif">Keperluan</TableHead>
            <TableHead className="font-semibold font-serif">Waktu / Tanggal</TableHead>
            <TableHead className="font-semibold font-serif">Institusi</TableHead>
            <TableHead className="font-semibold font-serif">No. WhatsApp</TableHead>
            <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="text-gray-900 font-medium">{guest.nama}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  guest.kategori === 'Donatur' ? 'bg-blue-100 text-blue-800' :
                  guest.kategori === 'Mustahiq' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {guest.kategori}
                </span>
              </TableCell>
              <TableCell className="text-gray-600 max-w-xs truncate">{guest.keperluan}</TableCell>
              <TableCell className="text-gray-500 text-sm">
                {guest.createdAt ? format(guest.createdAt.toDate(), "HH.mm / dd MMMM yyyy", { locale: id }) : "-"}
              </TableCell>
              <TableCell className="text-gray-600">{(guest as any).institusi || "-"}</TableCell>
              <TableCell className="text-gray-600">{(guest as any).whatsapp || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(guest)}
                    className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(guest.id)}
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
