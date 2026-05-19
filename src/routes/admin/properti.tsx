import { For } from 'solid-js';
import { Download, Search, MapPin, Home } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge, StatusBadge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

interface PropertiRow {
  nama: string;
  owner: string;
  ownerEmail: string;
  kota: string;
  kamar: number;
  terisi: number;
  hargaDari: string;
  tipe: 'Putra' | 'Putri' | 'Campur';
  status: 'Aktif' | 'Pending' | 'Ditangguhkan';
  bergabung: string;
}

const DATA: PropertiRow[] = [
  { nama: 'Kost Dahlia Putri', owner: 'Lia Sutanto', ownerEmail: 'lia.s@gmail.com', kota: 'Bandung', kamar: 8, terisi: 0, hargaDari: 'Rp 800rb', tipe: 'Putri', status: 'Pending', bergabung: '26 Mei 26' },
  { nama: 'Kost Pak Slamet A', owner: 'Pak Slamet Riyadi', ownerEmail: 'slamet.riyadi@mail.com', kota: 'Yogyakarta', kamar: 12, terisi: 10, hargaDari: 'Rp 650rb', tipe: 'Putra', status: 'Aktif', bergabung: '03 Jan 24' },
  { nama: 'Kost Pak Slamet B', owner: 'Pak Slamet Riyadi', ownerEmail: 'slamet.riyadi@mail.com', kota: 'Yogyakarta', kamar: 15, terisi: 13, hargaDari: 'Rp 700rb', tipe: 'Campur', status: 'Aktif', bergabung: '03 Jan 24' },
  { nama: 'Kost Melati', owner: 'Hadi Wijaya', ownerEmail: 'hadi.w@mail.com', kota: 'Jakarta Selatan', kamar: 5, terisi: 5, hargaDari: 'Rp 1,2jt', tipe: 'Putri', status: 'Aktif', bergabung: '14 Feb 25' },
  { nama: 'Kost Ananda Residence', owner: 'Tina Maharani', ownerEmail: 'tina@gmail.com', kota: 'Yogyakarta', kamar: 10, terisi: 7, hargaDari: 'Rp 900rb', tipe: 'Campur', status: 'Aktif', bergabung: '20 Aug 23' },
  { nama: 'Kost Berlian', owner: 'Ahmad Fauzi', ownerEmail: 'ahmad.f@mail.com', kota: 'Semarang', kamar: 6, terisi: 4, hargaDari: 'Rp 550rb', tipe: 'Putra', status: 'Ditangguhkan', bergabung: '11 Mar 25' },
];

const TIPE_VARIANT: Record<string, 'navy' | 'info' | 'default'> = {
  Putra: 'navy',
  Putri: 'info',
  Campur: 'default',
};

const STATUS_VARIANT: Record<string, 'lunas' | 'menunggu' | 'dibatalkan'> = {
  Aktif: 'lunas',
  Pending: 'menunggu',
  Ditangguhkan: 'dibatalkan',
};

export default function AdminPropertiPage() {
  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Properti Terdaftar" noIndex />

      <PageHeader
        title="Properti Terdaftar"
        description="1.284 properti di seluruh platform"
        action={<Button variant="secondary" size="sm" class="gap-1.5"><Download class="size-4" /> Ekspor</Button>}
        class="mb-4"
      />

      <Tabs
        items={[
          { id: 'semua', label: 'Semua', badge: 1284 },
          { id: 'aktif', label: 'Aktif', badge: 1247 },
          { id: 'pending', label: 'Pending KYC', badge: 21 },
          { id: 'ditangguhkan', label: 'Ditangguhkan', badge: 16 },
        ]}
        class="mb-4"
      />

      {/* Search & filters */}
      <div class="mb-4 flex flex-wrap gap-2">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari nama properti, owner, kota..."
            class="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {['Kota: Semua', 'Tipe: Semua', 'Status: Semua'].map((f) => (
          <select class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none">
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Stats summary */}
      <div class="mb-4 grid grid-cols-4 gap-3">
        {[
          { label: 'Total Kamar', value: '18.432', icon: <Home class="size-4 text-primary" /> },
          { label: 'Kamar Terisi', value: '14.219', icon: <Home class="size-4 text-success" /> },
          { label: 'Tingkat Hunian', value: '77.1%', icon: <Home class="size-4 text-navy" /> },
          { label: 'Kota Terbanyak', value: 'Yogyakarta', icon: <MapPin class="size-4 text-warn" /> },
        ].map((s) => (
          <div class="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3">
            <div class="flex size-8 items-center justify-center rounded-lg bg-slate-50">{s.icon}</div>
            <div>
              <p class="text-[10px] text-slate-400">{s.label}</p>
              <p class="text-sm font-bold text-ink">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table class="w-full text-sm">
          <thead class="border-b border-slate-100">
            <tr>
              {['PROPERTI', 'OWNER', 'LOKASI', 'KAMAR', 'HUNIAN', 'HARGA', 'TIPE', 'STATUS', 'AKSI'].map((h) => (
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <For each={DATA}>
              {(row) => {
                const pct = row.kamar > 0 ? Math.round((row.terisi / row.kamar) * 100) : 0;
                return (
                  <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td class="px-4 py-3">
                      <p class="font-medium text-ink">{row.nama}</p>
                      <p class="text-[10px] text-slate-400">{row.bergabung}</p>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <Avatar name={row.owner} size="sm" />
                        <div>
                          <p class="text-xs font-medium text-ink">{row.owner}</p>
                          <p class="text-[10px] text-slate-400">{row.ownerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-slate-500">
                      <div class="flex items-center gap-1"><MapPin class="size-3 text-slate-400" />{row.kota}</div>
                    </td>
                    <td class="px-4 py-3 text-slate-500">{row.kamar} kamar</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-1.5">
                        <div class="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            class={`h-full rounded-full ${pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warn' : 'bg-slate-300'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span class="text-xs text-slate-500">{pct}%</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-xs text-slate-500">{row.hargaDari}</td>
                    <td class="px-4 py-3"><Badge variant={TIPE_VARIANT[row.tipe]}>{row.tipe}</Badge></td>
                    <td class="px-4 py-3"><StatusBadge variant={STATUS_VARIANT[row.status]}>{row.status}</StatusBadge></td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1.5">
                        <button type="button" class="text-xs font-medium text-primary hover:underline">Lihat</button>
                        {row.status === 'Ditangguhkan'
                          ? <button type="button" class="text-xs font-medium text-success hover:underline">Aktifkan</button>
                          : <button type="button" class="text-xs font-medium text-warn hover:underline">Tangguhkan</button>
                        }
                      </div>
                    </td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
        <div class="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          Menampilkan 1–12 dari 1.284 properti
        </div>
      </div>
    </AdminLayout>
  );
}
