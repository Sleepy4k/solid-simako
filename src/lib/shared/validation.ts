import { z } from 'zod';

export const emailSchema = z.string().email('Format email tidak valid').toLowerCase();
export const passwordSchema = z
  .string()
  .min(8, 'Kata sandi minimal 8 karakter')
  .max(128, 'Kata sandi terlalu panjang');
export const phoneSchema = z
  .string()
  .regex(/^(\+62|62|0)8\d{8,12}$/, 'Format nomor HP tidak valid');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export const registerUserSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter').max(120),
  email: emailSchema,
  password: passwordSchema,
  telepon: phoneSchema,
});

export const registerOwnerSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter').max(120),
  email: emailSchema,
  password: passwordSchema,
  telepon: phoneSchema,
  namaUsaha: z.string().min(2).max(120).optional(),
  kota: z.string().min(2).max(80),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: passwordSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  kode: z.string().regex(/^\d{6}$/, 'Kode OTP harus 6 digit'),
});

// Profile
export const updateUserProfileSchema = z.object({
  namaLengkap: z.string().min(3).max(120),
  telepon: phoneSchema.optional().or(z.literal('')),
  alamat: z.string().max(500).optional().or(z.literal('')),
  tanggalLahir: z.string().optional().or(z.literal('')),
  jenisKelamin: z.enum(['L', 'P']).optional().or(z.literal('')),
  kampusId: z.coerce.number().int().positive().optional(),
});

// Kost (BoardingHouse)
export const kostFormSchema = z.object({
  nama: z.string().min(3).max(180),
  deskripsi: z.string().max(2000).optional().or(z.literal('')),
  alamat: z.string().min(5).max(500),
  kota: z.string().min(2).max(80),
  kodePos: z.string().max(10).optional().or(z.literal('')),
  jenisKelamin: z.enum(['PUTRA', 'PUTRI', 'CAMPUR']),
  kampusId: z.coerce.number().int().positive().optional(),
  facilities: z.array(z.coerce.number().int().positive()).default([]),
});

// Room
export const roomFormSchema = z.object({
  nomorKamar: z.string().min(1).max(20),
  lantai: z.coerce.number().int().min(0).max(20).optional(),
  hargaBulan: z.coerce.number().int().positive(),
  hargaTahun: z.coerce.number().int().positive().optional(),
  kapasitas: z.coerce.number().int().positive().default(1),
  deskripsi: z.string().max(1000).optional().or(z.literal('')),
  facilities: z.array(z.coerce.number().int().positive()).default([]),
});

// Booking
export const createBookingSchema = z.object({
  roomId: z.string().uuid(),
  tanggalMulai: z.string().min(10),
  durasiBulan: z.coerce.number().int().min(1).max(24),
  catatan: z.string().max(500).optional().or(z.literal('')),
});

// Transaction proof
export const uploadProofSchema = z.object({
  transactionId: z.string().uuid(),
  nomorReferensi: z.string().max(80).optional().or(z.literal('')),
  namaBank: z.string().max(80).optional().or(z.literal('')),
});

// Complaint
export const complaintFormSchema = z.object({
  boardingHouseId: z.string().uuid().optional(),
  judul: z.string().min(5).max(200),
  deskripsi: z.string().min(10).max(2000),
  kategori: z.string().min(2).max(80),
  prioritas: z.enum(['RENDAH', 'SEDANG', 'TINGGI', 'KRITIS']).default('SEDANG'),
});

// Review
export const reviewSchema = z.object({
  boardingHouseId: z.string().uuid(),
  rentalId: z.string().uuid().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  komentar: z.string().max(1000).optional().or(z.literal('')),
});

// Chat
export const chatMessageSchema = z.object({
  chatRoomId: z.string().uuid(),
  konten: z.string().min(1).max(2000),
});

export const newChatRoomSchema = z.object({
  boardingHouseId: z.string().uuid(),
  pesanAwal: z.string().min(1).max(2000),
});

// Broadcast
export const broadcastSchema = z.object({
  judul: z.string().min(3).max(200),
  konten: z.string().min(10).max(2000),
  boardingHouseId: z.string().uuid().optional(),
});

