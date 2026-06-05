import { createMiddleware } from "@solidjs/start/middleware";
import { getRequestEvent } from "solid-js/web";
import { verifyToken } from "~/lib/server/auth";

const COOKIE_NAME = (typeof process !== "undefined" ? process.env.SESSION_COOKIE_NAME : undefined) ?? "simakos_token";

function parseCookieValue(header: string, name: string): string | undefined {
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

export default createMiddleware({
  onRequest: [
    async (_event) => {
      const fetchEvent = getRequestEvent() as any;
      if (!fetchEvent) return;

      const cookieHeader =
        (fetchEvent.request as Request | undefined)?.headers?.get("cookie") ?? "";
      if (!cookieHeader) return;

      const token = parseCookieValue(cookieHeader, COOKIE_NAME);
      if (!token) return;

      const payload = await verifyToken(token);
      if (!payload) return;

      fetchEvent.locals = fetchEvent.locals ?? {};
      fetchEvent.locals.userId   = payload.sub;
      fetchEvent.locals.userRole = payload.role;
      fetchEvent.locals.userName = payload.name;
    },
  ],
});
