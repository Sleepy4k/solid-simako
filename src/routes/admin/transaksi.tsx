import { createAsync, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { currentUserQuery } from '~/server/actions/auth';
import { adminTransactionsQuery } from '~/server/actions/admin';
import { formatIDR, formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    adminTransactionsQuery();
  },
} satisfies RouteDefinition;

const VARIANT = {
  LUNAS: 'lunas',
  MENUNGGU_BUKTI: 'menunggu',
  MENUNGGU_VERIF: 'telat',
  DITOLAK: 'dibatalkan',
  DIBATALKAN: 'dibatalkan',
} as const;

export default function AdminTransaksiPage() {
  const user = createAsync(() => currentUserQuery());
  const list = createAsync(() => adminTransactionsQuery());

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Transaksi Platform" noIndex />

      <PageHeader
        title="Transaksi Platform"
        description="Riwayat semua pembayaran sewa di SIMAKO"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show
          when={list() && list()!.length > 0}
          fallback={<EmptyState title="Belum ada transaksi" />}
        >
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-100">
                <tr>
                  <For each={['PENYEWA', 'PROPERTI', 'TIPE', 'NOMINAL', 'STATUS', 'TANGGAL']}>
                    {(h) => (
                      <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {h}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={list()}>
                  {(t) => (
                    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <Avatar
                            name={t.rental.penyewa.profile?.namaLengkap ?? t.rental.penyewa.email}
                            size="sm"
                          />
                          <p class="text-xs">
                            {t.rental.penyewa.profile?.namaLengkap ?? t.rental.penyewa.email}
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-xs">
                        {t.rental.room.boardingHouse.nama} · Kamar {t.rental.room.nomorKamar}
                      </td>
                      <td class="px-4 py-3 text-xs">
                        {t.tipe === 'BOOKING' ? 'Booking' : 'Perpanjangan'}
                      </td>
                      <td class="px-4 py-3 font-semibold">{formatIDR(t.nominal)}</td>
                      <td class="px-4 py-3">
                        <StatusBadge variant={VARIANT[t.status]}>{t.status}</StatusBadge>
                      </td>
                      <td class="px-4 py-3 text-[10px] text-slate-400">
                        {formatTanggal(t.createdAt)}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>
    </AdminLayout>
  );
}
