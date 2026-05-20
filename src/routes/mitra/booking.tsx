import {
  createAsync,
  useAction,
  type RouteDefinition,
} from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { CheckCircle, X } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { PageHeader } from '~/components/shared/PageHeader';
import { Badge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Avatar } from '~/components/ui/Avatar';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { Modal } from '~/components/ui/Modal';
import { Textarea } from '~/components/ui/Textarea';
import { currentUserQuery } from '~/server/actions/auth';
import {
  ownerBookingsQuery,
  approveBookingAction,
  rejectBookingAction,
} from '~/server/actions/mitra';
import { formatIDR, formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    ownerBookingsQuery();
  },
} satisfies RouteDefinition;

export default function VerifikasiBookingPage() {
  const user = createAsync(() => currentUserQuery());
  const bookings = createAsync(() => ownerBookingsQuery());
  const approve = useAction(approveBookingAction);
  const reject = useAction(rejectBookingAction);

  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [showReject, setShowReject] = createSignal(false);
  const [rejectAlasan, setRejectAlasan] = createSignal('');
  const [busy, setBusy] = createSignal(false);

  const selected = () => bookings()?.find((b) => b.id === selectedId());

  async function handleApprove(id: string) {
    setBusy(true);
    try {
      await approve(id);
    } finally {
      setBusy(false);
    }
  }

  async function handleReject() {
    const id = selectedId();
    if (!id || !rejectAlasan().trim()) return;
    setBusy(true);
    try {
      await reject(id, rejectAlasan());
      setShowReject(false);
      setRejectAlasan('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <MitraLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Verifikasi Booking" noIndex />

      <PageHeader
        title="Verifikasi Booking"
        description="Tinjau pengajuan sewa dan bukti transfer dari calon penyewa"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-96" />}>
        <Show
          when={bookings() && bookings()!.length > 0}
          fallback={
            <EmptyState
              title="Belum ada pengajuan"
              description="Pengajuan sewa akan muncul di sini ketika ada calon penyewa mengajukan."
            />
          }
        >
          <div class="grid h-[calc(100vh-15rem)] gap-4 lg:grid-cols-[1fr_360px]">
            <div class="overflow-auto rounded-2xl border border-slate-100 bg-white">
              <table class="w-full text-sm">
                <thead class="border-b border-slate-100">
                  <tr>
                    <For each={['PENYEWA', 'KAMAR', 'NOMINAL', 'STATUS', 'TANGGAL']}>
                      {(h) => (
                        <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {h}
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={bookings()}>
                    {(b) => (
                      <tr
                        class={[
                          'cursor-pointer border-b border-slate-50 transition last:border-0',
                          selectedId() === b.id ? 'bg-primary-light/30' : 'hover:bg-slate-50',
                        ].join(' ')}
                        onClick={() => setSelectedId(b.id)}
                      >
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-2">
                            <Avatar
                              name={b.penyewa.profile?.namaLengkap ?? b.penyewa.email}
                              size="sm"
                            />
                            <div>
                              <p class="text-xs font-medium text-ink">
                                {b.penyewa.profile?.namaLengkap ?? b.penyewa.email}
                              </p>
                              <p class="text-[10px] text-slate-400">{b.penyewa.email}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-3">
                          <p class="text-xs text-ink">{b.room.boardingHouse.nama}</p>
                          <p class="text-[10px] text-slate-400">Kamar {b.room.nomorKamar}</p>
                        </td>
                        <td class="px-4 py-3 text-xs font-semibold">
                          {formatIDR(b.hargaDisetujui)}
                        </td>
                        <td class="px-4 py-3">
                          <Badge
                            variant={
                              b.status === 'AKTIF'
                                ? 'lunas'
                                : b.status === 'MENUNGGU_VERIF'
                                  ? 'menunggu'
                                  : b.status === 'DIBATALKAN'
                                    ? 'dibatalkan'
                                    : 'default'
                            }
                            class="text-[9px]"
                          >
                            {b.status}
                          </Badge>
                        </td>
                        <td class="px-4 py-3 text-[10px] text-slate-400">
                          {formatTanggal(b.createdAt)}
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
                    Pilih baris untuk lihat detail
                  </div>
                }
              >
                {(s) => (
                  <>
                    <div class="border-b border-slate-100 p-4">
                      <div class="flex items-center gap-2.5">
                        <Avatar
                          name={s().penyewa.profile?.namaLengkap ?? s().penyewa.email}
                          size="md"
                        />
                        <div>
                          <p class="text-sm font-bold text-ink">
                            {s().penyewa.profile?.namaLengkap ?? s().penyewa.email}
                          </p>
                          <p class="text-xs text-slate-500">{s().penyewa.email}</p>
                          <Show when={s().penyewa.profile?.telepon}>
                            <p class="text-xs text-slate-500">{s().penyewa.profile!.telepon}</p>
                          </Show>
                        </div>
                      </div>
                      <div class="mt-3 space-y-1.5 text-xs">
                        <div class="flex justify-between">
                          <span class="text-slate-500">Properti</span>
                          <span class="font-medium text-ink">{s().room.boardingHouse.nama}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-500">Kamar</span>
                          <span class="font-medium text-ink">{s().room.nomorKamar}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-500">Mulai sewa</span>
                          <span class="text-ink">{formatTanggal(s().tanggalMulai)}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-500">Berakhir</span>
                          <span class="text-ink">{formatTanggal(s().tanggalAkhir)}</span>
                        </div>
                        <div class="flex justify-between border-t border-slate-100 pt-2">
                          <span class="font-semibold text-ink">Nominal</span>
                          <span class="font-bold text-primary">
                            {formatIDR(s().hargaDisetujui)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-4">
                      <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Bukti Transfer
                      </p>
                      <Show
                        when={s().transactions[0]?.buktiAsset?.url}
                        fallback={
                          <div class="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                            Belum ada bukti transfer.
                          </div>
                        }
                      >
                        <a
                          href={s().transactions[0]!.buktiAsset!.url}
                          target="_blank"
                          rel="noreferrer"
                          class="block overflow-hidden rounded-xl border border-slate-100"
                        >
                          <img
                            src={s().transactions[0]!.buktiAsset!.url}
                            alt="Bukti transfer"
                            class="w-full"
                          />
                        </a>
                      </Show>
                    </div>

                    <Show when={s().status === 'MENUNGGU_VERIF'}>
                      <div class="flex gap-2 border-t border-slate-100 p-4">
                        <Button
                          variant="danger"
                          size="sm"
                          class="flex-1 gap-1"
                          onClick={() => setShowReject(true)}
                          disabled={busy()}
                        >
                          <X class="size-3.5" /> Tolak
                        </Button>
                        <Button
                          size="sm"
                          class="flex-1 gap-1"
                          onClick={() => handleApprove(s().id)}
                          loading={busy()}
                        >
                          <CheckCircle class="size-3.5" /> Terima
                        </Button>
                      </div>
                    </Show>
                  </>
                )}
              </Show>
            </div>
          </div>
        </Show>
      </Suspense>

      <Modal open={showReject()} onClose={() => setShowReject(false)} title="Tolak Pengajuan">
        <p class="mb-3 text-sm text-slate-500">
          Berikan alasan penolakan kepada calon penyewa.
        </p>
        <Textarea
          label="Alasan penolakan"
          rows={3}
          value={rejectAlasan()}
          onInput={(e) => setRejectAlasan(e.currentTarget.value)}
        />
        <div class="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowReject(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            loading={busy()}
            disabled={rejectAlasan().trim().length < 5}
          >
            Kirim Penolakan
          </Button>
        </div>
      </Modal>
    </MitraLayout>
  );
}
