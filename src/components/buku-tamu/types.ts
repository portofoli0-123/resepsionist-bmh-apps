export type GuestCategory = "donatur" | "mustahiq" | "kerjasama" | "lainnya"

export interface Guest {
  id: string
  nama: string
  no_whatsapp: string
  kategori: GuestCategory
  keperluan: string
  instansi?: string
  created_at: string // ISO timestamp
}

export const CATEGORY_OPTIONS: { value: GuestCategory; label: string }[] = [
  { value: "donatur", label: "Donatur" },
  { value: "mustahiq", label: "Mustahiq" },
  { value: "kerjasama", label: "Kerjasama" },
  { value: "lainnya", label: "Lainnya" },
]

// Badge color mapping per PRD: Emerald=Donatur, Amber=Mustahiq, Slate=Lainnya
export const CATEGORY_BADGE_STYLES: Record<GuestCategory, string> = {
  donatur: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950",
  mustahiq: "bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950",
  kerjasama: "bg-sky-500 text-white dark:bg-sky-400 dark:text-sky-950",
  lainnya: "bg-slate-500 text-white dark:bg-slate-400 dark:text-slate-950",
}


// SAMPLE_GUESTS removed. Data now fetched from Supabase.
