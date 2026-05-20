import { hash, verify } from '@node-rs/argon2';
import { randomBytes, createHash } from 'crypto';

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(hashed: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashed, plain);
  } catch {
    return false;
  }
}

export function generateToken(length = 48): string {
  return randomBytes(length).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateOtpCode(): string {
  const n = Math.floor(Math.random() * 1_000_000);
  return n.toString().padStart(6, '0');
}
