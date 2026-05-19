import { A } from '@solidjs/router';
import { Logo } from './Logo';
import { ROUTES } from '~/constants/routes';

export function PublicFooter() {
  return (
    <footer class="border-t border-slate-100 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div class="sm:col-span-2 lg:col-span-1">
            <Logo showTagline />
            <p class="mt-3 text-sm leading-relaxed text-slate-500">
              Manajemen kost & marketplace · transfer manual, verifikasi human-checked · khusus area
              Purwokerto.
            </p>
          </div>

          {/* Pencari Kost */}
          <div>
            <h4 class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pencari Kost
            </h4>
            <ul class="space-y-2">
              {[
                { href: ROUTES.CARI_KOST, label: 'Cari kost' },
                { href: '/#kampus', label: 'Kost dekat kampus' },
                { href: ROUTES.MASUK, label: 'Masuk akun' },
                { href: ROUTES.DAFTAR, label: 'Daftar gratis' },
              ].map((l) => (
                <li>
                  <A
                    href={l.href}
                    class="text-sm text-slate-500 transition hover:text-primary"
                  >
                    {l.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>

          {/* Mitra Owner */}
          <div>
            <h4 class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Mitra Owner
            </h4>
            <ul class="space-y-2">
              {[
                { href: ROUTES.DAFTAR_MITRA, label: 'Daftar sebagai mitra' },
                { href: ROUTES.DASHBOARD_MITRA, label: 'Dashboard mitra' },
                { href: '/#cara-kerja', label: 'Cara kerja' },
                { href: '/#biaya', label: 'Biaya & ketentuan' },
              ].map((l) => (
                <li>
                  <A
                    href={l.href}
                    class="text-sm text-slate-500 transition hover:text-primary"
                  >
                    {l.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Bantuan
            </h4>
            <ul class="space-y-2">
              {[
                { href: '/#faq', label: 'FAQ' },
                { href: ROUTES.CHAT, label: 'Chat support' },
                { href: '/#kebijakan', label: 'Kebijakan privasi' },
                { href: '/#syarat', label: 'Syarat & ketentuan' },
              ].map((l) => (
                <li>
                  <A
                    href={l.href}
                    class="text-sm text-slate-500 transition hover:text-primary"
                  >
                    {l.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 sm:flex-row">
          <p class="text-xs text-slate-400">© 2026 SIMAKO · Manajemen Kost Purwokerto</p>
          <p class="text-xs text-slate-400">Transfer manual · Verifikasi manusiawi</p>
        </div>
      </div>
    </footer>
  );
}
