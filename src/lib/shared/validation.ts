import { z } from "zod";

const phone = z.union([
  z.string().trim().regex(
    /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
    "Nomor telepon tidak valid (format Indonesia)"
  ),
  z.literal(""),
]).optional();

const password = z
  .string()
  .min(8,  "Kata sandi minimal 8 karakter")
  .max(72, "Kata sandi maksimal 72 karakter")
  .regex(/[A-Z]/, "Kata sandi harus mengandung huruf kapital")
  .regex(/[0-9]/, "Kata sandi harus mengandung angka");

export const loginSchema = z.object({
  email:    z.string().trim().email("Email tidak valid").max(255),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export const registerUserSchema = z
  .object({
    name:            z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
    email:           z.string().trim().email("Email tidak valid").max(255),
    phone,
    password,
    confirmPassword: z.string(),
    agreeTerms:      z.string().refine(v => v === "on", "Anda harus menyetujui syarat & ketentuan"),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export const registerTenantSchema = z
  .object({
    name:            z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
    email:           z.string().trim().email("Email tidak valid").max(255),
    phone,
    password,
    confirmPassword: z.string(),
    businessName:    z.string().trim().min(3, "Nama usaha minimal 3 karakter").max(150),
    bankName:        z.union([z.string().trim().max(50), z.literal("")]).optional(),
    bankAccount:     z.union([z.string().trim().max(50), z.literal("")]).optional(),
    bankHolder:      z.union([z.string().trim().max(100), z.literal("")]).optional(),
    agreeTerms:      z.string().refine(v => v === "on", "Anda harus menyetujui syarat & ketentuan"),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export const createPropertySchema = z.object({
  name:        z.string().trim().min(3).max(150),
  description: z.union([z.string().trim().max(2000), z.literal("")]).optional(),
  address:     z.string().trim().min(10).max(300),
  city:        z.string().trim().min(3).max(100),
  district:    z.string().trim().min(3).max(100),
  postalCode:  z.union([z.string().trim().regex(/^\d{5}$/, "Kode pos 5 digit"), z.literal("")]).optional(),
  rules:       z.union([z.string().trim().max(2000), z.literal("")]).optional(),
  kostType:    z.enum(["kost", "guest_house", "apartment", "kontrakan"]),
  genderType:  z.enum(["male", "female", "mixed", "campus"]),
});

export const createRoomSchema = z.object({
  propertyId:    z.string().trim().min(1, "ID properti wajib diisi"),
  roomNumber:    z.string().trim().min(1, "Nomor kamar wajib diisi").max(20),
  type:          z.string().trim().min(1).max(100).default("Standard"),
  pricePerMonth: z.coerce.number().int().min(100_000, "Harga minimal Rp100.000").max(50_000_000),
  depositAmount: z.coerce.number().int().min(0).max(50_000_000).default(0),
  size:          z.union([z.string().trim().max(30), z.literal("")]).optional(),
  floorNumber:   z.coerce.number().int().min(0).max(50).optional().nullable(),
  status:        z.enum(["available", "occupied", "maintenance"]).default("available"),
});

export const updateRoomSchema = createRoomSchema.extend({
  roomId: z.string().trim().min(1, "ID kamar wajib diisi"),
});

export const updatePropertySchema = createPropertySchema.extend({
  propertyId: z.string().trim().min(1, "ID properti wajib diisi"),
});

export const createBookingSchema = z.object({
  roomId:         z.string().trim().min(1, "ID kamar wajib diisi"),
  startDate:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal YYYY-MM-DD"),
  durationMonths: z.coerce.number().int().min(1).max(24),
  notes:          z.union([z.string().trim().max(500), z.literal("")]).optional(),
});

export const paymentProofSchema = z.object({
  bookingId:     z.string().trim().min(1, "ID booking wajib diisi"),
  senderBank:    z.string().trim().min(2).max(100),
  accountHolder: z.string().trim().min(2).max(100),
  transferDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal YYYY-MM-DD"),
  amount:        z.coerce.number().int().positive("Jumlah transfer harus positif"),
  notes:         z.union([z.string().trim().max(500), z.literal("")]).optional(),
});

export const searchSchema = z.object({
  q:        z.union([z.string().trim().max(200), z.literal("")]).optional(),
  type:     z.enum(["kost", "guest_house", "apartment", "kontrakan", ""]).optional(),
  gender:   z.enum(["male", "female", "mixed", "campus", ""]).optional(),
  city:     z.union([z.string().trim().max(100), z.literal("")]).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  page:     z.coerce.number().int().min(1).default(1),
  perPage:  z.coerce.number().int().min(1).max(48).default(12),
  sort:     z.enum(["recommended", "price_asc", "price_desc", "newest"]).default("recommended"),
});

export const updateProfileSchema = z.object({
  name:  z.string().trim().min(2).max(100),
  phone,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Email tidak valid").max(255),
});

export const resetPasswordSchema = z
  .object({
    token:           z.string().min(1, "Token tidak valid"),
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path:    ["confirmPassword"],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput  = z.infer<typeof resetPasswordSchema>;

export type LoginInput           = z.infer<typeof loginSchema>;
export type RegisterUserInput    = z.infer<typeof registerUserSchema>;
export type RegisterTenantInput  = z.infer<typeof registerTenantSchema>;
export type CreatePropertyInput  = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput  = z.infer<typeof updatePropertySchema>;
export type CreateRoomInput      = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput      = z.infer<typeof updateRoomSchema>;
export type CreateBookingInput   = z.infer<typeof createBookingSchema>;
export type PaymentProofInput    = z.infer<typeof paymentProofSchema>;
export type SearchInput          = z.infer<typeof searchSchema>;
