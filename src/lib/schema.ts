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

export const amilKeluarSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  keperluan: z.string().min(1, "Keperluan harus diisi"),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  jam: z.string().optional(),
});

export type AmilKeluar = z.infer<typeof amilKeluarSchema> & { id: string; createdAt: any };

export const mustahiqUangSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  nominal: z.preprocess((val) => Number(val), z.number().min(0, "Nominal tidak boleh negatif")),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  jam: z.string().optional(),
});

export type MustahiqUang = z.infer<typeof mustahiqUangSchema> & { id: string; createdAt: any };
