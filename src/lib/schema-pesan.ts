import { z } from "zod";
import { Timestamp } from "firebase/firestore";

export const teleponSchema = z.object({
  nama: z.string().min(2, "Nama harus diisi (minimal 2 karakter)"),
  nomorTelepon: z.string().min(5, "Nomor telepon harus diisi"),
  keperluan: z.string().min(2, "Keperluan harus diisi"),
  keterangan: z.string().optional(),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  jam: z.string().optional(),
});

export type TeleponInput = z.infer<typeof teleponSchema>;

export interface Telepon extends TeleponInput {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const suratSchema = z.object({
  jenisDokumen: z.string().min(2, "Jenis dokumen harus diisi"),
  kodeDokumen: z.string().optional(),
  namaPengirim: z.string().min(2, "Nama pengirim harus diisi"),
  ditujukanKepada: z.string().min(2, "Ditujukan kepada harus diisi"),
  tanggalMasuk: z.string().min(1, "Tanggal masuk harus diisi"),
  diserahkanKepada: z.string().optional(),
  tanggalDiserahkan: z.string().optional(),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  jam: z.string().optional(),
});

export type SuratInput = z.infer<typeof suratSchema>;

export interface Surat extends SuratInput {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
