import { SignJWT, jwtVerify } from "jose";
import { redirect } from "@solidjs/router";
import argon2 from "argon2";
import { getServerCookie, setServerCookie, deleteServerCookie } from "./cookies";
import type { AuthUser, Role } from "~/types";

const _env = (k: string) => (typeof process !== "undefined" ? process.env[k] : undefined);
const COOKIE_NAME = _env("SESSION_COOKIE_NAME") ?? "simakos_token";
const JWT_SECRET  = new TextEncoder().encode(_env("JWT_SECRET") ?? "dev_secret_change_in_production_min32chars!!");
const JWT_TTL     = Number(_env("JWT_EXPIRES_IN") ?? 86400);

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, {
    type:        argon2.argon2id,
    memoryCost:  65536,
    timeCost:    3,
    parallelism: 1,
  });
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, plain);
}

export interface JwtPayload {
  sub:       string;
  name:      string;
  email?:    string;
  role:      Role;
  avatarUrl: string | null;
  phone:     string | null;
}

export async function signToken(user: AuthUser): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, phone: user.phone })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${JWT_TTL}s`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<(JwtPayload & { sub: string }) | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtPayload & { sub: string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: AuthUser): Promise<void> {
  const token = await signToken(user);
  setServerCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   typeof process !== "undefined" && process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   JWT_TTL,
    path:     "/",
  });
}

export function clearSessionCookie(): void {
  deleteServerCookie(COOKIE_NAME);
}

export async function getOptionalAuth(): Promise<AuthUser | null> {
  const token = getServerCookie(COOKIE_NAME);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return {
    id:        payload.sub,
    name:      payload.name,
    role:      payload.role,
    avatarUrl: payload.avatarUrl,
    phone:     payload.phone,
    email:     payload.email ?? "",
  };
}

export async function requireAuth(allowedRoles?: Role[]): Promise<AuthUser> {
  const user = await getOptionalAuth();
  if (!user) throw redirect("/auth/login");
  if (allowedRoles && !allowedRoles.includes(user.role)) throw redirect("/");
  return user;
}
