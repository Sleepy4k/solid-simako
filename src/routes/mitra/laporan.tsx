import { Download, TrendingUp } from 'lucide-solid';
import { For } from 'solid-js';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Card, StatCard } from '~/components/ui/Card';
import { PageHeader } from '~/components/shared/PageHeader';

const MAX = 30;

const GRAFIK = [
  { bulan: 'Jan', nilai: 18, aktif: false },
  { bulan: 'Feb', nilai: 20, aktif: false },
  { bulan: 'Mar', nilai: 21, aktif: false },
  { bulan: 'Apr', nilai: 22, aktif: false },
  { bulan: 'Mei', nilai: 28.4, aktif: true },
  { bulan: 'Jun', nilai: 0, aktif: false },
];

const EKSPOR_ITEMS = [
  { title: 'Laporan Keuangan', desc: 'Pendapatan, tagihan, rekapitulasi per kamar', format: 'PDF / Excel' },
  { title: 'Daftar Penyewa', desc: 'Data kontak, periode sewa, status tagihan', format: 'Excel / CSV' },
  { title: 'Riwayat Transaksi', desc: 'Semua pembayaran masuk & konfirmasi', format: 'PDF / Excel' },
];

export default function LaporanPage() {
  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Laporan & Ekspor" noIndex />

      <PageHeader
        title="Laporan & Ekspor"
        description="Ringkasan keuangan dan operasional propertimu"
        action={
          <Button variant="secondary" class="gap-2">
            <Download class="size-4" /> Ekspor PDF
          </Button>
        }
        class="mb-6"
      />

      {/* Period selector */}
      <div class="mb-6 flex items-center gap-2">
        <select class="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option>Mei 2026</option>
          <option>Apr 2026</option>
          <option>Mar 2026</option>
        </select>
        <select class="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option>Semua Properti</option>
          <option>Griya Asri Pogung</option>
          <option>Wisma Tanjung 2</option>
        </select>
      </div>

      {/* Stats */}
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pendapatan" value="Rp 28,4jt" trend="6,2% vs target" trendUp />
        <StatCard label="Tingkat Hunian" value="87%" trend="4% vs bulan lalu" trendUp />
        <StatCard label="Penyewa Aktif" value="34" sub="dari 39 kamar terisi" />
        <StatCard label="Tagihan Lunas" value="28" sub="4 menunggu · 2 telat" />
      </div>

      {/* Chart */}
      <Card class="mb-6">
        <div class="mb-4 flex items-center gap-2">
          <TrendingUp class="size-4 text-primary" />
          <h2 class="text-sm font-bold text-ink">Tren pendapatan</h2>
        </div>
        <div class="flex h-40 items-end gap-3">
          <For each={GRAFIK}>
            {(g) => (
              <div class="flex flex-1 flex-col items-center gap-1">
                <div
                  class={`w-full rounded-t-lg ${g.aktif ? 'bg-primary' : 'bg-primary/20'}`}
                  style={{ height: g.nilai > 0 ? `${(g.nilai / MAX) * 100}%` : '4px' }}
                />
                <span class="text-[10px] text-slate-400">{g.bulan}</span>
              </div>
            )}
          </For>
        </div>
      </Card>

      {/* Export options */}
      <Card>
        <h2 class="mb-4 text-sm font-bold text-ink">Ekspor laporan</h2>
        <div class="grid gap-3 sm:grid-cols-3">
          <For each={EKSPOR_ITEMS}>
            {(item) => (
              <div class="flex flex-col justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <p class="text-sm font-semibold text-ink">{item.title}</p>
                  <p class="mt-1 text-xs text-slate-500">{item.desc}</p>
                  <p class="mt-1 text-[10px] text-slate-400">{item.format}</p>
                </div>
                <Button variant="secondary" size="sm" class="mt-3 gap-1.5">
                  <Download class="size-3.5" /> Unduh
                </Button>
              </div>
            )}
          </For>
        </div>
      </Card>
    </MitraLayout>
  );
}
