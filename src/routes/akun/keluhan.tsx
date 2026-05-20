import {
  createAsync,
  useSubmission,
  type RouteDefinition,
} from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { Plus, MessageSquare } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Button } from '~/components/ui/Button';
import { Modal } from '~/components/ui/Modal';
import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import {
  userComplaintsQuery,
  createComplaintAction,
  activeRentalQuery,
} from '~/server/actions/penyewa';
import { currentUserQuery } from '~/server/actions/auth';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    userComplaintsQuery();
    activeRentalQuery();
  },
} satisfies RouteDefinition;

const STATUS_VARIANT = {
  TERBUKA: 'menunggu',
  DIPROSES: 'telat',
  SELESAI: 'lunas',
  DITUTUP: 'dibatalkan',
} as const;

function statusLabel(s: string) {
  return s === 'TERBUKA'
    ? 'Terbuka'
    : s === 'DIPROSES'
      ? 'Diproses'
      : s === 'SELESAI'
        ? 'Selesai'
        : 'Ditutup';
}

export default function KeluhanPenyewaPage() {
  const user = createAsync(() => currentUserQuery());
  const complaints = createAsync(() => userComplaintsQuery());
  const rental = createAsync(() => activeRentalQuery());
  const sub = useSubmission(createComplaintAction);
  const [showModal, setShowModal] = createSignal(false);

  return (
    <TenantLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Tiket & Keluhan" noIndex />

      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-ink">Tiket & Keluhan</h1>
        <Button size="sm" class="gap-1.5" onClick={() => setShowModal(true)}>
          <Plus class="size-4" /> Buat Tiket
        </Button>
      </div>

      <Suspense
        fallback={
          <div class="space-y-2">
            <For each={[0, 1]}>{() => <Skeleton class="h-20" />}</For>
          </div>
        }
      >
        <Show
          when={complaints() && complaints()!.length > 0}
          fallback={
            <EmptyState
              title="Belum ada tiket keluhan"
              description="Laporkan kerusakan atau masalah lain melalui tombol di atas."
              icon={<MessageSquare class="size-6 text-primary" />}
            />
          }
        >
          <div class="space-y-3">
            <For each={complaints()}>
              {(c) => (
                <div class="rounded-2xl border border-slate-100 bg-white p-4">
                  <div class="mb-1 flex items-center justify-between gap-2">
                    <p class="font-mono text-[10px] text-slate-400">{c.id}</p>
                    <StatusBadge variant={STATUS_VARIANT[c.status]}>
                      {statusLabel(c.status)}
                    </StatusBadge>
                  </div>
                  <p class="text-sm font-semibold text-ink">{c.judul}</p>
                  <Show when={c.boardingHouse}>
                    <p class="text-[10px] text-slate-400">{c.boardingHouse!.nama}</p>
                  </Show>
                  <p class="mt-2 text-xs text-slate-600">{c.deskripsi}</p>
                  <Show when={c.resolusi}>
                    <div class="mt-3 rounded-xl bg-success-light p-3 text-xs">
                      <p class="font-semibold text-success">Tanggapan owner</p>
                      <p class="mt-1 text-slate-700">{c.resolusi}</p>
                    </div>
                  </Show>
                  <p class="mt-2 text-[10px] text-slate-400">
                    Dibuat {formatTanggal(c.createdAt)}
                  </p>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Suspense>

      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Buat Tiket Keluhan">
        <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
          <div class="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            {sub.result && 'message' in sub.result ? sub.result.message : 'Gagal mengirim'}
          </div>
        </Show>
        <form action={createComplaintAction} method="post" class="space-y-3">
          <Show when={rental()}>
            <input type="hidden" name="boardingHouseId" value={rental()!.room.boardingHouse.id} />
            <p class="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              Tiket akan dilampirkan ke kost{' '}
              <strong class="text-ink">{rental()!.room.boardingHouse.nama}</strong>
            </p>
          </Show>
          <Input name="judul" label="Judul Keluhan" placeholder="Contoh: AC tidak berfungsi" required />
          <div>
            <label class="mb-1 block text-xs font-medium text-ink">Kategori</label>
            <select
              name="kategori"
              class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
              required
            >
              <option value="">—</option>
              <option value="Fasilitas">Fasilitas / kerusakan</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Pembayaran">Pembayaran</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-ink">Prioritas</label>
            <select
              name="prioritas"
              class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="RENDAH">Rendah</option>
              <option value="SEDANG" selected>Sedang</option>
              <option value="TINGGI">Tinggi</option>
              <option value="KRITIS">Kritis</option>
            </select>
          </div>
          <Textarea name="deskripsi" label="Detail Keluhan" rows={4} required />

          <div class="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" loading={sub.pending}>
              Kirim Tiket
            </Button>
          </div>
        </form>
      </Modal>
    </TenantLayout>
  );
}
