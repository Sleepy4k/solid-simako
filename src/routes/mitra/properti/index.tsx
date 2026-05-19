import { createSignal, For, Show } from 'solid-js';
import { Plus, Edit2, PlusCircle, Wifi, Bath } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { ButtonLink } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Toggle } from '~/components/ui/Toggle';
import { PageHeader } from '~/components/shared/PageHeader';
import { ROUTES } from '~/constants/routes';

const PROPERTI = [
  { id: 'griya-asri', nama: 'Griya Asri Pogung', kamar: 12, jenis: 'Putri', alamat: 'Jl. Pogung Kidul No. 23, Yogyakarta', isPublished: true },
  { id: 'wisma-tanjung', nama: 'Wisma Tanjung 2', kamar: 15, jenis: 'Campur', alamat: 'Jl. Tanjung Raya No. 8', isPublished: true },
  { id: 'senja-boarding', nama: 'Senja Boarding', kamar: 12, jenis: 'Putri', alamat: 'Gg. Senja No. 3', isPublished: false },
];

type RoomStatus = 'terisi' | 'kosong' | 'maintenance' | 'reservasi';

interface RoomData {
  no: string;
  status: RoomStatus;
  penyewa?: string;
  harga: number;
}

const KAMAR: RoomData[] = [
  { no: '01', status: 'terisi', penyewa: 'Dewi A.', harga: 850000 },
  { no: '02', status: 'terisi', penyewa: 'Salma R.', harga: 850000 },
  { no: '03', status: 'kosong', harga: 850000 },
  { no: '04', status: 'terisi', penyewa: 'Nadya K.', harga: 850000 },
  { no: '05', status: 'kosong', harga: 850000 },
  { no: '06', status: 'maintenance', harga: 850000 },
  { no: '07', status: 'terisi', penyewa: 'Mega P.', harga: 900000 },
  { no: '08', status: 'terisi', penyewa: 'Inka L.', harga: 900000 },
  { no: '09', status: 'kosong', harga: 900000 },
  { no: '10', status: 'terisi', penyewa: 'Salma F.', harga: 900000 },
  { no: '11', status: 'terisi', penyewa: 'Bunga D.', harga: 900000 },
  { no: '12', status: 'reservasi', penyewa: 'A. Nirmala', harga: 900000 },
];

const STATUS_STYLE: Record<RoomStatus, string> = {
  terisi: 'bg-success-light text-success',
  kosong: 'bg-slate-100 text-slate-500',
  maintenance: 'bg-warn-light text-warn',
  reservasi: 'bg-blue-50 text-blue-600',
};

const formatRb = (n: number) => `${n / 1000}rb`;

export default function PropertiKamarPage() {
  const [selectedProperti, setSelectedProperti] = createSignal(0);
  const [sync, setSync] = createSignal(true);

  const properti = () => PROPERTI[selectedProperti()];

  const summary = () => {
    const s = { terisi: 0, kosong: 0, maintenance: 0, reservasi: 0 };
    KAMAR.forEach((k) => s[k.status]++);
    return s;
  };

  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Properti & Kamar" noIndex />

      <div class="flex h-[calc(100vh-8rem)] gap-5 overflow-hidden">
        {/* Left: Properti list */}
        <div class="flex w-56 shrink-0 flex-col gap-2">
          <PageHeader title="Properti & Kamar" description={`${PROPERTI.length} properti · ${KAMAR.length * PROPERTI.length} kamar`} />

          <div class="mt-2 flex-1 space-y-2 overflow-y-auto">
            <For each={PROPERTI}>
              {(p, i) => (
                <button
                  type="button"
                  onClick={() => setSelectedProperti(i())}
                  class={[
                    'w-full rounded-2xl border-2 p-3 text-left transition',
                    selectedProperti() === i()
                      ? 'border-primary bg-primary-light'
                      : 'border-slate-100 bg-white hover:border-slate-200',
                  ].join(' ')}
                >
                  <div class="mb-2 aspect-video overflow-hidden rounded-xl bg-slate-100" />
                  <p class="text-xs font-bold text-ink">{p.nama}</p>
                  <p class="text-[10px] text-slate-400">{p.kamar} kamar · {p.jenis}</p>
                </button>
              )}
            </For>

            <button
              type="button"
              class="flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm text-slate-400 hover:border-primary hover:text-primary"
            >
              <PlusCircle class="size-4" /> Properti baru
            </button>
          </div>
        </div>

        {/* Right: Detail properti & kamar */}
        <div class="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div class="mb-4 flex items-start justify-between">
            <div>
              <h2 class="text-xl font-bold text-ink">{properti().nama}</h2>
              <p class="text-xs text-slate-500">📍 {properti().alamat}</p>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="secondary" size="sm" class="gap-1.5">
                <Edit2 class="size-3.5" /> Edit info
              </Button>
              <ButtonLink href={`/mitra/properti/${properti().id}/kamar/tambah`} size="sm" class="gap-1.5">
                <Plus class="size-3.5" /> Kamar baru
              </ButtonLink>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            items={[
              { id: 'kamar', label: `Kamar (${KAMAR.length})`, content: null },
              { id: 'tipe', label: 'Tipe & Harga', content: null },
              { id: 'foto', label: 'Foto', content: null },
              { id: 'fasilitas', label: 'Fasilitas & Aturan', content: null },
            ]}
            class="mb-4"
          />

          {/* Kamar grid */}
          <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-4 gap-2 xl:grid-cols-6">
              <For each={KAMAR}>
                {(k) => (
                  <div class="relative rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200">
                    <div class="mb-1.5 flex items-start justify-between">
                      <span class="text-sm font-bold text-ink">#{k.no}</span>
                      <button type="button" class="text-slate-300 hover:text-slate-500">
                        <Edit2 class="size-3" />
                      </button>
                    </div>
                    <span
                      class={[
                        'mb-2 block rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
                        STATUS_STYLE[k.status],
                      ].join(' ')}
                    >
                      {k.status}
                    </span>
                    <Show when={k.penyewa}>
                      <p class="text-[10px] text-slate-500">{k.penyewa}</p>
                    </Show>
                    <p class="text-[11px] font-semibold text-ink">{formatRb(k.harga)}</p>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Footer summary */}
          <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <div class="flex gap-4">
              {Object.entries(summary()).map(([status, count]) => (
                <span class="text-slate-500">
                  <strong class="text-ink">{status.charAt(0).toUpperCase() + status.slice(1)}</strong>{' '}
                  {count}
                </span>
              ))}
            </div>
            <Toggle
              label="Sync ke listing publik"
              checked={sync()}
              onChange={setSync}
              size="sm"
            />
          </div>
        </div>
      </div>
    </MitraLayout>
  );
}
