import { A, useLocation } from '@solidjs/router';
import { For, JSX, Show } from 'solid-js';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  Users,
  Megaphone,
  MessageSquare,
  BarChart2,
  User,
  Settings,
} from 'lucide-solid';
import { Logo } from './Logo';
import { Avatar } from '~/components/ui/Avatar';
import { Badge } from '~/components/ui/Badge';
import { ROUTES } from '~/constants/routes';

interface SidebarNavItem {
  href: string;
  label: string;
  icon: JSX.Element;
  badge?: number;
}

interface SidebarSection {
  label?: string;
  items: SidebarNavItem[];
}

const SECTIONS: SidebarSection[] = [
  {
    label: 'MANAJEMEN',
    items: [
      { href: ROUTES.DASHBOARD_MITRA, label: 'Overview', icon: <LayoutDashboard class="size-4" /> },
      { href: ROUTES.PROPERTI_KAMAR, label: 'Properti & Kamar', icon: <Building2 class="size-4" /> },
      { href: ROUTES.VERIFIKASI_BOOKING, label: 'Verifikasi Booking', icon: <CheckSquare class="size-4" />, badge: 4 },
      { href: ROUTES.PENYEWA_TAGIHAN, label: 'Penyewa & Tagihan', icon: <Users class="size-4" /> },
      { href: ROUTES.BROADCAST, label: 'Broadcast', icon: <Megaphone class="size-4" /> },
      { href: ROUTES.KELUHAN_MITRA, label: 'Keluhan', icon: <MessageSquare class="size-4" />, badge: 2 },
      { href: ROUTES.LAPORAN, label: 'Laporan & Ekspor', icon: <BarChart2 class="size-4" /> },
    ],
  },
  {
    label: 'AKUN',
    items: [
      { href: ROUTES.PROFIL_MITRA, label: 'Profil', icon: <User class="size-4" /> },
      { href: ROUTES.PENGATURAN_MITRA, label: 'Pengaturan', icon: <Settings class="size-4" /> },
    ],
  },
];

interface MitraSidebarProps {
  userName?: string;
  userRole?: string;
  propertiCount?: number;
}

export function MitraSidebar(props: MitraSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) =>
    href === ROUTES.DASHBOARD_MITRA
      ? location.pathname === href
      : location.pathname.startsWith(href);

  return (
    <aside class="flex h-full w-56 shrink-0 flex-col border-r border-slate-100 bg-white">
      {/* Logo */}
      <div class="flex h-14 items-center gap-2 border-b border-slate-100 px-4">
        <Logo />
        <span class="rounded-md bg-primary-light px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
          Owner
        </span>
      </div>

      {/* Nav */}
      <nav class="flex-1 overflow-y-auto px-2 py-3">
        <For each={SECTIONS}>
          {(section) => (
            <div class="mb-4">
              <Show when={section.label}>
                <p class="mb-1 px-3 text-[10px] font-semibold tracking-wider text-slate-400">
                  {section.label}
                </p>
              </Show>
              <ul class="space-y-0.5">
                <For each={section.items}>
                  {(item) => (
                    <li>
                      <A
                        href={item.href}
                        class={[
                          'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-primary-light text-primary'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
                        ].join(' ')}
                      >
                        <span class="flex items-center gap-2.5">
                          {item.icon}
                          {item.label}
                        </span>
                        <Show when={item.badge}>
                          <Badge variant="telat" class="text-[10px]">
                            {item.badge}
                          </Badge>
                        </Show>
                      </A>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          )}
        </For>
      </nav>

      {/* User info */}
      <div class="border-t border-slate-100 px-3 py-3">
        <div class="flex items-center gap-2.5">
          <Avatar name={props.userName ?? 'M'} size="sm" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-ink">{props.userName ?? 'Mitra'}</p>
            <p class="text-[10px] text-slate-400">
              Owner · {props.propertiCount ?? 0} properti
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
