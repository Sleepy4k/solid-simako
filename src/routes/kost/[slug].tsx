import {
  A,
  createAsync,
  useParams,
  useSubmission,
  type RouteDefinition,
} from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  ChevronRight,
  MessageCircle,
  Calendar,
} from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Button, ButtonLink } from '~/components/ui/Button';
import { Badge, StatusBadge } from '~/components/ui/Badge';
import { Card } from '~/components/ui/Card';
import { Avatar } from '~/components/ui/Avatar';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { ROUTES } from '~/constants/routes';
import { kostDetailQuery } from '~/server/actions/public';
import {
  toggleWishlistAction,
  startChatAction,
} from '~/server/actions/penyewa';
import { formatIDR, formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload({ params }) {
    if (params.slug) kostDetailQuery(params.slug);
  },
} satisfies RouteDefinition;

export default function DetailKostPage() {
  const params = useParams<{ slug: string }>();
  const kost = createAsync(() => kostDetailQuery(params.slug));
  const [pesan, setPesan] = createSignal('');
  const wishSub = useSubmission(toggleWishlistAction);
  const chatSub = useSubmission(startChatAction);

  return (
    <PublicLayout>
      <Suspense
        fallback={
          <div class="mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <Skeleton class="mb-6 aspect-[16/7] w-full" />
            <Skeleton class="h-8 w-1/2" />
          </div>
        }
      >
        <Show
          when={kost()}
          fallback={
            <div class="mx-auto max-w-3xl px-4 py-12">
              <EmptyState
                title="Kost tidak ditemukan"
                description="Halaman kost yang kamu cari mungkin sudah dihapus atau dipindahkan."
                action={<ButtonLink href={ROUTES.CARI_KOST}>Cari kost lain</ButtonLink>}
              />
            </div>
          }
        >
          {(data) => (
            <>
              <SEO
                title={data().nama}
                description={
                  data().deskripsi ?? `Kost di ${data().kota} dekat kampus. ${data().alamat}`
                }
                image={data().images[0]?.url ?? undefined}
              />

              <div class="mx-auto max-w-7xl px-4 py-6 lg:px-8">
                {/* Breadcrumb */}
                <nav class="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
                  <A href={ROUTES.BERANDA} class="hover:text-primary">Beranda</A>
                  <ChevronRight class="size-3" />
                  <A href={ROUTES.CARI_KOST} class="hover:text-primary">Cari Kost</A>
                  <ChevronRight class="size-3" />
                  <span class="text-ink">{data().nama}</span>
                </nav>

                {/* Photo gallery */}
                <div class="mb-6 grid aspect-[16/7] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
                  <Show
                    when={data().images.length > 0}
                    fallback={
                      <div class="col-span-4 row-span-2 bg-gradient-to-br from-primary-light to-red-100" />
                    }
                  >
                    <div class="col-span-2 row-span-2 bg-slate-100">
                      <Show when={data().images[0]}>
                        <img
                          src={data().images[0].url}
                          alt={data().nama}
                          class="size-full object-cover"
                        />
                      </Show>
                    </div>
                    <For each={data().images.slice(1, 5)}>
                      {(img) => (
                        <div class="bg-slate-100">
                          <img
                            src={img.url}
                            alt={img.caption ?? data().nama}
                            class="size-full object-cover"
                          />
                        </div>
                      )}
                    </For>
                  </Show>
                </div>

                <div class="grid gap-8 lg:grid-cols-[1fr_340px]">
                  {/* Left */}
                  <div class="space-y-8">
                    {/* Header */}
                    <div>
                      <div class="mb-2 flex flex-wrap items-center gap-2">
                        <Show when={data().isVerified}>
                          <Badge variant="verified" dot>VERIFIED</Badge>
                        </Show>
                        <Badge variant="default">{data().jenisKelamin}</Badge>
                        <Show when={data().stats.ratingAvg > 0}>
                          <Badge variant="default">
                            {data().stats.ratingAvg.toFixed(1)} ★ ({data().stats.totalReview})
                          </Badge>
                        </Show>
                      </div>
                      <h1 class="text-2xl font-bold text-ink">{data().nama}</h1>
                      <div class="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin class="size-4 shrink-0" />
                        <span>
                          {data().alamat}, {data().kota}
                        </span>
                        <Show when={data().kampus}>
                          <span class="text-slate-300">·</span>
                          <span>dekat {data().kampus!.singkatan}</span>
                        </Show>
                      </div>

                      <Show when={data().deskripsi}>
                        <p class="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                          {data().deskripsi}
                        </p>
                      </Show>
                    </div>

                    {/* Tipe Kamar */}
                    <div>
                      <h2 class="mb-3 text-base font-bold text-ink">Tipe kamar tersedia</h2>
                      <div class="grid gap-3 sm:grid-cols-2">
                        <For each={data().rooms}>
                          {(r) => (
                            <Card
                              class={[
                                'transition',
                                r.status !== 'TERSEDIA'
                                  ? 'opacity-60'
                                  : 'cursor-pointer hover:border-primary/30',
                              ].join(' ')}
                              padding="md"
                            >
                              <div class="mb-2 aspect-video overflow-hidden rounded-xl bg-slate-100">
                                <Show when={r.images[0]}>
                                  <img src={r.images[0]} alt={r.nomorKamar} class="size-full object-cover" />
                                </Show>
                              </div>
                              <div class="flex items-start justify-between">
                                <div>
                                  <p class="text-sm font-semibold text-ink">Kamar {r.nomorKamar}</p>
                                  <p class="text-xs text-slate-400">
                                    {r.lantai ? `Lantai ${r.lantai} · ` : ''}
                                    {r.kapasitas} org
                                    {r.luasM2 ? ` · ${r.luasM2} m²` : ''}
                                  </p>
                                </div>
                                <StatusBadge
                                  variant={
                                    r.status === 'TERSEDIA'
                                      ? 'lunas'
                                      : r.status === 'TERISI'
                                        ? 'dibatalkan'
                                        : 'menunggu'
                                  }
                                >
                                  {r.status === 'TERSEDIA'
                                    ? 'Tersedia'
                                    : r.status === 'TERISI'
                                      ? 'Terisi'
                                      : 'Maintenance'}
                                </StatusBadge>
                              </div>
                              <Show when={r.deskripsi}>
                                <p class="mt-1 text-sm text-slate-500">{r.deskripsi}</p>
                              </Show>
                              <div class="mt-3 flex items-center justify-between">
                                <div>
                                  <span class="text-base font-bold text-ink">
                                    {formatIDR(r.hargaBulan)}
                                  </span>
                                  <span class="text-xs text-slate-400">/bulan</span>
                                </div>
                                <Show when={r.status === 'TERSEDIA'}>
                                  <ButtonLink href={ROUTES.CHECKOUT(r.id)} size="sm">
                                    Ajukan Sewa
                                  </ButtonLink>
                                </Show>
                              </div>
                            </Card>
                          )}
                        </For>
                      </div>
                    </div>

                    {/* Fasilitas */}
                    <Show when={data().facilities.length > 0}>
                      <div>
                        <h2 class="mb-3 text-base font-bold text-ink">Fasilitas umum</h2>
                        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          <For each={data().facilities}>
                            {(f) => (
                              <div class="flex items-center gap-2 text-sm text-slate-600">
                                <span class="text-success">✓</span> {f.nama}
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>

                    {/* Ulasan */}
                    <Show when={data().reviews.length > 0}>
                      <div>
                        <h2 class="mb-3 text-base font-bold text-ink">
                          Ulasan ({data().stats.totalReview})
                        </h2>
                        <div class="space-y-3">
                          <For each={data().reviews}>
                            {(r) => (
                              <div class="rounded-2xl border border-slate-100 bg-white p-4">
                                <div class="flex items-start gap-3">
                                  <Avatar name={r.reviewer.nama} size="sm" />
                                  <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                      <p class="text-sm font-semibold text-ink">
                                        {r.reviewer.nama}
                                      </p>
                                      <div class="flex items-center gap-0.5 text-amber-400">
                                        <For each={Array.from({ length: 5 })}>
                                          {(_, i) => (
                                            <Star
                                              class="size-3"
                                              fill={i() < r.rating ? 'currentColor' : 'none'}
                                            />
                                          )}
                                        </For>
                                      </div>
                                    </div>
                                    <p class="text-[10px] text-slate-400">
                                      {formatTanggal(r.tanggal)}
                                    </p>
                                    <Show when={r.komentar}>
                                      <p class="mt-1.5 text-sm text-slate-600">{r.komentar}</p>
                                    </Show>
                                  </div>
                                </div>
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>
                  </div>

                  {/* Right: booking card */}
                  <div class="lg:sticky lg:top-20 lg:self-start">
                    <Card>
                      <div class="mb-1 text-2xl font-bold text-ink">
                        <Show when={data().rooms[0]?.hargaBulan} fallback={<span>—</span>}>
                          {formatIDR(data().rooms[0]!.hargaBulan)}
                        </Show>
                        <span class="text-sm font-normal text-slate-400">/bulan mulai</span>
                      </div>
                      <p class="mb-4 text-xs text-slate-500">
                        {data().stats.kamarTersedia} dari {data().stats.kamarTotal} kamar tersedia
                      </p>

                      <div class="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm">
                        <Calendar class="size-4 text-primary" />
                        <span class="text-slate-600">Verifikasi rata-rata</span>
                        <span class="ml-auto font-semibold">≤ 1×24 jam</span>
                      </div>

                      <Show
                        when={data().rooms.find((r) => r.status === 'TERSEDIA')}
                        fallback={
                          <Button fullWidth size="lg" class="mb-2" disabled>
                            Semua kamar penuh
                          </Button>
                        }
                      >
                        {(room) => (
                          <ButtonLink
                            href={ROUTES.CHECKOUT(room().id)}
                            fullWidth
                            size="lg"
                            class="mb-2"
                          >
                            Ajukan Sewa
                          </ButtonLink>
                        )}
                      </Show>

                      <form
                        action={startChatAction}
                        method="post"
                        class="mt-2 space-y-2 border-t border-slate-100 pt-3"
                      >
                        <input type="hidden" name="boardingHouseId" value={data().id} />
                        <textarea
                          name="pesanAwal"
                          placeholder="Tanya owner: ada kamar kosong tanggal…?"
                          rows={2}
                          value={pesan()}
                          onInput={(e) => setPesan(e.currentTarget.value)}
                          class="w-full resize-none rounded-xl border border-slate-200 p-2.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <Button
                          type="submit"
                          variant="secondary"
                          fullWidth
                          class="gap-2"
                          loading={chatSub.pending}
                          disabled={pesan().trim().length < 1}
                        >
                          <MessageCircle class="size-4" /> Chat Owner
                        </Button>
                      </form>

                      <div class="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 p-3 text-xs text-slate-500">
                        <Avatar name={data().owner.nama} size="sm" />
                        <div class="flex-1">
                          <p class="font-semibold text-ink">{data().owner.nama}</p>
                          <Show when={data().owner.verified}>
                            <p class="text-success">✓ Owner terverifikasi KYC</p>
                          </Show>
                        </div>
                      </div>
                    </Card>

                    {/* Actions */}
                    <div class="mt-3 flex gap-2">
                      <form action={toggleWishlistAction.with(data().id)} method="post" class="flex-1">
                        <button
                          type="submit"
                          disabled={wishSub.pending}
                          class={[
                            'flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition',
                            data().isWishlisted
                              ? 'border-primary bg-primary-light text-primary'
                              : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary',
                          ].join(' ')}
                        >
                          <Heart
                            class="size-4"
                            fill={data().isWishlisted ? 'currentColor' : 'none'}
                          />
                          {data().isWishlisted ? 'Tersimpan' : 'Simpan'}
                        </button>
                      </form>
                      <button
                        type="button"
                        class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary"
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                      >
                        <Share2 class="size-4" /> Bagikan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </PublicLayout>
  );
}
