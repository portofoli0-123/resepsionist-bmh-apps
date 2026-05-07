"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusIcon, UserPlusIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Guest, GuestCategory } from "./types"
import { CATEGORY_OPTIONS } from "./types"

const formSchema = z.object({
  nama: z.string().min(1, "Nama lengkap wajib diisi"),
  no_whatsapp: z
    .string()
    .min(1, "Nomor WhatsApp wajib diisi")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor tidak valid"),
  kategori: z.enum(["donatur", "mustahiq", "kerjasama", "lainnya"], {
    required_error: "Pilih kategori tamu",
  }),
  keperluan: z.string().min(1, "Keperluan wajib diisi"),
  instansi: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface GuestFormDialogProps {
  mode: "create" | "edit"
  guest?: Guest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormValues) => void
}

export function GuestFormDialog({
  mode,
  guest,
  open,
  onOpenChange,
  onSubmit,
}: GuestFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      no_whatsapp: "",
      kategori: "donatur",
      keperluan: "",
      instansi: "",
    },
  })

  // Pre-fill form when editing
  React.useEffect(() => {
    if (mode === "edit" && guest) {
      reset({
        nama: guest.nama,
        no_whatsapp: guest.no_whatsapp,
        kategori: guest.kategori,
        keperluan: guest.keperluan,
        instansi: guest.instansi || "",
      })
    } else if (mode === "create" && open) {
      reset({
        nama: "",
        no_whatsapp: "",
        kategori: "donatur",
        keperluan: "",
        instansi: "",
      })
    }
  }, [mode, guest, reset, open])

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedKategori = watch("kategori")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "create" && (
        <DialogTrigger asChild>
          <Button
            id="btn-tamu-baru"
            className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-lg shadow-emerald-700/20 transition-all duration-200 hover:shadow-emerald-700/30 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:shadow-emerald-600/20"
          >
            <PlusIcon className="w-4 h-4" />
            Tamu Baru
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-700/10 dark:bg-emerald-500/20">
              <UserPlusIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {mode === "create" ? "Tambah Tamu Baru" : "Edit Data Tamu"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Masukkan informasi detail pengunjung."
                  : "Perbarui informasi pengunjung di bawah ini."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 py-2"
        >
          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <Label htmlFor="nama">
              Nama Lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nama"
              placeholder="Masukkan nama lengkap"
              {...register("nama")}
              className={errors.nama ? "border-destructive focus-visible:ring-destructive/30" : ""}
            />
            {errors.nama && (
              <p className="text-xs text-destructive">{errors.nama.message}</p>
            )}
          </div>

          {/* No. WhatsApp */}
          <div className="space-y-1.5">
            <Label htmlFor="no_whatsapp">
              No. WhatsApp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="no_whatsapp"
              type="tel"
              placeholder="081234567890"
              {...register("no_whatsapp")}
              className={errors.no_whatsapp ? "border-destructive focus-visible:ring-destructive/30" : ""}
            />
            {errors.no_whatsapp && (
              <p className="text-xs text-destructive">{errors.no_whatsapp.message}</p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <Label htmlFor="kategori">
              Kategori <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedKategori}
              onValueChange={(val) => setValue("kategori", val as GuestCategory)}
            >
              <SelectTrigger id="kategori" className="w-full">
                <SelectValue placeholder="Pilih kategori tamu" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kategori && (
              <p className="text-xs text-destructive">{errors.kategori.message}</p>
            )}
          </div>

          {/* Keperluan */}
          <div className="space-y-1.5">
            <Label htmlFor="keperluan">
              Keperluan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="keperluan"
              placeholder="Jelaskan tujuan kedatangan"
              rows={3}
              {...register("keperluan")}
              className={errors.keperluan ? "border-destructive focus-visible:ring-destructive/30" : ""}
            />
            {errors.keperluan && (
              <p className="text-xs text-destructive">{errors.keperluan.message}</p>
            )}
          </div>

          {/* Instansi (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="instansi">
              Instansi{" "}
              <span className="text-muted-foreground font-normal">(opsional)</span>
            </Label>
            <Input
              id="instansi"
              placeholder="Nama perusahaan/organisasi"
              {...register("instansi")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : mode === "create" ? (
                "Simpan Data"
              ) : (
                "Perbarui Data"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
