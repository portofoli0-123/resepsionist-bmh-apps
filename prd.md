Created At: 2026-05-16T12:45:43Z
Completed At: 2026-05-16T12:45:43Z
File Path: `file:///c:/Users/muhaz/Downloads/resepsionis-bmh-apps/prd.md`
Total Lines: 67
Total Bytes: 3862
Showing lines 1 to 67
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: # Product Requirements Document (PRD) - Dashboard Resepsionis MVP (Buku Tamu)
2: 
3: ## 1. Ringkasan Proyek
4: Membangun MVP Dashboard Website Resepsionis yang difokuskan pada satu fitur utama: **Buku Tamu**. Aplikasi ini menggunakan tata letak sederhana dengan hanya satu menu pada sidebar, dirancang agar cepat, responsif, dan terhubung langsung ke database *real-time*.
5: 
6: ## 2. Tech Stack
7: * **Framework Utama:** Next.js (App Router disarankan)
8: * **Styling:** Tailwind CSS
9: * **Komponen UI:** shadcn/ui
10: * **Database:** Firebase Firestore
11: * **Deployment:** Vercel
12: 
13: ## 3. Tema & Desain Antarmuka
14: Sistem warna harus diimplementasikan pada konfigurasi Tailwind (`tailwind.config.js` atau `globals.css`):
15: * **Warna Latar Halaman Dashboard (Main Content):** `#F7F7F7`
16: * **Warna Latar Sidebar dan Navbar:** `#ffffff`
17: * **Warna Primary:** Hijau Emerald (Gunakan palet `emerald` dari Tailwind CSS untuk tombol utama, *active state*, dan aksen).
18: 
19: ## 4. Struktur Layout Utama
20: * **Sidebar:** Hanya memiliki 1 menu yaitu **Buku Tamu**. Tidak boleh ada menu lain untuk MVP ini.
21: * **Navbar:** Header atas sederhana (warna latar `#ffffff`).
22: * **Main Content:** Menampilkan halaman fitur sesuai menu yang dipilih.
23: 
24: ## 5. Spesifikasi Halaman: Buku Tamu
25: Halaman ini adalah pusat pengelolaan pengunjung.
26: 
27: **Header Halaman:**
28: * **Judul:** Buku Tamu
29: * **Deskripsi:** Catat dan kelola data pengunjung gerai secara real-time.
30: 
31: ### 5.1. Filter, Pencarian, & Aksi (Top Bar)
32: Terdapat beberapa kontrol di atas tabel data:
33: * **Kategori Menu Bar (Tabs/Pills):**
34:     Berfungsi untuk memfilter tabel berdasarkan kategori tamu:
35:     1.  Semua Tamu
36:     2.  Donatur
37:     3.  Mustahiq
38:     4.  Kunjungan & Lainnya
39: * **Search Bar:**
40:     * *Placeholder:* `Cari nama atau keperluan...`
41:     * Fungsi: Pencarian teks *real-time* (debounce disarankan) yang menyaring kolom Nama atau Keperluan.
42: * **Action Buttons:**
43:     1.  **+ Tambah Tamu:** Tombol dengan warna *primary* hijau emerald. Membuka form modal/sheet (shadcn `Sheet` atau `Dialog`) untuk menginput data tamu baru ke Firestore.
44:     2.  **Export Excel:** Mengekspor data yang sedang tampil di tabel ke format `.xlsx`.
45:     3.  **Export PDF:** Mengekspor data yang sedang tampil di tabel ke format `.pdf`.
46: 
47: ### 5.2. Tabel Data Pengunjung
48: Menampilkan data yang diambil dari Firebase Firestore. 
49: 
50: **Struktur Kolom Tabel (Header):**
51: 1.  **Nama**
52: 2.  **Kategori** (Sesuai dengan opsi: Donatur, Mustahiq, Kunjungan & Lainnya)
53: 3.  **Waktu/tanggal** -> *Format spesifik:* `HH.mm / DD MMMM YYYY` (Contoh: `08.00 / 02 Februari 2026`)
54: 4.  **Keperluan**
55: 5.  **Aksi** -> Berisi dua tombol/ikon:
56:     * **Edit:** Membuka form modal yang sama dengan "Tambah Tamu" namun terisi data (*pre-filled*) untuk mengubah dokumen di Firestore.
57:     * **Hapus:** Menghapus dokumen dari Firestore (tampilkan dialog konfirmasi terlebih dahulu sebelum menghapus).
58: 
59: ## 6. Instruksi Eksekusi untuk Antigravity Agent
60: 1.  **Inisialisasi:** Buat proyek Next.js, instal Tailwind, dan konfigurasi inisialisasi shadcn/ui.
61: 2.  **Terapkan Warna:** Masukkan kode hex `#F7F7F7` untuk background utama dan `#ffffff` untuk sidebar/navbar. Set primary palette shadcn menggunakan warna *emerald*.
62: 3.  **Komponen UI:** Silakan *generate* dan gunakan komponen shadcn berikut: `Button`, `Input`, `Table`, `Tabs`, `Dialog`/`Sheet`, dan `DropdownMenu` (jika diperlukan untuk aksi tabel).
63: 4.  **Integrasi Firestore:** Buat *service file* untuk koneksi Firebase. Siapkan fungsi CRUD (Create, Read, Update, Delete) untuk koleksi `guests`.
64: 5.  **Perhatikan Skema Form & Zod:** Saat membuat form "Tambah/Edit Tamu" dengan `react-hook-form` dan `zod`, pastikan penulisan enumerasi untuk *Kategori* sudah tepat. Jika menggunakan array terpisah untuk `z.enum`, gunakan `as const` agar menjadi tipe *readonly
65: 6.  **Autentikasi:** Implementasikan halaman login dengan integrasi Firebase Auth.
66: 
67: ---
68: 
69: ## 7. Catatan Tambahan & Pengembangan Mendatang
70: 
71: ### 7.1. Mustahiq Isidentil
72: Field data yang diperlukan untuk pencatatan mustahiq isidentil:
73: *   **Nama**
74: *   **NIK**
75: *   **Alamat**
76: *   **Nominal**
77: 
78: ### 7.2. Logistik & Kepegawaian
79: *   **Paket Masuk:** Fitur untuk mencatat paket/barang yang masuk melalui resepsionis.
80: *   **Amil Keluar:** Pencatatan aktivitas amil yang keluar kantor (Data: Jam Keluar, Keperluan, Nama Amil).
81: 
82: ### 7.3. Pengelolaan Mustahiq
83: *   **Kelola Mustahiq:** Pengembangan fitur khusus untuk manajemen database mustahiq secara menyeluruh (CRUD khusus).