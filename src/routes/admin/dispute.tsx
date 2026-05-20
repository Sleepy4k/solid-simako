import { createAsync, useAction, type RouteDefinition } from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { CheckCircle, X } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { Textarea } from '~/components/ui/Textarea';
import { Button } from '~/components/ui/Button';
import { currentUserQuery } from '~/server/actions/auth';
import {
  adminDisputesQuery,
  resolveDisputeAction,
} from '~/server/actions/admin';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    adminDisputesQuery();
  },
} satisfies RouteDefinition;

const STATUS_VARIANT = {
  TERBUKA: 'menunggu',
  DIPROSES: 'telat',
  SELESAI: 'lunas',
  DITUTUP: 'dibatalkan',
} as const;

export default function AdminDisputePage() {
  const user = createAsync(() => currentUserQuery());
  const list = createAsync(() => adminDisputesQuery());
  const resolve = useAction(resolveDisputeAction);

  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [resolusi, setResolusi] = createSignal('');
  const [busy, setBusy] = createSignal(false);

  const selected = () => list()?.find((c) => c.id === selectedId());

  async function handleResolve(status: 'DIPROSES' | 'SELESAI' | 'DITUTUP') {
    const id = selectedId();
    if (!id) return;
    setBusy(true);
    try {
      await resolve(id, status, status === 'SELESAI' ? resolusi() : undefined);
      if (status === 'SELESAI') setResolusi('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Dispute Center" noIndex />

      <PageHeader
        title="Pusat Resolusi Konflik"
        description="Mediasi sengketa antara penyewa dan owner"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-96" />}>
        <Show
          when={list() && list()!.length > 0}
          fallback={<EmptyState title="Tidak ada sengketa" description="Tidak ada konflik aktif saat ini." />}
        >
          <div class="grid h-[calc(100vh-15rem)] gap-4 lg:grid-cols-[1fr_360px]">
            <div class="overflow-auto rounded-2xl border border-slate-100 bg-white">
              <ul class="divide-y divide-slate-50">
                <For each={list()}>
                  {(c) => (
                    <li
                      class={[
                        'cursor-pointer p-4 transition',
                        selectedId() === c.id ? 'bg-primary-light/30' : 'hover:bg-slate-50',
                      ].join(' ')}
                      onClick={() => setSelectedId(c.id)}
                    >
                      <div class="mb-1 flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                          <Avatar
                            name={c.pelapor.profile?.namaLengkap ?? c.pelapor.email}
                            size="sm"
                          />
                          <p class="text-xs font-semibold text-ink">
                            {c.pelapor.profile?.namaLengkap ?? c.pelapor.email}
                          </p>
                        </div>
                        <StatusBadge variant={STATUS_VARIANT[c.status]}>{c.status}</StatusBadge>
                      </div>
                      <p class="text-sm font-medium text-ink">{c.judul}</p>
                      <Show when={c.boardingHouse}>
                        <p class="text-[10px] text-slate-400">vs {c.boardingHouse!.nama}</p>
                      </Show>
                    </li>
                  )}
                </For>
              </ul>
            </div>

            <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <Show
                when={selected()}
                fallback={
                  <div class="flex flex-1 items-center justify-center text-sm text-slate-400">
                    Pilih dispute untuk mediasi
                  </div>
                }
              >
                {(s) => (
                  <>
                    <div class="border-b border-slate-100 p-4">
                      <p class="text-xs text-slate-400">Prioritas {s().prioritas}</p>
                      <h2 class="mt-0.5 text-sm font-bold text-ink">{s().judul}</h2>
                      <p class="mt-1 text-xs text-slate-400">
                        {formatTanggal(s().createdAt)}
                      </p>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4">
                      <p class="text-sm leading-relaxed text-slate-600">{s().deskripsi}</p>

                      <Show when={s().resolusi}>
                        <div class="mt-4 rounded-xl bg-success-light p-3 text-xs">
                          <p class="font-semibold text-success">Resolusi</p>
                          <p class="mt-1 text-slate-700">{s().resolusi}</p>
                        </div>
                      </Show>
                    </div>

                    <Show when={s().status !== 'SELESAI' && s().status !== 'DITUTUP'}>
                      <div class="space-y-2 border-t border-slate-100 p-4">
                        <Textarea
                          label="Catatan mediasi"
                          rows={3}
                          value={resolusi()}
                          onInput={(e) => setResolusi(e.currentTarget.value)}
                        />
                        <div class="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            class="flex-1"
                            onClick={() => handleResolve('DIPROSES')}
                            loading={busy()}
                          >
                            Tandai Diproses
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            class="flex-1 gap-1"
                            onClick={() => handleResolve('DITUTUP')}
                            loading={busy()}
                          >
                            <X class="size-3.5" /> Tutup
                          </Button>
                          <Button
                            size="sm"
                            class="flex-1 gap-1"
                            onClick={() => handleResolve('SELESAI')}
                            loading={busy()}
                          >
                            <CheckCircle class="size-3.5" /> Selesaikan
                          </Button>
                        </div>
                      </div>
                    </Show>
                  </>
                )}
              </Show>
            </div>
          </div>
        </Show>
      </Suspense>
    </AdminLayout>
  );
}
