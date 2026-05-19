import { z } from 'zod';

// ─── Server-only variables (never sent to client) ───────────────────────────

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL harus berupa URL valid'),
  APP_URL: z.string().url('APP_URL harus berupa URL valid'),
  APP_SECRET: z.string().min(32, 'APP_SECRET minimal 32 karakter'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(86400),
  OTP_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),
  UPLOAD_MAX_MB: z.coerce.number().int().positive().default(5),
});

// ─── Public variables (VITE_ prefix, safe for client) ───────────────────────

const publicEnvSchema = z.object({
  VITE_APP_NAME: z.string().default('Simako'),
  VITE_APP_URL: z.string().url().default('http://localhost:3000'),
});

// ─── Validate & export ───────────────────────────────────────────────────────

function parseServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`[env] Variabel environment tidak valid:\n${formatted}`);
  }
  return result.data;
}

function parsePublicEnv() {
  const result = publicEnvSchema.safeParse(import.meta.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`[env] Variabel publik tidak valid:\n${formatted}`);
  }
  return result.data;
}

// Server env — only evaluated on server, tree-shaken on client build
export const serverEnv = /* @__PURE__ */ (() => {
  if (typeof process === 'undefined') return {} as ReturnType<typeof parseServerEnv>;
  return parseServerEnv();
})();

// Public env — safe for client
export const publicEnv = parsePublicEnv();
