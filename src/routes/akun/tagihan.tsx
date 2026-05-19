import { For } from 'solid-js';
import { Upload, CheckCircle } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Tabs } from '~/components/ui/Tabs';

const TAGIHAN = [
  { id: 'TRX-2026-0841', bulan: 'Jun 2026', properti: 'Kost Pak Slamet A – Kamar 3', nominal: 'Rp 650.000', jatuhTempo: '05 Jun 26', status: 'Menunggu' as const, noRek: '2810 4477 91', namaBank: 'BCA a/n Slamet Riyadi' },
  { id: 'TRX-2026-0812', bulan: 'Mei 2026', properti: 'Kost Pak Slamet A – Kamar 3', nominal: 'Rp 650.000', jatuhTempo: '05 Mei 26', status: 'Lunas' as const, noRek: '', namaBank: '' },
  { id: 'TRX-2026-0778', bulan: 'Apr 2026', properti: 'Kost Pak Slamet A – Kamar 3', nominal: 'Rp 650.000', jatuhTempo: '05 Apr 26', status: 'Lunas' as const, noRek: '', namaBank: '' },
  { id: 'TRX-2026-0743', bulan: 'Mar 2026', properti: 'Kost Pak Slamet A – Kamar 3', nominal: 'Rp 650.000', jatuhTempo: '05 Mar 26', status: 'Lunas' as const, noRek: '', namaBank: '' },
];

const STATUS_VARIANT = {
  Lunas: 'lunas' as const,
  Menunggu: 'menunggu' as const,
  Terlambat: 'telat' as const,
};

export default function TagihanPenyewaPage() {
  const menunggu = TAGIHAN.filter((t) => t.status === 'Menunggu');
  const riwayat = TAGIHAN.filter((t) => t.status === 'Lunas');

  return (
    <TenantLayout userName="Dewi Ananda">
      <SEO title="Tagihan Saya" noIndex />

      <h1 class="mb-4 text-xl font-bold text-ink">Tagihan Saya</h1>

      <Tabs
        items={[
          { id: 'menunggu', label: 'Belum Dibayar', badge: menunggu.length },
          { id: 'riwayat', label: 'Riwayat', badge: riwayat.length },
        ]}
        class="mb-4"
      />

      {/* Tagihan menunggu */}
      {menunggu.map((t) => (
        <div class="mb-4 overflow-hidden rounded-2xl border border-warn/30 bg-white">
          <div class="flex items-start justify-between border-b border-slate-100 p-4">
            <div>
              <p class="font-semibold text-ink">{t.bulan}</p>
              <p class="text-sm text-slate-500">{t.properti}</p>
              <p class="mt-1 font-mono text-[10px] text-slate-400">{t.id}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-ink">{t.nominal}</p>
              <p class="text-xs text-warn">Jatuh tempo {t.jatuhTempo}</p>
            </div>
          </div>
          <div class="bg-amber-50 p-4">
            <p class="mb-2 text-xs font-semibold text-warn">Instruksi Pembayaran</p>
            <div class="rounded-xl bg-white p-3 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Bank</span>
                <span class="font-medium text-ink">{t.namaBank}</span>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-slate-500">No. Rekening</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono font-bold text-ink">{t.noRek}</span>
                  <button
                    type="button"
                    class="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200"
                    onClick={() => navigator.clipboard.writeText(t.noRek)}
                  >
                    Salin
                  </button>
                </div>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-slate-500">Jumlah Transfer</span>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-primary">{t.nominal}</span>
                  <button
                    type="button"
                    class="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-2 border-t border-slate-100 p-4">
            <Button size="sm" class="flex-1 gap-1.5">
              <Upload class="size-4" /> Unggah Bukti Transfer
            </Button>
          </div>
        </div>
      ))}

      {/* Riwayat */}
      <div class="space-y-2">
        <For each={riwayat}>
          {(t) => (
            <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <div class="flex items-center gap-3">
                <CheckCircle class="size-5 text-success" />
                <div>
                  <p class="text-sm font-medium text-ink">{t.bulan}</p>
                  <p class="font-mono text-[10px] text-slate-400">{t.id}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <p class="text-sm font-semibold text-ink">{t.nominal}</p>
                <StatusBadge variant={STATUS_VARIANT[t.status]}>{t.status}</StatusBadge>
                <button type="button" class="text-xs text-primary hover:underline">Kuitansi</button>
              </div>
            </div>
          )}
        </For>
      </div>
    </TenantLayout>
  );
}
