import { createSignal, For, Show } from 'solid-js';
import { Filter, CheckCircle, X, AlertTriangle } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

interface KycOwner {
  id: string;
  nama: string;
  email: string;
  noKtp: string;
  ttl: string;
  alamat: string;
  jumlahProperti: string;
  dokumen: string[];
  status: string;
  waktu: string;
  checks: { label: string; ok: boolean }[];
}

const OWNERS: KycOwner[] = [
  { id: '1', nama: 'Lia Sutanto', email: 'lia.s@gmail.com', noKtp: '327XXXXXXXX9001', ttl: '14 Jan 1985', alamat: 'Bandung, Jabar', jumlahProperti: 'Kost Dahlia – 8 kamar', dokumen: ['KTP', 'Selfie'], status: 'menunggu', waktu: '2 jam lalu', checks: [{ label: 'Nama KTP cocok', ok: true }, { label: 'Selfie + foto KTP (90%)', ok: true }, { label: 'NPWP opsional, terlampir', ok: false }] },
  { id: '2', nama: 'Hadi Wijaya', email: 'hadi.w@mail.com', noKtp: '327XXXXXXXX5011', ttl: '22 Mar 1979', alamat: 'Jakarta Selatan', jumlahProperti: '2 properti · 5by', dokumen: ['KTP', 'Selfie'], status: 'menunggu', waktu: '5 jam lalu', checks: [{ label: 'Nama KTP cocok', ok: true }, { label: 'Selfie tidak jelas', ok: false }, { label: 'NPWP tidak ada', ok: false }] },
  { id: '3', nama: 'Tina Maharani', email: 'tina@gmail.com', noKtp: '327XXXXXXXX2023', ttl: '3 Jun 1990', alamat: 'Yogyakarta', jumlahProperti: '1 properti · Yk', dokumen: ['KTP', 'Selfie', 'NPWP'], status: 'menunggu', waktu: 'kemarin', checks: [{ label: 'Nama KTP cocok', ok: true }, { label: 'Selfie + foto KTP (95%)', ok: true }, { label: 'NPWP valid', ok: true }] },
];

export default function VerifikasiKycPage() {
  const [selected, setSelected] = createSignal<KycOwner>(OWNERS[0]);

  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Verifikasi KYC Owner" noIndex />

      <div class="mb-4 flex items-center justify-between">
        <PageHeader title="Verifikasi KYC Owner" description="1 pendaftar menunggu verifikasi identitas" />
        <Button variant="secondary" size="sm" class="gap-1.5"><Filter class="size-4" /> Filter</Button>
      </div>

      <Tabs
        items={[
          { id: 'menunggu', label: 'Menunggu', badge: 7 },
          { id: 'disetujui', label: 'Disetujui', badge: 305 },
          { id: 'ditolak', label: 'Ditolak', badge: 12 },
        ]}
        class="mb-4"
      />

      <div class="grid h-[calc(100vh-16rem)] gap-4 lg:grid-cols-[1fr_300px]">
        {/* Table */}
        <div class="overflow-auto rounded-2xl border border-slate-100 bg-white">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-100">
              <tr>
                {['OWNER', 'DAFTAR', 'PROPERTI', 'DOKUMEN', 'STATUS', ''].map((h) => (
                  <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <For each={OWNERS}>
                {(o) => (
                  <tr
                    class={[
                      'cursor-pointer border-b border-slate-50 transition last:border-0',
                      selected().id === o.id ? 'bg-primary-light/30' : 'hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setSelected(o)}
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2.5">
                        <Avatar name={o.nama} size="sm" />
                        <div>
                          <p class="font-medium text-ink">{o.nama}</p>
                          <p class="text-[10px] text-slate-400">{o.email}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-slate-500">{o.waktu}</td>
                    <td class="px-4 py-3 text-slate-500">1 properti</td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1">
                        {o.dokumen.map((d) => (
                          <Badge variant="info" class="text-[9px]">{d}</Badge>
                        ))}
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <Badge variant="menunggu" dot>{o.status}</Badge>
                    </td>
                    <td class="px-4 py-3">
                      <button type="button" class="text-xs font-medium text-primary hover:underline">Buka</button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div class="border-b border-slate-100 p-4">
            <div class="flex items-center gap-2.5">
              <Avatar name={selected().nama} size="md" />
              <div>
                <p class="text-sm font-bold text-ink">{selected().nama}</p>
                <p class="text-xs text-slate-500">{selected().email}</p>
              </div>
            </div>
            <div class="mt-3 space-y-1.5 text-xs">
              <div class="flex justify-between"><span class="text-slate-500">No. KTP</span><span class="font-mono font-medium text-ink">{selected().noKtp}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Tgl lahir</span><span class="text-ink">{selected().ttl}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Alamat</span><span class="text-ink">{selected().alamat}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Properti</span><span class="text-ink">{selected().jumlahProperti}</span></div>
            </div>
          </div>

          {/* Dokumen preview */}
          <div class="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
            <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Dokumen</p>
            <div class="grid grid-cols-2 gap-2">
              {selected().dokumen.map((d) => (
                <div class="aspect-[3/2] overflow-hidden rounded-xl bg-slate-100">
                  <div class="flex size-full items-center justify-center text-xs text-slate-400">{d}</div>
                </div>
              ))}
            </div>

            {/* Auto-checks */}
            <div class="mt-2 space-y-1.5 rounded-xl border border-slate-100 p-3">
              {selected().checks.map((c) => (
                <div class="flex items-center gap-2 text-xs">
                  <Show when={c.ok} fallback={<AlertTriangle class="size-3.5 text-warn" />}>
                    <CheckCircle class="size-3.5 text-success" />
                  </Show>
                  <span class={c.ok ? 'text-ink' : 'text-warn'}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div class="flex gap-2 border-t border-slate-100 p-4">
            <Button variant="danger" size="sm" class="flex-1 gap-1"><X class="size-4" />Tolak</Button>
            <Button size="sm" class="flex-1 gap-1"><CheckCircle class="size-4" />Setujui</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
