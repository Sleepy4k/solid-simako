import { createAsync, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { MapPin } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { currentUserQuery } from '~/server/actions/auth';
import { adminPropertiesQuery } from '~/server/actions/admin';

export const route = {
  preload() {
    currentUserQuery();
    adminPropertiesQuery();
  },
} satisfies RouteDefinition;

export default function AdminPropertiPage() {
  const user = createAsync(() => currentUserQuery());
  const items = createAsync(() => adminPropertiesQuery());

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Properti Platform" noIndex />

      <PageHeader
        title="Properti Terdaftar"
        description="Semua properti di platform Simako"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show
          when={items() && items()!.length > 0}
          fallback={<EmptyState title="Belum ada properti terdaftar" />}
        >
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-100">
                <tr>
                  <For each={['PROPERTI', 'OWNER', 'LOKASI', 'KAMAR', 'STATUS']}>
                    {(h) => (
                      <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {h}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={items()}>
                  {(p) => {
                    const terisi = p.rooms.filter((r) => r.status === 'TERISI').length;
                    return (
                      <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                        <td class="px-4 py-3">
                          <p class="font-medium text-ink">{p.nama}</p>
                          <p class="text-[10px] text-slate-400">{p.alamat}</p>
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-2">
                            <Avatar
                              name={p.owner.profile?.namaLengkap ?? p.owner.email}
                              size="sm"
                            />
                            <p class="text-xs">
                              {p.owner.profile?.namaLengkap ?? p.owner.email}
                            </p>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-xs text-slate-500">
                          <div class="flex items-center gap-1">
                            <MapPin class="size-3" /> {p.kota}
                          </div>
                        </td>
                        <td class="px-4 py-3 text-xs">
                          {terisi}/{p._count.rooms} terisi
                        </td>
                        <td class="px-4 py-3">
                          <Badge
                            variant={
                              p.isPublished && p.isVerified
                                ? 'lunas'
                                : p.isPublished
                                  ? 'menunggu'
                                  : 'default'
                            }
                            class="text-[9px]"
                          >
                            {p.isPublished && p.isVerified
                              ? 'Aktif'
                              : p.isPublished
                                ? 'Belum Verif'
                                : 'Draft'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  }}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>
    </AdminLayout>
  );
}
