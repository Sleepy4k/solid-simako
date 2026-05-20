import { A, useSubmission } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { Eye, EyeOff, Mail, Lock } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Checkbox } from '~/components/ui/Checkbox';
import { ROUTES } from '~/constants/routes';
import { loginAction } from '~/server/actions/auth';

export default function MasukPage() {
  const [showPassword, setShowPassword] = createSignal(false);
  const [ingat, setIngat] = createSignal(false);
  const sub = useSubmission(loginAction);

  return (
    <AuthLayout>
      <SEO title="Masuk" noIndex />

      <h1 class="mb-1 text-2xl font-bold text-ink">Masuk ke akun</h1>
      <p class="mb-6 text-sm text-slate-500">
        Lanjutkan urusan kostmu — gratis untuk pencari kost.
      </p>

      <form action={loginAction} method="post" class="space-y-4">
        <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
          <div class="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            {sub.result && 'message' in sub.result ? sub.result.message : 'Login gagal'}
          </div>
        </Show>

        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="dewi.ananda@gmail.com"
          prefix={<Mail class="size-4" />}
          required
        />

        <div class="relative">
          <Input
            name="password"
            label="Kata sandi"
            type={showPassword() ? 'text' : 'password'}
            placeholder="••••••••"
            prefix={<Lock class="size-4" />}
            required
          />
          <A
            href={ROUTES.LUPA_SANDI}
            class="absolute right-0 top-0 text-xs font-medium text-primary hover:underline"
          >
            Lupa sandi?
          </A>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            class="absolute bottom-2.5 right-3 text-slate-400 hover:text-ink"
          >
            {showPassword() ? <EyeOff class="size-4" /> : <Eye class="size-4" />}
          </button>
        </div>

        <Checkbox
          label="Ingat saya di perangkat ini"
          checked={ingat()}
          onChange={(e) => setIngat(e.currentTarget.checked)}
        />

        <Button type="submit" fullWidth size="lg" loading={sub.pending}>
          Masuk
        </Button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-500">
        Belum punya akun?{' '}
        <A href={ROUTES.DAFTAR} class="font-semibold text-primary hover:underline">
          Daftar gratis
        </A>
      </p>
    </AuthLayout>
  );
}
