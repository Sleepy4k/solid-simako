import { createSignal, For } from 'solid-js';
import { MessageSquare, CheckCircle, Clock } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { PageHeader } from '~/components/shared/PageHeader';
import { Avatar } from '~/components/ui/Avatar';
import { Textarea } from '~/components/ui/Textarea';
import { Card } from '~/components/ui/Card';

const KELUHAN = [
  { id: '1', nama: 'Dewi Ananda', kamar: 'Griya Asri · 04', judul: 'AC tidak dingin sejak 2 hari', kategori: 'Fasilitas', status: 'terbuka', waktu: '2 jam lalu', prioritas: 'tinggi' },
  { id: '2', nama: 'Bambang S.', kamar: 'Griya Asri · 11', judul: 'Shower bocor', kategori: 'Fasilitas', status: 'diproses', waktu: '1 hari lalu', prioritas: 'sedang' },
  { id: '3', nama: 'Salma R.', kamar: 'Griya Asri · 02', judul: 'WiFi sering putus malam hari', kategori: 'Jaringan', status: 'selesai', waktu: '5 hari lalu', prioritas: 'rendah' },
];

type KStatus = 'terbuka' | 'diproses' | 'selesai';
const STATUS_VARIANT: Record<KStatus, 'telat' | 'menunggu' | 'lunas'> = {
  terbuka: 'telat',
  diproses: 'menunggu',
  selesai: 'lunas',
};

export default function KeluhanMitraPage() {
  const [selected, setSelected] = createSignal(KELUHAN[0]);
  const [balasan, setBalasan] = createSignal('');

  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Keluhan & Saran" noIndex />

      <PageHeader title="Keluhan & Saran" description="2 keluhan terbuka" class="mb-6" />

      <div class="grid h-[calc(100vh-14rem)] gap-4 lg:grid-cols-[280px_1fr]">
        {/* List */}
        <div class="overflow-y-auto rounded-2xl border border-slate-100 bg-white">
          <For each={KELUHAN}>
            {(k) => (
              <button
                type="button"
                onClick={() => setSelected(k)}
                class={[
                  'w-full border-b border-slate-50 p-4 text-left transition last:border-0',
                  selected().id === k.id ? 'bg-primary-light/40' : 'hover:bg-slate-50',
                ].join(' ')}
              >
                <div class="flex items-start gap-2.5">
                  <Avatar name={k.nama} size="sm" />
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-ink">{k.judul}</p>
                    <p class="text-[10px] text-slate-400">{k.nama} · {k.kamar}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[k.status as KStatus]} class="text-[9px]">
                    {k.status}
                  </Badge>
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-[10px] text-slate-400">{k.kategori}</span>
                  <span class="text-[10px] text-slate-300">·</span>
                  <span class="text-[10px] text-slate-400">{k.waktu}</span>
                </div>
              </button>
            )}
          </For>
        </div>

        {/* Detail */}
        <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div class="flex items-start justify-between border-b border-slate-100 p-5">
            <div class="flex items-start gap-3">
              <Avatar name={selected().nama} size="md" />
              <div>
                <h2 class="text-sm font-bold text-ink">{selected().judul}</h2>
                <p class="text-xs text-slate-500">{selected().nama} · {selected().kamar}</p>
                <div class="mt-1 flex gap-2">
                  <Badge variant={STATUS_VARIANT[selected().status as KStatus]}>{selected().status}</Badge>
                  <Badge variant="default">{selected().kategori}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-5">
            <Card class="mb-4 bg-slate-50" padding="sm">
              <p class="text-sm text-ink">
                AC di kamar saya sudah tidak dingin sejak 2 hari yang lalu. Sudah coba restart tapi tidak membantu. Mohon segera diperbaiki karena cuaca sangat panas.
              </p>
              <p class="mt-2 text-xs text-slate-400">{selected().waktu}</p>
            </Card>
          </div>

          <div class="border-t border-slate-100 p-4">
            <Textarea
              placeholder="Tulis balasan atau update status..."
              rows={3}
              value={balasan()}
              onInput={(e) => setBalasan(e.currentTarget.value)}
              class="mb-3"
            />
            <div class="flex gap-2">
              <Button variant="secondary" size="sm" class="gap-1.5">
                <CheckCircle class="size-4" /> Tandai Selesai
              </Button>
              <Button size="sm" class="gap-1.5" disabled={!balasan()}>
                <MessageSquare class="size-4" /> Kirim Balasan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MitraLayout>
  );
}
