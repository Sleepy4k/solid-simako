import { createAsync, useNavigate, useSubmission, type RouteDefinition } from '@solidjs/router';
import { Show, Suspense, For } from 'solid-js';
import { ArrowLeft } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Button, ButtonLink } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';
import { Card } from '~/components/ui/Card';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { ROUTES } from '~/constants/routes';
import { currentUserQuery } from '~/server/actions/auth';
import { createKostAction } from '~/server/actions/mitra';
import { campusesQuery, facilitiesQuery } from '~/server/actions/public';

export const route = {
  preload() {
    currentUserQuery();
    campusesQuery();
    facilitiesQuery();
  },
} satisfies RouteDefinition;

export default function TambahPropertiPage() {
  const user = createAsync(() => currentUserQuery());
  const kampus = createAsync(() => campusesQuery());
  const fasilitas = createAsync(() => facilitiesQuery());
  const sub = useSubmission(createKostAction);
  const navigate = useNavigate();

  // navigate after successful create
  if (sub.result && 'ok' in sub.result && sub.result.ok) {
    navigate(ROUTES.PROPERTI_KAMAR, { replace: true });
  }

  return (
    <MitraLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Tambah Properti" noIndex />

      <ButtonLink
        href={ROUTES.PROPERTI_KAMAR}
        variant="ghost"
        size="sm"
        class="mb-3 gap-1.5"
      >
        <ArrowLeft class="size-4" /> Kembali
      </ButtonLink>

      <PageHeader
        title="Tambah Properti Baru"
        description="Lengkapi data properti yang ingin Anda listing"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-96" />}>
        <form action={createKostAction} method="post" class="max-w-3xl space-y-4">
          <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
            <div class="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
              {sub.result && 'message' in sub.result ? sub.result.message : 'Gagal menyimpan'}
            </div>
          </Show>

          <Card>
            <h2 class="mb-3 text-sm font-bold text-ink">Informasi Properti</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <Input
                name="nama"
                label="Nama Properti"
                placeholder="Contoh: Kost Pak Slamet A"
                required
                wrapperClass="sm:col-span-2"
              />
              <div>
                <label class="mb-1 block text-xs font-medium text-ink">Jenis Kelamin</label>
                <select
                  name="jenisKelamin"
                  required
                  class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="PUTRA">Putra</option>
                  <option value="PUTRI">Putri</option>
                  <option value="CAMPUR">Campur</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-ink">Kampus terdekat</label>
                <select
                  name="kampusId"
                  class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">—</option>
                  <For each={kampus()}>
                    {(k) => <option value={k.id}>{k.singkatan} — {k.kota}</option>}
                  </For>
                </select>
              </div>
              <Input name="kota" label="Kota" placeholder="Purwokerto" required />
              <Input name="kodePos" label="Kode pos" placeholder="53127" />
              <div class="sm:col-span-2">
                <label class="mb-1 block text-xs font-medium text-ink">Alamat lengkap</label>
                <textarea
                  name="alamat"
                  rows={2}
                  required
                  class="w-full resize-none rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Textarea
                name="deskripsi"
                label="Deskripsi (opsional)"
                rows={3}
                wrapperClass="sm:col-span-2"
                placeholder="Suasana, jarak ke kampus, akses transportasi…"
              />
            </div>
          </Card>

          <Card>
            <h2 class="mb-3 text-sm font-bold text-ink">Fasilitas Properti</h2>
            <div class="flex flex-wrap gap-2">
              <For each={fasilitas()}>
                {(f) => (
                  <label class="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs hover:border-primary">
                    <input type="checkbox" name="facilities" value={f.id} class="accent-primary" />
                    {f.nama}
                  </label>
                )}
              </For>
            </div>
          </Card>

          <div class="flex justify-end gap-2">
            <ButtonLink href={ROUTES.PROPERTI_KAMAR} variant="secondary">
              Batal
            </ButtonLink>
            <Button type="submit" loading={sub.pending}>
              Simpan Properti
            </Button>
          </div>
        </form>
      </Suspense>
    </MitraLayout>
  );
}
