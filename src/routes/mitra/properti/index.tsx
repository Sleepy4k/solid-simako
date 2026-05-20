import {
  createAsync,
  useAction,
  type RouteDefinition,
} from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { Plus, Pencil, Trash2 } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Button, ButtonLink } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Toggle } from '~/components/ui/Toggle';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { PageHeader } from '~/components/shared/PageHeader';
import { ROUTES } from '~/constants/routes';
import { currentUserQuery } from '~/server/actions/auth';
import {
  ownerKostListQuery,
  togglePublishAction,
  deleteKostAction,
} from '~/server/actions/mitra';

export const route = {
  preload() {
    currentUserQuery();
    ownerKostListQuery();
  },
} satisfies RouteDefinition;

export default function MitraPropertiPage() {
  const user = createAsync(() => currentUserQuery());
  const list = createAsync(() => ownerKostListQuery());
  const togglePub = useAction(togglePublishAction);
  const delAct = useAction(deleteKostAction);
  const [busyId, setBusyId] = createSignal<string | null>(null);

  async function handleToggle(id: string) {
    setBusyId(id);
    try {
      await togglePub(id);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus properti ini? Semua kamar di dalamnya juga akan terhapus.')) return;
    setBusyId(id);
    try {
      await delAct(id);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <MitraLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Properti & Kamar" noIndex />

      <PageHeader
        title="Properti & Kamar"
        description="Kelola listing kost dan kamar tiap properti"
        action={
          <ButtonLink href={ROUTES.TAMBAH_PROPERTI} class="gap-1.5">
            <Plus class="size-4" /> Tambah Properti
          </ButtonLink>
        }
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show
          when={list() && list()!.length > 0}
          fallback={
            <EmptyState
              title="Belum ada properti"
              description="Tambahkan properti kost pertamamu untuk mulai menerima penyewa."
              action={
                <ButtonLink href={ROUTES.TAMBAH_PROPERTI} class="gap-1.5">
                  <Plus class="size-4" /> Tambah Properti
                </ButtonLink>
              }
            />
          }
        >
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <For each={list()}>
              {(k) => (
                <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                  <div class="relative aspect-[16/9] bg-slate-100">
                    <Show
                      when={k.coverUrl}
                      fallback={
                        <div class="size-full bg-gradient-to-br from-slate-200 to-slate-300" />
                      }
                    >
                      <img src={k.coverUrl!} alt={k.nama} class="size-full object-cover" />
                    </Show>
                    <div class="absolute left-2 top-2 flex gap-1">
                      <Badge variant={k.isPublished ? 'lunas' : 'default'} class="text-[9px]">
                        {k.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Show when={k.isVerified}>
                        <Badge variant="verified" class="text-[9px]">Verified</Badge>
                      </Show>
                    </div>
                  </div>
                  <div class="p-3">
                    <p class="font-semibold text-ink">{k.nama}</p>
                    <p class="text-xs text-slate-500">{k.kota}</p>
                    <p class="mt-1 text-[10px] text-slate-400">
                      {k.kamarTerisi}/{k.totalKamar} kamar terisi
                    </p>

                    <div class="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div class="flex items-center gap-2">
                        <Toggle
                          checked={k.isPublished}
                          onChange={() => handleToggle(k.id)}
                          size="sm"
                        />
                        <span class="text-[10px] text-slate-500">Tayang</span>
                      </div>
                      <div class="flex gap-1">
                        <ButtonLink
                          href={ROUTES.EDIT_PROPERTI(k.id)}
                          variant="ghost"
                          size="sm"
                          class="size-7 p-0"
                        >
                          <Pencil class="size-3.5" />
                        </ButtonLink>
                        <button
                          type="button"
                          class="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-danger"
                          onClick={() => handleDelete(k.id)}
                          disabled={busyId() === k.id}
                        >
                          <Trash2 class="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <ButtonLink
                      href={ROUTES.TAMBAH_KAMAR(k.id)}
                      variant="secondary"
                      size="sm"
                      class="mt-2 w-full gap-1 text-center"
                    >
                      <Plus class="size-3.5" /> Tambah Kamar
                    </ButtonLink>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Suspense>
    </MitraLayout>
  );
}
