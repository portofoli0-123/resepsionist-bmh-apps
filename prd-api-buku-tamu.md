PRD: Fitur Buku Tamu Digital (Guest Book) - Resepsionis BMH
1. Ringkasan Fitur
Judul: Buku Tamu

Deskripsi: Modul utama untuk mencatat, memantau, dan mengelola seluruh data pengunjung yang datang ke gerai cabang secara real-time. Fitur ini berfungsi sebagai basis data awal untuk identifikasi Donatur maupun Mustahiq.

2. Spesifikasi Teknis & Visual
Framework: Next.js (App Router)

Komponen UI: shadcn/ui (Table, Tabs, Dialog, Calendar, Badge)

Styling: Tailwind CSS (Emerald-700 untuk elemen aktif/tombol utama)

Database: Supabase (PostgreSQL) dengan proteksi RLS per kantor cabang.

Animasi: Framer Motion (Transisi halus pada popup dan pemuatan tabel).

3. Detail Antarmuka (UI/UX)
A. Filter Menu Bar (Tabs)
Gunakan komponen Tabs dari shadcn untuk memisahkan kategori tamu secara visual.

Semua Tamu: Menampilkan seluruh log pengunjung.

Donatur: Filter otomatis untuk kategori 'Donatur'.

Mustahiq: Filter otomatis untuk kategori 'Mustahiq'.

Kunjungan & Lainnya: Filter untuk kategori luar donasi/sosial (misal: tamu dinas, kurir, kerjasama).

B. Header Tabel (Data Table)
Tabel harus memiliki fitur sorting dan sticky header. Kolom wajib:

Nama Tamu: Menampilkan nama lengkap.

Kategori: Badge berwarna (Emerald untuk Donatur, Amber untuk Mustahiq, Slate untuk Lainnya).

Waktu Kedatangan: Format: HH:mm (Hari ini) atau DD/MM/YYYY.

Keperluan: Ringkasan singkat tujuan kunjungan.

Aksi: Tombol Edit (Ikon Pencil) dan Hapus (Ikon Trash).

C. Kontrol & Filter Lanjutan
Letakkan di atas tabel, sejajar dengan tombol "Tamu Baru":

Date Picker Range: Filter berdasarkan Tanggal, Bulan, dan Tahun (misal: "1 Mei - 31 Mei 2024").

Search Bar: Pencarian cepat berdasarkan Nama atau Keperluan.

4. Alur Kerja CRUD & Popup
[C]reate - Tambah Tamu Baru
Pemicu: Button "Tamu Baru" (Style: bg-emerald-700, ikon Plus).

UI: Muncul Dialog (Popup) di tengah layar.

Input Field:

Nama Lengkap (Text)

No. WhatsApp (Tel) - Gunakan untuk integrasi notifikasi ke depannya.

Kategori (Select: Donatur, Mustahiq, Kerjasama, Lainnya)

Keperluan (Textarea)

Instansi (Text - Optional)

[R]ead - Tampilan Data
Data ditarik dari Supabase dengan filter kantor_id (User hanya melihat tamu di kantornya sendiri).

Implementasikan Skeleton Load saat data sedang dimuat.

[U]pdate - Edit Data
Menggunakan popup yang sama dengan form "Tambah Baru", namun data sudah terisi secara otomatis (pre-filled).

[D]elete - Hapus Data
Munculkan AlertDialog konfirmasi ("Apakah Anda yakin ingin menghapus data ini?") untuk mencegah penghapusan tidak sengaja.

5. Struktur Data (Supabase Insight)
Pastikan tabel buku_tamu memiliki kolom berikut:

id: uuid (Primary Key)

created_at: timestamptz (Waktu kedatangan)

kantor_id: uuid (Foreign Key ke tabel kantor)

nama: text

kategori: enum ('donatur', 'mustahiq', 'kerjasama', 'lainnya')

keperluan: text

no_whatsapp: text