import { createAsync, useAction, type RouteDefinition } from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { CheckCircle, X } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { Modal } from '~/components/ui/Modal';
import { Textarea } from '~/components/ui/Textarea';
import { currentUserQuery } from '~/server/actions/auth';
import { adminKycListQuery, decideKycAction } from '~/server/actions/admin';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    adminKycListQuery();
  },
} satisfies RouteDefinition;

export default function VerifikasiKycPage() {
  const user = createAsync(() => currentUserQuery());
  const list = createAsync(() => adminKycListQuery());
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [showReject, setShowReject] = createSignal(false);
  const [note, setNote] = createSignal('');
  const [busy, setBusy] = createSignal(false);

  const selected = () => list()?.find((o) => o.id === selectedId());
  const decideKyc = useAction(decideKycAction);

  async function submitDecision(decision: 'APPROVE' | 'REJECT') {
    const ownerProfileId = selectedId();
    if (!ownerProfileId) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('ownerProfileId', ownerProfileId);
      fd.append('decision', decision);
      if (note()) fd.append('catatan', note());
      await decideKyc(fd);
      setShowReject(false);
      setNote('');
      setSelectedId(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Verifikasi KYC Owner" noIndex />

      <PageHeader
        title="Verifikasi KYC Owner"
        description="Tinjau dan setujui pendaftaran owner baru"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-96" />}>
        <Show
          when={list() && list()!.length > 0}
          fallback={<EmptyState title="Tidak ada KYC menunggu" description="Semua pendaftar sudah ditinjau." />}
        >
          <div class="grid h-[calc(100vh-15rem)] gap-4 lg:grid-cols-[1fr_320px]">
            <div class="overflow-auto rounded-2xl border border-slate-100 bg-white">
              <table class="w-full text-sm">
                <thead class="border-b border-slate-100">
                  <tr>
                    <For each={['OWNER', 'TELEPON', 'DAFTAR', 'STATUS']}>
                      {(h) => (
                        <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {h}
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={list()}>
                    {(o) => (
                      <tr
                        class={[
                          'cursor-pointer border-b border-slate-50 transition last:border-0',
                          selectedId() === o.id ? 'bg-primary-light/30' : 'hover:bg-slate-50',
                        ].join(' ')}
                        onClick={() => setSelectedId(o.id)}
                      >
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-2">
                            <Avatar
                              name={o.user.profile?.namaLengkap ?? o.user.email}
                              size="sm"
                            />
                            <div>
                              <p class="text-xs font-medium text-ink">
                                {o.user.profile?.namaLengkap ?? o.user.email}
                              </p>
                              <p class="text-[10px] text-slate-400">{o.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-xs text-slate-500">
                          {o.user.profile?.telepon ?? '—'}
                        </td>
                        <td class="px-4 py-3 text-[10px] text-slate-400">
                          {formatTanggal(o.user.createdAt)}
                        </td>
                        <td class="px-4 py-3 text-xs">
                          <span class="rounded-full bg-warn/10 px-2 py-0.5 text-warn">
                            {o.kycStatus}
                          </span>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>

            <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <Show
                when={selected()}
                fallback={
                  <div class="flex flex-1 items-center justify-center text-sm text-slate-400">
                    Pilih owner untuk lihat dokumen
                  </div>
                }
              >
                {(o) => (
                  <>
                    <div class="border-b border-slate-100 p-4">
                      <div class="flex items-center gap-2.5">
                        <Avatar
                          name={o().user.profile?.namaLengkap ?? o().user.email}
                          size="md"
                        />
                        <div>
                          <p class="text-sm font-bold text-ink">
                            {o().user.profile?.namaLengkap ?? o().user.email}
                          </p>
                          <p class="text-xs text-slate-500">{o().user.email}</p>
                        </div>
                      </div>
                      <div class="mt-3 space-y-1.5 text-xs">
                        <Show when={o().user.profile?.telepon}>
                          <div class="flex justify-between">
                            <span class="text-slate-500">Telepon</span>
                            <span class="text-ink">{o().user.profile!.telepon}</span>
                          </div>
                        </Show>
                        <Show when={o().user.profile?.alamat}>
                          <div class="flex justify-between">
                            <span class="text-slate-500">Alamat</span>
                            <span class="text-ink">{o().user.profile!.alamat}</span>
                          </div>
                        </Show>
                        <div class="flex justify-between">
                          <span class="text-slate-500">Daftar</span>
                          <span class="text-ink">{formatTanggal(o().user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4">
                      <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        KTP
                      </p>
                      <Show
                        when={o().ktpAsset?.url}
                        fallback={
                          <div class="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                            Owner belum mengunggah KTP.
                          </div>
                        }
                      >
                        <a
                          href={o().ktpAsset!.url}
                          target="_blank"
                          rel="noreferrer"
                          class="block overflow-hidden rounded-xl border border-slate-100"
                        >
                          <img
                            src={o().ktpAsset!.url}
                            alt="KTP"
                            class="w-full"
                          />
                        </a>
                      </Show>
                    </div>
                    <div class="flex gap-2 border-t border-slate-100 p-4">
                      <Button
                        variant="danger"
                        size="sm"
                        class="flex-1 gap-1"
                        onClick={() => setShowReject(true)}
                        disabled={busy()}
                      >
                        <X class="size-3.5" />
                        Tolak
                      </Button>
                      <Button
                        size="sm"
                        class="flex-1 gap-1"
                        onClick={() => submitDecision('APPROVE')}
                        loading={busy()}
                      >
                        <CheckCircle class="size-3.5" /> Setujui
                      </Button>
                    </div>
                  </>
                )}
              </Show>
            </div>
          </div>
        </Show>
      </Suspense>

      <Modal open={showReject()} onClose={() => setShowReject(false)} title="Tolak KYC">
        <Textarea
          label="Alasan penolakan"
          rows={3}
          value={note()}
          onInput={(e) => setNote(e.currentTarget.value)}
        />
        <div class="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowReject(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => submitDecision('REJECT')}
            loading={busy()}
            disabled={note().trim().length < 5}
          >
            Kirim Penolakan
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
