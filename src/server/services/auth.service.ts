import type { UserRole } from '@prisma/client';
import { prisma } from '~/server/db';
import {
  hashPassword,
  verifyPassword,
  generateOtpCode,
  generateToken,
  hashToken,
} from '~/lib/server/crypto';
import { recordAudit } from '~/lib/server/audit';
import { serverEnv } from '~/config/env';
import type { LoginInput, RegisterOwnerInput, RegisterUserInput } from '~/lib/shared/validation';

async function getRoleByName(name: UserRole) {
  const role = await prisma.role.findUnique({ where: { name } });
  if (!role) throw new Error(`Role ${name} belum ter-seed di database`);
  return role;
}

export async function loginWithEmail(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { role: true },
  });

  if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
    throw new Error('Email atau kata sandi salah');
  }
  if (user.isSuspended) {
    throw new Error('Akun Anda ditangguhkan. Hubungi administrator.');
  }

  await recordAudit({ userId: user.id, action: 'LOGIN', targetModel: 'User', targetId: user.id });

  return { id: user.id, email: user.email, role: user.role.name };
}

export async function registerUser(input: RegisterUserInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new Error('Email sudah terdaftar');

  const role = await getRoleByName('PENYEWA');
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      roleId: role.id,
      profile: { create: { namaLengkap: input.namaLengkap, telepon: input.telepon } },
      settings: { create: {} },
    },
  });

  await recordAudit({
    userId: user.id,
    action: 'CREATE',
    targetModel: 'User',
    targetId: user.id,
    after: { email: user.email, role: 'PENYEWA' },
  });

  return { id: user.id, email: user.email, role: 'PENYEWA' as UserRole };
}

export async function registerOwner(input: RegisterOwnerInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new Error('Email sudah terdaftar');

  const role = await getRoleByName('MITRA');
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      roleId: role.id,
      profile: { create: { namaLengkap: input.namaLengkap, telepon: input.telepon } },
      ownerProfile: { create: { namaUsaha: input.namaUsaha } },
      settings: { create: {} },
    },
  });

  await recordAudit({
    userId: user.id,
    action: 'CREATE',
    targetModel: 'User',
    targetId: user.id,
    after: { email: user.email, role: 'MITRA' },
  });

  return { id: user.id, email: user.email, role: 'MITRA' as UserRole };
}

export async function logoutUser(userId: string) {
  await recordAudit({ userId, action: 'LOGOUT', targetModel: 'User', targetId: userId });
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Pengguna tidak ditemukan');
  if (!(await verifyPassword(user.passwordHash, currentPassword))) {
    throw new Error('Kata sandi saat ini salah');
  }
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await recordAudit({ userId, action: 'UPDATE', targetModel: 'User', targetId: userId });
}

export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null; // diam-diam supaya tidak bocor info user

  const rawToken = generateToken(32);
  const kodeHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 menit

  await prisma.otpToken.create({
    data: { userId: user.id, tujuan: 'RESET_PASSWORD', kodeHash, expiresAt },
  });

  return { rawToken, email: user.email };
}

export async function resetPasswordWithToken(rawToken: string, newPassword: string) {
  const kodeHash = hashToken(rawToken);
  const token = await prisma.otpToken.findFirst({
    where: { kodeHash, tujuan: 'RESET_PASSWORD', isUsed: false, expiresAt: { gt: new Date() } },
  });
  if (!token) throw new Error('Token tidak valid atau sudah kadaluarsa');

  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { passwordHash } }),
    prisma.otpToken.update({ where: { id: token.id }, data: { isUsed: true } }),
  ]);
}

export async function createOtp(userId: string, tujuan: string) {
  const kode = generateOtpCode();
  const kodeHash = hashToken(kode);
  const expiresAt = new Date(Date.now() + serverEnv.OTP_TTL_SECONDS * 1000);

  await prisma.otpToken.create({ data: { userId, tujuan, kodeHash, expiresAt } });
  return kode;
}

export async function verifyOtp(userId: string, tujuan: string, kode: string) {
  const kodeHash = hashToken(kode);
  const token = await prisma.otpToken.findFirst({
    where: { userId, tujuan, kodeHash, isUsed: false, expiresAt: { gt: new Date() } },
  });
  if (!token) throw new Error('Kode OTP tidak valid atau sudah kadaluarsa');
  await prisma.otpToken.update({ where: { id: token.id }, data: { isUsed: true } });
}
