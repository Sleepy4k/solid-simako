import { action, query, redirect } from '@solidjs/router';
import {
  loginSchema,
  registerUserSchema,
  registerOwnerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  parseFormData,
  actionOk,
  handleZodError,
} from '~/lib/shared/validation';
import {
  loginWithEmail,
  registerUser as registerUserService,
  registerOwner as registerOwnerService,
  logoutUser,
  createPasswordResetToken,
  resetPasswordWithToken,
} from '~/server/services/auth.service';
import {
  clearSession,
  getCurrentUser,
  getCurrentUserId,
  setSession,
} from '~/lib/server/session';
import { ROUTES } from '~/constants/routes';

function redirectByRole(role: 'PENYEWA' | 'MITRA' | 'ADMIN'): string {
  if (role === 'MITRA') return ROUTES.DASHBOARD_MITRA;
  if (role === 'ADMIN') return ROUTES.DASHBOARD_ADMIN;
  return ROUTES.DASHBOARD_PENYEWA;
}

export const currentUserQuery = query(async () => {
  'use server';
  return getCurrentUser();
}, 'currentUser');

export const loginAction = action(async (formData: FormData) => {
  'use server';
  try {
    const input = parseFormData(loginSchema, formData);
    const user = await loginWithEmail(input);
    await setSession(user.id, user.role);
    throw redirect(redirectByRole(user.role));
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'login');

export const registerUserAction = action(async (formData: FormData) => {
  'use server';
  try {
    const input = parseFormData(registerUserSchema, formData);
    const user = await registerUserService(input);
    await setSession(user.id, user.role);
    throw redirect(ROUTES.DASHBOARD_PENYEWA);
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'registerUser');

export const registerOwnerAction = action(async (formData: FormData) => {
  'use server';
  try {
    const input = parseFormData(registerOwnerSchema, formData);
    const user = await registerOwnerService(input);
    await setSession(user.id, user.role);
    throw redirect(ROUTES.UPLOAD_KYC);
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'registerOwner');

export const logoutAction = action(async () => {
  'use server';
  const userId = await getCurrentUserId();
  if (userId) await logoutUser(userId);
  await clearSession();
  throw redirect(ROUTES.BERANDA);
}, 'logout');

export const forgotPasswordAction = action(async (formData: FormData) => {
  'use server';
  try {
    const input = parseFormData(forgotPasswordSchema, formData);
    const result = await createPasswordResetToken(input.email);
    // TODO: kirim email lewat SMTP. Sementara: kembalikan token untuk dev.
    return actionOk(undefined, 'Jika email terdaftar, kami telah mengirim tautan reset.');
  } catch (err) {
    return handleZodError(err);
  }
}, 'forgotPassword');

export const resetPasswordAction = action(async (formData: FormData) => {
  'use server';
  try {
    const input = parseFormData(resetPasswordSchema, formData);
    await resetPasswordWithToken(input.token, input.password);
    throw redirect(ROUTES.MASUK);
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'resetPassword');
