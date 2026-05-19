import { createSignal, For, Show } from 'solid-js';
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';
import { Modal } from '~/components/ui/Modal';
import { PageHeader } from '~/components/shared/PageHeader';

interface FaqItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
  kategori: 'Penyewa' | 'Owner' | 'Umum' | 'Pembayaran';
  urutan: number;
  aktif: boolean;
}

const FAQS: FaqItem[] = [
  { id: 1, pertanyaan: 'Bagaimana cara memesan kost melalui SIMAKO?', jawaban: 'Cari kost yang sesuai, klik tombol Pesan, isi data diri dan durasi sewa, lalu lakukan pembayaran melalui transfer bank sesuai instruksi.', kategori: 'Penyewa', urutan: 1, aktif: true },
  { id: 2, pertanyaan: 'Apakah ada biaya platform yang dikenakan?', jawaban: 'SIMAKO tidak mengenakan biaya platform kepada penyewa. Biaya yang dibayarkan adalah harga sewa sesuai yang tertera di listing.', kategori: 'Penyewa', urutan: 2, aktif: true },
  { id: 3, pertanyaan: 'Bagaimana proses verifikasi KYC untuk owner?', jawaban: 'Owner perlu mengunggah foto KTP, selfie sambil memegang KTP, dan NPWP (opsional). Tim kami akan memverifikasi dalam 1×24 jam kerja.', kategori: 'Owner', urutan: 1, aktif: true },
  { id: 4, pertanyaan: 'Berapa lama proses konfirmasi pembayaran?', jawaban: 'Setelah transfer, unggah bukti pembayaran di halaman transaksi. Owner akan mengkonfirmasi dalam 1×24 jam. Jika tidak dikonfirmasi, hubungi dukungan kami.', kategori: 'Pembayaran', urutan: 1, aktif: true },
  { id: 5, pertanyaan: 'Apa yang harus dilakukan jika ada masalah dengan kost?', jawaban: 'Gunakan fitur Keluhan di dashboard untuk melaporkan masalah. Tim mediasi kami akan membantu menyelesaikan perselisihan dalam 3 hari kerja.', kategori: 'Umum', urutan: 1, aktif: false },
];

const KATEGORI_VARIANT: Record<string, 'navy' | 'info' | 'default' | 'lunas'> = {
  Penyewa: 'info',
  Owner: 'navy',
  Umum: 'default',
  Pembayaran: 'lunas',
};

export default function FaqPage() {
  const [openId, setOpenId] = createSignal<number | null>(1);
  const [showModal, setShowModal] = createSignal(false);
  const [filterKat, setFilterKat] = createSignal('Semua');

  const filtered = () => filterKat() === 'Semua' ? FAQS : FAQS.filter((f) => f.kategori === filterKat());

  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="FAQ" noIndex />

      <PageHeader
        title="FAQ"
        description="Kelola pertanyaan yang sering diajukan"
        action={
          <Button size="sm" class="gap-1.5" onClick={() => setShowModal(true)}>
            <Plus class="size-4" /> Tambah FAQ
          </Button>
        }
        class="mb-4"
      />

      {/* Filter tabs */}
      <div class="mb-4 flex flex-wrap gap-2">
        {['Semua', 'Penyewa', 'Owner', 'Pembayaran', 'Umum'].map((k) => (
          <button
            type="button"
            class={[
              'rounded-full px-3 py-1.5 text-xs font-medium transition',
              filterKat() === k ? 'bg-primary text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-primary hover:text-primary',
            ].join(' ')}
            onClick={() => setFilterKat(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div class="space-y-2">
        <For each={filtered()}>
          {(faq) => (
            <div class={`overflow-hidden rounded-2xl border bg-white transition ${faq.aktif ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}>
              <button
                type="button"
                class="flex w-full items-center justify-between px-4 py-3 text-left"
                onClick={() => setOpenId(openId() === faq.id ? null : faq.id)}
              >
                <div class="flex items-center gap-2.5">
                  <Badge variant={KATEGORI_VARIANT[faq.kategori]} class="text-[9px]">{faq.kategori}</Badge>
                  <span class="text-sm font-medium text-ink">{faq.pertanyaan}</span>
                  {!faq.aktif && <Badge variant="default" class="text-[9px]">Nonaktif</Badge>}
                </div>
                <ChevronDown class={`size-4 flex-shrink-0 text-slate-400 transition-transform ${openId() === faq.id ? 'rotate-180' : ''}`} />
              </button>
              <Show when={openId() === faq.id}>
                <div class="border-t border-slate-100 px-4 pb-4 pt-3">
                  <p class="text-sm leading-relaxed text-slate-600">{faq.jawaban}</p>
                  <div class="mt-3 flex items-center justify-between">
                    <span class="text-[10px] text-slate-400">Urutan: {faq.urutan}</span>
                    <div class="flex gap-2">
                      <button type="button" class="flex items-center gap-1 text-xs text-primary hover:underline"><Pencil class="size-3" /> Edit</button>
                      <button type="button" class="flex items-center gap-1 text-xs text-danger hover:underline"><Trash2 class="size-3" /> Hapus</button>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>

      {/* Modal */}
      <Modal open={showModal()} onClose={() => setShowModal(false)} title="Tambah FAQ">
        <div class="space-y-3">
          <Input label="Pertanyaan" placeholder="Masukkan pertanyaan..." />
          <Textarea label="Jawaban" placeholder="Masukkan jawaban lengkap..." rows={4} />
          <div>
            <label class="mb-1 block text-xs font-medium text-ink">Kategori</label>
            <select class="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none">
              <option>Penyewa</option>
              <option>Owner</option>
              <option>Pembayaran</option>
              <option>Umum</option>
            </select>
          </div>
          <Input label="Urutan Tampil" type="number" placeholder="Contoh: 1" />
          <div class="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={() => setShowModal(false)}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
