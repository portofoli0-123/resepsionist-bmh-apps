"use client";

import { useEffect, useState } from "react";
import { MustahiqUang } from "@/lib/schema";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Edit2, Trash2, MoreHorizontal, Eye } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface MustahiqUangTableProps {
  data: MustahiqUang[];
  loading: boolean;
  onEdit: (item: MustahiqUang) => void;
  onDelete: (id: string) => void;
}

export default function MustahiqUangTable({ data, loading, onEdit, onDelete }: MustahiqUangTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | "all">(10);
  const [viewItem, setViewItem] = useState<MustahiqUang | null>(null);

  // Reset to page 1 when data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

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

  // Pagination calculations
  const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(data.length / rowsPerPage);
  const indexOfLastRow = currentPage * (rowsPerPage === "all" ? data.length : rowsPerPage);
  const indexOfFirstRow = rowsPerPage === "all" ? 0 : indexOfLastRow - rowsPerPage;
  const currentRows = rowsPerPage === "all" ? data : data.slice(indexOfFirstRow, indexOfLastRow);

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
                <TableHead className="font-semibold font-serif">NIK</TableHead>
                <TableHead className="font-semibold font-serif">No. KK</TableHead>
                <TableHead className="font-semibold font-serif">Jenis Penyaluran</TableHead>
                <TableHead className="font-semibold font-serif">Nominal</TableHead>
                <TableHead className="font-semibold font-serif">Tanggal</TableHead>
                <TableHead className="font-semibold font-serif">Jam</TableHead>
                <TableHead className="text-right font-semibold font-serif">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="text-foreground font-medium">{item.nama}</TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{item.nik}</TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{item.noKK || "-"}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">{(item as any).jenisPenyaluran || item.alamat || "-"}</TableCell>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-36 p-1 flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 px-2 text-sm font-medium"
                          onClick={() => setViewItem(item)}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View Detail
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 px-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                          onClick={() => onEdit(item)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 px-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
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
              <SelectItem value="5">5</SelectItem>
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

      {/* Dialog for View Detail */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-emerald-800 dark:text-emerald-500">Detail Mustahiq</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 border-border">
                <span className="font-semibold text-muted-foreground">Nama</span>
                <span className="col-span-2 font-medium">{viewItem.nama}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 border-border">
                <span className="font-semibold text-muted-foreground">NIK</span>
                <span className="col-span-2 font-mono">{viewItem.nik}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 border-border">
                <span className="font-semibold text-muted-foreground">No. KK</span>
                <span className="col-span-2 font-mono">{viewItem.noKK || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 border-border">
                <span className="font-semibold text-muted-foreground">Jenis Penyaluran</span>
                <span className="col-span-2">{(viewItem as any).jenisPenyaluran || viewItem.alamat || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 border-border">
                <span className="font-semibold text-muted-foreground">Nominal</span>
                <span className="col-span-2 text-emerald-700 dark:text-emerald-400 font-bold">{formatCurrency(viewItem.nominal)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 border-border">
                <span className="font-semibold text-muted-foreground">Tanggal</span>
                <span className="col-span-2">
                  {viewItem.tanggal
                    ? format(new Date(viewItem.tanggal), "dd MMMM yyyy", { locale: id })
                    : viewItem.createdAt
                      ? format(viewItem.createdAt.toDate(), "dd MMMM yyyy", { locale: id })
                      : "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm pb-2">
                <span className="font-semibold text-muted-foreground">Jam</span>
                <span className="col-span-2">{viewItem.jam || "-"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
