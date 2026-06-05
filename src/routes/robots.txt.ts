import type { APIEvent } from "@solidjs/start/server";
import { SITE } from "~/config/site";

export async function GET(_event: APIEvent) {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Allow: /search",
    "Allow: /kost/",
    "Disallow: /dashboard/",
    "Disallow: /auth/",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE.url}/sitemap.xml`,
    "",
    "Crawl-delay: 1",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type":  "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
