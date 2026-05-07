# PRD Frontend: Aplikasi Dashboard Resepsionis BMH

## 1. Ikhtisar Proyek
Dokumen ini mendefinisikan spesifikasi antarmuka pengguna (Frontend Product Requirements Document) untuk **Aplikasi Dashboard Resepsionis BMH**. Fokus utama adalah pada standarisasi visual, tema (Light/Dark Mode), struktur navigasi, dan teknologi spesifik yang digunakan untuk memastikan pengalaman pengguna (UX) yang optimal bagi resepsionis cabang.

## 2. Tech Stack
Aplikasi akan dikembangkan dengan standar industri terkini:
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **UI Component Library:** shadcn/ui
* **State Management & Tema:** `next-themes` (terintegrasi dengan shadcn/ui untuk pergantian mode)
* **Animasi & Interaksi:** framer-motion (untuk animasi UI dan SVG yang halus).
* **Manajemen Form & Validasi:** react-hook-form + zod (karena aplikasi resepsionis akan banyak menggunakan form input buku tamu, donatur, dll. Ini adalah standar bawaan Shadcn/ui untuk form).
* **Library Ikon:** lucide-react (Ikon standar yang digunakan oleh Shadcn/ui).
* **Notifikasi / Feedback:** sonner atau komponen Toast dari shadcn (Wajib ada untuk memberi notifikasi "Data Tamu Berhasil Disimpan" atau error).
* **Frontend-Backend Integration:** @supabase/ssr atau @supabase/supabase-js (Untuk mengelola session auth dan memanggil data Supabase dari sisi Client/Frontend).

## 3. Panduan Tema & Visual (Theming)
Sistem ini menggunakan dua mode visual yang dapat disesuaikan:
* **Font Utama:** Menggunakan font sans-serif yang bersih dan profesional seperti Inter, Geist, atau Poppins (di-load optimal menggunakan next/font/google).

### A. Tema Terang (Light Mode)
* **Background Utama (Global):** `#F7F7F7` (Abu-abu sangat terang, memberikan kesan bersih).
* **Background Komponen (Sidebar, Navbar, Card):** `#FFFFFF` (Putih murni).
* **Aksen / Warna Utama (Primary):** Hijau Emerald.
    * Digunakan pada: Tombol (Button), Grafik (Chart), Ikon, Label aktif.
    * Skala Tailwind: `emerald-700` (`#047857`) hingga `emerald-800` (`#065f46`).

### B. Tema Gelap (Dark Mode)
* **Background & Nuansa Utama:** Hijau Emerald Gelap (Dark Emerald Green).
* *Detail Implementasi:* * Background utama menggunakan warna turunan gelap dari emerald (misal: `emerald-950` atau `#022c22`).
    * Komponen seperti Sidebar, Navbar, dan Card menggunakan emerald yang sedikit lebih terang (misal: `emerald-900`) untuk memberikan kontras hierarki visual.
    * Teks disesuaikan menjadi warna terang/putih agar tetap memiliki *readability* yang tinggi.

## 4. Struktur Navigasi & Tata Letak (Layout)
Layout utama akan menggunakan pola **Sidebar (kiri)** dan **Navbar (atas)**.

### Sidebar Menu
Daftar menu navigasi pada sidebar:
1.  **Dashboard** (Aktif)
2.  **Buku Tamu** (Aktif)
3.  **Setting** (Status: *Disabled* / Tidak bisa diklik). Implementasi UI: Mengurangi *opacity* (misal: `opacity-50`) dan memberikan *cursor-not-allowed* serta menonaktifkan properti tautan.

## 5. Spesifikasi Halaman (Page Details)

### 5.1. Halaman Dashboard (`/dashboard`)
* **Deskripsi:** Halaman pendaratan utama saat resepsionis berhasil login.
* **Komponen Utama:** * Kartu statistik ringkasan kunjungan.
    * Grafik/Chart (berwarna `emerald-700` ke `emerald-800` pada mode terang).

### 5.2. Halaman Buku Tamu (`/buku-tamu`)
* **Deskripsi:** Halaman operasional utama untuk pencatatan dan pelacakan tamu yang datang ke gerai BMH.
* **Struktur Khusus:** Harus memiliki **Menu Bar (Tab Navigation)** di bagian atas halaman (di bawah Navbar/Header halaman).
* **Daftar Keperluan Tab Menu Bar:**
    1.  **Donatur**
    2.  **Mustahiq**
    3.  **Kerjasama**
    4.  **Lainnya**
* *Catatan UI:* Saat tab aktif, garis bawah (underline) atau *background badge* harus menggunakan warna hijau emerald utama.

