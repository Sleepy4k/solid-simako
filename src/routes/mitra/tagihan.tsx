import { createSignal, For } from 'solid-js';
import { Filter, Download, Bell, Upload, FileText } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge, StatusBadge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Tabs } from '~/components/ui/Tabs';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

type TagihanStatus = 'lunas' | 'cek-bukti' | 'telat' | 'belum-bayar';

interface TagihanRow {
  nama: string;
  kamar: string;
  jatuhTempo: string;
  nominal: number;
  bank?: string;
  status: TagihanStatus;
}

const DATA: TagihanRow[] = [
  { nama: 'Dewi Ananda', kamar: 'Griya Asri · 04', jatuhTempo: '28 Apr', nominal: 850347, bank: 'BCA · 16:21 24 Apr', status: 'cek-bukti' },
  { nama: 'Rangga Putra', kamar: 'Tanjung · 12', jatuhTempo: '28 Apr', nominal: 1280218, bank: 'BCA · 08:04 26 Apr', status: 'cek-bukti' },
  { nama: 'Salma Rahmadani', kamar: 'Griya Asri · 02', jatuhTempo: '28 Apr', nominal: 850000, bank: undefined, status: 'lunas' },
  { nama: 'Nadya Kusuma', kamar: 'Griya Asri · 04', jatuhTempo: '28 Apr', nominal: 850000, bank: undefined, status: 'lunas' },
  { nama: 'Mega Putri', kamar: 'Griya Asri · 07', jatuhTempo: '28 Apr', nominal: 900000, bank: undefined, status: 'lunas' },
  { nama: 'Bambang S.', kamar: 'Griya Asri · 11', jatuhTempo: '28 Apr', nominal: 900000, bank: undefined, status: 'telat' },
  { nama: 'Inka Lestari', kamar: 'Griya Asri · 08', jatuhTempo: '28 Apr', nominal: 900000, bank: undefined, status: 'lunas' },
  { nama: 'Bunga Damayanti', kamar: 'Griya Asri · 11', jatuhTempo: '28 Apr', nominal: 900000, bank: undefined, status: 'belum-bayar' },
];

const STATUS_LABEL: Record<TagihanStatus, string> = {
  lunas: 'Lunas',
  'cek-bukti': 'Cek bukti',
  telat: 'Telat',
  'belum-bayar': 'Belum bayar',
};

const STATUS_VARIANT: Record<TagihanStatus, 'lunas' | 'menunggu' | 'telat' | 'default'> = {
  lunas: 'lunas',
  'cek-bukti': 'menunggu',
  telat: 'telat',
  'belum-bayar': 'default',
};

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n).replace('IDR', 'Rp');
}

export default function TagihanPage() {
  const summary = () => ({
    lunas: DATA.filter((d) => d.status === 'lunas').length,
    cekBukti: DATA.filter((d) => d.status === 'cek-bukti').length,
    telat: DATA.filter((d) => d.status === 'telat').length,
    belumBayar: DATA.filter((d) => d.status === 'belum-bayar').length,
  });

  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Penyewa & Tagihan" noIndex />

      <PageHeader
        title="Penyewa & Tagihan"
        description="34 penyewa aktif · 2 menunggu verifikasi"
        action={
          <div class="flex gap-2">
            <Button variant="secondary" size="sm" class="gap-1.5"><Filter class="size-4" /> Filter</Button>
            <Button variant="secondary" size="sm" class="gap-1.5"><Download class="size-4" /> Ekspor</Button>
          </div>
        }
        class="mb-4"
      />

      <Tabs
        items={[
          { id: 'aktif', label: 'Penyewa Aktif', badge: 34 },
          { id: 'mei', label: 'Tagihan Mei 2026', badge: 34 },
          { id: 'riwayat', label: 'Riwayat' },
        ]}
        class="mb-4"
      />

      {/* Sub-filter chips */}
      <div class="mb-4 flex gap-2">
        {[
          { label: `Lunas ${summary().lunas}`, v: 'lunas' as const },
          { label: `Cek bukti ${summary().cekBukti}`, v: 'menunggu' as const },
          { label: `Telat ${summary().telat}`, v: 'telat' as const },
          { label: `Belum bayar ${summary().belumBayar}`, v: 'default' as const },
        ].map((chip) => (
          <Badge variant={chip.v}>{chip.label}</Badge>
        ))}
      </div>

      {/* Table */}
      <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table class="w-full text-sm">
          <thead class="border-b border-slate-100">
            <tr class="text-left">
              {['PENYEWA', 'KAMAR', 'JATUH TEMPO', 'NOMINAL', 'BUKTI', 'STATUS', 'AKSI'].map((h) => (
                <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <For each={DATA}>
              {(row) => (
                <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2.5">
                      <Avatar name={row.nama} size="sm" />
                      <span class="font-medium text-ink">{row.nama}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-slate-500">{row.kamar}</td>
                  <td class="px-4 py-3 text-slate-500">{row.jatuhTempo}</td>
                  <td class="px-4 py-3 font-medium text-ink">{formatRp(row.nominal)}</td>
                  <td class="px-4 py-3 text-xs text-slate-400">{row.bank ?? '—'}</td>
                  <td class="px-4 py-3">
                    <StatusBadge variant={STATUS_VARIANT[row.status]}>
                      {STATUS_LABEL[row.status]}
                    </StatusBadge>
                  </td>
                  <td class="px-4 py-3">
                    {row.status === 'cek-bukti' && (
                      <Button size="sm" class="text-xs">Verifikasi</Button>
                    )}
                    {row.status === 'lunas' && (
                      <button type="button" class="text-xs font-medium text-slate-500 hover:text-primary">Kuitansi</button>
                    )}
                    {(row.status === 'telat' || row.status === 'belum-bayar') && (
                      <button type="button" class="flex items-center gap-1 text-xs font-medium text-warn hover:text-amber-700">
                        <Bell class="size-3.5" /> Ingatkan
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </MitraLayout>
  );
}
