import { createSignal } from 'solid-js';
import { Camera } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Avatar } from '~/components/ui/Avatar';
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';

export default function ProfilPenyewaPage() {
  const [loading, setLoading] = createSignal(false);

  return (
    <TenantLayout userName="Dewi Ananda">
      <SEO title="Profil Saya" noIndex />

      <h1 class="mb-6 text-xl font-bold text-ink">Profil Saya</h1>

      <div class="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Avatar card */}
        <Card class="flex flex-col items-center gap-3 py-6 text-center">
          <div class="relative">
            <Avatar name="Dewi Ananda" size="xl" />
            <button
              type="button"
              class="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-2"
            >
              <Camera class="size-3.5" />
            </button>
          </div>
          <div>
            <p class="text-sm font-bold text-ink">Dewi Ananda</p>
            <p class="text-xs text-slate-500">dewi.ag@mail.com</p>
            <div class="mt-2">
              <Badge variant="lunas">Terverifikasi</Badge>
            </div>
          </div>
          <div class="w-full border-t border-slate-100 pt-3">
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">Member sejak</span>
                <span class="font-medium text-ink">12 Sep 2025</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Total sewa</span>
                <span class="font-medium text-ink">4 transaksi</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Form */}
        <div class="space-y-4">
          <Card>
            <h2 class="mb-4 text-sm font-bold text-ink">Informasi Pribadi</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Nama lengkap" defaultValue="Dewi Ananda" />
              <Input label="Nomor HP / WA" defaultValue="0812 9988 7766" />
              <Input label="Email" type="email" defaultValue="dewi.ag@mail.com" />
              <Input label="Tanggal lahir" type="date" defaultValue="1999-04-15" />
              <Input label="Kampus / Instansi" defaultValue="Universitas Gadjah Mada" wrapperClass="sm:col-span-2" />
              <Input label="Kota asal" defaultValue="Semarang" />
              <Input label="Kota domisili" defaultValue="Yogyakarta" />
            </div>
          </Card>

          <Card>
            <h2 class="mb-4 text-sm font-bold text-ink">Kontak Darurat</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Nama kontak darurat" defaultValue="Bu Sri Ananda" />
              <Input label="Hubungan" defaultValue="Ibu kandung" />
              <Input label="Nomor HP kontak darurat" defaultValue="0821 5566 7788" wrapperClass="sm:col-span-2" />
            </div>
          </Card>

          <div class="flex justify-end gap-2">
            <Button variant="secondary">Batal</Button>
            <Button loading={loading()} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}
