import { createSignal, For, Show } from 'solid-js';
import { Plus, MessageSquare, Send } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Modal } from '~/components/ui/Modal';
import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';
import { Avatar } from '~/components/ui/Avatar';

interface Tiket {
  id: string;
  judul: string;
  properti: string;
  status: 'Terbuka' | 'Diproses' | 'Selesai';
  dibuat: string;
  balasan: number;
  pesan: { dari: string; isi: string; waktu: string }[];
}

const TIKETS: Tiket[] = [
  {
    id: 'TKT-001',
    judul: 'AC kamar tidak berfungsi',
    properti: 'Kost Pak Slamet A – Kamar 3',
    status: 'Diproses',
    dibuat: '15 Mei 26',
    balasan: 2,
    pesan: [
      { dari: 'Saya', isi: 'Pak, AC di kamar saya tidak dingin sejak 3 hari lalu. Sudah dicek?', waktu: '15 Mei, 10:32' },
      { dari: 'Pak Slamet', isi: 'Maaf ya Mbak Dewi, nanti siang kami kirim teknisi.', waktu: '15 Mei, 11:15' },
      { dari: 'Saya', isi: 'Terima kasih Pak, ditunggu ya.', waktu: '15 Mei, 11:17' },
    ],
  },
  {
    id: 'TKT-002',
    judul: 'Kunci kamar susah dibuka',
    properti: 'Kost Pak Slamet A – Kamar 3',
    status: 'Selesai',
    dibuat: '02 Apr 26',
    balasan: 3,
    pesan: [
      { dari: 'Saya', isi: 'Kunci pintu kamar saya susah dibuka, perlu diganti.', waktu: '02 Apr, 08:11' },
    ],
  },
];

const STATUS_VARIANT: Record<string, 'menunggu' | 'telat' | 'lunas'> = {
  Terbuka: 'menunggu',
  Diproses: 'telat',
  Selesai: 'lunas',
};

export default function KeluhanPenyewaPage() {
  const [selected, setSelected] = createSignal<Tiket>(TIKETS[0]);
  const [showModal, setShowModal] = createSignal(false);
  const [reply, setReply] = createSignal('');

  return (
    <TenantLayout userName="Dewi Ananda">
      <SEO title="Tiket & Keluhan" noIndex />

      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-ink">Tiket & Keluhan</h1>
        <Button size="sm" class="gap-1.5" onClick={() => setShowModal(true)}>
          <Plus class="size-4" /> Buat Tiket
        </Button>
      </div>

      <div class="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* List tiket */}
        <div class="space-y-2">
          <For each={TIKETS}>
            {(t) => (
              <button
                type="button"
                class={[
                  'w-full rounded-2xl border p-3 text-left transition',
                  selected().id === t.id ? 'border-primary bg-primary-light/30' : 'border-slate-100 bg-white hover:bg-slate-50',
                ].join(' ')}
                onClick={() => setSelected(t)}
              >
                <div class="mb-1 flex items-center justify-between gap-2">
                  <p class="font-mono text-[10px] text-slate-400">{t.id}</p>
                  <StatusBadge variant={STATUS_VARIANT[t.status]}>{t.status}</StatusBadge>
                </div>
                <p class="text-sm font-semibold text-ink">{t.judul}</p>
                <p class="mt-0.5 text-[10px] text-slate-400">{t.properti}</p>
                <div class="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                  <MessageSquare class="size-3" /> {t.balasan} balasan · {t.dibuat}
                </div>
              </button>
            )}
          </For>
        </div>

        {/* Chat thread */}
        <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white" style={{ height: '480px' }}>
          <div class="flex items-start justify-between border-b border-slate-100 p-4">
            <div>
              <p class="font-semibold text-ink">{selected().judul}</p>
              <p class="text-xs text-slate-400">{selected().properti}</p>
            </div>
            <StatusBadge variant={STATUS_VARIANT[selected().status]}>{selected().status}</StatusBadge>
          </div>

          <div class="flex-1 space-y-3 overflow-y-auto p-4">
            <For each={selected().pesan}>
              {(msg) => {
                const isSelf = msg.dari === 'Saya';
                return (
                  <div class={`flex gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
                    <Avatar name={isSelf ? 'Dewi Ananda' : msg.dari} size="sm" />
                    <div class={`max-w-[70%] ${isSelf ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      <div class={`rounded-2xl px-3 py-2 text-sm ${isSelf ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 text-ink rounded-tl-none'}`}>
                        {msg.isi}
                      </div>
                      <p class="text-[10px] text-slate-400">{msg.waktu}</p>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>

          <Show when={selected().status !== 'Selesai'}>
            <div class="flex gap-2 border-t border-slate-100 p-3">
              <input
                type="text"
                placeholder="Tulis balasan..."
                class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                value={reply()}
                onInput={(e) => setReply(e.currentTarget.value)}
              />
              <Button size="sm" class="gap-1.5" onClick={() => setReply('')}>
                <Send class="size-4" />
              </Button>
            </div>
          </Show>
          <Show when={selected().status === 'Selesai'}>
            <div class="border-t border-slate-100 p-3 text-center text-xs text-slate-400">
              Tiket ini telah diselesaikan.
            </div>
          </Show>
        </div>
      </div>

      {/* Modal buat tiket */}
      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Buat Tiket Keluhan">
        <div class="space-y-3">
          <Input label="Judul Keluhan" placeholder="Contoh: AC tidak berfungsi" />
          <div>
            <label class="mb-1 block text-xs font-medium text-ink">Properti</label>
            <select class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none">
              <option>Kost Pak Slamet A – Kamar 3</option>
            </select>
          </div>
          <Textarea label="Detail Keluhan" placeholder="Jelaskan masalah yang kamu alami..." rows={4} />
          <div class="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={() => setShowModal(false)}>Kirim Tiket</Button>
          </div>
        </div>
      </Modal>
    </TenantLayout>
  );
}
