import { A, createAsync, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { StatCard, Card } from '~/components/ui/Card';
import { Skeleton } from '~/components/ui/Skeleton';
import { ROUTES } from '~/constants/routes';
import { currentUserQuery } from '~/server/actions/auth';
import { adminOverviewQuery } from '~/server/actions/admin';
import { formatIDR } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    adminOverviewQuery();
  },
} satisfies RouteDefinition;

export default function AdminOverviewPage() {
  const user = createAsync(() => currentUserQuery());
  const overview = createAsync(() => adminOverviewQuery());

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Platform Overview — Admin" noIndex />

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-ink">Platform Overview</h1>
        <p class="text-sm text-slate-500">Status seluruh SIMAKO · realtime</p>
      </div>

      <Suspense
        fallback={
          <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <For each={[0, 1, 2, 3]}>{() => <Skeleton class="h-24" />}</For>
          </div>
        }
      >
        <Show when={overview()}>
          {(o) => {
            const maxGmv = () => Math.max(1, ...o().gmvSeries.map((g) => g.nominal));
            return (
              <>
                <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Total Penyewa" value={o().totalUsers.toLocaleString('id')} />
                  <StatCard label="Owner Terverifikasi" value={o().totalOwners.toLocaleString('id')} />
                  <StatCard label="Properti Aktif" value={o().totalKost.toLocaleString('id')} />
                  <StatCard
                    label="Transaksi Aktif"
                    value={o().activeRentals.toLocaleString('id')}
                  />
                </div>

                <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
                  <Card>
                    <h2 class="mb-4 text-sm font-bold text-ink">GMV 6 Bulan Terakhir</h2>
                    <Show
                      when={o().gmvSeries.length > 0}
                      fallback={<p class="py-6 text-sm text-slate-400">Belum ada data</p>}
                    >
                      <div class="flex h-40 items-end gap-2">
                        <For each={o().gmvSeries}>
                          {(g) => (
                            <div class="flex flex-1 flex-col items-center gap-1">
                              <div
                                class="w-full rounded-t-sm bg-primary/30"
                                style={{ height: `${(g.nominal / maxGmv()) * 100}%` }}
                                title={formatIDR(g.nominal)}
                              />
                              <span class="text-[9px] text-slate-400">{g.key}</span>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </Card>

                  <div class="space-y-3">
                    <A
                      href={ROUTES.VERIFIKASI_KYC}
                      class="block rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-primary/30"
                    >
                      <div class="flex items-center gap-3">
                        <div class="flex size-10 items-center justify-center rounded-xl bg-warn/10 text-warn">
                          <ShieldCheck class="size-5" />
                        </div>
                        <div>
                          <p class="text-[10px] text-slate-400">KYC Menunggu</p>
                          <p class="text-lg font-bold text-ink">{o().pendingKyc}</p>
                        </div>
                      </div>
                    </A>
                    <A
                      href={ROUTES.DISPUTE_CENTER}
                      class="block rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-primary/30"
                    >
                      <div class="flex items-center gap-3">
                        <div class="flex size-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
                          <AlertTriangle class="size-5" />
                        </div>
                        <div>
                          <p class="text-[10px] text-slate-400">Dispute Aktif</p>
                          <p class="text-lg font-bold text-ink">{o().openDisputes}</p>
                        </div>
                      </div>
                    </A>
                    <div class="rounded-2xl border border-slate-100 bg-white p-4">
                      <div class="flex items-center gap-3">
                        <div class="flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                          <Clock class="size-5" />
                        </div>
                        <div>
                          <p class="text-[10px] text-slate-400">Transaksi Berlangsung</p>
                          <p class="text-lg font-bold text-ink">{o().activeRentals}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          }}
        </Show>
      </Suspense>
    </AdminLayout>
  );
}
