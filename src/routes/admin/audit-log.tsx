import { createAsync, type RouteDefinition } from '@solidjs/router';
import { For, Show, Suspense } from 'solid-js';
import { Shield } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import { currentUserQuery } from '~/server/actions/auth';
import { adminAuditQuery } from '~/server/actions/admin';

export const route = {
  preload() {
    currentUserQuery();
    adminAuditQuery();
  },
} satisfies RouteDefinition;

export default function AuditLogPage() {
  const user = createAsync(() => currentUserQuery());
  const logs = createAsync(() => adminAuditQuery(200));

  return (
    <AdminLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Audit Log" noIndex />

      <PageHeader
        title="Audit Log"
        description="Catatan aktivitas penting di platform"
        class="mb-4"
      />

      <Suspense fallback={<Skeleton class="h-64" />}>
        <Show
          when={logs() && logs()!.length > 0}
          fallback={<EmptyState title="Belum ada log aktivitas" />}
        >
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-100">
                <tr>
                  <For each={['AKTOR', 'AKSI', 'TARGET', 'IP', 'WAKTU']}>
                    {(h) => (
                      <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {h}
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={logs()}>
                  {(log) => (
                    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <Show
                            when={log.user}
                            fallback={
                              <div class="flex size-6 items-center justify-center rounded-full bg-slate-100">
                                <Shield class="size-3 text-slate-400" />
                              </div>
                            }
                          >
                            <Avatar
                              name={log.user!.profile?.namaLengkap ?? log.user!.email}
                              size="sm"
                            />
                          </Show>
                          <p class="text-xs">
                            {log.user?.profile?.namaLengkap ?? log.user?.email ?? 'System'}
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <Badge class="font-mono text-[10px]">{log.action}</Badge>
                      </td>
                      <td class="px-4 py-3 text-xs">
                        {log.targetModel}
                        <Show when={log.targetId}>
                          <span class="font-mono text-[10px] text-slate-400"> #{log.targetId!.slice(0, 8)}</span>
                        </Show>
                      </td>
                      <td class="px-4 py-3 font-mono text-[10px] text-slate-400">
                        {log.ipAddress ?? '—'}
                      </td>
                      <td class="px-4 py-3 text-[10px] text-slate-500">
                        {new Date(log.createdAt).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>
    </AdminLayout>
  );
}
