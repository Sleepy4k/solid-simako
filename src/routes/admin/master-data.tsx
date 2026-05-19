import { createSignal, For, Show } from 'solid-js';
import { Plus, Pencil, Trash2 } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Tabs } from '~/components/ui/Tabs';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import { PageHeader } from '~/components/shared/PageHeader';

const KAMPUS = [
  { id: 1, nama: 'Universitas Gadjah Mada', kota: 'Yogyakarta', alias: 'UGM', properti: 142 },
  { id: 2, nama: 'Universitas Negeri Yogyakarta', kota: 'Yogyakarta', alias: 'UNY', properti: 87 },
  { id: 3, nama: 'Universitas Diponegoro', kota: 'Semarang', alias: 'UNDIP', properti: 63 },
  { id: 4, nama: 'Institut Teknologi Bandung', kota: 'Bandung', alias: 'ITB', properti: 54 },
  { id: 5, nama: 'Universitas Jenderal Soedirman', kota: 'Purwokerto', alias: 'UNSOED', properti: 48 },
];

const BANK = [
  { id: 1, nama: 'Bank Central Asia', kode: 'BCA', logo: 'BCA' },
  { id: 2, nama: 'Bank Rakyat Indonesia', kode: 'BRI', logo: 'BRI' },
  { id: 3, nama: 'Bank Negara Indonesia', kode: 'BNI', logo: 'BNI' },
  { id: 4, nama: 'Bank Mandiri', kode: 'Mandiri', logo: 'MDR' },
  { id: 5, nama: 'Bank Syariah Indonesia', kode: 'BSI', logo: 'BSI' },
];

const FASILITAS = [
  { id: 1, nama: 'WiFi', kategori: 'Umum', ikon: '📶', properti: 1187 },
  { id: 2, nama: 'AC', kategori: 'Kamar', ikon: '❄️', properti: 832 },
  { id: 3, nama: 'Kamar Mandi Dalam', kategori: 'Kamar', ikon: '🚿', properti: 756 },
  { id: 4, nama: 'Parkir Motor', kategori: 'Umum', ikon: '🛵', properti: 1102 },
  { id: 5, nama: 'Dapur Bersama', kategori: 'Umum', ikon: '🍳', properti: 689 },
  { id: 6, nama: 'Laundry', kategori: 'Layanan', ikon: '👕', properti: 421 },
];

export default function MasterDataPage() {
  const [tab, setTab] = createSignal('kampus');
  const [showModal, setShowModal] = createSignal(false);

  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Master Data" noIndex />

      <PageHeader
        title="Master Data"
        description="Kelola data referensi platform"
        action={
          <Button size="sm" class="gap-1.5" onClick={() => setShowModal(true)}>
            <Plus class="size-4" /> Tambah Data
          </Button>
        }
        class="mb-4"
      />

      <Tabs
        items={[
          { id: 'kampus', label: 'Kampus', badge: KAMPUS.length },
          { id: 'bank', label: 'Bank', badge: BANK.length },
          { id: 'fasilitas', label: 'Fasilitas', badge: FASILITAS.length },
        ]}
        onChange={setTab}
        class="mb-4"
      />

      {/* Kampus */}
      <Show when={tab() === 'kampus'}>
        <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-100">
              <tr>
                {['#', 'NAMA KAMPUS', 'ALIAS', 'KOTA', 'PROPERTI', 'AKSI'].map((h) => (
                  <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <For each={KAMPUS}>
                {(k) => (
                  <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td class="px-4 py-3 font-mono text-xs text-slate-400">{k.id}</td>
                    <td class="px-4 py-3 font-medium text-ink">{k.nama}</td>
                    <td class="px-4 py-3"><Badge variant="navy">{k.alias}</Badge></td>
                    <td class="px-4 py-3 text-slate-500">{k.kota}</td>
                    <td class="px-4 py-3 text-slate-500">{k.properti} properti</td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2">
                        <button type="button" class="text-primary hover:text-primary-2"><Pencil class="size-3.5" /></button>
                        <button type="button" class="text-danger hover:text-danger/70"><Trash2 class="size-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>

      {/* Bank */}
      <Show when={tab() === 'bank'}>
        <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-100">
              <tr>
                {['#', 'NAMA BANK', 'KODE', 'AKSI'].map((h) => (
                  <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <For each={BANK}>
                {(b) => (
                  <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td class="px-4 py-3 font-mono text-xs text-slate-400">{b.id}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2.5">
                        <div class="flex size-8 items-center justify-center rounded-lg bg-slate-100 font-mono text-[10px] font-bold text-slate-500">{b.logo}</div>
                        <span class="font-medium text-ink">{b.nama}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3"><Badge variant="default">{b.kode}</Badge></td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2">
                        <button type="button" class="text-primary hover:text-primary-2"><Pencil class="size-3.5" /></button>
                        <button type="button" class="text-danger hover:text-danger/70"><Trash2 class="size-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>

      {/* Fasilitas */}
      <Show when={tab() === 'fasilitas'}>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <For each={FASILITAS}>
            {(f) => (
              <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                <div class="flex items-center gap-3">
                  <span class="text-xl">{f.ikon}</span>
                  <div>
                    <p class="font-medium text-ink">{f.nama}</p>
                    <p class="text-[10px] text-slate-400">{f.properti} properti · {f.kategori}</p>
                  </div>
                </div>
                <div class="flex gap-1.5">
                  <button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary"><Pencil class="size-3.5" /></button>
                  <button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-danger"><Trash2 class="size-3.5" /></button>
                </div>
              </div>
            )}
          </For>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400 transition hover:border-primary hover:text-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus class="size-4" /> Tambah fasilitas
          </button>
        </div>
      </Show>

      {/* Modal Tambah */}
      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Tambah Data Baru">
        <div class="space-y-3">
          <Input label="Nama" placeholder="Masukkan nama..." />
          <Show when={tab() === 'kampus'}>
            <Input label="Alias / Singkatan" placeholder="Contoh: UGM" />
            <Input label="Kota" placeholder="Contoh: Yogyakarta" />
          </Show>
          <Show when={tab() === 'bank'}>
            <Input label="Kode Bank" placeholder="Contoh: BCA" />
          </Show>
          <Show when={tab() === 'fasilitas'}>
            <Input label="Ikon (emoji)" placeholder="Contoh: 📶" />
            <Input label="Kategori" placeholder="Contoh: Kamar, Umum, Layanan" />
          </Show>
          <div class="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={() => setShowModal(false)}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
