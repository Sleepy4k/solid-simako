import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-solid';
import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { StatCard, Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Avatar } from '~/components/ui/Avatar';
import { ROUTES } from '~/constants/routes';

const STAT_CARDS = [
  { label: 'Tingkat Hunian', value: '87%', sub: '5 kosong · 0 maintenance', trend: '4% vs bulan lalu', trendUp: true },
  { label: 'Total Kamar', value: '34', sub: '39 terisi', trend: undefined, trendUp: false },
  { label: 'Pendapatan Bulan Ini', value: 'Rp 28,4jt', sub: undefined, trend: '6,2% vs target', trendUp: true },
  { label: 'Menunggu Verifikasi', value: '4', sub: '2 booking baru, 2 sewa bulanan', trend: undefined, trendUp: false },
];

const MENUNGGU_VERIF = [
  { nama: 'Dewi Ananda', info: 'Booking · Griya Asri 04', nominal: 'Rp 5,6jt', tag: 'baru', initials: 'DA' },
  { nama: 'Rangga P.', info: 'Sewa Juni · Tanjung 12', nominal: 'Rp 1,2jt', tag: 'sewa', initials: 'RP' },
  { nama: 'Ayu Nirmala', info: 'Booking · Seroja 08', nominal: 'Rp 4,2jt', tag: 'baru', initials: 'AN' },
  { nama: 'Bambang S.', info: 'Sewa Juni · Asri 11', nominal: 'Rp 850rb', tag: 'sewa', initials: 'BS' },
];

const BULAN = ['Jun', 'Jul', 'Agu', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
const NILAI = [12, 14, 13, 15, 16, 17, 18, 19, 20, 22, 28.4];
const MAX = 30;

export default function MitraOverviewPage() {
  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Dashboard Mitra" noIndex />

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-ink">Selamat pagi, Pak Slamet 👋</h1>
        <p class="text-sm text-slate-500">Ringkasan operasi 3 properti · Mei 2026</p>
      </div>

      {/* Stat cards */}
      <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <StatCard {...s} />
        ))}
      </div>

      <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Chart */}
        <Card>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-bold text-ink">Pendapatan 12 bulan</h2>
            <div class="flex gap-1.5">
              {['6 bln', '12 bln'].map((l, i) => (
                <button
                  type="button"
                  class={[
                    'rounded-lg px-2.5 py-1 text-xs font-medium',
                    i === 1 ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-100',
                  ].join(' ')}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div class="flex h-48 items-end gap-2">
            {BULAN.map((bulan, i) => {
              const isLast = i === BULAN.length - 1;
              const pct = (NILAI[i] / MAX) * 100;
              return (
                <div class="group flex flex-1 flex-col items-center gap-1">
                  {isLast && (
                    <span class="text-[10px] font-bold text-primary">{NILAI[i]}jt</span>
                  )}
                  <div
                    class={[
                      'w-full rounded-t-lg transition-all',
                      isLast ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40',
                    ].join(' ')}
                    style={{ height: `${pct}%` }}
                  />
                  <span class="text-[9px] text-slate-400">{bulan}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Menunggu verifikasi */}
        <Card>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-bold text-ink">Menunggu verifikasi</h2>
            <span class="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              4
            </span>
          </div>

          <ul class="space-y-3">
            <For each={MENUNGGU_VERIF}>
              {(item) => (
                <li class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <Avatar name={item.nama} size="sm" />
                    <div>
                      <p class="text-xs font-semibold text-ink">{item.nama}</p>
                      <p class="text-[10px] text-slate-400">{item.info}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-ink">{item.nominal}</p>
                    <Badge variant={item.tag === 'baru' ? 'menunggu' : 'info'} class="text-[9px]">
                      {item.tag}
                    </Badge>
                  </div>
                </li>
              )}
            </For>
          </ul>

          <A
            href={ROUTES.VERIFIKASI_BOOKING}
            class="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
          >
            Buka semua → <ArrowRight class="size-4" />
          </A>
        </Card>
      </div>
    </MitraLayout>
  );
}
