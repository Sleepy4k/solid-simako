import {
  createAsync,
  useSubmission,
  type RouteDefinition,
} from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { Upload, CheckCircle } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Tabs } from '~/components/ui/Tabs';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { userTransactionsQuery, uploadProofAction } from '~/server/actions/penyewa';
import { currentUserQuery } from '~/server/actions/auth';
import { formatIDR, formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    userTransactionsQuery();
  },
} satisfies RouteDefinition;

const VARIANT = {
  LUNAS: 'lunas',
  MENUNGGU_BUKTI: 'menunggu',
  MENUNGGU_VERIF: 'menunggu',
  DITOLAK: 'telat',
  DIBATALKAN: 'dibatalkan',
} as const;

function statusLabel(s: string) {
  switch (s) {
    case 'LUNAS':
      return 'Lunas';
    case 'MENUNGGU_BUKTI':
      return 'Belum Bayar';
    case 'MENUNGGU_VERIF':
      return 'Menunggu Verifikasi';
    case 'DITOLAK':
      return 'Ditolak';
    case 'DIBATALKAN':
      return 'Dibatalkan';
    default:
      return s;
  }
}

export default function TagihanPenyewaPage() {
  const user = createAsync(() => currentUserQuery());
  const transactions = createAsync(() => userTransactionsQuery());
  const sub = useSubmission(uploadProofAction);
  const [uploadingId, setUploadingId] = createSignal<string | null>(null);
  const [file, setFile] = createSignal<File | null>(null);

  const menunggu = () =>
    transactions()?.filter(
      (t) => t.status === 'MENUNGGU_BUKTI' || t.status === 'MENUNGGU_VERIF',
    ) ?? [];
  const riwayat = () =>
    transactions()?.filter((t) => t.status === 'LUNAS' || t.status === 'DITOLAK') ?? [];

  function handleFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    setFile(input.files?.[0] ?? null);
  }

  return (
    <TenantLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Tagihan Saya" noIndex />

      <h1 class="mb-4 text-xl font-bold text-ink">Tagihan Saya</h1>

      <Suspense fallback={<Skeleton class="h-40" />}>
        <Show
          when={transactions() && transactions()!.length > 0}
          fallback={<EmptyState title="Belum ada tagihan" description="Tagihan akan muncul setelah kamu mengajukan sewa." />}
        >
          <Tabs
            items={[
              { id: 'menunggu', label: 'Belum Dibayar', badge: menunggu().length },
              { id: 'riwayat', label: 'Riwayat', badge: riwayat().length },
            ]}
            class="mb-4"
          />

          <For each={menunggu()}>
            {(t) => (
              <div class="mb-4 overflow-hidden rounded-2xl border border-warn/30 bg-white">
                <div class="flex items-start justify-between border-b border-slate-100 p-4">
                  <div>
                    <p class="font-semibold text-ink">
                      {t.tipe === 'BOOKING' ? 'Pembayaran Awal' : 'Perpanjangan'}
                    </p>
                    <p class="text-sm text-slate-500">{t.rental.room.boardingHouse.nama}</p>
                    <p class="mt-1 font-mono text-[10px] text-slate-400">{t.id}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-ink">{formatIDR(t.nominal)}</p>
                    <Show when={t.batasTransfer}>
                      <p class="text-xs text-warn">
                        Batas {new Date(t.batasTransfer!).toLocaleString('id-ID')}
                      </p>
                    </Show>
                  </div>
                </div>

                <Show when={t.status === 'MENUNGGU_VERIF'}>
                  <div class="bg-amber-50 px-4 py-3 text-xs text-amber-800">
                    Bukti transfer terkirim — menunggu verifikasi owner.
                  </div>
                </Show>

                <Show when={t.status === 'MENUNGGU_BUKTI'}>
                  <form
                    action={uploadProofAction}
                    method="post"
                    enctype="multipart/form-data"
                    class="bg-amber-50 p-4"
                    onSubmit={() => setUploadingId(t.id)}
                  >
                    <input type="hidden" name="transactionId" value={t.id} />
                    <p class="mb-2 text-xs font-semibold text-warn">
                      Unggah bukti transfer Anda
                    </p>
                    <label class="block">
                      <input
                        type="file"
                        name="file"
                        accept="image/*,application/pdf"
                        required
                        onChange={handleFile}
                        class="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs"
                      />
                    </label>
                    <div class="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="namaBank"
                        placeholder="Bank pengirim"
                        class="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs"
                      />
                      <input
                        type="text"
                        name="nomorReferensi"
                        placeholder="No. referensi"
                        class="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      class="mt-3 gap-1.5"
                      loading={sub.pending && uploadingId() === t.id}
                    >
                      <Upload class="size-4" /> Kirim Bukti
                    </Button>
                  </form>
                </Show>
              </div>
            )}
          </For>

          <div class="space-y-2">
            <For each={riwayat()}>
              {(t) => (
                <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <div class="flex items-center gap-3">
                    <CheckCircle
                      class={t.status === 'LUNAS' ? 'size-5 text-success' : 'size-5 text-slate-300'}
                    />
                    <div>
                      <p class="text-sm font-medium text-ink">
                        {t.tipe === 'BOOKING' ? 'Pembayaran Awal' : 'Perpanjangan'}
                      </p>
                      <p class="font-mono text-[10px] text-slate-400">{t.id}</p>
                      <p class="text-[10px] text-slate-400">
                        {t.rental.room.boardingHouse.nama}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <p class="text-sm font-semibold text-ink">{formatIDR(t.nominal)}</p>
                    <StatusBadge variant={VARIANT[t.status as keyof typeof VARIANT]}>
                      {statusLabel(t.status)}
                    </StatusBadge>
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
