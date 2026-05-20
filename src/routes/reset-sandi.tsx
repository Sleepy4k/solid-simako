import { A, useSearchParams, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import { Lock, ArrowLeft } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';
import { resetPasswordAction } from '~/server/actions/auth';

export default function ResetSandiPage() {
  const [params] = useSearchParams();
  const sub = useSubmission(resetPasswordAction);
  const token = () => (typeof params.token === 'string' ? params.token : '');

  return (
    <AuthLayout>
      <SEO title="Reset Kata Sandi" noIndex />

      <A
        href={ROUTES.MASUK}
        class="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary"
      >
        <ArrowLeft class="size-3.5" /> Kembali
      </A>

      <h1 class="mb-1 text-2xl font-bold text-ink">Reset kata sandi</h1>
      <p class="mb-6 text-sm text-slate-500">
        Buat kata sandi baru untuk akunmu. Minimal 8 karakter.
      </p>

      <Show
        when={token()}
        fallback={
          <div class="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            Token reset tidak ditemukan di URL. Silakan minta tautan baru di halaman lupa sandi.
          </div>
        }
      >
        <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
          <div class="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            {sub.result && 'message' in sub.result ? sub.result.message : 'Reset gagal'}
          </div>
        </Show>

        <form action={resetPasswordAction} method="post" class="space-y-4">
          <input type="hidden" name="token" value={token()} />
          <Input
            name="password"
            label="Kata sandi baru"
            type="password"
            placeholder="Minimal 8 karakter"
            prefix={<Lock class="size-4" />}
            required
          />
          <Button type="submit" fullWidth size="lg" loading={sub.pending}>
            Simpan kata sandi baru
          </Button>
        </form>
      </Show>
    </AuthLayout>
  );
}
