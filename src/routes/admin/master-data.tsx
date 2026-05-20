import { createAsync, useAction, useSubmission, type RouteDefinition } from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { Plus, Trash2 } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { currentUserQuery } from '~/server/actions/auth';
import {
  adminCampusesQuery,
  adminBanksQuery,
  adminFacilitiesQuery,
  createCampusAction,
  deleteCampusAction,
  createBankAction,
  deleteBankAction,
  createFacilityAction,
  deleteFacilityAction,
} from '~/server/actions/admin';

export const route = {
  preload() {
    currentUserQuery();
    adminCampusesQuery();
    adminBanksQuery();
    adminFacilitiesQuery();
  },
} satisfies RouteDefinition;

export default function MasterDataPage() {
  const user = createAsync(() => currentUserQuery());
  const [tab, setTab] = createSignal<'kampus' | 'bank' | 'fasilitas'>('kampus');
  const [showModal, setShowModal] = createSignal(false);

  const campuses = createAsync(() => adminCampusesQuery());
  const banks = createAsync(() => adminBanksQuery());
  const facilities = createAsync(() => adminFacilitiesQuery());

  const campusSub = useSubmission(createCampusAction);
  const bankSub = useSubmission(createBankAction);
  const facilitySub = useSubmission(createFacilityAction);

  const delCampus = useAction(deleteCampusAction);
  const delBank = useAction(deleteBankAction);
  const delFacility = useAction(deleteFacilityAction);

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Master Data" noIndex />

      <PageHeader
        title="Master Data"
        description="Kelola data referensi: kampus, bank, dan fasilitas"
        action={
          <Button size="sm" class="gap-1.5" onClick={() => setShowModal(true)}>
            <Plus class="size-4" /> Tambah
          </Button>
        }
        class="mb-4"
      />

      <Tabs
        items={[
          { id: 'kampus', label: 'Kampus', badge: campuses()?.length },
          { id: 'bank', label: 'Bank', badge: banks()?.length },
          { id: 'fasilitas', label: 'Fasilitas', badge: facilities()?.length },
        ]}
        onChange={(id) => setTab(id as 'kampus' | 'bank' | 'fasilitas')}
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show when={tab() === 'kampus'}>
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-100">
                <tr>
                  <For each={['NAMA KAMPUS', 'SINGKATAN', 'KOTA', 'AKSI']}>
                    {(h) => (
                      <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {h}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={campuses()}>
                  {(k) => (
                    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td class="px-4 py-3 font-medium">{k.nama}</td>
                      <td class="px-4 py-3"><Badge variant="navy">{k.singkatan}</Badge></td>
                      <td class="px-4 py-3 text-slate-500">{k.kota}</td>
                      <td class="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => delCampus(k.id)}
                          class="text-danger hover:text-danger/70"
                        >
                          <Trash2 class="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>

        <Show when={tab() === 'bank'}>
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-100">
                <tr>
                  <For each={['NAMA BANK', 'KODE', 'AKSI']}>
                    {(h) => (
                      <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {h}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={banks()}>
                  {(b) => (
                    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td class="px-4 py-3 font-medium">{b.nama}</td>
                      <td class="px-4 py-3"><Badge>{b.kode}</Badge></td>
                      <td class="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => delBank(b.id)}
                          class="text-danger hover:text-danger/70"
                        >
                          <Trash2 class="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>

        <Show when={tab() === 'fasilitas'}>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <For each={facilities()}>
              {(f) => (
                <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                  <div>
                    <p class="font-medium text-ink">{f.nama}</p>
                    <p class="text-[10px] text-slate-400">{f.kategori}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => delFacility(f.id)}
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-danger"
                  >
                    <Trash2 class="size-3.5" />
                  </button>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Suspense>

      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Tambah Data">
        <Show when={tab() === 'kampus'}>
          <form
            action={createCampusAction}
            method="post"
            class="space-y-3"
            onSubmit={() => setTimeout(() => setShowModal(false), 100)}
          >
            <Input name="nama" label="Nama kampus" required />
            <Input name="singkatan" label="Singkatan" required />
            <Input name="kota" label="Kota" required />
            <div class="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" loading={campusSub.pending}>Simpan</Button>
            </div>
          </form>
        </Show>

        <Show when={tab() === 'bank'}>
          <form
            action={createBankAction}
            method="post"
            class="space-y-3"
            onSubmit={() => setTimeout(() => setShowModal(false), 100)}
          >
            <Input name="nama" label="Nama bank" required />
            <Input name="kode" label="Kode bank" required />
            <div class="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" loading={bankSub.pending}>Simpan</Button>
            </div>
          </form>
        </Show>

        <Show when={tab() === 'fasilitas'}>
          <form
            action={createFacilityAction}
            method="post"
            class="space-y-3"
            onSubmit={() => setTimeout(() => setShowModal(false), 100)}
          >
            <Input name="nama" label="Nama fasilitas" required />
            <Input name="icon" label="Icon (opsional)" />
            <Input name="kategori" label="Kategori" required placeholder="Umum / Kamar / Layanan" />
            <div class="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" loading={facilitySub.pending}>Simpan</Button>
            </div>
          </form>
        </Show>
      </Modal>
    </AdminLayout>
  );
}
