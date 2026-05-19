import { createSignal, For, Show } from 'solid-js';
import { CheckCircle, X, MessageCircle, Download, Clock } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

type BookingStatus = 'menunggu' | 'diterima' | 'ditolak';

interface Booking {
  id: string;
  nama: string;
  email: string;
  hp: string;
  properti: string;
  kamar: string;
  luas: string;
  mulai: string;
  durasi: string;
  nominal: number;
  kodeUnik: number;
  namaBank: string;
  noRek: string;
  waktuTransfer: string;
  status: BookingStatus;
  timeAgo: string;
  cocok: boolean;
}

const BOOKINGS: Booking[] = [
  { id: 'TK-19326', nama: 'Dewi Ananda', email: 'dewi.ag@gmail.com', hp: '0812 6447 20', properti: 'Griya Asri Pogung', kamar: '#04 · 2,5×3m', luas: '2,5×3m', mulai: '01 Juli 2026', durasi: '6 bulan', nominal: 5612347, kodeUnik: 347, namaBank: 'BCA · Dewi Ananda', noRek: '2810 4477 91', waktuTransfer: '26 Mei 16:21', status: 'menunggu', timeAgo: '2 jam', cocok: true },
  { id: 'TK-19325', nama: 'Rangga P.', email: 'rangga@mail.com', hp: '0811 5678 12', properti: 'Wisma Tanjung 2', kamar: '#12', luas: '3×3m', mulai: '01 Jul 2026', durasi: '1 bulan', nominal: 1280218, kodeUnik: 218, namaBank: 'Mandiri · Rangga P.', noRek: '1234 5678 90', waktuTransfer: '11h lalu', status: 'menunggu', timeAgo: '4 jam', cocok: false },
  { id: 'TK-19324', nama: 'Ayu Nirmala', email: 'ayu@mail.com', hp: '0812 0000 01', properti: 'Griya Asri Pogung', kamar: '#08', luas: '3×3m', mulai: '01 Jul 2026', durasi: '3 bulan', nominal: 4250000, kodeUnik: 0, namaBank: 'BNI · Ayu Nirmala', noRek: '0000 1111 22', waktuTransfer: 'kemarin', status: 'menunggu', timeAgo: 'kemarin', cocok: true },
];

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n).replace('IDR', 'Rp');
}

export default function VerifikasiBookingPage() {
  const [selected, setSelected] = createSignal<Booking>(BOOKINGS[0]);
  const [activeTab, setActiveTab] = createSignal('menunggu');

  const filtered = () => BOOKINGS.filter((b) => b.status === activeTab());

  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Verifikasi Booking" noIndex />

      <div class="mb-4 flex items-center justify-between">
        <PageHeader title="Verifikasi Booking" description="4 pengajuan menunggu konfirmasi" />
      </div>

      <Tabs
        items={[
          { id: 'menunggu', label: 'Menunggu', badge: BOOKINGS.filter((b) => b.status === 'menunggu').length },
          { id: 'diterima', label: 'Diterima', badge: 28 },
          { id: 'ditolak', label: 'Ditolak', badge: 3 },
        ]}
        onChange={setActiveTab}
        class="mb-4"
      />

      <div class="grid h-[calc(100vh-16rem)] gap-4 lg:grid-cols-[280px_1fr_280px]">
        {/* List */}
        <div class="overflow-y-auto rounded-2xl border border-slate-100 bg-white">
          <For each={BOOKINGS}>
            {(b) => (
              <button
                type="button"
                onClick={() => setSelected(b)}
                class={[
                  'w-full border-b border-slate-50 p-4 text-left transition last:border-0 hover:bg-slate-50',
                  selected().id === b.id ? 'bg-primary-light/50' : '',
                ].join(' ')}
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-2.5">
                    <Avatar name={b.nama} size="sm" />
                    <div>
                      <p class="text-xs font-semibold text-ink">{b.nama}</p>
                      <p class="text-[10px] text-slate-400">{b.properti} · {b.timeAgo}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-sm font-bold text-ink">{formatRp(b.nominal)}</span>
                  <Badge variant="menunggu">Menunggu</Badge>
                </div>
              </button>
            )}
          </For>
        </div>

        {/* Detail */}
        <div class="overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <Avatar name={selected().nama} size="md" />
              <div>
                <p class="text-sm font-semibold text-ink">{selected().nama}</p>
                <p class="text-xs text-slate-500">{selected().email} · {selected().hp}</p>
              </div>
            </div>
            <Badge variant="menunggu" dot>Menunggu · {selected().timeAgo}</Badge>
          </div>

          <div class="mb-4">
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Detail Sewa</h3>
            <div class="space-y-1.5 rounded-xl border border-slate-100 p-3 text-sm">
              {[
                { label: 'Properti', value: selected().properti },
                { label: 'Kamar', value: selected().kamar },
                { label: 'Mulai', value: selected().mulai },
                { label: 'Durasi', value: selected().durasi },
                { label: 'Sewa + deposit', value: formatRp(selected().nominal) },
              ].map((row) => (
                <div class="flex justify-between">
                  <span class="text-slate-500">{row.label}</span>
                  <span class="font-medium text-ink">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div class="mb-4">
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Verifikasi Transfer</h3>
            <div class="space-y-1.5 rounded-xl border border-slate-100 p-3 text-sm">
              {[
                { label: 'Nominal diterima', value: formatRp(selected().nominal), highlight: true },
                { label: 'Kode unik', value: `+${selected().kodeUnik}` },
                { label: 'Bank pengirim', value: selected().namaBank },
                { label: 'Waktu', value: selected().waktuTransfer },
              ].map((row) => (
                <div class="flex justify-between">
                  <span class="text-slate-500">{row.label}</span>
                  <span class={`font-medium ${row.highlight ? 'text-primary' : 'text-ink'}`}>{row.value}</span>
                </div>
              ))}
            </div>

            <Show when={selected().cocok}>
              <div class="mt-2 flex items-center gap-1.5 rounded-xl bg-success-light px-3 py-2 text-xs text-success">
                <CheckCircle class="size-3.5" />
                Nama & nominal cocok dengan mutasi
              </div>
            </Show>
            <Show when={!selected().cocok}>
              <div class="mt-2 flex items-center gap-1.5 rounded-xl bg-warn-light px-3 py-2 text-xs text-warn">
                <Clock class="size-3.5" />
                Nominal tidak cocok — cek bukti manual
              </div>
            </Show>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="secondary" class="gap-1.5">
              <MessageCircle class="size-4" /> Chat penyewa
            </Button>
            <Button variant="danger" class="gap-1.5">
              <X class="size-4" /> Tolak
            </Button>
            <Button class="flex-1 gap-1.5">
              <CheckCircle class="size-4" /> Terima & Aktifkan Sewa
            </Button>
          </div>
        </div>

        {/* Bukti transfer */}
        <div class="overflow-y-auto rounded-2xl border border-slate-100 bg-white p-4">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Bukti Transfer</p>
          <div class="aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
            <div class="flex size-full flex-col items-center justify-center gap-2 text-slate-300">
              <Download class="size-8" />
              <span class="text-xs">Preview bukti</span>
            </div>
          </div>
          <button
            type="button"
            class="mt-2 w-full text-center text-xs font-medium text-primary hover:underline"
          >
            Unduh original
          </button>
        </div>
      </div>
    </MitraLayout>
  );
}
