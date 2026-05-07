"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BookOpenIcon } from "lucide-react"

import { GuestDataTable } from "@/components/buku-tamu/guest-data-table"
import type { Guest } from "@/components/buku-tamu/types"
import { getGuests, createGuest, updateGuest, deleteGuest } from "./actions"
import { toast } from "sonner"

export default function BukuTamuPage() {
  const [guests, setGuests] = React.useState<Guest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchGuests = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getGuests()
      setGuests(data)
    } catch (error: any) {
      toast.error(`Gagal mengambil data tamu: ${error.message || "Unknown error"}`)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  // ── CRUD Handlers ──
  const handleAdd = async (data: any) => {
    setIsSubmitting(true)
    try {
      await createGuest(data)
      toast.success("Tamu baru berhasil ditambahkan")
      await fetchGuests()
    } catch (error) {
      toast.error("Gagal menambahkan tamu")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (id: string, data: any) => {
    setIsSubmitting(true)
    try {
      await updateGuest(id, data)
      toast.success("Data tamu berhasil diperbarui")
      await fetchGuests()
    } catch (error) {
      toast.error("Gagal memperbarui data tamu")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsSubmitting(true)
    try {
      await deleteGuest(id)
      toast.success("Tamu berhasil dihapus")
      await fetchGuests()
    } catch (error) {
      toast.error("Gagal menghapus tamu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700/10 dark:bg-emerald-500/15">
            <BookOpenIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Buku Tamu
            </h1>
            <p className="text-sm text-muted-foreground">
              Catat dan kelola data pengunjung gerai secara real-time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Divider ── */}
      <div className="h-px bg-border" />

      {/* ── Data Table with all controls ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <GuestDataTable
          data={guests}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>
    </div>
  )
}
