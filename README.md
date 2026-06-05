# SimaKos 🏠

> **Sistem Manajemen Kos** — Platform pencarian dan manajemen kos terpercaya di Purwokerto, Jawa Tengah.

[![Bun](https://img.shields.io/badge/Runtime-Bun-black?style=flat-square)](https://bun.sh)
[![SolidJS](https://img.shields.io/badge/Framework-SolidJS-4f95d3?style=flat-square)](https://solidjs.com)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_v4-06b6d4?style=flat-square)](https://tailwindcss.com)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🔍 **Pencarian Cerdas** | Live preview saat ketik, filter tipe/gender/area/harga |
| 🧠 **Sistem Rekomendasi** | Weighted-sum: popularitas 35%, rating 30%, ketersediaan 20%, recency 15% |
| 📤 **Manual Bank Transfer** | Upload bukti transfer → verifikasi pemilik kos (tanpa payment gateway) |
| 👥 **3 Role Berbeda** | User (penyewa), Tenant (pemilik kos), Admin |
| 📊 **Dashboard ERP** | Sidebar nav, notifikasi, manajemen kamar & verifikasi bayar |
| 🔒 **Auth Aman** | JWT HttpOnly cookie, CSP headers, Zod validation penuh |
| 📱 **Fully Responsive** | Mobile-first, semua halaman adaptif |
| ⚡ **SSR + Lazy Load** | SolidStart SSR, `createAsync` untuk server data |
| 🗺️ **SEO Ready** | Per-page meta tags, sitemap.xml, robots.txt |
| 🔄 **NProgress** | Loading indicator saat navigasi antar halaman |

---

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.1
- MariaDB / MySQL ≥ 10.6

### Development

```bash
# 1. Clone & install
git clone https://github.com/your-username/simakos
cd simakos
bun install

# 2. Environment setup
cp .env.example .env
# Edit .env — isi DB credentials dan JWT_SECRET

# 3. Buat database
mysql -u root -p -e "CREATE DATABASE simakos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Push schema
bun run db:push

# 5. Jalankan dev server
bun dev
# → http://localhost:3000
```

### Production

```bash
bun run build
pm2 start ecosystem.config.cjs --env production
pm2 logs simakos
```

---

## 📁 Struktur Proyek

```
src/
├── app.tsx                  # Router root (NProgress, MetaProvider)
├── app.css                  # Tailwind v4 + NProgress + animasi
├── entry-server.tsx         # SSR entry + security headers otomatis
├── types/index.ts           # Semua TypeScript types
├── config/site.ts           # Metadata, district list, label maps
├── constants/               # Role definitions, sidebar items, facilities
├── lib/
│   ├── client/nprogress.ts  # NProgress wrapper untuk SolidJS
│   ├── server/auth.ts       # JWT (jose), Bun.password, cookie helpers
│   ├── server/security.ts   # CSP headers, sanitize, slugify
│   └── shared/
│       ├── validation.ts    # Semua Zod schemas
│       └── recommendation.ts# Weighted-sum algorithm
├── server/
│   ├── db/schema.ts         # Drizzle schema 3NF (11 tabel)
│   ├── db/index.ts          # mysql2 pool → Drizzle instance
│   └── actions/             # Server actions ("use server")
├── components/              # UI global: Button, Modal, Pagination...
├── features/                # Komponen per halaman/fitur
│   ├── landing/             # Hero, RoomCard, RecommendedRooms, FAQ...
│   ├── search/              # SearchFilters, SearchResults
│   ├── auth/                # Login, Register, RegisterTenant (2-step)
│   └── dashboard/           # DashboardLayout, Sidebar, TopBar
└── routes/                  # File-based routing
    ├── index.tsx            # Landing page
    ├── search.tsx           # Halaman pencarian + pagination
    ├── auth/                # Login & 2 jenis register
    └── dashboard/           # user, tenant, admin dashboards
```

---

## 🗄️ Database

Schema di `src/server/db/schema.ts` (Drizzle ORM, MySQL dialect, 3NF):

| Tabel | Keterangan |
|---|---|
| `users` | Semua akun + role (user/tenant/admin) |
| `tenants` | Info bisnis pemilik (1:1 dengan users) |
| `kost_properties` | Properti kos (lokasi, tipe, gender) |
| `rooms` | Kamar per properti |
| `facilities` + `property_facilities` | Fasilitas + junction |
| `property_images` | Foto per properti |
| `user_favorites` | Favorit penyewa |
| `bookings` | Transaksi sewa |
| `payment_proofs` | Bukti transfer manual |
| `reviews` | Ulasan (1 per booking) |
| `notifications` | Notifikasi per user |

---

## 🧠 Algoritma Rekomendasi

```
score = viewCount×0.35 + avgRating×0.30 + availability×0.20 + recency×0.15
```
Semua dimensi dinormalisasi [0,1]. Recency menggunakan exponential decay `e^(-ageWeeks/4)`.
Implementasi: `src/lib/shared/recommendation.ts`

---

## 🔐 Auth & Security

- JWT dalam **HttpOnly cookie** — aman dari XSS
- Password: **Bun.password.hash()** (bcrypt cost 12)
- **CSP** + security headers di setiap response SSR
- **Zod** validation semua form dan query params
- Role guard via `throw redirect()` di server functions

---

## 🌐 Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=simakos
JWT_SECRET=random_64_char_string
APP_URL=https://simakos.id
PORT=3000
```

---

## 📜 Lisensi

MIT License © 2026 SimaKos - Purwokerto, Jawa Tengah 🇮🇩