// Owner bank
export const ownerBankSchema = z.object({
  namaBank: z.string().min(2).max(80),
  rekeningNo: z.string().min(5).max(40),
  rekeningNama: z.string().min(2).max(120),
});

// Search
export const searchKostSchema = z.object({
  q: z.string().optional(),
  kampusId: z.coerce.number().int().positive().optional(),
  kota: z.string().optional(),
  jenisKelamin: z.enum(['PUTRA', 'PUTRI', 'CAMPUR']).optional(),
  hargaMin: z.coerce.number().int().min(0).optional(),
  hargaMax: z.coerce.number().int().min(0).optional(),
  facilities: z.array(z.coerce.number()).optional(),
  sort: z.enum(['populer', 'termurah', 'termahal', 'terbaru']).default('populer'),
  page: z.coerce.number().int().positive().default(1),
});

// Admin
export const suspendUserSchema = z.object({
  userId: z.string().uuid(),
  alasan: z.string().min(5).max(500),
});

export const kycDecisionSchema = z.object({
  ownerProfileId: z.string().uuid(),
  decision: z.enum(['APPROVE', 'REJECT']),
  catatan: z.string().max(500).optional().or(z.literal('')),
});

export const masterCampusSchema = z.object({
  nama: z.string().min(2).max(180),
  singkatan: z.string().min(2).max(20),
  kota: z.string().min(2).max(80),
  alamat: z.string().max(500).optional().or(z.literal('')),
});

export const masterBankSchema = z.object({
  nama: z.string().min(2).max(100),
  kode: z.string().min(2).max(10),
});

export const masterFacilitySchema = z.object({
  nama: z.string().min(2).max(100),
  icon: z.string().max(50).optional().or(z.literal('')),
  kategori: z.string().min(2).max(50),
});

export const faqSchema = z.object({
  pertanyaan: z.string().min(5).max(500),
  jawaban: z.string().min(5).max(5000),
  kategori: z.string().min(2).max(80),
  urutan: z.coerce.number().int().min(0).default(0),
});

export const cmsBannerSchema = z.object({
  judul: z.string().min(3).max(180),
  deskripsi: z.string().max(500).optional().or(z.literal('')),
  linkUrl: z.string().url().optional().or(z.literal('')),
  placement: z.enum(['HERO', 'SIDEBAR', 'TENGAH']).default('HERO'),
  urutan: z.coerce.number().int().min(0).default(0),
  mulaiAt: z.string().optional().or(z.literal('')),
  berakhirAt: z.string().optional().or(z.literal('')),
});

export const articleSchema = z.object({
  judul: z.string().min(5).max(240),
  ringkasan: z.string().max(500).optional().or(z.literal('')),
  konten: z.string().min(50),
  kategori: z.string().min(2).max(80),
  isPublished: z.coerce.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type KostFormInput = z.infer<typeof kostFormSchema>;
export type RoomFormInput = z.infer<typeof roomFormSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export function parseFormData<T extends z.ZodTypeAny>(schema: T, data: FormData): z.infer<T> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of data.entries()) {
    const existing = obj[k];
    if (existing === undefined) {
      obj[k] = v;
    } else if (Array.isArray(existing)) {
      existing.push(v);
    } else {
      obj[k] = [existing, v];
    }
  }
  return schema.parse(obj);
}

export interface ActionError {
  ok: false;
  message: string;
  fields?: Record<string, string>;
}

export interface ActionOk<T = undefined> {
  ok: true;
  data?: T;
  message?: string;
}

export type ActionResult<T = undefined> = ActionOk<T> | ActionError;

export function actionError(message: string, fields?: Record<string, string>): ActionError {
  return { ok: false, message, fields };
}

export function actionOk<T>(data?: T, message?: string): ActionOk<T> {
  return { ok: true, data, message };
}

export function handleZodError(err: unknown): ActionError {
  if (err instanceof z.ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.');
      if (key) fields[key] = issue.message;
    }
    return actionError(err.issues[0]?.message ?? 'Input tidak valid', fields);
  }
  if (err instanceof Error) return actionError(err.message);
  return actionError('Terjadi kesalahan tak terduga');
}
