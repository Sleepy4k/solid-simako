import { For } from 'solid-js';
import { Search, Download, Shield } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

interface LogEntry {
  id: string;
  aktor: string;
  email: string;
  aksi: string;
  target: string;
  kategori: 'Auth' | 'KYC' | 'Pengguna' | 'Properti' | 'Transaksi' | 'Sistem';
  ip: string;
  waktu: string;
  sukses: boolean;
}

const LOGS: LogEntry[] = [
  { id: 'LOG-00841', aktor: 'Riska Handayani', email: 'riska@simako.id', aksi: 'APPROVE_KYC', target: 'Owner Tina Maharani (id:3)', kategori: 'KYC', ip: '180.244.x.x', waktu: '19 Mei 26, 14:32', sukses: true },
  { id: 'LOG-00840', aktor: 'Riska Handayani', email: 'riska@simako.id', aksi: 'REJECT_KYC', target: 'Owner Hadi Wijaya (id:2)', kategori: 'KYC', ip: '180.244.x.x', waktu: '19 Mei 26, 14:28', sukses: true },
  { id: 'LOG-00839', aktor: 'System', email: 'system@simako.id', aksi: 'SEND_REMINDER', target: 'Tagihan Jun 2026 — 38 penyewa', kategori: 'Transaksi', ip: 'internal', waktu: '19 Mei 26, 08:00', sukses: true },
  { id: 'LOG-00838', aktor: 'Riska Handayani', email: 'riska@simako.id', aksi: 'SUSPEND_USER', target: 'User Bambang Sutrisno (id:51)', kategori: 'Pengguna', ip: '180.244.x.x', waktu: '18 Mei 26, 17:11', sukses: true },
  { id: 'LOG-00837', aktor: 'Riska Handayani', email: 'riska@simako.id', aksi: 'LOGIN', target: 'Admin panel', kategori: 'Auth', ip: '180.244.x.x', waktu: '18 Mei 26, 09:02', sukses: true },
  { id: 'LOG-00836', aktor: 'Unknown', email: '—', aksi: 'LOGIN_FAILED', target: 'Admin panel', kategori: 'Auth', ip: '103.12.x.x', waktu: '17 Mei 26, 23:47', sukses: false },
  { id: 'LOG-00835', aktor: 'System', email: 'system@simako.id', aksi: 'BACKUP_DB', target: 'simako_production', kategori: 'Sistem', ip: 'internal', waktu: '17 Mei 26, 02:00', sukses: true },
  { id: 'LOG-00834', aktor: 'Riska Handayani', email: 'riska@simako.id', aksi: 'BAN_USER', target: 'User Asep Hidayat (id:89)', kategori: 'Pengguna', ip: '180.244.x.x', waktu: '16 Mei 26, 15:33', sukses: true },
];

const KAT_VARIANT: Record<string, 'navy' | 'info' | 'default' | 'lunas' | 'menunggu' | 'telat'> = {
  Auth: 'navy',
  KYC: 'info',
  Pengguna: 'default',
  Properti: 'lunas',
  Transaksi: 'menunggu',
  Sistem: 'telat',
};

export default function AuditLogPage() {
  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Audit Log" noIndex />

      <PageHeader
        title="Audit Log"
        description="Rekam jejak semua aktivitas admin dan sistem"
        action={<Button variant="secondary" size="sm" class="gap-1.5"><Download class="size-4" /> Ekspor</Button>}
        class="mb-4"
      />

      {/* Search & filter */}
      <div class="mb-4 flex flex-wrap gap-2">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari aktor, aksi, target..."
            class="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none">
          <option>Kategori: Semua</option>
          <option>Auth</option>
          <option>KYC</option>
          <option>Pengguna</option>
          <option>Properti</option>
          <option>Transaksi</option>
          <option>Sistem</option>
        </select>
        <select class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none">
          <option>Status: Semua</option>
          <option>Sukses</option>
          <option>Gagal</option>
        </select>
        <input type="date" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:border-primary focus:outline-none" />
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table class="w-full text-sm">
          <thead class="border-b border-slate-100">
            <tr>
              {['ID', 'AKTOR', 'AKSI', 'TARGET', 'KATEGORI', 'IP', 'WAKTU', 'STATUS'].map((h) => (
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <For each={LOGS}>
              {(log) => (
                <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td class="px-4 py-3 font-mono text-[10px] text-slate-400">{log.id}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      {log.aktor === 'System'
                        ? <div class="flex size-6 items-center justify-center rounded-full bg-slate-100"><Shield class="size-3 text-slate-400" /></div>
                        : <Avatar name={log.aktor} size="sm" />
                      }
                      <div>
                        <p class="text-xs font-medium text-ink">{log.aktor}</p>
                        <p class="text-[10px] text-slate-400">{log.email}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="font-mono text-xs font-medium text-ink">{log.aksi}</span>
                  </td>
                  <td class="max-w-[200px] px-4 py-3">
                    <p class="truncate text-xs text-slate-500">{log.target}</p>
                  </td>
                  <td class="px-4 py-3">
                    <Badge variant={KAT_VARIANT[log.kategori]} class="text-[9px]">{log.kategori}</Badge>
                  </td>
                  <td class="px-4 py-3 font-mono text-[10px] text-slate-400">{log.ip}</td>
                  <td class="px-4 py-3 text-[10px] text-slate-500">{log.waktu}</td>
                  <td class="px-4 py-3">
                    {log.sukses
                      ? <span class="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-medium text-success">Sukses</span>
                      : <span class="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-medium text-danger">Gagal</span>
                    }
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <div class="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          Menampilkan 1–12 dari 2.841 entri log
        </div>
      </div>
    </AdminLayout>
  );
}
