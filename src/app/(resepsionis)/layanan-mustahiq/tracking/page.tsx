"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Search, Loader2, CheckCircle2, Clock3, Circle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const DUMMY_TIMELINE = [
  { id: 1, title: "Pengajuan Diterima", desc: "Berkas telah diterima oleh resepsionis.", date: "12 Okt 2026, 09:00", done: true, current: false },
  { id: 2, title: "Verifikasi Berkas", desc: "Tim verifikasi memeriksa kelengkapan administrasi.", date: "12 Okt 2026, 14:30", done: true, current: false },
  { id: 3, title: "Survey Lapangan", desc: "Tim amil melakukan survey ke lokasi mustahiq.", date: "14 Okt 2026, 10:00", done: false, current: true },
  { id: 4, title: "Persetujuan Komite", desc: "Menunggu persetujuan komite penyaluran dana.", date: "—", done: false, current: false },
  { id: 5, title: "Pencairan Dana", desc: "Dana siap diambil atau telah ditransfer.", date: "—", done: false, current: false },
]

export default function TrackingPage() {
  const [query, setQuery] = useState("")
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setTimeout(() => { setSearched(true); setLoading(false) }, 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
          <Activity className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tracking Pengajuan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Lacak status permohonan bantuan berdasarkan Nomor Registrasi.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-5 pb-5">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nomor Registrasi — cth: REG-202610-001"
                className="pl-10 h-11"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="h-11 px-6">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Lacak"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base">
                      Registrasi: <span className="text-primary">{query}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">Atas Nama: Budi Santoso · NIK: 3578012345678901</CardDescription>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                    Dalam Proses
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-8 px-8">
                <div className="relative pl-5 border-l-2 border-muted space-y-7">
                  {DUMMY_TIMELINE.map((step) => (
                    <div key={step.id} className="relative">
                      {/* Dot */}
                      <div className={`absolute -left-[29px] flex items-center justify-center size-5 rounded-full bg-background border-2
                        ${step.done ? "border-primary text-primary" : step.current ? "border-amber-500 text-amber-500" : "border-muted-foreground/30"}`}>
                        {step.done
                          ? <CheckCircle2 className="size-3" />
                          : step.current
                          ? <Clock3 className="size-3" />
                          : <Circle className="size-2.5 text-muted-foreground/30 fill-current" />}
                      </div>
                      <h4 className={`text-sm font-semibold ${step.done || step.current ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                      <span className="text-[11px] text-muted-foreground/70 mt-1 inline-block">{step.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
