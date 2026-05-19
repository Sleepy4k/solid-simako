import { createSignal, For, Show } from 'solid-js';
import { Send, Search } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { Avatar } from '~/components/ui/Avatar';

interface ChatRoom {
  id: string;
  nama: string;
  peran: string;
  pesanTerakhir: string;
  waktu: string;
  belumDibaca: number;
}

interface Message {
  dari: string;
  isi: string;
  waktu: string;
  isSelf: boolean;
}

const ROOMS: ChatRoom[] = [
  { id: '1', nama: 'Pak Slamet Riyadi', peran: 'Owner', pesanTerakhir: 'Nanti siang kami kirim teknisi.', waktu: '11:15', belumDibaca: 0 },
  { id: '2', nama: 'Admin SIMAKO', peran: 'Support', pesanTerakhir: 'Tiket kamu sedang diproses.', waktu: 'Kemarin', belumDibaca: 1 },
];

const MESSAGES: Record<string, Message[]> = {
  '1': [
    { dari: 'Pak Slamet Riyadi', isi: 'Halo Mbak Dewi, ada yang bisa dibantu?', waktu: '10:30', isSelf: false },
    { dari: 'Saya', isi: 'Pak, AC kamar saya tidak dingin sejak 3 hari lalu.', waktu: '10:32', isSelf: true },
    { dari: 'Pak Slamet Riyadi', isi: 'Maaf ya Mbak, nanti siang kami kirim teknisi.', waktu: '11:15', isSelf: false },
  ],
  '2': [
    { dari: 'Admin SIMAKO', isi: 'Halo, tiket keluhan kamu sudah kami terima.', waktu: 'Kemarin 09:00', isSelf: false },
    { dari: 'Admin SIMAKO', isi: 'Tiket kamu sedang diproses, harap tunggu 1×24 jam.', waktu: 'Kemarin 09:01', isSelf: false },
  ],
};

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = createSignal(ROOMS[0]);
  const [pesan, setPesan] = createSignal('');

  const msgs = () => MESSAGES[activeRoom().id] ?? [];

  return (
    <TenantLayout userName="Dewi Ananda">
      <SEO title="Pesan" noIndex />

      <div class="flex h-[calc(100vh-13rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {/* Sidebar room list */}
        <div class="flex w-64 flex-shrink-0 flex-col border-r border-slate-100">
          <div class="border-b border-slate-100 p-3">
            <div class="relative">
              <Search class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Cari percakapan..."
                class="h-8 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div class="flex-1 overflow-y-auto">
            <For each={ROOMS}>
              {(room) => (
                <button
                  type="button"
                  class={[
                    'flex w-full items-start gap-2.5 border-b border-slate-50 px-3 py-3 text-left transition last:border-0',
                    activeRoom().id === room.id ? 'bg-primary-light/30' : 'hover:bg-slate-50',
                  ].join(' ')}
                  onClick={() => setActiveRoom(room)}
                >
                  <Avatar name={room.nama} size="sm" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-1">
                      <p class="truncate text-xs font-semibold text-ink">{room.nama}</p>
                      <span class="flex-shrink-0 text-[10px] text-slate-400">{room.waktu}</span>
                    </div>
                    <p class="text-[10px] text-slate-400">{room.peran}</p>
                    <p class="mt-0.5 truncate text-[11px] text-slate-500">{room.pesanTerakhir}</p>
                  </div>
                  <Show when={room.belumDibaca > 0}>
                    <span class="flex size-4 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                      {room.belumDibaca}
                    </span>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </div>

        {/* Chat area */}
        <div class="flex flex-1 flex-col">
          {/* Header */}
          <div class="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
            <Avatar name={activeRoom().nama} size="sm" />
            <div>
              <p class="text-sm font-semibold text-ink">{activeRoom().nama}</p>
              <p class="text-[10px] text-slate-400">{activeRoom().peran}</p>
            </div>
          </div>

          {/* Messages */}
          <div class="flex-1 space-y-3 overflow-y-auto p-4">
            <For each={msgs()}>
              {(msg) => (
                <div class={`flex gap-2 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={msg.isSelf ? 'Dewi Ananda' : msg.dari} size="sm" />
                  <div class={`flex flex-col gap-0.5 ${msg.isSelf ? 'items-end' : 'items-start'}`} style={{ 'max-width': '65%' }}>
                    <div class={`rounded-2xl px-3 py-2 text-sm ${msg.isSelf ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 text-ink rounded-tl-none'}`}>
                      {msg.isi}
                    </div>
                    <p class="text-[10px] text-slate-400">{msg.waktu}</p>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Input */}
          <div class="flex gap-2 border-t border-slate-100 p-3">
            <input
              type="text"
              placeholder={`Pesan ke ${activeRoom().nama}...`}
              class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={pesan()}
              onInput={(e) => setPesan(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPesan('')}
            />
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-2"
              onClick={() => setPesan('')}
            >
              <Send class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}
