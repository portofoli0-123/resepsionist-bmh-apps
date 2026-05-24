"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GuestTableProps {
  guests: Guest[];
  loading: boolean;
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
  onView: (guest: Guest) => void;
}

export default function GuestTable({ guests, loading, onEdit, onDelete, onView }: GuestTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | "all">(10);

  // Reset to page 1 when data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [guests.length]);

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (guests.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data pengunjung.</div>;
  }

  // Pagination calculations
  const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(guests.length / rowsPerPage);
  const indexOfLastRow = currentPage * (rowsPerPage === "all" ? guests.length : rowsPerPage);
  const indexOfFirstRow = rowsPerPage === "all" ? 0 : indexOfLastRow - rowsPerPage;
  const currentRows = rowsPerPage === "all" ? guests : guests.slice(indexOfFirstRow, indexOfLastRow);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("ellipsis-1");
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push("ellipsis-2");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
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
              {currentRows.map((guest) => (
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

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        {/* Bottom Left: Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Baris per halaman:</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => {
              setRowsPerPage(val === "all" ? "all" : Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px] h-9 text-xs bg-background border-border">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bottom Right: Pagination */}
        <Pagination className="w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {getPageNumbers().map((page, idx) => (
              <PaginationItem key={idx}>
                {page === "ellipsis-1" || page === "ellipsis-2" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Number(page));
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
