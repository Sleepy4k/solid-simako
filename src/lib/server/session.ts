import { useSession } from '@solidjs/start/http';
import { getRequestEvent } from 'solid-js/web';
import { redirect } from '@solidjs/router';
import type { UserRole } from '@prisma/client';
import { serverEnv } from '~/config/env';
import { prisma } from '~/server/db';
import { ROUTES } from '~/constants/routes';

export interface SessionData {
  userId?: string;
  role?: UserRole;
}

export async function getSession() {
  return useSession<SessionData>({
    password: serverEnv.APP_SECRET,
    name: 'simako_sid',
    cookie: {
      sameSite: 'lax',
      httpOnly: true,
      secure: serverEnv.NODE_ENV === 'production',
      maxAge: serverEnv.SESSION_TTL_SECONDS,
    },
  });
}

export async function setSession(userId: string, role: UserRole) {
  const session = await getSession();
  await session.update((d) => {
    d.userId = userId;
    d.role = role;
  });
}

export async function clearSession() {
  const session = await getSession();
  await session.update((d) => {
    d.userId = undefined;
    d.role = undefined;
  });
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session.data.userId ?? null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isSuspended: boolean;
  namaLengkap: string | null;
  avatarUrl: string | null;
  kycStatus: 'BELUM_UPLOAD' | 'MENUNGGU' | 'DISETUJUI' | 'DITOLAK' | null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      profile: { select: { namaLengkap: true } },
      ownerProfile: { select: { kycStatus: true } },
      avatarAsset: { select: { url: true } },
    },
  });

  if (!user || user.isSuspended) {
    await clearSession();
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
    isSuspended: user.isSuspended,
    namaLengkap: user.profile?.namaLengkap ?? null,
    avatarUrl: user.avatarAsset?.url ?? null,
    kycStatus: user.ownerProfile?.kycStatus ?? null,
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw redirect(ROUTES.MASUK);
  return user;
}

export async function requireRole(...roles: UserRole[]): Promise<AuthUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw redirect(ROUTES.BERANDA);
  }
  return user;
}

export function getClientInfo() {
  const event = getRequestEvent();
  const headers = event?.request.headers;
  return {
    ip:
      headers?.get('x-forwarded-for')?.split(',')[0].trim() ??
      headers?.get('x-real-ip') ??
      null,
    userAgent: headers?.get('user-agent') ?? null,
  };
}
