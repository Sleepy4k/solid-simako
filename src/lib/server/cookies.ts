import { getRequestEvent } from "solid-js/web";
import { deleteCookie, getCookie, setCookie } from "h3";
import type { H3Event } from "h3";

type CookieOptions = NonNullable<Parameters<typeof setCookie>[3]>;

function parseCookieHeader(header: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) result[key] = decodeURIComponent(val);
  }
  return result;
}

function getEvent(): H3Event | null {
  const ev = getRequestEvent() as (H3Event & { nativeEvent?: H3Event }) | undefined;
  return ev?.res && ev?.req ? ev : ev?.nativeEvent?.res && ev?.nativeEvent?.req ? ev.nativeEvent : null;
}

export function getServerCookie(name: string): string | undefined {
  const ev = getEvent();
  if (ev) return getCookie(ev, name);

  const requestEvent = getRequestEvent() as { request?: Request } | undefined;
  const header = requestEvent?.request?.headers?.get("cookie") ?? "";
  return parseCookieHeader(header)[name];
}

export function setServerCookie(
  name: string,
  value: string,
  opts: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    maxAge?: number;
    path?: string;
  } = {}
): void {
  const ev = getEvent();
  if (!ev) return;
  setCookie(ev, name, value, opts as CookieOptions);
}

export function deleteServerCookie(name: string): void {
  const ev = getEvent();
  if (!ev) return;
  deleteCookie(ev, name, { path: "/" });
}
