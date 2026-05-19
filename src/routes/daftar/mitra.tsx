import { A } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { ArrowLeft, Building2 } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Select } from '~/components/ui/Select';
import { Button } from '~/components/ui/Button';
import { Checkbox } from '~/components/ui/Checkbox';
import { ROUTES } from '~/constants/routes';

export default function DaftarMitraPage() {
  const [loading, setLoading] = createSignal(false);
  const [setuju, setSetuju] = createSignal(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <AuthLayout
      subline="Daftar gratis dalam 5 menit. Tim verifikasi kami akan review dokumenmu dalam 1×24 jam, lalu listing kostmu siap online."
    >
      <SEO title="Daftar Mitra Owner" noIndex />

      <A
        href={ROUTES.DAFTAR}
        class="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary"
      >
        <ArrowLeft class="size-3.5" /> Kembali ke pilihan peran
      </A>

      <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
        <Building2 class="size-3.5" /> Daftar sebagai Mitra Owner
      </div>

      <h1 class="mb-1 text-2xl font-bold text-ink">Buat akun Mitra Owner</h1>
      <p class="mb-6 text-sm text-slate-500">Gratis selamanya. Tanpa biaya komisi per transaksi.</p>

      <form onSubmit={handleSubmit} class="space-y-4">
        <Input label="Nama lengkap (sesuai KTP)" placeholder="Slamet Riyadi" required />

        <div class="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" placeholder="slamet.riyadi@gmail.com" required />
          <div class="flex gap-2">
            <Input label="Nomor HP / WA" type="tel" placeholder="812 8855 1010" prefix={<span class="text-sm text-slate-500">+62</span>} required />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <Select label="Kota properti" required>
            <option value="purwokerto">Purwokerto</option>
            <option value="banyumas">Banyumas</option>
          </Select>
          <Select label="Jumlah properti" required>
            <option value="1">1 properti</option>
            <option value="2-5">2–5 properti</option>
            <option value="6+">6+ properti</option>
          </Select>
        </div>

        <Input
          label="Kata sandi"
          type="password"
          placeholder="••••••••"
          hint="Min. 8 karakter, kombinasi huruf & angka."
          required
        />

        {/* Info KYC */}
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p class="mb-2 font-semibold">Yang akan kamu siapkan di langkah berikutnya</p>
          <ul class="space-y-1 text-xs">
            {['Foto KTP & selfie memegang KTP', 'Nomor rekening bank atas nama sama dgn KTP', 'Foto properti & detail kamar yang dijual'].map((item) => (
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 text-amber-600">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <Checkbox
          label={
            <span>
              Saya menyetujui{' '}
              <A href="#" class="text-primary hover:underline">Perjanjian Mitra Owner</A>
              {' '}dan paham bahwa pembayaran terjadi langsung antara saya dan penyewa.
            </span>
          }
          checked={setuju()}
          onChange={(e) => setSetuju(e.currentTarget.checked)}
          required
        />

        <Button type="submit" fullWidth size="lg" loading={loading()} disabled={!setuju()}>
          Lanjut ke verifikasi KYC →
        </Button>
      </form>

      <p class="mt-4 text-center text-sm text-slate-500">
        Bukan owner?{' '}
        <A href={ROUTES.DAFTAR} class="font-semibold text-primary hover:underline">
          Daftar sebagai pencari kost
        </A>
      </p>
    </AuthLayout>
  );
}
