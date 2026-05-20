import { A, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import { Mail, Lock, User, Phone } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';
import { registerUserAction } from '~/server/actions/auth';

export default function DaftarPenyewaPage() {
  const sub = useSubmission(registerUserAction);
  const fields = () => (sub.result && 'fields' in sub.result ? sub.result.fields : undefined);

  return (
    <AuthLayout headline="Cari kost mudah, hanya di Simako.">
      <SEO title="Daftar sebagai Pencari Kost" noIndex />

      <h1 class="mb-1 text-2xl font-bold text-ink">Daftar sebagai Pencari Kost</h1>
      <p class="mb-6 text-sm text-slate-500">Gratis selamanya. Tidak ada biaya tersembunyi.</p>

      <form action={registerUserAction} method="post" class="space-y-4">
        <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
          <div class="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            {sub.result && 'message' in sub.result ? sub.result.message : 'Pendaftaran gagal'}
          </div>
        </Show>

        <Input
          name="namaLengkap"
          label="Nama lengkap"
          placeholder="Dewi Ananda"
          prefix={<User class="size-4" />}
          error={fields()?.namaLengkap}
          required
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="dewi@gmail.com"
          prefix={<Mail class="size-4" />}
          error={fields()?.email}
          required
        />
        <Input
          name="telepon"
          label="Nomor HP / WhatsApp"
          placeholder="0812 3456 7890"
          prefix={<Phone class="size-4" />}
          error={fields()?.telepon}
          required
        />
        <Input
          name="password"
          type="password"
          label="Kata sandi"
          placeholder="Minimal 8 karakter"
          prefix={<Lock class="size-4" />}
          error={fields()?.password}
          hint="Gunakan kombinasi huruf besar/kecil dan angka."
          required
        />

        <p class="text-xs text-slate-500">
          Dengan mendaftar, kamu menyetujui{' '}
          <A href={ROUTES.SYARAT} class="text-primary hover:underline">
            Syarat & Ketentuan
          </A>{' '}
          dan{' '}
          <A href={ROUTES.PRIVASI} class="text-primary hover:underline">
            Kebijakan Privasi
          </A>{' '}
          kami.
        </p>

        <Button type="submit" fullWidth size="lg" loading={sub.pending}>
          Daftar Sekarang
        </Button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-500">
        Sudah punya akun?{' '}
        <A href={ROUTES.MASUK} class="font-semibold text-primary hover:underline">
          Masuk
        </A>
      </p>
    </AuthLayout>
  );
}
