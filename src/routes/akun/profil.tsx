import { createAsync, useSubmission, type RouteDefinition } from '@solidjs/router';
import { Show, Suspense, For } from 'solid-js';
import { Camera } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Avatar } from '~/components/ui/Avatar';
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { Skeleton } from '~/components/ui/Skeleton';
import {
  userProfileQuery,
  updateProfileAction,
  uploadAvatarAction,
} from '~/server/actions/penyewa';
import { currentUserQuery } from '~/server/actions/auth';
import { campusesQuery } from '~/server/actions/public';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    userProfileQuery();
    campusesQuery();
  },
} satisfies RouteDefinition;

export default function ProfilPenyewaPage() {
  const user = createAsync(() => currentUserQuery());
  const profile = createAsync(() => userProfileQuery());
  const kampus = createAsync(() => campusesQuery());
  const updateSub = useSubmission(updateProfileAction);
  const avatarSub = useSubmission(uploadAvatarAction);

  return (
    <TenantLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Profil Saya" noIndex />

      <h1 class="mb-6 text-xl font-bold text-ink">Profil Saya</h1>

      <Suspense fallback={<Skeleton class="h-96" />}>
        <Show when={profile()}>
          {(p) => (
            <div class="grid gap-6 lg:grid-cols-[240px_1fr]">
              {/* Avatar card */}
              <div class="space-y-4">
                <Card class="flex flex-col items-center gap-3 py-6 text-center">
                  <form
                    action={uploadAvatarAction}
                    method="post"
                    enctype="multipart/form-data"
                    class="relative"
                  >
                    <Avatar name={p().profile?.namaLengkap ?? p().email} size="xl" src={p().avatarAsset?.url ?? undefined} />
                    <label class="absolute -bottom-1 -right-1 flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-2">
                      <Camera class="size-3.5" />
                      <input
                        type="file"
                        name="file"
                        class="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.currentTarget.files?.[0]) e.currentTarget.form?.requestSubmit();
                        }}
                      />
                    </label>
                  </form>
                  <div>
                    <p class="text-sm font-bold text-ink">
                      {p().profile?.namaLengkap ?? p().email}
                    </p>
                    <p class="text-xs text-slate-500">{p().email}</p>
                    <Show when={p().isVerified}>
                      <Badge variant="lunas" class="mt-2">
                        Terverifikasi
                      </Badge>
                    </Show>
                  </div>
                  <div class="w-full border-t border-slate-100 pt-3 text-xs">
                    <div class="flex justify-between">
                      <span class="text-slate-500">Member sejak</span>
                      <span class="font-medium text-ink">{formatTanggal(p().createdAt)}</span>
                    </div>
                  </div>
                  <Show when={avatarSub.result && 'ok' in avatarSub.result && avatarSub.result.ok}>
                    <p class="text-xs text-success">Foto profil tersimpan</p>
                  </Show>
                </Card>
              </div>

              {/* Form */}
              <div class="space-y-4">
                <Show when={updateSub.result && 'ok' in updateSub.result}>
                  <div
                    class={
                      updateSub.result && 'ok' in updateSub.result && updateSub.result.ok
                        ? 'rounded-xl bg-success-light px-3 py-2 text-sm text-success'
                        : 'rounded-xl bg-red-50 px-3 py-2 text-sm text-danger'
                    }
                  >
                    {updateSub.result && 'message' in updateSub.result
                      ? updateSub.result.message
                      : ''}
                  </div>
                </Show>

                <form action={updateProfileAction} method="post">
                  <Card>
                    <h2 class="mb-4 text-sm font-bold text-ink">Informasi Pribadi</h2>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <Input
                        name="namaLengkap"
                        label="Nama lengkap"
                        defaultValue={p().profile?.namaLengkap ?? ''}
                        required
                      />
                      <Input
                        name="telepon"
                        label="Nomor HP / WA"
                        defaultValue={p().profile?.telepon ?? ''}
                      />
                      <Input
                        name="tanggalLahir"
                        label="Tanggal lahir"
                        type="date"
                        defaultValue={
                          p().profile?.tanggalLahir
                            ? new Date(p().profile!.tanggalLahir!).toISOString().slice(0, 10)
                            : ''
                        }
                      />
                      <div>
                        <label class="mb-1 block text-xs font-medium text-ink">Jenis kelamin</label>
                        <select
                          name="jenisKelamin"
                          class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
                        >
                          <option value="">—</option>
                          <option value="L" selected={p().profile?.jenisKelamin === 'L'}>
                            Laki-laki
                          </option>
                          <option value="P" selected={p().profile?.jenisKelamin === 'P'}>
                            Perempuan
                          </option>
                        </select>
                      </div>
                      <div class="sm:col-span-2">
                        <label class="mb-1 block text-xs font-medium text-ink">Kampus</label>
                        <select
                          name="kampusId"
                          class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
                        >
                          <option value="">—</option>
                          <For each={kampus()}>
                            {(k) => (
                              <option
                                value={k.id}
                                selected={p().profile?.kampusId === k.id}
                              >
                                {k.nama}
                              </option>
                            )}
                          </For>
                        </select>
                      </div>
                      <div class="sm:col-span-2">
                        <label class="mb-1 block text-xs font-medium text-ink">Alamat</label>
                        <textarea
                          name="alamat"
                          rows={3}
                          class="w-full resize-none rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {p().profile?.alamat ?? ''}
                        </textarea>
                      </div>
                    </div>
                  </Card>

                  <div class="mt-4 flex justify-end gap-2">
                    <Button type="submit" loading={updateSub.pending}>
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Show>
      </Suspense>
    </TenantLayout>
  );
}
