import { A, useLocation } from '@solidjs/router';
import { JSX, Show } from 'solid-js';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Building2,
  CreditCard,
  Scale,
  BarChart2,
  Database,
  Image,
  HelpCircle,
  ScrollText,
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
    label: 'PLATFORM',
    items: [
      { href: ROUTES.DASHBOARD_ADMIN, label: 'Overview', icon: <LayoutDashboard class="size-4" /> },
      { href: ROUTES.VERIFIKASI_KYC, label: 'Verifikasi KYC', icon: <ShieldCheck class="size-4" />, badge: 7 },
      { href: ROUTES.USER_MANAJEMEN, label: 'Manajemen User', icon: <Users class="size-4" /> },
      { href: ROUTES.PROPERTI_TERDAFTAR, label: 'Properti', icon: <Building2 class="size-4" /> },
      { href: ROUTES.TRANSAKSI_PLATFORM, label: 'Transaksi', icon: <CreditCard class="size-4" /> },
      { href: ROUTES.DISPUTE_CENTER, label: 'Dispute Center', icon: <Scale class="size-4" />, badge: 3 },
      { href: ROUTES.LAPORAN_INSIGHT, label: 'Laporan & Insight', icon: <BarChart2 class="size-4" /> },
    ],
  },
  {
    label: 'KONTEN',
    items: [
      { href: ROUTES.MASTER_DATA, label: 'Master Data', icon: <Database class="size-4" /> },
      { href: ROUTES.CMS_BANNER, label: 'CMS & Banner', icon: <Image class="size-4" /> },
      { href: ROUTES.FAQ, label: 'FAQ', icon: <HelpCircle class="size-4" /> },
    ],
  },
  {
    label: 'SISTEM',
    items: [
      { href: ROUTES.AUDIT_LOG, label: 'Audit Log', icon: <ScrollText class="size-4" /> },
      { href: ROUTES.PENGATURAN_ADMIN, label: 'Pengaturan', icon: <Settings class="size-4" /> },
    ],
  },
];

interface AdminSidebarProps {
  userName?: string;
  userRole?: string;
}

export function AdminSidebar(props: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) =>
    href === ROUTES.DASHBOARD_ADMIN
      ? location.pathname === href
      : location.pathname.startsWith(href);

  return (
    <aside class="flex h-full w-56 shrink-0 flex-col border-r border-slate-100 bg-white">
      {/* Logo */}
      <div class="flex h-14 items-center gap-2 border-b border-slate-100 px-4">
        <Logo />
        <span class="rounded-md bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-navy">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav class="flex-1 overflow-y-auto px-2 py-3">
        {SECTIONS.map((section) => (
          <div class="mb-4">
            <Show when={section.label}>
              <p class="mb-1 px-3 text-[10px] font-semibold tracking-wider text-slate-400">
                {section.label}
              </p>
            </Show>
            <ul class="space-y-0.5">
              {section.items.map((item) => (
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
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User info */}
      <div class="border-t border-slate-100 px-3 py-3">
        <div class="flex items-center gap-2.5">
          <Avatar name={props.userName ?? 'A'} size="sm" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-ink">{props.userName ?? 'Admin'}</p>
            <p class="text-[10px] text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
