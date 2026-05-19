import { For } from 'solid-js';
import { Download, Search } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge, StatusBadge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Avatar } from '~/components/ui/Avatar';
import { PageHeader } from '~/components/shared/PageHeader';

type UserStatus = 'Aktif' | 'Pending' | 'Suspended' | 'Banned';

interface UserRow {
  nama: string;
  email: string;
  role: string;
  bergabung: string;
  aktivitas: string;
  lokasi: string;
  status: UserStatus;
}

const DATA: UserRow[] = [
  { nama: 'Dewi Ananda', email: 'dewi.ag@mail.com', role: 'User', bergabung: '12 Sep 25', aktivitas: '4 sewa, 1aktif', lokasi: 'Yogyakarta', status: 'Aktif' },
  { nama: 'Pak Slamet Riyadi', email: 'slamet.riyadi@mail.com', role: 'Owner', bergabung: '03 Jan 24', aktivitas: '3 properti, 39 kamar', lokasi: 'Yogyakarta', status: 'Aktif' },
  { nama: 'Rangga Putra', email: 'rangga@mail.com', role: 'User', bergabung: '01 Mar 25', aktivitas: '1 sewa aktif', lokasi: 'Semarang', status: 'Aktif' },
  { nama: 'Lia Sutanto', email: 'lia.s@gmail.com', role: 'Owner', bergabung: '26 Mei 26', aktivitas: 'Verf KYC pending', lokasi: 'Bandung', status: 'Pending' },
  { nama: 'Bambang Sutrisno', email: 'bambang@mail.com', role: 'User', bergabung: '14 Feb 25', aktivitas: '2 keluhan, 1 dispute', lokasi: 'Yogyakarta', status: 'Suspended' },
  { nama: 'Asep Hidayat', email: 'asep@mail.com', role: 'User', bergabung: '08 Apr 26', aktivitas: 'Multiple reports', lokasi: 'Bandung', status: 'Banned' },
  { nama: 'Salma Rahmadani', email: 'salma@mail.com', role: 'User', bergabung: '20 Aug 23', aktivitas: '1 sewa aktif', lokasi: 'Yogyakarta', status: 'Aktif' },
];

const STATUS_VARIANT: Record<UserStatus, 'lunas' | 'menunggu' | 'telat' | 'dibatalkan'> = {
  Aktif: 'lunas',
  Pending: 'menunggu',
  Suspended: 'telat',
  Banned: 'dibatalkan',
};

export default function UserManajemenPage() {
  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Manajemen User" noIndex />

      <PageHeader
        title="Manajemen User"
        description="12.793 akun terdaftar"
        action={<Button variant="secondary" size="sm" class="gap-1.5"><Download class="size-4" /> Ekspor</Button>}
        class="mb-4"
      />

      <Tabs
        items={[
          { id: 'semua', label: 'Semua', badge: 12793 },
          { id: 'user', label: 'User', badge: 12481 },
          { id: 'owner', label: 'Owner', badge: 312 },
          { id: 'suspended', label: 'Suspended', badge: 24 },
          { id: 'banned', label: 'Banned', badge: 8 },
        ]}
        class="mb-4"
      />

      {/* Search & filters */}
      <div class="mb-4 flex flex-wrap gap-2">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari nama, email, no. KTP..."
            class="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {['Role: Semua', 'Status: Aktif', 'Kota: Semua'].map((f) => (
          <select class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none">
            <option>{f}</option>
          </select>
        ))}
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table class="w-full text-sm">
          <thead class="border-b border-slate-100">
            <tr>
              {['', 'USER', 'ROLE', 'BERGABUNG', 'AKTIVITAS', 'LOKASI', 'STATUS', 'AKSI'].map((h) => (
                <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <For each={DATA}>
              {(row) => (
                <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td class="pl-4 py-3"><input type="checkbox" class="size-3.5 accent-primary" /></td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2.5">
                      <Avatar name={row.nama} size="sm" />
                      <div>
                        <p class="font-medium text-ink">{row.nama}</p>
                        <p class="text-[10px] text-slate-400">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3"><Badge variant={row.role === 'Owner' ? 'navy' : 'default'}>{row.role}</Badge></td>
                  <td class="px-4 py-3 text-slate-500">{row.bergabung}</td>
                  <td class="px-4 py-3 text-slate-500">{row.aktivitas}</td>
                  <td class="px-4 py-3 text-slate-500">{row.lokasi}</td>
                  <td class="px-4 py-3"><StatusBadge variant={STATUS_VARIANT[row.status]}>{row.status}</StatusBadge></td>
                  <td class="px-4 py-3">
                    <div class="flex gap-1.5">
                      <button type="button" class="text-xs font-medium text-primary hover:underline">Lihat</button>
                      {row.status === 'Aktif' && <button type="button" class="text-xs font-medium text-warn hover:underline">Suspend</button>}
                      {row.status !== 'Banned' && <button type="button" class="text-xs font-medium text-danger hover:underline">Ban</button>}
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <div class="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          Menampilkan 1–12 dari 12.793 akun
        </div>
      </div>
    </AdminLayout>
  );
}
