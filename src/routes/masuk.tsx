import { A } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { Eye, EyeOff, Mail, Lock } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Checkbox } from '~/components/ui/Checkbox';
import { ROUTES } from '~/constants/routes';

export default function MasukPage() {
  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [ingat, setIngat] = createSignal(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <AuthLayout>
      <SEO title="Masuk" noIndex />

      <h1 class="mb-1 text-2xl font-bold text-ink">Masuk ke akun</h1>
      <p class="mb-6 text-sm text-slate-500">Lanjutkan urusan kostmu — gratis untuk pencari kost.</p>

      {/* Social login */}
      <div class="mb-5 grid grid-cols-2 gap-3">
        {[
          { label: 'Google', icon: 'G', bg: 'hover:bg-slate-50' },
          { label: 'Facebook', icon: 'f', bg: 'hover:bg-blue-50' },
        ].map((s) => (
          <button
            type="button"
            class={`flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition ${s.bg}`}
          >
            <span class="font-bold">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div class="mb-5 flex items-center gap-3">
        <hr class="flex-1 border-slate-200" />
        <span class="text-xs text-slate-400">atau dengan email</span>
        <hr class="flex-1 border-slate-200" />
      </div>

      <form onSubmit={handleSubmit} class="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="dewi.ananda@gmail.com"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          prefix={<Mail class="size-4" />}
          required
        />

        <div class="relative">
          <Input
            label="Kata sandi"
            type={showPassword() ? 'text' : 'password'}
            placeholder="••••••••"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
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

        <Button type="submit" fullWidth size="lg" loading={loading()}>
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
