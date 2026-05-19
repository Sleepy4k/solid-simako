# Simako - Manajemen Kost (Purwokerto)

## Project Overview
Simako adalah aplikasi web hibrida SSR/SSG berkinerja tinggi untuk manajemen kost. Sistem ini tidak menggunakan payment gateway otomatis, melainkan mengandalkan transfer bank manual dan verifikasi *human-checked*. Seluruh antarmuka dan *endpoint* menggunakan **Bahasa Indonesia**.

## Tech Stack
- **Framework:** SolidStart v2
- **Runtime & Package:** Bun
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3/v4
- **Icons:** `lucide-solid`
- **Database ORM:** Prisma (MariaDB)
- **Validation:** Zod

## Strict Development Rules

### 1. Code Style & Formatting
- Wajib menggunakan **ESLint** dan **Prettier**.
- Aturan Prettier: Indentasi **2 spaces**, *semi-colons* aktif, *single quotes* untuk JS/TS.
- Gunakan `prettier-plugin-tailwindcss` untuk mengurutkan *class* utilitas secara otomatis.

### 2. Lingkungan (Environment Variables) & Keamanan
- Pisahkan variabel lingkungan secara ketat. Variabel server (seperti `DATABASE_URL`, rahasia JWT) TIDAK BOLEH diekspos ke klien.
- Gunakan argon2 untuk enkripsi seperti password, dan pastikan semua operasi kriptografi dilakukan di server.
- Gunakan validasi skema (Zod) untuk `env` di file `src/config/env.ts` agar aplikasi gagal berjalan jika `.env` tidak lengkap.
- Gunakan awalan `VITE_` HANYA untuk variabel yang benar-benar butuh diakses oleh klien (contoh: `VITE_APP_URL`).
- Terapkan *Security Headers* (CSP, X-Frame-Options) di *middleware* SolidStart.

### 3. Server-Side Heavy & Data Fetching
- **Zero Client-Side Fetching:** SEMUA pengambilan data harus terjadi di server menggunakan `routeData`, `cache`, atau *Server Actions*.
- Jangan pernah mengekspos pemanggilan Prisma atau API eksternal langsung ke klien.
- Migrasi Prisma dilakukan per tabel/fitur (`bunx prisma migrate dev --name init_nama_tabel --create-only`).

### 4. SEO & Metadata
- Terapkan SEO secara menyeluruh (Title, Description, Open Graph, Twitter Cards, Canonical, Favicon/Icons, dan lain nya).
- Halaman dinamis (seperti `/kost/:id`) HARUS mengambil data di server (`routeData`) dan menyuntikkannya ke komponen `<Title>` dan `<Meta>` dari `@solidjs/meta` agar terbaca sempurna oleh mesin pencari.

### 5. Standar UI/UX & Bahasa
- **Responsivitas:** Wajib menggunakan pendekatan *mobile-first* (`md:`, `lg:`).
- **Bahasa Indonesia:** Seluruh teks UI, *toast notification*, pesan error, hingga nama *endpoint* (URL routing) wajib menggunakan bahasa Indonesia (contoh: `/masuk`, `/dasbor`, `/pengaturan`).
- **NProgress:** Wajib memasang indikator *loading bar* di bagian atas layar saat navigasi antar rute.
- **Skeleton Loader:** Gunakan komponen Skeleton sebagai *fallback* di dalam `<Suspense>` saat memuat data dari server. Jangan gunakan spinner biasa untuk *layout* utama.
- **Toast / Notifikasi:** Implementasikan sistem Toast yang jelas (Sukses, Peringatan, Error) untuk merespons setiap aksi pengguna (misal: "Bukti transfer berhasil diunggah").
- **Scrollbar**: Pastikan scrollbar selalu terlihat di desktop untuk menghindari *layout shift* saat memuat data, tetapi sembunyikan di perangkat mobile, dan ubah style scrollbar di desktop agar lebih tipis dan modern.

## Directory Structure
/design                 # Mockup/wireframe referensi desain
/prisma                 # schema.prisma, migrations, seed
/public                 # Aset statis, favicon, manifest
/src
  /assets               # SVG internal, gambar
  /components
    /form               # Input dengan validasi Zod
    /shared             # Komponen global: Toast, Sidebar, NProgress
    /ui                 # Komponen stateless: Button, Card, Skeleton
  /config               # Konfigurasi app, validasi ZOD untuk ENV
  /constants            # Rute dan pesan error (Bahasa Indonesia)
  /features             # Modul UI spesifik domain
  /layouts              # AppLayout, AuthLayout
  /lib
    /client             # Helper spesifik browser
    /server             # Helper server (kriptografi, dll)
    /shared             # Helper universal
  /middleware           # Global request/response, security headers
  /routes               # Rute file-based (URL Bahasa Indonesia)
  /server
    /actions            # SolidStart Server Actions (RPC)
    /db                 # Instansi Prisma
    /services           # Layer logika bisnis
  /templates            # Template email HTML
  /types                # Deklarasi TypeScript global