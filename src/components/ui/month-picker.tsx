"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export function MonthPicker({
  month,
  setMonth,
  className
}: {
  month: string
  setMonth: (month: string) => void
  className?: string
}) {
  return (
    <Select value={month} onValueChange={setMonth}>
      <SelectTrigger className={cn("w-full sm:w-[180px] border-gray-200", className)}>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <SelectValue placeholder="Filter Bulan" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Bulan</SelectItem>
        {MONTHS.map((m, i) => (
          <SelectItem key={i} value={String(i)}>{m}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
