"use client"

import { motion } from "framer-motion"
import { FileText, Printer, MessageCircle, Download, CheckCircle2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function KwitansiDigitalPage() {
  // Dummy data for preview
  const data = {
    noKwitansi: "KW-BMH-202610-089",
    tanggal: "12 Oktober 2026, 14:30 WIB",
    namaDonatur: "Bapak Ahmad Subagyo",
    noWa: "0812-3456-7890",
    program: "Zakat Maal",
    metode: "Transfer Bank Syariah Indonesia (BSI)",
    nominal: 2500000,
    terbilang: "Dua Juta Lima Ratus Ribu Rupiah",
    amil: "Resepsionis BMH Pusat",
  }

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 max-w-4xl mx-auto space-y-6 flex flex-col items-center"
    >
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-3">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Donasi Berhasil Dicatat</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kwitansi digital telah diterbitkan dan siap diberikan kepada donatur.
        </p>
      </div>

      <Card className="w-full max-w-2xl shadow-lg border-border/60 relative overflow-hidden bg-white">
        {/* Decorative elements for receipt look */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <CardContent className="p-8 sm:p-12 text-center sm:text-left space-y-8 relative">
          
          {/* Header Kwitansi */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">B</span>
              </div>
              <div className="text-left">
                <h2 className="font-bold text-lg leading-tight text-emerald-900">Baitul Maal Hidayatullah</h2>
                <p className="text-xs text-muted-foreground">Lembaga Amil Zakat Nasional</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <h3 className="font-bold text-emerald-800 text-lg uppercase tracking-widest">Kwitansi</h3>
              <p className="text-xs font-mono text-muted-foreground mt-1">{data.noKwitansi}</p>
            </div>
          </div>

          <Separator className="border-dashed" />

          {/* Body Kwitansi */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Tanggal Transaksi</p>
                <p className="font-medium text-foreground">{data.tanggal}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Metode Pembayaran</p>
                <p className="font-medium text-foreground">{data.metode}</p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100 space-y-4">
              <div>
                <p className="text-emerald-700 text-xs uppercase tracking-wider mb-1">Telah Terima Dari</p>
                <p className="font-bold text-emerald-950 text-lg">{data.namaDonatur}</p>
                <p className="text-emerald-700 text-xs mt-1">{data.noWa}</p>
              </div>
              <Separator className="bg-emerald-200" />
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-emerald-700 text-xs uppercase tracking-wider mb-1">Untuk Pembayaran</p>
                  <p className="font-bold text-emerald-950">{data.program}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-700 text-xs uppercase tracking-wider mb-1">Jumlah</p>
                  <p className="font-bold text-2xl text-emerald-600">{formatIDR(data.nominal)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 italic text-sm text-gray-600 text-center">
              "{data.terbilang}"
            </div>
          </div>

          {/* Footer Kwitansi */}
          <div className="pt-6 flex justify-between items-end">
            <p className="text-xs text-muted-foreground italic max-w-[200px]">
              Kwitansi ini sah diterbitkan oleh sistem BMH Nasional.
            </p>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-8">Penerima / Amil</p>
              <p className="font-semibold border-b border-gray-300 pb-1">{data.amil}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Buttons */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 mt-4">
        <Button size="lg" variant="outline" className="flex-1 h-14 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 shadow-sm">
          <Printer className="size-5 mr-2" /> Cetak Kwitansi
        </Button>
        <Button size="lg" className="flex-1 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm border-0">
          <MessageCircle className="size-5 mr-2" /> Kirim via WhatsApp
        </Button>
        <Button size="icon" variant="outline" className="h-14 w-14 shrink-0 bg-white shadow-sm" title="Unduh PDF">
          <Download className="size-5 text-muted-foreground" />
        </Button>
      </div>

    </motion.div>
  )
}
