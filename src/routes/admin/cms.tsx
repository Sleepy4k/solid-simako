import { createSignal, For, Show } from 'solid-js';
import { Plus, Pencil, Trash2, Eye, EyeOff, Image } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge, StatusBadge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import { PageHeader } from '~/components/shared/PageHeader';

interface Banner {
  id: string;
  judul: string;
  target: string;
  mulai: string;
  selesai: string;
  status: 'Aktif' | 'Dijadwalkan' | 'Nonaktif';
  klik: number;
}

const BANNERS: Banner[] = [
  { id: 'BNR-001', judul: 'Promo Ramadan 2026', target: 'Semua', mulai: '01 Mar 26', selesai: '30 Mar 26', status: 'Nonaktif', klik: 2841 },
  { id: 'BNR-002', judul: 'Kost Baru Yogyakarta', target: 'User', mulai: '01 Mei 26', selesai: '31 Mei 26', status: 'Nonaktif', klik: 1523 },
  { id: 'BNR-003', judul: 'Daftar Jadi Owner', target: 'User', mulai: '01 Jun 26', selesai: '30 Jun 26', status: 'Aktif', klik: 342 },
  { id: 'BNR-004', judul: 'Promo Semester Baru', target: 'Semua', mulai: '01 Jul 26', selesai: '31 Jul 26', status: 'Dijadwalkan', klik: 0 },
];

const STATUS_VARIANT: Record<string, 'lunas' | 'menunggu' | 'dibatalkan'> = {
  Aktif: 'lunas',
  Dijadwalkan: 'menunggu',
  Nonaktif: 'dibatalkan',
};

export default function CmsPage() {
  const [tab, setTab] = createSignal('banner');
  const [showModal, setShowModal] = createSignal(false);

  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="CMS & Banner" noIndex />

      <PageHeader
        title="CMS & Banner"
        description="Kelola konten dan banner promosi platform"
        action={
          <Button size="sm" class="gap-1.5" onClick={() => setShowModal(true)}>
            <Plus class="size-4" /> Buat Banner
          </Button>
        }
        class="mb-4"
      />

      <Tabs
        items={[
          { id: 'banner', label: 'Banner', badge: BANNERS.length },
          { id: 'hero', label: 'Hero Text', badge: 1 },
        ]}
        onChange={setTab}
        class="mb-4"
      />

      <Show when={tab() === 'banner'}>
        {/* Banner grid preview */}
        <div class="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <For each={BANNERS}>
            {(b) => (
              <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div class="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-primary/20 to-navy/20">
                  <Image class="size-8 text-slate-300" />
                </div>
                <div class="p-3">
                  <p class="text-xs font-semibold text-ink">{b.judul}</p>
                  <div class="mt-1.5 flex items-center justify-between">
                    <StatusBadge variant={STATUS_VARIANT[b.status]}>{b.status}</StatusBadge>
                    <span class="text-[10px] text-slate-400">{b.klik} klik</span>
                  </div>
                  <div class="mt-2 flex gap-1">
                    <button type="button" class="flex-1 rounded-lg border border-slate-100 py-1 text-center text-[10px] text-primary hover:bg-primary-light/20"><Pencil class="inline size-2.5" /> Edit</button>
                    {b.status === 'Aktif'
                      ? <button type="button" class="rounded-lg border border-slate-100 px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-50"><EyeOff class="size-2.5" /></button>
                      : <button type="button" class="rounded-lg border border-slate-100 px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-50"><Eye class="size-2.5" /></button>
                    }
                    <button type="button" class="rounded-lg border border-slate-100 px-2 py-1 text-[10px] text-danger hover:bg-red-50"><Trash2 class="size-2.5" /></button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Banner table */}
        <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-100">
              <tr>
                <For each={['ID', 'JUDUL', 'TARGET', 'PERIODE', 'KLIK', 'STATUS', 'AKSI']}>
                  {(h) => (
                    <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={BANNERS}>
                {(b) => (
                  <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td class="px-4 py-3 font-mono text-xs text-slate-400">{b.id}</td>
                    <td class="px-4 py-3 font-medium text-ink">{b.judul}</td>
                    <td class="px-4 py-3"><Badge variant="default">{b.target}</Badge></td>
                    <td class="px-4 py-3 text-xs text-slate-500">{b.mulai} – {b.selesai}</td>
                    <td class="px-4 py-3 text-slate-500">{b.klik.toLocaleString('id')}</td>
                    <td class="px-4 py-3"><StatusBadge variant={STATUS_VARIANT[b.status]}>{b.status}</StatusBadge></td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1.5">
                        <button type="button" class="text-xs font-medium text-primary hover:underline">Edit</button>
                        <button type="button" class="text-xs font-medium text-danger hover:underline">Hapus</button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>

      <Show when={tab() === 'hero'}>
        <div class="max-w-xl rounded-2xl border border-slate-100 bg-white p-6">
          <h2 class="mb-4 text-sm font-bold text-ink">Teks Hero Halaman Utama</h2>
          <div class="space-y-3">
            <Input label="Judul Utama" defaultValue="Temukan Kost Terbaik di Purwokerto" />
            <Input label="Subjudul" defaultValue="Ribuan pilihan kost verifikasi, booking mudah, bayar aman." />
            <Input label="Label Tombol CTA" defaultValue="Cari Kost Sekarang" />
            <div class="flex justify-end gap-2 pt-2">
              <Button variant="secondary">Reset</Button>
              <Button>Simpan</Button>
            </div>
          </div>
        </div>
      </Show>

      {/* Modal buat banner */}
      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Buat Banner Baru">
        <div class="space-y-3">
          <Input label="Judul Banner" placeholder="Contoh: Promo Lebaran 2026" />
          <div>
            <label class="mb-1 block text-xs font-medium text-ink">Target Pengguna</label>
            <select class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none">
              <option>Semua</option>
              <option>User</option>
              <option>Owner</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <Input label="Tanggal Mulai" type="date" />
            <Input label="Tanggal Selesai" type="date" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-ink">Gambar Banner</label>
            <div class="flex aspect-[16/7] items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
              <div class="text-center">
                <Image class="mx-auto size-8 text-slate-300" />
                <p class="mt-1 text-xs text-slate-400">Klik untuk unggah gambar</p>
                <p class="text-[10px] text-slate-300">PNG, JPG — maks. 2MB</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={() => setShowModal(false)}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