### 5.3. Halaman Setting (`/setting`)
* **Deskripsi:** Disediakan dalam struktur menu namun saat ini aksesnya dibatasi untuk role tertentu atau sedang dalam pengembangan.
* **Interaksi Frontend:** Menu `Setting` dirender namun dikunci (`disabled`).

* **Global Quick Search (Command Palette):** Menambahkan fitur pencarian instan menggunakan shortcut keyboard Ctrl + K (atau Cmd + K) yang bisa diakses dari halaman mana saja untuk mencari nama Mustahiq/Donatur dengan cepat. (Gunakan komponen Command dari shadcn).
* **Tabel Log Tamu:** Di dalam Halaman Buku Tamu, sebutkan bahwa daftar tamu ditampilkan menggunakan komponen Data Table (TanStack Table terintegrasi shadcn) yang mendukung Pagination (pembagian halaman) agar frontend tidak berat saat meload ribuan data.
* **Loading State & Skeleton:** Wajib menampilkan animasi Skeleton (efek loading abu-abu) saat data sedang ditarik dari database, agar UI tidak terlihat freeze atau blank.

## 6. Struktur Direktori (Next.js App Router)
Rekomendasi penataan file untuk mengisolasi logika dan tampilan sesuai aturan:

## 7. Catatan Teknis Frontend
Pastikan konfigurasi di tailwind.config.ts untuk meregistrasi warna kustom:

JavaScript
theme: {
  extend: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: {
        DEFAULT: "var(--primary)",
        // Setting nilai emerald-700 ke 800
      }
    }
  }
}


## 8. Ketentuan Responsivitas (Responsive Design)
Aplikasi resepsionis sering kali tidak hanya dibuka di PC/Laptop, tapi kadang di Tablet/iPad. Tambahkan bagian ini:

* **Target Perangkat:** Aplikasi menggunakan pendekatan Desktop-First namun wajib adaptif (responsive) untuk ukuran layar Tablet (minimal 768px).
* **Perilaku Sidebar di Mobile/Tablet:** Pada layar kecil, Sidebar utama harus berubah menjadi Hamburger Menu (Sheet component dari shadcn) agar tidak memakan ruang layar.

## 9. Catatan Penting
    * **Penting untuk diperhatikan:** Meskipun "Proyek ini adalah proyek internal", namun untuk urusan keamanan (user data dan data donatur/mustahiq), *privacy concern*, dan *legal compliance*, **penggunaan framework yang resmi dan teruji** seperti Next.js dengan struktur folder yang rapi (seperti yang dijelaskan di atas) sangat dianjurkan untuk menghindari *vulnerability* dan mempermudah *maintenance* di kemudian hari. Selain itu, dengan struktur yang rapi, jauh lebih mudah memisahkan *frontend* (apa yang dilihat pengguna) dan *backend* (logika server/database), sehingga lebih aman dan terorganisir.


### Tinjauan Cepat Struktur Folder di Projek ini:

```text
src/
├── app/
│   ├── middleware.ts               <-- PENTING: Untuk filter role & redirect
│   ├── (auth)/                     <-- Grup Halaman Auth
│   │   └── login/
│   │       └── page.tsx            <-- SATU-SATUNYA halaman login untuk 3 role
│   ├── (admin)/                    // Route Group: Akses khusus Admin
│   │   ├── layout.tsx              
│   │   ├── dashboard/
│   │   │   └── page.tsx            
│   │   └── setting/
│   │       └── page.tsx            
│   ├── (resepsionis)/              // Route Group: Akses khusus Resepsionis
│   │   ├── layout.tsx              
│   │   ├── dashboard/
│   │   │   └── page.tsx            
│   │   └── buku-tamu/
│   │       └── page.tsx            // Berisi Tabs komponen (Donatur, Mustahiq, Kerjasama, Lainnya)
│   └── (prodaya)/                  // Route Group: Akses khusus Prodaya
│       ├── layout.tsx              
│       └── dashboard/
│           └── page.tsx            
├── components/
│   ├── shared/
│   │   ├── Sidebar.tsx             // Navigasi menu utama (dinamis sesuai role)
│   │   ├── Navbar.tsx              // Top bar
│   │   └── ThemeToggle.tsx         // Tombol ganti tema (Terang/Gelap)
│   ├── forms/              <-- BARU: Tempat menyimpan komponen form (FormBukuTamu.tsx, dll)
│   ├── skeletons/          <-- BARU: Tempat menyimpan UI loading skeleton
│   └── ui/                      // Komponen bawaan Shadcn UI (Tabs, Button, dll)
└── lib/
    └── utils.ts



