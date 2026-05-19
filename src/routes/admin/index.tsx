import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { ShieldCheck, AlertTriangle, Image, FileText, Clock } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { StatCard, Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { ROUTES } from '~/constants/routes';

const ANTRIAN = [
  { tipe: 'KYC', label: 'KYC', nama: 'Lia Sutanto', detail: 'KTP · selfie terunggah', waktu: '9m', variant: 'menunggu' as const },
  { tipe: 'Dispute', label: 'Dispute', nama: 'Aji R. — Pak Slamet', detail: 'Sewa tidak sesuai deskripsi', waktu: '12m', variant: 'telat' as const },
  { tipe: 'KYC', label: 'KYC', nama: 'Owner Hadi Wijaya', detail: 'Dokumen tidak terbaca', waktu: '32m', variant: 'menunggu' as const },
  { tipe: 'Banner', label: 'Banner', nama: 'Promo Ramadan baru', detail: 'Menunggu approval', waktu: '5', variant: 'info' as const },
  { tipe: 'Report', label: 'Report', nama: 'Listing palsu dilaporkan', detail: 'Kost Berlian — 1 laporan', waktu: '5', variant: 'default' as const },
  { tipe: 'KYC', label: 'KYC', nama: 'Owner Tina Maharani', detail: 'Menunggu approval', waktu: '5', variant: 'menunggu' as const },
];

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const GMV = [820, 950, 1050, 1100, 1280, 1420, 1380, 1450, 1500, 1600, 1700, 1847];
const PENDING_IDX = [3, 5, 7, 9, 11];
const MAX = 2000;

export default function AdminOverviewPage() {
  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Platform Overview — Admin" noIndex />

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-ink">Platform Overview</h1>
        <p class="text-sm text-slate-500">Status seluruh SIMAKO · diperbarui 2 menit lalu</p>
      </div>

      {/* Stats */}
      <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Akun" value="12.481" trend="+218 minggu ini" trendUp />
        <StatCard label="Owner Terverifikasi" value="312" trend="+4 minggu ini" trendUp />
        <StatCard label="Transaksi Aktif" value="1.847" sub="38 pending" trend="-3.8 minggu ini" trendUp={false} />
        <StatCard label="Properti Terdaftar" value="1.284" trend="+27 minggu ini" trendUp />
      </div>

      <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Antrian moderasi + Chart */}
        <div class="space-y-6">
          <Card>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-sm font-bold text-ink">Antrian moderasi</h2>
              <A href={ROUTES.VERIFIKASI_KYC} class="text-xs font-medium text-primary hover:underline">Lihat semua</A>
            </div>
            <ul class="space-y-3">
              <For each={ANTRIAN}>
                {(item) => (
                  <li class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5">
                      <Avatar name={item.nama} size="sm" />
                      <div>
                        <p class="text-xs font-semibold text-ink">{item.nama}</p>
                        <p class="text-[10px] text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <Badge variant={item.variant} class="text-[9px]">{item.label}</Badge>
                      <span class="text-[10px] text-slate-400">{item.waktu}m</span>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </Card>

          {/* Line chart */}
          <Card>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-sm font-bold text-ink">Transaksi & GMV mingguan</h2>
              <div class="flex items-center gap-3 text-xs">
                <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-success" />Overview</span>
                <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-warn" />Pending</span>
              </div>
            </div>
            <div class="flex h-40 items-end gap-1.5">
              {BULAN.map((b, i) => (
                <div class="flex flex-1 flex-col items-center gap-1">
                  <div
                    class={`w-full rounded-t-sm ${PENDING_IDX.includes(i) ? 'bg-warn/50' : 'bg-success/40'}`}
                    style={{ height: `${(GMV[i] / MAX) * 100}%` }}
                  />
                  <span class="text-[9px] text-slate-400">{b}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick metrics */}
        <div class="space-y-4">
          {[
            { icon: <AlertTriangle class="size-5" />, label: 'Rasio sengketa', value: '0,18%', sub: 'Dari 1.847 transaksi', color: 'text-success bg-success-light' },
            { icon: <Clock class="size-5" />, label: 'Median verf. KYC', value: '4j 12m', sub: '↓ 28m vs SLA', color: 'text-primary bg-primary-light' },
            { icon: <ShieldCheck class="size-5" />, label: 'Kota terbanyak', value: 'Yogyakarta', sub: '50 properti · 286', color: 'text-navy bg-navy/10' },
          ].map((m) => (
            <Card padding="sm" class="flex items-center gap-3">
              <div class={`flex size-10 items-center justify-center rounded-xl ${m.color}`}>
                {m.icon}
              </div>
              <div>
                <p class="text-[10px] text-slate-400">{m.label}</p>
                <p class="text-base font-bold text-ink">{m.value}</p>
                <p class="text-[10px] text-slate-400">{m.sub}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
