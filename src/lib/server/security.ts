export const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options":           "DENY",
  "X-Content-Type-Options":    "nosniff",
  "Referrer-Policy":           "strict-origin-when-cross-origin",
  "Permissions-Policy":        "camera=(), microphone=(), geolocation=(self)",
  "X-DNS-Prefetch-Control":    "off",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

const HTML_ESCAPE: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function sanitizeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (c) => HTML_ESCAPE[c] ?? c);
}

export function sanitizeInput(input: unknown): string {
  if (typeof input !== "string") return "";
  return sanitizeHtml(input.trim().slice(0, 5000));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function generateSlug(name: string, id?: number): string {
  const base = slugify(name);
  return id ? `${base}-${id}` : base;
}
