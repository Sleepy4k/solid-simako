export const ROUTES = {
  // Public
  BERANDA: '/',
  CARI_KOST: '/cari-kost',
  DETAIL_KOST: (slug: string) => `/kost/${slug}`,
  CHECKOUT: (roomId: string) => `/checkout/${roomId}`,

  // Auth
  MASUK: '/masuk',
  DAFTAR: '/daftar',
  DAFTAR_MITRA: '/daftar/mitra',
  LUPA_SANDI: '/lupa-sandi',
  VERIFIKASI_OTP: '/verifikasi-otp',
  UPLOAD_KYC: '/upload-kyc',

  // Tenant dashboard
  DASHBOARD_PENYEWA: '/akun',
  PROFIL_PENYEWA: '/akun/profil',
  WISHLIST: '/akun/wishlist',
  KELUHAN_PENYEWA: '/akun/keluhan',

  // Owner (Mitra) dashboard
  DASHBOARD_MITRA: '/mitra',
  PROPERTI_KAMAR: '/mitra/properti',
  TAMBAH_PROPERTI: '/mitra/properti/tambah',
  EDIT_PROPERTI: (id: string) => `/mitra/properti/${id}/edit`,
  TAMBAH_KAMAR: (kostId: string) => `/mitra/properti/${kostId}/kamar/tambah`,
  VERIFIKASI_BOOKING: '/mitra/booking',
  PENYEWA_TAGIHAN: '/mitra/tagihan',
  BROADCAST: '/mitra/broadcast',
  KELUHAN_MITRA: '/mitra/keluhan',
  LAPORAN: '/mitra/laporan',
  PROFIL_MITRA: '/mitra/profil',
  PENGATURAN_MITRA: '/mitra/pengaturan',

  // Admin dashboard
  DASHBOARD_ADMIN: '/admin',
  VERIFIKASI_KYC: '/admin/verifikasi-kyc',
  USER_MANAJEMEN: '/admin/pengguna',
  PROPERTI_TERDAFTAR: '/admin/properti',
  TRANSAKSI_PLATFORM: '/admin/transaksi',
  DISPUTE_CENTER: '/admin/dispute',
  LAPORAN_INSIGHT: '/admin/laporan',
  MASTER_DATA: '/admin/master-data',
  CMS_BANNER: '/admin/cms',
  FAQ: '/admin/faq',
  AUDIT_LOG: '/admin/audit-log',
  PENGATURAN_ADMIN: '/admin/pengaturan',

  // Shared
  CHAT: '/chat',
  NOTIFIKASI: '/notifikasi',
} as const;
