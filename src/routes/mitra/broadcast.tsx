import { createAsync, useSubmission, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { Send } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Textarea } from '~/components/ui/Textarea';
import { Input } from '~/components/ui/Input';
import { Card } from '~/components/ui/Card';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { currentUserQuery } from '~/server/actions/auth';
import {
  ownerBroadcastsQuery,
  createBroadcastAction,
  ownerKostListQuery,
} from '~/server/actions/mitra';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    ownerBroadcastsQuery();
    ownerKostListQuery();
  },
} satisfies RouteDefinition;

export default function BroadcastPage() {
  const user = createAsync(() => currentUserQuery());
  const list = createAsync(() => ownerBroadcastsQuery());
  const kostList = createAsync(() => ownerKostListQuery());
  const sub = useSubmission(createBroadcastAction);

  return (
    <MitraLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Pengumuman / Broadcast" noIndex />

      <PageHeader
        title="Pengumuman Penyewa"
        description="Kirim pesan massal ke seluruh penghuni properti Anda"
        class="mb-4"
      />

      <div class="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 class="mb-3 text-sm font-bold text-ink">Buat Pengumuman Baru</h2>

          <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
            <div class="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
              {sub.result && 'message' in sub.result ? sub.result.message : 'Gagal'}
            </div>
          </Show>

          <form action={createBroadcastAction} method="post" class="space-y-3">
            <Input name="judul" label="Judul" required placeholder="Contoh: Listrik mati Senin 2 Juni" />
            <Textarea name="konten" label="Isi pesan" rows={5} required />
            <div>
              <label class="mb-1 block text-xs font-medium text-ink">Target Properti</label>
              <select
                name="boardingHouseId"
                class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Semua properti</option>
                <For each={kostList()}>
                  {(k) => <option value={k.id}>{k.nama}</option>}
                </For>
              </select>
            </div>
            <div class="flex justify-end">
              <Button type="submit" class="gap-1.5" loading={sub.pending}>
                <Send class="size-4" /> Kirim Pengumuman
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 class="mb-3 text-sm font-bold text-ink">Riwayat Pengumuman</h2>
          <Suspense fallback={<Skeleton class="h-32" />}>
            <Show
              when={list() && list()!.length > 0}
              fallback={
                <p class="py-6 text-center text-sm text-slate-400">Belum ada pengumuman</p>
              }
            >
              <ul class="space-y-3">
                <For each={list()}>
                  {(b) => (
                    <li class="rounded-xl border border-slate-100 p-3">
                      <p class="text-sm font-semibold text-ink">{b.judul}</p>
                      <p class="mt-1 line-clamp-2 text-xs text-slate-500">{b.konten}</p>
                      <p class="mt-1 text-[10px] text-slate-400">
                        {formatTanggal(b.createdAt)}
                      </p>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </Suspense>
        </Card>
      </div>
    </MitraLayout>
  );
}
