import { A, useSubmission } from '@solidjs/router';
import { createSignal, For, Show } from 'solid-js';
import { ArrowLeft, Building2 } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Select } from '~/components/ui/Select';
import { Button } from '~/components/ui/Button';
import { Checkbox } from '~/components/ui/Checkbox';
import { ROUTES } from '~/constants/routes';
import { registerOwnerAction } from '~/server/actions/auth';

export default function DaftarMitraPage() {
  const [setuju, setSetuju] = createSignal(false);
  const sub = useSubmission(registerOwnerAction);
  const fields = () => (sub.result && 'fields' in sub.result ? sub.result.fields : undefined);

  return (
    <AuthLayout subline="Daftar gratis dalam 5 menit. Tim verifikasi kami akan review dokumenmu dalam 1×24 jam, lalu listing kostmu siap online.">
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
      <p class="mb-6 text-sm text-slate-500">
        Gratis selamanya. Tanpa biaya komisi per transaksi.
      </p>

      <form action={registerOwnerAction} method="post" class="space-y-4">
        <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
          <div class="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            {sub.result && 'message' in sub.result ? sub.result.message : 'Pendaftaran gagal'}
          </div>
        </Show>

        <Input
          name="namaLengkap"
          label="Nama lengkap (sesuai KTP)"
          placeholder="Slamet Riyadi"
          error={fields()?.namaLengkap}
          required
        />

        <div class="grid gap-4 sm:grid-cols-2">
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="slamet.riyadi@gmail.com"
            error={fields()?.email}
            required
          />
          <Input
            name="telepon"
            label="Nomor HP / WA"
            type="tel"
            placeholder="0812 8855 1010"
            error={fields()?.telepon}
            required
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <Input
            name="namaUsaha"
            label="Nama usaha (opsional)"
            placeholder="Kost Pak Slamet"
          />
          <Select name="kota" label="Kota operasi" required>
            <option value="Purwokerto">Purwokerto</option>
            <option value="Banyumas">Banyumas</option>
            <option value="Yogyakarta">Yogyakarta</option>
            <option value="Semarang">Semarang</option>
          </Select>
        </div>

        <Input
          name="password"
          label="Kata sandi"
          type="password"
          placeholder="Minimal 8 karakter"
          hint="Kombinasi huruf besar/kecil dan angka."
          error={fields()?.password}
          required
        />

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p class="mb-2 font-semibold">Yang akan kamu siapkan di langkah berikutnya</p>
          <ul class="space-y-1 text-xs">
            <For each={[
              'Foto KTP & selfie memegang KTP',
              'Nomor rekening bank atas nama sama dengan KTP',
              'Foto properti & detail kamar yang dijual',
            ]}>
              {(item) => (
                <li class="flex items-start gap-1.5">
                  <span class="mt-0.5 text-amber-600">•</span> {item}
                </li>
              )}
            </For>
          </ul>
        </div>

        <Checkbox
          label={
            <span>
              Saya menyetujui{' '}
              <A href={ROUTES.SYARAT} class="text-primary hover:underline">
                Perjanjian Mitra Owner
              </A>{' '}
              dan paham bahwa pembayaran terjadi langsung antara saya dan penyewa.
            </span>
          }
          checked={setuju()}
          onChange={(e) => setSetuju(e.currentTarget.checked)}
          required
        />

        <Button type="submit" fullWidth size="lg" loading={sub.pending} disabled={!setuju()}>
          Lanjut ke verifikasi KYC →
        </Button>
      </form>

      <p class="mt-4 text-center text-sm text-slate-500">
        Bukan owner?{' '}
        <A href={ROUTES.DAFTAR_PENYEWA} class="font-semibold text-primary hover:underline">
          Daftar sebagai pencari kost
        </A>
      </p>
    </AuthLayout>
  );
}
