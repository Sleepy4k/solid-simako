import { A, useLocation } from '@solidjs/router';
import { For, JSX, Show } from 'solid-js';
import { Bell } from 'lucide-solid';
import { Logo } from '~/components/shared/Logo';
import { Avatar } from '~/components/ui/Avatar';
import { ROUTES } from '~/constants/routes';

const NAV_TABS = [
  { href: ROUTES.DASHBOARD_PENYEWA, label: 'Beranda', exact: true },
  { href: '/akun/tagihan', label: 'Tagihan Saya', badge: 2 },
  { href: ROUTES.WISHLIST, label: 'Wishlist', badge: 3 },
  { href: ROUTES.KELUHAN_PENYEWA, label: 'Tiket & Keluhan', badge: 1 },
  { href: ROUTES.PROFIL_PENYEWA, label: 'Profil' },
];

interface TenantLayoutProps {
  children: JSX.Element;
  userName?: string;
}

export function TenantLayout(props: TenantLayoutProps) {
  const location = useLocation();

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <div class="flex min-h-dvh flex-col bg-slate-50">
      {/* Top bar */}
      <header class="sticky top-0 z-40 border-b border-slate-100 bg-white px-4">
        <div class="mx-auto flex h-14 max-w-5xl items-center justify-between">
          <Logo />
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell class="size-5" />
              <span class="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
            </button>
            <Avatar name={props.userName ?? 'D'} size="sm" />
            <span class="hidden text-sm font-semibold text-ink sm:block">
              {props.userName?.split(' ')[0] ?? 'Pengguna'}
            </span>
          </div>
        </div>

        {/* Tab nav */}
        <div class="mx-auto max-w-5xl">
          <nav class="-mb-px flex gap-0 overflow-x-auto">
            <For each={NAV_TABS}>
              {(tab) => (
                <A
                  href={tab.href}
                  class={[
                    'flex shrink-0 items-center gap-1.5 border-b-2 px-4 pb-3 pt-2 text-sm font-medium transition-colors',
                    isActive(tab.href, tab.exact)
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-ink',
                  ].join(' ')}
                >
                  {tab.label}
                  <Show when={tab.badge}>
                    <span
                      class={[
                        'flex size-4 items-center justify-center rounded-full text-[10px] font-bold',
                        isActive(tab.href, tab.exact)
                          ? 'bg-primary text-white'
                          : 'bg-slate-200 text-slate-500',
                      ].join(' ')}
                    >
                      {tab.badge}
                    </span>
                  </Show>
                </A>
              )}
            </For>
          </nav>
        </div>
      </header>

      <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{props.children}</main>
    </div>
  );
}
