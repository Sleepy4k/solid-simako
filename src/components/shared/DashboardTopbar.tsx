import { A } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-solid';
import { Avatar } from '~/components/ui/Avatar';
import { ConfirmModal } from './ConfirmModal';
import { ROUTES } from '~/constants/routes';

interface TopbarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  searchPlaceholder?: string;
  roleLabel?: 'OWNER' | 'ADMIN';
}

export function DashboardTopbar(props: TopbarProps) {
  const [logoutOpen, setLogoutOpen] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);

  const roleBadge = () =>
    props.roleLabel === 'ADMIN'
      ? 'bg-navy text-white'
      : 'bg-primary-light text-primary';

  return (
    <>
      <header class="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-5">
        {/* Search */}
        <div class="relative hidden w-80 md:block">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder={props.searchPlaceholder ?? 'Cari...'}
            class="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <kbd class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </div>
        <div class="md:hidden" />

        {/* Right */}
        <div class="flex items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <Bell class="size-5" />
            <span class="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
          </button>

          {/* User menu */}
          <div class="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              class="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-slate-100"
            >
              <Avatar src={props.userAvatar} name={props.userName ?? 'U'} size="sm" />
              <div class="hidden text-left md:block">
                <p class="text-xs font-semibold text-ink">{props.userName ?? 'Pengguna'}</p>
                <p class="text-[10px] text-slate-400">{props.userRole}</p>
              </div>
              <ChevronDown class="hidden size-3.5 text-slate-400 md:block" />
            </button>

            <Show when={menuOpen()}>
              <div class="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                <A
                  href={props.roleLabel === 'ADMIN' ? ROUTES.PENGATURAN_ADMIN : ROUTES.PROFIL_MITRA}
                  onClick={() => setMenuOpen(false)}
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <User class="size-4" />
                  Profil saya
                </A>
                <A
                  href={props.roleLabel === 'ADMIN' ? ROUTES.PENGATURAN_ADMIN : ROUTES.PENGATURAN_MITRA}
                  onClick={() => setMenuOpen(false)}
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Settings class="size-4" />
                  Pengaturan
                </A>
                <hr class="border-slate-100" />
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); setLogoutOpen(true); }}
                  class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger-light"
                >
                  <LogOut class="size-4" />
                  Keluar
                </button>
              </div>
            </Show>
          </div>
        </div>
      </header>

      {/* Click-away */}
      <Show when={menuOpen()}>
        <div class="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
      </Show>

      {/* Logout confirm */}
      <ConfirmModal
        open={logoutOpen()}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => { setLogoutOpen(false); /* TODO: logout action */ }}
        title="Keluar dari SIMAKO?"
        description="Kamu perlu masuk lagi untuk kembali ke dashboard."
        confirmLabel="Ya, keluar"
        cancelLabel="Batal"
        variant="primary"
        icon={<LogOut class="size-6" />}
      />
    </>
  );
}
