import { A, createAsync, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { ArrowRight } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { StatCard, Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { Skeleton } from '~/components/ui/Skeleton';
import { ROUTES } from '~/constants/routes';
import { currentUserQuery } from '~/server/actions/auth';
import { ownerOverviewQuery, ownerKostListQuery } from '~/server/actions/mitra';
import { formatIDR } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    ownerOverviewQuery();
    ownerKostListQuery();
  },
} satisfies RouteDefinition;

export default function MitraOverviewPage() {
  const user = createAsync(() => currentUserQuery());
  const overview = createAsync(() => ownerOverviewQuery());
  const kostList = createAsync(() => ownerKostListQuery());

  return (
    <MitraLayout
      userName={user()?.namaLengkap ?? undefined}
      propertiCount={kostList()?.length}
    >
      <SEO title="Dashboard Mitra" noIndex />

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-ink">
          Selamat datang, {user()?.namaLengkap?.split(' ')[0] ?? 'Mitra'} 👋
        </h1>
        <p class="text-sm text-slate-500">
          Ringkasan operasi properti Anda
        </p>
      </div>

      <Suspense
        fallback={
          <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <For each={[0, 1, 2, 3]}>{() => <Skeleton class="h-24" />}</For>
          </div>
        }
      >
        <Show when={overview()}>
          {(o) => (
            <>
              <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Tingkat Hunian"
                  value={`${o().occupancyRate}%`}
                  sub={`${o().kamarTerisi} dari ${o().totalKamar} kamar`}
                />
                <StatCard
                  label="Total Kamar"
                  value={String(o().totalKamar)}
                  sub={`${o().kamarKosong} kosong`}
                />
                <StatCard
                  label="Pendapatan Bulan Ini"
                  value={formatIDR(o().pendapatanBulanIni)}
                />
                <StatCard
                  label="Menunggu Verifikasi"
                  value={String(o().pendingBookings)}
                  sub="Booking & pembayaran"
                />
              </div>

              <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Booking terbaru */}
                <Card>
                  <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-sm font-bold text-ink">Booking terbaru</h2>
                    <A
                      href={ROUTES.VERIFIKASI_BOOKING}
                      class="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Lihat semua <ArrowRight class="size-3" />
                    </A>
                  </div>
                  <Show
                    when={o().latestRentals.length > 0}
                    fallback={
                      <p class="py-6 text-center text-sm text-slate-400">
                        Belum ada booking masuk
                      </p>
                    }
                  >
                    <ul class="space-y-3">
                      <For each={o().latestRentals}>
                        {(r) => (
                          <li class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2.5">
                              <Avatar
                                name={r.penyewa.profile?.namaLengkap ?? r.penyewa.email}
                                size="sm"
                              />
                              <div>
                                <p class="text-xs font-semibold text-ink">
                                  {r.penyewa.profile?.namaLengkap ?? r.penyewa.email}
                                </p>
                                <p class="text-[10px] text-slate-400">
                                  {r.room.boardingHouse.nama} · Kamar {r.room.nomorKamar}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center gap-2">
                              <Badge
                                variant={
                                  r.status === 'AKTIF'
                                    ? 'lunas'
                                    : r.status === 'MENUNGGU_VERIF'
                                      ? 'menunggu'
                                      : 'default'
                                }
                                class="text-[9px]"
                              >
                                {r.status}
                              </Badge>
                              <span class="text-xs font-bold text-ink">
                                {formatIDR(r.hargaDisetujui)}
                              </span>
                            </div>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </Card>

                {/* Properti */}
                <Card>
                  <h2 class="mb-3 text-sm font-bold text-ink">Properti aktif</h2>
                  <Show
                    when={kostList() && kostList()!.length > 0}
                    fallback={
                      <p class="text-sm text-slate-400">
                        Belum ada properti.{' '}
                        <A href={ROUTES.PROPERTI_KAMAR} class="text-primary hover:underline">
                          Tambah sekarang
                        </A>
                      </p>
                    }
                  >
                    <ul class="space-y-2">
                      <For each={kostList()}>
                        {(k) => (
                          <li class="flex items-center justify-between rounded-xl border border-slate-100 p-2.5">
                            <div>
                              <p class="text-xs font-semibold text-ink">{k.nama}</p>
                              <p class="text-[10px] text-slate-400">
                                {k.kamarTerisi}/{k.totalKamar} terisi
                              </p>
                            </div>
                            <Badge variant={k.isPublished ? 'lunas' : 'default'} class="text-[9px]">
                              {k.isPublished ? 'Aktif' : 'Draft'}
                            </Badge>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </Card>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </MitraLayout>
  );
}
