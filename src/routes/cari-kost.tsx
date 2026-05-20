import { useSearchParams, createAsync, type RouteDefinition } from '@solidjs/router';
import { createMemo, For, Show, Suspense } from 'solid-js';
import { SlidersHorizontal, MapPin } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { KostCard } from '~/components/shared/KostCard';
import { Button } from '~/components/ui/Button';
import { SkeletonCard } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import {
  kostSearchQuery,
  campusesQuery,
  facilitiesQuery,
} from '~/server/actions/public';
import type { KostListQuery } from '~/server/services/kost.service';

export const route = {
  preload() {
    campusesQuery();
    facilitiesQuery();
  },
} satisfies RouteDefinition;

function paramString(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined;
  return typeof v === 'string' ? v : v[0];
}
function paramArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return typeof v === 'string' ? [v] : v;
}

export default function CariKostPage() {
  const [params, setParams] = useSearchParams();

  const filter = createMemo<KostListQuery>(() => ({
    q: paramString(params.q),
    kampusId: paramString(params.kampusId) ? Number(paramString(params.kampusId)) : undefined,
    kota: paramString(params.kota),
    jenisKelamin: paramString(params.jenisKelamin) as 'PUTRA' | 'PUTRI' | 'CAMPUR' | undefined,
    hargaMin: paramString(params.hargaMin) ? Number(paramString(params.hargaMin)) : undefined,
    hargaMax: paramString(params.hargaMax) ? Number(paramString(params.hargaMax)) : undefined,
    facilities: paramArray(params.facilities).map(Number).filter(Boolean),
    sort:
      (paramString(params.sort) as 'populer' | 'termurah' | 'termahal' | 'terbaru') ?? 'populer',
    page: paramString(params.page) ? Number(paramString(params.page)) : 1,
  }));

  const result = createAsync(() => kostSearchQuery(filter()));
  const kampus = createAsync(() => campusesQuery());
  const fasilitas = createAsync(() => facilitiesQuery());

  function updateParam(key: string, value: string) {
    setParams({ [key]: value || undefined, page: 1 });
  }

  function toggleFacility(id: number) {
    const cur = filter().facilities ?? [];
    const next = cur.includes(id) ? cur.filter((f) => f !== id) : [...cur, id];
    setParams({ facilities: next.map(String), page: 1 });
  }

  return (
    <PublicLayout>
      <SEO title="Cari Kost" description="Cari kost dekat kampusmu di Purwokerto." />

      <div class="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-ink">Cari Kost</h1>
            <Suspense fallback={<p class="text-sm text-slate-400">Memuat…</p>}>
              <Show when={result()}>
                <p class="text-sm text-slate-500">
                  {result()!.total} kost ditemukan
                </p>
              </Show>
            </Suspense>
          </div>

          <select
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={filter().sort ?? 'populer'}
            onChange={(e) => updateParam('sort', e.currentTarget.value)}
          >
            <option value="populer">Terpopuler</option>
            <option value="termurah">Termurah</option>
            <option value="termahal">Termahal</option>
            <option value="terbaru">Terbaru</option>
          </select>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Filter sidebar */}
          <aside class="space-y-5 rounded-2xl border border-slate-100 bg-white p-4 lg:sticky lg:top-20 lg:h-fit">
            <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
              <SlidersHorizontal class="size-4 text-primary" />
              <p class="text-sm font-bold text-ink">Filter</p>
            </div>

            <div>
              <p class="mb-2 text-xs font-semibold uppercase text-slate-400">Cari</p>
              <input
                type="search"
                placeholder="Nama / kota / alamat"
                value={filter().q ?? ''}
                onInput={(e) => updateParam('q', e.currentTarget.value)}
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <p class="mb-2 text-xs font-semibold uppercase text-slate-400">Kampus</p>
              <Suspense fallback={<div class="h-9 rounded-lg bg-slate-100" />}>
                <select
                  class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none"
                  value={filter().kampusId ?? ''}
                  onChange={(e) => updateParam('kampusId', e.currentTarget.value)}
                >
                  <option value="">Semua kampus</option>
                  <For each={kampus()}>
                    {(k) => <option value={k.id}>{k.singkatan} — {k.kota}</option>}
                  </For>
                </select>
              </Suspense>
            </div>

            <div>
              <p class="mb-2 text-xs font-semibold uppercase text-slate-400">Jenis</p>
              <div class="flex flex-wrap gap-1.5">
                <For each={['Semua', 'PUTRA', 'PUTRI', 'CAMPUR']}>
                  {(j) => {
                    const value = j === 'Semua' ? '' : j;
                    const active = () => (filter().jenisKelamin ?? '') === value;
                    return (
                      <button
                        type="button"
                        class={[
                          'rounded-full px-3 py-1 text-xs font-medium transition',
                          active()
                            ? 'bg-primary text-white'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary',
                        ].join(' ')}
                        onClick={() => updateParam('jenisKelamin', value)}
                      >
                        {j}
                      </button>
                    );
                  }}
                </For>
              </div>
            </div>

            <div>
              <p class="mb-2 text-xs font-semibold uppercase text-slate-400">Rentang harga</p>
              <div class="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filter().hargaMin ?? ''}
                  onChange={(e) => updateParam('hargaMin', e.currentTarget.value)}
                  class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filter().hargaMax ?? ''}
                  onChange={(e) => updateParam('hargaMax', e.currentTarget.value)}
                  class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p class="mb-2 text-xs font-semibold uppercase text-slate-400">Fasilitas</p>
              <Suspense fallback={<p class="text-xs text-slate-400">Memuat…</p>}>
                <div class="flex flex-wrap gap-1.5">
                  <For each={fasilitas()}>
                    {(f) => {
                      const active = () => (filter().facilities ?? []).includes(f.id);
                      return (
                        <button
                          type="button"
                          class={[
                            'rounded-full px-2.5 py-1 text-[10px] font-medium transition',
                            active()
                              ? 'bg-primary text-white'
                              : 'border border-slate-200 bg-white text-slate-600 hover:border-primary',
                          ].join(' ')}
                          onClick={() => toggleFacility(f.id)}
                        >
                          {f.nama}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </Suspense>
            </div>

            <Button
              variant="secondary"
              fullWidth
              onClick={() =>
                setParams({
                  q: undefined,
                  kampusId: undefined,
                  kota: undefined,
                  jenisKelamin: undefined,
                  hargaMin: undefined,
                  hargaMax: undefined,
                  facilities: undefined,
                  sort: 'populer',
                  page: 1,
                })
              }
            >
              Reset filter
            </Button>
          </aside>

          {/* Results */}
          <Suspense
            fallback={
              <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <For each={[0, 1, 2, 3, 4, 5]}>{() => <SkeletonCard />}</For>
              </div>
            }
          >
            <Show
              when={result() && result()!.items.length > 0}
              fallback={
                <EmptyState
                  title="Belum ada kost yang cocok"
                  description="Coba ubah filter atau hapus beberapa kriteria untuk hasil yang lebih luas."
                  icon={<MapPin class="size-6 text-primary" />}
                />
              }
            >
              <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <For each={result()!.items}>
                  {(k) => (
                    <KostCard
                      slug={k.slug}
                      nama={k.nama}
                      lokasi={k.kota}
                      kampus={k.kampus?.singkatan ?? undefined}
                      harga={k.hargaMulai ?? 0}
                      rating={k.rating || undefined}
                      isVerified
                      jenis={k.jenisKelamin}
                      foto={k.coverUrl ?? undefined}
                    />
                  )}
                </For>
              </div>
            </Show>
          </Suspense>
        </div>
      </div>
    </PublicLayout>
  );
}
