import { A, createAsync, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { Clock } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge } from '~/components/ui/Badge';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { ROUTES } from '~/constants/routes';
import { articlesQuery } from '~/server/actions/public';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    articlesQuery();
  },
} satisfies RouteDefinition;

export default function BlogIndexPage() {
  const articles = createAsync(() => articlesQuery());

  return (
    <PublicLayout>
      <SEO title="Blog & Artikel" description="Tips dan informasi seputar kost dan manajemen properti." />

      <div class="bg-white">
        <div class="mx-auto max-w-5xl px-4 py-12">
          <p class="text-sm font-semibold text-primary">Blog</p>
          <h1 class="mt-1 text-3xl font-black text-ink">Tips & artikel seputar kost</h1>
          <p class="mt-2 text-sm text-slate-500">
            Edukasi untuk anak kost dan pemilik properti.
          </p>

          <Suspense
            fallback={
              <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <For each={[0, 1, 2]}>{() => <Skeleton class="h-56" />}</For>
              </div>
            }
          >
            <Show
              when={articles() && articles()!.length > 0}
              fallback={
                <EmptyState
                  title="Belum ada artikel"
                  description="Kami sedang menyiapkan artikel-artikel berkualitas untuk kamu."
                  class="mt-8"
                />
              }
            >
              <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <For each={articles()}>
                  {(a) => (
                    <A
                      href={ROUTES.BLOG_DETAIL(a.slug)}
                      class="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:shadow-md"
                    >
                      <div class="aspect-[16/9] bg-slate-100">
                        <Show
                          when={a.coverAsset?.url}
                          fallback={
                            <div class="size-full bg-gradient-to-br from-primary-light to-red-100" />
                          }
                        >
                          <img src={a.coverAsset!.url} alt={a.judul} class="size-full object-cover" />
                        </Show>
                      </div>
                      <div class="p-4">
                        <Badge class="text-[10px]">{a.kategori}</Badge>
                        <h2 class="mt-2 line-clamp-2 text-base font-bold text-ink group-hover:text-primary">
                          {a.judul}
                        </h2>
                        <Show when={a.ringkasan}>
                          <p class="mt-1 line-clamp-2 text-xs text-slate-500">{a.ringkasan}</p>
                        </Show>
                        <div class="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock class="size-3" />{' '}
                          {a.publishedAt ? formatTanggal(a.publishedAt) : ''}
                        </div>
                      </div>
                    </A>
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
