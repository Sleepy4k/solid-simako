import { createAsync, useAction, useSubmission, type RouteDefinition } from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { Plus, Trash2, ChevronDown } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';
import { Modal } from '~/components/ui/Modal';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { currentUserQuery } from '~/server/actions/auth';
import {
  adminFaqsQuery,
  upsertFaqAction,
  deleteFaqAction,
} from '~/server/actions/admin';

export const route = {
  preload() {
    currentUserQuery();
    adminFaqsQuery();
  },
} satisfies RouteDefinition;

export default function FaqAdminPage() {
  const user = createAsync(() => currentUserQuery());
  const faqs = createAsync(() => adminFaqsQuery());
  const sub = useSubmission(upsertFaqAction);
  const del = useAction(deleteFaqAction);
  const [openId, setOpenId] = createSignal<number | null>(null);
  const [showModal, setShowModal] = createSignal(false);

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="FAQ Admin" noIndex />

      <PageHeader
        title="FAQ Platform"
        description="Kelola pertanyaan yang sering diajukan"
        action={
          <Button size="sm" class="gap-1.5" onClick={() => setShowModal(true)}>
            <Plus class="size-4" /> Tambah FAQ
          </Button>
        }
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show
          when={faqs() && faqs()!.length > 0}
          fallback={<EmptyState title="Belum ada FAQ" />}
        >
          <div class="space-y-2">
            <For each={faqs()}>
              {(f) => (
                <div class="rounded-2xl border border-slate-100 bg-white">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between px-4 py-3 text-left"
                    onClick={() => setOpenId(openId() === f.id ? null : f.id)}
                  >
                    <div class="flex items-center gap-2.5">
                      <Badge class="text-[9px]">{f.kategori}</Badge>
                      <span class="text-sm font-medium text-ink">{f.pertanyaan}</span>
                      <Show when={!f.isActive}>
                        <Badge variant="default" class="text-[9px]">
                          Nonaktif
                        </Badge>
                      </Show>
                    </div>
                    <ChevronDown
                      class={`size-4 text-slate-400 transition-transform ${
                        openId() === f.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <Show when={openId() === f.id}>
                    <div class="border-t border-slate-100 px-4 pb-4 pt-3">
                      <p class="text-sm text-slate-600">{f.jawaban}</p>
                      <div class="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => del(f.id)}
                          class="flex items-center gap-1 text-xs text-danger hover:underline"
                        >
                          <Trash2 class="size-3" /> Hapus
                        </button>
                      </div>
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Suspense>

      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Tambah FAQ">
        <form
          action={upsertFaqAction}
          method="post"
          class="space-y-3"
          onSubmit={() => setTimeout(() => setShowModal(false), 100)}
        >
          <Input name="pertanyaan" label="Pertanyaan" required />
          <Textarea name="jawaban" label="Jawaban" rows={4} required />
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-ink">Kategori</label>
              <select
                name="kategori"
                class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
                required
              >
                <option value="Penyewa">Penyewa</option>
                <option value="Owner">Owner</option>
                <option value="Pembayaran">Pembayaran</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
            <Input name="urutan" type="number" label="Urutan" defaultValue={0} />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" loading={sub.pending}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
