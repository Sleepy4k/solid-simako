import type { APIEvent } from "@solidjs/start/server";
import { SITE, PURWOKERTO_DISTRICTS } from "~/config/site";
import { getAllPropertySlugs } from "~/server/actions/rooms";

const now = new Date().toISOString().split("T")[0];

function url(
  loc: string,
  opts: { freq?: string; priority?: string; lastmod?: string } = {}
) {
  return [
    "  <url>",
    `    <loc>${SITE.url}${loc}</loc>`,
    `    <lastmod>${opts.lastmod ?? now}</lastmod>`,
    `    <changefreq>${opts.freq ?? "weekly"}</changefreq>`,
    `    <priority>${opts.priority ?? "0.5"}</priority>`,
    "  </url>",
  ].join("\n");
}

export async function GET(_event: APIEvent) {
  const staticUrls = [
    url("/",                        { freq: "daily",   priority: "1.0" }),
    url("/search",                  { freq: "hourly",  priority: "0.9" }),
    url("/search?gender=female",    { freq: "daily",   priority: "0.8" }),
    url("/search?gender=male",      { freq: "daily",   priority: "0.8" }),
    url("/search?type=guest_house", { freq: "daily",   priority: "0.7" }),
    url("/search?type=apartment",   { freq: "daily",   priority: "0.7" }),
    url("/auth/register",           { freq: "monthly", priority: "0.6" }),
    url("/auth/register-tenant",    { freq: "monthly", priority: "0.6" }),
  ];

  const districtUrls = [...PURWOKERTO_DISTRICTS].map((district) =>
    url(`/search?city=${encodeURIComponent(district)}`, {
      freq:     "daily",
      priority: "0.7",
    })
  );

  let propertyUrls: string[] = [];
  try {
    const slugs = await getAllPropertySlugs();
    propertyUrls = slugs.map(({ slug, updatedAt }) =>
      url(`/kost/${slug}`, {
        freq:     "weekly",
        priority: "0.8",
        lastmod:  new Date(updatedAt).toISOString().split("T")[0],
      })
    );
  } catch {
    propertyUrls = [];
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    ...staticUrls,
    ...districtUrls,
    ...propertyUrls,
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type":  "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
