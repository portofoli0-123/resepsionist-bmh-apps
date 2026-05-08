# Implementation Plan - Dashboard Resepsionis MVP (Buku Tamu) [REVISED]

Membangun aplikasi Dashboard Resepsionis sesuai dengan spesifikasi di `prd.md`. [cite_start]Aplikasi akan fokus *hanya* pada fitur Buku Tamu dengan integrasi Firebase Firestore[cite: 11, 35].

## User Review Required

> [!IMPORTANT]
> [cite_start]**Terminal Command Issue:** Saya mengalami kendala teknis saat mencoba menjalankan perintah terminal (seperti `npx` atau `npm`)[cite: 12]. [cite_start]Error yang muncul adalah "failed to set up sandbox: sandboxing is not supported on Windows"[cite: 13]. 
> **Mohon bantuannya untuk:**
> [cite_start]1. Mematikan **"Strict Mode"** di Pengaturan Agen (Agent Settings) jika aktif[cite: 14].
> [cite_start]2. Mematikan **"Enable Shell Integration"** di Pengaturan (Settings) jika aktif[cite: 15].
> [cite_start]3. Restart aplikasi Antigravity setelah perubahan dilakukan[cite: 15].
> [cite_start]4. Jika tetap tidak bisa, saya akan tetap menuliskan kode ke file, namun Anda mungkin perlu menjalankan `npm install` dan perintah inisialisasi secara manual di folder `resepsionis-apps`[cite: 16].

## Proposed Changes

### Project Initialization
[cite_start]Saya akan membuat struktur dasar proyek Next.js secara manual jika perintah inisialisasi gagal[cite: 17]. 

#### [NEW] package.json
Mendefinisikan dependensi standar dan form: `next`, `react`, `react-dom`, `firebase`, `lucide-react`, `clsx`, `tailwind-merge`, `shadcn/ui` components, `date-fns`, `xlsx`, `jspdf`, `jspdf-autotable`.
[cite_start]**Ditambahkan:** `react-hook-form`, `@hookform/resolvers`, dan `zod` untuk penanganan form.

#### [NEW] tailwind.config.js
[cite_start]Konfigurasi palet warna emerald dan warna latar sesuai PRD (`#F7F7F7` untuk latar dan `#ffffff` untuk sidebar/navbar)[cite: 19].

### Firebase Integration
#### [NEW] src/lib/firebase.ts
[cite_start]Inisialisasi Firebase menggunakan kredensial yang akan disiapkan di `.env.local`[cite: 20].

#### [NEW] .env.local
[cite_start]Menyimpan kredensial Firebase[cite: 20].

### Layout & Components
#### [NEW] src/app/layout.tsx
[cite_start]Root layout dengan font Inter/Plus Jakarta Sans dan provider yang diperlukan[cite: 21].

#### [NEW] src/components/layout/Sidebar.tsx
[cite_start]Sidebar dengan satu menu: Buku Tamu[cite: 22].

#### [NEW] src/components/layout/Navbar.tsx
[cite_start]Navbar sederhana warna putih[cite: 22].

### Buku Tamu Page
#### [NEW] src/app/(resepsionis)/buku-tamu/page.tsx
[cite_start]Halaman utama Buku Tamu dengan filter tabs, search bar, dan tabel[cite: 23].

#### [NEW] src/components/guest/GuestTable.tsx
[cite_start]Tabel data pengunjung dengan aksi Edit dan Hapus[cite: 24]. [cite_start]Menggunakan `date-fns` dengan *locale* `id` (Indonesia) agar format tanggal sesuai spesifikasi (contoh: 08.00/02 Februari 2026)[cite: 38, 39].

#### [NEW] src/components/guest/GuestForm.tsx & src/lib/schema.ts
[cite_start]Form dialog/sheet untuk Tambah/Edit tamu menggunakan `react-hook-form` dan `zod`[cite: 24, 30]. [cite_start]**Penting:** Array pilihan kategori untuk Zod enum akan menggunakan `as const` di bagian akhir untuk mengunci tipe datanya menjadi *tuple readonly*, sehingga mencegah *error ts(2769)*[cite: 32, 33, 53].

## Verification Plan

### Manual Verification
1. [cite_start]Jalankan `npm install` (oleh user jika agen tidak memiliki akses eksekusi terminal)[cite: 25].
2. [cite_start]Jalankan `npm run dev`[cite: 25].
3. [cite_start]Verifikasi tampilan antarmuka sesuai dengan sistem warna di PRD[cite: 26].
4. [cite_start]Test operasi CRUD pada Buku Tamu ke Firestore[cite: 26].
5. [cite_start]Test fungsi *filter* tab dan *search bar*[cite: 26].
6. [cite_start]Test Export tabel ke Excel/PDF[cite: 27].
7. [cite_start]**Test Deployment:** Lakukan *deploy* aplikasi ke Vercel untuk memastikan build berhasil dan aplikasi berjalan mulus di *production*[cite: 40, 41].