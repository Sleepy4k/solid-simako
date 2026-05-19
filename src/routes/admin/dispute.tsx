import { createSignal, For, Show } from 'solid-js';
import { AlertTriangle, CheckCircle, MessageSquare, X } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge, StatusBadge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

interface DisputeItem {
  id: string;
  penyewa: string;
  penyewaEmail: string;
  owner: string;
  properti: string;
  masalah: string;
  detail: string;
  status: 'Baru' | 'Diproses' | 'Selesai' | 'Ditolak';
  prioritas: 'Tinggi' | 'Sedang' | 'Rendah';
  waktu: string;
  pesan: number;
}

const DISPUTES: DisputeItem[] = [
  { id: 'DSP-001', penyewa: 'Aji Rahmat', penyewaEmail: 'aji@mail.com', owner: 'Pak Slamet Riyadi', properti: 'Kost Pak Slamet A – Kamar 3', masalah: 'Sewa tidak sesuai deskripsi', detail: 'Kamar lebih kecil dari foto, AC tidak berfungsi sejak awal masuk. Sudah lapor owner tapi tidak ada tindakan selama 2 minggu.', status: 'Diproses', prioritas: 'Tinggi', waktu: '12m lalu', pesan: 4 },
  { id: 'DSP-002', penyewa: 'Budi Santoso', penyewaEmail: 'budi@mail.com', owner: 'Hadi Wijaya', properti: 'Kost Melati – Kamar 1', masalah: 'Deposit tidak dikembalikan', detail: 'Sudah keluar 2 bulan lalu tapi deposit Rp 1.200.000 belum dikembalikan. Owner tidak responsif.', status: 'Baru', prioritas: 'Tinggi', waktu: '1j lalu', pesan: 2 },
  { id: 'DSP-003', penyewa: 'Citra Dewi', penyewaEmail: 'citra@mail.com', owner: 'Tina Maharani', properti: 'Kost Ananda – Kamar 5', masalah: 'Fasilitas rusak tidak diperbaiki', detail: 'Kamar mandi bocor sejak 3 minggu. Sudah komplain berkali-kali.', status: 'Baru', prioritas: 'Sedang', waktu: '3j lalu', pesan: 1 },
  { id: 'DSP-004', penyewa: 'Dian Purnama', penyewaEmail: 'dian@mail.com', owner: 'Ahmad Fauzi', properti: 'Kost Berlian – Kamar 2', masalah: 'Pengusiran sepihak', detail: 'Diusir tanpa alasan jelas padahal belum lewat kontrak.', status: 'Selesai', prioritas: 'Tinggi', waktu: '2 hari lalu', pesan: 8 },
];

const STATUS_VARIANT: Record<string, 'menunggu' | 'telat' | 'lunas' | 'dibatalkan'> = {
  Baru: 'menunggu',
  Diproses: 'telat',
  Selesai: 'lunas',
  Ditolak: 'dibatalkan',
};

const PRIORITAS_COLOR: Record<string, string> = {
  Tinggi: 'text-danger bg-danger/10',
  Sedang: 'text-warn bg-warn/10',
  Rendah: 'text-slate-500 bg-slate-100',
};

