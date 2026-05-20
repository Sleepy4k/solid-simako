import { A, createAsync, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import {
  Home,
  Calendar,
  CreditCard,
  MessageSquare,
  ChevronRight,
} from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Card } from '~/components/ui/Card';
import { ButtonLink } from '~/components/ui/Button';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { ROUTES } from '~/constants/routes';
import { currentUserQuery } from '~/server/actions/auth';
import {
  activeRentalQuery,
  userTransactionsQuery,
} from '~/server/actions/penyewa';
import { formatIDR, formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    activeRentalQuery();
    userTransactionsQuery();
  },
} satisfies RouteDefinition;

const TRX_STATUS_VARIANT = {
  LUNAS: 'lunas',
  MENUNGGU_BUKTI: 'menunggu',
  MENUNGGU_VERIF: 'menunggu',
  DITOLAK: 'telat',
  DIBATALKAN: 'dibatalkan',
} as const;

export default function AkunPage() {
  const user = createAsync(() => currentUserQuery());
  const rental = createAsync(() => activeRentalQuery());
  const transactions = createAsync(() => userTransactionsQuery());

  return (
    <TenantLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Dashboard Penyewa" noIndex />

      <Suspense fallback={<Skeleton class="mb-6 h-24" />}>
        <Show when={user()}>
          <div class="mb-6">
            <h1 class="text-xl font-bold text-ink">
              Selamat datang, {user()!.namaLengkap?.split(' ')[0] ?? 'Pengguna'}!
            </h1>
            <p class="text-sm text-slate-500">
              {new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date())}
            </p>
          </div>
        </Show>
      </Suspense>

      <Suspense fallback={<Skeleton class="mb-4 h-44" />}>
        <Show
          when={rental()}
          fallback={
            <EmptyState
              title="Belum ada sewa aktif"
              description="Cari kost favoritmu dan ajukan sewa untuk mulai."
              action={<ButtonLink href={ROUTES.CARI_KOST}>Cari Kost</ButtonLink>}
              class="mb-4"
            />
          }
        >
          {(r) => (
            <Card class="mb-4">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Sewa Aktif
                  </p>
                  <p class="mt-1 text-base font-bold text-ink">{r().room.boardingHouse.nama}</p>
                  <p class="text-sm text-slate-500">
                    Kamar {r().room.nomorKamar} · {r().room.boardingHouse.kota}
                  </p>
                </div>
                <div class="flex size-12 items-center justify-center rounded-2xl bg-primary-light">
                  <Home class="size-6 text-primary" />
                </div>
              </div>
              <div class="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                <div class="text-center">
                  <Calendar class="mx-auto size-4 text-slate-400" />
                  <p class="mt-0.5 text-xs text-slate-400">Mulai Sewa</p>
                  <p class="text-sm font-semibold text-ink">
                    {formatTanggal(r().tanggalMulai)}
                  </p>
                </div>
                <div class="text-center">
                  <Calendar class="mx-auto size-4 text-slate-400" />
                  <p class="mt-0.5 text-xs text-slate-400">Berakhir</p>
                  <p class="text-sm font-semibold text-ink">
                    {formatTanggal(r().tanggalAkhir)}
                  </p>
                </div>
                <div class="text-center">
                  <CreditCard class="mx-auto size-4 text-slate-400" />
                  <p class="mt-0.5 text-xs text-slate-400">Harga/bulan</p>
                  <p class="text-sm font-semibold text-ink">
                    {formatIDR(r().room.hargaBulan)}
                  </p>
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <ButtonLink
                  href={ROUTES.DETAIL_KOST(r().room.boardingHouse.slug)}
                  variant="secondary"
                  size="sm"
                  class="flex-1 text-center"
                >
                  Lihat Detail Kost
                </ButtonLink>
                <ButtonLink
                  href={ROUTES.CHAT}
                  variant="secondary"
                  size="sm"
                  class="flex-1 gap-1 text-center"
                >
                  <MessageSquare class="size-4" /> Chat Owner
                </ButtonLink>
              </div>
            </Card>
          )}
        </Show>
      </Suspense>

      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-sm font-bold text-ink">Tagihan Terbaru</h2>
        <A
          href={ROUTES.TAGIHAN_PENYEWA}
          class="text-xs font-medium text-primary hover:underline"
        >
          Lihat semua
        </A>
      </div>

      <Suspense fallback={<Skeleton class="h-32" />}>
        <Show
          when={transactions() && transactions()!.length > 0}
          fallback={
            <p class="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
              Belum ada tagihan
            </p>
          }
        >
          <div class="space-y-2">
            <For each={transactions()!.slice(0, 4)}>
              {(t) => (
                <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <div>
                    <p class="text-sm font-medium text-ink">
                      {t.tipe === 'BOOKING' ? 'Pembayaran Awal' : 'Perpanjangan'}
                    </p>
                    <p class="text-[10px] text-slate-400">
                      {t.rental.room.boardingHouse.nama}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="text-sm font-semibold text-ink">{formatIDR(t.nominal)}</p>
                      <p class="text-[10px] text-slate-400">
                        {formatTanggal(t.createdAt)}
                      </p>
                    </div>
                    <StatusBadge variant={TRX_STATUS_VARIANT[t.status]}>
                      {t.status === 'LUNAS'
                        ? 'Lunas'
                        : t.status === 'MENUNGGU_BUKTI'
                          ? 'Belum Bayar'
                          : t.status === 'MENUNGGU_VERIF'
                            ? 'Menunggu Verifikasi'
                            : t.status === 'DITOLAK'
                              ? 'Ditolak'
                              : 'Dibatalkan'}
                    </StatusBadge>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Suspense>

      {/* Quick links */}
      <For
        each={[
          { href: ROUTES.TAGIHAN_PENYEWA, icon: <CreditCard class="size-5 text-primary" />, label: 'Tagihan' },
          { href: ROUTES.WISHLIST, icon: <Home class="size-5 text-navy" />, label: 'Wishlist' },
          { href: ROUTES.KELUHAN_PENYEWA, icon: <MessageSquare class="size-5 text-warn" />, label: 'Keluhan' },
          { href: ROUTES.PROFIL_PENYEWA, icon: <Home class="size-5 text-success" />, label: 'Profil' },
        ]}
      >
        {(link) => (
          <A
            href={link.href}
            class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-primary/30 hover:bg-primary-light/10"
          >
            <div class="flex items-center gap-3">
              <div class="flex size-10 items-center justify-center rounded-xl bg-slate-50">
                {link.icon}
              </div>
              <p class="text-sm font-semibold text-ink">{link.label}</p>
            </div>
            <ChevronRight class="size-4 text-slate-300" />
          </A>
        )}
      </For>
    </TenantLayout>
  );
}
