"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Banknote, Calculator, ReceiptText, ArrowRight, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const schema = z.object({
  namaDonatur: z.string().min(3, "Nama wajib diisi"),
  noWa: z.string().min(10, "Nomor WA tidak valid"),
  program: z.string({ message: "Pilih program donasi" }),
  nominal: z.string().min(3, "Nominal tidak valid"),
  metode: z.string({ message: "Pilih metode pembayaran" }),
})

type FormData = z.infer<typeof schema>

const formatIDR = (val: string | number) => {
  const num = typeof val === "string" ? parseFloat(val.replace(/[^0-9]/g, "")) : val
  if (!num || isNaN(num)) return "Rp 0"
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num)
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function DonasiPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calcHarta, setCalcHarta] = useState("")
  const [zakatResult, setZakatResult] = useState<number | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const watchNominal = watch("nominal")

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)
    setTimeout(() => { console.log(data); alert("Donasi berhasil dicatat!"); reset(); setIsSubmitting(false) }, 1000)
  }

  const hitungZakat = () => {
    const n = parseFloat(calcHarta.replace(/[^0-9]/g, ""))
    if (!isNaN(n)) setZakatResult(n * 0.025)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
          <Banknote className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Penerimaan Donasi & Wakaf</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Formulir cepat untuk walk-in donor yang datang langsung ke kantor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Donasi */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ReceiptText className="size-4 text-primary" /> Formulir Penerimaan Dana
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaDonatur">Nama Donatur</Label>
                    <Input id="namaDonatur" placeholder="Hamba Allah / Nama Lengkap" {...register("namaDonatur")}
                      className={cn(errors.namaDonatur && "border-destructive")} />
                    {errors.namaDonatur && <p className="text-xs text-destructive">{errors.namaDonatur.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noWa">No. WhatsApp</Label>
                    <Input id="noWa" placeholder="08..." {...register("noWa")}
                      className={cn(errors.noWa && "border-destructive")} />
                    {errors.noWa && <p className="text-xs text-destructive">{errors.noWa.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Program / Jenis Dana</Label>
                    <Select onValueChange={(v) => setValue("program", v)}>
                      <SelectTrigger className={cn(errors.program && "border-destructive")}><SelectValue placeholder="Pilih Program" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zakat_mal">Zakat Maal</SelectItem>
                        <SelectItem value="zakat_fitrah">Zakat Fitrah</SelectItem>
                        <SelectItem value="infak">Infak / Sedekah</SelectItem>
                        <SelectItem value="wakaf_tunai">Wakaf Tunai</SelectItem>
                        <SelectItem value="fidyah">Fidyah</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.program && <p className="text-xs text-destructive">{errors.program.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Metode Pembayaran</Label>
                    <Select onValueChange={(v) => setValue("metode", v)}>
                      <SelectTrigger className={cn(errors.metode && "border-destructive")}><SelectValue placeholder="Pilih Metode" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tunai">Tunai (Cash)</SelectItem>
                        <SelectItem value="qris">QRIS</SelectItem>
                        <SelectItem value="bsi">Transfer BSI</SelectItem>
                        <SelectItem value="bca">Transfer BCA</SelectItem>
                        <SelectItem value="mandiri">Transfer Mandiri</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.metode && <p className="text-xs text-destructive">{errors.metode.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nominal" className="text-base font-bold">Nominal Donasi</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">Rp</span>
                    <Input id="nominal" placeholder="0" {...register("nominal")}
                      className={cn("pl-12 h-14 text-2xl font-bold tracking-wider", errors.nominal && "border-destructive")} />
                  </div>
                  {watchNominal && <p className="text-sm font-medium text-primary/80">Terbilang: {formatIDR(watchNominal)}</p>}
                  {errors.nominal && <p className="text-xs text-destructive">{errors.nominal.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                  <Button type="button" variant="outline" onClick={() => reset()}>Reset</Button>
                  <Button type="submit" disabled={isSubmitting} className="px-6">
                    {isSubmitting ? <><Loader2 className="size-4 mr-2 animate-spin" />Memproses...</> : "Proses Donasi"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Kalkulator Zakat */}
        <div className="space-y-4">
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary text-base flex items-center gap-2">
                <Calculator className="size-4" /> Kalkulator Zakat
              </CardTitle>
              <CardDescription className="text-primary/70 text-xs">Bantu donatur hitung zakat hartanya di tempat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-primary/80">Total Harta (Tabungan / Emas)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 text-sm">Rp</span>
                  <Input placeholder="Nominal harta" value={calcHarta} onChange={(e) => setCalcHarta(e.target.value)}
                    className="pl-9 border-primary/30 bg-background focus-visible:ring-primary/40" />
                </div>
              </div>
              <Button onClick={hitungZakat} variant="secondary" className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                Hitung 2.5%
              </Button>
              {zakatResult !== null && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-background rounded-lg border border-primary/30 text-center space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Wajib Zakat</p>
                  <p className="text-xl font-bold text-primary">{formatIDR(zakatResult)}</p>
                  <Button size="sm" className="w-full gap-2" onClick={() => { setValue("nominal", zakatResult.toString()); setValue("program", "zakat_mal") }}>
                    Gunakan <ArrowRight className="size-3.5" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <div className="px-4 py-3 bg-muted border-b border-border/40">
              <h3 className="text-xs font-semibold">Nisab Zakat Saat Ini</h3>
            </div>
            <div className="px-4 py-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Harga Emas/gram</span><span className="font-medium">Rp 1.150.000</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Nisab (85 gr)</span><span className="font-semibold text-primary">Rp 97.750.000</span></div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
