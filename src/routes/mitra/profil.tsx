import { createAsync, useSubmission, type RouteDefinition } from '@solidjs/router';
import { Show, Suspense } from 'solid-js';
import { Building2, CreditCard } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { Card } from '~/components/ui/Card';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { currentUserQuery } from '~/server/actions/auth';
import {
  userProfileQuery,
  updateProfileAction,
} from '~/server/actions/penyewa';
import { updateBankAction } from '~/server/actions/mitra';

export const route = {
  preload() {
    currentUserQuery();
    userProfileQuery();
  },
} satisfies RouteDefinition;

export default function ProfilMitraPage() {
  const user = createAsync(() => currentUserQuery());
  const profile = createAsync(() => userProfileQuery());
  const updateProfileSub = useSubmission(updateProfileAction);
  const updateBankSub = useSubmission(updateBankAction);

  return (
    <MitraLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Profil Owner" noIndex />

      <PageHeader
        title="Profil Owner"
        description="Informasi akun, KYC, dan rekening pembayaran"
        class="mb-6"
      />

      <Suspense fallback={<Skeleton class="h-96" />}>
        <Show when={profile()}>
          {(p) => (
            <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div class="space-y-4">
                <Card class="flex flex-col items-center gap-3 py-6 text-center">
                  <Avatar
                    name={p().profile?.namaLengkap ?? p().email}
                    size="xl"
                    src={p().avatarAsset?.url ?? undefined}
                  />
                  <div>
                    <p class="text-sm font-bold text-ink">
                      {p().profile?.namaLengkap ?? p().email}
                    </p>
                    <p class="text-xs text-slate-500">{p().email}</p>
                    <div class="mt-2 flex justify-center gap-1.5">
                      <Show
                        when={p().ownerProfile?.kycStatus === 'DISETUJUI'}
                        fallback={
                          <Badge variant="menunggu">
                            KYC {p().ownerProfile?.kycStatus ?? 'Belum Upload'}
                          </Badge>
                        }
                      >
                        <Badge variant="lunas">KYC Disetujui</Badge>
                      </Show>
                    </div>
                  </div>
                </Card>
              </div>

              <div class="space-y-4">
                <form action={updateProfileAction} method="post">
                  <Card>
                    <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
                      <Building2 class="size-4 text-primary" /> Informasi Pribadi
                    </h2>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <Input
                        name="namaLengkap"
                        label="Nama lengkap (KTP)"
                        defaultValue={p().profile?.namaLengkap ?? ''}
                        required
                      />
                      <Input
                        name="telepon"
                        label="Nomor HP / WA"
                        defaultValue={p().profile?.telepon ?? ''}
                      />
                      <div class="sm:col-span-2">
                        <label class="mb-1 block text-xs font-medium text-ink">Alamat</label>
                        <textarea
                          name="alamat"
                          rows={2}
                          class="w-full resize-none rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                        >
                          {p().profile?.alamat ?? ''}
                        </textarea>
                      </div>
                    </div>
                    <div class="mt-3 flex justify-end">
                      <Button type="submit" loading={updateProfileSub.pending}>
                        Simpan Profil
                      </Button>
                    </div>
                  </Card>
                </form>

                <form action={updateBankAction} method="post">
                  <Card>
                    <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
                      <CreditCard class="size-4 text-primary" /> Rekening Bank
                    </h2>
                    <Show when={updateBankSub.result && 'ok' in updateBankSub.result}>
                      <div
                        class={
                          updateBankSub.result &&
                          'ok' in updateBankSub.result &&
                          updateBankSub.result.ok
                            ? 'mb-3 rounded-xl bg-success-light px-3 py-2 text-sm text-success'
                            : 'mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger'
                        }
                      >
                        {updateBankSub.result && 'message' in updateBankSub.result
                          ? updateBankSub.result.message
                          : ''}
                      </div>
                    </Show>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <Input
                        name="namaBank"
                        label="Nama bank"
                        defaultValue={p().ownerProfile?.namaBank ?? ''}
                        required
                      />
                      <Input
                        name="rekeningNo"
                        label="Nomor rekening"
                        defaultValue={p().ownerProfile?.rekeningNo ?? ''}
                        required
                      />
                      <Input
                        name="rekeningNama"
                        label="Nama pemilik rekening"
                        defaultValue={p().ownerProfile?.rekeningNama ?? ''}
                        wrapperClass="sm:col-span-2"
                        required
                      />
                    </div>
                    <p class="mt-2 text-xs text-slate-500">
                      Pastikan nama rekening sesuai KTP. Rekening ini ditampilkan ke calon penyewa
                      di halaman pengajuan sewa.
                    </p>
                    <div class="mt-3 flex justify-end">
                      <Button type="submit" loading={updateBankSub.pending}>
                        Simpan Rekening
                      </Button>
                    </div>
                  </Card>
                </form>
              </div>
            </div>
          )}
        </Show>
      </Suspense>
    </MitraLayout>
  );
}
