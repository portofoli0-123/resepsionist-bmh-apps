"use client"

import { motion } from "framer-motion"
import { Construction } from "lucide-react"

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-1 items-center justify-center min-h-[60vh]"
    >
      <div className="text-center space-y-5 max-w-sm px-6">
        <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-primary/10 text-primary mx-auto">
          <Construction className="size-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description ?? "Halaman ini sedang dalam tahap pengembangan. Fitur akan segera hadir!"}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
          🚧 Akan Datang
        </div>
      </div>
    </motion.div>
  )
}
