export const MSG = {
  // Auth
  EMAIL_WAJIB: 'Email wajib diisi',
  EMAIL_TIDAK_VALID: 'Format email tidak valid',
  SANDI_WAJIB: 'Kata sandi wajib diisi',
  SANDI_MIN: 'Kata sandi minimal 8 karakter',
  SANDI_TIDAK_COCOK: 'Konfirmasi kata sandi tidak cocok',
  OTP_TIDAK_VALID: 'Kode OTP tidak valid atau sudah kedaluwarsa',
  LOGIN_GAGAL: 'Email atau kata sandi salah',
  AKUN_TERSUSPEND: 'Akun Anda telah disuspend. Hubungi admin untuk bantuan.',

  // Form
  WAJIB_DIISI: 'Kolom ini wajib diisi',
  TERLALU_PENDEK: (min: number) => `Minimal ${min} karakter`,
  TERLALU_PANJANG: (max: number) => `Maksimal ${max} karakter`,
  ANGKA_POSITIF: 'Harus berupa angka positif',
  URL_TIDAK_VALID: 'Format URL tidak valid',

  // File
  FILE_TERLALU_BESAR: (maxMb: number) => `Ukuran file maksimal ${maxMb} MB`,
  FORMAT_TIDAK_DIDUKUNG: 'Format file tidak didukung',

  // General
  BERHASIL_DISIMPAN: 'Data berhasil disimpan',
  BERHASIL_DIHAPUS: 'Data berhasil dihapus',
  GAGAL_MEMUAT: 'Gagal memuat data. Silakan coba lagi.',
  TERJADI_KESALAHAN: 'Terjadi kesalahan. Silakan coba lagi.',
  TIDAK_ADA_AKSES: 'Anda tidak memiliki akses ke halaman ini.',
  SESI_BERAKHIR: 'Sesi Anda telah berakhir. Silakan masuk kembali.',
} as const;
