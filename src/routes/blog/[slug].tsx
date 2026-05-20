import {
  A,
  createAsync,
  useParams,
  type RouteDefinition,
} from '@solidjs/router';
import { Show, Suspense } from 'solid-js';
import { ArrowLeft } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { ROUTES } from '~/constants/routes';
import { articleDetailQuery } from '~/server/actions/public';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload({ params }) {
    if (params.slug) articleDetailQuery(params.slug);
  },
} satisfies RouteDefinition;

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const article = createAsync(() => articleDetailQuery(params.slug));

  return (
    <PublicLayout>
      <Suspense fallback={<div class="mx-auto max-w-3xl px-4 py-12"><Skeleton class="h-96" /></div>}>
        <Show
          when={article()}
          fallback={
            <div class="mx-auto max-w-3xl px-4 py-12">
              <EmptyState
                title="Artikel tidak ditemukan"
                description="Tautan mungkin sudah tidak berlaku."
              />
            </div>
          }
        >
          {(a) => (
            <>
              <SEO title={a().judul} description={a().ringkasan ?? undefined} image={a().coverAsset?.url ?? undefined} type="article" />
              <article class="mx-auto max-w-3xl px-4 py-12">
                <A
                  href={ROUTES.BLOG}
                  class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary"
                >
                  <ArrowLeft class="size-4" /> Kembali ke Blog
                </A>

                <p class="text-xs font-semibold text-primary">{a().kategori}</p>
                <h1 class="mt-1 text-3xl font-black text-ink lg:text-4xl">{a().judul}</h1>
                <Show when={a().publishedAt}>
                  <p class="mt-2 text-xs text-slate-400">
                    Dipublikasikan {formatTanggal(a().publishedAt!)} ·{' '}
                    {a().viewCount.toLocaleString('id')} pembaca
                  </p>
                </Show>

                <Show when={a().coverAsset?.url}>
                  <div class="mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
                    <img src={a().coverAsset!.url} alt={a().judul} class="size-full object-cover" />
                  </div>
                </Show>

                <Show when={a().ringkasan}>
                  <p class="mt-6 text-base font-medium text-slate-700">{a().ringkasan}</p>
                </Show>

                <div
                  class="prose prose-slate mt-6 max-w-none whitespace-pre-line text-sm leading-relaxed text-slate-700"
                  innerHTML={a().konten}
                />
              </article>
            </>
          )}
        </Show>
      </Suspense>
    </PublicLayout>
  );
}
