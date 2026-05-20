import { createAsync, useAction, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { Heart, MapPin, Star } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge } from '~/components/ui/Badge';
import { ButtonLink } from '~/components/ui/Button';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { ROUTES } from '~/constants/routes';
import { wishlistQuery, toggleWishlistAction } from '~/server/actions/penyewa';
import { currentUserQuery } from '~/server/actions/auth';
import { formatIDR } from '~/lib/shared/slug';

export const route = {
  preload() {
    wishlistQuery();
    currentUserQuery();
  },
} satisfies RouteDefinition;

export default function WishlistPage() {
  const user = createAsync(() => currentUserQuery());
  const items = createAsync(() => wishlistQuery());
  const toggle = useAction(toggleWishlistAction);

  async function hapus(id: string) {
    await toggle(id);
  }

  return (
    <TenantLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Wishlist Saya" noIndex />

      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-xl font-bold text-ink">Wishlist Saya</h1>
        <Suspense fallback={<span class="text-sm text-slate-400">Memuat…</span>}>
          <span class="text-sm text-slate-500">{items()?.length ?? 0} kost</span>
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <For each={[0, 1, 2]}>{() => <Skeleton class="h-72" />}</For>
          </div>
        }
      >
        <Show
          when={items() && items()!.length > 0}
          fallback={
            <EmptyState
              title="Wishlist kosong"
              description="Simpan kost favoritmu dengan menekan ikon hati di halaman detail kost."
              action={<ButtonLink href={ROUTES.CARI_KOST}>Cari Kost</ButtonLink>}
            />
          }
        >
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <For each={items()}>
              {(item) => (
                <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:shadow-md">
                  <div class="relative aspect-[16/9] bg-slate-100">
                    <Show
                      when={item.coverUrl}
                      fallback={
                        <div class="size-full bg-gradient-to-br from-slate-200 to-slate-300" />
                      }
                    >
                      <img src={item.coverUrl!} alt={item.nama} class="size-full object-cover" />
                    </Show>
                    <button
                      type="button"
                      class="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110"
                      onClick={() => hapus(item.id)}
                      title="Hapus dari wishlist"
                    >
                      <Heart class="size-4 fill-primary text-primary" />
                    </button>
                    <div class="absolute bottom-2 left-2">
                      <Badge variant="default" class="text-[9px]">
                        {item.jenisKelamin}
                      </Badge>
                    </div>
                  </div>

                  <div class="p-3">
                    <p class="font-semibold text-ink">{item.nama}</p>
                    <div class="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin class="size-3" /> {item.kota}
                    </div>

                    <div class="mt-3 flex items-center justify-between">
                      <div>
                        <Show when={item.hargaMulai} fallback={<span class="text-xs text-slate-400">—</span>}>
                          <span class="font-bold text-ink">{formatIDR(item.hargaMulai!)}</span>
                          <span class="text-xs text-slate-400">/bln</span>
                        </Show>
                      </div>
                      <Show when={item.rating > 0}>
                        <div class="flex items-center gap-1 text-xs text-slate-500">
                          <Star class="size-3 fill-warn text-warn" /> {item.rating} ({item.totalReview})
                        </div>
                      </Show>
                    </div>

                    <ButtonLink
                      href={ROUTES.DETAIL_KOST(item.slug)}
                      size="sm"
                      class="mt-3 w-full text-center"
                    >
                      Lihat Detail
                    </ButtonLink>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Suspense>
    </TenantLayout>
  );
}