export default function AdminDisputePage() {
  const [selected, setSelected] = createSignal<DisputeItem>(DISPUTES[0]);
  const [reply, setReply] = createSignal('');

  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Dispute Center" noIndex />

      <div class="mb-4 flex items-center justify-between">
        <PageHeader title="Dispute Center" description="3 dispute aktif memerlukan perhatian" />
      </div>

      <Tabs
        items={[
          { id: 'semua', label: 'Semua', badge: 14 },
          { id: 'baru', label: 'Baru', badge: 2 },
          { id: 'diproses', label: 'Diproses', badge: 1 },
          { id: 'selesai', label: 'Selesai', badge: 11 },
        ]}
        class="mb-4"
      />

      <div class="grid h-[calc(100vh-15rem)] gap-4 lg:grid-cols-[1fr_360px]">
        {/* List */}
        <div class="overflow-auto rounded-2xl border border-slate-100 bg-white">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-100">
              <tr>
                {['DISPUTE', 'PIHAK', 'MASALAH', 'PRIORITAS', 'STATUS', 'WAKTU', ''].map((h) => (
                  <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <For each={DISPUTES}>
                {(d) => (
                  <tr
                    class={[
                      'cursor-pointer border-b border-slate-50 transition last:border-0',
                      selected().id === d.id ? 'bg-primary-light/30' : 'hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setSelected(d)}
                  >
                    <td class="px-4 py-3">
                      <p class="font-mono text-xs font-semibold text-ink">{d.id}</p>
                      <p class="text-[10px] text-slate-400">{d.properti}</p>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-1.5">
                        <Avatar name={d.penyewa} size="sm" />
                        <div>
                          <p class="text-xs font-medium text-ink">{d.penyewa}</p>
                          <p class="text-[10px] text-slate-400">vs {d.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td class="max-w-[160px] px-4 py-3">
                      <p class="truncate text-xs text-ink">{d.masalah}</p>
                    </td>
                    <td class="px-4 py-3">
                      <span class={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITAS_COLOR[d.prioritas]}`}>{d.prioritas}</span>
                    </td>
                    <td class="px-4 py-3"><StatusBadge variant={STATUS_VARIANT[d.status]}>{d.status}</StatusBadge></td>
                    <td class="px-4 py-3 text-[10px] text-slate-400">{d.waktu}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-1 text-[10px] text-slate-400">
                        <MessageSquare class="size-3" />{d.pesan}
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        {/* Detail */}
        <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div class="border-b border-slate-100 p-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="font-mono text-xs font-bold text-ink">{selected().id}</p>
                <p class="mt-0.5 text-sm font-semibold text-ink">{selected().masalah}</p>
              </div>
              <StatusBadge variant={STATUS_VARIANT[selected().status]}>{selected().status}</StatusBadge>
            </div>
            <p class="mt-1 text-xs text-slate-500">{selected().properti}</p>
          </div>

          <div class="flex-1 space-y-3 overflow-y-auto p-4">
            {/* Pihak */}
            <div class="rounded-xl bg-slate-50 p-3">
              <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Pihak Terlibat</p>
              <div class="space-y-2">
                {[
                  { label: 'Penyewa', name: selected().penyewa, email: selected().penyewaEmail },
                  { label: 'Owner', name: selected().owner, email: '' },
                ].map((p) => (
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Avatar name={p.name} size="sm" />
                      <div>
                        <p class="text-xs font-medium text-ink">{p.name}</p>
                        <Show when={p.email}><p class="text-[10px] text-slate-400">{p.email}</p></Show>
                      </div>
                    </div>
                    <Badge variant="default" class="text-[9px]">{p.label}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail laporan */}
            <div>
              <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Detail Laporan</p>
              <p class="text-xs leading-relaxed text-slate-600">{selected().detail}</p>
            </div>

            {/* Catatan mediator */}
            <div>
              <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Catatan Mediator</p>
              <textarea
                rows={3}
                placeholder="Tulis catatan atau keputusan mediator..."
                class="w-full resize-none rounded-xl border border-slate-200 p-2.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={reply()}
                onInput={(e) => setReply(e.currentTarget.value)}
              />
            </div>
          </div>

          <div class="flex gap-2 border-t border-slate-100 p-4">
            <Show when={selected().status !== 'Selesai'}>
              <Button variant="danger" size="sm" class="flex-1 gap-1"><X class="size-3.5" />Tolak</Button>
              <Button variant="secondary" size="sm" class="flex-1 gap-1"><AlertTriangle class="size-3.5" />Eskalasi</Button>
              <Button size="sm" class="flex-1 gap-1"><CheckCircle class="size-3.5" />Selesaikan</Button>
            </Show>
            <Show when={selected().status === 'Selesai'}>
              <p class="flex-1 text-center text-xs text-slate-400">Dispute ini telah diselesaikan.</p>
            </Show>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
