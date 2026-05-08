import * as z from "zod";

export const CATEGORIES = ["Donatur", "Mustahiq", "Kunjungan & Lainnya"] as const;

export const guestSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  kategori: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Pilih kategori yang valid" }),
  }),
  keperluan: z.string().min(5, "Keperluan minimal 5 karakter"),
  waktu: z.any().optional(), // Firestore Timestamp
});

export type Guest = z.infer<typeof guestSchema> & { id: string; createdAt: any };
