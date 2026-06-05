import { db } from "~/server/db";
import { users, tenants } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema, registerUserSchema, registerTenantSchema, forgotPasswordSchema, resetPasswordSchema } from "~/lib/shared/validation";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie, getOptionalAuth, signToken, verifyToken } from "~/lib/server/auth";
import { sendEmail } from "~/server/email";
import { forgotPasswordTemplate } from "~/server/email/templates/forgot-password";
import { ROLE_DASHBOARD_PATH } from "~/constants/roles";
import type { AuthUser } from "~/types";
import { v7 as uuidv7 } from "uuid";

const _env = (k: string) => (typeof process !== "undefined" ? process.env[k] : undefined);

export async function loginAction(formData: FormData) {
  "use server";
  const raw    = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  const { email, password } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

  if (!user || !user.isActive) return { error: "Email atau kata sandi salah" };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: "Email atau kata sandi salah" };

  const authUser: AuthUser = {
    id:        user.id,
    name:      user.name,
    email:     user.email,
    role:      user.role,
    avatarUrl: user.avatarUrl,
    phone:     user.phone,
  };
  await setSessionCookie(authUser);
  return { redirectTo: ROLE_DASHBOARD_PATH[user.role] };
}

export async function registerUserAction(formData: FormData) {
  "use server";
  const raw    = Object.fromEntries(formData);
  const parsed = registerUserSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { name, email, phone, password } = parsed.data;
  const normalEmail = email.toLowerCase();

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, normalEmail)).limit(1);
  if (existing) return { errors: { email: ["Email sudah terdaftar"] } };

  const passwordHash = await hashPassword(password);
  const userId = uuidv7();
  await db.insert(users).values({
    id:   userId,
    name: name.trim(),
    email:        normalEmail,
    phone:        phone?.trim() || null,
    passwordHash,
    role: "user",
  });

  const authUser: AuthUser = {
    id:        userId,
    name:      name.trim(),
    email:     normalEmail,
    role:      "user",
    avatarUrl: null,
    phone:     phone?.trim() || null,
  };
  await setSessionCookie(authUser);
  return { redirectTo: "/dashboard/user" };
}

export async function registerTenantAction(formData: FormData) {
  "use server";
  const raw    = Object.fromEntries(formData);
  const parsed = registerTenantSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { name, email, phone, password, businessName, bankName, bankAccount, bankHolder } = parsed.data;
  const normalEmail = email.toLowerCase();

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, normalEmail)).limit(1);
  if (existing) return { errors: { email: ["Email sudah terdaftar"] } };

  const passwordHash = await hashPassword(password);
  const userId   = uuidv7();
  const tenantId = uuidv7();

  await db.insert(users).values({
    id:   userId,
    name: name.trim(),
    email:        normalEmail,
    phone:        phone?.trim() || null,
    passwordHash,
    role: "tenant",
  });

  await db.insert(tenants).values({
    id:           tenantId,
    userId,
    businessName: businessName.trim(),
    bankName:     bankName?.trim()    || null,
    bankAccount:  bankAccount?.trim() || null,
    bankHolder:   bankHolder?.trim()  || null,
  });

  const authUser: AuthUser = {
    id:        userId,
    name:      name.trim(),
    email:     normalEmail,
    role:      "tenant",
    avatarUrl: null,
    phone:     phone?.trim() || null,
  };
  await setSessionCookie(authUser);
  return { redirectTo: "/dashboard/tenant" };
}

export async function logoutAction() {
  "use server";
  clearSessionCookie();
  return { redirectTo: "/" };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  "use server";
  return getOptionalAuth();
}

export async function forgotPasswordAction(formData: FormData) {
  "use server";
  const raw    = Object.fromEntries(formData);
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Email tidak valid" };

  const [user] = await db.select({ id: users.id, name: users.name, email: users.email, passwordHash: users.passwordHash })
    .from(users).where(eq(users.email, parsed.data.email.toLowerCase())).limit(1);

  if (!user) return { success: true };

  const appUrl = _env("APP_URL") ?? "http://localhost:3000";

  const token = await signToken({
    id:        user.id,
    name:      user.name,
    email:     user.email,
    role:      "user",
    avatarUrl: null,
    phone:     null,
  });

  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
  const tpl = forgotPasswordTemplate({ name: user.name, resetUrl, expiresIn: "24 jam" });

  await sendEmail({ to: user.email, subject: tpl.subject, html: tpl.html, text: tpl.text });

  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  "use server";
  const raw    = Object.fromEntries(formData);
  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const payload = await verifyToken(parsed.data.token);
  if (!payload) return { error: "Link reset tidak valid atau sudah kedaluwarsa" };

  const [user] = await db.select({ id: users.id, isActive: users.isActive })
    .from(users).where(eq(users.id, payload.sub)).limit(1);
  if (!user || !user.isActive) return { error: "Akun tidak ditemukan" };

  const passwordHash = await hashPassword(parsed.data.password);
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

  return { success: true };
}
