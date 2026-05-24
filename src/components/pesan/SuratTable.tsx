"use client";

import { useEffect, useState } from "react";
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

interface SuratTableProps {
  suratList: Surat[];
  loading: boolean;
  onView: (surat: Surat) => void;
  onEdit: (surat: Surat) => void;
  onDelete: (id: string) => void;
}

export default function SuratTable({ suratList, loading, onView, onEdit, onDelete }: SuratTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | "all">(10);

  // Reset to page 1 when data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [suratList.length]);

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Memuat data...</div>;
  }

  if (suratList.length === 0) {
    return <div className="py-10 text-center text-gray-500">Tidak ada data surat.</div>;
  }

  // Pagination calculations
  const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(suratList.length / rowsPerPage);
  const indexOfLastRow = currentPage * (rowsPerPage === "all" ? suratList.length : rowsPerPage);
  const indexOfFirstRow = rowsPerPage === "all" ? 0 : indexOfLastRow - rowsPerPage;
  const currentRows = rowsPerPage === "all" ? suratList : suratList.slice(indexOfFirstRow, indexOfLastRow);

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
              {currentRows.map((s, index) => (
                <TableRow key={s.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="text-center text-muted-foreground font-medium">{indexOfFirstRow + index + 1}</TableCell>
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
