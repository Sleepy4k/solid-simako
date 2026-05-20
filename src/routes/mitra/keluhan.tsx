import { createAsync, useAction, type RouteDefinition } from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { CheckCircle, Clock } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { PageHeader } from '~/components/shared/PageHeader';
import { Avatar } from '~/components/ui/Avatar';
import { Textarea } from '~/components/ui/Textarea';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { currentUserQuery } from '~/server/actions/auth';
import {
  ownerComplaintsQuery,
  respondComplaintAction,
} from '~/server/actions/mitra';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    ownerComplaintsQuery();
  },
} satisfies RouteDefinition;

const STATUS_VARIANT = {
  TERBUKA: 'menunggu',
  DIPROSES: 'telat',
  SELESAI: 'lunas',
  DITUTUP: 'dibatalkan',
} as const;

export default function KeluhanMitraPage() {
  const user = createAsync(() => currentUserQuery());
  const complaints = createAsync(() => ownerComplaintsQuery());
  const respond = useAction(respondComplaintAction);

  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [reply, setReply] = createSignal('');
  const [busy, setBusy] = createSignal(false);

  const selected = () => complaints()?.find((c) => c.id === selectedId());

  async function handleStatus(status: 'DIPROSES' | 'SELESAI') {
    const id = selectedId();
    if (!id) return;
    setBusy(true);
    try {
      await respond(id, status, status === 'SELESAI' ? reply() : undefined);
      if (status === 'SELESAI') setReply('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <MitraLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Manajemen Keluhan" noIndex />

      <PageHeader
        title="Keluhan Penghuni"
        description="Respons dan resolusi keluhan dari penghuni"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-96" />}>
        <Show
          when={complaints() && complaints()!.length > 0}
          fallback={<EmptyState title="Belum ada keluhan" />}
        >
          <div class="grid h-[calc(100vh-15rem)] gap-4 lg:grid-cols-[1fr_360px]">
            <div class="overflow-auto rounded-2xl border border-slate-100 bg-white">
              <ul class="divide-y divide-slate-50">
                <For each={complaints()}>
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
                      <p class="line-clamp-1 text-xs text-slate-500">{c.deskripsi}</p>
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
                    Pilih keluhan untuk lihat detail
                  </div>
                }
              >
                {(s) => (
                  <>
                    <div class="border-b border-slate-100 p-4">
                      <p class="text-xs text-slate-400">{s().kategori} · Prioritas {s().prioritas}</p>
                      <h2 class="mt-0.5 text-sm font-bold text-ink">{s().judul}</h2>
                      <p class="mt-1 text-xs text-slate-400">
                        {formatTanggal(s().createdAt)}
                      </p>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4">
                      <p class="text-sm leading-relaxed text-slate-600">{s().deskripsi}</p>

                      <Show when={s().resolusi}>
                        <div class="mt-4 rounded-xl bg-success-light p-3 text-xs">
                          <p class="font-semibold text-success">Resolusi Anda</p>
                          <p class="mt-1 text-slate-700">{s().resolusi}</p>
                        </div>
                      </Show>
                    </div>

                    <Show when={s().status !== 'SELESAI' && s().status !== 'DITUTUP'}>
                      <div class="space-y-2 border-t border-slate-100 p-4">
                        <Textarea
                          label="Tanggapan / catatan penyelesaian"
                          rows={3}
                          value={reply()}
                          onInput={(e) => setReply(e.currentTarget.value)}
                        />
                        <div class="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            class="flex-1 gap-1"
                            onClick={() => handleStatus('DIPROSES')}
                            loading={busy()}
                          >
                            <Clock class="size-3.5" /> Tandai Diproses
                          </Button>
                          <Button
                            size="sm"
                            class="flex-1 gap-1"
                            onClick={() => handleStatus('SELESAI')}
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
    </MitraLayout>
  );
}
