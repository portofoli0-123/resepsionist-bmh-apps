"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { HandHeart, Save, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus tepat 16 digit"),
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  alamat: z.string().min(10, "Alamat terlalu singkat"),
  jenisBantuan: z.string({ message: "Pilih jenis bantuan" }),
})

type FormData = z.infer<typeof formSchema>

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function PendaftaranMustahiqPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log(data)
      alert("Data mustahiq berhasil disimpan!")
      reset()
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
          <HandHeart className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pendaftaran Mustahiq Baru</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Isi formulir berikut untuk mendaftarkan permohonan bantuan.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
          <CardTitle className="text-base">Informasi Pemohon</CardTitle>
          <CardDescription>Pastikan NIK KTP sesuai dengan data kependudukan.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="nik">
                  NIK KTP <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nik"
                  placeholder="16 digit angka"
                  maxLength={16}
                  {...register("nik")}
                  className={cn(errors.nik && "border-destructive focus-visible:ring-destructive/30")}
                />
                {errors.nik && <p className="text-xs text-destructive">{errors.nik.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="namaLengkap">
                  Nama Lengkap <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="namaLengkap"
                  placeholder="Sesuai KTP"
                  {...register("namaLengkap")}
                  className={cn(errors.namaLengkap && "border-destructive focus-visible:ring-destructive/30")}
                />
                {errors.namaLengkap && <p className="text-xs text-destructive">{errors.namaLengkap.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat">
                  Alamat Lengkap <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="alamat"
                  placeholder="Jl. Raya No... RT/RW, Kel., Kec., Kab/Kota"
                  className={cn("min-h-[90px] resize-none", errors.alamat && "border-destructive focus-visible:ring-destructive/30")}
                  {...register("alamat")}
                />
                {errors.alamat && <p className="text-xs text-destructive">{errors.alamat.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>
                  Jenis Bantuan <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(val) => setValue("jenisBantuan", val)}>
                  <SelectTrigger className={cn(errors.jenisBantuan && "border-destructive focus-visible:ring-destructive/30")}>
                    <SelectValue placeholder="Pilih Kategori Bantuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendidikan">Bantuan Pendidikan / Beasiswa</SelectItem>
                    <SelectItem value="kesehatan">Bantuan Kesehatan</SelectItem>
                    <SelectItem value="ekonomi">Modal Usaha / Ekonomi</SelectItem>
                    <SelectItem value="kemanusiaan">Bantuan Kemanusiaan</SelectItem>
                    <SelectItem value="pangan">Bantuan Pangan / Sembako</SelectItem>
                  </SelectContent>
                </Select>
                {errors.jenisBantuan && <p className="text-xs text-destructive">{errors.jenisBantuan.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting} className="px-6">
                {isSubmitting ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Menyimpan...</>
                ) : (
                  <><Save className="size-4 mr-2" /> Simpan Data</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
