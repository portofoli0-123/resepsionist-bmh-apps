import * as z from "zod";

export const CATEGORIES = ["Donatur", "Mustahiq", "Kunjungan & Lainnya"] as const;

export const guestSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  whatsapp: z.string().optional(),
  kategori: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Pilih kategori yang valid" }),
  }),
  keperluan: z.string().optional(),
  institusi: z.string().optional(),
  waktu: z.any().optional(), // Firestore Timestamp
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  jam: z.string().optional(),
});

export type Guest = z.infer<typeof guestSchema> & { id: string; createdAt: any };
