"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type Guest = {
  id: string
  name: string
  category: "Donatur" | "Mustahiq" | "Kerjasama" | "Lainnya"
  time: string
  purpose: string
}

const data: Guest[] = [
  { id: "1", name: "Budi Santoso", category: "Donatur", time: "08:30 WIB", purpose: "Konfirmasi donasi bulanan" },
  { id: "2", name: "Siti Aminah", category: "Mustahiq", time: "09:15 WIB", purpose: "Pengajuan bantuan pendidikan" },
  { id: "3", name: "PT Sejahtera", category: "Kerjasama", time: "10:00 WIB", purpose: "Meeting program CSR" },
  { id: "4", name: "Ahmad Dahlan", category: "Lainnya", time: "11:45 WIB", purpose: "Bertemu HRD" },
  { id: "5", name: "Rina Marlina", category: "Donatur", time: "13:20 WIB", purpose: "Menyerahkan zakat" },
  { id: "6", name: "Joko Anwar", category: "Mustahiq", time: "14:10 WIB", purpose: "Pencairan dana kesehatan" },
]

const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: "Nama Tamu",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      let badgeVariant: "default" | "secondary" | "outline" | "destructive" = "default"
      
      if (category === "Mustahiq") badgeVariant = "secondary"
      if (category === "Kerjasama") badgeVariant = "outline"
      if (category === "Lainnya") badgeVariant = "secondary"

      return (
        <Badge variant={badgeVariant} className={category === "Donatur" ? "bg-primary text-primary-foreground" : ""}>
          {category}
        </Badge>
      )
    },
  },
  {
    accessorKey: "time",
    header: "Waktu Kedatangan",
  },
  {
    accessorKey: "purpose",
    header: "Keperluan",
  },
]

export function GuestTable({ filterCategory }: { filterCategory?: string }) {
  // Filter data statis berdasarkan props category
  const filteredData = React.useMemo(() => {
    if (!filterCategory || filterCategory === "Semua") return data
    return data.filter((guest) => guest.category === filterCategory)
  }, [filterCategory])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data tamu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}
