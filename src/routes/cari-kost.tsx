import { createSignal, For, Show } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { SlidersHorizontal, X, MapPin } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { KostCard } from '~/components/shared/KostCard';
import { Button } from '~/components/ui/Button';
import { Skeleton, SkeletonCard } from '~/components/ui/Skeleton';
import { ROUTES } from '~/constants/routes';

const KAMPUS_LIST = [
  { id: 'ittp', label: 'ITTP', count: 52 },
  { id: 'unsoed', label: 'UNSOED', count: 143 },
  { id: 'ump', label: 'UMP', count: 71 },
  { id: 'un-saku', label: 'UN Saku', count: 38 },
];

const JENIS_KAMAR = ['Putri', 'Putra', 'Campur'];
const FASILITAS = ['WiFi', 'AC', 'Kasur', 'K. Mandi Dalam', 'Akses 24 jam', 'Parkir Motor', 'Dapur Bersama'];

// Mock data
const MOCK_KOST = Array.from({ length: 9 }, (_, i) => ({
  slug: `kost-mock-${i + 1}`,
  nama: ['Kost Putri Bunga Anggrek', 'Wisma Karangbawang Asri', 'Kost Pak Karyo', 'Griya Soka Boarding', 'Kost Mas Edi', 'Wisma Bunda Sari'][i % 6],
  lokasi: ['Bobosan', 'Karanglewas', 'Watumas', 'Watumas', 'Bobosan', 'Grendeng'][i % 6],
  kampus: ['ITTP', 'UNSOED', 'ITTP', 'ITTP', 'ITTP', 'UNSOED'][i % 6],
  jarak: ['400m', '1,1km', '1,1km', '800m', '800m', '500m'][i % 6],
  harga: [950000, 1200000, 750000, 1300000, 650000, 850000][i % 6],
  rating: [4.8, 4.6, 4.4, 4.7, 4.2, 4.5][i % 6],
  isVerified: i % 3 !== 2,
  jenis: ['Putri', 'Campur', 'Putra'][i % 3],
}));

export default function CariKostPage() {
  const [params] = useSearchParams();
  const [filterOpen, setFilterOpen] = createSignal(false);
  const [selectedKampus, setSelectedKampus] = createSignal<string[]>(
    params.kampus
      ? typeof params.kampus === 'string'
        ? [params.kampus]
        : params.kampus
      : [],
  );
  const [selectedJenis, setSelectedJenis] = createSignal<string[]>([]);
  const [selectedFasilitas, setSelectedFasilitas] = createSignal<string[]>([]);
  const [hargaMin, setHargaMin] = createSignal(500000);
  const [hargaMax, setHargaMax] = createSignal(2000000);
  const [sortBy, setSortBy] = createSignal('terdekat');

  function toggleItem<T>(sig: () => T[], set: (v: T[]) => void, item: T) {
    const cur = sig();
    set(cur.includes(item) ? cur.filter((i) => i !== item) : [...cur, item]);
  }

  const activeFilterCount = () =>
    selectedKampus().length + selectedJenis().length + selectedFasilitas().length;

  function formatRp(n: number) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.0', '')}jt`;
    return `${n / 1000}rb`;
  }

  return (
    <PublicLayout hideFooter>
      <SEO title="Cari Kost" description="Temukan kost terbaik di Purwokerto dekat kampus favoritmu." />

      <div class="mx-auto flex max-w-7xl gap-0 px-4 py-4 lg:gap-6 lg:px-8">
        {/* ── Sidebar filter (desktop) ─────────────────────────────── */}
        <aside class="hidden w-52 shrink-0 lg:block">
          <div class="sticky top-20 space-y-5">
            {/* Kampus */}
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Kampus terdekat
              </p>
              <ul class="space-y-1">
                {KAMPUS_LIST.map((k) => (
                  <li>
                    <label class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50">
                      <div class="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedKampus().includes(k.id)}
                          onChange={() => toggleItem(selectedKampus, setSelectedKampus, k.id)}
                          class="size-3.5 accent-primary"
                        />
                        <span class="text-sm text-ink">{k.label}</span>
                      </div>
                      <span class="text-xs text-slate-400">{k.count}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Jarak */}
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Jarak dari kampus
              </p>
              <div class="flex flex-wrap gap-1.5">
                {['≤500m', '≤1km', '≤2km', '≤5km'].map((d) => (
                  <button
                    type="button"
                    class="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Harga */}
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Harga / bulan
              </p>
              <div class="flex items-center gap-2 text-sm text-ink">
                <span class="font-medium text-primary">{formatRp(hargaMin())}</span>
                <span class="text-slate-400">–</span>
                <span class="font-medium text-primary">{formatRp(hargaMax())}</span>
              </div>
              <input
                type="range"
                min={300000}
                max={3000000}
                step={50000}
                value={hargaMax()}
                onInput={(e) => setHargaMax(Number(e.currentTarget.value))}
                class="mt-2 w-full accent-primary"
              />
            </div>

            {/* Tipe */}
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Tipe Kost
              </p>
              <ul class="space-y-1">
                {JENIS_KAMAR.map((j) => (
                  <li>
                    <label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                      <input
                        type="radio"
                        name="jenis"
                        checked={selectedJenis().includes(j)}
                        onChange={() => setSelectedJenis([j])}
                        class="size-3.5 accent-primary"
                      />
                      <span class="text-sm text-ink">{j}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fasilitas */}
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Fasilitas
              </p>
              <ul class="space-y-1">
                {FASILITAS.slice(0, 5).map((f) => (
                  <li>
                    <label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={selectedFasilitas().includes(f)}
                        onChange={() => toggleItem(selectedFasilitas, setSelectedFasilitas, f)}
                        class="size-3.5 accent-primary"
                      />
                      <span class="text-sm text-ink">{f}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="primary" fullWidth size="sm">
              Terapkan filter
            </Button>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────── */}
        <div class="flex-1 min-w-0">
          {/* Toolbar */}
          <div class="mb-4 flex items-center justify-between gap-2">
            <div>
              <p class="text-sm font-semibold text-ink">52 kost ditemukan</p>
              {/* Active filters */}
              <Show when={activeFilterCount() > 0}>
                <div class="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedKampus().map((k) => (
                    <span class="flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary">
                      {KAMPUS_LIST.find((c) => c.id === k)?.label}
                      <button onClick={() => setSelectedKampus(selectedKampus().filter((c) => c !== k))}>
                        <X class="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </Show>
            </div>
            <div class="flex items-center gap-2">
              {/* Mobile filter button */}
              <Button
                variant="secondary"
                size="sm"
                class="gap-1.5 lg:hidden"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal class="size-3.5" />
                Filter
                <Show when={activeFilterCount() > 0}>
                  <span class="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {activeFilterCount()}
                  </span>
                </Show>
              </Button>
              <select
                value={sortBy()}
                onChange={(e) => setSortBy(e.currentTarget.value)}
                class="h-8 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="terdekat">Terdekat dari kampus ▾</option>
                <option value="termurah">Harga terendah</option>
                <option value="termahal">Harga tertinggi</option>
                <option value="terbaru">Terbaru</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <For each={MOCK_KOST}>
              {(k) => <KostCard {...k} />}
            </For>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
