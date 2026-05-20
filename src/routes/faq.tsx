import { A, createAsync, type RouteDefinition } from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { ChevronDown } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge } from '~/components/ui/Badge';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { ROUTES } from '~/constants/routes';
import { faqsQuery } from '~/server/actions/public';

export const route = {
  preload() {
    faqsQuery();
  },
} satisfies RouteDefinition;

export default function FaqPublicPage() {
  const faqs = createAsync(() => faqsQuery());
  const [openId, setOpenId] = createSignal<number | null>(null);
  const [filter, setFilter] = createSignal<string>('Semua');

  const filtered = () => {
    const list = faqs() ?? [];
    return filter() === 'Semua' ? list : list.filter((f) => f.kategori === filter());
  };

  return (
    <PublicLayout>
      <SEO
        title="Pusat Bantuan / FAQ"
        description="Pertanyaan umum tentang Simako — sewa kost, pembayaran, dan KYC owner."
      />

      <div class="bg-white">
        <div class="mx-auto max-w-3xl px-4 py-12">
          <p class="text-sm font-semibold text-primary">Pusat Bantuan</p>
          <h1 class="mt-1 text-3xl font-black text-ink">Pertanyaan yang sering diajukan</h1>
          <p class="mt-2 text-sm text-slate-500">
            Tidak menemukan jawabanmu?{' '}
            <A href={ROUTES.KONTAK} class="font-semibold text-primary hover:underline">
              Hubungi kami
            </A>
          </p>

          <div class="mt-6 flex flex-wrap gap-2">
            <For each={['Semua', 'Penyewa', 'Owner', 'Pembayaran', 'Umum']}>
              {(k) => (
                <button
                  type="button"
                  class={[
                    'rounded-full px-3 py-1.5 text-xs font-medium transition',
                    filter() === k
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary',
                  ].join(' ')}
                  onClick={() => setFilter(k)}
                >
                  {k}
                </button>
              )}
            </For>
          </div>

          <div class="mt-6 space-y-2">
            <Suspense fallback={<Skeleton class="h-32" />}>
              <Show
                when={filtered().length > 0}
                fallback={<EmptyState title="Belum ada pertanyaan" />}
              >
                <For each={filtered()}>
                  {(f) => (
                    <div class="rounded-2xl border border-slate-100 bg-white">
                      <button
                        type="button"
                        class="flex w-full items-center justify-between px-4 py-3 text-left"
                        onClick={() => setOpenId(openId() === f.id ? null : f.id)}
                      >
                        <div class="flex items-center gap-2.5">
                          <Badge class="text-[9px]">{f.kategori}</Badge>
                          <span class="text-sm font-medium text-ink">{f.pertanyaan}</span>
                        </div>
                        <ChevronDown
                          class={`size-4 text-slate-400 transition-transform ${
                            openId() === f.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <Show when={openId() === f.id}>
                        <div class="border-t border-slate-100 px-4 pb-4 pt-3">
                          <p class="text-sm leading-relaxed text-slate-600">{f.jawaban}</p>
                        </div>
                      </Show>
                    </div>
                  )}
                </For>
              </Show>
            </Suspense>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
