import { For } from 'solid-js';
import { Download, Search, TrendingUp } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { StatusBadge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

interface TxRow {
  id: string;
  penyewa: string;
  penyewaEmail: string;
  properti: string;
  kamar: string;
  nominal: string;
  periode: string;
  metode: string;
  status: 'Lunas' | 'Menunggu' | 'Terlambat' | 'Dibatalkan';
  tanggal: string;
}

const DATA: TxRow[] = [
  { id: 'TRX-2026-0841', penyewa: 'Dewi Ananda', penyewaEmail: 'dewi.ag@mail.com', properti: 'Kost Pak Slamet A', kamar: 'Kamar 3', nominal: 'Rp 650.000', periode: 'Jun 2026', metode: 'Transfer BCA', status: 'Lunas', tanggal: '01 Jun 26' },
  { id: 'TRX-2026-0840', penyewa: 'Rangga Putra', penyewaEmail: 'rangga@mail.com', properti: 'Kost Ananda', kamar: 'Kamar 2A', nominal: 'Rp 900.000', periode: 'Jun 2026', metode: 'Transfer BCA', status: 'Menunggu', tanggal: '01 Jun 26' },
  { id: 'TRX-2026-0839', penyewa: 'Salma Rahmadani', penyewaEmail: 'salma@mail.com', properti: 'Kost Pak Slamet B', kamar: 'Kamar 7', nominal: 'Rp 700.000', periode: 'Jun 2026', metode: 'Transfer BRI', status: 'Lunas', tanggal: '01 Jun 26' },
  { id: 'TRX-2026-0835', penyewa: 'Bambang Sutrisno', penyewaEmail: 'bambang@mail.com', properti: 'Kost Melati', kamar: 'Kamar 1', nominal: 'Rp 1.200.000', periode: 'Jun 2026', metode: 'Transfer BCA', status: 'Terlambat', tanggal: '28 Mei 26' },
  { id: 'TRX-2026-0830', penyewa: 'Asep Hidayat', penyewaEmail: 'asep@mail.com', properti: 'Kost Berlian', kamar: 'Kamar 4', nominal: 'Rp 550.000', periode: 'Mei 2026', metode: 'Transfer Mandiri', status: 'Dibatalkan', tanggal: '01 Mei 26' },
];

const STATUS_VARIANT: Record<string, 'lunas' | 'menunggu' | 'telat' | 'dibatalkan'> = {
  Lunas: 'lunas',
  Menunggu: 'menunggu',
  Terlambat: 'telat',
  Dibatalkan: 'dibatalkan',
};

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const GMV = [820, 950, 1050, 1100, 1280, 1420, 1380, 1450, 1500, 1600, 1700, 1847];
const MAX = 2000;

export default function AdminTransaksiPage() {
  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Transaksi Platform" noIndex />

      <PageHeader
        title="Transaksi Platform"
        description="Rp 1,847 juta GMV bulan ini"
        action={<Button variant="secondary" size="sm" class="gap-1.5"><Download class="size-4" /> Ekspor</Button>}
        class="mb-4"
      />

      <Tabs
        items={[
          { id: 'semua', label: 'Semua', badge: 1847 },
          { id: 'lunas', label: 'Lunas', badge: 1794 },
          { id: 'menunggu', label: 'Menunggu', badge: 38 },
          { id: 'terlambat', label: 'Terlambat', badge: 15 },
        ]}
        class="mb-4"
      />

      {/* GMV Chart */}
      <div class="mb-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-slate-500">GMV Bulanan (juta IDR)</p>
            <p class="text-xl font-bold text-ink">Rp 1.847 jt</p>
          </div>
          <div class="flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-1 text-xs font-medium text-success">
            <TrendingUp class="size-3.5" /> +8.6% vs bulan lalu
          </div>
        </div>
        <div class="flex h-28 items-end gap-1">
          {BULAN.map((b, i) => (
            <div class="flex flex-1 flex-col items-center gap-0.5">
              <div
                class="w-full rounded-t-sm bg-primary/20 transition-all hover:bg-primary/40"
                style={{ height: `${(GMV[i] / MAX) * 100}%` }}
              />
              <span class="text-[9px] text-slate-400">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div class="mb-4 flex gap-2">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari ID transaksi, penyewa, properti..."
            class="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none">
          <option>Periode: Semua</option>
        </select>
        <select class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none">
          <option>Status: Semua</option>
        </select>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table class="w-full text-sm">
          <thead class="border-b border-slate-100">
            <tr>
              {['ID TRANSAKSI', 'PENYEWA', 'PROPERTI', 'NOMINAL', 'PERIODE', 'METODE', 'STATUS', 'TANGGAL', 'AKSI'].map((h) => (
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <For each={DATA}>
              {(row) => (
                <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td class="px-4 py-3">
                    <p class="font-mono text-xs font-medium text-ink">{row.id}</p>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <Avatar name={row.penyewa} size="sm" />
                      <div>
                        <p class="text-xs font-medium text-ink">{row.penyewa}</p>
                        <p class="text-[10px] text-slate-400">{row.penyewaEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <p class="text-xs text-ink">{row.properti}</p>
                    <p class="text-[10px] text-slate-400">{row.kamar}</p>
                  </td>
                  <td class="px-4 py-3 font-medium text-ink">{row.nominal}</td>
                  <td class="px-4 py-3 text-slate-500">{row.periode}</td>
                  <td class="px-4 py-3 text-xs text-slate-500">{row.metode}</td>
                  <td class="px-4 py-3"><StatusBadge variant={STATUS_VARIANT[row.status]}>{row.status}</StatusBadge></td>
                  <td class="px-4 py-3 text-slate-500">{row.tanggal}</td>
                  <td class="px-4 py-3">
                    <button type="button" class="text-xs font-medium text-primary hover:underline">Detail</button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <div class="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          Menampilkan 1–12 dari 1.847 transaksi
        </div>
      </div>
    </AdminLayout>
  );
}
