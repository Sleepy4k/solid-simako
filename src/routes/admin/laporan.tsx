import { Download, TrendingUp, TrendingDown, Users, Home, DollarSign, AlertCircle } from 'lucide-solid';
import { For } from 'solid-js';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Card, StatCard } from '~/components/ui/Card';
import { PageHeader } from '~/components/shared/PageHeader';

const MAX_GMV = 2000;
const MAX_USER = 600;

const GRAFIK_GMV = [
  { bulan: 'Jan', gmv: 820, user: 240 },
  { bulan: 'Feb', gmv: 950, user: 310 },
  { bulan: 'Mar', gmv: 1050, user: 280 },
  { bulan: 'Apr', gmv: 1100, user: 350 },
  { bulan: 'Mei', gmv: 1280, user: 420 },
  { bulan: 'Jun', gmv: 1420, user: 390 },
  { bulan: 'Jul', gmv: 1380, user: 410 },
  { bulan: 'Agu', gmv: 1450, user: 460 },
  { bulan: 'Sep', gmv: 1500, user: 480 },
  { bulan: 'Okt', gmv: 1600, user: 510 },
  { bulan: 'Nov', gmv: 1700, user: 530 },
  { bulan: 'Des', gmv: 1847, user: 560 },
];

const TOP_KOTA = [
  { nama: 'Yogyakarta', properti: 50, pct: 100 },
  { nama: 'Bandung', properti: 38, pct: 76 },
  { nama: 'Semarang', properti: 29, pct: 58 },
  { nama: 'Jakarta Selatan', properti: 21, pct: 42 },
  { nama: 'Purwokerto', properti: 14, pct: 28 },
];

const KOMPOSISI = [
  { label: 'Penyewa Aktif', value: '12.481', pct: 97.5, color: 'bg-navy' },
  { label: 'Owner Terverifikasi', value: '312', pct: 2.5, color: 'bg-primary' },
  { label: 'Tingkat Hunian Rata-rata', value: '77.1%', pct: 77.1, color: 'bg-success' },
  { label: 'Pembayaran Tepat Waktu', value: '97.2%', pct: 97.2, color: 'bg-success' },
  { label: 'KYC Disetujui', value: '96.3%', pct: 96.3, color: 'bg-navy' },
];

const EKSPOR_OPTIONS = [
  'Laporan GMV', 'Daftar Pengguna', 'Daftar Properti',
  'Transaksi Lengkap', 'Laporan KYC', 'Laporan Dispute',
];

export default function AdminLaporanPage() {
  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Laporan & Insight" noIndex />

      <PageHeader
        title="Laporan & Insight"
        description="Data platform SIMAKO · Diperbarui 2 menit lalu"
        action={
          <div class="flex gap-2">
            <select class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none">
              <option>30 hari terakhir</option>
              <option>3 bulan</option>
              <option>12 bulan</option>
            </select>
            <Button variant="secondary" size="sm" class="gap-1.5"><Download class="size-4" /> Ekspor PDF</Button>
          </div>
        }
        class="mb-6"
      />

      {/* KPI Cards */}
      <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total GMV"
          value="Rp 1,847 jt"
          trend="+8.6% vs bulan lalu"
          trendUp
          icon={<DollarSign class="size-5 text-primary" />}
        />
        <StatCard
          label="Pengguna Baru"
          value="560"
          trend="+5.7% vs bulan lalu"
          trendUp
          icon={<Users class="size-5 text-navy" />}
        />
        <StatCard
          label="Properti Aktif"
          value="1.247"
          trend="+27 bulan ini"
          trendUp
          icon={<Home class="size-5 text-success" />}
        />
        <StatCard
          label="Rasio Dispute"
          value="0.18%"
          sub="3 aktif bulan ini"
          trend="-0.04% vs bulan lalu"
          trendUp
          icon={<AlertCircle class="size-5 text-warn" />}
        />
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        {/* GMV Chart */}
        <Card>
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-ink">GMV Bulanan</h2>
              <p class="text-[10px] text-slate-400">Juta IDR · Jan – Des 2026</p>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-medium text-success">
              <TrendingUp class="size-4" /> +8.6%
            </div>
          </div>
          <div class="flex h-40 items-end gap-1">
            <For each={GRAFIK_GMV}>
              {(g) => (
                <div class="flex flex-1 flex-col items-center gap-0.5">
                  <span class="text-[9px] text-slate-400">{g.gmv}</span>
                  <div
                    class="w-full rounded-t-sm bg-primary/30 transition-all hover:bg-primary/50"
                    style={{ height: `${(g.gmv / MAX_GMV) * 100}%` }}
                  />
                  <span class="text-[9px] text-slate-400">{g.bulan}</span>
                </div>
              )}
            </For>
          </div>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-ink">Pengguna Baru</h2>
              <p class="text-[10px] text-slate-400">Per bulan · Jan – Des 2026</p>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-medium text-success">
              <TrendingUp class="size-4" /> +5.7%
            </div>
          </div>
          <div class="flex h-40 items-end gap-1">
            <For each={GRAFIK_GMV}>
              {(g) => (
                <div class="flex flex-1 flex-col items-center gap-0.5">
                  <div
                    class="w-full rounded-t-sm bg-navy/20 transition-all hover:bg-navy/40"
                    style={{ height: `${(g.user / MAX_USER) * 100}%` }}
                  />
                  <span class="text-[9px] text-slate-400">{g.bulan}</span>
                </div>
              )}
            </For>
          </div>
        </Card>

        {/* Top Kota */}
        <Card>
          <h2 class="mb-4 text-sm font-bold text-ink">Properti per Kota</h2>
          <div class="space-y-3">
            <For each={TOP_KOTA}>
              {(k, i) => (
                <div>
                  <div class="mb-1 flex items-center justify-between text-xs">
                    <span class="flex items-center gap-1.5">
                      <span class="font-mono text-[10px] text-slate-400">#{i() + 1}</span>
                      <span class="font-medium text-ink">{k.nama}</span>
                    </span>
                    <span class="text-slate-500">{k.properti} properti</span>
                  </div>
                  <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full rounded-full bg-primary/60" style={{ width: `${k.pct}%` }} />
                  </div>
                </div>
              )}
            </For>
          </div>
        </Card>

        {/* Komposisi Pengguna */}
        <Card>
          <h2 class="mb-4 text-sm font-bold text-ink">Komposisi Platform</h2>
          <div class="space-y-4">
            <For each={KOMPOSISI}>
              {(m) => (
                <div>
                  <div class="mb-1 flex justify-between text-xs">
                    <span class="text-slate-500">{m.label}</span>
                    <span class="font-semibold text-ink">{m.value}</span>
                  </div>
                  <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div class={`h-full rounded-full ${m.color} opacity-60`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              )}
            </For>
          </div>
        </Card>
      </div>

      {/* Export options */}
      <Card class="mt-6">
        <h2 class="mb-3 text-sm font-bold text-ink">Ekspor Laporan</h2>
        <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
          <For each={EKSPOR_OPTIONS}>
            {(r) => (
              <button
                type="button"
                class="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left text-xs font-medium text-ink transition hover:border-primary/30 hover:bg-primary-light/20"
              >
                <Download class="size-3.5 text-primary" /> {r}
              </button>
            )}
          </For>
        </div>
      </Card>
    </AdminLayout>
  );
}
