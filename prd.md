# Product Requirements Document (PRD) - Dashboard Resepsionis MVP (Buku Tamu)

## 1. Ringkasan Proyek
Membangun MVP Dashboard Website Resepsionis yang difokuskan pada satu fitur utama: **Buku Tamu**. Aplikasi ini menggunakan tata letak sederhana dengan hanya satu menu pada sidebar, dirancang agar cepat, responsif, dan terhubung langsung ke database *real-time*.

## 2. Tech Stack
* **Framework Utama:** Next.js (App Router disarankan)
* **Styling:** Tailwind CSS
* **Komponen UI:** shadcn/ui
* **Database:** Firebase Firestore
* **Deployment:** Vercel

## 3. Tema & Desain Antarmuka
Sistem warna harus diimplementasikan pada konfigurasi Tailwind (`tailwind.config.js` atau `globals.css`):
* **Warna Latar Halaman Dashboard (Main Content):** `#F7F7F7`
* **Warna Latar Sidebar dan Navbar:** `#ffffff`
* **Warna Primary:** Hijau Emerald (Gunakan palet `emerald` dari Tailwind CSS untuk tombol utama, *active state*, dan aksen).

## 4. Struktur Layout Utama
* **Sidebar:** Hanya memiliki 1 menu yaitu **Buku Tamu**. Tidak boleh ada menu lain untuk MVP ini.
* **Navbar:** Header atas sederhana (warna latar `#ffffff`).
* **Main Content:** Menampilkan halaman fitur sesuai menu yang dipilih.

## 5. Spesifikasi Halaman: Buku Tamu
Halaman ini adalah pusat pengelolaan pengunjung.

**Header Halaman:**
* **Judul:** Buku Tamu
* **Deskripsi:** Catat dan kelola data pengunjung gerai secara real-time.

### 5.1. Filter, Pencarian, & Aksi (Top Bar)
Terdapat beberapa kontrol di atas tabel data:
* **Kategori Menu Bar (Tabs/Pills):**
    Berfungsi untuk memfilter tabel berdasarkan kategori tamu:
    1.  Semua Tamu
    2.  Donatur
    3.  Mustahiq
    4.  Kunjungan & Lainnya
* **Search Bar:**
    * *Placeholder:* `Cari nama atau keperluan...`
    * Fungsi: Pencarian teks *real-time* (debounce disarankan) yang menyaring kolom Nama atau Keperluan.
* **Action Buttons:**
    1.  **+ Tambah Tamu:** Tombol dengan warna *primary* hijau emerald. Membuka form modal/sheet (shadcn `Sheet` atau `Dialog`) untuk menginput data tamu baru ke Firestore.
    2.  **Export Excel:** Mengekspor data yang sedang tampil di tabel ke format `.xlsx`.
    3.  **Export PDF:** Mengekspor data yang sedang tampil di tabel ke format `.pdf`.

### 5.2. Tabel Data Pengunjung
Menampilkan data yang diambil dari Firebase Firestore. 

**Struktur Kolom Tabel (Header):**
1.  **Nama**
2.  **Kategori** (Sesuai dengan opsi: Donatur, Mustahiq, Kunjungan & Lainnya)
3.  **Waktu/tanggal** -> *Format spesifik:* `HH.mm / DD MMMM YYYY` (Contoh: `08.00 / 02 Februari 2026`)
4.  **Keperluan**
5.  **Aksi** -> Berisi dua tombol/ikon:
    * **Edit:** Membuka form modal yang sama dengan "Tambah Tamu" namun terisi data (*pre-filled*) untuk mengubah dokumen di Firestore.
    * **Hapus:** Menghapus dokumen dari Firestore (tampilkan dialog konfirmasi terlebih dahulu sebelum menghapus).

## 6. Instruksi Eksekusi untuk Antigravity Agent
1.  **Inisialisasi:** Buat proyek Next.js, instal Tailwind, dan konfigurasi inisialisasi shadcn/ui.
2.  **Terapkan Warna:** Masukkan kode hex `#F7F7F7` untuk background utama dan `#ffffff` untuk sidebar/navbar. Set primary palette shadcn menggunakan warna *emerald*.
3.  **Komponen UI:** Silakan *generate* dan gunakan komponen shadcn berikut: `Button`, `Input`, `Table`, `Tabs`, `Dialog`/`Sheet`, dan `DropdownMenu` (jika diperlukan untuk aksi tabel).
4.  **Integrasi Firestore:** Buat *service file* untuk koneksi Firebase. Siapkan fungsi CRUD (Create, Read, Update, Delete) untuk koleksi `guests`.
5.  **Perhatikan Skema Form & Zod:** Saat membuat form "Tambah/Edit Tamu" dengan `react-hook-form` dan `zod`, pastikan penulisan enumerasi untuk *Kategori* sudah tepat. Jika menggunakan array terpisah untuk `z.enum`, gunakan `as const` agar menjadi tipe *readonly


dan halaman login integrasi Firebase auth