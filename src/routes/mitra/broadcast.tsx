import { createSignal, For } from 'solid-js';
import { Send, Paperclip, CheckCircle } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Textarea } from '~/components/ui/Textarea';
import { Input } from '~/components/ui/Input';
import { Checkbox } from '~/components/ui/Checkbox';
import { PageHeader } from '~/components/shared/PageHeader';
import { Card } from '~/components/ui/Card';

const TARGETS = [
  { id: 'semua', label: 'Semua penyewa aktif', count: 34 },
  { id: 'griya-asri', label: 'Griya Asri Pogung', count: 10 },
  { id: 'wisma-tanjung', label: 'Wisma Tanjung 2', count: 14 },
];

const RIWAYAT = [
  { judul: 'Reminder bayar sewa Juni', target: 'Semua penyewa', kirim: 34, baca: 28, waktu: '2 hari lalu' },
  { judul: 'Genset perbaikan rutin', target: 'Asri Pogung', kirim: 10, baca: 9, waktu: '5 hari lalu' },
  { judul: 'Apresiasi Hari Kartini', target: 'Semua penyewa', kirim: 34, baca: 31, waktu: '12 hari lalu' },
  { judul: 'CCTV gerbang baru', target: 'Tanjung 2', kirim: 14, baca: 13, waktu: '18 hari lalu' },
  { judul: 'Aturan tamu malam', target: 'Semua penyewa', kirim: 34, baca: 32, waktu: '22 hari lalu' },
];

export default function BroadcastPage() {
  const [selectedTarget, setSelectedTarget] = createSignal('semua');
  const [kirimWa, setKirimWa] = createSignal(true);
  const [loading, setLoading] = createSignal(false);

  const targetCount = () => TARGETS.find((t) => t.id === selectedTarget())?.count ?? 0;

  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Broadcast Pengumuman" noIndex />

      <PageHeader
        title="Broadcast Pengumuman"
        description="Kirim info ke semua penyewa lewat app + WhatsApp"
        class="mb-6"
      />

      <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <Card>
          <h2 class="mb-4 text-sm font-bold text-ink">Tulis pesan baru</h2>

          {/* Target */}
          <div class="mb-4">
            <p class="mb-2 text-sm font-medium text-slate-600">Kirim ke</p>
            <div class="space-y-2">
              <For each={TARGETS}>
                {(t) => (
                  <label
                    class={[
                      'flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition',
                      selectedTarget() === t.id
                        ? 'border-primary bg-primary-light/30'
                        : 'border-slate-100 hover:border-slate-200',
                    ].join(' ')}
                  >
                    <div class="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="target"
                        value={t.id}
                        checked={selectedTarget() === t.id}
                        onChange={() => setSelectedTarget(t.id)}
                        class="accent-primary"
                      />
                      <span class="text-sm font-medium text-ink">{t.label}</span>
                    </div>
                    <span class="text-xs text-slate-400">{t.count} orang</span>
                  </label>
                )}
              </For>
            </div>
          </div>

          <Input label="Judul" placeholder="Pemadaman air sementara — Minggu 31 Mei" class="mb-3" />

          <Textarea
            label="Isi pesan"
            rows={5}
            placeholder="Tulis pesan untuk penyewaму..."
            class="mb-4"
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button type="button" class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink">
                <Paperclip class="size-4" /> Lampiran
              </button>
              <Checkbox
                label="Kirim juga lewat WhatsApp"
                checked={kirimWa()}
                onChange={(e) => setKirimWa(e.currentTarget.checked)}
              />
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            class="mt-4 gap-2"
            loading={loading()}
            onClick={() => setLoading(true)}
          >
            <Send class="size-4" />
            Kirim ke {targetCount()} penyewa
          </Button>
        </Card>

        {/* Riwayat */}
        <Card>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-bold text-ink">Riwayat broadcast</h2>
            <p class="text-xs text-slate-400">24 pesan · 30 hari terakhir</p>
          </div>

          <ul class="space-y-3">
            <For each={RIWAYAT}>
              {(r) => (
                <li class="flex items-start gap-3">
                  <div class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <CheckCircle class="size-3.5 text-slate-400" />
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-ink">{r.judul}</p>
                    <p class="text-[10px] text-slate-400">
                      {r.target} · {r.kirim} terkirim · {r.baca} dibaca
                    </p>
                  </div>
                  <span class="shrink-0 text-[10px] text-slate-400">{r.waktu}</span>
                </li>
              )}
            </For>
          </ul>
        </Card>
      </div>
    </MitraLayout>
  );
}
