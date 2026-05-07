"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UserCheck, MapPin, Phone, History, Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PencarianCepatPage() {
  const [query, setQuery] = useState("")
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setTimeout(() => { setSearched(true); setLoading(false) }, 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto flex flex-col items-center space-y-8 pt-8"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary">
          <Search className="size-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Pencarian Cepat Mustahiq</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Cari data mustahiq lama berdasarkan NIK KTP atau Nama untuk mempercepat proses pendaftaran ulang.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="w-full flex border border-border/60 bg-background rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-shadow"
      >
        <div className="pl-4 flex items-center text-muted-foreground">
          <Search className="size-5" />
        </div>
        <Input
          placeholder="Ketik NIK atau Nama Mustahiq..."
          className="border-0 shadow-none focus-visible:ring-0 h-14 text-base bg-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" disabled={loading} className="h-14 rounded-none px-8 shrink-0 text-base">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Cari"}
        </Button>
      </form>

      {/* Result */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Hasil Pencarian</p>
            <Card className="shadow-sm hover:border-primary/30 transition-colors overflow-hidden cursor-pointer group">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-muted/30 p-6 flex flex-col justify-center items-center sm:w-52 border-b sm:border-b-0 sm:border-r border-border/40">
                    <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <UserCheck className="size-8" />
                    </div>
                    <h3 className="font-bold text-center">Ahmad Subagyo</h3>
                    <p className="text-xs font-mono text-muted-foreground mt-1">3578012345678901</p>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span>Jl. Merdeka No. 45, RT 02/RW 04, Kel. Sukamaju, Surabaya</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="size-4 text-muted-foreground shrink-0" />
                        <span>0812-3456-7890</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <History className="size-4 text-muted-foreground shrink-0" />
                        <span>Terakhir dibantu: <span className="font-semibold">Bantuan Pendidikan (Okt 2025)</span></span>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                      <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Buat Pengajuan Baru
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
