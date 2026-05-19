import { A, useLocation } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { Menu, X } from 'lucide-solid';
import { Logo } from './Logo';
import { ButtonLink } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';

const NAV_LINKS = [
  { href: ROUTES.CARI_KOST, label: 'Cari Kost' },
  { href: '/#kampus', label: 'Kampus' },
  { href: '/#mitra', label: 'Mitra Owner' },
  { href: '/#bantuan', label: 'Bantuan' },
];

export function PublicNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = createSignal(false);

  return (
    <header class="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Left: Logo */}
        <Logo showTagline />

        {/* Center: Nav links (desktop) */}
        <nav class="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = () => location.pathname === link.href;
            return (
              <A
                href={link.href}
                class={[
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive()
                    ? 'bg-primary-light text-primary'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                ].join(' ')}
              >
                {link.label}
              </A>
            );
          })}
        </nav>

        {/* Right: Auth buttons */}
        <div class="flex items-center gap-2">
          <A
            href={ROUTES.MASUK}
            class="hidden text-sm font-semibold text-ink transition hover:text-primary md:block"
          >
            Masuk
          </A>
          <ButtonLink href={ROUTES.DAFTAR} size="sm">
            Daftar
          </ButtonLink>
          {/* Mobile menu toggle */}
          <button
            type="button"
            class="ml-1 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <Show when={mobileOpen()} fallback={<Menu class="size-5" />}>
              <X class="size-5" />
            </Show>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Show when={mobileOpen()}>
        <div class="border-t border-slate-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav class="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <A
                href={link.href}
                onClick={() => setMobileOpen(false)}
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-ink"
              >
                {link.label}
              </A>
            ))}
            <hr class="my-2 border-slate-100" />
            <A
              href={ROUTES.MASUK}
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-ink"
            >
              Masuk
            </A>
            <A
              href={ROUTES.DAFTAR}
              class="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-2"
            >
              Daftar gratis
            </A>
          </nav>
        </div>
      </Show>
    </header>
  );
}
