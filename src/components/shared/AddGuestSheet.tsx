"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  noWhatsApp: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  kategori: z.enum(["Donatur", "Mustahiq", "Kerjasama", "Lainnya"], {
    required_error: "Pilih kategori tamu",
  }),
  keperluan: z.string().min(1, "Keperluan wajib diisi"),
})

type FormValues = z.infer<typeof formSchema>

export function AddGuestSheet() {
  const [open, setOpen] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaLengkap: "",
      noWhatsApp: "",
      kategori: "Donatur",
      keperluan: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log("Data Tamu Baru:", data)
    // Close the sheet and reset form after successful submit
    setOpen(false)
    reset()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <PlusIcon className="w-4 h-4" />
          Tambah Tamu
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full sm:max-w-md w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Tambah Tamu Baru</SheetTitle>
          <SheetDescription>
            Masukkan informasi detail pengunjung di bawah ini.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 gap-6 py-4">
          <div className="space-y-4 flex-1 px-4">
            <div className="space-y-2">
              <label htmlFor="namaLengkap" className="text-sm font-medium">
                Nama Lengkap
              </label>
              <Input
                id="namaLengkap"
                placeholder="Masukkan nama lengkap"
                {...register("namaLengkap")}
                className={errors.namaLengkap ? "border-destructive" : ""}
              />
              {errors.namaLengkap && (
                <p className="text-xs text-destructive">{errors.namaLengkap.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="noWhatsApp" className="text-sm font-medium">
                Nomor WhatsApp
              </label>
              <Input
                id="noWhatsApp"
                type="tel"
                placeholder="081234567890"
                {...register("noWhatsApp")}
                className={errors.noWhatsApp ? "border-destructive" : ""}
              />
              {errors.noWhatsApp && (
                <p className="text-xs text-destructive">{errors.noWhatsApp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="kategori" className="text-sm font-medium">
                Kategori Tamu
              </label>
              <select
                id="kategori"
                {...register("kategori")}
                className={`flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${errors.kategori ? "border-destructive" : ""
                  }`}
              >
                <option value="Donatur">Donatur</option>
                <option value="Mustahiq">Mustahiq</option>
                <option value="Kerjasama">Kerjasama</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {errors.kategori && (
                <p className="text-xs text-destructive">{errors.kategori.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="keperluan" className="text-sm font-medium">
                Keperluan/Tujuan
              </label>
              <Textarea
                id="keperluan"
                placeholder="Jelaskan tujuan kedatangan"
                rows={4}
                {...register("keperluan")}
                className={errors.keperluan ? "border-destructive" : ""}
              />
              {errors.keperluan && (
                <p className="text-xs text-destructive">{errors.keperluan.message}</p>
              )}
            </div>
          </div>

          <SheetFooter className="mt-auto pt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Simpan Data
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
