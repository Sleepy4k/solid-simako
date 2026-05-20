import { createAsync, useAction, type RouteDefinition } from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { Search } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge, StatusBadge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { Modal } from '~/components/ui/Modal';
import { Textarea } from '~/components/ui/Textarea';
import { Button } from '~/components/ui/Button';
import { currentUserQuery } from '~/server/actions/auth';
import {
  adminUsersQuery,
  suspendUserAction,
  unsuspendUserAction,
} from '~/server/actions/admin';
import { formatTanggal } from '~/lib/shared/slug';

export const route = {
  preload() {
    currentUserQuery();
    adminUsersQuery();
  },
} satisfies RouteDefinition;

export default function UserManajemenPage() {
  const user = createAsync(() => currentUserQuery());
  const [q, setQ] = createSignal('');
  const [roleFilter, setRoleFilter] = createSignal<'all' | 'PENYEWA' | 'MITRA' | 'ADMIN'>('all');

  const users = createAsync(() => {
    const r = roleFilter();
    return adminUsersQuery({
      q: q() || undefined,
      role: r === 'all' ? undefined : (r as 'PENYEWA' | 'MITRA' | 'ADMIN'),
    });
  });

  const suspend = useAction(suspendUserAction);
  const unsuspend = useAction(unsuspendUserAction);

  const [showModal, setShowModal] = createSignal(false);
  const [target, setTarget] = createSignal<string | null>(null);
  const [alasan, setAlasan] = createSignal('');
  const [busy, setBusy] = createSignal(false);

  async function handleSuspend() {
    const id = target();
    if (!id || !alasan().trim()) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('userId', id);
      fd.append('alasan', alasan());
      await suspend(fd);
      setShowModal(false);
      setAlasan('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Manajemen Pengguna" noIndex />

      <PageHeader title="Manajemen Pengguna" description="Tinjau, tangguhkan, atau aktifkan akun" class="mb-4" />

      <div class="mb-4 flex flex-wrap gap-2">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari nama atau email..."
            value={q()}
            onInput={(e) => setQ(e.currentTarget.value)}
            class="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none"
          value={roleFilter()}
          onChange={(e) =>
            setRoleFilter(e.currentTarget.value as 'all' | 'PENYEWA' | 'MITRA' | 'ADMIN')
          }
        >
          <option value="all">Semua peran</option>
          <option value="PENYEWA">Penyewa</option>
          <option value="MITRA">Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show
          when={users() && users()!.length > 0}
          fallback={<EmptyState title="Tidak ada pengguna" />}
        >
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-100">
                <tr>
                  <For each={['USER', 'ROLE', 'DAFTAR', 'STATUS', 'AKSI']}>
                    {(h) => (
                      <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {h}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={users()}>
                  {(u) => (
                    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2.5">
                          <Avatar
                            name={u.profile?.namaLengkap ?? u.email}
                            size="sm"
                            src={u.avatarAsset?.url ?? undefined}
                          />
                          <div>
                            <p class="font-medium text-ink">
                              {u.profile?.namaLengkap ?? u.email}
                            </p>
                            <p class="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <Badge variant={u.role.name === 'MITRA' ? 'navy' : 'default'}>
                          {u.role.label}
                        </Badge>
                      </td>
                      <td class="px-4 py-3 text-xs text-slate-500">{formatTanggal(u.createdAt)}</td>
                      <td class="px-4 py-3">
                        <StatusBadge variant={u.isSuspended ? 'dibatalkan' : 'lunas'}>
                          {u.isSuspended ? 'Ditangguhkan' : 'Aktif'}
                        </StatusBadge>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex gap-1.5">
                          <Show
                            when={u.isSuspended}
                            fallback={
                              <button
                                type="button"
                                class="text-xs font-medium text-warn hover:underline"
                                onClick={() => {
                                  setTarget(u.id);
                                  setShowModal(true);
                                }}
                              >
                                Suspend
                              </button>
                            }
                          >
                            <button
                              type="button"
                              class="text-xs font-medium text-success hover:underline"
                              onClick={() => unsuspend(u.id)}
                            >
                              Aktifkan
                            </button>
                          </Show>
                        </div>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>

      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Tangguhkan Akun">
        <Textarea
          label="Alasan penangguhan"
          rows={3}
          value={alasan()}
          onInput={(e) => setAlasan(e.currentTarget.value)}
        />
        <div class="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button
            variant="danger"
            onClick={handleSuspend}
            loading={busy()}
            disabled={alasan().trim().length < 5}
          >
            Tangguhkan
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
