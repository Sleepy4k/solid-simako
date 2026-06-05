import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { SITE } from "~/config/site";

export default function NotFound() {
  return (
    <>
      <Title>404 - Halaman Tidak Ditemukan | {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />

      <div
        class="min-h-screen flex flex-col items-center justify-center p-6"
        style="background: linear-gradient(135deg, #F4F7FA 0%, #E6F0FA 100%)"
      >
        <div class="max-w-md w-full text-center">
          <div class="relative mb-8">
            <div class="text-[140px] font-black text-navy/5 leading-none select-none absolute inset-0 flex items-center justify-center">
              404
            </div>
            <div class="relative z-10 w-28 h-28 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto border border-[#E6F0FA]">
              <svg class="w-14 h-14 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>

          <div class="mb-2">
            <span class="inline-block text-xs font-bold text-accent uppercase tracking-widest bg-[#E6F0FA] px-3 py-1 rounded-full">
              Error 404
            </span>
          </div>
          <h1 class="text-3xl font-black text-navy mt-3 mb-2">Halaman Tidak Ditemukan</h1>
          <p class="text-navy/50 text-sm leading-relaxed mb-8">
            Halaman yang Anda cari tidak ada atau mungkin sudah dipindahkan.
            Kembali ke beranda dan temukan kos impian Anda.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <A
              href="/"
              class="w-full sm:w-auto px-6 py-3 bg-navy hover:bg-navy-dark text-white font-bold rounded-xl transition-colors text-sm"
            >
              Kembali ke Beranda
            </A>
            <A
              href="/search"
              class="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-colors text-sm"
            >
              Cari Kos
            </A>
          </div>

          <div class="mt-10 pt-8 border-t border-[#E6F0FA]">
            <p class="text-xs text-navy/30 mb-3">Atau kunjungi halaman ini:</p>
            <div class="flex flex-wrap justify-center gap-3">
              {[
                { href: "/search",              label: "Cari Kos" },
                { href: "/auth/register",       label: "Daftar" },
                { href: "/auth/login",          label: "Masuk" },
                { href: "/auth/register-tenant", label: "Daftarkan Kos" },
              ].map((link) => (
                <A
                  href={link.href}
                  class="text-xs text-accent hover:underline font-medium"
                >
                  {link.label}
                </A>
              ))}
            </div>
          </div>
        </div>

        <div class="mt-12 text-center">
          <A href="/" class="inline-flex items-center gap-2">
            <div class="w-7 h-7 bg-navy rounded-lg flex items-center justify-center font-black text-white text-[10px]">SK</div>
            <span class="font-black text-navy text-sm">{SITE.name}</span>
          </A>
        </div>
      </div>
    </>
  );
}
