import { createSignal } from 'solid-js';
import { Camera, Building2, CreditCard } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Avatar } from '~/components/ui/Avatar';
import { Card } from '~/components/ui/Card';
import { PageHeader } from '~/components/shared/PageHeader';

export default function ProfilMitraPage() {
  const [loading, setLoading] = createSignal(false);

  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Profil Owner" noIndex />

      <PageHeader title="Profil Owner" description="Informasi akun dan verifikasi identitas" class="mb-6" />

      <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Avatar card */}
        <div class="flex flex-col gap-4">
          <Card class="flex flex-col items-center gap-3 py-6 text-center">
            <div class="relative">
              <Avatar name="Pak Slamet" size="xl" />
              <button
                type="button"
                class="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-2"
              >
                <Camera class="size-3.5" />
              </button>
            </div>
            <div>
              <p class="text-sm font-bold text-ink">Pak Slamet Riyadi</p>
              <p class="text-xs text-slate-500">slamet.riyadi@gmail.com</p>
              <div class="mt-2 flex justify-center gap-1.5">
                <Badge variant="lunas">KYC Disetujui</Badge>
                <Badge variant="info">3 Properti</Badge>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Status KYC</p>
            <div class="space-y-2">
              {[{ label: 'KTP', status: 'Disetujui' }, { label: 'Selfie KTP', status: 'Disetujui' }, { label: 'NPWP', status: 'Opsional' }].map((d) => (
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600">{d.label}</span>
                  <Badge variant={d.status === 'Disetujui' ? 'lunas' : 'default'} class="text-[9px]">{d.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Form */}
        <div class="space-y-4">
          <Card>
            <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
              <Building2 class="size-4 text-primary" /> Informasi Usaha
            </h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Nama lengkap (KTP)" defaultValue="Slamet Riyadi" />
              <Input label="Nama usaha (opsional)" defaultValue="Kost Pak Slamet" />
              <Input label="Email" type="email" defaultValue="slamet.riyadi@gmail.com" />
              <Input label="Nomor HP / WA" defaultValue="0812 8855 1010" />
              <Input label="Kota operasi" defaultValue="Purwokerto" wrapperClass="sm:col-span-2" />
            </div>
          </Card>

          <Card>
            <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
              <CreditCard class="size-4 text-primary" /> Rekening Bank
            </h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Nama bank" defaultValue="BCA" />
              <Input label="Nomor rekening" defaultValue="2810 4477 91" />
              <Input label="Nama pemilik rekening" defaultValue="Slamet Riyadi" wrapperClass="sm:col-span-2" />
            </div>
            <p class="mt-2 text-xs text-slate-500">
              Pastikan nama rekening sesuai KTP. Perubahan rekening memerlukan re-verifikasi.
            </p>
          </Card>

          <div class="flex justify-end gap-2">
            <Button variant="secondary">Batal</Button>
            <Button loading={loading()} onClick={() => setLoading(true)}>Simpan Perubahan</Button>
          </div>
        </div>
      </div>
    </MitraLayout>
  );
}
