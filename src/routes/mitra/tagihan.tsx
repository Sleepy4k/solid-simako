import { createAsync, useAction, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { PageHeader } from '~/components/shared/PageHeader';
import { StatusBadge } from '~/components/ui/Badge';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { Avatar } from '~/components/ui/Avatar';
import { currentUserQuery } from '~/server/actions/auth';
import {
  ownerTransactionsQuery,
  verifyTransactionAction,
} from '~/server/actions/mitra';
import { formatIDR, formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    ownerTransactionsQuery();
  },
} satisfies RouteDefinition;

const VARIANT = {
  LUNAS: 'lunas',
  MENUNGGU_BUKTI: 'menunggu',
  MENUNGGU_VERIF: 'telat',
  DITOLAK: 'dibatalkan',
  DIBATALKAN: 'dibatalkan',
} as const;

export default function TagihanMitraPage() {
  const user = createAsync(() => currentUserQuery());
  const trxList = createAsync(() => ownerTransactionsQuery());
  const verify = useAction(verifyTransactionAction);

  async function handleVerify(id: string, approve: boolean) {
    let note: string | undefined;
    if (!approve) {
      note = prompt('Alasan penolakan?') ?? undefined;
      if (!note) return;
    }
    await verify(id, approve, note);
  }

  return (
    <MitraLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Tagihan & Keuangan" noIndex />

      <PageHeader
        title="Tagihan & Keuangan"
        description="Verifikasi pembayaran dan kelola tagihan penghuni"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show
          when={trxList() && trxList()!.length > 0}
          fallback={<EmptyState title="Belum ada transaksi" />}
        >
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-100">
                <tr>
                  <For each={['PENYEWA', 'PROPERTI', 'TIPE', 'NOMINAL', 'STATUS', 'TANGGAL', 'AKSI']}>
                    {(h) => (
                      <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {h}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={trxList()}>
                  {(t) => (
                    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <Avatar
                            name={
                              t.rental.penyewa.profile?.namaLengkap ?? t.rental.penyewa.email
                            }
                            size="sm"
                          />
                          <div>
                            <p class="text-xs font-medium text-ink">
                              {t.rental.penyewa.profile?.namaLengkap ?? t.rental.penyewa.email}
                            </p>
                            <p class="text-[10px] text-slate-400">{t.rental.penyewa.email}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <p class="text-xs text-ink">{t.rental.room.boardingHouse.nama}</p>
                        <p class="text-[10px] text-slate-400">
                          Kamar {t.rental.room.nomorKamar}
                        </p>
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
                      <td class="px-4 py-3">
                        <div class="flex gap-1.5">
                          <Show when={t.buktiAsset}>
                            <a
                              href={t.buktiAsset!.url}
                              target="_blank"
                              rel="noreferrer"
                              class="text-xs font-medium text-primary hover:underline"
                            >
                              Bukti
                            </a>
                          </Show>
                          <Show when={t.status === 'MENUNGGU_VERIF'}>
                            <button
                              type="button"
                              onClick={() => handleVerify(t.id, true)}
                              class="text-xs font-medium text-success hover:underline"
                            >
                              Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerify(t.id, false)}
                              class="text-xs font-medium text-danger hover:underline"
                            >
                              Tolak
                            </button>
                          </Show>
                        </div>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>
    </MitraLayout>
  );
}
