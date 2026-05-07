"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from "@tanstack/react-table"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpDown,
  PencilIcon,
  Trash2Icon,
  SearchIcon,
  CalendarIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
} from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { Guest, GuestCategory } from "./types"
import { CATEGORY_BADGE_STYLES } from "./types"
import { GuestFormDialog } from "./guest-form-dialog"
import { DeleteGuestDialog } from "./delete-guest-dialog"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  }
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function toDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
interface GuestDataTableProps {
  data: Guest[]
  isLoading: boolean
  isSubmitting?: boolean
  onAdd: (data: any) => void
  onEdit: (id: string, data: any) => void
  onDelete: (id: string) => void
}

export function GuestDataTable({
  data,
  isLoading,
  isSubmitting = false,
  onAdd,
  onEdit,
  onDelete,
}: GuestDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("Semua")

  // Date range filter
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")

  // Dialog states
  const [formOpen, setFormOpen] = React.useState(false)
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create")
  const [editGuest, setEditGuest] = React.useState<Guest | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteGuest, setDeleteGuest] = React.useState<Guest | null>(null)

  // Filter data by category tab + date range
  const filteredData = React.useMemo(() => {
    let result = data

    // Category filter
    if (activeTab !== "Semua") {
      if (activeTab === "Kunjungan & Lainnya") {
        result = result.filter(
          (g) => g.kategori === "kerjasama" || g.kategori === "lainnya"
        )
      } else {
        result = result.filter((g) => g.kategori === activeTab.toLowerCase())
      }
    }

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0, 0)
      result = result.filter((g) => new Date(g.created_at) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      result = result.filter((g) => new Date(g.created_at) <= to)
    }

    return result
  }, [data, activeTab, dateFrom, dateTo])

  // Column Definitions
  const columns: ColumnDef<Guest>[] = React.useMemo(
    () => [
      {
        accessorKey: "nama",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Tamu
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-foreground">{row.getValue("nama")}</div>
        ),
      },
      {
        accessorKey: "kategori",
        header: "Kategori",
        cell: ({ row }) => {
          const kategori = row.getValue("kategori") as GuestCategory
          const label = kategori.charAt(0).toUpperCase() + kategori.slice(1)
          return (
            <Badge
              variant="secondary"
              className={`${CATEGORY_BADGE_STYLES[kategori]} border-0 font-medium`}
            >
              {label}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value === "Semua" || row.getValue(id) === value
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Waktu
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground">
            {formatTime(row.getValue("created_at"))}
          </div>
        ),
      },
      {
        accessorKey: "keperluan",
        header: "Keperluan",
        cell: ({ row }) => (
          <div className="max-w-[260px] truncate text-muted-foreground">
            {row.getValue("keperluan")}
          </div>
        ),
      },
      {
        id: "aksi",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
          const guest = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400"
                onClick={() => {
                  setEditGuest(guest)
                  setFormMode("edit")
                  setFormOpen(true)
                }}
                title="Edit"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => {
                  setDeleteGuest(guest)
                  setDeleteOpen(true)
                }}
                title="Hapus"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  // Handlers
  const handleCreate = () => {
    setEditGuest(null)
    setFormMode("create")
    setFormOpen(true)
  }

  const handleFormSubmit = async (formData: any) => {
    if (formMode === "create") {
      await onAdd(formData)
    } else if (editGuest) {
      await onEdit(editGuest.id, formData)
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteGuest) {
      await onDelete(deleteGuest.id)
      setDeleteOpen(false)
      setDeleteGuest(null)
    }
  }

  const clearDateFilter = () => {
    setDateFrom("")
    setDateTo("")
  }

  const hasDateFilter = dateFrom || dateTo

  if (isLoading) {
    return <TableSkeleton />
  }

  return (
    <div className="space-y-4">
      {/* ── Tabs Filter ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-0 flex-wrap">
          <TabsTrigger value="Semua">Semua Tamu</TabsTrigger>
          <TabsTrigger value="Donatur">Donatur</TabsTrigger>
          <TabsTrigger value="Mustahiq">Mustahiq</TabsTrigger>
          <TabsTrigger value="Kunjungan & Lainnya">Kunjungan & Lainnya</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ── Controls Bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-tamu"
              placeholder="Cari nama atau keperluan..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className={`gap-2 ${hasDateFilter ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400" : ""}`}
              >
                <CalendarIcon className="h-4 w-4" />
                {hasDateFilter
                  ? `${dateFrom || "..."} — ${dateTo || "..."}`
                  : "Filter Tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-3">
                <p className="text-sm font-medium">Rentang Tanggal</p>
                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Dari</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <span className="mt-5 text-muted-foreground">—</span>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Sampai</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                {hasDateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDateFilter}
                    className="w-full text-xs text-muted-foreground"
                  >
                    <XIcon className="mr-1 h-3 w-3" />
                    Hapus Filter Tanggal
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* New Guest Button */}
        <GuestFormDialog
          mode="create"
          open={formOpen && formMode === "create"}
          isLoading={isSubmitting}
          onOpenChange={(open) => {
            if (open) handleCreate()
            else setFormOpen(false)
          }}
          onSubmit={handleFormSubmit}
        />
      </div>

      {/* ── Data Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-lg border bg-card shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <UsersIcon className="h-8 w-8 opacity-40" />
                      <p className="text-sm">Tidak ada data tamu ditemukan.</p>
                      {(globalFilter || hasDateFilter || activeTab !== "Semua") && (
                        <p className="text-xs">Coba ubah filter pencarian Anda.</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-muted-foreground">
          Menampilkan{" "}
          <span className="font-medium text-foreground">
            {table.getRowModel().rows.length}
          </span>{" "}
          dari{" "}
          <span className="font-medium text-foreground">
            {filteredData.length}
          </span>{" "}
          tamu
        </p>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Edit Dialog (shared) ── */}
      {formMode === "edit" && (
        <GuestFormDialog
          mode="edit"
          guest={editGuest}
          open={formOpen && formMode === "edit"}
          isLoading={isSubmitting}
          onOpenChange={(open) => {
            if (!open) {
              setFormOpen(false)
              setEditGuest(null)
            }
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* ── Delete Confirmation ── */}
      <DeleteGuestDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        guestName={deleteGuest?.nama || ""}
        isLoading={isSubmitting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
